import type { GridApproachRunner, GridStep } from "./DPGridVisualizer";

type Approaches = Partial<Record<"brute" | "optimal", GridApproachRunner>>;

function emptyGrid(rows: number, cols: number): (string | number)[][] {
  return Array.from({ length: rows }, () => new Array(cols).fill(""));
}

export const uniquePathsApproaches: Approaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity:
      "Time: O(2^(m+n)) \u00b7 Space: O(m+n) call stack \u2014 try moving right or down from every cell",
    code: [
      "function paths(r, c) {",
      "  if (r === rows - 1 && c === cols - 1) return 1;",
      "  if (r >= rows || c >= cols) return 0;",
      "  return paths(r + 1, c) + paths(r, c + 1);",
      "}",
    ],
    run: (): GridStep[] => {
      const rows = 3;
      const cols = 3;
      const steps: GridStep[] = [];
      const grid = emptyGrid(rows, cols);
      const paths = (r: number, c: number): number => {
        if (r >= rows || c >= cols) return 0;
        if (r === rows - 1 && c === cols - 1) {
          steps.push({
            description: `Reached the bottom-right corner (${r}, ${c}) \u2014 that's one path`,
            grid: grid.map((row) => [...row]),
            highlights: [{ row: r, col: c, role: "base" }],
            variables: { r, c },
            headline: "paths = 1",
            tag: { label: "Base Case", tone: "info" },
            codeLine: 2,
          });
          return 1;
        }
        steps.push({
          description: `At (${r}, ${c}): move right or down`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: r, col: c, role: "current" }],
          variables: { r, c },
          headline: `paths(${r}, ${c})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 4,
        });
        const total = paths(r + 1, c) + paths(r, c + 1);
        grid[r][c] = total;
        steps.push({
          description: `paths(${r}, ${c}) = paths(${r + 1}, ${c}) + paths(${r}, ${c + 1}) = ${total}`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: r, col: c, role: "match" }],
          variables: { r, c, total },
          headline: `= ${total}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 4,
        });
        return total;
      };
      paths(0, 0);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity:
      "Time: O(m\u00d7n) \u00b7 Space: O(m\u00d7n) \u2014 dp[r][c] = dp[r-1][c] + dp[r][c-1], filled row by row",
    code: [
      "for (let r = 0; r < rows; r++) {",
      "  for (let c = 0; c < cols; c++) {",
      "    if (r === 0 || c === 0) dp[r][c] = 1;",
      "    else dp[r][c] = dp[r-1][c] + dp[r][c-1];",
      "  }",
      "}",
    ],
    run: (): GridStep[] => {
      const rows = 3;
      const cols = 3;
      const steps: GridStep[] = [];
      const dp: number[][] = Array.from({ length: rows }, () =>
        new Array(cols).fill(0),
      );
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r === 0 || c === 0) {
            dp[r][c] = 1;
            steps.push({
              description: `Edge cell (${r}, ${c}): only one way to reach it (straight along the border) \u2014 dp = 1`,
              grid: dp.map((row) => [...row]) as (string | number)[][],
              highlights: [{ row: r, col: c, role: "base" }],
              variables: { r, c },
              headline: `dp[${r}][${c}] = 1`,
              tag: { label: "Base Case", tone: "info" },
              codeLine: 3,
            });
          } else {
            const top = dp[r - 1][c];
            const left = dp[r][c - 1];
            dp[r][c] = top + left;
            steps.push({
              description: `dp[${r}][${c}] = top dp[${r - 1}][${c}] (${top}) + left dp[${r}][${c - 1}] (${left}) = ${dp[r][c]}`,
              grid: dp.map((row) => [...row]) as (string | number)[][],
              highlights: [
                { row: r, col: c, role: "current" },
                { row: r - 1, col: c, role: "top" },
                { row: r, col: c - 1, role: "left" },
              ],
              variables: { r, c, top, left, "dp[r][c]": dp[r][c] },
              headline: `dp[${r}][${c}] = ${dp[r][c]}`,
              tag: { label: "Fill", tone: "success" },
              codeLine: 4,
            });
          }
        }
      }
      steps.push({
        description: `Total unique paths to the bottom-right corner: ${dp[rows - 1][cols - 1]}`,
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [{ row: rows - 1, col: cols - 1, role: "match" }],
        variables: { result: dp[rows - 1][cols - 1] },
        headline: `Answer = ${dp[rows - 1][cols - 1]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const minimumPathSumApproaches: Approaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity:
      "Time: O(2^(m+n)) \u00b7 Space: O(m+n) call stack \u2014 try every right/down path, keep the cheapest",
    code: [
      "function minPath(r, c) {",
      "  if (r === rows - 1 && c === cols - 1) return grid[r][c];",
      "  if (r >= rows || c >= cols) return Infinity;",
      "  return grid[r][c] + Math.min(minPath(r + 1, c), minPath(r, c + 1));",
      "}",
    ],
    run: (): GridStep[] => {
      const cost = [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ];
      const rows = cost.length;
      const cols = cost[0].length;
      const steps: GridStep[] = [];
      const minPath = (r: number, c: number): number => {
        if (r >= rows || c >= cols) return Number.POSITIVE_INFINITY;
        if (r === rows - 1 && c === cols - 1) {
          steps.push({
            description: `Reached (${r}, ${c}) \u2014 add its cost ${cost[r][c]}`,
            grid: cost.map((row) => [...row]),
            highlights: [{ row: r, col: c, role: "base" }],
            variables: { r, c },
            headline: `= ${cost[r][c]}`,
            tag: { label: "Base Case", tone: "info" },
            codeLine: 2,
          });
          return cost[r][c];
        }
        steps.push({
          description: `At (${r}, ${c}) with cost ${cost[r][c]}: explore moving down or right`,
          grid: cost.map((row) => [...row]),
          highlights: [{ row: r, col: c, role: "current" }],
          variables: { r, c },
          headline: `minPath(${r}, ${c})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 4,
        });
        const total =
          cost[r][c] + Math.min(minPath(r + 1, c), minPath(r, c + 1));
        steps.push({
          description: `minPath(${r}, ${c}) = ${cost[r][c]} + min(down, right) = ${total}`,
          grid: cost.map((row) => [...row]),
          highlights: [{ row: r, col: c, role: "match" }],
          variables: { r, c, total },
          headline: `= ${total}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 4,
        });
        return total;
      };
      minPath(0, 0);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity:
      "Time: O(m\u00d7n) \u00b7 Space: O(m\u00d7n) \u2014 dp[r][c] = cost[r][c] + min(dp[r-1][c], dp[r][c-1])",
    code: [
      "dp[0][0] = grid[0][0];",
      "for (let r = 0; r < rows; r++) {",
      "  for (let c = 0; c < cols; c++) {",
      "    if (r > 0 && c > 0) dp[r][c] = grid[r][c] + Math.min(dp[r-1][c], dp[r][c-1]);",
      "    else if (r > 0) dp[r][c] = grid[r][c] + dp[r-1][c];",
      "    else if (c > 0) dp[r][c] = grid[r][c] + dp[r][c-1];",
      "    else dp[r][c] = grid[r][c];",
      "  }",
      "}",
    ],
    run: (): GridStep[] => {
      const cost = [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
      ];
      const rows = cost.length;
      const cols = cost[0].length;
      const steps: GridStep[] = [];
      const dp: number[][] = Array.from({ length: rows }, () =>
        new Array(cols).fill(0),
      );
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const deps: GridStep["highlights"] = [];
          const vars: Record<string, string | number> = { r, c };
          if (r > 0 && c > 0) {
            const top = dp[r - 1][c];
            const left = dp[r][c - 1];
            dp[r][c] = cost[r][c] + Math.min(top, left);
            deps.push(
              { row: r - 1, col: c, role: "top" },
              { row: r, col: c - 1, role: "left" },
            );
            vars.top = top;
            vars.left = left;
          } else if (r > 0) {
            const top = dp[r - 1][c];
            dp[r][c] = cost[r][c] + top;
            deps.push({ row: r - 1, col: c, role: "top" });
            vars.top = top;
          } else if (c > 0) {
            const left = dp[r][c - 1];
            dp[r][c] = cost[r][c] + left;
            deps.push({ row: r, col: c - 1, role: "left" });
            vars.left = left;
          } else {
            dp[r][c] = cost[r][c];
          }
          vars["dp[r][c]"] = dp[r][c];
          steps.push({
            description: `dp[${r}][${c}] = cost(${cost[r][c]}) + cheapest way in = ${dp[r][c]}`,
            grid: dp.map((row) => [...row]) as (string | number)[][],
            highlights: [
              { row: r, col: c, role: r === 0 && c === 0 ? "base" : "current" },
              ...deps,
            ],
            variables: vars,
            headline: `dp[${r}][${c}] = ${dp[r][c]}`,
            tag: {
              label: r === 0 && c === 0 ? "Base Case" : "Fill",
              tone: "success",
            },
            codeLine: 4,
          });
        }
      }
      steps.push({
        description: `Minimum path sum to the bottom-right corner: ${dp[rows - 1][cols - 1]}`,
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [{ row: rows - 1, col: cols - 1, role: "match" }],
        variables: { result: dp[rows - 1][cols - 1] },
        headline: `Answer = ${dp[rows - 1][cols - 1]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const longestCommonSubsequenceApproaches: Approaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity:
      "Time: O(2^(m+n)) \u00b7 Space: O(m+n) call stack \u2014 match characters or skip from either prefix",
    code: [
      "function lcs(i, j) {",
      "  if (i === 0 || j === 0) return 0;",
      "  if (a[i-1] === b[j-1]) return 1 + lcs(i - 1, j - 1);",
      "  return Math.max(lcs(i - 1, j), lcs(i, j - 1));",
      "}",
    ],
    run: (): GridStep[] => {
      const a = "ABCBDAB";
      const b = "BDCABA";
      const m = a.length;
      const n = b.length;
      const steps: GridStep[] = [];
      const grid = emptyGrid(m + 1, n + 1);
      const lcs = (i: number, j: number): number => {
        if (i === 0 || j === 0) {
          return 0;
        }
        steps.push({
          description: `Compare a[${i - 1}]='${a[i - 1]}' with b[${j - 1}]='${b[j - 1]}' (prefixes of length ${i} and ${j})`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: j, role: "current" }],
          variables: { i, j },
          headline: `lcs(${i}, ${j})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 3,
        });
        let result: number;
        if (a[i - 1] === b[j - 1]) {
          result = 1 + lcs(i - 1, j - 1);
        } else {
          result = Math.max(lcs(i - 1, j), lcs(i, j - 1));
        }
        grid[i][j] = result;
        steps.push({
          description: `lcs(${i}, ${j}) = ${result}`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: j, role: "match" }],
          variables: { i, j, result },
          headline: `= ${result}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 4,
        });
        return result;
      };
      lcs(m, n);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity:
      "Time: O(m\u00d7n) \u00b7 Space: O(m\u00d7n) \u2014 dp[i][j] = LCS length of a[0:i] and b[0:j], filled top to bottom",
    code: [
      "for (let i = 1; i <= m; i++) {",
      "  for (let j = 1; j <= n; j++) {",
      "    if (a[i-1] === b[j-1]) dp[i][j] = 1 + dp[i-1][j-1]; // diagonal",
      "    else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]); // top vs left",
      "  }",
      "}",
    ],
    run: (): GridStep[] => {
      const a = "ABCBDAB";
      const b = "BDCABA";
      const m = a.length;
      const n = b.length;
      const steps: GridStep[] = [];
      const dp: number[][] = Array.from({ length: m + 1 }, () =>
        new Array(n + 1).fill(0),
      );
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const match = a[i - 1] === b[j - 1];
          const top = dp[i - 1][j];
          const left = dp[i][j - 1];
          const diag = dp[i - 1][j - 1];
          dp[i][j] = match ? 1 + diag : Math.max(top, left);
          steps.push({
            description: match
              ? `a[${i - 1}]='${a[i - 1]}' matches b[${j - 1}]='${b[j - 1]}' \u2014 dp[${i}][${j}] = 1 + diagonal dp[${i - 1}][${j - 1}] (${diag}) = ${dp[i][j]}`
              : `a[${i - 1}]='${a[i - 1]}' \u2260 b[${j - 1}]='${b[j - 1]}' \u2014 dp[${i}][${j}] = max(top ${top}, left ${left}) = ${dp[i][j]}`,
            grid: dp.map((row) => [...row]) as (string | number)[][],
            highlights: match
              ? [
                  { row: i, col: j, role: "current" },
                  { row: i - 1, col: j - 1, role: "diag" },
                ]
              : [
                  { row: i, col: j, role: "current" },
                  { row: i - 1, col: j, role: "top" },
                  { row: i, col: j - 1, role: "left" },
                ],
            variables: match
              ? { i, j, diag, "dp[i][j]": dp[i][j] }
              : { i, j, top, left, "dp[i][j]": dp[i][j] },
            headline: `dp[${i}][${j}] = ${dp[i][j]}`,
            tag: match
              ? { label: "Match", tone: "success" }
              : { label: "Skip", tone: "info" },
            codeLine: match ? 3 : 4,
          });
        }
      }
      steps.push({
        description: `Longest common subsequence length of "${a}" and "${b}": ${dp[m][n]}`,
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [{ row: m, col: n, role: "match" }],
        variables: { result: dp[m][n] },
        headline: `Answer = ${dp[m][n]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const editDistanceApproaches: Approaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity:
      "Time: O(3^(m+n)) \u00b7 Space: O(m+n) call stack \u2014 try insert, delete, or replace at every mismatch",
    code: [
      "function dist(i, j) {",
      "  if (i === 0) return j;",
      "  if (j === 0) return i;",
      "  if (a[i-1] === b[j-1]) return dist(i - 1, j - 1);",
      "  return 1 + Math.min(dist(i-1,j), dist(i,j-1), dist(i-1,j-1));",
      "}",
    ],
    run: (): GridStep[] => {
      const a = "horse";
      const b = "ros";
      const m = a.length;
      const n = b.length;
      const steps: GridStep[] = [];
      const grid = emptyGrid(m + 1, n + 1);
      const dist = (i: number, j: number): number => {
        if (i === 0) return j;
        if (j === 0) return i;
        steps.push({
          description: `Compare a[${i - 1}]='${a[i - 1]}' with b[${j - 1}]='${b[j - 1]}' (prefixes of length ${i} and ${j})`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: j, role: "current" }],
          variables: { i, j },
          headline: `dist(${i}, ${j})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 4,
        });
        let result: number;
        if (a[i - 1] === b[j - 1]) {
          result = dist(i - 1, j - 1);
        } else {
          result =
            1 + Math.min(dist(i - 1, j), dist(i, j - 1), dist(i - 1, j - 1));
        }
        grid[i][j] = result;
        steps.push({
          description: `dist(${i}, ${j}) = ${result}`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: j, role: "match" }],
          variables: { i, j, result },
          headline: `= ${result}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 5,
        });
        return result;
      };
      dist(m, n);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity:
      "Time: O(m\u00d7n) \u00b7 Space: O(m\u00d7n) \u2014 dp[i][j] = edits to turn a[0:i] into b[0:j], filled top to bottom",
    code: [
      "for (let j = 0; j <= n; j++) dp[0][j] = j;",
      "for (let i = 0; i <= m; i++) dp[i][0] = i;",
      "for (let i = 1; i <= m; i++) {",
      "  for (let j = 1; j <= n; j++) {",
      "    if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1]; // diagonal",
      "    else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]); // top, left, diagonal",
      "  }",
      "}",
    ],
    run: (): GridStep[] => {
      const a = "horse";
      const b = "ros";
      const m = a.length;
      const n = b.length;
      const steps: GridStep[] = [];
      const dp: number[][] = Array.from({ length: m + 1 }, () =>
        new Array(n + 1).fill(0),
      );
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      steps.push({
        description:
          "Base row/column: turning an empty string into a prefix of length k takes k insertions (and vice versa for deletions)",
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [
          ...Array.from({ length: n + 1 }, (_, j) => ({
            row: 0,
            col: j,
            role: "base" as const,
          })),
          ...Array.from({ length: m + 1 }, (_, i) => ({
            row: i,
            col: 0,
            role: "base" as const,
          })),
        ],
        variables: {},
        headline: "Initialize base row & column",
        tag: { label: "Base Case", tone: "info" },
        codeLine: 1,
      });
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const match = a[i - 1] === b[j - 1];
          const top = dp[i - 1][j];
          const left = dp[i][j - 1];
          const diag = dp[i - 1][j - 1];
          dp[i][j] = match ? diag : 1 + Math.min(top, left, diag);
          steps.push({
            description: match
              ? `a[${i - 1}]='${a[i - 1]}' matches b[${j - 1}]='${b[j - 1]}' \u2014 no edit needed, dp[${i}][${j}] = diagonal dp[${i - 1}][${j - 1}] (${diag})`
              : `a[${i - 1}]='${a[i - 1]}' \u2260 b[${j - 1}]='${b[j - 1]}' \u2014 dp[${i}][${j}] = 1 + min(top ${top}, left ${left}, diagonal ${diag}) = ${dp[i][j]}`,
            grid: dp.map((row) => [...row]) as (string | number)[][],
            highlights: match
              ? [
                  { row: i, col: j, role: "current" },
                  { row: i - 1, col: j - 1, role: "diag" },
                ]
              : [
                  { row: i, col: j, role: "current" },
                  { row: i - 1, col: j, role: "top" },
                  { row: i, col: j - 1, role: "left" },
                  { row: i - 1, col: j - 1, role: "diag" },
                ],
            variables: match
              ? { i, j, diag, "dp[i][j]": dp[i][j] }
              : { i, j, top, left, diag, "dp[i][j]": dp[i][j] },
            headline: `dp[${i}][${j}] = ${dp[i][j]}`,
            tag: match
              ? { label: "Match", tone: "success" }
              : { label: "Edit", tone: "info" },
            codeLine: match ? 5 : 6,
          });
        }
      }
      steps.push({
        description: `Minimum edits to turn "${a}" into "${b}": ${dp[m][n]}`,
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [{ row: m, col: n, role: "match" }],
        variables: { result: dp[m][n] },
        headline: `Answer = ${dp[m][n]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

export const knapsackApproaches: Approaches = {
  brute: {
    label: "Brute Force (Recursion)",
    complexity:
      "Time: O(2^n) \u00b7 Space: O(n) call stack \u2014 try including or excluding every item",
    code: [
      "function knap(i, cap) {",
      "  if (i === 0 || cap === 0) return 0;",
      "  const item = i - 1;",
      "  if (weights[item] > cap) return knap(i - 1, cap);",
      "  return Math.max(knap(i-1, cap), values[item] + knap(i-1, cap-weights[item]));",
      "}",
    ],
    run: (): GridStep[] => {
      const weights = [1, 3, 4, 5];
      const values = [1, 4, 5, 7];
      const n = weights.length;
      const capacity = 7;
      const steps: GridStep[] = [];
      const grid = emptyGrid(n + 1, capacity + 1);
      const knap = (i: number, cap: number): number => {
        if (i === 0 || cap === 0) return 0;
        const item = i - 1;
        steps.push({
          description: `Using the first ${i} item(s) with capacity ${cap}: include item ${item} (w=${weights[item]}, v=${values[item]}) or skip it?`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: cap, role: "current" }],
          variables: { i, cap },
          headline: `knap(${i}, ${cap})`,
          tag: { label: "Recurse", tone: "info" },
          codeLine: 4,
        });
        let result: number;
        if (weights[item] > cap) {
          result = knap(i - 1, cap);
        } else {
          result = Math.max(
            knap(i - 1, cap),
            values[item] + knap(i - 1, cap - weights[item]),
          );
        }
        grid[i][cap] = result;
        steps.push({
          description: `knap(${i}, ${cap}) = ${result}`,
          grid: grid.map((row) => [...row]),
          highlights: [{ row: i, col: cap, role: "match" }],
          variables: { i, cap, result },
          headline: `= ${result}`,
          tag: { label: "Combine", tone: "success" },
          codeLine: 5,
        });
        return result;
      };
      knap(n, capacity);
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Tabulation)",
    complexity:
      "Time: O(n\u00d7capacity) \u00b7 Space: O(n\u00d7capacity) \u2014 dp[i][c] = best value using the first i items within capacity c, filled top to bottom",
    code: [
      "for (let i = 1; i <= n; i++) {",
      "  const item = i - 1;",
      "  for (let c = 0; c <= capacity; c++) {",
      "    dp[i][c] = dp[i-1][c]; // top: exclude item",
      "    if (weights[item] <= c) {",
      "      dp[i][c] = Math.max(dp[i][c], values[item] + dp[i-1][c-weights[item]]); // diagonal: include item",
      "    }",
      "  }",
      "}",
    ],
    run: (): GridStep[] => {
      const weights = [1, 3, 4, 5];
      const values = [1, 4, 5, 7];
      const n = weights.length;
      const capacity = 7;
      const steps: GridStep[] = [];
      const dp: number[][] = Array.from({ length: n + 1 }, () =>
        new Array(capacity + 1).fill(0),
      );
      for (let i = 1; i <= n; i++) {
        const item = i - 1;
        for (let c = 0; c <= capacity; c++) {
          const top = dp[i - 1][c];
          let best = top;
          let took = false;
          let diag: number | undefined;
          if (weights[item] <= c) {
            diag = dp[i - 1][c - weights[item]];
            const withItem = values[item] + diag;
            if (withItem > best) {
              best = withItem;
              took = true;
            }
          }
          dp[i][c] = best;
          steps.push({
            description: took
              ? `Item ${item} (w=${weights[item]}, v=${values[item]}) fits and improves the value \u2014 dp[${i}][${c}] = max(top ${top}, diagonal+value ${values[item]}+${diag}) = ${best}`
              : `Item ${item} skipped (doesn't fit or doesn't improve) \u2014 dp[${i}][${c}] = top dp[${i - 1}][${c}] = ${best}`,
            grid: dp.map((row) => [...row]) as (string | number)[][],
            highlights:
              weights[item] <= c
                ? [
                    { row: i, col: c, role: "current" },
                    { row: i - 1, col: c, role: "top" },
                    { row: i - 1, col: c - weights[item], role: "diag" },
                  ]
                : [
                    { row: i, col: c, role: "current" },
                    { row: i - 1, col: c, role: "top" },
                  ],
            variables: {
              i,
              c,
              top,
              ...(diag !== undefined ? { diag } : {}),
              "dp[i][c]": dp[i][c],
            },
            headline: `dp[${i}][${c}] = ${dp[i][c]}`,
            tag: took
              ? { label: "Take", tone: "success" }
              : { label: "Skip", tone: "info" },
            codeLine: took ? 6 : 4,
          });
        }
      }
      steps.push({
        description: `Maximum value within capacity ${capacity}: ${dp[n][capacity]}`,
        grid: dp.map((row) => [...row]) as (string | number)[][],
        highlights: [{ row: n, col: capacity, role: "match" }],
        variables: { result: dp[n][capacity] },
        headline: `Answer = ${dp[n][capacity]}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
