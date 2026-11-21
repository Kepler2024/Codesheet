```cpp
#include <iostream>
using namespace std;
cout << 3 << "\n"; // => 3
```

```cpp
#include <iostream>
struct Box { int value; };
int twice(int x) { return x * 2; }
int main() {
    std::cout << twice(Box{3}.value) << "\n"; // => 6
}
```

```cpp
#include <iostream>
for (int i = 0; i < 3; ++i) std::cout << i << "\n";
// => 0 1 2
```

```cpp
#include <iostream>
int count, value, sum = 0;
std::cin >> count;
for (int i = 0; i < count; ++i) { std::cin >> value; sum += value; }
std::cout << sum << "\n"; // => 12
```

```text stdin
3
2 4 6
```

```cpp nocheck
#include <iostream>
std::cout << "uncompared\n";
```

```cpp norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
