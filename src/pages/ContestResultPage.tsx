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
    <div
      className="min-h-screen bg-background"
      style={{ background: "var(--gradient-glow), hsl(var(--background))" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Trophy size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Contest Completed!</h1>
          <p className="text-muted-foreground">{contest.name}</p>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Final Score",
              value: `${myEntry?.score ?? 0} / ${maxScore}`,
              icon: Trophy,
              highlight: true,
            },
            {
              label: "Solved",
              value: `${myEntry?.solved ?? 0} / ${myEntry?.totalProblems ?? contest.problems.length}`,
              icon: CheckCircle,
            },
            {
              label: "Submissions",
              value: String(myEntry?.submissions ?? mySubmissions.length),
              icon: BarChart2,
            },
            {
              label: "Rank",
              value: myEntry?.rank ? `#${myEntry.rank}` : "—",
              icon: Clock,
            },
          ].map(({ label, value, icon: Icon, highlight }) => (
            <div
              key={label}
              className={`card-glow rounded-xl p-4 text-center ${highlight ? "border-primary/30" : ""}`}
            >
              <Icon
                size={18}
                className={`mx-auto mb-2 ${highlight ? "text-primary" : "text-muted-foreground"}`}
              />
              <div
                className={`text-xl font-bold mb-0.5 ${highlight ? "text-primary" : ""}`}
              >
                {value}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Problem results */}
        <div className="card-glow rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold">Problem Results</h3>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Problem</th>
                <th className="text-center">Status</th>
                <th className="text-center">Score</th>
                <th className="text-center">Tests</th>
                <th className="text-center">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {problemResults.map(({ cp, best }) => (
                <tr key={cp.problemId}>
                  <td className="font-medium">
                    {best?.problemTitle ?? cp.problemId}
                  </td>
                  <td className="text-center">
                    {best ? (
                      <VerdictBadge status={best.status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="text-center font-mono text-sm">
                    <span
                      className={
                        best?.score === cp.maxScore
                          ? "text-success"
                          : best?.score
                            ? "text-warning"
                            : "text-muted-foreground"
                      }
                    >
                      {best?.score ?? 0}
                    </span>
                    <span className="text-muted-foreground">
                      /{cp.maxScore}
                    </span>
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono">
                    {best ? `${best.passedTests}/${best.totalTests}` : "—"}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono">
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

        {/* Leaderboard preview */}
        <div className="card-glow rounded-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">Leaderboard</h3>
            <span className="text-xs text-muted-foreground">
              {leaderboard.length} participants
            </span>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-center w-12">Rank</th>
                <th className="text-left">Participant</th>
                <th className="text-center">Score</th>
                <th className="text-center">Solved</th>
                <th className="text-center hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((e) => (
                <tr
                  key={e.userId}
                  className={e.userId === user?.id ? "bg-primary/5" : ""}
                >
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
                  <td className="font-medium">
                    {e.userName}
                    {e.userId === user?.id && (
                      <span className="ml-2 text-xs text-primary">(you)</span>
                    )}
                  </td>
                  <td className="text-center font-mono font-bold text-sm text-primary">
                    {e.score}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono">
                    {e.solved}/{e.totalProblems}
                  </td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden sm:table-cell">
                    {e.completionTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/")} className="gap-2 btn-primary">
            <Home size={16} /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
