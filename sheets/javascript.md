# JavaScript Cheat Sheet

> Written for Node.js 22

Use this quick reference to learn or revisit JavaScript syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```javascript
// A script runs top to bottom; no main() is needed
console.log("Hello, World!"); // => Hello, World!
```

```bash
node hello.js
```

## Variables

```javascript
// let declares a variable you can reassign
let n = 0;
n = 5;
console.log(n); // => 5

// const declares one you can't reassign; prefer it whenever you can
const limit = 100;
// limit = 200;  // TypeError: Assignment to constant variable.

// Variables have no type: the same name can later hold another kind of value
let x = 1;
x = "abc";
console.log(x); // => abc

// CAREFUL: const doesn't freeze an object; a const array can still change
const arr = [1];
arr.push(2);
console.log(arr); // => [ 1, 2 ]

// Avoid the older var: it ignores block scope

// Swap with destructuring
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // => 2 1

// Increment
n++;
n += 2;
console.log(n); // => 8

// Two "no value" values: undefined (never set) and null (set on purpose)
let y;
console.log(y, null); // => undefined null

console.log(typeof 1, typeof "s", typeof true); // => number string boolean
// CAREFUL: typeof null is "object", a historical bug
console.log(typeof null); // => object

// ?? replaces only null and undefined; || also replaces 0, "" and false
console.log(0 ?? 5, 0 || 5); // => 0 5
```

## If-statements

```javascript
let n = 1;
if (n > 2) {
  n--;
} else if (n === 2) {
  n *= 2;
} else {
  n += 2;
}
console.log(n); // => 3

// Logical operators: && (and), || (or), ! (not)
const m = 5;
if (n > 0 && m > 0) {
  console.log("both"); // => both
}
console.log(!true, true || false); // => false true

// CAREFUL: == converts types before comparing; always use === and !==
console.log(1 == "1", 1 === "1"); // => true false
console.log(0 == "", null == undefined); // => true true

// Ternary operator
const parity = n % 2 === 0 ? "even" : "odd";
console.log(parity); // => odd

// Falsy values: false, 0, "", null, undefined and NaN. Everything else is truthy.
// CAREFUL: empty arrays and objects are truthy (unlike Python)
if ([]) {
  console.log("truthy"); // => truthy
}

// ?. reads a property, or gives undefined if the object is null or undefined
const node = null;
console.log(node?.val); // => undefined
```

## Loops

```javascript
let n = 0;
while (n < 3) {
  console.log(n);
  n++;
}
// => 0 1 2

// i = 0 to 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// => 0 1 2 3 4

// i = 2 to 5
for (let i = 2; i <= 5; i++) {
  console.log(i);
}
// => 2 3 4 5

// i = 5 down to 2
for (let i = 5; i >= 2; i--) {
  console.log(i);
}
// => 5 4 3 2

for (let i = 0; i < 10; i++) {
  if (i === 1) {
    continue;
  }
  if (i === 4) {
    break;
  }
  console.log(i);
}
// => 0 2 3

// for...of loops over the values of an array, string, Set or Map
for (const x of [7, 8]) {
  console.log(x);
}
// => 7 8

// CAREFUL: for...in loops over keys, and gives array indexes as strings
for (const i in ["a", "b"]) {
  console.log(typeof i);
}
// => string string

// A label lets break or continue act on an outer loop
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j > i) {
      continue outer;
    }
    if (i === 2) {
      break outer;
    }
    console.log(i, j);
  }
}
// => 0 0 1 0 1 1
```

## Math

