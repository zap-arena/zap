import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Code2, Trophy, Users, Zap, Shield, BarChart2, Globe, ArrowRight, Building, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { api } from '../lib/api';
import { useAuth } from '../store/auth';

interface HomeSnapshot {
  stats: { totalUsers: number; totalProblems: number; totalContests: number };
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ['home-snapshot'],
    queryFn: () => api.get<HomeSnapshot>('/public/home'),
  });

  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-20 px-6" style={{ background: 'var(--gradient-glow), hsl(var(--background))' }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 tracking-wide uppercase">
            <Zap size={14} className="text-primary" /> The Ultimate Coding Arena
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-foreground">
            Master algorithms.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              Prove your skills.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Join a professional-grade competitive programming platform. Compete in live contests, solve challenging problems, and get hired by top tech companies.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button className="btn-primary h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25" onClick={() => navigate('/contests')}>
              View Contests <ArrowRight size={18} className="ml-2" />
            </Button>
            {!user && (
              <Button variant="outline" className="h-12 px-8 text-base font-semibold border-border hover:bg-muted" onClick={() => navigate('/register')}>
                Create Free Account
              </Button>
            )}
            {user?.role === 'admin' && (
              <Button variant="secondary" className="h-12 px-8 text-base font-semibold" onClick={() => navigate('/admin')}>
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
            { value: stats ? `${stats.totalProblems.toLocaleString()}+` : '500+', label: 'Curated Problems', icon: Code2 },
            { value: stats ? `${stats.totalUsers.toLocaleString()}+` : '10,000+', label: 'Active Developers', icon: Users },
            { value: stats ? `${stats.totalContests.toLocaleString()}+` : '100+', label: 'Contests Hosted', icon: Trophy },
            { value: '99.9%', label: 'Platform Uptime', icon: Globe },
          ].map(({ value, label, icon: Icon }, idx) => (
            <div key={label} className={`text-center ${idx % 2 === 0 ? 'border-none' : 'border-none md:border-solid'} ${idx === 0 ? 'border-none' : ''}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon size={18} className="text-primary" />
                <span className="text-3xl font-bold tracking-tight">{value}</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted By Section (Mock Partners & Universities) */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-10">
            Trusted by top tech companies & universities
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Tech Partners */}
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">
              <Building size={24} /> Meta
            </div>
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">
              <Building size={24} /> Google
            </div>
            <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tighter">
              <Building size={24} /> Amazon
            </div>
            {/* Universities */}
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <GraduationCap size={28} /> Stanford
            </div>
            <div className="flex items-center justify-center gap-2 font-serif font-semibold text-lg">
              <GraduationCap size={28} /> MIT
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 px-6 bg-muted/20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for serious developers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to host, manage, and compete in professional programming contests.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Sandboxed Execution', desc: 'Securely run C, C++, Java, and Python code in isolated environments with strict time and memory constraints.', features: ['Piston Engine integration', 'Sub-millisecond accuracy', 'Language-specific limits'] },
              { icon: Shield, title: 'Enterprise Security', desc: 'Hidden test cases, anti-cheat proctoring, and strict role-based access control ensure fairness and integrity.', features: ['Fullscreen lock tracking', 'Copy/paste prevention', 'Hidden scoring data'] },
              { icon: BarChart2, title: 'Real-time Analytics', desc: 'Track your performance per problem, view detailed submission history, and climb dynamic live leaderboards.', features: ['Live contest rankings', 'Test case breakdowns', 'Historical tracking'] },
            ].map(({ icon: Icon, title, desc, features }) => (
              <div key={title} className="card-glow bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground">
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to test your limits?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers competing in our next live contest.
          </p>
          <Button className="btn-primary h-14 px-10 text-lg font-bold shadow-xl shadow-primary/20" onClick={() => navigate('/contests')}>
            Explore Contests
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-primary">
            <Code2 size={20} />
            <span className="font-bold text-lg tracking-tight">ZAP</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ZAP Professional Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
