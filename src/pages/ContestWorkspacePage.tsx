import Editor from "@monaco-editor/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Flag,
  History,
  List,
  Loader2,
  Maximize,
  Minimize,
  Play,
  RotateCcw,
  Send,
  ShieldAlert,
  Terminal,
  Trophy,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ContestTimer from "../components/ContestTimer";
import DifficultyBadge from "../components/DifficultyBadge";
import ThemeColorPicker from "../components/ThemeColorPicker";
import ThemeToggle from "../components/ThemeToggle";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import VerdictBadge from "../components/VerdictBadge";
import { useProctoring } from "../hooks/useProctoring";
import { ApiError, api } from "../lib/api";
import { EDITOR_THEME_OPTIONS, MONACO_THEMES } from "../lib/monaco-themes";
import { useAuth } from "../store/auth";
import { accentHex, useAccent } from "../store/theme";
import type {
  Contest,
  Language,
  LeaderboardEntry,
  Problem,
  Submission,
  Verdict,
} from "../types";

interface ContestNotice {
  id: string;
  message: string;
  createdAt: string;
}

const LANGUAGES: { value: Language; label: string; monacoLang: string }[] = [
  { value: "cpp", label: "C++", monacoLang: "cpp" },
  { value: "c", label: "C", monacoLang: "c" },
  { value: "java", label: "Java", monacoLang: "java" },
  { value: "python", label: "Python", monacoLang: "python" },
];

interface TestResult {
  id: string;
  label: string;
  status: "passed" | "failed" | "running";
  executionTime?: number;
  errorMessage?: string | null;
}

interface RunOutput {
  stdout: string;
  stderr: string;
  compileOutput: string;
  status: string;
  testResults: TestResult[];
}

const BUILTIN_BASE: Record<string, "vs" | "vs-dark" | "hc-black"> = {
  "vs-dark": "vs-dark",
  light: "vs",
  "hc-black": "hc-black",
};

// Overlay the app accent colour onto whichever syntax theme is active.
function decorateEditorTheme(
  monaco: any,
  themeName: string,
  accentColor: string,
) {
  const overrides: Record<string, string> = {
    "editorCursor.foreground": accentColor,
    "editor.selectionBackground": accentColor + "55",
    "editor.inactiveSelectionBackground": accentColor + "33",
    "editor.selectionHighlightBackground": accentColor + "26",
    "editorLineNumber.activeForeground": accentColor,
    "editorIndentGuide.activeBackground": accentColor + "99",
    "editorBracketMatch.border": accentColor,
    focusBorder: accentColor,
  };
  const custom = MONACO_THEMES[themeName];
  if (custom) {
    monaco.editor.defineTheme(themeName, {
      ...custom,
      colors: { ...(custom.colors ?? {}), ...overrides },
    });
    monaco.editor.setTheme(themeName);
  } else {
    const variant = `${themeName}-accent`;
    monaco.editor.defineTheme(variant, {
      base: BUILTIN_BASE[themeName] ?? "vs-dark",
      inherit: true,
      rules: [],
      colors: overrides,
    });
    monaco.editor.setTheme(variant);
  }
}

