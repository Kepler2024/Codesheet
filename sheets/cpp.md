# C++ Cheat Sheet

> Written for C++23 (GCC 14)

Use this quick reference to learn or revisit C++ syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```cpp
// Execution starts at main; reaching the end of main returns 0 (success)
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
// using namespace std lets you write cout instead of std::cout. It matches LeetCode's
// signatures (vector<int>& nums), but it's a practice habit: real projects avoid it.
// Most blocks below are just the body of main: put them inside int main() { ... }.
#include <iostream>
using namespace std;

cout << "Hello from main" << endl; // => Hello from main
```

## Variables

```cpp
#include <iostream>
#include <optional>
#include <string>
using namespace std;

// Every variable has a type, and the type never changes
int n = 0;
cout << n << endl; // => 0
// n = "abc";  // compile error: invalid conversion from 'const char*' to 'int'

// auto infers the type from the value
auto count = 3;
auto name = string("alice");  // a bare "alice" would be a C string (const char*)
cout << count << " " << name << endl; // => 3 alice

// Common types: int (32-bit), long long (64-bit), double, bool, char, string
long long big = 4'000'000'000LL;  // ' separates digits; LL makes a long long literal
double ratio = 0.5;
char letter = 'a';
cout << big << " " << ratio << " " << letter << endl; // => 4000000000 0.5 a

// CAREFUL: bools print as 1 and 0 unless you send boolalpha first
bool done = false;
cout << done << " " << boolalpha << done << endl; // => 0 false

// const can't be changed after initialization
const int limit = 100;
// limit = 200;  // compile error: assignment of read-only variable 'limit'

// CAREFUL: a local int without an initializer holds garbage; {} zero-initializes
// int bad;  // reading it is undefined behavior
int zero{};
cout << zero << endl; // => 0

// Swap
int a = 1, b = 2;
swap(a, b);
cout << a << " " << b << endl; // => 2 1

// Increment
n++;
n += 2;
cout << n << endl; // => 3

// nullptr is the null pointer; optional<T> is a value that may be missing
int* p = nullptr;
optional<int> found;
cout << (p == nullptr) << " " << found.has_value() << " " << found.value_or(-1) << endl; // => true false -1
found = 42;
cout << *found << endl; // => 42
```

## If-statements

```cpp
#include <iostream>
#include <string>
using namespace std;

// Parentheses around the condition are required
int n = 1;
if (n > 2) {
    n--;
} else if (n == 2) {
    n *= 2;
} else {
    n += 2;
}
cout << n << endl; // => 3

// Logical operators: && (and), || (or), ! (not)
int m = 5;
if (n > 0 && m > 0) {
    cout << "both" << endl; // => both
}
cout << boolalpha << !true << " " << (true || false) << endl; // => false true

// CAREFUL: any non-zero number, and any non-null pointer, counts as true
if (n) cout << "non-zero" << endl; // => non-zero

// CAREFUL: = in a condition assigns instead of comparing (-Wall warns)
// if (n = 5) { }  // always true, and n is now 5

// Ternary operator
string parity = n % 2 == 0 ? "even" : "odd";
cout << parity << endl; // => odd

// switch works on integers and chars.
// CAREFUL: without break, execution falls through into the next case
switch (n) {
    case 3: cout << "three" << endl; // => three
    case 4: cout << "four" << endl; // => four
        break;
    default: cout << "other" << endl;
}
```

## Loops

```cpp
#include <iostream>
using namespace std;

int n = 0;
while (n < 3) {
    cout << n << " ";
    n++;
}
// => 0 1 2

// i = 0 to 4
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
// => 0 1 2 3 4

// i = 2 to 5
for (int i = 2; i <= 5; i++) {
    cout << i << " ";
}
// => 2 3 4 5

// i = 5 down to 2
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

// C++ has no labeled break: to leave nested loops, use a flag,
// or move the loops into a function and return
```

## Math

