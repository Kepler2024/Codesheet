# Java 速查表

> 适用于 Java 21

本快速参考用于学习或温习 Java 常用语法与常用数据结构。代码示例中的 `// =>` 表示期望的输出结果。

## 运行程序

```java
// 每个程序都需要一个包含 main 方法的类；源文件名须与公共类名保持一致（Main.java）
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // => Hello, World!
    }
}
```

```bash
java Main.java    # Java 11+ 支持单文件源码的一键编译与执行
```

```java
// 下方绝大多数代码块均为 main 方法体内代码，省略了外层类样板以保持简洁。
// 实际独立运行时，将 import 放在文件顶部并将代码放入 main 方法中即可。
System.out.println("Hello from main"); // => Hello from main
```

## 变量

```java
// 每个变量都必须声明类型，且类型一旦确定不可改变
int n = 0;
System.out.println(n); // => 0
// n = "abc";  // 编译错误：不兼容的类型

// var 可根据初始值自动推导局部变量类型
var count = 3;
var name = "alice";
System.out.println(count + " " + name); // => 3 alice

// 常用基础类型：int、long、double、boolean、char、String
long big = 4_000_000_000L;  // L 后缀：超出 int 范围的数值字面量需要加 L
double ratio = 0.5;
boolean done = false;
char letter = 'a';  // 单引号表示 char 字符，双引号表示 String 字符串
System.out.println(big + " " + ratio + " " + done + " " + letter); // => 4000000000 0.5 false a

// final 声明不可重新赋值的常量
final int limit = 100;
// limit = 200;  // 编译错误：无法为 final 变量 limit 分配值
System.out.println(limit); // => 100

// 不支持多变量同时解构赋值：交换变量需借助临时变量
int a = 1, b = 2;
int tmp = a;
a = b;
b = tmp;
System.out.println(a + " " + b); // => 2 1

// 自增运算
n++;
n += 2;
System.out.println(n); // => 3

// null 表示“无引用对象”；基本数据类型（如 int）不能为 null
String s = null;
System.out.println(s == null); // => true
// int x = null;  // 编译错误：不兼容的类型

// 注意：在 null 上调用实例方法会抛出 NullPointerException
// s.length();  // NullPointerException
```

## 条件语句

```java
// 条件表达式两端必须带有圆括号
int n = 1;
if (n > 2) {
    n--;
} else if (n == 2) {
    n *= 2;
} else {
    n += 2;
}
System.out.println(n); // => 3

// 逻辑运算符：&&（与）、||（或）、!（非）
int m = 5;
if (n > 0 && m > 0) {
    System.out.println("both"); // => both
}
System.out.println(!true + " " + (true || false)); // => false true

// 注意：条件表达式必须是 boolean 类型；0 和 null 不会被隐式转换为假值
// if (n) {}  // 编译错误：int 无法转换为 boolean

// 三元条件运算符
String parity = n % 2 == 0 ? "even" : "odd";
System.out.println(parity); // => odd

// 注意：在对象上使用 == 比较的是引用地址；比较 String 内容必须使用 equals()
String s1 = "hi";
String s2 = new String("hi");
System.out.println((s1 == s2) + " " + s1.equals(s2)); // => false true

// switch 表达式（Java 14+）具备返回值；-> 分支天然不会贯穿（fall through）
String size = switch (n) {
    case 1, 2 -> "small";
    case 3 -> "medium";
    default -> "large";
};
System.out.println(size); // => medium
```

## 循环

```java
int n = 0;
while (n < 3) {
    System.out.println(n);
    n++;
}
// => 0 1 2

// i 从 0 到 4
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
// => 0 1 2 3 4

// i 从 2 到 5
for (int i = 2; i <= 5; i++) {
    System.out.println(i);
}
// => 2 3 4 5

// i 从 5 递减到 2
for (int i = 5; i >= 2; i--) {
    System.out.println(i);
}
// => 5 4 3 2

for (int i = 0; i < 10; i++) {
    if (i == 1) {
        continue;
    }
    if (i == 4) {
        break;
    }
    System.out.println(i);
}
// => 0 2 3

// 标签允许 break 或 continue 作用于指定的外层循环
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j > i) {
            continue outer;
        }
        if (i == 2) {
            break outer;
        }
        System.out.println(i + " " + j);
    }
}
// => 0 0 1 0 1 1
```

## 数学运算

