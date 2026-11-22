# C# 速查表

> 适用于 C# 12（.NET 8）

本快速参考用于学习或温习 C# 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```csharp
// 顶级语句（Top-level statements）为程序默认入口；无需显式编写 Main 方法或外层类
Console.WriteLine("Hello, World!"); // => Hello, World!
```

```bash
dotnet new console -n Hello    # 创建 Hello/Program.cs 项目并将代码置于其中
dotnet run --project Hello
```

## 变量

```csharp
// 每个变量都必须声明类型，且类型一旦确定不可改变
int n = 0;
Console.WriteLine(n); // => 0
// n = "abc";  // error CS0029: 无法隐式将类型 'string' 转换为 'int'

// var 可根据初始值自动推导类型
var count = 3;
var name = "alice";

// $"..." 内插字符串通过 {} 嵌入表达式
Console.WriteLine($"{count} {name}"); // => 3 alice

// 常用基础类型：int、long、double、bool、char、string
long big = 4_000_000_000L;
double ratio = 0.5;
char letter = 'a';
Console.WriteLine($"{big} {ratio} {letter}"); // => 4000000000 0.5 a

// 注意：C# 中 bool 打印首字母大写（True / False）
bool done = false;
Console.WriteLine(done); // => False

// const 声明编译期常量
const int Limit = 100;
// Limit = 200;  // error CS0131: 赋值号左侧必须是变量、属性或索引器
Console.WriteLine(Limit); // => 100

// 利用元组交换变量
int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"{a} {b}"); // => 2 1

// 自增运算
n++;
n += 2;
Console.WriteLine(n); // => 3

// 类、字符串与数组均可为 null。值类型（如 int）默认不可为 null，
// 除非添加 ? 声明为可空值类型（Nullable）。
int? maybe = null;
Console.WriteLine(maybe.HasValue); // => False

// 空合并运算符 ?? 为 null 提供备用默认值
Console.WriteLine(maybe ?? -1); // => -1
```

## 条件语句

```csharp
// 条件表达式两端必须带有圆括号
int n = 1;
if (n > 2)
{
    n--;
}
else if (n == 2)
{
    n *= 2;
}
else
{
    n += 2;
}
Console.WriteLine(n); // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
int m = 5;
if (n > 0 && m > 0)
{
    Console.WriteLine("both"); // => both
}
Console.WriteLine($"{!true} {true || false}"); // => False True

// 注意：条件必须是 bool 类型；0 和 null 不会被转换为假值
// if (n) { }  // error CS0029: 无法隐式将类型 'int' 转换为 'bool'

// 三元条件运算符
string parity = n % 2 == 0 ? "even" : "odd";
Console.WriteLine(parity); // => odd

// 与 Java 不同，C# 中的 == 会直接比较两个字符串的文本内容
string s1 = "hi";
string s2 = new string(new[] { 'h', 'i' });
Console.WriteLine(s1 == s2); // => True

// 支持模式匹配的 switch 表达式具备返回值
string size = n switch
{
    < 0 => "negative",
    < 10 => "small",
    _ => "large",
};
Console.WriteLine(size); // => small
```

## 循环

```csharp
int n = 0;
while (n < 3)
{
    Console.WriteLine(n);
    n++;
}
// => 0 1 2

// i 从 0 到 4
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}
// => 0 1 2 3 4

// i 从 2 到 5
for (int i = 2; i <= 5; i++)
{
    Console.WriteLine(i);
}
// => 2 3 4 5

// i 从 5 递减到 2
for (int i = 5; i >= 2; i--)
{
    Console.WriteLine(i);
}
// => 5 4 3 2

for (int i = 0; i < 10; i++)
{
    if (i == 1)
    {
        continue;
    }
    if (i == 4)
    {
        break;
    }
    Console.WriteLine(i);
}
// => 0 2 3

// foreach 遍历任意实现了 IEnumerable 的集合
foreach (int x in new[] { 7, 8 })
{
    Console.WriteLine(x);
}
// => 7 8

