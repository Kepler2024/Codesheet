# Swift 速查表

> 适用于 Swift 6.1

本快速参考用于学习或温习 Swift 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```swift
// 脚本从上到下顺序执行；无需显式编写 main() 入口函数
print("Hello, World!") // => Hello, World!
```

```bash
swift hello.swift    # 或先编译再运行：swiftc hello.swift -o hello && ./hello
```

## 变量

```swift
// let 声明常量，var 声明变量。尽可能优先使用 let。
let limit = 100
// limit = 200  // error: cannot assign to value: 'limit' is a 'let' constant
var n = 0
n = 5

// 变量类型根据初始值自动推导，一旦确定不可更改
// n = "abc"  // error: cannot assign value of type 'String' to type 'Int'

// 显式类型标注：Int（64 位）、Double、Bool、Character、String
let ratio: Double = 0.5
let done: Bool = false
let letter: Character = "a"  // Character 类型同样使用双引号
print(ratio, done, letter) // => 0.5 false a

// "\(expression)" 在字符串中内嵌表达式
print("n is \(n)") // => n is 5

// 注意：数值类型绝不会发生隐式转换；必须显式转换类型
// let bad = n * ratio  // error: 二元运算符 '*' 无法应用于 'Int' 和 'Double'
print(Double(n) * ratio) // => 2.5

// 利用元组交换变量
var a = 1, b = 2
(a, b) = (b, a)
print(a, b) // => 2 1

// 自增运算：Swift 没有 ++ 或 -- 运算符
n += 1
// n++  // error: 作用域内找不到运算符 '++'
print(n) // => 6
```

```swift
// 只有可选类型（标注 ? 的 Optional）才能赋值为 nil
var name: String? = nil
// var bad: String = nil  // error: 'nil' 无法初始化非空类型 'String'

// 安全调用 ?. 仅在非空时执行；空合并运算符 ?? 提供备用默认值
print(name?.count ?? -1) // => -1

// if let 在可选值有值时安全解包
name = "swift"
if let name {
    print(name.count) // => 5
}

// 强制解包 ! 遇到 nil 时会直接崩溃
print(name!.uppercased()) // => SWIFT

// 注意：直接打印可选值会带有 Optional(...) 包装
print(name as Any) // => Optional("swift")

// guard let 用于前置条件检查与提前返回，常见于函数头部
func firstChar(_ s: String?) -> Character {
    guard let s, let c = s.first else { return "?" }
    return c
}
print(firstChar(nil), firstChar("hi")) // => ? h
```

## 条件语句

```swift
// 条件表达式两端无需圆括号，花括号 {} 为强制必须书写
var n = 1
if n > 2 {
    n -= 1
} else if n == 2 {
    n *= 2
} else {
    n += 2
}
print(n) // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
let m = 5
if n > 0 && m > 0 {
    print("both") // => both
}
print(!true, true || false) // => false true

// 注意：条件必须是 Bool 类型；0 和 nil 不会被视为假值
// if n { }  // error: 'Int' 不能作为布尔类型使用；应写为 '!= 0'

// 三元条件运算符
let parity = n % 2 == 0 ? "even" : "odd"
print(parity) // => odd

// switch 必须穷尽所有可能；分支默认不贯穿，且支持范围匹配
switch n {
case ..<0:
    print("negative")
case 0..<10:
    print("small") // => small
default:
    print("large")
}

// if 和 switch 均可作为表达式直接返回值
let size = if n < 10 { "small" } else { "large" }
print(size) // => small
```

## 循环