```java
// 两个 int 相除 / 为整数除法（向下截断）
System.out.println(5 / 2); // => 2

// 只要其中一个操作数为 double 即可保留浮点小数
System.out.println(5 / 2.0); // => 2.5
System.out.println((double) 5 / 2); // => 2.5

// 注意：整数除法向零截断（Python 中 -3 // 2 结果为 -2）
System.out.println(-3 / 2); // => -1
// Math.floorDiv 则向下取整
System.out.println(Math.floorDiv(-3, 2)); // => -2

// 注意：% 取模结果的符号与被除数相同（Python 中 -10 % 3 结果为 2）
System.out.println(-10 % 3); // => -1
// 当除数为正数时，Math.floorMod 恒为非负数
System.out.println(Math.floorMod(-10, 3)); // => 2

// floor、ceil、sqrt 和 pow 均返回 double 类型
System.out.println(Math.floor(1.5) + " " + Math.ceil(1.5)); // => 1.0 2.0
System.out.println(Math.sqrt(16) + " " + Math.pow(2, 10)); // => 4.0 1024.0
System.out.println(Math.abs(-7) + " " + Math.max(3, 8) + " " + Math.min(3, 8)); // => 7 8 3

// 将 double 强转为 int 时会向零截断小数部分
System.out.println((int) Math.sqrt(17) + " " + (int) -2.7); // => 4 -2

// 极值与无穷大
System.out.println(Integer.MAX_VALUE + " " + Integer.MIN_VALUE); // => 2147483647 -2147483648
System.out.println(Long.MAX_VALUE); // => 9223372036854775807
System.out.println(Double.POSITIVE_INFINITY + " " + Double.NEGATIVE_INFINITY); // => Infinity -Infinity

// 注意：int 溢出会静默发生二进制回绕
int big = Integer.MAX_VALUE;
big++;
System.out.println(big); // => -2147483648

// 注意：大数乘法务必在相乘前将操作数转为 long；对结果强转为时已晚
int side = 50_000;
System.out.println(side * side); // => -1794967296
System.out.println((long) side * side); // => 2500000000
System.out.println((long) (side * side)); // => -1794967296

// Math.multiplyExact 和 addExact 在溢出时会直接抛出算术异常
// Math.multiplyExact(side, side);  // ArithmeticException: integer overflow
```

## 输入与输出

```java
import java.util.Arrays;

// println 输出并在末尾换行；print 不换行
System.out.print("same ");
System.out.println("line"); // => same line

// + 遇到 String 会将另一操作数转为字符串并拼接
System.out.println("a " + 1 + " " + true); // => a 1 true

// 注意：+ 自左向右计算，首个 String 之前的加法仍为数值相加
System.out.println(1 + 2 + "3" + 4 + 5); // => 3345

// printf 使用 %d、%s、%.2f 进行格式化；%n 表示平台无关的换行
String name = "alice";
int score = 90;
System.out.printf("%s scored %d%n", name, score); // => alice scored 90
System.out.printf("%.2f%n", 3.14159); // => 3.14

// 注意：直接对数组调用 println 会输出内存哈希标识（如 [I@1b6d3586）；应使用 Arrays.toString
int[] nums = {1, 2, 3};
System.out.println(Arrays.toString(nums)); // => [1, 2, 3]

// 输出用空格分隔的数组元素
StringBuilder sb = new StringBuilder();
for (int x : nums) {
    sb.append(x).append(' ');
}
System.out.println(sb.toString().trim()); // => 1 2 3
```

```java
import java.util.Scanner;

// Scanner 用于从标准输入读取标记（token）与单行文本
Scanner in = new Scanner(System.in);

// nextInt 会自动跳过前导空白符与换行符
int n = in.nextInt();
int[] nums = new int[n];
for (int i = 0; i < n; i++) {
    nums[i] = in.nextInt();
}

// 注意：nextInt 读取后缓冲区可能残留行尾换行符；
// 在读取下一整行前需先调用一次 nextLine() 吸收换行
in.nextLine();
String title = in.nextLine();
System.out.println(n + " " + nums[2] + " " + title); // => 3 3 hello world
```

```text stdin
3
1 2
3
hello world
```

```java
import java.io.*;
import java.util.StringTokenizer;

// Scanner 处理超大数据量时性能较差；BufferedReader + StringTokenizer 读取速度更快
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
StringTokenizer st = new StringTokenizer(br.readLine());
long sum = 0;
for (int i = 0; i < n; i++) {
    sum += Long.parseLong(st.nextToken());
}

// 对于大数据量输出，使用 PrintWriter 缓冲并最后一次性 flush 刷新
PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));
out.println(n + " " + sum); // => 3 15
out.flush();
```

