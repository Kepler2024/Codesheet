```python
import math
print(math.isqrt(9)) # => 3
```

```python
class Box:
    def __init__(self, value):
        self.value = value
def twice(x):
    return x * 2
print(twice(Box(3).value)) # => 6
```

```python
for i in range(3):
    print(i)
# => 0 1 2
```

```python
import sys
values = list(map(int, sys.stdin.read().split()))
count = values[0]
print(sum(values[1:1 + count])) # => 12
```

```text stdin
3
2 4 6
```

```python nocheck
print("uncompared")
```

```python norun
# Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
