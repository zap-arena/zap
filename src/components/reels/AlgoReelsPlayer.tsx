import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  XCircle,
  Music,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ALGO_REELS, type AlgoReel } from "../../data/algoReels";
import { soundEffects } from "../../lib/soundEffects";
import { FEATURES } from "../../config/features";

interface AlgoReelsPlayerProps {
  initialReelId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlgoReelsPlayer({
  initialReelId,
  isOpen,
  onClose,
}: AlgoReelsPlayerProps) {
  const navigate = useNavigate();

  // Find initial index
  const initialIndex = Math.max(
    0,
    ALGO_REELS.findIndex((r) => r.id === initialReelId),
  );

  const [reelIndex, setReelIndex] = useState(initialIndex);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 for current segment
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredQuiz, setAnsweredQuiz] = useState<boolean>(false);

  // Swipe gesture tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const centerStageRef = useRef<HTMLDivElement>(null);

  const currentReel: AlgoReel = ALGO_REELS[reelIndex] || ALGO_REELS[0];
  const currentSegment = currentReel.segments[segmentIndex] || currentReel.segments[0];

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = origOverflow;
      };
    }
  }, [isOpen]);

  // Reset state when reel or segment changes
  useEffect(() => {
    setLikeCount(currentReel.likes);
    setLiked(false);
    setSegmentIndex(0);
    setProgress(0);
    setSelectedOption(null);
    setAnsweredQuiz(false);
  }, [reelIndex, currentReel]);

  // Reset inner stage scroll to top when segment changes
  useEffect(() => {
    if (centerStageRef.current) {
      centerStageRef.current.scrollTop = 0;
    }
  }, [segmentIndex]);

  // Next / Prev Segment
  const nextSegment = useCallback(() => {
    soundEffects.playPop();
    if (segmentIndex < currentReel.segments.length - 1) {
      setSegmentIndex((s) => s + 1);
      setProgress(0);
      setSelectedOption(null);
      setAnsweredQuiz(false);
    } else {
      // Loop to next reel if available
      if (reelIndex < ALGO_REELS.length - 1) {
        soundEffects.playWhoosh();
        setReelIndex((r) => r + 1);
      } else {
        setReelIndex(0);
      }
    }
  }, [segmentIndex, currentReel.segments.length, reelIndex]);

  const prevSegment = useCallback(() => {
    soundEffects.playPop();
    if (segmentIndex > 0) {
      setSegmentIndex((s) => s - 1);
      setProgress(0);
      setSelectedOption(null);
      setAnsweredQuiz(false);
    } else if (reelIndex > 0) {
      soundEffects.playWhoosh();
      setReelIndex((r) => r - 1);
    }
  }, [segmentIndex, reelIndex]);

  // Timer loop for segment progress
  useEffect(() => {
    if (!isOpen || isPaused) return;

    // Freeze progress if quiz is waiting for an answer
    if (currentSegment.type === "quiz" && !answeredQuiz) {
      return;
    }

    const intervalMs = 50;
    const step = (intervalMs / currentSegment.durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          nextSegment();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentSegment, answeredQuiz, nextSegment]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === "ArrowRight") {
        nextSegment();
      } else if (e.key === "ArrowLeft") {
        prevSegment();
      } else if (e.key === "ArrowDown" || e.key === "j") {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r < ALGO_REELS.length - 1 ? r + 1 : 0));
      } else if (e.key === "ArrowUp" || e.key === "l") {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r > 0 ? r - 1 : ALGO_REELS.length - 1));
      } else if (e.key === "m") {
        const newState = soundEffects.toggleSound();
        setIsSoundOn(newState);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSegment, prevSegment, onClose]);

  // Wheel event for vertical trackpad/mouse scroll between reels
  const handleWheel = (e: React.WheelEvent) => {
    // Only flip reel if user is scrolling at the bounds of the inner content
    const stage = centerStageRef.current;
    if (stage) {
      const isAtBottom = stage.scrollHeight - stage.scrollTop <= stage.clientHeight + 5;
      const isAtTop = stage.scrollTop <= 5;

      if (e.deltaY > 0 && !isAtBottom) return; // Allow inner vertical content scrolling
      if (e.deltaY < 0 && !isAtTop) return;
    }

    const now = Date.now();
    if (now - lastWheelTimeRef.current < 450) return;
    if (Math.abs(e.deltaY) > 30) {
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r < ALGO_REELS.length - 1 ? r + 1 : 0));
      } else {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r > 0 ? r - 1 : ALGO_REELS.length - 1));
      }
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

    const stage = centerStageRef.current;
    let allowReelSwipe = true;
    if (stage) {
      const isAtBottom = stage.scrollHeight - stage.scrollTop <= stage.clientHeight + 10;
      const isAtTop = stage.scrollTop <= 10;
      if (deltaY < 0 && !isAtBottom) allowReelSwipe = false;
      if (deltaY > 0 && !isAtTop) allowReelSwipe = false;
    }

    // Vertical swipe between reels (TikTok / Reels gesture)
    if (allowReelSwipe && Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < 0) {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r < ALGO_REELS.length - 1 ? r + 1 : 0));
      } else {
        soundEffects.playWhoosh();
        setReelIndex((r) => (r > 0 ? r - 1 : ALGO_REELS.length - 1));
      }
    } else if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe between story segments
      if (deltaX < 0) {
        nextSegment();
      } else {
        prevSegment();
      }
    }
    touchStartRef.current = null;
  };

  // Handle Like Button
  const toggleLike = () => {
    if (!liked) {
      soundEffects.playPop();
      setLiked(true);
      setLikeCount((c) => c + 1);
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    } else {
      setLiked(false);
      setLikeCount((c) => c - 1);
    }
  };

  // Handle Quiz Option Selection
  const handleQuizSelect = (idx: number) => {
    if (!currentSegment.quiz || answeredQuiz) return;
    setSelectedOption(idx);
    setAnsweredQuiz(true);

    if (idx === currentSegment.quiz.correctIndex) {
      soundEffects.playSuccess();
      setTimeout(() => {
        nextSegment();
      }, 2000);
    } else {
      soundEffects.playError();
    }
  };

  if (!isOpen) return null;

  // Render via React Portal directly into document.body
  // This guarantees the player is fixed to the viewport and NEVER trapped by parent CSS transforms or filters
  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all p-0 md:p-3 select-none"
      role="dialog"
      aria-modal="true"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient background glow matching reel gradient */}
      <div
        className={`absolute -inset-4 opacity-30 blur-3xl bg-gradient-to-tr ${currentReel.gradient} pointer-events-none hidden md:block`}
      />

      {/* Main Reels Phone Canvas */}
      <div className="relative w-full h-[100dvh] md:h-[min(94vh,760px)] md:max-h-[94vh] md:max-w-[420px] bg-neutral-950 md:rounded-[28px] rounded-none border-0 md:border md:border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
        {/* Top Story Segment Progress Bars */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 pt-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex gap-1.5">
          {currentReel.segments.map((seg, idx) => {
            const isCompleted = idx < segmentIndex;
            const isCurrent = idx === segmentIndex;

            return (
              <div
                key={seg.id}
                onClick={() => {
                  setSegmentIndex(idx);
                  setProgress(0);
                  setSelectedOption(null);
                  setAnsweredQuiz(false);
                }}
                className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-75"
                  style={{
                    width: isCompleted ? "100%" : isCurrent ? `${progress}%` : "0%",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Topbar Info & Controls */}
        <div className="absolute top-5 inset-x-0 z-30 px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[2px] flex items-center justify-center shadow-lg shrink-0">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-sm font-bold">
                {currentReel.avatar}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                {currentReel.author}
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded-full border border-primary/30">
                  {currentReel.difficulty}
                </span>
              </div>
              <div className="text-[11px] text-white/60 truncate max-w-[150px]">
                {currentReel.topic}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                const state = soundEffects.toggleSound();
                setIsSoundOn(state);
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 border border-white/10 transition-all"
              aria-label="Toggle Sound"
            >
              {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-rose-400" />}
            </button>

            {/* Pause/Play Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 border border-white/10 transition-all"
              aria-label="Pause / Play"
            >
              {isPaused ? <Play className="h-4 w-4 fill-white" /> : <Pause className="h-4 w-4" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 border border-white/10 transition-all"
              aria-label="Close Reels"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Central Visual Stage with inner vertical scroll */}
        <div
          ref={centerStageRef}
          className="relative flex-1 flex flex-col justify-start items-center px-5 sm:px-6 pt-16 pb-2 text-center cursor-pointer overflow-y-auto overscroll-contain scrollbar-none"
          onClick={() => setIsPaused((p) => !p)}
        >
          {/* Inner container with auto-centering */}
          <div className="w-full my-auto py-4 flex flex-col items-center">
            {/* Badge chip */}
            <div className="mb-2">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border shadow-lg ${
                  currentSegment.highlightChip?.color === "rose"
                    ? "border-rose-500/50 bg-rose-950/60 text-rose-300"
                    : currentSegment.highlightChip?.color === "amber"
                    ? "border-amber-500/50 bg-amber-950/60 text-amber-300"
                    : currentSegment.highlightChip?.color === "emerald"
                    ? "border-emerald-500/50 bg-emerald-950/60 text-emerald-300"
                    : currentSegment.highlightChip?.color === "purple"
                    ? "border-purple-500/50 bg-purple-950/60 text-purple-300"
                    : "border-sky-500/50 bg-sky-950/60 text-sky-300"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                {currentSegment.badge}
              </span>
            </div>

            {/* Big Punchy Center Headline */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
              {currentSegment.headline}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-[320px] font-medium leading-relaxed drop-shadow">
              {currentSegment.subtext}
            </p>

            {/* Dynamic Visual Content */}
            <div className="w-full mt-3" onClick={(e) => e.stopPropagation()}>
              {/* OpCount Badge if present */}
              {currentSegment.visualData?.opCount && (
                <div className="p-3 rounded-2xl bg-black/60 border border-rose-500/30 text-center font-mono my-2">
                  <div className="text-[10px] text-muted-foreground uppercase">
                    {currentSegment.visualData.opCount.label}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-rose-400 mt-1 animate-pulse">
                    {currentSegment.visualData.opCount.count}
                  </div>
                </div>
              )}

              {/* Pattern Cheat Sheet Table if present */}
              {currentSegment.visualData?.patternTable && (
                <div className="w-full space-y-1.5 my-2">
                  {currentSegment.visualData.patternTable.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/75 border border-violet-500/30 flex items-center justify-between text-left text-xs font-mono shadow-md"
                    >
                      <div>
                        <div className="text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                          {item.trigger}
                        </div>
                        <div className="text-white font-semibold text-xs mt-0.5">
                          👉 {item.dataStructure}
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold shrink-0">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Trivia Fact Card if present */}
              {currentSegment.visualData?.factCard && (
                <div className="w-full p-3.5 rounded-2xl bg-black/75 border border-amber-500/30 text-left my-2 shadow-xl">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    {currentSegment.visualData.factCard.title}
                  </div>
                  <div className="text-xs text-neutral-200 mt-1.5 leading-relaxed font-sans">
                    {currentSegment.visualData.factCard.detail}
                  </div>
                  <div className="mt-2.5 text-[11px] font-mono font-bold text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/20 inline-block">
                    💥 {currentSegment.visualData.factCard.impact}
                  </div>
                </div>
              )}

              {/* Interactive Array Display if present */}
              {currentSegment.visualData?.array && (
                <div className="flex items-center justify-center gap-1.5 my-2.5 overflow-x-auto py-1">
                  {currentSegment.visualData.array.map((val, idx) => {
                    const isLeft = currentSegment.visualData?.leftIdx === idx;
                    const isRight = currentSegment.visualData?.rightIdx === idx;
                    const isHighlighted =
                      currentSegment.visualData?.highlightIdxs?.includes(idx);

                    return (
                      <div
                        key={idx}
                        className={`relative flex flex-col items-center justify-center w-8 sm:w-9 h-10 sm:h-11 rounded-lg border font-mono font-bold text-xs sm:text-sm transition-all duration-300 ${
                          isLeft
                            ? "border-rose-400 bg-rose-500/20 text-rose-200 scale-105"
                            : isRight
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 scale-105"
                            : isHighlighted
                            ? "border-amber-400 bg-amber-500/20 text-amber-200"
                            : "border-white/10 bg-black/40 text-neutral-400"
                        }`}
                      >
                        <span>{val}</span>
                        {isLeft && (
                          <span className="text-[8px] text-rose-300 absolute -top-4 font-bold">
                            L
                          </span>
                        )}
                        {isRight && (
                          <span className="text-[8px] text-emerald-300 absolute -top-4 font-bold">
                            R
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comparison Box if present */}
              {currentSegment.visualData?.comparison && (
                <div className="grid grid-cols-1 gap-1.5 text-xs font-mono my-2">
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-300 text-left">
                    ❌ {currentSegment.visualData.comparison.naive}
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-left">
                    ✅ {currentSegment.visualData.comparison.optimal}
                  </div>
                </div>
              )}

              {/* Interactive Quiz Mode */}
              {currentSegment.quiz && (
                <div className="mt-2 space-y-2 text-left">
                  <div className="text-xs font-bold text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                    {currentSegment.quiz.question}
                  </div>

                  <div className="space-y-1.5">
                    {currentSegment.quiz.options.map((opt, oIdx) => {
                      const isSelected = selectedOption === oIdx;
                      const isCorrect = oIdx === currentSegment.quiz?.correctIndex;

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleQuizSelect(oIdx)}
                          className={`w-full p-2.5 rounded-xl text-xs font-medium text-left flex items-center justify-between border transition-all ${
                            answeredQuiz
                              ? isCorrect
                                ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold"
                                : isSelected
                                ? "bg-rose-500/20 border-rose-400 text-rose-200"
                                : "bg-black/30 border-white/5 text-neutral-500"
                              : "bg-black/50 border-white/15 text-white hover:border-amber-400 hover:bg-neutral-800"
                          }`}
                        >
                          <span>{opt}</span>
                          {answeredQuiz && isCorrect && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                          {answeredQuiz && isSelected && !isCorrect && (
                            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answeredQuiz && (
                    <div className="p-2 rounded-lg bg-white/5 text-[11px] text-neutral-300 leading-relaxed border border-white/10 animate-fade-in">
                      💡 {currentSegment.quiz.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pause overlay icon */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
              <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="h-8 w-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Heart burst animation */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
              <Heart className="h-28 w-28 text-rose-500 fill-rose-500" />
            </div>
          )}
        </div>

        {/* Left & Right Tap Zones to navigate segments */}
        <div
          className="absolute inset-y-16 left-0 w-1/4 z-10 cursor-w-resize"
          onClick={(e) => {
            e.stopPropagation();
            prevSegment();
          }}
          aria-label="Previous step"
        />
        <div
          className="absolute inset-y-16 right-14 w-1/4 z-10 cursor-e-resize"
          onClick={(e) => {
            e.stopPropagation();
            nextSegment();
          }}
          aria-label="Next step"
        />

        {/* Right-Hand Reels Action Sidebar (TikTok / Reels Style) */}
        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-3 text-white">
          {/* Feature Flag: Like Button (Controlled by FEATURES.reels.showLikeButton) */}
          {FEATURES.reels.showLikeButton && (
            <button
              type="button"
              onClick={toggleLike}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className={`p-2.5 rounded-full transition-all duration-200 ${
                  liked
                    ? "bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/50"
                    : "bg-black/50 group-hover:bg-black/80 text-white/90 backdrop-blur-md border border-white/10"
                }`}
              >
                <Heart
                  className={`h-4.5 w-4.5 ${liked ? "fill-white" : "group-hover:text-rose-400"}`}
                />
              </div>
              <span className="text-[10px] font-mono font-bold">{likeCount.toLocaleString()}</span>
            </button>
          )}

          {/* Feature Flag: Deep-Dive Guide Link (Controlled by FEATURES.reels.showGuideButton) */}
          {FEATURES.reels.showGuideButton && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(currentReel.guideLink);
              }}
              className="flex flex-col items-center gap-1 group"
              title="Open Interactive Guide"
            >
              <div className="p-2.5 rounded-full bg-black/50 group-hover:bg-primary group-hover:text-black text-white/90 backdrop-blur-md border border-white/10 transition-all">
                <ExternalLink className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-mono">Guide</span>
            </button>
          )}

          {/* Feature Flag: Quick Problem Visualizer Jump (Controlled by FEATURES.reels.showSolveButton) */}
          {FEATURES.reels.showSolveButton && (
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`${currentReel.guideLink}#toolkit`);
              }}
              className="flex flex-col items-center gap-1 group"
              title="Launch Visualizer"
            >
              <div className="p-2.5 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-black backdrop-blur-md border border-emerald-500/40 transition-all shadow-lg">
                <Flame className="h-4.5 w-4.5 fill-current" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Solve</span>
            </button>
          )}

          {/* Vertical Reel navigation buttons on mobile */}
          <div className="flex flex-col gap-1 pt-1 md:hidden">
            <button
              type="button"
              onClick={() => {
                soundEffects.playWhoosh();
                setReelIndex((r) => (r > 0 ? r - 1 : ALGO_REELS.length - 1));
              }}
              className="p-2 rounded-full bg-black/50 text-white/80 border border-white/10"
              aria-label="Previous Reel"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEffects.playWhoosh();
                setReelIndex((r) => (r < ALGO_REELS.length - 1 ? r + 1 : 0));
              }}
              className="p-2 rounded-full bg-black/50 text-white/80 border border-white/10"
              aria-label="Next Reel"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Caption & Music Track */}
        <div className="relative z-30 p-3.5 sm:p-4 pt-2 pb-4 bg-gradient-to-t from-black via-black/90 to-transparent text-left text-white shrink-0">
          <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-sans pr-14">
            {currentSegment.caption}
          </p>

          <div className="mt-2 flex items-center justify-between text-[11px] text-white/60">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 max-w-[230px]">
              <Music className="h-3 w-3 text-cyan-400 animate-spin" />
              <span className="truncate font-mono">{currentReel.soundtrack}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-neutral-400 font-mono">
                Swipe ↑/↓ to flip
              </span>
              <span className="font-mono text-[10px] font-bold text-white">
                {segmentIndex + 1}/{currentReel.segments.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Outer Next/Prev Reel Carousel Buttons on Desktop */}
      <div className="absolute left-6 inset-y-0 hidden md:flex items-center">
        <button
          type="button"
          onClick={() => {
            soundEffects.playWhoosh();
            setReelIndex((r) => (r > 0 ? r - 1 : ALGO_REELS.length - 1));
          }}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 transition-all shadow-xl"
          aria-label="Previous Reel"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute right-6 inset-y-0 hidden md:flex items-center">
        <button
          type="button"
          onClick={() => {
            soundEffects.playWhoosh();
            setReelIndex((r) => (r < ALGO_REELS.length - 1 ? r + 1 : 0));
          }}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-lg border border-white/20 transition-all shadow-xl"
          aria-label="Next Reel"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
