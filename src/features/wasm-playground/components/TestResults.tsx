import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { TestCaseResult } from "../runtimes/types";

interface TestResultsProps {
  results: TestCaseResult[] | null;
  isTesting?: boolean;
}

export function TestResults({ results, isTesting }: TestResultsProps) {
  if (isTesting) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-card border border-border rounded-xl">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium text-foreground">Running Test Suite Locally...</p>
        <p className="text-xs text-muted-foreground mt-1">
          Evaluating each test case sequentially inside WebAssembly worker.
        </p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-card border border-border rounded-xl text-muted-foreground">
        <p className="text-sm font-medium">No test results yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click <span className="text-primary font-semibold">"Run Test Cases"</span> to evaluate all cases.
        </p>
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Test summary header */}
      <div className="p-3 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-foreground">Test Suite Evaluation</span>
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              allPassed
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {allPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {passedCount} / {totalCount} Passed
          </span>
        </div>
      </div>

      {/* Test cases list */}
      <div className="flex-1 p-3 overflow-auto space-y-3 font-mono text-xs">
        {results.map((res, idx) => (
          <div
            key={res.testCase.id}
            className={`border rounded-lg p-3 transition-colors ${
              res.passed
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-destructive/5 border-destructive/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">
                  Case #{idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded border ${
                    res.passed
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {res.passed ? "Passed" : res.status === "unsupported" ? "Unsupported" : "Wrong Answer"}
                </span>
              </div>

              {res.executionTimeMs > 0 && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock size={10} />
                  {res.executionTimeMs}ms
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Input</span>
                <pre className="p-2 bg-muted/60 border border-border rounded mt-1 text-foreground overflow-x-auto whitespace-pre-wrap">
                  {res.testCase.input || "(empty)"}
                </pre>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Expected</span>
                <pre className="p-2 bg-muted/60 border border-border rounded mt-1 text-foreground overflow-x-auto whitespace-pre-wrap">
                  {res.testCase.expectedOutput}
                </pre>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Actual</span>
                <pre
                  className={`p-2 border rounded mt-1 overflow-x-auto whitespace-pre-wrap ${
                    res.passed
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
                  }`}
                >
                  {res.actualOutput || (res.errorMessage ? "Error" : "(empty)")}
                </pre>
              </div>
            </div>

            {res.errorMessage && (
              <div className="mt-2 text-destructive text-[11px] bg-destructive/10 border border-destructive/20 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                {res.errorMessage}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
