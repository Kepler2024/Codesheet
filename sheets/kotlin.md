# Kotlin Cheat Sheet

> Written for Kotlin 2.1

Use this quick reference to learn or revisit Kotlin syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```kotlin
// A program starts at a top-level fun main(); no class is needed
fun main() {
    println("Hello, World!") // => Hello, World!
}
```

```bash
kotlinc hello.kt -include-runtime -d hello.jar
java -jar hello.jar
```

```kotlin
// Most blocks below are just the body of main, to keep them short.
// To run one yourself, keep the imports at the top and put the rest inside fun main() { ... }.
println("Hello from main") // => Hello from main
```

## Variables

```kotlin
// val can't be reassigned; var can. Prefer val.
val limit = 100
// limit = 200  // error: 'val' cannot be reassigned.
var n = 0
n = 5
println(n) // => 5

// The type is inferred from the value, and then it is fixed
// n = "abc"  // error: assignment type mismatch

// Explicit types: Int, Long, Double, Boolean, Char, String
val big: Long = 4_000_000_000L
val ratio: Double = 0.5
val done: Boolean = false
val letter: Char = 'a'

// "$name" and "${expression}" embed values in a string
println("$big $ratio $done $letter") // => 4000000000 0.5 false a

// CAREFUL: val doesn't freeze an object; a mutable list in a val can still change
val path = mutableListOf(1)
path.add(2)
println(path) // => [1, 2]

// Swap: also runs the block and then returns b's old value
var a = 1
var b = 2
a = b.also { b = a }
println("$a $b") // => 2 1

// Increment
n++
n += 2
println(n) // => 8
```

```kotlin
// Types can't hold null unless you add ?
var name: String? = null
// var bad: String = null  // error: null cannot be a value of a non-null type 'String'

// ?. calls only when the value isn't null; ?: (the Elvis operator) supplies a default
println(name?.length) // => null
println(name?.length ?: -1) // => -1

// After a null check, the compiler treats the value as non-null (a smart cast)
name = "kotlin"
if (name != null) {
    println(name.length) // => 6
}

// !! asserts "not null", and throws NullPointerException if it is null
println(name!!.uppercase()) // => KOTLIN
```

## If-statements

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

// Logical operators: && (and), || (or), ! (not)
val m = 5
if (n > 0 && m > 0) {
    println("both") // => both
}
println("${!true} ${true || false}") // => false true

// if is an expression, and replaces the ternary operator (Kotlin has no cond ? a : b)
val parity = if (n % 2 == 0) "even" else "odd"
println(parity) // => odd

// in tests membership in a range
println(n in 1..5) // => true

// Unlike Java, == compares contents (it calls equals); === compares references
val s1 = "hi"
val s2 = StringBuilder("h").append("i").toString()
println("${s1 == s2} ${s1 === s2}") // => true false

// when replaces switch, and also returns a value
val size = when {
    n < 0 -> "negative"
    n < 10 -> "small"
    else -> "large"
}
println(size) // => small
```

## Loops

```kotlin
var n = 0
while (n < 3) {
    println(n)
    n++
}
// => 0 1 2

// i = 0 to 4: until (or ..<) excludes the end
for (i in 0 until 5) {
    println(i)
}
// => 0 1 2 3 4

// i = 2 to 5: .. includes the end
for (i in 2..5) {
    println(i)
}
// => 2 3 4 5

// i = 5 down to 2
for (i in 5 downTo 2) {
    println(i)
}
// => 5 4 3 2

// step skips values
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

// repeat(n) runs a block n times; it is the index
repeat(2) {
    println("hi $it")
}
// => hi 0 hi 1

// A label (name@) lets break or continue act on an outer loop
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

## Math

