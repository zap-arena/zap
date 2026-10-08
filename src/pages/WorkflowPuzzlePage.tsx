import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, PlayCircle, Shuffle, Lightbulb, Check, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";
import { workflows } from "../lib/workflowData";

interface Submission {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
}

export default function WorkflowPuzzlePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // API State
  const { data: existingSubmission } = useQuery<Submission>({
    queryKey: ["quiz-submission", "workflow-puzzle"],
    queryFn: () => api.get<Submission>(`/quizzes/workflow-puzzle/submissions/me`),
    enabled: !!user,
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: object) =>
      api.post<Submission>(`/quizzes/workflow-puzzle/submit`, payload),
    onSuccess: () => {
      toast.success("Puzzle score saved!");
      queryClient.invalidateQueries({ queryKey: ["quiz-submission", "workflow-puzzle"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-submissions-me"] });
    },
    onError: (err: any) => {
      if (err?.status !== 409) {
        toast.error("Failed to submit score.");
      }
    },
  });

  // Game State
  const [gameState, setGameState] = useState<"start" | "playing" | "score">("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [pool, setPool] = useState<number[]>([]);
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [hintsUsed, setHintsUsed] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  // Interaction State
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);

  const wf = workflows[currentIdx];

  const initRound = (idx: number) => {
    const workflow = workflows[idx];
    const shuffled = [...Array(workflow.steps.length).keys()].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setSlots(Array(workflow.steps.length).fill(null));
    setHintsUsed(false);
    setFeedback(null);
    setIsRoundComplete(false);
    setSelectedTile(null);
  };

  const startGame = () => {
    setCurrentIdx(0);
    setScore(0);
    initRound(0);
    setGameState("playing");
  };

  const nextWorkflow = () => {
    if (currentIdx + 1 < workflows.length) {
      setCurrentIdx(currentIdx + 1);
      initRound(currentIdx + 1);
    } else {
      endGame(score + (hintsUsed ? 0 : 1)); // Account for last round score
    }
  };

  const endGame = (finalScore: number) => {
    setGameState("score");
    if (!existingSubmission && !submitMutation.isPending) {
      submitMutation.mutate({
        id: uuidv4(),
        answers: {},
        score: finalScore,
        totalQuestions: workflows.length,
      });
    }
  };

  const moveTileToSlot = (tileId: number, slotIdx: number) => {
    if (isRoundComplete) return;
    setSlots((prev) => {
      const newSlots = [...prev];
      const oldSlotIdx = newSlots.indexOf(tileId);
      const existingInTarget = newSlots[slotIdx];

      // If it was already in a slot
      if (oldSlotIdx !== -1) {
        newSlots[oldSlotIdx] = existingInTarget;
        newSlots[slotIdx] = tileId;
      } else {
        // It's coming from pool
        newSlots[slotIdx] = tileId;
        setPool((p) => {
          let np = p.filter((id) => id !== tileId);
          if (existingInTarget !== null) np.push(existingInTarget);
          return np;
        });
      }
      return newSlots;
    });
  };

  const moveTileToPool = (tileId: number) => {
    if (isRoundComplete) return;
    setSlots((prev) => {
      const newSlots = [...prev];
      const idx = newSlots.indexOf(tileId);
      if (idx !== -1) {
        newSlots[idx] = null;
        setPool((p) => [...p, tileId]);
      }
      return newSlots;
    });
  };

  const handleSlotClick = (slotIdx: number) => {
    if (selectedTile !== null) {
      moveTileToSlot(selectedTile, slotIdx);
      setSelectedTile(null);
    }
  };

  const handlePoolClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".puzzle-tile")) return;
    if (selectedTile !== null) {
      moveTileToPool(selectedTile);
      setSelectedTile(null);
    }
  };

  const checkOrder = () => {
    if (slots.includes(null)) {
      setFeedback({ text: "Fill all slots first!", success: false });
      return;
    }
    const isCorrect = slots.every((val, i) => val === i);
    if (isCorrect) {
      setFeedback({ text: "Perfect! Sequence matched.", success: true });
      setIsRoundComplete(true);
      if (!hintsUsed) setScore((s) => s + 1);
    } else {
      setFeedback({ text: "Not quite right. Try again!", success: false });
    }
  };

  const giveHint = () => {
    if (isRoundComplete) return;
    setHintsUsed(true);
    setSlots((prev) => {
      const newSlots = [...prev];
      for (let i = 0; i < newSlots.length; i++) {
        if (newSlots[i] !== i) {
          // Find where 'i' is
          const correctItem = i;
          const currentPosInSlots = newSlots.indexOf(correctItem);
          
          if (currentPosInSlots !== -1) {
            // swap
            const temp = newSlots[i];
            newSlots[i] = correctItem;
            newSlots[currentPosInSlots] = temp;
          } else {
            // it's in the pool
            const temp = newSlots[i];
            newSlots[i] = correctItem;
            setPool((p) => {
              let np = p.filter((x) => x !== correctItem);
              if (temp !== null) np.push(temp);
              return np;
            });
          }
          break; // One hint per click
        }
      }
      return newSlots;
    });
  };

  const renderTile = (stepIdx: number) => {
    const isSelected = selectedTile === stepIdx;
    const isDragging = draggedTile === stepIdx;
    return (
      <div
        key={stepIdx}
        draggable={!isRoundComplete}
        onDragStart={(e) => {
          setDraggedTile(stepIdx);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragEnd={() => setDraggedTile(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTile(isSelected ? null : stepIdx);
        }}
        className={`puzzle-tile flex items-center gap-3 p-3 bg-card border-2 rounded-xl text-sm font-medium cursor-grab active:cursor-grabbing transition-all select-none
          ${isSelected ? "border-primary ring-2 ring-primary/20 shadow-md scale-[1.02]" : "border-border hover:border-primary/50"}
          ${isDragging ? "opacity-50 scale-95" : "opacity-100"}
          ${isRoundComplete ? "pointer-events-none border-success/50 bg-success/5" : ""}
        `}
      >
        <span className="text-muted-foreground opacity-50 cursor-grab">⠿</span>
        <span>{wf.icons[stepIdx]} {wf.steps[stepIdx]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col">
        <Button
          variant="ghost"
          className="mb-6 self-start"
          onClick={() => navigate("/quizzes")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
        </Button>

        {existingSubmission && gameState === "start" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-primary">Puzzle Completed!</h2>
                <p className="text-muted-foreground text-sm">You have already submitted your score for this puzzle.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Score</span>
              <span className="text-3xl font-black text-primary">
                {existingSubmission.score} <span className="text-xl text-muted-foreground">/ {existingSubmission.total_questions}</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 w-full bg-card/50 border rounded-2xl overflow-hidden shadow-2xl relative p-6 md:p-10 flex flex-col">
          
          {gameState === "start" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
              <div className="text-6xl mb-6">🧩</div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">AI Workflow Puzzle</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Test your architectural knowledge by rebuilding data pipelines, neural network flows, and system designs from scratch.
              </p>
              <Button size="lg" onClick={startGame} className="text-lg px-8 py-6 h-auto rounded-xl">
                <PlayCircle className="w-6 h-6 mr-2" />
                {existingSubmission ? "Play Again" : "Start Puzzle"}
              </Button>
            </div>
          )}

          {gameState === "score" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="text-7xl mb-6">{score / workflows.length >= 0.8 ? "🏆" : "👍"}</div>
              <h2 className="text-4xl font-extrabold mb-2">
                {score / workflows.length >= 0.8 ? "Architecture Master!" : "Great Effort!"}
              </h2>
              <p className="text-xl text-muted-foreground mb-10">
                You rebuilt {score} out of {workflows.length} workflows without hints.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={startGame} variant="default" className="text-lg">
                  Play Again
                </Button>
                <Button size="lg" onClick={() => navigate("/quizzes")} variant="outline" className="text-lg">
                  Back to Hub
                </Button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    {wf.category}
                  </span>
                  <h2 className="text-2xl font-bold">{wf.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-muted-foreground mb-1">
                    Workflow {currentIdx + 1} / {workflows.length}
                  </div>
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300" 
                      style={{ width: `${(currentIdx / workflows.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 flex-1">
                {/* Left side: Pool */}
                <div className="flex flex-col">
                  <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Jumbled Steps (Drag or Tap)
                  </div>
                  <div 
                    className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl p-4 flex flex-wrap content-start gap-3 transition-colors
                      ${selectedTile !== null ? "border-primary/50 bg-primary/5" : "border-border bg-background/50"}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedTile !== null) moveTileToPool(draggedTile);
                    }}
                    onClick={handlePoolClick}
                  >
                    {pool.map((stepIdx) => renderTile(stepIdx))}
                    {pool.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground italic text-sm">
                        Pool is empty
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Slots */}
                <div className="flex flex-col">
                  <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Build the Correct Flow (Top &rarr; Bottom)
                  </div>
                  <div className="flex flex-col gap-3">
                    {slots.map((occupant, idx) => (
                      <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedTile !== null) moveTileToSlot(draggedTile, idx);
                        }}
                        onClick={() => handleSlotClick(idx)}
                        className={`flex items-center gap-3 min-h-[56px] border-2 border-dashed rounded-xl p-2 transition-colors cursor-pointer
                          ${selectedTile !== null ? "border-primary hover:bg-primary/5" : "border-border bg-background/50"}
                          ${isRoundComplete ? "border-success/50 bg-success/5 pointer-events-none" : ""}
                        `}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 w-full">
                          {occupant !== null ? renderTile(occupant) : (
                            <div className="text-muted-foreground/50 text-sm italic pl-2">Drop here...</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => initRound(currentIdx)} disabled={isRoundComplete}>
                    <Shuffle className="w-4 h-4 mr-2" /> Reset
                  </Button>
                  <Button variant="outline" onClick={giveHint} disabled={isRoundComplete}>
                    <Lightbulb className="w-4 h-4 mr-2 text-warning" /> Hint
                  </Button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  {feedback && (
                    <span className={`font-semibold text-sm ${feedback.success ? "text-success" : "text-destructive"}`}>
                      {feedback.text}
                    </span>
                  )}
                  
                  {!isRoundComplete ? (
                    <Button onClick={checkOrder} className="w-full md:w-auto">
                      <Check className="w-4 h-4 mr-2" /> Check Order
                    </Button>
                  ) : (
                    <Button onClick={nextWorkflow} className="w-full md:w-auto bg-success hover:bg-success/90 text-success-foreground">
                      Next Workflow <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
