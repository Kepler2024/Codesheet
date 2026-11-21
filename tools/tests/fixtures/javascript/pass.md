```javascript
const { basename } = require("node:path");
console.log(basename("/tmp/three")); // => three
```

```javascript
class Box { constructor(value) { this.value = value; } }
function twice(x) { return x * 2; }
console.log(twice(new Box(3).value)); // => 6
```

```javascript
for (let i = 0; i < 3; i++) console.log(i);
// => 0 1 2
```

```javascript
const fs = require("node:fs");
const [count, ...values] = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
console.log(values.slice(0, count).reduce((a, b) => a + b, 0)); // => 12
```

```text stdin
3
2 4 6
```

```javascript nocheck
console.log("uncompared");
```

```javascript norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
