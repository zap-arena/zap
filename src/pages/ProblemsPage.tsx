import {
  AlertCircle,
  Award,
  CheckCircle2,
  ChevronRight,
  Circle,
  Code2,
  Cpu,
  Crown,
  Flame,
  History,
  Layers,
  Lock,
  RotateCcw,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import UpgradeModal from "../components/UpgradeModal";
import { usePremiumStatus } from "../lib/premiumStore";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  PROBLEM_CATEGORIES,
  PROBLEMS_DATA,
} from "../data/problems";
import {
  getAllSubmissions,
  useProblemProgress,
} from "../lib/submissionStore";

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Topics");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [submissionsModalOpen, setSubmissionsModalOpen] = useState(false);
  const { isPremium } = usePremiumStatus();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Reactive user progress from local storage
  const stats = useProblemProgress(PROBLEMS_DATA);
  const allSubmissions = useMemo(
    () => getAllSubmissions(),
    [submissionsModalOpen, stats],
  );

  // Compute counts for difficulty categories
  const easyCount = useMemo(
    () => PROBLEMS_DATA.filter((p) => p.difficulty === "Easy").length,
    [],
  );
  const mediumCount = useMemo(
    () => PROBLEMS_DATA.filter((p) => p.difficulty === "Medium").length,
    [],
  );
  const hardCount = useMemo(
    () => PROBLEMS_DATA.filter((p) => p.difficulty === "Hard").length,
    [],
  );

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    return PROBLEMS_DATA.filter((problem) => {
      // Search query filter (title or tags)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(query);
        const matchesTags = problem.tags.some((tag) =>
          tag.toLowerCase().includes(query),
        );
        const matchesCategory = problem.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTags && !matchesCategory) return false;
      }

      // Category filter
      if (
        selectedCategory !== "All Topics" &&
        problem.category !== selectedCategory
      ) {
        return false;
      }

      // Difficulty filter
      if (
        difficultyFilter !== "all" &&
        problem.difficulty !== difficultyFilter
      ) {
        return false;
      }

      // Status filter
      const solved = stats.solvedSlugs.includes(problem.slug);
      const attempted = stats.attemptedSlugs.includes(problem.slug) && !solved;
      if (statusFilter === "solved" && !solved) return false;
      if (statusFilter === "attempted" && !attempted) return false;
      if (statusFilter === "unsolved" && (solved || attempted)) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, difficultyFilter, statusFilter, stats]);

  // Handle Pick Random Problem
  const handlePickRandom = () => {
    const unsolved = PROBLEMS_DATA.filter(
      (p) => !stats.solvedSlugs.includes(p.slug),
    );
    const pool = unsolved.length > 0 ? unsolved : PROBLEMS_DATA;
    const randomProblem = pool[Math.floor(Math.random() * pool.length)];
    if (randomProblem) {
      navigate(`/problems/${randomProblem.slug}`);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-muted-foreground";
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Accepted":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Accepted
          </Badge>
        );
      case "Wrong Answer":
        return (
          <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30">
            Wrong Answer
          </Badge>
        );
      case "Compile Error":
        return (
          <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Compile Error
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-500/15 text-slate-300 border border-slate-500/30">
            {verdict}
          </Badge>
        );
    }
  };

  const percentSolved =
    PROBLEMS_DATA.length > 0
      ? Math.round((stats.totalSolved / PROBLEMS_DATA.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/80 to-secondary/30 border border-border p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-32 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                Zero-Backend WebAssembly Sandbox
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Problems Directory
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Sharpen your algorithmic thinking. Write and test Python, C++,
                and Java code entirely in your browser with real-time
                compilation, test case verification, and persistent progress
                tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handlePickRandom}
                className="gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Pick Random
              </Button>

              <Dialog
                open={submissionsModalOpen}
                onOpenChange={setSubmissionsModalOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 border-border/80">
                    <History className="w-4 h-4 text-muted-foreground" />
                    Submissions ({allSubmissions.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <History className="w-5 h-5 text-primary" />
                      Recent Submissions History
                    </DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto pr-1 flex-1 space-y-3 mt-2">
                    {allSubmissions.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Code2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-medium">
                          No submissions recorded yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Solve a problem to record your first client-side
                          submission!
                        </p>
                      </div>
                    ) : (
                      allSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3.5 rounded-lg border border-border/60 bg-card/60 hover:bg-muted/40 transition-colors text-sm"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/problems/${sub.problemSlug}`}
                                className="font-semibold text-foreground hover:text-primary transition-colors hover:underline"
                                onClick={() => setSubmissionsModalOpen(false)}
                              >
                                {sub.problemTitle}
                              </Link>
                              <Badge
                                variant="outline"
                                className="text-xs uppercase font-mono"
                              >
                                {sub.language}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-3">
                              <span>
                                {new Date(sub.timestamp).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(sub.timestamp).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </span>
                              <span>•</span>
                              <span>
                                {sub.passedCount} / {sub.totalCount} test cases
                              </span>
                              <span>•</span>
                              <span>{sub.executionTimeMs} ms</span>
                            </div>
                          </div>
                          <div>{getVerdictBadge(sub.verdict)}</div>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* User Progress Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Solved Card */}
          <Card className="border-border bg-card/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Solved
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground">
                    {stats.totalSolved}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {PROBLEMS_DATA.length} ({percentSolved}%)
                  </span>
                </div>
                <Progress value={percentSolved} className="h-1.5 w-32 mt-2" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Breakdown */}
          <Card className="border-border bg-card/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1 w-full mr-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Difficulty Tiers
                </span>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-500 font-semibold">Easy</span>
                  <span className="font-mono text-muted-foreground">
                    {stats.easySolved}/{easyCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-500 font-semibold">Medium</span>
                  <span className="font-mono text-muted-foreground">
                    {stats.mediumSolved}/{mediumCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-500 font-semibold">Hard</span>
                  <span className="font-mono text-muted-foreground">
                    {stats.hardSolved}/{hardCount}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Points Earned */}
          <Card className="border-border bg-card/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Points Earned
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">
                    {stats.totalPoints}
                  </span>
                  <span className="text-xs text-muted-foreground">XP</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Earn points by passing all test cases
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          {/* Submissions & Rate */}
          <Card className="border-border bg-card/70 backdrop-blur-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Accuracy
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-foreground">
                    {stats.acceptanceRate}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({stats.totalSubmissions} attempts)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Calculated from browser evaluations
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Flame className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, tag, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Dropdown */}
              <Select
                value={difficultyFilter}
                onValueChange={setDifficultyFilter}
              >
                <SelectTrigger className="w-[140px] bg-card border-border text-xs">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Dropdown */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] bg-card border-border text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="attempted">Attempted</SelectItem>
                  <SelectItem value="unsolved">Unsolved</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button if active filters */}
              {(searchQuery ||
                difficultyFilter !== "all" ||
                statusFilter !== "all" ||
                selectedCategory !== "All Topics") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setDifficultyFilter("all");
                    setStatusFilter("all");
                    setSelectedCategory("All Topics");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PROBLEM_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card/70 hover:bg-secondary text-muted-foreground hover:text-foreground border-border/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-border">
                <TableHead className="w-12 text-center">Status</TableHead>
                <TableHead>Problem Title & Tags</TableHead>
                <TableHead className="w-32">Difficulty</TableHead>
                <TableHead className="w-28 text-center">Acceptance</TableHead>
                <TableHead className="w-28 text-center">Points</TableHead>
                <TableHead className="w-28 text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    <div className="max-w-sm mx-auto space-y-3">
                      <Code2 className="w-10 h-10 mx-auto text-muted-foreground/40" />
                      <p className="text-base font-medium text-foreground">
                        No problems match your filters
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Try clearing your search terms or picking a different
                        category.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("");
                          setDifficultyFilter("all");
                          setStatusFilter("all");
                          setSelectedCategory("All Topics");
                        }}
                      >
                        Reset All Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProblems.map((problem) => {
                  const solved = stats.solvedSlugs.includes(problem.slug);
                  const attempted =
                    stats.attemptedSlugs.includes(problem.slug) && !solved;

                  return (
                    <TableRow
                      key={problem.id}
                      className="border-border hover:bg-muted/30 transition-colors group"
                    >
                      {/* Status Icon */}
                      <TableCell className="text-center">
                        {solved ? (
                          <span title="Solved">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                          </span>
                        ) : attempted ? (
                          <span title="Attempted">
                            <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
                          </span>
                        ) : (
                          <span title="Unsolved">
                            <Circle className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                          </span>
                        )}
                      </TableCell>

                      {/* Title & Tags */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {problem.isPremium && !isPremium ? (
                              <button
                                onClick={() => setUpgradeModalOpen(true)}
                                className="font-medium text-foreground hover:text-amber-500 transition-colors flex items-center gap-1.5 text-left"
                              >
                                <span>{problem.title}</span>
                              </button>
                            ) : (
                              <Link
                                to={`/problems/${problem.slug}`}
                                className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2 group-hover:translate-x-0.5 transform duration-150"
                              >
                                <span>{problem.title}</span>
                              </Link>
                            )}
                            {problem.isPremium && (
                              <Badge className="bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] gap-1 px-1.5 py-0 font-bold uppercase">
                                <Crown className="w-3 h-3 fill-amber-500" />
                                PRO
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[11px] font-medium text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded">
                              {problem.category}
                            </span>
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] text-muted-foreground/80 bg-muted/60 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>

                      {/* Difficulty Badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-medium text-xs px-2.5 py-0.5 border ${getDifficultyColor(
                            problem.difficulty,
                          )}`}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>

                      {/* Acceptance Rate */}
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        {problem.acceptanceRate}
                      </TableCell>

                      {/* Points */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                          <Zap className="w-3 h-3 fill-amber-400" />
                          {problem.points}
                        </span>
                      </TableCell>

                      {/* Action Button */}
                      <TableCell className="text-right pr-6">
                        {problem.isPremium && !isPremium ? (
                          <Button
                            size="sm"
                            onClick={() => setUpgradeModalOpen(true)}
                            className="h-8 text-xs font-bold gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 border-0 shadow-sm"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock</span>
                          </Button>
                        ) : (
                          <Button
                            asChild
                            size="sm"
                            variant={solved ? "secondary" : "default"}
                            className={`h-8 text-xs font-medium gap-1 ${
                              solved
                                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}
                          >
                            <Link to={`/problems/${problem.slug}`}>
                              {solved ? "Review" : "Solve"}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        sourceContext="problems"
      />
    </div>
  );
}
