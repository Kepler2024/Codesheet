# Codesheet 检查器

[English](README.md) | **简体中文**

除了 Docker 之外，检查器在宿主机上仅依赖 Python 3.10+ 及其标准库。
在仓库根目录下运行：

```sh
python3 tools/check.py sheets/python.md
python3 tools/check.py --all
python3 tools/check.py --self-test
python3 tools/check.py --self-test --lang java --lang kotlin
python3 -m unittest discover -s tools/tests -t .
```

`--local` 使用宿主机已安装的工具链（不保证版本一致）。缺失工具链会被判定为环境错误。`--lang LANG` 用于覆盖自动推断的文件名/父目录语言。`--no-lint` 跳过格式检查；`--keep` 保留生成的临时工作文件；`-v` 显示代码块进度以及 Docker 镜像准备过程。退出码说明：0 表示成功，1 表示速查表或测试用例未通过，2 表示参数用法错误或环境缺失。Lint 检查只对本仓库 `sheets/` 目录下的文件生效，测试 fixture 会自动跳过 lint。

## 架构设计

`core.py` 负责解析 Markdown 代码围栏、关联测试输入（stdin）、执行静态代码检查（lint）、提取输出注释（`=>`），并对分词后的期望输出与实际标准输出进行比对。`langs/<id>.py` 负责为每门语言组装独立程序、构建/运行命令行参数（argv）、生成辅助支撑文件，并维护源码行与原始 Markdown 行号的映射表。`check.py` 创建唯一的 `.check/` 工作目录，并为每个代码块分配独立的子目录。`execution.py` 生成一份通用的 Shell 驱动脚本（在两种执行模式下复用），随后读取每个代码块对应的 stdout、stderr、阶段标记和退出状态文件。编译器与运行时的报错位置会被自动重写并精准映射回 Markdown 中的行号；每个错误报告都会明确指出出错的代码块。

Docker 模式下为每个 Markdown 文件启动一个独立的容器，配置参数为 `--network none`（完全断网）、3 GiB 内存上限、双 CPU 核心、进程数限制、宿主机 uid/gid 映射，并在工作目录中挂载可写的 HOME/缓存目录。代码编译超时限制为 120 秒，单块执行超时限制为 10 秒。即使中间某个代码块报错，驱动脚本也会继续运行后续代码块。`--local` 本地模式使用标准库实现的 `timeout.py` 辅助脚本以兼容缺少 GNU timeout 命令的 macOS 系统。除非显式指定 `--keep`，否则生成的临时目录会在检查结束后自动清理。仓库所需的两个自定义镜像在本地缺失时会自动构建；其余官方基础镜像会自动 pull 拉取。网络仅用于镜像准备阶段，Docker 容器内运行待测程序时全程断网。

## 各语言的代码组装与执行流程

| 语言 | 代码组装与执行细节 |
|---|---|
| Python | 原始 `main.py`；直接通过 `python3` 执行 |
| Java | 检测是否声明了 `static void main` 类；通过 `javac` 编译后 `java` 运行。若无，提升顶部 import 并包装在 `Main.main` 内部。 |
| C++ | 检测是否存在 `int main`；若无，提升顶部的 `#include` 与 `using namespace` 语句，并将语句包装在 `main` 内。使用 `g++ -std=c++23 -Wall` 编译。 |
| JavaScript | 原始 CommonJS `main.js`；直接通过 Node 执行 |
| TypeScript | 每个代码块独立保存为 `main.ts`，使用 `tsc --strict --target ES2022 --lib ES2022 --module commonjs` 单独编译，编译产出的 JS 由 Node 运行。显式注入 Node 类型支持；排除浏览器 DOM 全局对象。 |
| C# | 原始顶层语句 `Program.cs`；基于 net8.0、C# 12 控制台项目，默认开启 ImplicitUsings 与 Nullable。清空外部 NuGet 源；.NET SDK 已包含所有内置核心框架引用，因此全新的独立 HOME 目录下仍可完全离线恢复与编译。 |
| Go | 确保声明 `package main`；检测是否存在 `func main`，若无则提升单行/多行 import 并包装内部语句。在禁用 Go module 的模式下通过 `go build` 编译执行。 |
| Kotlin | 检测是否存在 `fun main`；若无则提升顶部 import 并包装。每个代码块使用 `kotlinc` 单独编译并运行其可执行 jar 包。 |
| Swift | 原始 `main.swift`；使用 `swiftc -swift-version 5` 编译。Swift 5 语言模式原生支持单文件独立代码片段，避免引入与速查表无关的 Swift 6 并发隔离检查约束。 |
| Rust | 检测是否存在 `fn main`；若无则提升顶部的 `use` 声明并包装。使用 `rustc --edition 2024` 在无优化模式下编译，保留 Debug 模式下的数值溢出检查。 |

