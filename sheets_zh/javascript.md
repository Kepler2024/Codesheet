# JavaScript 速查表

> 适用于 Node.js 22

本快速参考用于学习或温习 JavaScript 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```javascript
// 脚本从上到下执行；无需 main() 入口函数
console.log("Hello, World!"); // => Hello, World!
```

```bash
node hello.js
```

## 变量

```javascript
// let 声明可重新赋值的变量
let n = 0;
n = 5;
console.log(n); // => 5

// const 声明不可重新赋值的常量；尽可能优先使用 const
const limit = 100;
// limit = 200;  // TypeError: Assignment to constant variable.

// 变量没有固定类型：同一个变量名后续可以存放其他类型的值
let x = 1;
x = "abc";
console.log(x); // => abc

// 注意：const 不会冻结对象内容；const 数组仍然可以修改元素
const arr = [1];
arr.push(2);
console.log(arr); // => [ 1, 2 ]

// 尽量避免使用旧式的 var：它会忽略块级作用域

// 使用解构赋值交换变量
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // => 2 1

// 自增运算
n++;
n += 2;
console.log(n); // => 8

// 两种表示“无值”的值：undefined（未赋值）与 null（显式置空）
let y;
console.log(y, null); // => undefined null

console.log(typeof 1, typeof "s", typeof true); // => number string boolean
// 注意：typeof null 返回 "object"，这是历史遗留 Bug
console.log(typeof null); // => object

// 空值合并运算符 ?? 仅替换 null 和 undefined；逻辑或 || 还会替换 0、"" 和 false
console.log(0 ?? 5, 0 || 5); // => 0 5
```

## 条件语句

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

// 逻辑运算符：&&（与）、||（或）、!（非）
const m = 5;
if (n > 0 && m > 0) {
  console.log("both"); // => both
}
console.log(!true, true || false); // => false true

// 注意：== 在比较前会隐式转换类型；应始终使用严格相等 === 和 !==
console.log(1 == "1", 1 === "1"); // => true false
console.log(0 == "", null == undefined); // => true true

// 三元条件运算符
const parity = n % 2 === 0 ? "even" : "odd";
console.log(parity); // => odd

// 假值（Falsy）：false、0、""、null、undefined 和 NaN。其他所有值均为真值（Truthy）。
// 注意：空数组和空对象均为真值（与 Python 不同）
if ([]) {
  console.log("truthy"); // => truthy
}

// 可选链 ?. 安全读取属性；若对象为 null 或 undefined 则返回 undefined
const node = null;
console.log(node?.val); // => undefined
```

## 循环

```javascript
let n = 0;
while (n < 3) {
  console.log(n);
  n++;
}
// => 0 1 2

// i 从 0 到 4
for (let i = 0; i < 5; i++) {
  console.log(i);
}
// => 0 1 2 3 4

// i 从 2 到 5
for (let i = 2; i <= 5; i++) {
  console.log(i);
}
// => 2 3 4 5

// i 从 5 递减到 2
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

// for...of 遍历数组、字符串、Set 或 Map 的元素值
for (const x of [7, 8]) {
  console.log(x);
}
// => 7 8

// 注意：for...in 遍历键名/属性名，且数组索引会以字符串形式返回
for (const i in ["a", "b"]) {
  console.log(typeof i);
}
// => string string

// 标签（Label）允许 break 或 continue 作用于外层循环
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

## 数学运算

