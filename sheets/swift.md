# Swift Cheat Sheet

> Written for Swift 6.1

Use this quick reference to learn or revisit Swift syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```swift
// A program is a file of statements that runs top to bottom; no main() is needed
print("Hello, World!") // => Hello, World!
```

```bash
swift hello.swift    # or compile first: swiftc hello.swift -o hello && ./hello
```

## Variables

```swift
// let declares a constant, var a variable. Prefer let.
let limit = 100
// limit = 200  // error: cannot assign to value: 'limit' is a 'let' constant
var n = 0
n = 5

// The type is inferred from the value, and then it is fixed
// n = "abc"  // error: cannot assign value of type 'String' to type 'Int'

// Explicit types: Int (64-bit), Double, Bool, Character, String
let ratio: Double = 0.5
let done: Bool = false
let letter: Character = "a"  // a Character also uses double quotes
print(ratio, done, letter) // => 0.5 false a

// "\(expression)" embeds a value in a string
print("n is \(n)") // => n is 5

// CAREFUL: numbers never convert implicitly; convert explicitly
// let bad = n * ratio  // error: binary operator '*' cannot be applied to 'Int' and 'Double'
print(Double(n) * ratio) // => 2.5

// Swap with a tuple
var a = 1, b = 2
(a, b) = (b, a)
print(a, b) // => 2 1

// Increment: Swift has no ++ or --
n += 1
// n++  // error: cannot find operator '++' in scope
print(n) // => 6
```

```swift
// Only an optional type (marked ?) can hold nil
var name: String? = nil
// var bad: String = nil  // error: 'nil' cannot initialize specified type 'String'

// ?. calls only when the value isn't nil; ?? supplies a default
print(name?.count ?? -1) // => -1

// if let unwraps an optional when it has a value
name = "swift"
if let name {
    print(name.count) // => 5
}

// ! force-unwraps, and crashes if the value is nil
print(name!.uppercased()) // => SWIFT

// CAREFUL: printing an optional shows the wrapper
print(name as Any) // => Optional("swift")

// guard let unwraps or leaves early, usually at the top of a function
func firstChar(_ s: String?) -> Character {
    guard let s, let c = s.first else { return "?" }
    return c
}
print(firstChar(nil), firstChar("hi")) // => ? h
```

## If-statements

```swift
// No parentheses around the condition, and the braces are required
var n = 1
if n > 2 {
    n -= 1
} else if n == 2 {
    n *= 2
} else {
    n += 2
}
print(n) // => 3

// Logical operators: && (and), || (or), ! (not)
let m = 5
if n > 0 && m > 0 {
    print("both") // => both
}
print(!true, true || false) // => false true

// CAREFUL: a condition must be a Bool; 0 and nil aren't falsy
// if n { }  // error: type 'Int' cannot be used as a boolean; test for '!= 0' instead

// Ternary operator
let parity = n % 2 == 0 ? "even" : "odd"
print(parity) // => odd

// switch must cover every case; cases don't fall through, and can match ranges
switch n {
case ..<0:
    print("negative")
case 0..<10:
    print("small") // => small
default:
    print("large")
}

// if and switch can also be expressions
let size = if n < 10 { "small" } else { "large" }
print(size) // => small
```

## Loops

```swift
var n = 0
while n < 3 {
    print(n)
    n += 1
}
// => 0 1 2

// i = 0 to 4: ..< excludes the end
for i in 0..<5 {
    print(i)
}
// => 0 1 2 3 4

// i = 2 to 5: ... includes the end
for i in 2...5 {
    print(i)
}
// => 2 3 4 5

// i = 5 down to 2
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

// CAREFUL: a range whose end is below its start crashes, e.g. 0..<n-1 when n is 0
// for i in 0..<(-1) { }  // Fatal error: Range requires lowerBound <= upperBound

// _ ignores the loop variable
for _ in 0..<2 {
    print("hi")
}
// => hi hi

// A label lets break or continue act on an outer loop
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

## Math

```swift
import Foundation

// / on two Ints is integer division
print(5 / 2, 5.0 / 2) // => 2 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
print(-3 / 2) // => -1

// CAREFUL: % takes the sign of the dividend (Python gives 2)
print(-10 % 3) // => -1

