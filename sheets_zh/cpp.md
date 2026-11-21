# C++ 速查表

> 适用于 C++23（GCC 14）

本快速参考用于学习或温习 C++ 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```cpp
// 程序从 main 函数开始执行；执行到 main 末尾默认返回 0（表示成功）
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl; // => Hello, World!
}
```

```bash
g++ -std=c++23 -O2 hello.cpp -o hello
./hello
```

```cpp
// using namespace std 允许直接写 cout 而不必写 std::cout。这与 LeetCode 题目签名的风格
//（如 vector<int>& nums）保持一致，但主要用于刷题练习；工程项目中通常避免全局引入命名空间。
// 下方绝大多数代码块为 main 函数体内代码，实际运行时放入 int main() { ... } 即可。
#include <iostream>
using namespace std;

cout << "Hello from main" << endl; // => Hello from main
```

## 变量

```cpp
#include <iostream>
#include <optional>
#include <string>
using namespace std;

// 每个变量都必须有明确类型，且类型一旦确定不可改变
int n = 0;
cout << n << endl; // => 0
// n = "abc";  // 编译错误：从 'const char*' 到 'int' 的无效类型转换

// auto 可根据初始值自动推导变量类型
auto count = 3;
auto name = string("alice");  // 单纯字面量 "alice" 是 C 风格字符串 (const char*)
cout << count << " " << name << endl; // => 3 alice

// 常用基础类型：int（32 位）、long long（64 位）、double、bool、char、string
long long big = 4'000'000'000LL;  // ' 为数字分隔符；LL 后缀表示 long long 字面量
double ratio = 0.5;
char letter = 'a';
cout << big << " " << ratio << " " << letter << endl; // => 4000000000 0.5 a

// 注意：bool 默认输出为 1 和 0，除非先输出 boolalpha 控制符
bool done = false;
cout << done << " " << boolalpha << done << endl; // => 0 false

// const 声明初始化后不可修改的常量
const int limit = 100;
// limit = 200;  // 编译错误：无法向只读变量 'limit' 赋值

// 注意：未显式初始化的局部 int 变量内容为未定义垃圾值；{} 可执行零值初始化
// int bad;  // 读取它属于未定义行为（Undefined Behavior）
int zero{};
cout << zero << endl; // => 0

// 交换变量
int a = 1, b = 2;
swap(a, b);
cout << a << " " << b << endl; // => 2 1

// 自增运算
n++;
n += 2;
cout << n << endl; // => 3

// nullptr 表示空指针；optional<T> 表示可能缺失的值
int* p = nullptr;
optional<int> found;
cout << (p == nullptr) << " " << found.has_value() << " " << found.value_or(-1) << endl; // => true false -1
found = 42;
cout << *found << endl; // => 42
```

## 条件语句

```cpp
#include <iostream>
#include <string>
using namespace std;

// 条件表达式两端必须带有圆括号
int n = 1;
if (n > 2) {
    n--;
} else if (n == 2) {
    n *= 2;
} else {
    n += 2;
}
cout << n << endl; // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
int m = 5;
if (n > 0 && m > 0) {
    cout << "both" << endl; // => both
}
cout << boolalpha << !true << " " << (true || false) << endl; // => false true

// 注意：非零数值以及非空指针在条件判断中均被视为 true
if (n) cout << "non-zero" << endl; // => non-zero

// 注意：条件判断中误写 = 会执行赋值而非比较（-Wall 编译选项会发出警告）
// if (n = 5) { }  // 恒为 true，且 n 的值会被覆盖为 5

// 三元条件运算符
string parity = n % 2 == 0 ? "even" : "odd";
cout << parity << endl; // => odd

// switch 适用于整数与字符类型。
// 注意：缺少 break 语句会导致执行直接贯穿（fall through）到下一个 case
switch (n) {
    case 3: cout << "three" << endl; // => three
    case 4: cout << "four" << endl; // => four
        break;
    default: cout << "other" << endl;
}
```

## 循环