```javascript
// 注意：所有数字均为 64 位双精度浮点数，因此 / 绝不会进行整数除法
console.log(5 / 2); // => 2.5

// 整数截断：Math.trunc 向零截断（类似 C 语言），Math.floor 向下取整（类似 Python）
console.log(Math.trunc(-3 / 2), Math.floor(-3 / 2)); // => -1 -2

// 注意：% 取模结果的符号与被除数相同（在 Python 中 -10 % 3 结果为 2）
console.log(-10 % 3); // => -1

// 始终非负的模运算，常用于循环数组索引
console.log(((-10 % 3) + 3) % 3); // => 2

console.log(Math.floor(1.5), Math.ceil(1.5)); // => 1 2
console.log(Math.sqrt(16), 2 ** 10, Math.abs(-7)); // => 4 1024 7
console.log(Math.max(3, 8, 1), Math.min(3, 8, 1)); // => 8 1

// 使用展开运算符将数组传入 max 或 min
console.log(Math.max(...[3, 8, 1])); // => 8
// 注意：无参数调用时，Math.max 返回 -Infinity
console.log(Math.max(...[])); // => -Infinity

// 注意：安全整数范围仅支持到 2^53 - 1
console.log(Number.MAX_SAFE_INTEGER); // => 9007199254740991
console.log(2 ** 53 === 2 ** 53 + 1); // => true

// 数值不会溢出回绕：超出精度后会丢失精度，直至变为 Infinity
console.log(Number.MAX_VALUE * 2, -Infinity); // => Infinity -Infinity

// 注意：位运算符会将操作数转换为 32 位有符号整数
console.log(2 ** 31 | 0); // => -2147483648

// BigInt（后缀 n）支持任意精度的整数；其除法会自动截断小数部分
console.log(2n ** 64n, 7n / 2n); // => 18446744073709551616n 3n
// 1n + 1  // TypeError: Cannot mix BigInt and other types

// 注意：简单的浮点数相加也可能出现精度舍入误差
console.log(0.1 + 0.2); // => 0.30000000000000004
```

## 输入与输出

```javascript
// console.log 以空格分隔多个参数，并在末尾换行
console.log("a", 1, true); // => a 1 true

// 模板字符串支持内嵌表达式
const name = "alice", score = 90;
console.log(`${name} scored ${score}`); // => alice scored 90

// 数组打印时带有方括号；可用 join 或展开运算符输出纯文本
const nums = [1, 2, 3];
console.log(nums); // => [ 1, 2, 3 ]
console.log(nums.join(" ")); // => 1 2 3
console.log(...nums); // => 1 2 3

// 不换行打印
process.stdout.write("same ");
process.stdout.write("line\n"); // => same line

// 保留固定小数位数；toFixed 返回字符串
console.log((3.14159).toFixed(2)); // => 3.14
```

```javascript
// 一次性读取标准输入（文件描述符 0）的所有内容，并按空白字符分割为标记。
// 无论数字是同行还是跨行排列均能正确解析。
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
// 也可以按行逐行读取；输入结束触发 "close" 事件
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

## 数组

```javascript
// 数组可根据需要动态扩容
const arr = [1, 2, 3];
console.log(arr, arr.length); // => [ 1, 2, 3 ] 3

// 将数组当作栈使用：在尾部 push 和 pop 操作的时间复杂度均为 O(1)
arr.push(4);
console.log(arr.pop()); // => 4

// 查看栈顶元素：at(-1) 支持从末尾反向索引
console.log(arr.at(-1)); // => 3

// 注意：arr[-1] 并不是最后一个元素；且越界访问时会返回 undefined 而非抛出错误
console.log(arr[-1], arr[10]); // => undefined undefined

// splice(index, deleteCount, ...items) 在指定位置插入或删除元素，时间复杂度 O(n)
arr.splice(1, 0, 7);
console.log(arr); // => [ 1, 7, 2, 3 ]
arr.splice(0, 1);
console.log(arr); // => [ 7, 2, 3 ]

// 创建长度为 n 且填充默认值的数组
console.log(new Array(5).fill(0)); // => [ 0, 0, 0, 0, 0 ]
// Array.from 根据索引计算每个元素生成数组
console.log(Array.from({ length: 4 }, (_, i) => i * i)); // => [ 0, 1, 4, 9 ]

// slice(start, end) 浅拷贝子数组，左闭右开；支持负数反向索引
const nums = [1, 2, 3, 4];
console.log(nums.slice(1, 3), nums.slice(-2)); // => [ 2, 3 ] [ 3, 4 ]