// A modulo that is never negative, e.g. for wrapping an index around
print((-10 % 3 + 3) % 3) // => 2

// floor, ceil, sqrt and pow come from Foundation and work on Double
print(floor(-1.5), ceil(-1.5)) // => -2.0 -1.0
let p: Double = pow(2, 10)
print(sqrt(16.0), p, abs(-7)) // => 4.0 1024.0 7
print(max(3, 8), min(3, 8, 1)) // => 8 1

// Converting a Double to Int truncates toward 0
print(Int(sqrt(17.0))) // => 4

// Limits and infinity
print(Int.max, Int.min) // => 9223372036854775807 -9223372036854775808
print(Int32.max, Double.infinity) // => 2147483647 inf

// CAREFUL: integer overflow crashes the program instead of wrapping
var big = Int.max
// big += 1  // crashes at runtime with an overflow trap
// &+, &- and &* wrap around on purpose
big = big &+ 1
print(big) // => -9223372036854775808
```

## Output and Input

```swift
import Foundation

// print separates items with a space and ends with a newline
print("a", 1, true) // => a 1 true

// Change the separator or the line ending
print(1, 2, 3, separator: ",") // => 1,2,3
print("same", terminator: " ")
print("line") // => same line

// Arrays print with brackets, and strings inside them get quotes
let nums = [1, 2, 3]
print(nums, ["a"]) // => [1, 2, 3] ["a"]

// For plain output, convert to strings and join
print(nums.map(String.init).joined(separator: " ")) // => 1 2 3

// A fixed number of decimals
print(String(format: "%.2f", 3.14159)) // => 3.14
```

```swift
// readLine() returns one line without the newline, or nil at the end of input.
// Int(text) returns nil if text isn't a number, hence the !
let n = Int(readLine()!)!
let nums = readLine()!.split(separator: " ").map { Int($0)! }
print(n, nums.reduce(0, +)) // => 3 6
```

```text stdin
3
1 2 3
```

```swift
// When numbers may be spread over lines, read until readLine() returns nil
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

## Arrays

```swift
// Arrays grow as needed; [Int] is the type
var arr = [1, 2, 3]
print(arr, arr.count) // => [1, 2, 3] 3

// Use an array as a stack: append and removeLast are O(1)
arr.append(4)
print(arr.removeLast()) // => 4

// Peek at the top: last is an optional, nil when the array is empty
print(arr.last ?? -1) // => 3

// insert and remove(at:) in the middle are O(n)
arr.insert(7, at: 1)
print(arr) // => [1, 7, 2, 3]
arr.remove(at: 0)
print(arr) // => [7, 2, 3]

// An array of size n filled with a default value
print(Array(repeating: 0, count: 5)) // => [0, 0, 0, 0, 0]

// CAREFUL: there are no negative indexes, and an index out of range crashes
// arr[-1]  // Fatal error: Index out of range
print(arr[arr.count - 1]) // => 3

// prefix, suffix and dropFirst take parts of an array
let nums = [1, 2, 3, 4]
print(nums.prefix(2), nums.suffix(2), nums.dropFirst()) // => [1, 2] [3, 4] [2, 3, 4]

// CAREFUL: a slice keeps the original's indexes, so slice[0] would crash here;
// wrap it in Array(...) to get indexes from 0
let part = nums[1..<3]
print(part, part.startIndex, Array(part)[0]) // => [2, 3] 1 2

// contains and firstIndex are O(n); use a Set for fast lookups
print(nums.contains(3), nums.firstIndex(of: 3)!) // => true 2

// map, filter and reduce return new values
print(nums.map { $0 * 2 }, nums.filter { $0 % 2 == 0 }, nums.reduce(0, +)) // => [2, 4, 6, 8] [2, 4] 10

// CAREFUL: arrays are values: assigning one makes an independent copy
var copy = nums
copy[0] = 99
print(nums[0], copy[0]) // => 1 99
```

```swift
let nums = [10, 20, 30]

// By index
for i in nums.indices {
    print(nums[i])
}
// => 10 20 30

// By value
for n in nums {
    print(n)
}
// => 10 20 30

// Index and value together
for (i, n) in nums.enumerated() {
    print(i, n)
}
// => 0 10 1 20 2 30

// Two arrays in lockstep; zip stops at the shorter one
for (n, ch) in zip(nums, ["a", "b", "c"]) {
    print(n, ch)
}
// => 10 a 20 b 30 c
```

