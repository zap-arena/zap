import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Trophy,
  Users,
  BarChart2,
  Clock,
  ShieldAlert,
  Brain,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import VerdictBadge from "../../components/VerdictBadge";
import { api } from "../../lib/api";
import type {
  Contest,
  Submission,
  LeaderboardEntry,
  ParticipantStatus,
} from "../../types";
import { toast } from "sonner";

interface AdminParticipant {
  id: string;
  userId: string;
  status: ParticipantStatus;
}

interface ActivitySummary {
  userId: string;
  userName: string | null;
  events: Record<string, number>;
  total: number;
}

interface ActivityEvent {
  id: string;
  userId: string;
  userName: string | null;
  eventType: string;
  occurredAt: string;
}

/** Event types that indicate a possible integrity issue, shown first. */
const FLAGGED_EVENTS = [
  "FULLSCREEN_EXITED",
  "TAB_HIDDEN",
  "PASTE_BLOCKED",
  "COPY_BLOCKED",
  "CUT_BLOCKED",
  "DEVTOOLS_ATTEMPT",
  "ESCAPE_PRESSED",
  "CONTEXT_MENU_BLOCKED",
];

export default function AdminContestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contest } = useQuery({
    queryKey: ["admin-contest", id],
    queryFn: () => api.get<Contest>(`/admin/contests/${id}`),
    enabled: !!id,
  });
  const { data: participants = [] } = useQuery({
    queryKey: ["admin-participants", id],
    queryFn: () =>
      api.get<AdminParticipant[]>(`/admin/contests/${id}/participants`),
    enabled: !!id,
  });
  const { data: submissions = [] } = useQuery({
    queryKey: ["admin-contest-submissions", id],
    queryFn: () => api.get<Submission[]>(`/admin/submissions?contestId=${id}`),
    enabled: !!id,
  });
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["admin-contest-leaderboard", id],
    queryFn: () => api.get<LeaderboardEntry[]>(`/admin/contests/${id}/results`),
    enabled: !!id,
  });
  const { data: activitySummary = [] } = useQuery({
    queryKey: ["admin-contest-activity-summary", id],
    queryFn: () =>
      api.get<ActivitySummary[]>(`/admin/contests/${id}/activity/summary`),
    enabled: !!id,
  });
  const { data: activity = [] } = useQuery({
    queryKey: ["admin-contest-activity", id],
    queryFn: () =>
      api.get<ActivityEvent[]>(`/admin/contests/${id}/activity?limit=100`),
    enabled: !!id,
  });

  if (!contest)
    return (
      <AdminLayout>
        <div className="p-8 text-center text-muted-foreground">Loading…</div>
      </AdminLayout>
    );

  const maxScore = contest.problems.reduce((s, cp) => s + cp.maxScore, 0);

  const handleExport = async (fmt: "csv" | "xlsx") => {
    try {
      await api.download(
        `/admin/contests/${id}/results/export?format=${fmt}`,
        `${contest.slug}-results.${fmt}`,
      );
      toast.success(`${fmt.toUpperCase()} export downloaded`);
    } catch {
      toast.error(`Failed to export ${fmt.toUpperCase()}`);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/contests")}
            className="h-8 w-8"
          >
            <ArrowLeft size={16} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{contest.name}</h1>
            <p className="text-muted-foreground text-sm">
              Contest results and participant management
            </p>
          </div>
          <div className="flex items-center gap-2">
            {contest.mode === "progressive" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate(`/admin/contests/${id}/progressive-analytics`)
                }
                className="gap-1.5"
              >
                <Brain size={13} /> Solving Behavior
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("csv")}
              className="gap-1.5"
            >
              <Download size={13} /> CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("xlsx")}
              className="gap-1.5"
            >
              <Download size={13} /> XLSX
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Participants", value: participants.length },
            {
              icon: BarChart2,
              label: "Submissions",
              value: submissions.length,
            },
            { icon: Trophy, label: "Max Score", value: maxScore },
            { icon: Clock, label: "Duration", value: `${contest.duration}m` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-glow rounded-xl p-4 text-center">
              <Icon size={16} className="text-primary mx-auto mb-2" />
              <div className="text-xl font-bold mb-0.5">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Status breakdown */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              label: "Completed",
              count: participants.filter(
                (p) =>
                  p.status === "completed" || p.status === "auto_completed",
              ).length,
              color: "text-success",
            },
            {
              label: "In Progress",
              count: participants.filter((p) => p.status === "in_progress")
                .length,
              color: "text-info",
            },
            {
              label: "Not Started",
              count: participants.filter((p) => p.status === "not_started")
                .length,
              color: "text-muted-foreground",
            },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="card-glow rounded-xl px-5 py-4 flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className={`text-2xl font-bold ${color}`}>{count}</span>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="card-glow rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy size={14} className="text-primary" />
              Leaderboard
            </h3>
            <span className="text-xs text-muted-foreground">
              {leaderboard.length} entries
            </span>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-center w-12">Rank</th>
                <th className="text-left">Participant</th>
                <th className="text-center">Score</th>
                <th className="text-center hidden sm:table-cell">Solved</th>
                <th className="text-center hidden md:table-cell">
                  Submissions
                </th>
                <th className="text-center hidden md:table-cell">Duration</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((e) => (
                <tr key={e.userId}>
                  <td className="text-center">
                    <span
                      className={`text-sm font-bold font-mono ${
                        e.rank === 1
                          ? "text-warning"
                          : e.rank === 2
                            ? "text-muted-foreground"
                            : e.rank === 3
                              ? "text-amber-600"
                              : ""
                      }`}
                    >
                      {e.rank === 1
                        ? "🥇"
                        : e.rank === 2
                          ? "🥈"
                          : e.rank === 3
                            ? "🥉"
                            : `#${e.rank}`}
                    </span>
                  </td>
                  <td>
                    <p className="font-medium text-sm">{e.userName}</p>
                  </td>
                  <td className="text-center font-mono font-bold text-primary">
                    {e.score}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden sm:table-cell">
                    {e.solved}/{e.totalProblems}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden md:table-cell">
                    {e.submissions}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden md:table-cell">
                    {e.completionTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* All submissions */}
        <div className="card-glow rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold">All Submissions</h3>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Problem</th>
                <th className="text-center">Lang</th>
                <th className="text-center">Status</th>
                <th className="text-center">Score</th>
                <th className="text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td className="text-xs">{s.userId}</td>
                  <td className="text-sm font-medium">{s.problemTitle}</td>
                  <td className="text-center text-xs font-mono uppercase">
                    {s.language}
                  </td>
                  <td className="text-center">
                    <VerdictBadge status={s.status} />
                  </td>
                  <td className="text-center font-mono font-bold text-primary">
                    {s.score}
                  </td>
                  <td className="text-right text-xs text-muted-foreground font-mono">
                    {new Date(s.submittedAt).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proctoring activity */}
      <div className="p-6 pt-0 max-w-7xl mx-auto space-y-4">
        <div className="card-glow rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <ShieldAlert size={14} className="text-warning" /> Proctoring
              Activity
            </h3>
            <span className="text-xs text-muted-foreground">
              {activitySummary.reduce((s, a) => s + a.total, 0)} events tracked
            </span>
          </div>

          {activitySummary.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No activity recorded yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {activitySummary.map((a) => (
                <div key={a.userId} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">
                      {a.userName ?? a.userId}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {a.total} events
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FLAGGED_EVENTS.filter((t) => a.events[t]).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-destructive/15 text-destructive"
                      >
                        {t.replace(/_/g, " ").toLowerCase()} × {a.events[t]}
                      </span>
                    ))}
                    {Object.keys(a.events)
                      .filter((t) => !FLAGGED_EVENTS.includes(t))
                      .map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {t.replace(/_/g, " ").toLowerCase()} × {a.events[t]}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {activity.length > 0 && (
          <div className="card-glow rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold">Recent Events</h3>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {activity.map((e) => (
                <div
                  key={e.id}
                  className="px-5 py-2 flex items-center gap-3 text-xs"
                >
                  <span className="font-medium w-40 truncate">
                    {e.userName ?? e.userId}
                  </span>
                  <span
                    className={`font-mono ${FLAGGED_EVENTS.includes(e.eventType) ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {e.eventType.replace(/_/g, " ").toLowerCase()}
                  </span>
                  <span className="ml-auto text-muted-foreground font-mono">
                    {new Date(e.occurredAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
