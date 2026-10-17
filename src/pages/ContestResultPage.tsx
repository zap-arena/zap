import { useQuery } from "@tanstack/react-query";
import { BarChart2, CheckCircle, Clock, Home, Trophy } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import VerdictBadge from "../components/VerdictBadge";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";
import type { Contest, LeaderboardEntry, Submission } from "../types";

export default function ContestResultPage() {
  const { contestId } = useParams<{ contestId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: contest } = useQuery({
    queryKey: ["contest", contestId],
    queryFn: () => api.get<Contest>(`/contests/${contestId}`),
    enabled: !!contestId,
  });
  const { data: mySubmissions = [] } = useQuery({
    queryKey: ["my-submissions", contestId],
    queryFn: () =>
      api.get<Submission[]>(`/contests/${contestId}/my-submissions`),
    enabled: !!contestId,
  });
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["leaderboard", contestId],
    queryFn: () =>
      api.get<LeaderboardEntry[]>(`/contests/${contestId}/leaderboard`),
    enabled: !!contestId,
  });

  const myEntry = leaderboard.find((e) => e.userId === user?.id);
  const maxScore = contest?.problems.reduce((s, cp) => s + cp.maxScore, 0) || 0;

  const bestByProblem = new Map<string, Submission>();
  for (const s of mySubmissions) {
    const cur = bestByProblem.get(s.problemId);
    if (!cur || s.score > cur.score) bestByProblem.set(s.problemId, s);
  }

  const problemResults =
    contest?.problems
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((cp) => {
        const best = bestByProblem.get(cp.problemId);
        return { cp, best };
      }) || [];

  if (!contest) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        {/* Header Hero */}
        <div className="relative mb-10 text-center rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-b from-primary/10 via-card/70 to-card/40 backdrop-blur-xl p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-4 text-amber-500 shadow-lg shadow-amber-500/10">
            <Trophy size={32} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold mb-3">
            <CheckCircle size={13} /> Attempt Recorded Successfully
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
            Contest Completed!
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            {contest.name}
          </p>
        </div>

        {/* Score summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Final Score",
              value: `${myEntry?.score ?? 0} / ${maxScore}`,
              icon: Trophy,
              color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
              highlight: true,
            },
            {
              label: "Solved",
              value: `${myEntry?.solved ?? 0} / ${myEntry?.totalProblems ?? contest.problems.length}`,
              icon: CheckCircle,
              color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              label: "Submissions",
              value: String(myEntry?.submissions ?? mySubmissions.length),
              icon: BarChart2,
              color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            },
            {
              label: "Rank",
              value: myEntry?.rank ? `#${myEntry.rank}` : "—",
              icon: Clock,
              color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            },
          ].map(({ label, value, icon: Icon, color, highlight }) => (
            <div
              key={label}
              className={`bg-card/90 dark:bg-card/60 backdrop-blur-md border rounded-2xl p-5 text-center transition-all duration-300 shadow-sm ${
                highlight ? "border-primary/50 shadow-md shadow-primary/5" : "border-border/80"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 border ${color}`}
              >
                <Icon size={18} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-foreground mb-0.5">
                {value}
              </div>
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Problem results */}
        <div className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <h3 className="font-bold text-foreground">Problem Breakdown</h3>
            <span className="text-xs text-muted-foreground font-medium">
              {problemResults.length} Problems
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Problem</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-center px-4 py-3 font-semibold">Score</th>
                  <th className="text-center px-4 py-3 font-semibold">Tests</th>
                  <th className="text-center px-4 py-3 font-semibold">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {problemResults.map(({ cp, best }) => (
                  <tr key={cp.problemId} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {best?.problemTitle ?? cp.problemId}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {best ? (
                        <VerdictBadge status={best.status} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-bold">
                      <span
                        className={
                          best?.score === cp.maxScore
                            ? "text-emerald-500"
                            : best?.score
                              ? "text-amber-500"
                              : "text-muted-foreground"
                        }
                      >
                        {best?.score ?? 0}
                      </span>
                      <span className="text-muted-foreground font-normal">
                        /{cp.maxScore}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-muted-foreground font-mono">
                      {best ? `${best.passedTests}/${best.totalTests}` : "—"}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-muted-foreground font-mono">
                      {
                        mySubmissions.filter((s) => s.problemId === cp.problemId)
                          .length
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard preview */}
        <div className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
            <h3 className="font-bold text-foreground">Contest Leaderboard</h3>
            <span className="text-xs text-muted-foreground font-medium">
              {leaderboard.length} participants
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="text-center px-4 py-3 font-semibold w-16">Rank</th>
                  <th className="text-left px-6 py-3 font-semibold">Participant</th>
                  <th className="text-center px-4 py-3 font-semibold">Score</th>
                  <th className="text-center px-4 py-3 font-semibold">Solved</th>
                  <th className="text-center px-6 py-3 font-semibold hidden sm:table-cell">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {leaderboard.map((e) => (
                  <tr
                    key={e.userId}
                    className={`hover:bg-secondary/20 transition-colors ${
                      e.userId === user?.id ? "bg-primary/5 font-semibold" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`text-sm font-bold font-mono ${
                          e.rank === 1
                            ? "text-amber-500"
                            : e.rank === 2
                              ? "text-slate-400"
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
                    <td className="px-6 py-4 font-medium text-foreground">
                      {e.userName}
                      {e.userId === user?.id && (
                        <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          you
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center font-mono font-bold text-primary">
                      {e.score}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-muted-foreground font-mono">
                      {e.solved}/{e.totalProblems}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-muted-foreground font-mono hidden sm:table-cell">
                      {e.completionTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/")}
            className="gap-2 font-semibold shadow-md shadow-primary/20 px-8 h-11"
          >
            <Home size={16} /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
