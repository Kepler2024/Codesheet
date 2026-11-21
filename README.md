# Codesheet

**English** | [简体中文](README.zh-CN.md)

When I first started practicing on NeetCode, I frequently referred to the Python cheat sheet created by its author—it laid out core syntax and essential data structures in a remarkably concise and intuitive way. This compact, code-first format isn't just great for tackling algorithm problems; it's also ideal for anyone with basic programming experience to quickly grasp the essentials of a new language, or refresh their memory when returning to a language after a long break. Inspired by that approach, I built Codesheet across mainstream languages, hoping to make things easier for fellow learners.

Cheat sheets for picking up a new programming language fast: one page per language, the same sections in every one, code first.

They are for people who already know at least one language. Each sheet covers what you need to solve LeetCode-style problems in that language: variables, control flow, math, arrays and strings, the standard data structures (queues, sets, maps, heaps), functions and classes, plus the pitfalls that catch people coming from other languages.

## Sheets

| Language | Written for | Sheet |
|---|---|---|
| Python | Python 3.14 | [python.md](sheets/python.md) |
| Java | Java 21 | [java.md](sheets/java.md) |
| C++ | C++23 | [cpp.md](sheets/cpp.md) |
| JavaScript | Node.js 22 | [javascript.md](sheets/javascript.md) |
| TypeScript | TypeScript 5.7 | [typescript.md](sheets/typescript.md) |
| C# | C# 12 | [csharp.md](sheets/csharp.md) |
| Go | Go 1.23 | [go.md](sheets/go.md) |
| Kotlin | Kotlin 2.1 | [kotlin.md](sheets/kotlin.md) |
| Swift | Swift 6.1 | [swift.md](sheets/swift.md) |
| Rust | Rust 1.93 | [rust.md](sheets/rust.md) |

## How to read a sheet

- Every sheet has the same 15 sections in the same order, so you can compare languages section by section.
- `// => 2` (or `# => 2`) shows what the code prints at that point. After a loop, one `=>` comment lists everything the loop printed.
- `CAREFUL:` marks a pitfall: something that behaves differently from most languages.
- Every code block runs as is. A checker runs all blocks and compares their output with the `=>` comments, using the exact toolchain versions listed above.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). New languages are welcome.

## Credits

Inspired by NeetCode's [Python Cheat Sheet](https://neetcode.io/), which showed how much a short, code-first page can teach.