```swift
var n = 0
while n < 3 {
    print(n)
    n += 1
}
// => 0 1 2

// i 从 0 到 4：..< 排除右端点（半开区间）
for i in 0..<5 {
    print(i)
}
// => 0 1 2 3 4

// i 从 2 到 5：... 包含右端点（闭区间）
for i in 2...5 {
    print(i)
}
// => 2 3 4 5

// i 从 5 递减到 2
for i in stride(from: 5, through: 2, by: -1) {
    print(i)
}
// => 5 4 3 2

for i in 0..<10 {
    if i == 1 {
        continue
    }
    if i == 4 {
        break
    }
    print(i)
}
// => 0 2 3

// 注意：上界小于下界的区间会导致运行时崩溃，例如 n=0 时 0..<n-1
// for i in 0..<(-1) { }  // 运行时致命错误：要求 lowerBound <= upperBound

// 下划线 _ 忽略未使用的循环变量
for _ in 0..<2 {
    print("hi")
}
// => hi hi

// 标签允许 break 或 continue 作用于指定的外层循环
outer: for i in 0..<3 {
    for j in 0..<3 {
        if j > i {
            continue outer
        }
        if i == 2 {
            break outer
        }
        print(i, j)
    }
}
// => 0 0 1 0 1 1
```

## 数学运算

```swift
import Foundation

// 两个 Int 相除 / 为整数除法（向下截断）
print(5 / 2, 5.0 / 2) // => 2 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
print(-3 / 2) // => -1

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
print(-10 % 3) // => -1

// 始终非负的模运算，常用于循环数组索引
print((-10 % 3 + 3) % 3) // => 2

// floor、ceil、sqrt 和 pow 来自 Foundation 框架并作用于 Double
print(floor(-1.5), ceil(-1.5)) // => -2.0 -1.0
let p: Double = pow(2, 10)
print(sqrt(16.0), p, abs(-7)) // => 4.0 1024.0 7
print(max(3, 8), min(3, 8, 1)) // => 8 1

// Double 转换为 Int 向零截断小数部分
print(Int(sqrt(17.0))) // => 4

// 极值与无穷大
print(Int.max, Int.min) // => 9223372036854775807 -9223372036854775808
print(Int32.max, Double.infinity) // => 2147483647 inf

// 注意：普通整数运算溢出会导致程序直接崩溃而非静默回绕
var big = Int.max
// big += 1  // 运行时因溢出崩溃
// &+、&- 和 &* 显式允许有符号按模回绕
big = big &+ 1
print(big) // => -9223372036854775808
```

## 输入与输出

```swift
import Foundation

// print 以空格分隔多个参数，并在末尾换行
print("a", 1, true) // => a 1 true

// 自定义分隔符或末尾结束符
print(1, 2, 3, separator: ",") // => 1,2,3
print("same", terminator: " ")
print("line") // => same line

// 数组打印自带方括号，内含的字符串会附带双引号
let nums = [1, 2, 3]
print(nums, ["a"]) // => [1, 2, 3] ["a"]

// 转换为普通空格分隔文本输出
print(nums.map(String.init).joined(separator: " ")) // => 1 2 3

// 保留固定小数位数输出
print(String(format: "%.2f", 3.14159)) // => 3.14
```

```swift
// readLine() 读取单行文本（自动去除换行符），流末尾返回 nil。
// Int(text) 解析非法时返回 nil，因此配合 ! 解包
let n = Int(readLine()!)!
let nums = readLine()!.split(separator: " ").map { Int($0)! }
print(n, nums.reduce(0, +)) // => 3 6
```

```text stdin
3
1 2 3
```

```swift
// 当数字可能跨行分布时，循环读取直至 readLine() 返回 nil
var tokens: [Int] = []
while let line = readLine() {
    tokens += line.split(separator: " ").map { Int($0)! }
}
let n = tokens[0]
print(n, tokens[1...n].reduce(0, +)) // => 3 15
```

```text stdin
3
4 5
6
```

## 数组

