import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Lock,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import ZapLoader from "../components/ZapLoader";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../store/auth";
import type { Contest } from "../types";

interface ContestSession {
  started: boolean;
  status?: string;
  score?: number;
  problemsSolved?: number;
  totalSubmissions?: number;
}

export default function ContestEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest", slug],
    queryFn: () => api.get<Contest>(`/contests/${slug}`),
    enabled: !!slug,
    retry: false,
  });

  const { data: session } = useQuery({
    queryKey: ["session", contest?.id],
    queryFn: () => api.get<ContestSession>(`/contests/${contest?.id}/session`),
    enabled: !!contest?.id && !!user,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ZapLoader size="lg" text="Loading contest..." />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Contest Not Found</h2>
          <p className="text-muted-foreground">
            This contest link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const hours = Math.floor(contest.duration / 60);
  const mins = contest.duration % 60;
  const durationStr =
    hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins}m`;

  const finished =
    session?.started &&
    (session.status === "completed" || session.status === "auto_completed");
  const inProgress = session?.started && session.status === "in_progress";

  const handleStart = async () => {
    if (!user) {
      navigate(`/login?redirect=/contest/${slug}`);
      return;
    }
    // Must fire synchronously inside the click: awaiting first consumes the user
    // gesture and the browser then rejects the fullscreen request.
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen is best-effort; the workspace still prompts for it.
    }
    setStarting(true);
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }

      await api.post(`/contests/${contest.id}/start`);
      await queryClient.invalidateQueries({
        queryKey: ["session", contest.id],
      });
      toast.success(
        inProgress ? "Resuming your attempt" : "Contest started! Good luck!",
      );
      navigate(`/contest/${contest.id}/workspace`);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not start the contest",
      );
    } finally {
      setStarting(false);
    }
  };

  const statusLabel = {
    active: "Live",
    scheduled: "Upcoming",
    completed: "Ended",
    draft: "Draft",
    cancelled: "Cancelled",
  }[contest.status];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 animate-fade-in">
        {/* Header Hero Banner */}
        <div className="relative mb-8 rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-r from-card/90 via-card/60 to-primary/5 backdrop-blur-xl p-6 sm:p-10 shadow-sm">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  contest.status === "active"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : contest.status === "completed"
                      ? "bg-muted text-muted-foreground border border-border/60"
                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${contest.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`}
                />
                {statusLabel}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              {contest.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-2xl">
              {contest.description}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Clock,
              label: "Duration",
              value: durationStr,
              color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            },
            {
              icon: BookOpen,
              label: "Problems",
              value: String(contest.problemCount),
              color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              icon: Trophy,
              label: "Max Score",
              value: String(contest.maxScore),
              color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-primary/40 rounded-2xl p-5 text-center transition-all duration-300 shadow-sm"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 border ${color}`}
              >
                <Icon size={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
                {value}
              </div>
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Already-completed notice */}
        {finished && (
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-6 mb-8 shadow-sm">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Lock size={18} className="text-amber-500" /> You have already completed this contest
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Only one attempt is allowed. Your submitted attempt has been recorded.
            </p>
            <div className="flex items-center gap-6 pt-3 border-t border-amber-500/20">
              <div>
                <div className="text-2xl font-black text-amber-500">
                  {session?.score ?? 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Final score</div>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">
                  {session?.problemsSolved ?? 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Problems solved
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground">
                  {session?.totalSubmissions ?? 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Submissions</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-primary" /> Contest Guidelines & Rules
          </h3>
          {contest.instructions?.trim() && (
            <p className="text-sm text-foreground whitespace-pre-line mb-4 pb-4 border-b border-border/60">
              {contest.instructions}
            </p>
          )}
          <ul className="space-y-3">
            {[
              "The problem set is revealed only after you start the contest.",
              "You get one attempt: once you finish, the contest cannot be re-entered.",
              "You can sign out and back in during the contest — your timer keeps running.",
              "The contest runs in fullscreen and your activity is monitored until you finish.",
              "You can submit multiple times — only your best submission counts.",
              "Hidden test cases are used for final evaluation and scoring.",
              contest.scoringMode === "partial"
                ? "Partial scoring: score is proportional to test cases passed."
                : "Full scoring: all test cases must pass to earn points.",
              "Submissions made after the contest end time are not scored.",
            ].map((inst) => (
              <li
                key={inst}
                className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed"
              >
                <CheckCircle
                  size={15}
                  className="text-emerald-500 shrink-0 mt-0.5"
                />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleStart}
            disabled={starting || finished || contest.status === "completed"}
            className="h-12 px-12 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            {starting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {inProgress ? "Resuming…" : "Starting Contest…"}
              </>
            ) : finished ? (
              <>
                <Lock size={16} />
                Attempt Completed
              </>
            ) : contest.status === "completed" ? (
              "Contest Ended"
            ) : inProgress ? (
              "▶ Resume Contest"
            ) : (
              "🚀 Start Contest"
            )}
          </Button>
          {!user && (
            <p className="text-sm text-muted-foreground">
              You'll be asked to <span className="text-primary font-semibold">sign in</span>{" "}
              before starting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
