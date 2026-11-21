```swift
import Foundation
print(Int(sqrt(9.0))) // => 3
```

```swift
struct Box { let value: Int }
func twice(_ x: Int) -> Int { x * 2 }
print(twice(Box(value: 3).value)) // => 6
```

```swift
for i in 0..<3 { print(i) }
// => 0 1 2
```

```swift
let count = Int(readLine()!)!
let values = readLine()!.split(separator: " ").map { Int($0)! }
print(values.prefix(count).reduce(0, +)) // => 12
```

```text stdin
3
2 4 6
```

```swift nocheck
print("uncompared")
```

```swift norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