```text stdin
3
4 5 6
```

## 基本类型与包装类型

```java
import java.util.*;

// Java 集合框架只能存放对象，不能直接存放基本类型。各基本类型对应包装类：
// int -> Integer, long -> Long, double -> Double, char -> Character, boolean -> Boolean
List<Integer> list = new ArrayList<>();
// List<int> bad;  // 编译错误：意外的类型

// Java 会自动在基本类型与包装类之间转换（自动装箱与拆箱）
list.add(5);
int first = list.get(0);
System.out.println(first + 1); // => 6

// 注意：== 比较两个包装对象时比较的是引用地址。它仅在 -128 到 127
// 范围内看起来“碰巧正常”，因为该范围的值有缓存池
Integer a = 127, b = 127;
Integer c = 1000, d = 1000;
System.out.println((a == b) + " " + (c == d)); // => true false

// 比较包装对象的值应使用 equals，或将其中一边拆箱为基本类型
System.out.println(c.equals(d) + " " + (c.intValue() == d)); // => true true

// 注意：对 null 拆箱会抛出空指针异常，例如 Map 缺少键时的自动拆箱
Map<String, Integer> counts = new HashMap<>();
System.out.println(counts.get("x")); // => null
// int missing = counts.get("x");  // NullPointerException

// 注意：在 List<Integer> 上，remove(int) 按索引删除，remove(Object) 按值删除
List<Integer> nums = new ArrayList<>(List.of(10, 20, 30));
nums.remove(1);
System.out.println(nums); // => [10, 30]
nums.remove(Integer.valueOf(10));
System.out.println(nums); // => [30]
```

## 数组与列表

```java
import java.util.Arrays;

// 数组一旦创建，长度便不可更改
int[] arr = {1, 2, 3};

// length 是属性，而非方法
System.out.println(arr.length); // => 3

// new int[n] 会将数组元素初始化为 0（boolean 为 false，对象为 null）
int[] zeros = new int[5];
System.out.println(Arrays.toString(zeros)); // => [0, 0, 0, 0, 0]

// 使用指定值填充数组
int[] ones = new int[3];
Arrays.fill(ones, 1);
System.out.println(Arrays.toString(ones)); // => [1, 1, 1]

// 注意：Java 不支持负数索引，越界访问会直接抛出异常
// arr[-1]  // ArrayIndexOutOfBoundsException
System.out.println(arr[arr.length - 1]); // => 3

// copyOfRange(arr, start, end) 拷贝构建子数组，左闭右开
int[] part = Arrays.copyOfRange(arr, 1, 3);
System.out.println(Arrays.toString(part)); // => [2, 3]

// 注意：== 和 equals 均比较数组引用地址；比较内容必须使用 Arrays.equals
int[] same = {1, 2, 3};
System.out.println((arr == same) + " " + Arrays.equals(arr, same)); // => false true
```

```java
import java.util.*;

// ArrayList 是标准动态数组。通常面向 List 接口声明变量。
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
System.out.println(list + " " + list.size()); // => [1, 2, 3] 3

// 使用 get 和 set 代替下标访问
list.set(0, 10);
System.out.println(list.get(0)); // => 10

// 当作栈使用：在尾部 add 和 remove 的时间复杂度均为 O(1)
list.add(4);
System.out.println(list.remove(list.size() - 1)); // => 4

// 查看末尾元素；getLast() 与 removeLast() 为 Java 21 新增方法
System.out.println(list.getLast()); // => 3

// add(index, value) 在指定位置插入，时间复杂度 O(n)
list.add(1, 7);
System.out.println(list); // => [10, 7, 2, 3]

// 创建长度为 n 且填充默认值的列表
List<Integer> zeros = new ArrayList<>(Collections.nCopies(3, 0));
System.out.println(zeros); // => [0, 0, 0]

// subList(start, end) 返回视图（View）：修改视图会同步改变原列表
List<Integer> view = list.subList(1, 3);
view.set(0, 99);
System.out.println(view + " " + list); // => [99, 2] [10, 99, 2, 3]

// contains 和 indexOf 为 O(n) 线性扫描
System.out.println(list.contains(2) + " " + list.indexOf(2) + " " + Collections.max(list)); // => true 2 99

// 注意：List.of(...) 返回不可变列表；需传入 ArrayList 构造函数以允许后续修改
List<Integer> fixed = List.of(1, 2);
// fixed.add(3);  // UnsupportedOperationException
```