// C# 没有带标签的 break；若需跳出多层嵌套循环，可使用标志变量（或直接函数 return）
bool found = false;
for (int i = 0; i < 3 && !found; i++)
{
    for (int j = 0; j < 3; j++)
    {
        if (i * j == 2)
        {
            Console.WriteLine($"{i} {j}"); // => 1 2
            found = true;
            break;
        }
    }
}
```

## 数学运算

```csharp
// 两个 int 相除 / 为整数除法（向下截断）
Console.WriteLine(5 / 2); // => 2

// 只要其中一个操作数为 double 即可保留浮点小数
Console.WriteLine(5 / 2.0); // => 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
Console.WriteLine(-3 / 2); // => -1

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
Console.WriteLine(-10 % 3); // => -1

// 始终非负的模运算，常用于循环数组索引
Console.WriteLine((-10 % 3 + 3) % 3); // => 2

// Floor、Ceiling、Sqrt 和 Pow 作用于 double 类型
Console.WriteLine($"{Math.Floor(-1.5)} {Math.Ceiling(-1.5)}"); // => -2 -1
Console.WriteLine($"{Math.Sqrt(16)} {Math.Pow(2, 10)} {Math.Abs(-7)}"); // => 4 1024 7
Console.WriteLine($"{Math.Max(3, 8)} {Math.Min(3, 8)}"); // => 8 3

// double 强转为 int 向零截断小数部分
Console.WriteLine((int)Math.Sqrt(17)); // => 4

// 极值与无穷大
Console.WriteLine($"{int.MaxValue} {int.MinValue}"); // => 2147483647 -2147483648
Console.WriteLine(long.MaxValue); // => 9223372036854775807
Console.WriteLine(double.PositiveInfinity > 1e308); // => True

// 注意：int 溢出会静默发生二进制回绕
int big = int.MaxValue;
big++;
Console.WriteLine(big); // => -2147483648

// 当乘积可能超出范围时，务必在相乘前提前提升为 long
int side = 50_000;
Console.WriteLine(side * side); // => -1794967296
Console.WriteLine((long)side * side); // => 2500000000

// checked 语句块可在数值溢出时抛出 OverflowException 异常
// checked(side * side);  // OverflowException
```

## 输入与输出

```csharp
// WriteLine 自动换行；Write 不换行
Console.Write("same ");
Console.WriteLine("line"); // => same line

// 内插字符串支持格式化说明符；:F2 保留 2 位小数
string name = "alice";
int score = 90;
Console.WriteLine($"{name} scored {score}"); // => alice scored 90
Console.WriteLine($"{3.14159:F2}"); // => 3.14

// 注意：直接对集合调用 Console.WriteLine 会打印出类型全名；需用 string.Join 拼接输出
List<int> nums = [1, 2, 3];
Console.WriteLine(nums); // => System.Collections.Generic.List`1[System.Int32]
Console.WriteLine(string.Join(" ", nums)); // => 1 2 3
```

```csharp
// ReadLine 读取单行文本，自动剔除末尾换行（输入流结束时返回 null，
// 此处 ! 向编译器断言非空）
int n = int.Parse(Console.ReadLine()!);
int[] nums = Console.ReadLine()!
    .Split(' ', StringSplitOptions.RemoveEmptyEntries)
    .Select(int.Parse)
    .ToArray();
Console.WriteLine($"{n} {nums.Sum()}"); // => 3 6
```

```text stdin
3
1 2 3
```

```csharp
// 当数字可能跨行分布时，一次性读取全部输入并按连续空白字符切分
//（传入 null 分隔符表示匹配所有空白字符）
string[] tokens = Console.In.ReadToEnd().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
int n = int.Parse(tokens[0]);
long sum = 0;
for (int i = 1; i <= n; i++)
{
    sum += long.Parse(tokens[i]);
}
Console.WriteLine($"{n} {sum}"); // => 3 15
```

```text stdin
3
4 5
6
```

## 数组与列表

```csharp
// 数组具有固定长度；[1, 2, 3] 为集合表达式语法（C# 12）
int[] arr = [1, 2, 3];
Console.WriteLine(arr.Length); // => 3

