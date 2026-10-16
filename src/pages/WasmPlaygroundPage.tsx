import {
  ArrowLeft,
  FileCode,
  Layers,
  Play,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ThemeColorPicker from "../components/ThemeColorPicker";
import ThemeToggle from "../components/ThemeToggle";
import { ThunderLogo } from "../components/ThunderLogo";
import { Button } from "../components/ui/button";
import { CodeEditor } from "../features/wasm-playground/components/CodeEditor";
import { InputPanel } from "../features/wasm-playground/components/InputPanel";
import { LanguageSelector } from "../features/wasm-playground/components/LanguageSelector";
import { OutputPanel } from "../features/wasm-playground/components/OutputPanel";
import { RuntimeStatus } from "../features/wasm-playground/components/RuntimeStatus";
import { TestResults } from "../features/wasm-playground/components/TestResults";
import { useWasmRuntime } from "../features/wasm-playground/hooks/useWasmRuntime";
import type { Language, TestCase } from "../features/wasm-playground/runtimes/types";

// Default template source codes
const CODE_TEMPLATES: Record<Language, string> = {
  python: `# Sum of Two Numbers (Reads a and b from stdin)
import sys

try:
    line = sys.stdin.read().strip()
    if line:
        a, b = map(int, line.split())
        print(a + b)
    else:
        # Fallback demonstration
        nums = [2, 4, 6]
        print(sum(nums))
except Exception as e:
    print(f"Error: {e}")
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << a + b << '\\n';
    } else {
        cout << "Please provide two integers via stdin." << endl;
    }
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            System.out.println(a + b);
        } else {
            System.out.println("No input provided.");
        }
        sc.close();
    }
}
`,
};

// Standard test cases for sum-of-two-numbers problem
const SAMPLE_TEST_CASES: TestCase[] = [
  { id: "tc-1", name: "Sample 1", input: "2 3", expectedOutput: "5" },
  { id: "tc-2", name: "Sample 2", input: "10 20", expectedOutput: "30" },
  { id: "tc-3", name: "Sample 3", input: "-2 5", expectedOutput: "3" },
];

export default function WasmPlaygroundPage() {
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState<string>(CODE_TEMPLATES.python);
  const [stdin, setStdin] = useState<string>("2 3");
  const [activeTab, setActiveTab] = useState<"output" | "stdin" | "tests">("output");

  const {
    status,
    isRunning,
    isTesting,
    lastResult,
    testResults,
    initRuntime,
    executeCode,
    runTests,
    terminate,
    setLanguage: setRuntimeLanguage,
  } = useWasmRuntime(language);

  // Switch template when language changes
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setRuntimeLanguage(lang);
    setCode(CODE_TEMPLATES[lang]);
    setStdin("2 3");
    initRuntime(lang);
  };

  // Initialize runtime on mount
  useEffect(() => {
    initRuntime(language);
  }, [language, initRuntime]);

  const handleReset = () => {
    setCode(CODE_TEMPLATES[language]);
    toast.info("Reset code to default template");
  };

  const handleRunSingle = async () => {
    setActiveTab("output");
    await executeCode(code, stdin, 6000, language);
  };

  const handleRunTests = async () => {
    setActiveTab("tests");
    await runTests(code, SAMPLE_TEST_CASES, 6000, language);
  };

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <header className="h-12 border-b border-border bg-card/80 backdrop-blur px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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

          <Link
            to="/codewar"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">CodeWar</span>
          </Link>

          <div className="h-4 w-px bg-border mx-0.5" />

          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-foreground">
              CodeZap WASM Playground
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hidden md:inline">
              Client-Side POC
            </span>
          </div>
        </div>

        {/* Runtime status badges */}
        <div className="flex items-center gap-2">
          <RuntimeStatus
            status={status}
            isRunning={isRunning || isTesting}
            executionTimeMs={lastResult?.executionTimeMs}
          />

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

          <ThemeColorPicker size="xs" />
          <ThemeToggle size="xs" />
        </div>
      </header>

      {/* Action Toolbar */}
      <div className="h-12 border-b border-border bg-muted/20 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <LanguageSelector
            language={language}
            onSelectLanguage={handleSelectLanguage}
            disabled={isRunning || isTesting}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRunSingle}
            disabled={isRunning || isTesting}
            className="h-8 gap-1.5 bg-primary text-primary-foreground font-semibold px-3 text-xs shadow-sm hover:opacity-90"
          >
            <Play size={13} className="fill-current" />
            <span>{isRunning && !isTesting ? "Running..." : "Run Code"}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRunTests}
            disabled={isRunning || isTesting}
            className="h-8 gap-1.5 font-semibold px-3 text-xs border-primary/30 text-primary hover:bg-primary/10"
          >
            <Layers size={13} />
            <span>{isTesting ? "Testing..." : "Run Test Cases"}</span>
          </Button>

          {(isRunning || isTesting) && (
            <Button
              size="sm"
              variant="destructive"
              onClick={terminate}
              className="h-8 px-2.5 text-xs"
            >
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Split Layout */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 p-2 sm:p-3 gap-2 sm:gap-3 overflow-hidden">
        {/* Left: Code Editor (7 cols on desktop) */}
        <div className="lg:col-span-7 h-full min-h-[300px] flex flex-col">
          <CodeEditor
            language={language}
            code={code}
            onChange={setCode}
            onReset={handleReset}
            disabled={isRunning || isTesting}
          />
        </div>

        {/* Right: Output, Input & Test Cases Drawer (5 cols on desktop) */}
        <div className="lg:col-span-5 h-full flex flex-col min-h-0">
          {/* Tab buttons */}
          <div className="flex items-center justify-between border-b border-border bg-card/60 p-1 rounded-t-xl shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("output")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "output"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Terminal size={13} />
                <span>Output</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("stdin")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "stdin"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <FileCode size={13} />
                <span>Input (stdin)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tests")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "tests"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Layers size={13} />
                <span>Test Cases (3)</span>
                {testResults && (
                  <span className="text-[10px] bg-background/20 px-1 rounded">
                    {testResults.filter((t) => t.passed).length}/3
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1 min-h-0 border-x border-b border-border rounded-b-xl overflow-hidden bg-card">
            {activeTab === "output" && (
              <OutputPanel result={lastResult} isRunning={isRunning && !isTesting} />
            )}

            {activeTab === "stdin" && (
              <InputPanel
                stdin={stdin}
                onChange={setStdin}
                disabled={isRunning || isTesting}
              />
            )}

            {activeTab === "tests" && (
              <TestResults results={testResults} isTesting={isTesting} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