```java
import java.util.*;

int[] nums = {10, 20, 30};

// 通过索引遍历（同时获取索引与值的方式）
for (int i = 0; i < nums.length; i++) {
    System.out.println(i + " " + nums[i]);
}
// => 0 10 1 20 2 30

// 直接遍历元素值（for-each 适用于数组及各类集合）
for (int n : nums) {
    System.out.println(n);
}
// => 10 20 30

// 双数组同步遍历：按较短数组长度循环
String[] letters = {"a", "b", "c"};
for (int i = 0; i < Math.min(nums.length, letters.length); i++) {
    System.out.println(nums[i] + letters[i]);
}
// => 10a 20b 30c

// 注意：在 for-each 循环中直接删除集合元素会抛出 ConcurrentModificationException；
// 应使用 removeIf（或倒序索引循环）
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4));
list.removeIf(x -> x % 2 == 0);
System.out.println(list); // => [1, 3]
```

```java
import java.util.*;

// Arrays.sort 原地排序基本类型数组
int[] nums = {5, 4, 7, 3, 8};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // => [3, 4, 5, 7, 8]

// 注意：Arrays.sort(int[]) 不支持自定义比较器。若需降序或自定义排序，
// 需使用包装类型 Integer[] 数组
Integer[] boxed = {5, 4, 7, 3, 8};
Arrays.sort(boxed, Collections.reverseOrder());
System.out.println(Arrays.toString(boxed)); // => [8, 7, 5, 4, 3]

// 列表使用 Collections.sort 或 list.sort(comparator) 排序
List<String> words = new ArrayList<>(List.of("bob", "alice", "jane", "doe"));
Collections.sort(words);
System.out.println(words); // => [alice, bob, doe, jane]
words.sort(Comparator.reverseOrder());
System.out.println(words); // => [jane, doe, bob, alice]

// Collections.reverse 原地翻转列表（int[] 没有内置翻转工具方法）
Collections.reverse(words);
System.out.println(words); // => [alice, bob, doe, jane]

// 自定义多条件排序：先按长度升序，再按字母序
words.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
System.out.println(words); // => [bob, doe, jane, alice]

// 对二元组（int[] 行）按第二项元素排序
int[][] pairs = {{1, 3}, {2, 1}, {3, 2}};
Arrays.sort(pairs, (p, q) -> Integer.compare(p[1], q[1]));
System.out.println(Arrays.deepToString(pairs)); // => [[2, 1], [3, 2], [1, 3]]

// 注意：常见的 (p, q) -> p[1] - q[1] 减法写法在数值极大或负数时可能发生整型溢出错误
```

```java
import java.util.*;

// 3 行 4 列的二维数组，初始全为 0
int[][] grid = new int[3][4];
grid[0][0] = 1;
System.out.println(Arrays.deepToString(grid)); // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
System.out.println(grid.length + " " + grid[0].length); // => 3 4

// 注意：Arrays.fill(rows, row) 会使每一行共享同一个数组对象引用
int[][] bad = new int[3][];
Arrays.fill(bad, new int[4]);
bad[0][0] = 1;
System.out.println(bad[1][0] + " " + bad[2][0]); // => 1 1

// 嵌套列表（List of lists）：必须为每一行分别实例化独立列表
List<List<Integer>> rows = new ArrayList<>();
for (int i = 0; i < 2; i++) {
    rows.add(new ArrayList<>());
}
rows.get(0).add(5);
System.out.println(rows); // => [[5], []]

// 注意：在回溯算法中，必须向结果集中添加路径的拷贝副本，而不是路径对象引用本身
List<Integer> path = new ArrayList<>(List.of(1, 2));
List<List<Integer>> res = new ArrayList<>();
res.add(path);
res.add(new ArrayList<>(path));
path.set(0, 9);
System.out.println(res); // => [[9, 2], [1, 2]]
```

## 字符串

