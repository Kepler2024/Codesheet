# Rust Cheat Sheet

> Written for Rust 1.93

The Rust you need to solve LeetCode-style problems, for programmers who already know another language. Every snippet runs as is, and `// =>` shows what it prints.

## Running a Program

```rust
fn main() {
    // Execution starts in fn main.
    println!("hello"); // => hello
}
```

```bash
rustc main.rs
./main
```

## Variables

```rust
fn main() {
    let mut steps = 1;
    const LIMIT: i32 = 3;
    let cost: i64 = 4_000_000_000;
    let ratio: f64 = 0.5;
    let ready: bool = true;
    let grade: char = 'A';
    steps += 1;
    println!("{steps} {LIMIT} {cost} {ratio} {ready} {grade}"); // => 2 3 4000000000 0.5 true A

    // Option<T> holds Some(value) or None. Pattern matching extracts the value.
    let parents: [Option<usize>; 2] = [None, Some(2)];
    for parent in parents {
        match parent {
            Some(i) => println!("{i}"),
            None => println!("root"),
        }
    }
    // => root 2
    let (mut a, mut b) = (1, 2);
    (a, b) = (b, a);
    println!("{a} {b}"); // => 2 1
}
```

## If-statements

```rust
fn main() {
    let x = 7;
    let label = if x <= 0 {
        "low"
    } else if x < 10 && x != 5 {
        "middle"
    } else {
        "high"
    };
    let parity = if x % 2 == 0 { "even" } else { "odd" };
    println!("{label} {parity} {}", !(x < 1 || x > 9)); // => middle odd true
}
```

## Loops

```rust
fn main() {
    let mut n = 2;
    while n > 0 {
        println!("{n}");
        n -= 1;
    }
    // => 2 1
    for i in 0..6 {
        if i == 1 { continue; }
        if i == 4 { break; }
        println!("{i}");
    }
    // => 0 2 3
    for i in 2..=4 { println!("{i}"); }
    // => 2 3 4
    for i in (2..=4).rev() { println!("{i}"); }
    // => 4 3 2
}
```

## Math

```rust
fn main() {
    println!("{} {} {}", -3 / 2, -3.0 / 2.0, -10 % 3); // => -1 -1.5 -1
    println!("{} {}", (-1.5_f64).floor(), (-1.5_f64).ceil()); // => -2 -1
    println!("{} {} {}", 9_f64.sqrt(), 2_i32.pow(5), (-5_i32).abs()); // => 3 32 5
    println!("{} {} {}", i32::MIN, i32::MAX, f64::INFINITY); // => -2147483648 2147483647 inf
    // CAREFUL: ordinary runtime overflow panics with default debug checks and wraps in release.
    // Choose checked_add or wrapping_add when the behavior must be independent of build flags.
    println!("{:?} {}", i32::MAX.checked_add(1), i32::MAX.wrapping_add(1)); // => None -2147483648
}
```

## Output and Input

```rust
use std::io::{self,Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut lines = input.lines();
    println!("{}", lines.next().unwrap()); // => case one
    let mut values = lines.flat_map(str::split_whitespace).map(|s| s.parse::<i64>().unwrap());
    let count = values.next().unwrap() as usize;
    let total: i64 = values.take(count).sum();
    println!("{count} {total}"); // => 3 9
}
```

```text stdin
case one
3
2 3
4
```

## Ownership and Borrowing

```rust
fn main() {
    let original = vec![1, 2];
    let mut owned = original;
    // CAREFUL: assignment moves the Vec. Borrow it to inspect it without taking ownership.
    let view = &owned[..];
    println!("{view:?}"); // => [1, 2]
    let first = &mut owned[0];
    *first = 7;
    let mut independent = owned.clone();
    independent.push(3);
    println!("{owned:?} {independent:?}"); // => [7, 2] [7, 2, 3]
}
```

## Arrays

