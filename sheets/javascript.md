# JavaScript Cheat Sheet

> Written for Node.js 22

Use this quick reference to learn or revisit JavaScript syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```javascript
// Node runs the file from top to bottom.
console.log("hello"); // => hello
```

```bash
node hello.js
```

## Variables

```javascript
let left = 2;
let right = 5;
[left, right] = [right, left];
right++;
console.log(left, right); // => 5 3

// const fixes the binding. The array can still grow.
const path = [1];
path.push(3);
console.log(...path); // => 1 3

let parent = null;
console.log(parent === null, typeof undefined); // => true undefined
parent = 0;
console.log(parent ?? -1); // => 0
```

## If-statements

```javascript
const score = 7;
let label;
if (score < 0) {
  label = "invalid";
} else if (score >= 5 && score <= 10) {
  label = "high";
} else {
  label = "low";
}
console.log(label, score % 2 ? "odd" : "even"); // => high odd
console.log(!(score < 5 || score > 10)); // => true
// CAREFUL: loose equality coerces a string to a number. Strict equality preserves the types.
console.log("1" == 1, "1" === 1); // => true false
```

## Loops

```javascript
let n = 3;
while (n > 0) {
  console.log(n--);
}
// => 3 2 1

for (let i = 0; i < 6; i++) {
  if (i === 1) continue;
  if (i === 4) break;
  console.log(i);
}
// => 0 2 3
for (let i = 3; i <= 5; i++) console.log(i);
// => 3 4 5
for (let i = 5; i >= 3; i--) console.log(i);
// => 5 4 3
```

## Math

```javascript
// CAREFUL: Number division gives a floating-point quotient.
// Math.trunc drops the fraction toward zero. Remainders follow the dividend.
console.log(-3 / 2, Math.trunc(-3 / 2), -10 % 3); // => -1.5 -1 -1
console.log(Math.floor(-1.5), Math.ceil(-1.5)); // => -2 -1
console.log(Math.sqrt(16), 2 ** 8, Math.abs(-9)); // => 4 256 9
console.log(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER); // => -9007199254740991 9007199254740991
const edge = Number.MAX_SAFE_INTEGER;
console.log(edge + 1 === edge + 2, Number.MAX_VALUE * 2); // => true Infinity
console.log(Math.min(Infinity, 8), Math.max(-Infinity, 3)); // => 8 3

// Use bigint for exact integer arithmetic. Division truncates toward zero.
console.log(String(BigInt(edge) + 2n), String(-3n / 2n)); // => 9007199254740993 -1
```

## Output and Input

```javascript
const { readFileSync } = require("node:fs");
// File descriptor 0 is stdin. Keep line boundaries for the label,
// then tokenize the remaining integers across any number of lines.
const [label, ...lines] = readFileSync(0, "utf8").trimEnd().split(/\r?\n/);
const [n, ...numbers] = lines.join(" ").trim().split(/\s+/).map(Number);
console.log(label); // => sample
console.log(n, numbers.slice(0, n).reduce((sum, x) => sum + x, 0)); // => 3 12
```

```text stdin
sample
3
3 4
5
```

## Arrays

```javascript
const stack = Array(3).fill(0);
stack[1] = 4;
stack.push(7);
console.log(stack.pop(), stack.length, stack[1]); // => 7 3 4
// CAREFUL: a negative subscript looks up a property. at(-1) counts from the end.
console.log(stack[-1], stack.at(-1)); // => undefined 0
console.log(...stack.slice(0, 2)); // => 0 4

const nums = [8, 5];
for (let i = 0; i < nums.length; i++) console.log(i);
// => 0 1
for (const x of nums) console.log(x);
// => 8 5
for (const [i, x] of nums.entries()) console.log(i, x);
// => 0 8 1 5
const weights = [2, 3, 4];
for (let i = 0; i < Math.min(nums.length, weights.length); i++) {
  console.log(nums[i] * weights[i]);
}
// => 16 15
```

```javascript
const nums = [10, 9, 1];
// CAREFUL: sort() orders string representations unless you pass a comparator.
console.log(...nums.sort()); // => 1 10 9
console.log(...nums.sort((a, b) => a - b)); // => 1 9 10
console.log(...nums.sort((a, b) => b - a)); // => 10 9 1
console.log(...nums.reverse()); // => 1 9 10
console.log(...["four", "a", "to"].sort((a, b) => a.length - b.length)); // => a to four

// CAREFUL: fill(row) repeats one reference. Construct each row separately.
const shared = Array(2).fill([0, 0]);
shared[0][0] = 7;
const grid = Array.from({ length: 2 }, () => [0, 0]);
grid[0][0] = 7;
console.log(shared[1][0], grid[1][0]); // => 7 0
```

## Strings

```javascript
// Indexes and slice offsets count UTF-16 code units. for...of reads code points.
const s = "a🙂b";
console.log(s[0], s.length, s.slice(1, 3), [...s].length); // => a 4 🙂 3
// Strings are immutable. Build pieces and join once.
const pieces = [];
for (const ch of "abc") pieces.push(ch.toUpperCase());
console.log("prefix-" + pieces.join("")); // => prefix-ABC
console.log(Number("41") + 1, String(41) + "2"); // => 42 412
console.log("A".codePointAt(0), String.fromCodePoint(66)); // => 65 B
console.log("go  up".split(/\s+/).join("-"), "ant" < "bee"); // => go-up true
```