```javascript
// CAREFUL: every number is a 64-bit float, so / never does integer division
console.log(5 / 2); // => 2.5

// Integer division: Math.trunc rounds toward 0 (like C), Math.floor down (like Python)
console.log(Math.trunc(-3 / 2), Math.floor(-3 / 2)); // => -1 -2

// CAREFUL: % takes the sign of the dividend (Python gives 2)
console.log(-10 % 3); // => -1

// A modulo that is never negative, e.g. for wrapping an index around
console.log(((-10 % 3) + 3) % 3); // => 2

console.log(Math.floor(1.5), Math.ceil(1.5)); // => 1 2
console.log(Math.sqrt(16), 2 ** 10, Math.abs(-7)); // => 4 1024 7
console.log(Math.max(3, 8, 1), Math.min(3, 8, 1)); // => 8 1

// Spread an array into max or min
console.log(Math.max(...[3, 8, 1])); // => 8
// CAREFUL: with no arguments, Math.max gives -Infinity
console.log(Math.max(...[])); // => -Infinity

// CAREFUL: integers are exact only up to 2^53 - 1
console.log(Number.MAX_SAFE_INTEGER); // => 9007199254740991
console.log(2 ** 53 === 2 ** 53 + 1); // => true

// Numbers don't wrap around: they lose precision, then become Infinity
console.log(Number.MAX_VALUE * 2, -Infinity); // => Infinity -Infinity

// CAREFUL: bitwise operators work on 32-bit signed integers
console.log(2 ** 31 | 0); // => -2147483648

// BigInt (n suffix) is exact at any size; its division truncates
console.log(2n ** 64n, 7n / 2n); // => 18446744073709551616n 3n
// 1n + 1  // TypeError: Cannot mix BigInt and other types

// CAREFUL: float rounding shows up in simple sums
console.log(0.1 + 0.2); // => 0.30000000000000004
```

## Output and Input

```javascript
// console.log separates arguments with spaces and ends with a newline
console.log("a", 1, true); // => a 1 true

// Template literals embed expressions
const name = "alice", score = 90;
console.log(`${name} scored ${score}`); // => alice scored 90

// Arrays print with brackets; join or spread them for plain output
const nums = [1, 2, 3];
console.log(nums); // => [ 1, 2, 3 ]
console.log(nums.join(" ")); // => 1 2 3
console.log(...nums); // => 1 2 3

// Print without a newline
process.stdout.write("same ");
process.stdout.write("line\n"); // => same line

// A fixed number of decimals; toFixed returns a string
console.log((3.14159).toFixed(2)); // => 3.14
```

```javascript
// Read all of stdin (file descriptor 0) at once, then split it into tokens.
// This works no matter how the numbers are spread over lines.
const data = require("fs").readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(data[0]);
const nums = data.slice(1, n + 1).map(Number);
console.log(n, nums); // => 3 [ 1, 2, 3 ]
```

```text stdin
3
1 2
3
```

```javascript
// Or read line by line; the input is complete when "close" fires
const rl = require("readline").createInterface({ input: process.stdin });
const lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
  console.log(lines.length, lines[1].toUpperCase()); // => 2 SECOND LINE
});
```

```text stdin
first line
second line
```

## Arrays

```javascript
// Arrays grow as needed
const arr = [1, 2, 3];
console.log(arr, arr.length); // => [ 1, 2, 3 ] 3

// Use an array as a stack: push and pop at the end are O(1)
arr.push(4);
console.log(arr.pop()); // => 4

// Peek at the top: at(-1) counts from the end
console.log(arr.at(-1)); // => 3

// CAREFUL: arr[-1] isn't the last element, and reading past the end
// gives undefined instead of an error
console.log(arr[-1], arr[10]); // => undefined undefined

// splice(index, deleteCount, ...items) inserts or removes in the middle, O(n)
arr.splice(1, 0, 7);
console.log(arr); // => [ 1, 7, 2, 3 ]
arr.splice(0, 1);
console.log(arr); // => [ 7, 2, 3 ]

// An array of size n filled with a default value
console.log(new Array(5).fill(0)); // => [ 0, 0, 0, 0, 0 ]
// Array.from builds one from a function of the index
console.log(Array.from({ length: 4 }, (_, i) => i * i)); // => [ 0, 1, 4, 9 ]

// slice(start, end) copies a part, end exclusive; negative numbers count from the end
const nums = [1, 2, 3, 4];
console.log(nums.slice(1, 3), nums.slice(-2)); // => [ 2, 3 ] [ 3, 4 ]

// Destructuring
const [first, second, ...rest] = nums;
console.log(first, second, rest); // => 1 2 [ 3, 4 ]

// includes and indexOf are O(n); use a Set for fast lookups
console.log(nums.includes(3), nums.indexOf(3)); // => true 2

// map, filter and reduce return new values
console.log(nums.map((x) => x * 2)); // => [ 2, 4, 6, 8 ]
console.log(nums.filter((x) => x % 2 === 0)); // => [ 2, 4 ]
console.log(nums.reduce((sum, x) => sum + x, 0)); // => 10
```