// 解构赋值
const [first, second, ...rest] = nums;
console.log(first, second, rest); // => 1 2 [ 3, 4 ]

// includes 和 indexOf 均为 O(n)；如需快速查找应使用 Set
console.log(nums.includes(3), nums.indexOf(3)); // => true 2

// map、filter 和 reduce 均返回新值
console.log(nums.map((x) => x * 2)); // => [ 2, 4, 6, 8 ]
console.log(nums.filter((x) => x % 2 === 0)); // => [ 2, 4 ]
console.log(nums.reduce((sum, x) => sum + x, 0)); // => 10
```

```javascript
const nums = [10, 20, 30];

// 通过索引遍历
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);
}
// => 10 20 30

// 直接遍历元素值
for (const n of nums) {
  console.log(n);
}
// => 10 20 30

// 同时获取索引和值
for (const [i, n] of nums.entries()) {
  console.log(i, n);
}
// => 0 10 1 20 2 30

// forEach 配合回调函数执行遍历。
// 注意：forEach 无法提前 break 退出；若需提前终止请使用 for 循环
nums.forEach((n, i) => console.log(i, n)); // => 0 10 1 20 2 30

// 双数组同步遍历：按较短数组的长度循环
const letters = ["a", "b", "c"];
for (let i = 0; i < Math.min(nums.length, letters.length); i++) {
  console.log(nums[i], letters[i]);
}
// => 10 a 20 b 30 c
```

```javascript
const nums = [5, 4, 7, 3, 8];

// reverse 原地翻转数组
nums.reverse();
console.log(nums); // => [ 8, 3, 7, 4, 5 ]

// 注意：不传比较函数时，sort() 默认按字典序（字符串方式）比较数字
console.log([10, 9, 1].sort()); // => [ 1, 10, 9 ]

// 比较函数：当 a 排在 b 前面时返回负数
nums.sort((a, b) => a - b);
console.log(nums); // => [ 3, 4, 5, 7, 8 ]
nums.sort((a, b) => b - a);
console.log(nums); // => [ 8, 7, 5, 4, 3 ]

// toSorted 返回排序后的新副本，不修改原数组
const words = ["bob", "alice", "jane", "doe"];
console.log(words.toSorted(), words[0]); // => [ 'alice', 'bob', 'doe', 'jane' ] bob

// 自定义多条件排序：先按长度升序，再按字母序（第一项相同为 0 时借助 || 比较第二项）
words.sort((a, b) => a.length - b.length || a.localeCompare(b));
console.log(words); // => [ 'bob', 'doe', 'jane', 'alice' ]

// 对二元组数组按第二项排序
const pairs = [[1, 3], [2, 1], [3, 2]];
pairs.sort((p, q) => p[1] - q[1]);
console.log(pairs); // => [ [ 2, 1 ], [ 3, 2 ], [ 1, 3 ] ]
```

```javascript
// 3 行 4 列的二维数组：必须独立构建每一行
const grid = Array.from({ length: 3 }, () => new Array(4).fill(0));
grid[0][0] = 1;
console.log(grid); // => [ [ 1, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ]
console.log(grid.length, grid[0].length); // => 3 4

// 注意：fill([...]) 会导致每个槽位共享同一个数组对象引用
const bad = new Array(3).fill([0, 0]);
bad[0][0] = 1;
console.log(bad); // => [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ]

// 注意：在回溯算法中，必须保存路径的浅拷贝副本，而不是路径引用本身
const path = [1, 2];
const res = [path, [...path]];
path[0] = 9;
console.log(res); // => [ [ 9, 2 ], [ 1, 2 ] ]
```

## 字符串

```javascript
const s = "abc";

// 按索引获取单个字符（长度为 1 的字符串）；slice 截取子串
console.log(s[0], s.at(-1), s.slice(1), s.slice(0, 2)); // => a c bc ab

// 注意：字符串具有不可变性，按索引赋值会被静默忽略
const t = "abc";
t[0] = "A";
console.log(t); // => abc

