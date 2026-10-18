export interface ConstraintZone {
  id: string;
  name: string;
  depth: string;
  range: string;
  timeComplexity: string;
  viablePatterns: string[];
  forbiddenPatterns: string[];
  oceanMetaphor: string;
  description: string;
  color: string;
}

export interface InputFormatGuide {
  id: string;
  type: string;
  emoji: string;
  techniques: {
    pattern: string;
    useCase: string;
    whyItWorks: string;
  }[];
  watchOut: string;
}

export interface OutputFormatGuide {
  id: string;
  outputType: string;
  emoji: string;
  targetPattern: string;
  decisionRule: string;
  codeSnippet: string;
}

export interface KeywordTrigger {
  id: string;
  pattern: string;
  emoji: string;
  keywords: string[];
  typicalComplexity: string;
  mentalTrigger: string;
  classicProblem: string;
}

export interface PresetProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source: string;
  description: string;
  constraintN: string;
  inputFormat: string;
  outputFormat: string;
  detectedKeywords: string[];
  recommendedPattern: string;
  stepBreakdown: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  javaSnippet: string;
  pythonSnippet: string;
}

export interface TriviaQuestion {
  id: number;
  question: string;
  character: "Nemo" | "Dory" | "Marlin" | "Crush" | "Bruce";
  characterQuote: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export const CONSTRAINT_ZONES: ConstraintZone[] = [
  {
    id: "small",
    name: "Sunlit Coral Shallows",
    depth: "0m – 50m",
    range: "N ≤ 20 (or N ≤ 30 for O(2^N))",
    timeComplexity: "O(2^N) or O(N!)",
    viablePatterns: [
      "Backtracking & Decision Trees",
      "Recursion (Pick / Don't Pick)",
      "Bitmask DP",
      "Generating all Permutations / Subsets",
    ],
    forbiddenPatterns: ["Over-engineering with SegTrees / Fenwick Trees"],
    oceanMetaphor:
      "Marlin's Safe Anemone: You can search every nook and cranny without running out of breath. Brute force swims freely!",
    description:
      "When N is tiny (≤ 20), do NOT waste 20 minutes looking for an O(N) trick. Generate all states! 2^20 ≈ 10^6 operations, well under the ~10^8 interview budget.",
    color: "#06b6d4",
  },
  {
    id: "medium",
    name: "The Great Barrier Reef Current",
    depth: "100m – 1,000m",
    range: "10^3 ≤ N ≤ 10^6",
    timeComplexity: "O(N) or O(N log N)",
    viablePatterns: [
      "Sliding Window (Expand / Shrink)",
      "Two Pointers (Inward / Fast-Slow)",
      "Sorting + Greedy",
      "Dynamic Programming (1D / 2D Memo)",
      "HashMaps / Frequency Tables",
      "Heaps / PriorityQueues (O(N log K))",
    ],
    forbiddenPatterns: ["Nested Loops O(N^2) (Instant TLE!)"],
    oceanMetaphor:
      "The Open Pacific: O(N^2) would drown you (10^5 squared = 10^10 ops = 100 seconds!). You must swim with sleek, linear strokes.",
    description:
      "The sweet spot of DSA interviews. If N is 10^5, your solution must be O(N) or O(N log N). Immediately consider Sliding Window, Two Pointers, HashMap, or Sorting.",
    color: "#3b82f6",
  },
  {
    id: "large",
    name: "The Mariana Trench (Midnight Abyss)",
    depth: "10,000m+",
    range: "N ≥ 10^7 or 10^9",
    timeComplexity: "O(log N) or O(1)",
    viablePatterns: [
      "Binary Search (On Array or On Answer)",
      "Mathematical Formulas (GCD, Modulo, Combinatorics)",
      "Bit Manipulation (XOR, Bitwise masks)",
      "Matrix Exponentiation",
    ],
    forbiddenPatterns: ["Any O(N) Loop (Will exceed 1-sec limit!)"],
    oceanMetaphor:
      "Crush's EAC Superhighway: The ocean is too vast to visit every mile. You must halve the search space every single jump!",
    description:
      "Even a single O(N) pass will TLE when N = 10^9! You are strictly confined to O(log N) (halving the search range) or O(1) closed-form math.",
    color: "#6366f1",
  },
];

export const INPUT_FORMAT_GUIDES: InputFormatGuide[] = [
  {
    id: "tree",
    type: "Tree / Binary Tree / BST",
    emoji: "🌳",
    techniques: [
      {
        pattern: "Depth-First Search (DFS / Recursion)",
        useCase: "All root-to-leaf paths, tree height, maximum path sum, pre/in/post-order traversals.",
        whyItWorks: "Natural call-stack recursion mirrors the hierarchical parent-child structure.",
      },
      {
        pattern: "Breadth-First Search (BFS / Queue)",
        useCase: "Level-order traversal, right-side view, shortest path in unweighted tree / distance K.",
        whyItWorks: "Processes nodes level by level using a FIFO queue.",
      },
      {
        pattern: "BST In-Order Traversal",
        useCase: "Validating BST, finding Kth smallest element, Two Sum in BST.",
        whyItWorks: "In-order traversal of a BST yields strictly sorted values in O(N) time.",
      },
    ],
    watchOut: "Watch out for skewed trees (degrades recursion stack to O(N) space unless balanced).",
  },
  {
    id: "graph",
    type: "Graph (Nodes & Edges)",
    emoji: "🕸️",
    techniques: [
      {
        pattern: "Breadth-First Search (BFS)",
        useCase: "Shortest path in unweighted graph, word ladder, minimum knight moves.",
        whyItWorks: "Guarantees visiting nodes by increasing edge distance.",
      },
      {
        pattern: "Depth-First Search (DFS)",
        useCase: "Connected components, cycle detection, path finding, maze exploration.",
        whyItWorks: "Explores deep into branches before backtracking; easily tracks visited set.",
      },
      {
        pattern: "Union-Find (Disjoint Set Union)",
        useCase: "Dynamic connectivity, number of islands, redundant connections, Kruskal's MST.",
        whyItWorks: "Near O(1) amortized path compression for component merging.",
      },
      {
        pattern: "Topological Sort (Kahn's or DFS)",
        useCase: "Course schedule, build dependencies, task ordering in Directed Acyclic Graphs (DAG).",
        whyItWorks: "Processes zero-indegree nodes sequentially.",
      },
    ],
    watchOut: "Always keep a visited set or mutate visited cells to avoid infinite cycles!",
  },
  {
    id: "grid",
    type: "2D Grid / Matrix",
    emoji: "🗺️",
    techniques: [
      {
        pattern: "DFS / BFS Flood Fill",
        useCase: "Number of Islands, Rotten Oranges, Pacific Atlantic Water Flow.",
        whyItWorks: "Treats adjacent grid cells as graph edges (4 directions: dx, dy).",
      },
      {
        pattern: "2D Dynamic Programming",
        useCase: "Unique Paths, Minimum Path Sum, Dungeon Game.",
        whyItWorks: "State dp[r][c] depends on dp[r-1][c] (from above) and dp[r][c-1] (from left).",
      },
      {
        pattern: "Union-Find on 2D",
        useCase: "Dynamic island merging, Number of Islands II.",
        whyItWorks: "Flattens 2D coordinates into 1D indices: index = r * cols + c.",
      },
    ],
    watchOut: "Always bounds-check (0 <= r < R && 0 <= c < C) before accessing grid cells.",
  },
  {
    id: "sorted_array",
    type: "Sorted Array",
    emoji: "📊",
    techniques: [
      {
        pattern: "Two Pointers (Left & Right)",
        useCase: "Two Sum II, 3Sum, Container With Most Water, Trapping Rain Water.",
        whyItWorks: "Sum too small? Move left pointer up. Sum too large? Move right pointer down.",
      },
      {
        pattern: "Binary Search",
        useCase: "Finding target, search in rotated sorted array, first/last occurrence.",
        whyItWorks: "Monotonicity allows cutting the search space by half in O(log N).",
      },
      {
        pattern: "Greedy Strategy",
        useCase: "Interval overlapping, non-overlapping intervals, merge intervals.",
        whyItWorks: "Sorting by start or end time unlocks optimal local choices.",
      },
    ],
    watchOut: "If array is not sorted, sorting costs O(N log N). Check if N allows that!",
  },
  {
    id: "string",
    type: "String / Substring",
    emoji: "🔤",
    techniques: [
      {
        pattern: "Sliding Window",
        useCase: "Longest substring without repeating characters, minimum window substring.",
        whyItWorks: "Expands right to include chars, shrinks left when condition breaks.",
      },
      {
        pattern: "Trie (Prefix Tree)",
        useCase: "Prefix searching, autocomplete, Word Search II, dictionary lookups.",
        whyItWorks: "Shares common prefixes among words, offering O(L) lookup for word length L.",
      },
      {
        pattern: "Stack",
        useCase: "Valid parentheses, decode string, remove adjacent duplicates.",
        whyItWorks: "LIFO matches inner-most opening brackets with subsequent closing brackets.",
      },
    ],
    watchOut: "In Python/Java, strings are immutable. Build strings using StringBuilder or list arrays.",
  },
  {
    id: "linked_list",
    type: "Linked List",
    emoji: "🔗",
    techniques: [
      {
        pattern: "Fast & Slow Pointers (Tortoise & Hare)",
        useCase: "Linked list cycle detection, finding the middle node, palindrome list.",
        whyItWorks: "Fast moves 2x speed; when fast hits the end, slow is exactly in the middle.",
      },
      {
        pattern: "Dummy Head Pointer",
        useCase: "Merging two sorted lists, removing Nth node from end, partition list.",
        whyItWorks: "Eliminates edge cases when modifying or removing the real head node.",
      },
    ],
    watchOut: "Always check `fast && fast.next` before doing `fast.next.next` to avoid NullPointerExceptions.",
  },
];

export const OUTPUT_FORMAT_GUIDES: OutputFormatGuide[] = [
  {
    id: "list_of_lists",
    outputType: "List of Lists (Combinations / Subsets / Paths)",
    emoji: "📦",
    targetPattern: "Backtracking / Recursion",
    decisionRule:
      "If the return type is List<List<Integer>> or List<List<String>> (e.g. all subsets, permutations, path sums), Backtracking is virtually 95% guaranteed.",
    codeSnippet: `def backtrack(start, current_path):
    result.append(list(current_path))
    for i in range(start, len(nums)):
        current_path.append(nums[i])
        backtrack(i + 1, current_path)
        current_path.pop()  # Backtrack!`,
  },
  {
    id: "single_number",
    outputType: "Single Number (Min/Max Profit, Min Cost, Number of Ways)",
    emoji: "🎯",
    targetPattern: "Dynamic Programming or Greedy",
    decisionRule:
      "When returning a single scalar representing an optimum (e.g. max profit, minimum jumps, total ways to climb stairs), it is an optimization problem: DP (overlapping subproblems) or Greedy (local choice).",
    codeSnippet: `dp = [0] * (n + 1)
dp[0], dp[1] = 1, 1
for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]
return dp[n]`,
  },
  {
    id: "in_place_modified",
    outputType: "Modified In-Place Array / String (O(1) Space)",
    emoji: "🔄",
    targetPattern: "Two Pointers (Read & Write Index)",
    decisionRule:
      "If problem says 'Do not allocate extra space; modify in-place', use Two Pointers: one slow write-pointer and one fast read-pointer (e.g. Remove Duplicates, Move Zeroes).",
    codeSnippet: `write = 0
for read in range(len(nums)):
    if nums[read] != 0:
        nums[write], nums[read] = nums[read], nums[write]
        write += 1`,
  },
  {
    id: "ordered_sequence",
    outputType: "Ordered Sequence / Task Order",
    emoji: "📋",
    targetPattern: "Topological Sort or Priority Queue / Heap",
    decisionRule:
      "If output is a sequence respecting prerequisites or dynamic priorities (e.g. Alien Dictionary, Course Schedule II, Task Scheduler), use Kahn's Topological Sort or a Max/Min-Heap.",
    codeSnippet: `queue = deque([node for node in range(n) if indegree[node] == 0])
order = []
while queue:
    curr = queue.popleft()
    order.append(curr)
    for neighbor in graph[curr]:
        indegree[neighbor] -= 1
        if indegree[neighbor] == 0:
            queue.append(neighbor)`,
  },
];

export const KEYWORD_TRIGGERS: KeywordTrigger[] = [
  {
    id: "kw_dp",
    pattern: "Dynamic Programming",
    emoji: "🧠",
    keywords: [
      "Number of ways",
      "Maximum / Minimum sum/profit/cost",
      "Can you reach",
      "Longest common / increasing subsequence",
      "Optimal strategy / Best decision",
    ],
    typicalComplexity: "O(N) to O(N^2)",
    mentalTrigger:
      "Dory's Epiphany: You need to make a decision at each step, and subproblems repeat! Store answers in a memo table.",
    classicProblem: "Climbing Stairs, Coin Change, Longest Increasing Subsequence",
  },
  {
    id: "kw_two_pointers",
    pattern: "Two Pointers",
    emoji: "👉👈",
    keywords: [
      "Palindrome",
      "Sorted array",
      "Find pair with target sum",
      "Remove duplicates in-place",
      "Container with most water",
    ],
    typicalComplexity: "O(N) time, O(1) space",
    mentalTrigger:
      "Converging pointers eliminate unnecessary nested pairs by leveraging order.",
    classicProblem: "Two Sum II, 3Sum, Valid Palindrome, Trapping Rain Water",
  },
  {
    id: "kw_sliding_window",
    pattern: "Sliding Window",
    emoji: "🪟",
    keywords: [
      "Contiguous subarray / substring",
      "At most K distinct",
      "Longest / Shortest window",
      "Contains all characters of target",
      "Maximum sum of size K",
    ],
    typicalComplexity: "O(N) time, O(K) space",
    mentalTrigger:
      "Expand right to meet a condition; shrink left to recover feasibility or minimize size.",
    classicProblem: "Minimum Window Substring, Longest Substring Without Repeating",
  },
  {
    id: "kw_heap",
    pattern: "Heap / Priority Queue",
    emoji: "⛰️",
    keywords: [
      "K-th largest / smallest",
      "Top K frequent elements",
      "Running median of stream",
      "Merge K sorted lists",
      "Priority order",
    ],
    typicalComplexity: "O(N log K) time, O(K) space",
    mentalTrigger:
      "You don't need to sort the entire array (O(N log N)) when you only care about the top K elements!",
    classicProblem: "Kth Largest Element in an Array, Top K Frequent Elements",
  },
  {
    id: "kw_monotonic_stack",
    pattern: "Monotonic Stack",
    emoji: "🥞",
    keywords: [
      "Next greater element",
      "Next smaller element",
      "Daily temperatures",
      "Largest rectangle in histogram",
      "Stock span",
    ],
    typicalComplexity: "O(N) time, O(N) space",
    mentalTrigger:
      "Maintains elements in strictly increasing or decreasing order. Elements are popped when a new dominant element arrives.",
    classicProblem: "Daily Temperatures, Next Greater Element I, Largest Rectangle in Histogram",
  },
  {
    id: "kw_binary_search",
    pattern: "Binary Search (On Answer)",
    emoji: "🎯",
    keywords: [
      "Minimize the maximum",
      "Maximize the minimum",
      "K-th element",
      "Search in sorted matrix",
      "First / Last occurrence",
    ],
    typicalComplexity: "O(N log(Range)) or O(log N)",
    mentalTrigger:
      "When the question asks 'What is the minimum capacity/speed such that...', and feasibility is monotonic (if speed X works, X+1 also works)!",
    classicProblem: "Koko Eating Bananas, Capacity To Ship Packages Within D Days",
  },
  {
    id: "kw_union_find",
    pattern: "Union-Find (DSU)",
    emoji: "🤝",
    keywords: [
      "Connected components",
      "Number of groups / friend circles",
      "Redundant connection / cycle in undirected graph",
      "Accounts merge",
    ],
    typicalComplexity: "O(α(N)) ≈ O(1) per query",
    mentalTrigger:
      "Whenever entities are merged into shared groups, and you frequently ask: 'Are A and B in the same component?'",
    classicProblem: "Number of Provinces, Redundant Connection, Accounts Merge",
  },
  {
    id: "kw_trie",
    pattern: "Trie (Prefix Tree)",
    emoji: "🔤",
    keywords: [
      "Word search with dictionary",
      "Prefix matching",
      "Autocomplete",
      "Longest common prefix",
      "Wildcard word dictionary",
    ],
    typicalComplexity: "O(L) per word lookup",
    mentalTrigger:
      "When matching many strings against a dictionary and they share common beginnings.",
    classicProblem: "Implement Trie, Word Search II, Design Add and Search Words",
  },
  {
    id: "kw_backtracking",
    pattern: "Backtracking",
    emoji: "🌲",
    keywords: [
      "Generate all possible",
      "N-Queens / Sudoku solver",
      "Combination sum",
      "Word search on board",
      "Subsets / Permutations",
    ],
    typicalComplexity: "O(2^N) or O(N!)",
    mentalTrigger:
      "You need to produce all valid solutions. Make a choice, explore recursively, undo the choice.",
    classicProblem: "Subsets, Permutations, Combination Sum, Word Search",
  },
  {
    id: "kw_greedy",
    pattern: "Greedy Algorithm",
    emoji: "🦅",
    keywords: [
      "Minimum intervals / arrows",
      "Gas station circular tour",
      "Jump game",
      "Fractional knapsack",
      "Assign cookies",
    ],
    typicalComplexity: "O(N) or O(N log N)",
    mentalTrigger:
      "Making the locally optimal choice right now leads directly to the global optimum without backtracking.",
    classicProblem: "Non-overlapping Intervals, Minimum Number of Arrows, Jump Game",
  },
];

export const PRESET_PROBLEMS: PresetProblem[] = [
  {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    source: "LeetCode 139",
    description:
      "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
    constraintN: "s.length ≤ 300, wordDict.length ≤ 1000",
    inputFormat: "String + List of Words",
    outputFormat: "Boolean (Can you reach / is possible)",
    detectedKeywords: ["Can be segmented", "Dictionary lookup", "Optimal reachability"],
    recommendedPattern: "1D Dynamic Programming (or BFS / Trie)",
    stepBreakdown: {
      step1: "Constraints: N = 300. O(N^2) or O(N^3) is well within the 10^8 operation limit. No exponential brute-force needed.",
      step2: "Input: String 's' and word dictionary. Substrings can be sliced and checked against a HashSet.",
      step3: "Output: Boolean (True/False). Represents a reachability query ('can you form prefix?').",
      step4: "Keywords: 'Can be segmented' + overlapping prefixes = Dynamic Programming! Let dp[i] = can s[0:i] be formed.",
    },
    javaSnippet: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true; // Base: empty string is valid

    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}`,
    pythonSnippet: `def wordBreak(s: str, wordDict: list[str]) -> bool:
    words = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True # Base: empty string is valid

    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
  },
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    source: "LeetCode 78",
    description:
      "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    constraintN: "1 ≤ nums.length ≤ 10, -10 ≤ nums[i] ≤ 10",
    inputFormat: "Array of integers",
    outputFormat: "List of Lists (All possible subsets)",
    detectedKeywords: ["All possible subsets", "Power set", "List of Lists"],
    recommendedPattern: "Backtracking (Decision Tree: Pick / Don't Pick)",
    stepBreakdown: {
      step1: "Constraints: N ≤ 10! Extremely small. 2^10 = 1,024 operations. Instantly signals Exponential Backtracking.",
      step2: "Input: Simple integer array with unique elements.",
      step3: "Output: List<List<Integer>>. Whenever output is a nested collection of combinations, Backtracking is 95% certain.",
      step4: "Keywords: 'All possible subsets' = Recursion decision tree where each number is either included or omitted.",
    },
    javaSnippet: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), result);
    return result;
}

