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
  isPremium?: boolean;
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
    c?: string;
  };
  isProgressive?: boolean;
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
  "Trees",
  "Graphs & Matrices",
  "Strings",
] as const;

export function adaptApiProblem(p: any): ProblemItem {
  const tags: string[] = Array.isArray(p.tags) ? p.tags : [];
  let category = "Arrays & Hashing";
  const tagLower = tags.map((t: string) => String(t).toLowerCase());

  if (tagLower.some((t) => t.includes("array") || t.includes("hash"))) {
    category = "Arrays & Hashing";
  } else if (
    tagLower.some((t) => t.includes("two-pointer") || t.includes("pointer"))
  ) {
    category = "Two Pointers";
  } else if (
    tagLower.some((t) => t.includes("sliding") || t.includes("window"))
  ) {
    category = "Sliding Window";
  } else if (tagLower.some((t) => t.includes("stack"))) {
    category = "Stack";
  } else if (
    tagLower.some((t) => t.includes("binary-search") || t.includes("search"))
  ) {
    category = "Binary Search";
  } else if (tagLower.some((t) => t.includes("dynamic") || t.includes("dp"))) {
    category = "Dynamic Programming";
  } else if (tagLower.some((t) => t.includes("math") || t.includes("number"))) {
    category = "Math & Number Theory";
  } else if (tagLower.some((t) => t.includes("tree"))) {
    category = "Trees";
  } else if (
    tagLower.some(
      (t) =>
        t.includes("graph") ||
        t.includes("matrix") ||
        t.includes("bfs") ||
        t.includes("dfs"),
    )
  ) {
    category = "Graphs & Matrices";
  } else if (tagLower.some((t) => t.includes("string"))) {
    category = "Strings";
  } else if (tags.length > 0) {
    category = tags[0]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const defaultRate =
    p.difficulty === "Easy"
      ? "68.4%"
      : p.difficulty === "Hard"
        ? "32.1%"
        : "49.6%";

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    difficulty: (p.difficulty || "Easy") as "Easy" | "Medium" | "Hard",
    category,
    tags: tags.map((t: string) =>
      String(t)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    ),
    points: p.maxScore || 100,
    acceptanceRate: p.acceptanceRate || defaultRate,
    isPremium: p.difficulty === "Hard" || tagLower.includes("premium"),
    description: p.description || "",
    inputFormat: p.inputFormat || "",
    outputFormat: p.outputFormat || "",
    constraints: p.constraints || "",
    examples: Array.isArray(p.examples) ? p.examples : [],
    testCases: (Array.isArray(p.testCases) ? p.testCases : []).map(
      (tc: any) => ({
        id: tc.id || `tc_${Math.random()}`,
        name: tc.name || "Test Case",
        input: tc.input || "",
        expectedOutput: tc.expectedOutput || "",
        hidden: Boolean(tc.hidden),
        marks: tc.marks,
      }),
    ),
    boilerplates: {
      python: p.boilerplates?.python || "",
      cpp: p.boilerplates?.cpp || "",
      java: p.boilerplates?.java || "",
      c: p.boilerplates?.c || "",
    },
    isProgressive: Boolean(p.isProgressive),
  };
}