```cpp
#include <iostream>
using namespace std;

int n = 0;
while (n < 3) {
    cout << n << " ";
    n++;
}
// => 0 1 2

// i 从 0 到 4
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
// => 0 1 2 3 4

// i 从 2 到 5
for (int i = 2; i <= 5; i++) {
    cout << i << " ";
}
// => 2 3 4 5

// i 从 5 递减到 2
for (int i = 5; i >= 2; i--) {
    cout << i << " ";
}
// => 5 4 3 2

for (int i = 0; i < 10; i++) {
    if (i == 1) continue;
    if (i == 4) break;
    cout << i << " ";
}
// => 0 2 3

// C++ 没有带标签的 break：若需退出多层嵌套循环，可使用标志变量，
// 或将循环逻辑封装为独立函数直接 return
```

## 数学运算

```cpp
#include <cmath>
#include <climits>
#include <iostream>
#include <limits>
using namespace std;

// 两个整数相除 / 为整数除法（向下截断）
cout << 5 / 2 << " " << 5 / 2.0 << endl; // => 2 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
cout << -3 / 2 << endl; // => -1

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
cout << -10 % 3 << endl; // => -1

// 始终非负的模运算，常用于循环数组索引
cout << (-10 % 3 + 3) % 3 << endl; // => 2

// <cmath> 常用函数返回 double 浮点数
cout << floor(-1.5) << " " << ceil(-1.5) << endl; // => -2 -1
cout << sqrt(16) << " " << pow(2, 10) << " " << abs(-7) << endl; // => 4 1024 7

// 注意：cout 默认用科学计数法打印较大的 double；需显式转换为整型输出
cout << pow(10, 8) << " " << (long long) pow(10, 8) << endl; // => 1e+08 100000000

// max 和 min；{} 初始化列表形式支持传入任意数量参数
cout << max(3, 8) << " " << min({3, 8, 1}) << endl; // => 8 1
// 注意：比较的两个参数必须类型完全相同
// max(1, 2LL);  // 编译错误：找不到匹配的 'max(int, long long int)' 函数调用

// 极值与无穷大
cout << INT_MAX << " " << INT_MIN << endl; // => 2147483647 -2147483648
cout << LLONG_MAX << endl; // => 9223372036854775807
cout << numeric_limits<double>::infinity() << endl; // => inf

// 注意：有符号整数溢出属于未定义行为（Undefined Behavior），而非保证自动回绕。
// 当乘积可能超出 int 范围时，必须在相乘前提前提升为 long long。
int side = 50'000;
cout << 1LL * side * side << endl; // => 2500000000

// 无符号整数算术运算标准规定会按模溢出回绕
unsigned int u = 0;
u--;
cout << u << endl; // => 4294967295
```

## 输入与输出

```cpp
#include <cstdio>
#include <iomanip>
#include <iostream>
#include <print>
#include <vector>
using namespace std;

// cout 通过 << 运算符链式输出，元素间默认不添加空格
cout << "a" << 1 << endl; // => a1
cout << "a " << 1 << " " << 2.5 << endl; // => a 1 2.5

// '\n' 仅换行；endl 换行同时会刷新输出缓冲区，在大规模循环中会显著降低性能
cout << "line" << '\n'; // => line

// 保留固定小数位数输出（该设置对后续流输出持续有效）
cout << fixed << setprecision(2) << 3.14159 << '\n'; // => 3.14

// C 风格的 printf 依然完全兼容可用
printf("%s scored %d\n", "alice", 90); // => alice scored 90

// C++23 的 println 支持类似 Python 的格式化语法
println("{} scored {}", "bob", 85); // => bob scored 85

// 标准库没有直接打印 vector 的流重载；需循环遍历输出
vector<int> nums = {1, 2, 3};
for (int x : nums) cout << x << ' ';
cout << '\n'; // => 1 2 3
// cout << nums;  // 编译错误
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// 针对大数据量输入输出关闭流同步提速（注意关闭后不要混用 cin/cout 与 scanf/printf）
ios::sync_with_stdio(false);
cin.tie(nullptr);

// >> 运算符会自动跳过空白字符（包括空格与换行符）
int n;
cin >> n;
vector<int> nums(n);
for (int& x : nums) {
    cin >> x;
}

// getline 读取一整行字符串。注意：>> 可能会将尾部换行符留在缓冲区中；
// 使用 cin >> ws 可自动跳过前导空白符，避免 getline 读入空行
string line;
getline(cin >> ws, line);
cout << n << " " << nums[2] << " " << line << '\n'; // => 3 3 hello world
```

