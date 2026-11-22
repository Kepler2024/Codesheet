# Python 速查表

> 针对 Python 3.14 编写

使用本速查表快速学习或翻查 Python 核心语法与常用数据结构。示例中 `# =>` 标注了预期输出。

## 运行程序

```python
# 文件即程序，从上到下逐行执行；无需定义 main() 入口
print("Hello, World!")  # => Hello, World!
```

```bash
python3 hello.py
```

```python
# 常见工程约定：将入口逻辑写在 main() 中，
# 仅在文件被直接执行而非被其他模块导入时才调用
def main():
    print("Hello from main")

if __name__ == "__main__":
    main()  # => Hello from main
```

## 变量

```python
# 动态类型：无需显式声明变量及其类型
n = 0
print(n)  # => 0

# 同一个变量名之后可以重新绑定其他类型的值
n = "abc"
print(n)  # => abc

# 多重赋值，无需临时变量即可直接交换两数
a, b = 1, 2
a, b = b, a
print(a, b)  # => 2 1

# 自增（Python 没有 ++ 或 -- 运算符）
n = 5
n += 1
# n++  # 语法错误
print(n)  # => 6

# None 是 Python 中的空值（相当于 null / nil）
x = None
print(x is None)  # => True

# 类型注解（如 LeetCode 函数签名中的类型标注）仅供文档与静态检查，运行时不强制校验
count: int = 3
count = "three"
print(count)  # => three

# Python 没有内置常数语法；全大写变量名仅为团队命名规范约定
MAX_SIZE = 100
```

## 条件语句

```python
# 无需圆括号或大括号：以冒号结尾，下一行缩进代码块
n = 1
if n > 2:
    n -= 1
elif n == 2:
    n *= 2
else:
    n += 2
print(n)  # => 3

# 逻辑运算符为英文单词：and、or、not（而非 &&、||、!）
m = 5
if n > 0 and m > 0:
    print("both")  # => both
print(not True, True or False)  # => False True

# 长条件可用圆括号包裹以便跨行书写
if (n > 2 and
        n != m) or n == m:
    print("matched")  # => matched

# 支持链式比较
print(0 < n < 5)  # => True

# 条件表达式（三元运算符）：value_if_true if condition else value_if_false
parity = "even" if n % 2 == 0 else "odd"
print(parity)  # => odd

# 0、""、None 以及空容器（列表、字典等）均判定为假（falsy）
if not []:
    print("empty")  # => empty
```

## 循环

```python
n = 0
while n < 3:
    print(n)
    n += 1
# => 0 1 2

# i = 0 到 4：range(n) 左闭右开，不包含结束值
for i in range(5):
    print(i)
# => 0 1 2 3 4

# i = 2 到 5
for i in range(2, 6):
    print(i)
# => 2 3 4 5

# i 从 5 递减到 2：第三个参数为步长（负数表示倒序）
for i in range(5, 1, -1):
    print(i)
# => 5 4 3 2

for i in range(10):
    if i == 1:
        continue
    if i == 4:
        break
    print(i)
# => 0 2 3
```

## 数学运算

```python
import math

# / 浮点除法：永远返回浮点数 float
print(5 / 2)  # => 2.5

# // 是地板除法（向下取整除法）
print(5 // 2)  # => 2

# CAREFUL: // 向负无穷取整；而绝大多数其他语言是向 0 截断
print(-3 // 2)  # => -2

# 若要向 0 截断，先做普通除法再转为 int
print(int(-3 / 2))  # => -1
# 极大整数除法为避免精度丢失，先用绝对值做整除，再确定正负符号
a, b = -(10 ** 20 + 3), 2
q = abs(a) // abs(b)
print(-q if (a < 0) != (b < 0) else q)  # => -50000000000000000001

# CAREFUL: % 取模的结果符号与除数一致，不同于 C/Java 等语言
print(10 % 3)  # => 1
print(-10 % 3)  # => 2

# math.fmod() 的符号与被除数一致（与 C、Java 行为相同）
print(math.fmod(-10, 3))  # => -1.0

print(math.floor(3 / 2), math.ceil(3 / 2))  # => 1 2
print(math.sqrt(16), math.isqrt(17))  # => 4.0 4
print(2 ** 10, abs(-7))  # => 1024 7
print(max(3, 8), min(3, 8))  # => 8 3

# Python 3 中的整数没有最大值/最小值限制；可用浮点正负无穷作为初始极大/极小值
print(float("inf") > 10 ** 100)  # => True
print(float("-inf"))  # => -inf

# 整数自动使用高精度，永远不会发生溢出
print(2 ** 100)  # => 1267650600228229401496703205376

# CAREFUL: math.pow() 返回的是 float，浮点数可能会发生溢出 OverflowError
# math.pow(2, 2000)  # 溢出错误
print(math.pow(2, 10))  # => 1024.0
```

