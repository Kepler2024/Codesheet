# Java Cheat Sheet

> Written for Java 21

Use this quick reference to learn or revisit Java syntax and common data structures. In the examples, `// =>` marks the expected output.

## Running a Program

```java
class Main {
    public static void main(String[] args) {
        // The launcher calls main. Save this file as Main.java.
        System.out.println("hello"); // => hello
    }
}
```

```bash
java Main.java
```

## Variables

```java
class Main {
    public static void main(String[] args) {
        var steps = 1;
        final int limit = 3;
        long distance = 4_000_000_000L;
        double ratio = 0.5;
        boolean ready = true;
        char letter = 'a';
        String label = null;
        steps++;
        System.out.println(steps + " " + limit + " " + distance); // => 2 3 4000000000
        System.out.println(ratio + " " + ready + " " + letter + " " + (label == null)); // => 0.5 true a true

        int a = 1, b = 2;
        int tmp = a;
        a = b;
        b = tmp;
        System.out.println(a + " " + b); // => 2 1
    }
}
```

## If-statements

```java
class Main {
    public static void main(String[] args) {
        int x = 7;
        String group;
        if (x <= 0) {
            group = "low";
        } else if (x < 10 && x != 5) {
            group = "middle";
        } else {
            group = "high";
        }
        System.out.println(group + " " + (x % 2 == 0 ? "even" : "odd")); // => middle odd
        System.out.println(!(x < 0 || x > 10)); // => true
    }
}
```

## Loops

```java
class Main {
    public static void main(String[] args) {
        int n = 2;
        while (n > 0) System.out.println(n--);
        // => 2 1
        for (int i = 0; i < 6; i++) {
            if (i == 1) continue;
            if (i == 4) break;
            System.out.println(i);
        }
        // => 0 2 3
        for (int i = 2; i <= 4; i++) System.out.println(i);
        // => 2 3 4
        for (int i = 4; i >= 2; i--) System.out.println(i);
        // => 4 3 2
    }
}
```

## Math

```java
class Main {
    public static void main(String[] args) {
        // CAREFUL: integer division truncates toward zero. The remainder follows the dividend.
        System.out.println(-3 / 2 + " " + -3 / 2.0 + " " + -10 % 3); // => -1 -1.5 -1
        System.out.println(Math.floorDiv(-3, 2) + " " + Math.floorMod(-10, 3)); // => -2 2
        System.out.println(Math.floor(1.5) + " " + Math.ceil(1.5)); // => 1.0 2.0
        System.out.println(Math.sqrt(9) + " " + Math.pow(2, 3) + " " + Math.abs(-5)); // => 3.0 8.0 5
        System.out.println(Integer.MIN_VALUE + " " + Integer.MAX_VALUE); // => -2147483648 2147483647
        // CAREFUL: int arithmetic wraps. Widen an operand before multiplying.
        int side = 50_000;
        System.out.println(side * side + " " + (long) side * side); // => -1794967296 2500000000
        System.out.println(Double.POSITIVE_INFINITY); // => Infinity
    }
}
```

## Output and Input

```java
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        // nextLine keeps spaces. nextInt reads across line boundaries.
        var in = new Scanner(System.in);
        System.out.println(in.nextLine()); // => case one
        int n = in.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) sum += in.nextInt();
        System.out.printf("%d %d%n", n, sum); // => 3 9
    }
}
```

```text stdin
case one
3
2 3
4
```

## Primitive and Boxed Types

```java
class Main {
    public static void main(String[] args) {
        // Collections hold Integer objects. Unboxing converts them back to int.
        Integer a = 127, b = 127;
        System.out.println(a == b); // => true
        // CAREFUL: == compares references for two Integer operands. Use equals for values.
        Integer x = 1000, y = Integer.valueOf("1000");
        System.out.println(x.equals(y) + " " + (x.intValue() == y.intValue())); // => true true
        Integer absent = null;
        System.out.println(absent == null); // => true
    }
}
```

## Arrays

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        int[] fixed = new int[3];
        System.out.println(Arrays.toString(fixed)); // => [0, 0, 0]
        var nums = new ArrayList<>(List.of(4, 1, 3));
        nums.addLast(9);
        System.out.println(nums.removeLast() + " " + nums.size()); // => 9 3
        nums.set(0, 5);
        System.out.println(nums.getFirst() + " " + nums.getLast()); // => 5 3
        // CAREFUL: subList is a view. Copy it to keep independent elements.
        var part = nums.subList(0, 2);
        part.set(1, 7);
        System.out.println(nums + " " + new ArrayList<>(part)); // => [5, 7, 3] [5, 7]
        try {
            nums.get(-1);
        } catch (IndexOutOfBoundsException ex) {
            System.out.println("invalid index"); // => invalid index
        }

        for (int i = 0; i < nums.size(); i++) System.out.println(i);
        // => 0 1 2
        for (int v : nums) System.out.println(v);
        // => 5 7 3
        int[] weights = {2, 3};
        for (int i = 0; i < Math.min(nums.size(), weights.length); i++) {
            System.out.printf("%d %d %d%n", i, nums.get(i), weights[i]);
        }
        // => 0 5 2 1 7 3
    }
}
```

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        var nums = new ArrayList<>(List.of(4, 1, 3));
        Collections.reverse(nums);
        System.out.println(nums); // => [3, 1, 4]
        nums.sort(Comparator.naturalOrder());
        System.out.println(nums); // => [1, 3, 4]
        nums.sort(Comparator.reverseOrder());
        System.out.println(nums); // => [4, 3, 1]
        // CAREFUL: Arrays.sort(int[]) has no comparator overload. Box the elements for custom ordering.
        Integer[] scores = {-4, 1, -2};
        Arrays.sort(scores, Comparator.comparingInt(v -> Math.abs(v)));
        System.out.println(Arrays.toString(scores)); // => [1, -2, -4]
        int[][] grid = new int[2][3];
        grid[0][0] = 7;
        System.out.println(grid[1][0]); // => 0
        int[][] aliases = new int[2][];
        Arrays.fill(aliases, new int[3]);
        aliases[0][0] = 7;
        System.out.println(aliases[1][0]); // => 7
    }
}
```