```javascript
const nums = [10, 20, 30];

// By index
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
// => 10 20 30

// By value
for (const n of nums) {
  console.log(n);
}
// => 10 20 30

// Index and value together
for (const [i, n] of nums.entries()) {
  console.log(i, n);
}
// => 0 10 1 20 2 30

// forEach does the same with a callback.
// CAREFUL: you can't break out of forEach; use a for loop when you need to stop early
nums.forEach((n, i) => console.log(i, n)); // => 0 10 1 20 2 30

// Two arrays in lockstep: loop to the shorter length
const letters = ["a", "b", "c"];
for (let i = 0; i < Math.min(nums.length, letters.length); i++) {
  console.log(nums[i], letters[i]);
}
// => 10 a 20 b 30 c
```

```javascript
const nums = [5, 4, 7, 3, 8];

// reverse works in place
nums.reverse();
console.log(nums); // => [ 8, 3, 7, 4, 5 ]

// CAREFUL: sort() without a comparator compares numbers as STRINGS
console.log([10, 9, 1].sort()); // => [ 1, 10, 9 ]

// A comparator returns a negative number when a goes before b
nums.sort((a, b) => a - b);
console.log(nums); // => [ 3, 4, 5, 7, 8 ]
nums.sort((a, b) => b - a);
console.log(nums); // => [ 8, 7, 5, 4, 3 ]

// toSorted returns a sorted copy and leaves the original alone
const words = ["bob", "alice", "jane", "doe"];
console.log(words.toSorted(), words[0]); // => [ 'alice', 'bob', 'doe', 'jane' ] bob

// Custom order: by length, then alphabetically (|| moves on when the first result is 0)
words.sort((a, b) => a.length - b.length || a.localeCompare(b));
console.log(words); // => [ 'bob', 'doe', 'jane', 'alice' ]

// Sort pairs by their second element
const pairs = [[1, 3], [2, 1], [3, 2]];
pairs.sort((p, q) => p[1] - q[1]);
console.log(pairs); // => [ [ 2, 1 ], [ 3, 2 ], [ 1, 3 ] ]
```

```javascript
// 2-D array with 3 rows and 4 columns: build each row separately
const grid = Array.from({ length: 3 }, () => new Array(4).fill(0));
grid[0][0] = 1;
console.log(grid); // => [ [ 1, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ]
console.log(grid.length, grid[0].length); // => 3 4

// CAREFUL: fill([...]) puts the SAME row object in every slot
const bad = new Array(3).fill([0, 0]);
bad[0][0] = 1;
console.log(bad); // => [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ]

// CAREFUL: in backtracking, save a copy of the path, not the path itself
const path = [1, 2];
const res = [path, [...path]];
path[0] = 9;
console.log(res); // => [ [ 9, 2 ], [ 1, 2 ] ]
```

## Strings

```javascript
const s = "abc";

// Index for a character (a string of length 1); slice for a substring
console.log(s[0], s.at(-1), s.slice(1), s.slice(0, 2)); // => a c bc ab

// CAREFUL: strings are immutable, and assigning to an index silently does nothing
const t = "abc";
t[0] = "A";
console.log(t); // => abc

// Build a string from parts with join (+= in a loop is also fast in modern engines)
const parts = [];
for (const ch of "abc") {
  parts.push(ch.toUpperCase());
}
console.log(parts.join("")); // => ABC

// String <-> number
console.log(Number("123") + 1, String(123) + "4"); // => 124 1234
// parseInt stops at the first non-digit; Number rejects the whole string
console.log(parseInt("42px"), Number("42px")); // => 42 NaN

// CAREFUL: + with a string concatenates, while - converts to numbers
console.log("1" + 2, "3" - 1); // => 12 2

// Char <-> code
console.log("a".charCodeAt(0), String.fromCharCode(98)); // => 97 b
// A letter's index into a 26-element array
console.log("c".charCodeAt(0) - "a".charCodeAt(0)); // => 2

// split(/\s+/) splits on any run of whitespace
console.log("the quick  brown fox".split(/\s+/)); // => [ 'the', 'quick', 'brown', 'fox' ]
// CAREFUL: split(" ") keeps an empty string between two spaces
console.log("a  b".split(" ")); // => [ 'a', '', 'b' ]
console.log(["a", "b"].join("-")); // => a-b

// Comparison with < and === is lexicographic
console.log("apple" < "banana", "a" === "a"); // => true true

// There's no reverse for strings: spread into an array first
console.log([..."hello"].reverse().join("")); // => olleh

console.log("hello".includes("ell"), "hello".indexOf("l")); // => true 2
console.log("Hi".toLowerCase(), "ab".repeat(3), "  x ".trim()); // => hi ababab x
console.log(/^\d+$/.test("123"), /[a-z]/i.test("Q")); // => true true
```

