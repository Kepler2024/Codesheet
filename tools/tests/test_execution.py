"""Exercise the real driver with host Python, including timeout and isolation."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from tools.execution import diagnostic, generate_driver, run_driver
from tools.langs.base import Prepared


class DriverTests(unittest.TestCase):
    def run_program(self, source, stdin='', timeout=2, compile_commands=None):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        work = Path(temporary.name)
        folder = work / 'block-001'
        folder.mkdir()
        (folder / 'main.py').write_text(source)
        (folder / 'stdin').write_text(stdin)
        prepared = Prepared('main.py', source, [5, 6, 7], compile_commands or [], [sys.executable, 'main.py'])
        generate_driver(work, [prepared], run_timeout=timeout, compile_timeout=timeout)
        run_driver(work, local=True)
        return folder, prepared

    def test_stdout_stderr_stdin_and_exit(self):
        folder, _ = self.run_program('import sys\nprint(input())\nprint("err", file=sys.stderr)\nsys.exit(7)\n', 'hello\n')
        self.assertEqual((folder / 'stdout').read_text(), 'hello\n')
        self.assertEqual((folder / 'stderr').read_text(), 'err\n')
        self.assertEqual((folder / 'exit').read_text().strip(), '7')
        self.assertEqual((folder / 'phase').read_text().strip(), 'run')

    def test_compile_failure_does_not_execute(self):
        folder, _ = self.run_program('print("must not execute")', compile_commands=[[sys.executable, '-c', 'import sys; sys.exit(9)']])
        self.assertEqual((folder / 'exit').read_text().strip(), '9')
        self.assertEqual((folder / 'phase').read_text().strip(), 'compile')
        self.assertEqual((folder / 'stdout').read_text(), '')

    def test_timeout_terminates_program(self):
        folder, _ = self.run_program('while True: pass\n', timeout=1)
        self.assertEqual((folder / 'exit').read_text().strip(), '124')

    def test_runtime_line_mapping(self):
        prepared = Prepared('main.py', '', [None, 15, 16], [], [])
        result = diagnostic('  File "/work/block-001/main.py", line 3\nValueError: bad', prepared, 'sheets/python.md')
        self.assertIn('sheets/python.md:16', result)
        self.assertIn('ValueError: bad', result)

    def test_compiler_line_mapping(self):
        for name, message in [('Main.java', 'Main.java:3: error: bad'), ('Program.cs', '/work/Program.cs(3,5): error CS123: bad'), ('Main.kt', 'Main.kt:3:7: error: bad'), ('main.rs', ' --> main.rs:3:8')]:
            prepared = Prepared(name, '', [None, 50, 51], [], [])
            self.assertIn('sheets/test.md:51', diagnostic(message, prepared, 'sheets/test.md'))


if __name__ == '__main__':
    unittest.main()
