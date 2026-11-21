```java
import java.util.List;
System.out.println(List.of(3).get(0)); // => 3
```

```java
class Box { final int value; Box(int value) { this.value = value; } }
class Helpers { static int twice(int x) { return x * 2; } }
class App {
    public static void main(String[] args) {
        System.out.println(Helpers.twice(new Box(3).value)); // => 6
    }
}
```

```java
for (int i = 0; i < 3; i++) System.out.println(i);
// => 0 1 2
```

```java
import java.util.Scanner;
Scanner input = new Scanner(System.in);
int count = input.nextInt();
int sum = 0;
for (int i = 0; i < count; i++) sum += input.nextInt();
System.out.println(sum); // => 12
```

```text stdin
3
2 4 6
```

```java nocheck
System.out.println("uncompared");
```

```java norun
// Deliberately invalid: demonstrates display-only code.
invalid !!! code
```
