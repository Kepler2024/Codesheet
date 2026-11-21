# Rust 速查表

> 适用于 Rust 1.93

本快速参考用于学习或温习 Rust 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```rust
// 每个独立程序均从 fn main 开始执行
fn main() {
    println!("Hello, World!"); // => Hello, World!
}
```

```bash
rustc hello.rs && ./hello    # 在 Cargo 项目中执行：cargo run
```

```rust
// 下方绝大多数代码块均为 main 函数体内的核心代码，以保持精简。
// 实际独立运行时，保留顶部 use 语句并将代码放入 fn main() { ... } 即可。
println!("Hello from main"); // => Hello from main
```

## 变量

```rust
// 变量默认不可变；使用 mut 关键字声明可变变量
let n = 0;
// n = 5;  // error[E0384]: cannot assign twice to immutable variable `n`
let mut m = 0;
m = 5;

// println! 使用 {name} 内嵌变量；{} 依次接收后续参数
println!("{n} {}", m); // => 0 5

// 变量类型根据初始值自动推导，一旦确定不可更改
// m = "abc";  // error[E0308]: mismatched types

// 常用基础类型：i32（默认整数）、i64、usize（用于长度与数组索引）、f64、bool、char
let big: i64 = 4_000_000_000;
let ratio: f64 = 0.5;
let done = false;
let letter = 'a';
println!("{big} {ratio} {done} {letter}"); // => 4000000000 0.5 false a

// 变量遮蔽（Shadowing）：使用相同名称重新 let 声明会创建全新变量，甚至可更改类型
let x = "5";
let x: i32 = x.parse().unwrap();
println!("{}", x + 1); // => 6

// 常量（const）必须显式标注类型，命名约定为大写蛇形命名（UPPER_CASE）
const MAX_SIZE: usize = 100;
println!("{MAX_SIZE}"); // => 100

// 利用元组交换变量
let (mut a, mut b) = (1, 2);
(a, b) = (b, a);
println!("{a} {b}"); // => 2 1

// 自增运算：Rust 没有 ++ 或 -- 运算符
m += 1;
println!("{m}"); // => 6

// 注意：数值类型之间绝不发生隐式转换；需使用 `as` 显式强转
let i: i32 = 7;
let len: usize = 3;
// i + len  // error[E0308]: mismatched types
println!("{}", i as usize + len); // => 10
```

```rust
// Rust 没有 null。Option<T> 只有两种状态：Some(value) 或 None。
let found: Option<i32> = Some(3);
let missing: Option<i32> = None;

// {:?} 打印 Debug 格式，支持 Option、Vec 以及元组等类型
println!("{:?} {:?}", found, missing); // => Some(3) None

// match 必须穷尽处理所有可能的分支
match found {
    Some(v) => println!("got {v}"), // => got 3
    None => println!("nothing"),
}

// if let 仅匹配并处理你关心的特定分支
if let Some(v) = found {
    println!("{v}"); // => 3
}

// unwrap_or 提供备用默认值；unwrap 遇到 None 时会直接触发 panic
println!("{} {}", missing.unwrap_or(-1), found.unwrap()); // => -1 3
// missing.unwrap();  // panic: 在 None 上调用了 `Option::unwrap()`

// 许多标准库方法在查无结果时返回 Option 而非报错：last、get、pop、HashMap::get...
let v = vec![1, 2];
println!("{:?} {:?}", v.last(), v.get(9)); // => Some(2) None
```

## 条件语句

```rust
// 条件表达式两端无需圆括号，花括号 {} 为强制必须书写
let mut n = 1;
if n > 2 {
    n -= 1;
} else if n == 2 {
    n *= 2;
} else {
    n += 2;
}
println!("{n}"); // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
let m = 5;
if n > 0 && m > 0 {
    println!("both"); // => both
}
println!("{} {}", !true, true || false); // => false true

// 注意：条件必须是 bool 类型；0 不会被视为假值
// if n { }  // error[E0308]: mismatched types: expected `bool`, found integer

// if 本身是表达式，可直接代替三元条件运算符
let parity = if n % 2 == 0 { "even" } else { "odd" };
println!("{parity}"); // => odd

// match 是 Rust 的模式匹配分支：必须覆盖全部可能，支持区间分支
let size = match n {
    i32::MIN..=-1 => "negative",
    0..=9 => "small",
    _ => "large",
};
println!("{size}"); // => small
```

