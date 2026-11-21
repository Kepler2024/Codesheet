# Java Cheat Sheet

> Written for Java 21

Use this quick reference to learn or revisit Java syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```java
// Every program needs a class with a main method; name the file after the class (Main.java)
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // => Hello, World!
    }
}
```

```bash
java Main.java    # Java 11+ compiles and runs a single file in one step
```

```java
// Most blocks below are just the body of main, to keep them short.
// To run one yourself, keep the imports at the top and put the rest inside main.
System.out.println("Hello from main"); // => Hello from main
```

## Variables

```java
// Every variable has a type, and the type never changes
int n = 0;
System.out.println(n); // => 0
// n = "abc";  // compile error: incompatible types

// var infers a local variable's type from its value
var count = 3;
var name = "alice";
System.out.println(count + " " + name); // => 3 alice

// Common types: int, long, double, boolean, char, String
long big = 4_000_000_000L;  // L: the literal is too big for an int
double ratio = 0.5;
boolean done = false;
char letter = 'a';  // single quotes for a char, double quotes for a String
System.out.println(big + " " + ratio + " " + done + " " + letter); // => 4000000000 0.5 false a

// final means the variable can't be reassigned
final int limit = 100;
// limit = 200;  // compile error: cannot assign a value to final variable limit
System.out.println(limit); // => 100

// No multiple assignment: swap with a temp variable
int a = 1, b = 2;
int tmp = a;
a = b;
b = tmp;
System.out.println(a + " " + b); // => 2 1

// Increment
n++;
n += 2;
System.out.println(n); // => 3

// null means "no object"; primitives such as int can't be null
String s = null;
System.out.println(s == null); // => true
// int x = null;  // compile error: incompatible types

// CAREFUL: calling a method on null throws NullPointerException
// s.length();  // NullPointerException
```

## If-statements

```java
// Parentheses around the condition are required
int n = 1;
if (n > 2) {
    n--;
} else if (n == 2) {
    n *= 2;
} else {
    n += 2;
}
System.out.println(n); // => 3

// Logical operators: && (and), || (or), ! (not)
int m = 5;
if (n > 0 && m > 0) {
    System.out.println("both"); // => both
}
System.out.println(!true + " " + (true || false)); // => false true

// CAREFUL: a condition must be a boolean; 0 and null aren't falsy
// if (n) {}  // compile error: int cannot be converted to boolean

// Ternary operator
String parity = n % 2 == 0 ? "even" : "odd";
System.out.println(parity); // => odd

// CAREFUL: == on objects compares references; compare Strings with equals()
String s1 = "hi";
String s2 = new String("hi");
System.out.println((s1 == s2) + " " + s1.equals(s2)); // => false true

// A switch expression (Java 14+) returns a value; -> cases don't fall through
String size = switch (n) {
    case 1, 2 -> "small";
    case 3 -> "medium";
    default -> "large";
};
System.out.println(size); // => medium
```

## Loops

```java
int n = 0;
while (n < 3) {
    System.out.println(n);
    n++;
}
// => 0 1 2

// i = 0 to 4
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
// => 0 1 2 3 4

// i = 2 to 5
for (int i = 2; i <= 5; i++) {
    System.out.println(i);
}
// => 2 3 4 5

// i = 5 down to 2
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

// A label lets break or continue act on an outer loop
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

## Math

```java
// / on two ints is integer division
System.out.println(5 / 2); // => 2

// Make one operand a double to keep the fraction
System.out.println(5 / 2.0); // => 2.5
System.out.println((double) 5 / 2); // => 2.5

// CAREFUL: integer division truncates toward 0 (Python gives -2)
System.out.println(-3 / 2); // => -1
// Math.floorDiv rounds down instead
System.out.println(Math.floorDiv(-3, 2)); // => -2

// CAREFUL: % takes the sign of the dividend (Python gives 2)
System.out.println(-10 % 3); // => -1
// Math.floorMod is never negative for a positive divisor
System.out.println(Math.floorMod(-10, 3)); // => 2

