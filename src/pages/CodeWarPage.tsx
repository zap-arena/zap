import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Bug,
  Layers,
  Loader2,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import ContestWorkspacePage from "./ContestWorkspacePage";

export default function CodeWarPage() {
  const [mode, setMode] = useState<"landing" | "random" | "progressive">(
    "landing",
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEnteringDebugging, setIsEnteringDebugging] = useState(false);

  // Do not pull problems on initial load of codewar
  const {
    data: progressiveProblems,
    isFetching: isProgressiveLoading,
    refetch: fetchProgressive,
  } = useQuery({
    queryKey: ["codewar-progressive"],
    queryFn: () => api.get<any[]>("/public/codewar/progressive"),
    enabled: false,
  });

  const startProgressive = async () => {
    let problems = progressiveProblems;
    if (!problems) {
      const res = await fetchProgressive();
      problems = res.data;
    }
    if (!problems || problems.length === 0) {
      toast.error("No progressive problems available at the moment.");
      return;
    }
    setMode("progressive");
  };

  const handleEnterDebugging = async () => {
    setIsEnteringDebugging(true);
    try {
      await queryClient.prefetchQuery({
        queryKey: ["codewar-debugging"],
        queryFn: () => api.get<any[]>("/public/codewar/debugging"),
      });
    } catch (err) {
      console.warn("Could not prefetch debugging problems", err);
    } finally {
      setIsEnteringDebugging(false);
      navigate("/codewar/debugging");
    }
  };

  if (mode === "random") {
    return <ContestWorkspacePage isCodeWar />;
  }

  if (mode === "progressive") {
    return (
      <ContestWorkspacePage isCodeWar overrideProblems={progressiveProblems} />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-b from-card/80 to-card/30 backdrop-blur-xl p-8 sm:p-12 shadow-sm">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span>Practice & Battle Arena</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
              Level up your logic in{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                CodeWar
              </span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
              Pick your training ground. Drill quick random challenges, conquer
              the structured curriculum, test stamina on progressive multi-stage
              chains, or diagnose and patch realistic bugs in Debugging War.
            </p>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Shuffle size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Quick Drills</div>
                  <div className="text-sm font-bold text-foreground">Random Mode</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Curriculum</div>
                  <div className="text-sm font-bold text-foreground">19 Modules</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Chains</div>
                  <div className="text-sm font-bold text-foreground">Multi-Stage</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                  <Bug size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">Live Debug</div>
                  <div className="text-sm font-bold text-foreground">Squash Bugs</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Practice Mode Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Random Problem */}
          <div className="group relative bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-primary/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-500 opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <Shuffle size={22} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Fast Drill
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                Random Challenge
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-normal">
                Test your adaptability with a randomly drawn problem. Perfect for warmups and spontaneous mock interview practice.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Instant Load
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  All Topics
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Multi-Language
                </span>
              </div>
            </div>

            <Button
              onClick={() => setMode("random")}
              className="w-full gap-2 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
            >
              <Shuffle size={16} /> Work on Random Problem
            </Button>
          </div>

          {/* Card 2: Curriculum Card */}
          <div className="group relative bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={22} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Structured
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-emerald-500 transition-colors">
                Study Curriculum
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-normal">
                Follow our vetted roadmap from Two Pointers and Sliding Window to Dynamic Programming, Graphs, and Trees.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  19 Tracks
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Beginner to Pro
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Interactive Visuals
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/curriculum/dsa")}
              className="w-full gap-2 font-semibold hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500"
            >
              <BookOpen size={16} /> View Curriculum
              <ArrowRight size={14} className="ml-auto" />
            </Button>
          </div>

          {/* Card 3: Progressive Problems */}
          <div className="group relative bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300">
                  <Layers size={22} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Evolving
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-amber-500 transition-colors">
                Progressive Chains
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-normal">
                Conquer cascading problems where complexity and constraints ramp up incrementally with each stage.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Multi-Stage
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Stamina Test
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Adaptive
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={startProgressive}
              disabled={isProgressiveLoading}
              className="w-full gap-2 font-semibold hover:border-amber-500/50"
            >
              {isProgressiveLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-amber-500" /> Pulling Problem Set...
                </>
              ) : (
                <>
                  <Layers size={16} className="text-amber-500" /> Generate Problem Set
                </>
              )}
            </Button>
          </div>

          {/* Card 4: Debugging War */}
          <div className="group relative bg-card/90 dark:bg-card/60 backdrop-blur-md border border-border/80 hover:border-rose-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-red-600 opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-300">
                  <Bug size={22} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/25 animate-pulse">
                  NEW
                </span>
              </div>

              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-rose-500 transition-colors flex items-center gap-2">
                Debugging War
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-normal">
                Analyze broken implementations, diagnose subtle off-by-one errors and edge cases, and patch them into passing code.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Real Bugs
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Code Review
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border/60">
                  Speed & Precision
                </span>
              </div>
            </div>

            <Button
              onClick={handleEnterDebugging}
              disabled={isEnteringDebugging}
              className="w-full gap-2 font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 hover:shadow-lg hover:shadow-rose-600/30"
            >
              {isEnteringDebugging ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Loading Arena...
                </>
              ) : (
                <>
                  <Bug size={16} /> Enter Debugging War
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}