```cpp
#include <cmath>
#include <climits>
#include <iostream>
#include <limits>
using namespace std;

// / on two integers is integer division
cout << 5 / 2 << " " << 5 / 2.0 << endl; // => 2 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
cout << -3 / 2 << endl; // => -1

// CAREFUL: % takes the sign of the dividend (Python gives 2)
cout << -10 % 3 << endl; // => -1

// A modulo that is never negative, e.g. for wrapping an index around
cout << (-10 % 3 + 3) % 3 << endl; // => 2

// <cmath> functions return double
cout << floor(-1.5) << " " << ceil(-1.5) << endl; // => -2 -1
cout << sqrt(16) << " " << pow(2, 10) << " " << abs(-7) << endl; // => 4 1024 7

// CAREFUL: cout shows large doubles in scientific notation; convert to an integer type
cout << pow(10, 8) << " " << (long long) pow(10, 8) << endl; // => 1e+08 100000000

// max and min; the {} form takes any number of values
cout << max(3, 8) << " " << min({3, 8, 1}) << endl; // => 8 1
// CAREFUL: both arguments must have the same type
// max(1, 2LL);  // compile error: no matching function for call to 'max(int, long long int)'

// Limits and infinity
cout << INT_MAX << " " << INT_MIN << endl; // => 2147483647 -2147483648
cout << LLONG_MAX << endl; // => 9223372036854775807
cout << numeric_limits<double>::infinity() << endl; // => inf

// CAREFUL: signed overflow is undefined behavior, not a guaranteed wrap.
// Widen to long long BEFORE multiplying when the product may not fit.
int side = 50'000;
cout << 1LL * side * side << endl; // => 2500000000

// Unsigned arithmetic is defined to wrap around
unsigned int u = 0;
u--;
cout << u << endl; // => 4294967295
```

## Output and Input