// floor, ceil, sqrt and pow return doubles
System.out.println(Math.floor(1.5) + " " + Math.ceil(1.5)); // => 1.0 2.0
System.out.println(Math.sqrt(16) + " " + Math.pow(2, 10)); // => 4.0 1024.0
System.out.println(Math.abs(-7) + " " + Math.max(3, 8) + " " + Math.min(3, 8)); // => 7 8 3

// Casting a double to int truncates toward 0
System.out.println((int) Math.sqrt(17) + " " + (int) -2.7); // => 4 -2

// Limits and infinity
System.out.println(Integer.MAX_VALUE + " " + Integer.MIN_VALUE); // => 2147483647 -2147483648
System.out.println(Long.MAX_VALUE); // => 9223372036854775807
System.out.println(Double.POSITIVE_INFINITY + " " + Double.NEGATIVE_INFINITY); // => Infinity -Infinity

// CAREFUL: int overflow wraps around silently
int big = Integer.MAX_VALUE;
big++;
System.out.println(big); // => -2147483648

// CAREFUL: widen to long BEFORE multiplying; casting the result is too late
int side = 50_000;
System.out.println(side * side); // => -1794967296
System.out.println((long) side * side); // => 2500000000
System.out.println((long) (side * side)); // => -1794967296

// Math.multiplyExact and addExact throw instead of wrapping
// Math.multiplyExact(side, side);  // ArithmeticException: integer overflow
```

## Output and Input

```java
import java.util.Arrays;

// println ends with a newline; print doesn't
System.out.print("same ");
System.out.println("line"); // => same line

// + with a String turns the other operand into text
System.out.println("a " + 1 + " " + true); // => a 1 true

// CAREFUL: + runs left to right, so numbers before the first String are added
System.out.println(1 + 2 + "3" + 4 + 5); // => 3345

// printf formats with %d, %s, %.2f; %n is a newline
String name = "alice";
int score = 90;
System.out.printf("%s scored %d%n", name, score); // => alice scored 90
System.out.printf("%.2f%n", 3.14159); // => 3.14

// CAREFUL: println(array) prints a reference like [I@1b6d3586; use Arrays.toString
int[] nums = {1, 2, 3};
System.out.println(Arrays.toString(nums)); // => [1, 2, 3]

// Print the elements separated by spaces
StringBuilder sb = new StringBuilder();
for (int x : nums) {
    sb.append(x).append(' ');
}
System.out.println(sb.toString().trim()); // => 1 2 3
```

```java
import java.util.Scanner;

// Scanner reads tokens and lines from stdin
Scanner in = new Scanner(System.in);

// nextInt skips any whitespace, including line breaks
int n = in.nextInt();
int[] nums = new int[n];
for (int i = 0; i < n; i++) {
    nums[i] = in.nextInt();
}

// CAREFUL: nextInt leaves the rest of its line unread;
// call nextLine() once to skip it before reading a whole line
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

// Scanner is slow on large inputs; BufferedReader reads lines, StringTokenizer splits them
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
StringTokenizer st = new StringTokenizer(br.readLine());
long sum = 0;
for (int i = 0; i < n; i++) {
    sum += Long.parseLong(st.nextToken());
}

// For large outputs, buffer them in a PrintWriter and flush once at the end
PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));
out.println(n + " " + sum); // => 3 15
out.flush();
```

```text stdin
3
4 5 6
```

## Primitive and Boxed Types

```java
import java.util.*;

// Collections can't hold primitives, only objects. Each primitive has a boxed class:
// int -> Integer, long -> Long, double -> Double, char -> Character, boolean -> Boolean
List<Integer> list = new ArrayList<>();
// List<int> bad;  // compile error: unexpected type

// Java converts between them automatically (autoboxing and unboxing)
list.add(5);
int first = list.get(0);
System.out.println(first + 1); // => 6

// CAREFUL: == on two Integers compares references. It only seems to work
// from -128 to 127, because those values are cached
Integer a = 127, b = 127;
Integer c = 1000, d = 1000;
System.out.println((a == b) + " " + (c == d)); // => true false