function CodeEditor({
  value,
  onChange,
  language,
  onBlockedAction,
  editorTheme,
  allowClipboard,
}: {
  value: string;
  onChange: (v: string) => void;
  language: Language;
  onBlockedAction?: (
    type: "COPY_BLOCKED" | "CUT_BLOCKED" | "PASTE_BLOCKED",
  ) => void;
  editorTheme: string;
  allowClipboard?: boolean;
}) {
  const monacoLang =
    LANGUAGES.find((l) => l.value === language)?.monacoLang ?? "plaintext";
  const { accent } = useAccent();
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    if (monacoRef.current)
      decorateEditorTheme(monacoRef.current, editorTheme, accentHex(accent));
  }, [editorTheme, accent]);

  return (
    <div className="relative h-full flex flex-col bg-muted/30 dark:bg-[#0d1117] rounded-none overflow-hidden">
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={monacoLang}
          value={value}
          theme={editorTheme}
          onChange={(v) => onChange(v ?? "")}
          onMount={(editor, monaco) => {
            monacoRef.current = monaco;
            // Load custom themes
            Object.entries(MONACO_THEMES).forEach(([themeName, themeData]) => {
              monaco.editor.defineTheme(themeName, themeData as any);
            });
            decorateEditorTheme(monaco, editorTheme, accentHex(accent));
            // Monaco handles clipboard internally, so the document listeners never fire here.
            // Admins keep native clipboard shortcuts; everyone else is blocked.
            if (!allowClipboard) {
              const block =
                (type: "COPY_BLOCKED" | "CUT_BLOCKED" | "PASTE_BLOCKED") =>
                () =>
                  onBlockedAction?.(type);
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC,
                block("COPY_BLOCKED"),
              );
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX,
                block("CUT_BLOCKED"),
              );
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
                block("PASTE_BLOCKED"),
              );
              editor.addCommand(
                monaco.KeyMod.CtrlCmd |
                  monaco.KeyMod.Shift |
                  monaco.KeyCode.KeyV,
                block("PASTE_BLOCKED"),
              );
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Insert,
                block("COPY_BLOCKED"),
              );
              editor.addCommand(
                monaco.KeyMod.Shift | monaco.KeyCode.Insert,
                block("PASTE_BLOCKED"),
              );
            }
          }}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
            contextmenu: !!allowClipboard,
          }}
        />
      </div>
      <div className="h-6 border-t border-border bg-muted/50 dark:bg-[#161b22] flex items-center px-4 gap-4 shrink-0">
        <span className="text-[11px] text-muted-foreground font-mono">
          {language.toUpperCase()}
        </span>
        <span className="text-[11px] text-muted-foreground font-mono">
          {value.split("\n").length} lines
        </span>
        <span className="text-[11px] text-muted-foreground font-mono">
          UTF-8
        </span>
      </div>
    </div>
  );
}

