# Rust Cheat Sheet

> Written for Rust 1.93

Use this quick reference to learn or revisit Rust syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```rust
// Every program starts at fn main
fn main() {
    println!("Hello, World!"); // => Hello, World!
}
```

```bash
rustc hello.rs && ./hello    # in a Cargo project: cargo run
```

```rust
// Most blocks below are just the body of main, to keep them short.
// To run one yourself, keep the use lines at the top and put the rest inside fn main() { ... }.
println!("Hello from main"); // => Hello from main
```

## Variables

```rust
// Variables are immutable by default; mut makes them changeable
let n = 0;
// n = 5;  // error[E0384]: cannot assign twice to immutable variable `n`
let mut m = 0;
m = 5;

// println! embeds a variable with {name}; {} takes the next argument
println!("{n} {}", m); // => 0 5

// The type is inferred from the value, and then it is fixed
// m = "abc";  // error[E0308]: mismatched types

// Common types: i32 (the default integer), i64, usize (lengths and indexes), f64, bool, char
let big: i64 = 4_000_000_000;
let ratio: f64 = 0.5;
let done = false;
let letter = 'a';
println!("{big} {ratio} {done} {letter}"); // => 4000000000 0.5 false a

// Shadowing: a new let with the same name makes a new variable, even of another type
let x = "5";
let x: i32 = x.parse().unwrap();
println!("{}", x + 1); // => 6

// Constants need a type, and are named in UPPER_CASE
const MAX_SIZE: usize = 100;
println!("{MAX_SIZE}"); // => 100

// Swap with a tuple
let (mut a, mut b) = (1, 2);
(a, b) = (b, a);
println!("{a} {b}"); // => 2 1

// Increment: Rust has no ++ or --
m += 1;
println!("{m}"); // => 6

// CAREFUL: numbers never convert implicitly; convert with `as`
let i: i32 = 7;
let len: usize = 3;
// i + len  // error[E0308]: mismatched types
println!("{}", i as usize + len); // => 10
```

```rust
// There is no null. An Option<T> is either Some(value) or None.
let found: Option<i32> = Some(3);
let missing: Option<i32> = None;

// {:?} prints the debug form, which works for Option, Vec and tuples
println!("{:?} {:?}", found, missing); // => Some(3) None

// match handles every case
match found {
    Some(v) => println!("got {v}"), // => got 3
    None => println!("nothing"),
}

// if let handles just the case you care about
if let Some(v) = found {
    println!("{v}"); // => 3
}

// unwrap_or supplies a default; unwrap panics on None
println!("{} {}", missing.unwrap_or(-1), found.unwrap()); // => -1 3
// missing.unwrap();  // panics: called `Option::unwrap()` on a `None` value

// Many methods return an Option instead of failing: last, get, pop, HashMap::get...
let v = vec![1, 2];
println!("{:?} {:?}", v.last(), v.get(9)); // => Some(2) None
```

## If-statements

```rust
// No parentheses around the condition, and the braces are required
let mut n = 1;
if n > 2 {
    n -= 1;
} else if n == 2 {
    n *= 2;
} else {
    n += 2;
}
println!("{n}"); // => 3

// Logical operators: && (and), || (or), ! (not)
let m = 5;
if n > 0 && m > 0 {
    println!("both"); // => both
}
println!("{} {}", !true, true || false); // => false true

// CAREFUL: a condition must be a bool; 0 isn't falsy
// if n { }  // error[E0308]: mismatched types: expected `bool`, found integer

// if is an expression, and replaces the ternary operator
let parity = if n % 2 == 0 { "even" } else { "odd" };
println!("{parity}"); // => odd

// match is Rust's switch: it must cover every case, and arms can be ranges
let size = match n {
    i32::MIN..=-1 => "negative",
    0..=9 => "small",
    _ => "large",
};
println!("{size}"); // => small
```

## Loops

