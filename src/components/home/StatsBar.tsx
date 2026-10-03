const stats = [
  { icon: "🎓", value: "2000+", label: "Students Trained" },
  { icon: "🏛️", value: "3", label: "Partner Colleges" },
  { icon: "🤝", value: "7", label: "Colleges in Talks" },
  { icon: "💼", value: "₹16 LPA", label: "Highest Package" },
  { icon: "⭐", value: "98%", label: "Satisfaction Rate" },
  { icon: "👨‍💻", value: "50+", label: "Industry Mentors" },
];

export default function HomeStatsBar() {
  return (
    <section className="py-14 border-y border-border/50 bg-card/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center gap-2 animate-slide-up stagger-${Math.min(i + 1, 5)}`}
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="font-display font-black text-2xl text-gradient-primary">{s.value}</div>
              <div className="text-muted-foreground text-xs font-medium leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
