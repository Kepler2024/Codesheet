# Codesheet checker

**English** | [简体中文](README.zh-CN.md)

Python 3.10+ and the standard library are the only host dependencies besides Docker.
Run from the repository root:

```sh
python3 tools/check.py sheets/python.md
python3 tools/check.py --all
python3 tools/check.py --self-test
python3 tools/check.py --self-test --lang java --lang kotlin
python3 -m unittest discover -s tools/tests -t .
```

`--local` uses installed host toolchains without version guarantees. Missing tools
are environment errors. `--lang LANG` overrides filename/parent-directory inference.
`--no-lint` skips sheet lint; `--keep` retains generated files; `-v` shows block
progress and image preparation output. Exit codes: 0 success, 1 sheet/test failure,
2 usage or environment failure. Lint applies to files inside this repository's
`sheets/` directory. Fixtures bypass it.

## Architecture

`core.py` parses fences, attaches stdin, lints, extracts output comments, and
compares whitespace-separated tokens. `langs/<id>.py` assembles each independent
program, compile/run argv, supporting files, and source-to-markdown line maps.
`check.py` writes a unique `.check/` work directory with a subdirectory per block.
`execution.py` writes one shell driver, used for both execution modes, then reads
its per-block stdout, stderr, phase, and exit files. Compiler/runtime locations are
rewritten to markdown locations where recognized; every failure names its block.

Docker uses one container per markdown file, `--network none`, 3 GiB memory,
two CPUs, a process limit, host uid/gid, and writable HOME/cache directories in the
work directory. Compilation has a 120-second timeout and execution 10 seconds.
The driver continues after failed blocks. `--local` uses the standard-library
`timeout.py` helper because macOS lacks GNU timeout. Temporary directories are
removed unless `--keep` is given. The two custom images build automatically when
absent; other images are pulled automatically. Network access is used only for
image preparation, never for checking programs in Docker.

## Assembly and authoring

| Language | Assembly and execution |
|---|---|
| Python | Unmodified `main.py`; `python3` |
| Java | Detect the class declaring `static void main`; `javac`, then `java`. Otherwise hoist imports and wrap in `Main.main`. |
| C++ | Detect `int main`; otherwise hoist includes and `using namespace` lines, wrap in `main`. `g++ -std=c++23 -Wall`. |
| JavaScript | Unmodified CommonJS `main.js`; Node |
| TypeScript | Each `main.ts` compiled separately with `tsc --strict --target ES2022 --lib ES2022 --module commonjs`, then emitted JS runs in Node. Node types are supplied explicitly; browser DOM globals are excluded. |
| C# | Unmodified top-level `Program.cs`; console project with net8.0, C# 12, ImplicitUsings and Nullable enabled. NuGet sources are empty; the SDK includes all required framework references, so restore/build works offline with a fresh HOME. |
| Go | Ensure `package main`; detect `func main`, otherwise hoist single/multiline imports and wrap statements. `go build`, modules disabled. |
| Kotlin | Detect `fun main`; otherwise hoist imports and wrap. Compile each block with `kotlinc`, run its executable jar. |
| Swift | Unmodified `main.swift`; `swiftc -swift-version 5`. Swift 5 language mode supports ordinary standalone snippets without introducing Swift 6 concurrency-isolation constraints unrelated to this sheet's scope. |
| Rust | Detect `fn main`; otherwise hoist `use` declarations and wrap. `rustc --edition 2024` without optimization, retaining debug overflow checks. |

Remaining authoring constraints:

- Blocks share no declarations or runtime state. Include needed imports in each.
  Only standard libraries are available; package downloads are disabled.
- For declarations that must remain at file scope in wrapped languages, write a
  complete program with its entry point. Hoisting recognizes only the leading
  run of import-like lines, interspersed with blank lines and line comments.
- Java uses the public top-level type's filename when present and detects main's
  owning class independently of helper-class order, including explicit packages.
  Use one runnable main per block. The generated Java wrapper declares
  `throws Exception`, so checked exceptions in short snippets need no boilerplate.
- C# follows normal top-level statement ordering: statements before type declarations.
  Swift uses a file named `main.swift` with top-level code; an `@main` type is not needed.
- JavaScript uses CommonJS. TypeScript files are checked independently and do not
  need `export {}` just to avoid declarations colliding with other blocks.
  Local TypeScript checking needs globally installed `typescript` and `@types/node`.
  Generated per-block `package.json` files preserve CommonJS even if the surrounding
  repository uses ES modules.
- Every printed stdout token must appear in a `=>` comment in source order,
  including output from loops or called functions. Line breaks are ignored;
  stdout must be deterministic. Put explanations outside output comments.
- The output-comment scanner intentionally also sees comment markers inside
  string literals. Fences must start at column one with three backticks; closing
  fences contain only backticks. Indented/tilde fences are outside this format.
- Use `norun` with a reason comment on its very first line, or `nocheck` for
  intentionally variable output. `nocheck` still requires compilation and exit 0.

Entry-point detection and line mapping use lightweight lexical/regex handling,
not full language parsers. Diagnostics for emitted TypeScript JavaScript may name
the generated JS location. Compiler warnings do not fail a successful block.
Kotlin currently compiles blocks individually; a long sheet takes longer than
languages with fast compilers. Local mode runs code with ordinary host permissions
and provides no container memory/network isolation.

## Images

All upstream tags were verified to advertise both Linux amd64 and arm64 in their
public registry indexes. Recheck with `python3 tools/docker/verify_images.py`.

| Language | Image |
|---|---|
| Python | `python:3.14.2-slim` |
| Java | `eclipse-temurin:21.0.9_10-jdk` |
| C++ | `gcc:14.3.0` |
| JavaScript | `node:22.8.0-slim` |
| TypeScript | `codesheet-typescript:5.7.3-node22.8.0`, built from the same Node image with `typescript@5.7.3` and `@types/node@22.8.0` |
| C# | `mcr.microsoft.com/dotnet/sdk:8.0.416` |
| Go | `golang:1.23.5` |
| Kotlin | `codesheet-kotlin:2.1.10-jdk21.0.9`, built from the same Temurin image and the official Kotlin 2.1.10 release zip, verified against its release SHA-256 |
| Swift | `swift:6.1.0` |
| Rust | `rust:1.93.1-slim` |

## Adding a language

Add an id to `core.LANGUAGES`, an image to `execution.IMAGES`, and an adapter
with `prepare(code, start_line) -> Prepared`. Record each original source line's
markdown line and use `None` for inserted wrapper lines. Commands are argv lists,
run inside each block directory; additional files go in `Prepared.files`.
If needed, add a Dockerfile and image-build case in `ensure_image`.

Add `tools/tests/fixtures/<id>/pass.md` covering imports/wrapping, a complete
program with helpers/types, loop output, count-and-integers stdin, `nocheck`, and
invalid `norun`. Add `fail-output.md`, `fail-compile.md`, `fail-missing.md`, and
`fail-exit.md`. Each failure fixture contains one block. Self-test checks both the
failure kind and its markdown attribution. Add wrapping and mapping unit cases,
the CI matrix entry, and an image-table row; run unit tests and that language's
Docker self-test before checking its real sheet.
