export interface ReelQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReelSegment {
  id: string;
  durationMs: number;
  type: "hook" | "trap" | "breakthrough" | "rule" | "quiz" | "trivia";
  badge: string;
  headline: string;
  subtext: string;
  caption: string;
  highlightChip?: { text: string; color: "rose" | "amber" | "emerald" | "sky" | "purple" };
  visualData?: {
    array?: (number | string)[];
    leftIdx?: number;
    rightIdx?: number;
    highlightIdxs?: number[];
    opCount?: { label: string; count: string; status: "bad" | "good" };
    glitch?: boolean;
    comparison?: { naive: string; optimal: string };
    patternTable?: { trigger: string; dataStructure: string; time: string }[];
    factCard?: { title: string; detail: string; impact: string };
  };
  quiz?: ReelQuiz;
}

export interface AlgoReel {
  id: string;
  topic: string;
  title: string;
  category: "patterns" | "basics" | "medium" | "advanced" | "trivia";
  difficulty: "Beginner" | "Medium" | "Advanced";
  author: string;
  avatar: string;
  gradient: string;
  soundtrack: string;
  likes: number;
  tags: string[];
  guideLink: string;
  segments: ReelSegment[];
}

export const REEL_CATEGORIES = [
  { id: "all", label: "🔥 All Micro-Bytes" },
  { id: "patterns", label: "🎯 When to Use What" },
  { id: "basics", label: "🌱 Basics & Math" },
  { id: "medium", label: "⚡ Medium Patterns" },
  { id: "advanced", label: "🚀 DP & Hard" },
  { id: "trivia", label: "🤯 Coding Lore & Trivia" },
] as const;