```swift
// 数组可根据需要动态扩容；[Int] 为其类型注解
var arr = [1, 2, 3]
print(arr, arr.count) // => [1, 2, 3] 3

// 当作栈使用：在尾部 append 和 removeLast 的时间复杂度均为 O(1)
arr.append(4)
print(arr.removeLast()) // => 4

// 查看栈顶元素：last 返回 Optional，空数组时为 nil
print(arr.last ?? -1) // => 3

// 在中间 insert 与 remove(at:) 的时间复杂度为 O(n)
arr.insert(7, at: 1)
print(arr) // => [1, 7, 2, 3]
arr.remove(at: 0)
print(arr) // => [7, 2, 3]

// 创建长度为 n 且填充默认值的数组
print(Array(repeating: 0, count: 5)) // => [0, 0, 0, 0, 0]

// 注意：不支持负数索引，越界访问会导致运行时致命错误
// arr[-1]  // 致命错误：索引越界
print(arr[arr.count - 1]) // => 3

// prefix、suffix 和 dropFirst 截取数组片段
let nums = [1, 2, 3, 4]
print(nums.prefix(2), nums.suffix(2), nums.dropFirst()) // => [1, 2] [3, 4] [2, 3, 4]

// 注意：子数组切片（ArraySlice）保留原始数组的下标索引，slice[0] 在此会崩溃；
// 用 Array(...) 包裹重新转为从 0 开始的标准数组
let part = nums[1..<3]
print(part, part.startIndex, Array(part)[0]) // => [2, 3] 1 2

// contains 与 firstIndex 为 O(n) 线性扫描；快速查找请使用 Set
print(nums.contains(3), nums.firstIndex(of: 3)!) // => true 2

// map、filter 和 reduce 均返回全新值
print(nums.map { $0 * 2 }, nums.filter { $0 % 2 == 0 }, nums.reduce(0, +)) // => [2, 4, 6, 8] [2, 4] 10

// 注意：Swift 中数组属于值类型（Value Type）：赋值会自动创建独立副本（写时复制）
var copy = nums
copy[0] = 99
print(nums[0], copy[0]) // => 1 99
```

```swift
let nums = [10, 20, 30]

// 通过索引范围遍历
for i in nums.indices {
    print(nums[i])
}
// => 10 20 30

// 直接遍历元素值
for n in nums {
    print(n)
}
// => 10 20 30

// 同时获取索引和值
for (i, n) in nums.enumerated() {
    print(i, n)
}
// => 0 10 1 20 2 30

// 双数组同步遍历：zip 按较短数组截断
for (n, ch) in zip(nums, ["a", "b", "c"]) {
    print(n, ch)
}
// => 10 a 20 b 30 c
```

```swift
var nums = [5, 4, 7, 3, 8]

// reverse 和 sort 均为原地操作
nums.reverse()
print(nums) // => [8, 3, 7, 4, 5]
nums.sort()
print(nums) // => [3, 4, 5, 7, 8]
nums.sort(by: >)
print(nums) // => [8, 7, 5, 4, 3]

// sorted() 返回新排序数组，不修改原数组
let words = ["bob", "alice", "jane", "doe"]
print(words.sorted(), words[0]) // => ["alice", "bob", "doe", "jane"] bob

// 注意：reversed() 返回惰性视图；需用 Array(...) 包装以重新物化为数组
print(words.reversed()) // => ReversedCollection<Array<String>>(_base: ["bob", "alice", "jane", "doe"])
print(Array(words.reversed())) // => ["doe", "jane", "alice", "bob"]

// 自定义排序闭包：$0 应排在 $1 前面时返回 true（先按长度升序，再按字典序）
print(words.sorted { ($0.count, $0) < ($1.count, $1) }) // => ["bob", "doe", "jane", "alice"]

// 对二元数组按第二项元素排序
var pairs = [[1, 3], [2, 1], [3, 2]]
pairs.sort { $0[1] < $1[1] }
print(pairs) // => [[2, 1], [3, 2], [1, 3]]
```

```swift
// 3 行 4 列的二维数组
var grid = Array(repeating: Array(repeating: 0, count: 4), count: 3)
grid[0][0] = 1
print(grid) // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
print(grid.count, grid[0].count) // => 3 4

// 由于数组是值类型，每一行完全独立：不存在 Python 中的行对象引用共享陷阱，
// 回溯算法保存路径时直接追加也不会被后续修改篡改
var path = [1, 2]
var res: [[Int]] = []
res.append(path)
path[0] = 9
print(res) // => [[1, 2]]
```

## 字符串