```cpp
#include <cstdio>
#include <iomanip>
#include <iostream>
#include <print>
#include <vector>
using namespace std;

// cout chains values with <<, adding nothing between them
cout << "a" << 1 << endl; // => a1
cout << "a " << 1 << " " << 2.5 << endl; // => a 1 2.5

// '\n' ends a line; endl also flushes, which is slow inside big loops
cout << "line" << '\n'; // => line

// A fixed number of decimal places (this setting sticks for later output)
cout << fixed << setprecision(2) << 3.14159 << '\n'; // => 3.14

// printf from C still works
printf("%s scored %d\n", "alice", 90); // => alice scored 90

// C++23's println formats like Python's str.format
println("{} scored {}", "bob", 85); // => bob scored 85

// There's no built-in way to print a vector; loop over it
vector<int> nums = {1, 2, 3};
for (int x : nums) cout << x << ' ';
cout << '\n'; // => 1 2 3
// cout << nums;  // compile error
```

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Make cin and cout faster for big inputs (then don't mix them with scanf/printf)
ios::sync_with_stdio(false);
cin.tie(nullptr);

// >> skips whitespace, including line breaks
int n;
cin >> n;
vector<int> nums(n);
for (int& x : nums) {
    cin >> x;
}

// getline reads a whole line. CAREFUL: >> leaves the newline behind;
// cin >> ws skips it, otherwise getline returns an empty line
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

// Read numbers until the input runs out: >> fails at the end, ending the loop
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

## Arrays

```cpp
#include <iostream>
#include <vector>
using namespace std;

// vector is the dynamic array
vector<int> arr = {1, 2, 3};
cout << arr.size() << endl; // => 3

// Use it as a stack: push_back and pop_back at the end are O(1)
arr.push_back(4);
cout << arr.back() << endl; // => 4

// CAREFUL: pop_back returns nothing, so read back() first
arr.pop_back();
cout << arr.back() << endl; // => 3

arr[0] = 10;
cout << arr[0] << " " << arr.front() << endl; // => 10 10

// insert and erase take an iterator (begin() + index) and are O(n)
arr.insert(arr.begin() + 1, 7);
arr.erase(arr.begin());
for (int x : arr) cout << x << " ";
cout << endl; // => 7 2 3

// A vector of size n filled with a default value
vector<int> fives(3, 5);
cout << fives[0] << " " << fives.size() << endl; // => 5 3

// CAREFUL: parentheses mean (count, value), but braces list the elements
vector<int> paren(3, 1), brace{3, 1};
cout << paren.size() << " " << brace.size() << endl; // => 3 2

// CAREFUL: [] doesn't check bounds: arr[-1] or arr[10] is undefined behavior
// (garbage or a crash). at() checks and throws out_of_range.
// arr.at(10);  // throws out_of_range
cout << arr.at(2) << endl; // => 3

// CAREFUL: size() is unsigned, so size() - 1 on an empty vector is huge, not -1
vector<int> empty;
cout << empty.size() - 1 << endl; // => 18446744073709551615

// ssize() (C++20) returns a signed size
cout << ssize(empty) - 1 << endl; // => -1
```

```cpp
#include <algorithm>
#include <iostream>
#include <numeric>
#include <vector>
using namespace std;

vector<int> nums = {1, 2, 3, 4};

// A sub-vector is a copy built from two iterators, [first, last)
vector<int> part(nums.begin() + 1, nums.begin() + 3);
for (int x : part) cout << x << " ";
cout << endl; // => 2 3

// find returns an iterator; compare it with end() to test membership (O(n))
cout << (find(nums.begin(), nums.end(), 3) != nums.end()) << endl; // => 1

// The ranges versions (C++20) take the whole container
cout << ranges::count(nums, 2) << " " << ranges::max(nums) << endl; // => 1 4

// accumulate sums a range (from <numeric>)
cout << accumulate(nums.begin(), nums.end(), 0) << endl; // => 10

// CAREFUL: accumulate adds in the type of its initial value; use 0LL for big sums
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

// By index; cast size() to int so i < n compares signed with signed
for (int i = 0; i < (int) nums.size(); i++) cout << nums[i] << " ";
// => 10 20 30

// By value: each x is a copy
for (int x : nums) cout << x << " ";
// => 10 20 30

// By reference: changes go into the vector
for (int& x : nums) {
    x *= 2;
}
cout << nums[0] << endl; // => 20

// Index and value together (C++23); otherwise use the index loop
for (auto [i, x] : views::enumerate(nums)) cout << i << " " << x << " ";
// => 0 20 1 40 2 60

// Two vectors in lockstep (C++23); stops at the shorter one
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

// reverse and sort work in place on a [begin, end) range
reverse(nums.begin(), nums.end());
for (int x : nums) cout << x << " ";
// => 8 3 7 4 5
sort(nums.begin(), nums.end());
for (int x : nums) cout << x << " ";
// => 3 4 5 7 8

// Descending: pass greater<>() as the comparator
sort(nums.begin(), nums.end(), greater<>());
for (int x : nums) cout << x << " ";
// => 8 7 5 4 3

// Custom order: a lambda that returns true when a goes before b (by length, then alphabetically)
vector<string> words = {"bob", "alice", "jane", "doe"};
sort(words.begin(), words.end(), [](const string& a, const string& b) {
    if (a.size() != b.size()) {
        return a.size() < b.size();
    }
    return a < b;
});
for (const string& w : words) cout << w << " ";
// => bob doe jane alice

// CAREFUL: the comparator must be a strict "less than"; <= is undefined behavior

// Sort pairs by their second element
vector<pair<int, int>> pairs = {{1, 3}, {2, 1}, {3, 2}};
sort(pairs.begin(), pairs.end(), [](auto& a, auto& b) { return a.second < b.second; });
for (auto [a, b] : pairs) cout << a << "," << b << " ";
// => 2,1 3,2 1,3
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// 2-D vector with 3 rows and 4 columns, filled with 0
vector<vector<int>> grid(3, vector<int>(4, 0));
grid[0][0] = 1;
cout << grid[0][0] << " " << grid[1][0] << endl; // => 1 0
cout << grid.size() << " " << grid[0].size() << endl; // => 3 4

// Every row is a separate copy, so there's no shared-row trap as in Python.
// Likewise, push_back copies a vector, so a saved backtracking path won't change later.
vector<int> path = {1, 2};
vector<vector<int>> res;
res.push_back(path);
path[0] = 9;
cout << res[0][0] << endl; // => 1

// Fixed-size C arrays: the size must be a constant; = {} zero-fills them
int counts[26] = {};
counts['c' - 'a']++;
cout << counts[2] << endl; // => 1
```

## Strings

```cpp
#include <iostream>
#include <string>
using namespace std;

string s = "abc";

// [] gives a char; substr(pos, len) gives a string
cout << s[0] << " " << s.substr(1) << endl; // => a bc

// CAREFUL: substr's second argument is a length, not an end index
cout << s.substr(1, 1) << endl; // => b

// Strings are mutable
s[0] = 'A';
cout << s << endl; // => Abc

// += appends in place, so building a string in a loop is efficient
string built;
for (char c : string("abc")) {
    built += toupper(c);
}
cout << built << endl; // => ABC

// CAREFUL: two string literals are C arrays, and + doesn't work on them
// "a" + "b";  // compile error: invalid operands to binary 'operator+'
cout << string("a") + "b" << endl; // => ab

// String <-> number (stoll for long long; stoi throws on bad input)
cout << stoi("123") + 1 << endl; // => 124
cout << to_string(123) + "4" << endl; // => 1234

// Char <-> code: a char is a small integer
cout << (int) 'a' << " " << char('a' + 1) << endl; // => 97 b

// CAREFUL: char + int is an int
cout << 'a' + 1 << endl; // => 98

// Digit to number, and a letter's index into a 26-element array
cout << '7' - '0' << " " << 'c' - 'a' << endl; // => 7 2

// find returns string::npos when the substring is missing
cout << s.find("c") << " " << (s.find("z") == string::npos) << endl; // => 2 1

// Comparison with ==, < and so on is lexicographic
cout << (string("apple") < "banana") << endl; // => 1

// CAREFUL: isdigit, isalpha and friends return some non-zero int for true, not 1
cout << s.size() << " " << bool(isdigit('7')) << " " << bool(isalpha('7')) << endl; // => 3 1 0
```

```cpp
#include <algorithm>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

// Split on whitespace by reading words from a stringstream
istringstream in("the quick  brown fox");
vector<string> words;
string word;
while (in >> word) {
    words.push_back(word);
}
cout << words.size() << endl; // => 4

// Split on another delimiter with getline's third argument
istringstream csv("a,b,c");
string part;
while (getline(csv, part, ',')) {
    cout << part << " ";
}
cout << endl; // => a b c

// There's no join; build the string yourself
string joined;
for (const string& w : words) joined += (joined.empty() ? "" : "-") + w;
cout << joined << endl; // => the-quick-brown-fox

// reverse and sort work on strings like on vectors
string t = "hello";
reverse(t.begin(), t.end());
cout << t << endl; // => olleh
```

## Queues

```cpp
#include <deque>
#include <iostream>
#include <queue>
#include <stack>
using namespace std;

// deque is a double-ended queue: O(1) at both ends
deque<int> dq;
dq.push_back(1);
dq.push_back(2);
dq.push_front(0);

// Peek at the front and the back, and the size
cout << dq.front() << " " << dq.back() << " " << dq.size() << endl; // => 0 2 3

// CAREFUL: pop_front and pop_back return nothing, so read the value first
dq.pop_front();
dq.pop_back();
cout << dq.front() << " " << dq.size() << endl; // => 1 1

// CAREFUL: front, back and pop on an empty deque are undefined behavior; check empty()
dq.pop_back();
cout << dq.empty() << endl; // => 1

// queue is a FIFO wrapper: push at the back, front and pop at the front
queue<int> q;
for (int i = 1; i <= 3; i++) {
    q.push(i);
}
while (!q.empty()) {
    cout << q.front() << " ";
    q.pop();
}
// => 1 2 3

// stack is LIFO: push, top, pop
stack<int> st;
st.push(1);
st.push(2);
cout << st.top() << " " << st.size() << endl; // => 2 2
```

## HashSets

```cpp
#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

unordered_set<int> seen;
seen.insert(1);
seen.insert(2);

// insert returns a pair; .second is false if the item was already there
cout << seen.insert(2).second << endl; // => 0
cout << seen.size() << endl; // => 2

// contains is C++20; older code uses count(x), which returns 0 or 1
cout << seen.contains(1) << " " << seen.count(3) << endl; // => 1 0

// erase does nothing if the item is missing
seen.erase(2);
seen.erase(42);
cout << seen.size() << endl; // => 1

// Build from a vector
vector<int> nums = {1, 2, 2, 3};
unordered_set<int> unique(nums.begin(), nums.end());
cout << unique.size() << endl; // => 3

// CAREFUL: there's no hash for pair, so unordered_set<pair<int, int>> doesn't compile.
// Use set<pair<int, int>>, or encode the pair as one number (r * cols + c).
```

```cpp
#include <iostream>
#include <set>
#include <string>
using namespace std;

// CAREFUL: an unordered_set's iteration order is unspecified; set keeps items sorted
set<string> names = {"bob", "alice", "jane"};
for (const string& name : names) cout << name << " ";
// => alice bob jane

// set also finds neighbors in O(log n): lower_bound(x) is the first item >= x
set<int> sorted = {1, 4, 9};
cout << *sorted.lower_bound(5) << " " << *sorted.begin() << " " << *sorted.rbegin() << endl; // => 9 1 9
```

## HashMaps

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

// CAREFUL: [] on a missing key INSERTS it with a default value (0)
cout << scores["zoe"] << " " << scores.size() << endl; // => 0 2

// To read without inserting, use find (or at(), which throws out_of_range)
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

// CAREFUL: an unordered_map's iteration order is unspecified; map keeps keys sorted
map<string, int> scores = {{"bob", 70}, {"alice", 90}};

// Keys and values together, with a structured binding
for (const auto& [key, val] : scores) cout << key << " " << val << " ";
// => alice 90 bob 70

// Each element is a pair: .first is the key, .second the value
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

// Counting: [] starts a missing key at 0, so ++ just works
unordered_map<char, int> count;
for (char c : string("banana")) {
    count[c]++;
}
cout << count['a'] << " " << count['n'] << endl; // => 3 2

// For lowercase letters, a plain array is faster than a map
int freq[26] = {};
for (char c : string("banana")) {
    freq[c - 'a']++;
}
cout << freq[0] << " " << freq[1] << endl; // => 3 1

// Grouping: [] creates an empty vector on first access
map<string, vector<string>> groups;
for (string word : {"eat", "tea", "tan"}) {
    string key = word;
    sort(key.begin(), key.end());
    groups[key].push_back(word);
}
cout << groups.size() << " " << groups["aet"][1] << endl; // => 2 tea
```

## Tuples

```cpp
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <tuple>
#include <vector>
using namespace std;

// Return several values as a pair (two) or a tuple (any number)
pair<int, int> minMax(const vector<int>& nums) {
    return {ranges::min(nums), ranges::max(nums)};
}

int main() {
    // A structured binding unpacks them
    auto [lo, hi] = minMax({3, 1, 4});
    cout << lo << " " << hi << endl; // => 1 4

    // .first and .second for pairs; get<i> for tuples
    pair<int, string> p = {1, "one"};
    tuple<int, char, double> t = {2, 'x', 0.5};
    cout << p.first << " " << p.second << " " << get<1>(t) << endl; // => 1 one x

    // pairs and tuples compare element by element, so they work as map and set keys
    set<pair<int, int>> visited = {{0, 1}};
    cout << visited.contains({0, 1}) << endl; // => 1
    map<pair<int, int>, int> dist;
    dist[{0, 1}] = 1;
    cout << dist[{0, 1}] << endl; // => 1

    // CAREFUL: unordered_map and unordered_set can't hash a pair (see HashSets)
}
```

## Heaps

```cpp
#include <functional>
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

// CAREFUL: priority_queue is a MAX-heap by default (Python's heapq is a min-heap)
priority_queue<int> maxHeap;
maxHeap.push(3);
maxHeap.push(1);
maxHeap.push(5);

// top peeks; pop removes and returns nothing
cout << maxHeap.top() << " " << maxHeap.size() << endl; // => 5 3
maxHeap.pop();
cout << maxHeap.top() << endl; // => 3

// Min-heap: give greater<int> as the third template argument
priority_queue<int, vector<int>, greater<int>> minHeap;
for (int x : {3, 1, 2}) {
    minHeap.push(x);
}
while (!minHeap.empty()) {
    cout << minHeap.top() << " ";
    minHeap.pop();
}
// => 1 2 3

// Build from a vector in O(n)
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

// Pairs compare by first, then second, so (priority, value) pairs order by priority
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

// A lambda comparator, here ordering pairs by their second element (smallest first).
// CAREFUL: it's backwards: return true when a should come out AFTER b
auto cmp = [](const pair<int, int>& a, const pair<int, int>& b) { return a.second > b.second; };
priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq(cmp);
pq.push({7, 2});
pq.push({8, 1});
pq.push({9, 3});
cout << pq.top().first << endl; // => 8
```

## References and Pointers

```cpp
#include <iostream>
#include <vector>
using namespace std;

// A reference is another name for an existing variable
int x = 1;
int& ref = x;
ref = 5;
cout << x << endl; // => 5

// A pointer holds an address: & takes one, * follows it
int* p = &x;
*p = 7;
cout << x << " " << *p << endl; // => 7 7

// CAREFUL: auto makes a copy; auto& makes a reference
vector<int> v = {1, 2};
auto copy = v;
copy[0] = 9;
auto& alias = v;
alias[1] = 8;
cout << v[0] << " " << v[1] << endl; // => 1 8

// new creates an object that outlives the current scope and returns a pointer to it;
// -> reaches a member through a pointer
struct Node {
    int val;
};
Node* node = new Node{3};
cout << node->val << endl; // => 3

// Memory from new must be released with delete (LeetCode solutions often skip it)
delete node;

// CAREFUL: following nullptr is undefined behavior (usually a crash); check first
Node* none = nullptr;
cout << (none == nullptr) << endl; // => 1
```

## Functions

```cpp
#include <iostream>
#include <string>
using namespace std;

// A function must be declared before it is called
int multiply(int n, int m) {
    return n * m;
}

// Default arguments go at the end
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

// A lambda: [captures](parameters) { body }
auto square = [](int x) { return x * x; };
cout << square(5) << endl; // => 25

// [&] captures outer variables by reference, so the lambda can change them
int total = 0;
auto add = [&](int n) { total += n; };
add(3);
add(4);
cout << total << endl; // => 7

// [=] captures copies; changing the original later doesn't affect the lambda
int base = 10;
auto addBase = [=](int n) { return n + base; };
base = 100;
cout << addBase(5) << endl; // => 15

// CAREFUL: a lambda can't call itself by name. Store it in a std::function
// (as here), or use C++23's "this auto self" parameter.
function<int(int)> fib = [&](int n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); };
cout << fib(10) << endl; // => 55
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