// new int[n] 将元素初始化为 0（bool 为 false，对象引用为 null）
int[] zeros = new int[5];
Console.WriteLine(string.Join(" ", zeros)); // => 0 0 0 0 0

// 使用指定值填充数组
int[] ones = new int[3];
Array.Fill(ones, 1);
Console.WriteLine(string.Join(" ", ones)); // => 1 1 1

// ^1 索引运算符表示倒数第一个元素
Console.WriteLine(arr[^1]); // => 3

// 注意：负数索引在 C# 中会抛出越界异常；必须使用 ^ 索引
// arr[-1]  // IndexOutOfRangeException

// 范围表达式 [start..end] 浅拷贝切片，左闭右开
Console.WriteLine(string.Join(" ", arr[1..])); // => 2 3
Console.WriteLine(string.Join(" ", arr[..2])); // => 1 2

// LINQ 为所有集合扩展了丰富的查询方法
Console.WriteLine($"{arr.Contains(3)} {Array.IndexOf(arr, 3)} {arr.Sum()} {arr.Max()}"); // => True 2 6 3
```

```csharp
// List<T> 是动态数组
List<int> list = [1, 2, 3];
list.Add(4);
Console.WriteLine($"{list.Count} {list[0]}"); // => 4 1

// 当作栈使用：在尾部 Add 与 RemoveAt 的时间复杂度均为 O(1)
int top = list[^1];
list.RemoveAt(list.Count - 1);
Console.WriteLine($"{top} {list.Count}"); // => 4 3

// 在中间 Insert 与 RemoveAt 的时间复杂度为 O(n)
list.Insert(1, 7);
Console.WriteLine(string.Join(" ", list)); // => 1 7 2 3
list.RemoveAt(0);
Console.WriteLine(string.Join(" ", list)); // => 7 2 3

// 创建长度为 n 且填充默认值的列表
List<int> fives = Enumerable.Repeat(5, 3).ToList();
Console.WriteLine(string.Join(" ", fives)); // => 5 5 5

// 注意：new List<int>(5) 仅预分配初始容量；此时列表元素个数仍为 0
var empty = new List<int>(5);
Console.WriteLine(empty.Count); // => 0

// 注意：GetRange(index, count) 第二个参数是截取数量，而非结束索引
Console.WriteLine(string.Join(" ", list.GetRange(1, 2))); // => 2 3

// Contains 和 IndexOf 均为 O(n) 线性扫描；快速查找请使用 HashSet
Console.WriteLine($"{list.Contains(2)} {list.IndexOf(2)}"); // => True 1
```

```csharp
int[] nums = [10, 20, 30];

// 通过索引遍历
for (int i = 0; i < nums.Length; i++)
{
    Console.WriteLine(nums[i]);
}
// => 10 20 30

// 直接遍历元素值
foreach (int n in nums)
{
    Console.WriteLine(n);
}
// => 10 20 30

// 同时获取索引和值：索引循环，或 LINQ Select((value, index) => ...)
foreach (var (n, i) in nums.Select((n, i) => (n, i)))
{
    Console.WriteLine($"{i} {n}");
}
// => 0 10 1 20 2 30

// 双集合同步遍历：Zip 按较短集合截断
string[] letters = ["a", "b", "c"];
foreach (var (n, s) in nums.Zip(letters))
{
    Console.WriteLine($"{n} {s}");
}
// => 10 a 20 b 30 c

// 注意：在 foreach 遍历中直接修改 List 会抛出 InvalidOperationException；需使用 RemoveAll
List<int> list = [1, 2, 3, 4];
list.RemoveAll(x => x % 2 == 0);
Console.WriteLine(string.Join(" ", list)); // => 1 3
```

```csharp
int[] nums = [5, 4, 7, 3, 8];

