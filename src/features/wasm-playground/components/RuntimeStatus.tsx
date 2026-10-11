import { Cpu, Loader2, ShieldCheck, Zap } from "lucide-react";
import type { RuntimeStatusState } from "../runtimes/types";

interface RuntimeStatusProps {
  status: RuntimeStatusState;
  isRunning?: boolean;
  executionTimeMs?: number | null;
}

export function RuntimeStatus({
  status,
  isRunning,
  executionTimeMs,
}: RuntimeStatusProps) {
  const getStatusBadge = () => {
    if (isRunning) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary animate-pulse">
          <Loader2 size={12} className="animate-spin" />
          Executing Locally...
        </span>
      );
    }

    switch (status) {
      case "initializing":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-500">
            <Loader2 size={12} className="animate-spin" />
            Initializing WASM...
          </span>
        );
      case "ready":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Runtime Ready
          </span>
        );
      case "error":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            Runtime Error
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground">
            <Cpu size={12} />
            Standby (Idle)
          </span>
        );
    }
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Runs in your browser badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold text-cyan-600 dark:text-cyan-400">
        <ShieldCheck size={13} />
        <span>Runs 100% in your browser</span>
      </div>

      {getStatusBadge()}

      {typeof executionTimeMs === "number" && executionTimeMs > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-[11px] font-mono text-muted-foreground border border-border">
          <Zap size={11} className="text-amber-500" />
          <span>{executionTimeMs}ms</span>
        </div>
      )}
    </div>
  );
}
