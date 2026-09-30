
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../store/quiz";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";

export default function QuizListPage() {
  const { quizzes, getSubmission } = useQuizStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-2">Daily Quizzes</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Test your knowledge with bite-sized daily assessments.
        </p>

        <div className="grid gap-6">
          {quizzes.length === 0 ? (
            <div className="text-center p-12 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">
                No quizzes available yet. Check back later!
              </p>
            </div>
          ) : (
            quizzes.map((quiz) => {
              const submission = user
                ? getSubmission(quiz.id, user.id)
                : undefined;
              const isCompleted = !!submission;

              return (
                <div
                  key={quiz.id}
                  className={`p-6 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${isCompleted ? "bg-primary/5 border-primary/20" : "bg-card border-border hover:border-primary/50"}`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{quiz.title}</h3>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">
                      {quiz.description}
                    </p>
                    <div className="text-sm font-medium text-foreground/70">
                      {quiz.questions.length} Questions
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {isCompleted ? (
                      <>
                        <div className="text-2xl font-black text-primary">
                          {submission.score}{" "}
                          <span className="text-lg text-muted-foreground font-medium">
                            / {submission.totalQuestions}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        >
                          View Report
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          if (!user) navigate("/login");
                          else navigate(`/quizzes/${quiz.id}`);
                        }}
                      >
                        {user ? (
                          <>
                            <PlayCircle className="w-4 h-4 mr-2" /> Start Quiz
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" /> Login to Start
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
