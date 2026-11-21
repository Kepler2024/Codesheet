# TypeScript 速查表

> 适用于运行在 Node.js 22 上的 TypeScript 5.7

本快速参考用于学习或温习 TypeScript 语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```typescript
// TypeScript 编译为 JavaScript，脚本从上到下执行；无需 main() 入口函数
console.log("Hello, World!"); // => Hello, World!
```

```bash
tsc --strict --target ES2022 hello.ts   # 类型检查并生成 hello.js
node hello.js
```

## 变量

```typescript
// let 声明可重新赋值的变量；类型会根据初始值自动推导
let n = 0;
n = 5;
console.log(n); // => 5

// 注意：与 JavaScript 不同，推导出的变量类型是固定的
// n = "abc";  // error TS2322: Type 'string' is not assignable to type 'number'.

// const 声明不可重新赋值的常量；尽可能优先使用 const
const limit = 100;
// limit = 200;  // error TS2588: Cannot assign to 'limit' because it is a constant.

// 注意：const 不会冻结对象内容；const 数组仍然可以修改元素
const arr = [1];
arr.push(2);
console.log(arr); // => [ 1, 2 ]

// 常见的显式类型注解：number（所有数值）、string、boolean、bigint
const ratio: number = 0.5;
const label: string = "a";
const done: boolean = false;
console.log(ratio, label, done); // => 0.5 a false

// 使用解构赋值交换变量
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // => 2 1

// 自增运算
n++;
n += 2;
console.log(n); // => 8

// null 表示“显式置空”，undefined 表示“未赋值”。在 --strict 模式下，
// 只有在类型定义中明确包含 null 时变量才能赋值为 null
let parent: number | null = null;
console.log(parent); // => null
parent = 3;

// 空值合并运算符 ?? 仅替换 null 和 undefined；逻辑或 || 还会替换 0、"" 和 false
const zero: number = 0;
console.log(zero ?? 5, zero || 5); // => 0 5
```

## 类型系统

```typescript
// 掌握看懂 LeetCode 函数签名所需的类型语法即可。在标识符后用冒号注解类型。
function twoSum(nums: number[], target: number): number[] {
  return [0, 1];
}
console.log(twoSum([2, 7], 9)); // => [ 0, 1 ]

// 数组类型：number[]（等价于 Array<number>），二维数组：number[][]
const grid: number[][] = [[1, 2], [3, 4]];

// 元组（Tuple）固定每个位置的元素类型
const pair: [number, string] = [1, "one"];
console.log(grid[1][0], pair[1]); // => 3 one

// 联合类型（Union type）允许取多种类型之一；T | null 是 LeetCode 表示“可能缺失”的标准方式
let best: string | null = null;

// 对象形状定义：类型别名（type alias）或接口（interface）（两者几乎可互换）
type Point = { x: number; y: number };
interface Edge {
  to: number;
  cost?: number; // ? 表示可选属性
}
const p: Point = { x: 1, y: 2 };
const e: Edge = { to: 3 };
console.log(p.x, e.to, e.cost); // => 1 3 undefined

// 泛型类型通过尖括号 <> 传递类型参数
const counts: Map<string, number> = new Map();
const byName: Record<string, number> = { a: 1 };

// 函数类型签名，例如用于排序比较器
const byAsc: (a: number, b: number) => number = (a, b) => a - b;
console.log([3, 1, 2].sort(byAsc)); // => [ 1, 2, 3 ]

// 类型收窄（Narrowing）：条件检查后，TypeScript 会自动推断为更精确的子类型
function size(x: string | number[] | null): number {
  if (x === null) {
    return 0;
  }
  return x.length;
}
console.log(size("abc"), size(null)); // => 3 0

// 非空断言 ! 强行断言值非 null 且非 undefined（运行时不执行检查）
best = "x";
console.log(best!.length); // => 1

// 注意：类型在编译后会被完全擦除，`as` 断言不会在运行时转换底层值
const value = JSON.parse('"5"') as number;
console.log(typeof value); // => string

// any 会关闭类型检查；unknown 则强制在安全使用前必须先检查类型
const raw: unknown = 42;
if (typeof raw === "number") {
  console.log(raw + 1); // => 43
}
console.log(counts.size, byName.a); // => 0 1
```

