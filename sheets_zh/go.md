# Go 速查表

> 适用于 Go 1.23

本快速参考用于学习或温习 Go 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```go
// 每个独立程序均从 package main 中的 func main 开始执行
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!") // => Hello, World!
}
```

```bash
go run hello.go
```

```go
// 下方绝大多数代码块均为 main 函数体内的核心代码，省略了 package 与 func 样板。
// 实际独立运行时，保留顶部 import 并将代码放入 func main() { ... } 即可。
import "fmt"

fmt.Println("Hello from main") // => Hello from main
```

## 变量

```go
import (
	"fmt"
	"strconv"
)

// := 声明变量并根据初始值自动推导其类型
n := 0
fmt.Println(n) // => 0

// 注意：变量类型声明后不可变更
// n = "abc"  // 编译错误：不能将 "abc" 作为 int 类型使用

// var 显式声明类型；未提供初始值时自动初始化为该类型的零值（Zero value）。
// 常用类型：int（在 64 位机器上为 64 位）、int64、float64、bool、string、byte、rune
var count int
var ratio float64 = 0.5
var name string
var done bool
fmt.Println(count, ratio, name == "", done) // => 0 0.5 true false

// 注意：rune（Unicode 码点）本质上是整数；转为 string 输出对应字符
var letter rune = 'A'
fmt.Println(letter, string(letter)) // => 65 A

// 常量声明后不可重新赋值
const maxSize = 100
// maxSize = 200  // 编译错误：无法为 maxSize 赋值

// 多变量声明与直接交换变量（无需临时变量）
a, b := 1, 2
a, b = b, a
fmt.Println(a, b) // => 2 1

// 自增运算：++ 和 -- 是语句而非表达式
n++
n += 2
// m := n++  // 语法错误
fmt.Println(n) // => 3

// nil 是指针、切片、映射（map）、通道（channel）和接口的零值
var p *int
var s []int
fmt.Println(p == nil, s == nil, len(s)) // => true true 0
// 注意：int、string 和 bool 不能为 nil；它们的零值分别是 0、"" 和 false

// 注意：声明未使用的局部变量或 import 会导致编译错误。
// 可赋值给下划线 _ 忽略不需要的返回值。
v, _ := strconv.Atoi("42")
fmt.Println(v) // => 42
```

## 条件语句

```go
import "fmt"

// 条件表达式两端无需圆括号，花括号 {} 为强制必须书写
n := 1
if n > 2 {
	n--
} else if n == 2 {
	n *= 2
} else {
	n += 2
}
fmt.Println(n) // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
m := 5
if n > 0 && m > 0 {
	fmt.Println("both") // => both
}
fmt.Println(!true, true || false) // => false true

// 注意：条件必须是 bool 类型；0、"" 和 nil 不会被隐式转换为假值
// if n { }  // 编译错误：if 条件中必须为布尔类型

// if 支持前置初始化语句；所声明变量的作用域仅限于 if/else 分支内
if r := n % 2; r == 1 {
	fmt.Println("odd") // => odd
}

// Go 没有三元条件运算符 (cond ? a : b)：设置默认值后按需覆盖
parity := "even"
if n%2 == 1 {
	parity = "odd"
}
fmt.Println(parity) // => odd

// 不带表达式的 switch 可作为清爽的 if-else 链替代方案；分支默认不会贯穿
switch {
case n < 0:
	fmt.Println("negative")
case n < 10:
	fmt.Println("small") // => small
default:
	fmt.Println("large")
}
```

## 循环

