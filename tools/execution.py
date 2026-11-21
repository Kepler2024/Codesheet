"""Generate one portable shell driver and execute it locally or in one container."""
from pathlib import Path
import os
import re
import shlex
import shutil
import subprocess
import sys
import uuid


class EnvironmentError(Exception):
    """A missing toolchain or unavailable execution environment (CLI exit 2)."""


IMAGES = {
    'python': 'python:3.14.2-slim',
    'java': 'eclipse-temurin:21.0.9_10-jdk',
    'cpp': 'gcc:14.3.0',
    'javascript': 'node:22.8.0-slim',
    'typescript': 'codesheet-typescript:5.7.3-node22.8.0',
    'csharp': 'mcr.microsoft.com/dotnet/sdk:8.0.416',
    'go': 'golang:1.23.5',
    'kotlin': 'codesheet-kotlin:2.1.10-jdk21.0.9',
    'swift': 'swift:6.1.0',
    'rust': 'rust:1.93.1-slim',
}
TOOLS = Path(__file__).resolve().parent


def docker_ready():
    if shutil.which('docker') is None:
        raise EnvironmentError('Docker is unavailable; start Docker Desktop or use --local')
    try:
        result = subprocess.run(['docker', 'info'], capture_output=True, timeout=20)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise EnvironmentError('Docker is unavailable; start Docker Desktop or use --local') from error
    if result.returncode:
        raise EnvironmentError('Docker daemon is not running; start Docker Desktop or use --local')


def ensure_image(lang, verbose=False):
    tag = IMAGES[lang]
    exists = subprocess.run(['docker', 'image', 'inspect', tag], capture_output=True)
    if exists.returncode == 0:
        return tag
    if lang in ('typescript', 'kotlin'):
        command = ['docker', 'build', '-t', tag, '-f', str(TOOLS / 'docker' / (lang + '.Dockerfile')), str(TOOLS / 'docker')]
    else:
        command = ['docker', 'pull', tag]
    print(f'Preparing {tag} ...', flush=True)
    try:
        result = subprocess.run(command, stdout=None if verbose else subprocess.PIPE,
                                stderr=subprocess.STDOUT, text=True, timeout=1800)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise EnvironmentError(f'could not prepare image {tag}: {error}') from error
    if result.returncode:
        raise EnvironmentError(f'could not prepare image {tag}:\n{result.stdout or "see Docker output above"}')
    return tag


def local_types_root():
    try:
        result = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired) as error:
        raise EnvironmentError('--local TypeScript requires npm, tsc, node, and global @types/node') from error
    path = Path(result.stdout.strip()) / '@types'
    if result.returncode or not (path / 'node').is_dir():
        raise EnvironmentError('--local TypeScript requires globally installed @types/node (Docker supplies it)')
    return str(path)


def generate_driver(work, programs, run_timeout=10, compile_timeout=120, local=True):
    quote = shlex.quote
    timeout = ([sys.executable, str(TOOLS / 'timeout.py')] if local else ['timeout', '-k', '2s'])
    lines = ['#!/bin/sh', 'umask 022', 'cd "$(dirname "$0")" || exit 2', 'ROOT="$PWD"',
             'export HOME="$ROOT/home"', 'export TMPDIR="$ROOT/tmp"',
             'export GOCACHE="$ROOT/cache/go"', 'export GOPATH="$ROOT/cache/gopath"',
             'export GO111MODULE=off', 'export GOTOOLCHAIN=local',
             'export DOTNET_CLI_HOME="$HOME"', 'export DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1',
             'export DOTNET_CLI_TELEMETRY_OPTOUT=1', 'export DOTNET_NOLOGO=1',
             'export NUGET_PACKAGES="$ROOT/cache/nuget"',
             'mkdir -p "$HOME" "$TMPDIR" "$GOCACHE" "$GOPATH" "$NUGET_PACKAGES" || exit 2']
    types_root = None
    for index, program in enumerate(programs, 1):
        folder = f'block-{index:03d}'
        lines += [f'cd "$ROOT/{folder}" || exit 2', ': > stdout', ': > stderr', ': > compile.stdout',
                  'printf "%s\\n" compile > phase', 'status=0']
        for command in program.compile:
            command = list(command)
            if 'NODE_TYPES_ROOT_PLACEHOLDER' in command:
                if types_root is None:
                    types_root = local_types_root() if local else '/usr/local/lib/node_modules/@types'
                command = [types_root if s == 'NODE_TYPES_ROOT_PLACEHOLDER' else s for s in command]
            prefix = timeout + [str(compile_timeout)]
            lines += ['if [ "$status" -eq 0 ]; then',
                      '  ' + shlex.join(prefix + command) + ' >> compile.stdout 2>> stderr < /dev/null',
                      '  status=$?', 'fi']
        lines += ['if [ "$status" -eq 0 ]; then', '  printf "%s\\n" run > phase',
                  '  ' + shlex.join(timeout + [str(run_timeout)] + program.run) + ' < stdin > stdout 2>> stderr',
                  '  status=$?', 'fi', 'printf "%s\\n" "$status" > exit']
    lines += ['exit 0']
    (work / 'driver.sh').write_text('\n'.join(lines) + '\n', encoding='utf-8')


def check_local_tools(programs):
    for program in programs:
        for command in program.compile + [program.run]:
            executable = command[0]
            if '/' not in executable and shutil.which(executable) is None:
                raise EnvironmentError(f'--local: missing toolchain executable {executable!r}; use Docker or provide the host toolchain')


def run_driver(work, local=False, image=None, timeout=3600):
    name = 'codesheet-' + uuid.uuid4().hex[:12]
    if local:
        command = ['sh', str(work / 'driver.sh')]
    else:
        command = ['docker', 'run', '--rm', '--init', '--name', name,
                   '--network', 'none', '--memory', '3g', '--cpus', '2', '--pids-limit', '1024',
                   '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges',
                   '--user', f'{os.getuid()}:{os.getgid()}',
                   '--mount', f'type=bind,src={work},dst=/work',
                   '--workdir', '/work', '--env', 'HOME=/work/home',
                   image, 'sh', '/work/driver.sh']
    try:
        result = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired) as error:
        if not local:
            subprocess.run(['docker', 'rm', '-f', name], capture_output=True)
        raise EnvironmentError(f'driver could not finish: {error}') from error
    if result.returncode:
        raise EnvironmentError(f'driver failed (exit {result.returncode}): {result.stderr.strip() or result.stdout.strip()}')


def diagnostic(stderr, program, sheet):
    """Rewrite common compiler/runtime locations, without touching unrelated files."""
    filename = re.escape(program.filename)
    location = rf'(?:[\w./-]+/)?{filename}'
    def mapped(number):
        n = int(number)
        if 1 <= n <= len(program.line_map) and program.line_map[n - 1] is not None:
            return f'{sheet}:{program.line_map[n - 1]}'
        return f'{sheet}:(generated line {n})'
    stderr = re.sub(rf'{location}:(\d+)', lambda m: mapped(m[1]), stderr)
    stderr = re.sub(rf'{location}\((\d+),(\d+)\)', lambda m: mapped(m[1]) + ':' + m[2], stderr)
    stderr = re.sub(rf'File [\"\']{location}[\"\'], line (\d+)', lambda m: mapped(m[1]), stderr)
    return stderr.strip()
