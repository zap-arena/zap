import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Loader2,
  Medal,
  Percent,
  Radio,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import UpgradeModal from "../components/UpgradeModal";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { usePremiumStatus } from "../lib/premiumStore";
import { DEFAULT_COUPONS } from "../lib/razorpay";

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
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isPremium?: boolean;
    premiumPlan?: string | null;
    premiumExpiresAt?: string | null;
  };
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [activeCouponForModal, setActiveCouponForModal] = useState<
    string | undefined
  >(undefined);
  const [expandedContestId, setExpandedContestId] = useState<string | null>(
    null,
  );

  const localPremium = usePremiumStatus();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => api.get<ProfileResponse>("/me/profile"),
  });

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied to clipboard`);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2200);
  };

  const handleApplyCouponAndBuy = (code: string) => {
    setActiveCouponForModal(code);
    setUpgradeOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-32 flex flex-col items-center justify-center gap-3">
          <Loader2 size={28} className="animate-spin text-primary" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Fetching telemetry...
          </span>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-32 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            !
          </div>
          <p className="text-sm font-mono text-muted-foreground">
            Error loading user telemetry profile.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { user, stats, contests } = data;
  const isPremiumUser = Boolean(user.isPremium || localPremium.isPremium);
  const premiumPlanName = user.premiumPlan || localPremium.plan || "pro_annual";
  const premiumExpiresAtStr = user.premiumExpiresAt || localPremium.expiresAt;

  // Validity calculations
  let validityDaysRemaining: number | null = null;
  let formattedExpiryDate: string | null = null;
  let validityProgressPercent = 100;

  if (premiumExpiresAtStr) {
    const expiryDate = new Date(premiumExpiresAtStr);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    validityDaysRemaining = Math.max(
      0,
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
    );
    formattedExpiryDate = expiryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const totalDays = premiumPlanName === "pro_annual" ? 365 : 30;
    validityProgressPercent = Math.min(
      100,
      Math.max(5, Math.round((validityDaysRemaining / totalDays) * 100)),
    );
  }

  const planLabel =
    premiumPlanName === "pro_lifetime"
      ? "LIFETIME PASS"
      : premiumPlanName === "pro_annual"
        ? "ANNUAL SUBSCRIBER"
        : "MONTHLY PASS";

  const accuracy =
    stats.totalSubmissions > 0
      ? Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 selection:bg-teal-500/20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8 animate-fade-in">
        {/* Top Minimalist Header & Telemetry Identity Capsule */}
        <div className="relative rounded-2xl border border-border/70 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md p-6 sm:p-7 shadow-sm overflow-hidden">
          {/* Subtle Ambient Light Gradients */}
          <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-teal-500/5 via-primary/5 to-transparent blur-2xl pointer-events-none" />

          {/* Sub-header status bar */}
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6 text-[11px] font-mono text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase tracking-wider">
                NODE // USER_WORKSPACE
              </span>
              <span className="text-border">•</span>
              <span className="text-foreground/70">
                UID: {user.id.substring(0, 8)}...
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs">
                ACCESS TIER:{" "}
                <span
                  className={
                    isPremiumUser
                      ? "text-amber-400 font-bold"
                      : "text-muted-foreground font-semibold"
                  }
                >
                  {isPremiumUser ? "PRO_MEMBER" : "COMMUNITY_FREE"}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Developer Details */}
            <div className="lg:col-span-7 flex items-start gap-4 sm:gap-5">
              {/* Monogram Capsule */}
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 via-teal-500/10 to-card border border-primary/30 flex items-center justify-center font-mono text-xl font-black text-primary shadow-inner">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                {isPremiumUser && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                    <Crown className="w-3.5 h-3.5 fill-slate-950 stroke-slate-950" />
                  </div>
                )}
              </div>

              {/* Identity & Status */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
                    {user.name}
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/80 uppercase">
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
                  <span className="truncate">{user.email}</span>
                  <span>•</span>
                  <span className="text-teal-400/90 font-medium">
                    WASM RUNTIME READY
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Digital Pass / Membership Holographic Card */}
            <div className="lg:col-span-5">
              {isPremiumUser ? (
                /* Active Pro Pass */
                <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-card to-card p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                        ZAP // {planLabel}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold uppercase">
                      ACTIVE
                    </span>
                  </div>

                  {premiumPlanName === "pro_lifetime" ? (
                    <div className="space-y-1 pt-1">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Lifetime Access Unlocked
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Permanent pass to all 13+ DSA tracks & hard problems.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-muted-foreground">
                          Validity Period:
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {validityDaysRemaining} Days Left
                        </span>
                      </div>

                      {/* Razor-thin countdown bar */}
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${validityProgressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-0.5">
                        <span>
                          EXPIRES:{" "}
                          <strong className="text-foreground">
                            {formattedExpiryDate}
                          </strong>
                        </span>
                        <span className="text-emerald-400">STATUS // VALID</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      All Courses & Problems Available
                    </span>
                  </div>
                </div>
              ) : (
                /* Free Community Pass with Upgrade Prompt */
                <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                      MEMBERSHIP TIER
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      FREE_PASS
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Course solutions, full progressive test suites, and premium
                    interview tracks are locked.
                  </p>

                  <div className="pt-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveCouponForModal("ZAP50");
                        setUpgradeOpen(true);
                      }}
                      className="w-full h-8 text-xs font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>ACTIVATE PRO PASS (50% OFF)</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: Innovative "Access Token Vouchers" (Coupons) */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 font-bold">
                01 //
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                AVAILABLE ACCESS VOUCHERS
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              [ 1-CLICK COPY OR DEPLOY ]
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {DEFAULT_COUPONS.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className="group relative rounded-xl border border-border/70 bg-card/60 hover:bg-card/90 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Bar with Cutout Perforation styling */}
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Token badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border font-mono font-black text-sm tracking-wider text-foreground">
                          <Tag className="w-3 h-3 text-teal-400" />
                          <span>{coupon.code}</span>
                        </div>

                        {/* Flat Discount Pill */}
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {coupon.discountPercent}% DISCOUNT
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 pt-0.5">
                        {coupon.description}
                      </p>
                    </div>

                    {coupon.badge && (
                      <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40 shrink-0">
                        {coupon.badge}
                      </span>
                    )}
                  </div>

                  {/* Perforated Divider Bar */}
                  <div className="relative border-t border-dashed border-border/80 px-4 py-2.5 bg-muted/15 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{coupon.validUntil || "ACTIVE"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Copy Key Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className={`h-7 px-2.5 text-[11px] font-mono font-semibold rounded-md border flex items-center gap-1.5 transition-all ${
                          isCopied
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>

                      {/* Apply & Buy Button */}
                      <button
                        type="button"
                        onClick={() => handleApplyCouponAndBuy(coupon.code)}
                        className="h-7 px-3 text-[11px] font-mono font-bold rounded-md bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <span>APPLY</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: Coding Telemetry Matrix (HUD Bar) */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 font-bold">
                02 //
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                PERFORMANCE TELEMETRY
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              [ REAL-TIME METRICS ]
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border/60 overflow-hidden">
            {/* Metric 1: Contests */}
            <div className="p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">CONTESTS</span>
                <Radio className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-2xl font-mono font-black text-foreground">
                {stats.contestsRegistered}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground">
                {stats.contestsCompleted} completed sessions
              </p>
            </div>

            {/* Metric 2: Problems Solved */}
            <div className="p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">SOLVED</span>
                <Target className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-mono font-black text-foreground">
                {stats.problemsSolved}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground">
                verified algorithmic solutions
              </p>
            </div>

            {/* Metric 3: Score */}
            <div className="p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">SCORE INDEX</span>
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-mono font-black text-foreground">
                {stats.totalScore}
              </div>
              <p className="text-[11px] font-mono text-muted-foreground">
                cumulative evaluation points
              </p>
            </div>

            {/* Metric 4: Accuracy */}
            <div className="p-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span className="uppercase tracking-wider">ACCURACY</span>
                <Percent className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-foreground">
                  {accuracy}%
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  ({stats.acceptedSubmissions}/{stats.totalSubmissions})
                </span>
              </div>
              {/* Micro accuracy bar */}
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-teal-400 rounded-full"
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Mission Activity Log (Contests & Problems) */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between border-b border-border/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-teal-400 font-bold">
                03 //
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                CONTEST FLIGHT LOG
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              [ {contests.length} PARTICIPATION ENTRIES ]
            </span>
          </div>

          {contests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/10 p-12 text-center space-y-3">
              <Terminal className="w-8 h-8 text-muted-foreground mx-auto stroke-[1.5]" />
              <div className="space-y-1">
                <p className="text-sm font-mono font-bold text-foreground uppercase tracking-wide">
                  NO CONTEST SESSIONS LOGGED
                </p>
                <p className="text-xs text-muted-foreground">
                  Join live arenas to test your speed, accuracy, and leaderboard
                  standing.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="font-mono text-xs"
                onClick={() => navigate("/contests")}
              >
                BROWSE ARENAS →
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contests.map((c) => {
                const isExpanded = expandedContestId === c.contestId;
                return (
                  <div
                    key={c.contestId}
                    className="rounded-xl border border-border/70 bg-card/70 hover:bg-card transition-all overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 flex items-start justify-between flex-wrap gap-4">
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-mono font-bold text-base text-foreground">
                            {c.name}
                          </h3>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              c.status === "active"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : c.status === "completed"
                                  ? "bg-muted text-muted-foreground border border-border"
                                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        {/* Telemetry Row */}
                        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground flex-wrap">
                          <span>
                            DATE: {new Date(c.startTime).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            SOLVED: {c.problemsSolved}/{c.totalProblems}
                          </span>
                          <span>•</span>
                          <span className="text-foreground font-semibold">
                            SCORE: {c.score}/{c.maxScore} PTS
                          </span>
                          <span>•</span>
                          <span>RUNS: {c.submissions}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {c.leaderboardVisible && c.rank !== null && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold">
                            <Medal className="w-3.5 h-3.5" />
                            <span>
                              RANK #{c.rank} / {c.totalParticipants}
                            </span>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 font-mono text-xs"
                          onClick={() =>
                            setExpandedContestId(isExpanded ? null : c.contestId)
                          }
                        >
                          {isExpanded ? "HIDE BREAKDOWN" : "TELEMETRY"}
                        </Button>

                        <Button
                          size="sm"
                          className="h-8 font-mono text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                          onClick={() => navigate(`/contest/${c.slug}`)}
                        >
                          OPEN ARENA →
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Problem Breakdown */}
                    {isExpanded && (
                      <div className="border-t border-border/50 bg-muted/20 p-4 space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                          PROBLEM EXECUTION LOG
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {c.problems.map((p) => (
                            <div
                              key={p.problemId}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-background/60 border border-border/60 text-xs font-mono"
                            >
                              <div className="flex items-center gap-2.5">
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 ${
                                    p.solved
                                      ? "text-emerald-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                                <span
                                  className={
                                    p.solved
                                      ? "text-foreground font-medium"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {p.title || `Problem ${p.problemId.slice(0, 6)}`}
                                </span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                    p.difficulty === "Easy"
                                      ? "text-emerald-400 bg-emerald-500/10"
                                      : p.difficulty === "Hard"
                                        ? "text-rose-400 bg-rose-500/10"
                                        : "text-amber-400 bg-amber-500/10"
                                  }`}
                                >
                                  {p.difficulty || "MEDIUM"}
                                </span>
                              </div>

                              <div className="text-muted-foreground">
                                {p.attempted
                                  ? `${p.score}/${p.maxScore} PTS`
                                  : "UNATTEMPTED"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Upgrade / Checkout Modal */}
      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        initialCouponCode={activeCouponForModal}
      />
    </div>
  );
}