// 使用数组配合 join 拼接字符串（现代 JavaScript 引擎中循环 += 同样高效）
const parts = [];
for (const ch of "abc") {
  parts.push(ch.toUpperCase());
}
console.log(parts.join("")); // => ABC

// 字符串与数字互转
console.log(Number("123") + 1, String(123) + "4"); // => 124 1234
// parseInt 遇到首个非数字字符停止；Number 则要求整个字符串合法
console.log(parseInt("42px"), Number("42px")); // => 42 NaN

// 注意：+ 遇到字符串会执行字符串拼接，而 - 会将字符串转换为数字
console.log("1" + 2, "3" - 1); // => 12 2

// 字符与字符编码互转
console.log("a".charCodeAt(0), String.fromCharCode(98)); // => 97 b
// 计算字母在 26 长度字母表中的对应索引
console.log("c".charCodeAt(0) - "a".charCodeAt(0)); // => 2

// split(/\s+/) 按连续空白字符分割
console.log("the quick  brown fox".split(/\s+/)); // => [ 'the', 'quick', 'brown', 'fox' ]
// 注意：split(" ") 在连续空格之间会保留空字符串
console.log("a  b".split(" ")); // => [ 'a', '', 'b' ]
console.log(["a", "b"].join("-")); // => a-b

// 字符串使用 < 和 === 按字典序比较
console.log("apple" < "banana", "a" === "a"); // => true true

// JavaScript 字符串没有内置 reverse：先展开为数组翻转后再拼接
console.log([..."hello"].reverse().join("")); // => olleh

console.log("hello".includes("ell"), "hello".indexOf("l")); // => true 2
console.log("Hi".toLowerCase(), "ab".repeat(3), "  x ".trim()); // => hi ababab x
console.log(/^\d+$/.test("123"), /[a-z]/i.test("Q")); // => true true
```

## 双端队列

```javascript
// JavaScript 标准库未提供队列或双端队列。注意：arr.shift() 虽然可用，但时间复杂度为 O(n)。
// 在 BFS 中，更推荐使用自增头指针读取数组元素
const queue = [1, 2, 3];
let head = 0;
while (head < queue.length) {
  const node = queue[head++];
  console.log(node);
}
// => 1 2 3

