# 贡献指南

[English](CONTRIBUTING.md) | **简体中文**

感谢你参与贡献！本指南是 Codesheet 的完整规则手册：按照本指南编写的新速查表，其风格与质感应如同出自参考范例 [`sheets/python.md`](sheets/python.md) 同一人之手。

## 什么是速查表

- **读者对象：** 已经掌握至少一门编程语言、想要快速上手另一门语言的开发者。不要解释什么是循环，直接展示这门语言如何编写循环，以及它与大多数语言有何不同。
- **核心目标：** 读完一份速查表后，读者能够用该语言解决 LeetCode 风格的算法与数据结构问题。
- **形式结构：** 代码优先。注释仅用一两行指出“为什么这样做”或“注意陷阱”。除标题下的一两句引言外，不写大段叙述性文字。
- **地道风格：** 按该语言资深开发者的习惯编写代码。以 `sheets/python.md` 作为覆盖范围和语言风格的标杆，**绝不能**逐行机械直译。

每门语言一个独立文件，命名为 `sheets/<id>.md`（其中 `<id>` 同时也是 Markdown 代码块的语言高亮标识）：

| id | 语言 | 适用版本 |
|---|---|---|
| `python` | Python | Python 3.14 |
| `java` | Java | Java 21 |
| `cpp` | C++ | C++23 (GCC 14) |
| `javascript` | JavaScript | Node.js 22 |
| `typescript` | TypeScript | TypeScript 5.7 on Node.js 22 |
| `csharp` | C# | C# 12 (.NET 8) |
| `go` | Go | Go 1.23 |
| `kotlin` | Kotlin | Kotlin 2.1 |
| `swift` | Swift | Swift 6.1 |
| `rust` | Rust | Rust 1.93 |

仅使用该版本标准库提供的功能。你可以在注释中*提及*常用的第三方库，但可执行代码中不能导入任何第三方依赖。

## 文件头部规范

编写新速查表请从 [`TEMPLATE.md`](TEMPLATE.md)（或中文版 [`TEMPLATE.zh-CN.md`](TEMPLATE.zh-CN.md)）开始。每份速查表都必须以如下格式开头：

```markdown
# Go Cheat Sheet

> Written for Go 1.23

Use this quick reference to learn or revisit Go syntax and common data structures. In the examples, `// =>` marks the expected output.
```

英文版标题必须为 `<Language> Cheat Sheet`，中文版标题为 `<Language> 速查表`，紧随其后的下一行必须以 `> Written for `（英文）或 `> 适用于 ` / `> 针对 `（中文）开头标明版本。

## 骨架结构

每份速查表均包含以下 15 个 `##` 章节，且必须使用完全一致的标题名称与排列顺序。以下列出了每个章节必须覆盖的核心知识点：

