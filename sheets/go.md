# Go Cheat Sheet

> Written for Go 1.23

Use this quick reference to learn or revisit Go syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```go
// Every program starts at func main in package main
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
// Most blocks below are just the body of main, to keep them short.
// To run one yourself, keep the imports at the top and put the rest inside func main() { ... }
import "fmt"

fmt.Println("Hello from main") // => Hello from main
```

## Variables

```go
import (
	"fmt"
	"strconv"
)

// := declares a variable and infers its type from the value
n := 0
fmt.Println(n) // => 0

// CAREFUL: the type is fixed once declared
// n = "abc"  // compile error: cannot use "abc" as int value

// var gives an explicit type; without a value, a variable starts at its zero value.
// Common types: int (64-bit on 64-bit machines), int64, float64, bool, string, byte, rune
var count int
var ratio float64 = 0.5
var name string
var done bool
fmt.Println(count, ratio, name == "", done) // => 0 0.5 true false

// CAREFUL: a rune (a Unicode character) is a number; convert it to print a letter
var letter rune = 'A'
fmt.Println(letter, string(letter)) // => 65 A

// Constants can't be reassigned
const maxSize = 100
// maxSize = 200  // compile error: cannot assign to maxSize

// Multiple assignment, and swapping without a temp variable
a, b := 1, 2
a, b = b, a
fmt.Println(a, b) // => 2 1

// Increment: ++ and -- are statements, not expressions
n++
n += 2
// m := n++  // syntax error
fmt.Println(n) // => 3

// nil is the zero value of pointers, slices, maps and interfaces
var p *int
var s []int
fmt.Println(p == nil, s == nil, len(s)) // => true true 0
// CAREFUL: int, string and bool can't be nil; they start at 0, "" and false

// CAREFUL: an unused local variable or import is a compile error.
// Assign to _ to discard a value you don't need.
v, _ := strconv.Atoi("42")
fmt.Println(v) // => 42
```

## If-statements

```go
import "fmt"

// No parentheses around the condition, and the braces are required
n := 1
if n > 2 {
	n--
} else if n == 2 {
	n *= 2
} else {
	n += 2
}
fmt.Println(n) // => 3

// Logical operators: && (and), || (or), ! (not)
m := 5
if n > 0 && m > 0 {
	fmt.Println("both") // => both
}
fmt.Println(!true, true || false) // => false true

// CAREFUL: a condition must be a bool; 0, "" and nil aren't falsy
// if n { }  // compile error: non-boolean condition in if statement

// if can start with a short statement; its variables exist only inside the if/else
if r := n % 2; r == 1 {
	fmt.Println("odd") // => odd
}

// Go has no ternary operator (cond ? a : b): assign a default, then override it
parity := "even"
if n%2 == 1 {
	parity = "odd"
}
fmt.Println(parity) // => odd

// A switch with no value is a tidy if-else chain; cases don't fall through
switch {
case n < 0:
	fmt.Println("negative")
case n < 10:
	fmt.Println("small") // => small
default:
	fmt.Println("large")
}
```

## Loops

```go
import "fmt"

// for is Go's only loop; with just a condition it is a while loop
n := 0
for n < 3 {
	fmt.Println(n)
	n++
}
// => 0 1 2

// i = 0 to 4: range over an integer (Go 1.22+)
for i := range 5 {
	fmt.Println(i)
}
// => 0 1 2 3 4

// i = 2 to 5: the classic three-part loop
for i := 2; i <= 5; i++ {
	fmt.Println(i)
}
// => 2 3 4 5

// i = 5 down to 2
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

// for { ... } with no condition loops forever, until a break or return

// A label lets break (or continue) act on an outer loop
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

## Math

```go
import (
	"fmt"
	"math"
)

// / on two integers is integer division
fmt.Println(5/2, 5.0/2) // => 2 2.5

// Go never converts between int and float64 implicitly
a, b := 5, 2
// fmt.Println(a / 2.5)  // compile error: 2.5 (untyped float constant) truncated to int
fmt.Println(float64(a) / float64(b)) // => 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
fmt.Println(-3 / 2) // => -1

// CAREFUL: % takes the sign of the dividend (Python gives 2)
fmt.Println(-10 % 3) // => -1

// A modulo that is never negative, e.g. for wrapping an index around
fmt.Println((-10%3 + 3) % 3) // => 2

