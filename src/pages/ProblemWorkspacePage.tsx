import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Crown,
  Lightbulb,
  Lock,
  PanelBottomClose,
  PanelBottomOpen,
  Play,
  RotateCcw,
  Send,
  Terminal,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ThemeColorPicker from "../components/ThemeColorPicker";
import ThemeToggle from "../components/ThemeToggle";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { getAllProblems, type ProblemItem } from "../data/problems";
import { CodeEditor } from "../features/wasm-playground/components/CodeEditor";
import { LanguageSelector } from "../features/wasm-playground/components/LanguageSelector";
import { useWasmRuntime } from "../features/wasm-playground/hooks/useWasmRuntime";
import type {
  Language,
  TestCase,
} from "../features/wasm-playground/runtimes/types";
import {
  getSavedCode,
  getSubmissionsForProblem,
  isProblemSolved,
  type ProblemSubmission,
  resetDraftCode,
  saveDraftCode,
  saveSubmission,
  type SubmissionVerdict,
} from "../lib/submissionStore";
import { usePremiumStatus } from "../lib/premiumStore";
import UpgradeModal from "../components/UpgradeModal";

export default function ProblemWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const allProblems = useMemo(() => getAllProblems(), []);
  const problemIndex = useMemo(
    () => allProblems.findIndex((p) => p.slug === slug),
    [allProblems, slug],
  );
  const problem: ProblemItem | undefined =
    problemIndex !== -1 ? allProblems[problemIndex] : undefined;

  const prevProblem = problemIndex > 0 ? allProblems[problemIndex - 1] : null;
  const nextProblem =
    problemIndex < allProblems.length - 1
      ? allProblems[problemIndex + 1]
      : null;

  // Selected Language State
  const [language, setLanguage] = useState<Language>("python");
  const { isPremium } = usePremiumStatus();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Code state synchronized with local draft storage
  const [code, setCode] = useState<string>("");

  // Submissions state
  const [submissions, setSubmissions] = useState<ProblemSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ProblemSubmission | null>(null);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  // Bottom drawer state
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<
    "testcases" | "output" | "submission"
  >("testcases");
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [useCustomStdin, setUseCustomStdin] = useState(false);
  const [customStdin, setCustomStdin] = useState("");

  // Latest submission result
  const [latestSubmissionResult, setLatestSubmissionResult] =
    useState<ProblemSubmission | null>(null);

  // In-Browser WASM Runtime
  const {
    isRunning,
    isTesting,
    lastResult,
    testResults,
    executeCode,
    runTests,
    resetResults,
  } = useWasmRuntime(language);

  // Load problem code and submissions on slug or language change
  useEffect(() => {
    if (!problem) return;
    const defaultCode =
      problem.boilerplates[language] || problem.boilerplates.python;
    const saved = getSavedCode(problem.slug, language, defaultCode);
    setCode(saved);

    setSubmissions(getSubmissionsForProblem(problem.slug));
    setIsSolved(isProblemSolved(problem.slug));
    resetResults();
    setLatestSubmissionResult(null);
    setActiveCaseIndex(0);
  }, [problem?.slug, language]);

  // Sync draft code changes to localStorage
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (problem) {
      saveDraftCode(problem.slug, language, newCode);
    }
  };

  // Reset code to starter boilerplate
  const handleResetCode = () => {
    if (!problem) return;
    const defaultCode =
      problem.boilerplates[language] || problem.boilerplates.python;
    resetDraftCode(problem.slug, language);
    setCode(defaultCode);
    toast.info("Editor reset to original starter code");
  };

  // Sample test cases (publicly visible)
  const sampleTestCases: TestCase[] = useMemo(() => {
    if (!problem) return [];
    return problem.testCases
      .filter((tc) => !tc.hidden)
      .map((tc) => ({
        id: tc.id,
        name: tc.name,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        hidden: false,
      }));
  }, [problem]);

  // Run Code against sample test cases or custom input
  const handleRunCode = async () => {
    if (!problem) return;
    if (problem.isPremium && !isPremium) {
      toast.error("This is a ZAP Pro problem. Upgrade to run code!");
      setUpgradeModalOpen(true);
      return;
    }
    setDrawerOpen(true);

    if (useCustomStdin) {
      setDrawerTab("output");
      toast.loading("Running code with custom stdin...", { id: "run-exec" });
      const res = await executeCode(code, customStdin);
      toast.dismiss("run-exec");
      if (res.status === "success") {
        toast.success(`Executed in ${res.executionTimeMs} ms`);
      } else {
        toast.error(`Execution error: ${res.status}`);
      }
      return;
    }

    setDrawerTab("testcases");
    toast.loading("Testing against sample test cases...", { id: "run-tests" });
    const results = await runTests(code, sampleTestCases);
    toast.dismiss("run-tests");

    const passedCount = results.filter((r) => r.passed).length;
    if (passedCount === results.length) {
      toast.success(`Passed ${passedCount}/${results.length} sample cases! 🎉`);
    } else {
      toast.warning(
        `Passed ${passedCount}/${results.length} sample cases. Check outputs below.`,
      );
    }
  };

  // Submit Code against ALL test cases (sample + hidden)
  const handleSubmitCode = async () => {
    if (!problem) return;
    if (problem.isPremium && !isPremium) {
      toast.error("This is a ZAP Pro problem. Upgrade to submit solutions!");
      setUpgradeModalOpen(true);
      return;
    }
    setDrawerOpen(true);
    setDrawerTab("submission");

    toast.loading("Compiling & evaluating all test cases in-browser...", {
      id: "submit-tests",
    });

    const allTestCases: TestCase[] = problem.testCases.map((tc) => ({
      id: tc.id,
      name: tc.name,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      hidden: tc.hidden,
    }));

    const results = await runTests(code, allTestCases);
    toast.dismiss("submit-tests");

    const totalCount = allTestCases.length;
    const passedCount = results.filter((r) => r.passed).length;
    const totalTimeMs = results.reduce(
      (acc, curr) => acc + curr.executionTimeMs,
      0,
    );

    let verdict: SubmissionVerdict = "Accepted";
    let errorMessage: string | undefined;
    let failedTestCaseInfo: ProblemSubmission["failedTestCase"];

    const firstFailedIndex = results.findIndex((r) => !r.passed);
    if (firstFailedIndex !== -1) {
      const failedRes = results[firstFailedIndex];
      const failedTc = allTestCases[firstFailedIndex];

      if (failedRes.status === "compile_error") {
        verdict = "Compile Error";
        errorMessage = failedRes.errorMessage;
      } else if (failedRes.status === "runtime_error") {
        verdict = "Runtime Error";
        errorMessage = failedRes.errorMessage;
      } else if (failedRes.status === "timeout") {
        verdict = "Time Limit Exceeded";
      } else {
        verdict = "Wrong Answer";
      }

      failedTestCaseInfo = {
        testCaseNumber: firstFailedIndex + 1,
        input: failedTc.hidden ? undefined : failedTc.input,
        expectedOutput: failedTc.hidden ? undefined : failedTc.expectedOutput,
        actualOutput: failedTc.hidden ? undefined : failedRes.actualOutput,
        hidden: failedTc.hidden,
      };
    }

    const savedSub = saveSubmission({
      problemSlug: problem.slug,
      problemTitle: problem.title,
      language,
      code,
      verdict,
      passedCount,
      totalCount,
      executionTimeMs: totalTimeMs,
      errorMessage,
      failedTestCase: failedTestCaseInfo,
    });

    setLatestSubmissionResult(savedSub);
    setSubmissions(getSubmissionsForProblem(problem.slug));

    if (verdict === "Accepted") {
      setIsSolved(true);
      toast.success("Accepted! All test cases passed! 🏆", { duration: 6000 });
    } else {
      toast.error(
        `${verdict}: Passed ${passedCount}/${totalCount} test cases.`,
        { duration: 5000 },
      );
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Problem Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The problem "{slug}" could not be found in the directory.
          </p>
          <Button asChild>
            <Link to="/problems">Back to Problems Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

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
      case "Runtime Error":
        return (
          <Badge className="bg-purple-500/15 text-purple-400 border border-purple-500/30">
            Runtime Error
          </Badge>
        );
      case "Time Limit Exceeded":
        return (
          <Badge className="bg-orange-500/15 text-orange-400 border border-orange-500/30">
            Time Limit
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

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navbar & Header */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link to="/problems">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Problems</span>
            </Link>
          </Button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Problem Title & Solved State */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-foreground truncate max-w-[200px] sm:max-w-md">
              {problem.title}
            </span>
            <Badge
              variant="outline"
              className={`text-[11px] px-2 py-0 border ${getDifficultyColor(
                problem.difficulty,
              )}`}
            >
              {problem.difficulty}
            </Badge>
            {problem.isPremium && (
              <Badge className="bg-amber-500/15 text-amber-500 border border-amber-500/30 text-[10px] gap-1 px-1.5 py-0 font-bold uppercase">
                <Crown className="w-3 h-3 fill-amber-500" />
                PRO
              </Badge>
            )}
            {isSolved && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] gap-1 px-1.5 py-0">
                <CheckCircle2 className="w-3 h-3" />
                Solved
              </Badge>
            )}
          </div>

          {/* Next / Prev Problem navigation */}
          <div className="hidden lg:flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              disabled={!prevProblem}
              onClick={() =>
                prevProblem && navigate(`/problems/${prevProblem.slug}`)
              }
              title={prevProblem ? `Previous: ${prevProblem.title}` : undefined}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              disabled={!nextProblem}
              onClick={() =>
                nextProblem && navigate(`/problems/${nextProblem.slug}`)
              }
              title={nextProblem ? `Next: ${nextProblem.title}` : undefined}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <LanguageSelector
            language={language}
            onSelectLanguage={setLanguage}
            disabled={isRunning || isTesting}
          />

          <div className="h-4 w-px bg-border hidden md:block" />

          {/* Run Code Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRunCode}
            disabled={isRunning || isTesting}
            className="h-8 px-3 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current text-teal-400" />
            <span>Run</span>
          </Button>

          {/* Submit Code Button or Unlock Pro */}
          {problem.isPremium && !isPremium ? (
            <Button
              size="sm"
              onClick={() => setUpgradeModalOpen(true)}
              className="h-8 px-3.5 text-xs font-bold gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>Unlock Pro</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmitCode}
              disabled={isRunning || isTesting}
              className="h-8 px-3.5 text-xs font-bold gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </Button>
          )}

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5">
            <ThemeColorPicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Problem Statement & Submissions, Right Editor & Execution */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Panel: Problem Information, Submissions, Hints */}
        <div className="w-full md:w-[45%] lg:w-[42%] h-full border-r border-border flex flex-col bg-card/40">
          <Tabs
            defaultValue="description"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
              <TabsList className="bg-muted/60 h-8 p-0.5">
                <TabsTrigger value="description" className="text-xs px-3 h-7">
                  Description
                </TabsTrigger>
                <TabsTrigger value="submissions" className="text-xs px-3 h-7">
                  Submissions ({submissions.length})
                </TabsTrigger>
                <TabsTrigger value="hints" className="text-xs px-3 h-7">
                  Hints & Help
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  {problem.points} XP
                </span>
                <span>•</span>
                <span>{problem.acceptanceRate}</span>
              </div>
            </div>

            {/* Description Tab Content */}
            <TabsContent
              value="description"
              className="flex-1 overflow-y-auto p-5 space-y-6 m-0"
            >
              {/* Category & Tags Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {problem.category}
                  </span>
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {problem.title}
                </h2>
              </div>

              {/* Main Problem Markdown Description */}
              <div className="prose dark:prose-invert prose-sm max-w-none text-foreground/90 space-y-3">
                <p className="whitespace-pre-line leading-relaxed">
                  {problem.description}
                </p>
              </div>

              {/* Examples Cards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Examples
                </h3>
                {problem.examples.map((ex, idx) => (
                  <Card
                    key={idx}
                    className="border-border/80 bg-muted/20 shadow-none overflow-hidden"
                  >
                    <div className="px-3.5 py-1.5 bg-muted/40 border-b border-border/50 text-[11px] font-semibold text-muted-foreground">
                      Example {idx + 1}
                    </div>
                    <CardContent className="p-3.5 space-y-2 text-xs font-mono">
                      <div>
                        <span className="text-muted-foreground font-sans text-[11px] font-semibold uppercase block mb-0.5">
                          Input:
                        </span>
                        <div className="p-2 rounded bg-background/80 border border-border/60 text-foreground whitespace-pre-wrap">
                          {ex.input}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-sans text-[11px] font-semibold uppercase block mb-0.5">
                          Output:
                        </span>
                        <div className="p-2 rounded bg-background/80 border border-border/60 text-foreground whitespace-pre-wrap">
                          {ex.output}
                        </div>
                      </div>
                      {ex.explanation && (
                        <div className="font-sans text-xs text-muted-foreground pt-1">
                          <span className="font-semibold text-foreground">
                            Explanation:{" "}
                          </span>
                          {ex.explanation}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Constraints and Format */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Constraints & Specifications
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <span className="font-semibold text-foreground">
                      Input Format:
                    </span>
                    <p className="text-muted-foreground font-mono">
                      {problem.inputFormat}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <span className="font-semibold text-foreground">
                      Output Format:
                    </span>
                    <p className="text-muted-foreground font-mono">
                      {problem.outputFormat}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                    <span className="font-semibold text-foreground">
                      Constraints:
                    </span>
                    <p className="text-muted-foreground font-mono whitespace-pre-line">
                      {problem.constraints}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Submissions Tab Content */}
            <TabsContent
              value="submissions"
              className="flex-1 overflow-y-auto p-4 space-y-3 m-0"
            >
              {submissions.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground space-y-2">
                  <Code2 className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-sm font-semibold">No submissions yet</p>
                  <p className="text-xs">
                    Click "Submit" in the header to evaluate your solution and
                    track your history.
                  </p>
                </div>
              ) : (
                submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="p-3.5 rounded-lg border border-border/70 bg-card hover:bg-muted/40 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getVerdictBadge(sub.verdict)}
                        <span className="text-xs uppercase font-mono font-bold text-muted-foreground">
                          {sub.language}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(sub.timestamp).toLocaleDateString()} at{" "}
                        {new Date(sub.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Cases Passed: {sub.passedCount} / {sub.totalCount}
                      </span>
                      <span>Runtime: {sub.executionTimeMs} ms</span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Hints Tab Content */}
            <TabsContent
              value="hints"
              className="flex-1 overflow-y-auto p-4 space-y-4 m-0"
            >
              <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
                  <Lightbulb className="w-4 h-4" />
                  Algorithmic Hints
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Stuck on this problem? Consider the optimal time and space
                  complexity before attempting brute-force approaches.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-border/60 bg-card space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground">
                    Hint 1: Standard Input / Output
                  </span>
                  <p className="text-muted-foreground">
                    Make sure your program reads from{" "}
                    <code className="text-primary">stdin</code> and prints the
                    result to <code className="text-primary">stdout</code>{" "}
                    according to the specified format. Extra prompt messages
                    like "Enter numbers:" will cause test case failures.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-border/60 bg-card space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground">
                    Hint 2: Edge Cases
                  </span>
                  <p className="text-muted-foreground">
                    Always consider minimum input sizes (e.g. 1 or 2 elements),
                    negative numbers, and boundary conditions specified in the
                    Constraints.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Code Editor & Resizable Execution Drawer */}
        <div className="w-full md:w-[55%] lg:w-[58%] h-full flex flex-col overflow-hidden bg-background">
          {/* Editor Header Bar */}
          <div className="h-10 px-4 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Solution Code Editor
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                {language.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetCode}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                title="Reset to starter boilerplate"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
          </div>

          {/* Monaco Code Editor Container */}
          <div className="flex-1 relative overflow-hidden">
            <CodeEditor
              language={language}
              code={code}
              onChange={handleCodeChange}
              onReset={handleResetCode}
              disabled={isRunning || isTesting || (problem.isPremium && !isPremium)}
            />

            {/* Pro Locked Overlay */}
            {problem.isPremium && !isPremium && (
              <div className="absolute inset-0 bg-background/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-3 shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-foreground">
                  ZAP Pro Problem Locked
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 leading-relaxed">
                  This problem is reserved for ZAP Pro members. Upgrade via Razorpay to write code, test against in-browser WASM runtimes, and submit solutions.
                </p>
                <Button
                  onClick={() => setUpgradeModalOpen(true)}
                  className="h-10 px-6 font-bold text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 border-0 shadow-md gap-2 transition-transform hover:scale-105"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  Unlock with Razorpay (₹499)
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Execution Drawer */}
          <div
            className={`border-t border-border bg-card transition-all duration-200 flex flex-col ${
              drawerOpen ? "h-64 sm:h-72" : "h-10"
            }`}
          >
            {/* Drawer Header Controls */}
            <div className="h-10 px-4 border-b border-border bg-card/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="h-7 px-1.5 text-xs text-muted-foreground hover:text-foreground gap-1"
                >
                  {drawerOpen ? (
                    <PanelBottomClose className="w-3.5 h-3.5" />
                  ) : (
                    <PanelBottomOpen className="w-3.5 h-3.5" />
                  )}
                  <span className="font-semibold text-foreground">
                    Console & Testcases
                  </span>
                </Button>

                {drawerOpen && (
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => setDrawerTab("testcases")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        drawerTab === "testcases"
                          ? "bg-secondary text-secondary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Test Cases
                    </button>
                    <button
                      onClick={() => setDrawerTab("output")}
                      className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                        drawerTab === "output"
                          ? "bg-secondary text-secondary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Stdout / Stderr
                    </button>
                    {latestSubmissionResult && (
                      <button
                        onClick={() => setDrawerTab("submission")}
                        className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                          drawerTab === "submission"
                            ? "bg-secondary text-secondary-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Submission Result
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {(isRunning || isTesting) && (
                  <span className="flex items-center gap-1.5 text-primary text-xs font-semibold animate-pulse">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    WASM Executing...
                  </span>
                )}
              </div>
            </div>

            {/* Drawer Content */}
            {drawerOpen && (
              <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
                {drawerTab === "testcases" && (
                  <div className="space-y-3">
                    {/* Test cases tabs & Custom stdin toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {sampleTestCases.map((tc, idx) => {
                          const result = testResults ? testResults[idx] : null;
                          const isPassed = result?.passed;
                          return (
                            <button
                              key={tc.id}
                              onClick={() => {
                                setUseCustomStdin(false);
                                setActiveCaseIndex(idx);
                              }}
                              className={`px-3 py-1 text-xs rounded-md border font-medium flex items-center gap-1.5 transition-all ${
                                !useCustomStdin && activeCaseIndex === idx
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                  : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span>Case {idx + 1}</span>
                              {result && (
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isPassed ? "bg-emerald-400" : "bg-rose-500"
                                  }`}
                                />
                              )}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setUseCustomStdin(true)}
                          className={`px-3 py-1 text-xs rounded-md border font-medium transition-all ${
                            useCustomStdin
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Custom Input
                        </button>
                      </div>

                      {testResults && !useCustomStdin && (
                        <div className="text-xs font-semibold">
                          {testResults[activeCaseIndex]?.passed ? (
                            <span className="text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passed (
                              {testResults[activeCaseIndex]?.executionTimeMs}{" "}
                              ms)
                            </span>
                          ) : testResults[activeCaseIndex] ? (
                            <span className="text-rose-500 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Failed
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Active Case Details or Custom Input */}
                    {useCustomStdin ? (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Enter custom standard input (stdin):
                        </span>
                        <textarea
                          value={customStdin}
                          onChange={(e) => setCustomStdin(e.target.value)}
                          placeholder="Type or paste input here..."
                          className="w-full h-28 p-2.5 rounded-lg border border-border bg-card font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    ) : sampleTestCases[activeCaseIndex] ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-muted-foreground font-sans font-semibold text-[11px] uppercase">
                            Input:
                          </span>
                          <div className="p-2.5 rounded-lg bg-card border border-border/70 text-foreground whitespace-pre-wrap max-h-28 overflow-y-auto">
                            {sampleTestCases[activeCaseIndex].input}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-muted-foreground font-sans font-semibold text-[11px] uppercase">
                            Expected Output:
                          </span>
                          <div className="p-2.5 rounded-lg bg-card border border-border/70 text-foreground whitespace-pre-wrap max-h-28 overflow-y-auto">
                            {sampleTestCases[activeCaseIndex].expectedOutput}
                          </div>
                        </div>

                        {testResults && testResults[activeCaseIndex] && (
                          <div className="col-span-1 sm:col-span-2 space-y-1">
                            <span className="text-muted-foreground font-sans font-semibold text-[11px] uppercase">
                              Your Program Output:
                            </span>
                            <div
                              className={`p-2.5 rounded-lg border font-mono text-xs whitespace-pre-wrap max-h-28 overflow-y-auto ${
                                testResults[activeCaseIndex].passed
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                              }`}
                            >
                              {testResults[activeCaseIndex].actualOutput || (
                                <span className="italic opacity-60">
                                  (No stdout produced)
                                </span>
                              )}
                              {testResults[activeCaseIndex].errorMessage && (
                                <div className="mt-2 text-rose-400 font-sans text-xs">
                                  Error:{" "}
                                  {testResults[activeCaseIndex].errorMessage}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {drawerTab === "output" && (
                  <div className="space-y-3 font-mono text-xs">
                    {lastResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-muted-foreground font-sans text-xs">
                          <span>Status: {lastResult.status}</span>
                          <span>
                            Execution Time: {lastResult.executionTimeMs} ms
                          </span>
                        </div>
                        {lastResult.stdout && (
                          <div className="space-y-1">
                            <span className="text-muted-foreground text-[11px] uppercase font-sans font-semibold">
                              Stdout:
                            </span>
                            <pre className="p-3 rounded-lg bg-card border border-border text-foreground overflow-x-auto whitespace-pre-wrap">
                              {lastResult.stdout}
                            </pre>
                          </div>
                        )}
                        {lastResult.stderr && (
                          <div className="space-y-1">
                            <span className="text-rose-500 text-[11px] uppercase font-sans font-semibold">
                              Stderr / Diagnostics:
                            </span>
                            <pre className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 overflow-x-auto whitespace-pre-wrap">
                              {lastResult.stderr}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground font-sans">
                        <Terminal className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>
                          No stdout or stderr output yet. Click "Run" or
                          "Submit".
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {drawerTab === "submission" && latestSubmissionResult && (
                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        latestSubmissionResult.verdict === "Accepted"
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-rose-500/10 border-rose-500/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {latestSubmissionResult.verdict === "Accepted" ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                          <span className="text-xl font-bold tracking-tight">
                            {latestSubmissionResult.verdict}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Passed {latestSubmissionResult.passedCount} of{" "}
                          {latestSubmissionResult.totalCount} test cases
                        </p>
                      </div>

                      <div className="text-right text-xs space-y-1 font-mono">
                        <div className="text-foreground font-semibold">
                          Runtime: {latestSubmissionResult.executionTimeMs} ms
                        </div>
                        <div className="text-muted-foreground uppercase">
                          Language: {latestSubmissionResult.language}
                        </div>
                      </div>
                    </div>

                    {/* Failing testcase diagnostics if any */}
                    {latestSubmissionResult.failedTestCase && (
                      <div className="p-3.5 rounded-lg border border-border bg-card space-y-2 text-xs">
                        <span className="font-semibold text-foreground">
                          Failed on Test Case #
                          {latestSubmissionResult.failedTestCase.testCaseNumber}
                          {latestSubmissionResult.failedTestCase.hidden &&
                            " (Hidden Test Case)"}
                        </span>
                        {latestSubmissionResult.failedTestCase.hidden ? (
                          <p className="text-muted-foreground">
                            Hidden test cases evaluate boundary constraints and
                            edge inputs.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                            <div>
                              <span className="text-muted-foreground uppercase text-[10px] block">
                                Input:
                              </span>
                              <div className="p-2 rounded bg-muted/50 border border-border/60">
                                {latestSubmissionResult.failedTestCase.input}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground uppercase text-[10px] block">
                                Expected:
                              </span>
                              <div className="p-2 rounded bg-muted/50 border border-border/60">
                                {
                                  latestSubmissionResult.failedTestCase
                                    .expectedOutput
                                }
                              </div>
                            </div>
                          </div>
                        )}
                        {latestSubmissionResult.errorMessage && (
                          <pre className="p-2 rounded bg-rose-500/10 text-rose-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                            {latestSubmissionResult.errorMessage}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <Dialog
          open={!!selectedSubmission}
          onOpenChange={(open) => !open && setSelectedSubmission(null)}
        >
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <span>Submission Detail</span>
                  {getVerdictBadge(selectedSubmission.verdict)}
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {selectedSubmission.executionTimeMs} ms •{" "}
                  {selectedSubmission.passedCount}/
                  {selectedSubmission.totalCount} passed
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 pt-2">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Submitted Code ({selectedSubmission.language}):
                </span>
                <pre className="p-3.5 rounded-lg bg-muted/60 border border-border font-mono text-xs text-foreground overflow-x-auto whitespace-pre-wrap max-h-72">
                  {selectedSubmission.code}
                </pre>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-rose-400">
                    Error Diagnostic:
                  </span>
                  <pre className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 font-mono text-xs text-rose-400 whitespace-pre-wrap">
                    {selectedSubmission.errorMessage}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        sourceContext="problems"
      />
    </div>
  );
}
