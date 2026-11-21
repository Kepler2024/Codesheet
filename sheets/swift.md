# Swift Cheat Sheet

> Written for Swift 6.1

Use this quick reference to learn or revisit Swift syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```swift
// Top-level statements run in order in main.swift.
print("hello") // => hello
```

```bash
swift main.swift
```

## Variables

```swift
var steps = 1
let limit: Int64 = 4_000_000_000
let ratio: Double = 0.5
let ready: Bool = true
let grade: Character = "A"
steps += 1
print(steps, limit, ratio, ready, grade) // => 2 4000000000 0.5 true A
var label: String? = nil
print(label?.count ?? -1) // => -1
label = "go"
if let label { print(label.count) } // => 2
var a = 1, b = 2
swap(&a, &b)
print(a, b) // => 2 1
```

## If-statements

```swift
let x = 7
let label: String
if x <= 0 {
    label = "low"
} else if x < 10 && x != 5 {
    label = "middle"
} else {
    label = "high"
}
print(label, x.isMultiple(of: 2) ? "even" : "odd") // => middle odd
print(!(x < 1 || x > 9)) // => true
```

## Loops

```swift
var n = 2
while n > 0 {
    print(n)
    n -= 1
}
// => 2 1
for i in 0..<6 {
    if i == 1 { continue }
    if i == 4 { break }
    print(i)
}
// => 0 2 3
for i in 2...4 { print(i) }
// => 2 3 4
for i in stride(from: 4, through: 2, by: -1) { print(i) }
// => 4 3 2
```

## Math

```swift
import Foundation

print(-3 / 2, -3.0 / 2.0, -10 % 3) // => -1 -1.5 -1
print(floor(-1.5), ceil(-1.5), sqrt(9.0), pow(2.0, 5.0) as Double, abs(-5)) // => -2.0 -1.0 3.0 32.0 5
print(Int32.min, Int32.max, Double.infinity) // => -2147483648 2147483647 inf
// CAREFUL: ordinary integer overflow traps. &+ explicitly wraps.
let top = Int32.max
let (wrapped, overflow) = top.addingReportingOverflow(1)
print(wrapped, overflow, top &+ 1) // => -2147483648 true -2147483648
```

## Output and Input

```swift
// readLine removes the newline. Integers may span several lines.
let title = readLine()!
print(title) // => case one
let count = Int(readLine()!)!
var nums: [Int] = []
while nums.count < count, let line = readLine() {
    nums += line.split(whereSeparator: { $0.isWhitespace }).map { Int($0)! }
}
print(count, nums.prefix(count).reduce(0, +)) // => 3 9
```

```text stdin
case one
3
2 3
4
```

## Arrays

```swift
var nums = Array(repeating: 0, count: 3)
nums[1] = 4
nums.append(7)
print(nums.removeLast(), nums.count, nums[1]) // => 7 3 4
// Use last for an optional tail. Negative integer indices are outside the array.
print(nums.indices.contains(-1), nums.last ?? -1) // => false 0
let slice = nums[1..<3]
// CAREFUL: ArraySlice keeps the original indices. Array(slice) starts at zero.
print(slice.startIndex, slice[1], Array(slice).startIndex) // => 1 4 0
for i in nums.indices { print(i) }
// => 0 1 2
for x in nums { print(x) }
// => 0 4 0
for (i, x) in nums.enumerated() { print(i, x) }
// => 0 0 1 4 2 0
for (x, w) in zip(nums, [2, 3]) { print(x * w) }
// => 0 12
```

```swift
var nums = [4, 1, 3]
nums.reverse()
print(nums) // => [3, 1, 4]
nums.sort()
print(nums) // => [1, 3, 4]
nums.sort(by: >)
print(nums) // => [4, 3, 1]
print(["four", "a", "to"].sorted { $0.count < $1.count }.joined(separator: " ")) // => a to four
// CAREFUL: arrays have value semantics. Changing a row of Ints changes that row alone.
var grid = Array(repeating: Array(repeating: 0, count: 3), count: 2)
grid[0][0] = 7
var copy = grid
copy[0][0] = 9
print(grid[0][0], grid[1][0], copy[0][0]) // => 7 0 9
```