```swift
let s = "abc"

// 注意：Swift String 无法直接通过 Int 整数索引访问
// s[0]  // error: 无法直接使用 Int 下标索引 String

// LeetCode 常见高效做法：先一次性转为 [Character] 数组，后续即可随意下标访问
let chars = Array(s)
print(chars[0], chars[chars.count - 1]) // => a c

// first 与 last 为可选类型的 Character?
print(s.first!, s.last!) // => a c

// 原生子串操作需使用 String.Index 索引
let i = s.index(s.startIndex, offsetBy: 1)
print(s[i...], s.prefix(2), s.dropFirst()) // => bc ab bc

// var 修饰的 String 可变；+= 与 append 操作十分高效
var t = "ab"
t += "c"
t.append("d")
print(t) // => abcd

// 字符串与数字互转；Int(text) 在格式非法时返回 nil
print(Int("123")! + 1, String(123) + "4") // => 124 1234
print(Int("12a") == nil) // => true

// Character 与字符编码互转：asciiValue 为 UInt8?（非 ASCII 字符返回 nil）
let c: Character = "c"
print(c.asciiValue!, Character(UnicodeScalar(UInt8(98)))) // => 99 b

// 计算小写字母在 26 大小数组中的偏移索引
print(Int(c.asciiValue! - Character("a").asciiValue!)) // => 2

// 与多数语言不同，split 默认自动忽略连续分隔符产生的空片段
let words = "the quick  brown fox".split(separator: " ")
print(words.count) // => 4
print(words.joined(separator: "-")) // => the-quick-brown-fox

// == 和 < 直接按字典序比较字符串
print("apple" < "banana", "a" == "a") // => true true

print(String(s.reversed()), s.contains("bc"), s.count) // => cba true 3
print(c.isLetter, Character("7").isNumber, s.uppercased()) // => true true ABC
```

## 双端队列

```swift
// Swift 标准库未提供队列或双端队列。注意：removeFirst() 的时间复杂度为 O(n)。
// 在 BFS 中，更推荐维护自增的头指针下标来读取元素
var queue = [1, 2, 3]
var head = 0
while head < queue.count {
    let node = queue[head]
    head += 1
    print(node)
}
// => 1 2 3

// 也可以按层遍历，每次将下一层构建为全新数组。
//（此处节点 n 的子节点为 2n 和 2n+1，类似堆形态的二叉树）
var level = [1]
var depth = 0
while !level.isEmpty {
    var next: [Int] = []
    for node in level where node < 4 {
        next += [node * 2, node * 2 + 1]
    }
    print(depth, level)
    level = next
    depth += 1
}
// => 0 [1] 1 [2, 3] 2 [4, 5, 6, 7]
```

```swift
// 当需要真正的双端队列时，基于环形缓冲区（Ring Buffer）实现两端均为 O(1) 操作。
//（LeetCode 环境中也提供了 swift-collections 库中的 Deque）
struct Deque<T> {
    private var slots: [T?] = Array(repeating: nil, count: 8)
    private var head = 0
    private(set) var count = 0

    // 环形数组中的绝对索引映射
    private func slot(_ i: Int) -> Int { (head + i) % slots.count }

    // 容量满时扩容为 2 倍，并按逻辑顺序重排元素
    private mutating func growIfFull() {
        guard count == slots.count else { return }
        slots = (0..<count).map { slots[slot($0)] } + Array(repeating: nil, count: count)
        head = 0
    }

    var first: T? { count == 0 ? nil : slots[head] }
    var last: T? { count == 0 ? nil : slots[slot(count - 1)] }

    mutating func append(_ x: T) {
        growIfFull()
        slots[slot(count)] = x
        count += 1
    }

    mutating func prepend(_ x: T) {
        growIfFull()
        head = (head - 1 + slots.count) % slots.count
        slots[head] = x
        count += 1
    }

    mutating func popFirst() -> T? {
        guard let x = first else { return nil }
        slots[head] = nil
        head = slot(1)
        count -= 1
        return x
    }

    mutating func popLast() -> T? {
        guard let x = last else { return nil }
        slots[slot(count - 1)] = nil
        count -= 1
        return x
    }
}

var dq = Deque<Int>()
dq.append(1)
dq.append(2)
dq.prepend(0)
print(dq.first!, dq.last!, dq.count) // => 0 2 3
print(dq.popFirst()!, dq.popLast()!, dq.count) // => 0 2 1
```

