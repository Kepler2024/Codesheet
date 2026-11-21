```typescript
import { basename } from "node:path";
console.log(basename("/tmp/three")); // => three
```

```typescript
class Box { constructor(public value: number) {} }
function twice(x: number): number { return x * 2; }
console.log(twice(new Box(3).value)); // => 6
```

```typescript
for (let i = 0; i < 3; i++) console.log(i);
// => 0 1 2
```

```typescript
import { readFileSync } from "node:fs";
const [count, ...values] = readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
console.log(values.slice(0, count).reduce((a, b) => a + b, 0)); // => 12
```

```text stdin
3
2 4 6
```

```typescript nocheck
console.log("uncompared");
```

```typescript norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```

```typescript
const name = "node";
console.log(name); // => node
```

```typescript
const name = "independent";
console.log(name); // => independent
```
