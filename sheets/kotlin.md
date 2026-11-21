# Kotlin Cheat Sheet

> Written for Kotlin 2.1

The Kotlin you need to solve LeetCode-style problems, for programmers who already know another language. Every snippet runs as is, and `// =>` shows what it prints.

## Running a Program

```kotlin
fun main() {
    // The JVM starts the top-level main function in Main.kt.
    println("hello") // => hello
}
```

```bash
kotlinc Main.kt -include-runtime -d main.jar
java -jar main.jar
```

## Variables

```kotlin
fun main() {
    var steps = 1
    val limit: Long = 4_000_000_000L
    val ratio: Double = 0.5
    val ready: Boolean = true
    val grade: Char = 'A'
    steps++
    println("$steps $limit $ratio $ready $grade") // => 2 4000000000 0.5 true A

    // A nullable type takes ?. The Elvis operator supplies a fallback.
    var label: String? = null
    println(label?.length ?: -1) // => -1
    label = "go"
    println(label.length) // => 2
    // CAREFUL: val fixes the reference, so mutable collection contents can still change.
    val route = mutableListOf(1)
    route.add(2)
    println(route) // => [1, 2]
    var a = 1
    var b = 2
    val tmp = a
    a = b
    b = tmp
    println("$a $b") // => 2 1
}
```

## If-statements

```kotlin
fun main() {
    val x = 7
    val group = if (x <= 0) {
        "low"
    } else if (x in 1..9 && x != 5) {
        "middle"
    } else {
        "high"
    }
    // if is an expression, including in the usual ternary use case.
    val parity = if (x % 2 == 0) "even" else "odd"
    println("$group $parity") // => middle odd
    println(!(x < 0 || x > 10)) // => true
}
```

## Loops

```kotlin
fun main() {
    var n = 2
    while (n > 0) println(n--)
    // => 2 1
    for (i in 0..<6) {
        if (i == 1) continue
        if (i == 4) break
        println(i)
    }
    // => 0 2 3
    for (i in 2..4) println(i)
    // => 2 3 4
    for (i in 4 downTo 2) println(i)
    // => 4 3 2
}
```

## Math

```kotlin
import kotlin.math.*

fun main() {
    val a = -3
    // CAREFUL: Int / Int drops the fraction toward zero.
    println("${a / 2} ${a / 2.0} ${-10 % 3}") // => -1 -1.5 -1
    println("${floor(-1.5)} ${ceil(-1.5)} ${sqrt(9.0)}") // => -2.0 -1.0 3.0
    println("${2.0.pow(5)} ${abs(-5)}") // => 32.0 5
    println("${Int.MIN_VALUE} ${Int.MAX_VALUE} ${Double.POSITIVE_INFINITY}") // => -2147483648 2147483647 Infinity
    val side = 50_000
    // Widen the first operand to keep the product in Long.
    println("${side * side} ${side.toLong() * side}") // => -1794967296 2500000000
}
```

## Output and Input

```kotlin
fun main() {
    // Keep the first line intact. Tokenize the remaining lines for judge input.
    val input = System.`in`.bufferedReader()
    println(input.readLine()) // => case one
    val tokens = input.lineSequence().flatMap { it.trim().splitToSequence(Regex("\\s+")) }
        .filter { it.isNotEmpty() }.map { it.toInt() }.iterator()
    val n = tokens.next()
    var sum = 0L
    repeat(n) { sum += tokens.next() }
    println("$n $sum") // => 3 9
}
```

```text stdin
case one
3
2 3
4
```

## Arrays

```kotlin
fun main() {
    // IntArray stores primitive ints. Array<Int> boxes each value on the JVM.
    val fixed = IntArray(3)
    val boxed: Array<Int> = arrayOf(1, 2)
    println("${fixed.contentToString()} ${boxed.size}") // => [0, 0, 0] 2
    val nums = MutableList(3) { 0 }
    nums[1] = 4
    nums.add(7)
    println("${nums.removeLast()} ${nums.size} ${nums[1]}") // => 7 3 4
    // getOrNull accepts out-of-range indices. Sublist endpoints are half-open.
    println("${nums.getOrNull(-1)} ${nums.subList(1, 3)}") // => null [4, 0]
    for (i in nums.indices) println(i)
    // => 0 1 2
    for (x in nums) println(x)
    // => 0 4 0
    for ((i, x) in nums.withIndex()) println("$i $x")
    // => 0 0 1 4 2 0
    for ((x, w) in nums.zip(listOf(2, 3))) println(x * w)
    // => 0 12
}
```

```kotlin
fun main() {
    val nums = mutableListOf(4, 1, 3)
    nums.reverse()
    println(nums) // => [3, 1, 4]
    nums.sort()
    println(nums) // => [1, 3, 4]
    nums.sortDescending()
    println(nums) // => [4, 3, 1]
    println(listOf("four", "a", "to").sortedBy { it.length }) // => [a, to, four]
    val grid = Array(2) { IntArray(3) }
    grid[0][0] = 7
    println(grid[1][0]) // => 0
}
```

