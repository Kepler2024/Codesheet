# Contributing

Thanks for helping. This guide is the whole rulebook: a new sheet written by following it should look like it was written by the same person as [`sheets/python.md`](sheets/python.md), the reference sheet.

## What a sheet is

- **Reader:** someone who already knows at least one programming language and wants to pick up another. Don't explain what a loop is; show how this language writes one and where it differs from most others.
- **Goal:** after reading a sheet, the reader can solve LeetCode-style problems in that language.
- **Form:** code first. Comments say *why* or *careful*, in a line or two. No prose paragraphs except the one or two sentences under the title.
- **Idiomatic:** write the code the way an experienced programmer in that language would. Use `sheets/python.md` as the model for coverage and tone, **not** as code to translate line by line.

One file per language, `sheets/<id>.md`, where `<id>` is also the code-fence tag:

| id | language | written for |
|---|---|---|
| `python` | Python | Python 3.14 |
| `java` | Java | Java 21 |
| `cpp` | C++ | C++23 (GCC 14) |
| `javascript` | JavaScript | Node.js 22 |
| `typescript` | TypeScript | TypeScript 5.7 on Node.js 22 |
| `csharp` | C# | C# 12 (.NET 8) |
| `go` | Go | Go 1.23 |
| `kotlin` | Kotlin | Kotlin 2.1 |
| `swift` | Swift | Swift 6.1 |
| `rust` | Rust | Rust 1.93 |

Only use what that version's standard library provides. You may *mention* a third-party package in a comment, but runnable code can't import it.

## File header

Start from [`TEMPLATE.md`](TEMPLATE.md). Every sheet begins like this:

```markdown
# Go Cheat Sheet

> Written for Go 1.23

The Go you need to solve LeetCode-style problems, for programmers who already know another language. Every snippet runs as is, and `// =>` shows what it prints.
```

The title must be `<Language> Cheat Sheet` and the next line must start with `> Written for `.

## The skeleton

Every sheet has these 15 `##` sections, with exactly these headings, in this order. Each one lists what it must cover.

1. **`Running a Program`**: the smallest complete program; the entry point (or the fact that there is none); the command that runs it.
2. **`Variables`**: declaration; mutable vs. immutable; type inference and the common explicit types; absence of a value (null / nil / None / Option / optionals); multiple assignment or swap, if the language has it; increment.
3. **`If-statements`**: if / else if / else; comparison and logical operators; the ternary or conditional expression.
4. **`Loops`**: while; counting loops (0 to n-1, a to b, counting down); break / continue.
5. **`Math`**: integer vs. float division; which way negative division rounds; modulo of negative numbers; floor / ceil / sqrt / pow / abs; max and min integer values and infinity; what happens on overflow.
6. **`Output and Input`**: print a value; print several values on one line; read a line from stdin; read integers (a count, then that many numbers), as ACM-style judges require.
7. **`Arrays`**: the dynamic array type; using it as a stack; creating one of size n with a default value; length; indexing (do negative indexes work?); sub-arrays / slices; iterating by index, by value, and both; iterating two arrays together; reverse; sort, sort descending, custom sort key or comparator; 2-D arrays (and the shared-row trap, if the language has one).
8. **`Strings`**: get a character; substring; mutable or not; concatenation and the efficient way to build a string; string ↔ integer; character ↔ code; split and join; comparison.
9. **`Queues`**: a double-ended queue: push and pop at both ends, peek at both ends, size.
10. **`HashSets`**: create, add, remove, contains, size, build from an array, iterate.
11. **`HashMaps`**: create, put, get, overwrite, contains key, remove, size; iterate keys, values and pairs; the counting idiom (get with a default, increment).
12. **`Tuples`**: the two LeetCode uses: returning several values, and a composite key for a map or set.
13. **`Heaps`**: min-heap; max-heap; custom priority (e.g., by the second element); build from an array; peek, pop, size.
14. **`Functions`**: define, call, return; nested functions / closures and changing an outer variable; lambdas; how arguments are passed (what the caller sees after the function mutates an array or reassigns a parameter).
15. **`Classes`**: a type with fields, a constructor and methods, and how to use it. Then LeetCode's `ListNode` and `TreeNode` exactly as LeetCode defines them for this language: build a small list and a small tree, traverse them, check for an empty child.

You can split a long section with `###` subheadings.

### When the language doesn't have something

