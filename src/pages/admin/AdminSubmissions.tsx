import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Eye, Code2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import VerdictBadge from '../../components/VerdictBadge';
import { api } from '../../lib/api';
import type { Submission, Contest } from '../../types';

interface AdminSubmission extends Submission { userName?: string; userEmail?: string; }

export default function AdminSubmissions() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('all');
  const [contestFilter, setContestFilter] = useState('all');
  const [selected, setSelected] = useState<AdminSubmission | null>(null);

  const { data: contests = [] } = useQuery({ queryKey: ['admin-contests'], queryFn: () => api.get<Contest[]>('/admin/contests') });
  const { data: submissions = [] } = useQuery({
    queryKey: ['admin-submissions', statusFilter, langFilter, contestFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (contestFilter !== 'all') params.set('contestId', contestFilter);
      return api.get<AdminSubmission[]>(`/admin/submissions?${params.toString()}`);
    },
  });

  const filtered = submissions.filter(s =>
    (s.problemTitle?.toLowerCase().includes(search.toLowerCase()) || s.userId.toLowerCase().includes(search.toLowerCase())) &&
    (langFilter === 'all' || s.language === langFilter)
  );

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Submissions</h1>
          <p className="text-muted-foreground text-sm">{submissions.length} submissions total</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted border-border" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-9 bg-muted border-border"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              {['all', 'ACCEPTED', 'WRONG_ANSWER', 'PARTIAL', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEEDED', 'COMPILATION_ERROR'].map(v => (
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
          <Select value={contestFilter} onValueChange={setContestFilter}>
            <SelectTrigger className="w-48 h-9 bg-muted border-border"><SelectValue placeholder="Contest" /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Contests</SelectItem>
              {contests.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="card-glow rounded-xl overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">User</th>
                <th className="text-left">Problem</th>
                <th className="text-center">Language</th>
                <th className="text-center">Status</th>
                <th className="text-center hidden sm:table-cell">Tests</th>
                <th className="text-center">Score</th>
                <th className="text-center hidden md:table-cell">Time</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="group">
                  <td className="font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="text-xs">{s.userName ?? s.userId}</td>
                  <td className="text-sm font-medium">{s.problemTitle}</td>
                  <td className="text-center font-mono text-xs uppercase">{s.language}</td>
                  <td className="text-center"><VerdictBadge status={s.status} /></td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden sm:table-cell">{s.passedTests}/{s.totalTests}</td>
                  <td className="text-center font-mono font-bold text-sm text-primary">{s.score}</td>
                  <td className="text-center text-xs text-muted-foreground font-mono hidden md:table-cell">{Math.round(s.executionTime * 1000)}ms</td>
                  <td className="text-right">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelected(s)}>
                      <Eye size={13} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No submissions match your filters.</div>
          )}
        </div>

        {/* Source code dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code2 size={16} className="text-primary" />
                Submission {selected?.id}
              </DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Problem</p><p className="font-medium">{selected.problemTitle}</p></div>
                  <div><p className="text-xs text-muted-foreground">Language</p><p className="font-mono uppercase">{selected.language}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><VerdictBadge status={selected.status} /></div>
                  <div><p className="text-xs text-muted-foreground">Score</p><p className="font-bold text-primary">{selected.score}</p></div>
                  <div><p className="text-xs text-muted-foreground">Tests</p><p className="font-mono">{selected.passedTests}/{selected.totalTests}</p></div>
                  <div><p className="text-xs text-muted-foreground">Exec Time</p><p className="font-mono">{Math.round(selected.executionTime * 1000)}ms</p></div>
                </div>
                <div className="bg-muted/40 rounded-xl p-4 border border-border max-h-64 overflow-y-auto">
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{selected.sourceCode}</pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

