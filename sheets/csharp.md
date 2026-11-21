# C# Cheat Sheet

> Written for C# 12 (.NET 8)

Use this quick reference to learn or revisit C# syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```csharp
// A console project's top-level statements form its entry point.
Console.WriteLine("hello"); // => hello
```

```bash
dotnet new console -n Hello --framework net8.0
# Save the example as Hello/Program.cs.
dotnet run --project Hello
```

## Variables

```csharp
var steps = 1;
const int limit = 3;
long cost = 4_000_000_000L;
double ratio = 0.5;
bool ready = true;
char grade = 'A';
int? parent = null;
steps++;
Console.WriteLine($"{steps} {limit} {cost} {ratio} {ready} {grade}"); // => 2 3 4000000000 0.5 True A
Console.WriteLine(parent ?? -1); // => -1
int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"{a} {b}"); // => 2 1
```

## If-statements

```csharp
int x = 7;
string label;
if (x <= 0) {
    label = "low";
} else if (x < 10 && x != 5) {
    label = "middle";
} else {
    label = "high";
}
Console.WriteLine($"{label} {(x % 2 == 0 ? "even" : "odd")}"); // => middle odd
Console.WriteLine(!(x < 1 || x > 9)); // => True
```

## Loops

```csharp
int n = 2;
while (n > 0) Console.WriteLine(n--);
// => 2 1
for (int i = 0; i < 6; i++) {
    if (i == 1) continue;
    if (i == 4) break;
    Console.WriteLine(i);
}
// => 0 2 3
for (int i = 2; i <= 4; i++) Console.WriteLine(i);
// => 2 3 4
for (int i = 4; i >= 2; i--) Console.WriteLine(i);
// => 4 3 2
```

## Math

```csharp
Console.WriteLine($"{-3 / 2} {-3 / 2.0} {-10 % 3}"); // => -1 -1.5 -1
Console.WriteLine($"{Math.Floor(-1.5)} {Math.Ceiling(-1.5)} {Math.Sqrt(9)}"); // => -2 -1 3
Console.WriteLine($"{Math.Pow(2, 5)} {Math.Abs(-5)}"); // => 32 5
Console.WriteLine($"{int.MinValue} {int.MaxValue} {double.IsPositiveInfinity(double.PositiveInfinity)}"); // => -2147483648 2147483647 True
// CAREFUL: runtime int overflow wraps in the default unchecked context.
int side = 50_000;
Console.WriteLine($"{side * side} {(long)side * side}"); // => -1794967296 2500000000
try {
    _ = checked(side * side);
} catch (OverflowException) {
    Console.WriteLine("overflow"); // => overflow
}
```

## Output and Input

```csharp
Console.WriteLine(Console.ReadLine()); // => case one
var tokens = Console.In.ReadToEnd().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
int n = int.Parse(tokens[0]);
long sum = 0;
for (int i = 1; i <= n; i++) sum += int.Parse(tokens[i]);
Console.WriteLine($"{n} {sum}"); // => 3 9
```

```text stdin
case one
3
2 3
4
```

## Arrays

```csharp
List<int> nums = [.. new int[3]];
nums[1] = 4;
nums.Add(7);
Console.WriteLine(nums[^1]); // => 7
nums.RemoveAt(nums.Count - 1);
Console.WriteLine($"{nums.Count} {nums[1]}"); // => 3 4
// ^1 counts from the end. A negative integer index is out of range.
int invalid = -1;
try {
    _ = nums[invalid];
} catch (ArgumentOutOfRangeException) {
    Console.WriteLine("out of range"); // => out of range
}
Console.WriteLine(string.Join(" ", nums.GetRange(1, 2))); // => 4 0
int[] fixedSize = [4, 7, 9];
Console.WriteLine(string.Join(" ", fixedSize[1..])); // => 7 9
for (int i = 0; i < nums.Count; i++) Console.WriteLine(i);
// => 0 1 2
foreach (int x in nums) Console.WriteLine(x);
// => 0 4 0
foreach (var (value, index) in nums.Select((x, i) => (x, i))) Console.WriteLine($"{index}={value}");
// => 0=0 1=4 2=0
foreach (var (x, w) in nums.Zip(new[] { 2, 3 })) Console.WriteLine(x * w);
// => 0 12
```

```csharp
List<int> nums = [4, 1, 3];
nums.Reverse();
Console.WriteLine(string.Join(" ", nums)); // => 3 1 4
nums.Sort();
Console.WriteLine(string.Join(" ", nums)); // => 1 3 4
nums.Sort((a, b) => b.CompareTo(a));
Console.WriteLine(string.Join(" ", nums)); // => 4 3 1
var words = new[] { "four", "a", "to" }.OrderBy(w => w.Length);
Console.WriteLine(string.Join(" ", words)); // => a to four
var grid = new int[2, 3];
grid[0, 0] = 7;
Console.WriteLine(grid[1, 0]); // => 0
// CAREFUL: repeating a reference in a jagged array shares that row.
var shared = Enumerable.Repeat(new int[3], 2).ToArray();
shared[0][0] = 7;
Console.WriteLine(shared[1][0]); // => 7
```

## Strings

```csharp
using System.Text;

