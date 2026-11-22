# Kotlin 速查表

> 适用于 Kotlin 2.1

本快速参考用于学习或温习 Kotlin 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```kotlin
// 程序从顶级函数 fun main() 开始执行；无需包裹在类中
fun main() {
    println("Hello, World!") // => Hello, World!
}
```

```bash
kotlinc hello.kt -include-runtime -d hello.jar
java -jar hello.jar
```

```kotlin
// 下方绝大多数代码块均为 main 函数体内的核心代码，省略了外层样板。
// 实际独立运行时，保留顶部 import 并将代码放入 fun main() { ... } 即可。
println("Hello from main") // => Hello from main
```

## 变量

```kotlin
// val 声明只读变量（不可重新赋值）；var 声明可变变量。尽可能优先使用 val。
val limit = 100
// limit = 200  // error: 'val' cannot be reassigned.
var n = 0
n = 5
println(n) // => 5

// 变量类型根据初始值自动推导，一旦确定不可更改
// n = "abc"  // error: assignment type mismatch

// 显式类型标注：Int、Long、Double、Boolean、Char、String
val big: Long = 4_000_000_000L
val ratio: Double = 0.5
val done: Boolean = false
val letter: Char = 'a'

// "$name" 与 "${expression}" 用于字符串模板内嵌值
println("$big $ratio $done $letter") // => 4000000000 0.5 false a

// 注意：val 并不冻结对象内部状态；val 修饰的可变列表依然可以添加或修改元素
val path = mutableListOf(1)
path.add(2)
println(path) // => [1, 2]

// 利用 also 交换变量：执行块逻辑的同时返回 b 的旧值
var a = 1
var b = 2
a = b.also { b = a }
println("$a $b") // => 2 1

// 自增运算
n++
n += 2
println(n) // => 8
```

```kotlin
// 类型默认不可包含 null，除非显式添加 ? 声明为可空类型
var name: String? = null
// var bad: String = null  // error: null cannot be a value of a non-null type 'String'

// 安全调用 ?. 仅在非空时调用；Elvis 运算符 ?: 提供备用默认值
println(name?.length) // => null
println(name?.length ?: -1) // => -1

// 经过判空检查后，编译器会自动将类型智能转换（Smart Cast）为非空类型
name = "kotlin"
if (name != null) {
    println(name.length) // => 6
}

// !! 断言非空，若值为 null 则抛出 NullPointerException 异常
println(name!!.uppercase()) // => KOTLIN
```

## 条件语句

```kotlin
var n = 1
if (n > 2) {
    n--
} else if (n == 2) {
    n *= 2
} else {
    n += 2
}
println(n) // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
val m = 5
if (n > 0 && m > 0) {
    println("both") // => both
}
println("${!true} ${true || false}") // => false true

// if 是表达式，天然代替三元条件运算符（Kotlin 没有 cond ? a : b 语法）
val parity = if (n % 2 == 0) "even" else "odd"
println(parity) // => odd

// in 检查元素是否属于指定区间
println(n in 1..5) // => true

// 与 Java 不同，Kotlin 中 == 比较结构内容（调用 equals）；=== 比较引用地址
val s1 = "hi"
val s2 = StringBuilder("h").append("i").toString()
println("${s1 == s2} ${s1 === s2}") // => true false

// when 表达式代替 switch，同样具备返回值
val size = when {
    n < 0 -> "negative"
    n < 10 -> "small"
    else -> "large"
}
println(size) // => small
```

## 循环