## 条件语句

```typescript
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

// 注意：== 在比较前会隐式转换类型；应始终使用严格相等 === 和 !==。
// TypeScript 会阻止大部分跨类型比较，但值为 any 时除外
const input: any = "1";
console.log(input == 1, input === 1); // => true false

// 三元条件运算符
const parity = n % 2 === 0 ? "even" : "odd";
console.log(parity); // => odd

// 假值（Falsy）：false、0、""、null、undefined 和 NaN。
// 注意：空数组和空对象均为真值（与 Python 不同）
const empty: number[] = [];
if (empty) {
  console.log("truthy"); // => truthy
}

// 可选链 ?. 安全读取属性；若对象为 null 或 undefined 则返回 undefined
const nodes = new Map<string, { val: number }>();
console.log(nodes.get("x")?.val); // => undefined
```

## 循环

```typescript
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

```typescript
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
const nums = [3, 8, 1];
console.log(Math.max(...nums)); // => 8
// 注意：无参数调用时，Math.max 返回 -Infinity
const none: number[] = [];
console.log(Math.max(...none)); // => -Infinity

// 注意：安全整数范围仅支持到 2^53 - 1
console.log(Number.MAX_SAFE_INTEGER); // => 9007199254740991
console.log(2 ** 53 === 2 ** 53 + 1); // => true

// 数值不会溢出回绕：超出精度后会丢失精度，直至变为 Infinity
console.log(Number.MAX_VALUE * 2, -Infinity); // => Infinity -Infinity

// 注意：位运算符会将操作数转换为 32 位有符号整数
console.log(2 ** 31 | 0); // => -2147483648

// bigint（后缀 n）支持任意精度的整数；其除法会自动截断小数部分
const big: bigint = 2n ** 64n;
console.log(big, 7n / 2n); // => 18446744073709551616n 3n
// 1n + 1  // error TS2365: Operator '+' cannot be applied to types '1n' and '1'.

// 注意：简单的浮点数相加也可能出现精度舍入误差
console.log(0.1 + 0.2); // => 0.30000000000000004
```

## 输入与输出

```typescript
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

```typescript
import * as fs from "fs";

// 一次性读取标准输入（文件描述符 0）的所有内容，并按空白字符分割为标记。
// 无论数字是同行还是跨行排列均能正确解析。
const data = fs.readFileSync(0, "utf8").trim().split(/\s+/);
const n = Number(data[0]);
const nums: number[] = data.slice(1, n + 1).map(Number);
console.log(n, nums); // => 3 [ 1, 2, 3 ]
```

```text stdin
3
1 2
3
```

```typescript
import * as readline from "readline";

// 也可以按行逐行读取；输入结束触发 "close" 事件
const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];
rl.on("line", (line: string) => lines.push(line));
rl.on("close", () => {
  console.log(lines.length, lines[1].toUpperCase()); // => 2 SECOND LINE
});
```

```text stdin
first line
second line
```

## 数组

```typescript
// 数组可根据需要动态扩容；number[] 为其类型注解
const arr: number[] = [1, 2, 3];
console.log(arr, arr.length); // => [ 1, 2, 3 ] 3

// 将数组当作栈使用：在尾部 push 和 pop 操作的时间复杂度均为 O(1)
arr.push(4);
console.log(arr.pop()); // => 4

// 查看栈顶元素：at(-1) 支持从末尾反向索引（其推导类型为 number | undefined）
console.log(arr.at(-1)); // => 3

// 注意：arr[10] 类型声明虽为 number，但运行时其实是 undefined。
// TypeScript 默认不做越界检查，且 arr[-1] 也不是末尾元素。
console.log(arr[10], arr[-1]); // => undefined undefined

// splice(index, deleteCount, ...items) 在指定位置插入或删除元素，时间复杂度 O(n)
arr.splice(1, 0, 7);
console.log(arr); // => [ 1, 7, 2, 3 ]
arr.splice(0, 1);
console.log(arr); // => [ 7, 2, 3 ]

// 创建长度为 n 且填充默认值的数组
const zeros: number[] = new Array(5).fill(0);
console.log(zeros); // => [ 0, 0, 0, 0, 0 ]
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

```typescript
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

