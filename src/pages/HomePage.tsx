import { ThunderLogo } from "../components/ThunderLogo";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden pt-28 pb-20 px-6 flex items-center"
        style={{ background: "var(--gradient-glow), hsl(var(--background))" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 tracking-wide uppercase">
            <ThunderLogo size={14} className="text-primary fill-primary" /> Who
            We Are
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground flex items-center justify-center gap-2">
            We are{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              ZAP
            </span>
            <ThunderLogo className="w-12 h-12 sm:w-16 sm:h-16 text-primary fill-primary animate-pulse" />
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            We are a collective of new-generation, real-world professionals
            actively working in the tech industry. With tremendous experience in
            interviews, hiring processes, and engineering, we bridge the gap
            between academic learning and industry expectations.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              className="btn-primary h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25"
              onClick={() => navigate("/curriculum/dsa")}
            >
              Start Learning <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 text-base font-semibold border-border hover:bg-muted"
              onClick={() => navigate("/contests")}
            >
              View Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col items-center justify-center p-4">
              <Users size={32} className="text-primary mb-4 opacity-80" />
              <div className="text-4xl font-bold text-foreground mb-2">
                2000+
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Trained Students
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <GraduationCap
                size={32}
                className="text-primary mb-4 opacity-80"
              />
              <div className="text-4xl font-bold text-foreground mb-2">10+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Precious Universities
              </div>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <Briefcase size={32} className="text-primary mb-4 opacity-80" />
              <div className="text-4xl font-bold text-foreground mb-2">
                100%
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Real-World Focus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Training the Next Generation of Tech Leaders
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We are currently in a close loop with top universities across
              India, training their students comprehensively on all aspects of a
              technical career.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>
                  <strong>Data Structures & Algorithms:</strong> Deep dives into
                  optimization, problem-solving, and logic building.
                </span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>
                  <strong>Design Skills:</strong> System design, architecture,
                  and writing clean, scalable code.
                </span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span>
                  <strong>Technical Interpersonal:</strong> Mastering the hiring
                  process, mock interviews, and technical communication.
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
              <BookOpen className="text-primary" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Why learn from us?
            </h3>
            <p className="text-muted-foreground mb-6">
              Unlike traditional platforms, our curriculum is shaped by what
              companies are asking <em>right now</em>. We don't just teach
              theory; we prepare you for the realities of modern engineering
              workflows, technical interviews, and the demanding pace of the
              real tech industry.
            </p>
            <Button
              variant="outline"
              className="w-full text-primary border-primary/20 hover:bg-primary/5"
              onClick={() => navigate("/curriculum/dsa")}
            >
              Explore our DSA Curriculum
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