1. **`Running a Program`（运行程序）**：最小完整程序；入口点（或无需显式入口的说明）；执行该程序的命令。
2. **`Variables`（变量）**：变量声明；可变性 vs 不可变性；类型推导与常用显式类型；空值表示（null / nil / None / Option / optional）；多重赋值与解构交换（若语言支持）；自增自减操作。
3. **`If-statements`（条件语句）**：if / else if / else；比较运算符与逻辑运算符；三元运算符或条件表达式。
4. **`Loops`（循环）**：while 循环；计数循环（0 到 n-1、a 到 b、倒序遍历）；break / continue 控制。
5. **`Math`（数学运算）**：整数除法 vs 浮点除法；负数除法的舍入方向；负数的取模运算；floor / ceil / sqrt / pow / abs；整型最值与正负无穷；数值溢出时的行为。
6. **`Output and Input`（输出与输入）**：打印单值；同一行打印多值；从 stdin 读取一行；读取整数（如 ACM 风格的一组数字输入）。
7. **`Arrays`（数组 / 列表）**：动态数组类型；用作栈（LIFO）；创建带默认值的大小为 n 的数组；长度获取；索引访问（是否支持负索引？）；切片 / 子数组；按索引遍历、按值遍历、同时遍历索引与值；双数组并行遍历；反转；排序、降序排序、自定义排序比较器；二维数组（以及语言特有的共享行陷阱）。
8. **`Strings`（字符串）**：字符读取；子串截取；可变性说明；字符串拼接与高效构建（如 StringBuilder / strings.Builder）；字符串 ↔ 整数转换；字符 ↔ ASCII / Unicode 编码转换；分割与连接（split / join）；相等性比较。
9. **`Queues`（队列 / 双端队列）**：双端队列操作：两端添加与弹出、两端查看（peek）、获取大小。
10. **`HashSets`（哈希集合）**：创建、添加、删除、判断包含、获取大小、从数组构建、遍历。
11. **`HashMaps`（哈希映射 / 字典）**：创建、存入、获取、覆盖、判断键存在、删除键、大小；遍历键、值与键值对；计数惯用法（获取并带默认值、自增）。
12. **`Tuples`（元组）**：在 LeetCode 中的两个典型用途：多值返回、用作哈希表或集合的复合键。
13. **`Heaps`（堆 / 优先队列）**：最小堆；最大堆；自定义优先级（如按元素第二维度排序）；从数组建堆；查看堆顶、弹出堆顶、获取大小。
14. **`Functions`（函数）**：定义、调用、返回值；嵌套函数 / 闭包及捕获修改外部变量；Lambda / 匿名函数；参数传递方式（函数内部修改数组或重新赋值参数时调用方是否感知）。
15. **`Classes`（类 / 结构体）**：包含字段、构造器与方法的自定义类型及其使用。随后展示该语言在 LeetCode 中标准的 `ListNode` 与 `TreeNode` 定义：构建小型链表 / 二叉树、遍历并检查空子节点。

对于内容较长的章节，可以使用 `###` 三级标题进行合理划分。

### 语言缺少某项特性时的处理

**请务必保留该章节及其 `##` 标题。** 在代码块首行通过注释说明该语言缺少此特性，紧接着展示地道的替代实现方案。这种语言间的对比对读者非常有价值。例如，Go 语言在 `Tuples` 章节的开头可以写成：

```go
// Go 没有内置元组类型。函数支持直接返回多个值...
package main

import "fmt"

func minMax(nums []int) (int, int) {
	lo, hi := nums[0], nums[0]
	for _, n := range nums {
		lo, hi = min(lo, n), max(hi, n)
	}
	return lo, hi
}

// ...轻量级 struct 可以直接用作 map 的复合键
type point struct{ r, c int }

func main() {
	lo, hi := minMax([]int{3, 1, 4})
	fmt.Println(lo, hi) // => 1 4

	visited := map[point]bool{{0, 1}: true}
	fmt.Println(visited[point{0, 1}]) // => true
}
```

若标准库完全未提供对应数据结构（例如 JavaScript 和 Swift 标准库均未内置堆），请编写一段适合在 LeetCode 刷题时手写的最简精简实现，并在注释中说明 LeetCode 判题环境中已提供的内置库（请先自行在 LeetCode 确认）。

### 语言特有章节

如果某个 `##` 标题不在上述 15 个通用章节之中，则属于语言特有章节。请将其紧邻放置在第一个依赖它的通用章节之前，并遵循完全相同的样式规则。以下是推荐建议（可根据实际情况合理调整）：

| 语言 | 推荐特有章节 |
|---|---|
| Rust | 在 `Arrays` 之前添加 `Ownership and Borrowing`；在 `Variables` 中讲解 `Option` |
| Java | 在 `Arrays` 之前添加 `Primitive and Boxed Types`（基本类型与包装类型） |
| C++ | 在 `Functions` 之前添加 `References and Pointers`（引用与指针） |
| Go | 在 `Functions` 之前添加 `Pointers`（指针）；在 `Arrays` 中说明底层共享切片数组机制 |
| TypeScript | 在 `Variables` 之后添加 `Types`（类型标注），篇幅以读懂 LeetCode 题意为准 |
| Kotlin、Swift | 在 `Variables` 中直接覆盖可空性（nullability），无需单独拆分章节 |
| Python、JavaScript、C# | 无需额外增加特有章节 |

