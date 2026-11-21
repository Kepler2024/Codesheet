from .base import Prepared


def prepare(code, start_line):
    return Prepared('main.swift', code, list(range(start_line, start_line + len(code.splitlines()))),
                    [['swiftc', '-swift-version', '5', 'main.swift', '-o', 'program']], ['./program'])
