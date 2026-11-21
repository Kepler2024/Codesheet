#!/usr/bin/env python3
"""Execute Codesheet markdown examples and check their => output comments."""
import argparse
from dataclasses import dataclass, field
from pathlib import Path
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from tools.core import LANGUAGES, Issue, compare_output, expected_comments, lint, parse
from tools.execution import (EnvironmentError, check_local_tools, diagnostic, docker_ready,
                             ensure_image, generate_driver, run_driver)
from tools.langs import adapter


@dataclass
class Result:
    path: str
    total: int
    norun: int
    nocheck: int
    failures: list[Issue] = field(default_factory=list)
    warnings: list[Issue] = field(default_factory=list)
    failed_blocks: int = 0

    @property
    def code(self):
        return int(bool(self.failures))

    def output(self):
        for issue in self.warnings + self.failures:
            label = 'warning: ' if issue.warning else ''
            print(f'{self.path}:{issue.line}: {label}{issue.message}')
        counts = f'({self.norun} norun, {self.nocheck} nocheck)'
        if self.failures:
            lint_count = len(self.failures) - self.failed_blocks
            print(f'{self.path}: {self.failed_blocks}/{self.total} blocks failed, {lint_count} lint/parse errors {counts}', flush=True)
        else:
            print(f'{self.path}: {self.total} blocks ok {counts}', flush=True)


def display_path(path):
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def language(path, override=None):
    if override:
        return override
    for candidate in (path.stem, path.parent.name):
        if candidate in LANGUAGES:
            return candidate
    raise ValueError(f'{path}: cannot infer language; use --lang LANG')


def check_file(path, lang, *, local=False, no_lint=False, keep=False, verbose=False, ready=None):
    sheet = display_path(path)
    text = path.read_text(encoding='utf-8')
    doc = parse(text, lang)
    result = Result(sheet, len(doc.runs), sum('norun' in b.flags for b in doc.runs),
                    sum('nocheck' in b.flags for b in doc.runs))
    issues = list(doc.errors)
    if not no_lint and (ROOT / 'sheets') in path.resolve().parents:
        issues.extend(lint(doc))
    result.failures = [i for i in issues if not i.warning]
    result.warnings = [i for i in issues if i.warning]
    blocks = [b for b in doc.runs if 'norun' not in b.flags]
    if not blocks or doc.errors:
        return result
    programs = []
    active = []
    for block in blocks:
        try:
            programs.append(adapter(lang).prepare(block.code, block.code_line))
            active.append(block)
        except ValueError as error:
            result.failures.append(Issue(block.line, f'cannot assemble block: {error}'))
            result.failed_blocks += 1
    if not programs:
        return result
    image = None
    if local:
        check_local_tools(programs)
    else:
        if ready is None or not ready.get('docker'):
            docker_ready()
            if ready is not None:
                ready['docker'] = True
        if ready is not None and lang in ready:
            image = ready[lang]
        else:
            image = ensure_image(lang, verbose)
            if ready is not None:
                ready[lang] = image
    scratch = ROOT / '.check'
    scratch.mkdir(exist_ok=True)
    work = Path(tempfile.mkdtemp(prefix=f'{lang}-', dir=scratch))
    # mkdtemp is 0700; the container uses exactly the host uid/gid.
    try:
        for index, (block, program) in enumerate(zip(active, programs), 1):
            folder = work / f'block-{index:03d}'
            folder.mkdir()
            (folder / program.filename).write_text(program.source, encoding='utf-8')
            (folder / 'stdin').write_text(block.stdin, encoding='utf-8')
            for filename, content in program.files.items():
                target = folder / filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding='utf-8')
        generate_driver(work, programs, local=local)
        run_driver(work, local=local, image=image, timeout=len(programs) * 140 + 60)
        for index, (block, program) in enumerate(zip(active, programs), 1):
            folder = work / f'block-{index:03d}'
            try:
                code = int((folder / 'exit').read_text().strip())
                phase = (folder / 'phase').read_text().strip()
                stdout = (folder / 'stdout').read_text(encoding='utf-8', errors='replace')
                stderr = (folder / 'stderr').read_text(encoding='utf-8', errors='replace')
            except (OSError, ValueError) as error:
                raise EnvironmentError(f'{sheet}:{block.line}: driver did not write valid results: {error}') from error
            issue = None
            if code:
                reason = 'timed out' if code in (124, 137) else f'failed (exit {code})'
                details = diagnostic(stderr, program, sheet)
                # Some tools put compiler diagnostics on stdout.
                if phase == 'compile':
                    compile_stdout = (folder / 'compile.stdout').read_text(encoding='utf-8', errors='replace')
                    if compile_stdout.strip():
                        details = '\n'.join(s for s in (details, diagnostic(compile_stdout, program, sheet)) if s)
                issue = Issue(block.line, f'{phase} {reason}' + ('\n' + details if details else ''))
            elif 'nocheck' not in block.flags:
                issue = compare_output(expected_comments(block, lang), stdout, block.line)
            if issue:
                # Every diagnostic carries the block location, including mismatched comments.
                if issue.line != block.line:
                    issue.message += f' (block starts at {sheet}:{block.line})'
                result.failures.append(issue)
                result.failed_blocks += 1
            elif verbose:
                print(f'{sheet}:{block.line}: block ok')
    finally:
        if keep:
            print(f'{sheet}: kept {work}')
        else:
            shutil.rmtree(work)
    return result