### 篇幅控制

`sheets/python.md` 约为 750 行。各语言速查表长度通常应控制在基准的 1.5 倍以内（约 1100 行以内）。若内容超出，优先压缩细节深度，而非裁减知识点覆盖面。

## 代码块规范

### 语言标签（Tags）

- 带有本速查表 id 标签的代码块（如 `go.md` 中的 ` ```go `）属于**可运行测试块**：检查器会自动编译并执行它们。
- ` ```bash `、` ```sh ` 和 ` ```text ` 代码块仅用于前台排版展示（例如 `Running a Program` 章节中的终端运行指令）。
- ` ```text stdin ` 用于指定示例的标准输入数据（详见 [输入](#输入)）。
- 所有 Markdown 代码块都必须标明语言标签，禁止出现未标注语言的空代码块。

### 每个可运行代码块独立自洽

每个可运行代码块必须能单独编译并执行：它拥有独立的 `import` / `include` / `using`，不依赖且不共享其他代码块中的任何上下文。读者应当能够单次复制任意一个代码块直接运行。

### 入口函数（Entry points）

- **Python、JavaScript、TypeScript、C#、Swift** 原生支持顶层语句，因此代码块可以直接书写执行语句。（C# 采用顶层语句模式，并默认启用隐式 using）。
- **Java、C++、Go、Kotlin、Rust**：若代码块中未编写入口函数（`main`），检查器在测试时会自动为你生成包装。代码块最顶部的导入语句（`import`、`#include`、`using namespace std;`、`use`）会被提取并提升至入口外部，其余代码被置入 `main` 函数内。因此，简短示例只需书写语句本身：

  ```cpp
  #include <iostream>
  using namespace std;

  // CAREFUL: integer division truncates toward zero
  cout << -3 / 2 << endl;  // => -1
  ```

- 若代码块需要顶层声明（自定义函数、类、结构体），请编写包含 `main` 的完整程序（如上述 Go 元组示例）：包含文件所需的一切声明（Go 的 `package main`、imports）以及 `main` 函数。检查器检测到已有 `main` 时不会对其进行额外包装。
- C++ 代码块在 include 之后统一添加 `using namespace std;`，以贴合 LeetCode 题目签名的风格（如 `vector<int>& nums`）。在 `Running a Program` 章节中说明一次：这属于刷题练习习惯，大型工程中应尽量避免全局引入命名空间。

### 输出注释（Output comments）

代码块输出的每一行文本，都必须通过以 `=>` 开头的注释进行标注：Python 中为 `# => 2`，其余多数语言中为 `// => 2`。

```go
import "fmt"

// CAREFUL: integer division truncates toward zero
fmt.Println(-3 / 2) // => -1
```

- **紧随输出发生处：** 通常写在打印语句的行尾。对于循环结构，可以在循环结束后追加一行 `=>` 注释汇总所有打印值（如 `// => 0 1 2`），或逐行标注。当调用函数产生打印时，将注释置于*调用该函数*的代码行末尾，使注释顺序与实际执行时序保持一致。
- **`=>` 后面只写输出值：** 解释性说明或 `CAREFUL:` 陷阱提示应写在代码上方，禁止夹杂在 `=>` 之后。
- **检查器验证机制：** 检查器按源码顺序收集代码块中的所有 `=>` 注释，按空白字符分词，与程序标准输出（stdout）的分词结果进行逐项全等比对。存在无 `=>` 注释的输出，或注释中声明了未实际输出的值，均会导致测试失败。行尾换行符不参与比较，因此循环的多行输出可以合并写在一行注释中。
- **输出必须具有确定性：** 禁止按语言无法保证的随机顺序打印（如 Go map 迭代、Python 字符串 set、各种无序哈希表）。请先对其进行排序，或仅打印集合大小与成员从属关系。若展示乱序本身即为示例目的，请标记 `nocheck`。
- **重要数值务必打印并标注 `=>`：** 任何值得告知读者的运行数值，都应通过 print 输出并添加 `=>` 注释交由检查器自动化核查，切勿仅在普通注释中做未经验证的断言。
- 自动化检查只比对 stdout。程序以任何非 0 状态码退出均视为执行失败。