## Queues

```javascript
// JavaScript has no queue or deque. CAREFUL: arr.shift() works but is O(n).
// For BFS, read from a moving head index instead
const queue = [1, 2, 3];
let head = 0;
while (head < queue.length) {
  const node = queue[head++];
  console.log(node);
}
// => 1 2 3

// Or go level by level, building the next level as a new array.
// (Here node n has children 2n and 2n+1, like a heap-shaped tree.)
let level = [1];
for (let depth = 0; level.length > 0; depth++) {
  const next = [];
  for (const node of level) {
    if (node < 4) {
      next.push(node * 2, node * 2 + 1);
    }
  }
  console.log(depth, level.join(","));
  level = next;
}
// => 0 1 1 2,3 2 4,5,6,7
```

```javascript
// When you need a real deque, a small class with two moving indexes is O(1) at both ends.
// LeetCode also preloads @datastructures-js/deque.
class Deque {
  #items = new Map();
  #head = 0; // index of the front item
  #tail = 0; // index just past the back item

  get size() { return this.#tail - this.#head; }
  front() { return this.#items.get(this.#head); }
  back() { return this.#items.get(this.#tail - 1); }
  pushFront(x) { this.#items.set(--this.#head, x); }
  pushBack(x) { this.#items.set(this.#tail++, x); }

  popFront() {
    if (this.size === 0) return undefined;
    const x = this.front();
    this.#items.delete(this.#head++);
    return x;
  }

  popBack() {
    if (this.size === 0) return undefined;
    const x = this.back();
    this.#items.delete(--this.#tail);
    return x;
  }
}

const dq = new Deque();
dq.pushBack(1);
dq.pushBack(2);
dq.pushFront(0);
console.log(dq.front(), dq.back(), dq.size); // => 0 2 3
console.log(dq.popFront(), dq.popBack(), dq.size); // => 0 2 1
```

## HashSets

```javascript
const seen = new Set();
seen.add(1);
seen.add(2);
seen.add(2); // duplicates are ignored
console.log(seen.size); // => 2

console.log(seen.has(1), seen.has(3)); // => true false

// delete returns whether the item was there
console.log(seen.delete(2), seen.delete(42)); // => true false
console.log(seen); // => Set(1) { 1 }

// Build from an array, and spread back into an array (this removes duplicates)
console.log([...new Set([3, 1, 3, 2])]); // => [ 3, 1, 2 ]

// Sets iterate in insertion order
for (const x of new Set(["b", "a"])) {
  console.log(x);
}
// => b a

// Union, intersection and difference (Node 22+)
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log(a.union(b), a.intersection(b), a.difference(b)); // => Set(4) { 1, 2, 3, 4 } Set(2) { 2, 3 } Set(1) { 1 }

// CAREFUL: arrays and objects are compared by reference (see Tuples)
console.log(new Set([[0, 1]]).has([0, 1])); // => false
```

## HashMaps

```javascript
// Map is the hash map: keys of any type, kept in insertion order
const scores = new Map();
scores.set("alice", 88);
scores.set("bob", 77);
console.log(scores.size); // => 2

scores.set("alice", 80);
console.log(scores.get("alice")); // => 80

// CAREFUL: get returns undefined for a missing key; ?? supplies a default
console.log(scores.get("zoe"), scores.get("zoe") ?? 0); // => undefined 0

console.log(scores.has("alice")); // => true
scores.delete("alice");
console.log(scores); // => Map(1) { 'bob' => 77 }
```

