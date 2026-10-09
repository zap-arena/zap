import Editor from "@monaco-editor/react";
import {
  ArrowLeft,
  Bug,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  FileCode2,
  Info,
  Lightbulb,
  Lock,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Unlock,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FormattedText } from "../components/FormattedText";
import ThemeColorPicker from "../components/ThemeColorPicker";
import ThemeToggle from "../components/ThemeToggle";
import { ThunderLogo } from "../components/ThunderLogo";
import { Button } from "../components/ui/button";
import {
  DEBUGGING_PROBLEMS,
  DEBUGGING_TOPICS,
  type DebuggingProblem,
} from "../data/debugging-problems";
import { EDITOR_THEME_OPTIONS, MONACO_THEMES } from "../lib/monaco-themes";

export default function DebuggingWarPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Topic
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");

  // Filtered problems based on topic
  const filteredProblems = useMemo(() => {
    if (selectedTopic === "All Topics") return DEBUGGING_PROBLEMS;
    return DEBUGGING_PROBLEMS.filter((p) => p.topic === selectedTopic);
  }, [selectedTopic]);

  // Selected Problem
  const problemSlugFromUrl = searchParams.get("problem");
  const selectedProblem = useMemo(() => {
    if (problemSlugFromUrl) {
      const match = DEBUGGING_PROBLEMS.find(
        (p) => p.slug === problemSlugFromUrl,
      );
      if (match) return match;
    }
    return filteredProblems[0] || DEBUGGING_PROBLEMS[0];
  }, [problemSlugFromUrl, filteredProblems]);

  // Solved state tracked in localStorage
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("zap_debugging_solved_map");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const isCurrentSolved = !!solvedMap[selectedProblem.id];

  const toggleSolved = (problemId: string) => {
    setSolvedMap((prev) => {
      const updated = { ...prev, [problemId]: !prev[problemId] };
      try {
        localStorage.setItem(
          "zap_debugging_solved_map",
          JSON.stringify(updated),
        );
      } catch (err) {
        console.error("Failed to save solved map", err);
      }
      if (updated[problemId]) {
        toast.success("Bug marked as Squashed! 🏆");
      } else {
        toast.info("Marked as Unsolved");
      }
      return updated;
    });
  };

  // Selected Language
  const [language, setLanguage] = useState<string>("python");

  // Current code in editor
  const [code, setCode] = useState<string>(() => {
    const saved = localStorage.getItem(
      `zap_debugging_code_${selectedProblem.id}_${language}`,
    );
    if (saved) return saved;
    return selectedProblem.buggyCode[language] || selectedProblem.buggyCode.python || "";
  });

  // When problem or language changes, update code
  useEffect(() => {
    if (!selectedProblem.languages.includes(language as any)) {
      setLanguage(selectedProblem.languages[0] || "python");
      return;
    }
    const saved = localStorage.getItem(
      `zap_debugging_code_${selectedProblem.id}_${language}`,
    );
    if (saved) {
      setCode(saved);
    } else {
      setCode(
        selectedProblem.buggyCode[language] ||
          selectedProblem.buggyCode.python ||
          "",
      );
    }
  }, [selectedProblem.id, language]);

  // Update URL param when problem changes
  const selectProblem = (prob: DebuggingProblem) => {
    setSearchParams({ problem: prob.slug });
  };

  // Active Tab on the Left panel
  const [activeTab, setActiveTab] = useState<"statement" | "incident" | "solution">("statement");

  // Progressive Hints state
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  useEffect(() => {
    setRevealedHints([]);
  }, [selectedProblem.id]);

  const revealNextHint = () => {
    if (revealedHints.length < selectedProblem.hints.length) {
      const nextIdx = revealedHints.length;
      setRevealedHints((prev) => [...prev, nextIdx]);
      if (nextIdx + 1 === selectedProblem.hints.length) {
        toast.success(
          `All ${selectedProblem.hints.length} diagnostic hints explored! Solution code unlocked.`,
        );
      } else {
        toast.info(
          `Diagnostic Hint ${nextIdx + 1} of ${selectedProblem.hints.length} revealed!`,
        );
      }
    }
  };

  const revealAllHints = () => {
    const all = selectedProblem.hints.map((_, i) => i);
    setRevealedHints(all);
    toast.success(
      `All ${selectedProblem.hints.length} diagnostic hints explored! Solution code unlocked.`,
    );
  };

  const allHintsTried = revealedHints.length >= selectedProblem.hints.length;

  // Solution Reveal state
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  useEffect(() => {
    setSolutionRevealed(false);
  }, [selectedProblem.id]);

  // Editor Theme
  const [editorTheme, setEditorTheme] = useState(
    () => localStorage.getItem("zap-editor-theme") || "vs-dark",
  );

  const editorRef = useRef<any>(null);

  // Reset to original buggy code
  const resetToBuggyCode = () => {
    const original =
      selectedProblem.buggyCode[language] ||
      selectedProblem.buggyCode.python ||
      "";
    setCode(original);
    localStorage.removeItem(
      `zap_debugging_code_${selectedProblem.id}_${language}`,
    );
    toast.success("Reset editor to original buggy implementation");
  };

  // Copy code
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  // Handle editor code change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    try {
      localStorage.setItem(
        `zap_debugging_code_${selectedProblem.id}_${language}`,
        newCode,
      );
    } catch {
      // ignore
    }
  };

  // Navigation indices
  const currentIndex = filteredProblems.findIndex(
    (p) => p.id === selectedProblem.id,
  );
  const prevProblem = currentIndex > 0 ? filteredProblems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < filteredProblems.length - 1
      ? filteredProblems[currentIndex + 1]
      : null;

  // Stats
  const totalSolved = Object.values(solvedMap).filter(Boolean).length;
  const totalPoints = DEBUGGING_PROBLEMS.filter(
    (p) => solvedMap[p.id],
  ).reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden select-none">
      {/* Sleek Dedicated Arena Top Bar (h-12, no wasted space) */}
      <header className="h-12 border-b border-border bg-card/80 backdrop-blur px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo link to Home */}
          <Link
            to="/"
            className="flex items-center gap-1 font-black text-lg tracking-tight shrink-0 hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-teal-600 dark:text-teal-400">Z</span>
            <ThunderLogo className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-blue-700 dark:text-blue-400">P</span>
          </Link>

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Back to CodeWar Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/codewar")}
            className="gap-1 text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">CodeWar</span>
          </Button>

          <div className="h-4 w-px bg-border mx-0.5" />

          {/* Arena Badge */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Bug size={13} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              Debugging War
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-500/10 text-red-500 border border-red-500/20 hidden md:inline">
              Arena
            </span>
          </div>
        </div>

        {/* Center: Topic Filter Selector */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-md scrollbar-none py-1">
          <select
            value={selectedTopic}
            onChange={(e) => {
              const topic = e.target.value;
              setSelectedTopic(topic);
              const firstInTopic =
                topic === "All Topics"
                  ? DEBUGGING_PROBLEMS[0]
                  : DEBUGGING_PROBLEMS.find((p) => p.topic === topic);
              if (firstInTopic) selectProblem(firstInTopic);
            }}
            className="text-xs bg-muted/70 hover:bg-muted border border-border rounded-lg px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
          >
            {DEBUGGING_TOPICS.map((topic) => {
              const count =
                topic === "All Topics"
                  ? DEBUGGING_PROBLEMS.length
                  : DEBUGGING_PROBLEMS.filter((p) => p.topic === topic).length;
              return (
                <option key={topic} value={topic}>
                  {topic} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-500 font-semibold">
            <CheckCircle2 size={12} />
            <span>{totalSolved}/{DEBUGGING_PROBLEMS.length} Solved</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-500 font-semibold hidden sm:flex">
            <Sparkles size={12} />
            <span>{totalPoints} pts</span>
          </div>

          <div className="h-4 w-px bg-border mx-0.5" />

          <ThemeColorPicker size="xs" />
          <ThemeToggle size="xs" />
        </div>
      </header>

      {/* Main Workspace (Takes 100% of remaining screen height) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden select-text">
        {/* Left Column: Problem, Bug Briefing & Clues (5 cols) */}
        <section className="lg:col-span-5 border-r border-border flex flex-col bg-card/20 min-h-0 overflow-hidden">
          {/* Problem Selector Bar */}
          <div className="h-11 px-3 border-b border-border bg-card/50 flex items-center justify-between gap-2 shrink-0">
            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={!prevProblem}
                onClick={() => prevProblem && selectProblem(prevProblem)}
                title="Previous Challenge"
              >
                <ChevronLeft size={15} />
              </Button>
              <span className="text-xs font-mono font-medium text-muted-foreground px-0.5">
                #{currentIndex + 1}/{filteredProblems.length}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={!nextProblem}
                onClick={() => nextProblem && selectProblem(nextProblem)}
                title="Next Challenge"
              >
                <ChevronRight size={15} />
              </Button>
            </div>

            {/* Quick Problem Dropdown */}
            <div className="flex-1 max-w-[210px] sm:max-w-[260px]">
              <select
                value={selectedProblem.slug}
                onChange={(e) => {
                  const found = DEBUGGING_PROBLEMS.find(
                    (p) => p.slug === e.target.value,
                  );
                  if (found) selectProblem(found);
                }}
                className="w-full text-xs bg-muted/60 border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary truncate font-medium"
              >
                {filteredProblems.map((p, idx) => (
                  <option key={p.id} value={p.slug}>
                    {solvedMap[p.id] ? "✓ " : ""}{idx + 1}. {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Mark Solved Toggle */}
            <Button
              size="sm"
              variant={isCurrentSolved ? "default" : "outline"}
              onClick={() => toggleSolved(selectedProblem.id)}
              className={`h-7 px-2.5 text-xs gap-1 font-medium transition-all ${
                isCurrentSolved
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CheckCircle2 size={12} />
              {isCurrentSolved ? "Squashed" : "Mark Solved"}
            </Button>
          </div>

          {/* Problem Header Info */}
          <div className="px-4 py-2.5 border-b border-border/60 bg-muted/10 shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    selectedProblem.difficulty === "Expert"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : selectedProblem.difficulty === "Hard"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}
                >
                  {selectedProblem.difficulty}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                  {selectedProblem.topic}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {selectedProblem.points} pts
                </span>
              </div>

              {/* Discreet CodeWar self-reliant badge */}
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <Info size={12} className="text-primary shrink-0" />
                <span>Self-reliant debug</span>
              </div>
            </div>

            <h2 className="text-base font-bold text-foreground truncate">
              {selectedProblem.title}
            </h2>
          </div>

          {/* Navigation Tabs */}
          <div className="h-9 px-3 border-b border-border bg-muted/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("statement")}
                className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === "statement"
                    ? "bg-background text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileCode2 size={13} /> Problem Spec
              </button>
              <button
                onClick={() => setActiveTab("incident")}
                className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === "incident"
                    ? "bg-background text-red-500 shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bug size={13} /> Bug Briefing & Clues
              </button>
              <button
                onClick={() => setActiveTab("solution")}
                className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === "solution"
                    ? "bg-background text-amber-500 shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title={
                  allHintsTried
                    ? "Review Fix (Unlocked)"
                    : `Review Fix (Locked: Try all ${selectedProblem.hints.length} hints first)`
                }
              >
                {allHintsTried ? (
                  <Lightbulb size={13} className="text-amber-500" />
                ) : (
                  <Lock size={12} className="text-muted-foreground" />
                )}
                <span>Review Fix</span>
                {!allHintsTried && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                    {revealedHints.length}/{selectedProblem.hints.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Scrollable Left Pane Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-5 text-sm leading-relaxed scrollbar-thin">
            {activeTab === "statement" && (
              <div className="space-y-5">
                {/* Problem Description */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                  <FormattedText text={selectedProblem.description} />
                </div>

                {/* Formatted I/O Specifications */}
                <div className="space-y-3 pt-1">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Input Format
                    </h4>
                    <div className="p-2.5 bg-muted/40 border border-border rounded-md text-xs font-mono text-foreground">
                      {selectedProblem.inputFormat}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Output Format
                    </h4>
                    <div className="p-2.5 bg-muted/40 border border-border rounded-md text-xs font-mono text-foreground">
                      {selectedProblem.outputFormat}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Constraints
                    </h4>
                    <div className="p-2.5 bg-muted/40 border border-border rounded-md text-xs font-mono whitespace-pre-line text-foreground">
                      {selectedProblem.constraints}
                    </div>
                  </div>
                </div>

                {/* Sample Test Cases */}
                <div className="space-y-3 pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Sample Test Cases
                  </h4>
                  {selectedProblem.testCases
                    .filter((tc) => !tc.hidden)
                    .map((tc, idx) => (
                      <div
                        key={tc.id}
                        className="bg-card border border-border rounded-lg p-3 space-y-2 shadow-xs"
                      >
                        <div className="text-xs font-semibold text-muted-foreground">
                          Sample Case #{idx + 1}: {tc.name}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <div className="text-[10px] text-muted-foreground mb-1">
                              Input:
                            </div>
                            <pre className="p-2 bg-muted/50 rounded border border-border/80 overflow-x-auto text-[11px]">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground mb-1">
                              Expected Output:
                            </div>
                            <pre className="p-2 bg-muted/50 rounded border border-border/80 overflow-x-auto text-[11px]">
                              {tc.expectedOutput}
                            </pre>
                          </div>
                        </div>

                        {tc.explanation && (
                          <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                            <span className="font-semibold text-foreground">
                              Explanation:{" "}
                            </span>
                            {tc.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "incident" && (
              <div className="space-y-4">
                {/* Incident Card */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="text-red-500" size={16} />
                      <h3 className="font-bold text-xs text-red-500">
                        Production Incident Brief
                      </h3>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                      {selectedProblem.incidentReport.severity} Severity
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-background/50 border border-border">
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        Reported By:
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedProblem.incidentReport.reportedBy}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-background/50 border border-border">
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        Environment:
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedProblem.incidentReport.environment}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase mb-1">
                      Defect Nature:
                    </span>
                    <p className="text-xs font-semibold text-red-400/90 bg-red-500/10 p-2 rounded border border-red-500/20">
                      {selectedProblem.incidentReport.errorType}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase mb-1">
                      Observed Symptoms:
                    </span>
                    <p className="text-xs text-foreground/90 bg-background/50 p-2.5 rounded border border-border leading-relaxed">
                      {selectedProblem.incidentReport.symptoms}
                    </p>
                  </div>
                </div>

                {/* Progressive Hints */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Lightbulb size={13} className="text-amber-500" />
                      Diagnostic Hints ({revealedHints.length} / {selectedProblem.hints.length})
                    </h4>
                    {revealedHints.length < selectedProblem.hints.length && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={revealNextHint}
                        className="h-6 text-xs gap-1 text-amber-500 border-amber-500/30 hover:bg-amber-500/10 px-2"
                      >
                        <Sparkles size={11} />
                        Reveal Hint
                      </Button>
                    )}
                  </div>

                  {revealedHints.length === 0 ? (
                    <div className="border border-dashed border-border rounded-lg p-3 text-center space-y-1 bg-muted/20">
                      <Lightbulb size={20} className="text-muted-foreground mx-auto" />
                      <p className="text-xs text-muted-foreground">
                        No hints revealed yet. Click above if you'd like a clue!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {revealedHints.map((hintIdx) => (
                        <div
                          key={hintIdx}
                          className="bg-amber-500/5 border border-amber-500/20 rounded-md p-2.5 text-xs space-y-1 animate-fade-in"
                        >
                          <span className="font-bold text-amber-500 text-[10px] block">
                            Hint #{hintIdx + 1}:
                          </span>
                          <p className="text-foreground/90 leading-relaxed">
                            {selectedProblem.hints[hintIdx]}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {allHintsTried && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mt-2">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                        <Unlock size={13} /> All diagnostic clues explored! Solution code is now unlocked.
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setActiveTab("solution")}
                        className="h-6 text-xs text-emerald-400 hover:text-emerald-300 px-2"
                      >
                        Review Fix &rarr;
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "solution" && (
              <div className="space-y-4">
                <div className="bg-muted/30 border border-border rounded-lg p-3.5 space-y-3">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="text-amber-500" size={16} />
                    <h3 className="font-bold text-xs text-foreground">
                      Reference Bug Fix & Analysis
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Compare your diagnosis with the clean, verified patch.
                  </p>

                  {!allHintsTried ? (
                    /* Locked: direct reveal is disallowed until hints are explored */
                    <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg shrink-0 mt-0.5">
                          <Lock size={18} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                            Solution Code Locked
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                              {revealedHints.length} / {selectedProblem.hints.length} Hints Tried
                            </span>
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Direct reveal is disallowed. You must try out all diagnostic hint options first to unlock the verified reference code.
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Hint Exploration Progress</span>
                          <span className="font-mono font-medium">
                            {Math.round((revealedHints.length / selectedProblem.hints.length) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{
                              width: `${(revealedHints.length / selectedProblem.hints.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Try Out Hint Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={revealNextHint}
                          className="text-xs gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-medium flex-1 h-8"
                        >
                          <Sparkles size={13} />
                          Try Out Hint #{revealedHints.length + 1}
                        </Button>
                        {selectedProblem.hints.length - revealedHints.length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={revealAllHints}
                            className="text-xs gap-1.5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10 h-8"
                          >
                            <Lightbulb size={13} />
                            Try Out All Hints
                          </Button>
                        )}
                      </div>

                      {/* Display previously tried hints */}
                      {revealedHints.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-amber-500/15">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Diagnostic Clues Explored ({revealedHints.length}):
                          </span>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {revealedHints.map((idx) => (
                              <div
                                key={idx}
                                className="p-2.5 bg-background/60 border border-amber-500/20 rounded-md text-xs text-foreground/90 space-y-0.5"
                              >
                                <div className="text-[10px] font-bold text-amber-500">
                                  Hint #{idx + 1}
                                </div>
                                <p className="leading-relaxed">{selectedProblem.hints[idx]}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disabled Reveal Code button */}
                      <div className="pt-1">
                        <Button
                          disabled
                          variant="secondary"
                          size="sm"
                          className="w-full gap-2 text-xs font-semibold h-8 opacity-50 cursor-not-allowed"
                        >
                          <Lock size={13} /> Direct Reveal Disabled (Try hint options above)
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Hints tried out! Reveal code is allowed */
                    <div className="space-y-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Unlock size={15} className="text-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-500">
                            All {selectedProblem.hints.length} Diagnostic Hints Explored!
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          UNLOCKED
                        </span>
                      </div>

                      {!solutionRevealed ? (
                        <div className="pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSolutionRevealed(true)}
                            className="w-full gap-2 text-xs font-semibold h-9 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                          >
                            <Eye size={14} /> Reveal Solution Code ({language.toUpperCase()})
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Verified Implementation ({language.toUpperCase()})
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const sol =
                                  selectedProblem.solutionCode[language] ||
                                  selectedProblem.solutionCode.python ||
                                  "";
                                navigator.clipboard.writeText(sol);
                                toast.success("Solution copied to clipboard");
                              }}
                              className="h-6 px-2 text-xs gap-1"
                            >
                              <Copy size={11} /> Copy
                            </Button>
                          </div>
                          <pre className="p-3 bg-muted/80 border border-border rounded-md text-xs font-mono overflow-x-auto max-h-96 leading-normal text-foreground">
                            {selectedProblem.solutionCode[language] ||
                              selectedProblem.solutionCode.python}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Full-Height Monaco Code Editor (7 cols) */}
        <section className="lg:col-span-7 flex flex-col bg-background min-h-0 overflow-hidden border-t lg:border-t-0">
          {/* Editor Toolbar (h-11) */}
          <div className="h-11 px-3 border-b border-border bg-card/60 flex items-center justify-between gap-2 shrink-0">
            {/* Language & Theme Selectors */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  Language:
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-xs bg-muted/70 hover:bg-muted border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  {selectedProblem.languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "python"
                        ? "Python 3"
                        : lang === "cpp"
                          ? "C++ 17"
                          : "Java 17"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-4 w-px bg-border mx-0.5" />

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                  Theme:
                </span>
                <select
                  value={editorTheme}
                  onChange={(e) => {
                    setEditorTheme(e.target.value);
                    localStorage.setItem("zap-editor-theme", e.target.value);
                  }}
                  className="text-xs bg-muted/70 hover:bg-muted border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  {EDITOR_THEME_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions & Autograder Status */}
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={copyCode}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                title="Copy code"
              >
                <Copy size={11} /> Copy
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={resetToBuggyCode}
                className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 border-border"
                title="Reset to original buggy code"
              >
                <RotateCcw size={11} /> Reset Code
              </Button>

              {/* CodeWar indicator */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted/50 border border-border text-[11px] font-mono text-muted-foreground">
                <span>Autograder Off</span>
              </div>
            </div>
          </div>

          {/* Monaco Editor Container: 100% Height & Scrollable */}
          <div className="flex-1 min-h-0 relative overflow-hidden bg-background">
            <Editor
              height="100%"
              width="100%"
              language={
                language === "cpp"
                  ? "cpp"
                  : language === "java"
                    ? "java"
                    : "python"
              }
              value={code}
              theme={editorTheme}
              onChange={(v) => handleCodeChange(v ?? "")}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                Object.entries(MONACO_THEMES).forEach(([themeName, themeData]) => {
                  monaco.editor.defineTheme(themeName, themeData as any);
                });
                monaco.editor.setTheme(editorTheme);
              }}
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                bracketPairColorization: { enabled: true },
                renderWhitespace: "selection",
                tabSize: 4,
                wordWrap: "on",
                automaticLayout: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "auto",
                  useShadows: false,
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                  alwaysConsumeMouseWheel: true,
                },
                smoothScrolling: true,
                mouseWheelZoom: false,
              }}
            />
          </div>

          {/* Bottom Status Footer (h-7) */}
          <footer className="h-7 px-3 border-t border-border bg-card/40 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
            <div className="flex items-center gap-1.5 font-mono">
              <Code2 size={12} className="text-primary" />
              <span className="truncate">
                Buggy template active for {selectedProblem.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Find the bugs & patch in-editor</span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