```rust
let mut n = 0;
while n < 3 {
    println!("{n}");
    n += 1;
}
// => 0 1 2

// i = 0 to 4: .. excludes the end
for i in 0..5 {
    println!("{i}");
}
// => 0 1 2 3 4

// i = 2 to 5: ..= includes the end
for i in 2..=5 {
    println!("{i}");
}
// => 2 3 4 5

// i = 5 down to 2: reverse the range
for i in (2..=5).rev() {
    println!("{i}");
}
// => 5 4 3 2

for i in 0..10 {
    if i == 1 {
        continue;
    }
    if i == 4 {
        break;
    }
    println!("{i}");
}
// => 0 2 3

// step_by skips values
for i in (0..10).step_by(3) {
    println!("{i}");
}
// => 0 3 6 9

// loop runs forever; break can hand back a value
let mut count = 0;
let result = loop {
    count += 1;
    if count == 3 {
        break count * 10;
    }
};
println!("{result}"); // => 30

// A label ('name) lets break or continue act on an outer loop
'outer: for i in 0..3 {
    for j in 0..3 {
        if j > i {
            continue 'outer;
        }
        if i == 2 {
            break 'outer;
        }
        println!("{i} {j}");
    }
}
// => 0 0 1 0 1 1
```

## Math

```rust
use std::cmp::{max, min};

// / on two integers is integer division
println!("{} {}", 5 / 2, 5.0 / 2.0); // => 2 2.5

// CAREFUL: integers and floats don't mix; convert with `as`
let a = 5;
// a / 2.0  // error[E0277]: cannot divide `{integer}` by `{float}`
println!("{}", a as f64 / 2.0); // => 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
println!("{}", -3 / 2); // => -1

// CAREFUL: % takes the sign of the dividend (Python gives 2)
println!("{}", -10 % 3); // => -1

// div_euclid and rem_euclid round down, and their remainder is never negative
println!("{} {}", (-3_i32).div_euclid(2), (-10_i32).rem_euclid(3)); // => -2 2

// Math functions are methods; whole floats print without a decimal point
let x: f64 = -1.5;
println!("{} {}", x.floor(), x.ceil()); // => -2 -1
println!("{} {} {}", 16_f64.sqrt(), 2_i32.pow(10), (-7_i32).abs()); // => 4 1024 7
println!("{} {}", max(3, 8), min(3, 8)); // => 8 3

// Casting a float to an integer truncates toward 0
println!("{}", 17_f64.sqrt() as i32); // => 4

// Limits and infinity
println!("{} {}", i32::MAX, i32::MIN); // => 2147483647 -2147483648
println!("{} {}", i64::MAX, f64::INFINITY); // => 9223372036854775807 inf

// CAREFUL: overflow panics in debug builds ("attempt to add with overflow")
// and wraps in release builds. Say which behavior you want instead:
let big = i32::MAX;
println!("{:?} {} {}", big.checked_add(1), big.wrapping_add(1), big.saturating_add(1)); // => None -2147483648 2147483647

// Widen to i64 BEFORE multiplying when the product may not fit
let side: i32 = 50_000;
println!("{}", side as i64 * side as i64); // => 2500000000
```

## Output and Input

```rust
// println! formats with {}: {name} inserts a variable, {} the next argument
let name = "alice";
let score = 90;
println!("{name} scored {score}"); // => alice scored 90
println!("{} + {} = {}", 1, 2, 1 + 2); // => 1 + 2 = 3

// print! adds no newline
print!("same ");
println!("line"); // => same line

// {:?} prints the debug form; {:.2} prints 2 decimals
let v = vec![1, 2, 3];
println!("{:?} {:.2}", v, 3.14159); // => [1, 2, 3] 3.14

// CAREFUL: println!("{}", v) doesn't compile: a Vec has no {} (Display) format.
// Join the elements for plain output
let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
println!("{}", parts.join(" ")); // => 1 2 3
```

```rust
use std::io::{self, Read};

// Read all of stdin into a String, then split it into whitespace-separated tokens.
// This works no matter how the numbers are spread over lines.
let mut input = String::new();
io::stdin().read_to_string(&mut input).unwrap();
let mut tokens = input.split_ascii_whitespace();
let n: usize = tokens.next().unwrap().parse().unwrap();
let nums: Vec<i64> = (0..n).map(|_| tokens.next().unwrap().parse().unwrap()).collect();
println!("{n} {:?}", nums); // => 3 [1, 2, 3]
```

```text stdin
3
1 2
3
```