```kotlin
import kotlin.math.*

// / on two Ints is integer division
println(5 / 2) // => 2
println(5 / 2.0) // => 2.5

// Convert explicitly with toDouble(), toInt(), toLong()
val a = 5
println(a.toDouble() / 2) // => 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2); floorDiv rounds down
println(-3 / 2) // => -1
println((-3).floorDiv(2)) // => -2

// CAREFUL: % takes the sign of the dividend (Python gives 2); mod takes the divisor's sign
println(-10 % 3) // => -1
println((-10).mod(3)) // => 2

// floor, ceil, sqrt and pow work on Double
println("${floor(-1.5)} ${ceil(-1.5)}") // => -2.0 -1.0
println("${sqrt(16.0)} ${2.0.pow(10)} ${abs(-7)}") // => 4.0 1024.0 7
// sqrt(16)  // error: an Int argument doesn't compile; write 16.0 or n.toDouble()

// max and min take two values; maxOf and minOf take any number
println("${max(3, 8)} ${min(3, 8)} ${maxOf(3, 8, 1)}") // => 8 3 8

// Converting a Double to Int truncates toward 0
println(sqrt(17.0).toInt()) // => 4

// Limits and infinity
println("${Int.MAX_VALUE} ${Int.MIN_VALUE}") // => 2147483647 -2147483648
println(Long.MAX_VALUE) // => 9223372036854775807
println(Double.POSITIVE_INFINITY) // => Infinity

// CAREFUL: Int overflow wraps around silently
var big = Int.MAX_VALUE
big++
println(big) // => -2147483648

// Widen to Long BEFORE multiplying when the product may not fit
val side = 50_000
println(side * side) // => -1794967296
println(side.toLong() * side) // => 2500000000
```

## Output and Input

```kotlin
// println ends with a newline; print doesn't
print("same ")
println("line") // => same line

// String templates embed variables and expressions
val name = "alice"
val score = 90
println("$name scored $score") // => alice scored 90
println("${name.uppercase()} has ${name.length} letters") // => ALICE has 5 letters

// A fixed number of decimals
println("%.2f".format(3.14159)) // => 3.14

// Lists print with brackets; joinToString controls the format
val nums = listOf(1, 2, 3)
println(nums) // => [1, 2, 3]
println(nums.joinToString(" ")) // => 1 2 3

// CAREFUL: an array prints as a reference like [I@1b6d3586; use contentToString()
val arr = intArrayOf(1, 2, 3)
println(arr.contentToString()) // => [1, 2, 3]
```

```kotlin
// readln() reads one line without the newline (readlnOrNull() returns null at the end)
val n = readln().toInt()
val nums = readln().split(" ").map { it.toInt() }
println("$n ${nums.sum()}") // => 3 6
```

```text stdin
3
1 2 3
```

```kotlin
// When numbers may be spread over lines, read all of stdin and split on any whitespace
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

## Arrays

```kotlin
// List is read-only; MutableList can change. Both are backed by a dynamic array.
val fixed = listOf(1, 2, 3)
// fixed.add(4)  // error: unresolved reference 'add'
val arr = mutableListOf(1, 2, 3)
println("$arr ${arr.size}") // => [1, 2, 3] 3

// Use it as a stack: add and removeLast at the end are O(1)
arr.add(4)
println(arr.removeLast()) // => 4

// Peek at the top
println(arr.last()) // => 3

// add(index, value) and removeAt(index) are O(n)
arr.add(1, 7)
println(arr) // => [1, 7, 2, 3]
arr.removeAt(0)
println(arr) // => [7, 2, 3]

// A list of size n; the lambda computes each element from its index (it)
println(MutableList(5) { 0 }) // => [0, 0, 0, 0, 0]
println(List(4) { it * it }) // => [0, 1, 4, 9]

// CAREFUL: there are no negative indexes, and an index out of range throws;
// getOrNull returns null instead
// arr[-1]  // IndexOutOfBoundsException
println("${arr[arr.lastIndex]} ${arr.getOrNull(10)}") // => 3 null

// subList(from, to) is a view, end exclusive; slice, take and drop make copies
val nums = listOf(1, 2, 3, 4)
println("${nums.subList(1, 3)} ${nums.slice(1..2)}") // => [2, 3] [2, 3]
println("${nums.take(2)} ${nums.drop(2)} ${nums.takeLast(1)}") // => [1, 2] [3, 4] [4]

// Destructuring takes the first elements
val (first, second) = nums
println("$first $second") // => 1 2