// Array.Reverse 与 Array.Sort 均为原地操作
Array.Reverse(nums);
Console.WriteLine(string.Join(" ", nums)); // => 8 3 7 4 5
Array.Sort(nums);
Console.WriteLine(string.Join(" ", nums)); // => 3 4 5 7 8

// 降序排序：传入返回负数、0 或正数的比较器
Array.Sort(nums, (a, b) => b.CompareTo(a));
Console.WriteLine(string.Join(" ", nums)); // => 8 7 5 4 3

// List<T> 同样内置了 Sort 和 Reverse 方法。
// 注意：字符串默认按当前区域文化排序；StringComparer.Ordinal 按字符编码排序
List<string> words = ["bob", "Alice", "jane", "doe"];
words.Sort(StringComparer.Ordinal);
Console.WriteLine(string.Join(" ", words)); // => Alice bob doe jane

// LINQ 的 OrderBy 返回全新排序序列；ThenBy 增加次级排序规则（先按长度，再按字典序）
var byLength = words.OrderBy(w => w.Length).ThenBy(w => w, StringComparer.Ordinal);
Console.WriteLine(string.Join(" ", byLength)); // => bob doe jane Alice

// 对二元组数组按第二项元素排序
int[][] pairs = [[1, 3], [2, 1], [3, 2]];
Array.Sort(pairs, (p, q) => p[1].CompareTo(q[1]));
Console.WriteLine(string.Join(" ", pairs.Select(p => $"[{p[0]},{p[1]}]"))); // => [2,1] [3,2] [1,3]
```

```csharp
// 交错数组（即数组的数组）是 LeetCode 表示 int[][] 网格的标准结构。
// 必须独立初始化每一行。
int[][] grid = new int[3][];
for (int i = 0; i < 3; i++)
{
    grid[i] = new int[4];
}
grid[0][0] = 1;
Console.WriteLine($"{grid[0][0]} {grid[1][0]} {grid.Length} {grid[0].Length}"); // => 1 0 3 4

// 注意：Enumerable.Repeat(row, n) 会导致每一行共享同一个数组对象引用
int[][] bad = Enumerable.Repeat(new int[2], 3).ToArray();
bad[0][0] = 1;
Console.WriteLine($"{bad[1][0]} {bad[2][0]}"); // => 1 1

// 矩形数组是连续的一整块内存，以下标 [r, c] 访问
int[,] rect = new int[3, 4];
rect[2, 3] = 5;
Console.WriteLine($"{rect[2, 3]} {rect.GetLength(0)} {rect.GetLength(1)}"); // => 5 3 4

// 注意：在回溯算法中，必须保存路径的独立副本，而不是路径对象本身
List<int> path = [1, 2];
List<List<int>> res = [path, new List<int>(path)];
path[0] = 9;
Console.WriteLine($"{res[0][0]} {res[1][0]}"); // => 9 1
```

## 字符串

```csharp
using System.Text;

string s = "abc";

// 按索引获取 char；范围切片或 Substring 截取子串
Console.WriteLine($"{s[0]} {s[1..]} {s[^1]}"); // => a bc c

// 注意：Substring(start, length) 第二个参数是截取长度，而非结束索引
Console.WriteLine(s.Substring(1, 1)); // => b

// 字符串不可变
// s[0] = 'A';  // error CS0200: 属性或索引器为只读
// 修改字符需转为 char[] 修改后再构造新 string
char[] chars = s.ToCharArray();
chars[0] = 'A';
Console.WriteLine(new string(chars)); // => Abc

// + 每次拼接都会分配新对象；在循环中构建字符串请使用 StringBuilder
var sb = new StringBuilder();
foreach (char c in "abc")
{
    sb.Append(char.ToUpper(c));
}
Console.WriteLine(sb.ToString()); // => ABC

// 字符串与数值互转
Console.WriteLine(int.Parse("123") + 1); // => 124
Console.WriteLine(123.ToString() + "4"); // => 1234
// int.Parse("12a") 会抛出 FormatException；TryParse 则安全返回 false
Console.WriteLine(int.TryParse("12a", out int value)); // => False