```java
String s = "abc";

// charAt 获取指定索引处的字符；substring(start, end) 左闭右开
System.out.println(s.charAt(0)); // => a
System.out.println(s.substring(1) + " " + s.substring(0, 2)); // => bc ab
System.out.println(s.length() + " " + s.indexOf('c') + " " + s.contains("bc")); // => 3 2 true

// 注意：Java 字符串是不可变的；诸如 toUpperCase 等方法均返回新字符串
// s.charAt(0) = 'A';  // 编译错误
// 若需修改字符，可转为 char[] 修改后再构造新 String
char[] chars = s.toCharArray();
chars[0] = 'A';
System.out.println(new String(chars)); // => Abc

// + 每次拼接都会创建新对象；在循环中构建字符串请使用 StringBuilder
StringBuilder sb = new StringBuilder();
for (char ch : "abc".toCharArray()) {
    sb.append(Character.toUpperCase(ch));
}
System.out.println(sb.toString()); // => ABC

// StringBuilder 支持原生 reverse、insert 与 delete
System.out.println(new StringBuilder("hello").reverse()); // => olleh

// 字符串与数字互转
System.out.println(Integer.parseInt("123") + 1); // => 124
System.out.println(String.valueOf(123) + "4"); // => 1234
// Integer.parseInt("12a");  // NumberFormatException

// 字符与 ASCII/Unicode 编码互转：char 本质上是 16 位整数
char c = 'a';
System.out.println((int) c); // => 97
System.out.println((char) (c + 1)); // => b

// 注意：char + int 甚至 char + char 结果都会自动提升为 int
System.out.println('a' + 1); // => 98
System.out.println('a' + 'b'); // => 195

// 数字字符转整型数值，以及小写字母在 int[26] 计数数组中的偏移量
System.out.println(('7' - '0') + " " + ('c' - 'a')); // => 7 2

// split 接收正则表达式；\\s+ 按连续空白字符切分
String[] words = "the quick  brown fox".split("\\s+");
System.out.println(words.length); // => 4
System.out.println(String.join("-", words)); // => the-quick-brown-fox

// 注意："." 在正则中匹配任意字符；切分点号必须转义为 "\\."
System.out.println("a.b".split(".").length + " " + "a.b".split("\\.").length); // => 0 2

// 比较内容使用 equals；compareTo 按字典序比较（返回负数、0 或正数）
System.out.println("abc".equals(s) + " " + ("apple".compareTo("banana") < 0)); // => true true

System.out.println("Hello".toLowerCase() + " " + "  hi ".trim()); // => hello hi
System.out.println(Character.isDigit('7') + " " + Character.isLetter('x')); // => true true
```

## 队列与双端队列

```java
import java.util.*;

// ArrayDeque 是标准双端队列：两端增删操作均为 O(1)
Deque<Integer> dq = new ArrayDeque<>();
dq.offerLast(1);
dq.offerLast(2);
dq.offerFirst(0);
System.out.println(dq); // => [0, 1, 2]

System.out.println(dq.pollFirst()); // => 0
System.out.println(dq.pollLast()); // => 2

// 查看队头、队尾元素以及大小
dq.offerLast(3);
System.out.println(dq.peekFirst() + " " + dq.peekLast() + " " + dq.size()); // => 1 3 2

// 注意：队列为空时 poll 与 peek 返回 null；而 remove、getFirst 和 pop 则会抛出异常
dq.clear();
System.out.println(dq.pollFirst() + " " + dq.peekLast()); // => null null
// dq.removeFirst();  // NoSuchElementException

// 作为普通单向队列：offer 尾部入队，poll 头部出队
Queue<Integer> queue = new ArrayDeque<>(List.of(1, 2, 3));
while (!queue.isEmpty()) {
    System.out.println(queue.poll());
}
// => 1 2 3

// 作为栈使用：push、pop 和 peek 均在队头操作。
// 在 Java 中优先使用 ArrayDeque 代替过时的 Stack 类。
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
System.out.println(stack.peek() + " " + stack.pop() + " " + stack.size()); // => 2 2 1
```

## 哈希集合

```java
import java.util.*;

Set<Integer> seen = new HashSet<>();
seen.add(1);
seen.add(2);

// add 在元素已存在时返回 false
System.out.println(seen.add(2)); // => false
System.out.println(seen.size()); // => 2

System.out.println(seen.contains(1) + " " + seen.contains(3)); // => true false

// remove 在元素不存在时静默跳过
seen.remove(2);
seen.remove(42);
System.out.println(seen); // => [1]

// 从列表或通过循环从数组构建集合
Set<Integer> fromList = new HashSet<>(List.of(1, 2, 2, 3));
System.out.println(fromList.size()); // => 3
int[] arr = {3, 1, 3};
Set<Integer> fromArr = new HashSet<>();
for (int x : arr) {
    fromArr.add(x);
}
System.out.println(fromArr.size()); // => 2

// 注意：Set.of(...) 存在重复元素时会抛出异常，且返回不可变集合
// Set.of(1, 2, 2);  // IllegalArgumentException: duplicate element: 2
```

