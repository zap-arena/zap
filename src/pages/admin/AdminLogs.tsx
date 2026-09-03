import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import VerdictBadge from '../../components/VerdictBadge';
import { api } from '../../lib/api';
import type { Verdict } from '../../types';

interface AdminLogEntry {
  id: string; submissionId: string | null; userId: string | null; userName: string | null;
  problemTitle: string | null; language: string | null; status: Verdict;
  executionDuration: number; passedTests: number; failedTests: number; errorType: string | null; createdAt: string;
}

export default function AdminLogs() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');

  const { data: logs = [] } = useQuery({ queryKey: ['admin-logs'], queryFn: () => api.get<AdminLogEntry[]>('/admin/logs') });

  const filtered = logs.filter(log =>
    ((log.userName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (log.problemTitle ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (log.submissionId ?? '').includes(search)) &&
    (statusFilter === 'all' || log.status === statusFilter) &&
    (langFilter === 'all' || log.language === langFilter)
  );

  const avgDuration = logs.length > 0 ? Math.round((logs.reduce((s, l) => s + l.executionDuration, 0) / logs.length) * 1000) : 0;

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Execution Logs</h1>
          <p className="text-muted-foreground text-sm">Backend execution audit trail — {logs.length} records</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Executions', value: logs.length, color: '' },
            { label: 'Accepted', value: logs.filter(l => l.status === 'ACCEPTED').length, color: 'text-success' },
            { label: 'Failed', value: logs.filter(l => l.status !== 'ACCEPTED').length, color: 'text-destructive' },
            { label: 'Avg Duration', value: `${avgDuration}ms`, color: 'text-primary' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card-glow rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold mb-0.5 font-mono ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search logs…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted border-border" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9 bg-muted border-border"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {['all', 'ACCEPTED', 'WRONG_ANSWER', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED'].map(v => (
                <SelectItem key={v} value={v}>{v === 'all' ? 'All Statuses' : v.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={langFilter} onValueChange={setLangFilter}>
            <SelectTrigger className="w-32 h-9 bg-muted border-border"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {['all', 'cpp', 'c', 'java', 'python'].map(v => (
                <SelectItem key={v} value={v}>{v === 'all' ? 'All Langs' : v.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="card-glow rounded-xl overflow-x-auto">
          <table className="w-full data-table min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left">Log ID</th>
                <th className="text-left">Submission</th>
                <th className="text-left">User</th>
                <th className="text-left">Problem</th>
                <th className="text-center">Lang</th>
                <th className="text-center">Status</th>
                <th className="text-center">Tests</th>
                <th className="text-right">Duration</th>
                <th className="text-right">Error Type</th>
                <th className="text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="font-mono">
                  <td className="text-xs text-muted-foreground">{log.id}</td>
                  <td className="text-xs text-muted-foreground">{log.submissionId}</td>
                  <td className="text-xs text-foreground font-sans">{log.userName}</td>
                  <td className="text-xs text-foreground font-sans">{log.problemTitle}</td>
                  <td className="text-center text-xs uppercase">{log.language}</td>
                  <td className="text-center"><VerdictBadge status={log.status} /></td>
                  <td className="text-center text-xs">
                    <span className="text-success">{log.passedTests}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-destructive">{log.failedTests}</span>
                  </td>
                  <td className="text-right text-xs text-primary">{Math.round(log.executionDuration * 1000)}ms</td>
                  <td className="text-right text-xs text-warning">{log.errorType ?? '—'}</td>
                  <td className="text-right text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No logs match your criteria.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