```kotlin
var n = 0
while (n < 3) {
    println(n)
    n++
}
// => 0 1 2

// i 从 0 到 4：until（或 ..<）排除右端点（左闭右开）
for (i in 0 until 5) {
    println(i)
}
// => 0 1 2 3 4

// i 从 2 到 5：.. 包含右端点（闭区间）
for (i in 2..5) {
    println(i)
}
// => 2 3 4 5

// i 从 5 递减到 2
for (i in 5 downTo 2) {
    println(i)
}
// => 5 4 3 2

// step 设置循环步长
for (i in 0..10 step 3) {
    println(i)
}
// => 0 3 6 9

for (i in 0 until 10) {
    if (i == 1) {
        continue
    }
    if (i == 4) {
        break
    }
    println(i)
}
// => 0 2 3

// repeat(n) 执行块逻辑 n 次；it 为当前索引
repeat(2) {
    println("hi $it")
}
// => hi 0 hi 1

// 标签（name@）允许 break 或 continue 作用于指定的外层循环
outer@ for (i in 0 until 3) {
    for (j in 0 until 3) {
        if (j > i) {
            continue@outer
        }
        if (i == 2) {
            break@outer
        }
        println("$i $j")
    }
}
// => 0 0 1 0 1 1
```

## 数学运算

```kotlin
import kotlin.math.*

// 两个 Int 相除 / 为整数除法（向下截断）
println(5 / 2) // => 2
println(5 / 2.0) // => 2.5

// 必须显式转换：toDouble()、toInt()、toLong()
val a = 5
println(a.toDouble() / 2) // => 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）；floorDiv 则向下取整
println(-3 / 2) // => -1
println((-3).floorDiv(2)) // => -2

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）；mod 取模符号与除数一致
println(-10 % 3) // => -1
println((-10).mod(3)) // => 2

// floor、ceil、sqrt 和 pow 作用于 Double
println("${floor(-1.5)} ${ceil(-1.5)}") // => -2.0 -1.0
println("${sqrt(16.0)} ${2.0.pow(10)} ${abs(-7)}") // => 4.0 1024.0 7
// sqrt(16)  // error: 传入 Int 无法编译；须写成 16.0 或 n.toDouble()

// max 和 min 接收两个值；maxOf 与 minOf 可接收任意数量的参数
println("${max(3, 8)} ${min(3, 8)} ${maxOf(3, 8, 1)}") // => 8 3 8

// Double 转为 Int 时向零截断小数部分
println(sqrt(17.0).toInt()) // => 4

// 极值与无穷大
println("${Int.MAX_VALUE} ${Int.MIN_VALUE}") // => 2147483647 -2147483648
println(Long.MAX_VALUE) // => 9223372036854775807
println(Double.POSITIVE_INFINITY) // => Infinity

// 注意：Int 溢出会静默发生二进制回绕
var big = Int.MAX_VALUE
big++
println(big) // => -2147483648

// 当乘积可能超出范围时，务必在相乘前提前转为 Long
val side = 50_000
println(side * side) // => -1794967296
println(side.toLong() * side) // => 2500000000
```

## 输入与输出

```kotlin
// println 自动换行；print 不换行
print("same ")
println("line") // => same line

// 字符串模板内嵌变量与表达式
val name = "alice"
val score = 90
println("$name scored $score") // => alice scored 90
println("${name.uppercase()} has ${name.length} letters") // => ALICE has 5 letters

// 保留固定小数位数输出
println("%.2f".format(3.14159)) // => 3.14

// 列表打印自带方括号；joinToString 自定义拼接格式
val nums = listOf(1, 2, 3)
println(nums) // => [1, 2, 3]
println(nums.joinToString(" ")) // => 1 2 3

// 注意：直接对数组调用 println 会输出内存哈希标识；应使用 contentToString()
val arr = intArrayOf(1, 2, 3)
println(arr.contentToString()) // => [1, 2, 3]
```

```kotlin
// readln() 读取单行文本，自动剔除末尾换行（readlnOrNull() 在流末尾返回 null）
val n = readln().toInt()
val nums = readln().split(" ").map { it.toInt() }
println("$n ${nums.sum()}") // => 3 6
```

```text stdin
3
1 2 3
```

```kotlin
// 当数字可能跨行分布时，一次性读取全部输入并按连续空白字符切分
val tokens = System.`in`.bufferedReader().readText().split(Regex("\\s+")).filter { it.isNotEmpty() }
val n = tokens[0].toInt()
val nums = tokens.subList(1, n + 1).map { it.toInt() }
println("$n ${nums.sum()}") // => 3 15
```

```text stdin
3
4 5
6
```

## 列表与数组

