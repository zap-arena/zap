import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Copy,
  Eye,
  Search,
  Trophy,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Loader2,
  Megaphone,
} from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Checkbox } from "../../components/ui/checkbox";
import { api, ApiError } from "../../lib/api";
import type { Contest } from "../../types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/15 text-success",
  scheduled: "bg-warning/15 text-warning",
  completed: "bg-muted text-muted-foreground",
  draft: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "text-success",
  Medium: "text-warning",
  Hard: "text-destructive",
};

interface ProblemSearchResult {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  tags: string[];
  maxScore: number;
  status: string;
  testCasesCount: number;
}

/** Debounced, server-backed problem picker used when building a contest. */
function ProblemPicker({
  attached,
  onAdd,
}: {
  attached: { problemId: string }[];
  onAdd: (p: ProblemSearchResult) => void;
}) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term), 250);
    return () => clearTimeout(id);
  }, [term]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["problem-search", debounced],
    queryFn: () =>
      api.get<ProblemSearchResult[]>(
        `/admin/problems/search?limit=20&q=${encodeURIComponent(debounced)}`,
      ),
  });

  const attachedIds = new Set(attached.map((a) => a.problemId));

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        {isFetching && (
          <Loader2
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        )}
        <Input
          placeholder="Search problems by title or slug…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="pl-9 h-9 bg-muted border-border"
        />
      </div>
      <div className="border border-border rounded-lg divide-y divide-border max-h-52 overflow-y-auto">
        {results.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">
            {debounced
              ? `No problems match "${debounced}"`
              : "No problems available"}
          </p>
        )}
        {results.map((p) => {
          const already = attachedIds.has(p.id);
          return (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium truncate">
                    {p.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-semibold ${DIFFICULTY_STYLES[p.difficulty]}`}
                  >
                    {p.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono truncate">
                  {p.slug} · {p.testCasesCount} tests · {p.maxScore}pts
                </p>
              </div>
              <Button
                size="sm"
                variant={already ? "ghost" : "outline"}
                disabled={already}
                className="h-7 px-2 text-xs shrink-0"
                onClick={() => onAdd(p)}
              >
                {already ? "Added" : "Add"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ContestNotification {
  id: string;
  message: string;
  createdAt: string;
}

/** Compose and broadcast a notice to everyone who joined the contest. */
function NotificationPanel({ contestId }: { contestId: string }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const queryClient = useQueryClient();

  const { data: sent = [] } = useQuery({
    queryKey: ["contest-notifications", contestId],
    queryFn: () =>
      api.get<ContestNotification[]>(
        `/admin/contests/${contestId}/notifications`,
      ),
  });

  const send = async () => {
    if (!message.trim()) {
      toast.error("Enter a message first");
      return;
    }
    setSending(true);
    try {
      const res = await api.post<{ recipients: number }>(
        `/admin/contests/${contestId}/notifications`,
        { message: message.trim() },
      );
      toast.success(`Notification sent to ${res.recipients} participant(s)`);
      setMessage("");
      queryClient.invalidateQueries({
        queryKey: ["contest-notifications", contestId],
      });
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to send notification",
      );
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/admin/contests/${contestId}/notifications/${id}`);
      queryClient.invalidateQueries({
        queryKey: ["contest-notifications", contestId],
      });
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete notification",
      );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <Megaphone size={13} /> Notify participants
      </Label>
      <Textarea
        placeholder="e.g. Test case 2 of Problem 3 has been corrected — please re-submit."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="bg-muted border-border resize-none"
        rows={2}
      />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={sending} onClick={send}>
          <Megaphone size={13} className="mr-1.5" /> Send to everyone
        </Button>
      </div>
      {sent.length > 0 && (
        <div className="border border-border rounded-lg divide-y divide-border max-h-32 overflow-y-auto">
          {sent.map((n) => (
            <div key={n.id} className="flex items-start gap-2 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs">{n.message}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => remove(n.id)}
                title="Delete"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface AttachedProblem {
  problemId: string;
  order: number;
  maxScore: number;
  title: string;
  difficulty: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/** <input type="datetime-local"> needs a local 'YYYY-MM-DDTHH:mm' string, not an ISO/UTC one. */
function toLocalInput(iso: string | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

function fromLocalInput(value: string): Date {
  return new Date(value);
}

/** Create/edit form shared by both dialogs. */
function ContestForm({
  contest,
  onSaved,
  onCancel,
}: {
  contest: Contest | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const isEdit = !!contest;
  const [saving, setSaving] = useState(false);
  const defaultStart = toLocalInput(contest?.startTime);
  const [defaultEnd] = useState(() =>
    toLocalInput(
      contest?.endTime ??
        new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    ),
  );
  const [form, setForm] = useState({
    name: contest?.name ?? "",
    slug: contest?.slug ?? "",
    description: contest?.description ?? "",
    instructions: contest?.instructions ?? "",
    startTime: defaultStart,
    endTime: defaultEnd,
    duration: String(contest?.duration ?? 120),
    scoringMode: contest?.scoringMode ?? "partial",
    mode: contest?.mode ?? "standard",
    leaderboardVisible: contest?.leaderboardVisible ?? true,
  });
  const [moderatorIds, setModeratorIds] = useState<string[]>(
    (contest?.moderators ?? []).map((m) => m.userId),
  );
  const [attached, setAttached] = useState<AttachedProblem[]>(
    (contest?.problems ?? []).map((cp, i) => ({
      problemId: cp.problemId,
      order: i,
      maxScore: cp.maxScore,
      title: cp.title ?? cp.problemId,
      difficulty: cp.difficulty ?? "Easy",
    })),
  );

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => api.get<AdminUser[]>("/admin/users"),
  });
  const admins = users.filter((u) => u.role === "admin");

  const toggleModerator = (id: string) =>
    setModeratorIds((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );

  const addProblem = (p: ProblemSearchResult) =>
    setAttached((list) =>
      list.some((a) => a.problemId === p.id)
        ? list
        : [
            ...list,
            {
              problemId: p.id,
              order: list.length,
              maxScore: p.maxScore,
              title: p.title,
              difficulty: p.difficulty,
            },
          ],
    );

  const removeProblem = (problemId: string) =>
    setAttached((list) =>
      list
        .filter((a) => a.problemId !== problemId)
        .map((a, i) => ({ ...a, order: i })),
    );

  const move = (index: number, delta: number) =>
    setAttached((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((a, i) => ({ ...a, order: i }));
    });

  const setScore = (problemId: string, maxScore: number) =>
    setAttached((list) =>
      list.map((a) => (a.problemId === problemId ? { ...a, maxScore } : a)),
    );

  const totalScore = useMemo(
    () => attached.reduce((s, a) => s + a.maxScore, 0),
    [attached],
  );

  const save = async (publish: boolean) => {
    if (!form.name.trim()) {
      toast.error("Contest name is required");
      return;
    }
    if (attached.length === 0) {
      toast.error("Add at least one problem");
      return;
    }
    const startTime = fromLocalInput(form.startTime);
    const endTime = fromLocalInput(form.endTime);
    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      toast.error("Enter a valid start and end date/time");
      return;
    }
    if (endTime <= startTime) {
      toast.error("End time must be after the start time");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        instructions: form.instructions,
        duration: Number(form.duration) || 60,
        scoringMode: form.scoringMode,
        mode: form.mode,
        leaderboardVisible: form.leaderboardVisible,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        slug: form.slug.trim() || undefined,
        problems: attached.map((a, i) => ({
          problemId: a.problemId,
          order: i,
          maxScore: a.maxScore,
        })),
        moderatorIds,
      };

      if (isEdit) {
        await api.put<Contest>(`/admin/contests/${contest.id}`, body);
        toast.success(`"${form.name}" updated`);
      } else {
        const created = await api.post<Contest>("/admin/contests", body);
        if (publish) await api.post(`/admin/contests/${created.id}/publish`);
        toast.success(
          `Contest "${form.name}" ${publish ? "created and published" : "saved as draft"}!`,
        );
      }
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save contest",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-5 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Contest Title</Label>
            <Input
              placeholder="Python Challenge 2026"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-muted border-border"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Custom URL Slug (Optional)</Label>
            <Input
              placeholder="python-challenge-2026"
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-"),
                }))
              }
              className="bg-muted border-border"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Short summary shown on the contest card…"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="bg-muted border-border resize-none"
              rows={2}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Instructions</Label>
            <Textarea
              placeholder="Rules and instructions shown to participants before they start…"
              value={form.instructions}
              onChange={(e) =>
                setForm((f) => ({ ...f, instructions: e.target.value }))
              }
              className="bg-muted border-border resize-none"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Starts at</Label>
            <Input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, startTime: e.target.value }))
              }
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Ends at</Label>
            <Input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) =>
                setForm((f) => ({ ...f, endTime: e.target.value }))
              }
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label>Attempt duration (minutes)</Label>
            <Input
              type="number"
              value={form.duration}
              onChange={(e) =>
                setForm((f) => ({ ...f, duration: e.target.value }))
              }
              className="bg-muted border-border"
            />
            <p className="text-[11px] text-muted-foreground">
              Per-participant timer, capped by the end time.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Scoring Mode</Label>
            <Select
              value={form.scoringMode}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, scoringMode: v as "full" | "partial" }))
              }
            >
              <SelectTrigger className="bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="partial">Partial (proportional)</SelectItem>
                <SelectItem value="full">Full (all-or-nothing)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Contest Mode</Label>
            <Select
              value={form.mode}
              onValueChange={(v) =>
                setForm((f) => ({
                  ...f,
                  mode: v as "standard" | "progressive",
                }))
              }
            >
              <SelectTrigger className="bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="progressive">
                  Progressive ("Code War" chains)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Progressive contests only attach chain problems; each stage
              unlocks after the previous one is accepted.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Moderators ({moderatorIds.length})</Label>
          {admins.length === 0 ? (
            <p className="border border-dashed border-border rounded-lg px-4 py-4 text-center text-xs text-muted-foreground">
              No admin users available to assign.
            </p>
          ) : (
            <div className="border border-border rounded-lg divide-y divide-border max-h-40 overflow-y-auto">
              {admins.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 cursor-pointer"
                >
                  <Checkbox
                    checked={moderatorIds.includes(u.id)}
                    onCheckedChange={() => toggleModerator(u.id)}
                    className="border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium">{u.name}</span>
                    <span className="ml-2 text-[11px] text-muted-foreground font-mono">
                      {u.email}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Add Problems</Label>
          <ProblemPicker attached={attached} onAdd={addProblem} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Contest Problems ({attached.length})</Label>
            <span className="text-xs text-muted-foreground font-mono">
              {totalScore} pts total
            </span>
          </div>
          {attached.length === 0 ? (
            <p className="border border-dashed border-border rounded-lg px-4 py-6 text-center text-xs text-muted-foreground">
              No problems added yet — search above to add some.
            </p>
          ) : (
            <div className="border border-border rounded-lg divide-y divide-border">
              {attached.map((a, i) => (
                <div
                  key={a.problemId}
                  className="flex items-center gap-2 px-3 py-2.5"
                >
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none text-[10px]"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === attached.length - 1}
                      className="text-muted-foreground hover:text-foreground disabled:opacity-30 leading-none text-[10px]"
                    >
                      ▼
                    </button>
                  </div>
                  <GripVertical
                    size={13}
                    className="text-muted-foreground shrink-0"
                  />
                  <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">
                      {a.title}
                    </span>
                    <span
                      className={`ml-2 text-[10px] font-mono font-semibold ${DIFFICULTY_STYLES[a.difficulty]}`}
                    >
                      {a.difficulty}
                    </span>
                  </div>
                  <Input
                    type="number"
                    value={a.maxScore}
                    aria-label={`Max score for ${a.title}`}
                    onChange={(e) =>
                      setScore(a.problemId, Number(e.target.value) || 0)
                    }
                    className="h-7 w-20 bg-muted border-border text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeProblem(a.problemId)}
                    title="Remove"
                  >
                    <X size={13} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={form.leaderboardVisible}
            onCheckedChange={(v) =>
              setForm((f) => ({ ...f, leaderboardVisible: !!v }))
            }
          />
          <div>
            <span className="text-sm font-medium">
              Show leaderboard during contest
            </span>
            <p className="text-xs text-muted-foreground">
              Participants can see real-time rankings
            </p>
          </div>
        </label>

        {isEdit && <NotificationPanel contestId={contest.id} />}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {isEdit ? (
          <Button
            className="btn-primary"
            disabled={saving}
            onClick={() => save(false)}
          >
            Save Changes
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => save(false)}
            >
              Save Draft
            </Button>
            <Button
              className="btn-primary"
              disabled={saving}
              onClick={() => save(true)}
            >
              Create &amp; Publish
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  );
}

export default function AdminContests() {
  const queryClient = useQueryClient();
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["admin-contests"],
    queryFn: () => api.get<Contest[]>("/admin/contests"),
  });

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Contest | null>(null);
  const [deleting, setDeleting] = useState<Contest | null>(null);
  const navigate = useNavigate();

  const filtered = contests.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const copyUrl = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/contest/${slug}`);
    toast.success("Contest URL copied!");
  };

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-contests"] });

  const handlePublish = async (c: Contest) => {
    try {
      await api.post(`/admin/contests/${c.id}/publish`);
      toast.success(`"${c.name}" is now live!`);
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to publish contest",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/admin/contests/${deleting.id}`);
      toast.success(`"${deleting.name}" cancelled`);
      setDeleting(null);
      refresh();
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to delete contest",
      );
    }
  };

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
      <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Contests</h1>
            <p className="text-muted-foreground text-sm">
              {contests.length} contests total
            </p>
          </div>
          <Button
            size="sm"
            className="btn-primary gap-1.5"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={14} /> New Contest
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search contests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-muted border-border"
          />
        </div>

        {/* Contest cards */}
        <div className="space-y-3">
          {filtered.map((c) => {
            const maxScore = c.problems.reduce((s, cp) => s + cp.maxScore, 0);
            return (
              <div key={c.id} className="card-glow rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <Trophy size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${STATUS_STYLES[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                      {c.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>
                        🗓{" "}
                        {new Date(c.startTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        →{" "}
                        {new Date(c.endTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                      <span>⏱ {c.duration}m</span>
                      <span>📝 {c.problems.length} problems</span>
                      <span>🏆 {maxScore} pts</span>
                      <span>📊 {c.scoringMode} scoring</span>
                      {c.moderators?.length > 0 && (
                        <span>🛡 {c.moderators.length} moderator(s)</span>
                      )}
                      <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                        /contest/{c.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => copyUrl(c.slug)}
                      title="Copy URL"
                    >
                      <Copy size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => navigate(`/admin/contests/${c.id}`)}
                      title="View"
                    >
                      <Eye size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setEditing(c)}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleting(c)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </Button>
                    {c.status === "draft" && (
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs btn-primary"
                        onClick={() => handlePublish(c)}
                      >
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Contest</DialogTitle>
            </DialogHeader>
            {showCreate && (
              <ContestForm
                contest={null}
                onCancel={() => setShowCreate(false)}
                onSaved={() => {
                  setShowCreate(false);
                  refresh();
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
        >
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Contest</DialogTitle>
            </DialogHeader>
            {editing && (
              <ContestForm
                key={editing.id}
                contest={editing}
                onCancel={() => setEditing(null)}
                onSaved={() => {
                  setEditing(null);
                  refresh();
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
        >
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this contest?</AlertDialogTitle>
              <AlertDialogDescription>
                "{deleting?.name}" will be marked as cancelled and hidden from
                participants. Existing submissions and results are kept.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep contest</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancel contest
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