// The math package works on float64; whole floats print without a decimal point
fmt.Println(math.Floor(-1.5), math.Ceil(-1.5)) // => -2 -1
fmt.Println(math.Sqrt(16), math.Pow(2, 10), math.Abs(-7)) // => 4 1024 7

// CAREFUL: there is no integer abs or pow; convert, or use a shift for powers of 2
fmt.Println(int(math.Pow(3, 4)), 1<<10) // => 81 1024

// The built-in max and min (Go 1.21+) take any number of arguments
fmt.Println(max(3, 8, 1), min(3, 8, 1)) // => 8 1

// Integer limits and infinity
fmt.Println(math.MaxInt, math.MinInt) // => 9223372036854775807 -9223372036854775808
fmt.Println(math.MaxInt32, math.Inf(1), math.Inf(-1)) // => 2147483647 +Inf -Inf

// CAREFUL: integer overflow wraps around silently
big := math.MaxInt
big++
fmt.Println(big) // => -9223372036854775808

// Widen before multiplying when the product may not fit
var side int32 = 50_000
fmt.Println(side*side, int64(side)*int64(side)) // => -1794967296 2500000000
```

## Output and Input

```go
import "fmt"

// Println separates arguments with spaces and ends with a newline
fmt.Println("a", 1, true) // => a 1 true

// Printf formats with verbs: %d int, %s string, %.2f float, %v any value
name, score := "alice", 90
fmt.Printf("%s scored %d\n", name, score) // => alice scored 90
fmt.Printf("%.2f %v\n", 3.14159, []int{1, 2}) // => 3.14 [1 2]

// Slices print with brackets. For space-separated output, loop with Print,
// which adds no newline
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

// bufio.Scanner reads stdin line by line, without the newline
sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	line := sc.Text()
	fmt.Println(strings.ToUpper(line))
}
// => HELLO WORLD SECOND LINE

// CAREFUL: a line longer than 64 KB stops the scanner; raise the limit first with
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

// CAREFUL: fmt.Scan on os.Stdin is unbuffered and slow; wrap stdin in a bufio.Reader
in := bufio.NewReader(os.Stdin)

// Fscan reads whitespace-separated values and doesn't care about line breaks
var n int
fmt.Fscan(in, &n)
nums := make([]int, n)
for i := range nums {
	fmt.Fscan(in, &nums[i])
}

// For large outputs, buffer stdout too, and flush before main returns
out := bufio.NewWriter(os.Stdout)
defer out.Flush()
fmt.Fprintln(out, n, nums) // => 3 [1 2 3]
```

```text stdin
3
1 2
3
```

## Arrays

```go
import (
	"fmt"
	"slices"
)

// Slices are Go's dynamic arrays ([3]int, with a size, is a fixed array)
arr := []int{1, 2, 3}
fmt.Println(arr, len(arr)) // => [1 2 3] 3

// CAREFUL: append returns the new slice; always assign it back
arr = append(arr, 4)
fmt.Println(arr) // => [1 2 3 4]

// Use a slice as a stack: append to push, re-slice to pop
top := arr[len(arr)-1]
arr = arr[:len(arr)-1]
fmt.Println(top, arr) // => 4 [1 2 3]

// make creates a slice of size n filled with the zero value; for another value, loop
ones := make([]int, 3)
for i := range ones {
	ones[i] = 1
}
fmt.Println(make([]int, 5), ones) // => [0 0 0 0 0] [1 1 1]

// CAREFUL: there are no negative indexes, and an index out of range panics
// arr[-1]  // compile error: index -1 must not be negative
// arr[10]  // panic: runtime error: index out of range [10] with length 3
fmt.Println(arr[len(arr)-1]) // => 3

// Slicing: arr[start:end], end is exclusive
arr = []int{1, 2, 3, 4}
fmt.Println(arr[1:3], arr[:2], arr[2:]) // => [2 3] [1 2] [3 4]

// Insert and delete in the middle are O(n)
arr = slices.Insert(arr, 1, 7)
fmt.Println(arr) // => [1 7 2 3 4]
arr = slices.Delete(arr, 0, 1)
fmt.Println(arr) // => [7 2 3 4]

// Linear search and max
fmt.Println(slices.Contains(arr, 3), slices.Index(arr, 3), slices.Max(arr)) // => true 2 7
```

```go
import "fmt"