// Compare boxed values with equals, or unbox one side
System.out.println(c.equals(d) + " " + (c.intValue() == d)); // => true true

// CAREFUL: unboxing null throws, e.g. when a map has no such key
Map<String, Integer> counts = new HashMap<>();
System.out.println(counts.get("x")); // => null
// int missing = counts.get("x");  // NullPointerException

// CAREFUL: on a List<Integer>, remove(int) removes by index, remove(Object) by value
List<Integer> nums = new ArrayList<>(List.of(10, 20, 30));
nums.remove(1);
System.out.println(nums); // => [10, 30]
nums.remove(Integer.valueOf(10));
System.out.println(nums); // => [30]
```

## Arrays

```java
import java.util.Arrays;

// Arrays have a fixed size, set when they are created
int[] arr = {1, 2, 3};

// length is a field, not a method
System.out.println(arr.length); // => 3

// new int[n] fills the array with 0 (false for boolean, null for objects)
int[] zeros = new int[5];
System.out.println(Arrays.toString(zeros)); // => [0, 0, 0, 0, 0]

// Fill with another value
int[] ones = new int[3];
Arrays.fill(ones, 1);
System.out.println(Arrays.toString(ones)); // => [1, 1, 1]

// CAREFUL: there are no negative indexes, and an index out of range throws
// arr[-1]  // ArrayIndexOutOfBoundsException
System.out.println(arr[arr.length - 1]); // => 3

// A sub-array is a copy: copyOfRange(arr, start, end), end is exclusive
int[] part = Arrays.copyOfRange(arr, 1, 3);
System.out.println(Arrays.toString(part)); // => [2, 3]

// CAREFUL: == and equals compare references; use Arrays.equals for contents
int[] same = {1, 2, 3};
System.out.println((arr == same) + " " + Arrays.equals(arr, same)); // => false true
```

```java
import java.util.*;

// ArrayList is the dynamic array. Declare it as the List interface.
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
System.out.println(list + " " + list.size()); // => [1, 2, 3] 3

// get and set instead of []
list.set(0, 10);
System.out.println(list.get(0)); // => 10

// Use it as a stack: add and remove at the end are O(1)
list.add(4);
System.out.println(list.remove(list.size() - 1)); // => 4

// Peek at the end; getLast() and removeLast() are new in Java 21
System.out.println(list.getLast()); // => 3

// add(index, value) inserts in O(n)
list.add(1, 7);
System.out.println(list); // => [10, 7, 2, 3]

// A list of size n filled with a default value
List<Integer> zeros = new ArrayList<>(Collections.nCopies(3, 0));
System.out.println(zeros); // => [0, 0, 0]

// subList(start, end) is a view: writing to it changes the original list
List<Integer> view = list.subList(1, 3);
view.set(0, 99);
System.out.println(view + " " + list); // => [99, 2] [10, 99, 2, 3]

// contains and indexOf are O(n)
System.out.println(list.contains(2) + " " + list.indexOf(2) + " " + Collections.max(list)); // => true 2 99

// CAREFUL: List.of(...) is immutable; copy it into an ArrayList to change it
List<Integer> fixed = List.of(1, 2);
// fixed.add(3);  // UnsupportedOperationException
```

```java
import java.util.*;

int[] nums = {10, 20, 30};

// By index (also the way to get the index and the value together)
for (int i = 0; i < nums.length; i++) {
    System.out.println(i + " " + nums[i]);
}
// => 0 10 1 20 2 30

// By value, with a for-each loop (works on arrays and collections)
for (int n : nums) {
    System.out.println(n);
}
// => 10 20 30

// Two arrays in lockstep: loop to the shorter length
String[] letters = {"a", "b", "c"};
for (int i = 0; i < Math.min(nums.length, letters.length); i++) {
    System.out.println(nums[i] + letters[i]);
}
// => 10a 20b 30c