// in (contains) and indexOf are O(n); use a Set for fast lookups
println("${3 in nums} ${nums.indexOf(3)} ${nums.sum()} ${nums.max()}") // => true 2 10 4

// map and filter return new lists
println(nums.map { it * 2 }) // => [2, 4, 6, 8]
println(nums.filter { it % 2 == 0 }) // => [2, 4]
```

```kotlin
// IntArray is a fixed-size array of primitive ints (Java's int[]).
// LeetCode uses it for int[] parameters.
val arr = IntArray(3)
val ones = IntArray(3) { 1 }
val lit = intArrayOf(3, 1, 2)
println("${arr.contentToString()} ${ones.contentToString()} ${lit.size}") // => [0, 0, 0] [1, 1, 1] 3

// CAREFUL: IntArray isn't Array<Int>; Array<Int> stores boxed Integers and is slower
val boxed: Array<Int> = arrayOf(3, 1, 2)
println(boxed.sum()) // => 6

// CAREFUL: == on arrays compares references; use contentEquals
println("${lit == intArrayOf(3, 1, 2)} ${lit contentEquals intArrayOf(3, 1, 2)}") // => false true

// Convert between arrays and lists
val list: List<Int> = lit.toList()
val back: IntArray = list.toIntArray()
println("$list ${back.size}") // => [3, 1, 2] 3
```

```kotlin
val nums = listOf(10, 20, 30)

// By index
for (i in nums.indices) {
    println(nums[i])
}
// => 10 20 30

// By value
for (n in nums) {
    println(n)
}
// => 10 20 30

// Index and value together
for ((i, n) in nums.withIndex()) {
    println("$i $n")
}
// => 0 10 1 20 2 30

// Two lists in lockstep; zip stops at the shorter one
for ((n, ch) in nums.zip(listOf("a", "b", "c"))) {
    println("$n $ch")
}
// => 10 a 20 b 30 c

// CAREFUL: removing from a list inside a for loop throws ConcurrentModificationException;
// use removeAll
val list = mutableListOf(1, 2, 3, 4)
list.removeAll { it % 2 == 0 }
println(list) // => [1, 3]
```

```kotlin
val nums = mutableListOf(5, 4, 7, 3, 8)

// reverse, sort and sortDescending work in place (on MutableList and IntArray)
nums.reverse()
println(nums) // => [8, 3, 7, 4, 5]
nums.sort()
println(nums) // => [3, 4, 5, 7, 8]
nums.sortDescending()
println(nums) // => [8, 7, 5, 4, 3]

// sorted, sortedDescending and reversed return new lists
val words = listOf("bob", "alice", "jane", "doe")
println("${words.sorted()} ${words[0]}") // => [alice, bob, doe, jane] bob

// Custom order: sortedBy a key, or sortedWith a comparator (by length, then alphabetically)
println(words.sortedBy { it.length }) // => [bob, doe, jane, alice]
println(words.sortedWith(compareBy({ it.length }, { it }))) // => [bob, doe, jane, alice]

// Sort pairs by their second element
val pairs = mutableListOf(1 to 3, 2 to 1, 3 to 2)
pairs.sortBy { it.second }
println(pairs) // => [(2, 1), (3, 2), (1, 3)]

// Array<IntArray> (LeetCode's int[][]) sorts with sortBy too
val intervals = arrayOf(intArrayOf(3, 4), intArrayOf(1, 2))
intervals.sortBy { it[0] }
println(intervals.joinToString { it.contentToString() }) // => [1, 2], [3, 4]
```

```kotlin
// 2-D array with 3 rows and 4 columns; the lambda creates a new row each time
val grid = Array(3) { IntArray(4) }
grid[0][0] = 1
println(grid.joinToString(" ") { it.contentToString() }) // => [1, 0, 0, 0] [0, 0, 0, 0] [0, 0, 0, 0]
println("${grid.size} ${grid[0].size}") // => 3 4

// A list of lists works the same way
val rows = List(2) { mutableListOf<Int>() }
rows[0].add(5)
println(rows) // => [[5], []]

