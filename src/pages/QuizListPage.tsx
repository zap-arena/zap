import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";

interface QuizFromApi {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  questions: { id: string; text: string; options: string[] }[];
}

interface MySubmission {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  submitted_at: string;
}

export default function QuizListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: quizzes = [] } = useQuery<QuizFromApi[]>({
    queryKey: ["quizzes"],
    queryFn: () => api.get<QuizFromApi[]>("/quizzes"),
  });

  const { data: mySubmissions = [] } = useQuery<MySubmission[]>({
    queryKey: ["quiz-submissions-me"],
    queryFn: () => api.get<MySubmission[]>("/quizzes/submissions/me"),
    enabled: !!user,
  });

  const submittedQuizIds = new Set(mySubmissions.map((s) => s.quiz_id));

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
              const isCompleted = submittedQuizIds.has(quiz.id);
              const submission = mySubmissions.find((s) => s.quiz_id === quiz.id);

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
                          {submission?.score}{" "}
                          <span className="text-lg text-muted-foreground">
                            / {submission?.total_questions}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        >
                          View Report
                        </Button>
                      </>
                    ) : user ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/quizzes/${quiz.id}`)}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle size={16} /> Start Quiz
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2"
                      >
                        <Lock size={16} /> Login to Attempt
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