### 输入（Input）

需要从 stdin 读取数据的代码块，其紧邻下方应放置一个 ` ```text stdin ` 代码块存放测试样例。检查器会将该内容作为标准输入喂给程序，网站也会将其作为示例输入展示给读者。未附带输入块的代码块在运行时接收空输入。

````markdown
```python
n = int(input())
nums = list(map(int, input().split()))
print(n, sum(nums))  # => 3 6
```

```text stdin
3
1 2 3
```
````

### 例外情况：`norun` 与 `nocheck`

请极谨慎地使用这两个标记；代码审查时会重点确认其合理性。

- ` ```go norun `：只供展示，不参与编译运行。其代码块第一行必须是一句解释不予运行理由的注释。
- ` ```go nocheck `：参与编译并执行（必须能成功编译且退出码为 0），但不进行输出比对。仅用于刻意展示非确定性输出的场景。块内不得包含 `=>` 注释。

### 错误示范写在注释中

语法错误或无法通过编译的反面代码示例，必须通过注释形式展示，严禁直接作为裸代码放入运行块中：

```python
# n++  # 语法错误：Python 没有 ++ 或 -- 运算符
```

### 注释与命名规范

- 简明精炼：注释通常只写一行，最多不超过两行。
- 一律使用单行注释（`#` 或 `//`），不使用多行块级注释。
- 陷阱标记一律以 `CAREFUL:` 开头。
- 涉及跨语言对比时，指名具体语言（如“Python 中结果为 -2”）或表述为“多数语言中”。
- 严格遵循目标语言的官方命名规范（Python 和 Rust 用 snake_case，Java 和 Go 用 camelCase 等）。唯一的例外是 LeetCode 的固有命名（如 `Solution` 类及方法），直接沿用 LeetCode 的定义即可。

## 运行检查器

检查器使用预构建的固定版本 Docker 镜像运行速查表中的每个代码块。本地环境只需安装 Python 3.10+ 和 Docker 即可：

```bash
python3 tools/check.py sheets/go.md           # 检查单份速查表（格式检查 + Docker 运行验证）
python3 tools/check.py --all                  # 检查全部速查表
python3 tools/check.py --local sheets/go.md   # 使用本机已安装的工具链（不保证版本一致性）
```

当所有示例全部通过时，每份速查表在终端输出一行绿色的通过信息；如有失败，会精确输出速查表文件名以及出错代码块在 Markdown 中的对应行号。GitHub Actions CI 在每个 PR 中都会运行同一套严格检查。详细原理及代码约束请参阅 [`tools/README.md`](tools/README.md)（或中文版 [`tools/README.zh-CN.md`](tools/README.zh-CN.md)）。

## 添加新语言

1. 在 `tools/` 目录下添加该语言的运行适配器、Docker 镜像构建文件以及测试 fixture，并在 CI matrix 中注册（详见 [`tools/README.md`](tools/README.md)）。建议将工具链适配作为独立 PR 提交。
2. 随后在 `sheets/<id>.md` 中添加对应语言的速查表文件。

## 提交前自查清单

- [ ] 文件头部格式规范，全部 15 个通用章节标题齐全且排列顺序正确（检查器 lint 会自动化校验此项）。
- [ ] 每个章节列出的必查要点均有代码覆盖；若语言缺少该特性，已在注释中明确说明并展示了替代方案。
- [ ] 代码符合该语言资深开发者的地道写法，而非从 Python 逐句生搬硬套。
- [ ] 该语言的核心陷阱已添加 `CAREFUL:` 标出（可对照下文的常见陷阱清单）。
- [ ] 每个打印输出都有对应的 `=>` 注释，没有任何未经工具链验证的凭空断言。
- [ ] `norun` / `nocheck` 极少使用且首行附带了充分的理由说明。
- [ ] 杜绝大段叙述性文本；注释简短，每处一至两行。
- [ ] 全文总行数控制在约 1100 行以内。
- [ ] 本地运行 `python3 tools/check.py sheets/<id>.md` 检查全部通过。