// CAREFUL: a row created outside the lambda is the SAME row in every slot
val row = IntArray(2)
val bad = Array(3) { row }
bad[0][0] = 1
println("${bad[1][0]} ${bad[2][0]}") // => 1 1

// CAREFUL: in backtracking, save a copy of the path, not the path itself
val path = mutableListOf(1, 2)
val res = mutableListOf<List<Int>>(path, path.toList())
path[0] = 9
println(res) // => [[9, 2], [1, 2]]
```

## Strings

```kotlin
val s = "abc"

// [] gives a Char; substring(start, end) is end-exclusive
println("${s[0]} ${s.substring(1)} ${s.substring(0, 2)} ${s.last()}") // => a bc ab c

// CAREFUL: strings are immutable
// s[0] = 'A'  // error: no 'set' operator method providing array access
// To change characters, edit a CharArray and make a new String
val chars = s.toCharArray()
chars[0] = 'A'
println(String(chars)) // => Abc

// + creates a new string each time; build in a loop with buildString (a StringBuilder)
val upper = buildString {
    for (ch in "abc") {
        append(ch.uppercaseChar())
    }
}
println(upper) // => ABC

// String <-> number; toIntOrNull returns null instead of throwing
println("123".toInt() + 1) // => 124
println(123.toString() + "4") // => 1234
println("12a".toIntOrNull()) // => null

// Char <-> code
println("${'a'.code} ${98.toChar()}") // => 97 b

// CAREFUL: unlike Java, Char + Int is a Char, while Char - Char is an Int
println('a' + 1) // => b
println('c' - 'a') // => 2
println('7'.digitToInt()) // => 7

// CAREFUL: split(" ") keeps empty strings between double spaces; split on a regex instead
println("a  b".split(" ")) // => [a, , b]
val words = "the quick  brown fox".split(Regex("\\s+"))
println(words.size) // => 4
println(words.joinToString("-")) // => the-quick-brown-fox

// == compares contents; < and > compare lexicographically
println("${"apple" < "banana"} ${"a" == "a"}") // => true true

println("${"hello".reversed()} ${"hello".contains("ell")} ${"hello".indexOf('l')}") // => olleh true 2
println("${'7'.isDigit()} ${'x'.isLetter()} ${"Hi".lowercase()} ${"ab".repeat(2)}") // => true true hi abab
```

## Queues

```kotlin
// ArrayDeque is Kotlin's double-ended queue: O(1) at both ends.
// CAREFUL: after import java.util.*, the name ArrayDeque means Java's class instead,
// which has a different API (no dq[i] indexing, for one)
val dq = ArrayDeque<Int>()
dq.addLast(1)
dq.addLast(2)
dq.addFirst(0)
println(dq) // => [0, 1, 2]

println(dq.removeFirst()) // => 0
println(dq.removeLast()) // => 2

// Peek at the front and the back, and the size
dq.addLast(3)
println("${dq.first()} ${dq.last()} ${dq.size}") // => 1 3 2

// CAREFUL: first() and removeFirst() throw on an empty deque; the ...OrNull versions don't
dq.clear()
println("${dq.firstOrNull()} ${dq.removeFirstOrNull()}") // => null null

// Typical BFS loop
val queue = ArrayDeque(listOf(1, 2, 3))
while (queue.isNotEmpty()) {
    println(queue.removeFirst())
}
// => 1 2 3
```

## HashSets

```kotlin
// mutableSetOf keeps insertion order (it's a LinkedHashSet); hashSetOf keeps none
val seen = mutableSetOf<Int>()
seen.add(1)
seen.add(2)

// add returns false if the item was already there
println(seen.add(2)) // => false
println(seen.size) // => 2

println("${1 in seen} ${3 in seen}") // => true false

// remove returns false if the item was missing; it doesn't throw
println("${seen.remove(2)} ${seen.remove(42)}") // => true false
println(seen) // => [1]

// Build from a list
println(listOf(3, 1, 3, 2).toSet()) // => [3, 1, 2]

