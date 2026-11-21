# Codesheet

[English](README.md) | **简体中文**

最初在 NeetCode 刷题时，我经常查阅作者编写的 Python 速查表。它在保持低阅读成本的条件下，系统梳理了Python的核心语法与常用数据结构的用法。这种直观紧凑的形式不仅适合刷算法题，也非常适合具备一定基础的开发者快速掌握一门新语言的骨架，或在久未接触某门语言时随时翻查常用写法。受此启发，我参照这一风格为各大主流语言整理了这套 Codesheet，希望能给各位编程学习者带来方便。

每份速查表都涵盖变量、流程控制、数学运算、数组与字符串，以及队列、集合、映射和堆等常用数据结构。你也可以查到函数和类的写法，以及从其他语言转过来时容易踩的坑。

## 速查表

| 语言 | 适用版本 | 速查表 |
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

## 如何阅读速查表

- 所有速查表都有 15 个共同章节，顺序一致，方便你按主题对照不同语言的写法。
- `// => 2` 或 `# => 2` 表示这行代码会输出 `2`。循环的全部输出写在循环后的一条 `=>` 注释里。
- `CAREFUL:` 提醒你留意与多数语言不同的行为。
- 代码示例按表中所列的工具链版本编写。检查器会运行示例，将实际输出与 `=>` 注释中的预期输出逐项比对。

## 参与贡献

欢迎为更多语言编写速查表。具体要求见[贡献指南](CONTRIBUTING.md)。

## 致谢

本项目的灵感来自 NeetCode 的 [Python 速查表](https://neetcode.io/)。它用一页简短的代码示例讲清了许多常用写法。
