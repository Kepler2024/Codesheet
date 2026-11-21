from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
CHECK = ROOT / 'tools/check.py'


class CLITests(unittest.TestCase):
    def call(self, *args, env=None):
        return subprocess.run([sys.executable, str(CHECK), *map(str, args)], cwd=ROOT, capture_output=True, text=True, env=env)

    def fixture(self, code, name='python.md'):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        path = Path(temp.name) / name
        path.write_text(code)
        return path

    def test_usage_and_language_inference(self):
        self.assertEqual(self.call().returncode, 2)
        result = self.call('--local', '--no-lint', self.fixture('```python\nprint(2) # => 2\n```\n'))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('1 blocks ok (0 norun, 0 nocheck)', result.stdout)
        result = self.call('--local', '--no-lint', self.fixture('', 'unknown.md'))
        self.assertEqual(result.returncode, 2)

    def test_output_failure_points_to_comment(self):
        result = self.call('--local', '--no-lint', self.fixture('\n```python\nprint(2) # => 3\n```\n'))
        self.assertEqual(result.returncode, 1)
        self.assertIn(':3: output mismatch', result.stdout)

    def test_runtime_failure_has_block_and_mapped_source_lines(self):
        result = self.call('--local', '--no-lint', self.fixture('\n```python\nraise ValueError("bad")\n```\n'))
        self.assertEqual(result.returncode, 1)
        self.assertIn(':2: run failed', result.stdout)
        self.assertIn(':3', result.stdout)
        self.assertIn('ValueError: bad', result.stdout)

    def test_nocheck_still_requires_zero_exit_and_norun_is_skipped(self):
        code = '```python norun\n# deliberately broken\ninvalid !!!\n```\n```python nocheck\nraise RuntimeError("bad")\n```\n'
        result = self.call('--local', '--no-lint', self.fixture(code))
        self.assertEqual(result.returncode, 1)
        self.assertIn('1 norun, 1 nocheck', result.stdout)

    def test_missing_docker_is_environment_error(self):
        env = dict(os.environ, PATH='')
        result = self.call('--no-lint', self.fixture('```python\npass\n```\n'), env=env)
        self.assertEqual(result.returncode, 2)
        self.assertIn('start Docker Desktop or use --local', result.stderr)

    def test_self_test_python_local(self):
        result = self.call('--self-test', '--local', '--lang', 'python')
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn('5/5 fixtures ok', result.stdout)

    @unittest.skipUnless(shutil.which('node'), 'host Node is optional')
    def test_local_javascript_is_commonjs_inside_esm_repository(self):
        code = '```javascript\nconst path = require("node:path");\nconsole.log(path.basename("/tmp/ok")); // => ok\n```\n'
        result = self.call('--local', '--no-lint', self.fixture(code, 'javascript.md'))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == '__main__':
    unittest.main()
