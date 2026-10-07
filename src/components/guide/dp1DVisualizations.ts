import type { ApproachRunner, VizStep } from "./AlgoVisualizer";

type NumApproaches = Partial<Record<"brute" | "optimal", ApproachRunner>>;
type StrApproaches = Partial<Record<"brute" | "optimal", ApproachRunner<string>>>;

export const houseRobberApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 try both choices at every house, no memory of past answers",
    code: [
      "function rob(i) {",
      "  if (i < 0) return 0;",
      "  return Math.max(rob(i - 1), nums[i] + rob(i - 2));",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const rob = (i: number): number => {
        if (i < 0) {
          steps.push({
            description: "i < 0 \u2014 no houses left, base case returns 0",
            array: input,
            highlights: [],
            variables: { i },
            headline: "rob(-1) = 0",
            tag: { label: "Base Case", tone: "info" },
            codeLine: 2,
          });
          return 0;
        }
        steps.push({
          description: `rob(${i}): either skip house ${i} (rob(${i - 1})) or take it (nums[${i}] + rob(${i - 2}))`,
          array: input,
          highlights: [{ index: i, role: "current" }],
          variables: { i },
          headline: `rob(${i})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 3,
        });
        const skip = rob(i - 1);
        const take = input[i] + rob(i - 2);
        const best = Math.max(skip, take);
        steps.push({
          description: `rob(${i}) = max(skip=${skip}, take=${take}) = ${best}`,
          array: input,
          highlights: [{ index: i, role: "match" }],
          variables: { i, skip, take, best },
          headline: `rob(${i}) = ${best}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 3,
        });
        return best;
      };
      rob(n - 1);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 fill dp[i] left to right, each house computed exactly once",
    code: [
      "dp[0] = nums[0]; dp[1] = Math.max(nums[0], nums[1]);",
      "for (let i = 2; i < n; i++) {",
      "  dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);",
      "}",
      "return dp[n - 1];",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const dp: number[] = new Array(n).fill(0);
      dp[0] = input[0];
      steps.push({
        description: `Base case: dp[0] = nums[0] = ${dp[0]} (only one house, must take it)`,
        array: [...dp],
        highlights: [{ index: 0, role: "current" }],
        variables: { "dp[0]": dp[0] },
        headline: `dp[0] = ${dp[0]}`,
        tag: { label: "Base Case", tone: "info" },
        codeLine: 1,
      });
      if (n > 1) {
        dp[1] = Math.max(input[0], input[1]);
        steps.push({
          description: `Base case: dp[1] = max(nums[0], nums[1]) = ${dp[1]}`,
          array: [...dp],
          highlights: [{ index: 1, role: "current" }],
          variables: { "dp[1]": dp[1] },
          headline: `dp[1] = ${dp[1]}`,
          tag: { label: "Base Case", tone: "info" },
          codeLine: 1,
        });
      }
      for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + input[i]);
        steps.push({
          description: `dp[${i}] = max(dp[${i - 1}]=${dp[i - 1]}, dp[${i - 2}]+nums[${i}]=${dp[i - 2] + input[i]}) = ${dp[i]}`,
          array: [...dp],
          highlights: [
            { index: i, role: "current" },
            { index: i - 1, role: "i" },
            { index: i - 2, role: "j" },
          ],
          variables: { i, "dp[i]": dp[i] },
          headline: `dp[${i}] = ${dp[i]}`,
          tag: { label: "Fill", tone: "success" },
          codeLine: 3,
        });
      }
      steps.push({
        description: `Maximum money that can be robbed: dp[${n - 1}] = ${dp[n - 1]}`,
        array: dp,
        highlights: [{ index: n - 1, role: "match" }],
        variables: { result: dp[n - 1] },
        headline: `Answer = ${dp[n - 1]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const coinChangeApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(coins^amount) \u00b7 Space: O(amount) call stack \u2014 try every coin at every remaining amount",
    code: [
      "function coinChange(amount) {",
      "  if (amount === 0) return 0;",
      "  if (amount < 0) return Infinity;",
      "  let best = Infinity;",
      "  for (const c of coins) best = Math.min(best, 1 + coinChange(amount - c));",
      "  return best;",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const coins = [1, 2, 5];
      const amount = input.length ? input[0] : 11;
      const solve = (remaining: number): number => {
        if (remaining === 0) {
          steps.push({
            description: "Remaining amount is 0 \u2014 no more coins needed",
            array: coins,
            highlights: [],
            variables: { remaining },
            headline: "coinChange(0) = 0",
            tag: { label: "Base Case", tone: "info" },
            codeLine: 2,
          });
          return 0;
        }
        if (remaining < 0) {
          return Number.POSITIVE_INFINITY;
        }
        steps.push({
          description: `coinChange(${remaining}): try each coin [${coins.join(", ")}]`,
          array: coins,
          highlights: coins.map((_, idx) => ({ index: idx, role: "current" as const })),
          variables: { remaining },
          headline: `coinChange(${remaining})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 5,
        });
        let best = Number.POSITIVE_INFINITY;
        for (const c of coins) {
          const sub = solve(remaining - c);
          if (sub + 1 < best) best = sub + 1;
        }
        steps.push({
          description: `Best for coinChange(${remaining}) = ${Number.isFinite(best) ? best : "\u221e"} coins`,
          array: coins,
          highlights: [],
          variables: { remaining, best: Number.isFinite(best) ? best : "none" },
          headline: `coinChange(${remaining}) = ${Number.isFinite(best) ? best : "\u221e"}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 6,
        });
        return best;
      };
      solve(amount);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity: "Time: O(amount \u00d7 coins) \u00b7 Space: O(amount) \u2014 fill dp[0..amount] once, bottom-up",
    code: [
      "dp[0] = 0;",
      "for (let a = 1; a <= amount; a++) {",
      "  dp[a] = Infinity;",
      "  for (const c of coins) if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] + 1);",
      "}",
      "return dp[amount];",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const coins = [1, 2, 5];
      const amount = input.length ? input[0] : 11;
      const dp: number[] = new Array(amount + 1).fill(Number.POSITIVE_INFINITY);
      dp[0] = 0;
      steps.push({
        description: "dp[0] = 0 \u2014 zero coins needed to make amount 0",
        array: dp.map((v) => (Number.isFinite(v) ? v : "\u221e")),
        highlights: [{ index: 0, role: "current" }],
        variables: {},
        headline: "dp[0] = 0",
        tag: { label: "Base Case", tone: "info" },
        codeLine: 1,
      });
      for (let a = 1; a <= amount; a++) {
        const deps: number[] = [];
        for (const c of coins) {
          if (a - c >= 0) {
            deps.push(a - c);
            if (dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
          }
        }
        steps.push({
          description: `dp[${a}] = min over coins of dp[${a} - coin] + 1 = ${Number.isFinite(dp[a]) ? dp[a] : "\u221e"}`,
          array: dp.map((v) => (Number.isFinite(v) ? v : "\u221e")),
          highlights: [
            { index: a, role: "current" },
            ...deps.map((d) => ({ index: d, role: "i" as const })),
          ],
          variables: { a, "dp[a]": Number.isFinite(dp[a]) ? dp[a] : "\u221e" },
          headline: `dp[${a}] = ${Number.isFinite(dp[a]) ? dp[a] : "\u221e"}`,
          tag: { label: "Fill", tone: "success" },
          codeLine: 4,
        });
      }
      steps.push({
        description: `Minimum coins to make ${amount}: ${Number.isFinite(dp[amount]) ? dp[amount] : "not possible"}`,
        array: dp.map((v) => (Number.isFinite(v) ? v : "\u221e")),
        highlights: [{ index: amount, role: "match" }],
        variables: { result: Number.isFinite(dp[amount]) ? dp[amount] : "-1" },
        headline: `Answer = ${Number.isFinite(dp[amount]) ? dp[amount] : -1}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestIncreasingSubsequenceApproaches: NumApproaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 every element either extends the subsequence or is skipped",
    code: [
      "function lis(i, prev) {",
      "  if (i === n) return 0;",
      "  let skip = lis(i + 1, prev);",
      "  let take = (prev === -1 || nums[i] > nums[prev]) ? 1 + lis(i + 1, i) : 0;",
      "  return Math.max(skip, take);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const lis = (i: number, prev: number): number => {
        if (i === n) return 0;
        steps.push({
          description: `Considering index ${i} (value ${input[i]}) with previous chosen index ${prev === -1 ? "none" : prev}`,
          array: input,
          highlights:
            prev === -1
              ? [{ index: i, role: "current" }]
              : [
                  { index: i, role: "current" },
                  { index: prev, role: "i" },
                ],
          variables: { i, prev },
          headline: `lis(${i})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 2,
        });
        const skip = lis(i + 1, prev);
        const canTake = prev === -1 || input[i] > input[prev];
        const take = canTake ? 1 + lis(i + 1, i) : 0;
        const best = Math.max(skip, take);
        steps.push({
          description: `At index ${i}: skip=${skip}, take=${canTake ? take : "n/a (not increasing)"} \u2192 best=${best}`,
          array: input,
          highlights: [{ index: i, role: "match" }],
          variables: { i, best },
          headline: `lis(${i}) = ${best}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 4,
        });
        return best;
      };
      lis(0, -1);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(n) \u2014 dp[i] = length of the longest increasing subsequence ending at i",
    code: [
      "dp.fill(1);",
      "for (let i = 1; i < n; i++) {",
      "  for (let j = 0; j < i; j++) {",
      "    if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);",
      "  }",
      "}",
      "return Math.max(...dp);",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const n = input.length;
      const dp: number[] = new Array(n).fill(1);
      steps.push({
        description: "Every index starts with dp[i] = 1 (the element alone is a subsequence of length 1)",
        array: [...dp],
        highlights: dp.map((_, idx) => ({ index: idx, role: "sorted" as const })),
        variables: {},
        headline: "Initialize dp = [1, 1, ...]",
        tag: { label: "Init", tone: "info" },
        codeLine: 1,
      });
      for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
          if (input[j] < input[i]) {
            const candidate = dp[j] + 1;
            const improved = candidate > dp[i];
            if (improved) dp[i] = candidate;
            steps.push({
              description: `nums[${j}]=${input[j]} < nums[${i}]=${input[i]} \u2014 dp[${i}] = max(dp[${i}], dp[${j}]+1) = ${dp[i]}${improved ? " (improved)" : ""}`,
              array: [...dp],
              highlights: [
                { index: i, role: "current" },
                { index: j, role: "i" },
              ],
              variables: { i, j, "dp[i]": dp[i] },
              headline: `dp[${i}] = ${dp[i]}`,
              tag: improved ? { label: "Improve", tone: "success" } : { label: "Check", tone: "info" },
              codeLine: 4,
            });
          }
        }
      }
      const best = Math.max(...dp);
      steps.push({
        description: `Longest increasing subsequence length: ${best}`,
        array: dp,
        highlights: dp.map((v, idx) => (v === best ? { index: idx, role: "match" as const } : null)).filter(Boolean) as VizStep["highlights"],
        variables: { result: best },
        headline: `Answer = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const maximumSubarrayApproaches: NumApproaches = {
  brute: {
    label: "Brute Force",
    complexity: "Time: O(n\u00b2) \u00b7 Space: O(1) \u2014 sum every possible subarray",
    code: [
      "let best = -Infinity;",
      "for (let i = 0; i < n; i++) {",
      "  let sum = 0;",
      "  for (let j = i; j < n; j++) {",
      "    sum += nums[j];",
      "    best = Math.max(best, sum);",
      "  }",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let best = Number.NEGATIVE_INFINITY;
      for (let i = 0; i < input.length; i++) {
        let sum = 0;
        for (let j = i; j < input.length; j++) {
          sum += input[j];
          const isBest = sum > best;
          best = Math.max(best, sum);
          steps.push({
            description: `Subarray [${i}..${j}] sums to ${sum}${isBest ? " \u2014 new best" : ""}`,
            array: input,
            highlights: Array.from({ length: j - i + 1 }, (_, idx) => ({
              index: i + idx,
              role: isBest ? ("match" as const) : ("current" as const),
            })),
            variables: { i, j, sum, best },
            headline: `sum = ${sum}`,
            tag: isBest ? { label: "New Best", tone: "success" } : { label: "Scan", tone: "info" },
            codeLine: 6,
          });
        }
      }
      steps.push({
        description: `Maximum subarray sum: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Answer = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Kadane's Algorithm)",
    complexity: "Time: O(n) \u00b7 Space: O(1) \u2014 dp[i] = best subarray ending at i, carried in a single running variable",
    code: [
      "let cur = nums[0], best = nums[0];",
      "for (let i = 1; i < n; i++) {",
      "  cur = Math.max(nums[i], cur + nums[i]);",
      "  best = Math.max(best, cur);",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      let cur = input[0];
      let best = input[0];
      steps.push({
        description: `Start: best subarray ending at index 0 is just nums[0] = ${cur}`,
        array: input,
        highlights: [{ index: 0, role: "current" }],
        variables: { cur, best },
        headline: `cur = ${cur}`,
        tag: { label: "Init", tone: "info" },
        codeLine: 1,
      });
      for (let i = 1; i < input.length; i++) {
        const extend = cur + input[i];
        const restart = input[i];
        cur = Math.max(restart, extend);
        const didRestart = cur === restart && restart > extend;
        best = Math.max(best, cur);
        steps.push({
          description: didRestart
            ? `Previous running sum was dragging it down \u2014 restart fresh at nums[${i}] = ${cur}`
            : `Extend the previous run: cur = ${cur}`,
          array: input,
          highlights: [{ index: i, role: "current" }, { index: i - 1, role: "i" }],
          variables: { i, cur, best },
          headline: `cur = ${cur}`,
          tag: didRestart ? { label: "Restart", tone: "danger" } : { label: "Extend", tone: "success" },
          codeLine: 3,
        });
      }
      steps.push({
        description: `Maximum subarray sum: ${best}`,
        array: input,
        highlights: [],
        variables: { result: best },
        headline: `Answer = ${best}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const decodeWaysApproaches: StrApproaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity: "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 branch on every 1-digit or 2-digit decode choice",
    code: [
      "function decode(i) {",
      "  if (i === n) return 1;",
      "  if (s[i] === '0') return 0;",
      "  let ways = decode(i + 1);",
      "  if (i + 1 < n && +s.slice(i, i + 2) <= 26) ways += decode(i + 2);",
      "  return ways;",
      "}",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const s = input;
      const n = s.length;
      const chars = s.split("");
      const decode = (i: number): number => {
        if (i === n) {
          steps.push({
            description: "Reached the end of the string \u2014 this is one valid decoding",
            array: chars,
            highlights: [],
            variables: { i },
            headline: "decode(end) = 1",
            tag: { label: "Base Case", tone: "info" },
            codeLine: 2,
          });
          return 1;
        }
        if (s[i] === "0") {
          steps.push({
            description: `s[${i}] = '0' cannot start a group \u2014 0 ways from here`,
            array: chars,
            highlights: [{ index: i, role: "current" }],
            variables: { i },
            headline: "decode(i) = 0",
            tag: { label: "Dead End", tone: "danger" },
            codeLine: 3,
          });
          return 0;
        }
        steps.push({
          description: `decode(${i}): take s[${i}]='${s[i]}' as one digit, or s[${i}..${i + 1}] as two digits if \u2264 26`,
          array: chars,
          highlights: [{ index: i, role: "current" }],
          variables: { i },
          headline: `decode(${i})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 4,
        });
        let ways = decode(i + 1);
        if (i + 1 < n && Number(s.slice(i, i + 2)) <= 26) {
          ways += decode(i + 2);
        }
        steps.push({
          description: `decode(${i}) = ${ways} total ways from this position`,
          array: chars,
          highlights: [{ index: i, role: "match" }],
          variables: { i, ways },
          headline: `decode(${i}) = ${ways}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 6,
        });
        return ways;
      };
      decode(0);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity: "Time: O(n) \u00b7 Space: O(n) \u2014 dp[i] = number of ways to decode the first i characters",
    code: [
      "dp[0] = 1; dp[1] = s[0] !== '0' ? 1 : 0;",
      "for (let i = 2; i <= n; i++) {",
      "  if (s[i-1] !== '0') dp[i] += dp[i-1];",
      "  if (+s.slice(i-2, i) >= 10 && +s.slice(i-2, i) <= 26) dp[i] += dp[i-2];",
      "}",
      "return dp[n];",
    ],
    run: (input): VizStep[] => {
      const steps: VizStep[] = [];
      const s = input;
      const n = s.length;
      const dp: number[] = new Array(n + 1).fill(0);
      dp[0] = 1;
      dp[1] = s[0] !== "0" ? 1 : 0;
      steps.push({
        description: `dp[0] = 1 (empty prefix has one way). dp[1] = ${dp[1]} (first digit '${s[0]}' ${s[0] !== "0" ? "is valid alone" : "cannot stand alone"})`,
        array: [...dp],
        highlights: [{ index: 0, role: "current" }],
        variables: {},
        headline: `dp[1] = ${dp[1]}`,
        tag: { label: "Base Case", tone: "info" },
        codeLine: 1,
      });
      for (let i = 2; i <= n; i++) {
        let ways = 0;
        if (s[i - 1] !== "0") ways += dp[i - 1];
        const twoDigit = Number(s.slice(i - 2, i));
        if (twoDigit >= 10 && twoDigit <= 26) ways += dp[i - 2];
        dp[i] = ways;
        steps.push({
          description: `dp[${i}]: one-digit '${s[i - 1]}' ${s[i - 1] !== "0" ? `adds dp[${i - 1}]=${dp[i - 1]}` : "invalid"}; two-digit '${s.slice(i - 2, i)}' ${twoDigit >= 10 && twoDigit <= 26 ? `adds dp[${i - 2}]=${dp[i - 2]}` : "out of range"} \u2192 dp[${i}] = ${dp[i]}`,
          array: [...dp],
          highlights: [{ index: i, role: "current" }, { index: i - 1, role: "i" }, { index: i - 2, role: "j" }],
          variables: { i, "dp[i]": dp[i] },
          headline: `dp[${i}] = ${dp[i]}`,
          tag: { label: "Fill", tone: "success" },
          codeLine: 3,
        });
      }
      steps.push({
        description: `Total ways to decode "${s}": ${dp[n]}`,
        array: dp,
        highlights: [{ index: n, role: "match" }],
        variables: { result: dp[n] },
        headline: `Answer = ${dp[n]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
