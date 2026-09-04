import type { Verdict } from '../types';

const config: Record<Verdict, { label: string; className: string }> = {
  ACCEPTED: { label: 'Accepted', className: 'verdict-accepted' },
  WRONG_ANSWER: { label: 'Wrong Answer', className: 'verdict-wrong' },
  PARTIAL: { label: 'Partial', className: 'verdict-partial' },
  COMPILATION_ERROR: { label: 'Compilation Error', className: 'verdict-error' },
  RUNTIME_ERROR: { label: 'Runtime Error', className: 'verdict-wrong' },
  TIME_LIMIT_EXCEEDED: {
    label: 'Time Limit Exceeded',
    className: 'verdict-error',
  },
  MEMORY_LIMIT_EXCEEDED: {
    label: 'Memory Limit Exceeded',
    className: 'verdict-error',
  },
  INTERNAL_ERROR: { label: 'Internal Error', className: 'verdict-wrong' },
  QUEUED: { label: 'Queued', className: 'verdict-running' },
  RUNNING: { label: 'Running…', className: 'verdict-running' },
};

export default function VerdictBadge({ status }: { status: Verdict }) {
  const { label, className } = config[status] ?? config.INTERNAL_ERROR;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono ${className}`}
    >
      {label}
    </span>
  );
}
