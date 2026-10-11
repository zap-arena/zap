// Coding Problems Dataset for CodeZap Problems Directory
export interface ProblemTestCase {
  id: string;
  name?: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
  explanation?: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemItem {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  points: number;
  acceptanceRate: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: ProblemExample[];
  testCases: ProblemTestCase[];
  boilerplates: {
    python: string;
    cpp: string;
    java: string;
  };
}

export const PROBLEM_CATEGORIES = [
  "All Topics",
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Dynamic Programming",
  "Math & Number Theory",
] as const;

export const PROBLEMS_DATA: ProblemItem[] = [
  {
    id: "prob-two-sum",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    tags: ["Array", "Hash Table"],
    points: 100,
    acceptanceRate: "52.4%",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **0-based indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice. You can return the answer with indices separated by a single space in increasing order.`,
    inputFormat: `The first line contains an integer \`n\` (the length of the array).
The second line contains \`n\` space-separated integers representing \`nums\`.
The third line contains an integer \`target\`.`,
    outputFormat: `Print the two indices separated by a space (e.g., \`0 1\`).`,
    constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
    examples: [
      {
        input: `4\n2 7 11 15\n9`,
        output: `0 1`,
        explanation: `Because nums[0] + nums[1] == 9, we print 0 1.`,
      },
      {
        input: `3\n3 2 4\n6`,
        output: `1 2`,
      },
    ],
    testCases: [
      {
        id: "tc-1",
        name: "Sample 1",
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
      },
      {
        id: "tc-2",
        name: "Sample 2",
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
      },
      {
        id: "tc-3",
        name: "Equal elements",
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
      },
      {
        id: "tc-4",
        name: "Negative numbers",
        input: "4\n-1 -2 -3 -4\n-5",
        expectedOutput: "0 3",
        hidden: true,
      },
      {
        id: "tc-5",
        name: "Target with zero",
        input: "5\n0 4 3 0 2\n0",
        expectedOutput: "0 3",
        hidden: true,
      },
    ],
    boilerplates: {
      python: `import sys

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    target = int(lines[n+1])

    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            print(f"{lookup[diff]} {i}")
            return
        lookup[num] = i

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;

    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            cout << seen[diff] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        int target = sc.nextInt();

        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                System.out.println(map.get(complement) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
    },
  },
  {
    id: "prob-palindrome-number",
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math & Number Theory",
    tags: ["Math"],
    points: 80,
    acceptanceRate: "55.8%",
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a **palindrome**, and \`false\` otherwise.

An integer is a palindrome when it reads the same backward as forward. For example, \`121\` is a palindrome while \`123\` is not. Negative numbers are never palindromes.`,
    inputFormat: `A single integer \`x\`.`,
    outputFormat: `Print \`true\` or \`false\`.`,
    constraints: `-2^31 <= x <= 2^31 - 1`,
    examples: [
      {
        input: `121`,
        output: `true`,
      },
      {
        input: `-121`,
        output: `false`,
        explanation: `From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.`,
      },
      {
        input: `10`,
        output: `false`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "Sample 1", input: "121", expectedOutput: "true" },
      { id: "tc-2", name: "Negative number", input: "-121", expectedOutput: "false" },
      { id: "tc-3", name: "Ends with zero", input: "10", expectedOutput: "false" },
      { id: "tc-4", name: "Single digit", input: "7", expectedOutput: "true", hidden: true },
      { id: "tc-5", name: "Large palindrome", input: "1234321", expectedOutput: "true", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def is_palindrome(x: int) -> bool:
    if x < 0:
        return False
    s = str(x)
    return s == s[::-1]

def main():
    line = sys.stdin.read().strip()
    if not line:
        return
    x = int(line)
    print("true" if is_palindrome(x) else "false")

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;
    int revertedNumber = 0;
    while (x > revertedNumber) {
        revertedNumber = revertedNumber * 10 + x % 10;
        x /= 10;
    }
    return x == revertedNumber || x == revertedNumber / 10;
}

int main() {
    int x;
    if (cin >> x) {
        cout << (isPalindrome(x) ? "true" : "false") << endl;
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int x = sc.nextInt();
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            System.out.println("false");
            return;
        }
        int rev = 0;
        int temp = x;
        while (temp > rev) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }
        boolean isPal = (temp == rev || temp == rev / 10);
        System.out.println(isPal ? "true" : "false");
    }
}
`,
    },
  },
  {
    id: "prob-valid-parentheses",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    tags: ["String", "Stack"],
    points: 100,
    acceptanceRate: "41.2%",
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: `A single string \`s\` containing brackets.`,
    outputFormat: `Print \`true\` if the string is valid, or \`false\` otherwise.`,
    constraints: `1 <= s.length <= 10^4
\`s\` consists of parentheses only \`'()[]{}'\`.`,
    examples: [
      { input: `()`, output: `true` },
      { input: `()[]{}`, output: `true` },
      { input: `(]`, output: `false` },
      { input: `([)]`, output: `false` },
      { input: `{[]}`, output: `true` },
    ],
    testCases: [
      { id: "tc-1", name: "Simple pair", input: "()", expectedOutput: "true" },
      { id: "tc-2", name: "Multiple pairs", input: "()[]{}", expectedOutput: "true" },
      { id: "tc-3", name: "Mismatched pair", input: "(]", expectedOutput: "false" },
      { id: "tc-4", name: "Interleaved invalid", input: "([)]", expectedOutput: "false", hidden: true },
      { id: "tc-5", name: "Nested valid", input: "{[]}", expectedOutput: "true", hidden: true },
      { id: "tc-6", name: "Single bracket", input: "[", expectedOutput: "false", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

def main():
    s = sys.stdin.read().strip()
    print("true" if is_valid(s) else "false")

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if ((c == ')' && top != '(') ||
                (c == '}' && top != '{') ||
                (c == ']' && top != '[')) {
                return false;
            }
        }
    }
    return st.empty();
}

int main() {
    string s;
    if (cin >> s) {
        cout << (isValid(s) ? "true" : "false") << endl;
    }
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.Stack;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Stack<Character> stack = new Stack<>();
        boolean valid = true;

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) {
                    valid = false;
                    break;
                }
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == '}' && top != '{') ||
                    (c == ']' && top != '[')) {
                    valid = false;
                    break;
                }
            }
        }
        if (!stack.isEmpty()) valid = false;
        System.out.println(valid ? "true" : "false");
    }
}
`,
    },
  },
  {
    id: "prob-max-subarray",
    slug: "maximum-subarray",
    title: "Maximum Subarray (Kadane's)",
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    points: 120,
    acceptanceRate: "50.8%",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    inputFormat: `The first line contains integer \`n\`.
The second line contains \`n\` space-separated integers representing \`nums\`.`,
    outputFormat: `Print the maximum subarray sum.`,
    constraints: `1 <= nums.length <= 10^5
-10^4 <= nums[i] <= 10^4`,
    examples: [
      {
        input: `9\n-2 1 -3 4 -1 2 1 -5 4`,
        output: `6`,
        explanation: `The subarray [4,-1,2,1] has the largest sum 6.`,
      },
      {
        input: `1\n1`,
        output: `1`,
      },
      {
        input: `5\n5 4 -1 7 8`,
        output: `23`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "Sample 1", input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { id: "tc-2", name: "Single positive", input: "1\n1", expectedOutput: "1" },
      { id: "tc-3", name: "All positive", input: "5\n5 4 -1 7 8", expectedOutput: "23" },
      { id: "tc-4", name: "All negative", input: "4\n-4 -2 -5 -1", expectedOutput: "-1", hidden: true },
      { id: "tc-5", name: "Mixed sequence", input: "6\n-2 -3 4 -1 -2 1 5 -3", expectedOutput: "7", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def max_sub_array(nums):
    max_sum = nums[0]
    curr_sum = nums[0]
    for x in nums[1:]:
        curr_sum = max(x, curr_sum + x)
        max_sum = max(max_sum, curr_sum)
    return max_sum

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    print(max_sub_array(nums))

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < n; i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    cout << maxSum << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();

        int maxSum = nums[0];
        int curr = nums[0];
        for (int i = 1; i < n; i++) {
            curr = Math.max(nums[i], curr + nums[i]);
            maxSum = Math.max(maxSum, curr);
        }
        System.out.println(maxSum);
    }
}
`,
    },
  },
  {
    id: "prob-climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    tags: ["Math", "Dynamic Programming", "Memoization"],
    points: 80,
    acceptanceRate: "53.1%",
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    inputFormat: `A single integer \`n\`.`,
    outputFormat: `Print the total number of distinct ways to reach the top.`,
    constraints: `1 <= n <= 45`,
    examples: [
      {
        input: `2`,
        output: `2`,
        explanation: `There are two ways: 1 step + 1 step, or 2 steps.`,
      },
      {
        input: `3`,
        output: `3`,
        explanation: `There are three ways: 1+1+1, 1+2, or 2+1.`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "n = 2", input: "2", expectedOutput: "2" },
      { id: "tc-2", name: "n = 3", input: "3", expectedOutput: "3" },
      { id: "tc-3", name: "n = 4", input: "4", expectedOutput: "5" },
      { id: "tc-4", name: "n = 1", input: "1", expectedOutput: "1", hidden: true },
      { id: "tc-5", name: "n = 10", input: "10", expectedOutput: "89", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

def main():
    line = sys.stdin.read().strip()
    if not line:
        return
    n = int(line)
    print(climb_stairs(n))

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}

int main() {
    int n;
    if (cin >> n) {
        cout << climbStairs(n) << endl;
    }
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        if (n <= 2) {
            System.out.println(n);
            return;
        }
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        System.out.println(b);
    }
}
`,
    },
  },
  {
    id: "prob-container-with-most-water",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    tags: ["Array", "Two Pointers", "Greedy"],
    points: 140,
    acceptanceRate: "54.7%",
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water** a container can store.`,
    inputFormat: `The first line contains integer \`n\`.
The second line contains \`n\` space-separated integers representing \`height\`.`,
    outputFormat: `Print the maximum volume of water that can be stored.`,
    constraints: `2 <= n <= 10^5
0 <= height[i] <= 10^4`,
    examples: [
      {
        input: `9\n1 8 6 2 5 4 8 3 7`,
        output: `49`,
        explanation: `The vertical lines 8 and 7 form a container of width 7 and height 7 -> 49.`,
      },
      {
        input: `2\n1 1`,
        output: `1`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "Sample 1", input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
      { id: "tc-2", name: "Sample 2", input: "2\n1 1", expectedOutput: "1" },
      { id: "tc-3", name: "Decreasing", input: "4\n4 3 2 1", expectedOutput: "4", hidden: true },
      { id: "tc-4", name: "Equal heights", input: "5\n5 5 5 5 5", expectedOutput: "20", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def max_area(height):
    l, r = 0, len(height) - 1
    res = 0
    while l < r:
        res = max(res, min(height[l], height[r]) * (r - l))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return res

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    height = [int(x) for x in lines[1:n+1]]
    print(max_area(height))

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> height(n);
    for (int i = 0; i < n; i++) cin >> height[i];

    int l = 0, r = n - 1;
    int maxWater = 0;
    while (l < r) {
        maxWater = max(maxWater, min(height[l], height[r]) * (r - l));
        if (height[l] < height[r]) l++;
        else r--;
    }
    cout << maxWater << "\\n";
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();

        int l = 0, r = n - 1;
        int maxWater = 0;
        while (l < r) {
            maxWater = Math.max(maxWater, Math.min(h[l], h[r]) * (r - l));
            if (h[l] < h[r]) l++;
            else r--;
        }
        System.out.println(maxWater);
    }
}
`,
    },
  },
  {
    id: "prob-binary-search",
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    tags: ["Array", "Binary Search"],
    points: 90,
    acceptanceRate: "58.2%",
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its **0-based index**. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    inputFormat: `The first line contains integer \`n\`.
The second line contains \`n\` space-separated sorted integers representing \`nums\`.
The third line contains integer \`target\`.`,
    outputFormat: `Print the index of \`target\` or \`-1\` if not found.`,
    constraints: `1 <= nums.length <= 10^4
-10^4 < nums[i], target < 10^4
All the integers in \`nums\` are unique.
\`nums\` is sorted in ascending order.`,
    examples: [
      {
        input: `6\n-1 0 3 5 9 12\n9`,
        output: `4`,
      },
      {
        input: `6\n-1 0 3 5 9 12\n2`,
        output: `-1`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "Element present", input: "6\n-1 0 3 5 9 12\n9", expectedOutput: "4" },
      { id: "tc-2", name: "Element absent", input: "6\n-1 0 3 5 9 12\n2", expectedOutput: "-1" },
      { id: "tc-3", name: "Single element found", input: "1\n5\n5", expectedOutput: "0", hidden: true },
      { id: "tc-4", name: "Single element absent", input: "1\n5\n-5", expectedOutput: "-1", hidden: true },
      { id: "tc-5", name: "First element", input: "4\n1 2 3 4\n1", expectedOutput: "0", hidden: true },
      { id: "tc-6", name: "Last element", input: "4\n1 2 3 4\n4", expectedOutput: "3", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1

def main():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    target = int(lines[n+1])
    print(search(nums, target))

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(const vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    cout << search(nums, target) << endl;
    return 0;
}
`,
      java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        int l = 0, r = n - 1;
        int ans = -1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) {
                ans = mid;
                break;
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        System.out.println(ans);
    }
}
`,
    },
  },
  {
    id: "prob-longest-substring",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating",
    difficulty: "Medium",
    category: "Sliding Window",
    tags: ["Hash Table", "String", "Sliding Window"],
    points: 150,
    acceptanceRate: "34.5%",
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.`,
    inputFormat: `A single line containing the string \`s\`.`,
    outputFormat: `Print the length of the longest substring without repeating characters.`,
    constraints: `0 <= s.length <= 5 * 10^4
\`s\` consists of English letters, digits, symbols and spaces.`,
    examples: [
      {
        input: `abcabcbb`,
        output: `3`,
        explanation: `The answer is "abc", with the length of 3.`,
      },
      {
        input: `bbbbb`,
        output: `1`,
        explanation: `The answer is "b", with the length of 1.`,
      },
      {
        input: `pwwkew`,
        output: `3`,
        explanation: `The answer is "wke", with the length of 3.`,
      },
    ],
    testCases: [
      { id: "tc-1", name: "abcabcbb", input: "abcabcbb", expectedOutput: "3" },
      { id: "tc-2", name: "bbbbb", input: "bbbbb", expectedOutput: "1" },
      { id: "tc-3", name: "pwwkew", input: "pwwkew", expectedOutput: "3" },
      { id: "tc-4", name: "Empty string", input: "", expectedOutput: "0", hidden: true },
      { id: "tc-5", name: "Unique string", input: "abcdef", expectedOutput: "6", hidden: true },
    ],
    boilerplates: {
      python: `import sys

def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len

def main():
    s = sys.stdin.read().strip()
    print(length_of_longest_substring(s))

if __name__ == '__main__':
    main()
`,
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int main() {
    string s;
    if (!(cin >> s)) {
        cout << 0 << endl;
        return 0;
    }
    unordered_map<char, int> seen;
    int maxLen = 0;
    int left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s[right];
        if (seen.find(c) != seen.end() && seen[c] >= left) {
            left = seen[c] + 1;
        }
        seen[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    cout << maxLen << endl;
    return 0;
}
`,
      java: `import java.util.Scanner;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) {
            System.out.println(0);
            return;
        }
        String s = sc.next();
        HashMap<Character, Integer> map = new HashMap<>();
        int maxLen = 0;
        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        System.out.println(maxLen);
    }
}
`,
    },
  },
];

export function getAllProblems(): ProblemItem[] {
  return PROBLEMS_DATA;
}

export function getProblemBySlug(slug: string): ProblemItem | undefined {
  return PROBLEMS_DATA.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase()
  );
}