// 字符与字符编码互转
Console.WriteLine($"{(int)'a'} {(char)('a' + 1)}"); // => 97 b

// 注意：char + int 表达式的结果类型会被提升为 int
Console.WriteLine('a' + 1); // => 98

// 数字字符转整型数值，以及小写字母在 int[26] 中的映射索引
Console.WriteLine($"{'7' - '0'} {'c' - 'a'}"); // => 7 2
Console.WriteLine($"{char.IsDigit('7')} {char.IsLetter('x')}"); // => True True
```

```csharp
// 按空格切分并剔除连续空格产生的空片段
string[] words = "the quick  brown fox".Split(' ', StringSplitOptions.RemoveEmptyEntries);
Console.WriteLine(words.Length); // => 4
Console.WriteLine(string.Join("-", words)); // => the-quick-brown-fox

// == 比较内容；排序比较使用 CompareOrdinal（返回负数、0 或正数）
Console.WriteLine(string.CompareOrdinal("apple", "banana") < 0); // => True
// 注意：< 和 > 运算符无法直接作用于 string
// "a" < "b"  // error CS0019: 运算符 '<' 无法应用于 'string' 和 'string'

// 通过 char 数组原地翻转字符串
char[] letters = "hello".ToCharArray();
Array.Reverse(letters);
Console.WriteLine(new string(letters)); // => olleh

Console.WriteLine($"{"hello".Contains("ell")} {"hello".IndexOf('l')}"); // => True 2
Console.WriteLine($"{"Hi".ToLower()} {"  x ".Trim()} {new string('a', 3)}"); // => hi x aaa
```

## 队列与栈

```csharp
// Queue<T> 为先进先出（FIFO）：Enqueue 队尾入队，Dequeue 队头出队
var queue = new Queue<int>();
queue.Enqueue(1);
queue.Enqueue(2);
queue.Enqueue(3);
Console.WriteLine($"{queue.Peek()} {queue.Count}"); // => 1 3

// 经典 BFS 遍历循环
while (queue.Count > 0)
{
    Console.WriteLine(queue.Dequeue());
}
// => 1 2 3

// 注意：在空队列上调用 Dequeue 和 Peek 会抛出异常；TryDequeue 则安全返回 false
Console.WriteLine(queue.TryDequeue(out int item)); // => False

// Stack<T> 为后进先出（LIFO）：Push、Pop、Peek
var stack = new Stack<int>();
stack.Push(1);
stack.Push(2);
Console.WriteLine($"{stack.Peek()} {stack.Pop()} {stack.Count}"); // => 2 2 1
```

```csharp
// .NET 标准库未提供专门的双端队列类型。LinkedList<T> 双向链表两端操作均为 O(1)。
var dq = new LinkedList<int>();
dq.AddLast(1);
dq.AddLast(2);
dq.AddFirst(0);

// 查看队头与队尾（First 与 Last 为节点对象；Value 为对应存储的值）
Console.WriteLine($"{dq.First!.Value} {dq.Last!.Value} {dq.Count}"); // => 0 2 3

// RemoveFirst 和 RemoveLast 无返回值，需提前通过 Value 读取
int front = dq.First.Value;
dq.RemoveFirst();
int back = dq.Last.Value;
dq.RemoveLast();
Console.WriteLine($"{front} {back} {dq.Count}"); // => 0 2 1

// 注意：在空链表上 First 和 Last 均为 null
dq.RemoveFirst();
Console.WriteLine(dq.First == null); // => True
```

## 哈希集合

```csharp
var seen = new HashSet<int>();
seen.Add(1);
seen.Add(2);

// Add 在元素已存在时返回 false
Console.WriteLine(seen.Add(2)); // => False
Console.WriteLine(seen.Count); // => 2

Console.WriteLine($"{seen.Contains(1)} {seen.Contains(3)}"); // => True False

// Remove 在元素缺失时返回 false，不会抛出异常
Console.WriteLine($"{seen.Remove(2)} {seen.Remove(42)}"); // => True False

