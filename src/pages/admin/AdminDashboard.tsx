import { useQuery } from '@tanstack/react-query';
import { Users, Code2, Trophy, Send, TrendingUp } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import VerdictBadge from '../../components/VerdictBadge';
import { api } from '../../lib/api';
import type { Verdict } from '../../types';

interface AdminStats {
  totalUsers: number;
  totalProblems: number;
  totalContests: number;
  activeContests: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  failedSubmissions: number;
  recentContests: { id: string; name: string; status: string }[];
  recentSubmissions: {
    id: string;
    userId: string;
    problemTitle: string;
    status: Verdict;
    score: number;
  }[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-primary',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) => (
  <div className="card-glow rounded-xl p-5">
    <div className="flex items-start justify-between mb-3">
      <div
        className={`w-9 h-9 rounded-lg bg-current/10 flex items-center justify-center ${color}`}
      >
        <Icon size={17} />
      </div>
      <TrendingUp size={14} className="text-success" />
    </div>
    <div className="text-2xl font-bold mb-0.5">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get<AdminStats>('/admin/statistics'),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Platform overview and real-time metrics
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats?.totalUsers ?? '—'}
            color="text-info"
          />
          <StatCard
            icon={Code2}
            label="Problems"
            value={stats?.totalProblems ?? '—'}
            color="text-primary"
          />
          <StatCard
            icon={Trophy}
            label="Contests"
            value={stats?.totalContests ?? '—'}
            sub={stats ? `${stats.activeContests} live` : undefined}
            color="text-warning"
          />
          <StatCard
            icon={Send}
            label="Submissions"
            value={stats?.totalSubmissions ?? '—'}
            sub={stats ? `${stats.acceptedSubmissions} accepted` : undefined}
            color="text-success"
          />
        </div>

        {/* Bottom row */}
        <div className="card-glow rounded-xl overflow-hidden w-full">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-sm">Recent Submissions</h3>
            <span className="text-xs text-muted-foreground">
              {stats?.totalSubmissions ?? 0} total
            </span>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">User</th>
                <th className="text-left">Problem</th>
                <th className="text-left">Status</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentSubmissions ?? []).map((s) => (
                <tr key={s.id}>
                  <td className="text-xs text-muted-foreground">{s.userId}</td>
                  <td className="text-xs">{s.problemTitle}</td>
                  <td>
                    <VerdictBadge status={s.status} />
                  </td>
                  <td className="text-right text-xs font-mono text-primary">
                    {s.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
