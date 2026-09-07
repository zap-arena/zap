import { useQuery } from "@tanstack/react-query";
import { Brain, ChevronRight, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { api } from "../../lib/api";
import type { Contest } from "../../types";

interface AdminParticipantRow {
  userId: string;
}

function ContestRow({ contest }: { contest: Contest }) {
  const navigate = useNavigate();
  const { data: participants = [] } = useQuery({
    queryKey: ["admin-participants", contest.id],
    queryFn: () =>
      api.get<AdminParticipantRow[]>(
        `/admin/contests/${contest.id}/participants`,
      ),
  });

  return (
    <button
      onClick={() =>
        navigate(`/admin/contests/${contest.id}/progressive-analytics`)
      }
      className="w-full card-glow rounded-xl px-5 py-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors"
    >
      <Trophy size={16} className="text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{contest.name}</div>
        <div className="text-xs text-muted-foreground">
          {contest.problemCount} chain problem
          {contest.problemCount === 1 ? "" : "s"} · {contest.status}
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        <Users size={13} />
        {participants.length}
      </div>
      <ChevronRight size={16} className="text-muted-foreground shrink-0" />
    </button>
  );
}

export default function AdminCodeWar() {
  const { data: contests = [], isLoading } = useQuery({
    queryKey: ["admin-contests"],
    queryFn: () => api.get<Contest[]>("/admin/contests"),
  });

  const progressive = contests.filter((c) => c.mode === "progressive");

  return (
    <AdminLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-5 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain size={20} className="text-primary" /> Code War Analysis
          </h1>
          <p className="text-muted-foreground text-sm">
            Pick a Code War contest to see how each candidate solved its chains
            — approach, complexity and behaviour score.
          </p>
        </div>

        {isLoading && (
          <div className="text-center text-muted-foreground py-10">
            Loading…
          </div>
        )}

        {!isLoading && progressive.length === 0 && (
          <div className="card-glow rounded-xl p-8 text-center space-y-2">
            <Brain size={28} className="text-muted-foreground mx-auto" />
            <p className="text-sm font-medium">No Code War contests yet</p>
            <p className="text-xs text-muted-foreground">
              Create a contest with mode set to “Progressive” and attach a chain
              problem to start collecting solving-behaviour data.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {progressive.map((c) => (
            <ContestRow key={c.id} contest={c} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
