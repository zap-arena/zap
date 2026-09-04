import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, BookOpen, Trophy, CheckCircle, AlertCircle, Loader2, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { useAuth } from '../store/auth';
import { api, ApiError } from '../lib/api';
import type { Contest } from '../types';
import { toast } from 'sonner';

interface ContestSession {
  started: boolean;
  status?: string;
  score?: number;
  problemsSolved?: number;
  totalSubmissions?: number;
}

export default function ContestEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', slug],
    queryFn: () => api.get<Contest>(`/contests/${slug}`),
    enabled: !!slug,
    retry: false,
  });

  const { data: session } = useQuery({
    queryKey: ['session', contest?.id],
    queryFn: () => api.get<ContestSession>(`/contests/${contest!.id}/session`),
    enabled: !!contest?.id && !!user,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Contest Not Found</h2>
          <p className="text-muted-foreground">This contest link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const hours = Math.floor(contest.duration / 60);
  const mins = contest.duration % 60;
  const durationStr = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;

  const finished = session?.started && (session.status === 'completed' || session.status === 'auto_completed');
  const inProgress = session?.started && session.status === 'in_progress';

  const handleStart = async () => {
    if (!user) { navigate(`/login?redirect=/contest/${slug}`); return; }
    setStarting(true);
    try {
      await api.post(`/contests/${contest.id}/start`);
      await queryClient.invalidateQueries({ queryKey: ['session', contest.id] });
      toast.success(inProgress ? 'Resuming your attempt' : 'Contest started! Good luck!');
      navigate(`/contest/${contest.id}/workspace`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not start the contest');
    } finally {
      setStarting(false);
    }
  };

  const statusColor = contest.status === 'active' ? 'text-success' :
    contest.status === 'completed' ? 'text-muted-foreground' : 'text-warning';
  const statusLabel = { active: 'Live', scheduled: 'Upcoming', completed: 'Ended', draft: 'Draft', cancelled: 'Cancelled' }[contest.status];

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ background: 'var(--gradient-glow), hsl(var(--background))' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
              <span className={`w-2 h-2 rounded-full ${contest.status === 'active' ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              {statusLabel}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{contest.name}</h1>
          <p className="text-muted-foreground leading-relaxed">{contest.description}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Clock, label: 'Duration', value: durationStr },
            { icon: BookOpen, label: 'Problems', value: String(contest.problemCount) },
            { icon: Trophy, label: 'Max Score', value: String(contest.maxScore) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-glow rounded-xl p-5 text-center">
              <Icon size={20} className="text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold mb-0.5">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Already-completed notice */}
        {finished && (
          <div className="card-glow rounded-xl p-6 mb-6 border-warning/40">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Lock size={16} className="text-warning" /> You have already completed this contest
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Only one attempt is allowed. Your submitted attempt has been recorded.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-primary">{session?.score ?? 0}</div>
                <div className="text-xs text-muted-foreground">Final score</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{session?.problemsSolved ?? 0}</div>
                <div className="text-xs text-muted-foreground">Problems solved</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{session?.totalSubmissions ?? 0}</div>
                <div className="text-xs text-muted-foreground">Submissions</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card-glow rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-primary" /> Instructions
          </h3>
          {contest.instructions?.trim() && (
            <p className="text-sm text-foreground whitespace-pre-line mb-4 pb-4 border-b border-border">
              {contest.instructions}
            </p>
          )}
          <ul className="space-y-2">
            {[
              'The problem set is revealed only after you start the contest.',
              'You get one attempt: once you finish, the contest cannot be re-entered.',
              'You can sign out and back in during the contest — your timer keeps running.',
              'The contest runs in fullscreen and your activity is monitored until you finish.',
              'You can submit multiple times — only your best submission counts.',
              'Hidden test cases are used for final evaluation and scoring.',
              contest.scoringMode === 'partial'
                ? 'Partial scoring: score is proportional to test cases passed.'
                : 'Full scoring: all test cases must pass to earn points.',
              'Submissions made after the contest end time are not scored.',
            ].map((inst, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                <span>{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleStart}
            disabled={starting || finished || contest.status === 'completed'}
            className="btn-primary h-12 px-12 text-base font-semibold gap-2"
          >
            {starting ? <><Loader2 size={18} className="animate-spin" />{inProgress ? 'Resuming…' : 'Starting Contest…'}</> :
              finished ? <><Lock size={16} />Attempt Completed</> :
              contest.status === 'completed' ? 'Contest Ended' :
              inProgress ? '▶ Resume Contest' : '🚀 Start Contest'}
          </Button>
          {!user && (
            <p className="text-sm text-muted-foreground">
              You'll be asked to <span className="text-primary">sign in</span> before starting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