## Queues

```javascript
// The standard library has no deque. LeetCode also provides datastructures-js Deque.
// Use integer keys for both ends. shift() on a dense array can move every remaining element.
class Deque {
  items = new Map();
  first = 0;
  end = 0;

  get size() { return this.end - this.first; }
  front() { return this.items.get(this.first); }
  back() { return this.items.get(this.end - 1); }
  pushFront(x) { this.items.set(--this.first, x); }
  pushBack(x) { this.items.set(this.end++, x); }
  popFront() {
    if (!this.size) return undefined;
    const x = this.front();
    this.items.delete(this.first++);
    return x;
  }
  popBack() {
    if (!this.size) return undefined;
    const x = this.back();
    this.items.delete(--this.end);
    return x;
  }
}

const q = new Deque();
q.pushBack(2);
q.pushFront(1);
console.log(q.front(), q.back(), q.size); // => 1 2 2
console.log(q.popBack(), q.popFront(), q.popFront()); // => 2 1 undefined
```

## HashSets

```javascript
const seen = new Set([3, 1, 3]);
seen.add(2);
seen.delete(1);
console.log(seen.has(2), seen.size); // => true 2
// Set iteration follows insertion order.
for (const x of seen) console.log(x);
// => 3 2
```

## HashMaps

```javascript
// Map preserves key types. Plain object property names coerce numeric keys to strings.
const values = new Map();
values.set(1, "one");
values.set("1", "text");
values.set(1, "updated");
console.log(values.get(1), values.has("1"), values.size); // => updated true 2
values.delete("1");
console.log(values.get("1")); // => undefined

const counts = new Map();
for (const ch of "aba") counts.set(ch, (counts.get(ch) ?? 0) + 1);
for (const k of counts.keys()) console.log(k);
// => a b
for (const v of counts.values()) console.log(v);
// => 2 1
for (const [k, v] of counts) console.log(k, v);
// => a 2 b 1
```

## Tuples

```javascript
// JavaScript has no distinct tuple type. Return an array and destructure it.
function bounds(nums) {
  let lo = Infinity, hi = -Infinity;
  for (const x of nums) {
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
  }
  return [lo, hi];
}
const [lo, hi] = bounds([4, 1, 7]);
console.log(lo, hi); // => 1 7

// CAREFUL: equal-looking arrays are distinct keys. Encode integer coordinates for value lookup.
const seen = new Set([[2, 3]]);
console.log(seen.has([2, 3])); // => false
const key = (row, col) => [row, col].join(",");
const distance = new Map([[key(2, 3), 5]]);
console.log(distance.get(key(2, 3))); // => 5
```

## Heaps

```javascript
// The standard library has no heap. LeetCode also provides MinPriorityQueue and MaxPriorityQueue.
// before(a, b) is true when a belongs closer to the root.
class Heap {

  constructor(values, before) {
    this.data = [...values];
    this.before = before;
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) this.siftDown(i);
  }

  get size() { return this.data.length; }
  peek() { return this.data[0]; }
  siftDown(i) {
    const a = this.data;
    while (2 * i + 1 < a.length) {
      let child = 2 * i + 1;
      if (child + 1 < a.length && this.before(a[child + 1], a[child])) child++;
      if (!this.before(a[child], a[i])) break;
      [a[i], a[child]] = [a[child], a[i]];
      i = child;
    }
  }
  push(x) {
    const a = this.data;
    let i = a.push(x) - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.before(a[i], a[p])) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    if (!this.size) return undefined;
    const root = this.peek();
    const last = this.data.pop();
    if (this.size) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return root;
  }
}

const min = new Heap([5, 1, 3], (a, b) => a < b);
min.push(2);
console.log(min.peek(), min.pop(), min.pop(), min.size); // => 1 1 2 2
const max = new Heap([5, 1, 3], (a, b) => a > b);
console.log(max.pop()); // => 5
const jobs = new Heap([["plan", 1], ["ship", 3]], (a, b) => a[1] < b[1]);
console.log(jobs.pop()[0]); // => plan
```

## Functions

```javascript
function makeCounter(start) {
  let n = start;
  return (step = 1) => n += step;
}
const next = makeCounter(3);
console.log(next(), next(2)); // => 4 6

function edit(nums) {
  nums.push(2);
  nums = [9];
  return nums[0];
}
const nums = [1];
console.log(edit(nums), ...nums); // => 9 1 2
```

## Classes

```javascript
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distSq() { return this.x ** 2 + this.y ** 2; }
}
console.log(new Point(3, 4).distSq()); // => 25
```

```javascript
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
const head = new ListNode(1, new ListNode(2));
for (let node = head; node !== null; node = node.next) {
  console.log(node.val);
}
// => 1 2

function inorder(node) {
  if (node === null) return;
  inorder(node.left);
  console.log(node.val);
  inorder(node.right);
}
const root = new TreeNode(2, new TreeNode(1), new TreeNode(3));
inorder(root); // => 1 2 3
console.log(root.left.right === null); // => true
```
