const programs = [
  {
    icon: "🧠",
    tag: "Most Popular",
    title: "DSA Bootcamp",
    subtitle: "12-Week Intensive",
    desc: "Master Data Structures & Algorithms from fundamentals to advanced. Arrays, Trees, Graphs, DP, and 300+ curated problems.",
    features: [
      "300+ Curated Problems",
      "Live Doubt Sessions",
      "Weekly Mock Tests",
      "Certificate of Completion",
    ],
    gradient: "from-primary/20 to-accent/10",
    border: "border-primary/30",
    badge: "bg-primary/20 text-primary",
  },
  {
    icon: "🎯",
    tag: "High Impact",
    title: "Interview Prep",
    subtitle: "6-Week Crash Course",
    desc: "Crack top tech interviews with real-world mock interviews, system design, behavioral rounds, and resume reviews.",
    features: [
      "1:1 Mock Interviews",
      "System Design Modules",
      "Resume & LinkedIn Review",
      "Offer Negotiation Tips",
    ],
    gradient: "from-amber-500/15 to-orange-400/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-400",
  },
  {
    icon: "📚",
    tag: "Self-Paced",
    title: "Topic Courses",
    subtitle: "On-demand Learning",
    desc: "Deep-dive into specific topics — Trees, Graphs, Dynamic Programming, Recursion, and more at your own pace.",
    features: [
      "Video Lectures",
      "Quizzes After Each Topic",
      "Progress Tracking",
      "Lifetime Access",
    ],
    gradient: "from-purple-500/15 to-indigo-500/10",
    border: "border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400",
  },
  {
    icon: "🎮",
    tag: "Fun & Learn",
    title: "Coding Games",
    subtitle: "Gamified DSA",
    desc: "Learn while you play! Solve algorithmic puzzles, race against the clock, and earn badges through gamified challenges.",
    features: [
      "Daily Challenges",
      "Leaderboards",
      "Team Battles",
      "Achievement Badges",
    ],
    gradient: "from-cyan-500/15 to-teal-400/10",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-400",
  },
  {
    icon: "🏆",
    tag: "Compete",
    title: "Coding Contests",
    subtitle: "Weekly Competitions",
    desc: "Compete with peers in timed contests, climb the leaderboard, and win prizes. Simulates real competitive programming.",
    features: [
      "Weekly Contests",
      "Real-time Rankings",
      "Prize Pool",
      "Company-style Problems",
    ],
    gradient: "from-rose-500/15 to-pink-400/10",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-400",
  },
  {
    icon: "📝",
    tag: "Assess",
    title: "Topic Quizzes",
    subtitle: "Test Your Knowledge",
    desc: "Hundreds of topic-wise quizzes on CS fundamentals, DSA concepts, time complexity, OS, DBMS and more.",
    features: [
      "500+ Questions",
      "Instant Feedback",
      "Performance Analytics",
      "Interview Q&A Bank",
    ],
    gradient: "from-green-500/15 to-emerald-400/10",
    border: "border-green-500/30",
    badge: "bg-green-500/20 text-green-400",
  },
];

export default function HomeProgramsSection() {
  return (
    <section id="programs" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
            <span className="text-primary text-xs font-mono font-medium tracking-wider uppercase">
              Our Programs
            </span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-foreground mb-4">
            Everything You Need to{" "}
            <span className="text-gradient-primary">Get Hired</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From mastering fundamentals to cracking interviews — our programs
            are built by industry professionals for real-world outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div
              key={p.title}
              className={`feature-card relative rounded-2xl bg-gradient-to-br ${p.gradient} ${p.border} border p-6 overflow-hidden cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{p.icon}</div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${p.badge}`}
                >
                  {p.tag}
                </span>
              </div>

              <h3 className="font-display text-xl font-black text-foreground mb-1">
                {p.title}
              </h3>
              <div className="text-muted-foreground text-xs font-mono mb-3">
                {p.subtitle}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {p.desc}
              </p>

              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-[10px]">✓</span>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl border border-foreground/20 text-foreground/80 text-sm font-semibold hover:bg-foreground/10 transition-all duration-200"
              >
                Learn More →
              </button>

              <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-foreground/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
