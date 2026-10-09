import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

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

const ITEMS_PER_PAGE = 5;

export default function QuizListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"quizzes" | "puzzles">("quizzes");

  const { data: quizzesResponse, isLoading: isLoadingQuizzes } = useQuery<{
    data: QuizFromApi[];
    total: number;
  }>({
    queryKey: ["quizzes", currentPage, filter, category],
    queryFn: () =>
      api.get<{ data: QuizFromApi[]; total: number }>(
        `/quizzes?skip=${(currentPage - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}&filter=${filter}&category=${category}`,
      ),
  });

  const quizzes = quizzesResponse?.data || [];
  const totalQuizzes = quizzesResponse?.total || 0;

  const { data: mySubmissions = [], isLoading: isLoadingSubmissions } =
    useQuery<MySubmission[]>({
      queryKey: ["quiz-submissions-me"],
      queryFn: () => api.get<MySubmission[]>("/quizzes/submissions/me"),
      enabled: !!user,
    });

  const isLoading = isLoadingQuizzes || (!!user && isLoadingSubmissions);
  const submittedQuizIds = new Set(mySubmissions.map((s) => s.quiz_id));

  // Pagination calculation
  const totalPages = Math.ceil(totalQuizzes / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Assessments</h1>
            <p className="text-muted-foreground text-lg">
              Test your knowledge with quizzes and interactive puzzles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex bg-card border border-border rounded-lg p-1 shrink-0">
              <button
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "quizzes" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveTab("quizzes")}
              >
                Quizzes
              </button>
              <button
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "puzzles" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setActiveTab("puzzles")}
              >
                Puzzles
              </button>
            </div>

            {user && activeTab === "quizzes" && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium text-muted-foreground">
                  Filter:
                </span>
                <select
                  className="bg-card border border-border text-foreground text-sm rounded-md focus:ring-primary focus:border-primary block p-2 outline-none"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Not Completed</option>
                </select>
              </div>
            )}

            {activeTab === "quizzes" && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-medium text-muted-foreground">
                  Category:
                </span>
                <select
                  className="bg-card border border-border text-foreground text-sm rounded-md focus:ring-primary focus:border-primary block p-2 outline-none"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Coding">Coding</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI">AI</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {activeTab === "quizzes" && (
          <>
            <div className="grid gap-6">
              {isLoading ? (
                // Skeleton Loader (5 cards matching 5 quizzes per page limit)
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-border bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse"
                  >
                    <div className="w-full sm:w-2/3 space-y-3">
                      <div className="h-6 bg-muted rounded-md w-1/3"></div>
                      <div className="h-4 bg-muted rounded-md w-3/4"></div>
                      <div className="h-4 bg-muted rounded-md w-1/4"></div>
                    </div>
                    <div className="h-10 bg-muted rounded-lg w-28 shrink-0"></div>
                  </div>
                ))
              ) : quizzes.length === 0 ? (
                <div className="text-center p-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">
                    No quizzes found for the selected filter.
                  </p>
                </div>
              ) : (
                quizzes.map((quiz) => {
                  const isCompleted = submittedQuizIds.has(quiz.id);
                  const submission = mySubmissions.find(
                    (s) => s.quiz_id === quiz.id,
                  );

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

            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-foreground">
                    {Math.min(startIndex + ITEMS_PER_PAGE, totalQuizzes)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalQuizzes}
                  </span>{" "}
                  quizzes
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft size={16} /> Previous
                  </Button>
                  <div className="text-sm font-medium px-2">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "puzzles" && (
          <div className="grid gap-6">
            {/* SQL Workflow & Concept Quest */}
            {(() => {
              const sqlSubmission = mySubmissions.find(
                (s) => s.quiz_id === "sql-workflow-puzzle",
              );
              const isSqlCompleted = !!sqlSubmission;

              return (
                <div
                  className={`p-6 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    isSqlCompleted
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:border-emerald-500/50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Database size={22} />
                        <h3 className="text-xl font-bold text-foreground">
                          SQL Query Workflow & Concept Quest
                        </h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        New
                      </span>
                      {isSqlCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                      Master database execution pipelines from simple to advanced queries via drag-and-drop sequencing, plus interactive Left-to-Right Concept Connector games!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                        <Sparkles size={12} className="text-amber-400" /> 7 Progressive Workflows
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                        🎮 Left-to-Right Matching Mini-Games
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                        ⚡ Simple to Advanced (ACID, Window, Joins)
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {isSqlCompleted ? (
                      <>
                        <div className="text-2xl font-black text-primary">
                          {sqlSubmission.score}{" "}
                          <span className="text-lg text-muted-foreground">
                            / {sqlSubmission.total_questions}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/sql-workflow`)}
                        >
                          Play Again
                        </Button>
                      </>
                    ) : user ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/quizzes/sql-workflow`)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <PlayCircle size={16} /> Start SQL Puzzle
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2"
                      >
                        <Lock size={16} /> Login to Play
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* AI Workflow Puzzle */}
            {(() => {
              const puzzleSubmission = mySubmissions.find(
                (s) => s.quiz_id === "workflow-puzzle",
              );
              const isCompleted = !!puzzleSubmission;

              return (
                <div
                  className={`p-6 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    isCompleted
                      ? "bg-primary/5 border-primary/20"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">AI Workflow Puzzle</h3>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm">
                      Rebuild AI workflows by dragging and dropping components.
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {isCompleted ? (
                      <>
                        <div className="text-2xl font-black text-primary">
                          {puzzleSubmission.score}{" "}
                          <span className="text-lg text-muted-foreground">
                            / {puzzleSubmission.total_questions}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/workflow-puzzle`)}
                        >
                          Play Again
                        </Button>
                      </>
                    ) : user ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/quizzes/workflow-puzzle`)}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle size={16} /> Start Puzzle
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2"
                      >
                        <Lock size={16} /> Login to Play
                      </Button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
