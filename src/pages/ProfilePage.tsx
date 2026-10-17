import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Medal,
  Send,
  Sparkles,
  Target,
  Trophy,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import ZapLoader from "../components/ZapLoader";
import { api } from "../lib/api";

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  active: {
    label: "Live Now",
    className: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border border-border/60",
  },
  draft: {
    label: "Draft",
    className: "bg-secondary text-secondary-foreground border border-border/60",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive border border-destructive/20",
  },
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-500 bg-rose-500/10 border-rose-500/20",
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
  subtext,
  colorClass = "text-primary bg-primary/10 border-primary/20",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subtext?: string;
  colorClass?: string;
}) {
  return (
    <div className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {subtext}
          </p>
        )}
      </div>
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
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-32">
          <ZapLoader size="lg" text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-32 text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mx-auto mb-4">
            <User size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">Profile Unavailable</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Could not load your profile details at this moment. Please check your connection or sign in again.
          </p>
          <Button onClick={() => navigate("/login")} className="gap-2">
            Go to Login
          </Button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8 animate-fade-in">
        {/* User Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-r from-card/90 via-card/60 to-primary/5 backdrop-blur-xl p-6 sm:p-10 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/30 border-2 border-primary/30 flex items-center justify-center text-primary text-2xl font-black shadow-lg shadow-primary/10">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {user.name}
                  </h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  {user.email}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={13} className="text-primary" /> Active Learner
                  </span>
                  <span>•</span>
                  <span>{contests.length} Contests Participated</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/contests/list")}
                className="gap-2 font-medium"
              >
                Browse Contests
              </Button>
              <Button
                onClick={() => navigate("/codewar")}
                className="gap-2 font-medium shadow-md shadow-primary/20"
              >
                <Flame size={16} /> Enter CodeWar
              </Button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Calendar size={18} className="text-blue-500" />}
            colorClass="bg-blue-500/10 text-blue-500 border-blue-500/20"
            label="Contests Joined"
            value={stats.contestsRegistered}
            subtext={`${stats.contestsCompleted} fully finished`}
          />
          <StatCard
            icon={<Target size={18} className="text-emerald-500" />}
            colorClass="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            label="Problems Solved"
            value={stats.problemsSolved}
            subtext="Across all contests & modes"
          />
          <StatCard
            icon={<Trophy size={18} className="text-amber-500" />}
            colorClass="bg-amber-500/10 text-amber-500 border-amber-500/20"
            label="Total Score"
            value={stats.totalScore}
            subtext="Cumulative points scored"
          />
          <StatCard
            icon={<Send size={18} className="text-purple-500" />}
            colorClass="bg-purple-500/10 text-purple-500 border-purple-500/20"
            label="Submissions"
            value={stats.totalSubmissions}
            subtext={`${accuracy}% accepted accuracy`}
          />
        </div>

        {/* Contests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">My Contests</h2>
              <p className="text-xs text-muted-foreground">
                History of competitions, scores, and problem attempts
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/60">
              {contests.length} {contests.length === 1 ? "Contest" : "Contests"}
            </span>
          </div>

          {contests.length === 0 ? (
            <div className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                <Trophy size={26} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No Contests Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                You haven't participated in any contests yet. Test your problem-solving under real pressure and see where you rank!
              </p>
              <Button
                className="gap-2 shadow-md shadow-primary/20"
                onClick={() => navigate("/contests/list")}
              >
                Browse Contests <ArrowRight size={16} />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {contests.map((c) => {
                const statusMeta = STATUS_BADGES[c.status] || {
                  label: c.status,
                  className: "bg-muted text-muted-foreground border-border/60",
                };

                return (
                  <div
                    key={c.contestId}
                    className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-6 shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-border/50">
                      <div className="flex-1 min-w-[240px]">
                        <div className="flex items-center gap-2.5 flex-wrap mb-2">
                          <h3 className="font-bold text-base text-foreground">
                            {c.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusMeta.className}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} /> {new Date(c.startTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            {c.problemsSolved}/{c.totalProblems} solved
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award size={13} className="text-amber-500" />
                            {c.score}/{c.maxScore} pts
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Send size={13} />
                            {c.submissions} submissions
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {c.leaderboardVisible && c.rank !== null && (
                          <div className="text-center px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                            <div className="flex items-center gap-1 text-primary">
                              <Medal size={16} />
                              <span className="text-lg font-black">#{c.rank}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              of {c.totalParticipants} runners
                            </p>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs font-semibold hover:border-primary/40 hover:text-primary"
                          onClick={() => navigate(`/contest/${c.slug}`)}
                        >
                          View Contest <ExternalLink size={13} />
                        </Button>
                      </div>
                    </div>

                    {/* Per-problem breakdown */}
                    {c.problems && c.problems.length > 0 && (
                      <div className="mt-4 pt-1">
                        <div className="text-[11px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                          Problem Attempts
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {c.problems.map((p) => {
                            const diffStyle =
                              DIFFICULTY_STYLES[p.difficulty ?? "Easy"] ||
                              "text-muted-foreground bg-muted";

                            return (
                              <div
                                key={p.problemId}
                                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/40 border border-border/50 text-xs"
                              >
                                <CheckCircle2
                                  size={15}
                                  className={
                                    p.solved
                                      ? "text-emerald-500 shrink-0"
                                      : "text-muted-foreground/30 shrink-0"
                                  }
                                />
                                <span
                                  className={`truncate flex-1 font-medium ${
                                    p.solved ? "text-foreground" : "text-muted-foreground"
                                  }`}
                                  title={p.title ?? "Problem"}
                                >
                                  {p.title ?? "Problem"}
                                </span>
                                {p.difficulty && (
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${diffStyle}`}
                                  >
                                    {p.difficulty}
                                  </span>
                                )}
                                <span className="font-mono text-[11px] text-muted-foreground shrink-0 font-medium">
                                  {p.attempted
                                    ? `${p.score}/${p.maxScore}`
                                    : "—"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