```java
import java.util.*;

// 注意：HashSet 遍历顺序不确定；TreeSet（基于红黑树）始终保持元素自然升序排列
Set<String> names = new TreeSet<>(List.of("bob", "alice", "jane"));
for (String name : names) {
    System.out.println(name);
}
// => alice bob jane

// 并集、交集与差集会原地修改原集合，因此通常先进行浅拷贝
Set<Integer> a = new TreeSet<>(List.of(1, 2, 3));
Set<Integer> b = Set.of(2, 3, 4);
Set<Integer> union = new TreeSet<>(a);
union.addAll(b);
Set<Integer> inter = new TreeSet<>(a);
inter.retainAll(b);
Set<Integer> diff = new TreeSet<>(a);
diff.removeAll(b);
System.out.println(union + " " + inter + " " + diff); // => [1, 2, 3, 4] [2, 3] [1]

// TreeSet 还支持 O(log n) 的临近元素查询
TreeSet<Integer> sorted = new TreeSet<>(List.of(1, 4, 9));
System.out.println(sorted.floor(5) + " " + sorted.ceiling(5) + " " + sorted.first()); // => 4 9 1
```

## 哈希映射

```java
import java.util.*;

Map<String, Integer> scores = new HashMap<>();
scores.put("alice", 88);
scores.put("bob", 77);
System.out.println(scores.size()); // => 2

// put 会覆盖已有键的值
scores.put("alice", 80);
System.out.println(scores.get("alice")); // => 80

// 注意：get 遇到不存在的键返回 null；getOrDefault 则提供保底默认值
System.out.println(scores.get("zoe") + " " + scores.getOrDefault("zoe", 0)); // => null 0

System.out.println(scores.containsKey("alice")); // => true
scores.remove("alice");
System.out.println(scores.containsKey("alice")); // => false
```

```java
import java.util.*;

// 注意：HashMap 的迭代顺序未定义。
// LinkedHashMap 保持元素插入顺序，TreeMap 保持键按自然升序排列。
Map<String, Integer> scores = new LinkedHashMap<>();
scores.put("alice", 90);
scores.put("bob", 70);

for (String key : scores.keySet()) {
    System.out.println(key + " " + scores.get(key));
}
// => alice 90 bob 70

for (int val : scores.values()) {
    System.out.println(val);
}
// => 90 70

for (Map.Entry<String, Integer> e : scores.entrySet()) {
    System.out.println(e.getKey() + " " + e.getValue());
}
// => alice 90 bob 70
```

```java
import java.util.*;

// 利用 getOrDefault 统计频次（此处用 TreeMap，因此按键自然升序打印）
Map<Character, Integer> count = new TreeMap<>();
for (char ch : "banana".toCharArray()) {
    count.put(ch, count.getOrDefault(ch, 0) + 1);
}
System.out.println(count); // => {a=3, b=1, n=2}

// merge 方法可更精简地单行完成计数
Map<Character, Integer> count2 = new HashMap<>();
for (char ch : "banana".toCharArray()) {
    count2.merge(ch, 1, Integer::sum);
}
System.out.println(count2.get('a')); // => 3

// computeIfAbsent 在键首次不存在时自动初始化新对象，常用于分组聚合
Map<String, List<String>> groups = new TreeMap<>();
for (String word : List.of("eat", "tea", "tan")) {
    char[] letters = word.toCharArray();
    Arrays.sort(letters);
    groups.computeIfAbsent(new String(letters), k -> new ArrayList<>()).add(word);
}
System.out.println(groups); // => {aet=[eat, tea], ant=[tan]}

// 针对小写字母统计频次，使用 int[26] 性能远高于哈希映射
int[] freq = new int[26];
for (char ch : "banana".toCharArray()) {
    freq[ch - 'a']++;
}
System.out.println(freq[0] + " " + freq[1]); // => 3 1
```

## 元组

