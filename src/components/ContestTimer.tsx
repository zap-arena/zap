import { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface ContestTimerProps {
	expiresAt: string;
	onExpire?: () => void;
}

export default function ContestTimer({
	expiresAt,
	onExpire,
}: ContestTimerProps) {
	const getRemaining = useCallback(() => {
		return Math.max(
			0,
			Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
		);
	}, [expiresAt]);

	const [remaining, setRemaining] = useState(getRemaining());

	useEffect(() => {
		const iv = setInterval(() => {
			const r = getRemaining();
			setRemaining(r);
			if (r === 0) {
				clearInterval(iv);
				onExpire?.();
			}
		}, 1000);
		return () => clearInterval(iv);
	}, [getRemaining, onExpire]);

	const h = Math.floor(remaining / 3600);
	const m = Math.floor((remaining % 3600) / 60);
	const s = remaining % 60;
	const fmt = (n: number) => String(n).padStart(2, '0');
	const isUrgent = remaining < 300 && remaining > 0;

	return (
		<div
			className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1.5 rounded-lg border ${
				isUrgent
					? 'text-destructive border-destructive/30 bg-destructive/10 animate-timer-pulse'
					: 'text-foreground border-border bg-muted'
			}`}
		>
			<Clock size={14} />
			<span>
				{fmt(h)}:{fmt(m)}:{fmt(s)}
			</span>
		</div>
	);
}
