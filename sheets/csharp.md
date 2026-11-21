# C# Cheat Sheet

> Written for C# 12 (.NET 8)

Use this quick reference to learn or revisit C# syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```csharp
// Top-level statements are the entry point; no Main method or class is needed
Console.WriteLine("Hello, World!"); // => Hello, World!
```

```bash
dotnet new console -n Hello    # creates Hello/Program.cs; put the code there
dotnet run --project Hello
```

## Variables

```csharp
// Every variable has a type, and the type never changes
int n = 0;
Console.WriteLine(n); // => 0
// n = "abc";  // error CS0029: Cannot implicitly convert type 'string' to 'int'

// var infers the type from the value
var count = 3;
var name = "alice";

// $"..." strings embed expressions in {}
Console.WriteLine($"{count} {name}"); // => 3 alice

// Common types: int, long, double, bool, char, string
long big = 4_000_000_000L;
double ratio = 0.5;
char letter = 'a';
Console.WriteLine($"{big} {ratio} {letter}"); // => 4000000000 0.5 a

// CAREFUL: bools print capitalized
bool done = false;
Console.WriteLine(done); // => False

// const is a compile-time constant
const int Limit = 100;
// Limit = 200;  // error CS0131: The left-hand side of an assignment must be a variable, property or indexer
Console.WriteLine(Limit); // => 100

// Swap with a tuple
int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"{a} {b}"); // => 2 1

// Increment
n++;
n += 2;
Console.WriteLine(n); // => 3

// Classes, strings and arrays can be null. A value type such as int can't,
// unless you add ? to make it nullable.
int? maybe = null;
Console.WriteLine(maybe.HasValue); // => False

// ?? gives a default for null
Console.WriteLine(maybe ?? -1); // => -1
```

## If-statements

```csharp
// Parentheses around the condition are required
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

// Logical operators: && (and), || (or), ! (not)
int m = 5;
if (n > 0 && m > 0)
{
    Console.WriteLine("both"); // => both
}
Console.WriteLine($"{!true} {true || false}"); // => False True

// CAREFUL: a condition must be a bool; 0 and null aren't falsy
// if (n) { }  // error CS0029: Cannot implicitly convert type 'int' to 'bool'

// Ternary operator
string parity = n % 2 == 0 ? "even" : "odd";
Console.WriteLine(parity); // => odd

// Unlike Java, == compares the contents of two strings
string s1 = "hi";
string s2 = new string(new[] { 'h', 'i' });
Console.WriteLine(s1 == s2); // => True

// A switch expression with patterns returns a value
string size = n switch
{
    < 0 => "negative",
    < 10 => "small",
    _ => "large",
};
Console.WriteLine(size); // => small
```

## Loops

```csharp
int n = 0;
while (n < 3)
{
    Console.WriteLine(n);
    n++;
}
// => 0 1 2

// i = 0 to 4
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}
// => 0 1 2 3 4

// i = 2 to 5
for (int i = 2; i <= 5; i++)
{
    Console.WriteLine(i);
}
// => 2 3 4 5

// i = 5 down to 2
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

// foreach loops over any collection
foreach (int x in new[] { 7, 8 })
{
    Console.WriteLine(x);
}
// => 7 8

// C# has no labeled break; to leave nested loops, use a flag (or return from a function)
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

## Math

```csharp
// / on two ints is integer division
Console.WriteLine(5 / 2); // => 2

// Make one operand a double to keep the fraction
Console.WriteLine(5 / 2.0); // => 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
Console.WriteLine(-3 / 2); // => -1

// CAREFUL: % takes the sign of the dividend (Python gives 2)
Console.WriteLine(-10 % 3); // => -1

// A modulo that is never negative, e.g. for wrapping an index around
Console.WriteLine((-10 % 3 + 3) % 3); // => 2

// Floor, Ceiling, Sqrt and Pow work on doubles
Console.WriteLine($"{Math.Floor(-1.5)} {Math.Ceiling(-1.5)}"); // => -2 -1
Console.WriteLine($"{Math.Sqrt(16)} {Math.Pow(2, 10)} {Math.Abs(-7)}"); // => 4 1024 7
Console.WriteLine($"{Math.Max(3, 8)} {Math.Min(3, 8)}"); // => 8 3

// Casting a double to int truncates toward 0
Console.WriteLine((int)Math.Sqrt(17)); // => 4

// Limits and infinity
Console.WriteLine($"{int.MaxValue} {int.MinValue}"); // => 2147483647 -2147483648
Console.WriteLine(long.MaxValue); // => 9223372036854775807
Console.WriteLine(double.PositiveInfinity > 1e308); // => True

// CAREFUL: int overflow wraps around silently
int big = int.MaxValue;
big++;
Console.WriteLine(big); // => -2147483648

// Widen to long BEFORE multiplying when the product may not fit
int side = 50_000;
Console.WriteLine(side * side); // => -1794967296
Console.WriteLine((long)side * side); // => 2500000000

// checked turns overflow into an OverflowException
// checked(side * side);  // OverflowException
```