```java
// Java 没有内置多元组类型。record（记录类）是单行定义的不可变类，
// 自动免费获得构造函数、Getter 访问器、equals、hashCode 和 toString。
import java.util.*;

public class Main {
    record MinMax(int lo, int hi) {}

    static MinMax minMax(int[] nums) {
        int lo = nums[0], hi = nums[0];
        for (int n : nums) {
            lo = Math.min(lo, n);
            hi = Math.max(hi, n);
        }
        return new MinMax(lo, hi);
    }

    record Cell(int r, int c) {}

    public static void main(String[] args) {
        // 返回多个值：返回 record 并直接访问其字段
        MinMax mm = minMax(new int[]{3, 1, 4});
        System.out.println(mm.lo() + " " + mm.hi()); // => 1 4
        System.out.println(mm); // => MinMax[lo=1, hi=4]

        // record 非常适合用作复合键，因为其 equals 和 hashCode 默认基于字段值比较
        Set<Cell> visited = new HashSet<>();
        visited.add(new Cell(0, 1));
        System.out.println(visited.contains(new Cell(0, 1))); // => true

        // List.of(...) 也可直接用作复合键
        Map<List<Integer>, Integer> dist = new HashMap<>();
        dist.put(List.of(0, 1), 1);
        System.out.println(dist.get(List.of(0, 1))); // => 1

        // 注意：原生 int[] 不能直接用作哈希键：数组比较的是引用地址而非元素值
        Set<int[]> bad = new HashSet<>();
        bad.add(new int[]{0, 1});
        System.out.println(bad.contains(new int[]{0, 1})); // => false
    }
}
```

## 堆与优先队列

```java
import java.util.*;

// PriorityQueue 默认为最小堆
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(3);
minHeap.offer(1);
minHeap.offer(2);

// peek 查看堆顶最小值；poll 弹出最小值
System.out.println(minHeap.peek()); // => 1
while (!minHeap.isEmpty()) {
    System.out.println(minHeap.poll());
}
// => 1 2 3

// 注意：在空堆上调用 poll 和 peek 会返回 null
System.out.println(minHeap.poll()); // => null

// 基于已有集合线性时间 O(n) 建堆
PriorityQueue<Integer> heap = new PriorityQueue<>(List.of(5, 1, 8, 3));
System.out.println(heap.poll() + " " + heap.size()); // => 1 3

// 注意：直接打印或迭代 PriorityQueue 并不会按序输出；需循环 poll 弹出
```

```java
import java.util.*;

// 最大堆：传入反向比较器
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
maxHeap.addAll(List.of(3, 1, 5));
System.out.println(maxHeap.poll()); // => 5

// 自定义优先级：int[] 数组按第二项元素排序
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
pq.offer(new int[]{7, 2});
pq.offer(new int[]{8, 1});
pq.offer(new int[]{9, 3});
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    System.out.println(top[0] + " " + top[1]);
}
// => 8 1 7 2 9 3

// 使用 record 配合比较器链可读性更好，并能显式指定并列时的决胜条件
record Task(String name, int priority) {}
PriorityQueue<Task> tasks = new PriorityQueue<>(
        Comparator.comparingInt(Task::priority).thenComparing(Task::name));
tasks.offer(new Task("write", 2));
tasks.offer(new Task("plan", 1));
tasks.offer(new Task("ship", 2));
while (!tasks.isEmpty()) {
    System.out.println(tasks.poll().name());
}
// => plan ship write
```

## 函数

```java
public class Main {
    // 所有方法均定义在类中；static 静态方法无需实例化类对象即可直接调用
    static int multiply(int n, int m) {
        return n * m;
    }

    // Java 不支持默认参数或关键字参数：通过方法重载实现不同参数组合
    static String greet(String name) {
        return greet(name, "Hello");
    }

    static String greet(String name, String greeting) {
        return greeting + ", " + name + "!";
    }

    // 可变长参数：方法内部 nums 会被当作 int[] 数组处理
    static int sum(int... nums) {
        int total = 0;
        for (int n : nums) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        System.out.println(multiply(3, 4)); // => 12
        System.out.println(greet("Ann")); // => Hello, Ann!
        System.out.println(greet("Ann", "Hi")); // => Hi, Ann!
        System.out.println(sum(1, 2, 3)); // => 6
    }
}
```