```text stdin
3
1 2
3
hello world
```

```cpp
#include <iostream>
using namespace std;

// 持续读取数值直到输入流结束：文件末尾或格式错误时 >> 会返回 false 退出循环
long long sum = 0;
int x;
while (cin >> x) {
    sum += x;
}
cout << sum << '\n'; // => 15
```

```text stdin
4 5
6
```

## 数组与动态数组

```cpp
#include <iostream>
#include <vector>
using namespace std;

// vector 是标准动态数组
vector<int> arr = {1, 2, 3};
cout << arr.size() << endl; // => 3

// 当作栈使用：在尾部 push_back 和 pop_back 的时间复杂度均为 O(1)
arr.push_back(4);
cout << arr.back() << endl; // => 4

// 注意：pop_back 无返回值，需在弹出前通过 back() 读取尾部元素
arr.pop_back();
cout << arr.back() << endl; // => 3

arr[0] = 10;
cout << arr[0] << " " << arr.front() << endl; // => 10 10

// insert 和 erase 接收迭代器 (begin() + index)，时间复杂度为 O(n)
arr.insert(arr.begin() + 1, 7);
arr.erase(arr.begin());
for (int x : arr) cout << x << " ";
cout << endl; // => 7 2 3

// 创建长度为 n 且填充默认值的 vector
vector<int> fives(3, 5);
cout << fives[0] << " " << fives.size() << endl; // => 5 3

// 注意：圆括号 (count, value) 指定大小和默认值，而花括号 {a, b} 是元素列表
vector<int> paren(3, 1), brace{3, 1};
cout << paren.size() << " " << brace.size() << endl; // => 3 2

// 注意：[] 不做边界检查：arr[-1] 或 arr[10] 属于未定义行为（读取垃圾值或程序崩溃）。
// at() 会执行越界检查并在越界时抛出 out_of_range 异常。
// arr.at(10);  // 抛出 out_of_range 异常
cout << arr.at(2) << endl; // => 3

// 注意：size() 返回无符号整型 size_t，因此空容器上 size() - 1 会下溢为一个极大的正数
vector<int> empty;
cout << empty.size() - 1 << endl; // => 18446744073709551615

// ssize()（C++20）返回有符号整数长度
cout << ssize(empty) - 1 << endl; // => -1
```

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> nums = {1, 2, 3, 4};

// 通过迭代器区间 [first, last) 拷贝构建子 vector
vector<int> part(nums.begin() + 1, nums.begin() + 3);
for (int x : part) cout << x << " ";
cout << endl; // => 2 3

// find 返回迭代器；通过与 end() 比较判断元素是否存在（O(n)）
cout << (find(nums.begin(), nums.end(), 3) != nums.end()) << endl; // => 1

// ranges 算法（C++20）可直接接收整个容器对象
cout << ranges::count(nums, 2) << " " << ranges::max(nums) << endl; // => 1 4

// accumulate 对区间求和（来自 <numeric> 头文件）
cout << accumulate(nums.begin(), nums.end(), 0) << endl; // => 10

// 注意：accumulate 的累加类型取决于初始值参数的类型；大数求和务必使用 0LL
vector<int> big = {2'000'000'000, 2'000'000'000};
cout << accumulate(big.begin(), big.end(), 0LL) << endl; // => 4000000000
```

```cpp
#include <iostream>
#include <ranges>
#include <string>
#include <vector>
using namespace std;

vector<int> nums = {10, 20, 30};