```go
import "fmt"

// for 是 Go 中唯一的循环关键字；仅带条件时即等价于 while 循环
n := 0
for n < 3 {
	fmt.Println(n)
	n++
}
// => 0 1 2

// i 从 0 到 4：对整数执行 range 遍历（Go 1.22+）
for i := range 5 {
	fmt.Println(i)
}
// => 0 1 2 3 4

// i 从 2 到 5：经典三段式循环
for i := 2; i <= 5; i++ {
	fmt.Println(i)
}
// => 2 3 4 5

// i 从 5 递减到 2
for i := 5; i >= 2; i-- {
	fmt.Println(i)
}
// => 5 4 3 2

for i := range 10 {
	if i == 1 {
		continue
	}
	if i == 4 {
		break
	}
	fmt.Println(i)
}
// => 0 2 3

// 无条件的 for { ... } 为无限循环，直到 break 或 return 退出

// 标签允许 break（或 continue）跳出指定的外层循环
outer:
for i := range 3 {
	for j := range 3 {
		if i+j == 3 {
			break outer
		}
		fmt.Println(i, j)
	}
}
// => 0 0 0 1 0 2 1 0 1 1
```

## 数学运算

```go
import (
	"fmt"
	"math"
)

// 两个整数相除 / 为整数除法（向下截断）
fmt.Println(5/2, 5.0/2) // => 2 2.5

// Go 绝不会在 int 和 float64 之间进行隐式转换
a, b := 5, 2
// fmt.Println(a / 2.5)  // 编译错误：无类型浮点常量截断为 int
fmt.Println(float64(a) / float64(b)) // => 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
fmt.Println(-3 / 2) // => -1

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
fmt.Println(-10 % 3) // => -1

// 始终非负的模运算，常用于循环数组索引
fmt.Println((-10%3 + 3) % 3) // => 2

// math 标准库函数均接收并返回 float64；整数浮点数打印时不带小数点
fmt.Println(math.Floor(-1.5), math.Ceil(-1.5)) // => -2 -1
fmt.Println(math.Sqrt(16), math.Pow(2, 10), math.Abs(-7)) // => 4 1024 7

// 注意：没有整型的 abs 或 pow 函数；需显式类型转换，2 的幂可用移位运算
fmt.Println(int(math.Pow(3, 4)), 1<<10) // => 81 1024

// 内置 max 和 min 函数（Go 1.21+）支持任意数量的相同类型参数
fmt.Println(max(3, 8, 1), min(3, 8, 1)) // => 8 1

// 整数极值与无穷大
fmt.Println(math.MaxInt, math.MinInt) // => 9223372036854775807 -9223372036854775808
fmt.Println(math.MaxInt32, math.Inf(1), math.Inf(-1)) // => 2147483647 +Inf -Inf

// 注意：整数溢出会静默发生二进制回绕
big := math.MaxInt
big++
fmt.Println(big) // => -9223372036854775808

// 当乘积可能超出当前类型范围时，务必在相乘前提前提升类型
var side int32 = 50_000
fmt.Println(side*side, int64(side)*int64(side)) // => -1794967296 2500000000
```

## 输入与输出

```go
import "fmt"

// Println 以空格分隔各个参数，并在末尾换行
fmt.Println("a", 1, true) // => a 1 true

// Printf 格式化动词：%d 整数、%s 字符串、%.2f 浮点数、%v 任意默认格式
name, score := "alice", 90
fmt.Printf("%s scored %d\n", name, score) // => alice scored 90
fmt.Printf("%.2f %v\n", 3.14159, []int{1, 2}) // => 3.14 [1 2]

// 切片打印时带有方括号。若需空格分隔的输出，可配合 Print 循环打印
nums := []int{1, 2, 3}
fmt.Println(nums) // => [1 2 3]
for i, x := range nums {
	if i > 0 {
		fmt.Print(" ")
	}
	fmt.Print(x)
}
fmt.Println() // => 1 2 3
```

```go
import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// bufio.Scanner 按行读取标准输入，自动剔除行尾换行符
sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	line := sc.Text()
	fmt.Println(strings.ToUpper(line))
}
// => HELLO WORLD SECOND LINE

// 注意：单行超过 64 KB 会导致 scanner 停止；可提前调大缓冲区：
// sc.Buffer(make([]byte, 1024*1024), 1024*1024)
```

```text stdin
hello world
second line
```