## 循环

```rust
let mut n = 0;
while n < 3 {
    println!("{n}");
    n += 1;
}
// => 0 1 2

// i 从 0 到 4：.. 范围左闭右开
for i in 0..5 {
    println!("{i}");
}
// => 0 1 2 3 4

// i 从 2 到 5：..= 包含右边界
for i in 2..=5 {
    println!("{i}");
}
// => 2 3 4 5

// i 从 5 递减到 2：对范围调用 rev()
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

// step_by 设置迭代步长
for i in (0..10).step_by(3) {
    println!("{i}");
}
// => 0 3 6 9

// loop 为无限循环；break 可以携带返回值
let mut count = 0;
let result = loop {
    count += 1;
    if count == 3 {
        break count * 10;
    }
};
println!("{result}"); // => 30

// 循环标签 ('name) 允许 break 或 continue 作用于指定的外层循环
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

## 数学运算

```rust
use std::cmp::{max, min};

// 两个整数相除 / 为整数除法（向下截断）
println!("{} {}", 5 / 2, 5.0 / 2.0); // => 2 2.5

// 注意：整数与浮点数不能直接运算；需用 `as` 显式转换
let a = 5;
// a / 2.0  // error[E0277]: cannot divide `{integer}` by `{float}`
println!("{}", a as f64 / 2.0); // => 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
println!("{}", -3 / 2); // => -1

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
println!("{}", -10 % 3); // => -1

// div_euclid 与 rem_euclid 执行欧几里得除法，余数恒为非负数
println!("{} {}", (-3_i32).div_euclid(2), (-10_i32).rem_euclid(3)); // => -2 2

// 常用数学函数以方法形式调用；整数浮点数打印时不带额外小数点
let x: f64 = -1.5;
println!("{} {}", x.floor(), x.ceil()); // => -2 -1
println!("{} {} {}", 16_f64.sqrt(), 2_i32.pow(10), (-7_i32).abs()); // => 4 1024 7
println!("{} {}", max(3, 8), min(3, 8)); // => 8 3

// 将浮点数转换为整数时会向零截断小数部分
println!("{}", 17_f64.sqrt() as i32); // => 4

// 极值与无穷大
println!("{} {}", i32::MAX, i32::MIN); // => 2147483647 -2147483648
println!("{} {}", i64::MAX, f64::INFINITY); // => 9223372036854775807 inf

// 注意：数值溢出在 Debug 模式下会触发 panic，而在 Release 编译下会按模回绕。
// 建议显式调用具有确定行为的溢出控制方法：
let big = i32::MAX;
println!("{:?} {} {}", big.checked_add(1), big.wrapping_add(1), big.saturating_add(1)); // => None -2147483648 2147483647

// 当乘积可能超出当前范围时，必须在相乘前提前强转为 i64
let side: i32 = 50_000;
println!("{}", side as i64 * side as i64); // => 2500000000
```

## 输入与输出

```rust
// println! 使用 {} 格式化：{name} 引用同名变量，{} 引用后续参数
let name = "alice";
let score = 90;
println!("{name} scored {score}"); // => alice scored 90
println!("{} + {} = {}", 1, 2, 1 + 2); // => 1 + 2 = 3

// print! 打印内容但不追加末尾换行
print!("same ");
println!("line"); // => same line

// {:?} 打印 Debug 格式；{:.2} 保留两位小数
let v = vec![1, 2, 3];
println!("{:?} {:.2}", v, 3.14159); // => [1, 2, 3] 3.14

// 注意：println!("{}", v) 无法编译：Vec 默认未实现 Display Trait {}。
// 可将各元素转为字符串后使用 join 拼接输出
let parts: Vec<String> = v.iter().map(|x| x.to_string()).collect();
println!("{}", parts.join(" ")); // => 1 2 3
```

```rust
use std::io::{self, Read};

// 一次性读取标准输入的全部内容至 String，再按空白字符切分成标记流。
// 无论输入数值是单行还是跨行排列均能正确解析。
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

// 也可以按行流式逐行读取；每行均会自动剔除末尾换行符
let stdin = io::stdin();

// 针对超大数据量输出，用 BufWriter 包装标准输出并通过 writeln! 写入
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

## 所有权与借用