// union, intersect and subtract return new sets
val a = setOf(1, 2, 3)
val b = setOf(2, 3, 4)
println("${a union b} ${a intersect b} ${a subtract b}") // => [1, 2, 3, 4] [2, 3] [1]

// A sorted set (Java's TreeSet) keeps items in order
val sorted = sortedSetOf(4, 1, 9)
println("$sorted ${sorted.first()} ${sorted.last()}") // => [1, 4, 9] 1 9
```

## HashMaps

```kotlin
// mutableMapOf keeps insertion order (it's a LinkedHashMap); hashMapOf keeps none
val scores = mutableMapOf<String, Int>()
scores["alice"] = 88
scores["bob"] = 77
println("$scores ${scores.size}") // => {alice=88, bob=77} 2

scores["alice"] = 80
println(scores["alice"]) // => 80

// CAREFUL: map[key] has a nullable type (Int?) and is null for a missing key
println(scores["zoe"]) // => null
println("${scores["zoe"] ?: 0} ${scores.getOrDefault("zoe", 0)}") // => 0 0

// in checks for a key
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

// Each entry destructures into (key, value)
for ((key, value) in scores) {
    println("$key $value")
}
// => alice 90 bob 70

// Counting: read with a default, then write
val count = mutableMapOf<Char, Int>()
for (ch in "banana") {
    count[ch] = (count[ch] ?: 0) + 1
}
println(count) // => {b=1, a=3, n=2}

// groupingBy + eachCount does the same in one line
println("banana".groupingBy { it }.eachCount()) // => {b=1, a=3, n=2}

// getOrPut creates a missing value on first access, e.g. for grouping
val groups = mutableMapOf<String, MutableList<String>>()
for (word in listOf("eat", "tea", "tan")) {
    val key = word.toCharArray().sorted().joinToString("")
    groups.getOrPut(key) { mutableListOf() }.add(word)
}
println(groups) // => {aet=[eat, tea], ant=[tan]}
```

## Tuples

```kotlin
// Pair and Triple hold two or three values; `a to b` makes a Pair
fun minMax(nums: List<Int>): Pair<Int, Int> = nums.min() to nums.max()

fun main() {
    // Destructure the result, or use .first and .second
    val (lo, hi) = minMax(listOf(3, 1, 4))
    println("$lo $hi") // => 1 4
    val t = Triple(1, "one", 1.0)
    println("${t.second} $t") // => one (1, one, 1.0)

    // Pairs compare by value, so they work as map keys and set items
    val visited = mutableSetOf(0 to 1)
    println((0 to 1) in visited) // => true
    val dist = mutableMapOf((0 to 0) to 0)
    dist[0 to 1] = 1
    println(dist[0 to 1]) // => 1

    // CAREFUL: an IntArray key compares by reference, so lookups fail
    val bad = mutableSetOf(intArrayOf(0, 1))
    println(intArrayOf(0, 1) in bad) // => false

    // CAREFUL: Pairs aren't Comparable; sort them with compareBy
    val pairs = listOf(2 to "b", 1 to "z", 1 to "a")
    println(pairs.sortedWith(compareBy({ it.first }, { it.second }))) // => [(1, a), (1, z), (2, b)]
}
```

## Heaps

```kotlin
import java.util.PriorityQueue

// Kotlin uses Java's PriorityQueue, a min-heap by default
val minHeap = PriorityQueue<Int>()
minHeap.add(3)
minHeap.add(1)
minHeap.add(2)

// peek looks at the minimum; poll removes it
println(minHeap.peek()) // => 1
while (minHeap.isNotEmpty()) {
    println(minHeap.poll())
}
// => 1 2 3

// CAREFUL: on an empty heap, peek and poll return null, but Java doesn't mark them as
// nullable, so println(minHeap.poll()) throws NullPointerException. Store the result as Int?
val top: Int? = minHeap.poll()
println(top) // => null

// Build from a collection in O(n)
val heap = PriorityQueue(listOf(5, 1, 8, 3))
println("${heap.poll()} ${heap.size}") // => 1 3