```kotlin
// List 为只读接口；MutableList 允许修改。底层均为动态数组实现。
val fixed = listOf(1, 2, 3)
// fixed.add(4)  // error: unresolved reference 'add'
val arr = mutableListOf(1, 2, 3)
println("$arr ${arr.size}") // => [1, 2, 3] 3

// 当作栈使用：在尾部 add 和 removeLast 的时间复杂度均为 O(1)
arr.add(4)
println(arr.removeLast()) // => 4

// 查看栈顶元素
println(arr.last()) // => 3

// add(index, value) 与 removeAt(index) 在中间操作为 O(n)
arr.add(1, 7)
println(arr) // => [1, 7, 2, 3]
arr.removeAt(0)
println(arr) // => [7, 2, 3]

// 创建长度为 n 的列表；Lambda 接收当前索引 it 计算初始元素值
println(MutableList(5) { 0 }) // => [0, 0, 0, 0, 0]
println(List(4) { it * it }) // => [0, 1, 4, 9]

// 注意：不支持负数索引，越界访问抛出 IndexOutOfBoundsException；
// getOrNull 在越界时安全返回 null
// arr[-1]  // IndexOutOfBoundsException
println("${arr[arr.lastIndex]} ${arr.getOrNull(10)}") // => 3 null

// subList(from, to) 返回原列表视图（左闭右开）；slice、take 和 drop 产生独立新副本
val nums = listOf(1, 2, 3, 4)
println("${nums.subList(1, 3)} ${nums.slice(1..2)}") // => [2, 3] [2, 3]
println("${nums.take(2)} ${nums.drop(2)} ${nums.takeLast(1)}") // => [1, 2] [3, 4] [4]

// 解构赋值获取前几个元素
val (first, second) = nums
println("$first $second") // => 1 2

// in（contains）与 indexOf 为 O(n) 线性扫描；快速查找请使用 Set
println("${3 in nums} ${nums.indexOf(3)} ${nums.sum()} ${nums.max()}") // => true 2 10 4

// map 与 filter 均返回全新列表
println(nums.map { it * 2 }) // => [2, 4, 6, 8]
println(nums.filter { it % 2 == 0 }) // => [2, 4]
```

```kotlin
// IntArray 是原生基本类型 int[] 数组（非包装对象）。
// LeetCode 中 int[] 参数即映射为 IntArray。
val arr = IntArray(3)
val ones = IntArray(3) { 1 }
val lit = intArrayOf(3, 1, 2)
println("${arr.contentToString()} ${ones.contentToString()} ${lit.size}") // => [0, 0, 0] [1, 1, 1] 3

// 注意：IntArray 与 Array<Int> 不同；Array<Int> 存储包装类型 Integer 对象，内存开销更大
val boxed: Array<Int> = arrayOf(3, 1, 2)
println(boxed.sum()) // => 6

// 注意：数组上的 == 比较的是引用地址；比较元素内容必须使用 contentEquals
println("${lit == intArrayOf(3, 1, 2)} ${lit contentEquals intArrayOf(3, 1, 2)}") // => false true

// 数组与列表相互转换
val list: List<Int> = lit.toList()
val back: IntArray = list.toIntArray()
println("$list ${back.size}") // => [3, 1, 2] 3
```

```kotlin
val nums = listOf(10, 20, 30)

// 通过索引范围遍历
for (i in nums.indices) {
    println(nums[i])
}
// => 10 20 30

// 直接遍历元素值
for (n in nums) {
    println(n)
}
// => 10 20 30

// 同时获取索引和值
for ((i, n) in nums.withIndex()) {
    println("$i $n")
}
// => 0 10 1 20 2 30

// 双列表同步遍历：zip 按较短列表截断
for ((n, ch) in nums.zip(listOf("a", "b", "c"))) {
    println("$n $ch")
}
// => 10 a 20 b 30 c

// 注意：在 for 循环中直接删除集合元素会抛出 ConcurrentModificationException；
// 应使用 removeAll
val list = mutableListOf(1, 2, 3, 4)
list.removeAll { it % 2 == 0 }
println(list) // => [1, 3]
```