nums := []int{10, 20, 30}

// By index
for i := range nums {
	fmt.Println(nums[i])
}
// => 10 20 30

// By value: _ discards the index
for _, n := range nums {
	fmt.Println(n)
}
// => 10 20 30

// Index and value together
for i, n := range nums {
	fmt.Println(i, n)
}
// => 0 10 1 20 2 30

// CAREFUL: the loop variable is a copy; write through the index to change the slice
for i := range nums {
	nums[i] *= 2
}
fmt.Println(nums) // => [20 40 60]

// Two slices in lockstep: loop to the shorter length
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

// slices.Reverse and slices.Sort work in place
slices.Reverse(nums)
fmt.Println(nums) // => [8 3 7 4 5]
slices.Sort(nums)
fmt.Println(nums) // => [3 4 5 7 8]

// Descending: a comparator returns negative, zero or positive; swap a and b to reverse
slices.SortFunc(nums, func(a, b int) int { return cmp.Compare(b, a) })
fmt.Println(nums) // => [8 7 5 4 3]

// Sort a copy to leave the original alone
words := []string{"bob", "alice", "jane", "doe"}
sorted := slices.Clone(words)
slices.Sort(sorted)
fmt.Println(sorted, words[0]) // => [alice bob doe jane] bob

// Custom order: by length, then alphabetically (cmp.Or takes the first non-zero result)
slices.SortFunc(words, func(a, b string) int {
	return cmp.Or(cmp.Compare(len(a), len(b)), cmp.Compare(a, b))
})
fmt.Println(words) // => [bob doe jane alice]

// Sort pairs by their second element
pairs := [][]int{{1, 3}, {2, 1}, {3, 2}}
slices.SortFunc(pairs, func(a, b []int) int { return cmp.Compare(a[1], b[1]) })
fmt.Println(pairs) // => [[2 1] [3 2] [1 3]]

// Older code uses sort.Slice, whose function is "less", given two indexes
sort.Slice(pairs, func(i, j int) bool { return pairs[i][0] < pairs[j][0] })
fmt.Println(pairs) // => [[1 3] [2 1] [3 2]]
```

```go
import (
	"fmt"
	"slices"
)

// 2-D slice with 3 rows and 4 columns: make each row separately
grid := make([][]int, 3)
for i := range grid {
	grid[i] = make([]int, 4)
}
grid[0][0] = 1
fmt.Println(grid) // => [[1 0 0 0] [0 0 0 0] [0 0 0 0]]
fmt.Println(len(grid), len(grid[0])) // => 3 4

// CAREFUL: a slice of a slice shares its elements with the original
arr := []int{1, 2, 3, 4}
part := arr[1:3]
part[0] = 99
fmt.Println(arr) // => [1 99 3 4]

// CAREFUL: append can even overwrite the original's later elements
base := []int{1, 2, 3}
head := append(base[:1], 9)
fmt.Println(head, base) // => [1 9] [1 9 3]

// slices.Clone makes an independent copy
cp := slices.Clone(base)
cp[0] = 7
fmt.Println(base[0], cp[0]) // => 1 7