// 注意：forEach 无法提前 break 退出；若需提前终止请使用 for 循环
nums.forEach((n, i) => console.log(i, n)); // => 0 10 1 20 2 30

// 双数组同步遍历：按较短数组的长度循环
const letters = ["a", "b", "c"];
for (let i = 0; i < Math.min(nums.length, letters.length); i++) {
  console.log(nums[i], letters[i]);
}
// => 10 a 20 b 30 c
```

```typescript
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

// 浅拷贝后排序，保持原数组不变
const words = ["bob", "alice", "jane", "doe"];
console.log([...words].sort(), words[0]); // => [ 'alice', 'bob', 'doe', 'jane' ] bob

// 自定义多条件排序：先按长度升序，再按字母序（第一项相同为 0 时借助 || 比较第二项）
words.sort((a, b) => a.length - b.length || a.localeCompare(b));
console.log(words); // => [ 'bob', 'doe', 'jane', 'alice' ]

// 对二元组数组按第二项排序
const pairs: [number, number][] = [[1, 3], [2, 1], [3, 2]];
pairs.sort((p, q) => p[1] - q[1]);
console.log(pairs); // => [ [ 2, 1 ], [ 3, 2 ], [ 1, 3 ] ]
```

```typescript
// 3 行 4 列的二维数组：必须独立构建每一行
const grid: number[][] = Array.from({ length: 3 }, () => new Array(4).fill(0));
grid[0][0] = 1;
console.log(grid); // => [ [ 1, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ]
console.log(grid.length, grid[0].length); // => 3 4

// 注意：fill([...]) 会导致每个槽位共享同一个数组对象引用
const bad: number[][] = new Array(3).fill([0, 0]);
bad[0][0] = 1;
console.log(bad); // => [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ]

// 注意：在回溯算法中，必须保存路径的浅拷贝副本，而不是路径引用本身
const path = [1, 2];
const res: number[][] = [path, [...path]];
path[0] = 9;
console.log(res); // => [ [ 9, 2 ], [ 1, 2 ] ]
```

## 字符串

```typescript
const s = "abc";

// 按索引获取单个字符（长度为 1 的字符串）；slice 截取子串
console.log(s[0], s.at(-1), s.slice(1), s.slice(0, 2)); // => a c bc ab

// 字符串具有不可变性
// s[0] = "A";  // error TS2542: Index signature in type 'String' only permits reading.

// 使用数组配合 join 拼接字符串（现代 JavaScript 引擎中循环 += 同样高效）
const parts: string[] = [];
for (const ch of "abc") {
  parts.push(ch.toUpperCase());
}
console.log(parts.join("")); // => ABC

// 字符串与数字互转
console.log(Number("123") + 1, String(123) + "4"); // => 124 1234
// parseInt 遇到首个非数字字符停止；Number 则要求整个字符串合法
console.log(parseInt("42px"), Number("42px")); // => 42 NaN

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

// TypeScript/JavaScript 字符串没有内置 reverse：先展开为数组翻转后再拼接
console.log([..."hello"].reverse().join("")); // => olleh

console.log("hello".includes("ell"), "hello".indexOf("l")); // => true 2
console.log("Hi".toLowerCase(), "ab".repeat(3), "  x ".trim()); // => hi ababab x
console.log(/^\d+$/.test("123"), /[a-z]/i.test("Q")); // => true true
```

## 双端队列

```typescript
// TypeScript 标准库未提供队列或双端队列。注意：arr.shift() 虽然可用，但时间复杂度为 O(n)。
// 在 BFS 中，更推荐使用自增头指针读取数组元素
const queue: number[] = [1, 2, 3];
let head = 0;
while (head < queue.length) {
  const node = queue[head++];
  console.log(node);
}
// => 1 2 3