// 按索引遍历；将 size() 转换为 int 使有符号比较安全
for (int i = 0; i < (int) nums.size(); i++) cout << nums[i] << " ";
// => 10 20 30

// 按值遍历：每个 x 都是元素的拷贝副本
for (int x : nums) cout << x << " ";
// => 10 20 30

// 按引用遍历：可在循环体中直接修改原 vector 中的元素
for (int& x : nums) {
    x *= 2;
}
cout << nums[0] << endl; // => 20

// 同时遍历索引和元素值（C++23）；低版本可使用经典索引循环
for (auto [i, x] : views::enumerate(nums)) cout << i << " " << x << " ";
// => 0 20 1 40 2 60

// 双数组同步遍历（C++23）；按较短容器的长度截断终止
vector<string> letters = {"a", "b", "c"};
for (auto [x, s] : views::zip(nums, letters)) cout << x << s << " ";
// => 20a 40b 60c
```

```cpp
#include <algorithm>
#include <functional>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

vector<int> nums = {5, 4, 7, 3, 8};

// reverse 与 sort 在 [begin, end) 原地操作
reverse(nums.begin(), nums.end());
for (int x : nums) cout << x << " ";
// => 8 3 7 4 5
sort(nums.begin(), nums.end());
for (int x : nums) cout << x << " ";
// => 3 4 5 7 8

// 降序排序：传入 greater<>() 比较器
sort(nums.begin(), nums.end(), greater<>());
for (int x : nums) cout << x << " ";
// => 8 7 5 4 3

// 自定义排序：Lambda 表达式在 a 应该排在 b 前面时返回 true（先按长度升序，再按字典序）
vector<string> words = {"bob", "alice", "jane", "doe"};
sort(words.begin(), words.end(), [](const string& a, const string& b) {
    if (a.size() != b.size()) {
        return a.size() < b.size();
    }
    return a < b;
});
for (const string& w : words) cout << w << " ";
// => bob doe jane alice

// 注意：比较器必须满足“严格弱序”（严格小于 <）；写成 <= 会导致未定义行为崩溃

// 对 pair 数组按第二项元素排序
vector<pair<int, int>> pairs = {{1, 3}, {2, 1}, {3, 2}};
sort(pairs.begin(), pairs.end(), [](auto& a, auto& b) { return a.second < b.second; });
for (auto [a, b] : pairs) cout << a << "," << b << " ";
// => 2,1 3,2 1,3
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 3 行 4 列的二维 vector，初始全为 0
vector<vector<int>> grid(3, vector<int>(4, 0));
grid[0][0] = 1;
cout << grid[0][0] << " " << grid[1][0] << endl; // => 1 0
cout << grid.size() << " " << grid[0].size() << endl; // => 3 4

// 每一行均为独立对象，不存在 Python 中的行对象共享引用陷阱。
// 同样，push_back 会执行值拷贝，回溯保存路径时直接追加即可，无需手动拷贝。
vector<int> path = {1, 2};
vector<vector<int>> res;
res.push_back(path);
path[0] = 9;
cout << res[0][0] << endl; // => 1

// 定长 C 风格数组：长度必须为编译期常量；= {} 可全部初始化为零
int counts[26] = {};
counts['c' - 'a']++;
cout << counts[2] << endl; // => 1
```

## 字符串

```cpp
#include <iostream>
#include <string>
using namespace std;

string s = "abc";

// [] 获得 char 字符；substr(pos, len) 截取子串
cout << s[0] << " " << s.substr(1) << endl; // => a bc

// 注意：substr 的第二个参数是截取长度（length），而非结束索引
cout << s.substr(1, 1) << endl; // => b

// C++ string 是可变的
s[0] = 'A';
cout << s << endl; // => Abc

// += 原地拼接字符，在循环中追加字符串非常高效
string built;
for (char c : string("abc")) {
    built += toupper(c);
}
cout << built << endl; // => ABC

// 注意：两个字符串字面量属于 C 字符数组，无法直接用 + 拼接
// "a" + "b";  // 编译错误：无效的双目运算符 '+' 操作数
cout << string("a") + "b" << endl; // => ab