## 值得覆盖的语言陷阱清单

以下是部分主流语言的典型陷阱梳理（不仅限于此）。在写入速查表之前，请务必通过实际运行验证其行为：

- **Python:** `-3 // 2 == -2`；`-10 % 3 == 2`；`[[0] * n] * m` 产生的二维列表会共享同一行对象；整型永不溢出但 `math.pow` 返回的浮点数会溢出；字符串构成的 set 每次运行时的迭代顺序均随机变化。
- **Java:** `int` 溢出时静默回绕（wrap）；两个 `Integer` 使用 `==` 比较的是对象引用地址（由于数值缓存机制，仅在 -128 到 127 之间时看起来正确）；`char + int` 运算结果会被自动提升为 `int`；`Arrays.sort(int[])` 不支持传入自定义比较器（必须使用 `Integer[]`）；`%` 取余结果与被除数符号一致。
- **C++:** 整数除法向零截断；`%` 取余结果与被除数符号一致；`size()` 返回无符号整数，空 vector 执行 `v.size() - 1` 会发生下溢回绕为一个极大的正数；`priority_queue` 默认为最大堆；`unordered_map::operator[]` 访问不存在的键时会隐式插入默认键值对；有符号整数溢出属于未定义行为（UB）。
- **JavaScript:** 默认 `sort()` 将所有元素转换为字符串进行字典序比较（`[10, 9, 1].sort()` 结果为 `[1, 10, 9]`）；所有数字均为双精度浮点数（整数除法需用 `Math.trunc`；安全整数范围仅到 2^53 − 1，超出需用 `BigInt`）；`==` 隐式类型转换 vs `===`；标准库无内置堆或双端队列，`shift()` 时间复杂度为 O(n)；`%` 与被除数符号一致；普通对象字面量 `{}` 与 `Map` 作为哈希表的差异。
- **TypeScript:** 拥有与 JavaScript 完全相同的运行时陷阱；类型系统仅存在于编译期，运行时所有类型标注均被擦除。
- **C#:** `PriorityQueue<TElement, TPriority>` 为最小堆且需要独立传入优先级；标准库无原生双端队列（可用 `LinkedList<T>` 替代）；`int` 溢出默认静默回绕（除非置于 `checked` 块中）；`Dictionary` 索引器访问不存在的键会直接抛出异常。
- **Go:** map 遍历顺序完全随机；标准库无内置 set 类型（通常用 `map[T]bool` 或 `map[T]struct{}` 替代）；`append` 操作在容量足够时会复用并覆写原切片的底层共享数组；`container/heap` 要求开发者手动实现接口；未使用的变量与 import 会导致编译报错；整数除法向零截断。
- **Kotlin:** 两个 `Int` 进行 `/` 运算为整数除法；`map[key]` 返回可空类型值；`val` 只读引用 vs `var` 可变变量；堆使用 Java 的 `PriorityQueue`；`IntArray`（基本类型数组）vs `Array<Int>`（对象包装数组）的区别。
- **Swift:** `String` 不支持直接通过 `Int` 整数索引；标准库无内置堆或双端队列；整数算术溢出会直接在运行时触发崩溃（trap）；数组与字典属于值类型（赋值或传参时遵循写时复制语义）。
- **Rust:** 整数算术溢出在 debug 模式下触发 panic，而在 release 优化模式下发生回绕；`BinaryHeap` 默认为最大堆（实现最小堆需用 `Reverse` 包装）；`String` 不支持通过整数直接索引访问；`usize` 无符号数下溢（空 vector 上执行 `v.len() - 1` 会 panic）；所有权移动（move）vs 引用借用（borrow）；LeetCode 中的链表节点和树节点类型极其繁琐（如 `Option<Rc<RefCell<TreeNode>>>`）。