```rust
// 每个值都有且仅有一个所有者。赋值 Vec 或 String 会发生移动（Move）：原变量失效不可再读
let a = vec![1, 2, 3];
let b = a;
// println!("{:?}", a);  // error[E0382]: borrow of moved value: `a`
println!("{:?}", b); // => [1, 2, 3]

// clone() 创建完全独立的深拷贝
let mut c = b.clone();
c[0] = 99;
println!("{:?} {:?}", b, c); // => [1, 2, 3] [99, 2, 3]

// 基础数值、bool 与 char 均实现了 Copy Trait：赋值自动按位拷贝，不发生移动
let x = 5;
let y = x;
println!("{x} {y}"); // => 5 5

// & 借用（不可变引用）值而不获取所有权；同一时刻可以共存任意数量的不可变借用
let v = vec![1, 2, 3];
let first = &v[0];
let all = &v;
println!("{first} {}", all.len()); // => 1 3

// &mut 可变借用允许修改被引用的值；当其处于活跃生命周期内时，不允许存在任何其他引用
let mut w = vec![1, 2];
let r = &mut w;
r.push(3);
println!("{:?}", w); // => [1, 2, 3]

// 注意：当向量元素的不可变引用在后续仍被使用时，不能向该 Vec 调用 push 扩容
// let top = &w[0]; w.push(4); println!("{top}");
//     error[E0502]: cannot borrow `w` as mutable because it is also borrowed as immutable
// 此时应将数值 Copy 出来再操作
let top = w[0];
w.push(4);
println!("{top} {}", w.len()); // => 1 4
```

## 动态数组

```rust
// Vec<T> 是动态数组；vec! 宏用于快速初始化
let mut arr = vec![1, 2, 3];
println!("{:?} {}", arr, arr.len()); // => [1, 2, 3] 3

// 当作栈使用：在尾部 push 和 pop 的时间复杂度均为 O(1)；pop 返回 Option
arr.push(4);
println!("{:?}", arr.pop()); // => Some(4)

// 查看栈顶元素，同样返回 Option
println!("{:?}", arr.last()); // => Some(3)

// 在中间 insert 与 remove 的时间复杂度为 O(n)
arr.insert(1, 7);
println!("{:?}", arr); // => [1, 7, 2, 3]
arr.remove(0);
println!("{:?}", arr); // => [7, 2, 3]

// 创建长度为 n 且填充默认值的 Vec
println!("{:?}", vec![0; 5]); // => [0, 0, 0, 0, 0]

// 注意：数组索引类型必须为 usize，且下标越界会直接触发 panic；推荐使用返回 Option 的 get()
// arr[10]  // panic: 索引越界
println!("{} {:?}", arr[arr.len() - 1], arr.get(10)); // => 3 None

// 注意：len() 返回 usize，因此在空 Vec 上调用 len() - 1 会下溢触发 panic
let empty: Vec<i32> = Vec::new();
// empty.len() - 1  // panic: 减法下溢
println!("{:?}", empty.len().checked_sub(1)); // => None

// 切片借用 &v[start..end] 获取子区间引用；左闭右开
let nums = vec![1, 2, 3, 4];
println!("{:?} {:?} {:?}", &nums[1..3], &nums[..2], &nums[2..]); // => [2, 3] [1, 2] [3, 4]

// contains 和 position 均为 O(n)；快速查找请使用 HashSet
println!("{} {:?}", nums.contains(&3), nums.iter().position(|&x| x == 3)); // => true Some(2)
println!("{} {:?}", nums.iter().sum::<i32>(), nums.iter().max()); // => 10 Some(4)

// map 和 filter 是迭代器适配器；通过 collect 聚合生成新集合
let doubled: Vec<i32> = nums.iter().map(|x| x * 2).collect();
let evens: Vec<i32> = nums.iter().filter(|&&x| x % 2 == 0).copied().collect();
println!("{:?} {:?}", doubled, evens); // => [2, 4, 6, 8] [2, 4]

// 定长数组 [T; N] 将长度直接包含在类型签名中，常用于字母统计频次
let mut counts = [0; 26];
counts[2] += 1;
println!("{}", counts[2]); // => 1
```

