import type { RecursionApproachRunner, RecursionStep, TreeNode } from "./RecursionVisualizer";
import { ROW_HEIGHT, VIEW_WIDTH } from "./RecursionVisualizer";

/** clamp helper to keep recursive-call simulations bounded (avoid runaway step counts) */
function clamp(n: number, max: number): number {
  return Math.max(0, Math.min(n, max));
}

/**
 * Tracks the call-tree nodes as a flat cumulative list, mutated step by step.
 * Each node gets a fixed (x, y) position the moment it's created, using a
 * shrinking "slot" passed down from its parent — so binary calls spread left/right,
 * single-child calls stay in a straight line, and n-ary calls fan out evenly.
 */
class TreeTracer {
  nodes: TreeNode[] = [];
  steps: RecursionStep[] = [];
  private idCounter = 0;

  /** root slot: full width, starting near the top */
  rootSlot() {
    return { x: VIEW_WIDTH / 2, y: 40, width: VIEW_WIDTH - 80 };
  }

  /** compute the i-th child's slot out of `count` total children */
  childSlot(parent: { x: number; y: number; width: number }, index: number, count: number) {
    const childWidth = parent.width / count;
    const x = parent.x - parent.width / 2 + childWidth * (index + 0.5);
    const y = parent.y + ROW_HEIGHT;
    return { x, y, width: childWidth };
  }

  addCall(label: string, parentId: string | null, slot: { x: number; y: number }): string {
    const id = `n${this.idCounter++}`;
    this.nodes.push({ id, parentId, x: slot.x, y: slot.y, label, status: "active" });
    return id;
  }

  resolve(id: string, value: string | number, status: "resolved" | "cached" = "resolved") {
    const node = this.nodes.find((n) => n.id === id);
    if (node) {
      node.status = status;
      node.value = value;
    }
  }

  snapshot(
    description: string,
    opts: {
      variables?: Record<string, string | number | boolean>;
      headline?: string;
      tag?: { label: string; tone: "info" | "success" | "danger" };
      codeLine?: number;
      memo?: (string | number | null)[];
      done?: boolean;
    } = {},
  ) {
    this.steps.push({
      description,
      nodes: this.nodes.map((n) => ({ ...n })),
      memo: opts.memo,
      variables: opts.variables ?? {},
      headline: opts.headline,
      tag: opts.tag,
      codeLine: opts.codeLine,
      done: opts.done,
    });
  }
}

