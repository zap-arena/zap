import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Database,
  HelpCircle,
  Lightbulb,
  Link2,
  Puzzle,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import {
  sqlMatchingGames,
  sqlWorkflows,
  type MatchingPair,
} from "../lib/sqlWorkflowData";
import { useAuth } from "../store/auth";

interface Submission {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
}

export default function SqlWorkflowPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mode Selection: "sequence" (Drag & Drop) or "matching" (Left to Right)
  const [activeMode, setActiveMode] = useState<"sequence" | "matching">("sequence");

  // API Submission
  const { data: existingSubmission } = useQuery<Submission>({
    queryKey: ["quiz-submission", "sql-workflow-puzzle"],
    queryFn: () =>
      api.get<Submission>(`/quizzes/sql-workflow-puzzle/submissions/me`),
    enabled: !!user,
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: (payload: object) =>
      api.post<Submission>(`/quizzes/sql-workflow-puzzle/submit`, payload),
    onSuccess: () => {
      toast.success("SQL Workflow score saved!");
      queryClient.invalidateQueries({
        queryKey: ["quiz-submission", "sql-workflow-puzzle"],
      });
      queryClient.invalidateQueries({ queryKey: ["quiz-submissions-me"] });
    },
    onError: () => {
      // Graceful fallback for client-side play
    },
  });

  // ==========================================
  // MODE A: DRAG & DROP SEQUENCE WORKFLOW STATE
  // ==========================================
  const [wfIndex, setWfIndex] = useState(0);
  const [wfScore, setWfScore] = useState(0);
  const [wfPool, setWfPool] = useState<number[]>([]);
  const [wfSlots, setWfSlots] = useState<(number | null)[]>([]);
  const [wfFeedback, setWfFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [wfRoundComplete, setWfRoundComplete] = useState(false);
  const [wfHintsRemaining, setWfHintsRemaining] = useState(5);
  const [wfHintsUsed, setWfHintsUsed] = useState(false);
  const [draggedTile, setDraggedTile] = useState<number | null>(null);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const currentWf = sqlWorkflows[wfIndex];

  const initWfRound = (idx: number) => {
    const wf = sqlWorkflows[idx];
    const shuffled = [...Array(wf.steps.length).keys()].sort(() => Math.random() - 0.5);
    setWfPool(shuffled);
    setWfSlots(Array(wf.steps.length).fill(null));
    setWfFeedback(null);
    setWfRoundComplete(false);
    setSelectedTile(null);
    setSelectedSlot(null);
    setWfHintsUsed(false);
  };

  useEffect(() => {
    initWfRound(wfIndex);
  }, [wfIndex]);

  const moveTileToSlot = (tileId: number, slotIdx: number) => {
    if (wfRoundComplete) return;
    setWfSlots((prev) => {
      const nextSlots = [...prev];
      const oldSlotIdx = nextSlots.indexOf(tileId);
      const existingInTarget = nextSlots[slotIdx];

      if (oldSlotIdx !== -1) {
        nextSlots[oldSlotIdx] = existingInTarget;
        nextSlots[slotIdx] = tileId;
      } else {
        nextSlots[slotIdx] = tileId;
        setWfPool((p) => {
          const np = p.filter((id) => id !== tileId);
          if (existingInTarget !== null) np.push(existingInTarget);
          return np;
        });
      }
      return nextSlots;
    });
  };

  const moveTileToPool = (tileId: number) => {
    if (wfRoundComplete) return;
    setWfSlots((prev) => {
      const nextSlots = [...prev];
      const idx = nextSlots.indexOf(tileId);
      if (idx !== -1) {
        nextSlots[idx] = null;
        setWfPool((p) => [...p, tileId]);
      }
      return nextSlots;
    });
    if (selectedSlot !== null && wfSlots[selectedSlot] === tileId) {
      setSelectedSlot(null);
    }
  };

  const moveSlotUp = (slotIdx: number) => {
    if (wfRoundComplete || slotIdx <= 0) return;
    setWfSlots((prev) => {
      const next = [...prev];
      const temp = next[slotIdx - 1];
      next[slotIdx - 1] = next[slotIdx];
      next[slotIdx] = temp;
      return next;
    });
    setSelectedSlot(null);
  };

  const moveSlotDown = (slotIdx: number) => {
    if (wfRoundComplete || slotIdx >= wfSlots.length - 1) return;
    setWfSlots((prev) => {
      const next = [...prev];
      const temp = next[slotIdx + 1];
      next[slotIdx + 1] = next[slotIdx];
      next[slotIdx] = temp;
      return next;
    });
    setSelectedSlot(null);
  };

  const handleSlotClick = (slotIdx: number) => {
    if (wfRoundComplete) return;

    // 1. If a tile from pool is selected, place it here
    if (selectedTile !== null) {
      moveTileToSlot(selectedTile, slotIdx);
      setSelectedTile(null);
      setSelectedSlot(null);
      return;
    }

    // 2. If another slot was selected, swap them!
    if (selectedSlot !== null) {
      if (selectedSlot !== slotIdx) {
        setWfSlots((prev) => {
          const next = [...prev];
          const temp = next[selectedSlot];
          next[selectedSlot] = next[slotIdx];
          next[slotIdx] = temp;
          return next;
        });
        toast.info(`Swapped slot #${selectedSlot + 1} with slot #${slotIdx + 1}`);
      }
      setSelectedSlot(null);
      return;
    }

    // 3. Otherwise, if this slot is filled, select it for swapping
    if (wfSlots[slotIdx] !== null) {
      setSelectedSlot(slotIdx);
    }
  };

  const checkSequence = () => {
    if (wfSlots.includes(null)) {
      setWfFeedback({ text: "Place all steps into slots first!", success: false });
      return;
    }
    const isCorrect = wfSlots.every((val, i) => val === i);
    if (isCorrect) {
      setWfFeedback({ text: "Brilliant! SQL pipeline is perfectly sequenced.", success: true });
      setWfRoundComplete(true);
      if (!wfHintsUsed) setWfScore((s) => s + 1);
    } else {
      setWfFeedback({ text: "Sequence has execution flaws. Check database evaluation rules!", success: false });
    }
  };

  const giveSequenceHint = () => {
    if (wfRoundComplete || wfHintsRemaining <= 0) return;
    setWfHintsUsed(true);
    setWfHintsRemaining((h) => h - 1);
    setWfSlots((prev) => {
      const nextSlots = [...prev];
      for (let i = 0; i < nextSlots.length; i++) {
        if (nextSlots[i] !== i) {
          const targetTile = i;
          const currentPos = nextSlots.indexOf(targetTile);
          if (currentPos !== -1) {
            const temp = nextSlots[i];
            nextSlots[i] = targetTile;
            nextSlots[currentPos] = temp;
          } else {
            const temp = nextSlots[i];
            nextSlots[i] = targetTile;
            setWfPool((p) => {
              const np = p.filter((x) => x !== targetTile);
              if (temp !== null) np.push(temp);
              return np;
            });
          }
          break;
        }
      }

      if (nextSlots.every((val, idx) => val === idx)) {
        setTimeout(() => {
          setWfFeedback({ text: "Sequence resolved by hint!", success: true });
          setWfRoundComplete(true);
        }, 100);
      }
      return nextSlots;
    });
  };

  const nextWorkflow = () => {
    if (wfIndex + 1 < sqlWorkflows.length) {
      setWfIndex(wfIndex + 1);
    } else {
      toast.success("All SQL Workflows Mastered! 🏆");
      if (user && !existingSubmission && !submitMutation.isPending) {
        submitMutation.mutate({
          id: uuidv4(),
          score: wfScore + (wfHintsUsed ? 0 : 1),
          totalQuestions: sqlWorkflows.length,
        });
      }
    }
  };

  // ==========================================
  // MODE B: LEFT-TO-RIGHT MATCHING GAME STATE
  // ==========================================
  const [matchGameIdx, setMatchGameIdx] = useState(0);
  const currentGame = sqlMatchingGames[matchGameIdx];

  const [shuffledLeft, setShuffledLeft] = useState<MatchingPair[]>([]);
  const [shuffledRight, setShuffledRight] = useState<MatchingPair[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatch, setWrongMatch] = useState<{ leftId: string; rightId: string } | null>(null);
  const [gameScore, setGameScore] = useState(0);

  const initMatchingGame = (idx: number) => {
    const game = sqlMatchingGames[idx];
    setShuffledLeft([...game.pairs].sort(() => Math.random() - 0.5));
    setShuffledRight([...game.pairs].sort(() => Math.random() - 0.5));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds([]);
    setWrongMatch(null);
  };

  useEffect(() => {
    initMatchingGame(matchGameIdx);
  }, [matchGameIdx]);

  const handleLeftClick = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    if (selectedRight) {
      // Evaluate match immediately
      evaluatePair(pairId, selectedRight);
    } else {
      setSelectedLeft(selectedLeft === pairId ? null : pairId);
    }
  };

  const handleRightClick = (pairId: string) => {
    if (matchedIds.includes(pairId)) return;
    if (selectedLeft) {
      // Evaluate match immediately
      evaluatePair(selectedLeft, pairId);
    } else {
      setSelectedRight(selectedRight === pairId ? null : pairId);
    }
  };

  const evaluatePair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct Match!
      toast.success("Match found! ✨");
      const nextMatches = [...matchedIds, leftId];
      setMatchedIds(nextMatches);
      setGameScore((s) => s + 25);
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongMatch(null);

      if (nextMatches.length === currentGame.pairs.length) {
        toast.success(`Level complete: ${currentGame.title} 🎉`);
      }
    } else {
      // Wrong Match
      setWrongMatch({ leftId, rightId });
      toast.error("Not a match! Think about the concept.");
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongMatch(null);
      }, 700);
    }
  };

  const nextMatchingGame = () => {
    if (matchGameIdx + 1 < sqlMatchingGames.length) {
      setMatchGameIdx(matchGameIdx + 1);
    } else {
      setMatchGameIdx(0);
      toast.success("You completed all SQL Matching Games! 🌟");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6 pt-16 sm:pt-20 pb-12 sm:pb-16 space-y-4 sm:space-y-6">
        {/* Navigation & Mode Bar (Mobile-first layout) */}
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-border pb-3 sm:pb-4">
          {/* Top Row: Back button & badges */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/quizzes")}
              className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
            >
              <ArrowLeft size={15} />
              <span>All Quizzes</span>
            </Button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 border border-teal-500/20">
                Interactive
              </span>
              {activeMode === "sequence" ? (
                <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  WF #{wfIndex + 1}/{sqlWorkflows.length}
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                  Game #{matchGameIdx + 1}/{sqlMatchingGames.length}
                </span>
              )}
            </div>
          </div>

          {/* Middle Row: Title with icon + Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0">
                <Database size={19} />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground leading-tight">
                  SQL Workflow & Concept Quest
                </h1>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Master query execution order & database engine concepts
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs (Segmented Control - Full width on mobile) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-muted/60 border border-border rounded-xl w-full sm:w-auto shrink-0">
              <button
                onClick={() => setActiveMode("sequence")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "sequence"
                    ? "bg-background text-foreground shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Puzzle size={14} className="text-primary shrink-0" />
                <span className="truncate">Pipeline Sequence</span>
              </button>
              <button
                onClick={() => setActiveMode("matching")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeMode === "matching"
                    ? "bg-background text-teal-500 shadow-xs border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link2 size={14} className="text-teal-500 shrink-0" />
                <span className="truncate">Concept Match</span>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODE A: DRAG & DROP SEQUENCE WORKFLOW                    */}
        {/* ======================================================== */}
        {activeMode === "sequence" && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* Header info card */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      currentWf.level === "Advanced"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : currentWf.level === "Intermediate"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}
                  >
                    {currentWf.level}
                  </span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                    {currentWf.category}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                  <span className="text-xs text-primary font-semibold hidden sm:inline">
                    Workflow #{wfIndex + 1} of {sqlWorkflows.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-foreground leading-snug">
                  {currentWf.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {currentWf.description}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => initWfRound(wfIndex)}
                  className="h-8 text-xs gap-1.5 flex-1 sm:flex-initial"
                  title="Shuffle & Reset round"
                >
                  <RotateCcw size={13} /> Reset
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={giveSequenceHint}
                  disabled={wfRoundComplete || wfHintsRemaining <= 0}
                  className="h-8 text-xs gap-1.5 text-amber-500 border-amber-500/30 hover:bg-amber-500/10 flex-1 sm:flex-initial"
                >
                  <Lightbulb size={13} /> Hint ({wfHintsRemaining})
                </Button>
              </div>
            </div>

            {/* SQL Code Preview (if available) */}
            {currentWf.queryPreview && (
              <div className="p-3 bg-muted/40 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1.5 py-0.5 rounded bg-muted w-fit shrink-0">
                  SQL Target
                </span>
                <code className="text-primary font-semibold text-xs font-mono break-all sm:break-normal overflow-x-auto">
                  {currentWf.queryPreview}
                </code>
              </div>
            )}

            {/* Target Numbered Sequence Slots */}
            <div className="bg-card/40 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <span>Ordered Pipeline Slots</span>
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {wfSlots.filter((x) => x !== null).length} / {currentWf.steps.length} placed
                </span>
              </div>

              {/* Mobile helper notice when a tile is selected */}
              {selectedTile !== null && (
                <div className="p-2.5 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary flex items-center justify-between animate-pulse">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sparkles size={13} /> Step #{selectedTile + 1} selected! Tap any slot below to place it.
                  </span>
                  <button
                    onClick={() => setSelectedTile(null)}
                    className="text-xs underline font-semibold ml-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {selectedSlot !== null && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-500 flex items-center justify-between animate-pulse">
                  <span className="font-medium flex items-center gap-1.5">
                    <span>Slot #{selectedSlot + 1} selected! Tap another slot to swap positions.</span>
                  </span>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="text-xs underline font-semibold ml-2"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {wfSlots.map((tileId, slotIdx) => {
                  const isFilled = tileId !== null;
                  const isSlotSelected = selectedSlot === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => draggedTile !== null && moveTileToSlot(draggedTile, slotIdx)}
                      onClick={() => handleSlotClick(slotIdx)}
                      className={`min-h-[52px] rounded-xl border p-2.5 flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                        isSlotSelected
                          ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/5"
                          : isFilled
                            ? "bg-card border-border hover:border-primary/40"
                            : selectedTile !== null
                              ? "border-primary/60 border-dashed bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/30"
                              : "border-dashed border-border/80 bg-muted/20 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                        {/* Number Badge */}
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 sm:mt-0 ${
                            isFilled
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground border border-border"
                          }`}
                        >
                          {slotIdx + 1}
                        </div>

                        {/* Slot Content */}
                        {isFilled ? (
                          <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                            <span className="text-base shrink-0 mt-0.5 sm:mt-0">
                              {currentWf.icons[tileId]}
                            </span>
                            <div className="text-xs sm:text-sm font-medium text-foreground leading-snug break-words">
                              {currentWf.steps[tileId]}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground italic leading-tight py-1">
                            {selectedTile !== null
                              ? "👉 Tap here to place selected step"
                              : `Slot #${slotIdx + 1} — tap or drag step here`}
                          </div>
                        )}
                      </div>

                      {/* Controls for placed tile: Up, Down, Remove */}
                      {isFilled && !wfRoundComplete && (
                        <div
                          className="flex items-center gap-0.5 shrink-0 ml-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Move Up */}
                          <button
                            disabled={slotIdx === 0}
                            onClick={() => moveSlotUp(slotIdx)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ChevronUp size={15} />
                          </button>

                          {/* Move Down */}
                          <button
                            disabled={slotIdx === wfSlots.length - 1}
                            onClick={() => moveSlotDown(slotIdx)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ChevronDown size={15} />
                          </button>

                          {/* Remove button */}
                          <button
                            onClick={() => moveTileToPool(tileId)}
                            className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 ml-0.5"
                            title="Remove to pool"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Steps Pool */}
            <div className="bg-muted/30 border border-border rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Available Steps Pool
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  {wfPool.length} remaining
                </span>
              </div>

              {wfPool.length === 0 ? (
                <div className="p-4 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground">
                  All steps placed! Tap "Verify Execution Order" below.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  {wfPool.map((stepIdx) => {
                    const isSelected = selectedTile === stepIdx;
                    return (
                      <div
                        key={stepIdx}
                        draggable={!wfRoundComplete}
                        onDragStart={() => setDraggedTile(stepIdx)}
                        onDragEnd={() => setDraggedTile(null)}
                        onClick={() => {
                          const firstEmpty = wfSlots.indexOf(null);
                          if (firstEmpty !== -1) {
                            moveTileToSlot(stepIdx, firstEmpty);
                            toast.info(`Placed into Slot #${firstEmpty + 1}`);
                          } else {
                            setSelectedTile(isSelected ? null : stepIdx);
                          }
                        }}
                        className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all cursor-pointer active:scale-[0.98] select-none ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm"
                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-lg shrink-0 mt-0.5 sm:mt-0">
                            {currentWf.icons[stepIdx]}
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-foreground leading-snug break-words">
                            {currentWf.steps[stepIdx]}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded shrink-0 sm:hidden">
                          + Tap
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Validation & Feedback Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-card border border-border">
              <div className="w-full sm:w-auto text-center sm:text-left">
                {wfFeedback && (
                  <p
                    className={`text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-2 ${
                      wfFeedback.success ? "text-emerald-500" : "text-amber-500"
                    }`}
                  >
                    {wfFeedback.success ? <CheckCircle2 size={16} /> : <HelpCircle size={16} />}
                    {wfFeedback.text}
                  </p>
                )}
                {!wfFeedback && (
                  <p className="text-xs text-muted-foreground">
                    Arrange all steps in execution order, then verify.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!wfRoundComplete ? (
                  <Button onClick={checkSequence} className="w-full sm:w-auto h-10 sm:h-9 gap-2 text-xs font-semibold">
                    <Check size={14} /> Verify Execution Order
                  </Button>
                ) : (
                  <Button
                    onClick={nextWorkflow}
                    className="w-full sm:w-auto h-10 sm:h-9 gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <span>Next Workflow</span>
                    <ChevronRight size={14} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE B: LEFT-TO-RIGHT MATCHING QUEST                     */}
        {/* ======================================================== */}
        {activeMode === "matching" && (
          <div className="space-y-4 sm:space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      currentGame.difficulty === "Hard"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : currentGame.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-teal-500/10 text-teal-500 border-teal-500/20"
                    }`}
                  >
                    {currentGame.difficulty}
                  </span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                    {currentGame.category}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
                  <span className="text-xs text-teal-500 font-semibold hidden sm:inline">
                    Game #{matchGameIdx + 1} of {sqlMatchingGames.length}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-foreground leading-snug">
                  {currentGame.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {currentGame.subtitle}
                </p>
              </div>

              {/* Progress & Controls */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <div className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-500 flex-1 sm:flex-initial text-center">
                  Matched: {matchedIds.length} / {currentGame.pairs.length}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => initMatchingGame(matchGameIdx)}
                  className="h-8 text-xs gap-1.5 flex-1 sm:flex-initial"
                >
                  <RotateCcw size={13} /> Reset
                </Button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-teal-500/5 border border-teal-500/20 rounded-xl text-xs text-teal-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span>{currentGame.instruction}</span>
              <span className="font-mono text-[11px] font-semibold">Score: {gameScore} pts</span>
            </div>

            {/* Dual Column Matching Board (Side-by-side on both mobile & desktop) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 relative">
              {/* Left Column (Concepts / Clauses / Functions) */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Database size={13} className="text-teal-500 shrink-0" />
                  <span className="truncate">Column A: Concept</span>
                </h3>

                <div className="space-y-2">
                  {shuffledLeft.map((pair) => {
                    const isMatched = matchedIds.includes(pair.id);
                    const isSelected = selectedLeft === pair.id;
                    const isWrong = wrongMatch?.leftId === pair.id;

                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        onClick={() => handleLeftClick(pair.id)}
                        className={`w-full p-2.5 sm:p-4 rounded-xl border text-left flex items-start sm:items-center justify-between gap-2 transition-all ${
                          isMatched
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 cursor-default opacity-80"
                            : isWrong
                              ? "bg-red-500/10 border-red-500 text-red-500 animate-shake"
                              : isSelected
                                ? "bg-teal-500/15 border-teal-500 ring-2 ring-teal-500/30 text-foreground"
                                : "bg-card border-border hover:border-teal-500/50 hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
                          {pair.icon && (
                            <span className="text-base sm:text-xl shrink-0 mt-0.5 sm:mt-0">
                              {pair.icon}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs sm:text-sm leading-tight break-words">
                              {pair.left}
                            </div>
                            {pair.leftSub && (
                              <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 break-words line-clamp-2">
                                {pair.leftSub}
                              </div>
                            )}
                          </div>
                        </div>

                        {isMatched ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                        ) : (
                          <div
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border shrink-0 mt-1 sm:mt-0 ${
                              isSelected ? "bg-teal-500 border-teal-500" : "border-border"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (Definitions / Mechanics / Operations) */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Sparkles size={13} className="text-primary shrink-0" />
                  <span className="truncate">Column B: Meaning</span>
                </h3>

                <div className="space-y-2">
                  {shuffledRight.map((pair) => {
                    const isMatched = matchedIds.includes(pair.id);
                    const isSelected = selectedRight === pair.id;
                    const isWrong = wrongMatch?.rightId === pair.id;

                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        onClick={() => handleRightClick(pair.id)}
                        className={`w-full p-2.5 sm:p-4 rounded-xl border text-left flex items-start sm:items-center justify-between gap-2 transition-all ${
                          isMatched
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 cursor-default opacity-80"
                            : isWrong
                              ? "bg-red-500/10 border-red-500 text-red-500 animate-shake"
                              : isSelected
                                ? "bg-teal-500/15 border-teal-500 ring-2 ring-teal-500/30 text-foreground"
                                : "bg-card border-border hover:border-teal-500/50 hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm font-medium leading-snug break-words">
                            {pair.right}
                          </div>
                          {pair.rightSub && (
                            <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 break-words line-clamp-2">
                              {pair.rightSub}
                            </div>
                          )}
                        </div>

                        {isMatched ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                        ) : (
                          <div
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border shrink-0 mt-1 sm:mt-0 ${
                              isSelected ? "bg-teal-500 border-teal-500" : "border-border"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Level Completion Footer */}
            {matchedIds.length === currentGame.pairs.length && (
              <div className="p-4 sm:p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 animate-fade-in">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base">
                      Level Complete: {currentGame.title}!
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      All concepts matched with 100% accuracy.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={nextMatchingGame}
                  className="w-full sm:w-auto h-10 sm:h-9 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-semibold text-xs"
                >
                  <span>Play Next Matching Game</span>
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