```rust
fn main() {
    let mut nums = vec![0; 3];
    nums[1] = 4;
    nums.push(7);
    println!("{:?} {} {}", nums.pop(), nums.len(), nums[1]); // => Some(7) 3 4
    // Indices are usize. last() handles an empty vector without subtracting.
    let empty: Vec<i32> = Vec::new();
    println!("{:?} {:?}", empty.last(), empty.len().checked_sub(1)); // => None None
    // CAREFUL: empty.len() - 1 underflows. get() also handles missing indices.
    println!("{:?} {:?}", nums.get(9), &nums[1..3]); // => None [4, 0]
    for i in 0..nums.len() { println!("{i}"); }
    // => 0 1 2
    for x in &nums { println!("{x}"); }
    // => 0 4 0
    for (i, x) in nums.iter().enumerate() { println!("{i} {x}"); }
    // => 0 0 1 4 2 0
    for (x, w) in nums.iter().zip([2, 3]) { println!("{}", x * w); }
    // => 0 12
}
```

```rust
use std::cmp::Reverse;

fn main() {
    let mut nums = vec![4, 1, 3];
    nums.reverse();
    println!("{nums:?}"); // => [3, 1, 4]
    nums.sort_unstable();
    println!("{nums:?}"); // => [1, 3, 4]
    nums.sort_unstable_by_key(|&x| Reverse(x));
    println!("{nums:?}"); // => [4, 3, 1]
    let mut words = ["four", "a", "to"];
    words.sort_by_key(|s| s.len());
    println!("{}", words.join(" ")); // => a to four
    let mut grid = vec![vec![0; 3]; 2];
    grid[0][0] = 7;
    println!("{}", grid[1][0]); // => 0
}
```

## Strings

```rust
fn main() {
    // CAREFUL: String has no integer character index. Slice only on UTF-8 byte boundaries.
    let s = "a猫";
    println!("{} {} {}", s.len(), s.chars().nth(1).unwrap(), &s[1..]); // => 4 猫 猫
    println!("{:?}", s.get(0..2)); // => None
    // &str borrows text. An owned mutable String can grow with push and push_str.
    let mut out = String::with_capacity(7);
    out.push_str("go-");
    for ch in "code".chars() { out.push(ch.to_ascii_uppercase()); }
    println!("{out}"); // => go-CODE
    println!("{} {}", "41".parse::<i32>().unwrap() + 1, 41.to_string() + "2"); // => 42 412
    println!("{} {}", 'a' as u32, char::from_u32(98).unwrap()); // => 97 b
    let words: Vec<_> = "one  two".split_whitespace().collect();
    println!("{} {}", words.join("-"), "ant" < "bee"); // => one-two true
}
```

## Queues

```rust
use std::collections::VecDeque;

fn main() {
    let mut q = VecDeque::new();
    q.push_back(2);
    q.push_front(1);
    println!("{:?} {:?} {}", q.front(), q.back(), q.len()); // => Some(1) Some(2) 2
    println!("{:?} {:?} {:?}", q.pop_front(), q.pop_back(), q.front()); // => Some(1) Some(2) None
}
```

## HashSets

```rust
use std::collections::HashSet;

fn main() {
    let mut seen: HashSet<_> = [2, 3, 2].into_iter().collect();
    seen.insert(5);
    seen.remove(&3);
    println!("{} {}", seen.contains(&2), seen.len()); // => true 2
    let mut ordered: Vec<_> = seen.iter().copied().collect();
    ordered.sort_unstable();
    println!("{ordered:?}"); // => [2, 5]
}
```

## HashMaps

```rust
use std::collections::HashMap;

fn main() {
    let mut counts = HashMap::new();
    counts.insert('x', 4);
    counts.insert('x', 5);
    println!("{:?} {}", counts.get(&'x'), counts.contains_key(&'x')); // => Some(5) true
    counts.remove(&'x');
    for ch in "banana".chars() { *counts.entry(ch).or_insert(0) += 1; }
    println!("{} {}", counts.len(), counts[&'a']); // => 3 3
    let mut keys: Vec<_> = counts.keys().collect();
    keys.sort_unstable();
    for k in keys { println!("{k}"); }
    // => a b n
    let total: i32 = counts.values().sum();
    println!("{total}"); // => 6
    let mut entries: Vec<_> = counts.iter().collect();
    entries.sort_unstable_by_key(|(ch, _)| **ch);
    for (k, v) in entries { println!("{k} {v}"); }
    // => a 3 b 1 n 2
}
```

