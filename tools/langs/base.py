"""Assembly helpers, preserving the markdown location of every source line."""
from dataclasses import dataclass, field
import re


@dataclass
class Prepared:
    filename: str
    source: str
    line_map: list[int | None]
    compile: list[list[str]]
    run: list[str]
    files: dict[str, str] = field(default_factory=dict)


def mask(code):
    """Blank comments and ordinary strings before looking for entry points."""
    pattern = r'//[^\n]*|/\*[\s\S]*?\*/|"""[\s\S]*?"""|"(?:\\.|[^"\\])*"|\x27(?:\\.|[^\x27\\\n])*\x27|`[^`]*`'
    return re.sub(pattern, lambda m: re.sub(r'[^\n]', ' ', m[0]), code)


def hoist(code, start_line, kind):
    lines = [(line, start_line + i) for i, line in enumerate(code.splitlines())]
    patterns = {
        'java': r'import\b', 'cpp': r'#\s*include\b|using\s+namespace\b',
        'go': r'import\b', 'kotlin': r'import\b', 'rust': r'use\b',
    }
    end = 0
    multiline = False
    clean_lines = mask(code).splitlines()
    for i, (line, _) in enumerate(lines):
        stripped = line.strip()
        clean = clean_lines[i].strip()
        if multiline:
            end = i + 1
            if (kind == 'go' and ')' in clean) or (kind in ('rust', 'java', 'cpp') and ';' in clean):
                multiline = False
        elif not stripped or stripped.startswith('//'):
            end = i + 1
        elif re.match(patterns[kind], clean):
            end = i + 1
            multiline = ((kind == 'go' and '(' in clean and ')' not in clean)
                         or (kind in ('rust', 'java', 'cpp') and not clean.startswith('#') and ';' not in clean))
        else:
            break
    return lines[:end], lines[end:]


def make_source(filename, prefix, opening, body, closing, compile, run, files=None):
    pieces = prefix + [(s, None) for s in opening] + body + [(s, None) for s in closing]
    return Prepared(filename, '\n'.join(s for s, _ in pieces) + '\n',
                    [n for _, n in pieces], compile, run, files or {})
