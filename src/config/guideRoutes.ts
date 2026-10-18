// Guide route configuration
export const GUIDE_ROUTES = [
  {
    slug: "sql",
    name: "SQL Fundamentals",
    description: "Master SQL queries, joins, and database optimization.",
  },
  {
    slug: "ai-basics",
    name: "AI Basics",
    description: "Understand fundamental AI concepts and machine learning.",
  },
  {
    slug: "api-basics",
    name: "API Basics",
    description: "Learn REST APIs, HTTP methods, and API design patterns.",
  },
  {
    slug: "oops",
    name: "Object-Oriented Programming",
    description: "Master OOP concepts: classes, inheritance, polymorphism.",
  },
  {
    slug: "oops-visual",
    name: "OOP Visual Guide",
    description: "Visual guide to OOP with interactive diagrams.",
  },
  {
    slug: "django-react-guide",
    name: "Django + React Integration",
    description: "Build full-stack apps with Django backend and React frontend.",
  },
  {
    slug: "flask-api-guide",
    name: "Flask + JavaScript API",
    description: "Learn Flask API development with JavaScript frontend.",
  },
  {
    slug: "sdlc",
    name: "Software Development Lifecycle",
    description: "Understand the complete SDLC from planning to deployment.",
  },
  {
    slug: "linked-list",
    name: "Linked Lists",
    description: "Master linked list operations and algorithms.",
  },
  {
    slug: "stack",
    name: "Stacks",
    description: "Learn stack data structure and its applications.",
  },
  {
    slug: "queue",
    name: "Queues",
    description: "Understand queues, deques, and priority queues.",
  },
  {
    slug: "trees",
    name: "Trees & Binary Search Trees",
    description: "Master tree traversals, BST operations, and tree algorithms.",
  },
  {
    slug: "graphs",
    name: "Graphs & Graph Algorithms",
    description: "Learn graph representation, DFS, BFS, and shortest paths.",
  },
  {
    slug: "hashing",
    name: "Hashing & Hash Maps",
    description: "Understand hash functions, collision handling, and hash tables.",
  },
  {
    slug: "two-pointer",
    name: "Two Pointer Technique",
    description: "Master the two-pointer pattern for array problems.",
  },
  {
    slug: "sliding-window",
    name: "Sliding Window Technique",
    description: "Learn sliding window pattern for optimal subarray solutions.",
  },
  {
    slug: "recursion",
    name: "Recursion & Backtracking",
    description: "Master recursion, backtracking, and recursive problem solving.",
  },
  {
    slug: "dp-1d",
    name: "Dynamic Programming (1D)",
    description: "Learn 1D DP problems: fibonacci, climbing stairs, coins.",
  },
  {
    slug: "dp-2d",
    name: "Dynamic Programming (2D)",
    description: "Master 2D DP: knapsack, matrix chain, longest common subsequence.",
  },
];

export function getGuideBySlug(slug: string) {
  return GUIDE_ROUTES.find((guide) => guide.slug === slug);
}
