# C++ Cheat Sheet

> Written for C++23 (GCC 14)

Use this quick reference to learn or revisit C++ syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```cpp
#include <iostream>
using namespace std;

int main() {
    // CAREFUL: using namespace std is convenient for practice. Qualify names in production headers.
    // Execution starts at main. Reaching its closing brace returns success.
    cout << "hello\n"; // => hello
}
```

```bash
g++ -std=c++23 main.cpp -o main
./main
```

## Variables

```cpp
#include <iostream>
#include <optional>
#include <string>
#include <utility>
using namespace std;

int main() {
    auto steps = 1;
    const int limit = 3;
    long long cost = 4'000'000'000LL;
    double ratio = 0.5;
    char letter = 'a';
    string name = "grid";
    optional<int> parent;
    steps++;
    cout << steps << ' ' << limit << ' ' << cost << ' ' << ratio << '\n'; // => 2 3 4000000000 0.5
    cout << letter << ' ' << name << ' ' << parent.value_or(-1) << '\n'; // => a grid -1
    int a = 1, b = 2;
    swap(a, b);
    cout << a << ' ' << b << '\n'; // => 2 1
}
```

## If-statements

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 7;
    if (x <= 0) {
        cout << "low";
    } else if (x < 10 && x != 5) {
        cout << "middle"; // => middle
    } else {
        cout << "high";
    }
    cout << ' ' << (x % 2 ? "odd" : "even") << '\n'; // => odd
    cout << boolalpha << !(x < 1 || x > 9) << '\n'; // => true
}
```

## Loops

```cpp
#include <iostream>
using namespace std;

int main() {
    int n = 2;
    while (n > 0) cout << n-- << ' ';
    // => 2 1
    for (int i = 0; i < 5; ++i) {
        if (i == 1) continue;
        if (i == 4) break;
        cout << i << ' ';
    }
    // => 0 2 3
    for (int i = 2; i <= 4; ++i) cout << i << ' ';
    // => 2 3 4
    for (int i = 4; i >= 2; --i) cout << i << ' ';
    // => 4 3 2
}
```

## Math

```cpp
#include <iostream>
#include <cmath>
#include <limits>
#include <cstdint>
using namespace std;

int main() {
    // CAREFUL: integer division truncates toward zero. Remainders follow the dividend.
    cout << -3 / 2 << ' ' << -3 / 2.0 << ' ' << -10 % 3 << '\n'; // => -1 -1.5 -1
    cout << floor(-1.5) << ' ' << ceil(-1.5) << ' ' << sqrt(9) << '\n'; // => -2 -1 3
    cout << pow(2, 5) << ' ' << abs(-5) << '\n'; // => 32 5
    cout << numeric_limits<int32_t>::min() << ' ' << numeric_limits<int32_t>::max() << '\n'; // => -2147483648 2147483647
    cout << boolalpha << isinf(numeric_limits<double>::infinity()) << '\n'; // => true
    // CAREFUL: signed overflow is undefined. Widen an operand before multiplying.
    int side = 50'000;
    cout << 1LL * side * side << '\n'; // => 2500000000
    unsigned int top = numeric_limits<unsigned int>::max();
    cout << top + 1U << '\n'; // => 0
}
```

## Output and Input

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string title;
    getline(cin, title);
    cout << title << '\n'; // => case one
    int n;
    cin >> n;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        int x;
        cin >> x;
        sum += x;
    }
    cout << n << ' ' << sum << '\n'; // => 3 9
}
```

```text stdin
case one
3
2 3
4
```

## Arrays

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <stdexcept>
#include <iterator>
using namespace std;

