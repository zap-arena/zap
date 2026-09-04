import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Calendar, CheckCircle, Clock } from 'lucide-react';
import { api } from '../lib/api';
import Navbar from '../components/Navbar';
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../components/ui/table';

interface Contest {
	id: string;
	name: string;
	slug: string;
	description: string;
	status: 'active' | 'scheduled' | 'completed';
	duration: number;
	startTime: string;
}

export default function ContestsPage() {
	const navigate = useNavigate();

	const { data: contests, isLoading } = useQuery({
		queryKey: ['contests'],
		queryFn: () => api.get<Contest[]>('/contests'),
	});

	const live = contests?.filter((c) => c.status === 'active') || [];
	const upcoming = contests?.filter((c) => c.status === 'scheduled') || [];
	const past = contests?.filter((c) => c.status === 'completed') || [];

	const renderTable = (
		list: Contest[],
		emptyIcon: any,
		emptyTitle: string,
		emptyDesc: string,
	) => {
		if (list.length === 0) {
			const Icon = emptyIcon;
			return (
				<div className="text-center py-24 bg-muted/20 rounded-xl border border-border border-dashed">
					<div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
						<Icon size={28} className="text-muted-foreground" />
					</div>
					<h3 className="text-lg font-medium text-foreground mb-1">
						{emptyTitle}
					</h3>
					<p className="text-sm text-muted-foreground">{emptyDesc}</p>
				</div>
			);
		}

		return (
			<div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead className="w-[400px]">Contest Name</TableHead>
							<TableHead>Start Time</TableHead>
							<TableHead>End Time</TableHead>
							<TableHead>Duration</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{list.map((c) => {
							const endTime = c.startTime
								? new Date(new Date(c.startTime).getTime() + c.duration * 60000)
								: null;
							return (
								<TableRow
									key={c.id}
									className="group cursor-pointer hover:bg-muted/30 transition-colors"
									onClick={() => navigate(`/contest/${c.slug}`)}
								>
									<TableCell className="py-4">
										<div className="flex items-center gap-3">
											<div
												className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
													c.status === 'active'
														? 'bg-success/15 border border-success/30'
														: c.status === 'scheduled'
															? 'bg-info/15 border border-info/30'
															: 'bg-muted border border-border'
												}`}
											>
												{c.status === 'active' ? (
													<span className="w-2 h-2 rounded-full bg-success animate-pulse" />
												) : c.status === 'scheduled' ? (
													<Calendar size={14} className="text-info" />
												) : (
													<CheckCircle
														size={14}
														className="text-muted-foreground"
													/>
												)}
											</div>
											<div>
												<div className="font-semibold text-sm group-hover:text-primary transition-colors">
													{c.name}
												</div>
												<div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[300px]">
													{c.description}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell className="text-xs text-muted-foreground font-medium">
										{c.startTime
											? new Date(c.startTime).toLocaleString(undefined, {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													hour12: true,
												})
											: 'TBA'}
									</TableCell>
									<TableCell className="text-xs text-muted-foreground font-medium">
										{endTime
											? endTime.toLocaleString(undefined, {
													month: 'short',
													day: 'numeric',
													hour: '2-digit',
													minute: '2-digit',
													hour12: true,
												})
											: 'TBA'}
									</TableCell>
									<TableCell className="text-xs text-muted-foreground font-medium">
										<div className="flex items-center gap-1.5">
											<Clock size={13} /> {c.duration}m
										</div>
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant={c.status === 'active' ? 'default' : 'secondary'}
											size="sm"
											className="h-8 font-semibold"
										>
											{c.status === 'active'
												? 'Enter'
												: c.status === 'completed'
													? 'Practice'
													: 'Details'}
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main className="max-w-5xl mx-auto px-6 py-12">
				<div className="mb-10 animate-fade-in">
					<h1 className="text-3xl font-bold tracking-tight mb-2">Contests</h1>
					<p className="text-muted-foreground">
						Join live algorithmic programming contests, practice on past
						challenges, and compete with the community.
					</p>
				</div>

				<Tabs
					defaultValue="live"
					className="w-full animate-fade-in"
					style={{ animationDelay: '100ms' }}
				>
					<TabsList className="mb-8 h-10 border border-border bg-muted/50 p-1">
						<TabsTrigger
							value="live"
							className="gap-2 text-sm px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
						>
							<span className="w-2 h-2 rounded-full bg-success animate-pulse" />
							Live ({live.length})
						</TabsTrigger>
						<TabsTrigger
							value="upcoming"
							className="gap-2 text-sm px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
						>
							<Calendar size={14} />
							Upcoming ({upcoming.length})
						</TabsTrigger>
						<TabsTrigger
							value="past"
							className="gap-2 text-sm px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
						>
							<CheckCircle size={14} />
							Past ({past.length})
						</TabsTrigger>
					</TabsList>

					{isLoading ? (
						<div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
							<Table>
								<TableHeader className="bg-muted/50">
									<TableRow>
										<TableHead className="w-[400px]">Contest Name</TableHead>
										<TableHead>Start Time</TableHead>
										<TableHead>End Time</TableHead>
										<TableHead>Duration</TableHead>
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[1, 2, 3].map((i) => (
										<TableRow key={i}>
											<TableCell className="py-4">
												<div className="flex items-center gap-3">
													<Skeleton className="w-8 h-8 rounded-md shrink-0" />
													<div className="space-y-1.5">
														<Skeleton className="h-4 w-48" />
														<Skeleton className="h-3 w-32" />
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-24" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-24" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-16" />
											</TableCell>
											<TableCell className="text-right flex justify-end">
												<Skeleton className="h-8 w-20" />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<>
							<TabsContent value="live" className="mt-0 outline-none">
								{renderTable(
									live,
									Trophy,
									'No live contests',
									'Check the Upcoming tab for scheduled contests.',
								)}
							</TabsContent>

							<TabsContent value="upcoming" className="mt-0 outline-none">
								{renderTable(
									upcoming,
									Calendar,
									'No upcoming contests',
									'We are preparing new challenges. Stay tuned!',
								)}
							</TabsContent>

							<TabsContent value="past" className="mt-0 outline-none">
								{renderTable(
									past,
									CheckCircle,
									'No past contests',
									'Past contests will appear here for practice.',
								)}
							</TabsContent>
						</>
					)}
				</Tabs>
			</main>
		</div>
	);
}