## Strings

```java
class Main {
    public static void main(String[] args) {
        String s = "code";
        System.out.println(s.charAt(0) + " " + s.substring(1, 3)); // => c od
        // String is immutable. Append repeated pieces to a StringBuilder.
        var out = new StringBuilder();
        for (char c : s.toCharArray()) out.append(Character.toUpperCase(c));
        System.out.println("go-" + out); // => go-CODE
        System.out.println(Integer.parseInt("41") + 1); // => 42
        System.out.println(String.valueOf(41) + "2"); // => 412
        // CAREFUL: char + int promotes the char to int. Cast to get a UTF-16 code unit back.
        System.out.println('a' + 1); // => 98
        System.out.println((char) 98); // => b
        System.out.println(String.join("-", "one  two".split("\\s+"))); // => one-two
        System.out.println(s.equals("code") + " " + ("ant".compareTo("bee") < 0)); // => true true
    }
}
```

## Queues

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        Deque<Integer> q = new ArrayDeque<>();
        q.addLast(2);
        q.addFirst(1);
        System.out.println(q.peekFirst() + " " + q.peekLast() + " " + q.size()); // => 1 2 2
        System.out.println(q.removeFirst() + " " + q.removeLast() + " " + q.pollFirst()); // => 1 2 null
    }
}
```

## HashSets

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        var seen = new HashSet<>(Arrays.asList(2, 2, 3));
        seen.add(5);
        seen.remove(3);
        System.out.println(seen.contains(2) + " " + seen.size()); // => true 2
        int sum = 0;
        for (int v : seen) sum += v;
        System.out.println(sum); // => 7
    }
}
```

## HashMaps

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        var count = new HashMap<Character, Integer>();
        count.put('x', 4);
        count.put('x', 5);
        System.out.println(count.get('x') + " " + count.containsKey('x')); // => 5 true
        count.remove('x');
        for (char c : "banana".toCharArray()) count.merge(c, 1, Integer::sum);
        System.out.println(count.size() + " " + count.getOrDefault('a', 0)); // => 3 3
        for (char k : new TreeSet<>(count.keySet())) System.out.println(k);
        // => a b n
        int total = 0;
        for (int n : count.values()) total += n;
        System.out.println(total); // => 6
        for (var entry : new TreeMap<>(count).entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
        // => a 3 b 1 n 2
    }
}
```

## Tuples

```java
// Java has no built-in tuple. Records generate accessors, equals and hashCode.
import java.util.*;

class Main {
    record Bounds(int lo, int hi) {}
    record Cell(int row, int col) {}
    static Bounds bounds(int[] nums) {
        var stats = Arrays.stream(nums).summaryStatistics();
        return new Bounds(stats.getMin(), stats.getMax());
    }

    public static void main(String[] args) {
        var span = bounds(new int[]{4, 1, 7});
        System.out.println(span.lo() + " " + span.hi()); // => 1 7
        var visited = Set.of(new Cell(2, 3));
        System.out.println(visited.contains(new Cell(2, 3))); // => true
    }
}
```

## Heaps

```java
import java.util.*;

class Main {
    public static void main(String[] args) {
        var min = new PriorityQueue<>(List.of(5, 2, 3));
        min.offer(1);
        System.out.println(min.peek() + " " + min.poll() + " " + min.size()); // => 1 1 3
        var max = new PriorityQueue<Integer>(Comparator.reverseOrder());
        max.addAll(List.of(5, 2, 3));
        System.out.println(max.remove()); // => 5
        record Job(String name, int cost) {}
        var jobs = new PriorityQueue<>(Comparator.comparingInt(Job::cost));
        jobs.add(new Job("ship", 3));
        jobs.add(new Job("plan", 1));
        System.out.println(jobs.remove().name()); // => plan
    }
}
```

## Functions

```java
import java.util.function.*;

class Main {
    static int edit(int[] nums) {
        nums[0] = 7;
        nums = new int[]{9};
        return nums[0];
    }

    public static void main(String[] args) {
        // Lambda captures must be effectively final. A captured object's contents can change.
        int[] total = {1};
        IntUnaryOperator add = step -> total[0] += step;
        System.out.println(add.applyAsInt(3) + " " + total[0]); // => 4 4
        int[] nums = {1, 2};
        System.out.println(edit(nums) + " " + nums[0]); // => 9 7
    }
}
```

## Classes

```java
class Main {
    static class Point {
        final int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }
        int distSq() { return x * x + y * y; }
    }

    public static void main(String[] args) {
        System.out.println(new Point(3, 4).distSq()); // => 25
    }
}
```

```java
class Main {
    public static class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    public static class TreeNode {
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
    static void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.println(node.val);
        inorder(node.right);
    }

    public static void main(String[] args) {
        var head = new ListNode(1, new ListNode(2));
        for (var node = head; node != null; node = node.next) System.out.println(node.val);
        // => 1 2
        var root = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        inorder(root); // => 1 2 3
        System.out.println(root.left.right == null); // => true
    }
}
```