## 输入与输出

```python
# print() 默认以空格分隔多个参数，以换行符结尾
print("a", 1, True)  # => a 1 True

# 自定义分隔符或结尾字符
print(1, 2, 3, sep=",")  # => 1,2,3
print("same", end=" ")
print("line")  # => same line

# 将列表的所有元素解包输出在同一行
nums = [1, 2, 3]
print(*nums)  # => 1 2 3

# f-strings 格式化字符串插值
name, score = "alice", 90
print(f"{name} scored {score}")  # => alice scored 90
```

```python
# input() 读取一行标准输入，自动剔除末尾换行符
n = int(input())
nums = []
while len(nums) < n:
    nums.extend(map(int, input().split()))
print(n, sum(nums[:n]))  # => 3 6
```

```text stdin
3
1 2
3
```

```python
import sys

# 大数据量 ACM 风格输入：一次性读取全部输入并按空白切分
data = sys.stdin.read().split()
n = int(data[0])
nums = [int(x) for x in data[1:n + 1]]
print(nums)  # => [4, 5, 6]
```

```text stdin
3
4 5
6
```

## 数组与列表

```python
# Python 中的动态数组称为列表（list），长度按需自动扩容
arr = [1, 2, 3]
print(arr)  # => [1, 2, 3]

# 列表作为栈使用：尾部 append() 与 pop() 的时间复杂度为 O(1)
arr.append(4)
print(arr.pop())  # => 4
# 查看栈顶元素
print(arr[-1])  # => 3

# 在指定索引处 insert() 为 O(n) 操作
arr.insert(1, 7)
print(arr)  # => [1, 7, 2, 3]

arr[0] = 0
print(arr, len(arr))  # => [0, 7, 2, 3] 4

# 创建指定大小 n 且填充默认值的列表
print([0] * 5)  # => [0, 0, 0, 0, 0]

# CAREFUL: 负数索引有效，表示从列表末尾倒序计数
arr = [1, 2, 3]
print(arr[-1], arr[-2])  # => 3 2

# 切片语法：arr[start:end]，左闭右开，不包含 end
arr = [1, 2, 3, 4]
print(arr[1:3])  # => [2, 3]
print(arr[:2], arr[2:])  # => [1, 2] [3, 4]
print(arr[::-1])  # => [4, 3, 2, 1]

# 切片越界不会抛出 IndexError 错误，而是截断至有效范围
print(arr[0:10])  # => [1, 2, 3, 4]

# 解包赋值
a, b, c = [1, 2, 3]
print(a, b, c)  # => 1 2 3
# a, b = [1, 2, 3]  # ValueError: 解包数量不匹配

# 列表的 in 成员查找是 O(n) 复杂度；频繁查找请改用集合 set
print(3 in arr, sum(arr), max(arr))  # => True 10 4
```

```python
nums = [10, 20, 30]

# 按索引遍历
for i in range(len(nums)):
    print(nums[i])
# => 10 20 30

# 直接按元素值遍历
for n in nums:
    print(n)
# => 10 20 30

# 同时遍历索引和元素值
for i, n in enumerate(nums):
    print(i, n)
# => 0 10 1 20 2 30

# 同时同步遍历两个列表（以较短的一个为准结束）
for n, ch in zip(nums, ["a", "b", "c"]):
    print(n, ch)
# => 10 a 20 b 30 c
```

