from .base import Prepared


def prepare(code, start_line):
    return Prepared('main.py', code, list(range(start_line, start_line + len(code.splitlines()))), [], ['python3', 'main.py'])