```go
import (
	"bufio"
	"fmt"
	"os"
)

// 注意：直接对 os.Stdin 调用 fmt.Scan 无缓冲且性能较差；推荐用 bufio.Reader 包装
in := bufio.NewReader(os.Stdin)

// Fscan 按空白字符切分读取，自动跨行解析
var n int
fmt.Fscan(in, &n)
nums := make([]int, n)
for i := range nums {
	fmt.Fscan(in, &nums[i])
}

// 针对大数据量输出，用 bufio.Writer 缓冲并在 main 退出前 Flush 刷新
out := bufio.NewWriter(os.Stdout)
defer out.Flush()
fmt.Fprintln(out, n, nums) // => 3 [1 2 3]
```

```text stdin
3
1 2
3
```

## 切片与数组

```go
import (
	"fmt"
	"slices"
)

// 切片（Slice）是 Go 的动态数组（指定固定长度的如 [3]int 则是静态数组）
arr := []int{1, 2, 3}
fmt.Println(arr, len(arr)) // => [1 2 3] 3

// 注意：append 会返回新切片；必须重新赋值接收
arr = append(arr, 4)
fmt.Println(arr) // => [1 2 3 4]

// 将切片当作栈使用：append 入栈，重切片截断出栈
top := arr[len(arr)-1]
arr = arr[:len(arr)-1]
fmt.Println(top, arr) // => 4 [1 2 3]

// make 创建长度为 n 且填充零值的切片；若需自定义初值可循环赋值
ones := make([]int, 3)
for i := range ones {
	ones[i] = 1
}
fmt.Println(make([]int, 5), ones) // => [0 0 0 0 0] [1 1 1]

// 注意：Go 不支持负数索引，且索引越界会触发运行时 panic
// arr[-1]  // 编译错误：索引 -1 不能为负数
// arr[10]  // panic: 运行时错误：索引越界
fmt.Println(arr[len(arr)-1]) // => 3

// 切片截取：arr[start:end]，左闭右开
arr = []int{1, 2, 3, 4}
fmt.Println(arr[1:3], arr[:2], arr[2:]) // => [2 3] [1 2] [3 4]

// 在中间插入或删除元素的时间复杂度为 O(n)
arr = slices.Insert(arr, 1, 7)
fmt.Println(arr) // => [1 7 2 3 4]
arr = slices.Delete(arr, 0, 1)
fmt.Println(arr) // => [7 2 3 4]

// 线性查找与最值
fmt.Println(slices.Contains(arr, 3), slices.Index(arr, 3), slices.Max(arr)) // => true 2 7
```

```go
import "fmt"

nums := []int{10, 20, 30}

// 按索引遍历
for i := range nums {
	fmt.Println(nums[i])
}
// => 10 20 30

// 直接遍历元素值：_ 丢弃索引
for _, n := range nums {
	fmt.Println(n)
}
// => 10 20 30

// 同时获取索引和元素值
for i, n := range nums {
	fmt.Println(i, n)
}
// => 0 10 1 20 2 30

// 注意：range 产出的元素值是拷贝副本；原地修改切片必须通过下标写入
for i := range nums {
	nums[i] *= 2
}
fmt.Println(nums) // => [20 40 60]

// 双切片同步遍历：按较短切片长度循环
letters := []string{"a", "b", "c"}
for i := range min(len(nums), len(letters)) {
	fmt.Println(nums[i], letters[i])
}
// => 20 a 40 b 60 c
```