## 哈希集合

```swift
var seen = Set<Int>()
seen.insert(1)
seen.insert(2)

// insert 返回 (inserted, memberAfterInsert) 元组；已存在时 inserted 为 false
print(seen.insert(2).inserted) // => false
print(seen.count) // => 2

print(seen.contains(1), seen.contains(3)) // => true false

// remove 返回被删除的元素，不存在时返回 nil
print(seen.remove(2) as Any, seen.remove(42) as Any) // => Optional(2) nil

// 从数组快速构建集合
let set = Set([3, 1, 3, 2])

// 注意：Set 的遍历顺序随机且各次运行不确定；若需固定顺序请先调用 sorted()
print(set.sorted()) // => [1, 2, 3]

// union、intersection 和 subtracting 均返回全新集合
let a: Set = [1, 2, 3]
let b: Set = [2, 3, 4]
print(a.union(b).sorted(), a.intersection(b).sorted(), a.subtracting(b).sorted()) // => [1, 2, 3, 4] [2, 3] [1]
```

## 哈希映射

```swift
// [Key: Value] 为字典类型；[:] 表示空字典
var scores: [String: Int] = [:]
scores["alice"] = 88
scores["bob"] = 77
print(scores.count) // => 2

scores["alice"] = 80

// 注意：读取字典的键返回可选值 Optional，键不存在时为 nil
print(scores["alice"]!, scores["zoe"] ?? 0) // => 80 0

// 下标访问同时支持指定保底默认值
print(scores["zoe", default: 0]) // => 0

// 检查键是否存在
print(scores["alice"] != nil) // => true

// 将键赋值为 nil 即可删除该键
scores["alice"] = nil
print(scores.count, scores["alice"] == nil) // => 1 true
```

```swift
let scores = ["alice": 90, "bob": 70]

// 注意：字典遍历顺序随机；需要固定顺序时先对键排序
for key in scores.keys.sorted() {
    print(key, scores[key]!)
}
// => alice 90 bob 70

print(scores.values.sorted()) // => [70, 90]

// 按键排序后的条目遍历；每个条目可直接解构为 (key, value)
for (key, value) in scores.sorted(by: { $0.key < $1.key }) {
    print(key, value)
}
// => alice 90 bob 70

// 统计频次：对带默认值的下标直接 += 即可自动初始化并自增
var count: [Character: Int] = [:]
for ch in "banana" {
    count[ch, default: 0] += 1
}
print(count["a"]!, count["n"]!) // => 3 2

// 分组聚合逻辑相同
var groups: [String: [String]] = [:]
for word in ["eat", "tea", "tan"] {
    groups[String(word.sorted()), default: []].append(word)
}
print(groups["aet"]!) // => ["eat", "tea"]
```

## 元组

```swift
// 元组将多个值组合在一起；元素可附加命名标签
func minMax(_ nums: [Int]) -> (min: Int, max: Int) {
    (nums.min()!, nums.max()!)
}

// 解构返回值，或通过属性名/位置索引访问字段
let (lo, hi) = minMax([3, 1, 4])
print(lo, hi) // => 1 4
let r = minMax([5, 9])
print(r.min, r.1) // => 5 9

// 元组天然支持逐元素比较大小与相等
print((1, 2) < (1, 3), (1, 2) == (1, 2)) // => true true

// 注意：元组未遵循 Hashable 协议，因此不能直接作为 Set 元素或 Dictionary 键
// var visited: Set<(Int, Int)> = []  // error: '(Int, Int)' 未遵循 'Hashable'

// 使用遵循 Hashable 的小型 struct 代替（编译器自动合成哈希实现）
struct Cell: Hashable {
    let r: Int
    let c: Int
}
let visited: Set<Cell> = [Cell(r: 0, c: 1)]
print(visited.contains(Cell(r: 0, c: 1))) // => true

// 数组天然遵循 Hashable，因此 [Int] 也可直接作为键使用
let dist: [[Int]: Int] = [[0, 1]: 1]
print(dist[[0, 1]]!) // => 1
```