```swift
var nums = [5, 4, 7, 3, 8]

// reverse and sort work in place
nums.reverse()
print(nums) // => [8, 3, 7, 4, 5]
nums.sort()
print(nums) // => [3, 4, 5, 7, 8]
nums.sort(by: >)
print(nums) // => [8, 7, 5, 4, 3]

// sorted() returns a new array and leaves the original alone
let words = ["bob", "alice", "jane", "doe"]
print(words.sorted(), words[0]) // => ["alice", "bob", "doe", "jane"] bob

// CAREFUL: reversed() returns a lazy view; wrap it in Array(...)
print(words.reversed()) // => ReversedCollection<Array<String>>(_base: ["bob", "alice", "jane", "doe"])
print(Array(words.reversed())) // => ["doe", "jane", "alice", "bob"]

// Custom order: a closure that returns true when $0 goes before $1 (by length, then alphabetically)
print(words.sorted { ($0.count, $0) < ($1.count, $1) }) // => ["bob", "doe", "jane", "alice"]

// Sort pairs by their second element
var pairs = [[1, 3], [2, 1], [3, 2]]
pairs.sort { $0[1] < $1[1] }
print(pairs) // => [[2, 1], [3, 2], [1, 3]]
```

```swift
// 2-D array with 3 rows and 4 columns
var grid = Array(repeating: Array(repeating: 0, count: 4), count: 3)
grid[0][0] = 1
print(grid) // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
print(grid.count, grid[0].count) // => 3 4

// Because arrays are values, each row is independent: there's no shared-row trap,
// and a saved backtracking path doesn't change later either
var path = [1, 2]
var res: [[Int]] = []
res.append(path)
path[0] = 9
print(res) // => [[1, 2]]
```

## Strings

```swift
let s = "abc"

// CAREFUL: a String can't be indexed with an Int
// s[0]  // error: 'subscript(_:)' is unavailable: cannot subscript String with an Int

// The usual LeetCode approach: convert to [Character] once, then index freely
let chars = Array(s)
print(chars[0], chars[chars.count - 1]) // => a c

// first and last are optional Characters
print(s.first!, s.last!) // => a c

// Substrings use String.Index values
let i = s.index(s.startIndex, offsetBy: 1)
print(s[i...], s.prefix(2), s.dropFirst()) // => bc ab bc

// A var String can change; += and append are efficient
var t = "ab"
t += "c"
t.append("d")
print(t) // => abcd

// String <-> number; Int(text) returns nil for bad input
print(Int("123")! + 1, String(123) + "4") // => 124 1234
print(Int("12a") == nil) // => true

// Character <-> code: asciiValue is a UInt8? (nil for non-ASCII)
let c: Character = "c"
print(c.asciiValue!, Character(UnicodeScalar(UInt8(98)))) // => 99 b

// A letter's index into a 26-element array
print(Int(c.asciiValue! - Character("a").asciiValue!)) // => 2

// split drops empty pieces by default, unlike most languages
let words = "the quick  brown fox".split(separator: " ")
print(words.count) // => 4
print(words.joined(separator: "-")) // => the-quick-brown-fox

// Comparison with == and < is lexicographic
print("apple" < "banana", "a" == "a") // => true true

print(String(s.reversed()), s.contains("bc"), s.count) // => cba true 3
print(c.isLetter, Character("7").isNumber, s.uppercased()) // => true true ABC
```

## Queues

```swift
// Swift has no queue or deque in the standard library. CAREFUL: removeFirst() is O(n).
// For BFS, read from a moving head index instead
var queue = [1, 2, 3]
var head = 0
while head < queue.count {
    let node = queue[head]
    head += 1
    print(node)
}
// => 1 2 3

// Or go level by level, building the next level as a new array.
// (Here node n has children 2n and 2n+1, like a heap-shaped tree.)
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
// When you need a real deque, a ring buffer is O(1) at both ends.
// (LeetCode also provides Deque from the swift-collections package.)
struct Deque<T> {
    private var slots: [T?] = Array(repeating: nil, count: 8)
    private var head = 0
    private(set) var count = 0

    // Position of the i-th element in the ring
    private func slot(_ i: Int) -> Int { (head + i) % slots.count }

    // Double the capacity when full, copying elements in order
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

## HashSets

```swift
var seen = Set<Int>()
seen.insert(1)
seen.insert(2)