// CAREFUL: in backtracking, save a copy of the path, not the path itself
path := []int{1, 2}
saved := [][]int{path, slices.Clone(path)}
path[0] = 9
fmt.Println(saved) // => [[9 2] [1 2]]
```

## Strings

```go
import (
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

s := "abc"

// Indexing gives a byte (a number); slicing gives a string
fmt.Println(s[0], string(s[0]), s[1:]) // => 97 a bc

// CAREFUL: strings are immutable
// s[0] = 'A'  // compile error: cannot assign to s[0]

// To change characters, convert to []byte (or []rune for Unicode) and back
b := []byte(s)
b[0] = 'A'
fmt.Println(string(b)) // => Abc

// CAREFUL: len and indexes count bytes, but range walks runes (characters)
u := "héllo"
fmt.Println(len(u), len([]rune(u))) // => 6 5
for i, r := range "hé!" {
	fmt.Println(i, string(r))
}
// => 0 h 1 é 3 !

// + makes a new string each time; build a long one with strings.Builder
var sb strings.Builder
for _, ch := range "abc" {
	sb.WriteRune(unicode.ToUpper(ch))
}
fmt.Println(sb.String()) // => ABC

// String <-> number; Atoi also returns an error
n, err := strconv.Atoi("123")
fmt.Println(n+1, err) // => 124 <nil>
fmt.Println(strconv.Itoa(123) + "4") // => 1234

// CAREFUL: string(65) is "A", not "65"
fmt.Println(string(rune(65))) // => A

// Char <-> code: a byte or rune already is its code
fmt.Println('a', string(rune('a'+1))) // => 97 b

// Index of a lowercase letter, e.g. into a [26]int count array
fmt.Println('c' - 'a') // => 2

// Fields splits on any whitespace; Split splits on a separator
words := strings.Fields("the quick  brown fox")
fmt.Println(words, len(words)) // => [the quick brown fox] 4
fmt.Println(strings.Split("a,b,c", ",")) // => [a b c]
fmt.Println(strings.Join(words, "-")) // => the-quick-brown-fox

// Comparison is lexicographic, with ordinary operators
fmt.Println("apple" < "banana", "go" == "go") // => true true

fmt.Println(strings.Contains("hello", "ell"), strings.Index("hello", "l")) // => true 2
fmt.Println(strings.ToUpper("go"), strings.Repeat("ab", 3)) // => GO ababab
fmt.Println(unicode.IsDigit('7'), unicode.IsLetter('x')) // => true true
```

## Queues

```go
import "fmt"

// Go has no deque type. For BFS, a slice works as a queue:
// append to the back, re-slice to drop the front (O(1))
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

// container/list is a doubly linked list, so it works as a deque: O(1) at both ends
dq := list.New()
dq.PushBack(1)
dq.PushBack(2)
dq.PushFront(0)

// Peek at the front and the back, and the size
fmt.Println(dq.Front().Value, dq.Back().Value, dq.Len()) // => 0 2 3

// Remove returns the value as `any`; assert it back to int
front := dq.Remove(dq.Front()).(int)
back := dq.Remove(dq.Back()).(int)
fmt.Println(front, back, dq.Len()) // => 0 2 1

// CAREFUL: Front() and Back() return nil on an empty list
dq.Remove(dq.Front())
fmt.Println(dq.Front() == nil) // => true
```

## HashSets

```go
import (
	"fmt"
	"maps"
	"slices"
)

// Go has no set type. A map with struct{} values (which take no memory) is the idiom
seen := map[int]struct{}{}
seen[1] = struct{}{}
seen[2] = struct{}{}
seen[2] = struct{}{} // adding again does nothing
fmt.Println(len(seen)) // => 2

// The comma-ok form reports whether a key is present
_, has1 := seen[1]
_, has3 := seen[3]
fmt.Println(has1, has3) // => true false

// delete does nothing if the key is missing
delete(seen, 2)
delete(seen, 42)
fmt.Println(len(seen)) // => 1

// map[T]bool reads more simply, because a missing key gives false
visited := map[string]bool{}
visited["a"] = true
fmt.Println(visited["a"], visited["b"]) // => true false

// CAREFUL: storing false still adds a key, so len counts it
visited["b"] = false
fmt.Println(len(visited)) // => 2

// Build a set from a slice
set := map[int]bool{}
for _, n := range []int{3, 1, 3, 2} {
	set[n] = true
}

// CAREFUL: map iteration order is random; sort the keys when order matters
fmt.Println(slices.Sorted(maps.Keys(set))) // => [1 2 3]
```

## HashMaps

```go
import "fmt"

// map[KeyType]ValueType, created empty with a literal (or make)
scores := map[string]int{}
scores["alice"] = 88
scores["bob"] = 77

// fmt prints a map with its keys sorted
fmt.Println(scores, len(scores)) // => map[alice:88 bob:77] 2

scores["alice"] = 80
fmt.Println(scores["alice"]) // => 80

// CAREFUL: a missing key returns the zero value, not an error
fmt.Println(scores["zoe"]) // => 0

// The comma-ok form tells "missing" apart from "stored 0"
v, ok := scores["zoe"]
fmt.Println(v, ok) // => 0 false

// Contains key, then remove
if _, ok := scores["bob"]; ok {
	delete(scores, "bob")
}
fmt.Println(len(scores)) // => 1

// CAREFUL: a nil map reads like an empty one, but writing to it panics
var m map[string]int
fmt.Println(m["x"], len(m)) // => 0 0
// m["x"] = 1  // panic: assignment to entry in nil map
```

```go
import (
	"fmt"
	"maps"
	"slices"
)

scores := map[string]int{"alice": 90, "bob": 70, "carol": 80}

// CAREFUL: range over a map visits keys in random order; sort the keys for a fixed order
for _, k := range slices.Sorted(maps.Keys(scores)) {
	fmt.Println(k, scores[k])
}
// => alice 90 bob 70 carol 80

// Values only
fmt.Println(slices.Sorted(maps.Values(scores))) // => [70 80 90]

// Keys and values together, when order doesn't matter (finding a max, say)
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

// Counting: a missing key reads as 0, so ++ works on the first occurrence too
count := map[rune]int{}
for _, ch := range "banana" {
	count[ch]++
}
fmt.Println(count['a'], count['n'], count['z']) // => 3 2 0

// Grouping: appending to a missing key's nil slice works too
groups := map[string][]string{}
for _, word := range []string{"eat", "tea", "tan"} {
	letters := []byte(word)
	slices.Sort(letters)
	key := string(letters)
	groups[key] = append(groups[key], word)
}
fmt.Println(groups) // => map[aet:[eat tea] ant:[tan]]
```

## Tuples

```go
// Go has no tuples. Functions can return several values directly...
package main

import "fmt"

func minMax(nums []int) (int, int) {
	lo, hi := nums[0], nums[0]
	for _, n := range nums {
		lo, hi = min(lo, n), max(hi, n)
	}
	return lo, hi
}

// ...and a small struct works as a composite map key
type point struct{ r, c int }

func main() {
	lo, hi := minMax([]int{3, 1, 4})
	fmt.Println(lo, hi) // => 1 4

	dist := map[point]int{{0, 0}: 0, {0, 1}: 1}
	fmt.Println(dist[point{0, 1}]) // => 1

	// A fixed-size array works as a key too, with no type to declare
	visited := map[[2]int]bool{{0, 1}: true}
	fmt.Println(visited[[2]int{0, 1}], visited[[2]int{1, 0}]) // => true false

	// CAREFUL: slices aren't comparable, so they can't be keys
	// bad := map[[]int]bool{}  // compile error: invalid map key type []int
}
```

## Heaps

```go
// Go has no ready-made heap. container/heap works on any type with five methods
// (Len, Less, Swap, Push, Pop). One generic type with a less function covers
// min-heaps, max-heaps and custom priorities.
package main

import (
	"container/heap"
	"fmt"
)

type Heap[T any] struct {
	items []T
	less  func(a, b T) bool
}

// Len, Less and Swap let the heap package reorder the items
func (h *Heap[T]) Len() int           { return len(h.items) }
func (h *Heap[T]) Less(i, j int) bool { return h.less(h.items[i], h.items[j]) }
func (h *Heap[T]) Swap(i, j int)      { h.items[i], h.items[j] = h.items[j], h.items[i] }

// Push and Pop only add or remove at the end; heap.Push and heap.Pop do the rest
func (h *Heap[T]) Push(x any) { h.items = append(h.items, x.(T)) }
func (h *Heap[T]) Pop() any {
	x := h.items[len(h.items)-1]
	h.items = h.items[:len(h.items)-1]
	return x
}

func main() {
	// Min-heap: less is <. heap.Init turns the existing items into a heap in O(n)
	minH := &Heap[int]{items: []int{5, 1, 8, 3}, less: func(a, b int) bool { return a < b }}
	heap.Init(minH)
	heap.Push(minH, 2)

	// The minimum is always at index 0
	fmt.Println(minH.items[0], minH.Len()) // => 1 5

	// CAREFUL: call heap.Pop(h), not h.Pop(), which only removes the last item
	for minH.Len() > 0 {
		fmt.Println(heap.Pop(minH))
	}
	// => 1 2 3 5 8

	// Max-heap: reverse the comparison
	maxH := &Heap[int]{less: func(a, b int) bool { return a > b }}
	for _, n := range []int{3, 1, 5} {
		heap.Push(maxH, n)
	}
	fmt.Println(heap.Pop(maxH)) // => 5

	// Custom priority: tasks ordered by their priority field
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

## Pointers

```go
package main

import "fmt"

type point struct{ x, y int }

// Returning a pointer to a local variable is safe; Go keeps it alive
func newPoint(x, y int) *point {
	p := point{x, y}
	return &p
}

func main() {
	// & takes an address, * follows it
	x := 1
	p := &x
	*p = 7
	fmt.Println(x, *p) // => 7 7

	// Fields are reached through a struct pointer without writing *
	pt := newPoint(1, 2)
	pt.x = 10
	fmt.Println(*pt) // => {10 2}

	// CAREFUL: the zero value of a pointer is nil, and following nil panics
	var q *int
	fmt.Println(q == nil) // => true
	// *q = 1  // panic: runtime error: invalid memory address or nil pointer dereference
}
```

## Functions

```go
package main

import (
	"errors"
	"fmt"
)

// Types come after names; adjacent parameters of one type can share it
func multiply(n, m int) int {
	return n * m
}

// Several return values; by convention an error comes last
func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("divide by zero")
	}
	return a / b, nil
}

// Variadic: nums is a []int inside the function
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
	// Spread a slice into variadic arguments with ...
	nums := []int{4, 5}
	fmt.Println(sum(nums...)) // => 9

	// Go has no default parameter values, keyword arguments or overloading
}
```

```go
import "fmt"

// A function literal is Go's lambda; it can be stored in a variable
square := func(x int) int { return x * x }
fmt.Println(square(5)) // => 25

// Closures can read and change the enclosing function's variables
total := 0
add := func(n int) { total += n }
add(3)
add(4)
fmt.Println(total) // => 7

// CAREFUL: a recursive closure (a DFS helper, say) must be declared first:
// with fib := func... the name doesn't exist yet inside the body
var fib func(n int) int
fib = func(n int) int {
	if n < 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}
fmt.Println(fib(10)) // => 55

// Unlike Python, deep recursion is fine: Go's stack grows as needed
```

```go
// Arguments are always copied. What the caller sees depends on what was copied.
package main

import "fmt"

// A copied slice still points at the same elements, so writes reach the caller...
func setFirst(arr []int) { arr[0] = 99 }

// ...but append may move to a new array the caller never sees
func appendOne(arr []int) { arr = append(arr, 1) }

// A map behaves like a reference: changes are visible to the caller
func addKey(m map[string]int) { m["k"] = 1 }

// A struct is copied whole; pass a pointer to change the caller's struct
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

	// To grow a slice inside a function, return it (like append does)
}
```

## Classes

```go
// Go has no classes. A struct holds the fields, methods are declared outside it
// with a receiver, and a constructor is an ordinary function, by convention newX.
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

// A value receiver gets a copy: fine for methods that only read
func (p point) distSq() int {
	return p.x*p.x + p.y*p.y
}

// A pointer receiver can change the struct
func (p *point) move(dx, dy int) {
	p.x += dx
	p.y += dy
}

// Optional: String() controls how fmt prints it
func (p point) String() string {
	return fmt.Sprintf("(%d, %d)", p.x, p.y)
}

func main() {
	p := newPoint(3, 4)
	fmt.Println(p.distSq()) // => 25
	p.move(1, 1)
	fmt.Println(p) // => (4, 5)

	// A struct literal works without a constructor; fields left out are zero
	q := point{x: 1}
	fmt.Println(q, q.y) // => (1, 0) 0

	// There's no operator overloading; sort structs with a comparator
	pts := []point{{2, 2}, {1, 0}}
	slices.SortFunc(pts, func(a, b point) int { return cmp.Compare(a.distSq(), b.distSq()) })
	fmt.Println(pts) // => [(1, 0) (2, 2)]

	// Names starting with a capital letter (like ListNode.Val) are exported from the package
}
```

```go
package main

import "fmt"

// LeetCode's linked list node for Go
type ListNode struct {
	Val  int
	Next *ListNode
}

func main() {
	// 1 -> 2 -> 3
	head := &ListNode{1, &ListNode{2, &ListNode{3, nil}}}

	// Walk the list until the end (nil)
	for node := head; node != nil; node = node.Next {
		fmt.Println(node.Val)
	}
	// => 1 2 3
}
```

```go
package main

import "fmt"

// LeetCode's binary tree node for Go
type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

// In-order traversal; a missing child is nil
func inorder(node *TreeNode) {
	if node == nil {
		return
	}
	inorder(node.Left)
	fmt.Println(node.Val)
	inorder(node.Right)
}

// On LeetCode you complete a plain function; Go has no Solution class
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
