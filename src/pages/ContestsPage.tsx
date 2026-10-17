import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Trophy,
  LayoutGrid,
  List,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

interface Contest {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "scheduled" | "completed";
  duration: number;
  startTime: string;
}

export default function ContestsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const { data: contests, isLoading } = useQuery({
    queryKey: ["contests"],
    queryFn: () => api.get<Contest[]>("/contests"),
  });

  const live = contests?.filter((c) => c.status === "active") || [];
  const upcoming = contests?.filter((c) => c.status === "scheduled") || [];
  const past = contests?.filter((c) => c.status === "completed") || [];

  const renderContestCards = (
    list: Contest[],
    emptyIcon: any,
    emptyTitle: string,
    emptyDesc: string,
  ) => {
    if (list.length === 0) {
      const Icon = emptyIcon;
      return (
        <div className="text-center py-20 px-4 bg-card/60 rounded-2xl border border-dashed border-border">
          <div className="w-14 h-14 mx-auto mb-3 bg-secondary rounded-full flex items-center justify-center">
            <Icon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {emptyTitle}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {emptyDesc}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => {
          const endTime = c.startTime
            ? new Date(new Date(c.startTime).getTime() + c.duration * 60000)
            : null;

          const isLive = c.status === "active";
          const isScheduled = c.status === "scheduled";

          return (
            <div
              key={c.id}
              onClick={() => navigate(`/contest/${c.slug}`)}
              className="group bg-card text-card-foreground rounded-2xl border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Card Header Banner */}
              <div
                className={`relative p-5 border-b border-border/60 ${
                  isLive
                    ? "bg-gradient-to-br from-emerald-500/15 via-background to-secondary/30"
                    : isScheduled
                      ? "bg-gradient-to-br from-blue-500/15 via-background to-secondary/30"
                      : "bg-gradient-to-br from-muted/50 via-background to-secondary/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isLive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : isScheduled
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {isLive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>LIVE NOW</span>
                      </>
                    ) : isScheduled ? (
                      <>
                        <Calendar size={12} />
                        <span>UPCOMING</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        <span>COMPLETED</span>
                      </>
                    )}
                  </span>

                  {/* Duration Chip */}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/50">
                    <Clock size={12} />
                    <span>{c.duration} mins</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {c.name}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {c.description ||
                    "Timed algorithmic programming competition with automated scoring and instant feedback."}
                </p>

                {/* Timing Meta */}
                <div className="space-y-2 mb-5 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Starts:</span>
                    <span className="text-foreground font-semibold">
                      {c.startTime
                        ? new Date(c.startTime).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "TBA"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Ends:</span>
                    <span className="text-foreground font-semibold">
                      {endTime
                        ? endTime.toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "TBA"}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-auto">
                  <Button
                    variant={isLive ? "default" : "outline"}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                      isLive
                        ? "shadow-sm shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "border-border hover:border-primary hover:bg-primary/5 text-foreground"
                    }`}
                  >
                    <span>
                      {isLive
                        ? "Enter Contest"
                        : isScheduled
                          ? "View Instructions"
                          : "View Leaderboard"}
                    </span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (
    list: Contest[],
    emptyIcon: any,
    emptyTitle: string,
    emptyDesc: string,
  ) => {
    if (list.length === 0) {
      const Icon = emptyIcon;
      return (
        <div className="text-center py-20 px-4 bg-card/60 rounded-2xl border border-dashed border-border">
          <div className="w-14 h-14 mx-auto mb-3 bg-secondary rounded-full flex items-center justify-center">
            <Icon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            {emptyTitle}
          </h3>
          <p className="text-sm text-muted-foreground">{emptyDesc}</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[400px]">Contest Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((c) => {
              const endTime = c.startTime
                ? new Date(new Date(c.startTime).getTime() + c.duration * 60000)
                : null;
              return (
                <TableRow
                  key={c.id}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => navigate(`/contest/${c.slug}`)}
                >
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          c.status === "active"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                            : c.status === "scheduled"
                              ? "bg-blue-500/15 border border-blue-500/30 text-blue-500"
                              : "bg-muted border border-border text-muted-foreground"
                        }`}
                      >
                        {c.status === "active" ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        ) : c.status === "scheduled" ? (
                          <Calendar size={15} />
                        ) : (
                          <CheckCircle size={15} />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {c.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">
                          {c.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {c.startTime
                      ? new Date(c.startTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "TBA"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {endTime
                      ? endTime.toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "TBA"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} /> {c.duration}m
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={c.status === "active" ? "default" : "outline"}
                      size="sm"
                      className="rounded-lg font-semibold text-xs h-8"
                    >
                      {c.status === "active" ? "Enter" : "Details"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-4 shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Competitive Programming Arena</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Weekly Contests & Live Coding
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join live algorithmic contests, test solutions against automated hidden
            testcases, and climb the global leaderboard.
          </p>
        </div>

        {/* Guest Banner if not logged in */}
        {!user && (
          <div className="mb-10 p-6 rounded-2xl border border-border/80 bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-2.5 bg-primary/10 rounded-xl shrink-0 text-primary">
                <Zap size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">
                  Ready to Compete on ZAP?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Sign in or create a free account to register for live contests,
                  execute code in our Monaco IDE, and earn your official ranking.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
              <Button
                variant="outline"
                className="rounded-xl border-border hover:bg-muted font-semibold text-xs sm:text-sm flex-1 sm:flex-initial"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm flex-1 sm:flex-initial"
                onClick={() => navigate("/register")}
              >
                Create Account <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Tab Controls with View Switcher */}
        <Tabs defaultValue="live" className="w-full">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-border/60">
            <TabsList className="h-11 bg-card border border-border/80 p-1 rounded-xl">
              <TabsTrigger
                value="live"
                className="gap-2 text-xs sm:text-sm font-semibold px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live ({live.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="gap-2 text-xs sm:text-sm font-semibold px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                <Calendar size={13} />
                Upcoming ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="gap-2 text-xs sm:text-sm font-semibold px-4 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xs"
              >
                <CheckCircle size={13} />
                Past ({past.length})
              </TabsTrigger>
            </TabsList>

            {/* View Switcher Toggle */}
            <div className="flex items-center gap-1 self-end sm:self-auto bg-card border border-border/80 p-1 rounded-xl">
              <button
                type="button"
                aria-label="Grid View"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                aria-label="Table View"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4"
                >
                  <div className="h-6 bg-muted rounded-md w-1/3" />
                  <div className="h-4 bg-muted rounded-md w-3/4" />
                  <div className="h-10 bg-muted rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="live" className="mt-0">
                {viewMode === "grid"
                  ? renderContestCards(
                      live,
                      Trophy,
                      "No Live Contests Right Now",
                      "Check the upcoming tab or practice on past challenges.",
                    )
                  : renderTable(
                      live,
                      Trophy,
                      "No Live Contests Right Now",
                      "Check the upcoming tab or practice on past challenges.",
                    )}
              </TabsContent>

              <TabsContent value="upcoming" className="mt-0">
                {viewMode === "grid"
                  ? renderContestCards(
                      upcoming,
                      Calendar,
                      "No Upcoming Contests Scheduled",
                      "New weekly contests are announced regularly. Check back soon!",
                    )
                  : renderTable(
                      upcoming,
                      Calendar,
                      "No Upcoming Contests Scheduled",
                      "New weekly contests are announced regularly. Check back soon!",
                    )}
              </TabsContent>

              <TabsContent value="past" className="mt-0">
                {viewMode === "grid"
                  ? renderContestCards(
                      past,
                      CheckCircle,
                      "No Past Contests Yet",
                      "Completed contests will be cataloged here.",
                    )
                  : renderTable(
                      past,
                      CheckCircle,
                      "No Past Contests Yet",
                      "Completed contests will be cataloged here.",
                    )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}