```go
import (
	"cmp"
	"fmt"
	"slices"
	"sort"
)

nums := []int{5, 4, 7, 3, 8}

// slices.Reverse 与 slices.Sort 均为原地操作
slices.Reverse(nums)
fmt.Println(nums) // => [8 3 7 4 5]
slices.Sort(nums)
fmt.Println(nums) // => [3 4 5 7 8]

// 降序排序：比较器返回负数、0 或正数；反转 a 与 b 即可实现倒序
slices.SortFunc(nums, func(a, b int) int { return cmp.Compare(b, a) })
fmt.Println(nums) // => [8 7 5 4 3]

// 浅拷贝切片后排序，保留原始切片不受影响
words := []string{"bob", "alice", "jane", "doe"}
sorted := slices.Clone(words)
slices.Sort(sorted)
fmt.Println(sorted, words[0]) // => [alice bob doe jane] bob

// 多条件自定义排序：先按长度升序，再按字母序（cmp.Or 选取首个非零比较结果）
slices.SortFunc(words, func(a, b string) int {
	return cmp.Or(cmp.Compare(len(a), len(b)), cmp.Compare(a, b))
})
fmt.Println(words) // => [bob doe jane alice]

// 对二元切片按第二项元素排序
pairs := [][]int{{1, 3}, {2, 1}, {3, 2}}
slices.SortFunc(pairs, func(a, b []int) int { return cmp.Compare(a[1], b[1]) })
fmt.Println(pairs) // => [[2 1] [3 2] [1 3]]

// 旧版本代码常使用 sort.Slice，比较函数传入两个索引并返回 bool（表示小于）
sort.Slice(pairs, func(i, j int) bool { return pairs[i][0] < pairs[j][0] })
fmt.Println(pairs) // => [[1 3] [2 1] [3 2]]
```

```go
import (
	"fmt"
	"slices"
)

// 3 行 4 列的二维切片：必须独立构建每一行
grid := make([][]int, 3)
for i := range grid {
	grid[i] = make([]int, 4)
}
grid[0][0] = 1
fmt.Println(grid) // => [[1 0 0 0] [0 0 0 0] [0 0 0 0]]
fmt.Println(len(grid), len(grid[0])) // => 3 4

// 注意：对已有切片再次截取子切片会共享底层数组内存
arr := []int{1, 2, 3, 4}
part := arr[1:3]
part[0] = 99
fmt.Println(arr) // => [1 99 3 4]

// 注意：在容量允许的情况下，append 可能会直接覆盖原数组后续位置的值
base := []int{1, 2, 3}
head := append(base[:1], 9)
fmt.Println(head, base) // => [1 9] [1 9 3]

// slices.Clone 创建独立内存拷贝
cp := slices.Clone(base)
cp[0] = 7
fmt.Println(base[0], cp[0]) // => 1 7

// 注意：在回溯算法中，必须保存路径的拷贝副本，而不是路径切片本身
path := []int{1, 2}
saved := [][]int{path, slices.Clone(path)}
path[0] = 9
fmt.Println(saved) // => [[9 2] [1 2]]
```

## 字符串

```go
import (
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

s := "abc"

// 索引访问获得 byte 字节（数值）；切片截取获得 string 子串
fmt.Println(s[0], string(s[0]), s[1:]) // => 97 a bc

// 注意：Go 字符串具有不可变性
// s[0] = 'A'  // 编译错误：无法向 s[0] 赋值

// 若需修改字符，先转换为 []byte（或针对 Unicode 的 []rune）修改后再转回
b := []byte(s)
b[0] = 'A'
fmt.Println(string(b)) // => Abc

// 注意：len 和下标基于字节（byte）计数，而 range 循环则按字符（rune）步进
u := "héllo"
fmt.Println(len(u), len([]rune(u))) // => 6 5
for i, r := range "hé!" {
	fmt.Println(i, string(r))
}
// => 0 h 1 é 3 !

// + 每次拼接都会分配新字符串；在循环中构建请使用 strings.Builder
var sb strings.Builder
for _, ch := range "abc" {
	sb.WriteRune(unicode.ToUpper(ch))
}
fmt.Println(sb.String()) // => ABC

// 字符串与数字互转；Atoi 同时返回可能产生的解析错误
n, err := strconv.Atoi("123")
fmt.Println(n+1, err) // => 124 <nil>
fmt.Println(strconv.Itoa(123) + "4") // => 1234

// 注意：string(65) 得到的是字符 "A"，而非字符串 "65"
fmt.Println(string(rune(65))) // => A

// 字符与 ASCII 编码互转：byte 或 rune 本身即为其数值编码
fmt.Println('a', string(rune('a'+1))) // => 97 b

// 计算小写字母在 [26]int 计数数组中的偏移索引
fmt.Println('c' - 'a') // => 2

// Fields 按任意连续空白切分；Split 按指定分隔符切分
words := strings.Fields("the quick  brown fox")
fmt.Println(words, len(words)) // => [the quick brown fox] 4
fmt.Println(strings.Split("a,b,c", ",")) // => [a b c]
fmt.Println(strings.Join(words, "-")) // => the-quick-brown-fox

// 使用普通比较运算符直接按字典序比较字符串
fmt.Println("apple" < "banana", "go" == "go") // => true true

fmt.Println(strings.Contains("hello", "ell"), strings.Index("hello", "l")) // => true 2
fmt.Println(strings.ToUpper("go"), strings.Repeat("ab", 3)) // => GO ababab
fmt.Println(unicode.IsDigit('7'), unicode.IsLetter('x')) // => true true
```

