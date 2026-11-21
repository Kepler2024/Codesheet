```kotlin
import java.util.PriorityQueue
val queue = PriorityQueue<Int>()
queue.add(3)
println(queue.peek()) // => 3
```

```kotlin
data class Box(val value: Int)
fun twice(x: Int) = x * 2
fun main() {
    println(twice(Box(3).value)) // => 6
}
```

```kotlin
for (i in 0 until 3) println(i)
// => 0 1 2
```

```kotlin
val count = readln().toInt()
val values = readln().split(" ").map { it.toInt() }
println(values.take(count).sum()) // => 12
```

```text stdin
3
2 4 6
```

```kotlin nocheck
println("uncompared")
```

```kotlin norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