export const factorialApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(n) \u00b7 Space: O(n) call stack \u2014 descend to the base case, then multiply back up",
    code: ["function factorial(n) {", "  if (n <= 1) return 1;", "  return n * factorial(n - 1);", "}"],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 10);
      const tracer = new TreeTracer();
      function call(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        const id = tracer.addCall(`factorial(${k})`, parentId, slot);
        tracer.snapshot(`Call factorial(${k})`, {
          variables: { k },
          headline: `factorial(${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (k <= 1) {
          tracer.resolve(id, 1);
          tracer.snapshot("factorial(1) = 1 (base case)", {
            variables: { k, result: 1 },
            headline: "factorial(1) = 1",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return 1;
        }
        const childSlot = tracer.childSlot(slot, 0, 1);
        const sub = call(k - 1, childSlot, id);
        const result = k * sub;
        tracer.resolve(id, result);
        tracer.snapshot(`factorial(${k}) = ${k} \u00d7 factorial(${k - 1}) = ${result}`, {
          variables: { k, result },
          headline: `factorial(${k}) = ${result}`,
          tag: { label: "Return", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = call(n, tracer.rootSlot(), null);
      tracer.snapshot(`factorial(${n}) = ${result}`, {
        variables: { result },
        headline: `${n}! = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Iterative)",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 no call stack, just a running product",
    code: ["let result = 1;", "for (let i = 1; i <= n; i++) result *= i;", "return result;"],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 20);
      const tracer = new TreeTracer();
      let result = 1;
      let slot = tracer.rootSlot();
      let parentId: string | null = null;
      for (let i = 1; i <= n; i++) {
        result *= i;
        const id = tracer.addCall(`i=${i}`, parentId, slot);
        tracer.resolve(id, result);
        tracer.snapshot(`result *= ${i} \u2192 ${result}`, {
          variables: { i, result },
          headline: `${i}! = ${result}`,
          tag: { label: "Iterate", tone: "info" },
          codeLine: 2,
        });
        parentId = id;
        slot = tracer.childSlot(slot, 0, 1);
      }
      tracer.snapshot(`factorial(${n}) = ${result}`, {
        variables: { result },
        headline: `${n}! = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const fibonacciApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Naive Recursion)",
    complexity: "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 recomputes the same sub-calls over and over",
    code: ["function fib(n) {", "  if (n <= 1) return n;", "  return fib(n - 1) + fib(n - 2);", "}"],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 6);
      const tracer = new TreeTracer();
      let totalCalls = 0;
      function fib(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        totalCalls++;
        const id = tracer.addCall(`fib(${k})`, parentId, slot);
        tracer.snapshot(`Call fib(${k})`, {
          variables: { k, totalCalls },
          headline: `fib(${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (k <= 1) {
          tracer.resolve(id, k);
          tracer.snapshot(`fib(${k}) = ${k} (base case)`, {
            variables: { k, result: k },
            headline: `fib(${k}) = ${k}`,
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return k;
        }
        const leftSlot = tracer.childSlot(slot, 0, 2);
        const rightSlot = tracer.childSlot(slot, 1, 2);
        const left = fib(k - 1, leftSlot, id);
        const right = fib(k - 2, rightSlot, id);
        const result = left + right;
        tracer.resolve(id, result);
        tracer.snapshot(`fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${result}`, {
          variables: { k, result },
          headline: `fib(${k}) = ${result}`,
          tag: { label: "Return", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = fib(n, tracer.rootSlot(), null);
      tracer.snapshot(`fib(${n}) = ${result} (took ${totalCalls} total calls \u2014 lots of repeated branches!)`, {
        variables: { result, totalCalls },
        headline: `fib(${n}) = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Memoized)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 cache each fib(k) the first time it's computed, reuse afterward",
    code: [
      "const memo = new Map();",
      "function fib(n) {",
      "  if (n <= 1) return n;",
      "  if (memo.has(n)) return memo.get(n);",
      "  const result = fib(n - 1) + fib(n - 2);",
      "  memo.set(n, result);",
      "  return result;",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 8);
      const tracer = new TreeTracer();
      const memo = new Map<number, number>();
      const memoSnapshot = () => Array.from({ length: n + 1 }, (_, i) => memo.get(i) ?? null);
      function fib(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        if (memo.has(k)) {
          const cached = memo.get(k) as number;
          const id = tracer.addCall(`fib(${k})`, parentId, slot);
          tracer.resolve(id, cached, "cached");
          tracer.snapshot(`fib(${k}) already cached \u2014 return ${cached} instantly`, {
            variables: { k, cached },
            headline: `fib(${k}) = ${cached}`,
            tag: { label: "Cache Hit", tone: "success" },
            codeLine: 4,
            memo: memoSnapshot(),
          });
          return cached;
        }
        const id = tracer.addCall(`fib(${k})`, parentId, slot);
        tracer.snapshot(`Call fib(${k})`, {
          variables: { k },
          headline: `fib(${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 5,
          memo: memoSnapshot(),
        });
        if (k <= 1) {
          tracer.resolve(id, k);
          tracer.snapshot(`fib(${k}) = ${k} (base case)`, {
            variables: { k, result: k },
            headline: `fib(${k}) = ${k}`,
            tag: { label: "Base Case", tone: "success" },
            codeLine: 3,
            memo: memoSnapshot(),
          });
          return k;
        }
        const leftSlot = tracer.childSlot(slot, 0, 2);
        const rightSlot = tracer.childSlot(slot, 1, 2);
        const left = fib(k - 1, leftSlot, id);
        const right = fib(k - 2, rightSlot, id);
        const result = left + right;
        memo.set(k, result);
        tracer.resolve(id, result);
        tracer.snapshot(`fib(${k}) = ${result} \u2014 cache it for next time`, {
          variables: { k, result },
          headline: `fib(${k}) = ${result}`,
          tag: { label: "Cache & Return", tone: "success" },
          codeLine: 6,
          memo: memoSnapshot(),
        });
        return result;
      }
      const result = fib(n, tracer.rootSlot(), null);
      tracer.snapshot(`fib(${n}) = ${result} (each value computed once, then reused)`, {
        variables: { result },
        headline: `fib(${n}) = ${result}`,
        tag: { label: "Done", tone: "success" },
        memo: memoSnapshot(),
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const powerApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(n) \u00b7 Space: O(n) call stack \u2014 multiply by x, n times",
    code: ["function power(x, n) {", "  if (n === 0) return 1;", "  return x * power(x, n - 1);", "}"],
    run: (input, target = 10): RecursionStep[] => {
      const x = input[0] ?? 2;
      const n = clamp(target, 10);
      const tracer = new TreeTracer();
      function call(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        const id = tracer.addCall(`power(${x},${k})`, parentId, slot);
        tracer.snapshot(`Call power(${x}, ${k})`, {
          variables: { k },
          headline: `power(${x}, ${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (k === 0) {
          tracer.resolve(id, 1);
          tracer.snapshot("power(x, 0) = 1 (base case)", {
            variables: { result: 1 },
            headline: "base case = 1",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return 1;
        }
        const childSlot = tracer.childSlot(slot, 0, 1);
        const sub = call(k - 1, childSlot, id);
        const result = x * sub;
        tracer.resolve(id, result);
        tracer.snapshot(`power(${x}, ${k}) = ${x} \u00d7 power(${x}, ${k - 1}) = ${result}`, {
          variables: { k, result },
          headline: `${x}^${k} = ${result}`,
          tag: { label: "Return", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = call(n, tracer.rootSlot(), null);
      tracer.snapshot(`${x}^${n} = ${result}`, {
        variables: { result },
        headline: `${x}^${n} = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Fast Power)",
    complexity: "Time: O(log n) \u00b7 Space: O(log n) \u2014 square the base, halve the exponent",
    code: [
      "function power(x, n) {",
      "  if (n === 0) return 1;",
      "  const half = power(x, Math.floor(n / 2));",
      "  return n % 2 === 0 ? half * half : half * half * x;",
      "}",
    ],
    run: (input, target = 10): RecursionStep[] => {
      const x = input[0] ?? 2;
      const n = clamp(target, 1_000_000);
      const tracer = new TreeTracer();
      function call(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        const id = tracer.addCall(`power(${x},${k})`, parentId, slot);
        tracer.snapshot(`Call power(${x}, ${k})`, {
          variables: { k },
          headline: `power(${x}, ${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (k === 0) {
          tracer.resolve(id, 1);
          tracer.snapshot("power(x, 0) = 1 (base case)", {
            variables: { result: 1 },
            headline: "base case = 1",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return 1;
        }
        const childSlot = tracer.childSlot(slot, 0, 1);
        const half = call(Math.floor(k / 2), childSlot, id);
        const result = k % 2 === 0 ? half * half : half * half * x;
        tracer.resolve(id, result);
        const combineText = k % 2 === 0 ? `${half}\u00b2` : `${half}\u00b2 \u00d7 ${x}`;
        tracer.snapshot(`power(${x}, ${k}) = ${combineText} = ${result}`, {
          variables: { k, half, result },
          headline: `power(${x},${k}) = ${result}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 4,
        });
        return result;
      }
      const result = call(n, tracer.rootSlot(), null);
      tracer.snapshot(`${x}^${n} = ${result}`, {
        variables: { result },
        headline: `${x}^${n} = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const sumOfDigitsApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner<string>>> = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(d) digits \u00b7 Space: O(d) call stack \u2014 peel the last digit, recurse on the rest",
    code: ["function sumDigits(s) {", "  if (s.length === 0) return 0;", "  return Number(s[s.length - 1]) + sumDigits(s.slice(0, -1));", "}"],
    run: (input): RecursionStep[] => {
      const digits = [...input].slice(0, 8);
      const tracer = new TreeTracer();
      function call(s: string, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        const id = tracer.addCall(`sum("${s}")`, parentId, slot);
        tracer.snapshot(`Call sumDigits("${s}")`, {
          variables: { s },
          headline: `sumDigits("${s}")`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (s.length === 0) {
          tracer.resolve(id, 0);
          tracer.snapshot('sumDigits("") = 0 (base case)', {
            variables: { result: 0 },
            headline: "base case = 0",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return 0;
        }
        const last = Number(s.at(-1));
        const childSlot = tracer.childSlot(slot, 0, 1);
        const sub = call(s.slice(0, -1), childSlot, id);
        const result = last + sub;
        tracer.resolve(id, result);
        tracer.snapshot(`${last} + sumDigits("${s.slice(0, -1)}") = ${result}`, {
          variables: { result },
          headline: `+ ${last} \u2192 ${result}`,
          tag: { label: "Return", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = call(digits.join(""), tracer.rootSlot(), null);
      tracer.snapshot(`Sum of digits: ${result}`, {
        variables: { result },
        headline: `sum = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Iterative)",
    complexity: "Time: O(d) \u00b7 Space: O(1) \u2014 same work, no call stack",
    code: ["let sum = 0;", "for (const ch of s) sum += Number(ch);", "return sum;"],
    run: (input): RecursionStep[] => {
      const digits = [...input];
      const tracer = new TreeTracer();
      let sum = 0;
      let slot = tracer.rootSlot();
      let parentId: string | null = null;
      for (const digit of digits) {
        sum += Number(digit);
        const id = tracer.addCall(`+'${digit}'`, parentId, slot);
        tracer.resolve(id, sum);
        tracer.snapshot(`Add digit '${digit}' \u2014 running sum = ${sum}`, {
          variables: { sum },
          headline: `+ ${digit} \u2192 ${sum}`,
          tag: { label: "Iterate", tone: "info" },
          codeLine: 2,
        });
        parentId = id;
        slot = tracer.childSlot(slot, 0, 1);
      }
      tracer.snapshot(`Sum of digits: ${sum}`, {
        variables: { result: sum },
        headline: `sum = ${sum}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const reverseStringRecursiveApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner<string>>> = {
  brute: {
    label: "Brute Force (Recursion, Extra Space)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 build a brand-new reversed string on the way back up",
    code: ["function reverse(s) {", "  if (s.length === 0) return '';", "  return reverse(s.slice(1)) + s[0];", "}"],
    run: (input): RecursionStep[] => {
      const s = input.slice(0, 8);
      const tracer = new TreeTracer();
      function call(str: string, slot: { x: number; y: number; width: number }, parentId: string | null): string {
        const id = tracer.addCall(`rev("${str}")`, parentId, slot);
        tracer.snapshot(`Call reverse("${str}")`, {
          variables: {},
          headline: `reverse("${str}")`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (str.length === 0) {
          tracer.resolve(id, '""');
          tracer.snapshot('reverse("") = "" (base case)', {
            variables: {},
            headline: "base case",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return "";
        }
        const childSlot = tracer.childSlot(slot, 0, 1);
        const sub = call(str.slice(1), childSlot, id);
        const result = sub + str[0];
        tracer.resolve(id, `"${result}"`);
        tracer.snapshot(`reverse("${str.slice(1)}") + "${str[0]}" = "${result}"`, {
          variables: { built: result },
          headline: `"${result}"`,
          tag: { label: "Build", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = call(s, tracer.rootSlot(), null);
      tracer.snapshot(`Reversed: "${result}"`, {
        variables: { result },
        headline: `"${result}"`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (In-Place Recursive Swap)",
    complexity: "Time: O(n) \u00b7 Space: O(n) call stack, O(1) extra data \u2014 swap ends, recurse inward",
    code: [
      "function reverse(s, left, right) {",
      "  if (left >= right) return;",
      "  [s[left], s[right]] = [s[right], s[left]];",
      "  reverse(s, left + 1, right - 1);",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const array = [...input];
      const tracer = new TreeTracer();
      function call(left: number, right: number, slot: { x: number; y: number; width: number }, parentId: string | null) {
        const id = tracer.addCall(`rev(${left},${right})`, parentId, slot);
        tracer.snapshot(`Call reverse(left=${left}, right=${right})`, {
          variables: { left, right },
          headline: `[${left}, ${right}]`,
          tag: { label: "Call", tone: "info" },
          codeLine: 2,
        });
        if (left >= right) {
          tracer.resolve(id, "stop");
          tracer.snapshot(`left (${left}) >= right (${right}) \u2014 base case, stop`, {
            variables: { left, right },
            headline: "Base case",
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return;
        }
        [array[left], array[right]] = [array[right], array[left]];
        tracer.resolve(id, `${left}\u2194${right}`);
        tracer.snapshot(`Swap positions ${left} and ${right} \u2014 "${array.join("")}"`, {
          variables: { left, right, current: array.join("") },
          headline: `swap ${left} \u2194 ${right}`,
          tag: { label: "Swap", tone: "success" },
          codeLine: 3,
        });
        const childSlot = tracer.childSlot(slot, 0, 1);
        call(left + 1, right - 1, childSlot, id);
      }
      call(0, array.length - 1, tracer.rootSlot(), null);
      tracer.snapshot(`Reversed: "${array.join("")}"`, {
        variables: { result: array.join("") },
        headline: `"${array.join("")}"`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const climbingStairsApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Naive Recursion)",
    complexity: "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 recomputes ways(k) many times",
    code: ["function ways(n) {", "  if (n <= 1) return 1;", "  return ways(n - 1) + ways(n - 2);", "}"],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 6);
      const tracer = new TreeTracer();
      function call(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        const id = tracer.addCall(`ways(${k})`, parentId, slot);
        tracer.snapshot(`Call ways(${k})`, {
          variables: { k },
          headline: `ways(${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 3,
        });
        if (k <= 1) {
          tracer.resolve(id, 1);
          tracer.snapshot(`ways(${k}) = 1 (base case)`, {
            variables: { k, result: 1 },
            headline: `ways(${k}) = 1`,
            tag: { label: "Base Case", tone: "success" },
            codeLine: 2,
          });
          return 1;
        }
        const leftSlot = tracer.childSlot(slot, 0, 2);
        const rightSlot = tracer.childSlot(slot, 1, 2);
        const left = call(k - 1, leftSlot, id);
        const right = call(k - 2, rightSlot, id);
        const result = left + right;
        tracer.resolve(id, result);
        tracer.snapshot(`ways(${k}) = ways(${k - 1}) + ways(${k - 2}) = ${result}`, {
          variables: { k, result },
          headline: `ways(${k}) = ${result}`,
          tag: { label: "Return", tone: "success" },
          codeLine: 3,
        });
        return result;
      }
      const result = call(n, tracer.rootSlot(), null);
      tracer.snapshot(`Ways to climb ${n} stairs: ${result}`, {
        variables: { result },
        headline: `ways(${n}) = ${result}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Memoized)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 cache each ways(k) the first time it's computed",
    code: [
      "const memo = new Map();",
      "function ways(n) {",
      "  if (n <= 1) return 1;",
      "  if (memo.has(n)) return memo.get(n);",
      "  const result = ways(n - 1) + ways(n - 2);",
      "  memo.set(n, result);",
      "  return result;",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length > 0 ? input[input.length - 1] : 5, 8);
      const tracer = new TreeTracer();
      const memo = new Map<number, number>();
      const memoSnapshot = () => Array.from({ length: n + 1 }, (_, i) => memo.get(i) ?? null);
      function call(k: number, slot: { x: number; y: number; width: number }, parentId: string | null): number {
        if (memo.has(k)) {
          const cached = memo.get(k) as number;
          const id = tracer.addCall(`ways(${k})`, parentId, slot);
          tracer.resolve(id, cached, "cached");
          tracer.snapshot(`ways(${k}) cached \u2014 return ${cached} instantly`, {
            variables: { k, cached },
            headline: `ways(${k}) = ${cached}`,
            tag: { label: "Cache Hit", tone: "success" },
            codeLine: 4,
            memo: memoSnapshot(),
          });
          return cached;
        }
        const id = tracer.addCall(`ways(${k})`, parentId, slot);
        tracer.snapshot(`Call ways(${k})`, {
          variables: { k },
          headline: `ways(${k})`,
          tag: { label: "Call", tone: "info" },
          codeLine: 5,
          memo: memoSnapshot(),
        });
        if (k <= 1) {
          tracer.resolve(id, 1);
          tracer.snapshot(`ways(${k}) = 1 (base case)`, {
            variables: { k, result: 1 },
            headline: `ways(${k}) = 1`,
            tag: { label: "Base Case", tone: "success" },
            codeLine: 3,
            memo: memoSnapshot(),
          });
          return 1;
        }
        const leftSlot = tracer.childSlot(slot, 0, 2);
        const rightSlot = tracer.childSlot(slot, 1, 2);
        const left = call(k - 1, leftSlot, id);
        const right = call(k - 2, rightSlot, id);
        const result = left + right;
        memo.set(k, result);
        tracer.resolve(id, result);
        tracer.snapshot(`ways(${k}) = ${result} \u2014 cache it for next time`, {
          variables: { k, result },
          headline: `ways(${k}) = ${result}`,
          tag: { label: "Cache & Return", tone: "success" },
          codeLine: 6,
          memo: memoSnapshot(),
        });
        return result;
      }
      const result = call(n, tracer.rootSlot(), null);
      tracer.snapshot(`Ways to climb ${n} stairs: ${result}`, {
        variables: { result },
        headline: `ways(${n}) = ${result}`,
        tag: { label: "Done", tone: "success" },
        memo: memoSnapshot(),
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const subsetsApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Recursive Include/Exclude)",
    complexity: "Time: O(n \u00b7 2^n) \u00b7 Space: O(n) call stack \u2014 branch on including or excluding each element",
    code: [
      "function subsets(nums, i, path, result) {",
      "  if (i === nums.length) { result.push([...path]); return; }",
      "  subsets(nums, i + 1, path, result);           // exclude",
      "  subsets(nums, i + 1, [...path, nums[i]], result); // include",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length, 4);
      const nums = input.slice(0, n);
      const tracer = new TreeTracer();
      const result: string[] = [];
      function go(i: number, path: number[], slot: { x: number; y: number; width: number }, parentId: string | null) {
        const id = tracer.addCall(i === nums.length ? `[${path.join(",")}]` : `i=${i}`, parentId, slot);
        if (i === nums.length) {
          result.push(`[${path.join(",")}]`);
          tracer.resolve(id, `[${path.join(",")}]`);
          tracer.snapshot(`Reached the end \u2014 record subset [${path.join(", ")}]`, {
            variables: { count: result.length },
            headline: `[${path.join(", ")}]`,
            tag: { label: "Record", tone: "success" },
            codeLine: 2,
          });
          return;
        }
        tracer.snapshot(`At index ${i}, decide: exclude or include nums[${i}] (${nums[i]})`, {
          variables: { i },
          headline: `decide nums[${i}]`,
          tag: { label: "Branch", tone: "info" },
          codeLine: 3,
        });
        const excludeSlot = tracer.childSlot(slot, 0, 2);
        const includeSlot = tracer.childSlot(slot, 1, 2);
        go(i + 1, path, excludeSlot, id);
        go(i + 1, [...path, nums[i]], includeSlot, id);
        tracer.resolve(id, "\u2713");
      }
      go(0, [], tracer.rootSlot(), null);
      tracer.snapshot(`${result.length} subsets found`, {
        variables: { result: result.length },
        headline: `${result.length} subsets`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (Iterative Bitmask)",
    complexity: "Time: O(n \u00b7 2^n) \u00b7 Space: O(1) extra per subset \u2014 no recursion, one mask per subset",
    code: [
      "const result = [];",
      "for (let mask = 0; mask < (1 << n); mask++) {",
      "  const subset = nums.filter((_, i) => mask & (1 << i));",
      "  result.push(subset);",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length, 4);
      const nums = input.slice(0, n);
      const tracer = new TreeTracer();
      const result: string[] = [];
      let slot = tracer.rootSlot();
      let parentId: string | null = null;
      for (let mask = 0; mask < 1 << n; mask++) {
        const subset: number[] = [];
        for (let i = 0; i < n; i++) {
          if (mask & (1 << i)) subset.push(nums[i]);
        }
        result.push(`[${subset.join(",")}]`);
        const id = tracer.addCall(`[${subset.join(",")}]`, parentId, slot);
        tracer.resolve(id, `[${subset.join(",")}]`);
        tracer.snapshot(`mask = ${mask.toString(2).padStart(n, "0")} \u2192 subset [${subset.join(", ")}]`, {
          variables: { mask: mask.toString(2).padStart(n, "0") },
          headline: `[${subset.join(", ")}]`,
          tag: { label: "Build", tone: "info" },
          codeLine: 3,
        });
        parentId = id;
        slot = tracer.childSlot(slot, 0, 1);
      }
      tracer.snapshot(`${result.length} subsets found`, {
        variables: { result: result.length },
        headline: `${result.length} subsets`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};

export const permutationsApproaches: Partial<Record<"brute" | "optimal", RecursionApproachRunner>> = {
  brute: {
    label: "Brute Force (Remaining List)",
    complexity: "Time: O(n \u00b7 n!) \u00b7 Space: O(n) per call \u2014 copies the remaining list at every level",
    code: [
      "function permute(remaining, path, result) {",
      "  if (remaining.length === 0) { result.push([...path]); return; }",
      "  for (let i = 0; i < remaining.length; i++) {",
      "    const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];",
      "    permute(rest, [...path, remaining[i]], result);",
      "  }",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length, 3);
      const nums = input.slice(0, n);
      const tracer = new TreeTracer();
      const result: string[] = [];
      function go(remaining: number[], path: number[], slot: { x: number; y: number; width: number }, parentId: string | null) {
        const id = tracer.addCall(remaining.length === 0 ? `[${path.join(",")}]` : `[${path.join(",")}]+`, parentId, slot);
        if (remaining.length === 0) {
          result.push(`[${path.join(",")}]`);
          tracer.resolve(id, `[${path.join(",")}]`);
          tracer.snapshot(`Complete permutation: [${path.join(", ")}]`, {
            variables: { count: result.length },
            headline: `[${path.join(", ")}]`,
            tag: { label: "Record", tone: "success" },
            codeLine: 2,
          });
          return;
        }
        for (let i = 0; i < remaining.length; i++) {
          const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
          const childSlot = tracer.childSlot(slot, i, remaining.length);
          tracer.snapshot(`Choose ${remaining[i]} next \u2014 path so far [${[...path, remaining[i]].join(", ")}]`, {
            variables: {},
            headline: `pick ${remaining[i]}`,
            tag: { label: "Choose", tone: "info" },
            codeLine: 5,
          });
          go(rest, [...path, remaining[i]], childSlot, id);
        }
        tracer.resolve(id, "\u2713");
      }
      go(nums, [], tracer.rootSlot(), null);
      tracer.snapshot(`${result.length} permutations found`, {
        variables: { result: result.length },
        headline: `${result.length} permutations`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
  optimal: {
    label: "Optimal (In-Place Swap)",
    complexity: "Time: O(n \u00b7 n!) \u00b7 Space: O(n) call stack only \u2014 swaps in place, no extra lists per call",
    code: [
      "function permute(nums, k, result) {",
      "  if (k === nums.length) { result.push([...nums]); return; }",
      "  for (let i = k; i < nums.length; i++) {",
      "    [nums[k], nums[i]] = [nums[i], nums[k]];",
      "    permute(nums, k + 1, result);",
      "    [nums[k], nums[i]] = [nums[i], nums[k]];",
      "  }",
      "}",
    ],
    run: (input): RecursionStep[] => {
      const n = clamp(input.length, 3);
      const nums = input.slice(0, n);
      const tracer = new TreeTracer();
      const result: string[] = [];
      function go(k: number, slot: { x: number; y: number; width: number }, parentId: string | null) {
        const id = tracer.addCall(k === nums.length ? `[${nums.join(",")}]` : `k=${k}`, parentId, slot);
        if (k === nums.length) {
          result.push(`[${nums.join(",")}]`);
          tracer.resolve(id, `[${nums.join(",")}]`);
          tracer.snapshot(`Complete permutation: [${nums.join(", ")}]`, {
            variables: { count: result.length },
            headline: `[${nums.join(", ")}]`,
            tag: { label: "Record", tone: "success" },
            codeLine: 2,
          });
          return;
        }
        const childCount = nums.length - k;
        for (let i = k; i < nums.length; i++) {
          [nums[k], nums[i]] = [nums[i], nums[k]];
          const childSlot = tracer.childSlot(slot, i - k, childCount);
          tracer.snapshot(`Swap positions ${k} and ${i} \u2014 fix ${nums[k]} at position ${k}`, {
            variables: { k, i },
            headline: `swap ${k} \u2194 ${i}`,
            tag: { label: "Swap", tone: "info" },
            codeLine: 4,
          });
          go(k + 1, childSlot, id);
          [nums[k], nums[i]] = [nums[i], nums[k]];
        }
        tracer.resolve(id, "\u2713");
      }
      go(0, tracer.rootSlot(), null);
      tracer.snapshot(`${result.length} permutations found`, {
        variables: { result: result.length },
        headline: `${result.length} permutations`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return tracer.steps;
    },
  },
};
