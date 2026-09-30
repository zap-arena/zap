import json
import uuid
from datetime import datetime, timezone

input_data = {
  "quizzes": [
    {
      "id": "basic",
      "title": "Core Concepts & Fundamentals",
      "description": "Test your grasp on Arrays, Hashing, Two Pointers, and Time/Space Complexity basics.",
      "questions": [
        {
          "tag": "Arrays",
          "q": "What is the primary advantage of contiguous memory allocation in an Array?",
          "options": [
            "It allows for dynamic resizing.",
            "It enables O(1) constant time access to any element via its index.",
            "It prevents memory leaks.",
            "It automatically sorts the elements."
          ],
          "correct": 1,
          "explain": "Because elements are stored sequentially in memory, the computer can instantly calculate the memory address of any element using its index, resulting in O(1) access time."
        },
        {
          "tag": "Arrays",
          "q": "Why is inserting an element at the beginning of a standard Array generally slow?",
          "options": [
            "The array must be re-sorted.",
            "It requires shifting all existing elements one position to the right, taking O(N) time.",
            "It causes a memory overflow.",
            "Arrays do not support insertion."
          ],
          "correct": 1,
          "explain": "Unless using a specialized structure (like a Linked List or Deque), inserting at the front forces every other element to move over, resulting in linear O(N) time."
        },
        {
          "tag": "Hashing",
          "q": "What is the primary purpose of a hash function in a HashMap?",
          "options": [
            "To encrypt the data for security.",
            "To compress the size of the values.",
            "To convert a key into a fixed-size integer used as an index for storage.",
            "To sort the keys alphabetically."
          ],
          "correct": 2,
          "explain": "A hash function takes an arbitrary key and mathematically converts it into an integer index. This tells the HashMap exactly where to store or find the corresponding value."
        },
        {
          "tag": "HashMap",
          "q": "What is the average time complexity for insertion and lookup operations in a well-designed HashMap?",
          "options": ["O(1)", "O(log N)", "O(N)", "O(N²)"],
          "correct": 0,
          "explain": "HashMaps use hash functions to directly compute the index of the data, allowing them to insert and look up items in roughly constant O(1) time."
        },
        {
          "tag": "HashSet",
          "q": "When should you generally prefer a HashSet over a HashMap?",
          "options": [
            "When you need to keep elements in sorted order.",
            "When you need to associate a specific value with each key.",
            "When you only need to store unique items and check for their existence.",
            "When memory is extremely limited."
          ],
          "correct": 2,
          "explain": "A HashSet is essentially a HashMap that only stores keys (with dummy values). It is the perfect structure when you just need to maintain a set of unique items."
        },
        {
          "tag": "Time Complexity",
          "q": "What is the time complexity of an algorithm that utilizes two nested loops, both iterating from 1 to N?",
          "options": ["O(1)", "O(N)", "O(N log N)", "O(N²)"],
          "correct": 3,
          "explain": "For every single iteration of the outer loop, the inner loop runs N times. This results in N * N total operations, or quadratic O(N²) time complexity."
        },
        {
          "tag": "Space Complexity",
          "q": "If an algorithm specifies it uses 'O(1) Auxiliary Space', what does this mean?",
          "options": [
            "It uses exactly 1 byte of memory.",
            "It uses a constant amount of extra memory, regardless of the input size.",
            "It modifies the input array directly without using any variables.",
            "It uses memory proportional to the input size."
          ],
          "correct": 1,
          "explain": "O(1) space means the extra memory required (like a few variables or pointers) does not grow as the input data gets larger."
        },
        {
          "tag": "Two Pointers",
          "q": "In which common scenario would you start two pointers at opposite ends of an array and move them towards each other?",
          "options": [
            "When searching for a target sum in a sorted array.",
            "When traversing a Singly Linked List.",
            "When hashing string values.",
            "When looking for the maximum element in an unsorted array."
          ],
          "correct": 0,
          "explain": "In a sorted array, you can confidently move the left pointer right to increase the sum, or the right pointer left to decrease it, converging on the target in O(N) time."
        },
        {
          "tag": "Two Pointers",
          "q": "Why is the two-pointer technique frequently preferred over using nested loops?",
          "options": [
            "It uses less RAM.",
            "It is easier to debug.",
            "It can often reduce a brute-force O(N²) time complexity down to O(N).",
            "It automatically handles negative numbers."
          ],
          "correct": 2,
          "explain": "By intelligently moving pointers based on conditions (especially in sorted arrays), you can process the data in a single pass instead of checking every pair."
        },
        {
          "tag": "Hashing",
          "q": "What happens when two different keys generate the identical hash code in a HashMap?",
          "options": [
            "The program crashes with an error.",
            "The older key is overwritten and deleted.",
            "A collision occurs, and both items are stored at the same index (usually in a linked list).",
            "The HashMap rejects the new key."
          ],
          "correct": 2,
          "explain": "This is called a Hash Collision. HashMaps handle this by storing multiple entries in the same 'bucket', often chaining them together in a Linked List."
        },
        {
          "tag": "Complexity Trade-offs",
          "q": "What does a 'Space-Time Tradeoff' typically involve?",
          "options": [
            "Writing shorter code that takes longer to compile.",
            "Using additional memory (like a HashMap) to significantly reduce the algorithm's execution time.",
            "Reducing execution time by using a slower processor.",
            "Compressing data to save space on the hard drive."
          ],
          "correct": 1,
          "explain": "A common optimization pattern is caching or storing precomputed data (spending Space) to avoid doing redundant work in loops (saving Time)."
        },
        {
          "tag": "Array vs HashSet",
          "q": "If you need to repeatedly check if an element exists in a collection, why is a HashSet better than an unsorted Array?",
          "options": [
            "A HashSet takes less memory.",
            "An array requires an O(N) linear scan, while a HashSet provides O(1) lookups.",
            "HashSets are built-in, while arrays are not.",
            "You cannot search inside an array."
          ],
          "correct": 1,
          "explain": "Searching an unsorted array requires checking every element one by one (O(N)). A HashSet jumps directly to the element using its hash code (O(1))."
        },
        {
          "tag": "Time Complexity",
          "q": "A student writes this duplicate-check function:\n\n```java\nfor (int i = 0; i < arr.length; i++) {\n    for (int j = 0; j < arr.length; j++) {\n        if (i != j && arr[i] == arr[j]) return true;\n    }\n}\n```\n\n```python\nfor i in range(len(arr)):\n    for j in range(len(arr)):\n        if i != j and arr[i] == arr[j]:\n            return True\n```\n\nWhat is the time complexity of this code, and why is it wasteful even though it's correct?",
          "options": [
            "O(N) — the inner loop doesn't really count since it just compares values",
            "O(N²) — the inner loop re-scans the entire array for every outer index, so it re-checks every pair twice (once as i,j and again as j,i)",
            "O(log N) — because it can return early once a duplicate is found",
            "O(1) — comparisons are constant-time so the loops don't matter"
          ],
          "correct": 1,
          "explain": "The inner loop runs N times for each of the N outer iterations, giving N × N = N² comparisons. Worse, it's doing redundant work: it checks (i=0,j=2) and later (i=2,j=0) — the same pair twice — when a single pass with a HashSet would find the answer in O(N)."
        }
      ]
    },
    {
      "id": "advanced",
      "title": "Advanced Application & Techniques",
      "description": "Master algorithmic patterns: Sliding Windows, Cycle Detection, Load Factors, and System Design.",
      "questions": [
        {
          "tag": "Two Pointers: Sliding Window",
          "q": "What is the 'Sliding Window' algorithmic technique primarily a variation of?",
          "options": [
            "Binary Search.",
            "Two pointers moving in the same direction to define a subarray.",
            "A HashMap collision strategy.",
            "Recursive Depth-First Search."
          ],
          "correct": 1,
          "explain": "A sliding window uses a 'left' and 'right' pointer. The right pointer expands the window, and the left pointer shrinks it, allowing you to evaluate subarrays in O(N) time."
        },
        {
          "tag": "Two Pointers + HashMap",
          "q": "How can you solve the 'Longest Substring Without Repeating Characters' efficiently?",
          "options": [
            "Sorting the string in O(N log N) time.",
            "Using nested loops to check all combinations in O(N²).",
            "Using a sliding window (two pointers) combined with a HashSet/HashMap to track seen characters.",
            "Using a stack to reverse the string."
          ],
          "correct": 2,
          "explain": "The right pointer expands the window, adding characters to the Set. If a duplicate is found, the left pointer moves forward, removing characters from the Set until the duplicate is gone."
        },
        {
          "tag": "HashMap: Load Factor",
          "q": "Why do HashMaps undergo an expensive 'resize' operation when they reach a certain Load Factor?",
          "options": [
            "To delete old, unused elements.",
            "To prevent long collision chains from forming, which would degrade O(1) performance to O(N).",
            "To sort the keys in the background.",
            "Because the operating system requires it."
          ],
          "correct": 1,
          "explain": "As the map fills up, collisions become inevitable. Resizing increases the number of buckets, spreading out the entries so lookups remain O(1) on average."
        },
        {
          "tag": "Two Pointers: Cycle Detection",
          "q": "How does Floyd's Tortoise and Hare algorithm detect a cycle in a Linked List using O(1) space?",
          "options": [
            "By storing visited nodes in a HashSet.",
            "By using two pointers moving at different speeds; if there is a cycle, the fast pointer will eventually lap and meet the slow pointer.",
            "By modifying the values of the nodes to -1.",
            "By counting the total number of nodes."
          ],
          "correct": 1,
          "explain": "The slow pointer moves 1 step, the fast moves 2 steps. If there's a loop, the fast pointer will eventually catch up to the slow one from behind."
        },
        {
          "tag": "Space Complexity: Recursion",
          "q": "What is the hidden space complexity cost of a recursive algorithm?",
          "options": [
            "Recursive algorithms do not use any extra space.",
            "They allocate new arrays on every call.",
            "The Call Stack uses memory proportional to the maximum depth of the recursion tree.",
            "They leak memory until garbage collection runs."
          ],
          "correct": 2,
          "explain": "Every time a function calls itself, the computer must save the current state on the call stack. A recursion depth of N requires O(N) space."
        },
        {
          "tag": "HashMap: Custom Keys",
          "q": "In most languages (like Java/C#), what must you override when using a custom object as a key in a HashMap?",
          "options": [
            "Only the `toString()` method.",
            "Both the `equals()` and `hashCode()` methods.",
            "The constructor.",
            "You cannot use custom objects as keys."
          ],
          "correct": 1,
          "explain": "The HashMap uses `hashCode()` to find the correct bucket, and `equals()` to verify exact equality if multiple objects land in that same bucket (collisions)."
        },
        {
          "tag": "Time Complexity: Logarithmic",
          "q": "Why does Binary Search have an O(log N) time complexity?",
          "options": [
            "Because it divides the remaining search space in half during every single step.",
            "Because it uses logarithms in its internal math.",
            "Because it is slightly slower than O(1).",
            "Because it takes N operations divided by 10."
          ],
          "correct": 0,
          "explain": "Any algorithm that continually cuts the workload in half (like searching a phone book by splitting it down the middle) operates in Logarithmic O(log N) time."
        },
        {
          "tag": "Arrays: Prefix Sum",
          "q": "How can you quickly calculate the sum of elements between any two indices (i, j) of an array in O(1) time after initial setup?",
          "options": [
            "Use a sliding window.",
            "Precompute a Prefix Sum array, then subtract the prefix at (i-1) from the prefix at (j).",
            "Use a HashSet to store all sums.",
            "Use two pointers moving inwards."
          ],
          "correct": 1,
          "explain": "By creating an array where each index stores the running total of all previous elements, finding any subarray sum becomes a simple O(1) math subtraction."
        },
        {
          "tag": "HashMap: Worst Case",
          "q": "What scenario can cause a HashMap's lookup time complexity to degrade to O(N)?",
          "options": [
            "When the HashMap is empty.",
            "A poorly designed hash function that causes all keys to collide into the exact same bucket.",
            "When the HashMap is too large.",
            "When using Strings as keys."
          ],
          "correct": 1,
          "explain": "If every key hashes to the same index, the HashMap essentially becomes a single Linked List, meaning you have to scan through all N elements linearly."
        },
        {
          "tag": "Two Pointers: Dutch National Flag",
          "q": "How can you sort an array containing only 0s, 1s, and 2s in a single pass (O(N) time)?",
          "options": [
            "Use the standard QuickSort algorithm.",
            "Count the occurrences in a HashMap, then overwrite the array.",
            "Use three pointers (low, mid, high) to swap 0s to the front, 2s to the back, and leave 1s in the middle.",
            "Use a sliding window."
          ],
          "correct": 2,
          "explain": "This is Dijkstra's Dutch National Flag problem. By maintaining three pointers, you can evaluate the 'mid' pointer and swap elements to the ends in O(N) time and O(1) space."
        },
        {
          "tag": "System Design: LRU Cache",
          "q": "Which data structures are combined to build an LRU (Least Recently Used) Cache with O(1) time for both 'get' and 'put'?",
          "options": [
            "An Array and a Binary Search Tree.",
            "Two separate HashMaps.",
            "A Stack and a Queue.",
            "A HashMap combined with a Doubly Linked List."
          ],
          "correct": 3,
          "explain": "The HashMap provides O(1) key lookups. The Doubly Linked List maintains usage order, allowing O(1) node removal and insertion when items are accessed or evicted."
        },
        {
          "tag": "Arrays: In-Place",
          "q": "When a coding problem asks you to modify an array 'in-place', what is the strict requirement?",
          "options": [
            "You must finish in O(N) time.",
            "You cannot use any variables.",
            "You must modify the original array directly, using only O(1) extra space.",
            "You must use a HashMap."
          ],
          "correct": 2,
          "explain": "'In-place' means you cannot allocate memory for a new array (O(N) space) to solve the problem; you must manipulate the provided array using a constant amount of extra memory."
        },
        {
          "tag": "Effectiveness: HashMap vs Brute Force",
          "q": "Problem: Given an array of N integers (N can be up to 10^6), determine if any two numbers sum to a target value. Brute-force solution given:\n\n```java\nfor (int i = 0; i < arr.length; i++) {\n    for (int j = i + 1; j < arr.length; j++) {\n        if (arr[i] + arr[j] == target) return true;\n    }\n}\n```\n\nThis runs in O(N²) time. Which alternative would be most effective for N = 10^6?",
          "options": [
            "Keep the brute force — it's simpler to write and read",
            "Use a HashSet: for each number, check if (target - number) was already seen, then add the current number, giving O(N) time and O(N) space",
            "Add a third nested loop to double-check each match, improving accuracy",
            "Use recursion to check every pair instead of loops"
          ],
          "correct": 1,
          "explain": "At N = 10^6, O(N²) means ~10^12 operations — far too slow. The HashSet approach does a single O(N) pass, trading O(N) extra space for a massive time improvement — a classic space-time tradeoff."
        },
        {
          "tag": "Effectiveness: HashSet vs Sort",
          "q": "Problem: Check whether an array contains any duplicate elements. Brute-force solution given:\n\n```python\nfor i in range(len(arr)):\n    for j in range(len(arr)):\n        if i != j and arr[i] == arr[j]:\n            return True\nreturn False\n```\n\nThis is O(N²). Which of the following is the most effective fix?",
          "options": [
            "Keep the nested loops but add an early 'break' when a duplicate is found",
            "Insert every element into a HashSet; if an insert ever finds the element already present, a duplicate exists — O(N) time, O(N) space",
            "Convert the array to a String and search for repeated substrings",
            "Run the same nested loop twice to confirm the result"
          ],
          "correct": 1,
          "explain": "A HashSet lookup/insert is O(1) average, so one pass over the array (O(N) total) either finds a repeat immediately or confirms there isn't one. Sorting first (O(N log N)) then scanning adjacent elements is also valid and uses O(1) extra space, but for raw speed on unsorted data the HashSet pass is the more effective O(N) fix."
        },
        {
          "tag": "Effectiveness: Two Pointers vs HashMap",
          "q": "Problem: Given a SORTED array, find two numbers that add up to a target. Brute-force solution given:\n\n```java\nfor (int i = 0; i < arr.length; i++) {\n    for (int j = i + 1; j < arr.length; j++) {\n        if (arr[i] + arr[j] == target) return new int[]{i, j};\n    }\n}\n```\n\nBoth a HashMap approach and a Two-Pointer approach can bring this down to O(N) time. Given that the array is already sorted, which is the more effective choice?",
          "options": [
            "The HashMap approach, because it always beats every other technique",
            "The Two-Pointer approach — same O(N) time as the HashMap, but O(1) space instead of O(N), since the sorted order lets you converge from both ends without storing anything extra",
            "Neither — the brute force is fine since the array is sorted",
            "Binary search on every element, giving O(N log N)"
          ],
          "correct": 1,
          "explain": "When the array is already sorted, Two Pointers matches the HashMap's O(N) time but drops the extra O(N) space entirely — it's the strictly better choice here. The HashMap approach earns its keep on UNSORTED arrays, where sorting first would cost O(N log N)."
        }
      ]
    },
    {
      "id": "tracing",
      "title": "Code Tracing & Execution",
      "description": "Trace code execution to predict HashMap structures, pointer locations, and final outputs.",
      "questions": [
        {
          "tag": "HashMap Trace",
          "q": "Consider code:\n```java\nfor (int i = 0; i < arr.length; i++) {\n    map.put(arr[i], i);\n}\n```\nrun on array `[2, 5, 2, 8]`. What is the state of the HashMap after the loop completes?",
          "options": [
            "{2: 0, 5: 1, 8: 3}",
            "{2: 2, 5: 1, 8: 3}",
            "{0: 2, 1: 5, 2: 2, 3: 8}",
            "Error: Duplicate key"
          ],
          "correct": 1,
          "explain": "The key 2 is first added with index 0. On the 3rd iteration (i=2), the value for key 2 is overwritten with the new index 2. So the final state is {2: 2, 5: 1, 8: 3}."
        },
        {
          "tag": "Converging Pointers",
          "q": "Given array `[1, 2, 3, 4, 6]` and Target=6. Initially `left=0`, `right=4`. After 1 iteration of the Two Pointer sum algorithm, what are the locations of `left` and `right`?",
          "options": [
            "left = 1, right = 4",
            "left = 0, right = 3",
            "left = 1, right = 3",
            "left = 0, right = 4"
          ],
          "correct": 1,
          "explain": "Initial sum = arr[0] + arr[4] = 1 + 6 = 7. Since 7 > 6, we must decrease the sum by moving `right` leftwards. So `right` becomes 3, while `left` stays 0."
        },
        {
          "tag": "Fast/Slow Pointers",
          "q": "You are finding the middle of Linked List `[1 -> 2 -> 3 -> 4 -> 5]`. `slow` moves 1 step, `fast` moves 2 steps per loop. Where is `slow` after the 2nd full iteration?",
          "options": ["At node 2", "At node 3", "At node 4", "At node 5"],
          "correct": 1,
          "explain": "Start: slow=1, fast=1. Iter 1: slow=2, fast=3. Iter 2: slow=3, fast=5. So `slow` lands at node 3 (the exact middle)."
        },
        {
          "tag": "HashMap Output",
          "q": "Code:\n```java\nfor (int n : arr) {\n    map.put(n, map.getOrDefault(n, 0) + 1);\n}\n```\nrun on `[4, 4, 1]`. What does the final HashMap represent?",
          "options": [
            "The indices of each element.",
            "The frequency count of each element: {4: 2, 1: 1}.",
            "A sorted version of the array.",
            "The prefix sum of the elements."
          ],
          "correct": 1,
          "explain": "This is the classic frequency counting pattern. It initializes unseen elements to 0 and adds 1, mapping each unique number to how many times it appears."
        },
        {
          "tag": "Converging Trace",
          "q": "Code reverses array `[A, B, C, D]`. Iteration 1 swaps `left=0` and `right=3`. What are the `left` and `right` indices at the START of iteration 2?",
          "options": [
            "left=0, right=3",
            "left=1, right=2",
            "left=2, right=1",
            "left=1, right=3"
          ],
          "correct": 1,
          "explain": "After swapping the outer elements at index 0 and 3, both pointers move inwards. `left` increments to 1, and `right` decrements to 2."
        },
        {
          "tag": "HashMap Trace",
          "q": "Code:\n```java\nfor (int i = 0; i < arr.length; i++) {\n    map.put(arr[i] % 3, i);\n}\n```\nrun on array `[4, 7, 2, 9, 5]`. What is the HashMap after the loop completes?",
          "options": [
            "{1: 0, 2: 2, 0: 3}",
            "{0: 3, 1: 1, 2: 4}",
            "{4: 0, 7: 1, 2: 2, 9: 3, 5: 4}",
            "{1: 1, 2: 2, 0: 4}"
          ],
          "correct": 1,
          "explain": "Trace it: i=0→4%3=1, map{1:0}. i=1→7%3=1, OVERWRITES to map{1:1}. i=2→2%3=2, map{1:1,2:2}. i=3→9%3=0, map{1:1,2:2,0:3}. i=4→5%3=2, OVERWRITES to map{1:1,2:4,0:3}. Final: {0:3, 1:1, 2:4}."
        },
        {
          "tag": "HashSet Trace",
          "q": "Code:\n```java\nfor (int n : arr) {\n    set.add(n);\n}\n```\nrun on array `[3, 5, 3, 7, 5, 9]`. What are the contents of the HashSet after all insertions?",
          "options": [
            "{3, 5, 3, 7, 5, 9} — every value is kept, including repeats",
            "{3, 5, 7, 9} — duplicate values (3 and 5) are silently ignored, leaving 4 unique elements",
            "{9, 7, 5, 3} — sorted in descending order",
            "An error is thrown the second time 3 or 5 is inserted"
          ],
          "correct": 1,
          "explain": "A HashSet only stores unique elements — inserting a value that's already present simply does nothing (no error, no duplicate). Out of the 6 insertions, only the first occurrence of each distinct value (3, 5, 7, 9) actually changes the set, leaving 4 elements."
        },
        {
          "tag": "HashSet Trace",
          "q": "Code:\n```java\nSet<Integer> set = new HashSet<>();\nfor (int n : arr) set.add(n);\nset.remove(5);\n```\nrun on array `[5, 3, 5, 8, 3, 9]`. What are the final contents of the set?",
          "options": ["{5, 3, 8, 9}", "{3, 8, 9}", "{8, 9}", "{3, 5, 8, 9, 5}"],
          "correct": 1,
          "explain": "After the loop, duplicates collapse and the set holds {5, 3, 8, 9}. The `set.remove(5)` call then deletes the key 5, leaving {3, 8, 9}."
        },
        {
          "tag": "Two Pointers Trace",
          "q": "Full solution given — sorted array `[2, 4, 6, 8, 10, 12]`, target = 15:\n```java\nleft = 0, right = arr.length - 1\nwhile (left < right) {\n    sum = arr[left] + arr[right]\n    if (sum == target) break\n    else if (sum < target) left++\n    else right--\n}\n```\nWhat are `left` and `right` after the 3rd iteration of the loop?",
          "options": [
            "left = 1, right = 4",
            "left = 2, right = 4",
            "left = 2, right = 5",
            "left = 3, right = 4"
          ],
          "correct": 1,
          "explain": "Iter 1: left=0,right=5 → sum=2+12=14 < 15 → left++ (left=1). Iter 2: left=1,right=5 → sum=4+12=16 > 15 → right-- (right=4). Iter 3: left=1,right=4 → sum=4+10=14 < 15 → left++ (left=2). After the 3rd iteration: left=2, right=4."
        },
        {
          "tag": "HashMap Trace",
          "q": "This is the classic Two Sum pattern. Full code given, run on `arr = [3, 2, 4]`, `target = 6`:\n```python\nmap = {}\nresult = None\nfor i, x in enumerate(arr):\n    if (target - x) in map:\n        result = map[target - x]\n    map[x] = i\n```\nWhat is the final value of `result`?",
          "options": ["0", "1", "2", "None (no match found)"],
          "correct": 1,
          "explain": "i=0: x=3, need 3 (6-3), map is empty → no match. map={3:0}. i=1: x=2, need 4, not in map → no match. map={3:0,2:1}. i=2: x=4, need 2 → 2 IS in map, so result = map[2] = 1. The pair is indices 1 and 2 (values 2 and 4, which sum to 6)."
        }
      ]
    },
    {
      "id": "syntax",
      "title": "Java & Python: Code Syntax",
      "description": "Test whether you know the exact syntax for HashMap/dict, HashSet/set, and two-pointer patterns in both languages.",
      "questions": [
        {
          "tag": "HashMap Syntax: Java",
          "q": "In Java, which is the correct way to check if a HashMap called `map` contains a given key?",
          "options": [
            "map.exists(key)",
            "map.containsKey(key)",
            "key in map",
            "map.hasKey(key)"
          ],
          "correct": 1,
          "explain": "Java's Map interface provides `containsKey(key)`. The `key in map` syntax is Python, not Java — Java has no `in` operator for membership checks."
        },
        {
          "tag": "HashMap Syntax: Python",
          "q": "In Python, which is the correct way to check if a dict `d` contains a given key?",
          "options": [
            "d.containsKey(key)",
            "d.hasKey(key)",
            "key in d",
            "d.exists(key)"
          ],
          "correct": 2,
          "explain": "Python dicts support the `in` operator directly: `key in d`. `containsKey` and `hasKey` are Java-style method names that don't exist on Python dicts."
        },
        {
          "tag": "HashMap Syntax: Java",
          "q": "In Java, what is the correct way to read a value from a HashMap and fall back to 0 if the key is missing?",
          "options": [
            "map.get(key, 0)",
            "map.getOrDefault(key, 0)",
            "map[key] ?? 0",
            "map.getDefault(key)"
          ],
          "correct": 1,
          "explain": "Java's `getOrDefault(key, defaultValue)` returns the stored value, or the given default if the key isn't present. Plain `get(key)` alone would return `null` for a missing key, not 0."
        },
        {
          "tag": "HashMap Syntax: Python",
          "q": "In Python, what is the correct way to read a value from a dict `d` and fall back to 0 if the key is missing?",
          "options": [
            "d.get(key, 0)",
            "d.getOrDefault(key, 0)",
            "d[key] or 0",
            "d.fetch(key, 0)"
          ],
          "correct": 0,
          "explain": "Python's `dict.get(key, default)` is the direct equivalent of Java's `getOrDefault`. `getOrDefault` isn't a Python method, and `d[key]` alone raises a `KeyError` on a missing key."
        },
        {
          "tag": "HashSet Syntax: Java",
          "q": "In Java, which HashSet method inserts an element, returning `false` if it was already present?",
          "options": [
            "set.insert(element)",
            "set.push(element)",
            "set.add(element)",
            "set.put(element)"
          ],
          "correct": 2,
          "explain": "Java's `Set.add(element)` returns a boolean: `true` if the element was newly added, `false` if it was already in the set. `put()` is a Map method, not a Set method."
        },
        {
          "tag": "HashSet Syntax: Python",
          "q": "In Python, which method inserts an element into a `set`?",
          "options": [
            "s.append(element)",
            "s.add(element)",
            "s.insert(element)",
            "s.push(element)"
          ],
          "correct": 1,
          "explain": "Python sets use `.add(element)`. `.append()` is a list method, and Python sets have no `.insert()` or `.push()` methods since sets are unordered."
        },
        {
          "tag": "HashSet Syntax: Java",
          "q": "In Java, which of these correctly removes a character `ch` from a `HashSet<Character>` called `set`?",
          "options": [
            "set.discard(ch)",
            "set.delete(ch)",
            "set.remove(ch)",
            "set.pop(ch)"
          ],
          "correct": 2,
          "explain": "Java's `Set.remove(element)` deletes the element if present (and safely does nothing if it isn't). `discard()` is Python's name for this same safe-removal behavior — Java doesn't have it."
        },
        {
          "tag": "HashSet Syntax: Python",
          "q": "In Python, which method removes an item from a `set` WITHOUT raising an error if the item isn't present?",
          "options": [
            "s.remove(item)",
            "s.pop(item)",
            "s.delete(item)",
            "s.discard(item)"
          ],
          "correct": 3,
          "explain": "Python's `s.discard(item)` removes the item if it exists and does nothing otherwise. `s.remove(item)` looks almost identical but raises a `KeyError` if the item is missing — a common source of bugs."
        },
        {
          "tag": "Two Pointers Syntax: Java",
          "q": "In the classic 'pair sum in a sorted array' two-pointer pattern, which `while` condition is correct so the two pointers never point to the same element twice?",
          "options": [
            "while (left <= right)",
            "while (left < right)",
            "while (left != right + 1)",
            "while (left > right)"
          ],
          "correct": 1,
          "explain": "`while (left < right)` stops the moment the pointers meet or cross, which is exactly when there's no valid pair left to check. Using `<=` would let `left` and `right` both land on the same index and compare an element to itself."
        },
        {
          "tag": "Two Pointers Syntax: Python",
          "q": "What is the correct Python `while` loop header for the same 'pointers converge, never overlap' two-pointer pattern?",
          "options": [
            "while left <= right:",
            "while left != right:",
            "while left < right:",
            "while left > right:"
          ],
          "correct": 2,
          "explain": "`while left < right:` is the direct Python equivalent — it stops once the pointers meet or cross. `left != right` is risky: if `left` ever jumps past `right` without landing exactly on it, the loop would run forever."
        }
      ]
    }
  ]
}

output_quizzes = []
for qz in input_data["quizzes"]:
    quiz = {
        "id": qz["id"],
        "title": qz["title"],
        "description": qz["description"],
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "status": "active",
        "questions": []
    }
    
    for idx, q in enumerate(qz["questions"]):
        quiz["questions"].append({
            "id": f"q{idx + 1}",
            "text": q["q"],
            "options": q["options"],
            "correctOptionIndex": q["correct"],
            "explanation": q["explain"]
        })
        
    output_quizzes.append(quiz)

with open("course-materials/quizzes-data.json", "w") as f:
    json.dump(output_quizzes, f, indent=2)

print("Conversion complete.")