private void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(i + 1, nums, path, result);
        path.remove(path.size() - 1); // Backtrack
    }
}`,
    pythonSnippet: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start: int, path: list[int]):
        result.append(list(path))
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop() # Backtrack
            
    backtrack(0, [])
    return result`,
  },
  {
    id: "kth-largest",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    source: "LeetCode 215",
    description:
      "Given an integer array nums and an integer k, return the kth largest element in the array. Can you solve it in O(n) or O(n log k) without full sorting?",
    constraintN: "1 ≤ k ≤ nums.length ≤ 10^5",
    inputFormat: "Unsorted Array + Integer K",
    outputFormat: "Single Integer (The Kth value)",
    detectedKeywords: ["K-th largest", "Top K", "Stream priority"],
    recommendedPattern: "Min-Heap of size K (or QuickSelect)",
    stepBreakdown: {
      step1: "Constraints: N = 10^5. An O(N^2) brute force will TLE. We need O(N log K) or O(N).",
      step2: "Input: Unsorted array. We only care about the top K elements, not all N.",
      step3: "Output: A single integer value representing the K-th threshold.",
      step4: "Keywords: 'Kth largest' = Min-Heap of size K. Keep pushing elements; when heap size > K, pop minimum!",
    },
    javaSnippet: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // Discard smaller elements
        }
    }
    return minHeap.peek();
}`,
    pythonSnippet: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`,
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    source: "LeetCode 3",
    description:
      "Given a string s, find the length of the longest substring without duplicate characters.",
    constraintN: "0 ≤ s.length ≤ 5 * 10^4",
    inputFormat: "String",
    outputFormat: "Single Integer (Max Length)",
    detectedKeywords: ["Longest substring", "Contiguous", "Without duplicate characters"],
    recommendedPattern: "Dynamic Sliding Window + HashSet / HashMap",
    stepBreakdown: {
      step1: "Constraints: N = 5 * 10^4. Checking all substrings (O(N^2)) would take 2.5 * 10^9 operations and TLE! Must be O(N).",
      step2: "Input: String. Contiguous slice required.",
      step3: "Output: Single scalar (Maximum length).",
      step4: "Keywords: 'Substring' + 'Contiguous' + 'Without repeating' = Sliding Window. Expand 'right', shrink 'left' when duplicate encountered.",
    },
    javaSnippet: `public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c)) {
            left = Math.max(left, lastSeen.get(c) + 1);
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    pythonSnippet: `def lengthOfLongestSubstring(s: str) -> int:
    last_seen = {}
    max_len = 0
    left = 0

    for right, char in enumerate(s):
        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1
        last_seen[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    source: "LeetCode 739",
    description:
      "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    constraintN: "1 ≤ temperatures.length ≤ 10^5",
    inputFormat: "Array of integers",
    outputFormat: "Array of distances to next greater element",
    detectedKeywords: ["Next warmer day", "Next greater element", "Waiting period"],
    recommendedPattern: "Monotonic Decreasing Stack",
    stepBreakdown: {
      step1: "Constraints: N = 10^5. Nested loops checking forward days is O(N^2) = TLE. Must be linear O(N).",
      step2: "Input: 1D numerical sequence of daily temperatures.",
      step3: "Output: Array of distances corresponding to each index.",
      step4: "Keywords: 'Next warmer' = Next Greater Element. Maintain stack of indices with decreasing temperatures. Pop when warmer day is found!",
    },
    javaSnippet: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonic stack of indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            ans[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    return ans;
}`,
    pythonSnippet: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = [] # Stack of indices

    for i, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
        
    return ans`,
  },
  {
    id: "koko-bananas",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    source: "LeetCode 875",
    description:
      "Koko loves bananas. There are n piles. Return the minimum integer speed k such that she can eat all bananas within h hours.",
    constraintN: "1 ≤ piles.length ≤ 10^4, piles.length ≤ h ≤ 10^9",
    inputFormat: "Array of piles + Integer hours",
    outputFormat: "Single Integer (Minimum speed k)",
    detectedKeywords: ["Minimum speed k", "Minimize the maximum", "Threshold feasibility"],
    recommendedPattern: "Binary Search on Answer Range",
    stepBreakdown: {
      step1: "Constraints: h up to 10^9! We cannot try every speed 1, 2, 3... incrementally.",
      step2: "Input: Array of pile counts. Feasibility check takes O(N) time for a given speed k.",
      step3: "Output: Single minimal integer (speed).",
      step4: "Keywords: 'Minimum speed' with monotonic feasibility: if speed k works, k+1 definitely works. Binary Search on speed range [1, max(piles)]!",
    },
    javaSnippet: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 1_000_000_000;
    for (int p : piles) right = Math.max(right, p);

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hoursNeeded = 0;
        for (int p : piles) {
            hoursNeeded += (p + mid - 1) / mid; // Ceil division
        }
        if (hoursNeeded <= h) {
            right = mid; // Can eat fast enough, try slower speed
        } else {
            left = mid + 1; // Too slow, increase speed
        }
    }
    return left;
}`,
    pythonSnippet: `import math

