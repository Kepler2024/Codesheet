```csharp
using System.Collections.Generic;
Console.WriteLine(new List<int> { 3 }[0]); // => 3
```

```csharp
Console.WriteLine(Twice(new Box(3).Value)); // => 6
static int Twice(int x) => x * 2;
record Box(int Value);
```

```csharp
for (int i = 0; i < 3; i++) Console.WriteLine(i);
// => 0 1 2
```

```csharp
int count = int.Parse(Console.ReadLine()!);
int[] values = Console.ReadLine()!.Split().Select(int.Parse).ToArray();
Console.WriteLine(values.Take(count).Sum()); // => 12
```

```text stdin
3
2 4 6
```

```csharp nocheck
Console.WriteLine("uncompared");
```

```csharp norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