```python
nums = [5, 4, 7, 3, 8]

# reverse() 与 sort() 均在原地修改原列表
nums.reverse()
print(nums)  # => [8, 3, 7, 4, 5]
nums.sort()
print(nums)  # => [3, 4, 5, 7, 8]
nums.sort(reverse=True)
print(nums)  # => [8, 7, 5, 4, 3]

# sorted() 返回一个排好序的新列表，不改变原列表
words = ["bob", "alice", "jane", "doe"]
print(sorted(words))  # => ['alice', 'bob', 'doe', 'jane']

# 自定义排序逻辑：key 函数（先按长度升序，长度相同时按字典序）
words.sort(key=lambda w: (len(w), w))
print(words)  # => ['bob', 'doe', 'jane', 'alice']

# 按照二维数对中的第二个元素排序
pairs = [[1, 3], [2, 1], [3, 2]]
pairs.sort(key=lambda p: p[1])
print(pairs)  # => [[2, 1], [3, 2], [1, 3]]
```

```python
# 列表推导式
print([i * i for i in range(5)])  # => [0, 1, 4, 9, 16]
print([i for i in range(10) if i % 2 == 0])  # => [0, 2, 4, 6, 8]

# 正确创建 3 行 4 列的二维列表
grid = [[0] * 4 for _ in range(3)]
grid[0][0] = 1
print(grid)  # => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
print(grid[2][3])  # => 0

# CAREFUL: [[0] * 4] * 3 复制的是同一行列表对象的引用，修改一处会导致所有行同步改变！
bad = [[0] * 4] * 3
bad[0][0] = 1
print(bad)  # => [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]]
```

## 字符串

```python
s = "abc"

# 索引与切片规则与列表相同；单字符即长度为 1 的字符串
print(s[0], s[1:])  # => a bc

# CAREFUL: 字符串是不可变类型（immutable）
# s[0] = "A"  # TypeError 错误

# “修改”字符串实际上是在内存中创建新字符串，因此在循环中频繁 += 拼接会导致 O(n^2) 耗时
s += "def"
print(s)  # => abcdef

# 推荐做法：在列表中收集片段，最后用 join 一次性完成拼接
parts = []
for ch in "abc":
    parts.append(ch.upper())
print("".join(parts))  # => ABC

# 字符串与数字互转
print(int("123") + 1)  # => 124
print(str(123) + "4")  # => 1234

# 字符与 ASCII / Unicode 码点互转
print(ord("a"))  # => 97
print(chr(ord("a") + 1))  # => b

# split() 不带参数时默认按任意连续空白字符切分
words = "the quick  brown fox".split()
print(words)  # => ['the', 'quick', 'brown', 'fox']
print("-".join(words))  # => the-quick-brown-fox

# 字符串大小比较按字典序逐字符对比
print("apple" < "banana")  # => True

print("a1".isalnum(), "7".isdigit(), "x".isalpha())  # => True True True
print("Hello".lower(), "hello"[::-1])  # => hello olleh
```

## 双端队列

```python
from collections import deque

# deque 是高效的双端队列：首尾两端 push 与 pop 均为 O(1)
queue = deque()
queue.append(1)
queue.append(2)
queue.appendleft(0)
print(queue)  # => deque([0, 1, 2])

print(queue.popleft())  # => 0
print(queue.pop())  # => 2

# 查看队首与队尾元素
queue.append(3)
print(queue[0], queue[-1], len(queue))  # => 1 3 2

# CAREFUL: 普通列表的 list.pop(0) 虽可用作队列，但时间复杂度为 O(n)

# 经典 BFS 广度优先搜索循环
queue = deque([1, 2, 3])
while queue:
    print(queue.popleft())
# => 1 2 3
```

## 哈希集合

```python
seen = set()
seen.add(1)
seen.add(2)
seen.add(2)  # 重复元素被自动忽略
print(len(seen))  # => 2

print(1 in seen, 3 in seen)  # => True False

# remove() 删除不存在的键会抛出 KeyError；discard() 则安全忽略
seen.remove(2)
seen.discard(42)
print(seen)  # => {1}

print(sorted(set([1, 2, 2, 3])))  # => [1, 2, 3]
print(sorted({i % 3 for i in range(10)}))  # => [0, 1, 2]

# 并集、交集、差集运算
a, b = {1, 2, 3}, {2, 3, 4}
print(sorted(a | b), sorted(a & b), sorted(a - b))  # => [1, 2, 3, 4] [2, 3] [1]

# CAREFUL: {} 创建的是空字典，空集合必须写成 set()
print(type({}), type(set()))  # => <class 'dict'> <class 'set'>
```

