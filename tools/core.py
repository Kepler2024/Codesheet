"""Markdown parsing, lint, and stdout comparison; no toolchain dependencies."""
from dataclasses import dataclass, field
import re


LANGUAGES = ('python', 'java', 'cpp', 'javascript', 'typescript', 'csharp', 'go', 'kotlin', 'swift', 'rust')
HEADINGS = ('Running a Program', 'Variables', 'If-statements', 'Loops', 'Math',
            'Output and Input', 'Arrays', 'Strings', 'Queues', 'HashSets',
            'HashMaps', 'Tuples', 'Heaps', 'Functions', 'Classes')


@dataclass
class Issue:
    line: int
    message: str
    warning: bool = False


@dataclass
class Block:
    tag: str
    flags: tuple[str, ...]
    line: int
    code_line: int
    end_line: int
    code: str
    stdin: str = ''
    attached: bool = False


@dataclass
class Document:
    text: str
    lang: str
    blocks: list[Block] = field(default_factory=list)
    headings: list[tuple[int, str]] = field(default_factory=list)
    errors: list[Issue] = field(default_factory=list)

    @property
    def runs(self):
        return [b for b in self.blocks if b.tag == self.lang]


@dataclass
class Expected:
    line: int
    tokens: list[str]


def parse(text: str, lang: str) -> Document:
    doc = Document(text, lang)
    lines = text.splitlines(keepends=True)
    opened = None
    contents = []
    for number, line in enumerate(lines, 1):
        if line.startswith('```'):
            if opened is None:
                words = line[3:].strip().split()
                opened = (number, words[0] if words else '', tuple(words[1:]))
                contents = []
            else:
                if line[3:].strip():
                    doc.errors.append(Issue(number, 'closing fence must contain only ```'))
                start, tag, flags = opened
                block = Block(tag, flags, start, start + 1, number, ''.join(contents))
                if tag == 'text' and flags == ('stdin',) and doc.blocks:
                    previous = doc.blocks[-1]
                    between = lines[previous.end_line:start - 1]
                    if previous.tag == lang and not any(s.strip() for s in between):
                        previous.stdin = block.code
                        block.attached = True
                doc.blocks.append(block)
                opened = None
        elif opened is not None:
            contents.append(line)
        elif line.startswith('## '):
            doc.headings.append((number, line[3:].strip()))
    if opened is not None:
        doc.errors.append(Issue(opened[0], 'unclosed code fence'))
    return doc


def expected_comments(block: Block, lang: str) -> list[Expected]:
    pattern = re.compile((r'#' if lang == 'python' else r'//') + r'\s*=>\s*(.*)')
    result = []
    for offset, line in enumerate(block.code.splitlines()):
        match = pattern.search(line)
        if match:
            result.append(Expected(block.code_line + offset, match[1].split()))
    return result


def compare_output(comments: list[Expected], stdout: str, block_line: int):
    actual = stdout.split()
    position = 0
    for comment in comments:
        size = len(comment.tokens)
        got = actual[position:position + size]
        if got != comment.tokens:
            missing = len(got) < size and got == comment.tokens[:len(got)]
            kind = f'missing output for => comment at line {comment.line}' if missing else 'output mismatch'
            return Issue(comment.line, f"{kind}: expected {' '.join(comment.tokens)!r}, actual {' '.join(got)!r}")
        position += size
    if position < len(actual):
        extra = ' '.join(actual[position:])
        return Issue(block_line, f'extra output not covered by any => comment: {extra!r}')
    return None


def lint(doc: Document) -> list[Issue]:
    issues = []
    lines = doc.text.splitlines()
    if not lines or not re.fullmatch(r'# .+ Cheat Sheet', lines[0]):
        issues.append(Issue(1, 'first line must be # <Name> Cheat Sheet'))
    next_line = next(((n, s) for n, s in enumerate(lines[1:], 2) if s.strip()), None)
    if next_line is None or not next_line[1].startswith('> Written for '):
        issues.append(Issue(next_line[0] if next_line else 1, 'next non-empty line must start with > Written for '))
    expected_index = 0
    seen = set()
    for number, heading in doc.headings:
        if heading not in HEADINGS:
            continue
        if heading in seen:
            issues.append(Issue(number, f'duplicate heading: ## {heading}'))
        elif expected_index >= len(HEADINGS) or heading != HEADINGS[expected_index]:
            wanted = HEADINGS[expected_index] if expected_index < len(HEADINGS) else '(no more shared headings)'
            issues.append(Issue(number, f'expected ## {wanted} before ## {heading}'))
            expected_index = HEADINGS.index(heading) + 1
        else:
            expected_index += 1
        seen.add(heading)
    for heading in HEADINGS:
        if heading not in seen:
            issues.append(Issue(1, f'missing heading: ## {heading}'))
    for block in doc.blocks:
        if block.tag not in (doc.lang, 'text', 'bash', 'sh'):
            issues.append(Issue(block.line, f'unsupported fence tag {block.tag!r}; expected {doc.lang}, text, bash, or sh'))
        if block.tag == doc.lang:
            if (any(f not in ('norun', 'nocheck') for f in block.flags)
                    or len(set(block.flags)) != len(block.flags)
                    or len(block.flags) > 1):
                issues.append(Issue(block.line, 'run flags must be either norun or nocheck, or absent'))
            if 'norun' in block.flags:
                first = block.code.splitlines()[0].strip() if block.code.splitlines() else ''
                marker = '#' if doc.lang == 'python' else '//'
                if not first.startswith(marker) or not first[len(marker):].strip():
                    issues.append(Issue(block.code_line, 'norun first line must be a comment giving the reason'))
            for comment in expected_comments(block, doc.lang):
                if 'CAREFUL' in ' '.join(comment.tokens):
                    issues.append(Issue(comment.line, 'CAREFUL belongs before the => comment', warning=True))
        elif block.tag == 'text' and block.flags == ('stdin',):
            if not block.attached:
                issues.append(Issue(block.line, 'text stdin directly follows a run block only (blank lines allowed between)'))
        elif block.flags:
            issues.append(Issue(block.line, f'unsupported flags on {block.tag!r} block'))
    return issues