// 也可以按层遍历，每次将下一层构建为全新数组。
//（此处节点 n 的子节点为 2n 和 2n+1，类似堆形态的二叉树）
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
// 当需要真正的双端队列时，用两个游标维护的简易类可在两端实现 O(1) 操作。
// LeetCode 环境中也预置了 @datastructures-js/deque。
class Deque {
  #items = new Map();
  #head = 0; // 队头索引
  #tail = 0; // 队尾之后一位的索引

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

## 哈希集合

```javascript
const seen = new Set();
seen.add(1);
seen.add(2);
seen.add(2); // 重复元素会被自动忽略
console.log(seen.size); // => 2

console.log(seen.has(1), seen.has(3)); // => true false

// delete 返回该元素原先是否存在
console.log(seen.delete(2), seen.delete(42)); // => true false
console.log(seen); // => Set(1) { 1 }

// 从数组构建 Set，并用展开运算符转回数组（高效去重）
console.log([...new Set([3, 1, 3, 2])]); // => [ 3, 1, 2 ]

// Set 按照元素的插入顺序进行迭代
for (const x of new Set(["b", "a"])) {
  console.log(x);
}
// => b a

// 并集、交集与差集（Node 22+ 内置支持）
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log(a.union(b), a.intersection(b), a.difference(b)); // => Set(4) { 1, 2, 3, 4 } Set(2) { 2, 3 } Set(1) { 1 }

// 注意：数组和对象均按引用地址比较（参见元组章节）
console.log(new Set([[0, 1]]).has([0, 1])); // => false
```

## 哈希映射

```javascript
// Map 是标准的哈希映射：支持任意类型的键，并保持键的插入顺序
const scores = new Map();
scores.set("alice", 88);
scores.set("bob", 77);
console.log(scores.size); // => 2

scores.set("alice", 80);
console.log(scores.get("alice")); // => 80

// 注意：获取不存在的键会返回 undefined；可用 ?? 提供默认值
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

// 频次统计：获取带默认值后自增写回
const count = new Map();
for (const ch of "banana") {
  count.set(ch, (count.get(ch) ?? 0) + 1);
}
console.log(count); // => Map(3) { 'b' => 1, 'a' => 3, 'n' => 2 }

// 分组聚合：首次使用时初始化数组
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
// 普通字面量对象也可用作映射，在 LeetCode 题解中极为常见
const count = {};
for (const ch of "aab") {
  count[ch] = (count[ch] ?? 0) + 1;
}
console.log(count, "a" in count); // => { a: 2, b: 1 } true

// Object.entries 返回 [键, 值] 键值对数组
for (const [key, val] of Object.entries(count)) {
  console.log(key, val);
}
// => a 2 b 1

// 注意：对象的所有属性名在底层都会被转为字符串，即使传入数字也一样
const obj = {};
obj[1] = "one";
console.log(Object.keys(obj)); // => [ '1' ]

// 注意：普通对象会继承原型链上的键（如 "constructor"）；Map 则完全没有这种隐患
console.log("constructor" in {}); // => true
```

## 元组

```javascript
// JavaScript 没有原生元组类型。可返回数组并使用解构赋值...
function minMax(nums) {
  return [Math.min(...nums), Math.max(...nums)];
}

const [lo, hi] = minMax([3, 1, 4]);
console.log(lo, hi); // => 1 4

// ...或返回对象并按属性名解构
function stats(nums) {
  return { count: nums.length, total: nums.reduce((a, b) => a + b, 0) };
}

const { count, total } = stats([3, 1, 4]);
console.log(count, total); // => 3 8

// 注意：两个内容相同的数组引用地址不同，因此无法直接作为 Set/Map 的同一个键
const visited = new Set();
visited.add([0, 1]);
console.log(visited.has([0, 1])); // => false

// 可以将各部分序列化为字符串后再作为键
visited.add([0, 1].join(","));
console.log(visited.has("0,1")); // => true

// 对于网格坐标，转换为单数值索引 (r * cols + c) 速度更快
const cols = 10;
const dist = new Map([[0 * cols + 1, 1]]);
console.log(dist.get(0 * cols + 1)); // => 1
```

## 堆与优先队列

```javascript
// JavaScript 标准库没有内置堆。LeetCode 环境中预置了 @datastructures-js/priority-queue
//（MinPriorityQueue、MaxPriorityQueue）；其他环境中可快速手写如下简易堆。
// compare 比较逻辑与 sort 相同：返回负数表示 a 优先级更高先出堆。
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
    // 上浮（Sift up）：当新元素优先级高于父节点时向上交换
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
      // 下沉（Sift down）：与子节点中优先级最高的节点向下交换
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

// 最小堆（默认比较器）
const minHeap = new Heap();
for (const x of [5, 1, 8, 3, 2]) {
  minHeap.push(x);
}
console.log(minHeap.peek(), minHeap.size); // => 1 5
while (minHeap.size > 0) {
  console.log(minHeap.pop());
}
// => 1 2 3 5 8

// 最大堆：反转比较顺序
const maxHeap = new Heap((a, b) => b - a);
[3, 1, 5].forEach((x) => maxHeap.push(x));
console.log(maxHeap.pop()); // => 5

// 自定义优先级：[priority, name] 元素按 priority 排序
const tasks = new Heap((a, b) => a[0] - b[0]);
tasks.push([2, "write"]);
tasks.push([1, "plan"]);
tasks.push([3, "ship"]);
while (tasks.size > 0) {
  const [priority, name] = tasks.pop();
  console.log(priority, name);
}
// => 1 plan 2 write 3 ship

// 空堆调用 pop 返回 undefined
console.log(tasks.pop()); // => undefined
```

## 函数

```javascript
function multiply(n, m) {
  return n * m;
}

console.log(multiply(3, 4)); // => 12

// 参数默认值
function greet(name, greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greet("Ann"), greet("Ann", "Hi")); // => Hello, Ann! Hi, Ann!

// 注意：传参缺少时对应形参为 undefined，多传的参数会被静默忽略，不会报错
console.log(multiply(3)); // => NaN

// 剩余参数（Rest parameters）将多余实参收集为数组
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3), sum(...[4, 5])); // => 6 9

// 箭头函数是常用的 Lambda 表达式；带块级主体 {} 时必须显式 return
const square = (x) => x * x;
const add = (a, b) => {
  return a + b;
};
console.log(square(5), add(2, 3)); // => 25 5
```

```javascript
// 嵌套函数可直接读写外层封闭函数的局部变量
function countUp(nums) {
  let total = 0;

  function add(n) {
    total += n;
  }

  nums.forEach(add);
  return total;
}

console.log(countUp([1, 2, 3])); // => 6

// 闭包在外层函数执行完毕返回后仍能保留其词法作用域变量
function makeCounter() {
  let n = 0;
  return () => ++n;
}

const next = makeCounter();
next();
console.log(next()); // => 2

// 注意：调用栈深度有限；过深的递归会抛出栈溢出异常
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
// 对象参数按引用传递。
// 在函数内部直接修改数组会影响调用方的原始数组...
function appendOne(arr) {
  arr.push(1);
}

const nums = [];
appendOne(nums);
console.log(nums); // => [ 1 ]

// ...但对参数变量重新赋一个新数组则不会影响调用方
function replace(arr) {
  arr = [99];
}

replace(nums);
console.log(nums); // => [ 1 ]

// 数字与字符串不可变，因此函数无法改变调用方的原始基本类型变量
```

## 类与数据结构

```javascript
class Point {
  // 构造函数
  constructor(x, y) {
    // 字段通过挂载到 this 上创建
    this.x = x;
    this.y = y;
  }

  distSq() {
    return this.x ** 2 + this.y ** 2;
  }

  // 可选：自定义转字符串行为（供 `${p}` 和 String(p) 使用）
  toString() {
    return `Point(${this.x}, ${this.y})`;
  }
}

const p = new Point(3, 4);
console.log(p.distSq()); // => 25
console.log(`${p}`); // => Point(3, 4)
console.log(p); // => Point { x: 3, y: 4 }

// JavaScript 不支持运算符重载；对象排序使用比较器函数
const pts = [new Point(2, 2), new Point(1, 0)];
pts.sort((a, b) => a.distSq() - b.distSq());
console.log(pts.map(String)); // => [ 'Point(1, 0)', 'Point(2, 2)' ]

// 注意：方法直接作为回调传递时会丢失 this 上下文；应用箭头函数包裹
const f = p.distSq;
// f();  // TypeError: Cannot read properties of undefined (reading 'x')
console.log([p].map((q) => q.distSq())); // => [ 25 ]
```

```javascript
// LeetCode 中 JavaScript 的单链表节点（经典构造函数形式）
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

// 1 -> 2 -> 3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

// 遍历链表直到末尾（null）
for (let node = head; node !== null; node = node.next) {
  console.log(node.val);
}
// => 1 2 3
```

```javascript
// LeetCode 中 JavaScript 的二叉树节点
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

//     2
//    / \
//   1   3
const root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

// 中序遍历；空子节点表示为 null
function inorder(node) {
  if (node === null) {
    return;
  }
  inorder(node.left);
  console.log(node.val);
  inorder(node.right);
}

inorder(root); // => 1 2 3

// 在 LeetCode 上，题目通常要求补全赋值给 var 的函数
var maxDepth = function (root) {
  if (root === null) {
    return 0;
  }
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};

console.log(maxDepth(root)); // => 2
```