```rust
use std::io::{self, BufRead, BufWriter, Write};

// Or read line by line; each line arrives without its newline
let stdin = io::stdin();

// For large outputs, wrap stdout in a BufWriter and write to it with writeln!
let mut out = BufWriter::new(io::stdout().lock());
for line in stdin.lock().lines() {
    let line = line.unwrap();
    writeln!(out, "{}", line.to_uppercase()).unwrap();
}
// => HELLO WORLD SECOND LINE
```

```text stdin
hello world
second line
```

## Ownership and Borrowing

```rust
// Every value has one owner. Assigning a Vec or String MOVES it: the old name is unusable
let a = vec![1, 2, 3];
let b = a;
// println!("{:?}", a);  // error[E0382]: borrow of moved value: `a`
println!("{:?}", b); // => [1, 2, 3]

// clone() makes an independent copy
let mut c = b.clone();
c[0] = 99;
println!("{:?} {:?}", b, c); // => [1, 2, 3] [99, 2, 3]

// Integers, floats, bool and char are Copy: assignment copies them, nothing moves
let x = 5;
let y = x;
println!("{x} {y}"); // => 5 5

// & borrows a value without taking ownership; any number of & borrows can exist at once
let v = vec![1, 2, 3];
let first = &v[0];
let all = &v;
println!("{first} {}", all.len()); // => 1 3

// &mut borrows a value to change it; while it's in use, no other borrow is allowed
let mut w = vec![1, 2];
let r = &mut w;
r.push(3);
println!("{:?}", w); // => [1, 2, 3]

// CAREFUL: you can't push to a Vec while a reference into it is still used later
// let top = &w[0]; w.push(4); println!("{top}");
//     error[E0502]: cannot borrow `w` as mutable because it is also borrowed as immutable
// Copy the value out instead
let top = w[0];
w.push(4);
println!("{top} {}", w.len()); // => 1 4
```

## Arrays

```rust
// Vec<T> is the dynamic array; vec! builds one
let mut arr = vec![1, 2, 3];
println!("{:?} {}", arr, arr.len()); // => [1, 2, 3] 3

// Use it as a stack: push and pop at the end are O(1); pop returns an Option
arr.push(4);
println!("{:?}", arr.pop()); // => Some(4)

// Peek at the top, also as an Option
println!("{:?}", arr.last()); // => Some(3)

// insert and remove in the middle are O(n)
arr.insert(1, 7);
println!("{:?}", arr); // => [1, 7, 2, 3]
arr.remove(0);
println!("{:?}", arr); // => [7, 2, 3]

// A Vec of size n filled with a default value
println!("{:?}", vec![0; 5]); // => [0, 0, 0, 0, 0]

// CAREFUL: indexes are usize, and an index out of range panics; get() returns an Option
// arr[10]  // panics: index out of bounds: the len is 3 but the index is 10
println!("{} {:?}", arr[arr.len() - 1], arr.get(10)); // => 3 None

// CAREFUL: len() is a usize, so len() - 1 on an empty Vec panics instead of giving -1
let empty: Vec<i32> = Vec::new();
// empty.len() - 1  // panics: attempt to subtract with overflow
println!("{:?}", empty.len().checked_sub(1)); // => None

// A slice &v[start..end] borrows part of a Vec; end is exclusive
let nums = vec![1, 2, 3, 4];
println!("{:?} {:?} {:?}", &nums[1..3], &nums[..2], &nums[2..]); // => [2, 3] [1, 2] [3, 4]

// contains and position are O(n); use a HashSet for fast lookups
println!("{} {:?}", nums.contains(&3), nums.iter().position(|&x| x == 3)); // => true Some(2)
println!("{} {:?}", nums.iter().sum::<i32>(), nums.iter().max()); // => 10 Some(4)

// map and filter are iterator adapters; collect builds the result
let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
let evens: Vec<i32> = nums.iter().filter(|&&x| x % 2 == 0).copied().collect();
println!("{:?} {:?}", doubled, evens); // => [2, 4, 6, 8] [2, 4]

// A fixed-size array [T; N] has its size in its type, e.g. letter counts
let mut counts = [0; 26];
counts[2] += 1;
println!("{}", counts[2]); // => 1
```