```rust
let nums = vec![10, 20, 30];

// 通过索引遍历
for i in 0..nums.len() {
    println!("{}", nums[i]);
}
// => 10 20 30

// 直接按值遍历：遍历借用引用（&nums）使原 nums 在循环后仍可继续使用
for n in &nums {
    println!("{n}");
}
// => 10 20 30

// 同时遍历索引和元素值
for (i, n) in nums.iter().enumerate() {
    println!("{i} {n}");
}
// => 0 10 1 20 2 30

// 双数组同步遍历：zip 按较短容器长度截断
for (n, ch) in nums.iter().zip(["a", "b", "c"]) {
    println!("{n} {ch}");
}
// => 10 a 20 b 30 c

// 原地修改元素：遍历可变借用 &mut
let mut v = nums.clone();
for n in &mut v {
    *n *= 2;
}
println!("{:?}", v); // => [20, 40, 60]

// 注意：`for n in nums` 会发生所有权移动，循环结束后原 nums 无法再被访问
```

```rust
use std::cmp::Reverse;

let mut nums = vec![5, 4, 7, 3, 8];

// reverse 与 sort 均为原地操作
nums.reverse();
println!("{:?}", nums); // => [8, 3, 7, 4, 5]
nums.sort();
println!("{:?}", nums); // => [3, 4, 5, 7, 8]

// 降序排序：倒置比较顺序 b.cmp(a)，或对元素应用 Reverse 包装
nums.sort_by(|a, b| b.cmp(a));
println!("{:?}", nums); // => [8, 7, 5, 4, 3]
nums.sort_by_key(|&x| Reverse(x));
println!("{:?}", nums); // => [8, 7, 5, 4, 3]

// 克隆后排序以保持原数组不变
let words = vec!["bob", "alice", "jane", "doe"];
let mut sorted = words.clone();
sorted.sort();
println!("{:?} {}", sorted, words[0]); // => ["alice", "bob", "doe", "jane"] bob

// 自定义多条件排序：利用元组 key 天然按长度升序，再按字母序
let mut by_len = words.clone();
by_len.sort_by_key(|w| (w.len(), *w));
println!("{:?}", by_len); // => ["bob", "doe", "jane", "alice"]

// 对二元组数组按第二项元素排序
let mut pairs = vec![(1, 3), (2, 1), (3, 2)];
pairs.sort_by_key(|p| p.1);
println!("{:?}", pairs); // => [(2, 1), (3, 2), (1, 3)]

// 注意：f64 存在 NaN 因而未实现全序关系 Ord，sort() 无法直接编译；需使用 total_cmp
let mut fs: Vec<f64> = vec![2.5, -1.0, 0.5];
fs.sort_by(|a, b| a.total_cmp(b));
println!("{:?}", fs); // => [-1.0, 0.5, 2.5]
```

```rust
// 3 行 4 列的二维 Vec；vec![row; n] 会克隆该行对象，因此各行完全独立
let mut grid = vec![vec![0; 4]; 3];
grid[0][0] = 1;
println!("{:?}", grid); // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
println!("{} {}", grid.len(), grid[0].len()); // => 3 4

// 在回溯算法中，push 路径的克隆副本（借用检查器天然禁止在保留引用的同时修改原路径）
let mut path = vec![1, 2];
let mut res: Vec<Vec<i32>> = Vec::new();
res.push(path.clone());
path[0] = 9;
println!("{:?}", res); // => [[1, 2]]
```

## 字符串

```rust
// &str 是不可变字符串切片（所有字符串字面量均为 &str）；String 具备独立所有权且可动态扩容
let s: &str = "abc";
let mut owned: String = String::from("ab");
owned.push('c');
owned.push_str("de");
owned += "f";
println!("{owned}"); // => abcdef

// 注意：Rust 字符串不支持直接通过整数索引下标访问
// s[0]  // error[E0277]: the type `str` cannot be indexed by `{integer}`

// 针对 ASCII 字符（多数算法题），可通过字节切片下标访问...
let bytes = s.as_bytes();
println!("{} {}", bytes[0], bytes[0] as char); // => 97 a

// ...或一次性将字符转换为 Vec<char> 后随机访问
let chars: Vec<char> = s.chars().collect();
println!("{}", chars[1]); // => b

// 字符串切片基于字节范围；若切分位置割裂了多字节 UTF-8 字符将触发 panic
println!("{} {}", &s[1..], &s[..2]); // => bc ab

// 字符串与数字互转；parse 返回 Result 类型（输入非法时为 Err）
let n: i32 = "123".parse().unwrap();
println!("{} {}", n + 1, 123.to_string() + "4"); // => 124 1234
println!("{}", "12a".parse::<i32>().is_err()); // => true

// char 与字符编码互转
println!("{} {}", 'a' as u32, (b'a' + 1) as char); // => 97 b

// 计算小写字母在 26 大小数组中的偏移量，以及数字字符的值
let c = 'c';
println!("{} {:?}", (c as u8 - b'a') as usize, '7'.to_digit(10)); // => 2 Some(7)
```