## 堆与优先队列

```swift
// Swift 标准库没有内置堆。（LeetCode 环境中预置了 swift-collections 库中的 Heap；
// 其他环境中可手写如下简易堆。）
// areSorted(a, b) 为 true 时表示 a 应该排在 b 前面出堆：< 即为最小堆。
struct Heap<T> {
    private var items: [T] = []
    private let areSorted: (T, T) -> Bool

    init(_ areSorted: @escaping (T, T) -> Bool) {
        self.areSorted = areSorted
    }

    var count: Int { items.count }
    var isEmpty: Bool { items.isEmpty }
    var peek: T? { items.first }

    mutating func push(_ x: T) {
        items.append(x)
        // 上浮（Sift up）：当新元素优先级高于父节点时向上交换
        var i = items.count - 1
        while i > 0 && areSorted(items[i], items[(i - 1) / 2]) {
            items.swapAt(i, (i - 1) / 2)
            i = (i - 1) / 2
        }
    }

    mutating func pop() -> T? {
        guard !items.isEmpty else { return nil }
        items.swapAt(0, items.count - 1)
        let top = items.removeLast()
        // 下沉（Sift down）：与子节点中优先级最高的节点向下交换
        var i = 0
        while true {
            let left = 2 * i + 1, right = left + 1
            var best = i
            if left < items.count && areSorted(items[left], items[best]) { best = left }
            if right < items.count && areSorted(items[right], items[best]) { best = right }
            if best == i { break }
            items.swapAt(i, best)
            i = best
        }
        return top
    }
}

// 最小堆
var minHeap = Heap<Int>(<)
for x in [5, 1, 8, 3, 2] {
    minHeap.push(x)
}
print(minHeap.peek!, minHeap.count) // => 1 5
while let x = minHeap.pop() {
    print(x)
}
// => 1 2 3 5 8

// 最大堆
var maxHeap = Heap<Int>(>)
[3, 1, 5].forEach { maxHeap.push($0) }
print(maxHeap.pop()!) // => 5

// 自定义优先级：(priority, name) 二元对按 priority 排序
var tasks = Heap<(Int, String)> { $0.0 < $1.0 }
tasks.push((2, "write"))
tasks.push((1, "plan"))
tasks.push((3, "ship"))
while let (priority, name) = tasks.pop() {
    print(priority, name)
}
// => 1 plan 2 write 3 ship
```

## 函数

```swift
// 调用方需提供形参标签；下划线 _ 表示调用时省略形参标签
func multiply(_ n: Int, by m: Int) -> Int {
    return n * m
}
print(multiply(3, by: 4)) // => 12

// 参数默认值；单表达式函数体可省略 return 关键字
func greet(_ name: String, greeting: String = "Hello") -> String {
    "\(greeting), \(name)!"
}
print(greet("Ann")) // => Hello, Ann!
print(greet("Ann", greeting: "Hi")) // => Hi, Ann!

// 闭包语法为 { (参数列表) in 函数体 }；$0、$1 为简写参数名
let square = { (x: Int) in x * x }
let add: (Int, Int) -> Int = { $0 + $1 }
print(square(5), add(2, 3)) // => 25 5

// 当最后一个实参为闭包时，可写在圆括号后方（尾随闭包语法）
print([1, 2, 3].map { $0 * 10 }) // => [10, 20, 30]

// 局部嵌套函数可直接读写外层封闭作用域的变量，非常适合编写递归 DFS 辅助函数
func sumDown(_ n: Int) -> Int {
    var total = 0
    func dfs(_ k: Int) {
        if k == 0 {
            return
        }
        total += k
        dfs(k - 1)
    }
    dfs(n)
    return total
}
print(sumDown(3)) // => 6
```