```rust
let nums = vec![10, 20, 30];

// By index
for i in 0..nums.len() {
    println!("{}", nums[i]);
}
// => 10 20 30

// By value: loop over a reference (&nums) so nums stays usable afterwards
for n in &nums {
    println!("{n}");
}
// => 10 20 30

// Index and value together
for (i, n) in nums.iter().enumerate() {
    println!("{i} {n}");
}
// => 0 10 1 20 2 30

// Two Vecs in lockstep; zip stops at the shorter one
for (n, ch) in nums.iter().zip(["a", "b", "c"]) {
    println!("{n} {ch}");
}
// => 10 a 20 b 30 c

// To change elements in place, loop over &mut
let mut v = nums.clone();
for n in &mut v {
    *n *= 2;
}
println!("{:?}", v); // => [20, 40, 60]

// CAREFUL: `for n in nums` moves the Vec into the loop; nums is gone afterwards
```

```rust
use std::cmp::Reverse;

let mut nums = vec![5, 4, 7, 3, 8];

// reverse and sort work in place
nums.reverse();
println!("{:?}", nums); // => [8, 3, 7, 4, 5]
nums.sort();
println!("{:?}", nums); // => [3, 4, 5, 7, 8]

// Descending: compare b with a, or sort by a Reverse key
nums.sort_by(|a, b| b.cmp(a));
println!("{:?}", nums); // => [8, 7, 5, 4, 3]
nums.sort_by_key(|&x| Reverse(x));
println!("{:?}", nums); // => [8, 7, 5, 4, 3]

// To keep the original, sort a clone
let words = vec!["bob", "alice", "jane", "doe"];
let mut sorted = words.clone();
sorted.sort();
println!("{:?} {}", sorted, words[0]); // => ["alice", "bob", "doe", "jane"] bob

// Custom order: a tuple key sorts by length, then alphabetically
let mut by_len = words.clone();
by_len.sort_by_key(|w| (w.len(), *w));
println!("{:?}", by_len); // => ["bob", "doe", "jane", "alice"]

// Sort pairs by their second element
let mut pairs = vec![(1, 3), (2, 1), (3, 2)];
pairs.sort_by_key(|p| p.1);
println!("{:?}", pairs); // => [(2, 1), (3, 2), (1, 3)]

// CAREFUL: f64 has no total order, so sort() doesn't compile on Vec<f64>; use total_cmp
let mut fs: Vec<f64> = vec![2.5, -1.0, 0.5];
fs.sort_by(|a, b| a.total_cmp(b));
println!("{:?}", fs); // => [-1.0, 0.5, 2.5]
```

```rust
// 2-D Vec with 3 rows and 4 columns; vec![row; n] clones the row, so rows are independent
let mut grid = vec![vec![0; 4]; 3];
grid[0][0] = 1;
println!("{:?}", grid); // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
println!("{} {}", grid.len(), grid[0].len()); // => 3 4

// In backtracking, push a clone of the path (the borrow checker won't let you
// keep the path itself and change it later)
let mut path = vec![1, 2];
let mut res: Vec<Vec<i32>> = Vec::new();
res.push(path.clone());
path[0] = 9;
println!("{:?}", res); // => [[1, 2]]
```

## Strings

```rust
// &str is a borrowed string slice (every literal is one); String is owned and growable
let s: &str = "abc";
let mut owned: String = String::from("ab");
owned.push('c');
owned.push_str("de");
owned += "f";
println!("{owned}"); // => abcdef

// CAREFUL: a string can't be indexed with an integer
// s[0]  // error[E0277]: the type `str` cannot be indexed by `{integer}`

// For ASCII text (most LeetCode problems), index the bytes...
let bytes = s.as_bytes();
println!("{} {}", bytes[0], bytes[0] as char); // => 97 a

// ...or collect the chars into a Vec<char> once
let chars: Vec<char> = s.chars().collect();
println!("{}", chars[1]); // => b

// Slicing takes a byte range; it panics if the range splits a multi-byte character
println!("{} {}", &s[1..], &s[..2]); // => bc ab

// String <-> number; parse returns a Result (Err for bad input)
let n: i32 = "123".parse().unwrap();
println!("{} {}", n + 1, 123.to_string() + "4"); // => 124 1234
println!("{}", "12a".parse::<i32>().is_err()); // => true

// char <-> code
println!("{} {}", 'a' as u32, (b'a' + 1) as char); // => 97 b

// A letter's index into a 26-element array, and a digit's value
let c = 'c';
println!("{} {:?}", (c as u8 - b'a') as usize, '7'.to_digit(10)); // => 2 Some(7)
```

