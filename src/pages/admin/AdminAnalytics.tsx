import { useQuery } from '@tanstack/react-query';
import { BarChart3, Activity, Search, ArrowUpDown, Globe, AlertTriangle, Download, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../lib/api';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Contest } from '../../types';

interface UserAnalytics {
  user: { id: string; name: string; email: string };
  metrics: Record<string, number>;
}

interface EventAnalytics {
  summary: { label: string; total: number }[];
  timeseries: any[];
  labels: string[];
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

type SortField = 'name' | 'email' | 'totalEvents' | 'malpracticeScore';

const CHART_COLORS = [
  'hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))',
  'hsl(var(--info))', 'hsl(var(--destructive))', '#8b5cf6', '#f97316', '#14b8a6'
];

const MALPRACTICE_LABELS = ['TAB_SWITCHED', 'FULLSCREEN_EXITED', 'COPY_PASTED'];

export default function AdminAnalytics() {
  const [interval, setInterval] = useState<'minute' | 'hour' | 'day'>('hour');
  const [selectedContest, setSelectedContest] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  // Fetch filters data
  const { data: contests = [] } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: () => api.get<Contest[]>('/admin/contests')
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => api.get<AdminUser[]>('/admin/users')
  });

  // Fetch analytics data
  const { data: usersData = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-analytics-users', selectedContest, selectedUser],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedContest !== 'all') params.append('contest_id', selectedContest);
      if (selectedUser !== 'all') params.append('user_id', selectedUser);
      return api.get<UserAnalytics[]>(`/admin/analytics/users?${params.toString()}`);
    }
  });

  const { data: eventsData, isLoading: loadingEvents } = useQuery({
    queryKey: ['admin-analytics-events', interval, selectedContest, selectedUser],
    queryFn: () => {
      const params = new URLSearchParams({ interval });
      if (selectedContest !== 'all') params.append('contest_id', selectedContest);
      if (selectedUser !== 'all') params.append('user_id', selectedUser);
      return api.get<EventAnalytics>(`/admin/analytics/events?${params.toString()}`);
    }
  });

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('malpracticeScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSorted = useMemo(() => {
    let result = [...usersData];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        row =>
          row.user.name?.toLowerCase().includes(lower) ||
          row.user.email?.toLowerCase().includes(lower) ||
          row.user.id.toLowerCase().includes(lower)
      );
    }

    result.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (sortField === 'name') {
        valA = a.user.name || '';
        valB = b.user.name || '';
      } else if (sortField === 'email') {
        valA = a.user.email || '';
        valB = b.user.email || '';
      } else if (sortField === 'malpracticeScore') {
        valA = MALPRACTICE_LABELS.reduce((sum, label) => sum + (a.metrics[label] || 0), 0);
        valB = MALPRACTICE_LABELS.reduce((sum, label) => sum + (b.metrics[label] || 0), 0);
      } else {
        valA = Object.values(a.metrics).reduce((sum, c) => sum + c, 0);
        valB = Object.values(b.metrics).reduce((sum, c) => sum + c, 0);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [usersData, search, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-left"
    >
      {label}
      <ArrowUpDown size={12} className={sortField === field ? 'text-primary' : 'text-muted-foreground opacity-50'} />
    </button>
  );

  const dynamicLabels = eventsData?.labels || [];

  // Export functions
  const exportCSV = () => {
    const headers = ['Candidate Name', 'Candidate Email', 'Malpractice Score', 'Total Events', ...dynamicLabels];
    
    const rows = filteredAndSorted.map(row => {
      const totalEvents = Object.values(row.metrics).reduce((sum, c) => sum + c, 0);
      const malpracticeScore = MALPRACTICE_LABELS.reduce((sum, label) => sum + (row.metrics[label] || 0), 0);
      
      const rowData = [
        row.user.name,
        row.user.email,
        malpracticeScore.toString(),
        totalEvents.toString(),
        ...dynamicLabels.map(label => (row.metrics[label] || 0).toString())
      ];
      
      // Escape commas and quotes for CSV
      return rowData.map(val => `"${val.replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analytics_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(16);
    doc.text('Analytics Dashboard Export', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}`, 14, 22);
    
    let filterText = '';
    if (selectedContest !== 'all') {
      const c = contests.find(c => c.id === selectedContest);
      filterText += `Contest: ${c?.name || selectedContest}   `;
    }
    if (selectedUser !== 'all') {
      const u = allUsers.find(u => u.id === selectedUser);
      filterText += `Candidate: ${u?.name || selectedUser}`;
    }
    if (filterText) {
      doc.text(filterText, 14, 28);
    }

    const headers = [['Name', 'Email', 'Malpractice', 'Total', ...dynamicLabels]];
    
    const data = filteredAndSorted.map(row => {
      const totalEvents = Object.values(row.metrics).reduce((sum, c) => sum + c, 0);
      const malpracticeScore = MALPRACTICE_LABELS.reduce((sum, label) => sum + (row.metrics[label] || 0), 0);
      
      return [
        row.user.name,
        row.user.email,
        malpracticeScore.toString(),
        totalEvents.toString(),
        ...dynamicLabels.map(label => (row.metrics[label] || 0).toString())
      ];
    });

    autoTable(doc, {
      head: headers,
      body: data,
      startY: filterText ? 32 : 28,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save('analytics_export.pdf');
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
        
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" /> Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">Track user activity, overall metrics, and candidate malpractice.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-card border border-border p-2 rounded-xl shadow-sm">
            <select
              value={selectedContest}
              onChange={(e) => setSelectedContest(e.target.value)}
              className="h-9 text-sm bg-muted border border-border rounded-md px-3 outline-none focus:border-primary transition-colors"
            >
              <option value="all">All Contests</option>
              {contests.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="h-9 text-sm bg-muted border border-border rounded-md px-3 outline-none focus:border-primary transition-colors max-w-[200px]"
            >
              <option value="all">All Candidates</option>
              {allUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>

            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 h-9 border-border text-foreground hover:bg-muted">
              <Download size={14} /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportPDF} className="gap-2 h-9 border-border text-foreground hover:bg-muted">
              <FileText size={14} /> Export PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="global" className="flex items-center gap-2"><Globe size={14}/> Global Overview</TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2"><Activity size={14}/> Candidate Details</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-6">
            {/* Chart */}
            <div className="card-glow rounded-xl overflow-hidden bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" /> Events Volume
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Interval:</span>
                  <select 
                    value={interval}
                    onChange={(e) => setInterval(e.target.value as any)}
                    className="h-8 text-xs bg-muted border border-border rounded px-2 outline-none focus:border-primary transition-colors"
                  >
                    <option value="minute">Per Minute</option>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>
              
              <div className="w-full h-[400px]">
                {loadingEvents ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Loading graph data...</div>
                ) : !eventsData || eventsData.timeseries.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No tracking data available to graph.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eventsData.timeseries} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          if (interval === 'minute' || interval === 'hour') return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                          return d.toLocaleDateString();
                        }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        labelFormatter={(val) => new Date(val).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      {dynamicLabels.map((label, index) => (
                        <Line 
                          key={label} type="monotone" dataKey={label} 
                          stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                          activeDot={{ r: 6 }} strokeWidth={2} connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Summary Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Overall Tracking Metrics</h3>
                <span className="text-xs text-muted-foreground">{eventsData?.summary.length || 0} unique labels</span>
              </div>
              
              {loadingEvents ? (
                <div className="text-muted-foreground text-sm">Loading summary data...</div>
              ) : !eventsData || eventsData.summary.length === 0 ? (
                <div className="text-muted-foreground text-sm">No summary data available.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {eventsData.summary.map(row => (
                    <div key={row.label} className="card-glow rounded-xl p-4 flex flex-col justify-between">
                      <div className="text-xs font-semibold text-muted-foreground mb-2 break-words">
                        {row.label}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {row.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="card-glow rounded-xl overflow-hidden bg-card border border-border">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Candidate Event Matrix</h3>
                  <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted ml-2">
                    {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'candidate' : 'candidates'}
                  </span>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 text-sm bg-muted border-border"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr>
                      <th className="text-left whitespace-nowrap"><SortHeader field="name" label="Candidate" /></th>
                      <th className="text-left whitespace-nowrap"><SortHeader field="email" label="Contact" /></th>
                      <th className="text-center whitespace-nowrap border-l border-r border-border bg-destructive/5 text-destructive">
                        <SortHeader field="malpracticeScore" label="Malpractice Score" />
                      </th>
                      <th className="text-center whitespace-nowrap"><SortHeader field="totalEvents" label="Total Events" /></th>
                      
                      {/* Dynamic Columns */}
                      {dynamicLabels.map(label => (
                        <th key={label} className="text-center text-xs font-semibold text-muted-foreground whitespace-nowrap px-4">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={4 + dynamicLabels.length} className="text-center py-8 text-muted-foreground text-sm">Loading candidate data...</td>
                      </tr>
                    ) : filteredAndSorted.length === 0 ? (
                      <tr>
                        <td colSpan={4 + dynamicLabels.length} className="text-center py-8 text-muted-foreground text-sm">
                          {search ? 'No candidates matched your search criteria.' : 'No candidate tracking data available yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredAndSorted.map(row => {
                        const totalEvents = Object.values(row.metrics).reduce((sum, c) => sum + c, 0);
                        const malpracticeScore = MALPRACTICE_LABELS.reduce((sum, label) => sum + (row.metrics[label] || 0), 0);
                        
                        return (
                          <tr key={row.user.id} className="group hover:bg-muted/30 transition-colors">
                            <td className="whitespace-nowrap">
                              <div className="font-medium text-sm">{row.user.name}</div>
                              <div className="font-mono text-[10px] text-muted-foreground mt-0.5">ID: {row.user.id}</div>
                            </td>
                            <td className="text-sm text-muted-foreground whitespace-nowrap">{row.user.email}</td>
                            
                            <td className="text-center border-l border-r border-border bg-destructive/5 font-bold">
                              {malpracticeScore > 0 ? (
                                <div className="flex items-center justify-center gap-1.5 text-destructive">
                                  <AlertTriangle size={14} /> {malpracticeScore}
                                </div>
                              ) : (
                                <span className="text-muted-foreground/50">0</span>
                              )}
                            </td>
                            
                            <td className="text-center font-bold text-primary">{totalEvents}</td>

                            {/* Dynamic Columns */}
                            {dynamicLabels.map(label => {
                              const count = row.metrics[label] || 0;
                              const isMalpractice = MALPRACTICE_LABELS.includes(label);
                              
                              return (
                                <td key={label} className={`text-center font-mono text-sm ${count > 0 ? (isMalpractice ? 'text-destructive font-bold' : 'text-foreground') : 'text-muted-foreground/30'}`}>
                                  {count}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