// 从数组快速构建集合
int[] nums = [3, 1, 3, 2];
var set = new HashSet<int>(nums);
Console.WriteLine(set.Count); // => 3

// 注意：HashSet 的遍历顺序未定义；需显式排序或使用 SortedSet
Console.WriteLine(string.Join(" ", set.Order())); // => 1 2 3

// 并集、交集与差集会原地修改当前集合
var a = new SortedSet<int> { 1, 2, 3 };
a.IntersectWith([2, 3, 4]);
Console.WriteLine(string.Join(" ", a)); // => 2 3

// SortedSet 还支持 O(log n) 时间获取极值
var sorted = new SortedSet<int> { 4, 1, 9 };
Console.WriteLine($"{sorted.Min} {sorted.Max}"); // => 1 9
```

## 哈希映射

```csharp
var scores = new Dictionary<string, int>();

// 索引器语法新增键或直接覆盖旧值
scores["alice"] = 88;
scores["bob"] = 77;
scores["alice"] = 80;
Console.WriteLine($"{scores["alice"]} {scores.Count}"); // => 80 2

// 注意：若键已存在，调用 Add 方法会抛出 ArgumentException 异常
// scores.Add("bob", 1);  // ArgumentException

// 注意：使用下标索引器读取不存在的键会抛出 KeyNotFoundException 异常
// scores["zoe"]  // KeyNotFoundException
Console.WriteLine(scores.GetValueOrDefault("zoe", 0)); // => 0

// TryGetValue 单次查找完成安全检查与读取
if (scores.TryGetValue("bob", out int bobScore))
{
    Console.WriteLine(bobScore); // => 77
}

Console.WriteLine(scores.ContainsKey("alice")); // => True
scores.Remove("alice");
Console.WriteLine(scores.ContainsKey("alice")); // => False
```

```csharp
// 注意：Dictionary 的遍历顺序未定义；SortedDictionary 则保持键按自然升序排列
var scores = new SortedDictionary<string, int> { ["bob"] = 70, ["alice"] = 90 };

foreach (string key in scores.Keys)
{
    Console.WriteLine(key);
}
// => alice bob

foreach (int val in scores.Values)
{
    Console.WriteLine(val);
}
// => 90 70

// 遍历条目为 KeyValuePair，可直接解构为 (key, value)
foreach (var (key, val) in scores)
{
    Console.WriteLine($"{key} {val}");
}
// => alice 90 bob 70
```

```csharp
// 统计频次：GetValueOrDefault 为缺失键提供保底值 0
var count = new Dictionary<char, int>();
foreach (char ch in "banana")
{
    count[ch] = count.GetValueOrDefault(ch) + 1;
}
Console.WriteLine($"{count['a']} {count['n']}"); // => 3 2

// 针对小写字母统计频次，使用 int[26] 性能显著更高
int[] freq = new int[26];
foreach (char ch in "banana")
{
    freq[ch - 'a']++;
}
Console.WriteLine($"{freq[0]} {freq[1]}"); // => 3 1

// 分组聚合：首次访问时初始化列表
var groups = new Dictionary<string, List<string>>();
foreach (string word in new[] { "eat", "tea", "tan" })
{
    string key = new string(word.Order().ToArray());
    if (!groups.TryGetValue(key, out var group))
    {
        group = [];
        groups[key] = group;
    }
    group.Add(word);
}
Console.WriteLine(string.Join(" ", groups["aet"])); // => eat tea
```

## 元组

```csharp
// 值元组（ValueTuple）将多个值轻量聚合；元素名称为可选注解
(int Min, int Max) MinMax(int[] nums) => (nums.Min(), nums.Max());

// 解构为独立变量，或保留元组并通过字段名/Item 属性访问
var (lo, hi) = MinMax([3, 1, 4]);
Console.WriteLine($"{lo} {hi}"); // => 1 4
var result = MinMax([5, 9]);
Console.WriteLine($"{result.Min} {result.Item2}"); // => 5 9

