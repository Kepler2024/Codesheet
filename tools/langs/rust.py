import re
from .base import Prepared, hoist, make_source, mask


def prepare(code, start_line):
    compile = [['rustc', '--edition', '2024', 'main.rs', '-o', 'program']]
    if re.search(r'\bfn\s+main\s*\(', mask(code)):
        return Prepared('main.rs', code, list(range(start_line, start_line + len(code.splitlines()))), compile, ['./program'])
    prefix, body = hoist(code, start_line, 'rust')
    return make_source('main.rs', prefix, ['fn main() {'], body, ['}'], compile, ['./program'])
