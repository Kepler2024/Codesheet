```rust
use std::{
    // A ; in a comment does not finish this import.
    collections::VecDeque,
};
let queue = VecDeque::from([3]);
println!("{}", queue[0]); // => 3
```

```rust
struct Boxed { value: i32 }
fn twice(x: i32) -> i32 { x * 2 }
fn main() {
    println!("{}", twice(Boxed { value: 3 }.value)); // => 6
}
```

```rust
for i in 0..3 { println!("{}", i); }
// => 0 1 2
```

```rust
use std::io::{self, Read};
let mut input = String::new();
io::stdin().read_to_string(&mut input).unwrap();
let mut values = input.split_whitespace().map(|s| s.parse::<i32>().unwrap());
let count = values.next().unwrap() as usize;
println!("{}", values.take(count).sum::<i32>()); // => 12
```

```text stdin
3
2 4 6
```

```rust nocheck
println!("uncompared");
```

```rust norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