## Output and Input

```csharp
// WriteLine ends with a newline; Write doesn't
Console.Write("same ");
Console.WriteLine("line"); // => same line

// Interpolated strings embed values; :F2 formats with 2 decimals
string name = "alice";
int score = 90;
Console.WriteLine($"{name} scored {score}"); // => alice scored 90
Console.WriteLine($"{3.14159:F2}"); // => 3.14

// CAREFUL: printing a collection prints its type name; join the elements instead
List<int> nums = [1, 2, 3];
Console.WriteLine(nums); // => System.Collections.Generic.List`1[System.Int32]
Console.WriteLine(string.Join(" ", nums)); // => 1 2 3
```

```csharp
// ReadLine reads one line without the newline (it returns null at the end of input,
// hence the ! that tells the compiler it isn't null here)
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
// When numbers may be spread over lines, read all of stdin and split on any whitespace
// (a null separator array means "whitespace")
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

## Arrays

```csharp
// Arrays have a fixed size; [1, 2, 3] is a collection expression (C# 12)
int[] arr = [1, 2, 3];
Console.WriteLine(arr.Length); // => 3

// new int[n] fills the array with 0 (false for bool, null for objects)
int[] zeros = new int[5];
Console.WriteLine(string.Join(" ", zeros)); // => 0 0 0 0 0

// Fill with another value
int[] ones = new int[3];
Array.Fill(ones, 1);
Console.WriteLine(string.Join(" ", ones)); // => 1 1 1

// ^1 counts from the end
Console.WriteLine(arr[^1]); // => 3

// CAREFUL: a negative index throws; use ^1 instead
// arr[-1]  // IndexOutOfRangeException

// A range [start..end] copies a part, end exclusive
Console.WriteLine(string.Join(" ", arr[1..])); // => 2 3
Console.WriteLine(string.Join(" ", arr[..2])); // => 1 2

// LINQ adds queries to every collection
Console.WriteLine($"{arr.Contains(3)} {Array.IndexOf(arr, 3)} {arr.Sum()} {arr.Max()}"); // => True 2 6 3
```

```csharp
// List<T> is the dynamic array
List<int> list = [1, 2, 3];
list.Add(4);
Console.WriteLine($"{list.Count} {list[0]}"); // => 4 1

// Use it as a stack: add and remove at the end are O(1)
int top = list[^1];
list.RemoveAt(list.Count - 1);
Console.WriteLine($"{top} {list.Count}"); // => 4 3

// Insert and RemoveAt in the middle are O(n)
list.Insert(1, 7);
Console.WriteLine(string.Join(" ", list)); // => 1 7 2 3
list.RemoveAt(0);
Console.WriteLine(string.Join(" ", list)); // => 7 2 3

// A list of size n filled with a default value
List<int> fives = Enumerable.Repeat(5, 3).ToList();
Console.WriteLine(string.Join(" ", fives)); // => 5 5 5

// CAREFUL: new List<int>(5) sets the capacity; the list is still empty
var empty = new List<int>(5);
Console.WriteLine(empty.Count); // => 0

// CAREFUL: GetRange(index, count) takes a count, not an end index
Console.WriteLine(string.Join(" ", list.GetRange(1, 2))); // => 2 3

// Contains and IndexOf are O(n); use a HashSet for fast lookups
Console.WriteLine($"{list.Contains(2)} {list.IndexOf(2)}"); // => True 1
```

