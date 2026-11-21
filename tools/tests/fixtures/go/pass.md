```go
import "fmt"
fmt.Println(3) // => 3
```

```go
package main
import "fmt"
type Box struct { value int }
func twice(x int) int { return x * 2 }
func main() {
    fmt.Println(twice(Box{3}.value)) // => 6
}
```

```go
import (
    // A ) in a comment does not close this import group.
    "fmt"
)
for i := 0; i < 3; i++ { fmt.Println(i) }
// => 0 1 2
```

```go
import (
    "bufio"
    "fmt"
    "os"
)
in := bufio.NewReader(os.Stdin)
var count, value, sum int
fmt.Fscan(in, &count)
for i := 0; i < count; i++ { fmt.Fscan(in, &value); sum += value }
fmt.Println(sum) // => 12
```

```text stdin
3
2 4 6
```

```go nocheck
import "fmt"
fmt.Println("uncompared")
```

```go norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