Keep the section and its heading anyway. The first line of the block says so in a comment, then show the idiomatic substitute. The contrast is useful to the reader. For example, the start of Go's `Tuples` section might be:

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

	visited := map[point]bool{{0, 1}: true}
	fmt.Println(visited[point{0, 1}]) // => true
}
```

If the standard library has no substitute at all (JavaScript and Swift have no heap), show a short hand-written version that is just enough for LeetCode, and say in a comment what the LeetCode environment provides instead (check this yourself first).

### Language-specific sections

A `##` heading that isn't one of the 15 is a language-specific section. Put it right before the first shared section that needs it, and follow the same style rules. These are starting suggestions; use your judgment:

| language | suggestion |
|---|---|
| Rust | `Ownership and Borrowing` before `Arrays`; `Option` inside `Variables` |
| Java | `Primitive and Boxed Types` before `Arrays` |
| C++ | `References and Pointers` before `Functions` |
| Go | `Pointers` before `Functions`; slices sharing a backing array inside `Arrays` |
| TypeScript | `Types` after `Variables`, just enough to read LeetCode signatures |
| Kotlin, Swift | nullability inside `Variables`, no separate section |
| Python, JavaScript, C# | none needed |

### Length

`sheets/python.md` is about 750 lines. Stay within about 1.5× that (≈1100 lines). If you need more, cut detail rather than coverage.

## Code blocks

### Tags

