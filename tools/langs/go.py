import re
from .base import Prepared, hoist, make_source, mask


def prepare(code, start_line):
    compile = [['go', 'build', '-o', 'program', 'main.go']]
    lines = [(s, start_line + i) for i, s in enumerate(code.splitlines())]
    package = re.search(r'(?m)^\s*package\s+\w+[^\n]*', mask(code))
    if re.search(r'\bfunc\s+main\s*\(', mask(code)):
        if package:
            return Prepared('main.go', code, [n for _, n in lines], compile, ['./program'])
        return make_source('main.go', [], ['package main'], lines, [], compile, ['./program'])
    prefix = []
    if package:
        offset = code[:package.end()].count('\n')
        prefix = lines[:offset + 1]
        remainder = '\n'.join(s for s, _ in lines[offset + 1:])
        imports, body = hoist(remainder, start_line + offset + 1, 'go')
        prefix += imports
    else:
        imports, body = hoist(code, start_line, 'go')
        prefix = [('package main', None)] + imports
    return make_source('main.go', prefix, ['func main() {'], body, ['}'], compile, ['./program'])
