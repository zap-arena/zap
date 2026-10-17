export interface CourseItem {
  id: string;
  title: string;
  track: "dsa" | "cs" | "ai";
  trackLabel: string;
  difficulty: "Beginner" | "Easy" | "Medium" | "Hard" | "All Levels";
  rating: number;
  ratingCount: number;
  problemCount: string;
  description: string;
  topics: string[];
  link: string;
  linkText: string;
  image: string;
  icon: string;
  instructor: {
    name: string;
    avatar: string;
    category: string;
  };
}

export const COURSES_DATA: CourseItem[] = [
  // DSA Track
  {
    id: "hashing",
    title: "Hashing & Hash Tables",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Medium",
    rating: 4.95,
    ratingCount: 1240,
    problemCount: "8 Core Problems",
    description:
      "Master constant-time lookups, frequency counting, prefix sums with hash maps, and index tracking techniques.",
    topics: [
      "Two Sum",
      "Group Anagrams",
      "Top K Frequent",
      "Subarray Sum = K",
      "Longest Consecutive",
    ],
    link: "/curriculum/dsa/hashing",
    linkText: "Explore Hashing Guide",
    icon: "🔑",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Algorithms & Data Structures",
    },
  },
  {
    id: "sliding-window",
    title: "Sliding Window Pattern",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Medium",
    rating: 5.0,
    ratingCount: 1580,
    problemCount: "10 Core Problems",
    description:
      "Learn fixed and dynamic window techniques to solve subarray & substring optimal length problems efficiently.",
    topics: [
      "Max Sum Subarray",
      "Min Size Subarray",
      "Longest Substring",
      "Min Window Substring",
      "Fruit Into Baskets",
    ],
    link: "/curriculum/dsa/sliding-window",
    linkText: "Explore Sliding Window Guide",
    icon: "🪟",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Algorithms & Optimization",
    },
  },
  {
    id: "two-pointer",
    title: "Two Pointer Algorithms",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Easy",
    rating: 4.92,
    ratingCount: 1890,
    problemCount: "13 Core Problems",
    description:
      "Utilize converging pointers, fast/slow pointers, and boundary partitioning on sorted or linear collections.",
    topics: [
      "Two Sum II",
      "Container Most Water",
      "3Sum",
      "Trapping Rain Water",
      "Sort Colors",
    ],
    link: "/curriculum/dsa/two-pointer",
    linkText: "Explore Two Pointers Guide",
    icon: "👉👈",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Pointers & Linear Scan",
    },
  },
  {
    id: "recursion",
    title: "Recursion & Backtracking",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Medium",
    rating: 4.88,
    ratingCount: 940,
    problemCount: "8 Core Problems",
    description:
      "Master base cases, recursive cases, memoization, and in-place recursive techniques — from factorial to permutations.",
    topics: [
      "Fibonacci Number",
      "Power(x, n)",
      "Climbing Stairs",
      "Subsets",
      "Permutations",
    ],
    link: "/curriculum/dsa/recursion",
    linkText: "Explore Recursion Guide",
    icon: "🔁",
    image:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Recursion & Tree Search",
    },
  },
  {
    id: "stack",
    title: "Stack & Monotonic Stack",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Medium",
    rating: 4.9,
    ratingCount: 1120,
    problemCount: "6 Core Problems",
    description:
      "Master last-in-first-out ordering with monotonic stacks, bracket matching, and O(1) auxiliary tracking.",
    topics: [
      "Valid Parentheses",
      "Next Greater Element",
      "Daily Temperatures",
      "Min Stack",
      "Largest Rectangle",
    ],
    link: "/curriculum/dsa/stack",
    linkText: "Explore Stack Guide",
    icon: "🧱",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Marcus Vance",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Linear Data Structures",
    },
  },
  {
    id: "queue",
    title: "Queue & Deque Architecture",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Easy",
    rating: 4.86,
    ratingCount: 780,
    problemCount: "5 Core Problems",
    description:
      "Master first-in-first-out ordering with circular buffers, monotonic deques, and streaming frequency tracking.",
    topics: [
      "Queue using Stacks",
      "Moving Average",
      "First Unique Character",
      "Sliding Window Maximum",
      "Circular Queue",
    ],
    link: "/curriculum/dsa/queue",
    linkText: "Explore Queue Guide",
    icon: "🚋",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Buffers & Streaming",
    },
  },
  {
    id: "trees",
    title: "Binary Trees & BSTs",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Hard",
    rating: 4.97,
    ratingCount: 2150,
    problemCount: "8 Core Topics",
    description:
      "Start from tree shapes, then master depth-first and breadth-first walks over binary trees — explicit stacks and level orders.",
    topics: [
      "Types of Trees",
      "DFS & BFS",
      "Inorder Traversal",
      "Maximum Depth",
      "Level Order",
      "Validate BST",
    ],
    link: "/curriculum/dsa/trees",
    linkText: "Explore Trees Guide",
    icon: "🌲",
    image:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Hierarchical Structures",
    },
  },
  {
    id: "graphs",
    title: "Graphs & Traversals",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Hard",
    rating: 4.96,
    ratingCount: 1980,
    problemCount: "7 Core Topics",
    description:
      "Trees without the guarantees: cycles, one-way edges and unreachable corners. Visited sets, topological sort, and Dijkstra.",
    topics: [
      "Graph Types",
      "DFS & BFS",
      "Cycle Detection",
      "Topological Sort",
      "Components",
      "Dijkstra",
    ],
    link: "/curriculum/dsa/graphs",
    linkText: "Explore Graphs Guide",
    icon: "🕸️",
    image:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Network Traversals",
    },
  },
  {
    id: "linked-list",
    title: "Linked Lists Mastery",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Medium",
    rating: 4.89,
    ratingCount: 1340,
    problemCount: "6 Core Problems",
    description:
      "Master pointer manipulation with in-place reversal, slow/fast pointers, and single-pass merging.",
    topics: [
      "Reverse Linked List",
      "Cycle Detection",
      "Merge Sorted Lists",
      "Remove Nth Node",
      "Palindrome List",
    ],
    link: "/curriculum/dsa/linked-list",
    linkText: "Explore Linked List Guide",
    icon: "🔗",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Pointer References",
    },
  },
  {
    id: "dp-1d",
    title: "1D Dynamic Programming",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Hard",
    rating: 4.94,
    ratingCount: 1670,
    problemCount: "5 Core Problems",
    description:
      "Master tabulation over a single running index — recursion with overlapping subproblems collapsed into array fills.",
    topics: [
      "House Robber",
      "Max Subarray",
      "Coin Change",
      "Longest Inc Subsequence",
      "Decode Ways",
    ],
    link: "/curriculum/dsa/dp-1d",
    linkText: "Explore 1D DP Guide",
    icon: "📊",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Optimal Substructure",
    },
  },
  {
    id: "dp-2d",
    title: "2D Dynamic Programming",
    track: "dsa",
    trackLabel: "Data Structures & Algorithms",
    difficulty: "Hard",
    rating: 4.93,
    ratingCount: 1420,
    problemCount: "5 Core Problems",
    description:
      "Master grid-walk and sequence-pair recurrences — two indices, one table, filled once.",
    topics: [
      "Unique Paths",
      "Min Path Sum",
      "Longest Common Subsequence",
      "Edit Distance",
      "0/1 Knapsack",
    ],
    link: "/curriculum/dsa/dp-2d",
    linkText: "Explore 2D DP Guide",
    icon: "🧮",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Matrix & Sequences",
    },
  },

  // CS & Software Engineering Track
  {
    id: "oops",
    title: "Java OOPs Concepts",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Beginner",
    rating: 4.98,
    ratingCount: 2400,
    problemCount: "12 Topics",
    description:
      "Master classes, objects, and the four pillars — encapsulation, abstraction, inheritance, and polymorphism.",
    topics: [
      "Encapsulation",
      "Abstraction",
      "Inheritance Types",
      "Overloading vs Overriding",
      "Access Modifiers",
    ],
    link: "/curriculum/dsa/oops",
    linkText: "Explore Java OOPs Guide",
    icon: "☕",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Marcus Vance",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Object-Oriented Design",
    },
  },
  {
    id: "oops-visual",
    title: "OOPs Visual Blueprint",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Easy",
    rating: 4.91,
    ratingCount: 1650,
    problemCount: "6 Topics",
    description:
      "A diagram-first companion to Java OOPs — class/object blueprints, the ATM encapsulation metaphor, and all 5 inheritance types.",
    topics: [
      "Class vs Object",
      "Encapsulation",
      "Abstraction",
      "5 Inheritance Types",
      "Polymorphism",
    ],
    link: "/curriculum/dsa/oops-visual",
    linkText: "Explore OOPs Visual Guide",
    icon: "🧩",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Software Architecture",
    },
  },
  {
    id: "sql",
    title: "SQL & Relational Databases",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Medium",
    rating: 4.95,
    ratingCount: 2100,
    problemCount: "22 Topics",
    description:
      "Data types, ACID, normalization and query execution order, plus a live SQL engine that runs joins and window functions.",
    topics: [
      "ACID Properties",
      "Normalization",
      "Types of Join",
      "Window Functions",
      "Subqueries",
      "Query Lab",
    ],
    link: "/curriculum/dsa/sql",
    linkText: "Explore SQL Guide",
    icon: "🗄️",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "David Kim",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Databases & Storage",
    },
  },
  {
    id: "sdlc",
    title: "SDLC & Engineering Process",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Beginner",
    rating: 4.87,
    ratingCount: 890,
    problemCount: "6 Topics",
    description:
      "Master the Software Development Life Cycle — its six phases, and the Waterfall, Agile, V-Model, and Spiral process models.",
    topics: [
      "6 SDLC Phases",
      "Waterfall Model",
      "Agile Methodology",
      "V-Model",
      "Spiral Model",
    ],
    link: "/curriculum/dsa/sdlc",
    linkText: "Explore SDLC Guide",
    icon: "🔁",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Engineering Management",
    },
  },
  {
    id: "api-basics",
    title: "API Design & Architecture",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Beginner",
    rating: 4.9,
    ratingCount: 1450,
    problemCount: "8 Topics",
    description:
      "Understand what APIs are, how REST and GraphQL work, how to connect from the frontend, and how to securely handle API keys.",
    topics: [
      "REST APIs",
      "Frontend Fetching",
      "API Security",
      "Webhooks",
      "GraphQL",
    ],
    link: "/curriculum/dsa/api-basics",
    linkText: "Explore API Basics",
    icon: "🔌",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Marcus Vance",
      avatar:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Web & Networking",
    },
  },
  {
    id: "flask-api-guide",
    title: "Flask + JS API Integration",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Medium",
    rating: 4.89,
    ratingCount: 920,
    problemCount: "Template Flow",
    description:
      "Learn the complete execution flow of how a frontend JavaScript application fetches data from a Python Flask backend.",
    topics: [
      "Architecture",
      "Execution Flow",
      "Fetch() API",
      "JSON Serialization",
    ],
    link: "/curriculum/dsa/flask-api-guide",
    linkText: "Explore Flask API Guide",
    icon: "🐍",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Full-Stack Python",
    },
  },
  {
    id: "django-react-guide",
    title: "Django + React Integration",
    track: "cs",
    trackLabel: "CS & Software Engineering",
    difficulty: "Medium",
    rating: 4.94,
    ratingCount: 1380,
    problemCount: "Full Stack Flow",
    description:
      "Learn the complete execution flow of how a modern React frontend fetches data from a robust Django backend (DRF).",
    topics: [
      "Architecture",
      "React Hooks",
      "Django Views",
      "CORS & Auth",
    ],
    link: "/curriculum/dsa/django-react-guide",
    linkText: "Explore Django + React Guide",
    icon: "🚀",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Alex Rivera",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Full-Stack Systems",
    },
  },

  // AI & Modern Tech Track
  {
    id: "ai-basics",
    title: "AI & Neural Tech Foundations",
    track: "ai",
    trackLabel: "AI & Modern Tech",
    difficulty: "Beginner",
    rating: 4.96,
    ratingCount: 2890,
    problemCount: "3 Topics",
    description:
      "A fast-paced primer on Artificial Intelligence, Machine Learning, and Deep Learning, including an interactive interview quiz.",
    topics: ["What is AI?", "AI vs ML vs DL", "Interactive Quiz"],
    link: "/curriculum/dsa/ai-basics",
    linkText: "Explore AI Basics",
    icon: "🤖",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    instructor: {
      name: "Elena Rostova",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
      category: "Artificial Intelligence",
    },
  },
];
