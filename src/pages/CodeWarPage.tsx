import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Bug, Layers, Loader2, Shuffle } from "lucide-react";
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
      // Pull debugging problems when debugging war is clicked
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
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Welcome to <span className="text-primary">CodeWar</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your personal practice arena. Choose a random challenge to sharpen
            your skills, dive into our curated DSA curriculum, tackle
            progressive code chains, or squash bugs in the Debugging War.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Random Problem Card */}
          <div className="bg-card border border-border rounded-2xl p-7 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shuffle size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Shuffle className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Random Challenge
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1 text-sm">
              Test your adaptability with a randomly selected coding problem.
              Perfect for quick practice sessions.
            </p>
            <Button onClick={() => setMode("random")} className="w-full gap-2">
              <Shuffle size={16} /> Work on Random Problem
            </Button>
          </div>

          {/* Curriculum Card */}
          <div className="bg-card border border-border rounded-2xl p-7 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-6">
              <BookOpen className="text-success" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Study Curriculum
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1 text-sm">
              Follow our structured Data Structures and Algorithms curriculum to
              build a strong foundation step by step.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/curriculum/dsa")}
              className="w-full gap-2"
            >
              <BookOpen size={16} /> View Curriculum
            </Button>
          </div>

          {/* Progressive Problems Card */}
          <div className="bg-card border border-border rounded-2xl p-7 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-6">
              <Layers className="text-warning" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Progressive Chains
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1 text-sm">
              Solve multi-stage problems that evolve and add constraints. Pulled
              directly from the problem bank.
            </p>
            <Button
              variant="secondary"
              onClick={startProgressive}
              disabled={isProgressiveLoading}
              className="w-full gap-2"
            >
              {isProgressiveLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Pulling Problem Set...
                </>
              ) : (
                <>
                  <Layers size={16} /> Generate Problem Set
                </>
              )}
            </Button>
          </div>

          {/* Debugging War Card (NEW!) */}
          <div className="bg-card border border-border rounded-2xl p-7 flex flex-col hover:border-red-500/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Bug size={80} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Bug className="text-red-500" size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                NEW
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              Debugging War
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1 text-sm">
              Analyze complex problem requirements alongside pre-written buggy code.
              Diagnose the flaws, trace edge cases, and patch critical mistakes across various topics.
            </p>
            <Button
              onClick={handleEnterDebugging}
              disabled={isEnteringDebugging}
              className="w-full gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              {isEnteringDebugging ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Loading Debugging Arena...
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

