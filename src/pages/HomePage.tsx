// import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart,
  BarChart2,
  // Building,
  CheckCircle2,
  Clock,
  Code,
  Code2,
  Globe,
  // GraduationCap,
  Shield,
  ShieldCheck,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
// import { api } from "../lib/api";
import { useAuth } from "../store/auth";

// interface HomeSnapshot {
//   stats: { totalUsers: number; totalProblems: number; totalContests: number };
// }

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // const { data } = useQuery({
  //   queryKey: ["home-snapshot"],
  //   queryFn: () => api.get<HomeSnapshot>("/public/home"),
  // });

  // const stats = data?.stats;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-28 pb-20 px-6"
        style={{ background: "var(--gradient-glow), hsl(var(--background))" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 tracking-wide uppercase">
            <Zap size={14} className="text-primary" /> The Ultimate Coding Arena
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
            Master algorithms.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Prove your skills.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Join a professional-grade competitive programming platform. Compete
            in live contests, solve challenging problems, and get hired by top
            tech companies.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              className="btn-primary h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25"
              onClick={() => navigate("/contests")}
            >
              View Contests <ArrowRight size={18} className="ml-2" />
            </Button>
            {!user && (
              <Button
                variant="outline"
                className="h-12 px-8 text-base font-semibold border-border hover:bg-muted"
                onClick={() => navigate("/register")}
              >
                Create Free Account
              </Button>
            )}
            {user?.role === "admin" && (
              <Button
                variant="secondary"
                className="h-12 px-8 text-base font-semibold"
                onClick={() => navigate("/admin")}
              >
                <Shield size={18} className="mr-2" /> Admin Dashboard
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
          {[
            {
              // value: stats ? `${stats.totalProblems.toLocaleString()}+` : "50+",
              value: "150+",
              label: "Curated Problems",
              icon: Code2,
            },
            {
              // value: stats ? `${stats.totalUsers.toLocaleString()}+` : "100+",
              value: "500+",
              label: "Active Users",
              icon: Users,
            },
            {
              // value: stats ? `${stats.totalContests.toLocaleString()}+` : "25+",
              value: "25+",
              label: "Contests Hosted",
              icon: Trophy,
            },
            { value: "99.9%", label: "Platform Uptime", icon: Globe },
          ].map(({ value, label, icon: Icon }, idx) => (
            <div
              key={label}
              className={`text-center ${idx % 2 === 0 ? "border-none" : "border-none md:border-solid"} ${idx === 0 ? "border-none" : ""}`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon size={18} className="text-primary" />
                <span className="text-3xl font-bold tracking-tight">
                  {value}
                </span>
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Why colleges choose us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to run a contest
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Simple Student Onboarding",
                desc: "Students create an account and join any contest in a couple of clicks.",
              },
              {
                icon: Code,
                title: "Custom Problem Sets",
                desc: "Build contest-specific problems with test cases, time limits, and difficulty tiers.",
              },
              {
                icon: Trophy,
                title: "Live Leaderboard",
                desc: "Real-time rankings so students can track their standing as they solve.",
              },
              {
                icon: Clock,
                title: "Timed Contests",
                desc: "Schedule contests with auto start/stop and per-student time tracking.",
              },
              {
                icon: BarChart,
                title: "Performance Analytics",
                desc: "Detailed reports for faculty on class-wide and individual performance.",
              },
              {
                icon: ShieldCheck,
                title: "Plagiarism Detection",
                desc: "Automated code-similarity checks to keep contests fair.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <f.icon size={28} className="mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section (Mock Partners & Universities) */}
      {/* <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            Trusted by leading engineering colleges
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <GraduationCap size={28} /> PSG Tech
            </div>
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <Building size={28} /> NIT
            </div>
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <GraduationCap size={28} /> Karunya
            </div>
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <GraduationCap size={28} /> Karpagam
            </div>
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <Building size={28} /> VIT
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Showcase */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for serious developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to host, manage, and compete in professional
              programming contests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Sandboxed Execution",
                desc: "Securely run C, C++, Java, and Python code in isolated environments with strict time and memory constraints.",
                features: [
                  "Piston Engine integration",
                  "Sub-millisecond accuracy",
                  "Language-specific limits",
                ],
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                desc: "Hidden test cases, anti-cheat proctoring, and strict role-based access control ensure fairness and integrity.",
                features: [
                  "Fullscreen lock tracking",
                  "Copy/paste prevention",
                  "Hidden scoring data",
                ],
              },
              {
                icon: BarChart2,
                title: "Real-time Analytics",
                desc: "Track your performance per problem, view detailed submission history, and climb dynamic live leaderboards.",
                features: [
                  "Live contest rankings",
                  "Test case breakdowns",
                  "Historical tracking",
                ],
              },
            ].map(({ icon: Icon, title, desc, features }) => (
              <div
                key={title}
                className="card-glow bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {desc}
                </p>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-medium text-foreground"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              From registration to results in three steps
            </h2>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-7 left-[16.5%] right-[16.5%] h-px bg-border" />

            {[
              {
                step: "01",
                title: "Register",
                desc: "Students sign up with their college ID and join the contest room.",
              },
              {
                step: "02",
                title: "Compete",
                desc: "Solve timed problems in our built-in code editor with instant feedback.",
              },
              {
                step: "03",
                title: "Get Ranked",
                desc: "Live leaderboard updates as submissions come in, with final results at the end.",
              },
            ].map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="relative z-10 w-14 h-14 mx-auto rounded-full bg-card border-2 border-primary/20 text-primary font-bold text-lg flex items-center justify-center mb-5 shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all">
                  {s.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Which languages are supported?",
                a: "C, C++, Java, and Python, each run in isolated sandboxes with strict time and memory limits.",
              },
              {
                q: "Can our college host a private contest?",
                a: "Yes — admins can create contests scoped to a specific batch or department, with bulk CSV onboarding.",
              },
              {
                q: "Is there anti-cheat during contests?",
                a: "Fullscreen lock tracking, copy/paste prevention, and hidden test cases are enabled by default.",
              },
              {
                q: "Is it free for students?",
                a: "Yes, student accounts are free. Colleges can reach out for institution-wide setup.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <h3 className="font-semibold text-base mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">
            Ready to test your limits?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers competing in our next live contest.
          </p>
          <Button
            className="btn-primary h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20"
            onClick={() => navigate("/contests")}
          >
            Explore Contests
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">
          {/* <div className="flex items-center gap-2 text-primary">
            <Code2 size={20} />
            <span className="font-bold text-lg tracking-tight">ZAP</span>
          </div> */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZAP Professional Platform. All rights
            reserved.
          </p>
          {/* <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