// 字符串与数值互转（stoll 转 long long；stoi 解析非法时抛出异常）
cout << stoi("123") + 1 << endl; // => 124
cout << to_string(123) + "4" << endl; // => 1234

// 字符与 ASCII 编码互转：char 本质上是小型整数
cout << (int) 'a' << " " << char('a' + 1) << endl; // => 97 b

// 注意：char + int 表达式的结果类型会被提升为 int
cout << 'a' + 1 << endl; // => 98

// 数字字符转整型数值，以及小写字母在 26 大小数组中的映射索引
cout << '7' - '0' << " " << 'c' - 'a' << endl; // => 7 2

// find 查找子串失败时返回 string::npos
cout << s.find("c") << " " << (s.find("z") == string::npos) << endl; // => 2 1

// 使用 ==、< 等运算符直接按字典序比较字符串
cout << (string("apple") < "banana") << endl; // => 1

// 注意：isdigit、isalpha 等字符判定函数返回非零整数表示真，而非单值 1
cout << s.size() << " " << bool(isdigit('7')) << " " << bool(isalpha('7')) << endl; // => 3 1 0
```

```cpp
#include <algorithm>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

// 利用 stringstream 按空白字符流式切分单词
istringstream in("the quick  brown fox");
vector<string> words;
string word;
while (in >> word) {
    words.push_back(word);
}
cout << words.size() << endl; // => 4

// 使用 getline 的第三个参数按自定义分隔符切分
istringstream csv("a,b,c");
string part;
while (getline(csv, part, ',')) {
    cout << part << " ";
}
cout << endl; // => a b c

// C++ 标准库没有内置 join 函数；通过循环手动拼接
string joined;
for (const string& w : words) joined += (joined.empty() ? "" : "-") + w;
cout << joined << endl; // => the-quick-brown-fox

// reverse 和 sort 可直接作用于 string
string t = "hello";
reverse(t.begin(), t.end());
cout << t << endl; // => olleh
```

## 队列与双端队列

```cpp
#include <deque>
#include <iostream>
#include <queue>
#include <stack>
using namespace std;

// deque 是双端队列：两端插入与删除均为 O(1)
deque<int> dq;
dq.push_back(1);
dq.push_back(2);
dq.push_front(0);

// 查看队头、队尾元素以及大小
cout << dq.front() << " " << dq.back() << " " << dq.size() << endl; // => 0 2 3

// 注意：pop_front 和 pop_back 无返回值，需提前通过 front()/back() 获取元素
dq.pop_front();
dq.pop_back();
cout << dq.front() << " " << dq.size() << endl; // => 1 1

// 注意：在空 deque 上调用 front、back 或 pop 属于未定义行为；调用前务必检查 empty()
dq.pop_back();
cout << dq.empty() << endl; // => 1

// queue 是先进先出（FIFO）适配器：push 在队尾追加，front 和 pop 在队头操作
queue<int> q;
for (int i = 1; i <= 3; i++) {
    q.push(i);
}
while (!q.empty()) {
    cout << q.front() << " ";
    q.pop();
}
// => 1 2 3

// stack 是后进先出（LIFO）容器：push、top、pop 均在栈顶操作
stack<int> st;
st.push(1);
st.push(2);
cout << st.top() << " " << st.size() << endl; // => 2 2
```

## 哈希集合

```cpp
#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

unordered_set<int> seen;
seen.insert(1);
seen.insert(2);

// insert 返回 pair；若元素已存在则 .second 为 false
cout << seen.insert(2).second << endl; // => 0
cout << seen.size() << endl; // => 2

// contains 为 C++20 引入；旧版本使用 count(x)（返回 0 或 1）
cout << seen.contains(1) << " " << seen.count(3) << endl; // => 1 0

// erase 移除指定元素，不存在时不执行任何操作
seen.erase(2);
seen.erase(42);
cout << seen.size() << endl; // => 1

