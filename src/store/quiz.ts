import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Quiz, QuizSubmission } from "../types/quiz";

interface QuizState {
  quizzes: Quiz[];
  submissions: QuizSubmission[];
  addQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  addSubmission: (submission: QuizSubmission) => void;
  getSubmission: (quizId: string, userId: string) => QuizSubmission | undefined;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set: any, get: any) => ({
      quizzes: [],
      submissions: [],
      addQuiz: (quiz: Quiz) =>
        set((state: QuizState) => ({ quizzes: [...state.quizzes, quiz] })),
      deleteQuiz: (id: string) =>
        set((state: QuizState) => ({
          quizzes: state.quizzes.filter((q: Quiz) => q.id !== id),
        })),
      addSubmission: (submission: QuizSubmission) =>
        set((state: QuizState) => ({
          submissions: [...state.submissions, submission],
        })),
      getSubmission: (quizId: string, userId: string) =>
        get().submissions.find(
          (s: QuizSubmission) => s.quizId === quizId && s.userId === userId,
        ),
    }),
    {
      name: "zap-quizzes",
    },
  ) as any,
);