// 值元组原生按值打印并按值比较相等
Console.WriteLine((1, "one")); // => (1, one)
Console.WriteLine((1, 2) == (1, 2)); // => True

// 因此非常适合用作 HashSet 的元素或 Dictionary 的复合键
var visited = new HashSet<(int, int)> { (0, 1) };
Console.WriteLine(visited.Contains((0, 1))); // => True
var dist = new Dictionary<(int R, int C), int> { [(0, 1)] = 1 };
Console.WriteLine(dist[(0, 1)]); // => 1
```

## 堆与优先队列

```csharp
// PriorityQueue<TElement, TPriority> 是最小堆：元素与优先级分别存储
var tasks = new PriorityQueue<string, int>();
tasks.Enqueue("write", 2);
tasks.Enqueue("plan", 1);
tasks.Enqueue("ship", 3);

// Peek 返回当前优先级最小的元素
Console.WriteLine($"{tasks.Peek()} {tasks.Count}"); // => plan 3

// TryDequeue 可同时安全取出元素及其对应优先级
while (tasks.TryDequeue(out string? task, out int priority))
{
    Console.WriteLine($"{priority} {task}");
}
// => 1 plan 2 write 3 ship

// 注意：在空优先队列上调用 Dequeue 和 Peek 会抛出 InvalidOperationException 异常
// tasks.Dequeue();  // InvalidOperationException
```

```csharp
// 针对纯数值场景，直接将数值本身同时作为元素与优先级。
// 构造函数接收 (元素, 优先级) 二元组可在 O(n) 时间内建堆。
int[] nums = [5, 1, 8, 3];
var minHeap = new PriorityQueue<int, int>(nums.Select(x => (x, x)));
Console.WriteLine(minHeap.Dequeue()); // => 1

// 最大堆：传入反转的优先级比较器
var maxHeap = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => b.CompareTo(a)));
foreach (int x in nums)
{
    maxHeap.Enqueue(x, x);
}
Console.WriteLine(maxHeap.Dequeue()); // => 8

// 自定义复合优先级：元组优先级逐元素依次比较（此处先按 cost 升序，并列按 id 升序）
var pq = new PriorityQueue<string, (int Cost, int Id)>();
pq.Enqueue("b", (2, 1));
pq.Enqueue("a", (2, 0));
pq.Enqueue("c", (1, 5));
Console.WriteLine($"{pq.Dequeue()} {pq.Dequeue()} {pq.Dequeue()}"); // => c a b

// 注意：已入队的元素不支持原地修改优先级。标准做法是重新 Enqueue，
// 并在出队时借助 visited 集合跳过陈旧记录（Dijkstra 经典写法）
```

## 函数

```csharp
// 顶级语句中可声明局部函数；类内部则定义为方法。
// 箭头 => 语法适用于单表达式方法体。
int Multiply(int n, int m) => n * m;
Console.WriteLine(Multiply(3, 4)); // => 12

// 可选参数与命名参数调用
string Greet(string name, string greeting = "Hello") => $"{greeting}, {name}!";
Console.WriteLine(Greet("Ann")); // => Hello, Ann!
Console.WriteLine(Greet("Ann", greeting: "Hi")); // => Hi, Ann!

// params 关键字接收任意数量的可变参数为数组
int Sum(params int[] nums) => nums.Sum();
Console.WriteLine(Sum(1, 2, 3)); // => 6

// Lambda 表达式：Func<..., TResult> 具备返回值，Action<...> 无返回值
Func<int, int> square = x => x * x;
Action<string> say = msg => Console.WriteLine(msg);
Console.WriteLine(square(5)); // => 25
say("hi"); // => hi

// 局部函数与 Lambda 可直接读写外层作用域中的局部变量
int total = 0;
void Add(int n) => total += n;
Add(3);
Add(4);
Console.WriteLine(total); // => 7
```

```csharp
// 数组、列表与类实例按引用传递同一个对象，
// 因此在函数内部修改对象状态对调用方是立即可见的...
void SetFirst(int[] arr) => arr[0] = 99;