// CAREFUL: removing from a list inside for-each throws ConcurrentModificationException;
// use removeIf (or an index loop going backwards)
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4));
list.removeIf(x -> x % 2 == 0);
System.out.println(list); // => [1, 3]
```

```java
import java.util.*;

// Arrays.sort sorts an array in place
int[] nums = {5, 4, 7, 3, 8};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // => [3, 4, 5, 7, 8]

// CAREFUL: Arrays.sort(int[]) takes no comparator. To sort descending
// (or by a custom order), use Integer[] instead
Integer[] boxed = {5, 4, 7, 3, 8};
Arrays.sort(boxed, Collections.reverseOrder());
System.out.println(Arrays.toString(boxed)); // => [8, 7, 5, 4, 3]

// Lists sort with Collections.sort, or list.sort(comparator)
List<String> words = new ArrayList<>(List.of("bob", "alice", "jane", "doe"));
Collections.sort(words);
System.out.println(words); // => [alice, bob, doe, jane]
words.sort(Comparator.reverseOrder());
System.out.println(words); // => [jane, doe, bob, alice]

// Collections.reverse works in place (there's no built-in reverse for int[])
Collections.reverse(words);
System.out.println(words); // => [alice, bob, doe, jane]

// Custom order: by length, then alphabetically
words.sort(Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
System.out.println(words); // => [bob, doe, jane, alice]

// Sort pairs (int[] rows) by their second element
int[][] pairs = {{1, 3}, {2, 1}, {3, 2}};
Arrays.sort(pairs, (p, q) -> Integer.compare(p[1], q[1]));
System.out.println(Arrays.deepToString(pairs)); // => [[2, 1], [3, 2], [1, 3]]

// CAREFUL: the common (p, q) -> p[1] - q[1] overflows for large or negative values
```

```java
import java.util.*;

// 2-D array with 3 rows and 4 columns, filled with 0
int[][] grid = new int[3][4];
grid[0][0] = 1;
System.out.println(Arrays.deepToString(grid)); // => [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
System.out.println(grid.length + " " + grid[0].length); // => 3 4

// CAREFUL: Arrays.fill(rows, row) puts the SAME row object in every slot
int[][] bad = new int[3][];
Arrays.fill(bad, new int[4]);
bad[0][0] = 1;
System.out.println(bad[1][0] + " " + bad[2][0]); // => 1 1

// A list of lists: add a new list for each row
List<List<Integer>> rows = new ArrayList<>();
for (int i = 0; i < 2; i++) {
    rows.add(new ArrayList<>());
}
rows.get(0).add(5);
System.out.println(rows); // => [[5], []]

// CAREFUL: in backtracking, add a copy of the path, not the path itself
List<Integer> path = new ArrayList<>(List.of(1, 2));
List<List<Integer>> res = new ArrayList<>();
res.add(path);
res.add(new ArrayList<>(path));
path.set(0, 9);
System.out.println(res); // => [[9, 2], [1, 2]]
```

## Strings

```java
String s = "abc";

// charAt gets a char; substring(start, end) is end-exclusive
System.out.println(s.charAt(0)); // => a
System.out.println(s.substring(1) + " " + s.substring(0, 2)); // => bc ab
System.out.println(s.length() + " " + s.indexOf('c') + " " + s.contains("bc")); // => 3 2 true

// CAREFUL: strings are immutable; methods like toUpperCase return a new string
// s.charAt(0) = 'A';  // compile error
// To change characters, edit a char[] and make a new String
char[] chars = s.toCharArray();
chars[0] = 'A';
System.out.println(new String(chars)); // => Abc

// + creates a new string each time; build in a loop with StringBuilder
StringBuilder sb = new StringBuilder();
for (char ch : "abc".toCharArray()) {
    sb.append(Character.toUpperCase(ch));
}
System.out.println(sb.toString()); // => ABC

// StringBuilder can also reverse, insert and delete
System.out.println(new StringBuilder("hello").reverse()); // => olleh

// String <-> number
System.out.println(Integer.parseInt("123") + 1); // => 124
System.out.println(String.valueOf(123) + "4"); // => 1234
// Integer.parseInt("12a");  // NumberFormatException

// Char <-> code: a char is a 16-bit number
char c = 'a';
System.out.println((int) c); // => 97
System.out.println((char) (c + 1)); // => b

// CAREFUL: char + int, and even char + char, is an int
System.out.println('a' + 1); // => 98
System.out.println('a' + 'b'); // => 195

// Digit to number, and a letter's index into an int[26]
System.out.println(('7' - '0') + " " + ('c' - 'a')); // => 7 2

// split takes a regex; \\s+ splits on any run of whitespace
String[] words = "the quick  brown fox".split("\\s+");
System.out.println(words.length); // => 4
System.out.println(String.join("-", words)); // => the-quick-brown-fox

// CAREFUL: "." is a regex that matches any character; escape it
System.out.println("a.b".split(".").length + " " + "a.b".split("\\.").length); // => 0 2

// Compare contents with equals; compareTo is lexicographic (negative, 0 or positive)
System.out.println("abc".equals(s) + " " + ("apple".compareTo("banana") < 0)); // => true true

System.out.println("Hello".toLowerCase() + " " + "  hi ".trim()); // => hello hi
System.out.println(Character.isDigit('7') + " " + Character.isLetter('x')); // => true true
```

## Queues

```java
import java.util.*;

// ArrayDeque is a double-ended queue: O(1) at both ends
Deque<Integer> dq = new ArrayDeque<>();
dq.offerLast(1);
dq.offerLast(2);
dq.offerFirst(0);
System.out.println(dq); // => [0, 1, 2]

System.out.println(dq.pollFirst()); // => 0
System.out.println(dq.pollLast()); // => 2

// Peek at the front and the back, and the size
dq.offerLast(3);
System.out.println(dq.peekFirst() + " " + dq.peekLast() + " " + dq.size()); // => 1 3 2

// CAREFUL: poll and peek return null when empty; remove, get and pop throw instead
dq.clear();
System.out.println(dq.pollFirst() + " " + dq.peekLast()); // => null null
// dq.removeFirst();  // NoSuchElementException

// As a plain queue: offer adds at the back, poll removes from the front
Queue<Integer> queue = new ArrayDeque<>(List.of(1, 2, 3));
while (!queue.isEmpty()) {
    System.out.println(queue.poll());
}
// => 1 2 3

// As a stack: push, pop and peek all work at the front.
// Prefer this to the old Stack class.
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
System.out.println(stack.peek() + " " + stack.pop() + " " + stack.size()); // => 2 2 1
```

## HashSets

```java
import java.util.*;

Set<Integer> seen = new HashSet<>();
seen.add(1);
seen.add(2);

// add returns false if the item was already there
System.out.println(seen.add(2)); // => false
System.out.println(seen.size()); // => 2

System.out.println(seen.contains(1) + " " + seen.contains(3)); // => true false

// remove does nothing if the item is missing
seen.remove(2);
seen.remove(42);
System.out.println(seen); // => [1]

// Build from a list, or from an array with a loop
Set<Integer> fromList = new HashSet<>(List.of(1, 2, 2, 3));
System.out.println(fromList.size()); // => 3
int[] arr = {3, 1, 3};
Set<Integer> fromArr = new HashSet<>();
for (int x : arr) {
    fromArr.add(x);
}
System.out.println(fromArr.size()); // => 2

// CAREFUL: Set.of(...) throws on duplicate elements, and it's immutable
// Set.of(1, 2, 2);  // IllegalArgumentException: duplicate element: 2
```

```java
import java.util.*;

// CAREFUL: a HashSet's iteration order is unspecified; a TreeSet keeps items sorted
Set<String> names = new TreeSet<>(List.of("bob", "alice", "jane"));
for (String name : names) {
    System.out.println(name);
}
// => alice bob jane

// Union, intersection and difference modify the set they're called on, so copy first
Set<Integer> a = new TreeSet<>(List.of(1, 2, 3));
Set<Integer> b = Set.of(2, 3, 4);
Set<Integer> union = new TreeSet<>(a);
union.addAll(b);
Set<Integer> inter = new TreeSet<>(a);
inter.retainAll(b);
Set<Integer> diff = new TreeSet<>(a);
diff.removeAll(b);
System.out.println(union + " " + inter + " " + diff); // => [1, 2, 3, 4] [2, 3] [1]

// TreeSet also finds the nearest items in O(log n)
TreeSet<Integer> sorted = new TreeSet<>(List.of(1, 4, 9));
System.out.println(sorted.floor(5) + " " + sorted.ceiling(5) + " " + sorted.first()); // => 4 9 1
```

## HashMaps

```java
import java.util.*;

Map<String, Integer> scores = new HashMap<>();
scores.put("alice", 88);
scores.put("bob", 77);
System.out.println(scores.size()); // => 2

// put overwrites an existing key
scores.put("alice", 80);
System.out.println(scores.get("alice")); // => 80

// CAREFUL: get returns null for a missing key; getOrDefault returns a default instead
System.out.println(scores.get("zoe") + " " + scores.getOrDefault("zoe", 0)); // => null 0

System.out.println(scores.containsKey("alice")); // => true
scores.remove("alice");
System.out.println(scores.containsKey("alice")); // => false
```

```java
import java.util.*;

// CAREFUL: a HashMap's iteration order is unspecified.
// LinkedHashMap keeps insertion order and TreeMap keeps keys sorted.
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

// Counting with getOrDefault (a TreeMap here, so it prints sorted)
Map<Character, Integer> count = new TreeMap<>();
for (char ch : "banana".toCharArray()) {
    count.put(ch, count.getOrDefault(ch, 0) + 1);
}
System.out.println(count); // => {a=3, b=1, n=2}

// merge does the same in one call
Map<Character, Integer> count2 = new HashMap<>();
for (char ch : "banana".toCharArray()) {
    count2.merge(ch, 1, Integer::sum);
}
System.out.println(count2.get('a')); // => 3

// computeIfAbsent creates a missing value on first access, e.g. for grouping
Map<String, List<String>> groups = new TreeMap<>();
for (String word : List.of("eat", "tea", "tan")) {
    char[] letters = word.toCharArray();
    Arrays.sort(letters);
    groups.computeIfAbsent(new String(letters), k -> new ArrayList<>()).add(word);
}
System.out.println(groups); // => {aet=[eat, tea], ant=[tan]}

// For lowercase letters, an int[26] is faster than a map
int[] freq = new int[26];
for (char ch : "banana".toCharArray()) {
    freq[ch - 'a']++;
}
System.out.println(freq[0] + " " + freq[1]); // => 3 1
```

## Tuples

```java
// Java has no tuples. A record is a one-line immutable class that gets a constructor,
// accessors, equals, hashCode and toString for free.
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
        // Returning several values: return a record and read its fields
        MinMax mm = minMax(new int[]{3, 1, 4});
        System.out.println(mm.lo() + " " + mm.hi()); // => 1 4
        System.out.println(mm); // => MinMax[lo=1, hi=4]

        // A record is a good composite key, because equals compares the fields
        Set<Cell> visited = new HashSet<>();
        visited.add(new Cell(0, 1));
        System.out.println(visited.contains(new Cell(0, 1))); // => true

        // List.of(...) also works as a key
        Map<List<Integer>, Integer> dist = new HashMap<>();
        dist.put(List.of(0, 1), 1);
        System.out.println(dist.get(List.of(0, 1))); // => 1

        // CAREFUL: an int[] is NOT a usable key: arrays compare by reference
        Set<int[]> bad = new HashSet<>();
        bad.add(new int[]{0, 1});
        System.out.println(bad.contains(new int[]{0, 1})); // => false
    }
}
```

## Heaps

```java
import java.util.*;

