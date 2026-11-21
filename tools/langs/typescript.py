from .base import Prepared


def prepare(code, start_line):
    return Prepared('main.ts', code, list(range(start_line, start_line + len(code.splitlines()))),
                    [['tsc', '--strict', '--target', 'ES2022', '--lib', 'ES2022', '--module', 'commonjs', '--types', 'node',
                      '--typeRoots', 'NODE_TYPES_ROOT_PLACEHOLDER', '--outDir', 'out', 'main.ts']], ['node', 'out/main.js'],
                    {'package.json': '{"type":"commonjs"}\n'})