```rust
// split_whitespace splits on any run of whitespace
let words: Vec<&str> = "the quick  brown fox".split_whitespace().collect();
println!("{} {}", words.len(), words.join("-")); // => 4 the-quick-brown-fox

// CAREFUL: split(' ') keeps the empty piece between two spaces
let parts: Vec<&str> = "a  b".split(' ').collect();
println!("{:?}", parts); // => ["a", "", "b"]

// == and < compare lexicographically
println!("{} {}", "apple" < "banana", "a" == "a"); // => true true

// format! builds a String the way println! prints
let label = format!("{}-{}", 1, 2);
println!("{label}"); // => 1-2

let s = "hello";
let reversed: String = s.chars().rev().collect();
println!("{} {} {:?}", reversed, s.contains("ell"), s.find('l')); // => olleh true Some(2)
println!("{} {}", s.to_uppercase(), 'x'.is_alphabetic()); // => HELLO true
```

## Queues

```rust
use std::collections::VecDeque;

// VecDeque is a double-ended queue: O(1) at both ends
let mut dq = VecDeque::new();
dq.push_back(1);
dq.push_back(2);
dq.push_front(0);
println!("{:?}", dq); // => [0, 1, 2]

// pop_front and pop_back return an Option (None when empty)
println!("{:?} {:?}", dq.pop_front(), dq.pop_back()); // => Some(0) Some(2)

// Peek at the front and the back, and the size
dq.push_back(3);
println!("{:?} {:?} {}", dq.front(), dq.back(), dq.len()); // => Some(1) Some(3) 2

// Typical BFS loop: while let keeps popping until the queue is empty
let mut queue = VecDeque::from([1, 2, 3]);
while let Some(node) = queue.pop_front() {
    println!("{node}");
}
// => 1 2 3
```

## HashSets

```rust
use std::collections::{BTreeSet, HashSet};

let mut seen = HashSet::new();
seen.insert(1);
seen.insert(2);

// insert returns false if the item was already there
println!("{}", seen.insert(2)); // => false
println!("{}", seen.len()); // => 2

// contains and remove take a reference
println!("{} {}", seen.contains(&1), seen.contains(&3)); // => true false
println!("{} {}", seen.remove(&2), seen.remove(&42)); // => true false

// Build from a Vec
let set: HashSet<i32> = vec![3, 1, 3, 2].into_iter().collect();
println!("{}", set.len()); // => 3

// CAREFUL: a HashSet's order is random and changes between runs;
// a BTreeSet keeps its items sorted
let sorted: BTreeSet<i32> = set.iter().copied().collect();
println!("{:?}", sorted); // => {1, 2, 3}

// union, intersection and difference return iterators (BTreeSets keep them sorted)
let a = BTreeSet::from([1, 2, 3]);
let b = BTreeSet::from([2, 3, 4]);
let inter: Vec<i32> = a.intersection(&b).copied().collect();
let diff: Vec<i32> = a.difference(&b).copied().collect();
println!("{:?} {:?} {}", inter, diff, a.union(&b).count()); // => [2, 3] [1] 4
```

## HashMaps

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert("alice", 88);
scores.insert("bob", 77);
println!("{}", scores.len()); // => 2

// insert overwrites, and returns the old value
println!("{:?}", scores.insert("alice", 80)); // => Some(88)

// get returns an Option
println!("{:?} {:?}", scores.get("alice"), scores.get("zoe")); // => Some(80) None
println!("{}", scores.get("zoe").copied().unwrap_or(0)); // => 0

// CAREFUL: map[key] panics if the key is missing
// scores["zoe"]  // panics
println!("{}", scores["bob"]); // => 77

println!("{}", scores.contains_key("alice")); // => true
scores.remove("alice");
println!("{}", scores.contains_key("alice")); // => false
```

```rust
use std::collections::{BTreeMap, HashMap};

// CAREFUL: a HashMap's order is random; a BTreeMap keeps its keys sorted
let scores = BTreeMap::from([("bob", 70), ("alice", 90)]);

for (key, val) in &scores {
    println!("{key} {val}");
}
// => alice 90 bob 70

println!("{:?} {:?}", scores.keys().collect::<Vec<_>>(), scores.values().collect::<Vec<_>>()); // => ["alice", "bob"] [90, 70]