```rust
// split_whitespace 按任意连续空白切分
let words: Vec<&str> = "the quick  brown fox".split_whitespace().collect();
println!("{} {}", words.len(), words.join("-")); // => 4 the-quick-brown-fox

// 注意：split(' ') 在连续空格之间会保留空片段
let parts: Vec<&str> = "a  b".split(' ').collect();
println!("{:?}", parts); // => ["a", "", "b"]

// 使用 == 和 < 按字典序比较字符串
println!("{} {}", "apple" < "banana", "a" == "a"); // => true true

// format! 宏类似 println! 语法格式化生成 String
let label = format!("{}-{}", 1, 2);
println!("{label}"); // => 1-2

let s = "hello";
let reversed: String = s.chars().rev().collect();
println!("{} {} {:?}", reversed, s.contains("ell"), s.find('l')); // => olleh true Some(2)
println!("{} {}", s.to_uppercase(), 'x'.is_alphabetic()); // => HELLO true
```

## 队列与双端队列

```rust
use std::collections::VecDeque;

// VecDeque 是双端队列：两端增删的时间复杂度均为 O(1)
let mut dq = VecDeque::new();
dq.push_back(1);
dq.push_back(2);
dq.push_front(0);
println!("{:?}", dq); // => [0, 1, 2]

// pop_front 与 pop_back 返回 Option（队列为空时为 None）
println!("{:?} {:?}", dq.pop_front(), dq.pop_back()); // => Some(0) Some(2)

// 查看队头、队尾元素以及大小
dq.push_back(3);
println!("{:?} {:?} {}", dq.front(), dq.back(), dq.len()); // => Some(1) Some(3) 2

// 经典 BFS 遍历循环：while let 不断出队直到队列为空
let mut queue = VecDeque::from([1, 2, 3]);
while let Some(node) = queue.pop_front() {
    println!("{node}");
}
// => 1 2 3
```

## 哈希集合

```rust
use std::collections::{BTreeSet, HashSet};

let mut seen = HashSet::new();
seen.insert(1);
seen.insert(2);

// insert 在元素原先已存在时返回 false
println!("{}", seen.insert(2)); // => false
println!("{}", seen.len()); // => 2

// contains 和 remove 接收引用作为参数
println!("{} {}", seen.contains(&1), seen.contains(&3)); // => true false
println!("{} {}", seen.remove(&2), seen.remove(&42)); // => true false

// 从 Vec 快速构建集合
let set: HashSet<i32> = vec![3, 1, 3, 2].into_iter().collect();
println!("{}", set.len()); // => 3

// 注意：HashSet 遍历顺序随机且各次运行不确定；
// BTreeSet（基于 B 树）则始终保持元素升序排列
let sorted: BTreeSet<i32> = set.iter().copied().collect();
println!("{:?}", sorted); // => {1, 2, 3}

// 并集、交集与差集均返回迭代器（BTreeSet 计算保持有序）
let a = BTreeSet::from([1, 2, 3]);
let b = BTreeSet::from([2, 3, 4]);
let inter: Vec<i32> = a.intersection(&b).copied().collect();
let diff: Vec<i32> = a.difference(&b).copied().collect();
println!("{:?} {:?} {}", inter, diff, a.union(&b).count()); // => [2, 3] [1] 4
```

## 哈希映射

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert("alice", 88);
scores.insert("bob", 77);
println!("{}", scores.len()); // => 2

// insert 会覆盖旧值，并返回被替换的旧值 Option
println!("{:?}", scores.insert("alice", 80)); // => Some(88)

// get 返回 Option 包装的值引用
println!("{:?} {:?}", scores.get("alice"), scores.get("zoe")); // => Some(80) None
println!("{}", scores.get("zoe").copied().unwrap_or(0)); // => 0