编写代码块时的注意事项：

- 代码块之间不共享任何变量声明或运行时状态。每个代码块必须自行引入所需的全部 import。只能使用标准库，外部第三方包下载已被禁用。
- 对于在需要包装的语言中必须位于文件顶层作用域的声明（如辅助函数、类、结构体），请编写包含 `main` 的完整程序。代码提升仅识别代码块最开头的连续 import 相关行（允许穿插空行和单行注释）。
- Java 会根据公开顶层类型的名称命名文件，且不受类排列顺序影响自动寻找声明了 main 的类。每个块只放一个可运行的 main。生成的 Java 包装器显式声明了 `throws Exception`，因此简短片段中使用受检异常（checked exception）无需编写额外样板代码。
- C# 遵循标准的顶层语句顺序：执行语句在类型声明之前。Swift 使用名为 `main.swift` 的文件支持顶层语句，无需编写 `@main`。
- JavaScript 使用 CommonJS 规范。TypeScript 文件完全独立检查，无需为了避免与其他代码块符号冲突而添加 `export {}`。本地检查 TypeScript 需要全局安装 `typescript` 和 `@types/node`。生成的每个代码块的 `package.json` 会锁定 CommonJS，即使宿主仓库为 ES 模块也不会受到干扰。
- 标准输出中的每一个 token 都必须按源码顺序在 `=>` 注释中标注，包括循环或调用函数所打印的内容。换行符不影响匹配；输出必须具有确定性。解释说明请写在注释外面。
- 输出注释扫描器在扫描时能识别字符串字面量内部的注释标记。代码围栏必须从第 1 列以 3 个反引号开头；闭合围栏仅能包含反引号。缩进或波浪线围栏不符合规范。
- 使用 `norun` 时必须在代码块第一行写明原因注释；`nocheck` 用于故意产生随机输出的场景，但仍必须能够正常编译并通过退出码 0 退出。

入口检测与行号映射基于轻量级词法与正则匹配完成，并未引入完整的语言语法解析器。TypeScript 诊断信息中可能会提及生成的 JS 代码位置。编译器警告不会导致通过的代码块被判定失败。Kotlin 目前采用逐块编译策略，因此整体耗时相对拥有快速编译器的语言稍长。本地模式以普通宿主权限运行代码，不具备容器的内存与网络隔离保护。

## Docker 镜像版本

所有上游镜像标签均已在官方公开 Registry 索引中验证支持 Linux amd64 与 arm64 双架构。可通过 `python3 tools/docker/verify_images.py` 重新验证。

| 语言 | 镜像标签 |
|---|---|
| Python | `python:3.14.2-slim` |
| Java | `eclipse-temurin:21.0.9_10-jdk` |
| C++ | `gcc:14.3.0` |
| JavaScript | `node:22.8.0-slim` |
| TypeScript | `codesheet-typescript:5.7.3-node22.8.0`（基于 Node 镜像构建，预装 `typescript@5.7.3` 与 `@types/node@22.8.0`） |
| C# | `mcr.microsoft.com/dotnet/sdk:8.0.416` |
| Go | `golang:1.23.5` |
| Kotlin | `codesheet-kotlin:2.1.10-jdk21.0.9`（基于 Temurin 镜像构建，预装官方 Kotlin 2.1.10 压缩包，并通过 SHA-256 校验） |
| Swift | `swift:6.1.0` |
| Rust | `rust:1.93.1-slim` |

## 添加新语言支持

在 `core.LANGUAGES` 中添加语言 id，在 `execution.IMAGES` 中登记镜像，并编写对应的语言适配器类（实现 `prepare(code, start_line) -> Prepared` 接口）。记录每行原始源码在 Markdown 中的行号，对于自动插入的包装代码行使用 `None` 标记。执行命令采用 argv 列表格式并在各自块目录下运行；额外的辅助文件写入 `Prepared.files` 中。若有需要，可在 `ensure_image` 中添加 Dockerfile 及镜像自动构建分支。

在 `tools/tests/fixtures/<id>/` 下添加测试文件：`pass.md` 覆盖 import 提升与包装、包含 helper/type 的完整程序、循环输出、count-and-integers 标准输入、`nocheck` 以及非法的 `norun` 示例；添加 `fail-output.md`、`fail-compile.md`、`fail-missing.md` 和 `fail-exit.md`（每个错误用例 fixture 仅包含一个出错代码块）。运行 self-test 会同时验证失败类型与 Markdown 行号归属。最后补充行映射与包装单元测试、CI matrix 项以及镜像表格行；在检查该语言真正的速查表之前，务必通过单元测试以及该语言的 Docker self-test。