int main() {
    vector<int> nums(3, 0);
    nums[1] = 4;
    nums.push_back(9);
    cout << nums.back() << ' '; // => 9
    nums.pop_back();
    cout << nums.size() << ' ' << nums.at(1) << '\n'; // => 3 4
    // CAREFUL: [] is unchecked. at() checks bounds, including converted negative indices.
    try {
        nums.at(-1);
    } catch (const out_of_range&) {
        cout << "out of range\n"; // => out of range
    }
    vector<int> middle(nums.begin() + 1, nums.end());
    for (auto x : middle) cout << x << ' ';
    // => 4 0
    vector<int> empty;
    // CAREFUL: size() is unsigned. Use ssize() before subtracting.
    cout << boolalpha << (empty.size() - 1 > empty.size()) << ' ' << ssize(empty) - 1 << '\n'; // => true -1
    for (int i = 0; i < ssize(nums); ++i) cout << i << ' ';
    // => 0 1 2
    for (int i = 0; i < ssize(nums); ++i) cout << i << '=' << nums[i] << ' ';
    // => 0=0 1=4 2=0
    vector<int> weights{2, 3};
    for (size_t i = 0; i < min(nums.size(), weights.size()); ++i)
        cout << nums[i] * weights[i] << ' ';
    // => 0 12
}
```

```cpp
#include <iostream>
#include <algorithm>
#include <functional>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<int> nums{4, 1, 3};
    ranges::reverse(nums);
    for (auto x : nums) cout << x << ' ';
    // => 3 1 4
    ranges::sort(nums);
    for (auto x : nums) cout << x << ' ';
    // => 1 3 4
    ranges::sort(nums, greater<>{});
    for (auto x : nums) cout << x << ' ';
    // => 4 3 1
    vector<string> words{"four", "to", "a"};
    ranges::sort(words, {}, &string::size);
    for (const auto& w : words) cout << w << ' ';
    // => a to four
    vector<vector<int>> grid(2, vector<int>(3, 0));
    grid[0][0] = 7;
    cout << grid[1][0] << '\n'; // => 0
}
```

## Strings

```cpp
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
using namespace std;

int main() {
    string s = "code";
    cout << s[0] << ' ' << s.substr(1, 2) << '\n'; // => c od
    s[0] = 'C';
    cout << s + "!" << '\n'; // => Code!
    // reserve avoids repeated growth when the final length is known.
    string result;
    result.reserve(3);
    for (char c : string("abc")) result.push_back(c);
    cout << result << ' ' << stoi("41") + 1 << ' ' << to_string(41) + "2" << '\n'; // => abc 42 412
    cout << static_cast<int>('a') << ' ' << static_cast<char>(98) << '\n'; // => 97 b
    istringstream input("one  two");
    string word, joined;
    while (input >> word) {
        if (!joined.empty()) joined += '-';
        joined += word;
    }
    cout << joined << ' ' << boolalpha << (string("ant") < "bee") << '\n'; // => one-two true
}
```

## Queues

```cpp
#include <iostream>
#include <deque>
using namespace std;

int main() {
    deque<int> q;
    q.push_back(2);
    q.push_front(1);
    cout << q.front() << ' ' << q.back() << ' ' << q.size() << '\n'; // => 1 2 2
    q.pop_front();
    cout << q.back() << ' '; // => 2
    q.pop_back();
    cout << boolalpha << q.empty() << '\n'; // => true
}
```

## HashSets

```cpp
#include <iostream>
#include <unordered_set>
#include <vector>
using namespace std;

int main() {
    vector<int> nums{2, 3, 2};
    unordered_set<int> seen(nums.begin(), nums.end());
    seen.insert(5);
    seen.erase(3);
    int sum = 0;
    for (int x : seen) sum += x;
    cout << boolalpha << seen.contains(2) << ' ' << seen.size() << ' ' << sum << '\n'; // => true 2 7
}
```

## HashMaps

```cpp
#include <iostream>
#include <unordered_map>
#include <string>
#include <ranges>
using namespace std;

