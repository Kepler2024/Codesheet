# Go Cheat Sheet

> Written for Go 1.23

Use this quick reference to learn or revisit Go syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```go
package main

import "fmt"

func main() {
	// The executable starts at func main in package main.
	fmt.Println("hello") // => hello
}
```

```bash
go run main.go
```

## Variables

```go
package main

import "fmt"

func main() {
	const limit = 3
	steps := 1
	var cost int64 = 4_000_000_000
	var ratio float64 = 0.5
	var ready bool
	var grade rune = 'A'
	var label string
	var parent *int
	steps++
	fmt.Println(steps, limit, cost, ratio, ready, string(grade)) // => 2 3 4000000000 0.5 false A
	fmt.Println(label == "", parent == nil)                      // => true true
	a, b := 1, 2
	a, b = b, a
	fmt.Println(a, b) // => 2 1
	// CAREFUL: unused local variables and imports are compile errors.
	// Use _ to discard an unwanted return value.
}
```

## If-statements

```go
package main

import "fmt"

func main() {
	x := 7
	var group string
	if x <= 0 {
		group = "low"
	} else if x < 10 && x != 5 {
		group = "middle"
	} else {
		group = "high"
	}
	// Go has no ternary expression. Assign a default, then override it.
	parity := "even"
	if x%2 != 0 {
		parity = "odd"
	}
	fmt.Println(group, parity, !(x < 1 || x > 9)) // => middle odd true
}
```

## Loops

```go
package main

import "fmt"

func main() {
	// A condition-only for is Go's while loop.
	n := 2
	for n > 0 {
		fmt.Println(n)
		n--
	}
	// => 2 1
	for i := range 6 {
		if i == 1 {
			continue
		}
		if i == 4 {
			break
		}
		fmt.Println(i)
	}
	// => 0 2 3
	for i := 2; i <= 4; i++ {
		fmt.Println(i)
	}
	// => 2 3 4
	for i := 4; i >= 2; i-- {
		fmt.Println(i)
	}
	// => 4 3 2
}
```

## Math

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	// CAREFUL: integer division truncates toward zero. The remainder follows the dividend.
	a := -3
	fmt.Println(a/2, float64(a)/2, -10%3)                        // => -1 -1.5 -1
	fmt.Println(math.Floor(-1.5), math.Ceil(-1.5), math.Sqrt(9)) // => -2 -1 3
	fmt.Println(math.Pow(2, 5), math.Abs(-5))                    // => 32 5
	fmt.Println(math.MinInt32, math.MaxInt32, math.Inf(1))       // => -2147483648 2147483647 +Inf
	// A typed integer variable can overflow. Use int64 for large products.
	var side int32 = 50000
	fmt.Println(side*side, int64(side)*int64(side)) // => -1794967296 2500000000
}
```

## Output and Input

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	in := bufio.NewReader(os.Stdin)
	title, _ := in.ReadString('\n')
	fmt.Println(strings.TrimSpace(title)) // => case one
	var n, x int
	fmt.Fscan(in, &n)
	sum := 0
	for range n {
		fmt.Fscan(in, &x)
		sum += x
	}
	fmt.Println(n, sum) // => 3 9
}
```

```text stdin
case one
3
2 3
4
```

## Arrays

```go
package main

import (
	"fmt"
	"slices"
)

func main() {
	// Slices grow with append. make fills the slice with the element type's zero value.
	nums := make([]int, 3)
	nums[1] = 4
	nums = append(nums, 7)
	last := len(nums) - 1
	fmt.Println(nums[last]) // => 7
	nums = nums[:last]
	fmt.Println(len(nums), nums[1], nums[1:3]) // => 3 4 [4 0]
	// Indices start at zero. Use len(nums)-1 for the last element of a nonempty slice.
	for i := range nums {
		fmt.Println(i)
	}
	// => 0 1 2
	for _, x := range nums {
		fmt.Println(x)
	}
	// => 0 4 0
	for i, x := range nums {
		fmt.Println(i, x)
	}
	// => 0 0 1 4 2 0
	weights := []int{2, 3}
	for i := range min(len(nums), len(weights)) {
		fmt.Println(nums[i] * weights[i])
	}
	// => 0 12

	// CAREFUL: append can overwrite values in a shared backing array if capacity allows.
	base := []int{1, 2, 3}
	part := append(base[:1], 9)
	fmt.Println(part, base) // => [1 9] [1 9 3]
	independent := slices.Clone(base)
	independent[0] = 7
	fmt.Println(base[0], independent[0]) // => 1 7
}
```

