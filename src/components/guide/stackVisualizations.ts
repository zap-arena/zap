import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

type NumApproaches = Partial<Record<"brute" | "optimal", ApproachRunner>>;
type StrApproaches = Partial<Record<"brute" | "optimal", ApproachRunner<string>>>;

const isOpen = (c: string) => c === "(" || c === "[" || c === "{";
const matchPair = (open: string, close: string) =>
  (open === "(" && close === ")") ||
  (open === "[" && close === "]") ||
  (open === "{" && close === "}");

export const validParenthesesApproaches: StrApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 repeatedly delete adjacent matching pairs until none remain",
    code: [
      "let changed = true;",
      "while (changed) {",
      "  changed = false;",
      "  for (let i = 0; i < s.length - 1; i++) {",
      "    if (isPair(s[i], s[i + 1])) {",
      "      s.splice(i, 2);",
      "      changed = true;",
      "      break;",
      "    }",
      "  }",
      "}",
      "return s.length === 0;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const chars = input.split("");
      let changed = true;
      let guard = 0;
      while (changed && guard < 200) {
        guard++;
        changed = false;
        let found = false;
        for (let i = 0; i < chars.length - 1; i++) {
          if (matchPair(chars[i], chars[i + 1])) {
            steps.push({
              description: `"${chars[i]}${chars[i + 1]}" at [${i}, ${i + 1}] is a matching pair \u2014 delete it`,
              array: [...chars],
              highlights: [
                { index: i, role: "match" },
                { index: i + 1, role: "match" },
              ],
              variables: { i },
              headline: `Remove "${chars[i]}${chars[i + 1]}"`,
              tag: { label: "Delete Pair", tone: "success" },
              codeLine: 5,
            });
            chars.splice(i, 2);
            changed = true;
            found = true;
            break;
          }
        }
        if (found) {
          steps.push({
            description: `String after deletion: "${chars.join("") || "(empty)"}"`,
            array: [...chars],
            highlights: [],
            variables: {},
            headline: chars.length ? chars.join("") : "(empty)",
            tag: { label: "Rescan", tone: "info" },
            codeLine: 6,
          });
        }
      }
      const valid = chars.length === 0;
      steps.push({
        description: valid
          ? "Every pair was deleted \u2014 the string is valid"
          : `Leftover characters "${chars.join("")}" could not be paired \u2014 invalid`,
        array: [...chars],
        highlights: [],
        variables: { result: valid },
        headline: valid ? "Valid" : "Invalid",
        tag: { label: valid ? "Valid" : "Invalid", tone: valid ? "success" : "danger" },
        codeLine: 12,
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 push openers, pop and compare on closers",
    code: [
      "const stack = [];",
      "for (const c of s) {",
      "  if (isOpen(c)) stack.push(c);",
      "  else if (stack.pop() !== pairFor(c)) return false;",
      "}",
      "return stack.length === 0;",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const chars = input.split("");
      const stack: string[] = [];
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (isOpen(c)) {
          stack.push(c);
          steps.push({
            description: `'${c}' is an opener \u2014 push onto the stack`,
            array: chars,
            highlights: [{ index: i, role: "current" }],
            structure: { label: "stack", entries: [...stack] },
            variables: { i },
            headline: `push('${c}')`,
            tag: { label: "Push", tone: "info" },
            codeLine: 3,
          });
        } else {
          const top = stack.pop();
          const ok = top !== undefined && matchPair(top, c);
          steps.push({
            description: ok
              ? `'${c}' closes '${top}' \u2014 pop and continue`
              : `'${c}' does not match top of stack ('${top ?? "empty"}') \u2014 invalid`,
            array: chars,
            highlights: [{ index: i, role: ok ? "match" : "current" }],
            structure: { label: "stack", entries: [...stack] },
            variables: { i },
            headline: ok ? `pop() == '${top}'` : "mismatch",
            tag: ok ? { label: "Match", tone: "success" } : { label: "Mismatch", tone: "danger" },
            codeLine: 4,
            done: !ok,
          });
          if (!ok) return steps;
        }
      }
      const valid = stack.length === 0;
      steps.push({
        description: valid
          ? "Stack is empty \u2014 every opener was closed in the right order"
          : `Stack still has ${stack.length} unclosed opener(s) \u2014 invalid`,
        array: chars,
        highlights: [],
        structure: { label: "stack", entries: [...stack] },
        variables: { result: valid },
        headline: valid ? "Valid" : "Invalid",
        tag: { label: valid ? "Valid" : "Invalid", tone: valid ? "success" : "danger" },
        codeLine: 6,
        done: true,
      });
      return steps;
    },
  },
};