```csharp
int[] nums = [10, 20, 30];

// By index
for (int i = 0; i < nums.Length; i++)
{
    Console.WriteLine(nums[i]);
}
// => 10 20 30

// By value
foreach (int n in nums)
{
    Console.WriteLine(n);
}
// => 10 20 30

// Index and value together: the index loop, or LINQ's Select((value, index) => ...)
foreach (var (n, i) in nums.Select((n, i) => (n, i)))
{
    Console.WriteLine($"{i} {n}");
}
// => 0 10 1 20 2 30

// Two collections in lockstep; Zip stops at the shorter one
string[] letters = ["a", "b", "c"];
foreach (var (n, s) in nums.Zip(letters))
{
    Console.WriteLine($"{n} {s}");
}
// => 10 a 20 b 30 c

// CAREFUL: changing a List inside foreach throws InvalidOperationException; use RemoveAll
List<int> list = [1, 2, 3, 4];
list.RemoveAll(x => x % 2 == 0);
Console.WriteLine(string.Join(" ", list)); // => 1 3
```

```csharp
int[] nums = [5, 4, 7, 3, 8];

// Array.Reverse and Array.Sort work in place
Array.Reverse(nums);
Console.WriteLine(string.Join(" ", nums)); // => 8 3 7 4 5
Array.Sort(nums);
Console.WriteLine(string.Join(" ", nums)); // => 3 4 5 7 8

// Descending: pass a comparison that returns negative, zero or positive
Array.Sort(nums, (a, b) => b.CompareTo(a));
Console.WriteLine(string.Join(" ", nums)); // => 8 7 5 4 3

// List<T> has Sort and Reverse methods too.
// CAREFUL: strings sort by culture by default; StringComparer.Ordinal sorts by char code
List<string> words = ["bob", "Alice", "jane", "doe"];
words.Sort(StringComparer.Ordinal);
Console.WriteLine(string.Join(" ", words)); // => Alice bob doe jane

// LINQ's OrderBy returns a new sorted sequence; ThenBy breaks ties (by length, then alphabetically)
var byLength = words.OrderBy(w => w.Length).ThenBy(w => w, StringComparer.Ordinal);
Console.WriteLine(string.Join(" ", byLength)); // => bob doe jane Alice

// Sort pairs by their second element
int[][] pairs = [[1, 3], [2, 1], [3, 2]];
Array.Sort(pairs, (p, q) => p[1].CompareTo(q[1]));
Console.WriteLine(string.Join(" ", pairs.Select(p => $"[{p[0]},{p[1]}]"))); // => [2,1] [3,2] [1,3]
```

```csharp
// A jagged array (an array of rows) is what LeetCode uses for int[][] grids.
// Create each row separately.
int[][] grid = new int[3][];
for (int i = 0; i < 3; i++)
{
    grid[i] = new int[4];
}
grid[0][0] = 1;
Console.WriteLine($"{grid[0][0]} {grid[1][0]} {grid.Length} {grid[0].Length}"); // => 1 0 3 4

// CAREFUL: Enumerable.Repeat(row, n) repeats the SAME row object
int[][] bad = Enumerable.Repeat(new int[2], 3).ToArray();
bad[0][0] = 1;
Console.WriteLine($"{bad[1][0]} {bad[2][0]}"); // => 1 1

// A rectangular array is one block, indexed as [r, c]
int[,] rect = new int[3, 4];
rect[2, 3] = 5;
Console.WriteLine($"{rect[2, 3]} {rect.GetLength(0)} {rect.GetLength(1)}"); // => 5 3 4

// CAREFUL: in backtracking, save a copy of the path, not the path itself
List<int> path = [1, 2];
List<List<int>> res = [path, new List<int>(path)];
path[0] = 9;
Console.WriteLine($"{res[0][0]} {res[1][0]}"); // => 9 1
```

## Strings

```csharp
using System.Text;

string s = "abc";

// Index for a char; a range or Substring for a substring
Console.WriteLine($"{s[0]} {s[1..]} {s[^1]}"); // => a bc c

// CAREFUL: Substring(start, length) takes a length, not an end index
Console.WriteLine(s.Substring(1, 1)); // => b

// Strings are immutable
// s[0] = 'A';  // error CS0200: Property or indexer 'string.this[int]' cannot be assigned to -- it is read only
// To change characters, edit a char[] and make a new string
char[] chars = s.ToCharArray();
chars[0] = 'A';
Console.WriteLine(new string(chars)); // => Abc

// + creates a new string each time; build in a loop with StringBuilder
var sb = new StringBuilder();
foreach (char c in "abc")
{
    sb.Append(char.ToUpper(c));
}
Console.WriteLine(sb.ToString()); // => ABC

// String <-> number
Console.WriteLine(int.Parse("123") + 1); // => 124
Console.WriteLine(123.ToString() + "4"); // => 1234
// int.Parse("12a") throws FormatException; TryParse returns false instead
Console.WriteLine(int.TryParse("12a", out int value)); // => False

// Char <-> code
Console.WriteLine($"{(int)'a'} {(char)('a' + 1)}"); // => 97 b

// CAREFUL: char + int is an int
Console.WriteLine('a' + 1); // => 98

// Digit to number, and a letter's index into an int[26]
Console.WriteLine($"{'7' - '0'} {'c' - 'a'}"); // => 7 2
Console.WriteLine($"{char.IsDigit('7')} {char.IsLetter('x')}"); // => True True
```