// By value: the function gets its own copy (of the whole vector!)
void byValue(vector<int> v) {
    v.push_back(1);
}

// By reference (&): no copy, and changes are visible to the caller
void byReference(vector<int>& v) {
    v.push_back(1);
}

// By const reference: no copy and no changes; use it for large read-only inputs
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

    // CAREFUL: passing a large vector by value in a recursive call copies it
    // every time, a common cause of Time Limit Exceeded
}
```

## Classes

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

// struct and class are the same, except a struct's members are public by default
class Point {
public:
    int x, y;

    // Constructor with a member initializer list
    Point(int x, int y) : x(x), y(y) {}

    // const after the parameters: this method doesn't change the object
    int distSq() const {
        return x * x + y * y;
    }

    // Optional: operator< lets you sort Points or use them as set or map keys
    bool operator<(const Point& other) const {
        return distSq() < other.distSq();
    }
};

// Optional: how a Point prints with cout
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

// LeetCode's linked list node for C++
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

int main() {
    // 1 -> 2 -> 3, built with new as on LeetCode
    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3)));

    // Walk the list until the end (nullptr)
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

// LeetCode's binary tree node for C++
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

// On LeetCode you complete a public method of class Solution
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) {
            return 0;
        }
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};

// In-order traversal; a missing child is nullptr
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
    //    / \    (2 is the root; 1 and 3 are its children)
    //   1   3
    TreeNode* root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

    inorder(root); // => 1 2 3
    cout << (root->left->left == nullptr) << endl; // => 1
    cout << Solution().maxDepth(root) << endl; // => 2
}
```