// insert returns a tuple; inserted is false if the item was already there
print(seen.insert(2).inserted) // => false
print(seen.count) // => 2

print(seen.contains(1), seen.contains(3)) // => true false

// remove returns the removed item, or nil if it was missing
print(seen.remove(2) as Any, seen.remove(42) as Any) // => Optional(2) nil

// Build from an array
let set = Set([3, 1, 3, 2])

// CAREFUL: a Set's order is random and changes between runs; sort when order matters
print(set.sorted()) // => [1, 2, 3]

// union, intersection and subtracting return new sets
let a: Set = [1, 2, 3]
let b: Set = [2, 3, 4]
print(a.union(b).sorted(), a.intersection(b).sorted(), a.subtracting(b).sorted()) // => [1, 2, 3, 4] [2, 3] [1]
```

## HashMaps

```swift
// [Key: Value] is the dictionary type; [:] is an empty dictionary
var scores: [String: Int] = [:]
scores["alice"] = 88
scores["bob"] = 77
print(scores.count) // => 2

scores["alice"] = 80

// CAREFUL: reading a key gives an optional, nil if the key is missing
print(scores["alice"]!, scores["zoe"] ?? 0) // => 80 0

// A default value can also go in the subscript
print(scores["zoe", default: 0]) // => 0

// Contains key
print(scores["alice"] != nil) // => true

// Assigning nil removes a key
scores["alice"] = nil
print(scores.count, scores["alice"] == nil) // => 1 true
```

```swift
let scores = ["alice": 90, "bob": 70]

// CAREFUL: dictionary order is random and changes between runs; sort the keys
for key in scores.keys.sorted() {
    print(key, scores[key]!)
}
// => alice 90 bob 70

print(scores.values.sorted()) // => [70, 90]

// Pairs sorted by key; each pair destructures into (key, value)
for (key, value) in scores.sorted(by: { $0.key < $1.key }) {
    print(key, value)
}
// => alice 90 bob 70

// Counting: += on the default subscript creates the key at 0 first
var count: [Character: Int] = [:]
for ch in "banana" {
    count[ch, default: 0] += 1
}
print(count["a"]!, count["n"]!) // => 3 2

// Grouping works the same way
var groups: [String: [String]] = [:]
for word in ["eat", "tea", "tan"] {
    groups[String(word.sorted()), default: []].append(word)
}
print(groups["aet"]!) // => ["eat", "tea"]
```

## Tuples

```swift
// A tuple groups a few values; the elements can have names
func minMax(_ nums: [Int]) -> (min: Int, max: Int) {
    (nums.min()!, nums.max()!)
}

// Destructure it, or keep it and use the names or positions
let (lo, hi) = minMax([3, 1, 4])
print(lo, hi) // => 1 4
let r = minMax([5, 9])
print(r.min, r.1) // => 5 9

// Tuples compare element by element
print((1, 2) < (1, 3), (1, 2) == (1, 2)) // => true true

// CAREFUL: tuples aren't Hashable, so they can't be Set items or Dictionary keys
// var visited: Set<(Int, Int)> = []  // error: type '(Int, Int)' does not conform to protocol 'Hashable'

// Use a small Hashable struct instead (Swift writes the hashing for you)
struct Cell: Hashable {
    let r: Int
    let c: Int
}
let visited: Set<Cell> = [Cell(r: 0, c: 1)]
print(visited.contains(Cell(r: 0, c: 1))) // => true

// Arrays are Hashable, so [Int] keys also work
let dist: [[Int]: Int] = [[0, 1]: 1]
print(dist[[0, 1]]!) // => 1
```

## Heaps

```swift
// Swift has no heap in the standard library. (LeetCode also provides Heap from the
// swift-collections package; elsewhere, write a small one like this.)
// areSorted(a, b) is true when a should come out before b: < gives a min-heap.
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
        // Sift up: swap with the parent while the new item should come out first
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
        // Sift down: swap with the child that should come out first
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

