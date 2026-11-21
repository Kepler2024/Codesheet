from .base import Prepared


def prepare(code, start_line):
    return Prepared('main.js', code, list(range(start_line, start_line + len(code.splitlines()))), [], ['node', 'main.js'],
                    {'package.json': '{"type":"commonjs"}\n'})