## Strings

```kotlin
fun main() {
    val s = "code"
    println("${s[0]} ${s.substring(1, 3)}") // => c od
    // Strings are immutable. buildString supplies a StringBuilder receiver.
    val upper = buildString {
        for (ch in s) append(ch.uppercaseChar())
    }
    println("go-" + upper) // => go-CODE
    println("${"41".toInt() + 1} ${41.toString() + "2"}") // => 42 412
    println("${'a'.code} ${98.toChar()}") // => 97 b
    println("one  two".split(Regex("\\s+")).joinToString("-")) // => one-two
    println("ant" < "bee") // => true
}
```

## Queues

```kotlin
fun main() {
    val q = ArrayDeque<Int>()
    q.addLast(2)
    q.addFirst(1)
    println("${q.first()} ${q.last()} ${q.size}") // => 1 2 2
    println("${q.removeFirst()} ${q.removeLast()} ${q.removeFirstOrNull()}") // => 1 2 null
}
```

## HashSets

```kotlin
fun main() {
    val seen = intArrayOf(2, 3, 2).toHashSet()
    seen.add(5)
    seen.remove(3)
    println("${2 in seen} ${seen.size}") // => true 2
    for (x in seen.sorted()) println(x)
    // => 2 5
}
```

## HashMaps

```kotlin
fun main() {
    val counts = hashMapOf<Char, Int>()
    counts['x'] = 4
    counts['x'] = 5
    println("${counts['x']} ${'x' in counts}") // => 5 true
    counts.remove('x')
    // CAREFUL: map[key] is nullable. Supply zero when counting a new key.
    println(counts['x']) // => null
    for (ch in "banana") counts[ch] = (counts[ch] ?: 0) + 1
    println(counts.size) // => 3
    for (k in counts.keys.sorted()) println(k)
    // => a b n
    for (v in counts.values.sorted()) println(v)
    // => 1 2 3
    for ((k, v) in counts.toSortedMap()) println("$k $v")
    // => a 3 b 1 n 2
}
```

## Tuples

```kotlin
fun bounds(xs: List<Int>): Pair<Int, Int> = xs.min() to xs.max()

fun main() {
    val (lo, hi) = bounds(listOf(4, 1, 7))
    println("$lo $hi") // => 1 7
    val distance = mutableMapOf((2 to 3) to 5)
    println(distance[2 to 3]) // => 5
}
```

## Heaps

```kotlin
import java.util.PriorityQueue

fun main() {
    // Use the JVM's PriorityQueue. poll removes the head.
    val min = PriorityQueue(listOf(5, 2, 3))
    min.offer(1)
    println("${min.peek()} ${min.poll()} ${min.size}") // => 1 1 3
    val max = PriorityQueue<Int>(reverseOrder())
    max.addAll(listOf(5, 2, 3))
    println(max.remove()) // => 5
    val jobs = PriorityQueue<Pair<String, Int>>(compareBy { it.second })
    jobs.add("ship" to 3)
    jobs.add("plan" to 1)
    println(jobs.remove().first) // => plan
}
```

## Functions

```kotlin
fun edit(nums: IntArray): IntArray {
    nums[0] = 7
    // Parameters are read-only bindings. Return a new array to replace one.
    return intArrayOf(9)
}

fun main() {
    val a = intArrayOf(1, 2)
    println("${edit(a)[0]} ${a[0]}") // => 9 7
    var total = 0
    fun add(step: Int): Int {
        total += step
        return total
    }
    val square: (Int) -> Int = { it * it }
    println("${add(3)} ${add(4)} ${square(5)}") // => 3 7 25
}
```

## Classes

```kotlin
class Point(val x: Int, val y: Int) {
    fun distSq() = x * x + y * y
}

fun main() {
    println(Point(3, 4).distSq()) // => 25
}
```

```kotlin
class ListNode(var `val`: Int) {
    var next: ListNode? = null
}
class TreeNode(var `val`: Int) {
    var left: TreeNode? = null
    var right: TreeNode? = null
}
fun inorder(node: TreeNode?) {
    if (node == null) return
    inorder(node.left)
    println(node.`val`)
    inorder(node.right)
}

fun main() {
    val head = ListNode(1).apply { next = ListNode(2) }
    var node: ListNode? = head
    while (node != null) {
        println(node.`val`)
        node = node.next
    }
    // => 1 2
    val root = TreeNode(2).apply {
        left = TreeNode(1)
        right = TreeNode(3)
    }
    inorder(root) // => 1 2 3
    println(root.left?.right == null) // => true
}
```
