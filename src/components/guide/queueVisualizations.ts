import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

type NumApproaches = Partial<Record<"brute" | "optimal", ApproachRunner>>;
type StrApproaches = Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
>;

export const queueUsingStacksApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) per dequeue \u00b7 Space: O(n) \u2014 reverse the whole stack through a helper every time something is dequeued",
    code: [
      "push(x): inStack.push(x);",
      "dequeue(): ",
      "  const tmp = [];",
      "  while (inStack.length > 1) tmp.push(inStack.pop());",
      "  const front = inStack.pop();",
      "  while (tmp.length) inStack.push(tmp.pop());",
      "  return front;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const inStack: number[] = [];
      for (const v of input) {
        inStack.push(v);
        steps.push({
          description: `Enqueue ${v} \u2014 just push onto the single stack`,
          array: input,
          highlights: [],
          structure: { label: "stack", entries: [...inStack] },
          variables: {},
          headline: `push(${v})`,
          tag: { label: "Enqueue", tone: "info" },
          codeLine: 1,
        });
      }
      while (inStack.length) {
        const tmp: number[] = [];
        while (inStack.length > 1) tmp.push(inStack.pop() as number);
        const front = inStack.pop() as number;
        steps.push({
          description: `Dequeue: pop everything above the bottom element (${front}) into a helper stack, then pop it`,
          array: input,
          highlights: [],
          structure: {
            label: "stack",
            entries: [...inStack, ...tmp].reverse(),
          },
          variables: { dequeued: front },
          headline: `dequeue() = ${front}`,
          tag: { label: "O(n) Dequeue", tone: "danger" },
          codeLine: 4,
        });
        while (tmp.length) inStack.push(tmp.pop() as number);
      }
      steps.push({
        description:
          "Every dequeue costs O(n) because the whole stack must be reversed through the helper and back",
        array: input,
        highlights: [],
        structure: { label: "stack", entries: [] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Two Stacks, Amortized O(1))",
    complexity:
      "Time: O(1) amortized per operation \u00b7 Space: O(n) \u2014 an in-stack for pushes, an out-stack for pops, refilled only when empty",
    code: [
      "push(x): inStack.push(x);",
      "dequeue():",
      "  if (outStack.empty())",
      "    while (inStack.length) outStack.push(inStack.pop());",
      "  return outStack.pop();",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const inStack: number[] = [];
      const outStack: number[] = [];
      for (const v of input) {
        inStack.push(v);
        steps.push({
          description: `Enqueue ${v} \u2014 push onto in-stack only`,
          array: input,
          highlights: [],
          structure: { label: "in-stack", entries: [...inStack] },
          variables: {},
          headline: `push(${v})`,
          tag: { label: "Enqueue", tone: "info" },
          codeLine: 1,
        });
      }
      while (inStack.length || outStack.length) {
        if (outStack.length === 0) {
          steps.push({
            description:
              "out-stack is empty \u2014 flip the entire in-stack into it once (this is the only expensive step, and it happens rarely)",
            array: input,
            highlights: [],
            structure: { label: "in-stack", entries: [...inStack] },
            variables: {},
            headline: "Refill out-stack",
            tag: { label: "Amortized", tone: "info" },
            codeLine: 4,
          });
          while (inStack.length) outStack.push(inStack.pop() as number);
        }
        const front = outStack.pop() as number;
        steps.push({
          description: `Dequeue ${front} \u2014 just pop the out-stack, O(1)`,
          array: input,
          highlights: [],
          structure: { label: "out-stack", entries: [...outStack] },
          variables: { dequeued: front },
          headline: `dequeue() = ${front}`,
          tag: { label: "O(1)", tone: "success" },
          codeLine: 5,
        });
      }
      steps.push({
        description:
          "Each element moves between the two stacks at most once \u2014 amortized O(1) per operation",
        array: input,
        highlights: [],
        structure: { label: "out-stack", entries: [] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const movingAverageApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(k) per reading \u00b7 Space: O(n) \u2014 re-sum the last k values from scratch every time",
    code: [
      "readings.push(x);",
      "const windowVals = readings.slice(-k);",
      "const avg = sum(windowVals) / windowVals.length;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 3;
      const readings: number[] = [];
      for (let i = 0; i < input.length; i++) {
        readings.push(input[i]);
        const windowVals = readings.slice(-k);
        const sum = windowVals.reduce((a, b) => a + b, 0);
        const avg = (sum / windowVals.length).toFixed(2);
        steps.push({
          description: `Reading ${input[i]} arrives. Re-sum the last ${windowVals.length} value(s) from scratch: [${windowVals.join(", ")}] \u2192 avg = ${avg}`,
          array: input,
          highlights: Array.from({ length: windowVals.length }, (_, idx) => ({
            index: i - windowVals.length + 1 + idx,
            role: "current" as const,
          })),
          structure: { label: "last k readings (k=3)", entries: windowVals },
          variables: { i, avg },
          headline: `avg = ${avg}`,
          tag: { label: "Resum", tone: "danger" },
          codeLine: 2,
        });
      }
      steps.push({
        description:
          "Every call rescans up to k readings \u2014 wasteful when k is large or calls are frequent",
        array: input,
        highlights: [],
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Queue + Running Sum)",
    complexity:
      "Time: O(1) per reading \u00b7 Space: O(k) \u2014 a queue holds exactly the window, a running sum is updated incrementally",
    code: [
      "queue.push(x); sum += x;",
      "if (queue.length > k) sum -= queue.shift();",
      "const avg = sum / queue.length;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 3;
      const queue: number[] = [];
      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        queue.push(input[i]);
        sum += input[i];
        steps.push({
          description: `Enqueue ${input[i]}, running sum += ${input[i]} \u2192 sum = ${sum}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "queue (window, k=3)", entries: [...queue] },
          variables: { sum },
          headline: `sum = ${sum}`,
          tag: { label: "Add", tone: "info" },
          codeLine: 1,
        });
        if (queue.length > k) {
          const removed = queue.shift() as number;
          sum -= removed;
          steps.push({
            description: `Window exceeds size ${k} \u2014 dequeue ${removed} from the front, sum -= ${removed} \u2192 sum = ${sum}`,
            array: input,
            highlights: [],
            structure: { label: "queue (window, k=3)", entries: [...queue] },
            variables: { sum },
            headline: `sum = ${sum}`,
            tag: { label: "Evict", tone: "info" },
            codeLine: 2,
          });
        }
        const avg = (sum / queue.length).toFixed(2);
        steps.push({
          description: `Moving average = ${sum} / ${queue.length} = ${avg}`,
          array: input,
          highlights: [],
          structure: { label: "queue (window, k=3)", entries: [...queue] },
          variables: { avg },
          headline: `avg = ${avg}`,
          tag: { label: "O(1)", tone: "success" },
          codeLine: 3,
        });
      }
      steps.push({
        description:
          "Each reading enters and leaves the queue exactly once \u2014 O(1) amortized per call",
        array: input,
        highlights: [],
        structure: { label: "queue", entries: [...queue] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const firstUniqueCharStreamApproaches: StrApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) per query \u00b7 Space: O(n) \u2014 rescan everything seen so far on every new character",
    code: [
      "stream += c;",
      "for (let i = 0; i < stream.length; i++) {",
      "  if (count(stream, stream[i]) === 1) return stream[i];",
      "}",
      "return null;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const chars = input.split("");
      let stream = "";
      for (let i = 0; i < chars.length; i++) {
        stream += chars[i];
        let answer: string | null = null;
        for (let j = 0; j < stream.length; j++) {
          const occurrences = stream
            .split("")
            .filter((c) => c === stream[j]).length;
          if (occurrences === 1) {
            answer = stream[j];
            break;
          }
        }
        steps.push({
          description: `Stream = "${stream}". Rescan from the start: first unique character is ${answer ? `'${answer}'` : "none"}`,
          array: chars,
          highlights: [{ index: i, role: "current" }],
          variables: { stream, firstUnique: answer ?? "none" },
          headline: answer ? `'${answer}'` : "none",
          tag: { label: "Rescan", tone: "danger" },
          codeLine: 2,
        });
      }
      steps.push({
        description:
          "Every new character triggers a full O(n) rescan of everything seen so far",
        array: chars,
        highlights: [],
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Queue + Frequency Map)",
    complexity:
      "Time: O(1) amortized per character \u00b7 Space: O(n) \u2014 a queue of candidates, stale duplicates dropped from the front",
    code: [
      "count[c]++; queue.push(c);",
      "while (queue.length && count[queue.front()] > 1) queue.shift();",
      "return queue.length ? queue.front() : null;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const chars = input.split("");
      const count = new Map<string, number>();
      const queue: string[] = [];
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        const newCount = (count.get(c) ?? 0) + 1;
        count.set(c, newCount);
        queue.push(c);
        steps.push({
          description: `'${c}' arrives \u2014 count['${c}'] = ${newCount}, push to the candidate queue`,
          array: chars,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "candidate queue", entries: [...queue] },
          variables: { count: newCount },
          headline: `push('${c}')`,
          tag: { label: "Add", tone: "info" },
          codeLine: 1,
        });
        while (queue.length && (count.get(queue[0]) ?? 0) > 1) {
          const dropped = queue.shift();
          steps.push({
            description: `Front of queue '${dropped}' now has count ${count.get(dropped as string)} \u2014 no longer unique, drop it`,
            array: chars,
            highlights: [],
            structure: { label: "candidate queue", entries: [...queue] },
            variables: {},
            headline: `drop('${dropped}')`,
            tag: { label: "Evict", tone: "info" },
            codeLine: 2,
          });
        }
        steps.push({
          description: `First unique character right now: ${queue.length ? `'${queue[0]}'` : "none"}`,
          array: chars,
          highlights: [],
          structure: { label: "candidate queue", entries: [...queue] },
          variables: { firstUnique: queue.length ? queue[0] : "none" },
          headline: queue.length ? `'${queue[0]}'` : "none",
          tag: { label: "O(1) amortized", tone: "success" },
          codeLine: 3,
        });
      }
      steps.push({
        description:
          "Each character enters and leaves the queue at most once \u2014 amortized O(1) per character",
        array: chars,
        highlights: [],
        structure: { label: "candidate queue", entries: [...queue] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const slidingWindowMaximumApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b7k) \u00b7 Space: O(1) extra \u2014 scan every window from scratch",
    code: [
      "for (let i = 0; i + k <= n; i++) {",
      "  let m = -Infinity;",
      "  for (let j = i; j < i + k; j++) m = Math.max(m, nums[j]);",
      "  res.push(m);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 3;
      const res: number[] = [];
      for (let i = 0; i + k <= input.length; i++) {
        let max = -Infinity;
        for (let j = i; j < i + k; j++) {
          max = Math.max(max, input[j]);
          steps.push({
            description: `Window [${i}..${i + k - 1}]: compare nums[${j}] (${input[j]}) \u2014 running max = ${max}`,
            array: input,
            highlights: Array.from({ length: k }, (_, idx) => ({
              index: i + idx,
              role: idx + i === j ? ("current" as const) : ("i" as const),
            })),
            structure: { label: "results so far", entries: res },
            variables: { i, j, max },
            headline: `max = ${max}`,
            tag: { label: "Scan", tone: "info" },
            codeLine: 3,
          });
        }
        res.push(max);
        steps.push({
          description: `Window [${i}..${i + k - 1}] maximum is ${max}`,
          array: input,
          highlights: Array.from({ length: k }, (_, idx) => ({
            index: i + idx,
            role: "match" as const,
          })),
          structure: { label: "results", entries: [...res] },
          variables: { i, max },
          headline: `res[${i}] = ${max}`,
          tag: { label: "Record", tone: "success" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "results", entries: res },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Monotonic Deque)",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 a deque of indices stays decreasing in value; the front is always the window max",
    code: [
      "const deque = []; // indices, decreasing nums[.] values",
      "for (let i = 0; i < n; i++) {",
      "  while (deque.length && nums[deque.back()] <= nums[i]) deque.pop();",
      "  deque.push(i);",
      "  if (deque.front() <= i - k) deque.shift();",
      "  if (i >= k - 1) res.push(nums[deque.front()]);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const k = 3;
      const deque: number[] = [];
      const res: number[] = [];
      for (let i = 0; i < input.length; i++) {
        while (deque.length && input[deque[deque.length - 1]] <= input[i]) {
          const popped = deque.pop();
          steps.push({
            description: `nums[${popped}] (${input[popped as number]}) \u2264 nums[${i}] (${input[i]}) \u2014 it can never be a window max again, remove from the back`,
            array: input,
            highlights: [{ index: i, role: "current" }],
            structure: { label: "deque (indices)", entries: [...deque] },
            variables: { i },
            headline: `pop back (${popped})`,
            tag: { label: "Shrink", tone: "info" },
            codeLine: 3,
          });
        }
        deque.push(i);
        steps.push({
          description: `Push index ${i} to the back of the deque`,
          array: input,
          highlights: [{ index: i, role: "i" }],
          structure: { label: "deque (indices)", entries: [...deque] },
          variables: { i },
          headline: `push(${i})`,
          tag: { label: "Push", tone: "info" },
          codeLine: 4,
        });
        if (deque[0] <= i - k) {
          const dropped = deque.shift();
          steps.push({
            description: `Front index ${dropped} fell out of the window \u2014 remove it`,
            array: input,
            highlights: [],
            structure: { label: "deque (indices)", entries: [...deque] },
            variables: {},
            headline: `drop(${dropped})`,
            tag: { label: "Evict", tone: "info" },
            codeLine: 5,
          });
        }
        if (i >= k - 1) {
          const max = input[deque[0]];
          res.push(max);
          steps.push({
            description: `Window [${i - k + 1}..${i}] maximum is nums[${deque[0]}] = ${max} \u2014 the deque front, no rescanning needed`,
            array: input,
            highlights: Array.from({ length: k }, (_, idx) => ({
              index: i - k + 1 + idx,
              role: "match" as const,
            })),
            structure: { label: "results", entries: [...res] },
            variables: { max },
            headline: `res = ${max}`,
            tag: { label: "O(1) Read", tone: "success" },
            codeLine: 6,
          });
        }
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "results", entries: [...res] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const circularQueueApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) per dequeue \u00b7 Space: O(n) \u2014 a plain array; dequeuing shifts every remaining element left",
    code: [
      "enqueue(x): if (arr.length < capacity) arr.push(x);",
      "dequeue(): arr.shift(); // shifts every remaining element",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const capacity = 4;
      const arr: number[] = [];
      for (let i = 0; i < input.length; i++) {
        if (arr.length < capacity) {
          arr.push(input[i]);
          steps.push({
            description: `Enqueue ${input[i]} \u2014 append to the array (${arr.length}/${capacity} full)`,
            array: input,
            highlights: [{ index: i, role: "current" }],
            structure: {
              label: `queue array (cap ${capacity})`,
              entries: [...arr],
            },
            variables: {},
            headline: `push(${input[i]})`,
            tag: { label: "Enqueue", tone: "info" },
            codeLine: 1,
          });
        } else {
          const removed = arr.shift() as number;
          steps.push({
            description: `Queue full \u2014 dequeue ${removed} first, shifting all ${arr.length} remaining elements left (O(n))`,
            array: input,
            highlights: [],
            structure: {
              label: `queue array (cap ${capacity})`,
              entries: [...arr],
            },
            variables: {},
            headline: `shift() removes ${removed}`,
            tag: { label: "O(n) Shift", tone: "danger" },
            codeLine: 2,
          });
          arr.push(input[i]);
          steps.push({
            description: `Now enqueue ${input[i]}`,
            array: input,
            highlights: [{ index: i, role: "current" }],
            structure: {
              label: `queue array (cap ${capacity})`,
              entries: [...arr],
            },
            variables: {},
            headline: `push(${input[i]})`,
            tag: { label: "Enqueue", tone: "info" },
            codeLine: 1,
          });
        }
      }
      steps.push({
        description:
          "Every dequeue costs O(n) because the remaining elements must shift to fill the gap",
        array: input,
        highlights: [],
        structure: { label: "queue array", entries: [...arr] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Circular Buffer)",
    complexity:
      "Time: O(1) per operation \u00b7 Space: O(capacity) \u2014 a fixed array with head/tail indices that wrap with modulo",
    code: [
      "enqueue(x): buf[tail] = x; tail = (tail + 1) % capacity; size++;",
      "dequeue(): head = (head + 1) % capacity; size--;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const capacity = 4;
      const buf: (number | string)[] = new Array(capacity).fill("\u00b7");
      let head = 0;
      let tail = 0;
      let size = 0;
      for (let i = 0; i < input.length; i++) {
        if (size === capacity) {
          const removed = buf[head];
          buf[head] = "\u00b7";
          head = (head + 1) % capacity;
          size--;
          steps.push({
            description: `Buffer full \u2014 dequeue ${removed} by simply moving head to ${head} (O(1), no shifting)`,
            array: input,
            highlights: [],
            structure: {
              label: `circular buffer (head=${head})`,
              entries: [...buf],
            },
            variables: { head, tail, size },
            headline: `head \u2192 ${head}`,
            tag: { label: "O(1)", tone: "success" },
            codeLine: 2,
          });
        }
        buf[tail] = input[i];
        steps.push({
          description: `Enqueue ${input[i]} at slot ${tail}, advance tail to ${(tail + 1) % capacity} (mod ${capacity})`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: {
            label: `circular buffer (tail=${tail})`,
            entries: [...buf],
          },
          variables: { head, tail, size: size + 1 },
          headline: `buf[${tail}] = ${input[i]}`,
          tag: { label: "O(1)", tone: "success" },
          codeLine: 1,
        });
        tail = (tail + 1) % capacity;
        size++;
      }
      steps.push({
        description:
          "Head and tail wrap around with modulo arithmetic \u2014 every operation stays O(1)",
        array: input,
        highlights: [],
        structure: { label: "circular buffer", entries: [...buf] },
        variables: { head, tail, size },
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