// 从 vector 构造集合
vector<int> nums = {1, 2, 2, 3};
unordered_set<int> unique(nums.begin(), nums.end());
cout << unique.size() << endl; // => 3

// 注意：标准库没有为 pair 提供默认哈希函数，因此 unordered_set<pair<int, int>> 无法直接编译。
// 可改用有序 set<pair<int, int>>，或将二元坐标编码为单一数值 (r * cols + c)。
```

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

// 注意：unordered_set 遍历顺序未指定；set（基于红黑树）则始终保持元素升序排列
set<string> names = {"bob", "alice", "jane"};
for (const string& name : names) cout << name << " ";
// => alice bob jane

// set 还支持 O(log n) 的二分查找：lower_bound(x) 返回首个 >= x 的元素迭代器
set<int> sorted = {1, 4, 9};
cout << *sorted.lower_bound(5) << " " << *sorted.begin() << " " << *sorted.rbegin() << endl; // => 9 1 9
```

## 哈希映射

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

unordered_map<string, int> scores;
scores["alice"] = 88;
scores["bob"] = 77;
cout << scores.size() << endl; // => 2

scores["alice"] = 80;
cout << scores["alice"] << endl; // => 80

cout << scores.contains("alice") << endl; // => 1
scores.erase("alice");
cout << scores.contains("alice") << endl; // => 0

// 注意：对不存在的键使用 [] 会自动插入该键并赋予默认值（如 int 默认值为 0）
cout << scores["zoe"] << " " << scores.size() << endl; // => 0 2

// 若只需读取而不希望意外插入，请使用 find（或在越界时抛出异常的 at()）
auto it = scores.find("bob");
if (it != scores.end()) {
    cout << it->first << " " << it->second << endl; // => bob 77
}
```

```cpp
#include <iostream>
#include <map>
#include <string>
using namespace std;

// 注意：unordered_map 迭代顺序不确定；map 始终保持键按升序排列
map<string, int> scores = {{"bob", 70}, {"alice", 90}};

// 使用结构化绑定同时遍历键与值
for (const auto& [key, val] : scores) cout << key << " " << val << " ";
// => alice 90 bob 70

// 迭代器解引用后为 pair：.first 为键，.second 为值
for (const auto& p : scores) cout << p.second << " ";
// => 90 70
```

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

// 计数：访问不存在的键时 [] 默认从 0 开始，因此直接 ++ 即可
unordered_map<char, int> count;
for (char c : string("banana")) {
    count[c]++;
}
cout << count['a'] << " " << count['n'] << endl; // => 3 2

// 针对小写字母统计频次，使用固定大小数组比哈希映射性能更好
int freq[26] = {};
for (char c : string("banana")) {
    freq[c - 'a']++;
}
cout << freq[0] << " " << freq[1] << endl; // => 3 1

// 分组聚合：首次访问键时 [] 会自动创建空 vector
map<string, vector<string>> groups;
for (string word : {"eat", "tea", "tan"}) {
    string key = word;
    sort(key.begin(), key.end());
    groups[key].push_back(word);
}
cout << groups.size() << " " << groups["aet"][1] << endl; // => 2 tea
```

## 元组

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

// 返回多个值：二元组合使用 pair，更多元素使用 tuple
pair<int, int> minMax(const vector<int>& nums) {
    return {ranges::min(nums), ranges::max(nums)};
}

