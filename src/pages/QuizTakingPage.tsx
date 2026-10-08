import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { FormattedText } from "../components/FormattedText";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

interface QuizDetail {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface Submission {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: Record<string, number>;
  submitted_at: string;
}

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
}

export default function QuizTakingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showAnswerForCurrent, setShowAnswerForCurrent] = useState(false);

  const queryClient = useQueryClient();

  const { data: quiz, isLoading: quizLoading } = useQuery<QuizDetail>({
    queryKey: ["quiz", id],
    queryFn: () => api.get<QuizDetail>(`/quizzes/${id}`),
    enabled: !!id,
  });

  const { data: existingSubmission } = useQuery<Submission>({
    queryKey: ["quiz-submission", id],
    queryFn: () => api.get<Submission>(`/quizzes/${id}/submissions/me`),
    enabled: !!id && !!user,
    retry: false,
  });

  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ["quiz-leaderboard", id],
    queryFn: () => api.get<LeaderboardEntry[]>(`/quizzes/${id}/leaderboard`),
    enabled: !!id && !!existingSubmission,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: object) =>
      api.post<Submission>(`/quizzes/${id}/submit`, payload),
    onSuccess: () => {
      toast.success("Quiz completed!");
      // Invalidate queries so the report shows without a full page reload
      queryClient.invalidateQueries({ queryKey: ["quiz-submission", id] });
      queryClient.invalidateQueries({ queryKey: ["quiz-leaderboard", id] });
      queryClient.invalidateQueries({ queryKey: ["quiz-submissions-me"] });
    },
    onError: (err: any) => {
      if (err?.status === 409) {
        toast.error("You have already submitted this quiz.");
        queryClient.invalidateQueries({ queryKey: ["quiz-submission", id] });
      } else {
        toast.error("Failed to submit quiz. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (!user) {
      toast.error("Please login to take quizzes");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!quizLoading && !quiz) {
      toast.error("Quiz not found");
      navigate("/quizzes");
    }
  }, [quiz, quizLoading, navigate]);

  if (!user || quizLoading) return null;
  if (!quiz) return null;

  // If already submitted, show report
  if (existingSubmission) {
    const submission = existingSubmission;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl w-full mx-auto p-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/quizzes")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
          </Button>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2 bg-card border rounded-xl p-8 text-center flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-2">{quiz.title} - Report</h1>
              <div className="text-5xl font-black text-primary mt-6 mb-2">
                {submission.score}{" "}
                <span className="text-3xl text-muted-foreground">
                  / {submission.total_questions}
                </span>
              </div>
              <p className="text-muted-foreground font-medium text-lg">
                {Math.round(
                  (submission.score / submission.total_questions) * 100,
                )}
                % correct
              </p>
            </div>

            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                🏆 Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboard?.length ? (
                  leaderboard.map((entry, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.userId === user.id
                          ? "bg-primary/10 border-primary/30"
                          : "bg-background border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-muted-foreground w-4 text-center">
                          {idx + 1}
                        </span>
                        <span className="font-medium truncate max-w-[120px]">
                          {entry.userId === user.id ? "You" : entry.userName}
                        </span>
                      </div>
                      <div className="font-bold text-primary">
                        {entry.score}{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          / {entry.totalQuestions}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No scores yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {quiz.questions.map((q, idx) => {
              const userAnswer = submission.answers[q.id];
              const isCorrect = userAnswer === q.correctOptionIndex;
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border ${isCorrect ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle2
                        className="text-primary mt-0.5 shrink-0"
                        size={20}
                      />
                    ) : (
                      <XCircle
                        className="text-destructive mt-0.5 shrink-0"
                        size={20}
                      />
                    )}
                    <div className="font-semibold text-lg flex-1">
                      <span className="mr-2">{idx + 1}.</span>
                      <FormattedText text={q.text} />
                    </div>
                  </div>
                  <div className="grid gap-2 ml-8">
                    {q.options.map((opt, optIdx) => {
                      let cls = "p-3 rounded-lg border text-sm ";
                      if (optIdx === q.correctOptionIndex)
                        cls +=
                          "border-primary bg-primary/10 text-primary font-semibold";
                      else if (optIdx === userAnswer && !isCorrect)
                        cls +=
                          "border-destructive bg-destructive/10 text-destructive";
                      else cls += "border-border bg-card";
                      return (
                        <div key={optIdx} className={cls}>
                          <FormattedText text={opt} />
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="ml-8 mt-3 text-sm text-muted-foreground italic">
                      <span className="font-semibold not-italic">
                        💡 Explanation:
                      </span>
                      <FormattedText text={q.explanation} className="mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quiz.questions.length - 1;

  const handleSelectOption = (idx: number) => {
    if (showAnswerForCurrent) return;
    setAnswers((prev) => ({ ...prev, [question.id]: idx }));
    setShowAnswerForCurrent(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      let score = 0;
      quiz.questions.forEach((q) => {
        if (answers[q.id] === q.correctOptionIndex) score++;
      });
      submitMutation.mutate({
        id: uuidv4(),
        answers,
        score,
        totalQuestions: quiz.questions.length,
      });
    } else {
      setCurrentQuestionIdx((prev) => prev + 1);
      setShowAnswerForCurrent(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-3xl w-full mx-auto p-8 flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
            <span>{quiz.title}</span>
            <span>
              Question {currentQuestionIdx + 1} of {quiz.questions.length}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${(currentQuestionIdx / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-2xl font-bold mb-8">
            <FormattedText text={question?.text || ""} />
          </div>

          <div className="grid gap-4">
            {question?.options.map((opt: string, idx: number) => {
              const isSelected = answers[question.id] === idx;
              const isCorrect = question.correctOptionIndex === idx;

              let btnClass = "border-border hover:border-primary/50 bg-card";
              if (showAnswerForCurrent) {
                if (isCorrect)
                  btnClass =
                    "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary";
                else if (isSelected)
                  btnClass =
                    "border-destructive bg-destructive/10 text-destructive font-semibold";
              } else if (isSelected) {
                btnClass = "border-primary bg-primary/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showAnswerForCurrent}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${btnClass}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-medium text-muted-foreground shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <div className="flex-1">
                      <FormattedText text={opt} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswerForCurrent && question?.explanation && (
            <div className="mt-6 p-4 bg-card border border-border rounded-xl text-sm text-muted-foreground">
              <span className="font-semibold">💡 Explanation:</span>
              <FormattedText text={question.explanation} className="mt-2" />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!showAnswerForCurrent || submitMutation.isPending}
            className="flex items-center gap-2"
          >
            {isLastQuestion ? "Submit Quiz" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