```kotlin
val nums = mutableListOf(5, 4, 7, 3, 8)

// reverse、sort 和 sortDescending 均为原地操作（作用于 MutableList 和 IntArray）
nums.reverse()
println(nums) // => [8, 3, 7, 4, 5]
nums.sort()
println(nums) // => [3, 4, 5, 7, 8]
nums.sortDescending()
println(nums) // => [8, 7, 5, 4, 3]

// sorted、sortedDescending 和 reversed 返回全新列表，不修改原集合
val words = listOf("bob", "alice", "jane", "doe")
println("${words.sorted()} ${words[0]}") // => [alice, bob, doe, jane] bob

// 自定义排序：sortedBy 提取排序键，sortedWith 传入比较器（先按长度，再按字母序）
println(words.sortedBy { it.length }) // => [bob, doe, jane, alice]
println(words.sortedWith(compareBy({ it.length }, { it }))) // => [bob, doe, jane, alice]

// 对二元对列表按第二项排序
val pairs = mutableListOf(1 to 3, 2 to 1, 3 to 2)
pairs.sortBy { it.second }
println(pairs) // => [(2, 1), (3, 2), (1, 3)]

// Array<IntArray>（LeetCode 的 int[][]）同样支持 sortBy 排序
val intervals = arrayOf(intArrayOf(3, 4), intArrayOf(1, 2))
intervals.sortBy { it[0] }
println(intervals.joinToString { it.contentToString() }) // => [1, 2], [3, 4]
```

```kotlin
// 3 行 4 列的二维数组；Lambda 每次独立生成一行新数组
val grid = Array(3) { IntArray(4) }
grid[0][0] = 1
println(grid.joinToString(" ") { it.contentToString() }) // => [1, 0, 0, 0] [0, 0, 0, 0] [0, 0, 0, 0]
println("${grid.size} ${grid[0].size}") // => 3 4

// 嵌套列表（List of lists）初始化同理
val rows = List(2) { mutableListOf<Int>() }
rows[0].add(5)
println(rows) // => [[5], []]

// 注意：在 Lambda 外部创建的行对象会导致所有槽位共享同一个数组引用
val row = IntArray(2)
val bad = Array(3) { row }
bad[0][0] = 1
println("${bad[1][0]} ${bad[2][0]}") // => 1 1

// 注意：在回溯算法中，必须保存路径的独立副本（如 toList()），而不是路径对象本身
val path = mutableListOf(1, 2)
val res = mutableListOf<List<Int>>(path, path.toList())
path[0] = 9
println(res) // => [[9, 2], [1, 2]]
```

## 字符串

```kotlin
val s = "abc"

// [] 获取 Char；substring(start, end) 左闭右开
println("${s[0]} ${s.substring(1)} ${s.substring(0, 2)} ${s.last()}") // => a bc ab c

// 注意：Kotlin 字符串具有不可变性
// s[0] = 'A'  // error: 无法按索引写入
// 若需修改字符，可转为 CharArray 修改后再构造新 String
val chars = s.toCharArray()
chars[0] = 'A'
println(String(chars)) // => Abc

// + 每次拼接都会分配新对象；在循环中构建字符串请使用 buildString
val upper = buildString {
    for (ch in "abc") {
        append(ch.uppercaseChar())
    }
}
println(upper) // => ABC

// 字符串与数字互转；toIntOrNull 在解析失败时安全返回 null
println("123".toInt() + 1) // => 124
println(123.toString() + "4") // => 1234
println("12a".toIntOrNull()) // => null

// Char 与字符编码互转
println("${'a'.code} ${98.toChar()}") // => 97 b

// 注意：与 Java 不同，Kotlin 中 Char + Int 结果仍为 Char，而 Char - Char 结果为 Int
println('a' + 1) // => b
println('c' - 'a') // => 2
println('7'.digitToInt()) // => 7

// 注意：split(" ") 会保留连续空格之间的空字符串；推荐使用正则表达式切分
println("a  b".split(" ")) // => [a, , b]
val words = "the quick  brown fox".split(Regex("\\s+"))
println(words.size) // => 4
println(words.joinToString("-")) // => the-quick-brown-fox

// == 比较内容；< 和 > 直接按字典序比较字符串
println("${"apple" < "banana"} ${"a" == "a"}") // => true true

println("${"hello".reversed()} ${"hello".contains("ell")} ${"hello".indexOf('l')}") // => olleh true 2
println("${'7'.isDigit()} ${'x'.isLetter()} ${"Hi".lowercase()} ${"ab".repeat(2)}") // => true true hi abab
```