// PriorityQueue is a min-heap by default
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(3);
minHeap.offer(1);
minHeap.offer(2);

// peek looks at the minimum; poll removes it
System.out.println(minHeap.peek()); // => 1
while (!minHeap.isEmpty()) {
    System.out.println(minHeap.poll());
}
// => 1 2 3

// CAREFUL: poll and peek return null on an empty heap
System.out.println(minHeap.poll()); // => null

// Build from a collection in O(n)
PriorityQueue<Integer> heap = new PriorityQueue<>(List.of(5, 1, 8, 3));
System.out.println(heap.poll() + " " + heap.size()); // => 1 3

// CAREFUL: printing or iterating a PriorityQueue doesn't give sorted order; poll repeatedly
```

```java
import java.util.*;

// Max-heap: pass a reversed comparator
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
maxHeap.addAll(List.of(3, 1, 5));
System.out.println(maxHeap.poll()); // => 5

// Custom priority: int[] pairs ordered by their second element
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));
pq.offer(new int[]{7, 2});
pq.offer(new int[]{8, 1});
pq.offer(new int[]{9, 3});
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    System.out.println(top[0] + " " + top[1]);
}
// => 8 1 7 2 9 3

// A record with a comparator chain reads better and breaks ties explicitly
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

## Functions

```java
public class Main {
    // Every method lives in a class; static methods are called without an object
    static int multiply(int n, int m) {
        return n * m;
    }

    // No default values or keyword arguments: overload with fewer parameters instead
    static String greet(String name) {
        return greet(name, "Hello");
    }

    static String greet(String name, String greeting) {
        return greeting + ", " + name + "!";
    }

    // Variadic parameter: nums is an int[] inside the method
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

// A lambda implements a functional interface such as Function or BiFunction
Function<Integer, Integer> square = x -> x * x;
System.out.println(square.apply(5)); // => 25
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
System.out.println(add.apply(2, 3)); // => 5

// A method reference is shorthand for a lambda that calls one method
Predicate<String> isEmpty = String::isEmpty;
System.out.println(isEmpty.test("")); // => true

// CAREFUL: a lambda can use a local variable only if it's never reassigned
int base = 10;
// base++;  // would make the next line a compile error
Function<Integer, Integer> addBase = x -> x + base;
System.out.println(addBase.apply(5)); // => 15

// To update a counter from a lambda, use a one-element array (or a field)
int[] total = {0};
List.of(1, 2, 3).forEach(x -> total[0] += x);
System.out.println(total[0]); // => 6
```