```java
import java.util.*;
import java.util.function.*;

// Lambda 表达式实现了如 Function 或 BiFunction 等函数式接口
Function<Integer, Integer> square = x -> x * x;
System.out.println(square.apply(5)); // => 25
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
System.out.println(add.apply(2, 3)); // => 5

// 方法引用是仅调用单个方法的 Lambda 的简写形式
Predicate<String> isEmpty = String::isEmpty;
System.out.println(isEmpty.test("")); // => true

// 注意：Lambda 引用的局部变量必须是有效只读的（effectively final）
int base = 10;
// base++;  // 若解开注释将导致下一行编译错误
Function<Integer, Integer> addBase = x -> x + base;
System.out.println(addBase.apply(5)); // => 15

// 若需在 Lambda 内部更新计数器，可使用长度为 1 的数组（或类成员字段）
int[] total = {0};
List.of(1, 2, 3).forEach(x -> total[0] += x);
System.out.println(total[0]); // => 6
```

```java
// Java 不支持局部嵌套函数。递归辅助函数通常作为类的私有方法，
// 跨递归调用共享的状态常作为成员字段保存（LeetCode 常见模式）。
public class Main {
    private int count = 0;

    void dfs(int n) {
        if (n == 0) {
            return;
        }
        count++;
        dfs(n - 1);
    }

    public static void main(String[] args) {
        Main m = new Main();
        m.dfs(3);
        System.out.println(m.count); // => 3
    }
}
```

```java
import java.util.*;

public class Main {
    // Java 始终按值传递。对于对象，传递的是对象引用的副本，
    // 因此在函数内部修改对象状态对调用方是可见的...
    static void appendOne(List<Integer> list) {
        list.add(1);
    }

    // ...但若将形参指向一个全新对象，则完全不会影响调用方的原始引用
    static void replace(List<Integer> list) {
        list = new ArrayList<>(List.of(99));
    }

    // 基本类型传递数值副本，函数内部自增不会改变调用方的原始变量
    static void increment(int n) {
        n++;
    }

    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>();
        appendOne(nums);
        replace(nums);
        System.out.println(nums); // => [1]

        int n = 5;
        increment(n);
        System.out.println(n); // => 5
    }
}
```

## 类与数据结构

```java
import java.util.*;

public class Main {
    // 内部类须声明为 static 才能在没有外部 Main 实例的情况下直接创建
    static class Point implements Comparable<Point> {
        // 字段
        int x, y;

        // 构造函数：与类同名，无返回值声明
        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        int distSq() {
            return x * x + y * y;
        }

        // 可选：自定义打印格式
        @Override
        public String toString() {
            return "Point(" + x + ", " + y + ")";
        }

        // 可选：实现自然排序规则，使 Point 支持直接排序或进入 PriorityQueue
        @Override
        public int compareTo(Point other) {
            return Integer.compare(distSq(), other.distSq());
        }
    }

    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p.distSq()); // => 25
        System.out.println(p); // => Point(3, 4)

        List<Point> pts = new ArrayList<>(List.of(new Point(2, 2), new Point(1, 0)));
        Collections.sort(pts);
        System.out.println(pts); // => [Point(1, 0), Point(2, 2)]

        // 注意：作为 HashMap 的键或 HashSet 的元素时，类必须重写 equals 和
        // hashCode；否则两个内容相同的对象会被当作不同的键
        Set<Point> set = new HashSet<>(List.of(new Point(1, 1)));
        System.out.println(set.contains(new Point(1, 1))); // => false
    }
}
```

```java
// LeetCode 中 Java 的单链表节点类
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Main {
    public static void main(String[] args) {
        // 1 -> 2 -> 3
        ListNode head = new ListNode(1, new ListNode(2, new ListNode(3)));

        // 遍历链表直到末尾（null）
        for (ListNode node = head; node != null; node = node.next) {
            System.out.println(node.val);
        }
        // => 1 2 3
    }
}
```

```java
// LeetCode 中 Java 的二叉树节点类
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 在 LeetCode 上，题目通常要求补全 Solution 类中的方法
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}

public class Main {
    // 中序遍历；空子节点表示为 null
    static void inorder(TreeNode node) {
        if (node == null) {
            return;
        }
        inorder(node.left);
        System.out.println(node.val);
        inorder(node.right);
    }

    public static void main(String[] args) {
        //     2
        //    / \
        //   1   3
        TreeNode root = new TreeNode(2, new TreeNode(1), new TreeNode(3));

        inorder(root); // => 1 2 3
        System.out.println(root.left.left == null); // => true
        System.out.println(new Solution().maxDepth(root)); // => 2
    }
}
```