int main() {
    // 结构化绑定（Structured Binding）解构返回值
    auto [lo, hi] = minMax({3, 1, 4});
    cout << lo << " " << hi << endl; // => 1 4

    // pair 访问 .first 和 .second；tuple 使用 get<i> 获取指定位置元素
    pair<int, string> p = {1, "one"};
    tuple<int, char, double> t = {2, 'x', 0.5};
    cout << p.first << " " << p.second << " " << get<1>(t) << endl; // => 1 one x

    // pair 与 tuple 会逐元素比较大小，因此可直接用作 map 与 set 的键
    set<pair<int, int>> visited = {{0, 1}};
    cout << visited.contains({0, 1}) << endl; // => 1
    map<pair<int, int>, int> dist;
    dist[{0, 1}] = 1;
    cout << dist[{0, 1}] << endl; // => 1

    // 注意：unordered_map 和 unordered_set 默认无法计算 pair 的哈希值（参见哈希集合章节）
}
```

## 堆与优先队列

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// 注意：C++ priority_queue 默认为最大堆（Max-heap，与 Python 的 heapq 最小堆相反）
priority_queue<int> maxHeap;
maxHeap.push(3);
maxHeap.push(1);
maxHeap.push(5);

// top 查看堆顶最大值；pop 弹出堆顶，无返回值
cout << maxHeap.top() << " " << maxHeap.size() << endl; // => 5 3
maxHeap.pop();
cout << maxHeap.top() << endl; // => 3

// 最小堆：第三个模板参数传入 greater<int>
priority_queue<int, vector<int>, greater<int>> minHeap;
for (int x : {3, 1, 2}) {
    minHeap.push(x);
}
while (!minHeap.empty()) {
    cout << minHeap.top() << " ";
    minHeap.pop();
}
// => 1 2 3

// 基于已有 vector 线性时间 O(n) 建堆
vector<int> nums = {5, 1, 8, 3};
priority_queue<int, vector<int>, greater<int>> heap(nums.begin(), nums.end());
cout << heap.top() << endl; // => 1
```

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <string>
#include <vector>
using namespace std;

// pair 默认先比较 first 再比较 second，因此 (priority, value) 形式会按优先级自动排序
priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> tasks;
tasks.push({2, "write"});
tasks.push({1, "plan"});
tasks.push({3, "ship"});
while (!tasks.empty()) {
    auto [priority, name] = tasks.top();
    tasks.pop();
    cout << priority << " " << name << " ";
}
// => 1 plan 2 write 3 ship

// Lambda 自定义比较器：此处按 pair 的第二项升序排序（数值小的先出堆）。
// 注意：优先队列比较逻辑与排序相反：当 a 应该排在 b 后面时返回 true
auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) { return a.second > b.second; };
priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq(cmp);
pq.push({7, 2});
pq.push({8, 1});
pq.push({9, 3});
cout << pq.top().first << endl; // => 8
```

## 引用与指针

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 引用是已有变量的别名
int x = 1;
int& ref = x;
ref = 5;
cout << x << endl; // => 5

// 指针保存变量的内存地址：& 取地址，* 解引用访问对应值
int* p = &x;
*p = 7;
cout << x << " " << *p << endl; // => 7 7

// 注意：auto 会发生对象拷贝；auto& 才会绑定为引用
vector<int> v = {1, 2};
auto copy = v;
copy[0] = 9;
auto& alias = v;
alias[1] = 8;
cout << v[0] << " " << v[1] << endl; // => 1 8

// new 在堆上分配对象并返回其指针，生命周期超出当前局部作用域；
// -> 运算符通过指针访问对象成员
struct Node {
    int val;
};
Node* node = new Node{3};
cout << node->val << endl; // => 3

// new 分配的内存必须用 delete 显式释放（LeetCode 刷题解法通常省略手动释放）
delete node;

// 注意：解引用空指针 nullptr 属于未定义行为（通常导致段错误崩溃）；访问前务必判空
Node* none = nullptr;
cout << (none == nullptr) << endl; // => 1
```

## 函数

```cpp
#include <iostream>
#include <string>
using namespace std;

// 函数必须先声明或定义后才能被调用
int multiply(int n, int m) {
    return n * m;
}

// 参数默认值必须位于参数列表末尾
string greet(const string& name, const string& greeting = "Hello") {
    return greeting + ", " + name + "!";
}

int main() {
    cout << multiply(3, 4) << endl; // => 12
    cout << greet("Ann") << endl; // => Hello, Ann!
    cout << greet("Ann", "Hi") << endl; // => Hi, Ann!
}
```

