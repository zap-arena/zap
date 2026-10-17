"use client"

import { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  Sliders,
  Play,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { CONCEPT_STORIES, type ConceptStoryCard } from "../../data/conceptStories";
import AlgoReelsPlayer from "../reels/AlgoReelsPlayer";

interface ConceptStoryDeckProps {
  storyId: string;
  onJumpToVisualizer?: () => void;
}

// 1. Interactive Catastrophe Widget: Live System Telemetry Monitor
function CatastropheMonitor() {
  const [ticker, setTicker] = useState(482100);
  const [latency, setLatency] = useState(14.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + Math.floor(Math.random() * 800 - 380));
      setLatency((prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 font-mono text-xs shadow-inner">
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          TELEMETRY ALERT: NASDAQ_TICKER_INGEST
        </div>
        <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300 border border-rose-500/40 animate-pulse font-bold">
          CRITICAL DEGRADATION
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="rounded-lg bg-black/40 p-2.5 border border-white/5">
          <div className="text-[10px] text-muted-foreground uppercase">Incoming Load</div>
          <div className="text-sm font-bold text-sky-400 mt-1">{ticker.toLocaleString()} tps</div>
        </div>
        <div className="rounded-lg bg-black/40 p-2.5 border border-rose-500/20">
          <div className="text-[10px] text-muted-foreground uppercase">CPU Core 0-63</div>
          <div className="text-sm font-bold text-rose-400 mt-1">99.8% (Stall)</div>
        </div>
        <div className="rounded-lg bg-black/40 p-2.5 border border-amber-500/20">
          <div className="text-[10px] text-muted-foreground uppercase">Rolling Latency</div>
          <div className="text-sm font-bold text-amber-400 mt-1">{latency}s</div>
        </div>
      </div>

      <div className="rounded bg-black/60 p-2 text-muted-foreground leading-relaxed border border-white/5">
        <span className="text-rose-400 font-semibold">Diagnosis: </span>
        Server re-iterating entire 60,000 tick buffer on every incoming packet. Garbage collection thrashing. 4,200 incoming websocket packets dropped.
      </div>
    </div>
  );
}

// 2. Interactive Trap Widget: Cost Calculator Slider
function TrapCalculator() {
  const [arraySize, setArraySize] = useState(10000);
  const [windowSize, setWindowSize] = useState(500);

  const bruteOps = arraySize * windowSize;
  const optimalOps = arraySize;
  const multiplier = Math.round(bruteOps / optimalOps);

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs font-mono">
      <div className="flex items-center gap-2 text-amber-400 font-semibold mb-3 border-b border-amber-500/20 pb-2">
        <Sliders className="h-4 w-4" />
        THE QUADRATIC MULTIPLIER TRAP
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
            <span>Array Elements (N):</span>
            <span className="text-foreground font-bold">{arraySize.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-muted-foreground mb-1 text-[11px]">
            <span>Window / Subset Size (K):</span>
            <span className="text-foreground font-bold">{windowSize.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-white/5">
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <div className="text-[10px] text-rose-300 font-bold uppercase">Naive Brute Force: O(N·K)</div>
          <div className="text-base font-extrabold text-rose-400 mt-1">{bruteOps.toLocaleString()} ops</div>
          <div className="text-[10px] text-rose-300/80 mt-0.5">Freezes UI thread</div>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-[10px] text-emerald-300 font-bold uppercase">Sliding Window: O(N)</div>
          <div className="text-base font-extrabold text-emerald-400 mt-1">{optimalOps.toLocaleString()} ops</div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">{multiplier}x faster!</div>
        </div>
      </div>
    </div>
  );
}

// 3. Interactive Epiphany Widget: Live Stepping Window Micro-Demo
function EpiphanyDemo() {
  const sampleArray = [4, 2, 1, 7, 8, 1, 2, 8, 1, 0];
  const K = 3;
  const [startIndex, setStartIndex] = useState(0);

  const windowSlice = sampleArray.slice(startIndex, startIndex + K);
  const currentSum = windowSlice.reduce((a, b) => a + b, 0);

  const exitingVal = sampleArray[startIndex];
  const enteringVal = startIndex + K < sampleArray.length ? sampleArray[startIndex + K] : null;

  const nextStep = () => {
    if (startIndex + K < sampleArray.length) {
      setStartIndex((s) => s + 1);
    } else {
      setStartIndex(0);
    }
  };

  const prevStep = () => {
    if (startIndex > 0) {
      setStartIndex((s) => s - 1);
    }
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 text-xs font-mono">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <Zap className="h-4 w-4" />
          INTERACTIVE: THE O(1) SLIDE
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={prevStep}
            disabled={startIndex === 0}
            className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-all"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold flex items-center gap-1 transition-all"
          >
            {startIndex + K >= sampleArray.length ? (
              <>
                <RotateCcw className="h-3 w-3" /> Replay
              </>
            ) : (
              <>
                Slide Window <ChevronRight className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Array visualization */}
      <div className="flex items-center justify-center gap-1.5 my-3 overflow-x-auto py-2">
        {sampleArray.map((val, idx) => {
          const inWindow = idx >= startIndex && idx < startIndex + K;

          return (
            <div
              key={idx}
              className={`relative flex flex-col items-center justify-center w-8 h-10 rounded border font-bold text-sm transition-all duration-300 ${
                inWindow
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105"
                  : "bg-neutral-900 border-neutral-800 text-neutral-500"
              }`}
            >
              <span>{val}</span>
              <span className="text-[8px] text-neutral-500 absolute -bottom-4 font-normal">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* Math breakdown */}
      <div className="rounded-lg bg-black/60 p-3 mt-4 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="text-neutral-300">
          Current Window: <span className="text-cyan-400 font-bold">[{windowSlice.join(", ")}]</span> ={" "}
          <span className="text-cyan-300 font-bold">{currentSum}</span>
        </div>

        {enteringVal !== null ? (
          <div className="text-[11px] text-cyan-200 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            Next: <span className="text-rose-400 font-bold">-{exitingVal}</span> (left) +{" "}
            <span className="text-emerald-400 font-bold">+{enteringVal}</span> (right) ={" "}
            <span className="font-bold text-white">{currentSum - exitingVal + enteringVal}</span>
          </div>
        ) : (
          <div className="text-[11px] text-emerald-400 font-semibold">End of array reached! ✨</div>
        )}
      </div>
    </div>
  );
}

// 4. Interactive Blueprint Widget: Code Template with Copy & Language Switch
function BlueprintSnippet({
  snippet,
  onJumpToVisualizer,
}: {
  snippet?: ConceptStoryCard["codeSnippet"];
  onJumpToVisualizer?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      toast.success("Blueprint code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-4 text-xs font-mono shadow-xl">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <Code2 className="h-4 w-4" />
          UNIVERSAL ALGORITHM TEMPLATE
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-neutral-400" /> Copy Template
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto text-[11px] leading-relaxed text-neutral-300 bg-black/60 p-3 rounded-lg border border-white/5">
        <code>{snippet?.code}</code>
      </pre>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-[11px] text-emerald-400">⚡ Master this invariant to pass technical rounds</span>
        {onJumpToVisualizer && (
          <button
            type="button"
            onClick={onJumpToVisualizer}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            Launch Visualizer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ConceptStoryDeck({ storyId, onJumpToVisualizer }: ConceptStoryDeckProps) {
  const story = CONCEPT_STORIES[storyId] || CONCEPT_STORIES["sliding-window"];
  const [activeStep, setActiveStep] = useState<number>(1);
  const [showReel, setShowReel] = useState<boolean>(false);

  const card = useMemo(
    () => story.cards.find((c) => c.step === activeStep) || story.cards[0],
    [story, activeStep]
  );

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs/textareas
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowRight") {
        setActiveStep((s) => (s < 4 ? s + 1 : 1));
      } else if (e.key === "ArrowLeft") {
        setActiveStep((s) => (s > 1 ? s - 1 : 4));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getToneBadgeStyle = (tone: ConceptStoryCard["tone"]) => {
    switch (tone) {
      case "danger":
        return "border-rose-500/40 bg-rose-500/10 text-rose-400";
      case "warning":
        return "border-amber-500/40 bg-amber-500/10 text-amber-400";
      case "accent":
        return "border-cyan-500/40 bg-cyan-500/10 text-cyan-400";
      case "success":
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
      default:
        return "border-primary/40 bg-primary/10 text-primary";
    }
  };

  const getCardBorderStyle = (tone: ConceptStoryCard["tone"]) => {
    switch (tone) {
      case "danger":
        return "border-rose-500/30 shadow-rose-950/20";
      case "warning":
        return "border-amber-500/30 shadow-amber-950/20";
      case "accent":
        return "border-cyan-500/30 shadow-cyan-950/20";
      case "success":
        return "border-emerald-500/30 shadow-emerald-950/20";
      default:
        return "border-border";
    }
  };

  return (
    <section className="mb-10 w-full" aria-label="Interactive 4-Card Story Deck">
      {/* Header Deck Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>4-Beat Concept Story · Attention-Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
            {story.topicTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{story.tagline}</p>
        </div>

        {/* Story Pill Selector / Step Progress */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border self-start sm:self-center">
          {story.cards.map((c) => {
            const isCurrent = c.step === activeStep;
            return (
              <button
                key={c.step}
                type="button"
                onClick={() => setActiveStep(c.step)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-neutral-800/50"
                }`}
              >
                <span>0{c.step}</span>
                <span className="hidden md:inline">
                  {c.step === 1 && "Catastrophe"}
                  {c.step === 2 && "The Trap"}
                  {c.step === 3 && "The Epiphany"}
                  {c.step === 4 && "Blueprint"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Story Card Canvas */}
      <div
        className={`relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md p-5 sm:p-7 shadow-2xl transition-all duration-300 ${getCardBorderStyle(
          card.tone
        )}`}
      >
        {/* Top Badges & Card Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full border px-3 py-0.5 text-[11px] font-mono font-bold tracking-wider ${getToneBadgeStyle(
                card.tone
              )}`}
            >
              {card.badge}
            </span>

            <button
              type="button"
              onClick={() => setShowReel(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-[11px] font-mono font-bold transition-all shadow-sm group"
            >
              <Play className="h-2.5 w-2.5 fill-rose-400 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Watch 30s Reel</span>
            </button>

            <span className="text-xs text-muted-foreground hidden sm:inline">
              Step {card.step} of 4 · Use ← / → keys
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep((s) => (s > 1 ? s - 1 : 4))}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-muted-foreground hover:text-foreground hover:bg-neutral-800 transition-all"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-muted-foreground px-1">
              {activeStep} / 4
            </span>
            <button
              type="button"
              onClick={() => setActiveStep((s) => (s < 4 ? s + 1 : 1))}
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-muted-foreground hover:text-foreground hover:bg-neutral-800 transition-all"
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Left Narrative, Right Interactive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: The Narrative Story */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {card.title}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1 mb-3">
                {card.subtitle}
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                {card.story}
              </p>
            </div>

            {/* Micro Stats or Key Indicators */}
            {card.stats && card.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {card.stats.map((st, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-black/40 border border-white/5 p-2 text-center"
                  >
                    <div className="text-[10px] text-muted-foreground uppercase truncate">
                      {st.label}
                    </div>
                    <div
                      className="text-xs font-mono font-bold mt-0.5"
                      style={{ color: st.color || "inherit" }}
                    >
                      {st.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Takeaway callout */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-xs leading-relaxed">
              <span className="font-bold text-primary flex items-center gap-1.5 mb-0.5">
                <Sparkles className="h-3.5 w-3.5" />
                Mental Model:
              </span>
              <span className="text-neutral-300 font-sans">{card.keyTakeaway}</span>
            </div>
          </div>

          {/* Right Column: Interactive Widget */}
          <div className="lg:col-span-6 w-full">
            {card.visualType === "catastrophe" && <CatastropheMonitor />}
            {card.visualType === "trap" && <TrapCalculator />}
            {card.visualType === "epiphany" && <EpiphanyDemo />}
            {card.visualType === "blueprint" && (
              <BlueprintSnippet
                snippet={card.codeSnippet}
                onJumpToVisualizer={onJumpToVisualizer}
              />
            )}
          </div>
        </div>

        {/* Bottom Quick-Action Bar */}
        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Interactive Concept Module active</span>
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep((s) => s + 1)}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 hover:opacity-90 transition-all text-xs"
              >
                Next Beat: 0{activeStep + 1}{" "}
                {activeStep === 1
                  ? "The Trap"
                  : activeStep === 2
                  ? "The Epiphany"
                  : "The Blueprint"}{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              onJumpToVisualizer && (
                <button
                  type="button"
                  onClick={onJumpToVisualizer}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold flex items-center gap-1.5 transition-all text-xs shadow-lg shadow-emerald-500/20"
                >
                  <Play className="h-3.5 w-3.5 fill-black" /> Launch Problem Visualizer
                </button>
              )
            )}
          </div>
        </div>
      </div>
      {/* AlgoReels Modal Integration */}
      {showReel && (
        <AlgoReelsPlayer
          isOpen={showReel}
          initialReelId={
            storyId.includes("two")
              ? "two-pointers-30s"
              : storyId.includes("hash")
              ? "hashing-magic-30s"
              : "sliding-window-30s"
          }
          onClose={() => setShowReel(false)}
        />
      )}
    </section>
  );
}
