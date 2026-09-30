import { useState } from "react";
import ContestWorkspacePage from "./ContestWorkspacePage";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Shuffle, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

export default function CodeWarPage() {
  const [mode, setMode] = useState<"landing" | "random" | "progressive">(
    "landing",
  );
  const navigate = useNavigate();

  const { data: progressiveProblems, isLoading } = useQuery({
    queryKey: ["codewar-progressive"],
    queryFn: () => api.get<any[]>("/public/codewar/progressive"),
    enabled: mode === "landing",
  });

  const startProgressive = () => {
    if (!progressiveProblems || progressiveProblems.length === 0) {
      toast.error("No progressive problems available at the moment.");
      return;
    }
    setMode("progressive");
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
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Welcome to <span className="text-primary">CodeWar</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your personal practice arena. Choose a random challenge to sharpen
            your skills, dive into our curated DSA curriculum, or tackle
            progressive code chains to master complex concepts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Random Problem Card */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shuffle size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Shuffle className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Random Challenge
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
              Test your adaptability with a randomly selected coding problem.
              Perfect for quick practice sessions.
            </p>
            <Button onClick={() => setMode("random")} className="w-full gap-2">
              <Shuffle size={16} /> Work on Random Problem
            </Button>
          </div>

          {/* Curriculum Card */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-6">
              <BookOpen className="text-success" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Study Curriculum
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
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
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col hover:border-primary/50 transition-colors shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Layers size={80} />
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-6">
              <Layers className="text-warning" size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              Progressive Chains
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
              Solve multi-stage problems that evolve and add constraints. Pulled
              directly from the admin problem bank.
            </p>
            <Button
              variant="secondary"
              onClick={startProgressive}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <Layers size={16} />{" "}
              {isLoading ? "Loading..." : "Generate Problem Set"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
