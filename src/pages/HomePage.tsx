import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Code2, Trophy, Clock, Users, ChevronRight, Zap, Shield, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { api } from '../lib/api';
import { useAuth } from '../store/auth';

interface HomeContestSummary {
  id: string; name: string; slug: string; description: string; status: string;
  duration: number; problemCount: number; maxScore: number;
}
interface HomeSnapshot {
  contests: HomeContestSummary[];
  stats: { totalUsers: number; totalProblems: number; totalContests: number };
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ['home-snapshot'],
    queryFn: () => api.get<HomeSnapshot>('/public/home'),
  });

  const activeContests = data?.contests ?? [];
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6" style={{ background: 'var(--gradient-glow), hsl(var(--background))' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
            <Zap size={12} /> Now with real-time leaderboards
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Code. Compete.<br />
            <span className="text-primary">Conquer.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            A professional-grade coding contest platform for developers. Join live contests, solve timed challenges, and climb the leaderboard.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {user ? (
              user.role === 'admin'
                ? <Button className="btn-primary h-11 px-8 text-sm font-semibold gap-2" onClick={() => navigate('/admin')}>
                    <Shield size={16} /> Admin Dashboard
                  </Button>
                : <Button className="btn-primary h-11 px-8 text-sm font-semibold gap-2" onClick={() => navigate(activeContests[0] ? `/contest/${activeContests[0].slug}` : '/')}>
                    <Trophy size={16} /> Join a Contest
                  </Button>
            ) : (
              <>
                <Button className="btn-primary h-11 px-8 text-sm font-semibold" onClick={() => navigate('/register')}>
                  Get Started Free
                </Button>
                <Button variant="outline" className="h-11 px-8 text-sm font-semibold border-border text-muted-foreground hover:text-foreground" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { value: stats ? `${stats.totalProblems}+` : '—', label: 'Problems', icon: Code2 },
            { value: stats ? `${stats.totalUsers}+` : '—', label: 'Developers', icon: Users },
            { value: stats ? `${stats.totalContests}+` : '—', label: 'Contests', icon: Trophy },
            { value: '99.9%', label: 'Uptime', icon: Zap },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <Icon size={16} className="text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Active Contests */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Upcoming & Live Contests</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {activeContests.length === 0 && (
              <p className="text-sm text-muted-foreground">No contests are scheduled right now. Check back soon.</p>
            )}
            {activeContests.map(c => (
              <div key={c.id} className="card-glow rounded-xl p-5 cursor-pointer group"
                onClick={() => navigate(`/contest/${c.slug}`)}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <Trophy size={15} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{c.name}</h3>
                      {c.status === 'active' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/15 text-success font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={11} />{c.duration}m</span>
                  <span className="flex items-center gap-1"><Code2 size={11} />{c.problemCount} problems</span>
                  <span className="flex items-center gap-1"><Trophy size={11} />{c.maxScore} pts</span>
                </div>
                <div className="mt-3 flex items-center text-xs text-primary font-medium gap-1 group-hover:gap-2 transition-all">
                  View Contest <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature highlights */}
        <section>
          <h2 className="text-xl font-bold mb-5">Built for serious developers</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Real Code Execution', desc: 'Sandboxed Piston engine supports C, C++, Java, Python with strict time/memory limits.' },
              { icon: Shield, title: 'Secure & Fair', desc: 'Hidden test cases, server-side judging, and RBAC ensure integrity for every contest.' },
              { icon: BarChart2, title: 'Detailed Analytics', desc: 'Track your performance per problem, view submission history, and compete on live leaderboards.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-glow rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <Code2 size={16} />
          <span className="font-bold text-sm">ZAP</span>
        </div>
        <p className="text-xs text-muted-foreground">Professional online coding contest platform</p>
      </footer>
    </div>
  );
}