```javascript
const scores = new Map([["alice", 90], ["bob", 70]]);

for (const key of scores.keys()) {
  console.log(key);
}
// => alice bob

for (const val of scores.values()) {
  console.log(val);
}
// => 90 70

for (const [key, val] of scores) {
  console.log(key, val);
}
// => alice 90 bob 70

// Counting: get with a default, then set
const count = new Map();
for (const ch of "banana") {
  count.set(ch, (count.get(ch) ?? 0) + 1);
}
console.log(count); // => Map(3) { 'b' => 1, 'a' => 3, 'n' => 2 }

// Grouping: create the list on first use
const groups = new Map();
for (const word of ["eat", "tea", "tan"]) {
  const key = [...word].sort().join("");
  if (!groups.has(key)) {
    groups.set(key, []);
  }
  groups.get(key).push(word);
}
console.log([...groups.values()]); // => [ [ 'eat', 'tea' ], [ 'tan' ] ]
```

```javascript
// A plain object also works as a map, and you'll see it often in LeetCode answers
const count = {};
for (const ch of "aab") {
  count[ch] = (count[ch] ?? 0) + 1;
}
console.log(count, "a" in count); // => { a: 2, b: 1 } true

// Object.entries gives [key, value] pairs
for (const [key, val] of Object.entries(count)) {
  console.log(key, val);
}
// => a 2 b 1

// CAREFUL: object keys are always strings, even when you use numbers
const obj = {};
obj[1] = "one";
console.log(Object.keys(obj)); // => [ '1' ]

// CAREFUL: objects inherit keys such as "constructor"; a Map has no such surprises
console.log("constructor" in {}); // => true
```

## Tuples

```javascript
// JavaScript has no tuples. Return an array and destructure it...
function minMax(nums) {
  return [Math.min(...nums), Math.max(...nums)];
}

const [lo, hi] = minMax([3, 1, 4]);
console.log(lo, hi); // => 1 4

// ...or return an object and destructure it by name
function stats(nums) {
  return { count: nums.length, total: nums.reduce((a, b) => a + b, 0) };
}

const { count, total } = stats([3, 1, 4]);
console.log(count, total); // => 3 8

// CAREFUL: two equal arrays are different keys, because keys compare by reference
const visited = new Set();
visited.add([0, 1]);
console.log(visited.has([0, 1])); // => false

// Encode the parts into a string key instead
visited.add([0, 1].join(","));
console.log(visited.has("0,1")); // => true

// For grid cells, a number key (r * cols + c) is faster
const cols = 10;
const dist = new Map([[0 * cols + 1, 1]]);
console.log(dist.get(0 * cols + 1)); // => 1
```

## Heaps

```javascript
// JavaScript has no heap. LeetCode preloads @datastructures-js/priority-queue
// (MinPriorityQueue, MaxPriorityQueue); elsewhere, write a small one like this.
// compare works like a sort comparator: negative means a comes out first.
class Heap {
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare;
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(x) {
    const a = this.data;
    a.push(x);
    // Sift up: swap with the parent while the new item should come out first
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(a[i], a[parent]) >= 0) break;
      [a[i], a[parent]] = [a[parent], a[i]];
      i = parent;
    }
  }

  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      // Sift down: swap with the child that should come out first
      let i = 0;
      while (true) {
        const left = 2 * i + 1, right = left + 1;
        let best = i;
        if (left < a.length && this.compare(a[left], a[best]) < 0) best = left;
        if (right < a.length && this.compare(a[right], a[best]) < 0) best = right;
        if (best === i) break;
        [a[i], a[best]] = [a[best], a[i]];
        i = best;
      }
    }
    return top;
  }
}

// Min-heap (the default comparator)
const minHeap = new Heap();
for (const x of [5, 1, 8, 3, 2]) {
  minHeap.push(x);
}
console.log(minHeap.peek(), minHeap.size); // => 1 5
while (minHeap.size > 0) {
  console.log(minHeap.pop());
}
// => 1 2 3 5 8

// Max-heap: reverse the comparator
const maxHeap = new Heap((a, b) => b - a);
[3, 1, 5].forEach((x) => maxHeap.push(x));
console.log(maxHeap.pop()); // => 5

// Custom priority: [priority, name] pairs ordered by priority
const tasks = new Heap((a, b) => a[0] - b[0]);
tasks.push([2, "write"]);
tasks.push([1, "plan"]);
tasks.push([3, "ship"]);
while (tasks.size > 0) {
  const [priority, name] = tasks.pop();
  console.log(priority, name);
}
// => 1 plan 2 write 3 ship

// pop on an empty heap returns undefined
console.log(tasks.pop()); // => undefined
```