```java
// Java has no nested functions. A recursive helper is another method, and state
// shared across calls lives in a field (a common LeetCode pattern).
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
    // Java always passes a copy. For an object, the copy is a reference to the
    // same object, so changes to the object are visible to the caller...
    static void appendOne(List<Integer> list) {
        list.add(1);
    }

    // ...but pointing the parameter at a new object doesn't affect the caller
    static void replace(List<Integer> list) {
        list = new ArrayList<>(List.of(99));
    }

    // Primitives are copied, so the caller's int never changes
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

## Classes

```java
import java.util.*;

public class Main {
    // A nested class must be static to be created without an outer Main object
    static class Point implements Comparable<Point> {
        // Fields
        int x, y;

        // Constructor: the class name, no return type
        Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        int distSq() {
            return x * x + y * y;
        }

        // Optional: how the object prints
        @Override
        public String toString() {
            return "Point(" + x + ", " + y + ")";
        }

        // Optional: a natural order, so Points can be sorted or put in a PriorityQueue
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

        // CAREFUL: as a HashMap key or HashSet item, a class needs equals and
        // hashCode; without them, two equal-looking Points are different keys
        Set<Point> set = new HashSet<>(List.of(new Point(1, 1)));
        System.out.println(set.contains(new Point(1, 1))); // => false
    }
}
```

```java
// LeetCode's linked list node for Java
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

        // Walk the list until the end (null)
        for (ListNode node = head; node != null; node = node.next) {
            System.out.println(node.val);
        }
        // => 1 2 3
    }
}
```

```java
// LeetCode's binary tree node for Java
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

// On LeetCode you complete a method of class Solution
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}

public class Main {
    // In-order traversal; a missing child is null
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