```swift
// 函数形参默认是常量，数组为值类型，因此传参时函数接收独立的值拷贝
func setFirst(_ arr: [Int]) -> [Int] {
    var arr = arr
    arr[0] = 99
    return arr
}
var nums = [1, 2]
print(setFirst(nums), nums) // => [99, 2] [1, 2]

// inout 关键字允许函数原地修改实参变量；调用方传参需显式附加 &
func double(_ arr: inout [Int]) {
    for i in arr.indices {
        arr[i] *= 2
    }
}
double(&nums)
print(nums) // => [2, 4]

// 类（class）实例为引用类型，函数可直接修改其内部属性
class Box {
    var value = 0
}
func fill(_ box: Box) {
    box.value = 7
}
let box = Box()
fill(box)
print(box.value) // => 7
```

## 类与数据结构

```swift
// 类（class）是引用类型；必须提供初始化器 init 显式为每个属性赋值
class Point: CustomStringConvertible, Comparable {
    var x: Int
    var y: Int

    init(_ x: Int, _ y: Int) {
        self.x = x
        self.y = y
    }

    func distSq() -> Int {
        x * x + y * y
    }

    // 可选：实现 CustomStringConvertible 自定义打印输出
    var description: String { "Point(\(x), \(y))" }

    // 可选：实现 Comparable（重载 < 和 ==）以支持直接排序
    static func < (a: Point, b: Point) -> Bool { a.distSq() < b.distSq() }
    static func == (a: Point, b: Point) -> Bool { a.x == b.x && a.y == b.y }
}

let p = Point(3, 4)
print(p.distSq()) // => 25
print(p) // => Point(3, 4)
print([Point(2, 2), Point(1, 0)].sorted()) // => [Point(1, 0), Point(2, 2)]

// 结构体（struct）是值类型：自动获得逐成员构造器，赋值时执行拷贝
struct Cell {
    var r: Int
    var c: Int
}
let c1 = Cell(r: 1, c: 2)
var c2 = c1
c2.r = 9
print(c1.r, c2.r) // => 1 9

// 注意：对类实例赋值仅复制引用地址，两个变量指向同一个底层对象
let q = p
q.x = 0
print(p.x) // => 0
```

```swift
// LeetCode 中 Swift 的单链表节点类
public class ListNode {
    public var val: Int
    public var next: ListNode?
    public init() { self.val = 0; self.next = nil; }
    public init(_ val: Int) { self.val = val; self.next = nil; }
    public init(_ val: Int, _ next: ListNode?) { self.val = val; self.next = next; }
}

// 1 -> 2 -> 3
let head = ListNode(1, ListNode(2, ListNode(3)))

// 遍历链表直到末尾（nil）；while let 安全解包每个节点
var node: ListNode? = head
while let current = node {
    print(current.val)
    node = current.next
}
// => 1 2 3
```

```swift
// LeetCode 中 Swift 的二叉树节点类
public class TreeNode {
    public var val: Int
    public var left: TreeNode?
    public var right: TreeNode?
    public init() { self.val = 0; self.left = nil; self.right = nil; }
    public init(_ val: Int) { self.val = val; self.left = nil; self.right = nil; }
    public init(_ val: Int, _ left: TreeNode?, _ right: TreeNode?) {
        self.val = val
        self.left = left
        self.right = right
    }
}

// 在 LeetCode 上，题目通常要求补全 Solution 类中的方法
class Solution {
    func maxDepth(_ root: TreeNode?) -> Int {
        guard let root else { return 0 }
        return 1 + max(maxDepth(root.left), maxDepth(root.right))
    }
}

// 中序遍历；空子节点表示为 nil
func inorder(_ node: TreeNode?) {
    guard let node else { return }
    inorder(node.left)
    print(node.val)
    inorder(node.right)
}

//     2
//    / \
//   1   3
let root = TreeNode(2, TreeNode(1), TreeNode(3))

inorder(root) // => 1 2 3
print(root.left?.left == nil) // => true
print(Solution().maxDepth(root)) // => 2
```
