"""Small POSIX timeout for --local, where GNU timeout may not exist (macOS)."""
import os
import signal
import subprocess
import sys


def main():
    try:
        process = subprocess.Popen(sys.argv[2:], start_new_session=True)
    except OSError as error:
        print(error, file=sys.stderr)
        return 127
    try:
        code = process.wait(timeout=float(sys.argv[1]))
        return code if code >= 0 else 128 - code
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGTERM)
        try:
            process.wait(timeout=2)
        except subprocess.TimeoutExpired:
            pass
        # Kill surviving children even if the group leader exited on SIGTERM.
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        process.wait()
        return 124


if __name__ == '__main__':
    raise SystemExit(main())