export const ALGO_REELS: AlgoReel[] = [
  // 1. PATTERN DETECTIVE: WHEN TO USE WHAT
  {
    id: "when-to-use-what-patterns",
    topic: "Cheat Sheet",
    title: "The Ultimate 'When to Use What' Pattern Map",
    category: "patterns",
    difficulty: "Medium",
    author: "@pattern_guru",
    avatar: "🧭",
    gradient: "from-fuchsia-600 via-violet-600 to-indigo-950",
    soundtrack: "Cyber Beat · High Focus",
    likes: 8940,
    tags: ["#interviewprep", "#patterns", "#dsa", "#leetcodecheatsheet"],
    guideLink: "/curriculum/dsa",
    segments: [
      {
        id: "pat-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · THE PROBLEM",
        headline: "Staring at a LeetCode problem for 10 minutes with zero clue what to use? 😵‍💫",
        subtext: "You don't need 500 problems. You need trigger keywords that scream the data structure.",
        caption: "Stop memorizing code. Learn to decode problem statements in 5 seconds flat. #dsa #patterns",
        highlightChip: { text: "TRIGGER DECODER", color: "purple" },
        visualData: {
          glitch: true,
          opCount: { label: "Failure Rate Without Pattern Recognition", count: "78% Freeze", status: "bad" },
        },
      },
      {
        id: "pat-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE TRIGGER MATRIX",
        headline: "Spot These Exact Words in the Prompt 🔍",
        subtext: "The prompt gives away the optimal algorithm every single time:",
        caption: "Top K / Kth largest = HEAP. Contiguous subarray = SLIDING WINDOW. Shortest path = BFS. #cheatsheet",
        highlightChip: { text: "INSTANT SHORTCUT", color: "emerald" },
        visualData: {
          patternTable: [
            { trigger: "'Top K' or 'Kth Most Frequent'", dataStructure: "Min/Max Heap", time: "O(N log K)" },
            { trigger: "'Contiguous Subarray / Substring'", dataStructure: "Sliding Window", time: "O(N)" },
            { trigger: "'Shortest Path in Unweighted Graph'", dataStructure: "BFS (Queue)", time: "O(V + E)" },
            { trigger: "'Find Cycle / Middle Node'", dataStructure: "Fast & Slow Pointers", time: "O(N) time, O(1) space" },
          ],
        },
      },
      {
        id: "pat-3",
        durationMs: 8000,
        type: "rule",
        badge: "03 · DECISION TREE",
        headline: "The 3-Second Mental Triage 🌲",
        subtext: "Are items sorted? Two Pointers or Binary Search. Overlapping subproblems? DP. Intervals? Sort by start time.",
        caption: "Always check constraints first: N <= 20? Backtracking. N <= 1000? O(N²). N >= 100,000? MUST be O(N) or O(N log N). #bigo",
        highlightChip: { text: "CONSTRAINT RULE", color: "sky" },
        visualData: {
          comparison: {
            naive: "N = 100k with O(N²): Time Limit Exceeded (10s)",
            optimal: "N = 100k with O(N log N): 1,700,000 ops (0.01s! ⚡)",
          },
        },
      },
      {
        id: "pat-4",
        durationMs: 11000,
        type: "quiz",
        badge: "04 · TRIVIA QUIZ",
        headline: "Pattern Test: 'Find the 5 most frequent items in a live stream' — which tool wins? 🏆",
        subtext: "Incoming data never ends.",
        caption: "Test your intuition right now! #quiz #interviewprep",
        quiz: {
          question: "Which data structure keeps track of the 'Top K Most Frequent' elements in optimal O(N log K) time?",
          options: [
            "Min-Heap of fixed size K",
            "Sort the entire array on every incoming item",
          ],
          correctIndex: 0,
          explanation: "Spot on! Keeping a Min-Heap of size K allows O(log K) insertions and discards smaller elements automatically!",
        },
      },
    ],
  },

  // 2. SLIDING WINDOW
  {
    id: "sliding-window-30s",
    topic: "Sliding Window",
    title: "Stop Recomputing: Turn O(N·K) into O(N)",
    category: "medium",
    difficulty: "Medium",
    author: "@algo_wizard",
    avatar: "⚡",
    gradient: "from-cyan-500 via-blue-600 to-indigo-950",
    soundtrack: "Cyber Synth · 128 BPM",
    likes: 4280,
    tags: ["#algorithms", "#slidingwindow", "#dsa", "#techinterview"],
    guideLink: "/curriculum/dsa/sliding-window",
    segments: [
      {
        id: "sw-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · THE DISASTER",
        headline: "POV: You wrote an O(N · K) loop on 100k streaming items 💀",
        subtext: "Latency hits 14s. Server CPU locks at 100%.",
        caption: "Never recount the entire window when only TWO numbers changed. #programming #fails",
        highlightChip: { text: "100% CPU SPIKE", color: "rose" },
        visualData: {
          glitch: true,
          opCount: { label: "Operations Burned", count: "100,000,000+", status: "bad" },
        },
      },
      {
        id: "sw-2",
        durationMs: 7000,
        type: "trap",
        badge: "02 · THE TRAP",
        headline: "Why Your Instinct Lies to You 🧠❌",
        subtext: "For every index i, you re-sum all k numbers from scratch.",
        caption: "99% of those numbers were ALREADY added in the previous loop iteration! Stop doing homework twice. #cleanCode",
        highlightChip: { text: "99.9% WASTED MATH", color: "amber" },
        visualData: {
          array: [4, 2, 1, 7, 8, 1, 2],
          highlightIdxs: [0, 1, 2],
          opCount: { label: "Redundant Recalculations", count: "4,999 per step", status: "bad" },
        },
      },
      {
        id: "sw-3",
        durationMs: 8000,
        type: "breakthrough",
        badge: "03 · THE AHA! MOMENT",
        headline: "The Train Door Trick 🚆✨",
        subtext: "Watch the front door and rear door. Ignore the middle!",
        caption: "Subtract the passenger who exits left (-left). Add the passenger who enters right (+right). Instant O(1)! #mindblown",
        highlightChip: { text: "O(1) PER STEP", color: "emerald" },
        visualData: {
          array: [4, 2, 1, 7, 8, 1, 2],
          leftIdx: 0,
          rightIdx: 3,
          comparison: {
            naive: "Re-sum: 2 + 1 + 7 = 10 (O(K))",
            optimal: "Slide: 7 - 4 + 7 = 10 (O(1) 🔥)",
          },
        },
      },
      {
        id: "sw-4",
        durationMs: 10000,
        type: "quiz",
        badge: "04 · QUICK TEST",
        headline: "Speed Check: What happens when the window exceeds target sum? 🤔",
        subtext: "All elements are positive numbers.",
        caption: "Prove you got it before moving to the next reel! Drop your answer 👇 #quiz",
        quiz: {
          question: "When current sum > target in a positive array, what should you do?",
          options: [
            "Shrink window by incrementing left (L++)",
            "Expand window by incrementing right (R++)",
          ],
          correctIndex: 0,
          explanation: "Correct! Advancing left subtracts nums[left], lowering the sum back toward target in O(1)!",
        },
      },
    ],
  },

  // 3. TWO POINTERS
  {
    id: "two-pointers-30s",
    topic: "Two Pointers",
    title: "Squeeze The Search Space From Both Ends",
    category: "basics",
    difficulty: "Beginner",
    author: "@code_ninja",
    avatar: "🎯",
    gradient: "from-amber-500 via-rose-600 to-purple-950",
    soundtrack: "Chill Hop Beats · 90 BPM",
    likes: 3890,
    tags: ["#twopointer", "#algorithms", "#leetcode", "#python"],
    guideLink: "/curriculum/dsa/two-pointer",
    segments: [
      {
        id: "tp-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · THE DISASTER",
        headline: "Checking all pairs in a sorted array is an absolute crime 🚨",
        subtext: "Testing N · (N-1) / 2 pairs when numbers are already in order.",
        caption: "Sorting gives you superpowers. Don't throw them in the trash! #cs #datastructures",
        highlightChip: { text: "N² CRASH", color: "rose" },
        visualData: {
          glitch: true,
          opCount: { label: "Blind Pair Checks", count: "5,000,000 pairs", status: "bad" },
        },
      },
      {
        id: "tp-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE AHA! MOMENT",
        headline: "The Inward Vise Squeeze 🦀",
        subtext: "1 comparison eliminates an entire row of candidates!",
        caption: "Sum too large? Decrement right. Sum too small? Increment left. You pinch in from edges in O(N). #algorithmHacks",
        highlightChip: { text: "O(N) PINCH", color: "emerald" },
        visualData: {
          array: [2, 7, 11, 15],
          leftIdx: 0,
          rightIdx: 3,
          comparison: {
            naive: "Check all pairs: O(N²)",
            optimal: "Inward walk: Max N steps (O(N) ⚡)",
          },
        },
      },
      {
        id: "tp-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · QUICK TEST",
        headline: "If nums[L] + nums[R] < target, which pointer moves? 🎯",
        subtext: "Array is sorted in ascending order.",
        caption: "Test your mental model right now! #dsa #quiz",
        quiz: {
          question: "Sum is currently less than target. How do you increase it?",
          options: [
            "Increment left pointer (L++)",
            "Decrement right pointer (R--)",
          ],
          correctIndex: 0,
          explanation: "Spot on! Moving left to the right accesses a larger value, pulling the sum upward!",
        },
      },
    ],
  },

  // 4. BIT MANIPULATION (MATH)
  {
    id: "bitwise-xor-magic",
    topic: "Bitwise Math",
    title: "The XOR Magic Trick: Find Single Number in O(1) Space",
    category: "basics",
    difficulty: "Beginner",
    author: "@byte_hacker",
    avatar: "⚡",
    gradient: "from-yellow-400 via-amber-600 to-stone-950",
    soundtrack: "8-Bit Arcade · Retro Wave",
    likes: 6710,
    tags: ["#bitwise", "#xor", "#clevercode", "#math"],
    guideLink: "/curriculum/dsa",
    segments: [
      {
        id: "xor-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · THE RIDDLE",
        headline: "Every number appears twice except ONE. Find it with ZERO extra memory! 🎩",
        subtext: "Hash maps take O(N) memory. Sorting takes O(N log N). Can you do O(N) time and O(1) space?",
        caption: "Bitwise XOR is the closest thing to real-life black magic in computer science. #math #codinghacks",
        highlightChip: { text: "O(1) SPACE ONLY", color: "amber" },
        visualData: {
          array: [4, 1, 2, 1, 2],
        },
      },
      {
        id: "xor-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE TWO PROPERTIES",
        headline: "XOR Destroys Twins Like Matter & Antimatter 💥",
        subtext: "1. X ^ X = 0 (identical twins cancel out to zero!). 2. X ^ 0 = X (zero leaves you unchanged).",
        caption: "Order doesn't matter (commutative)! If you XOR every number together, all duplicates annihilate each other, leaving ONLY the single survivor! #mindblown",
        highlightChip: { text: "X ^ X = 0", color: "emerald" },
        visualData: {
          comparison: {
            naive: "Hash Set: O(N) memory allocation",
            optimal: "Single XOR accumulator: 4 ^ (1 ^ 1) ^ (2 ^ 2) = 4 ^ 0 = 4! (0 bytes memory 🔥)",
          },
        },
      },
      {
        id: "xor-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · MATH QUIZ",
        headline: "What is the result of: 7 ^ 7 ^ 42 ^ 99 ^ 99? 🧮",
        subtext: "Do it in your head in 3 seconds!",
        caption: "Pair up the twins and watch them vanish! #quickmath",
        quiz: {
          question: "Compute: 7 ^ 7 ^ 42 ^ 99 ^ 99",
          options: [
            "42",
            "0",
            "118",
          ],
          correctIndex: 0,
          explanation: "(7 ^ 7) = 0 and (99 ^ 99) = 0. Therefore 0 ^ 42 ^ 0 = 42!",
        },
      },
    ],
  },

  // 5. DYNAMIC PROGRAMMING
  {
    id: "dp-memoization-demystified",
    topic: "Dynamic Programming",
    title: "Don't Be a Goldfish: The Memoization Secret",
    category: "advanced",
    difficulty: "Advanced",
    author: "@dp_sorcerer",
    avatar: "🧠",
    gradient: "from-rose-500 via-purple-600 to-zinc-950",
    soundtrack: "Dark Synthwave · Intense",
    likes: 7420,
    tags: ["#dynamicprogramming", "#memoization", "#recursion", "#faang"],
    guideLink: "/curriculum/dsa/dp-1d",
    segments: [
      {
        id: "dp-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · THE HORROR",
        headline: "Plain recursion on Fibonacci(50) takes 1.1 QUADRILLION operations 💀",
        subtext: "Your laptop will finish in approximately 35 years.",
        caption: "The recursion tree recomputes fib(3) billions of times. It has the memory of a goldfish. #dp #recursion",
        highlightChip: { text: "O(2^N) EXPLOSION", color: "rose" },
        visualData: {
          glitch: true,
          opCount: { label: "Operations for fib(50)", count: "1,125,899,906,842,624", status: "bad" },
        },
      },
      {
        id: "dp-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE WRITE-IT-DOWN TRICK",
        headline: "Dynamic Programming is Just 'Remembering Stuff' 📝",
        subtext: "If I write 1 + 1 + 1 + 1 = 4 on the board and ask for the sum, you say 4. If I add another '+ 1', you don't count from 1. You say 5!",
        caption: "Store answers in an array or hash map `memo`. If fib(n) is already in memo, return it instantly! O(2^N) collapses to O(N). #smartCoding",
        highlightChip: { text: "COLLAPSE TO O(N)", color: "emerald" },
        visualData: {
          comparison: {
            naive: "Naive recursion fib(50): 35 years",
            optimal: "DP with Memo: 50 operations (< 1 millisecond! ⚡)",
          },
        },
      },
      {
        id: "dp-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · DP CHECK",
        headline: "What two properties must a problem have to be solvable with DP? 🤔",
        subtext: "Core interview theory question.",
        caption: "Can you name the two DP commandments? #interviewPrep",
        quiz: {
          question: "Which two properties indicate that Dynamic Programming applies?",
          options: [
            "Overlapping Subproblems & Optimal Substructure",
            "Sorted Input & Odd Length Array",
          ],
          correctIndex: 0,
          explanation: "Yes! Overlapping subproblems means repeating computations; optimal substructure means the global answer is built from optimal smaller answers!",
        },
      },
    ],
  },

  // 6. GREEDY ALGORITHMS
  {
    id: "greedy-interval-scheduling",
    topic: "Greedy Strategy",
    title: "When Greed is Good: Interval Scheduling",
    category: "medium",
    difficulty: "Medium",
    author: "@greedy_hawk",
    avatar: "🦅",
    gradient: "from-emerald-400 via-teal-600 to-gray-950",
    soundtrack: "Lo-Fi Lounge · Smooth",
    likes: 4620,
    tags: ["#greedy", "#intervals", "#meetingrooms", "#algorithms"],
    guideLink: "/curriculum/dsa",
    segments: [
      {
        id: "gr-1",
        durationMs: 7000,
        type: "hook",
        badge: "01 · THE DILEMMA",
        headline: "You have 10 meeting requests in 1 conference room. How do you fit the MOST meetings? 🗓️",
        subtext: "Pick the shortest meeting? Pick the earliest starting meeting? Both can fail spectacularly!",
        caption: "Counterexamples destroy naive greed. Let's see the one greedy criterion that mathematically never fails. #greedy",
        highlightChip: { text: "MEETING DILEMMA", color: "amber" },
      },
      {
        id: "gr-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE WINNING HEURISTIC",
        headline: "Always Pick the Meeting that ENDS Earliest! ⏰",
        subtext: "Sorting by END TIME frees up the room as early as humanly possible for the rest of the day.",
        caption: "1. Sort intervals by `end_time`. 2. Pick next meeting if `start_time >= last_end_time`. Guaranteed optimal in O(N log N)! #cleanLogic",
        highlightChip: { text: "SORT BY END TIME", color: "emerald" },
        visualData: {
          comparison: {
            naive: "Sort by start time: Can block room all day",
            optimal: "Sort by end time: Maximizes remaining time window",
          },
        },
      },
      {
        id: "gr-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · GREEDY QUIZ",
        headline: "Interval Challenge: Why does picking the shortest duration fail? 🎯",
        subtext: "Think about overlaps.",
        caption: "Test your edge case intuition! #edgecases",
        quiz: {
          question: "Why does sorting by duration (shortest first) fail in interval scheduling?",
          options: [
            "A short meeting might overlap and block TWO other valid meetings",
            "Short meetings are always harder to sort",
          ],
          correctIndex: 0,
          explanation: "Spot on! A 10-minute meeting from 1:55 to 2:05 could conflict with both a 1:00-2:00 meeting and a 2:00-3:00 meeting!",
        },
      },
    ],
  },

  // 7. TIME & SPACE COMPLEXITY
  {
    id: "time-complexity-magic",
    topic: "Complexity Theory",
    title: "Why O(log N) Beats The Entire Universe",
    category: "basics",
    difficulty: "Beginner",
    author: "@scale_master",
    avatar: "📈",
    gradient: "from-blue-500 via-indigo-600 to-black",
    soundtrack: "Space Odyssey · Ambient",
    likes: 6110,
    tags: ["#bigo", "#binarysearch", "#scale", "#computerscience"],
    guideLink: "/curriculum/dsa",
    segments: [
      {
        id: "tc-1",
        durationMs: 6500,
        type: "hook",
        badge: "01 · MIND BOGGLING",
        headline: "If you search through ALL 8 BILLION people on Earth with Binary Search... 🌍",
        subtext: "How many questions does it take to find the exact person?",
        caption: "Take a guess before looking at the next frame. You will be shocked. #mindblown #facts",
        highlightChip: { text: "8,000,000,000 PEOPLE", color: "sky" },
      },
      {
        id: "tc-2",
        durationMs: 8000,
        type: "breakthrough",
        badge: "02 · THE LOGARITHM MIRACLE",
        headline: "Just 33 Questions! That's it! 🤯",
        subtext: "Because 2^33 = 8.58 Billion. Every single question cuts the entire human race in HALF.",
        caption: "Linear search checks 8 billion items. Binary search checks 33 items. That is the staggering power of logarithmic time. #mathMagic",
        highlightChip: { text: "LOG2(8 BILLION) = 33", color: "emerald" },
        visualData: {
          comparison: {
            naive: "Linear scan: 8,000,000,000 checks",
            optimal: "Binary search: 33 checks (0.000001 seconds! ⚡)",
          },
        },
      },
      {
        id: "tc-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · SCALE QUIZ",
        headline: "If you double the array size from 1,000,000 to 2,000,000, how many extra steps does Binary Search take? ⏱️",
        subtext: "Think in powers of 2.",
        caption: "Drop your answer! #bigO #interviewTrivia",
        quiz: {
          question: "How many extra comparisons does binary search need when array size doubles?",
          options: [
            "Just 1 extra comparison!",
            "Double the comparisons (2x)",
            "100 extra comparisons",
          ],
          correctIndex: 0,
          explanation: "Only 1! Doubling the array size adds log2(2) = 1 step. 1 million takes ~20 steps; 2 million takes 21!",
        },
      },
    ],
  },

  // 8. CODING TRIVIA / HISTORICAL BUG
  {
    id: "trivia-370m-integer-overflow",
    topic: "Coding Trivia",
    title: "The $370 Million Dollar Integer Overflow",
    category: "trivia",
    difficulty: "Beginner",
    author: "@tech_historian",
    avatar: "🚀",
    gradient: "from-red-600 via-orange-600 to-black",
    soundtrack: "Space Alarm · Cinematic",
    likes: 9230,
    tags: ["#codingtrivia", "#ariane5", "#bugs", "#integeroverflow"],
    guideLink: "/curriculum/dsa",
    segments: [
      {
        id: "triv-1",
        durationMs: 7000,
        type: "trivia",
        badge: "01 · THE DISASTER",
        headline: "On June 4, 1996, a $370M rocket blew up 37 seconds after launch 💥",
        subtext: "The European Ariane 5 rocket self-destructed over French Guiana. Not an engine failure. A software bug.",
        caption: "One of the most expensive single bugs in human history. #history #programming #facts",
        highlightChip: { text: "$370,000,000 CRASH", color: "rose" },
        visualData: {
          factCard: {
            title: "Ariane Flight 501",
            detail: "Unmanned launch vehicle destroyed in mid-air",
            impact: "$370 Million payload loss",
          },
        },
      },
      {
        id: "triv-2",
        durationMs: 8000,
        type: "trivia",
        badge: "02 · THE POISON LINE",
        headline: "Converting a 64-bit float to a 16-bit signed integer! 📉",
        subtext: "The horizontal velocity value exceeded 32,767 (max signed 16-bit int). Overflow exception triggered without handler!",
        caption: "The flight computer interpreted the crash diagnostic data as physical aerodynamic flight commands, steering the rocket into a 90° flip until aerodynamic forces tore it apart! #codeReview",
        highlightChip: { text: "16-BIT OVERFLOW", color: "amber" },
        visualData: {
          comparison: {
            naive: "Velocity = 36,000.0 (Float64)",
            optimal: "16-bit Int cap: 32,767 -> CRASH & BURN 🔥",
          },
        },
      },
      {
        id: "triv-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · TRIVIA QUIZ",
        headline: "What is the maximum positive value of a signed 16-bit integer? 🔢",
        subtext: "2^15 - 1",
        caption: "Know your type limits! #types #trivia",
        quiz: {
          question: "What is the maximum value for a signed 16-bit integer (short in Java/C++)?",
          options: [
            "32,767",
            "65,535",
            "16,384",
          ],
          correctIndex: 0,
          explanation: "Correct! A signed 16-bit integer uses 1 bit for the sign and 15 bits for magnitude: 2^15 - 1 = 32,767. 65,535 is unsigned!",
        },
      },
    ],
  },

  // 9. CODING TRIVIA / DIJKSTRA COFFEE NAPKIN
  {
    id: "trivia-dijkstra-cafe",
    topic: "Coding Trivia",
    title: "Dijkstra Designed His Algorithm in 20 Minutes Without Pen or Paper",
    category: "trivia",
    difficulty: "Beginner",
    author: "@tech_historian",
    avatar: "☕",
    gradient: "from-amber-600 via-orange-700 to-stone-950",
    soundtrack: "Coffeehouse Jazz · Chill",
    likes: 5410,
    tags: ["#dijkstra", "#algorithms", "#trivia", "#csHistory"],
    guideLink: "/curriculum/dsa/graphs",
    segments: [
      {
        id: "djk-1",
        durationMs: 7000,
        type: "trivia",
        badge: "01 · THE LEGEND",
        headline: "The most famous shortest-path algorithm in the world was born in a cafe in 1956 ☕",
        subtext: "Edsger Dijkstra was shopping in Amsterdam with his fiancée and sat down at the Cafe de Doelen.",
        caption: "Google Maps and your home WiFi router still use this exact logic today. #history #googlemaps",
        highlightChip: { text: "CAFE DE DOELEN 1956", color: "amber" },
      },
      {
        id: "djk-2",
        durationMs: 8000,
        type: "trivia",
        badge: "02 · NO PEN OR PAPER",
        headline: "Invented in 20 Minutes Flat! 🧠✨",
        subtext: "He designed it to demonstrate what the ARMAC computer could do. He wanted to find the shortest route between 64 cities in the Netherlands.",
        caption: "Dijkstra said: 'I designed it without pencil and paper — in fact, while having coffee with my fiancée. It was so simple because I didn't want to explain complicated math to non-programmers!' #genius",
        highlightChip: { text: "20 MINUTES OF THOUGHT", color: "emerald" },
      },
      {
        id: "djk-3",
        durationMs: 10000,
        type: "quiz",
        badge: "03 · DIJKSTRA QUIZ",
        headline: "Which case makes Dijkstra's algorithm fail completely? ⚠️",
        subtext: "Crucial graph interview question.",
        caption: "Do you know Dijkstra's kryptonite? #graphs #dsa",
        quiz: {
          question: "When does Dijkstra's algorithm fail to guarantee the shortest path?",
          options: [
            "Graphs with negative edge weights",
            "Graphs with cycles",
            "Graphs with more than 1,000 nodes",
          ],
          correctIndex: 0,
          explanation: "Negative edge weights! Dijkstra greedily assumes visiting a node finalizes its shortest path. For negative weights, use Bellman-Ford!",
        },
      },
    ],
  },
];