## 队列与双端队列

```go
import "fmt"

// Go 标准库没有内置 deque 类型。在 BFS 中，普通切片即可充当队列：
// append 队尾入队，重切片截取队头出队（O(1)）
queue := []int{1, 2, 3}
for len(queue) > 0 {
	node := queue[0]
	queue = queue[1:]
	fmt.Println(node)
}
// => 1 2 3
```

```go
import (
	"container/list"
	"fmt"
)

// container/list 是双向链表，可直接当作双端队列使用：两端操作均为 O(1)
dq := list.New()
dq.PushBack(1)
dq.PushBack(2)
dq.PushFront(0)

// 查看队头、队尾元素值以及队列大小
fmt.Println(dq.Front().Value, dq.Back().Value, dq.Len()) // => 0 2 3

// Remove 返回 `any` 动态类型；需用类型断言转换为具体类型
front := dq.Remove(dq.Front()).(int)
back := dq.Remove(dq.Back()).(int)
fmt.Println(front, back, dq.Len()) // => 0 2 1

// 注意：在空链表上 Front() 和 Back() 返回 nil
dq.Remove(dq.Front())
fmt.Println(dq.Front() == nil) // => true
```

## 哈希集合

```go
import (
	"fmt"
	"maps"
	"slices"
)

// Go 没有内置集合类型。Idiomatic 的惯用做法是使用值为空结构体 struct{} 的 map（不占额外内存）
seen := map[int]struct{}{}
seen[1] = struct{}{}
seen[2] = struct{}{}
seen[2] = struct{}{} // 重复添加无副作用
fmt.Println(len(seen)) // => 2

// comma-ok 习语判断键是否存在
_, has1 := seen[1]
_, has3 := seen[3]
fmt.Println(has1, has3) // => true false

// delete 删除键，键不存在时静默跳过
delete(seen, 2)
delete(seen, 42)
fmt.Println(len(seen)) // => 1

// map[T]bool 语法更简洁直观，因为缺失的键默认取值为 false
visited := map[string]bool{}
visited["a"] = true
fmt.Println(visited["a"], visited["b"]) // => true false

// 注意：显式存入 false 依然会写入该键，因此 len 仍然会计入
visited["b"] = false
fmt.Println(len(visited)) // => 2

// 从切片快速构建集合
set := map[int]bool{}
for _, n := range []int{3, 1, 3, 2} {
	set[n] = true
}

// 注意：map 遍历顺序是随机的；若需稳定顺序请先对键排序
fmt.Println(slices.Sorted(maps.Keys(set))) // => [1 2 3]
```

## 哈希映射

```go
import "fmt"

// map[KeyType]ValueType，可通过字面量（或 make）创建空映射
scores := map[string]int{}
scores["alice"] = 88
scores["bob"] = 77

// fmt 打印 map 时会自动将键排序输出
fmt.Println(scores, len(scores)) // => map[alice:88 bob:77] 2

scores["alice"] = 80
fmt.Println(scores["alice"]) // => 80

// 注意：访问不存在的键时返回该类型的零值，不会报错
fmt.Println(scores["zoe"]) // => 0

// comma-ok 习语可区分“键不存在”与“显式存储了零值 0”
v, ok := scores["zoe"]
fmt.Println(v, ok) // => 0 false

// 判断键是否存在并删除
if _, ok := scores["bob"]; ok {
	delete(scores, "bob")
}
fmt.Println(len(scores)) // => 1

// 注意：未初始化的 nil map 支持只读查询，但向其写入会直接触发 panic
var m map[string]int
fmt.Println(m["x"], len(m)) // => 0 0
// m["x"] = 1  // panic: 向 nil 映射赋值
```