// 也可以按层遍历，每次将下一层构建为全新数组。
//（此处节点 n 的子节点为 2n 和 2n+1，类似堆形态的二叉树）
let level: number[] = [1];
for (let depth = 0; level.length > 0; depth++) {
  const next: number[] = [];
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

```typescript
// 当需要真正的双端队列时，用两个游标维护的泛型简易类可在两端实现 O(1) 操作。
// LeetCode 环境中也预置了 @datastructures-js/deque。
class Deque<T> {
  private items = new Map<number, T>();
  private head = 0; // 队头索引
  private tail = 0; // 队尾之后一位的索引

  get size(): number { return this.tail - this.head; }
  front(): T | undefined { return this.items.get(this.head); }
  back(): T | undefined { return this.items.get(this.tail - 1); }
  pushFront(x: T): void { this.items.set(--this.head, x); }
  pushBack(x: T): void { this.items.set(this.tail++, x); }

  popFront(): T | undefined {
    if (this.size === 0) return undefined;
    const x = this.front();
    this.items.delete(this.head++);
    return x;
  }

  popBack(): T | undefined {
    if (this.size === 0) return undefined;
    const x = this.back();
    this.items.delete(--this.tail);
    return x;
  }
}

const dq = new Deque<number>();
dq.pushBack(1);
dq.pushBack(2);
dq.pushFront(0);
console.log(dq.front(), dq.back(), dq.size); // => 0 2 3
console.log(dq.popFront(), dq.popBack(), dq.size); // => 0 2 1
```

## 哈希集合

```typescript
const seen = new Set<number>();
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

// 使用 filter 实现交集与差集（union 等新方法需要高于 ES2022 的 lib 支持）
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a].filter((x) => b.has(x)), [...a].filter((x) => !b.has(x))); // => [ 2, 3 ] [ 1 ]
console.log(new Set([...a, ...b]).size); // => 4

// 注意：数组和对象均按引用地址比较（参见元组章节）
console.log(new Set([[0, 1]]).has([0, 1])); // => false
```

## 哈希映射

```typescript
// Map<K, V> 是标准的哈希映射：支持任意类型的键，并保持键的插入顺序
const scores = new Map<string, number>();
scores.set("alice", 88);
scores.set("bob", 77);
console.log(scores.size); // => 2

scores.set("alice", 80);
console.log(scores.get("alice")); // => 80

// 注意：get 返回 V | undefined，键不存在时返回 undefined。
// 可用 ?? 提供默认值，或在确信存在时使用 ! 非空断言
console.log(scores.get("zoe"), scores.get("zoe") ?? 0); // => undefined 0
const alice: number = scores.get("alice")!;
console.log(alice + 1); // => 81

console.log(scores.has("alice")); // => true
scores.delete("alice");
console.log(scores); // => Map(1) { 'bob' => 77 }
```

```typescript
const scores = new Map<string, number>([["alice", 90], ["bob", 70]]);

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
const count = new Map<string, number>();
for (const ch of "banana") {
  count.set(ch, (count.get(ch) ?? 0) + 1);
}
console.log(count); // => Map(3) { 'b' => 1, 'a' => 3, 'n' => 2 }

// 分组聚合：首次使用时初始化数组
const groups = new Map<string, string[]>();
for (const word of ["eat", "tea", "tan"]) {
  const key = [...word].sort().join("");
  if (!groups.has(key)) {
    groups.set(key, []);
  }
  groups.get(key)!.push(word);
}
console.log([...groups.values()]); // => [ [ 'eat', 'tea' ], [ 'tan' ] ]
```

```typescript
// 类型为 Record<string, V> 的普通对象也可用作映射
const count: Record<string, number> = {};
for (const ch of "aab") {
  count[ch] = (count[ch] ?? 0) + 1;
}
console.log(count, "a" in count); // => { a: 2, b: 1 } true

// Object.entries 返回 [键, 值] 键值对数组
for (const [key, val] of Object.entries(count)) {
  console.log(key, val);
}
// => a 2 b 1

// 注意：对象的所有属性名在底层都会被转为字符串，即使类型声明写的是 number
const obj: Record<number, string> = {};
obj[1] = "one";
console.log(Object.keys(obj)); // => [ '1' ]
```

## 元组

```typescript
// 元组类型固定每个位置的元素类型；函数可返回元组并由调用方解构
function minMax(nums: number[]): [number, number] {
  return [Math.min(...nums), Math.max(...nums)];
}

const [lo, hi] = minMax([3, 1, 4]);
console.log(lo, hi); // => 1 4

// 命名元组元素标签可增强代码自解释性
type Edge = [to: number, cost: number];
const edge: Edge = [2, 7];
console.log(edge[1]); // => 7

// 注意：在运行时元组仅仅是普通数组，因此两个内容相同的元组引用不同，无法直接作为 Set/Map 的同一个键
const visited = new Set<[number, number]>();
visited.add([0, 1]);
console.log(visited.has([0, 1])); // => false

// 可以将各部分序列化为字符串后再作为键
const seen = new Set<string>();
seen.add([0, 1].join(","));
console.log(seen.has("0,1")); // => true

// 对于网格坐标，转换为单数值索引 (r * cols + c) 速度更快
const cols = 10;
const dist = new Map<number, number>([[0 * cols + 1, 1]]);
console.log(dist.get(0 * cols + 1)); // => 1
```

## 堆与优先队列

```typescript
// TypeScript 标准库没有内置堆。LeetCode 环境中预置了 @datastructures-js/priority-queue
//（MinPriorityQueue、MaxPriorityQueue）；其他环境中可快速手写如下泛型简易堆。
// compare 比较逻辑与 sort 相同：返回负数表示 a 优先级更高先出堆。
class Heap<T> {
  private data: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.data.length;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  push(x: T): void {
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

  pop(): T | undefined {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0 && last !== undefined) {
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

// 最小堆
const minHeap = new Heap<number>((a, b) => a - b);
for (const x of [5, 1, 8, 3, 2]) {
  minHeap.push(x);
}
console.log(minHeap.peek(), minHeap.size); // => 1 5
while (minHeap.size > 0) {
  console.log(minHeap.pop());
}
// => 1 2 3 5 8

// 最大堆：反转比较器
const maxHeap = new Heap<number>((a, b) => b - a);
[3, 1, 5].forEach((x) => maxHeap.push(x));
console.log(maxHeap.pop()); // => 5

// 自定义优先级：[priority, name] 元素按 priority 排序
const tasks = new Heap<[number, string]>((a, b) => a[0] - b[0]);
tasks.push([2, "write"]);
tasks.push([1, "plan"]);
tasks.push([3, "ship"]);
while (tasks.size > 0) {
  const [priority, name] = tasks.pop()!;
  console.log(priority, name);
}
// => 1 plan 2 write 3 ship

// 空堆调用 pop 返回 undefined
console.log(tasks.pop()); // => undefined
```

## 函数

```typescript
// 形参类型必须显式指定；返回值类型通常可自动推导
function multiply(n: number, m: number): number {
  return n * m;
}

console.log(multiply(3, 4)); // => 12

// 参数默认值；? 表示可选参数（其类型包含 undefined）
function greet(name: string, greeting = "Hello", punct?: string): string {
  return `${greeting}, ${name}${punct ?? "!"}`;
}

console.log(greet("Ann"), greet("Ann", "Hi", ".")); // => Hello, Ann! Hi, Ann.

// 与 JavaScript 不同，参数个数不匹配在 TypeScript 中属于编译错误
// multiply(3);  // error TS2554: Expected 2 arguments, but got 1.

// 剩余参数（Rest parameters）将多余实参收集为数组
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3), sum(...[4, 5])); // => 6 9

// 箭头函数是常用的 Lambda 表达式
const square = (x: number): number => x * x;
console.log(square(5)); // => 25
```

```typescript
// 嵌套函数可直接读写外层封闭函数的局部变量
function countUp(nums: number[]): number {
  let total = 0;

  function add(n: number): void {
    total += n;
  }

  nums.forEach(add);
  return total;
}

console.log(countUp([1, 2, 3])); // => 6

// 闭包在外层函数执行完毕返回后仍能保留其词法作用域变量
function makeCounter(): () => number {
  let n = 0;
  return () => ++n;
}

const next = makeCounter();
next();
console.log(next()); // => 2

// 注意：调用栈深度有限；过深的递归会抛出栈溢出异常
function depth(n: number): number {
  return n === 0 ? 0 : 1 + depth(n - 1);
}

try {
  depth(1e6);
} catch (e) {
  console.log((e as Error).name); // => RangeError
}
```

```typescript
// 对象参数按引用传递。
// 在函数内部直接修改数组会影响调用方的原始数组...
function appendOne(arr: number[]): void {
  arr.push(1);
}

const nums: number[] = [];
appendOne(nums);
console.log(nums); // => [ 1 ]

// ...但对参数变量重新赋一个新数组则不会影响调用方
function replace(arr: number[]): void {
  arr = [99];
}

replace(nums);
console.log(nums); // => [ 1 ]

// 参数类型加上 readonly 可保证函数内部不会变异该参数
function total(arr: readonly number[]): number {
  // arr.push(1);  // error TS2339: Property 'push' does not exist on type 'readonly number[]'.
  return arr.reduce((a, b) => a + b, 0);
}

console.log(total(nums)); // => 1
```

## 类与数据结构

```typescript
class Point {
  // 字段需声明其类型
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distSq(): number {
    return this.x ** 2 + this.y ** 2;
  }

  // 可选：自定义转字符串行为（供 `${p}` 和 String(p) 使用）
  toString(): string {
    return `Point(${this.x}, ${this.y})`;
  }
}

const p = new Point(3, 4);
console.log(p.distSq()); // => 25
console.log(`${p}`); // => Point(3, 4)

// 简写语法：在构造函数参数前加访问修饰符可同时声明并赋值字段
class Edge {
  constructor(public to: number, private readonly cost: number) {}

  getCost(): number {
    return this.cost;
  }
}

const e = new Edge(2, 7);
console.log(e.to, e.getCost()); // => 2 7
// e.cost;  // error TS2341: Property 'cost' is private and only accessible within class 'Edge'.

// TypeScript 不支持运算符重载；对象排序使用比较器函数
const pts = [new Point(2, 2), new Point(1, 0)];
pts.sort((a, b) => a.distSq() - b.distSq());
console.log(pts.map(String)); // => [ 'Point(1, 0)', 'Point(2, 2)' ]
```

```typescript
// LeetCode 中 TypeScript 的单链表节点
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val === undefined ? 0 : val);
    this.next = (next === undefined ? null : next);
  }
}

// 1 -> 2 -> 3
const head = new ListNode(1, new ListNode(2, new ListNode(3)));

// 遍历链表直到末尾（null）；类型标注明确 node 可能为 null
for (let node: ListNode | null = head; node !== null; node = node.next) {
  console.log(node.val);
}
// => 1 2 3
```

```typescript
// LeetCode 中 TypeScript 的二叉树节点
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }
}

//     2
//    / \
//   1   3
const root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

// 中序遍历；空子节点表示为 null
function inorder(node: TreeNode | null): void {
  if (node === null) {
    return;
  }
  inorder(node.left);
  console.log(node.val);
  inorder(node.right);
}

inorder(root); // => 1 2 3

// 注意：root.left 类型为 TreeNode | null；访问前需做空值检查（或使用 !）
console.log(root.left !== null && root.left.left === null); // => true

// 在 LeetCode 上，题目通常要求补全独立的函数
function maxDepth(root: TreeNode | null): number {
  if (root === null) {
    return 0;
  }
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

console.log(maxDepth(root)); // => 2
```
