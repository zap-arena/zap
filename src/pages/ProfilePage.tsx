import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Target,
  Send,
  CheckCircle2,
  Calendar,
  Medal,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/15 text-success",
  scheduled: "bg-warning/15 text-warning",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

interface ProfileProblem {
  problemId: string;
  title: string | null;
  difficulty: string | null;
  maxScore: number;
  score: number;
  solved: boolean;
  attempted: boolean;
}

interface ProfileContest {
  contestId: string;
  name: string;
  slug: string;
  status: string;
  startTime: string;
  endTime: string;
  leaderboardVisible: boolean;
  participantStatus: string;
  startedAt: string | null;
  completedAt: string | null;
  score: number;
  maxScore: number;
  problemsSolved: number;
  totalProblems: number;
  submissions: number;
  rank: number | null;
  totalParticipants: number;
  problems: ProfileProblem[];
}

interface ProfileResponse {
  user: { id: string; name: string; email: string; role: string };
  stats: {
    contestsRegistered: number;
    contestsCompleted: number;
    problemsSolved: number;
    totalScore: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
  };
  contests: ProfileContest[];
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="card-glow rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => api.get<ProfileResponse>("/me/profile"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-24 text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-24 text-center text-muted-foreground">
          Could not load your profile.
        </div>
      </div>
    );
  }

  const { user, stats, contests } = data;
  const accuracy =
    stats.totalSubmissions > 0
      ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-xl font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground font-mono">
              {user.email}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Calendar size={14} />}
            label="Contests"
            value={stats.contestsRegistered}
          />
          <StatCard
            icon={<Target size={14} />}
            label="Problems solved"
            value={stats.problemsSolved}
          />
          <StatCard
            icon={<Trophy size={14} />}
            label="Total score"
            value={stats.totalScore}
          />
          <StatCard
            icon={<Send size={14} />}
            label="Submissions"
            value={
              <>
                {stats.totalSubmissions}
                <span className="text-sm text-muted-foreground font-normal">
                  {" "}
                  · {accuracy}% accepted
                </span>
              </>
            }
          />
        </div>

        {/* Contests */}
        <div>
          <h2 className="font-semibold mb-3">My Contests</h2>
          {contests.length === 0 ? (
            <div className="card-glow rounded-xl p-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You haven't joined any contests yet.
              </p>
              <Button
                size="sm"
                className="btn-primary"
                onClick={() => navigate("/")}
              >
                Browse contests
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contests.map((c) => (
                <div key={c.contestId} className="card-glow rounded-xl p-5">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm">{c.name}</h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${STATUS_STYLES[c.status]}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>
                          🗓 {new Date(c.startTime).toLocaleDateString()}
                        </span>
                        <span>
                          📝 {c.problemsSolved}/{c.totalProblems} solved
                        </span>
                        <span>
                          🏆 {c.score}/{c.maxScore} pts
                        </span>
                        <span>📤 {c.submissions} submissions</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {c.leaderboardVisible && c.rank !== null && (
                        <div className="text-center px-3">
                          <div className="flex items-center gap-1 text-primary">
                            <Medal size={14} />
                            <span className="text-lg font-bold">#{c.rank}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            of {c.totalParticipants}
                          </p>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => navigate(`/contest/${c.slug}`)}
                      >
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Per-problem breakdown */}
                  <div className="mt-4 border-t border-border pt-3 space-y-1.5">
                    {c.problems.map((p) => (
                      <div
                        key={p.problemId}
                        className="flex items-center gap-2 text-xs"
                      >
                        <CheckCircle2
                          size={13}
                          className={
                            p.solved
                              ? "text-success shrink-0"
                              : "text-muted-foreground/30 shrink-0"
                          }
                        />
                        <span
                          className={
                            p.solved ? "font-medium" : "text-muted-foreground"
                          }
                        >
                          {p.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-semibold ${DIFFICULTY_STYLES[p.difficulty ?? "Easy"]}`}
                        >
                          {p.difficulty}
                        </span>
                        <span className="ml-auto font-mono text-muted-foreground">
                          {p.attempted
                            ? `${p.score}/${p.maxScore}`
                            : "not attempted"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
