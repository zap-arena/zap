import { useEffect, useState } from "react";
import type { ProblemItem } from "../data/problems";

export type SubmissionVerdict =
  | "Accepted"
  | "Wrong Answer"
  | "Compile Error"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Error";

export interface ProblemSubmission {
  id: string;
  problemSlug: string;
  problemTitle: string;
  language: "python" | "cpp" | "java";
  code: string;
  verdict: SubmissionVerdict;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  timestamp: number;
  errorMessage?: string;
  failedTestCase?: {
    testCaseNumber: number;
    input?: string;
    expectedOutput?: string;
    actualOutput?: string;
    hidden?: boolean;
  };
}

export interface UserProblemStats {
  solvedSlugs: string[];
  attemptedSlugs: string[];
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  totalSubmissions: number;
  acceptanceRate: string;
}

const SUBMISSIONS_STORAGE_KEY = "zap_problem_submissions";
const SOLVED_STORAGE_KEY = "zap_solved_problems";
const UPDATE_EVENT_KEY = "zap-problem-submissions-updated";

// Helper: safe JSON parse
function safeParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    return fallback;
  }
}

// Retrieve all submissions
export function getAllSubmissions(): ProblemSubmission[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
  const items = safeParse<ProblemSubmission[]>(raw, []);
  return items.sort((a, b) => b.timestamp - a.timestamp);
}

// Retrieve submissions for a specific problem
export function getSubmissionsForProblem(slug: string): ProblemSubmission[] {
  return getAllSubmissions().filter((s) => s.problemSlug === slug);
}

// Check if a problem is solved
export function isProblemSolved(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(SOLVED_STORAGE_KEY);
  const solved = safeParse<string[]>(raw, []);
  return solved.includes(slug);
}

// Check if a problem has at least one submission
export function isProblemAttempted(slug: string): boolean {
  return getAllSubmissions().some((s) => s.problemSlug === slug);
}

// Retrieve list of solved problem slugs
export function getSolvedProblemSlugs(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(SOLVED_STORAGE_KEY);
  return safeParse<string[]>(raw, []);
}

// Save a new submission and update solved state if verdict is Accepted
export function saveSubmission(
  subData: Omit<ProblemSubmission, "id" | "timestamp">
): ProblemSubmission {
  const newSubmission: ProblemSubmission = {
    ...subData,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const all = getAllSubmissions();
  all.unshift(newSubmission);
  localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));

  if (newSubmission.verdict === "Accepted") {
    const solved = new Set(getSolvedProblemSlugs());
    solved.add(newSubmission.problemSlug);
    localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(Array.from(solved)));
  }

  // Dispatch custom window event for reactive UI updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_KEY, { detail: newSubmission }));
  }

  return newSubmission;
}

// Calculate comprehensive user stats across problem set
export function calculateUserStats(allProblems: ProblemItem[]): UserProblemStats {
  const solvedSlugs = getSolvedProblemSlugs();
  const allSubs = getAllSubmissions();

  const attemptedSlugs = Array.from(
    new Set(allSubs.map((s) => s.problemSlug))
  );

  let easySolved = 0;
  let mediumSolved = 0;
  let hardSolved = 0;
  let totalPoints = 0;

  allProblems.forEach((prob) => {
    if (solvedSlugs.includes(prob.slug)) {
      if (prob.difficulty === "Easy") easySolved++;
      else if (prob.difficulty === "Medium") mediumSolved++;
      else if (prob.difficulty === "Hard") hardSolved++;
      totalPoints += prob.points || 0;
    }
  });

  const acceptedSubs = allSubs.filter((s) => s.verdict === "Accepted").length;
  const acceptanceRate =
    allSubs.length > 0
      ? `${Math.round((acceptedSubs / allSubs.length) * 100)}%`
      : "0%";

  return {
    solvedSlugs,
    attemptedSlugs,
    totalSolved: solvedSlugs.length,
    easySolved,
    mediumSolved,
    hardSolved,
    totalPoints,
    totalSubmissions: allSubs.length,
    acceptanceRate,
  };
}

// Draft code management
export function getSavedCode(slug: string, language: string, defaultCode: string): string {
  if (typeof window === "undefined") return defaultCode;
  const key = `zap_code_${slug}_${language}`;
  return localStorage.getItem(key) || defaultCode;
}

export function saveDraftCode(slug: string, language: string, code: string): void {
  if (typeof window === "undefined") return;
  const key = `zap_code_${slug}_${language}`;
  localStorage.setItem(key, code);
}

export function resetDraftCode(slug: string, language: string): void {
  if (typeof window === "undefined") return;
  const key = `zap_code_${slug}_${language}`;
  localStorage.removeItem(key);
}

// React Hook to track progress live
export function useProblemProgress(allProblems: ProblemItem[]) {
  const [stats, setStats] = useState<UserProblemStats>(() =>
    calculateUserStats(allProblems)
  );

  useEffect(() => {
    const handleUpdate = () => {
      setStats(calculateUserStats(allProblems));
    };

    window.addEventListener(UPDATE_EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [allProblems]);

  return stats;
}