## Strings

```swift
// CAREFUL: String indices are String.Index. Characters can span multiple Unicode scalars.
var s = "a🐈b"
let cat = s.index(after: s.startIndex)
print(s[cat], s[cat...], s.count, s.utf8.count) // => 🐈 🐈b 3 6
s.replaceSubrange(cat...cat, with: "x")
print(s + "!") // => axb!
// Join pieces once, or append into a single mutable string.
var pieces: [String] = []
for ch in "code" { pieces.append(ch.uppercased()) }
print(pieces.joined()) // => CODE
print(Int("41")! + 1, String(41) + "2") // => 42 412
print(Unicode.Scalar("a").value, Character(Unicode.Scalar(98)!)) // => 97 b
print("one  two".split(whereSeparator: { $0.isWhitespace }).joined(separator: "-")) // => one-two
print("ant" < "bee") // => true
```

## Queues

```swift
// The standard library has no deque. LeetCode includes Deque from Swift Collections.
// Keep the front at head. When full, copy elements in logical order into a larger ring.
struct RingDeque<Element> {
    private var slots: [Element?] = [nil]
    private var head = 0
    private(set) var count = 0

    private func index(_ offset: Int) -> Int { (head + offset) % slots.count }

    private mutating func reserveSlot() {
        guard count == slots.count else { return }
        var grown = [Element?](repeating: nil, count: slots.count * 2)
        for i in 0..<count { grown[i] = slots[index(i)] }
        slots = grown
        head = 0
    }
    var first: Element? { count == 0 ? nil : slots[head] }
    var last: Element? { count == 0 ? nil : slots[index(count - 1)] }

    mutating func prepend(_ x: Element) {
        reserveSlot()
        head = (head + slots.count - 1) % slots.count
        slots[head] = x
        count += 1
    }
    mutating func append(_ x: Element) {
        reserveSlot()
        slots[index(count)] = x
        count += 1
    }
    mutating func popFirst() -> Element? {
        guard count > 0 else { return nil }
        let x = slots[head]
        slots[head] = nil
        head = index(1)
        count -= 1
        return x
    }
    mutating func popLast() -> Element? {
        guard count > 0 else { return nil }
        count -= 1
        let i = index(count)
        let x = slots[i]
        slots[i] = nil
        return x
    }
}

var q = RingDeque<Int>()
q.append(2)
q.prepend(1)
q.append(3)
print(q.first!, q.last!, q.count) // => 1 3 3
print(q.popFirst()!, q.popLast()!, q.popFirst()!, q.popLast() == nil) // => 1 3 2 true
```

## HashSets

```swift
var seen = Set([2, 3, 2])
seen.insert(5)
seen.remove(3)
print(seen.contains(2), seen.count) // => true 2
for x in seen.sorted() { print(x) }
// => 2 5
```

## HashMaps

```swift
var count: [Character: Int] = [:]
count["x"] = 4
count["x"] = 5
print(count["x"] ?? 0, count.keys.contains("x")) // => 5 true
count.removeValue(forKey: "x")
for ch in "banana" { count[ch, default: 0] += 1 }
print(count.count, count["a"] ?? 0) // => 3 3
for k in count.keys.sorted() { print(k) }
// => a b n
for v in count.values.sorted() { print(v) }
// => 1 2 3
for (k, v) in count.sorted(by: { $0.key < $1.key }) { print(k, v) }
// => a 3 b 1 n 2
var copy = count
copy["a"] = 9
print(count["a"]!, copy["a"]!) // => 3 9
```

## Tuples

