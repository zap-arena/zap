const topics = [
  { name: "Arrays & Strings", problems: 45, icon: "📊", level: "Beginner" },
  { name: "Linked Lists", problems: 30, icon: "🔗", level: "Beginner" },
  { name: "Stacks & Queues", problems: 28, icon: "📚", level: "Intermediate" },
  { name: "Trees & BST", problems: 55, icon: "🌳", level: "Intermediate" },
  { name: "Graphs & BFS/DFS", problems: 60, icon: "🗺️", level: "Advanced" },
  { name: "Dynamic Programming", problems: 70, icon: "🧩", level: "Advanced" },
  {
    name: "Recursion & Backtracking",
    problems: 40,
    icon: "🔄",
    level: "Advanced",
  },
  {
    name: "Sorting & Searching",
    problems: 35,
    icon: "🔍",
    level: "Intermediate",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400",
  Intermediate: "bg-amber-500/20 text-amber-400",
  Advanced: "bg-rose-500/20 text-rose-400",
};

export default function HomeDSASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <span className="text-primary text-xs font-mono font-medium tracking-wider uppercase">
                🧠 DSA Curriculum
              </span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
              300+ Problems.
              <br />
              <span className="text-gradient-primary">Zero Gaps.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Our curriculum covers every topic tested in top company
              interviews. From basics to advanced — structured, curated, and
              mentor-guided.
            </p>

            <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-glow grid-bg h-52 flex items-center justify-center bg-gradient-to-br from-primary/15 via-accent/10 to-transparent">
              <span className="font-display font-black text-5xl text-gradient-primary">
                {"{ }"}
              </span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((t, i) => (
                <div
                  key={t.name}
                  className={`feature-card glass-card rounded-xl p-4 border border-border/40 animate-slide-up stagger-${Math.min(i + 1, 5)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{t.icon}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${levelColors[t.level]}`}
                    >
                      {t.level}
                    </span>
                  </div>
                  <div className="font-display font-bold text-foreground text-sm mb-1">
                    {t.name}
                  </div>
                  <div className="text-primary text-xs font-mono">
                    {t.problems} Problems
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${Math.min((t.problems / 70) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-muted-foreground text-sm">
                Total:{" "}
                <span className="text-primary font-bold">363 Problems</span>{" "}
                across 8 core topics
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