string s = "code";
Console.WriteLine($"{s[0]} {s[1..3]}"); // => c od
// Strings are immutable. Accumulate repeated pieces in a StringBuilder.
var builder = new StringBuilder();
foreach (char c in s) builder.Append(char.ToUpperInvariant(c));
Console.WriteLine("go-" + builder); // => go-CODE
Console.WriteLine($"{int.Parse("41") + 1} {41.ToString() + "2"}"); // => 42 412
Console.WriteLine($"{(int)'a'} {(char)98}"); // => 97 b
Console.WriteLine(string.Join("-", "one  two".Split(' ', StringSplitOptions.RemoveEmptyEntries))); // => one-two
Console.WriteLine(string.CompareOrdinal("ant", "bee") < 0); // => True
```

## Queues

```csharp
// .NET 8 has no dedicated deque. LinkedList<T> supports constant-time edits at either end.
var q = new LinkedList<int>();
q.AddLast(2);
q.AddFirst(1);
Console.WriteLine($"{q.First!.Value} {q.Last!.Value} {q.Count}"); // => 1 2 2
q.RemoveFirst();
Console.WriteLine(q.Last!.Value); // => 2
q.RemoveLast();
Console.WriteLine(q.Count); // => 0
```

## HashSets

```csharp
int[] input = [2, 3, 2];
var seen = new HashSet<int>(input);
seen.Add(5);
seen.Remove(3);
Console.WriteLine($"{seen.Contains(2)} {seen.Count}"); // => True 2
foreach (int x in seen.Order()) Console.WriteLine(x);
// => 2 5
```

## HashMaps

```csharp
var count = new Dictionary<char, int>();
count['x'] = 4;
count['x'] = 5;
Console.WriteLine($"{count['x']} {count.ContainsKey('x')}"); // => 5 True
count.Remove('x');
// CAREFUL: the indexer throws when a key is absent. GetValueOrDefault supplies zero here.
try {
    _ = count['x'];
} catch (KeyNotFoundException) {
    Console.WriteLine("missing"); // => missing
}
foreach (char ch in "banana") count[ch] = count.GetValueOrDefault(ch) + 1;
Console.WriteLine(count.Count); // => 3
foreach (char k in count.Keys.Order()) Console.WriteLine(k);
// => a b n
foreach (int v in count.Values.Order()) Console.WriteLine(v);
// => 1 2 3
foreach (var (k, v) in count.OrderBy(p => p.Key)) Console.WriteLine($"{k} {v}");
// => a 3 b 1 n 2
```

## Tuples

```csharp
static (int Min, int Max) Bounds(int[] nums) => (nums.Min(), nums.Max());
var (lo, hi) = Bounds([4, 1, 7]);
Console.WriteLine($"{lo} {hi}"); // => 1 7
var distance = new Dictionary<(int Row, int Col), int> { [(2, 3)] = 5 };
Console.WriteLine(distance[(2, 3)]); // => 5
```

## Heaps

```csharp
// CAREFUL: the smallest priority wins. Dequeue returns the associated element.
(int Element, int Priority)[] pairs = [(5, 5), (2, 2), (3, 3)];
var min = new PriorityQueue<int, int>(pairs);
min.Enqueue(1, 1);
Console.WriteLine($"{min.Peek()} {min.Dequeue()} {min.Count}"); // => 1 1 3
var max = new PriorityQueue<int, int>(pairs, Comparer<int>.Create((a, b) => b.CompareTo(a)));
Console.WriteLine(max.Dequeue()); // => 5
var jobs = new PriorityQueue<string, int>();
jobs.Enqueue("ship", 3);
jobs.Enqueue("plan", 1);
Console.WriteLine(jobs.Dequeue()); // => plan
```

## Functions

```csharp
static int Edit(int[] nums) {
    nums[0] = 7;
    nums = [9];
    return nums[0];
}
int[] nums = [1, 2];
Console.WriteLine($"{Edit(nums)} {nums[0]}"); // => 9 7
int total = 0;
int Add(int step) => total += step;
Func<int, int> square = x => x * x;
Console.WriteLine($"{Add(3)} {Add(4)} {square(5)}"); // => 3 7 25
```

## Classes

```csharp
Console.WriteLine(new Point(3, 4).DistSq()); // => 25

class Point(int x, int y) {
    public int X = x;
    public int Y = y;
    public int DistSq() => X * X + Y * Y;
}
```

```csharp
#nullable disable
var head = new ListNode(1, new ListNode(2));
for (var node = head; node != null; node = node.next) Console.WriteLine(node.val);
// => 1 2
var root = new TreeNode(2, new TreeNode(1), new TreeNode(3));
Inorder(root); // => 1 2 3
Console.WriteLine(root.left.right == null); // => True

static void Inorder(TreeNode node) {
    if (node == null) return;
    Inorder(node.left);
    Console.WriteLine(node.val);
    Inorder(node.right);
}

public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val=0, ListNode next=null) {
        this.val = val;
        this.next = next;
    }
}

public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
    public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```