```go
import (
	"fmt"
	"maps"
	"slices"
)

scores := map[string]int{"alice": 90, "bob": 70, "carol": 80}

// 注意：range 遍历 map 的顺序是随机的；需要固定顺序时先提取键并排序
for _, k := range slices.Sorted(maps.Keys(scores)) {
	fmt.Println(k, scores[k])
}
// => alice 90 bob 70 carol 80

// 仅提取所有值并排序
fmt.Println(slices.Sorted(maps.Values(scores))) // => [70 80 90]

// 当不在意顺序时（如求最大值），直接同时遍历键和值
best, bestScore := "", -1
for name, score := range scores {
	if score > bestScore {
		best, bestScore = name, score
	}
}
fmt.Println(best, bestScore) // => alice 90
```

```go
import (
	"fmt"
	"slices"
)

// 统计频次：缺失的键读取为零值 0，因此首次出现时直接 ++ 即可正常工作
count := map[rune]int{}
for _, ch := range "banana" {
	count[ch]++
}
fmt.Println(count['a'], count['n'], count['z']) // => 3 2 0

// 分组聚合：向缺失键的 nil 切片执行 append 会自动初始化切片
groups := map[string][]string{}
for _, word := range []string{"eat", "tea", "tan"} {
	letters := []byte(word)
	slices.Sort(letters)
	key := string(letters)
	groups[key] = append(groups[key], word)
}
fmt.Println(groups) // => map[aet:[eat tea] ant:[tan]]
```

## 元组

```go
// Go 没有内置多元组类型。函数可原生直接返回多个值...
package main

import "fmt"

func minMax(nums []int) (int, int) {
	lo, hi := nums[0], nums[0]
	for _, n := range nums {
		lo, hi = min(lo, n), max(hi, n)
	}
	return lo, hi
}

// ...小型 struct 非常适合用作 map 的复合键
type point struct{ r, c int }

func main() {
	lo, hi := minMax([]int{3, 1, 4})
	fmt.Println(lo, hi) // => 1 4

	dist := map[point]int{{0, 0}: 0, {0, 1}: 1}
	fmt.Println(dist[point{0, 1}]) // => 1

	// 固定长度数组也天然支持比较，无需声明类型即可直接用作复合键
	visited := map[[2]int]bool{{0, 1}: true}
	fmt.Println(visited[[2]int{0, 1}], visited[[2]int{1, 0}]) // => true false

	// 注意：切片（Slice）不可比较，因此不能作为 map 的键
	// bad := map[[]int]bool{}  // 编译错误：无效的 map 键类型 []int
}
```

## 堆与优先队列

