import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Database,
  HelpCircle,
  Lock,
  PlayCircle,
  Sparkles,
  Timer,
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

  const getDifficultyBadge = (fullTitle: string) => {
    const parts = fullTitle.split(/\s+[—-]\s+/);
    if (parts.length > 1) {
      const mainTitle = parts[0];
      const level = parts[1].trim();
      const lower = level.toLowerCase();

      let badgeClass = "bg-primary/10 text-primary border-primary/20";
      if (lower === "beginner" || lower === "easy" || lower === "foundational") {
        badgeClass =
          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      } else if (
        lower === "intermediate" ||
        lower === "medium" ||
        lower === "inter"
      ) {
        badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
      } else if (
        lower === "advanced" ||
        lower === "hard" ||
        lower === "expert"
      ) {
        badgeClass = "bg-rose-500/10 text-rose-500 border-rose-500/20";
      }

      return { mainTitle, level, badgeClass };
    }
    return { mainTitle: fullTitle, level: null, badgeClass: "" };
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header & Controls matching starting layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-1.5">
              Assessments
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Test your knowledge with quizzes and interactive puzzles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Segmented Tab Pill */}
            <div className="flex bg-secondary/60 border border-border/80 rounded-xl p-1 shrink-0">
              <button
                type="button"
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "quizzes"
                    ? "bg-card text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("quizzes")}
              >
                Quizzes
              </button>
              <button
                type="button"
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "puzzles"
                    ? "bg-card text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab("puzzles")}
              >
                Puzzles
              </button>
            </div>

            {/* Filter Dropdown */}
            {user && activeTab === "quizzes" && (
              <div className="flex items-center gap-2 bg-card/80 border border-border/80 rounded-xl px-3 py-1.5 text-xs shadow-2xs shrink-0">
                <span className="font-semibold text-muted-foreground">Filter:</span>
                <select
                  className="bg-transparent text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
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

            {/* Category Dropdown */}
            {activeTab === "quizzes" && (
              <div className="flex items-center gap-2 bg-card/80 border border-border/80 rounded-xl px-3 py-1.5 text-xs shadow-2xs shrink-0">
                <span className="font-semibold text-muted-foreground">Category:</span>
                <select
                  className="bg-transparent text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
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

        {/* Quizzes List */}
        {activeTab === "quizzes" && (
          <>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse"
                  >
                    <div className="w-full sm:w-2/3 space-y-2.5">
                      <div className="h-5 bg-muted rounded-md w-1/3" />
                      <div className="h-4 bg-muted rounded-md w-3/4" />
                      <div className="h-3 bg-muted rounded-md w-1/4" />
                    </div>
                    <div className="h-9 bg-muted rounded-xl w-24 shrink-0" />
                  </div>
                ))
              ) : quizzes.length === 0 ? (
                <div className="text-center py-16 px-6 bg-card/50 rounded-2xl border border-dashed border-border/80">
                  <p className="text-sm text-muted-foreground">
                    No quizzes found for the selected filter.
                  </p>
                </div>
              ) : (
                quizzes.map((quiz) => {
                  const isCompleted = submittedQuizIds.has(quiz.id);
                  const submission = mySubmissions.find(
                    (s) => s.quiz_id === quiz.id,
                  );
                  const { mainTitle, level, badgeClass } = getDifficultyBadge(
                    quiz.title,
                  );
                  const estMinutes = Math.max(
                    2,
                    Math.round(quiz.questions.length * 1.2),
                  );

                  return (
                    <div
                      key={quiz.id}
                      className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 ${
                        isCompleted
                          ? "bg-card/90 border-emerald-500/30 hover:border-emerald-500/50"
                          : "bg-card/80 border-border/80 hover:border-primary/50 hover:bg-card"
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {/* Title & Level Badge */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3
                            onClick={() => navigate(`/quizzes/${quiz.id}`)}
                            className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer"
                          >
                            {mainTitle}
                          </h3>

                          {level && (
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shrink-0 ${badgeClass}`}
                            >
                              {level}
                            </span>
                          )}

                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25 shrink-0">
                              <CheckCircle2 size={12} /> Completed
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {quiz.description ||
                            "Test your understanding and master core concepts with interactive questions."}
                        </p>

                        {/* Metadata Row */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <HelpCircle size={13} className="text-primary/70" />
                            <span>{quiz.questions.length} Questions</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5 font-medium">
                            <Timer size={13} />
                            <span>~{estMinutes} mins</span>
                          </span>
                        </div>
                      </div>

                      {/* Right Action / Score */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                        {isCompleted ? (
                          <>
                            <div className="text-lg sm:text-2xl font-black text-emerald-500 flex items-baseline gap-1">
                              {submission?.score}
                              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                / {submission?.total_questions}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/quizzes/${quiz.id}`)}
                              className="rounded-xl border-border/80 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/40 font-semibold text-xs h-9 px-3.5 transition-colors"
                            >
                              View Report
                            </Button>
                          </>
                        ) : user ? (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/quizzes/${quiz.id}`)}
                            className="rounded-xl font-semibold text-xs h-9 px-4 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs transition-all"
                          >
                            <PlayCircle size={15} />
                            <span>Start Quiz</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="rounded-xl font-semibold text-xs h-9 px-3.5 gap-2 border-border/80 text-muted-foreground hover:text-foreground"
                          >
                            <Lock size={13} />
                            <span>Login to Attempt</span>
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
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-border/80">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Showing{" "}
                  <span className="font-bold text-foreground">
                    {startIndex + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-foreground">
                    {Math.min(startIndex + ITEMS_PER_PAGE, totalQuizzes)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-foreground">
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
                    className="rounded-xl border-border/80 text-xs font-semibold gap-1"
                  >
                    <ChevronLeft size={14} /> Previous
                  </Button>
                  <div className="text-xs font-mono font-bold px-2">
                    {currentPage} / {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-xl border-border/80 text-xs font-semibold gap-1"
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Puzzles Tab */}
        {activeTab === "puzzles" && (
          <div className="space-y-4">
            {/* SQL Workflow & Concept Quest */}
            {(() => {
              const sqlSubmission = mySubmissions.find(
                (s) => s.quiz_id === "sql-workflow-puzzle",
              );
              const isSqlCompleted = !!sqlSubmission;

              return (
                <div
                  className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 ${
                    isSqlCompleted
                      ? "bg-card/90 border-emerald-500/30 hover:border-emerald-500/50"
                      : "bg-card/80 border-border/80 hover:border-emerald-500/50 hover:bg-card"
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <Database size={20} />
                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                          SQL Query Workflow & Concept Quest
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Interactive
                      </span>
                      {isSqlCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/25">
                          <CheckCircle2 size={12} /> Mastered
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      Master database execution pipelines from simple to advanced queries via drag-and-drop clause sequencing, plus Left-to-Right Concept Connector matching games!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60 text-[11px] font-medium">
                        <Sparkles size={11} className="text-amber-500" /> 7 Progressive Workflows
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60 text-[11px] font-medium">
                        ACID & Join Pipelines
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    {isSqlCompleted ? (
                      <>
                        <div className="text-lg sm:text-2xl font-black text-emerald-500 flex items-baseline gap-1">
                          {sqlSubmission.score}{" "}
                          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                            / {sqlSubmission.total_questions}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/sql-workflow`)}
                          className="rounded-xl border-border/80 hover:bg-emerald-500/10 hover:text-emerald-500 font-semibold text-xs h-9 px-3.5"
                        >
                          Play Again
                        </Button>
                      </>
                    ) : user ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/quizzes/sql-workflow`)}
                        className="rounded-xl font-semibold text-xs h-9 px-4 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                      >
                        <PlayCircle size={15} /> Start SQL Puzzle
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="rounded-xl font-semibold text-xs h-9 px-3.5 gap-2 border-border/80"
                      >
                        <Lock size={13} /> Login to Play
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
                  className={`group p-5 sm:p-6 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 ${
                    isCompleted
                      ? "bg-card/90 border-purple-500/30 hover:border-purple-500/50"
                      : "bg-card/80 border-border/80 hover:border-purple-500/50 hover:bg-card"
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-2 text-purple-500">
                        <Cpu size={20} />
                        <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-purple-500 transition-colors">
                          AI & Machine Learning Workflow Puzzle
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 border border-purple-500/20">
                        Interactive
                      </span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/25">
                          <CheckCircle2 size={12} /> Mastered
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      Rebuild AI pipelines by dragging and dropping components across data preprocessing, model architecture, loss functions, and inference.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60 text-[11px] font-medium">
                        Model Architecture
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60 text-[11px] font-medium">
                        Pipeline Validation
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    {isCompleted ? (
                      <>
                        <div className="text-lg sm:text-2xl font-black text-purple-500 flex items-baseline gap-1">
                          {puzzleSubmission.score}{" "}
                          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                            / {puzzleSubmission.total_questions}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/quizzes/workflow-puzzle`)}
                          className="rounded-xl border-border/80 hover:bg-purple-500/10 hover:text-purple-500 font-semibold text-xs h-9 px-3.5"
                        >
                          Play Again
                        </Button>
                      </>
                    ) : user ? (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/quizzes/workflow-puzzle`)}
                        className="rounded-xl font-semibold text-xs h-9 px-4 gap-2 bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                      >
                        <PlayCircle size={15} /> Start Puzzle
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/login")}
                        className="rounded-xl font-semibold text-xs h-9 px-3.5 gap-2 border-border/80"
                      >
                        <Lock size={13} /> Login to Play
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