// Counting: entry(key).or_insert(0) gives a mutable reference to the count
let mut count = HashMap::new();
for ch in "banana".chars() {
    *count.entry(ch).or_insert(0) += 1;
}
println!("{} {}", count[&'a'], count[&'n']); // => 3 2

// Grouping: or_default() creates an empty Vec on first access
let mut groups: HashMap<String, Vec<&str>> = HashMap::new();
for word in ["eat", "tea", "tan"] {
    let mut letters: Vec<char> = word.chars().collect();
    letters.sort();
    groups.entry(letters.into_iter().collect()).or_default().push(word);
}
println!("{:?}", groups["aet"]); // => ["eat", "tea"]
```

## Tuples

```rust
use std::collections::{HashMap, HashSet};

// Return several values as a tuple
fn min_max(nums: &[i32]) -> (i32, i32) {
    (*nums.iter().min().unwrap(), *nums.iter().max().unwrap())
}

fn main() {
    // Destructure it, or read the fields as .0, .1
    let (lo, hi) = min_max(&[3, 1, 4]);
    println!("{lo} {hi}"); // => 1 4
    let t = (1, "one");
    println!("{} {}", t.0, t.1); // => 1 one

    // Tuples compare element by element
    println!("{}", (1, 2) < (1, 3)); // => true

    // Tuples of hashable values work as HashSet items and HashMap keys
    let mut visited = HashSet::new();
    visited.insert((0, 1));
    println!("{}", visited.contains(&(0, 1))); // => true
    let dist = HashMap::from([((0, 1), 1)]);
    println!("{}", dist[&(0, 1)]); // => 1
}
```

## Heaps

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

// CAREFUL: BinaryHeap is a MAX-heap (Python's heapq is a min-heap)
let mut heap = BinaryHeap::new();
heap.push(3);
heap.push(1);
heap.push(5);

// peek and pop return an Option
println!("{:?} {}", heap.peek(), heap.len()); // => Some(5) 3
while let Some(x) = heap.pop() {
    println!("{x}");
}
// => 5 3 1

// Min-heap: wrap each value in Reverse, and unwrap it with a pattern
let mut min_heap = BinaryHeap::new();
for x in [5, 1, 8] {
    min_heap.push(Reverse(x));
}
if let Some(Reverse(x)) = min_heap.pop() {
    println!("{x}"); // => 1
}

// Build from a Vec in O(n)
let heap = BinaryHeap::from(vec![5, 1, 8, 3]);
println!("{:?}", heap.peek()); // => Some(8)

// Custom priority: tuples compare by the first element, then the second
let mut tasks = BinaryHeap::new();
tasks.push(Reverse((2, "write")));
tasks.push(Reverse((1, "plan")));
tasks.push(Reverse((3, "ship")));
while let Some(Reverse((priority, name))) = tasks.pop() {
    println!("{priority} {name}");
}
// => 1 plan 2 write 3 ship

// CAREFUL: f64 isn't Ord, so BinaryHeap<f64> doesn't compile; scale to integers instead
```

## Functions

```rust
// Parameter types are required. The last expression (with no semicolon) is the return value.
fn multiply(n: i32, m: i32) -> i32 {
    n * m
}

// return still works for an early exit. Rust has no default arguments or overloading.
fn abs_diff(a: i32, b: i32) -> i32 {
    if a > b {
        return a - b;
    }
    b - a
}

fn main() {
    println!("{} {}", multiply(3, 4), abs_diff(2, 7)); // => 12 5

    // A closure is |parameters| body; it can capture variables from around it
    let square = |x: i32| x * x;
    let offset = 10;
    let shift = |x: i32| x + offset;
    println!("{} {}", square(5), shift(1)); // => 25 11

    // A closure that changes a captured variable must be declared mut
    let mut total = 0;
    let mut add = |n: i32| total += n;
    add(3);
    add(4);
    println!("{total}"); // => 7

    // CAREFUL: a closure can't call itself. For recursion (a DFS helper, say), write a
    // nested fn; it can't capture variables, so pass the state in as parameters
    fn dfs(n: i32, total: &mut i32) {
        if n == 0 {
            return;
        }
        *total += n;
        dfs(n - 1, total);
    }
    let mut sum = 0;
    dfs(3, &mut sum);
    println!("{sum}"); // => 6
}
```

