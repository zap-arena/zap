import { useQuery } from "@tanstack/react-query";
import { Eye, Search } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { api } from "../../lib/api";
import type { Contest, Participant, Submission } from "../../types";

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-info/15 text-info",
  completed: "bg-success/15 text-success",
  auto_completed: "bg-success/15 text-success",
  not_started: "bg-muted text-muted-foreground",
};

export default function AdminParticipants() {
  const [search, setSearch] = useState("");
  const [contestFilter, setContestFilter] = useState("all");
  const [selected, setSelected] = useState<Participant | null>(null);

  const { data: contests = [] } = useQuery({
    queryKey: ["admin-contests"],
    queryFn: () => api.get<Contest[]>("/admin/contests"),
  });
  const { data: participants = [] } = useQuery({
    queryKey: ["all-participants", contests.map((c) => c.id).join(",")],
    queryFn: async () => {
      const lists = await Promise.all(
        contests.map((c) =>
          api.get<Participant[]>(`/admin/contests/${c.id}/participants`),
        ),
      );
      return lists.flat();
    },
    enabled: contests.length > 0,
  });

  const { data: detail } = useQuery({
    queryKey: ["participant-detail", selected?.contestId, selected?.userId],
    queryFn: () =>
      api.get<{ participant: Participant; submissions: Submission[] }>(
        `/admin/contests/${selected?.contestId}/participants/${selected?.userId}`,
      ),
    enabled: !!selected,
  });

  const filtered = participants.filter(
    (p) =>
      (p.userName.toLowerCase().includes(search.toLowerCase()) ||
        p.userEmail.toLowerCase().includes(search.toLowerCase())) &&
      (contestFilter === "all" || p.contestId === contestFilter),
  );

  const contest = contests.find((c) => c.id === selected?.contestId);
  const subs = detail?.submissions ?? [];

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Participants</h1>
          <p className="text-muted-foreground text-sm">
            {participants.length} participants across all contests
          </p>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total", value: participants.length, color: "" },
            {
              label: "In Progress",
              value: participants.filter((p) => p.status === "in_progress")
                .length,
              color: "text-info",
            },
            {
              label: "Completed",
              value: participants.filter(
                (p) =>
                  p.status === "completed" || p.status === "auto_completed",
              ).length,
              color: "text-success",
            },
            {
              label: "Not Started",
              value: participants.filter((p) => p.status === "not_started")
                .length,
              color: "text-muted-foreground",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="card-glow rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold mb-0.5 ${color}`}>
                {value}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search participants…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted border-border"
            />
          </div>
          <Select value={contestFilter} onValueChange={setContestFilter}>
            <SelectTrigger className="w-48 h-9 bg-muted border-border">
              <SelectValue placeholder="Filter by contest" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Contests</SelectItem>
              {contests.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="card-glow rounded-xl overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-left">Participant</th>
                <th className="text-left hidden md:table-cell">Contest</th>
                <th className="text-center">Status</th>
                <th className="text-center">Score</th>
                <th className="text-center hidden sm:table-cell">Solved</th>
                <th className="text-center hidden sm:table-cell">
                  Submissions
                </th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const c = contests.find((c) => c.id === p.contestId);
                return (
                  <tr key={p.id} className="group">
                    <td>
                      <div className="font-medium text-sm">{p.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {p.userEmail}
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {c?.name ?? "—"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${STATUS_STYLES[p.status]}`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-center font-mono font-bold text-primary">
                      {p.score}
                    </td>
                    <td className="text-center text-xs text-muted-foreground hidden sm:table-cell font-mono">
                      {p.problemsSolved}
                    </td>
                    <td className="text-center text-xs text-muted-foreground hidden sm:table-cell font-mono">
                      {p.totalSubmissions}
                    </td>
                    <td className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelected(p)}
                      >
                        <Eye size={13} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Participant Details</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4 py-2 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Name", selected.userName],
                    ["Email", selected.userEmail],
                    ["Contest", contest?.name ?? "—"],
                    ["Status", selected.status.replace("_", " ")],
                    ["Score", String(selected.score)],
                    [
                      "Started",
                      selected.startedAt
                        ? new Date(selected.startedAt).toLocaleTimeString(
                            undefined,
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        : "—",
                    ],
                    [
                      "Completed",
                      selected.completedAt
                        ? new Date(selected.completedAt).toLocaleTimeString(
                            undefined,
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        : "—",
                    ],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium">{v}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-semibold mb-2 text-xs text-muted-foreground uppercase tracking-wider">
                    Submission History
                  </p>
                  {subs.length === 0 ? (
                    <p className="text-muted-foreground text-xs">
                      No submissions
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {subs.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {s.problemTitle}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {s.language.toUpperCase()} · {s.passedTests}/
                              {s.totalTests} tests
                            </p>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold font-mono ${
                              s.status === "ACCEPTED"
                                ? "text-success bg-success/15"
                                : "text-destructive bg-destructive/15"
                            }`}
                          >
                            {s.score}pts
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