## 双端队列

```kotlin
// ArrayDeque 是 Kotlin 内置的双端队列：两端增删均为 O(1)。
// 注意：若引入了 java.util.*，ArrayDeque 会优先解析为 Java 的类（缺少索引访问等特有方法）
val dq = ArrayDeque<Int>()
dq.addLast(1)
dq.addLast(2)
dq.addFirst(0)
println(dq) // => [0, 1, 2]

println(dq.removeFirst()) // => 0
println(dq.removeLast()) // => 2

// 查看队头与队尾元素以及队列大小
dq.addLast(3)
println("${dq.first()} ${dq.last()} ${dq.size}") // => 1 3 2

// 注意：在空队列上调用 first() 与 removeFirst() 会抛出异常；...OrNull 版本则安全返回 null
dq.clear()
println("${dq.firstOrNull()} ${dq.removeFirstOrNull()}") // => null null

// 经典 BFS 遍历循环
val queue = ArrayDeque(listOf(1, 2, 3))
while (queue.isNotEmpty()) {
    println(queue.removeFirst())
}
// => 1 2 3
```

## 哈希集合

```kotlin
// mutableSetOf 默认保留元素插入顺序（基于 LinkedHashSet 实现）；hashSetOf 则不保留顺序
val seen = mutableSetOf<Int>()
seen.add(1)
seen.add(2)

// add 在元素已存在时返回 false
println(seen.add(2)) // => false
println(seen.size) // => 2

println("${1 in seen} ${3 in seen}") // => true false

// remove 在元素缺失时返回 false，不会抛出异常
println("${seen.remove(2)} ${seen.remove(42)}") // => true false
println(seen) // => [1]

// 从列表快速构建集合
println(listOf(3, 1, 3, 2).toSet()) // => [3, 1, 2]

// union、intersect 和 subtract 均返回全新集合
val a = setOf(1, 2, 3)
val b = setOf(2, 3, 4)
println("${a union b} ${a intersect b} ${a subtract b}") // => [1, 2, 3, 4] [2, 3] [1]

// 有序集合 sortedSetOf（底层为 Java TreeSet）保持元素升序排列
val sorted = sortedSetOf(4, 1, 9)
println("$sorted ${sorted.first()} ${sorted.last()}") // => [1, 4, 9] 1 9
```

## 哈希映射

```kotlin
// mutableMapOf 默认保留元素插入顺序（基于 LinkedHashMap 实现）；hashMapOf 则不保留顺序
val scores = mutableMapOf<String, Int>()
scores["alice"] = 88
scores["bob"] = 77
println("$scores ${scores.size}") // => {alice=88, bob=77} 2

scores["alice"] = 80
println(scores["alice"]) // => 80

// 注意：map[key] 返回可空类型（如 Int?），键不存在时返回 null
println(scores["zoe"]) // => null
println("${scores["zoe"] ?: 0} ${scores.getOrDefault("zoe", 0)}") // => 0 0

// in 检查键是否存在
println("alice" in scores) // => true
scores.remove("alice")
println("alice" in scores) // => false
```

```kotlin
val scores = mapOf("alice" to 90, "bob" to 70)

for (key in scores.keys) {
    println(key)
}
// => alice bob

for (value in scores.values) {
    println(value)
}
// => 90 70

// 遍历条目可直接解构为 (key, value)
for ((key, value) in scores) {
    println("$key $value")
}
// => alice 90 bob 70

// 统计频次：读取带默认值后累加写回
val count = mutableMapOf<Char, Int>()
for (ch in "banana") {
    count[ch] = (count[ch] ?: 0) + 1
}
println(count) // => {b=1, a=3, n=2}

// groupingBy + eachCount 单行完成计数
println("banana".groupingBy { it }.eachCount()) // => {b=1, a=3, n=2}

// getOrPut 在键首次不存在时自动初始化新对象，常用于分组聚合
val groups = mutableMapOf<String, MutableList<String>>()
for (word in listOf("eat", "tea", "tan")) {
    val key = word.toCharArray().sorted().joinToString("")
    groups.getOrPut(key) { mutableListOf() }.add(word)
}
println(groups) // => {aet=[eat, tea], ant=[tan]}
```