```rust
// Passing a Vec by value moves it into the function
fn consume(v: Vec<i32>) -> usize {
    v.len()
}

// &mut borrows it so the function can change it
fn push_one(v: &mut Vec<i32>) {
    v.push(1);
}

// & borrows it to read; &[i32] accepts a borrowed Vec or array, so prefer it over &Vec<i32>
fn sum(v: &[i32]) -> i32 {
    v.iter().sum()
}

fn main() {
    let mut nums = vec![];
    push_one(&mut nums);
    println!("{:?} {}", nums, sum(&nums)); // => [1] 1

    let n = consume(nums);
    println!("{n}"); // => 1
    // println!("{:?}", nums);  // error[E0382]: borrow of moved value: `nums`

    // Copy types like i32 are copied, so the caller's value never changes
}
```

## Classes

```rust
// Rust has no classes. A struct holds the data, and an impl block holds the methods.
use std::fmt;

// derive generates common traits: Debug for {:?}, Clone, ==, and Hash for use as a key
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // A constructor is an ordinary associated function, by convention called new
    fn new(x: i32, y: i32) -> Self {
        Point { x, y }
    }

    // &self borrows the object to read it
    fn dist_sq(&self) -> i32 {
        self.x * self.x + self.y * self.y
    }

    // &mut self borrows it to change it
    fn shift(&mut self, dx: i32) {
        self.x += dx;
    }
}

// Optional: Display controls how {} prints it
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Point({}, {})", self.x, self.y)
    }
}

fn main() {
    let mut p = Point::new(3, 4);
    println!("{}", p.dist_sq()); // => 25
    p.shift(1);
    println!("{p} {:?}", p); // => Point(4, 4) Point { x: 4, y: 4 }

    // Sort structs by a key
    let mut pts = vec![Point::new(2, 2), Point::new(1, 0)];
    pts.sort_by_key(|p| p.dist_sq());
    println!("{} {}", pts[0], pts[1]); // => Point(1, 0) Point(2, 2)

    // Thanks to the derives, Points compare by value and work as HashSet items
    println!("{}", Point::new(1, 1) == Point::new(1, 1)); // => true
}
```

```rust
// LeetCode's linked list node for Rust. next owns the rest of the list (Box);
// None marks the end.
#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        ListNode { next: None, val }
    }
}

fn main() {
    // Build 1 -> 2 -> 3 from the back
    let mut head: Option<Box<ListNode>> = None;
    for val in [3, 2, 1] {
        let mut node = ListNode::new(val);
        node.next = head;
        head = Some(Box::new(node));
    }

    // Walk the list with a borrowed reference until the end (None)
    let mut cur = &head;
    while let Some(node) = cur {
        println!("{}", node.val);
        cur = &node.next;
    }
    // => 1 2 3
}
```

```rust
use std::cell::RefCell;
use std::rc::Rc;

// LeetCode's binary tree node for Rust. Rc lets several owners share a node, and
// RefCell allows changing it through them: borrow() to read, borrow_mut() to write.
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

// On LeetCode you complete an associated function in impl Solution
struct Solution;

impl Solution {
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        match root {
            None => 0,
            Some(node) => {
                let node = node.borrow();
                // Rc::clone copies the pointer, not the subtree
                1 + Self::max_depth(node.left.clone()).max(Self::max_depth(node.right.clone()))
            }
        }
    }
}

// In-order traversal; a missing child is None
fn inorder(node: &Option<Rc<RefCell<TreeNode>>>) {
    if let Some(n) = node {
        let n = n.borrow();
        inorder(&n.left);
        println!("{}", n.val);
        inorder(&n.right);
    }
}

fn main() {
    let leaf = |val| Some(Rc::new(RefCell::new(TreeNode::new(val))));

    //     2
    //    / \
    //   1   3
    let root = leaf(2);
    if let Some(node) = &root {
        node.borrow_mut().left = leaf(1);
        node.borrow_mut().right = leaf(3);
    }

    inorder(&root); // => 1 2 3
    let left = root.as_ref().unwrap().borrow().left.clone().unwrap();
    println!("{}", left.borrow().left.is_none()); // => true
    println!("{}", Solution::max_depth(root)); // => 2
}
```