```csharp
// Split on spaces, dropping the empty strings that runs of spaces would create
string[] words = "the quick  brown fox".Split(' ', StringSplitOptions.RemoveEmptyEntries);
Console.WriteLine(words.Length); // => 4
Console.WriteLine(string.Join("-", words)); // => the-quick-brown-fox

// == compares contents; for order, use CompareOrdinal (negative, zero or positive)
Console.WriteLine(string.CompareOrdinal("apple", "banana") < 0); // => True
// CAREFUL: < and > don't work on strings
// "a" < "b"  // error CS0019: Operator '<' cannot be applied to operands of type 'string' and 'string'

// Reverse through a char array
char[] letters = "hello".ToCharArray();
Array.Reverse(letters);
Console.WriteLine(new string(letters)); // => olleh

Console.WriteLine($"{"hello".Contains("ell")} {"hello".IndexOf('l')}"); // => True 2
Console.WriteLine($"{"Hi".ToLower()} {"  x ".Trim()} {new string('a', 3)}"); // => hi x aaa
```

## Queues

```csharp
// Queue<T> is FIFO: Enqueue at the back, Dequeue from the front
var queue = new Queue<int>();
queue.Enqueue(1);
queue.Enqueue(2);
queue.Enqueue(3);
Console.WriteLine($"{queue.Peek()} {queue.Count}"); // => 1 3

// Typical BFS loop
while (queue.Count > 0)
{
    Console.WriteLine(queue.Dequeue());
}
// => 1 2 3

// CAREFUL: Dequeue and Peek throw on an empty queue; TryDequeue returns false instead
Console.WriteLine(queue.TryDequeue(out int item)); // => False

// Stack<T> is LIFO: Push, Pop, Peek
var stack = new Stack<int>();
stack.Push(1);
stack.Push(2);
Console.WriteLine($"{stack.Peek()} {stack.Pop()} {stack.Count}"); // => 2 2 1
```

```csharp
// .NET has no deque type. LinkedList<T> is O(1) at both ends.
var dq = new LinkedList<int>();
dq.AddLast(1);
dq.AddLast(2);
dq.AddFirst(0);

// Peek at the front and the back (First and Last are nodes; Value is the item)
Console.WriteLine($"{dq.First!.Value} {dq.Last!.Value} {dq.Count}"); // => 0 2 3

// RemoveFirst and RemoveLast return nothing, so read the value first
int front = dq.First.Value;
dq.RemoveFirst();
int back = dq.Last.Value;
dq.RemoveLast();
Console.WriteLine($"{front} {back} {dq.Count}"); // => 0 2 1

// CAREFUL: First and Last are null on an empty list
dq.RemoveFirst();
Console.WriteLine(dq.First == null); // => True
```

## HashSets

```csharp
var seen = new HashSet<int>();
seen.Add(1);
seen.Add(2);

// Add returns false if the item was already there
Console.WriteLine(seen.Add(2)); // => False
Console.WriteLine(seen.Count); // => 2

Console.WriteLine($"{seen.Contains(1)} {seen.Contains(3)}"); // => True False

// Remove returns false if the item was missing; it doesn't throw
Console.WriteLine($"{seen.Remove(2)} {seen.Remove(42)}"); // => True False

// Build from an array
int[] nums = [3, 1, 3, 2];
var set = new HashSet<int>(nums);
Console.WriteLine(set.Count); // => 3

// CAREFUL: a HashSet's iteration order is unspecified; sort, or use a SortedSet
Console.WriteLine(string.Join(" ", set.Order())); // => 1 2 3

// Union, intersection and difference modify the set in place
var a = new SortedSet<int> { 1, 2, 3 };
a.IntersectWith([2, 3, 4]);
Console.WriteLine(string.Join(" ", a)); // => 2 3

// SortedSet also gives the smallest and largest item in O(log n)
var sorted = new SortedSet<int> { 4, 1, 9 };
Console.WriteLine($"{sorted.Min} {sorted.Max}"); // => 1 9
```