```go
// Go 标准库没有开箱即用的堆类型。container/heap 要求类型实现 5 个方法
//（Len, Less, Swap, Push, Pop）。使用带 less 比较函数的泛型结构体
// 可轻松覆盖最小堆、最大堆及各种自定义优先级场景。
package main

import (
	"container/heap"
	"fmt"
)

type Heap[T any] struct {
	items []T
	less  func(a, b T) bool
}

// Len、Less 和 Swap 供 heap 算法包进行元素重排
func (h *Heap[T]) Len() int           { return len(h.items) }
func (h *Heap[T]) Less(i, j int) bool { return h.less(h.items[i], h.items[j]) }
func (h *Heap[T]) Swap(i, j int)      { h.items[i], h.items[j] = h.items[j], h.items[i] }

// Push 和 Pop 仅在底层切片末尾操作；堆化调整由 heap.Push 和 heap.Pop 自动完成
func (h *Heap[T]) Push(x any) { h.items = append(h.items, x.(T)) }
func (h *Heap[T]) Pop() any {
	x := h.items[len(h.items)-1]
	h.items = h.items[:len(h.items)-1]
	return x
}

func main() {
	// 最小堆：比较器使用 <。heap.Init 在 O(n) 时间内将已有切片堆化
	minH := &Heap[int]{items: []int{5, 1, 8, 3}, less: func(a, b int) bool { return a < b }}
	heap.Init(minH)
	heap.Push(minH, 2)

	// 堆顶最小值始终位于切片索引 0
	fmt.Println(minH.items[0], minH.Len()) // => 1 5

	// 注意：弹出堆顶必须调用 heap.Pop(h)，直接调用 h.Pop() 只会移除末尾元素
	for minH.Len() > 0 {
		fmt.Println(heap.Pop(minH))
	}
	// => 1 2 3 5 8

	// 最大堆：反转比较逻辑为 >
	maxH := &Heap[int]{less: func(a, b int) bool { return a > b }}
	for _, n := range []int{3, 1, 5} {
		heap.Push(maxH, n)
	}
	fmt.Println(heap.Pop(maxH)) // => 5

	// 自定义优先级：按任务对象的 priority 字段排序
	type task struct {
		name     string
		priority int
	}
	tasks := &Heap[task]{less: func(a, b task) bool { return a.priority < b.priority }}
	heap.Push(tasks, task{"write", 2})
	heap.Push(tasks, task{"plan", 1})
	heap.Push(tasks, task{"ship", 3})
	for tasks.Len() > 0 {
		t := heap.Pop(tasks).(task)
		fmt.Println(t.priority, t.name)
	}
	// => 1 plan 2 write 3 ship
}
```

## 指针

```go
package main

import "fmt"

type point struct{ x, y int }

// 在函数中返回局部变量的指针完全安全；Go 编译器会自动执行逃逸分析将其分配至堆上
func newPoint(x, y int) *point {
	p := point{x, y}
	return &p
}

func main() {
	// & 取地址，* 解引用访问对应内存值
	x := 1
	p := &x
	*p = 7
	fmt.Println(x, *p) // => 7 7

	// 通过结构体指针访问字段无需手动书写 (*pt).x，可直接缩写为 pt.x
	pt := newPoint(1, 2)
	pt.x = 10
	fmt.Println(*pt) // => {10 2}

	// 注意：指针的零值是 nil，解引用 nil 指针会触发运行时 panic
	var q *int
	fmt.Println(q == nil) // => true
	// *q = 1  // panic: 运行时错误：无效内存地址或空指针解引用
}
```

## 函数

```go
package main

import (
	"errors"
	"fmt"
)

// 参数类型紧随参数名之后；相邻同类型参数可合并声明
func multiply(n, m int) int {
	return n * m
}

// 支持多个返回值；按 Go 习惯最后一个返回值通常约定为 error
func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divide by zero")
	}
	return a / b, nil
}

// 可变长参数：函数内部 nums 被当作 []int 切片处理
func sum(nums ...int) int {
	total := 0
	for _, n := range nums {
		total += n
	}
	return total
}

func main() {
	fmt.Println(multiply(3, 4)) // => 12

	q, err := divide(7, 2)
	fmt.Println(q, err) // => 3 <nil>
	_, err = divide(1, 0)
	fmt.Println(err) // => divide by zero

	fmt.Println(sum(1, 2, 3)) // => 6
	// 使用 ... 展开切片传入可变参数
	nums := []int{4, 5}
	fmt.Println(sum(nums...)) // => 9

	// Go 不支持默认参数值、关键字参数或函数重载
}
```

```go
import "fmt"

// 函数字面量即为 Go 的 Lambda；可赋值给变量保存
square := func(x int) int { return x * x }
fmt.Println(square(5)) // => 25

// 闭包可以直接读取并修改外层函数的局部变量
total := 0
add := func(n int) { total += n }
add(3)
add(4)
fmt.Println(total) // => 7

// 注意：递归闭包（如 DFS 辅助函数）必须先显式声明变量类型：
// 若写为 fib := func... 则函数体内部尚无法解析自身标识符
var fib func(n int) int
fib = func(n int) int {
	if n < 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}
fmt.Println(fib(10)) // => 55

// 与 Python 不同，深层递归在 Go 中完全可行：Go 的调用栈会根据需要自动动态扩容
```