## 元组

```kotlin
// Pair 与 Triple 分别存放 2 个或 3 个元素；`a to b` 语法快速创建 Pair
fun minMax(nums: List<Int>): Pair<Int, Int> = nums.min() to nums.max()

fun main() {
    // 解构返回值，或通过 .first 与 .second 访问
    val (lo, hi) = minMax(listOf(3, 1, 4))
    println("$lo $hi") // => 1 4
    val t = Triple(1, "one", 1.0)
    println("${t.second} $t") // => one (1, one, 1.0)

    // Pair 按值比较相等，天然适合作为 Map 键或 Set 元素
    val visited = mutableSetOf(0 to 1)
    println((0 to 1) in visited) // => true
    val dist = mutableMapOf((0 to 0) to 0)
    dist[0 to 1] = 1
    println(dist[0 to 1]) // => 1

    // 注意：IntArray 作为键时按引用地址比较，查找无法匹配
    val bad = mutableSetOf(intArrayOf(0, 1))
    println(intArrayOf(0, 1) in bad) // => false

    // 注意：Pair 默认未实现 Comparable；排序时需使用 compareBy
    val pairs = listOf(2 to "b", 1 to "z", 1 to "a")
    println(pairs.sortedWith(compareBy({ it.first }, { it.second }))) // => [(1, a), (1, z), (2, b)]
}
```

## 堆与优先队列

```kotlin
import java.util.PriorityQueue

// Kotlin 复用 Java 的 PriorityQueue，默认为最小堆
val minHeap = PriorityQueue<Int>()
minHeap.add(3)
minHeap.add(1)
minHeap.add(2)

// peek 查看堆顶最小值；poll 弹出堆顶
println(minHeap.peek()) // => 1
while (minHeap.isNotEmpty()) {
    println(minHeap.poll())
}
// => 1 2 3

// 注意：在空堆上 peek 和 poll 返回 null，但 Java 互操作平台类型未强制标记可空，
// 直接打印可能触发空指针异常。显式声明为 Int? 接收
val top: Int? = minHeap.poll()
println(top) // => null

// 基于已有集合线性时间 O(n) 建堆
val heap = PriorityQueue(listOf(5, 1, 8, 3))
println("${heap.poll()} ${heap.size}") // => 1 3

// 最大堆：传入反向比较器 reverseOrder()
val maxHeap = PriorityQueue<Int>(reverseOrder())
maxHeap.addAll(listOf(3, 1, 5))
println(maxHeap.poll()) // => 5

// 自定义优先级：(priority, name) 二元对按 priority 排序
val tasks = PriorityQueue<Pair<Int, String>>(compareBy { it.first })
tasks.add(2 to "write")
tasks.add(1 to "plan")
tasks.add(3 to "ship")
while (tasks.isNotEmpty()) {
    val (priority, name) = tasks.poll()
    println("$priority $name")
}
// => 1 plan 2 write 3 ship
```

## 函数

```kotlin
// fun 函数名(参数名: 参数类型): 返回类型
fun multiply(n: Int, m: Int): Int {
    return n * m
}

// 单表达式函数可使用 = 并自动推导返回类型
fun square(x: Int) = x * x

// 参数默认值与命名参数调用
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

// vararg 关键字声明可变参数，函数内当作数组处理
fun sum(vararg nums: Int) = nums.sum()

fun main() {
    println(multiply(3, 4)) // => 12
    println(square(5)) // => 25
    println(greet("Ann")) // => Hello, Ann!
    println(greet("Ann", greeting: "Hi")) // => Hi, Ann!
    println(sum(1, 2, 3)) // => 6

    // Lambda 表达式为 { 参数 -> 函数体 }；单个参数可隐式简写为 it
    val add = { a: Int, b: Int -> a + b }
    val double: (Int) -> Int = { it * 2 }
    println("${add(2, 3)} ${double(4)}") // => 5 8

    // 当 Lambda 为函数最后一个实参时，可移到圆括号外部（尾随 Lambda）
    println(listOf(1, 2, 3).map { it * 10 }) // => [10, 20, 30]
}
```