## HashMaps

```csharp
var scores = new Dictionary<string, int>();

// The indexer adds a key or overwrites it
scores["alice"] = 88;
scores["bob"] = 77;
scores["alice"] = 80;
Console.WriteLine($"{scores["alice"]} {scores.Count}"); // => 80 2

// CAREFUL: Add throws if the key already exists
// scores.Add("bob", 1);  // ArgumentException: An item with the same key has already been added

// CAREFUL: reading a missing key with the indexer throws
// scores["zoe"]  // KeyNotFoundException
Console.WriteLine(scores.GetValueOrDefault("zoe", 0)); // => 0

// TryGetValue checks and reads in one lookup
if (scores.TryGetValue("bob", out int bobScore))
{
    Console.WriteLine(bobScore); // => 77
}

Console.WriteLine(scores.ContainsKey("alice")); // => True
scores.Remove("alice");
Console.WriteLine(scores.ContainsKey("alice")); // => False
```

```csharp
// CAREFUL: a Dictionary's iteration order is unspecified;
// a SortedDictionary keeps its keys sorted
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

// Each entry is a KeyValuePair, which deconstructs into (key, value)
foreach (var (key, val) in scores)
{
    Console.WriteLine($"{key} {val}");
}
// => alice 90 bob 70
```

```csharp
// Counting: GetValueOrDefault gives 0 for a missing key
var count = new Dictionary<char, int>();
foreach (char ch in "banana")
{
    count[ch] = count.GetValueOrDefault(ch) + 1;
}
Console.WriteLine($"{count['a']} {count['n']}"); // => 3 2

// For lowercase letters, an int[26] is faster
int[] freq = new int[26];
foreach (char ch in "banana")
{
    freq[ch - 'a']++;
}
Console.WriteLine($"{freq[0]} {freq[1]}"); // => 3 1

// Grouping: create the list on first use
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

## Tuples

```csharp
// Value tuples group a few values; the element names are optional
(int Min, int Max) MinMax(int[] nums) => (nums.Min(), nums.Max());

// Deconstruct into variables, or keep the tuple and use the names
var (lo, hi) = MinMax([3, 1, 4]);
Console.WriteLine($"{lo} {hi}"); // => 1 4
var result = MinMax([5, 9]);
Console.WriteLine($"{result.Min} {result.Item2}"); // => 5 9

// Tuples print and compare by value
Console.WriteLine((1, "one")); // => (1, one)
Console.WriteLine((1, 2) == (1, 2)); // => True

// So they make good composite keys for a HashSet or Dictionary
var visited = new HashSet<(int, int)> { (0, 1) };
Console.WriteLine(visited.Contains((0, 1))); // => True
var dist = new Dictionary<(int R, int C), int> { [(0, 1)] = 1 };
Console.WriteLine(dist[(0, 1)]); // => 1
```

## Heaps

```csharp
// PriorityQueue<TElement, TPriority> is a min-heap: each element has a separate priority
var tasks = new PriorityQueue<string, int>();
tasks.Enqueue("write", 2);
tasks.Enqueue("plan", 1);
tasks.Enqueue("ship", 3);

// Peek returns the element with the smallest priority
Console.WriteLine($"{tasks.Peek()} {tasks.Count}"); // => plan 3

// TryDequeue gives you the priority as well
while (tasks.TryDequeue(out string? task, out int priority))
{
    Console.WriteLine($"{priority} {task}");
}
// => 1 plan 2 write 3 ship

// CAREFUL: Dequeue and Peek throw on an empty queue
// tasks.Dequeue();  // InvalidOperationException: Queue empty.
```

```csharp
// For plain numbers, use each number as its own priority.
// The constructor builds the heap from (element, priority) pairs in O(n).
int[] nums = [5, 1, 8, 3];
var minHeap = new PriorityQueue<int, int>(nums.Select(x => (x, x)));
Console.WriteLine(minHeap.Dequeue()); // => 1

// Max-heap: reverse the priority comparer
var maxHeap = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => b.CompareTo(a)));
foreach (int x in nums)
{
    maxHeap.Enqueue(x, x);
}
Console.WriteLine(maxHeap.Dequeue()); // => 8