```go
package main

import (
	"cmp"
	"fmt"
	"slices"
)

func main() {
	nums := []int{4, 1, 3}
	slices.Reverse(nums)
	fmt.Println(nums) // => [3 1 4]
	slices.Sort(nums)
	fmt.Println(nums) // => [1 3 4]
	slices.SortFunc(nums, func(a, b int) int { return cmp.Compare(b, a) })
	fmt.Println(nums) // => [4 3 1]
	words := []string{"four", "a", "to"}
	slices.SortFunc(words, func(a, b string) int { return cmp.Compare(len(a), len(b)) })
	fmt.Println(words) // => [a to four]
	grid := make([][]int, 2)
	for i := range grid {
		grid[i] = make([]int, 3)
	}
	grid[0][0] = 7
	fmt.Println(grid[1][0]) // => 0
}
```

## Strings

```go
package main

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

func main() {
	// String indices and slice bounds are byte offsets. range decodes UTF-8 runes.
	s := "a猫"
	fmt.Println(string(s[0]), s[1:], len(s), len([]rune(s))) // => a 猫 4 2
	// Strings are immutable. Build repeated pieces with strings.Builder.
	var b strings.Builder
	for _, r := range "code" {
		b.WriteRune(unicode.ToUpper(r))
	}
	fmt.Println("go-" + b.String()) // => go-CODE
	n, err := strconv.Atoi("41")
	fmt.Println(n+1, err == nil, strconv.Itoa(41)+"2")                        // => 42 true 412
	fmt.Println(int('a'), string(rune(98)))                                   // => 97 b
	fmt.Println(strings.Join(strings.Fields("one  two"), "-"), "ant" < "bee") // => one-two true
}
```

## Queues

```go
// The standard library has no dedicated deque. container/list provides both ends.
package main

import (
	"container/list"
	"fmt"
)

func main() {
	q := list.New()
	q.PushBack(2)
	q.PushFront(1)
	fmt.Println(q.Front().Value, q.Back().Value, q.Len()) // => 1 2 2
	front := q.Remove(q.Front())
	back := q.Remove(q.Back())
	fmt.Println(front, back, q.Front() == nil) // => 1 2 true
}
```

## HashSets

```go
// Go has no built-in set. Use map[T]struct{} and test with the comma-ok form.
package main

import (
	"fmt"
	"slices"
)

func main() {
	seen := make(map[int]struct{})
	for _, x := range []int{2, 3, 2} {
		seen[x] = struct{}{}
	}
	seen[5] = struct{}{}
	delete(seen, 3)
	_, ok := seen[2]
	fmt.Println(ok, len(seen)) // => true 2
	var keys []int
	for k := range seen {
		keys = append(keys, k)
	}
	slices.Sort(keys)
	fmt.Println(keys) // => [2 5]
}
```

## HashMaps

```go
package main

import (
	"fmt"
	"maps"
	"slices"
)

func main() {
	count := map[rune]int{}
	count['x'] = 4
	count['x'] = 5
	x, ok := count['x']
	fmt.Println(x, ok) // => 5 true
	delete(count, 'x')
	// Missing keys read as the zero value, so increment handles the first occurrence.
	for _, ch := range "banana" {
		count[ch]++
	}
	fmt.Println(len(count), count['a']) // => 3 3
	// CAREFUL: map iteration order is unspecified. Sort keys when printing them.
	for _, k := range slices.Sorted(maps.Keys(count)) {
		fmt.Println(string(k))
	}
	// => a b n
	for _, v := range slices.Sorted(maps.Values(count)) {
		fmt.Println(v)
	}
	// => 1 2 3
	var frequent []rune
	for k, v := range count {
		if v > 1 {
			frequent = append(frequent, k)
		}
	}
	slices.Sort(frequent)
	fmt.Println(string(frequent)) // => an
}
```