// Max-heap: pass a reversed comparator
val maxHeap = PriorityQueue<Int>(reverseOrder())
maxHeap.addAll(listOf(3, 1, 5))
println(maxHeap.poll()) // => 5

// Custom priority: (priority, name) pairs ordered by priority
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

## Functions

```kotlin
// fun name(parameter: Type): ReturnType
fun multiply(n: Int, m: Int): Int {
    return n * m
}

// A one-expression function can use = and infer the return type
fun square(x: Int) = x * x

// Default values, and named arguments at the call site
fun greet(name: String, greeting: String = "Hello") = "$greeting, $name!"

// vararg accepts any number of arguments as an array
fun sum(vararg nums: Int) = nums.sum()

fun main() {
    println(multiply(3, 4)) // => 12
    println(square(5)) // => 25
    println(greet("Ann")) // => Hello, Ann!
    println(greet("Ann", greeting = "Hi")) // => Hi, Ann!
    println(sum(1, 2, 3)) // => 6

    // A lambda is { parameters -> body }; with one parameter you can just use it
    val add = { a: Int, b: Int -> a + b }
    val double: (Int) -> Int = { it * 2 }
    println("${add(2, 3)} ${double(4)}") // => 5 8

    // When the last argument is a lambda, it goes outside the parentheses
    println(listOf(1, 2, 3).map { it * 10 }) // => [10, 20, 30]
}
```

```kotlin
fun main() {
    // Local functions can read and change the variables around them,
    // which makes them handy as recursive DFS helpers
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

    // CAREFUL: parameters are read-only
    // fun inc(n: Int) { n++ }  // error: 'val' cannot be reassigned
}
```

```kotlin
// Objects are passed as references. Changing a list inside a function
// changes the caller's list...
fun appendOne(list: MutableList<Int>) {
    list.add(1)
}

// ...and since parameters can't be reassigned, return a new object to "replace" one
fun replaced(): MutableList<Int> = mutableListOf(99)

fun main() {
    val nums = mutableListOf<Int>()
    appendOne(nums)
    println(nums) // => [1]
    println(replaced()) // => [99]

    // Read-only List parameters can't be changed by the function at all
}
```

## Classes

```kotlin
// The primary constructor is in the class header; val/var parameters become properties
class Point(val x: Int, val y: Int) : Comparable<Point> {
    fun distSq() = x * x + y * y

    // Optional: how the object prints
    override fun toString() = "Point($x, $y)"

    // Optional: a natural order, so Points can be sorted or used in a PriorityQueue
    override fun compareTo(other: Point) = distSq().compareTo(other.distSq())
}

// A data class gets equals, hashCode, toString and copy for free
data class Cell(val r: Int, val c: Int)

fun main() {
    val p = Point(3, 4)
    println(p.distSq()) // => 25
    println(p) // => Point(3, 4)
    println(listOf(Point(2, 2), Point(1, 0)).sorted()) // => [Point(1, 0), Point(2, 2)]

    // CAREFUL: a plain class compares by reference, so equal-looking objects differ
    println(Point(1, 1) == Point(1, 1)) // => false

    // A data class compares by value, so it works as a map key or set item
    println(Cell(0, 1) == Cell(0, 1)) // => true
    println(Cell(2, 3)) // => Cell(r=2, c=3)
}
```

```kotlin
// LeetCode's linked list node for Kotlin; `val` needs backticks because val is a keyword
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}

fun main() {
    // 1 -> 2 -> 3; apply runs a block on the new object
    val head = ListNode(1).apply {
        next = ListNode(2).apply { next = ListNode(3) }
    }

    // Walk the list until the end (null)
    var node: ListNode? = head
    while (node != null) {
        println(node.`val`)
        node = node.next
    }
    // => 1 2 3
}
```

```kotlin
// LeetCode's binary tree node for Kotlin
class TreeNode(var `val`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}

// On LeetCode you complete a method of class Solution
class Solution {
    fun maxDepth(root: TreeNode?): Int {
        if (root == null) {
            return 0
        }
        return 1 + maxOf(maxDepth(root.left), maxDepth(root.right))
    }
}

// In-order traversal; a missing child is null
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
