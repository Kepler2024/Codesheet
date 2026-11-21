# Python Cheat Sheet

> Written for Python 3.14

The Python you need to solve LeetCode-style problems, for programmers who already know another language. Every snippet runs as is, and `# =>` shows what it prints.

## Running a Program

```python
# A program is a file of statements that runs top to bottom; no main() is needed
print("Hello, World!")  # => Hello, World!
```

```bash
python3 hello.py
```

```python
# Common convention: put the entry point in main() and call it only when
# the file is run directly, not when it is imported by another file
def main():
    print("Hello from main")

if __name__ == "__main__":
    main()  # => Hello from main
```

## Variables

```python
# Variables are dynamically typed: no declaration, no type
n = 0
print(n)  # => 0

# The same name can later hold a value of another type
n = "abc"
print(n)  # => abc

# Multiple assignment, and swapping without a temp variable
a, b = 1, 2
a, b = b, a
print(a, b)  # => 2 1

# Increment
n = 5
n += 1
# n++  # invalid: Python has no ++ or --
print(n)  # => 6

# None is Python's null
x = None
print(x is None)  # => True

# Type hints (as in LeetCode signatures) are documentation, not enforced
count: int = 3
count = "three"
print(count)  # => three

# There are no constants; UPPER_CASE names are only a convention
MAX_SIZE = 100
```

## If-statements

```python
# No parentheses or braces: a colon, then an indented block
n = 1
if n > 2:
    n -= 1
elif n == 2:
    n *= 2
else:
    n += 2
print(n)  # => 3

# Logical operators are words: and, or, not (instead of &&, ||, !)
m = 5
if n > 0 and m > 0:
    print("both")  # => both
print(not True, True or False)  # => False True

# Wrap long conditions in parentheses to split them across lines
if (n > 2 and
        n != m) or n == m:
    print("matched")  # => matched

# Comparisons can be chained
print(0 < n < 5)  # => True

# Conditional expression (the ternary operator)
parity = "even" if n % 2 == 0 else "odd"
print(parity)  # => odd

# 0, "", None and empty containers are falsy
if not []:
    print("empty")  # => empty
```

## Loops

```python
n = 0
while n < 3:
    print(n)
    n += 1
# => 0 1 2

# i = 0 to 4: the end of range() is exclusive
for i in range(5):
    print(i)
# => 0 1 2 3 4

# i = 2 to 5
for i in range(2, 6):
    print(i)
# => 2 3 4 5

# i = 5 down to 2: the third argument is the step
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

## Math

```python
import math

# / always gives a float
print(5 / 2)  # => 2.5