```python nocheck
# CAREFUL: 集合内部无序，遍历字符串集合的顺序在不同运行实例中可能不同；
# 如果对输出顺序有要求，请先使用 sorted(names) 排序
names = {"bob", "alice", "jane"}
for name in names:
    print(name)
```

## 哈希映射

```python
# dict（字典）将键映射到对应的值
scores = {}
scores["alice"] = 88
scores["bob"] = 77
print(scores, len(scores))  # => {'alice': 88, 'bob': 77} 2

scores["alice"] = 80
print(scores["alice"])  # => 80

print("alice" in scores)  # => True
scores.pop("alice")
print("alice" in scores)  # => False

# CAREFUL: 直接读取不存在的键会触发 KeyError；建议用 get() 提供默认回退值
# scores["zoe"]  # 抛出 KeyError 异常
print(scores.get("zoe", 0))  # => 0

scores = {"alice": 90, "bob": 70}
print({k: v * 2 for k, v in scores.items()})  # => {'alice': 180, 'bob': 140}

# 字典在 Python 3.7+ 中保留插入顺序
for key in scores:
    print(key, scores[key])
# => alice 90 bob 70

for val in scores.values():
    print(val)
# => 90 70

for key, val in scores.items():
    print(key, val)
# => alice 90 bob 70
```

```python
from collections import Counter, defaultdict

# 使用 get() 统计字符频次
count = {}
for ch in "banana":
    count[ch] = count.get(ch, 0) + 1
print(count)  # => {'b': 1, 'a': 3, 'n': 2}

# Counter 一行完成频次统计
print(Counter("banana")["a"])  # => 3

# defaultdict 在首次访问未记录的键时自动创建默认值
groups = defaultdict(list)
for word in ["eat", "tea", "tan"]:
    groups["".join(sorted(word))].append(word)
print(dict(groups))  # => {'aet': ['eat', 'tea'], 'ant': ['tan']}
```

## 元组

```python
# 元组是不可变序列
point = (1, 2)
print(point[0], point[-1])  # => 1 2
# point[0] = 5  # TypeError 错误

# 函数返回多个值本质上是返回一个元组，调用方可直接解包
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4])
print(lo, hi)  # => 1 4

# 由可哈希对象组成的元组可以作为字典的键或集合的元素（常用于网格坐标 (r, c)）
visited = {(0, 1)}
print((0, 1) in visited)  # => True
dist = {(0, 0): 0, (0, 1): 1}
print(dist[(0, 1)])  # => 1

# CAREFUL: 列表是不可哈希的，不能放入集合或作为字典键
# visited.add([0, 1])  # TypeError 错误

# 元组之间逐元素按序比较大小
print((1, 2) < (1, 3))  # => True

# CAREFUL: 单元素元组必须带有尾随逗号，否则会被解析为普通带括号的表达式
print(type((5,)), type((5)))  # => <class 'tuple'> <class 'int'>
```

## 堆与优先队列

```python
import heapq

# heapq 将普通列表作为小顶堆（min-heap）处理
min_heap = []
heapq.heappush(min_heap, 3)
heapq.heappush(min_heap, 1)
heapq.heappush(min_heap, 2)

# 堆顶最小元素始终位于索引 0 处
print(min_heap[0])  # => 1

while min_heap:
    print(heapq.heappop(min_heap))
# => 1 2 3

# 在 O(n) 时间内将已有列表直接堆化（原地操作）
nums = [5, 1, 8, 3]
heapq.heapify(nums)
print(heapq.heappop(nums), len(nums))  # => 1 3
```

```python
import heapq

# Python 3.14 原生新增了大顶堆函数
max_heap = [3, 1, 2]
heapq.heapify_max(max_heap)
heapq.heappush_max(max_heap, 5)
print(max_heap[0])  # => 5
print(heapq.heappop_max(max_heap))  # => 5

# CAREFUL: 在 3.14 之前的版本中，经典做法是将元素取相反数存入小顶堆以模拟大顶堆
max_heap = []
for n in [3, 1, 2]:
    heapq.heappush(max_heap, -n)
print(-heapq.heappop(max_heap))  # => 3
```

