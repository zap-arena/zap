import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quiz";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function QuizTakingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, getSubmission, addSubmission } = useQuizStore();
  const { user } = useAuth();

  const quiz = quizzes.find((q) => q.id === id);
  const existingSubmission =
    user && quiz ? getSubmission(quiz.id, user.id) : null;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showAnswerForCurrent, setShowAnswerForCurrent] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to take quizzes");
      navigate("/login");
    } else if (!quiz) {
      toast.error("Quiz not found");
      navigate("/quizzes");
    }
  }, [user, quiz, navigate]);

  if (!quiz || !user) return null;

  const isCompleted = !!existingSubmission;

  // If completed, just show report mode
  if (isCompleted) {
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

          <div className="bg-card border rounded-xl p-8 text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{quiz.title} - Report</h1>
            <div className="text-5xl font-black text-primary mt-6 mb-2">
              {submission.score}{" "}
              <span className="text-3xl text-muted-foreground">
                / {submission.totalQuestions}
              </span>
            </div>
            <p className="text-muted-foreground">Your Score</p>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, idx) => {
              const userAnswer = submission.answers[q.id];
              const isCorrect = userAnswer === q.correctOptionIndex;
              return (
                <div
                  key={q.id}
                  className={`p-6 rounded-xl border ${isCorrect ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"}`}
                >
                  <div className="flex gap-3 mb-4">
                    <div className="mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="text-primary w-6 h-6" />
                      ) : (
                        <XCircle className="text-destructive w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Q{idx + 1}. {q.text}
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-3 ml-9">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = userAnswer === oIdx;
                      const isActualCorrect = q.correctOptionIndex === oIdx;

                      let bgClass = "bg-card border-border";
                      if (isActualCorrect)
                        bgClass =
                          "bg-primary/20 border-primary text-foreground font-medium";
                      else if (isSelected && !isCorrect)
                        bgClass =
                          "bg-destructive/20 border-destructive text-foreground";

                      return (
                        <div
                          key={oIdx}
                          className={`p-4 rounded-lg border ${bgClass}`}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-6 ml-9 p-4 bg-card border rounded-lg">
                      <p className="text-sm font-semibold mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">
                        {q.explanation}
                      </p>
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
      // Submit
      let score = 0;
      quiz.questions.forEach((q: any) => {
        if (answers[q.id] === q.correctOptionIndex) score++;
      });

      addSubmission({
        id: uuidv4(),
        quizId: quiz.id,
        userId: user.id,
        answers,
        score,
        totalQuestions: quiz.questions.length,
        submittedAt: new Date().toISOString(),
      });
      toast.success("Quiz completed!");
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
          <h2 className="text-2xl font-bold mb-8">{question?.text}</h2>

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
                else btnClass = "border-border bg-card opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showAnswerForCurrent}
                  className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${btnClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showAnswerForCurrent && isCorrect && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    {showAnswerForCurrent && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswerForCurrent && question?.explanation && (
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in slide-in-from-bottom-4">
              <h4 className="font-bold text-primary mb-2">Explanation</h4>
              <p className="text-foreground/80 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t flex justify-end">
          <Button
            size="lg"
            className="w-full sm:w-auto px-12"
            disabled={!showAnswerForCurrent}
            onClick={handleNext}
          >
            {isLastQuestion ? "Submit Quiz" : "Next Question"}{" "}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