def minEatingSpeed(piles: list[int], h: int) -> int:
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        hours_needed = sum(math.ceil(p / mid) for p in piles)
        
        if hours_needed <= h:
            right = mid # Feasible, try smaller speed
        else:
            left = mid + 1 # Too slow, speed up
            
    return left`,
  },
];

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: 1,
    character: "Marlin",
    characterQuote: "I have to search every single piece of seaweed! What if Nemo is behind the 24th coral?!",
    question: "If a LeetCode problem has input constraint N ≤ 20, what should be your immediate instinct?",
    options: [
      "Implement a Segment Tree with Lazy Propagation",
      "Brute force / Backtracking (O(2^N) or O(N!)) to generate all combinations",
      "Panic and memorize 500 solutions",
      "Search for an O(1) mathematical closed-form formula",
    ],
    correctIndex: 1,
    explanation:
      "When N ≤ 20, 2^20 is only ~1 million operations! An exponential backtracking approach runs in milliseconds and is the intended solution.",
    hint: "Think about the Sunlit Coral Shallows: with tiny N, trying all options is fast and easy.",
  },
  {
    id: 2,
    character: "Dory",
    characterQuote: "Wait... did I swim down this branch already? I suffer from short-term memory loss!",
    question: "The problem asks for 'all possible unique combinations of size K' and returns a List of Lists. What is the pattern?",
    options: [
      "Dynamic Programming (1D Tabulation)",
      "Backtracking with recursion and state restoration",
      "Monotonic Stack",
      "Binary Search on Answer",
    ],
    correctIndex: 1,
    explanation:
      "Whenever the output is a List of Lists (subsets, combinations, permutations, path listings), Backtracking is 95% guaranteed to be the approach.",
    hint: "Check Step 3: Output Format Decoder. List of Lists signals decision trees!",
  },
  {
    id: 3,
    character: "Crush",
    characterQuote: "Whoa dude! Look at those constraints: N = 10^9! We're riding the EAC, no time for linear loops!",
    question: "Constraints state N = 10^9 and time limit is 1.0 second. What time complexity can survive the judge?",
    options: [
      "O(N) single loop",
      "O(N log N) sorting",
      "O(log N) or O(1) constant time",
      "O(N^2) nested loop",
    ],
    correctIndex: 2,
    explanation:
      "Modern judges execute ~10^8 operations per second. An O(N) loop with N = 10^9 requires 10 seconds and will TLE. Only O(log N) or O(1) passes!",
    hint: "Remember the Midnight Abyss rule: when N ≥ 10^7, only logarithmic or constant time works.",
  },
  {
    id: 4,
    character: "Bruce",
    characterQuote: "I am a nice shark, not a mindless eating machine. Fish are friends, not O(N^2) brute force!",
    question: "You see the clue 'Find the next warmer temperature for every day in an array of size 10^5'. What tool stops nested comparisons?",
    options: [
      "Monotonic Decreasing Stack",
      "2D Grid DFS",
      "Trie Prefix Tree",
      "Disjoint Set Union (Union-Find)",
    ],
    correctIndex: 0,
    explanation:
      "'Next greater element' or 'Next warmer temperature' is the textbook trigger for a Monotonic Stack, solving the query in linear O(N) time.",
    hint: "Keyword radar: 'Next greater' = stack that keeps indices in monotonic order.",
  },
  {
    id: 5,
    character: "Dory",
    characterQuote: "Just keep swimming... wait, we just computed fib(4) three times! Can someone write this down?!",
    question: "A problem asks for 'the maximum profit possible' with overlapping subproblems. What stops redundant recomputation?",
    options: [
      "Dynamic Programming with memoization / table caching",
      "Topological Sort",
      "Binary Tree In-Order Traversal",
      "Bitwise XOR",
    ],
    correctIndex: 0,
    explanation:
      "Dynamic Programming stores solutions to overlapping subproblems so each state is solved exactly once, dropping exponential time to polynomial.",
    hint: "Dory needs a memo pad so she doesn't forget past subproblem solutions!",
  },
  {
    id: 6,
    character: "Nemo",
    characterQuote: "I touched the boat! But now I need to find the longest contiguous subarray with at most K distinct characters!",
    question: "Which technique allows you to inspect contiguous subarrays without recomputing window sums from scratch?",
    options: [
      "Sliding Window (Expand right, shrink left)",
      "Floyd-Warshall all-pairs shortest path",
      "Backtracking with permutations",
      "Union-Find component merging",
    ],
    correctIndex: 0,
    explanation:
      "Sliding window maintains a dynamic interval [left, right], expanding the right pointer and shrinking the left pointer in amortized O(N) time.",
    hint: "Contiguous slice + optimal length = a moving frame in the water.",
  },
  {
    id: 7,
    character: "Crush",
    characterQuote: "Hey little dude, the prompt asks to 'minimize the maximum weight allowed on a truck'. What current is that?",
    question: "What pattern is triggered by the phrase 'minimize the maximum' or 'find the smallest feasible threshold'?",
    options: [
      "Binary Search on Answer (Monotonic Predicate)",
      "Bellman-Ford Algorithm",
      "Depth-First Search on a BST",
      "Eulerian Path",
    ],
    correctIndex: 0,
    explanation:
      "'Minimize the maximum' or 'maximize the minimum' is the classic signature of Binary Search on the Answer range with a boolean feasibility checker.",
    hint: "If a threshold K works, any value > K also works. Monotonicity allows binary search!",
  },
  {
    id: 8,
    character: "Bruce",
    characterQuote: "There are 500 fish swimming in different schools. We need to check if Fish A and Fish B belong to the same school!",
    question: "Which data structure determines if two elements belong to the same connected group in near O(1) amortized time?",
    options: [
      "Union-Find (Disjoint Set Union with path compression)",
      "Monotonic Queue",
      "Min-Heap",
      "Prefix Tree (Trie)",
    ],
    correctIndex: 0,
    explanation:
      "Union-Find with path compression and rank union solves 'are they in the same component?' and 'merge groups' in O(α(N)) ≈ O(1) time.",
    hint: "Think about connected components and merging friend circles.",
  },
  {
    id: 9,
    character: "Marlin",
    characterQuote: "We have to sort colors in-place without allocating any extra array! My memory tank is completely empty!",
    question: "When a problem strictly demands O(1) auxiliary space and in-place array modification, what pattern is the go-to?",
    options: [
      "Two Pointers (Read pointer & Write pointer)",
      "Recursion with deep call-stack",
      "Building a clone array with HashMap",
      "Topological Sorting",
    ],
    correctIndex: 0,
    explanation:
      "In-place modifications (like Move Zeroes, Remove Duplicates, Sort Colors) use pointers to swap or overwrite elements without heap allocations.",
    hint: "Read index moves fast, write index moves slow: Two Pointers!",
  },
  {
    id: 10,
    character: "Dory",
    characterQuote: "P. Sherman, 42 Wallaby Way, Sydney! We have a dictionary of 10,000 words and need instant prefix lookups!",
    question: "Which data structure is optimal for storing dictionary words to perform prefix searches ('words starting with...)?",
    options: [
      "Trie (Prefix Tree)",
      "Binary Max-Heap",
      "Linked List with slow pointer",
      "Adjacency Matrix",
    ],
    correctIndex: 0,
    explanation:
      "A Trie shares common prefixes among words, allowing word and prefix lookups in O(L) time where L is the length of the query string.",
    hint: "Prefixes share a tree root with branching characters.",
  },
];