// Custom priority: a tuple priority compares element by element (here by cost, then by id)
var pq = new PriorityQueue<string, (int Cost, int Id)>();
pq.Enqueue("b", (2, 1));
pq.Enqueue("a", (2, 0));
pq.Enqueue("c", (1, 5));
Console.WriteLine($"{pq.Dequeue()} {pq.Dequeue()} {pq.Dequeue()}"); // => c a b

// CAREFUL: you can't change a queued item's priority. Enqueue it again and
// skip outdated entries when they come out (the usual Dijkstra approach)
```

## Functions

```csharp
// Top-level code can declare local functions; inside a class they would be methods.
// An arrow after the parameters gives a one-expression body.
int Multiply(int n, int m) => n * m;
Console.WriteLine(Multiply(3, 4)); // => 12

// Optional parameters, and named arguments at the call site
string Greet(string name, string greeting = "Hello") => $"{greeting}, {name}!";
Console.WriteLine(Greet("Ann")); // => Hello, Ann!
Console.WriteLine(Greet("Ann", greeting: "Hi")); // => Hi, Ann!

// params accepts any number of arguments as an array
int Sum(params int[] nums) => nums.Sum();
Console.WriteLine(Sum(1, 2, 3)); // => 6

// Lambdas: Func<..., TResult> returns a value, Action<...> returns nothing
Func<int, int> square = x => x * x;
Action<string> say = msg => Console.WriteLine(msg);
Console.WriteLine(square(5)); // => 25
say("hi"); // => hi

// Local functions and lambdas can read and change the variables around them
int total = 0;
void Add(int n) => total += n;
Add(3);
Add(4);
Console.WriteLine(total); // => 7
```

```csharp
// Arrays, lists and class objects are passed as references to the same object,
// so changes to the object are visible to the caller...
void SetFirst(int[] arr) => arr[0] = 99;

// ...but assigning a new object to the parameter is not
void Replace(int[] arr) => arr = [7];

int[] nums = [1, 2];
SetFirst(nums);
Replace(nums);
Console.WriteLine(string.Join(" ", nums)); // => 99 2

// int, tuples and other structs are copied; ref passes the variable itself
void Increment(ref int n) => n++;
int x = 5;
Increment(ref x);
Console.WriteLine(x); // => 6

// out returns an extra value, as int.TryParse does
bool TryHalf(int n, out int half)
{
    half = n / 2;
    return n % 2 == 0;
}
bool even = TryHalf(8, out int h);
Console.WriteLine($"{even} {h}"); // => True 4
```

## Classes

```csharp
var p = new Point(3, 4);
Console.WriteLine(p.DistSq()); // => 25
Console.WriteLine(p); // => Point(3, 4)

// Sort with a comparison (or implement IComparable<Point>)
List<Point> pts = [new Point(2, 2), new Point(1, 0)];
pts.Sort((a, b) => a.DistSq().CompareTo(b.DistSq()));
Console.WriteLine(string.Join(" ", pts)); // => Point(1, 0) Point(2, 2)

// CAREFUL: a class compares by reference, so equal-looking objects are different keys
Console.WriteLine(new Point(1, 1).Equals(new Point(1, 1))); // => False

// A record compares by value, so it works as a HashSet or Dictionary key
var cells = new HashSet<Cell> { new Cell(0, 1) };
Console.WriteLine(cells.Contains(new Cell(0, 1))); // => True
Console.WriteLine(new Cell(2, 3)); // => Cell { R = 2, C = 3 }

// Type declarations go after the top-level statements
class Point
{
    // Properties: public data with get/set accessors
    public int X { get; set; }
    public int Y { get; set; }

    // Constructor
    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    public int DistSq() => X * X + Y * Y;

    // Optional: how the object prints
    public override string ToString() => $"Point({X}, {Y})";
}

// A one-line immutable type with value equality and ToString for free
record Cell(int R, int C);
```

```csharp
// LeetCode compiles without nullable reference checks, so turn them off here
#nullable disable

// 1 -> 2 -> 3
var head = new ListNode(1, new ListNode(2, new ListNode(3)));

// Walk the list until the end (null)
for (var node = head; node != null; node = node.next)
{
    Console.WriteLine(node.val);
}
// => 1 2 3

// LeetCode's linked list node for C#
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

// In-order traversal; a missing child is null
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

// LeetCode's binary tree node for C#
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

// On LeetCode you complete a method of class Solution (method names are PascalCase)
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