int main() {
    unordered_map<char, int> count;
    count['x'] = 4;
    count['x'] = 5;
    cout << count.at('x') << ' ' << count.contains('x') << '\n'; // => 5 1
    count.erase('x');
    // CAREFUL: operator[] inserts a missing key with a value-initialized count.
    cout << count['z'] << ' ' << count.size() << '\n'; // => 0 1
    count.erase('z');
    for (char c : string("aba")) ++count[c];
    int keys = 0, total = 0, weighted = 0;
    for (char c : count | views::keys) keys += (c >= 'a');
    for (int n : count | views::values) total += n;
    for (auto [c, n] : count) weighted += (c - 'a' + 1) * n;
    cout << keys << ' ' << total << ' ' << weighted << '\n'; // => 2 3 4
}
```

## Tuples

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <map>
#include <utility>
using namespace std;

pair<int, int> bounds(const vector<int>& nums) {
    auto [lo, hi] = ranges::minmax(nums);
    return {lo, hi};
}

int main() {
    auto [lo, hi] = bounds({4, 1, 7});
    cout << lo << ' ' << hi << '\n'; // => 1 7
    // pair has lexicographic ordering. map accepts it directly as a coordinate key.
    map<pair<int, int>, int> distance;
    distance[{2, 3}] = 5;
    cout << distance.at({2, 3}) << '\n'; // => 5
}
```

## Heaps

```cpp
#include <iostream>
#include <queue>
#include <vector>
#include <functional>
#include <utility>
using namespace std;

int main() {
    vector<int> nums{5, 2, 3};
    // CAREFUL: priority_queue exposes the largest element by default.
    priority_queue<int> largest(nums.begin(), nums.end());
    cout << largest.top() << '\n'; // => 5
    priority_queue<int, vector<int>, greater<int>> smallest(nums.begin(), nums.end());
    smallest.push(1);
    cout << smallest.top() << ' '; // => 1
    smallest.pop();
    cout << smallest.top() << ' ' << smallest.size() << '\n'; // => 2 3
    using Job = pair<char, int>;
    auto later = [](Job a, Job b) { return a.second > b.second; };
    priority_queue<Job, vector<Job>, decltype(later)> jobs(later);
    jobs.emplace('A', 3);
    jobs.emplace('B', 1);
    cout << jobs.top().first << '\n'; // => B
}
```

## References and Pointers

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 1;
    int& alias = x;
    int* ptr = &x;
    alias = 3;
    cout << *ptr << '\n'; // => 3
    ptr = nullptr;
    cout << boolalpha << (ptr == nullptr) << '\n'; // => true
}
```

## Functions

```cpp
#include <iostream>
#include <vector>
using namespace std;

int changeCopy(vector<int> nums) {
    nums = {9};
    return nums.front();
}
void append(vector<int>& nums, int x) {
    nums.push_back(x);
}

int main() {
    vector<int> nums{1};
    append(nums, 2);
    cout << changeCopy(nums) << ' ' << nums.front() << ' ' << nums.size() << '\n'; // => 9 1 2
    int total = 0;
    auto add = [&total](int n) { return total += n; };
    cout << add(3) << ' ' << add(4) << '\n'; // => 3 7
}
```

## Classes

```cpp
#include <iostream>
using namespace std;

class Point {
    int x, y;
public:
    Point(int x, int y) : x(x), y(y) {}
    int distSq() const { return x * x + y * y; }
};

int main() {
    Point p(3, 4);
    cout << p.distSq() << '\n'; // => 25
}
```

```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
void inorder(const TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val << ' ';
    inorder(node->right);
}

int main() {
    // The nodes live until main returns. Links point to those existing objects.
    ListNode tail(2), head(1, &tail);
    for (auto p = &head; p; p = p->next) cout << p->val << ' ';
    // => 1 2
    TreeNode left(1), right(3), root(2, &left, &right);
    inorder(&root); // => 1 2 3
    cout << boolalpha << (root.left->right == nullptr) << '\n'; // => true
}
```
