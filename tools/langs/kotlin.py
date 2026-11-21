import re
from .base import Prepared, hoist, make_source, mask


def prepare(code, start_line):
    compile = [['kotlinc', 'Main.kt', '-include-runtime', '-d', 'program.jar']]
    run = ['java', '-jar', 'program.jar']
    if re.search(r'\bfun\s+main\s*\(', mask(code)):
        return Prepared('Main.kt', code, list(range(start_line, start_line + len(code.splitlines()))), compile, run)
    prefix, body = hoist(code, start_line, 'kotlin')
    return make_source('Main.kt', prefix, ['fun main() {'], body, ['}'], compile, run)