```go
// Go 中实参始终按值传递拷贝。调用方能否感知修改取决于拷贝的内容本身。
package main

import "fmt"

// 切片头拷贝后仍指向相同的底层数组，因此修改元素对调用方可见...
func setFirst(arr []int) { arr[0] = 99 }

// ...但 append 扩容可能会分配全新底层数组，调用方原切片头无法感知长度变化
func appendOne(arr []int) { arr = append(arr, 1) }

// map 底层是指针引用，函数内的修改对调用方完全可见
func addKey(m map[string]int) { m["k"] = 1 }

// 结构体默认整体验证值拷贝；若需修改调用方的原结构体请传递指针
type counter struct{ n int }

func incCopy(c counter)     { c.n++ }
func incPointer(c *counter) { c.n++ }

func main() {
	nums := []int{1, 2, 3}
	setFirst(nums)
	appendOne(nums)
	fmt.Println(nums) // => [99 2 3]

	m := map[string]int{}
	addKey(m)
	fmt.Println(m) // => map[k:1]

	c := counter{}
	incCopy(c)
	fmt.Println(c.n) // => 0
	incPointer(&c)
	fmt.Println(c.n) // => 1

	// 若需在函数内扩容切片，应将新切片作为返回值返回（如 append）
}
```

## 结构体与数据结构

```go
// Go 没有 class 关键字。由 struct 容纳字段，通过接收者（receiver）在外部声明方法，
// 构造函数是命名惯例为 newX 的普通函数。
package main

import (
	"cmp"
	"fmt"
	"slices"
)

type point struct {
	x, y int
}

func newPoint(x, y int) *point {
	return &point{x: x, y: y}
}

// 值接收者接收值拷贝：适用于纯只读方法
func (p point) distSq() int {
	return p.x*p.x + p.y*p.y
}

// 指针接收者可以直接修改结构体内部状态
func (p *point) move(dx, dy int) {
	p.x += dx
	p.y += dy
}

// 可选：实现 String() 方法自定义 fmt 打印格式
func (p point) String() string {
	return fmt.Sprintf("(%d, %d)", p.x, p.y)
}

func main() {
	p := newPoint(3, 4)
	fmt.Println(p.distSq()) // => 25
	p.move(1, 1)
	fmt.Println(p) // => (4, 5)

	// 结构体字面量支持无构造函数直接实例化；未指定的字段自动填充零值
	q := point{x: 1}
	fmt.Println(q, q.y) // => (1, 0) 0

	// Go 不支持运算符重载；结构体切片使用比较器排序
	pts := []point{{2, 2}, {1, 0}}
	slices.SortFunc(pts, func(a, b point) int { return cmp.Compare(a.distSq(), b.distSq()) })
	fmt.Println(pts) // => [(1, 0) (2, 2)]

	// 首字母大写的标识符（如 ListNode.Val）对外导出可公开访问
}
```

```go
package main

import "fmt"

// LeetCode 中 Go 的单链表节点结构
type ListNode struct {
	Val  int
	Next *ListNode
}

func main() {
	// 1 -> 2 -> 3
	head := &ListNode{1, &ListNode{2, &ListNode{3, nil}}}

	// 遍历链表直到末尾（nil）
	for node := head; node != nil; node = node.Next {
		fmt.Println(node.Val)
	}
	// => 1 2 3
}
```

```go
package main

import "fmt"

// LeetCode 中 Go 的二叉树节点结构
type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// 中序遍历；空子节点表示为 nil
func inorder(node *TreeNode) {
	if node == nil {
		return
	}
	inorder(node.Left)
	fmt.Println(node.Val)
	inorder(node.Right)
}

// 在 LeetCode 上只需补全普通函数；Go 没有包装用的 Solution 类
func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return 1 + max(maxDepth(root.Left), maxDepth(root.Right))
}

func main() {
	//     2
	//    / \
	//   1   3
	root := &TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}}

	inorder(root) // => 1 2 3
	fmt.Println(root.Left.Left == nil) // => true
	fmt.Println(maxDepth(root)) // => 2
}
```