// 注意：对不存在的键直接使用下标索引 map[key] 会触发 panic
// scores["zoe"]  // panic
println!("{}", scores["bob"]); // => 77

println!("{}", scores.contains_key("alice")); // => true
scores.remove("alice");
println!("{}", scores.contains_key("alice")); // => false
```

```rust
use std::collections::{BTreeMap, HashMap};

// 注意：HashMap 遍历顺序是随机的；BTreeMap 则保持键按自然升序排列
let scores = BTreeMap::from([("bob", 70), ("alice", 90)]);

for (key, val) in &scores {
    println!("{key} {val}");
}
// => alice 90 bob 70

println!("{:?} {:?}", scores.keys().collect::<Vec<_>>(), scores.values().collect::<Vec<_>>()); // => ["alice", "bob"] [90, 70]

// 统计频次：entry(key).or_insert(0) 返回对应计数值的可变引用
let mut count = HashMap::new();
for ch in "banana".chars() {
    *count.entry(ch).or_insert(0) += 1;
}
println!("{} {}", count[&'a'], count[&'n']); // => 3 2

// 分组聚合：or_default() 在键首次不存在时自动初始化默认空 Vec
let mut groups: HashMap<String, Vec<&str>> = HashMap::new();
for word in ["eat", "tea", "tan"] {
    let mut letters: Vec<char> = word.chars().collect();
    letters.sort();
    groups.entry(letters.into_iter().collect()).or_default().push(word);
}
println!("{:?}", groups["aet"]); // => ["eat", "tea"]
```

## 元组

```rust
use std::collections::{HashMap, HashSet};

// 函数返回元组以实现返回多个值
fn min_max(nums: &[i32]) -> (i32, i32) {
    (*nums.iter().min().unwrap(), *nums.iter().max().unwrap())
}

fn main() {
    // 解构元组，或通过 .0、.1 访问各字段
    let (lo, hi) = min_max(&[3, 1, 4]);
    println!("{lo} {hi}"); // => 1 4
    let t = (1, "one");
    println!("{} {}", t.0, t.1); // => 1 one

    // 元组天然支持逐元素比较大小
    println!("{}", (1, 2) < (1, 3)); // => true

    // 元素可哈希的元组可直接作为 HashSet 的元素或 HashMap 的键
    let mut visited = HashSet::new();
    visited.insert((0, 1));
    println!("{}", visited.contains(&(0, 1))); // => true
    let dist = HashMap::from([((0, 1), 1)]);
    println!("{}", dist[&(0, 1)]); // => 1
}
```

## 堆与优先队列

```rust
use std::cmp::Reverse;
use std::collections::BinaryHeap;

// 注意：BinaryHeap 默认为最大堆（Max-heap，与 Python 的 heapq 最小堆相反）
let mut heap = BinaryHeap::new();
heap.push(3);
heap.push(1);
heap.push(5);

// peek 与 pop 返回 Option
println!("{:?} {}", heap.peek(), heap.len()); // => Some(5) 3
while let Some(x) = heap.pop() {
    println!("{x}");
}
// => 5 3 1

// 最小堆：使用 Reverse 包装元素，出堆时解构模式匹配
let mut min_heap = BinaryHeap::new();
for x in [5, 1, 8] {
    min_heap.push(Reverse(x));
}
if let Some(Reverse(x)) = min_heap.pop() {
    println!("{x}"); // => 1
}

// 基于已有 Vec 线性时间 O(n) 建堆
let heap = BinaryHeap::from(vec![5, 1, 8, 3]);
println!("{:?}", heap.peek()); // => Some(8)

// 自定义优先级：元组先比较第一项，再比较第二项
let mut tasks = BinaryHeap::new();
tasks.push(Reverse((2, "write")));
tasks.push(Reverse((1, "plan")));
tasks.push(Reverse((3, "ship")));
while let Some(Reverse((priority, name))) = tasks.pop() {
    println!("{priority} {name}");
}
// => 1 plan 2 write 3 ship

// 注意：f64 未实现 Ord，因而无法直接用于 BinaryHeap<f64>；可放大倍数转为整型
```

## 函数

```rust
// 形参类型必须显式指定。函数体最后一个不带分号的表达式即为返回值。
fn multiply(n: i32, m: i32) -> i32 {
    n * m
}

