export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: string;
  status: "active" | "archived";
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  score: number;
  totalQuestions: number;
  submittedAt: string;
}
