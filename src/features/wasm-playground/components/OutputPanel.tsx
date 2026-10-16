import { CheckCircle2, Clock, Copy, Info, Terminal, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import type { ExecutionResult } from "../runtimes/types";

interface OutputPanelProps {
  result: ExecutionResult | null;
  isRunning?: boolean;
}

export function OutputPanel({ result, isRunning }: OutputPanelProps) {
  const handleCopy = () => {
    if (!result) return;
    const text = [result.stdout, result.stderr].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Output copied to clipboard!");
  };

  if (isRunning) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm items-center justify-center p-8 text-center text-muted-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium text-foreground">Executing locally in Web Worker...</p>
        <p className="text-xs text-muted-foreground mt-1">Zero backend traffic. Pure WebAssembly.</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm items-center justify-center p-8 text-center text-muted-foreground">
        <Terminal size={28} className="text-muted-foreground/40 mb-2" />
        <p className="text-sm font-medium">Ready for execution</p>
        <p className="text-xs text-muted-foreground mt-1">
          Click <span className="font-semibold text-primary">"Run Code"</span> or{" "}
          <span className="font-semibold text-primary">"Run Test Cases"</span> to evaluate locally.
        </p>
      </div>
    );
  }

  const isSuccess = result.status === "success";
  const isTimeout = result.status === "timeout";
  const isUnsupported = result.status === "unsupported";

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="h-9 px-3 border-b border-border bg-card/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Terminal size={13} className="text-primary" />
            Execution Output
          </span>

          {isSuccess && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 size={11} /> Success
            </span>
          )}
          {isTimeout && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Clock size={11} /> TLE (Timeout)
            </span>
          )}
          {!isSuccess && !isTimeout && !isUnsupported && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
              <XCircle size={11} /> Runtime Error
            </span>
          )}
          {isUnsupported && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Info size={11} /> Unsupported
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {result.executionTimeMs > 0 && (
            <span className="text-[11px] font-mono text-muted-foreground mr-1">
              {result.executionTimeMs}ms
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground gap-1"
          >
            <Copy size={11} />
            <span>Copy</span>
          </Button>
        </div>
      </div>

      {/* Output body */}
      <div className="flex-1 p-3 font-mono text-xs overflow-auto space-y-3">
        {result.stdout && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Standard Output (stdout)
            </div>
            <pre className="p-3 bg-muted/50 border border-border rounded-lg text-foreground overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
              {result.stdout}
            </pre>
          </div>
        )}

        {result.stderr && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-1">
              {isUnsupported ? "Technical Analysis" : "Errors & Diagnostics (stderr)"}
            </div>
            <pre
              className={`p-3 border rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed select-text ${
                isUnsupported
                  ? "bg-blue-950/20 border-blue-500/30 text-blue-300"
                  : "bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
              }`}
            >
              {result.stderr}
            </pre>
          </div>
        )}

        {!result.stdout && !result.stderr && (
          <div className="p-4 text-center text-muted-foreground italic">
            Program finished without producing any output.
          </div>
        )}
      </div>
    </div>
  );
}
