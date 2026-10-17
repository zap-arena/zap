import { useState, useMemo } from "react";
import { Play, Flame } from "lucide-react";
import { ALGO_REELS, REEL_CATEGORIES } from "../../data/algoReels";
import AlgoReelsPlayer from "./AlgoReelsPlayer";
import { soundEffects } from "../../lib/soundEffects";

interface AlgoReelsTrayProps {
  title?: string;
  subtitle?: string;
  highlightTopic?: string;
}

export default function AlgoReelsTray({
  highlightTopic,
}: AlgoReelsTrayProps) {
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredReels = useMemo(() => {
    if (activeCategory === "all") return ALGO_REELS;
    return ALGO_REELS.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  const openReel = (reelId: string) => {
    soundEffects.playPop();
    setSelectedReelId(reelId);
  };

  return (
    <div className="w-full my-4 sm:my-6 p-3 sm:p-5 rounded-2xl bg-card border border-border shadow-sm dark:shadow-xl transition-all">
      {/* Tray Header - Single Clean Row on Mobile */}
      <div className="flex items-center justify-between gap-2 mb-3 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 sm:p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0 flex items-center justify-center">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-foreground tracking-tight shrink-0">
              ⚡ AlgoReels
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shrink-0">
              {ALGO_REELS.length} BITES
            </span>
            <span className="text-xs text-muted-foreground truncate hidden md:inline">
              · 30s patterns, tricks & trivia
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openReel(highlightTopic || filteredReels[0]?.id || ALGO_REELS[0].id)}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-sm shrink-0"
        >
          <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
          <span>Watch Feed</span>
        </button>
      </div>

      {/* Category Filter Pills - Touch-friendly and cleanly scrollable */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-0.5">
        {REEL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                soundEffects.playPop();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary/70 hover:bg-secondary text-secondary-foreground border-border/50 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Story Circles Carousel */}
      <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto py-2 px-0.5 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filteredReels.map((reel) => {
          const isHighlighted = highlightTopic && reel.id.includes(highlightTopic);

          return (
            <button
              key={reel.id}
              type="button"
              onClick={() => openReel(reel.id)}
              className="flex flex-col items-center gap-1.5 group shrink-0 focus:outline-hidden active:scale-95 transition-transform"
            >
              {/* Animated Gradient Avatar Ring */}
              <div
                className={`relative p-[2px] rounded-full bg-gradient-to-tr ${
                  isHighlighted
                    ? "from-emerald-400 via-cyan-500 to-indigo-500 shadow-md shadow-emerald-500/20 scale-105"
                    : "from-amber-400 via-rose-500 to-purple-600 group-hover:scale-105"
                } transition-all duration-200`}
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-card p-0.5 flex items-center justify-center">
                  <div
                    className={`h-full w-full rounded-full bg-gradient-to-tr ${reel.gradient} flex items-center justify-center text-xl sm:text-2xl shadow-inner group-hover:rotate-6 transition-transform`}
                  >
                    {reel.avatar}
                  </div>
                </div>

                {/* Micro play badge */}
                <div className="absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] shadow-sm border border-background">
                  <Play className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Topic Title & Difficulty Badge (Theme adaptive) */}
              <div className="text-center max-w-[76px] sm:max-w-[88px]">
                <div className="text-[11px] sm:text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {reel.topic}
                </div>
                <div className="flex items-center justify-center mt-0.5">
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${
                      reel.difficulty === "Beginner"
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : reel.difficulty === "Medium"
                        ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300"
                        : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300"
                    }`}
                  >
                    {reel.difficulty}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal Reels Viewer rendered in React Portal */}
      {selectedReelId && (
        <AlgoReelsPlayer
          isOpen={!!selectedReelId}
          initialReelId={selectedReelId}
          onClose={() => setSelectedReelId(null)}
        />
      )}
    </div>
  );
}
