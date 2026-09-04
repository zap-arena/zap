export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Language = "c" | "cpp" | "java" | "python";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  marks: number;
}

export interface Boilerplate {
  language: Language;
  code: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  tags: string[];
  languages: Language[];
  boilerplates: Record<string, string>;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
  maxScore: number;
  status: "active" | "archived";
  createdAt: string;
  isProgressive?: boolean;
  stages?: ProblemStage[];
  currentStageOrder?: number;
  totalStages?: number;
}

export interface ProblemStage {
  id: string;
  stageOrder: number;
  title: string;
  statement?: string;
  expectedComplexity?: string | null;
  timeLimit?: number | null;
  memoryLimit?: number | null;
  maxScore?: number;
  testCases?: TestCase[];
  locked: boolean;
}

export type ContestStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled";

export interface ContestProblem {
  problemId: string;
  order: number;
  maxScore: number;
  title?: string;
  difficulty?: Difficulty;
}

export interface ContestModerator {
  userId: string;
  name: string | null;
  email: string | null;
}

export interface Contest {
  id: string;
  name: string;
  slug: string;
  description: string;
  instructions: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: ContestStatus;
  problems: ContestProblem[];
  /** Always present; `problems` is empty on public endpoints that hide the problem list. */
  problemCount: number;
  maxScore: number;
  moderators: ContestModerator[];
  scoringMode: "full" | "partial";
  mode?: "standard" | "progressive";
  leaderboardVisible: boolean;
  createdAt: string;
}

export type Verdict =
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "PARTIAL"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR"
  | "QUEUED"
  | "RUNNING";

export interface Submission {
  id: string;
  contestId: string;
  problemId: string;
  stageId?: string | null;
  problemTitle: string;
  userId: string;
  language: Language;
  sourceCode: string;
  status: Verdict;
  passedTests: number;
  totalTests: number;
  score: number;
  executionTime: number;
  memoryUsage: number;
  submittedAt: string;
  compileOutput?: string;
  isLate?: boolean;
}

export type ParticipantStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "auto_completed";

export interface Participant {
  id: string;
  contestId: string;
  userId: string;
  userName: string;
  userEmail: string;
  joinedAt: string;
  startedAt?: string;
  expiresAt?: string;
  completedAt?: string;
  status: ParticipantStatus;
  score: number;
  problemsSolved: number;
  totalSubmissions: number;
  rank?: number;
  duration?: string;
}

export interface ExecutionLog {
  id: string;
  submissionId: string;
  userId: string;
  userName: string;
  problemTitle: string;
  language: Language;
  status: Verdict;
  executionDuration: number;
  passedTests: number;
  failedTests: number;
  errorType?: string;
  createdAt: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTime: number;
  memoryUsage: number;
  exitCode: number;
  status: "success" | "compile_error" | "runtime_error" | "timeout";
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  solved: number;
  totalProblems: number;
  submissions: number;
  completionTime: string;
}

// ---------- Progressive ("Code War") analytics ----------
export type BehaviorPattern =
  | "optimal_from_start"
  | "brute_then_optimized"
  | "shortcut_then_rework"
  | "struggling";

export interface StageAnalytics {
  stageId: string;
  stageOrder: number;
  solved: boolean;
  attempts: number;
  runs: number;
  errorsSeen: string[];
  errorsResolved: number;
  timeToSolveSeconds: number | null;
  codeChurn: number;
  crossStageRewrite: number | null;
  complexity: {
    label: string;
    confidence: "high" | "low";
    empirical: string | null;
    static: string;
  } | null;
  expectedComplexity: string | null;
  submissions?: {
    id: string;
    status: Verdict;
    submittedAt: string;
    language: Language;
  }[];
}

export interface ChainAnalytics {
  problemId: string;
  problemTitle: string;
  pattern: BehaviorPattern;
  behaviorScore: number;
  stages: StageAnalytics[];
}

export interface ParticipantAnalytics {
  userId: string;
  userName: string;
  chains: ChainAnalytics[];
}