export const nextGreaterElementApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 scan rightward from each index",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  res[i] = -1;",
      "  for (let j = i + 1; j < n; j++) {",
      "    if (nums[j] > nums[i]) { res[i] = nums[j]; break; }",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const res: number[] = new Array(input.length).fill(-1);
      for (let i = 0; i < input.length; i++) {
        let found = false;
        for (let j = i + 1; j < input.length; j++) {
          steps.push({
            description: `Scanning right of index ${i}: compare nums[${j}] (${input[j]}) with nums[${i}] (${input[i]})`,
            array: input,
            highlights: [
              { index: i, role: "i" },
              { index: j, role: "j" },
            ],
            structure: { label: "result so far", entries: [...res] },
            variables: { i, j },
            headline: `${input[j]} vs ${input[i]}`,
            tag: { label: "Scan", tone: "info" },
            codeLine: 4,
          });
          if (input[j] > input[i]) {
            res[i] = input[j];
            found = true;
            steps.push({
              description: `nums[${j}] (${input[j]}) > nums[${i}] (${input[i]}) \u2014 next greater of index ${i} is ${input[j]}`,
              array: input,
              highlights: [
                { index: i, role: "match" },
                { index: j, role: "match" },
              ],
              structure: { label: "result so far", entries: [...res] },
              variables: { i, j },
              headline: `NGE[${i}] = ${input[j]}`,
              tag: { label: "Found", tone: "success" },
              codeLine: 4,
            });
            break;
          }
        }
        if (!found) {
          steps.push({
            description: `No greater element found to the right of index ${i} \u2014 result stays -1`,
            array: input,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "result so far", entries: [...res] },
            variables: { i },
            headline: `NGE[${i}] = -1`,
            tag: { label: "None", tone: "danger" },
            codeLine: 2,
          });
        }
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "result", entries: res },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Monotonic Stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 walk right to left, keep a decreasing stack of candidates",
    code: [
      "const stack = [];",
      "for (let i = n - 1; i >= 0; i--) {",
      "  while (stack.length && stack.top() <= nums[i]) stack.pop();",
      "  res[i] = stack.length ? stack.top() : -1;",
      "  stack.push(nums[i]);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const res: number[] = new Array(input.length).fill(-1);
      const stack: number[] = [];
      for (let i = input.length - 1; i >= 0; i--) {
        while (stack.length && stack[stack.length - 1] <= input[i]) {
          const popped = stack.pop();
          steps.push({
            description: `${popped} on top of the stack is \u2264 nums[${i}] (${input[i]}) \u2014 it can never be anyone's answer now, pop it`,
            array: input,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "stack (decreasing)", entries: [...stack] },
            variables: { i },
            headline: `pop ${popped}`,
            tag: { label: "Pop", tone: "danger" },
            codeLine: 3,
          });
        }
        res[i] = stack.length ? stack[stack.length - 1] : -1;
        steps.push({
          description: `Stack top is now ${stack.length ? stack[stack.length - 1] : "empty"} \u2014 that's the next greater element for index ${i}`,
          array: input,
          highlights: [{ index: i, role: "match" }],
          structure: { label: "stack (decreasing)", entries: [...stack] },
          variables: { i, "res[i]": res[i] },
          headline: `NGE[${i}] = ${res[i]}`,
          tag: { label: "Assign", tone: "success" },
          codeLine: 4,
        });
        stack.push(input[i]);
        steps.push({
          description: `Push nums[${i}] (${input[i]}) \u2014 it may be the answer for something further left`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "stack (decreasing)", entries: [...stack] },
          variables: { i },
          headline: `push(${input[i]})`,
          tag: { label: "Push", tone: "info" },
          codeLine: 5,
        });
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "result", entries: res },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const dailyTemperaturesApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 scan forward from each day",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  for (let j = i + 1; j < n; j++) {",
      "    if (temps[j] > temps[i]) { res[i] = j - i; break; }",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const res: number[] = new Array(input.length).fill(0);
      for (let i = 0; i < input.length; i++) {
        let found = false;
        for (let j = i + 1; j < input.length; j++) {
          steps.push({
            description: `Day ${i} (${input[i]}\u00b0): check day ${j} (${input[j]}\u00b0)`,
            array: input,
            highlights: [
              { index: i, role: "i" },
              { index: j, role: "j" },
            ],
            structure: { label: "wait days", entries: [...res] },
            variables: { i, j },
            headline: `${input[j]} vs ${input[i]}`,
            tag: { label: "Scan", tone: "info" },
            codeLine: 3,
          });
          if (input[j] > input[i]) {
            res[i] = j - i;
            found = true;
            steps.push({
              description: `Day ${j} is warmer \u2014 wait ${j - i} day(s) from day ${i}`,
              array: input,
              highlights: [
                { index: i, role: "match" },
                { index: j, role: "match" },
              ],
              structure: { label: "wait days", entries: [...res] },
              variables: { i, j },
              headline: `wait = ${j - i}`,
              tag: { label: "Found", tone: "success" },
              codeLine: 3,
            });
            break;
          }
        }
        if (!found) {
          steps.push({
            description: `No warmer day ahead of day ${i} \u2014 wait stays 0`,
            array: input,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "wait days", entries: [...res] },
            variables: { i },
            headline: "wait = 0",
            tag: { label: "None", tone: "danger" },
            codeLine: 1,
          });
        }
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "result", entries: res },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Monotonic Stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 keep indices of days still waiting for warmth, in decreasing temperature order",
    code: [
      "const stack = []; // indices, decreasing temps",
      "for (let i = 0; i < n; i++) {",
      "  while (stack.length && temps[stack.top()] < temps[i]) {",
      "    const j = stack.pop();",
      "    res[j] = i - j;",
      "  }",
      "  stack.push(i);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const res: number[] = new Array(input.length).fill(0);
      const stack: number[] = [];
      for (let i = 0; i < input.length; i++) {
        while (stack.length && input[stack[stack.length - 1]] < input[i]) {
          const j = stack.pop() as number;
          res[j] = i - j;
          steps.push({
            description: `Day ${i} (${input[i]}\u00b0) is warmer than day ${j} (${input[j]}\u00b0) on the stack \u2014 day ${j} waits ${i - j} day(s)`,
            array: input,
            highlights: [
              { index: i, role: "current" },
              { index: j, role: "match" },
            ],
            structure: { label: "stack (waiting days)", entries: [...stack] },
            variables: { i, j },
            headline: `res[${j}] = ${i - j}`,
            tag: { label: "Resolve", tone: "success" },
            codeLine: 5,
          });
        }
        stack.push(i);
        steps.push({
          description: `Push day ${i} (${input[i]}\u00b0) \u2014 it's still waiting for a warmer day`,
          array: input,
          highlights: [{ index: i, role: "i" }],
          structure: { label: "stack (waiting days)", entries: [...stack] },
          variables: { i },
          headline: `push(${i})`,
          tag: { label: "Push", tone: "info" },
          codeLine: 7,
        });
      }
      steps.push({
        description: `Final result: [${res.join(", ")}]`,
        array: input,
        highlights: [],
        structure: { label: "result", entries: res },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const minStackApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n) per getMin() call \u00b7 Space: O(n) \u2014 rescan the whole stack every time the minimum is needed",
    code: [
      "stack.push(x);",
      "function getMin() {",
      "  let m = Infinity;",
      "  for (const v of stack) m = Math.min(m, v);",
      "  return m;",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const stack: number[] = [];
      for (let i = 0; i < input.length; i++) {
        stack.push(input[i]);
        let min = Infinity;
        for (const v of stack) min = Math.min(min, v);
        steps.push({
          description: `Push ${input[i]}. getMin() rescans all ${stack.length} element(s) \u2014 minimum is ${min}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "stack", entries: [...stack] },
          variables: { pushed: input[i], min },
          headline: `min = ${min}`,
          tag: { label: "Rescan", tone: "danger" },
          codeLine: 4,
        });
      }
      steps.push({
        description: "Every getMin() call costs O(n) because the whole stack must be rescanned",
        array: input,
        highlights: [],
        structure: { label: "stack", entries: [...stack] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Auxiliary Min Stack)",
    complexity:
      "Time: O(1) per push / getMin() \u00b7 Space: O(n) \u2014 a second stack tracks the running minimum",
    code: [
      "stack.push(x);",
      "minStack.push(Math.min(x, minStack.top() ?? x));",
      "function getMin() { return minStack.top(); }",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const stack: number[] = [];
      const minStack: number[] = [];
      for (let i = 0; i < input.length; i++) {
        stack.push(input[i]);
        const prevMin = minStack.length ? minStack[minStack.length - 1] : input[i];
        const newMin = Math.min(input[i], prevMin);
        minStack.push(newMin);
        steps.push({
          description: `Push ${input[i]} onto both stacks \u2014 min stack also pushes min(${input[i]}, ${prevMin}) = ${newMin}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "min stack", entries: [...minStack] },
          variables: { pushed: input[i], min: newMin },
          headline: `getMin() = ${newMin}`,
          tag: { label: "O(1)", tone: "success" },
          codeLine: 2,
        });
      }
      steps.push({
        description: "getMin() is now just a peek at the top of the min stack \u2014 O(1) every time",
        array: input,
        highlights: [],
        structure: { label: "min stack", entries: [...minStack] },
        variables: {},
        headline: "Done",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const evalRPNApproaches: StrApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 repeatedly find the first operator and collapse it with its two operands",
    code: [
      "while (tokens.length > 1) {",
      "  const i = tokens.findIndex(isOperator);",
      "  const b = +tokens[i - 1], a = +tokens[i - 2];",
      "  tokens.splice(i - 2, 3, String(apply(tokens[i], a, b)));",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let tokens = input.trim().split(/\s+/);
      const isOp = (t: string) => ["+", "-", "*", "/"].includes(t);
      const apply = (op: string, a: number, b: number) => {
        if (op === "+") return a + b;
        if (op === "-") return a - b;
        if (op === "*") return a * b;
        return Math.trunc(a / b);
      };
      let guard = 0;
      while (tokens.length > 1 && guard < 50) {
        guard++;
        const i = tokens.findIndex(isOp);
        if (i < 2) break;
        const b = Number(tokens[i - 1]);
        const a = Number(tokens[i - 2]);
        const result = apply(tokens[i], a, b);
        steps.push({
          description: `First operator is "${tokens[i]}" at position ${i} \u2014 apply it to ${a} and ${b} = ${result}`,
          array: [...tokens],
          highlights: [
            { index: i - 2, role: "match" },
            { index: i - 1, role: "match" },
            { index: i, role: "current" },
          ],
          variables: { a, b, op: tokens[i] },
          headline: `${a} ${tokens[i]} ${b} = ${result}`,
          tag: { label: "Collapse", tone: "info" },
          codeLine: 4,
        });
        tokens.splice(i - 2, 3, String(result));
        steps.push({
          description: `Tokens after collapsing: [${tokens.join(", ")}]`,
          array: [...tokens],
          highlights: [{ index: i - 2, role: "sorted" }],
          variables: {},
          headline: tokens.join(" "),
          tag: { label: "Rescan", tone: "info" },
          codeLine: 2,
        });
      }
      steps.push({
        description: `Final result: ${tokens[0]}`,
        array: tokens,
        highlights: [{ index: 0, role: "match" }],
        variables: { result: tokens[0] },
        headline: `= ${tokens[0]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 push numbers, pop two operands when an operator arrives",
    code: [
      "const stack = [];",
      "for (const t of tokens) {",
      "  if (isOperator(t)) {",
      "    const b = stack.pop(), a = stack.pop();",
      "    stack.push(apply(t, a, b));",
      "  } else stack.push(+t);",
      "}",
      "return stack[0];",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const tokens = input.trim().split(/\s+/);
      const isOp = (t: string) => ["+", "-", "*", "/"].includes(t);
      const apply = (op: string, a: number, b: number) => {
        if (op === "+") return a + b;
        if (op === "-") return a - b;
        if (op === "*") return a * b;
        return Math.trunc(a / b);
      };
      const stack: number[] = [];
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (isOp(t)) {
          const b = stack.pop() as number;
          const a = stack.pop() as number;
          const result = apply(t, a, b);
          stack.push(result);
          steps.push({
            description: `"${t}" \u2014 pop ${b} then ${a}, compute ${a} ${t} ${b} = ${result}, push it back`,
            array: tokens,
            highlights: [{ index: i, role: "current" }],
            structure: { label: "stack", entries: [...stack] },
            variables: { a, b, result },
            headline: `${a} ${t} ${b} = ${result}`,
            tag: { label: "Apply", tone: "success" },
            codeLine: 4,
          });
        } else {
          stack.push(Number(t));
          steps.push({
            description: `"${t}" is a number \u2014 push it`,
            array: tokens,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "stack", entries: [...stack] },
            variables: {},
            headline: `push(${t})`,
            tag: { label: "Push", tone: "info" },
            codeLine: 6,
          });
        }
      }
      steps.push({
        description: `Final result: ${stack[0]}`,
        array: tokens,
        highlights: [],
        structure: { label: "stack", entries: [...stack] },
        variables: { result: stack[0] },
        headline: `= ${stack[0]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const largestRectangleHistogramApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 for each bar, expand left and right while the height holds",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  let left = i, right = i;",
      "  while (left > 0 && heights[left - 1] >= heights[i]) left--;",
      "  while (right < n - 1 && heights[right + 1] >= heights[i]) right++;",
      "  best = Math.max(best, heights[i] * (right - left + 1));",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let best = 0;
      for (let i = 0; i < input.length; i++) {
        let left = i;
        let right = i;
        while (left > 0 && input[left - 1] >= input[i]) left--;
        while (right < input.length - 1 && input[right + 1] >= input[i]) right++;
        const area = input[i] * (right - left + 1);
        const isBest = area > best;
        best = Math.max(best, area);
        steps.push({
          description: `Bar ${i} (height ${input[i]}) extends from ${left} to ${right} \u2014 area = ${input[i]} \u00d7 ${right - left + 1} = ${area}${isBest ? " (new best)" : ""}`,
          array: input,
          highlights: Array.from({ length: right - left + 1 }, (_, idx) => ({
            index: left + idx,
            role: isBest ? ("match" as const) : ("current" as const),
          })),
          variables: { i, left, right, area, best },
          headline: `area = ${area}`,
          tag: isBest ? { label: "New Best", tone: "success" } : { label: "Expand", tone: "info" },
          codeLine: 5,
        });
      }
      steps.push({
        description: `Largest rectangle area: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `max area = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Monotonic Stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 keep an increasing stack of bar indices, close bars out as shorter ones appear",
    code: [
      "const stack = []; // indices, increasing heights",
      "for (let i = 0; i <= n; i++) {",
      "  const h = i === n ? 0 : heights[i];",
      "  while (stack.length && heights[stack.top()] >= h) {",
      "    const height = heights[stack.pop()];",
      "    const width = stack.length ? i - stack.top() - 1 : i;",
      "    best = Math.max(best, height * width);",
      "  }",
      "  stack.push(i);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const stack: number[] = [];
      let best = 0;
      const n = input.length;
      for (let i = 0; i <= n; i++) {
        const h = i === n ? 0 : input[i];
        while (stack.length && input[stack[stack.length - 1]] >= h) {
          const top = stack.pop() as number;
          const height = input[top];
          const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
          const area = height * width;
          const isBest = area > best;
          best = Math.max(best, area);
          steps.push({
            description: `Bar ${top} (height ${height}) can't extend past index ${i} \u2014 pop it, width = ${width}, area = ${area}${isBest ? " (new best)" : ""}`,
            array: i === n ? input : input,
            highlights: [{ index: top, role: isBest ? "match" : "current" }],
            structure: { label: "stack (increasing)", entries: [...stack] },
            variables: { popped: top, height, width, area, best },
            headline: `area = ${area}`,
            tag: isBest ? { label: "New Best", tone: "success" } : { label: "Pop", tone: "info" },
            codeLine: 7,
          });
        }
        if (i < n) {
          stack.push(i);
          steps.push({
            description: `Push bar ${i} (height ${h}) \u2014 it's taller than or equal to everything ahead of it so far`,
            array: input,
            highlights: [{ index: i, role: "i" }],
            structure: { label: "stack (increasing)", entries: [...stack] },
            variables: { i },
            headline: `push(${i})`,
            tag: { label: "Push", tone: "info" },
            codeLine: 9,
          });
        }
      }
      steps.push({
        description: `Largest rectangle area: ${best}`,
        array: input,
        highlights: [],
        structure: { label: "stack", entries: [] },
        variables: { result: best },
        headline: `max area = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