// Min-heap
var minHeap = Heap<Int>(<)
for x in [5, 1, 8, 3, 2] {
    minHeap.push(x)
}
print(minHeap.peek!, minHeap.count) // => 1 5
while let x = minHeap.pop() {
    print(x)
}
// => 1 2 3 5 8

// Max-heap
var maxHeap = Heap<Int>(>)
[3, 1, 5].forEach { maxHeap.push($0) }
print(maxHeap.pop()!) // => 5

// Custom priority: (priority, name) pairs ordered by priority
var tasks = Heap<(Int, String)> { $0.0 < $1.0 }
tasks.push((2, "write"))
tasks.push((1, "plan"))
tasks.push((3, "ship"))
while let (priority, name) = tasks.pop() {
    print(priority, name)
}
// => 1 plan 2 write 3 ship
```

## Functions

```swift
// Callers write each parameter's label; _ means "no label"
func multiply(_ n: Int, by m: Int) -> Int {
    return n * m
}
print(multiply(3, by: 4)) // => 12

// Default values; a one-expression body can leave out return
func greet(_ name: String, greeting: String = "Hello") -> String {
    "\(greeting), \(name)!"
}
print(greet("Ann")) // => Hello, Ann!
print(greet("Ann", greeting: "Hi")) // => Hi, Ann!

// A closure is { (parameters) in body }; $0, $1 are shorthand parameter names
let square = { (x: Int) in x * x }
let add: (Int, Int) -> Int = { $0 + $1 }
print(square(5), add(2, 3)) // => 25 5

// When the last argument is a closure, it can go after the parentheses
print([1, 2, 3].map { $0 * 10 }) // => [10, 20, 30]

// Nested functions can read and change the variables around them,
// which makes them handy as recursive DFS helpers
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
// Parameters are constants, and arrays are values, so a function gets its own copy
func setFirst(_ arr: [Int]) -> [Int] {
    var arr = arr
    arr[0] = 99
    return arr
}
var nums = [1, 2]
print(setFirst(nums), nums) // => [99, 2] [1, 2]

// inout lets a function change the caller's variable; the caller writes &
func double(_ arr: inout [Int]) {
    for i in arr.indices {
        arr[i] *= 2
    }
}
double(&nums)
print(nums) // => [2, 4]

// Class instances are references, so a function can change their properties
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

## Classes

```swift
// A class is a reference type; it needs an init that sets every property
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

    // Optional: CustomStringConvertible controls how it prints
    var description: String { "Point(\(x), \(y))" }

    // Optional: Comparable (< and ==) lets you sort Points
    static func < (a: Point, b: Point) -> Bool { a.distSq() < b.distSq() }
    static func == (a: Point, b: Point) -> Bool { a.x == b.x && a.y == b.y }
}

let p = Point(3, 4)
print(p.distSq()) // => 25
print(p) // => Point(3, 4)
print([Point(2, 2), Point(1, 0)].sorted()) // => [Point(1, 0), Point(2, 2)]

// A struct is a value type: it gets a memberwise init for free and is copied on assignment
struct Cell {
    var r: Int
    var c: Int
}
let c1 = Cell(r: 1, c: 2)
var c2 = c1
c2.r = 9
print(c1.r, c2.r) // => 1 9

// CAREFUL: assigning a class instance copies the reference, not the object
let q = p
q.x = 0
print(p.x) // => 0
```

```swift
// LeetCode's linked list node for Swift
public class ListNode {
    public var val: Int
    public var next: ListNode?
    public init() { self.val = 0; self.next = nil; }
    public init(_ val: Int) { self.val = val; self.next = nil; }
    public init(_ val: Int, _ next: ListNode?) { self.val = val; self.next = next; }
}

// 1 -> 2 -> 3
let head = ListNode(1, ListNode(2, ListNode(3)))

// Walk the list until the end (nil); while let unwraps each node
var node: ListNode? = head
while let current = node {
    print(current.val)
    node = current.next
}
// => 1 2 3
```

```swift
// LeetCode's binary tree node for Swift
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

// On LeetCode you complete a method of class Solution
class Solution {
    func maxDepth(_ root: TreeNode?) -> Int {
        guard let root else { return 0 }
        return 1 + max(maxDepth(root.left), maxDepth(root.right))
    }
}

// In-order traversal; a missing child is nil
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