export default function ContestWorkspacePage() {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contest } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: () => api.get<Contest>(`/contests/${contestId}`),
    enabled: !!contestId,
  });

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session", contestId],
    queryFn: () =>
      api.get<{ started: boolean; expiresAt?: string; status?: string }>(
        `/contests/${contestId}/session`,
      ),
    enabled: !!contestId,
  });

  const { data: problems = [] } = useQuery({
    queryKey: ["contest-problems", contestId],
    queryFn: () => api.get<Problem[]>(`/contests/${contestId}/problems`),
    enabled: !!contestId && !!session?.started,
  });

  const { data: mySubmissions = [] } = useQuery({
    queryKey: ["my-submissions", contestId],
    queryFn: () =>
      api.get<Submission[]>(`/contests/${contestId}/my-submissions`),
    enabled: !!contestId && !!session?.started,
    refetchInterval: 15000,
  });

  const { data: leaderboardEntries = [] } = useQuery({
    queryKey: ["leaderboard", contestId],
    queryFn: () =>
      api.get<LeaderboardEntry[]>(`/contests/${contestId}/leaderboard`),
    enabled: !!contestId && !!session?.started,
    refetchInterval: 20000,
  });

  const [selectedProblem, setSelectedProblem] = useState<Problem | undefined>(
    undefined,
  );
  const [language, setLanguage] = useState<Language>("cpp");
  const [editorTheme, setEditorTheme] = useState(
    () => localStorage.getItem("zap-editor-theme") || "vs-dark",
  );
  const [code, setCode] = useState("");
  const codeStore = useRef<Record<string, Record<string, string>>>({});
  const [activeTab, setActiveTab] = useState<
    "problem" | "submissions" | "leaderboard"
  >("problem");
  const [bottomTab, setBottomTab] = useState<"output" | "stdin">("output");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [stdin, setStdin] = useState("");

  useEffect(() => {
    if (!selectedProblem && problems.length > 0) {
      const first = problems[0];
      setSelectedProblem(first);
      const preferredLang = first.languages[0] ?? "cpp";
      setLanguage(preferredLang);

      const stored = codeStore.current[first.id]?.[preferredLang];
      setCode(stored ?? first.boilerplates[preferredLang] ?? "");
    }
  }, [problems, selectedProblem]);

  useEffect(() => {
    if (session && !session.started && !sessionLoading) {
      toast.error("Start the contest before entering the workspace");
      navigate(`/contest/${contestId}`);
    }
  }, [session, sessionLoading, contestId, navigate]);

  // Progressive ("Code War") chains: keep the selected problem in sync with the
  // refetched list so a newly unlocked stage's statement/test cases show up
  // without resetting the editor (the code area stays the same across stages).
  useEffect(() => {
    if (!selectedProblem) return;
    const fresh = problems.find((p) => p.id === selectedProblem.id);
    if (fresh && fresh !== selectedProblem) setSelectedProblem(fresh);
  }, [problems, selectedProblem]);

  const activeStage = selectedProblem?.isProgressive
    ? selectedProblem.stages?.find(
        (s) => s.stageOrder === selectedProblem.currentStageOrder,
      )
    : undefined;

  // Solved problems tracking (derived from the best submission per problem)
  const solvedProblems = new Set(
    mySubmissions
      .filter((s) => s.status === "ACCEPTED")
      .map((s) => s.problemId),
  );

  // Proctoring: lockdown + event tracking, active for the whole attempt.
  // Admins are exempt from the clipboard lockdown so they can test problems.
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const attemptActive = !!session?.started && session.status === "in_progress";
  const selectedProblemRef = useRef<Problem | undefined>(undefined);
  selectedProblemRef.current = selectedProblem;
  const currentProblemId = useCallback(
    () => selectedProblemRef.current?.id,
    [],
  );
  const {
    isFullscreen,
    requestFullscreen,
    blocked,
    dismissBlocked,
    report: reportBlocked,
  } = useProctoring(contestId, attemptActive, currentProblemId, isAdmin);

  const { data: notifications = [] } = useQuery({
    queryKey: ["contest-notifications", contestId],
    queryFn: () =>
      api.get<ContestNotice[]>(`/contests/${contestId}/notifications`),
    enabled: !!contestId && !!session?.started,
    refetchInterval: 20000,
  });

  const [seenNotifications, setSeenNotifications] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    const unseen = notifications.filter((n) => !seenNotifications.has(n.id));
    if (unseen.length === 0) return;
    unseen.forEach((n) => { toast.info(n.message, { duration: 10000 }); });
    setSeenNotifications(
      (prev) => new Set([...prev, ...unseen.map((n) => n.id)]),
    );
  }, [notifications, seenNotifications]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await requestFullscreen();
    } else if (!attemptActive) {
      // Exiting is only allowed once the attempt is over.
      try {
        await document.exitFullscreen();
      } catch {
        /* ignore */
      }
    }
  };

  const expiresAt =
    session?.expiresAt ?? new Date(Date.now() + 60 * 60 * 1000).toISOString();

  // Autosave debounce
  const autosaveTimer = useRef<number | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );

  useEffect(() => {
    if (!selectedProblem || !contestId) return;
    setSaveStatus("unsaved");
    clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(async () => {
      setSaveStatus("saving");
      try {
        await api.put(
          `/contests/${contestId}/problems/${selectedProblem.id}/draft`,
          { language, sourceCode: code },
        );
        setSaveStatus("saved");
      } catch {
        setSaveStatus("unsaved");
      }
    }, 1500);
    return () => clearTimeout(autosaveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const saveToStore = (pid: string, lang: Language, source: string) => {
    if (!codeStore.current[pid]) codeStore.current[pid] = {};
    codeStore.current[pid][lang] = source;
  };

  const handleLanguageChange = (lang: Language) => {
    if (selectedProblem) saveToStore(selectedProblem.id, language, code);
    setLanguage(lang);
    if (selectedProblem) {
      const stored = codeStore.current[selectedProblem.id]?.[lang];
      setCode(stored ?? selectedProblem?.boilerplates[lang] ?? "");
    }
    setRunOutput(null);
  };

  const handleProblemSelect = async (problem: Problem) => {
    if (selectedProblem) saveToStore(selectedProblem.id, language, code);
    setSelectedProblem(problem);
    setRunOutput(null);
    setActiveTab("problem");
    if (!contestId) return;
    try {
      const draft = await api.get<{
        language: Language;
        sourceCode: string;
      } | null>(`/contests/${contestId}/problems/${problem.id}/draft`);
      if (draft) {
        saveToStore(problem.id, draft.language, draft.sourceCode);
        setLanguage(draft.language);
        setCode(draft.sourceCode);
        return;
      }
    } catch {
      // no draft yet — fall through to boilerplate
    }
    const preferredLang = problem.languages.includes(language)
      ? language
      : (problem.languages[0] ?? "cpp");
    setLanguage(preferredLang);
    const stored = codeStore.current[problem.id]?.[preferredLang];
    setCode(stored ?? problem.boilerplates[preferredLang] ?? "");
  };

  const handleRun = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    setRunOutput(null);
    setBottomTab("output");
    try {
      // Use sample test case input if stdin is empty
      const runInput =
        stdin.trim() || selectedProblem.examples?.[0]?.input || "";

      const result = await api.post<{
        status: string;
        stdout: string;
        stderr: string;
        compileOutput: string;
        error?: string;
      }>("/code/run", {
        problemId: selectedProblem.id,
        contestId,
        stageId: activeStage?.id,
        language,
        code,
        stdin: runInput,
      });
      setRunOutput({
        stdout: result.stdout,
        stderr: result.stderr || result.error || "",
        compileOutput: result.compileOutput,
        status: result.status,
        testResults: [],
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to run code");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem || !contestId) return;
    setSubmitting(true);
    setRunOutput(null);
    setBottomTab("output");
    try {
      const result = await api.post<{
        status: Verdict;
        passedTests: number;
        totalTests: number;
        score: number;
        compileOutput?: string;
        testResults: {
          name: string;
          hidden: boolean;
          passed: boolean;
          status: string;
          executionTime: number;
          errorMessage?: string | null;
        }[];
      }>("/submissions", {
        problemId: selectedProblem.id,
        contestId,
        stageId: activeStage?.id,
        language,
        code,
      });

      if (result.status === "ACCEPTED") {
        if (activeStage) {
          const isLastStage =
            activeStage.stageOrder ===
            (selectedProblem.totalStages ?? activeStage.stageOrder);
          toast.success(
            isLastStage
              ? "🏆 Chain complete! All stages solved."
              : "✅ Stage cleared — next challenge unlocked!",
          );
        } else {
          toast.success("✅ Accepted! All test cases passed!");
        }
      } else {
        toast.info(
          `${result.passedTests}/${result.totalTests} test cases passed`,
        );
      }

      setRunOutput({
        stdout: "",
        stderr: "",
        compileOutput: result.compileOutput || "",
        status: result.status,
        testResults: result.testResults.map((tr, i) => ({
          id: String(i),
          label: tr.name,
          status: tr.passed ? "passed" : "failed",
          executionTime: Math.round(tr.executionTime * 1000),
          errorMessage: tr.errorMessage,
        })),
      });

      queryClient.invalidateQueries({
        queryKey: ["my-submissions", contestId],
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard", contestId] });
      queryClient.invalidateQueries({ queryKey: ["session", contestId] });
      queryClient.invalidateQueries({
        queryKey: ["contest-problems", contestId],
      });
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to submit solution",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!contestId) return;
    try {
      await api.post(`/contests/${contestId}/finish`);
      // Attempt is over: release the fullscreen lock before leaving the workspace.
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          /* ignore */
        }
      }
      queryClient.invalidateQueries({ queryKey: ["session", contestId] });
      navigate(`/contest/${contestId}/result`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not finish the contest",
      );
    }
  };

  if (!contest || !session?.started) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <div className="h-12 border-b border-border bg-card flex items-center px-4 shrink-0">
          <Skeleton className="h-5 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="flex-1 flex min-h-0">
          <div className="w-52 shrink-0 border-r border-border bg-card p-3 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex-1 p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 border-b border-border bg-card flex items-center px-4 gap-4 shrink-0">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
            <Trophy size={11} className="text-primary" />
          </div>
          <span className="hidden sm:block">{contest.name}</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:block">
            {saveStatus === "saved"
              ? "✓ Saved"
              : saveStatus === "saving"
                ? "Saving…"
                : "● Unsaved"}
          </span>
          <ThemeColorPicker size="xs" />
          <ThemeToggle size="xs" />
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </Button>
          <ContestTimer
            expiresAt={expiresAt}
            onExpire={() => toast.error("Time is up! Contest auto-completed.")}
          />
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 h-7 text-xs"
            onClick={() => setShowFinishDialog(true)}
          >
            <Flag size={12} /> Finish
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: problem list */}
        <div className="w-52 shrink-0 border-r border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="flex gap-1">
              {(["problem", "submissions", "leaderboard"] as const).map(
                (tab) => {
                  const icons = {
                    problem: List,
                    submissions: History,
                    leaderboard: Trophy,
                  };
                  const Icon = icons[tab];
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      title={tab.charAt(0).toUpperCase() + tab.slice(1)}
                      className={`flex-1 h-7 rounded flex items-center justify-center transition-colors ${
                        activeTab === tab
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon size={13} />
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeTab === "problem" &&
              problems.map((p, i) => {
                const solved = p.isProgressive
                  ? (p.currentStageOrder ?? 1) > (p.totalStages ?? 1)
                  : solvedProblems.has(p.id);
                const isSelected = selectedProblem?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProblemSelect(p)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      {solved ? (
                        <CheckCircle
                          size={12}
                          className="text-success shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full border shrink-0 ${isSelected ? "border-primary" : "border-border"}`}
                        />
                      )}
                      <span
                        className={`text-xs font-semibold truncate ${isSelected ? "text-primary" : solved ? "text-success" : "text-foreground"}`}
                      >
                        {i + 1}. {p.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-5">
                      <span
                        className={`text-[10px] font-mono ${
                          p.difficulty === "Easy"
                            ? "text-success"
                            : p.difficulty === "Medium"
                              ? "text-warning"
                              : "text-destructive"
                        }`}
                      >
                        {p.difficulty}
                      </span>
                      {p.isProgressive ? (
                        <span className="text-[10px] text-primary font-mono">
                          Stage{" "}
                          {Math.min(
                            p.currentStageOrder ?? 1,
                            p.totalStages ?? 1,
                          )}
                          /{p.totalStages}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {p.maxScore}p
                        </span>
                      )}
                    </div>
                    {p.isProgressive && p.stages && (
                      <div className="flex gap-1 pl-5 mt-1">
                        {p.stages.map((s) => (
                          <span
                            key={s.id}
                            title={s.title}
                            className={`w-1.5 h-1.5 rounded-full ${
                              s.locked
                                ? "bg-border"
                                : s.stageOrder < (p.currentStageOrder ?? 1)
                                  ? "bg-success"
                                  : "bg-primary"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}

            {activeTab === "submissions" && (
              <div className="space-y-2 pt-1">
                {mySubmissions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">
                    No submissions yet
                  </p>
                )}
                {mySubmissions.map((s) => (
                  <div
                    key={s.id}
                    className="p-2 rounded-lg bg-muted border border-border"
                  >
                    <div className="text-[11px] font-medium text-foreground truncate mb-1">
                      {s.problemTitle}
                    </div>
                    <VerdictBadge status={s.status} />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {s.passedTests}/{s.totalTests}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {s.language.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "leaderboard" && (
              <div className="space-y-1 pt-1">
                {leaderboardEntries.map((e) => (
                  <div
                    key={e.userId}
                    className="px-2 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold w-5 text-center font-mono ${
                          e.rank === 1
                            ? "text-warning"
                            : e.rank === 2
                              ? "text-muted-foreground"
                              : e.rank === 3
                                ? "text-amber-600"
                                : "text-muted-foreground"
                        }`}
                      >
                        {e.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">
                          {e.userName}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {e.solved}/{e.totalProblems} solved
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary font-mono">
                        {e.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main content: resizable panels */}
        <div className="flex-1 min-w-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Problem / Content panel */}
            <ResizablePanel defaultSize={38} minSize={25}>
              <div className="h-full flex flex-col bg-background overflow-hidden">
                {selectedProblem ? (
                  <>
                    <div className="px-5 py-4 border-b border-border shrink-0">
                      <h2 className="font-bold text-base text-foreground mb-1">
                        {selectedProblem.title}
                        {activeStage && (
                          <span className="text-primary">
                            {" "}
                            — {activeStage.title}
                          </span>
                        )}
                      </h2>
                      <div className="flex items-center gap-3">
                        <DifficultyBadge
                          difficulty={selectedProblem.difficulty}
                        />
                        <span className="text-xs text-muted-foreground font-mono">
                          ⏱{" "}
                          {activeStage?.timeLimit ?? selectedProblem.timeLimit}s
                          · 💾{" "}
                          {activeStage?.memoryLimit ??
                            selectedProblem.memoryLimit}
                          MB
                        </span>
                        {activeStage?.expectedComplexity && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">
                            target: {activeStage.expectedComplexity}
                          </span>
                        )}
                        {selectedProblem.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      {selectedProblem.isProgressive && (
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Stage {activeStage?.stageOrder ?? 1} of{" "}
                          {selectedProblem.totalStages} — solve and submit to
                          unlock the next enhancement.
                        </p>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm text-foreground">
                      <div>
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                          {activeStage ? "Stage Description" : "Description"}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {activeStage?.statement ||
                            selectedProblem.description}
                        </p>
                      </div>
                      {!activeStage && (
                        <>
                          <div>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                              Input Format
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {selectedProblem.inputFormat}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                              Output Format
                            </h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {selectedProblem.outputFormat}
                            </p>
                          </div>
                        </>
                      )}
                      <div>
                        <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                          Constraints
                        </h3>
                        <pre className="text-muted-foreground font-mono text-xs leading-relaxed whitespace-pre-wrap bg-muted p-3 rounded-lg border border-border">
                          {selectedProblem.constraints}
                        </pre>
                      </div>
                      {activeStage?.testCases
                        ?.filter((tc) => !tc.hidden)
                        .map((tc, i) => (
                          <div key={tc.id}>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                              Sample {i + 1}
                            </h3>
                            <div className="space-y-2">
                              <div className="bg-muted border border-border rounded-lg p-3">
                                <div className="text-[10px] text-muted-foreground font-mono mb-1">
                                  INPUT
                                </div>
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                  {tc.input}
                                </pre>
                              </div>
                              <div className="bg-muted border border-border rounded-lg p-3">
                                <div className="text-[10px] text-muted-foreground font-mono mb-1">
                                  EXPECTED OUTPUT
                                </div>
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                  {tc.expectedOutput}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      {!activeStage &&
                        selectedProblem.examples.map((ex, i) => (
                          <div key={i}>
                            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                              Example {i + 1}
                            </h3>
                            <div className="space-y-2">
                              <div className="bg-muted border border-border rounded-lg p-3">
                                <div className="text-[10px] text-muted-foreground font-mono mb-1">
                                  INPUT
                                </div>
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                  {ex.input}
                                </pre>
                              </div>
                              <div className="bg-muted border border-border rounded-lg p-3">
                                <div className="text-[10px] text-muted-foreground font-mono mb-1">
                                  OUTPUT
                                </div>
                                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                                  {ex.output}
                                </pre>
                              </div>
                              {ex.explanation && (
                                <p className="text-xs text-muted-foreground italic">
                                  {ex.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BookOpen size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Select a problem</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-border hover:bg-primary/50 transition-colors"
            />

            {/* Editor + Output panel */}
            <ResizablePanel defaultSize={62} minSize={40}>
              <ResizablePanelGroup direction="vertical">
                {/* Editor */}
                <ResizablePanel defaultSize={65} minSize={30}>
                  <div className="h-full flex flex-col bg-background">
                    {/* Editor toolbar */}
                    <div className="h-9 border-b border-border bg-card flex items-center px-3 gap-3 shrink-0">
                      <Select
                        value={language}
                        onValueChange={(v) =>
                          handleLanguageChange(v as Language)
                        }
                      >
                        <SelectTrigger className="h-6 w-28 text-xs bg-muted border-border focus:border-primary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {LANGUAGES.map((l) => (
                            <SelectItem
                              key={l.value}
                              value={l.value}
                              className="text-xs cursor-pointer"
                            >
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={editorTheme}
                        onValueChange={(v) => {
                          setEditorTheme(v);
                          localStorage.setItem("zap-editor-theme", v);
                        }}
                      >
                        <SelectTrigger className="h-6 w-32 text-xs bg-muted border-border focus:border-primary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {EDITOR_THEME_OPTIONS.map((t) => (
                            <SelectItem
                              key={t.value}
                              value={t.value}
                              className="text-xs cursor-pointer"
                            >
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex-1" />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCode(
                              selectedProblem?.boilerplates[language] ?? "",
                            );
                            toast.info("Reset to boilerplate");
                          }}
                          disabled={running || submitting}
                          title="Reset to boilerplate"
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                        >
                          <RotateCcw size={11} /> Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleRun}
                          disabled={running || submitting}
                          className="h-6 px-3 text-xs text-success border-success/30 hover:bg-success/10 gap-1"
                        >
                          {running ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Play size={11} />
                          )}
                          Run
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSubmit}
                          disabled={running || submitting}
                          className="h-6 px-3 text-xs btn-primary gap-1"
                        >
                          {submitting ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <Send size={11} />
                          )}
                          Submit
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <CodeEditor
                        value={code}
                        language={language}
                        editorTheme={editorTheme}
                        onBlockedAction={reportBlocked}
                        allowClipboard={isAdmin}
                        onChange={(v) => {
                          setCode(v);
                          if (selectedProblem)
                            saveToStore(selectedProblem.id, language, v);
                        }}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle
                  withHandle
                  className="bg-border hover:bg-primary/50 transition-colors"
                />

                {/* Output panel */}
                <ResizablePanel defaultSize={35} minSize={15}>
                  <Tabs
                    value={bottomTab}
                    onValueChange={(v) => setBottomTab(v as "output" | "stdin")}
                    className="h-full flex flex-col bg-background"
                  >
                    <div className="h-9 border-b border-border bg-card flex items-center px-3 gap-1 shrink-0">
                      <TabsList className="h-7 bg-muted">
                        <TabsTrigger
                          value="output"
                          className="text-[11px] h-5 px-2"
                        >
                          <Terminal size={11} className="mr-1" /> Output
                        </TabsTrigger>
                        <TabsTrigger
                          value="stdin"
                          className="text-[11px] h-5 px-2"
                        >
                          Custom Input
                        </TabsTrigger>
                      </TabsList>
                      {(running || submitting) && (
                        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <Loader2 size={10} className="animate-spin" />
                          {running ? "Running…" : "Judging…"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3">
                      {bottomTab === "stdin" && (
                        <textarea
                          value={stdin}
                          onChange={(e) => setStdin(e.target.value)}
                          placeholder="Custom stdin input..."
                          className="w-full h-full bg-transparent text-foreground font-mono text-xs outline-none resize-none placeholder-muted-foreground"
                        />
                      )}

                      {bottomTab === "output" &&
                        !runOutput &&
                        !running &&
                        !submitting && (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Terminal size={24} className="mb-2 opacity-40" />
                            <p className="text-xs">
                              Run or submit to see output
                            </p>
                          </div>
                        )}

                      {bottomTab === "output" && runOutput && (
                        <div className="space-y-3">
                          {/* Test results grid (submissions only) */}
                          {runOutput.testResults.length > 0 && (
                            <div>
                              <div className="text-[10px] text-muted-foreground font-mono mb-2 uppercase tracking-wider">
                                Test Cases —{" "}
                                {
                                  runOutput.testResults.filter(
                                    (r) => r.status === "passed",
                                  ).length
                                }
                                /{runOutput.testResults.length} Passed
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {runOutput.testResults.map((r, i) => (
                                  <div
                                    key={r.id}
                                    title={r.errorMessage ?? r.label}
                                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono ${
                                      r.status === "passed"
                                        ? "verdict-accepted"
                                        : "verdict-wrong"
                                    }`}
                                  >
                                    {r.status === "passed" ? (
                                      <CheckCircle size={10} />
                                    ) : (
                                      <XCircle size={10} />
                                    )}
                                    <span>#{i + 1}</span>
                                    {r.executionTime !== undefined && (
                                      <span className="opacity-70">
                                        {r.executionTime}ms
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {runOutput.status &&
                            runOutput.testResults.length === 0 && (
                              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                Status: {runOutput.status}
                              </div>
                            )}

                          {runOutput.compileOutput && (
                            <div>
                              <div className="text-[10px] text-warning font-mono mb-1 uppercase tracking-wider">
                                Compile Output
                              </div>
                              <pre className="text-xs font-mono text-warning bg-warning/5 p-2 rounded border border-warning/20 whitespace-pre-wrap">
                                {runOutput.compileOutput}
                              </pre>
                            </div>
                          )}

                          {runOutput.stdout && (
                            <div>
                              <div className="text-[10px] text-muted-foreground font-mono mb-1 uppercase tracking-wider">
                                Stdout
                              </div>
                              <pre className="text-xs font-mono text-foreground bg-muted p-2 rounded border border-border whitespace-pre-wrap">
                                {runOutput.stdout}
                              </pre>
                            </div>
                          )}

                          {runOutput.stderr && (
                            <div>
                              <div className="text-[10px] text-destructive font-mono mb-1 uppercase tracking-wider">
                                Stderr
                              </div>
                              <pre className="text-xs font-mono text-destructive bg-destructive/5 p-2 rounded border border-destructive/20 whitespace-pre-wrap">
                                {runOutput.stderr}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Tabs>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Finish Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" /> Finish
              Contest?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You still have time remaining. You will not be able to modify your
              solutions after finishing. Are you sure you want to finish?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFinishDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleFinish}
            >
              Finish Contest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blocked action notice (copy / paste / escape / devtools) */}
      <Dialog
        open={!!blocked}
        onOpenChange={(open) => !open && dismissBlocked()}
      >
        <DialogContent
          className="bg-card border-border max-w-sm"
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-warning" />{" "}
              {blocked?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {blocked?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="btn-primary" onClick={dismissBlocked}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen guard - blocks the workspace until fullscreen is restored */}
      {attemptActive && !isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="card-glow rounded-xl p-8 max-w-md text-center space-y-4">
            <ShieldAlert size={40} className="text-warning mx-auto" />
            <h2 className="text-xl font-bold">Fullscreen is required</h2>
            <p className="text-sm text-muted-foreground">
              This contest can only be taken in fullscreen mode. Leaving
              fullscreen has been recorded. Return to fullscreen to continue —
              your timer is still running.
            </p>
            <Button className="btn-primary w-full" onClick={requestFullscreen}>
              <Maximize size={14} className="mr-2" /> Re-enter fullscreen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