```cpp
#include <functional>
#include <iostream>
using namespace std;

// Lambda 表达式：[捕获列表](参数列表) { 函数体 }
auto square = [](int x) { return x * x; };
cout << square(5) << endl; // => 25

// [&] 按引用捕获外部变量，允许在 Lambda 内部直接修改外部变量
int total = 0;
auto add = [&](int n) { total += n; };
add(3);
add(4);
cout << total << endl; // => 7

// [=] 按值捕获外部变量的快照副本；后续修改外部原变量不会影响 Lambda
int base = 10;
auto addBase = [=](int n) { return n + base; };
base = 100;
cout << addBase(5) << endl; // => 15

// 注意：Lambda 无法直接通过 auto 变量名递归调用自身。
// 可将其保存在 std::function 中（如下所示），或使用 C++23 的 "this auto self" 语法。
function<int(int)> fib = [&](int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); };
cout << fib(10) << endl; // => 55
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 按值传递：函数会拷贝一份独立副本（会复制整个 vector！）
void byValue(vector<int> v) {
    v.push_back(1);
}

// 按引用传递 (&)：不发生拷贝，且函数内修改对调用方实时可见
void byReference(vector<int>& v) {
    v.push_back(1);
}

// 按常量引用传递 (const &)：避免数据拷贝且禁止修改；适合传递大型只读参数
int sum(const vector<int>& v) {
    int total = 0;
    for (int x : v) {
        total += x;
    }
    return total;
}

int main() {
    vector<int> nums;
    byValue(nums);
    cout << nums.size() << endl; // => 0
    byReference(nums);
    cout << nums.size() << " " << sum(nums) << endl; // => 1 1

    // 注意：在递归函数中若按值传递大型 vector，每次递归都会深拷贝一次，
    // 这是算法题引发运行超时（Time Limit Exceeded）的高频原因
}
```

## 类与数据结构

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// struct 和 class 基本相同，区别仅在于 struct 的成员默认访问权限为 public
class Point {
public:
    int x, y;

    // 带成员初始化列表的构造函数
    Point(int x, int y) : x(x), y(y) {}

    // 参数列表后的 const 表示常量成员函数：该方法保证不修改对象内部状态
    int distSq() const {
        return x * x + y * y;
    }

    // 可选：重载 operator< 允许直接对 Point 排序或用作 set/map 的键
    bool operator<(const Point& other) const {
        return distSq() < other.distSq();
    }
};

// 可选：重载 << 运算符以自定义 cout 输出格式
ostream& operator<<(ostream& os, const Point& p) {
    return os << "Point(" << p.x << ", " << p.y << ")";
}

int main() {
    Point p(3, 4);
    cout << p.distSq() << endl; // => 25
    cout << p << endl; // => Point(3, 4)

    vector<Point> pts = {{2, 2}, {1, 0}};
    sort(pts.begin(), pts.end());
    cout << pts[0] << " " << pts[1] << endl; // => Point(1, 0) Point(2, 2)
}
```

```cpp
#include <iostream>
using namespace std;

// LeetCode 中 C++ 的单链表节点结构
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

int main() {
    // 1 -> 2 -> 3，采用 LeetCode 风格使用 new 分配
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3)));

    // 遍历链表直到末尾（nullptr）
    for (ListNode* node = head; node != nullptr; node = node->next) {
        cout << node->val << " ";
    }
    // => 1 2 3
}
```

```cpp
#include <algorithm>
#include <iostream>
using namespace std;

// LeetCode 中 C++ 的二叉树节点结构
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// 在 LeetCode 上，题目通常要求实现 Solution 类中的公共方法
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) {
            return 0;
        }
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};

// 中序遍历；空子节点表示为 nullptr
void inorder(TreeNode* node) {
    if (node == nullptr) {
        return;
    }
    inorder(node->left);
    cout << node->val << " ";
    inorder(node->right);
}

int main() {
    //     2
    //    / \    （2 为根节点；1 和 3 分别为左、右子节点）
    //   1   3
    TreeNode* root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

    inorder(root); // => 1 2 3
    cout << (root->left->left == nullptr) << endl; // => 1
    cout << Solution().maxDepth(root) << endl; // => 2
}
```
