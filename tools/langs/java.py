import re
from .base import Prepared, hoist, make_source, mask


def classes(code, main_position):
    """Locate the enclosing type of main and any public top-level filename."""
    stack = []
    pending = None
    public_name = None
    owner = None
    tokens = list(re.finditer(r'\b(?:(public)\s+)?(?:(?:final|abstract|sealed|non-sealed|static)\s+)*(?:class|record|interface|enum)\s+(\w+)|[{}]', code))
    for token in tokens:
        if owner is None and token.start() > main_position:
            types = [name for name in stack if name]
            owner = '$'.join(types)
        if token.group(2):
            pending = token.group(2)
            if not stack and token.group(1):
                public_name = pending
        elif token[0] == '{':
            stack.append(pending)
            pending = None
        elif token[0] == '}' and stack:
            stack.pop()
    return owner, public_name


def prepare(code, start_line):
    clean = mask(code)
    main = re.search(r'\bstatic\s+(?:(?:public|protected|private|final|synchronized|strictfp)\s+)*void\s+main\s*\(', clean)
    if main:
        owner, public_name = classes(clean, main.start())
        if not owner:
            raise ValueError('static void main must be declared inside a class')
        filename = (public_name or owner.split('$')[0]) + '.java'
        package = re.search(r'\bpackage\s+([\w.]+)\s*;', clean)
        entry = package[1] + '.' + owner if package else owner
        return Prepared(filename, code, list(range(start_line, start_line + len(code.splitlines()))),
                        [['javac', '-d', '.', filename]], ['java', '-cp', '.', entry])
    prefix, body = hoist(code, start_line, 'java')
    return make_source('Main.java', prefix, ['class Main {', 'public static void main(String[] args) throws Exception {'],
                       body, ['}', '}'], [['javac', 'Main.java']], ['java', '-cp', '.', 'Main'])
