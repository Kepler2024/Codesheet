import re
from .base import Prepared, hoist, make_source, mask


def prepare(code, start_line):
    compile = [['g++', '-std=c++23', '-Wall', 'main.cpp', '-o', 'program']]
    if re.search(r'\b(?:int|auto)\s+main\s*\(', mask(code)):
        return Prepared('main.cpp', code, list(range(start_line, start_line + len(code.splitlines()))), compile, ['./program'])
    prefix, body = hoist(code, start_line, 'cpp')
    return make_source('main.cpp', prefix, ['int main() {'], body, ['}'], compile, ['./program'])