```kotlin
fun main() {
    // 局部嵌套函数可直接读写外层封闭作用域的变量，非常适合编写递归 DFS 辅助函数
    var total = 0
    fun dfs(n: Int) {
        if (n == 0) {
            return
        }
        total += n
        dfs(n - 1)
    }
    dfs(3)
    println(total) // => 6

    // 注意：函数形参默认为只读 val，不可重新赋值
    // fun inc(n: Int) { n++ }  // error: 'val' cannot be reassigned
}
```

```kotlin
// 对象按引用传递。在函数内部修改可变列表会影响调用方的原对象...
fun appendOne(list: MutableList<Int>) {
    list.add(1)
}

// ...由于形参本身为 val 不可重新赋值，若需“替换”对象请返回新实例
fun replaced(): MutableList<Int> = mutableListOf(99)

fun main() {
    val nums = mutableListOf<Int>()
    appendOne(nums)
    println(nums) // => [1]
    println(replaced()) // => [99]

    // 只读 List 接口作为参数时函数内完全无法变异其内容
}
```

## 类与数据结构

```kotlin
// 主构造函数直接写在类头中；val/var 参数自动成为类的属性
class Point(val x: Int, val y: Int) : Comparable<Point> {
    fun distSq() = x * x + y * y

    // 可选：重写 toString 自定义打印格式
    override fun toString() = "Point($x, $y)"

    // 可选：实现自然排序，支持直接排序或入堆
    override fun compareTo(other: Point) = distSq().compareTo(other.distSq())
}

// 数据类（data class）自动免费生成 equals、hashCode、toString 和 copy
data class Cell(val r: Int, val c: Int)

fun main() {
    val p = Point(3, 4)
    println(p.distSq()) // => 25
    println(p) // => Point(3, 4)
    println(listOf(Point(2, 2), Point(1, 0)).sorted()) // => [Point(1, 0), Point(2, 2)]

    // 注意：普通类默认按引用地址比较相等
    println(Point(1, 1) == Point(1, 1)) // => false

    // 数据类按字段值比较相等，天然适合作为 Map 键或 Set 元素
    println(Cell(0, 1) == Cell(0, 1)) // => true
    println(Cell(2, 3)) // => Cell(r=2, c=3)
}
```

```kotlin
// LeetCode 中 Kotlin 的单链表节点；`val` 需加反引号转义因为 val 是保留关键字
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

fun main() {
    // 1 -> 2 -> 3；apply 在新对象上下文内执行代码块
    val head = ListNode(1).apply {
        next = ListNode(2).apply { next = ListNode(3) }
    }

    // 遍历链表直到末尾（null）
    var node: ListNode? = head
    while (node != null) {
        println(node.`val`)
        node = node.next
    }
    // => 1 2 3
}
```

```kotlin
// LeetCode 中 Kotlin 的二叉树节点
class TreeNode(var `val`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// 在 LeetCode 上，题目通常要求补全 Solution 类中的方法
class Solution {
    fun maxDepth(root: TreeNode?): Int {
        if (root == null) {
            return 0
        }
        return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
    }
}

// 中序遍历；空子节点表示为 null
fun inorder(node: TreeNode?) {
    if (node == null) {
        return
    }
    inorder(node.left)
    println(node.`val`)
    inorder(node.right)
}

fun main() {
    //     2
    //    / \
    //   1   3
    val root = TreeNode(2).apply {
        left = TreeNode(1)
        right = TreeNode(3)
    }

    inorder(root) // => 1 2 3
    println(root.left?.left == null) // => true
    println(Solution().maxDepth(root)) // => 2
}
```