# // is floor division
print(5 // 2)  # => 2

# CAREFUL: // rounds toward negative infinity; most languages truncate toward 0
print(-3 // 2)  # => -2

# To truncate toward 0, divide and convert to int
print(int(-3 / 2))  # => -1
# For large integers, keep the magnitudes integral to preserve precision
a, b = -(10 ** 20 + 3), 2
q = abs(a) // abs(b)
print(-q if (a < 0) != (b < 0) else q)  # => -50000000000000000001

# CAREFUL: % takes the sign of the divisor, unlike most languages
print(10 % 3)  # => 1
print(-10 % 3)  # => 2

# math.fmod() takes the sign of the dividend, like C and Java
print(math.fmod(-10, 3))  # => -1.0

print(math.floor(3 / 2), math.ceil(3 / 2))  # => 1 2
print(math.sqrt(16), math.isqrt(17))  # => 4.0 4
print(2 ** 10, abs(-7))  # => 1024 7
print(max(3, 8), min(3, 8))  # => 8 3

# There is no max/min int; use infinity as a starting value
print(float("inf") > 10 ** 100)  # => True
print(float("-inf"))  # => -inf

# Integers never overflow
print(2 ** 100)  # => 1267650600228229401496703205376

# CAREFUL: math.pow() returns a float, and floats can overflow
# math.pow(2, 2000)  # OverflowError
print(math.pow(2, 10))  # => 1024.0
```

## Output and Input

```python
# print() separates arguments with a space and ends with a newline
print("a", 1, True)  # => a 1 True

# Change the separator or the line ending
print(1, 2, 3, sep=",")  # => 1,2,3
print("same", end=" ")
print("line")  # => same line

# Print all elements of a list on one line
nums = [1, 2, 3]
print(*nums)  # => 1 2 3

# f-strings embed expressions
name, score = "alice", 90
print(f"{name} scored {score}")  # => alice scored 90
```

```python
# input() reads one line without the trailing newline
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

# For large inputs, read everything at once and split into tokens
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

## Arrays

```python
# Arrays are called lists, and they grow as needed
arr = [1, 2, 3]
print(arr)  # => [1, 2, 3]

# Use a list as a stack: append() and pop() at the end are O(1)
arr.append(4)
print(arr.pop())  # => 4
# Peek at the top
print(arr[-1])  # => 3

# insert() at an index is O(n)
arr.insert(1, 7)
print(arr)  # => [1, 7, 2, 3]

arr[0] = 0
print(arr, len(arr))  # => [0, 7, 2, 3] 4

# A list of size n filled with a default value
print([0] * 5)  # => [0, 0, 0, 0, 0]

# CAREFUL: negative indexes are valid and count from the end
arr = [1, 2, 3]
print(arr[-1], arr[-2])  # => 3 2

# Slicing: arr[start:end], end is exclusive
arr = [1, 2, 3, 4]
print(arr[1:3])  # => [2, 3]
print(arr[:2], arr[2:])  # => [1, 2] [3, 4]
print(arr[::-1])  # => [4, 3, 2, 1]

# Slices never raise an index error
print(arr[0:10])  # => [1, 2, 3, 4]

# Unpacking
a, b, c = [1, 2, 3]
print(a, b, c)  # => 1 2 3
# a, b = [1, 2, 3]  # ValueError: too many values to unpack

# Membership is O(n) for lists; use a set for fast lookups
print(3 in arr, sum(arr), max(arr))  # => True 10 4
```

```python
nums = [10, 20, 30]

# By index
for i in range(len(nums)):
    print(nums[i])
# => 10 20 30

# By value
for n in nums:
    print(n)
# => 10 20 30

# Index and value together
for i, n in enumerate(nums):
    print(i, n)
# => 0 10 1 20 2 30

# Two lists in lockstep (stops at the shorter one)
for n, ch in zip(nums, ["a", "b", "c"]):
    print(n, ch)
# => 10 a 20 b 30 c
```

```python
nums = [5, 4, 7, 3, 8]

# reverse() and sort() work in place
nums.reverse()
print(nums)  # => [8, 3, 7, 4, 5]
nums.sort()
print(nums)  # => [3, 4, 5, 7, 8]
nums.sort(reverse=True)
print(nums)  # => [8, 7, 5, 4, 3]

# sorted() returns a new list and leaves the original alone
words = ["bob", "alice", "jane", "doe"]
print(sorted(words))  # => ['alice', 'bob', 'doe', 'jane']

# Custom order: a key function (by length, then alphabetically)
words.sort(key=lambda w: (len(w), w))
print(words)  # => ['bob', 'doe', 'jane', 'alice']

# Sort pairs by their second element
pairs = [[1, 3], [2, 1], [3, 2]]
pairs.sort(key=lambda p: p[1])
print(pairs)  # => [[2, 1], [3, 2], [1, 3]]
```

```python
# List comprehensions
print([i * i for i in range(5)])  # => [0, 1, 4, 9, 16]
print([i for i in range(10) if i % 2 == 0])  # => [0, 2, 4, 6, 8]

# 2-D list with 3 rows and 4 columns
grid = [[0] * 4 for _ in range(3)]
grid[0][0] = 1
print(grid)  # => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
print(grid[2][3])  # => 0

# CAREFUL: [[0] * 4] * 3 repeats the SAME row object three times
bad = [[0] * 4] * 3
bad[0][0] = 1
print(bad)  # => [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0]]
```

## Strings

```python
s = "abc"

# Indexing and slicing work like lists; a "char" is a string of length 1
print(s[0], s[1:])  # => a bc

# CAREFUL: strings are immutable
# s[0] = "A"  # TypeError

# "Changing" a string creates a new one, so += in a loop can be O(n^2)
s += "def"
print(s)  # => abcdef

# Collect parts in a list and join them once instead
parts = []
for ch in "abc":
    parts.append(ch.upper())
print("".join(parts))  # => ABC

# String <-> number
print(int("123") + 1)  # => 124
print(str(123) + "4")  # => 1234

# Char <-> code point
print(ord("a"))  # => 97
print(chr(ord("a") + 1))  # => b

# split() with no argument splits on any whitespace
words = "the quick  brown fox".split()
print(words)  # => ['the', 'quick', 'brown', 'fox']
print("-".join(words))  # => the-quick-brown-fox

# Comparison is lexicographic
print("apple" < "banana")  # => True

print("a1".isalnum(), "7".isdigit(), "x".isalpha())  # => True True True
print("Hello".lower(), "hello"[::-1])  # => hello olleh
```

## Queues

```python
from collections import deque

# deque is a double-ended queue: O(1) at both ends
queue = deque()
queue.append(1)
queue.append(2)
queue.appendleft(0)
print(queue)  # => deque([0, 1, 2])

print(queue.popleft())  # => 0
print(queue.pop())  # => 2

# Peek at the front and the back
queue.append(3)
print(queue[0], queue[-1], len(queue))  # => 1 3 2

# CAREFUL: list.pop(0) also works as a queue, but it is O(n)

# Typical BFS loop
queue = deque([1, 2, 3])
while queue:
    print(queue.popleft())
# => 1 2 3
```

## HashSets

```python
seen = set()
seen.add(1)
seen.add(2)
seen.add(2)  # duplicates are ignored
print(len(seen))  # => 2

print(1 in seen, 3 in seen)  # => True False

# remove() raises KeyError if the item is missing; discard() doesn't
seen.remove(2)
seen.discard(42)
print(seen)  # => {1}

print(sorted(set([1, 2, 2, 3])))  # => [1, 2, 3]
print(sorted({i % 3 for i in range(10)}))  # => [0, 1, 2]

# Union, intersection, difference
a, b = {1, 2, 3}, {2, 3, 4}
print(sorted(a | b), sorted(a & b), sorted(a - b))  # => [1, 2, 3, 4] [2, 3] [1]

# CAREFUL: {} is an empty dict, not an empty set
print(type({}), type(set()))  # => <class 'dict'> <class 'set'>
```

```python nocheck
# CAREFUL: the order of a set of strings can change across runs,
# so sort it when the order matters: sorted(names)
names = {"bob", "alice", "jane"}
for name in names:
    print(name)
```

## HashMaps

```python
# dict maps keys to values
scores = {}
scores["alice"] = 88
scores["bob"] = 77
print(scores, len(scores))  # => {'alice': 88, 'bob': 77} 2

scores["alice"] = 80
print(scores["alice"])  # => 80

print("alice" in scores)  # => True
scores.pop("alice")
print("alice" in scores)  # => False

# CAREFUL: reading a missing key raises KeyError; get() returns a default instead
# scores["zoe"]  # KeyError
print(scores.get("zoe", 0))  # => 0

scores = {"alice": 90, "bob": 70}
print({k: v * 2 for k, v in scores.items()})  # => {'alice': 180, 'bob': 140}

# Dicts remember insertion order
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

# Counting with get()
count = {}
for ch in "banana":
    count[ch] = count.get(ch, 0) + 1
print(count)  # => {'b': 1, 'a': 3, 'n': 2}

# Counter does the same in one call
print(Counter("banana")["a"])  # => 3

# defaultdict creates a missing value on first access
groups = defaultdict(list)
for word in ["eat", "tea", "tan"]:
    groups["".join(sorted(word))].append(word)
print(dict(groups))  # => {'aet': ['eat', 'tea'], 'ant': ['tan']}
```

## Tuples

```python
# Tuples are immutable sequences
point = (1, 2)
print(point[0], point[-1])  # => 1 2
# point[0] = 5  # TypeError

# Returning several values returns a tuple, which you can unpack
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 4])
print(lo, hi)  # => 1 4

# A tuple of hashable items can be a dict key or set member
visited = {(0, 1)}
print((0, 1) in visited)  # => True
dist = {(0, 0): 0, (0, 1): 1}
print(dist[(0, 1)])  # => 1

# CAREFUL: lists are not hashable
# visited.add([0, 1])  # TypeError: unhashable type: 'list'

# Tuples compare element by element
print((1, 2) < (1, 3))  # => True

# CAREFUL: a one-element tuple needs a trailing comma
print(type((5,)), type((5)))  # => <class 'tuple'> <class 'int'>
```

## Heaps

```python
import heapq

# heapq treats a plain list as a min-heap
min_heap = []
heapq.heappush(min_heap, 3)
heapq.heappush(min_heap, 1)
heapq.heappush(min_heap, 2)

# The minimum is always at index 0
print(min_heap[0])  # => 1

while min_heap:
    print(heapq.heappop(min_heap))
# => 1 2 3

# Turn an existing list into a heap in O(n)
nums = [5, 1, 8, 3]
heapq.heapify(nums)
print(heapq.heappop(nums), len(nums))  # => 1 3
```

```python
import heapq

# Python 3.14 added max-heap functions
max_heap = [3, 1, 2]
heapq.heapify_max(max_heap)
heapq.heappush_max(max_heap, 5)
print(max_heap[0])  # => 5
print(heapq.heappop_max(max_heap))  # => 5

# CAREFUL: before 3.14 they don't exist; the classic trick is to push negated values
max_heap = []
for n in [3, 1, 2]:
    heapq.heappush(max_heap, -n)
print(-heapq.heappop(max_heap))  # => 3
```

```python
import heapq

# Order by a priority by pushing (priority, value) tuples
tasks = []
heapq.heappush(tasks, (2, "write"))
heapq.heappush(tasks, (1, "plan"))
heapq.heappush(tasks, (3, "ship"))
while tasks:
    priority, name = heapq.heappop(tasks)
    print(priority, name)
# => 1 plan 2 write 3 ship

# CAREFUL: on equal priorities the next element is compared,
# so it must be comparable (add a counter as a tie-breaker if it isn't)

# The k smallest or largest elements
nums = [5, 1, 8, 3, 9]
print(heapq.nsmallest(2, nums), heapq.nlargest(2, nums))  # => [1, 3] [9, 8]
```

## Functions

```python
def multiply(n, m):
    return n * m

print(multiply(3, 4))  # => 12

# Default values and keyword arguments
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ann"))  # => Hello, Ann!
print(greet("Ann", greeting="Hi"))  # => Hi, Ann!

# A lambda is a one-expression anonymous function
square = lambda x: x * x
print(square(5))  # => 25
```

```python
# Nested functions can read the enclosing function's variables
def outer(a, b):
    c = "c"

    def inner():
        return a + b + c

    return inner()

print(outer("a", "b"))  # => abc

# Mutating an outer object just works; reassigning an outer variable needs nonlocal
def double_and_sum(nums):
    total = 0

    def helper():
        nonlocal total
        for i in range(len(nums)):
            nums[i] *= 2
        # CAREFUL: without nonlocal this would create a new local variable
        total = sum(nums)

    helper()
    return total

nums = [1, 2]
print(double_and_sum(nums))  # => 6
print(nums)  # => [2, 4]

# CAREFUL: recursion depth is limited (about 1000 by default);
# raise it with sys.setrecursionlimit() or use an explicit stack
```

```python
# Arguments are references to objects.
# Mutating a list inside a function changes the caller's list...
def append_one(arr):
    arr.append(1)

nums = []
append_one(nums)
print(nums)  # => [1]

# ...but assigning a new list to the parameter does not
def replace(arr):
    arr = [99]

replace(nums)
print(nums)  # => [1]

# CAREFUL: a mutable default value is created once and shared between calls
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # => [1]
print(add_item(2))  # => [1, 2]
```

## Classes

```python
class Point:
    # Constructor
    def __init__(self, x, y):
        # Fields are created by assigning to self
        self.x = x
        self.y = y

    # Every method takes self explicitly
    def dist_sq(self):
        return self.x ** 2 + self.y ** 2

    # Optional: how the object prints
    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    # Optional: defines <, so Points can be sorted or pushed onto a heap
    def __lt__(self, other):
        return self.dist_sq() < other.dist_sq()

p = Point(3, 4)
print(p.dist_sq())  # => 25
print(p)  # => Point(3, 4)
print(sorted([Point(2, 2), Point(1, 0)]))  # => [Point(1, 0), Point(2, 2)]
```

```python
# LeetCode's linked list node for Python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# 1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))

# Walk the list until the end (None)
node = head
while node:
    print(node.val)
    node = node.next
# => 1 2 3
```

```python
from typing import Optional

# LeetCode's binary tree node for Python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

#     2
#    / \
#   1   3
root = TreeNode(2, TreeNode(1), TreeNode(3))

# In-order traversal; a missing child is None
def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.val)
    inorder(node.right)

inorder(root)  # => 1 2 3

# On LeetCode you complete a method of class Solution.
# Keep the method name as given, even though it is camelCase.
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))

print(Solution().maxDepth(root))  # => 2
```