## Tuples

```rust
use std::collections::HashMap;

fn bounds(nums: &[i32]) -> (i32, i32) {
    (*nums.iter().min().unwrap(), *nums.iter().max().unwrap())
}

fn main() {
    let (lo, hi) = bounds(&[4, 1, 7]);
    println!("{lo} {hi}"); // => 1 7
    let distance = HashMap::from([((2, 3), 5)]);
    println!("{}", distance[&(2, 3)]); // => 5
}
```

## Heaps

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn main() {
    // CAREFUL: BinaryHeap is a max-heap. Reverse reverses the ordering of the wrapped key.
    let mut max = BinaryHeap::from(vec![5, 2, 3]);
    println!("{:?}", max.pop()); // => Some(5)
    let mut min: BinaryHeap<_> = [5, 2, 3].into_iter().map(Reverse).collect();
    min.push(Reverse(1));
    println!("{} {}", min.peek().unwrap().0, min.len()); // => 1 4
    println!("{}", min.pop().unwrap().0); // => 1
    // The cost is the priority. Equal costs break ties by name.
    let mut jobs = BinaryHeap::new();
    for (name, cost) in [("ship", 3), ("plan", 1)] {
        jobs.push(Reverse((cost, name)));
    }
    let Reverse((cost, name)) = jobs.pop().unwrap();
    println!("{name} {cost}"); // => plan 1
}
```

## Functions

```rust
fn edit(nums: &mut [i32]) { nums[0] = 7; }
fn replace(mut nums: Vec<i32>) -> Vec<i32> {
    nums.clear();
    nums = vec![9];
    nums
}

fn main() {
    let mut nums = vec![1, 2];
    edit(&mut nums);
    println!("{nums:?}"); // => [7, 2]
    // Move ownership into replace and bind its return to use the new vector.
    let nums = replace(nums);
    println!("{nums:?}"); // => [9]
    let mut total = 0;
    let mut add = |step| { total += step; total };
    let square = |x: i32| x * x;
    println!("{} {} {}", add(3), add(4), square(5)); // => 3 7 25
}
```

## Classes

```rust
// Rust has no classes. Put fields in a struct and methods in an impl block.
struct Point { x: i32, y: i32 }
impl Point {
    fn new(x: i32, y: i32) -> Self { Self { x, y } }
    fn dist_sq(&self) -> i32 { self.x * self.x + self.y * self.y }
}

fn main() {
    println!("{}", Point::new(3, 4).dist_sq()); // => 25
}
```

```rust
use std::rc::Rc;
use std::cell::RefCell;

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}
impl ListNode {
    #[inline]
    fn new(val: i32) -> Self { ListNode { next: None, val } }
}
#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}
impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self { TreeNode { val, left: None, right: None } }
}
fn inorder(root: &Option<Rc<RefCell<TreeNode>>>) {
    if let Some(link) = root {
        let node = link.borrow();
        inorder(&node.left);
        println!("{}", node.val);
        inorder(&node.right);
    }
}

fn main() {
    let mut head = ListNode::new(1);
    head.next = Some(Box::new(ListNode::new(2)));
    let mut current = Some(&head);
    while let Some(node) = current {
        println!("{}", node.val);
        current = node.next.as_deref();
    }
    // => 1 2
    let leaf = |n| Some(Rc::new(RefCell::new(TreeNode::new(n))));
    let root = leaf(2);
    if let Some(link) = &root {
        let mut node = link.borrow_mut();
        node.left = leaf(1);
        node.right = leaf(3);
    }
    inorder(&root); // => 1 2 3
    let root_ref = root.as_ref().unwrap().borrow();
    println!("{}", root_ref.left.as_ref().unwrap().borrow().right.is_none()); // => true
}
```
