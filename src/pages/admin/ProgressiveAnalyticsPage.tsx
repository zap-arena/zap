import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type {
  BehaviorPattern,
  Contest,
  ParticipantAnalytics,
} from "../../types";

const PATTERN_LABEL: Record<BehaviorPattern, string> = {
  optimal_from_start: "Optimal from the start",
  brute_then_optimized: "Brute force, then optimized",
  shortcut_then_rework: "Shortcut early, reworked later",
  struggling: "Struggling throughout",
};

const PATTERN_COLOR: Record<BehaviorPattern, string> = {
  optimal_from_start: "text-success bg-success/10",
  brute_then_optimized: "text-info bg-info/10",
  shortcut_then_rework: "text-warning bg-warning/10",
  struggling: "text-destructive bg-destructive/10",
};

const APPROACH_LABEL: Record<string, string> = {
  brute_force: "Brute force",
  data_structure: "Data structure / DSA",
  mixed: "Mixed",
  unclear: "Unclear",
};

export default function ProgressiveAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: contest } = useQuery({
    queryKey: ["admin-contest", id],
    queryFn: () => api.get<Contest>(`/admin/contests/${id}`),
    enabled: !!id,
  });
  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["admin-progressive-analytics", id],
    queryFn: () =>
      api.get<ParticipantAnalytics[]>(
        `/admin/contests/${id}/progressive-analytics`,
      ),
    enabled: !!id,
  });

  const toggle = (userId: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/contests/${id}`)}
            className="h-8 w-8"
          >
            <ArrowLeft size={16} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain size={20} className="text-primary" /> Solving Behavior
              Analytics
            </h1>
            <p className="text-muted-foreground text-sm">
              {contest?.name ?? "Progressive contest"} — how each student
              approached the chain (admin-only, does not affect scores).
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-10">
            Loading…
          </div>
        )}
        {!isLoading && participants.length === 0 && (
          <div className="card-glow rounded-xl p-8 text-center text-muted-foreground text-sm">
            No participants have started this contest yet.
          </div>
        )}

        {participants.map((p) => (
          <div key={p.userId} className="card-glow rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(p.userId)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="text-left">
                <div className="font-semibold text-sm">{p.userName}</div>
                <div className="text-xs text-muted-foreground">
                  {p.chains.length} chain(s) attempted
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.chains.map((c) => (
                  <span
                    key={c.problemId}
                    className={`text-[10px] px-2 py-1 rounded-full font-mono ${PATTERN_COLOR[c.pattern]}`}
                  >
                    {PATTERN_LABEL[c.pattern]} · score {c.behaviorScore}
                  </span>
                ))}
                {expanded.has(p.userId) ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </button>

            {expanded.has(p.userId) && (
              <div className="border-t border-border divide-y divide-border">
                {p.chains.map((chain) => (
                  <div key={chain.problemId} className="px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">
                        {chain.problemTitle}
                      </h4>
                      <div className="flex items-center gap-2">
                        {chain.averageCodeReuse != null && (
                          <span className="text-[11px] px-2 py-1 rounded-full font-mono bg-muted text-muted-foreground">
                            avg code reuse{" "}
                            {Math.round(chain.averageCodeReuse * 100)}%
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-mono ${PATTERN_COLOR[chain.pattern]}`}
                        >
                          {PATTERN_LABEL[chain.pattern]}
                        </span>
                      </div>
                    </div>
                    <table className="w-full data-table text-xs">
                      <thead>
                        <tr>
                          <th className="text-left">Stage</th>
                          <th className="text-center">Solved</th>
                          <th className="text-center">Attempts</th>
                          <th className="text-center">Runs</th>
                          <th className="text-center">Errors resolved</th>
                          <th className="text-center">Time to solve</th>
                          <th className="text-center">Reused</th>
                          <th className="text-center">Reworked</th>
                          <th className="text-left">Approach</th>
                          <th className="text-center">Complexity (target)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chain.stages.map((s) => (
                          <tr key={s.stageId}>
                            <td>Stage {s.stageOrder}</td>
                            <td className="text-center">
                              {s.solved ? "✓" : "—"}
                            </td>
                            <td className="text-center font-mono">
                              {s.attempts}
                            </td>
                            <td className="text-center font-mono">{s.runs}</td>
                            <td className="text-center font-mono">
                              {s.errorsResolved}/{s.errorsSeen.length}
                            </td>
                            <td className="text-center font-mono">
                              {s.timeToSolveSeconds != null
                                ? `${Math.round(s.timeToSolveSeconds)}s`
                                : "—"}
                            </td>
                            <td
                              className={`text-center font-mono ${
                                s.codeReuse == null
                                  ? ""
                                  : s.codeReuse >= 0.6
                                    ? "text-success"
                                    : s.codeReuse <= 0.25
                                      ? "text-warning"
                                      : ""
                              }`}
                              title="Share of the previous stage's accepted solution kept"
                            >
                              {s.codeReuse != null
                                ? `${Math.round(s.codeReuse * 100)}%`
                                : "—"}
                            </td>
                            <td
                              className="text-center font-mono"
                              title="How much of this stage's own code changed before it passed"
                            >
                              {Math.round(s.codeChurn * 100)}%
                            </td>
                            <td className="text-left">
                              {s.approach ? (
                                <div className="flex flex-col gap-0.5">
                                  <span
                                    className={`font-mono ${
                                      s.approach.label === "brute_force"
                                        ? "text-destructive"
                                        : s.approach.label === "data_structure"
                                          ? "text-success"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    {APPROACH_LABEL[s.approach.label]}
                                  </span>
                                  {s.approach.techniques.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground">
                                      {s.approach.techniques.join(", ")}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="text-center font-mono">
                              {s.complexity?.label ?? "—"} (
                              {s.expectedComplexity ?? "?"})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
