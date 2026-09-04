import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, ChevronDown, ChevronUp } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type {
	Contest,
	ParticipantAnalytics,
	BehaviorPattern,
} from "../../types";

const PATTERN_LABEL: Record<BehaviorPattern, string> = {
	optimal_from_start: "Optimal from the start",
	brute_then_optimized: "Brute force, then optimized",
	shortcut_then_rework: "Shortcut early, reworked later",
	struggling: "Struggling throughout",
};

const PATTERN_COLOR: Record<BehaviorPattern, string> = {
	optimal_from_start: "text-success bg-success/10",
	brute_then_optimized: "text-info bg-info/10",
	shortcut_then_rework: "text-warning bg-warning/10",
	struggling: "text-destructive bg-destructive/10",
};

export default function ProgressiveAnalyticsPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const { data: contest } = useQuery({
		queryKey: ["admin-contest", id],
		queryFn: () => api.get<Contest>(`/admin/contests/${id}`),
		enabled: !!id,
	});
	const { data: participants = [], isLoading } = useQuery({
		queryKey: ["admin-progressive-analytics", id],
		queryFn: () =>
			api.get<ParticipantAnalytics[]>(
				`/admin/contests/${id}/progressive-analytics`,
			),
		enabled: !!id,
	});

	const toggle = (userId: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(userId) ? next.delete(userId) : next.add(userId);
			return next;
		});

	return (
		<AdminLayout>
			<div className="p-6 max-w-6xl mx-auto space-y-5 animate-fade-in">
				<div className="flex items-center gap-3">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => navigate(`/admin/contests/${id}`)}
						className="h-8 w-8"
					>
						<ArrowLeft size={16} />
					</Button>
					<div className="flex-1">
						<h1 className="text-2xl font-bold flex items-center gap-2">
							<Brain size={20} className="text-primary" /> Solving Behavior
							Analytics
						</h1>
						<p className="text-muted-foreground text-sm">
							{contest?.name ?? "Progressive contest"} — how each student
							approached the chain (admin-only, does not affect scores).
						</p>
					</div>
				</div>

				{isLoading && (
					<div className="text-center text-muted-foreground py-10">
						Loading…
					</div>
				)}
				{!isLoading && participants.length === 0 && (
					<div className="card-glow rounded-xl p-8 text-center text-muted-foreground text-sm">
						No participants have started this contest yet.
					</div>
				)}

				{participants.map((p) => (
					<div key={p.userId} className="card-glow rounded-xl overflow-hidden">
						<button
							onClick={() => toggle(p.userId)}
							className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
						>
							<div className="text-left">
								<div className="font-semibold text-sm">{p.userName}</div>
								<div className="text-xs text-muted-foreground">
									{p.chains.length} chain(s) attempted
								</div>
							</div>
							<div className="flex items-center gap-3">
								{p.chains.map((c) => (
									<span
										key={c.problemId}
										className={`text-[10px] px-2 py-1 rounded-full font-mono ${PATTERN_COLOR[c.pattern]}`}
									>
										{PATTERN_LABEL[c.pattern]} · score {c.behaviorScore}
									</span>
								))}
								{expanded.has(p.userId) ? (
									<ChevronUp size={16} />
								) : (
									<ChevronDown size={16} />
								)}
							</div>
						</button>

						{expanded.has(p.userId) && (
							<div className="border-t border-border divide-y divide-border">
								{p.chains.map((chain) => (
									<div key={chain.problemId} className="px-5 py-4 space-y-3">
										<div className="flex items-center justify-between">
											<h4 className="text-sm font-semibold">
												{chain.problemTitle}
											</h4>
											<span
												className={`text-xs px-2 py-1 rounded-full font-mono ${PATTERN_COLOR[chain.pattern]}`}
											>
												{PATTERN_LABEL[chain.pattern]}
											</span>
										</div>
										<table className="w-full data-table text-xs">
											<thead>
												<tr>
													<th className="text-left">Stage</th>
													<th className="text-center">Solved</th>
													<th className="text-center">Attempts</th>
													<th className="text-center">Runs</th>
													<th className="text-center">Errors resolved</th>
													<th className="text-center">Time to solve</th>
													<th className="text-center">Code churn</th>
													<th className="text-center">Complexity (target)</th>
												</tr>
											</thead>
											<tbody>
												{chain.stages.map((s) => (
													<tr key={s.stageId}>
														<td>Stage {s.stageOrder}</td>
														<td className="text-center">
															{s.solved ? "✓" : "—"}
														</td>
														<td className="text-center font-mono">
															{s.attempts}
														</td>
														<td className="text-center font-mono">{s.runs}</td>
														<td className="text-center font-mono">
															{s.errorsResolved}/{s.errorsSeen.length}
														</td>
														<td className="text-center font-mono">
															{s.timeToSolveSeconds != null
																? `${Math.round(s.timeToSolveSeconds)}s`
																: "—"}
														</td>
														<td className="text-center font-mono">
															{Math.round(s.codeChurn * 100)}%
														</td>
														<td className="text-center font-mono">
															{s.complexity?.label ?? "—"} (
															{s.expectedComplexity ?? "?"})
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</AdminLayout>
	);
}
