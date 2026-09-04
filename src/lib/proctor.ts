import { api } from './api';

export type ProctorEventType =
  | 'ESCAPE_PRESSED'
  | 'FULLSCREEN_EXITED'
  | 'FULLSCREEN_ENTERED'
  | 'TAB_HIDDEN'
  | 'TAB_VISIBLE'
  | 'WINDOW_BLUR'
  | 'WINDOW_FOCUS'
  | 'COPY_BLOCKED'
  | 'PASTE_BLOCKED'
  | 'CUT_BLOCKED'
  | 'CONTEXT_MENU_BLOCKED'
  | 'DEVTOOLS_ATTEMPT';

interface QueuedEvent {
  clientEventId: string;
  type: ProctorEventType;
  occurredAt: string;
  problemId?: string;
  metadata: Record<string, unknown>;
}

const BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 20_000;
/** Identical event types fired within this window collapse into one. */
const DEDUPE_WINDOW_MS = 800;

function newId(): string {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Collects proctoring events and posts them in batches of BATCH_SIZE.
 * Events carry a client-generated id so a retried batch is stored at most once.
 */
export class ProctorTracker {
  private queue: QueuedEvent[] = [];
  private inFlight: QueuedEvent[] = [];
  private lastSeen = new Map<ProctorEventType, number>();
  private timer: number | undefined;
  private stopped = false;
  private contestId: string;
  private getProblemId: () => string | undefined;

  constructor(contestId: string, getProblemId: () => string | undefined) {
    this.contestId = contestId;
    this.getProblemId = getProblemId;
    this.timer = window.setInterval(() => void this.flush(), FLUSH_INTERVAL_MS);
  }

  track(type: ProctorEventType, metadata: Record<string, unknown> = {}): void {
    if (this.stopped) return;

    const now = Date.now();
    const previous = this.lastSeen.get(type);
    if (previous !== undefined && now - previous < DEDUPE_WINDOW_MS) return;
    this.lastSeen.set(type, now);

    this.queue.push({
      clientEventId: newId(),
      type,
      occurredAt: new Date(now).toISOString(),
      problemId: this.getProblemId(),
      metadata,
    });

    if (this.queue.length >= BATCH_SIZE) void this.flush();
  }

  async flush(): Promise<void> {
    if (this.inFlight.length > 0 || this.queue.length === 0) return;

    this.inFlight = this.queue.splice(0, BATCH_SIZE);
    try {
      await api.post(`/contests/${this.contestId}/activity`, { events: this.inFlight });
      this.inFlight = [];
    } catch {
      // Put them back so the next flush retries; ids keep the retry idempotent.
      this.queue = [...this.inFlight, ...this.queue];
      this.inFlight = [];
    }
  }

  dispose(): void {
    this.stopped = true;
    clearInterval(this.timer);
    void this.flush();
  }
}