```swift
func bounds(_ nums: [Int]) -> (lo: Int, hi: Int) {
    (nums.min()!, nums.max()!)
}
let (lo, hi) = bounds([4, 1, 7])
print(lo, hi) // => 1 7

// A Swift 6.1 tuple cannot conform to Hashable. A struct synthesizes it for these fields.
struct Cell: Hashable { let row: Int; let col: Int }
let distance = [Cell(row: 2, col: 3): 5]
print(distance[Cell(row: 2, col: 3)]!) // => 5
```

## Heaps

```swift
// The standard library has no heap. LeetCode includes Heap from Swift Collections.
// before(a, b) chooses which item belongs closer to the root.
struct BinaryHeap<Element> {
    private var items: [Element]
    private let before: (Element, Element) -> Bool
    var count: Int { items.count }
    var first: Element? { items.first }

    init(_ values: [Element], by before: @escaping (Element, Element) -> Bool) {
        items = values
        self.before = before
        for i in (0..<(items.count / 2)).reversed() { siftDown(i) }
    }
    private mutating func siftDown(_ start: Int) {
        var i = start
        while 2 * i + 1 < items.count {
            var child = 2 * i + 1
            if child + 1 < items.count && before(items[child + 1], items[child]) {
                child += 1
            }
            if !before(items[child], items[i]) { break }
            items.swapAt(i, child)
            i = child
        }
    }
    mutating func push(_ x: Element) {
        items.append(x)
        var i = items.count - 1
        while i > 0 {
            let parent = (i - 1) / 2
            if !before(items[i], items[parent]) { break }
            items.swapAt(i, parent)
            i = parent
        }
    }
    mutating func pop() -> Element? {
        guard !items.isEmpty else { return nil }
        items.swapAt(0, items.count - 1)
        let root = items.removeLast()
        if !items.isEmpty { siftDown(0) }
        return root
    }
}

var smallest = BinaryHeap([5, 2, 3], by: <)
smallest.push(1)
print(smallest.first!, smallest.pop()!, smallest.count) // => 1 1 3
var largest = BinaryHeap([5, 2, 3], by: >)
print(largest.pop()!) // => 5
var jobs = BinaryHeap([("ship", 3), ("plan", 1)], by: { $0.1 < $1.1 })
print(jobs.pop()!.0) // => plan
```

## Functions

```swift
func edited(_ nums: [Int]) -> [Int] {
    var copy = nums
    copy[0] = 7
    return copy
}
func replace(_ nums: inout [Int]) { nums = [9] }
var nums = [1, 2]
print(edited(nums), nums) // => [7, 2] [1, 2]
replace(&nums)
print(nums) // => [9]

func makeCounter() -> (Int) -> Int {
    var total = 0
    func add(_ step: Int) -> Int {
        total += step
        return total
    }
    return add
}
let add = makeCounter()
let square: (Int) -> Int = { $0 * $0 }
print(add(3), add(4), square(5)) // => 3 7 25
```

## Classes

```swift
class Point {
    let x: Int, y: Int
    init(_ x: Int, _ y: Int) { self.x = x; self.y = y }
    func distSq() -> Int { x * x + y * y }
}
print(Point(3, 4).distSq()) // => 25
```

```swift
public class ListNode {
    public var val: Int
    public var next: ListNode?
    public init() { self.val = 0; self.next = nil; }
    public init(_ val: Int) { self.val = val; self.next = nil; }
    public init(_ val: Int, _ next: ListNode?) { self.val = val; self.next = next; }
}

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
let head = ListNode(1, ListNode(2))
var node: ListNode? = head
while let current = node {
    print(current.val)
    node = current.next
}
// => 1 2
func inorder(_ node: TreeNode?) {
    guard let node else { return }
    inorder(node.left)
    print(node.val)
    inorder(node.right)
}
let root = TreeNode(2, TreeNode(1), TreeNode(3))
inorder(root) // => 1 2 3
print(root.left?.right == nil) // => true
```
