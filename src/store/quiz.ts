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
    (set, get) => ({
      quizzes: [],
      submissions: [],
      addQuiz: (quiz) =>
        set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      deleteQuiz: (id) =>
        set((state) => ({ quizzes: state.quizzes.filter((q) => q.id !== id) })),
      addSubmission: (submission) =>
        set((state) => ({ submissions: [...state.submissions, submission] })),
      getSubmission: (quizId, userId) =>
        get().submissions.find(
          (s) => s.quizId === quizId && s.userId === userId,
        ),
    }),
    {
      name: "zap-quizzes",
    },
  ),
);