```python
import heapq

# 通过传入 (priority, value) 元组按自定义优先级排序
tasks = []
heapq.heappush(tasks, (2, "write"))
heapq.heappush(tasks, (1, "plan"))
heapq.heappush(tasks, (3, "ship"))
while tasks:
    priority, name = heapq.heappop(tasks)
    print(priority, name)
# => 1 plan 2 write 3 ship

# CAREFUL: 若优先级数值相同，heapq 会接着比较元组的下一项；
# 若第二项不可直接比较，可额外插入一个自增计数器作为并列决胜项

# 获取列表中前 k 个最小或最大的元素
nums = [5, 1, 8, 3, 9]
print(heapq.nsmallest(2, nums), heapq.nlargest(2, nums))  # => [1, 3] [9, 8]
```

## 函数

```python
def multiply(n, m):
    return n * m

print(multiply(3, 4))  # => 12

# 默认参数与关键字实参
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ann"))  # => Hello, Ann!
print(greet("Ann", greeting="Hi"))  # => Hi, Ann!

# lambda 是单表达式匿名函数
square = lambda x: x * x
print(square(5))  # => 25
```

```python
# 嵌套函数可以读取外层作用域中的变量
def outer(a, b):
    c = "c"

    def inner():
        return a + b + c

    return inner()

print(outer("a", "b"))  # => abc

# 原地修改外层对象（如列表 append）无需声明；但若要重新给外层变量赋值，必须使用 nonlocal
def double_and_sum(nums):
    total = 0

    def helper():
        nonlocal total
        for i in range(len(nums)):
            nums[i] *= 2
        # CAREFUL: 若不用 nonlocal，此赋值将在内层函数中创建一个同名局部变量
        total = sum(nums)

    helper()
    return total

nums = [1, 2]
print(double_and_sum(nums))  # => 6
print(nums)  # => [2, 4]

# CAREFUL: Python 默认递归深度约为 1000；
# 可通过 sys.setrecursionlimit() 调高上限，或改用显式栈改写为迭代实现
```

```python
# 参数传递为对象引用传递。
# 在函数内部修改可变对象（如列表），会影响调用方的原对象...
def append_one(arr):
    arr.append(1)

nums = []
append_one(nums)
print(nums)  # => [1]

# ...但若将参数直接重新赋值为一个新对象，不会影响外部变量
def replace(arr):
    arr = [99]

replace(nums)
print(nums)  # => [1]

# CAREFUL: 可变类型的默认参数只在函数定义时创建一次，所有调用共享该对象！
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # => [1]
print(add_item(2))  # => [1, 2]
```

## 类与数据结构

```python
class Point:
    # 构造函数
    def __init__(self, x, y):
        # 赋值给 self 创建实例属性
        self.x = x
        self.y = y

    # 实例方法的第一个参数必须显式接收 self
    def dist_sq(self):
        return self.x ** 2 + self.y ** 2

    # 自定义对象的字符串打印形式
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    # 定义 < 比较运算，使 Point 对象支持直接排序或放入优先队列堆
    def __lt__(self, other):
        return self.dist_sq() < other.dist_sq()

p = Point(3, 4)
print(p.dist_sq())  # => 25
print(p)  # => Point(3, 4)
print(sorted([Point(2, 2), Point(1, 0)]))  # => [Point(1, 0), Point(2, 2)]
```

```python
# LeetCode 经典单链表节点类定义
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# 构建链表：1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))

# 遍历链表直到末尾（None）
node = head
while node:
    print(node.val)
    node = node.next
# => 1 2 3
```

```python
from typing import Optional

# LeetCode 经典二叉树节点类定义
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

#     2
#    / \
#   1   3
root = TreeNode(2, TreeNode(1), TreeNode(3))

# 二叉树中序遍历（左 -> 根 -> 右）；空子节点为 None
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.val)
    inorder(node.right)

inorder(root)  # => 1 2 3

# 在 LeetCode 上通常需要实现 Solution 类中的特定方法。
# 请保持方法名不变（即保留原题目的驼峰命名格式）。
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))

print(Solution().maxDepth(root))  # => 2
```