## Functions

```javascript
function multiply(n, m) {
  return n * m;
}

console.log(multiply(3, 4)); // => 12

// Default parameter values
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet("Ann"), greet("Ann", "Hi")); // => Hello, Ann! Hi, Ann!

// CAREFUL: a missing argument is undefined, and extra ones are ignored, with no error
console.log(multiply(3)); // => NaN

// Rest parameters collect extra arguments into an array
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3), sum(...[4, 5])); // => 6 9

// Arrow functions are the usual lambdas; with a block body, return is required
const square = (x) => x * x;
const add = (a, b) => {
  return a + b;
};
console.log(square(5), add(2, 3)); // => 25 5
```

```javascript
// Nested functions can read and change the enclosing function's variables
function countUp(nums) {
  let total = 0;

  function add(n) {
    total += n;
  }

  nums.forEach(add);
  return total;
}

console.log(countUp([1, 2, 3])); // => 6

// A closure keeps its variables alive after the outer function returns
function makeCounter() {
  let n = 0;
  return () => ++n;
}

const next = makeCounter();
next();
console.log(next()); // => 2

// CAREFUL: the call stack is limited; very deep recursion throws
function depth(n) {
  return n === 0 ? 0 : 1 + depth(n - 1);
}

try {
  depth(1e6);
} catch (e) {
  console.log(e.name); // => RangeError
}
```

```javascript
// Arguments are references to the same objects.
// Mutating an array inside a function changes the caller's array...
function appendOne(arr) {
  arr.push(1);
}

const nums = [];
appendOne(nums);
console.log(nums); // => [ 1 ]

// ...but assigning a new array to the parameter does not
function replace(arr) {
  arr = [99];
}

replace(nums);
console.log(nums); // => [ 1 ]

// Numbers and strings can't be mutated, so a function can't change the caller's
```

## Classes

```javascript
class Point {
  // Constructor
  constructor(x, y) {
    // Fields are created by assigning to this
    this.x = x;
    this.y = y;
  }

  distSq() {
    return this.x ** 2 + this.y ** 2;
  }

  // Optional: how it turns into a string (used by `${p}` and String(p))
  toString() {
    return `Point(${this.x}, ${this.y})`;
  }
}

const p = new Point(3, 4);
console.log(p.distSq()); // => 25
console.log(`${p}`); // => Point(3, 4)
console.log(p); // => Point { x: 3, y: 4 }

// There's no operator overloading; sort objects with a comparator
const pts = [new Point(2, 2), new Point(1, 0)];
pts.sort((a, b) => a.distSq() - b.distSq());
console.log(pts.map(String)); // => [ 'Point(1, 0)', 'Point(2, 2)' ]

// CAREFUL: a method passed as a callback loses `this`; wrap it in an arrow function
const f = p.distSq;
// f();  // TypeError: Cannot read properties of undefined (reading 'x')
console.log([p].map((q) => q.distSq())); // => [ 25 ]
```

```javascript
// LeetCode's linked list node for JavaScript (an old-style constructor function)
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

// 1 -> 2 -> 3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

// Walk the list until the end (null)
for (let node = head; node !== null; node = node.next) {
  console.log(node.val);
}
// => 1 2 3
```

```javascript
// LeetCode's binary tree node for JavaScript
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

//     2
//    / \
//   1   3
const root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

// In-order traversal; a missing child is null
function inorder(node) {
  if (node === null) {
    return;
  }
  inorder(node.left);
  console.log(node.val);
  inorder(node.right);
}

inorder(root); // => 1 2 3

// On LeetCode you complete a function assigned to a var
var maxDepth = function (root) {
  if (root === null) {
    return 0;
  }
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

console.log(maxDepth(root)); // => 2
```