// ...但将形参重新指向全新数组对象则完全不会影响调用方
void Replace(int[] arr) => arr = [7];

int[] nums = [1, 2];
SetFirst(nums);
Replace(nums);
Console.WriteLine(string.Join(" ", nums)); // => 99 2

// int、元组等结构体（struct）默认按值拷贝；ref 关键字允许直接传递变量本身的引用
void Increment(ref int n) => n++;
int x = 5;
Increment(ref x);
Console.WriteLine(x); // => 6

// out 参数用于返回附加输出值（如 int.TryParse）
bool TryHalf(int n, out int half)
{
    half = n / 2;
    return n % 2 == 0;
}
bool even = TryHalf(8, out int h);
Console.WriteLine($"{even} {h}"); // => True 4
```

## 类与数据结构

```csharp
var p = new Point(3, 4);
Console.WriteLine(p.DistSq()); // => 25
Console.WriteLine(p); // => Point(3, 4)

// 使用比较器委托排序（或让类实现 IComparable<Point>）
List<Point> pts = [new Point(2, 2), new Point(1, 0)];
pts.Sort((a, b) => a.DistSq().CompareTo(b.DistSq()));
Console.WriteLine(string.Join(" ", pts)); // => Point(1, 0) Point(2, 2)

// 注意：class 对象默认按引用地址比较，内容相同的不同实例不会被视为相等
Console.WriteLine(new Point(1, 1).Equals(new Point(1, 1))); // => False

// record 记录类型默认按值比较，天然适合作为 HashSet 元素或 Dictionary 键
var cells = new HashSet<Cell> { new Cell(0, 1) };
Console.WriteLine(cells.Contains(new Cell(0, 1))); // => True
Console.WriteLine(new Cell(2, 3)); // => Cell { R = 2, C = 3 }

// 类型声明通常放置在顶级语句之后
class Point
{
    // 属性：公开的数据成员与 get/set 访问器
    public int X { get; set; }
    public int Y { get; set; }

    // 构造函数
    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    public int DistSq() => X * X + Y * Y;

    // 可选：重写 ToString 自定义打印格式
    public override string ToString() => $"Point({X}, {Y})";
}

// 单行定义的不可变记录类型，自动免费获得按值相等比较与 ToString
record Cell(int R, int C);
```

```csharp
// LeetCode 编译时关闭了可空引用检查，因此在此声明禁用
#nullable disable

// 1 -> 2 -> 3
var head = new ListNode(1, new ListNode(2, new ListNode(3)));

// 遍历链表直到末尾（null）
for (var node = head; node != null; node = node.next)
{
    Console.WriteLine(node.val);
}
// => 1 2 3

// LeetCode 中 C# 的单链表节点类
public class ListNode
{
    public int val;
    public ListNode next;
    public ListNode(int val = 0, ListNode next = null)
    {
        this.val = val;
        this.next = next;
    }
}
```

```csharp
#nullable disable

//     2
//    / \
//   1   3
var root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

// 中序遍历；空子节点表示为 null
void Inorder(TreeNode node)
{
    if (node == null)
    {
        return;
    }
    Inorder(node.left);
    Console.WriteLine(node.val);
    Inorder(node.right);
}

Inorder(root); // => 1 2 3
Console.WriteLine(root.left.left == null); // => True
Console.WriteLine(new Solution().MaxDepth(root)); // => 2

// LeetCode 中 C# 的二叉树节点类
public class TreeNode
{
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val = 0, TreeNode left = null, TreeNode right = null)
    {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 在 LeetCode 上，题目通常要求补全 Solution 类中的方法（方法名为 PascalCase 大驼峰命名）
public class Solution
{
    public int MaxDepth(TreeNode root)
    {
        if (root == null)
        {
            return 0;
        }
        return 1 + Math.Max(MaxDepth(root.left), MaxDepth(root.right));
    }
}
```