def self_test(langs, args):
    ready = {}
    failures = 0
    for lang in langs:
        passed = 0
        for name in ('pass', 'fail-output', 'fail-compile', 'fail-missing', 'fail-exit'):
            path = ROOT / 'tools' / 'tests' / 'fixtures' / lang / (name + '.md')
            result = check_file(path, lang, local=args.local, no_lint=True,
                                keep=args.keep, verbose=args.verbose, ready=ready)
            doc = parse(path.read_text(encoding='utf-8'), lang)
            if name == 'pass':
                valid = result.code == 0 and len(doc.runs) >= 6 and result.norun == 1 and result.nocheck == 1
            else:
                comments = expected_comments(doc.runs[0], lang)
                wanted_line = comments[0].line if name == 'fail-output' else doc.runs[0].line
                wanted_kind = {'fail-output': 'output mismatch', 'fail-compile': 'failed',
                               'fail-missing': 'extra output not covered', 'fail-exit': 'run failed'}[name]
                valid = (result.code == 1 and len(result.failures) == 1
                         and result.failures[0].line == wanted_line
                         and wanted_kind in result.failures[0].message)
            if valid:
                passed += 1
            else:
                failures += 1
                print(f'{display_path(path)}: SELF-TEST FAILED (unexpected result or diagnostic location)')
                result.output()
        print(f'{lang}: {passed}/5 fixtures ok', flush=True)
    print(f'self-test: {len(langs) * 5 - failures}/{len(langs) * 5} fixtures ok')
    return int(bool(failures))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='*', metavar='FILE')
    parser.add_argument('--local', action='store_true', help='use host toolchains without version guarantees')
    parser.add_argument('--lang', action='append', choices=LANGUAGES, help='language override; repeat to filter --self-test')
    parser.add_argument('--no-lint', action='store_true')
    parser.add_argument('--keep', action='store_true')
    parser.add_argument('-v', '--verbose', action='store_true')
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--all', action='store_true', help='check every sheets/*.md')
    modes.add_argument('--self-test', action='store_true')
    args = parser.parse_args(argv)
    if (args.all or args.self_test) and args.files:
        parser.error('--all/--self-test cannot be combined with FILE arguments')
    if not args.self_test and args.lang and len(args.lang) != 1:
        parser.error('only one --lang is allowed when checking files')
    if args.all and args.lang:
        parser.error('--all cannot be combined with --lang')
    if not args.self_test and not args.all and not args.files:
        parser.error('provide FILE..., --all, or --self-test')
    try:
        if args.self_test:
            return self_test(list(dict.fromkeys(args.lang or LANGUAGES)), args)
        paths = sorted((ROOT / 'sheets').glob('*.md')) if args.all else [Path(p) for p in args.files]
        if not paths:
            parser.error('no sheets found')
        # Validate all inputs before starting containers.
        inputs = [(path, language(path, args.lang[0] if args.lang else None)) for path in paths]
        for path, _ in inputs:
            if not path.is_file():
                parser.error(f'{path}: file does not exist')
        ready = {}
        code = 0
        for path, lang in inputs:
            result = check_file(path, lang, local=args.local, no_lint=args.no_lint,
                                keep=args.keep, verbose=args.verbose, ready=ready)
            result.output()
            code = max(code, result.code)
        return code
    except (EnvironmentError, OSError, UnicodeError, ValueError) as error:
        print(f'check: {error}', file=sys.stderr)
        return 2
    except KeyboardInterrupt:
        print('check: interrupted', file=sys.stderr)
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