## Tuples

```go
// Go has no tuples. Return multiple values and use comparable structs as keys.
package main

import (
	"fmt"
	"slices"
)

type cell struct{ row, col int }

func bounds(nums []int) (int, int) {
	return slices.Min(nums), slices.Max(nums)
}

func main() {
	lo, hi := bounds([]int{4, 1, 7})
	fmt.Println(lo, hi) // => 1 7
	distance := map[cell]int{{2, 3}: 5}
	fmt.Println(distance[cell{2, 3}]) // => 5
}
```

## Heaps

```go
package main

import (
	"container/heap"
	"fmt"
)

type job struct {
	name string
	cost int
}
type queue struct {
	jobs     []job
	maxFirst bool
}

func (q queue) Len() int { return len(q.jobs) }
func (q queue) Less(i, j int) bool {
	if q.maxFirst {
		return q.jobs[i].cost > q.jobs[j].cost
	}
	return q.jobs[i].cost < q.jobs[j].cost
}
func (q queue) Swap(i, j int) { q.jobs[i], q.jobs[j] = q.jobs[j], q.jobs[i] }
func (q *queue) Push(x any)   { q.jobs = append(q.jobs, x.(job)) }
func (q *queue) Pop() any {
	last := len(q.jobs) - 1
	x := q.jobs[last]
	q.jobs[last] = job{}
	q.jobs = q.jobs[:last]
	return x
}

func main() {
	// heap.Interface delegates storage to the slice. Its Pop method removes the last slot.
	// Call heap.Pop to move the highest-priority item there before removing it.
	minQ := &queue{jobs: []job{{"ship", 3}, {"test", 2}}}
	heap.Init(minQ)
	heap.Push(minQ, job{"plan", 1})
	first := minQ.jobs[0].name
	removed := heap.Pop(minQ).(job)
	fmt.Println(first, removed.name, minQ.Len()) // => plan plan 2
	maxQ := &queue{jobs: []job{{"test", 2}, {"ship", 3}}, maxFirst: true}
	heap.Init(maxQ)
	fmt.Println(heap.Pop(maxQ).(job).name) // => ship
}
```

## Pointers

```go
package main

import "fmt"

func main() {
	x := 1
	p := &x
	*p = 7
	fmt.Println(x, p != nil) // => 7 true
}
```

## Functions

```go
package main

import "fmt"

func edit(nums []int) int {
	nums[0] = 7
	nums = []int{9}
	return nums[0]
}

func main() {
	nums := []int{1, 2}
	// The slice header is copied. Element writes still reach the backing array.
	replacement := edit(nums)
	fmt.Println(replacement, nums) // => 9 [7 2]
	total := 0
	add := func(step int) int {
		total += step
		return total
	}
	first := add(3)
	second := add(4)
	fmt.Println(first, second, total) // => 3 7 7
}
```

## Classes

```go
// Go has no classes. Attach methods to a struct and construct it with a function or literal.
package main

import "fmt"

type point struct{ x, y int }

func newPoint(x, y int) point { return point{x, y} }
func (p point) distSq() int   { return p.x*p.x + p.y*p.y }

func main() {
	p := newPoint(3, 4)
	fmt.Println(p.distSq()) // => 25
}
```

```go
package main

import "fmt"

type ListNode struct {
	Val  int
	Next *ListNode
}
type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

func inorder(node *TreeNode) {
	if node == nil {
		return
	}
	inorder(node.Left)
	fmt.Println(node.Val)
	inorder(node.Right)
}

func main() {
	head := &ListNode{Val: 1, Next: &ListNode{Val: 2}}
	for node := head; node != nil; node = node.Next {
		fmt.Println(node.Val)
	}
	// => 1 2
	root := &TreeNode{Val: 2, Left: &TreeNode{Val: 1}, Right: &TreeNode{Val: 3}}
	inorder(root)                       // => 1 2 3
	fmt.Println(root.Left.Right == nil) // => true
}
```