- A block tagged with the sheet's id (` ```go ` in `go.md`) is a **run block**: the checker compiles and runs it.
- ` ```bash `, ` ```sh ` and ` ```text ` blocks are only displayed (for example the command in `Running a Program`).
- ` ```text stdin ` is sample input (see [Input](#input)).
- Every block needs a tag.

### Each run block stands alone

A run block must compile and run by itself: it has its own imports / includes / usings and shares nothing with other blocks. Readers copy blocks one at a time.

### Entry points

- **Python, JavaScript, TypeScript, C#, Swift** allow top-level code, so a block is just statements. (C# uses top-level statements, with implicit usings enabled as in `dotnet new console`.)
- **Java, C++, Go, Kotlin, Rust**: if the block has no entry point (`main`), the checker adds one for you. Imports at the very top of the block (`import`, `#include`, `using namespace std;`, `use`) are moved above it, and everything else goes inside `main`. So a block can be plain statements:

  ```cpp
  #include <iostream>
  using namespace std;

  // CAREFUL: integer division truncates toward zero
  cout << -3 / 2 << endl;  // => -1
  ```

- If the block needs top-level declarations (a function, a class, a struct), write the whole program, as in the Go example above: everything a file needs (Go's `package main`, imports) plus `main`. The checker leaves blocks that contain `main` unchanged.
- C++ blocks write `using namespace std;` after the includes, to match LeetCode's signatures (`vector<int>& nums`). Say once, in `Running a Program`, that this is a practice-code habit and not for real projects.

### Output comments

Every line the block prints is written in a comment that starts with `=>`: `# => 2` in Python, `// => 2` everywhere else.

```go
import "fmt"

// CAREFUL: integer division truncates toward zero
fmt.Println(-3 / 2) // => -1
```

- **Put it where the output happens.** Usually that's the end of the printing line. For a loop, put one `=>` comment after the loop that lists everything it prints (`// => 0 1 2`), or one per line. When a function prints, put the comment on the line that *calls* it, so comments stay in execution order.
- **Only output after `=>`.** Notes such as `CAREFUL:` go on the line above, never after `=>`.
- **How it's checked:** the checker joins all `=>` comments of a block in source order, splits them on whitespace, and compares the result with the program's stdout split on whitespace. They must match exactly. A print without a `=>` comment fails; a `=>` comment with no matching output fails. Line breaks aren't compared, so a loop's output can sit on one line.
- **Output must be deterministic.** Don't print in an order the language doesn't guarantee (Go maps, a Python set of strings, hash-based collections in general). Sort first, or print only sizes and membership. If showing the random order is the point, use `nocheck`.
- **If a value is worth telling the reader, print it and use `=>`**, so the checker verifies it. Don't state values in ordinary comments.
- Only stdout is compared. Any non-zero exit code fails the block.

### Input

A block that reads stdin is followed directly by a ` ```text stdin ` block containing the sample input. The checker feeds it to the program, and readers see it as the example input. Blocks without one get empty stdin.

````markdown
```python
n = int(input())
nums = list(map(int, input().split()))
print(n, sum(nums))  # => 3 6
```

```text stdin
3
1 2 3
```
````

### Exceptions: `norun` and `nocheck`

Use them rarely; reviewers will ask why.

- ` ```go norun `: shown, never run. Its first line must be a comment giving the reason.
- ` ```go nocheck `: run (it must compile and exit with 0) but its output isn't compared. Only for output that is nondeterministic on purpose. Don't put `=>` comments in it.

### Wrong code goes in comments

Code that is wrong or doesn't compile is shown as a comment, never as live code:

```python
# n++  # invalid: Python has no ++ or --
```

### Comments and names

- Short: usually one line, at most two.
- Line comments only (`#` or `//`), no block comments.
- Pitfalls start with `CAREFUL:`.
- When comparing, name the language ("Python gives -2") or say "most languages".
- Follow the language's naming conventions (snake_case in Python and Rust, camelCase in Java and Go, and so on). The exception is LeetCode's own names, such as a `Solution` method, which stay as LeetCode gives them.

## Running the checker

The checker runs every block of a sheet in a Docker image with the pinned toolchain, so you need Python 3.10+ and Docker, nothing else.

```bash
python3 tools/check.py sheets/go.md     # one sheet (lint + run)
python3 tools/check.py --all            # every sheet
python3 tools/check.py --local sheets/go.md   # use your own toolchain instead of Docker (version not guaranteed)
```

It prints one line per sheet when everything passes, and otherwise names the sheet and the markdown line of each failing block. CI runs the same checks on every pull request. See [`tools/README.md`](tools/README.md) for how the checker works and for the few constraints it puts on code.

## Adding a new language

1. Add an adapter, its Docker image and test fixtures under `tools/`, plus a CI matrix entry (see [`tools/README.md`](tools/README.md)). Submit this as its own pull request.
2. Then add `sheets/<id>.md`.

## Review checklist

- [ ] Header and all 15 shared headings present, in order (the checker's lint enforces this).
- [ ] Every item in each section's list above is covered, or the section says the language lacks it and shows the substitute.
- [ ] The code is idiomatic for the language, not translated from Python.
- [ ] Pitfalls that matter for this language are marked `CAREFUL:` (see the list below).
- [ ] Every printed value has a `=>` comment; there are no unchecked claims about values.
- [ ] `norun` / `nocheck` are rare and justified.
- [ ] No prose paragraphs; comments are one or two lines.
- [ ] Within about 1100 lines.
- [ ] `python3 tools/check.py sheets/<id>.md` passes.

## Pitfalls worth covering

A starting list, not a complete one. Verify each item by running it before you write it down.

- **Python:** `-3 // 2 == -2`; `-10 % 3 == 2`; `[[0] * n] * m` shares one row; ints never overflow but `math.pow` returns a float that can; a set of strings iterates in a different order on each run.
- **Java:** `int` overflow wraps silently; `==` on `Integer` compares references (it only seems to work from -128 to 127 because of caching); `char + int` is an `int`; `Arrays.sort(int[])` takes no comparator (use `Integer[]`); `%` takes the sign of the dividend.
- **C++:** integer division truncates toward zero; `%` takes the sign of the dividend; `size()` is unsigned, so `v.size() - 1` underflows on an empty vector; `priority_queue` is a max-heap by default; `unordered_map::operator[]` inserts missing keys; signed overflow is undefined behavior.
- **JavaScript:** `sort()` compares as strings by default (`[10, 9, 1].sort()` gives `[1, 10, 9]`); every number is a double (use `Math.trunc` for integer division; integers are exact only up to 2^53 − 1; `BigInt` beyond); `==` vs. `===`; no built-in heap or deque, and `shift()` is O(n); `%` takes the sign of the dividend; plain objects vs. `Map` as hash maps.
- **TypeScript:** the same runtime pitfalls as JavaScript; types are erased at runtime.
- **C#:** `PriorityQueue<TElement, TPriority>` is a min-heap with a separate priority; no built-in deque (`LinkedList<T>` works); `int` overflow wraps unless `checked`; the `Dictionary` indexer throws on a missing key.
- **Go:** map iteration order is random; there is no set type (`map[T]bool` or `map[T]struct{}`); `append` can share the original slice's backing array; `container/heap` needs an interface implementation; unused variables and imports are compile errors; integer division truncates toward zero.
- **Kotlin:** `/` on `Int`s is integer division; `map[key]` returns a nullable value; `val` vs. `var`; heaps are Java's `PriorityQueue`; `IntArray` vs. `Array<Int>`.
- **Swift:** a `String` can't be indexed with an `Int`; no heap or deque in the standard library; integer overflow traps at runtime; arrays and dictionaries are value types (copied on assignment).
- **Rust:** integer overflow panics in debug builds and wraps in release builds; `BinaryHeap` is a max-heap (wrap values in `Reverse` for a min-heap); a `String` can't be indexed with an integer; `usize` underflow (`v.len() - 1` on an empty vector panics); move vs. borrow; LeetCode's `TreeNode` is `Option<Rc<RefCell<TreeNode>>>`.