// 提前返回仍可使用 return 关键字。Rust 不支持默认参数或函数重载。
fn abs_diff(a: i32, b: i32) -> i32 {
    if a > b {
        return a - b;
    }
    b - a
}

fn main() {
    println!("{} {}", multiply(3, 4), abs_diff(2, 7)); // => 12 5

    // 闭包语法为 |参数| 函数体；能够捕获周围环境中的变量
    let square = |x: i32| x * x;
    let offset = 10;
    let shift = |x: i32| x + offset;
    println!("{} {}", square(5), shift(1)); // => 25 11

    // 修改捕获变量的闭包必须显式用 mut 修饰
    let mut total = 0;
    let mut add = |n: i32| total += n;
    add(3);
    add(4);
    println!("{total}"); // => 7

    // 注意：闭包不能直接通过标识符递归调用自身。若需递归（如 DFS 辅助函数），
    // 请编写嵌套 fn；嵌套函数无法隐式捕获外部变量，需显式传参
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
// 按值传递 Vec 会将所有权移入函数中
fn consume(v: Vec<i32>) -> usize {
    v.len()
}

// 传递 &mut 可变借用使函数可以原地修改容器
fn push_one(v: &mut Vec<i32>) {
    v.push(1);
}

// 传递 & 不可变借用以供只读访问；&[i32] 能无缝接收 Vec 与静态数组，优于 &Vec<i32>
fn sum(v: &[i32]) -> i32 {
    v.iter().sum()
}

fn main() {
    let mut nums = vec![];
    push_one(&mut nums);
    println!("{:?} {}", nums, sum(&nums)); // => [1] 1

    let n = consume(nums);
    println!("{n}"); // => 1
    // println!("{:?}", nums);  // error[E0382]: 所有权已转移

    // i32 等实现了 Copy 的类型在传参时直接复制数值，调用方的值永远不变
}
```

## 结构体与数据结构

```rust
// Rust 没有 class 关键字。由 struct 容纳数据，在 impl 块中定义关联函数与方法。
use std::fmt;

// derive 自动生成常用 Trait：Debug 用于 {:?}、Clone、PartialEq/Eq 用于 ==，Hash 用于哈希键
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // 构造函数是普通的关联函数，命名习惯为 new
    fn new(x: i32, y: i32) -> Self {
        Point { x, y }
    }

    // &self 借用对象以供只读访问
    fn dist_sq(&self) -> i32 {
        self.x * self.x + self.y * self.y
    }

    // &mut self 可变借用以修改对象内部字段
    fn shift(&mut self, dx: i32) {
        self.x += dx;
    }
}

// 可选：实现 Display Trait 自定义 {} 格式化输出
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

    // 按自定义 key 排序结构体切片
    let mut pts = vec![Point::new(2, 2), Point::new(1, 0)];
    pts.sort_by_key(|p| p.dist_sq());
    println!("{} {}", pts[0], pts[1]); // => Point(1, 0) Point(2, 2)

    // 得益于 derive 生成的 Trait，Point 按字段值比较相等，且可直接作为 HashSet 元素
    println!("{}", Point::new(1, 1) == Point::new(1, 1)); // => true
}
```

```rust
// LeetCode 中 Rust 的单链表节点。next 拥有后续链表节点的堆所有权（Box）；
// None 表示链表终点。
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
    // 从后往前逆序构建 1 -> 2 -> 3
    let mut head: Option<Box<ListNode>> = None;
    for val in [3, 2, 1] {
        let mut node = ListNode::new(val);
        node.next = head;
        head = Some(Box::new(node));
    }

    // 使用借用引用遍历链表直到末尾（None）
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

// LeetCode 中 Rust 的二叉树节点。Rc 允许多个所有者共享节点，
// RefCell 允许内部可变性：borrow() 借用只读，borrow_mut() 借用修改。
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

// 在 LeetCode 上，题目通常要求补全 impl Solution 中的关联函数
struct Solution;

impl Solution {
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        match root {
            None => 0,
            Some(node) => {
                let node = node.borrow();
                // Rc::clone 仅复制引用计数指针，不发生子树深拷贝
                1 + Self::max_depth(node.left.clone()).max(Self::max_depth(node.right.clone()))
            }
        }
    }
}

// 中序遍历；空子节点表示为 None
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
