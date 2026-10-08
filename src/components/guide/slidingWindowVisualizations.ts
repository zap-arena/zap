import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

export const maxSumSubarrayApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b7k) \u00b7 Space: O(1) \u2014 re-sum all k elements at every start",
    code: [
      "let maxSum = -Infinity;",
      "for (let i = 0; i <= n - k; i++) {",
      "  let sum = 0;",
      "  for (let j = i; j < i + k; j++) sum += nums[j];",
      "  maxSum = Math.max(maxSum, sum);",
      "}",
    ],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      let maxSum = -Infinity;
      for (let i = 0; i <= input.length - target; i++) {
        let sum = 0;
        for (let j = i; j < i + target; j++) sum += input[j];
        const isBest = sum > maxSum;
        maxSum = Math.max(maxSum, sum);
        steps.push({
          description: `Window [${i}..${i + target - 1}] sums to ${sum}${isBest ? " \u2014 new best" : ""}`,
          array: input,
          highlights: Array.from({ length: target }, (_, idx) => ({
            index: i + idx,
            role: isBest ? ("match" as const) : ("i" as const),
          })),
          variables: { i, sum, maxSum },
          headline: `sum = ${sum}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Rescan", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Maximum window sum: ${maxSum}`,
        array: input,
        highlights: [],
        variables: { result: maxSum },
        headline: `Max sum = ${maxSum}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 build the first window, then slide",
    code: [
      "let windowSum = sum(nums[0..k-1]);",
      "let maxSum = windowSum;",
      "for (let i = k; i < n; i++) {",
      "  windowSum += nums[i] - nums[i - k];",
      "  maxSum = Math.max(maxSum, windowSum);",
      "}",
    ],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      let windowSum = 0;
      for (let i = 0; i < target; i++) windowSum += input[i];
      let maxSum = windowSum;
      steps.push({
        description: `Build first window [0..${target - 1}]: sum = ${windowSum}`,
        array: input,
        highlights: Array.from({ length: target }, (_, idx) => ({
          index: idx,
          role: "current" as const,
        })),
        variables: { windowSum, maxSum },
        headline: `sum = ${windowSum}`,
        tag: { label: "Build Window", tone: "info" },
        codeLine: 1,
      });
      for (let i = target; i < input.length; i++) {
        windowSum += input[i] - input[i - target];
        const isBest = windowSum > maxSum;
        maxSum = Math.max(maxSum, windowSum);
        steps.push({
          description: `Slide: drop nums[${i - target}] (${input[i - target]}), add nums[${i}] (${input[i]}) \u2014 sum = ${windowSum}`,
          array: input,
          highlights: [
            { index: i - target, role: "lo" },
            { index: i, role: isBest ? "match" : "hi" },
          ],
          variables: { i, windowSum, maxSum },
          headline: `sum = ${windowSum}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Slide", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Maximum window sum: ${maxSum}`,
        array: input,
        highlights: [],
        variables: { result: maxSum },
        headline: `Max sum = ${maxSum}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const maxAverageSubarrayApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b7k) \u00b7 Space: O(1) \u2014 re-sum all k elements, then divide",
    code: [
      "let maxAvg = -Infinity;",
      "for (let i = 0; i <= n - k; i++) {",
      "  let sum = 0;",
      "  for (let j = i; j < i + k; j++) sum += nums[j];",
      "  maxAvg = Math.max(maxAvg, sum / k);",
      "}",
    ],
    run: (input, target = 4): VizStep[] => {
      const steps: VizStep[] = [];
      let maxSum = -Infinity;
      for (let i = 0; i <= input.length - target; i++) {
        let sum = 0;
        for (let j = i; j < i + target; j++) sum += input[j];
        const isBest = sum > maxSum;
        maxSum = Math.max(maxSum, sum);
        steps.push({
          description: `Window [${i}..${i + target - 1}] sum = ${sum}, avg = ${(sum / target).toFixed(2)}`,
          array: input,
          highlights: Array.from({ length: target }, (_, idx) => ({
            index: i + idx,
            role: isBest ? ("match" as const) : ("i" as const),
          })),
          variables: { i, sum, avg: (sum / target).toFixed(2) },
          headline: `avg = ${(sum / target).toFixed(2)}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Rescan", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Maximum average: ${(maxSum / target).toFixed(2)}`,
        array: input,
        highlights: [],
        variables: { result: (maxSum / target).toFixed(2) },
        headline: `Max avg = ${(maxSum / target).toFixed(2)}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 track running sum, divide once at the end",
    code: [
      "let windowSum = sum(nums[0..k-1]);",
      "let maxSum = windowSum;",
      "for (let i = k; i < n; i++) {",
      "  windowSum += nums[i] - nums[i - k];",
      "  maxSum = Math.max(maxSum, windowSum);",
      "}",
      "return maxSum / k;",
    ],
    run: (input, target = 4): VizStep[] => {
      const steps: VizStep[] = [];
      let windowSum = 0;
      for (let i = 0; i < target; i++) windowSum += input[i];
      let maxSum = windowSum;
      steps.push({
        description: `Build first window [0..${target - 1}]: sum = ${windowSum}`,
        array: input,
        highlights: Array.from({ length: target }, (_, idx) => ({
          index: idx,
          role: "current" as const,
        })),
        variables: { windowSum },
        headline: `sum = ${windowSum}`,
        tag: { label: "Build Window", tone: "info" },
        codeLine: 1,
      });
      for (let i = target; i < input.length; i++) {
        windowSum += input[i] - input[i - target];
        const isBest = windowSum > maxSum;
        maxSum = Math.max(maxSum, windowSum);
        steps.push({
          description: `Slide: drop nums[${i - target}], add nums[${i}] \u2014 sum = ${windowSum}`,
          array: input,
          highlights: [
            { index: i - target, role: "lo" },
            { index: i, role: isBest ? "match" : "hi" },
          ],
          variables: { i, windowSum },
          headline: `sum = ${windowSum}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Slide", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Maximum average: ${(maxSum / target).toFixed(2)}`,
        array: input,
        highlights: [],
        variables: { result: (maxSum / target).toFixed(2) },
        headline: `Max avg = ${(maxSum / target).toFixed(2)}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const minSizeSubarraySumApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 from every start, expand until the sum reaches target",
    code: [
      "let best = Infinity;",
      "for (let i = 0; i < n; i++) {",
      "  let sum = 0;",
      "  for (let j = i; j < n; j++) {",
      "    sum += nums[j];",
      "    if (sum >= target) { best = Math.min(best, j - i + 1); break; }",
      "  }",
      "}",
    ],
    run: (input, target = 7): VizStep[] => {
      const steps: VizStep[] = [];
      let best = Number.POSITIVE_INFINITY;
      for (let i = 0; i < input.length; i++) {
        let sum = 0;
        for (let j = i; j < input.length; j++) {
          sum += input[j];
          const len = j - i + 1;
          if (sum >= target) {
            const isBest = len < best;
            best = Math.min(best, len);
            steps.push({
              description: `Window [${i}..${j}] sum = ${sum} \u2265 target (${target}), length ${len}${isBest ? " \u2014 new best" : ""}`,
              array: input,
              highlights: Array.from({ length: len }, (_, idx) => ({
                index: i + idx,
                role: isBest ? ("match" as const) : ("hi" as const),
              })),
              variables: { i, j, sum, best },
              headline: `len = ${len}`,
              tag: { label: "Target Reached", tone: "success" },
              codeLine: 6,
            });
            break;
          }
          steps.push({
            description: `Window [${i}..${j}] sum = ${sum} < target (${target}), keep expanding`,
            array: input,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: i + idx,
              role: "i" as const,
            })),
            variables: { i, j, sum },
            headline: `sum = ${sum}`,
            tag: { label: "Expand", tone: "info" },
            codeLine: 5,
          });
        }
      }
      steps.push({
        description:
          best === Number.POSITIVE_INFINITY
            ? "No valid subarray found, return 0"
            : `Shortest length: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best === Number.POSITIVE_INFINITY ? 0 : best },
        headline:
          best === Number.POSITIVE_INFINITY
            ? "No subarray"
            : `Min length = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 grow right, shrink left whenever sum \u2265 target",
    code: [
      "let left = 0, sum = 0, best = Infinity;",
      "for (let right = 0; right < n; right++) {",
      "  sum += nums[right];",
      "  while (sum >= target) {",
      "    best = Math.min(best, right - left + 1);",
      "    sum -= nums[left]; left++;",
      "  }",
      "}",
    ],
    run: (input, target = 7): VizStep[] => {
      const steps: VizStep[] = [];
      let left = 0;
      let sum = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let right = 0; right < input.length; right++) {
        sum += input[right];
        steps.push({
          description: `Expand right to ${right}: nums[${right}] (${input[right]}) added \u2014 sum = ${sum}`,
          array: input,
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          variables: {
            left,
            right,
            sum,
            best: best === Number.POSITIVE_INFINITY ? "-" : best,
          },
          headline: `sum = ${sum}`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 3,
        });
        while (sum >= target) {
          const len = right - left + 1;
          const isBest = len < best;
          best = Math.min(best, len);
          steps.push({
            description: `sum = ${sum} \u2265 target (${target}) \u2014 window length ${len}${isBest ? " (new best)" : ""}, shrink left`,
            array: input,
            highlights: [
              { index: left, role: "match" },
              { index: right, role: "hi" },
            ],
            variables: { left, right, sum, best },
            headline: `len = ${len}`,
            tag: { label: "Shrink", tone: "success" },
            codeLine: 5,
          });
          sum -= input[left];
          left++;
        }
      }
      steps.push({
        description:
          best === Number.POSITIVE_INFINITY
            ? "No valid subarray found, return 0"
            : `Shortest length: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best === Number.POSITIVE_INFINITY ? 0 : best },
        headline:
          best === Number.POSITIVE_INFINITY
            ? "No subarray"
            : `Min length = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestSubstringNoRepeatApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 check every substring for repeated characters",
    code: [
      "let best = 0;",
      "for (let i = 0; i < n; i++) {",
      "  const seen = new Set();",
      "  for (let j = i; j < n; j++) {",
      "    if (seen.has(s[j])) break;",
      "    seen.add(s[j]);",
      "    best = Math.max(best, j - i + 1);",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const seen = new Set<string>();
        for (let j = i; j < s.length; j++) {
          if (seen.has(s[j])) {
            steps.push({
              description: `'${s[j]}' already in window [${i}..${j - 1}] \u2014 stop expanding here`,
              array,
              highlights: [{ index: j, role: "current" }],
              structure: { label: "window chars", entries: [...seen] },
              variables: { i, j },
              headline: `'${s[j]}' repeats`,
              tag: { label: "Repeat", tone: "danger" },
              codeLine: 5,
            });
            break;
          }
          seen.add(s[j]);
          const len = j - i + 1;
          const isBest = len > best;
          best = Math.max(best, len);
          steps.push({
            description: `Window [${i}..${j}] = "${s.slice(i, j + 1)}", length ${len}${isBest ? " \u2014 new best" : ""}`,
            array,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: i + idx,
              role: isBest ? ("match" as const) : ("i" as const),
            })),
            structure: { label: "window chars", entries: [...seen] },
            variables: { i, j, best },
            headline: `len = ${len}`,
            tag: isBest
              ? { label: "New Best", tone: "success" }
              : { label: "Expand", tone: "info" },
            codeLine: 7,
          });
        }
      }
      steps.push({
        description: `Longest substring without repeats: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 map of last seen index, jump left past the repeat",
    code: [
      "const lastSeen = new Map();",
      "let left = 0, best = 0;",
      "for (let right = 0; right < n; right++) {",
      "  if (lastSeen.has(s[right]) && lastSeen.get(s[right]) >= left) {",
      "    left = lastSeen.get(s[right]) + 1;",
      "  }",
      "  lastSeen.set(s[right], right);",
      "  best = Math.max(best, right - left + 1);",
      "}",
    ],
    run: (input): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const lastSeen = new Map<string, number>();
      let left = 0;
      let best = 0;
      for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        if (lastSeen.has(ch) && (lastSeen.get(ch) as number) >= left) {
          left = (lastSeen.get(ch) as number) + 1;
          steps.push({
            description: `'${ch}' seen before inside window \u2014 jump left to ${left}`,
            array,
            highlights: [
              { index: left, role: "lo" },
              { index: right, role: "current" },
            ],
            structure: {
              label: "lastSeen",
              entries: [...lastSeen.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right },
            headline: `jump left \u2192 ${left}`,
            tag: { label: "Jump", tone: "info" },
            codeLine: 5,
          });
        }
        lastSeen.set(ch, right);
        const len = right - left + 1;
        const isBest = len > best;
        best = Math.max(best, len);
        steps.push({
          description: `Window [${left}..${right}] = "${s.slice(left, right + 1)}", length ${len}${isBest ? " \u2014 new best" : ""}`,
          array,
          highlights: Array.from({ length: right - left + 1 }, (_, idx) => ({
            index: left + idx,
            role: isBest ? ("match" as const) : ("hi" as const),
          })),
          structure: {
            label: "lastSeen",
            entries: [...lastSeen.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { left, right, best },
          headline: `len = ${len}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Expand", tone: "info" },
          codeLine: 8,
        });
      }
      steps.push({
        description: `Longest substring without repeats: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestSubstringKDistinctApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 expand while distinct count stays \u2264 k",
    code: [
      "let best = 0;",
      "for (let i = 0; i < n; i++) {",
      "  const count = new Map();",
      "  for (let j = i; j < n; j++) {",
      "    count.set(s[j], (count.get(s[j]) ?? 0) + 1);",
      "    if (count.size > k) break;",
      "    best = Math.max(best, j - i + 1);",
      "  }",
      "}",
    ],
    run: (input, target = 2): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const count = new Map<string, number>();
        for (let j = i; j < s.length; j++) {
          count.set(s[j], (count.get(s[j]) ?? 0) + 1);
          if (count.size > target) {
            steps.push({
              description: `Adding '${s[j]}' makes ${count.size} distinct chars (> k=${target}) \u2014 stop`,
              array,
              highlights: [{ index: j, role: "current" }],
              structure: {
                label: "count",
                entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
              },
              variables: { i, j },
              headline: `${count.size} distinct > ${target}`,
              tag: { label: "Too Many", tone: "danger" },
              codeLine: 6,
            });
            break;
          }
          const len = j - i + 1;
          const isBest = len > best;
          best = Math.max(best, len);
          steps.push({
            description: `Window [${i}..${j}] = "${s.slice(i, j + 1)}", ${count.size} distinct, length ${len}${isBest ? " \u2014 new best" : ""}`,
            array,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: i + idx,
              role: isBest ? ("match" as const) : ("i" as const),
            })),
            structure: {
              label: "count",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { i, j, best },
            headline: `len = ${len}`,
            tag: isBest
              ? { label: "New Best", tone: "success" }
              : { label: "Expand", tone: "info" },
            codeLine: 7,
          });
        }
      }
      steps.push({
        description: `Longest substring with \u2264 ${target} distinct chars: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 shrink left whenever distinct count exceeds k",
    code: [
      "const count = new Map();",
      "let left = 0, best = 0;",
      "for (let right = 0; right < n; right++) {",
      "  count.set(s[right], (count.get(s[right]) ?? 0) + 1);",
      "  while (count.size > k) {",
      "    count.set(s[left], count.get(s[left]) - 1);",
      "    if (count.get(s[left]) === 0) count.delete(s[left]);",
      "    left++;",
      "  }",
      "  best = Math.max(best, right - left + 1);",
      "}",
    ],
    run: (input, target = 2): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const count = new Map<string, number>();
      let left = 0;
      let best = 0;
      for (let right = 0; right < s.length; right++) {
        count.set(s[right], (count.get(s[right]) ?? 0) + 1);
        steps.push({
          description: `Expand right to ${right}: add '${s[right]}' \u2014 ${count.size} distinct`,
          array,
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          structure: {
            label: "count",
            entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { left, right },
          headline: `${count.size} distinct`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 4,
        });
        while (count.size > target) {
          const leftCh = s[left];
          count.set(leftCh, (count.get(leftCh) ?? 0) - 1);
          if (count.get(leftCh) === 0) count.delete(leftCh);
          steps.push({
            description: `${count.size + 1} distinct > k=${target} \u2014 shrink: remove '${leftCh}' at ${left}`,
            array,
            highlights: [{ index: left, role: "current" }],
            structure: {
              label: "count",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right },
            headline: "Shrink window",
            tag: { label: "Shrink", tone: "danger" },
            codeLine: 6,
          });
          left++;
        }
        const len = right - left + 1;
        const isBest = len > best;
        best = Math.max(best, len);
        if (isBest) {
          steps.push({
            description: `Window [${left}..${right}] length ${len} \u2014 new best`,
            array,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: left + idx,
              role: "match" as const,
            })),
            structure: {
              label: "count",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right, best },
            headline: `len = ${len}`,
            tag: { label: "New Best", tone: "success" },
            codeLine: 9,
          });
        }
      }
      steps.push({
        description: `Longest substring with \u2264 ${target} distinct chars: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const minWindowSubstringApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(k) \u2014 expand from every start until all of t is covered",
    code: [
      "let best = '';",
      "for (let i = 0; i < n; i++) {",
      "  const need = new Map(countOf(t));",
      "  for (let j = i; j < n; j++) {",
      "    mark(need, s[j]);",
      "    if (satisfied(need)) { updateBest(i, j); break; }",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const [s, t] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      let best = "";
      const baseNeed = new Map<string, number>();
      for (const ch of t) baseNeed.set(ch, (baseNeed.get(ch) ?? 0) + 1);
      for (let i = 0; i < s.length; i++) {
        const need = new Map(baseNeed);
        let remaining = t.length;
        for (let j = i; j < s.length; j++) {
          const ch = s[j];
          const cnt = need.get(ch) ?? 0;
          if (cnt > 0) remaining--;
          need.set(ch, cnt - 1);
          const len = j - i + 1;
          if (remaining <= 0) {
            const isBest = best === "" || len < best.length;
            if (isBest) best = s.slice(i, j + 1);
            steps.push({
              description: `Window [${i}..${j}] = "${s.slice(i, j + 1)}" covers all of "${t}"${isBest ? " \u2014 new best" : ""}`,
              array,
              highlights: Array.from({ length: len }, (_, idx) => ({
                index: i + idx,
                role: isBest ? ("match" as const) : ("hi" as const),
              })),
              variables: { i, j, best },
              headline: `"${s.slice(i, j + 1)}"`,
              tag: { label: "Covers t", tone: "success" },
              codeLine: 6,
            });
            break;
          }
          steps.push({
            description: `Window [${i}..${j}] still missing ${remaining} character(s) of "${t}"`,
            array,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: i + idx,
              role: "i" as const,
            })),
            variables: { i, j, remaining },
            headline: `missing ${remaining}`,
            tag: { label: "Expand", tone: "info" },
            codeLine: 5,
          });
        }
      }
      steps.push({
        description: best
          ? `Shortest covering substring: "${best}"`
          : "No covering substring exists",
        array,
        highlights: [],
        variables: { result: best || '""' },
        headline: best ? `"${best}"` : "Not found",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 need/have maps, shrink left whenever the window is valid",
    code: [
      "const need = countOf(t); let have = 0, required = need.size;",
      "let left = 0, best = '';",
      "for (let right = 0; right < n; right++) {",
      "  consume(s[right]);",
      "  while (have === required) {",
      "    updateBest(left, right);",
      "    release(s[left]); left++;",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const [s, t] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      const need = new Map<string, number>();
      for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
      const window = new Map<string, number>();
      let have = 0;
      const required = need.size;
      let left = 0;
      let best = "";
      for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        window.set(ch, (window.get(ch) ?? 0) + 1);
        if (need.has(ch) && window.get(ch) === need.get(ch)) have++;
        steps.push({
          description: `Expand right to ${right}: add '${ch}' \u2014 satisfied ${have}/${required} required chars`,
          array,
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          structure: {
            label: "window",
            entries: [...window.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { left, right, have, required },
          headline: `${have}/${required} satisfied`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 4,
        });
        while (have === required) {
          const len = right - left + 1;
          const isBest = best === "" || len < best.length;
          if (isBest) best = s.slice(left, right + 1);
          steps.push({
            description: `Window [${left}..${right}] = "${s.slice(left, right + 1)}" fully covers "${t}"${isBest ? " \u2014 new best" : ""}`,
            array,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: left + idx,
              role: isBest ? ("match" as const) : ("hi" as const),
            })),
            variables: { left, right, best },
            headline: `"${s.slice(left, right + 1)}"`,
            tag: { label: "Valid Window", tone: "success" },
            codeLine: 6,
          });
          const leftCh = s[left];
          if (need.has(leftCh) && window.get(leftCh) === need.get(leftCh))
            have--;
          window.set(leftCh, (window.get(leftCh) ?? 0) - 1);
          left++;
        }
      }
      steps.push({
        description: best
          ? `Shortest covering substring: "${best}"`
          : "No covering substring exists",
        array,
        highlights: [],
        variables: { result: best || '""' },
        headline: best ? `"${best}"` : "Not found",
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const findAllAnagramsApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b7k log k) \u00b7 Space: O(k) \u2014 sort every window of length |p| and compare",
    code: [
      "const target = [...p].sort().join('');",
      "const result = [];",
      "for (let i = 0; i + p.length <= s.length; i++) {",
      "  const window = [...s.slice(i, i + p.length)].sort().join('');",
      "  if (window === target) result.push(i);",
      "}",
    ],
    run: (input): VizStep[] => {
      const [s, p] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      const target = [...p].sort().join("");
      const result: number[] = [];
      for (let i = 0; i + p.length <= s.length; i++) {
        const windowStr = s.slice(i, i + p.length);
        const sortedWindow = [...windowStr].sort().join("");
        const isMatch = sortedWindow === target;
        if (isMatch) result.push(i);
        steps.push({
          description: `Window [${i}..${i + p.length - 1}] = "${windowStr}"${isMatch ? ` is an anagram of "${p}"` : " is not an anagram"}`,
          array,
          highlights: Array.from({ length: p.length }, (_, idx) => ({
            index: i + idx,
            role: isMatch ? ("match" as const) : ("i" as const),
          })),
          variables: { i, found: result.length },
          headline: `"${windowStr}"`,
          tag: isMatch
            ? { label: "Anagram Found", tone: "success" }
            : { label: "Check", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Anagram starting indices: [${result.join(", ")}]`,
        array,
        highlights: [],
        variables: { result: `[${result.join(", ")}]` },
        headline: `[${result.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 fixed-size window, compare frequency maps as you slide",
    code: [
      "const need = countOf(p);",
      "const window = new Map();",
      "const result = [];",
      "for (let i = 0; i < s.length; i++) {",
      "  add(window, s[i]);",
      "  if (i >= p.length) remove(window, s[i - p.length]);",
      "  if (i >= p.length - 1 && mapsEqual(window, need)) result.push(i - p.length + 1);",
      "}",
    ],
    run: (input): VizStep[] => {
      const [s, p] = input.split(",");
      const steps: VizStep[] = [];
      const array = [...s];
      const need = new Map<string, number>();
      for (const ch of p) need.set(ch, (need.get(ch) ?? 0) + 1);
      const window = new Map<string, number>();
      const result: number[] = [];
      const mapsEqual = (a: Map<string, number>, b: Map<string, number>) => {
        if (a.size !== b.size) return false;
        for (const [k, v] of a) if (b.get(k) !== v) return false;
        return true;
      };
      for (let i = 0; i < s.length; i++) {
        window.set(s[i], (window.get(s[i]) ?? 0) + 1);
        if (i >= p.length) {
          const leftCh = s[i - p.length];
          const cnt = (window.get(leftCh) ?? 0) - 1;
          if (cnt <= 0) window.delete(leftCh);
          else window.set(leftCh, cnt);
        }
        const start = i - p.length + 1;
        if (i >= p.length - 1) {
          const isMatch = mapsEqual(window, need);
          if (isMatch) result.push(start);
          steps.push({
            description: `Window [${start}..${i}] = "${s.slice(start, i + 1)}"${isMatch ? ` matches "${p}"'s letter counts` : " doesn't match"}`,
            array,
            highlights: Array.from({ length: p.length }, (_, idx) => ({
              index: start + idx,
              role: isMatch ? ("match" as const) : ("hi" as const),
            })),
            structure: {
              label: "window",
              entries: [...window.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { start, i, found: result.length },
            headline: `"${s.slice(start, i + 1)}"`,
            tag: isMatch
              ? { label: "Anagram Found", tone: "success" }
              : { label: "Slide", tone: "info" },
            codeLine: 7,
          });
        } else {
          steps.push({
            description: `Building first window: added '${s[i]}'`,
            array,
            highlights: [{ index: i, role: "current" }],
            structure: {
              label: "window",
              entries: [...window.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { i },
            headline: "Build window",
            tag: { label: "Build", tone: "info" },
            codeLine: 2,
          });
        }
      }
      steps.push({
        description: `Anagram starting indices: [${result.join(", ")}]`,
        array,
        highlights: [],
        variables: { result: `[${result.join(", ")}]` },
        headline: `[${result.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const fruitIntoBasketsApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 expand from every start while \u2264 2 distinct types",
    code: [
      "let best = 0;",
      "for (let i = 0; i < n; i++) {",
      "  const types = new Set();",
      "  for (let j = i; j < n; j++) {",
      "    types.add(fruits[j]);",
      "    if (types.size > 2) break;",
      "    best = Math.max(best, j - i + 1);",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let best = 0;
      for (let i = 0; i < input.length; i++) {
        const types = new Set<number>();
        for (let j = i; j < input.length; j++) {
          types.add(input[j]);
          if (types.size > 2) {
            steps.push({
              description: `Adding fruits[${j}] (${input[j]}) makes ${types.size} distinct types \u2014 stop`,
              array: input,
              highlights: [{ index: j, role: "current" }],
              structure: { label: "basket types", entries: [...types] },
              variables: { i, j },
              headline: `${types.size} types > 2`,
              tag: { label: "Too Many", tone: "danger" },
              codeLine: 5,
            });
            break;
          }
          const len = j - i + 1;
          const isBest = len > best;
          best = Math.max(best, len);
          steps.push({
            description: `Window [${i}..${j}] has ${types.size} fruit type(s), length ${len}${isBest ? " \u2014 new best" : ""}`,
            array: input,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: i + idx,
              role: isBest ? ("match" as const) : ("i" as const),
            })),
            structure: { label: "basket types", entries: [...types] },
            variables: { i, j, best },
            headline: `len = ${len}`,
            tag: isBest
              ? { label: "New Best", tone: "success" }
              : { label: "Expand", tone: "info" },
            codeLine: 6,
          });
        }
      }
      steps.push({
        description: `Longest run with \u2264 2 fruit types: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 shrink left whenever basket types exceed 2",
    code: [
      "const count = new Map();",
      "let left = 0, best = 0;",
      "for (let right = 0; right < n; right++) {",
      "  count.set(fruits[right], (count.get(fruits[right]) ?? 0) + 1);",
      "  while (count.size > 2) {",
      "    decrement(count, fruits[left]); left++;",
      "  }",
      "  best = Math.max(best, right - left + 1);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const count = new Map<number, number>();
      let left = 0;
      let best = 0;
      for (let right = 0; right < input.length; right++) {
        count.set(input[right], (count.get(input[right]) ?? 0) + 1);
        steps.push({
          description: `Expand right to ${right}: add fruit ${input[right]} \u2014 ${count.size} type(s) in basket`,
          array: input,
          highlights: [
            { index: left, role: "lo" },
            { index: right, role: "hi" },
          ],
          structure: {
            label: "basket counts",
            entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { left, right },
          headline: `${count.size} types`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 4,
        });
        while (count.size > 2) {
          const leftType = input[left];
          const cnt = (count.get(leftType) ?? 0) - 1;
          if (cnt <= 0) count.delete(leftType);
          else count.set(leftType, cnt);
          steps.push({
            description: `More than 2 types \u2014 shrink: remove fruit ${leftType} at ${left}`,
            array: input,
            highlights: [{ index: left, role: "current" }],
            structure: {
              label: "basket counts",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right },
            headline: "Shrink window",
            tag: { label: "Shrink", tone: "danger" },
            codeLine: 6,
          });
          left++;
        }
        const len = right - left + 1;
        const isBest = len > best;
        best = Math.max(best, len);
        if (isBest) {
          steps.push({
            description: `Window [${left}..${right}] length ${len} \u2014 new best`,
            array: input,
            highlights: Array.from({ length: len }, (_, idx) => ({
              index: left + idx,
              role: "match" as const,
            })),
            structure: {
              label: "basket counts",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right, best },
            headline: `len = ${len}`,
            tag: { label: "New Best", tone: "success" },
            codeLine: 8,
          });
        }
      }
      steps.push({
        description: `Longest run with \u2264 2 fruit types: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const containsDuplicateIIApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 check every pair within distance k",
    code: [
      "for (let i = 0; i < n; i++) {",
      "  for (let j = i + 1; j <= Math.min(i + k, n - 1); j++) {",
      "    if (nums[i] === nums[j]) return true;",
      "  }",
      "}",
      "return false;",
    ],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j <= Math.min(i + target, input.length - 1); j++) {
          const isMatch = input[i] === input[j];
          steps.push({
            description: `Compare nums[${i}] (${input[i]}) with nums[${j}] (${input[j]}), distance ${j - i}${isMatch ? " \u2014 match!" : ""}`,
            array: input,
            highlights: [
              { index: i, role: isMatch ? "match" : "i" },
              { index: j, role: isMatch ? "match" : "j" },
            ],
            variables: { i, j },
            headline: `${input[i]} vs ${input[j]}`,
            tag: isMatch
              ? { label: "Duplicate Found", tone: "success" }
              : { label: "Compare", tone: "info" },
            codeLine: 3,
            done: isMatch,
          });
          if (isMatch) return steps;
        }
      }
      steps.push({
        description: "No duplicate within distance k found, return false",
        array: input,
        highlights: [],
        variables: { result: "false" },
        headline: "No duplicates",
        tag: { label: "Not Found", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(k) \u2014 keep a set of the last k elements, slide it",
    code: [
      "const window = new Set();",
      "for (let i = 0; i < n; i++) {",
      "  if (window.has(nums[i])) return true;",
      "  window.add(nums[i]);",
      "  if (window.size > k) window.delete(nums[i - k]);",
      "}",
      "return false;",
    ],
    run: (input, target = 3): VizStep[] => {
      const steps: VizStep[] = [];
      const window = new Set<number>();
      for (let i = 0; i < input.length; i++) {
        if (window.has(input[i])) {
          steps.push({
            description: `nums[${i}] (${input[i]}) already in the window (last ${target} elements) \u2014 return true`,
            array: input,
            highlights: [{ index: i, role: "match" }],
            structure: { label: "window", entries: [...window] },
            variables: { i, result: "true" },
            headline: `${input[i]} in window`,
            tag: { label: "Duplicate Found", tone: "success" },
            codeLine: 3,
            done: true,
          });
          return steps;
        }
        window.add(input[i]);
        if (window.size > target) window.delete(input[i - target]);
        steps.push({
          description: `Add nums[${i}] (${input[i]}) to the window${window.size > target ? "" : ""}`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          structure: { label: "window", entries: [...window] },
          variables: { i },
          headline: `add ${input[i]}`,
          tag: { label: "Slide", tone: "info" },
          codeLine: 4,
        });
      }
      steps.push({
        description: "No duplicate within distance k found, return false",
        array: input,
        highlights: [],
        variables: { result: "false" },
        headline: "No duplicates",
        tag: { label: "Not Found", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestRepeatingCharReplacementApproaches: Partial<
  Record<"brute" | "optimal", ApproachRunner<string>>
> = {
  brute: {
    label: "Brute Force",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 for every window, check if \u2264 k replacements make it uniform",
    code: [
      "let best = 0;",
      "for (let i = 0; i < n; i++) {",
      "  const count = new Map();",
      "  let maxFreq = 0;",
      "  for (let j = i; j < n; j++) {",
      "    count.set(s[j], (count.get(s[j]) ?? 0) + 1);",
      "    maxFreq = Math.max(maxFreq, count.get(s[j]));",
      "    if (j - i + 1 - maxFreq <= k) best = Math.max(best, j - i + 1);",
      "    else break;",
      "  }",
      "}",
    ],
    run: (input, target = 1): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const count = new Map<string, number>();
        let maxFreq = 0;
        for (let j = i; j < s.length; j++) {
          count.set(s[j], (count.get(s[j]) ?? 0) + 1);
          maxFreq = Math.max(maxFreq, count.get(s[j]) ?? 0);
          const len = j - i + 1;
          const replacementsNeeded = len - maxFreq;
          if (replacementsNeeded <= target) {
            const isBest = len > best;
            best = Math.max(best, len);
            steps.push({
              description: `Window [${i}..${j}] needs ${replacementsNeeded} replacement(s) (\u2264 k=${target}), length ${len}${isBest ? " \u2014 new best" : ""}`,
              array,
              highlights: Array.from({ length: len }, (_, idx) => ({
                index: i + idx,
                role: isBest ? ("match" as const) : ("i" as const),
              })),
              variables: { i, j, maxFreq, best },
              headline: `needs ${replacementsNeeded} swap(s)`,
              tag: isBest
                ? { label: "New Best", tone: "success" }
                : { label: "Valid", tone: "info" },
              codeLine: 8,
            });
          } else {
            steps.push({
              description: `Window [${i}..${j}] needs ${replacementsNeeded} replacements (> k=${target}) \u2014 stop`,
              array,
              highlights: Array.from({ length: len }, (_, idx) => ({
                index: i + idx,
                role: "current" as const,
              })),
              variables: { i, j, maxFreq },
              headline: `needs ${replacementsNeeded} swap(s)`,
              tag: { label: "Too Many", tone: "danger" },
              codeLine: 9,
            });
            break;
          }
        }
      }
      steps.push({
        description: `Longest achievable uniform substring: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Sliding Window",
    complexity:
      "Time: O(n) \u00b7 Space: O(1) \u2014 track the max frequency seen, slide without ever un-counting it",
    code: [
      "const count = new Map();",
      "let left = 0, maxFreq = 0, best = 0;",
      "for (let right = 0; right < n; right++) {",
      "  count.set(s[right], (count.get(s[right]) ?? 0) + 1);",
      "  maxFreq = Math.max(maxFreq, count.get(s[right]));",
      "  if (right - left + 1 - maxFreq > k) {",
      "    count.set(s[left], count.get(s[left]) - 1); left++;",
      "  }",
      "  best = Math.max(best, right - left + 1);",
      "}",
    ],
    run: (input, target = 1): VizStep[] => {
      const s = input;
      const steps: VizStep[] = [];
      const array = [...s];
      const count = new Map<string, number>();
      let left = 0;
      let maxFreq = 0;
      let best = 0;
      for (let right = 0; right < s.length; right++) {
        count.set(s[right], (count.get(s[right]) ?? 0) + 1);
        maxFreq = Math.max(maxFreq, count.get(s[right]) ?? 0);
        const windowLen = right - left + 1;
        if (windowLen - maxFreq > target) {
          const leftCh = s[left];
          count.set(leftCh, (count.get(leftCh) ?? 0) - 1);
          steps.push({
            description: `Window needs more than k=${target} replacements \u2014 shrink: drop '${leftCh}' at ${left}`,
            array,
            highlights: [{ index: left, role: "current" }],
            structure: {
              label: "count",
              entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
            },
            variables: { left, right, maxFreq },
            headline: "Shrink window",
            tag: { label: "Shrink", tone: "danger" },
            codeLine: 7,
          });
          left++;
        }
        const len = right - left + 1;
        const isBest = len > best;
        best = Math.max(best, len);
        steps.push({
          description: `Window [${left}..${right}] length ${len}, most frequent char count ${maxFreq}${isBest ? " \u2014 new best" : ""}`,
          array,
          highlights: Array.from({ length: len }, (_, idx) => ({
            index: left + idx,
            role: isBest ? ("match" as const) : ("hi" as const),
          })),
          structure: {
            label: "count",
            entries: [...count.entries()].map(([k, v]) => `${k}:${v}`),
          },
          variables: { left, right, maxFreq, best },
          headline: `len = ${len}`,
          tag: isBest
            ? { label: "New Best", tone: "success" }
            : { label: "Slide", tone: "info" },
          codeLine: 9,
        });
      }
      steps.push({
        description: `Longest achievable uniform substring: ${best}`,
        array,
        highlights: [],
        variables: { result: best },
        headline: `Longest = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
