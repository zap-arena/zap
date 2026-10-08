import type React from "react";
import DPGridVisualizer from "../../components/guide/DPGridVisualizer";
import {
  editDistanceApproaches,
  knapsackApproaches,
  longestCommonSubsequenceApproaches,
  minimumPathSumApproaches,
  uniquePathsApproaches,
} from "../../components/guide/dp2DVisualizations";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function DP2DGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">2D Dynamic Programming</div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Unique Paths
            </a>
            <a className="side-link" href="#q2">
              02 · Minimum Path Sum
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q3">
              03 · Longest Common Subsequence
            </a>
            <a className="side-link" href="#q4">
              04 · Edit Distance
            </a>
            <a className="side-link" href="#q5">
              05 · 0/1 Knapsack
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">2D DP</span>
              <span className="sub">DSA question bank · Java &amp; Python</span>
            </div>
            <div className="top-actions">
              <div
                className="lang-switch"
                id="langSwitch"
                role="group"
                aria-label="Code language"
              >
                <button
                  type="button"
                  data-lang="both"
                  className="active"
                  aria-pressed="true"
                >
                  Both
                </button>
                <button type="button" data-lang="java" aria-pressed="false">
                  Java
                </button>
                <button type="button" data-lang="py" aria-pressed="false">
                  Python
                </button>
              </div>
            </div>
          </div>

          <div className="question-nav">
            <button type="button" id="prevQuestionBtn">
              ← Previous
            </button>
            <span className="question-nav-progress" id="questionProgress" />
            <button type="button" id="nextQuestionBtn">
              Next →
            </button>
          </div>

          <div className="content">
            <div className="intro">
              <h1>2D Dynamic Programming, basic to medium</h1>
              <p>
                Five questions where the answer for a pair of positions{" "}
                <code>(i, j)</code> depends on a handful of neighboring cells —
                a grid to walk across, or two sequences to compare index by
                index. Each brute-force version re-derives every cell through
                plain recursion; each optimal version fills a 2D table once,
                reusing every answer it already computed.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Brute force (naive recursion)
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={
                      {
                        background: "hsl(var(--primary))",
                      } as React.CSSProperties
                    }
                  ></span>
                  Optimal (tabulation)
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Unique Paths</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                A robot starts at the top-left corner of an <code>m × n</code>{" "}
                grid and can only move right or down. How many unique paths are
                there to the bottom-right corner?
              </p>
              <div className="example">Input: m = 3, n = 3 Output: 6</div>

              <DPGridVisualizer
                title="Unique Paths"
                approaches={uniquePathsApproaches}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q1-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Time: <b>O(2^(m+n))</b> · Space: <b>O(m+n)</b> call stack —
                    try moving right or down from every cell
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int uniquePaths(int r, int c, int rows, int cols) {
    if (r == rows - 1 && c == cols - 1) return 1;
    if (r >= rows || c >= cols) return 0;
    return uniquePaths(r + 1, c, rows, cols) + uniquePaths(r, c + 1, rows, cols);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def unique_paths(r, c, rows, cols):
    if r == rows - 1 and c == cols - 1:
        return 1
    if r >= rows or c >= cols:
        return 0
    return unique_paths(r + 1, c, rows, cols) + unique_paths(r, c + 1, rows, cols)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(m×n)</b> · Space: <b>O(m×n)</b> — dp[r][c] =
                    dp[r-1][c] + dp[r][c-1], filled row by row
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int uniquePaths(int rows, int cols) {
    int[][] dp = new int[rows][cols];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            dp[r][c] = (r == 0 || c == 0) ? 1 : dp[r - 1][c] + dp[r][c - 1];
        }
    }
    return dp[rows - 1][cols - 1];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def unique_paths(rows, cols):
    dp = [[1] * cols for _ in range(rows)]
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[rows - 1][cols - 1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you handle
                obstacles in the grid that the robot can't pass through?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Minimum Path Sum</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a grid filled with non-negative numbers, find a path from
                top-left to bottom-right that minimizes the sum of all numbers
                along it, moving only right or down.
              </p>
              <div className="example">
                Input: grid = [[1,3,1],[1,5,1],[4,2,1]] Output: 7
              </div>

              <DPGridVisualizer
                title="Minimum Path Sum"
                approaches={minimumPathSumApproaches}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q2-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q2-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(2^(m+n))</b> · Space: <b>O(m+n)</b> call stack —
                    try every right/down path, keep the cheapest
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int minPath(int[][] grid, int r, int c) {
    int rows = grid.length, cols = grid[0].length;
    if (r == rows - 1 && c == cols - 1) return grid[r][c];
    if (r >= rows || c >= cols) return Integer.MAX_VALUE / 2;
    return grid[r][c] + Math.min(minPath(grid, r + 1, c), minPath(grid, r, c + 1));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def min_path(grid, r, c):
    rows, cols = len(grid), len(grid[0])
    if r == rows - 1 and c == cols - 1:
        return grid[r][c]
    if r >= rows or c >= cols:
        return float("inf")
    return grid[r][c] + min(min_path(grid, r + 1, c), min_path(grid, r, c + 1))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(m×n)</b> · Space: <b>O(m×n)</b> — dp[r][c] =
                    cost[r][c] + min(dp[r-1][c], dp[r][c-1])
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int minPathSum(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int[][] dp = new int[rows][cols];
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (r == 0 && c == 0) dp[r][c] = grid[r][c];
            else if (r == 0) dp[r][c] = grid[r][c] + dp[r][c - 1];
            else if (c == 0) dp[r][c] = grid[r][c] + dp[r - 1][c];
            else dp[r][c] = grid[r][c] + Math.min(dp[r - 1][c], dp[r][c - 1]);
        }
    }
    return dp[rows - 1][cols - 1];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def min_path_sum(grid):
    rows, cols = len(grid), len(grid[0])
    dp = [[0] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            if r == 0 and c == 0:
                dp[r][c] = grid[r][c]
            elif r == 0:
                dp[r][c] = grid[r][c] + dp[r][c - 1]
            elif c == 0:
                dp[r][c] = grid[r][c] + dp[r - 1][c]
            else:
                dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])
    return dp[rows - 1][cols - 1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Could you solve this with
                only O(cols) extra space instead of a full 2D table?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Longest Common Subsequence</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given two strings, return the length of their longest common
                subsequence (not necessarily contiguous, but in order).
              </p>
              <div className="example">
                Input: a = "ABCBDAB", b = "BDCABA" Output: 4 ("BCBA")
              </div>

              <DPGridVisualizer
                title="Longest Common Subsequence"
                approaches={longestCommonSubsequenceApproaches}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q3-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q3-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q3-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(2^(m+n))</b> · Space: <b>O(m+n)</b> call stack —
                    match characters or skip from either prefix
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int lcs(String a, String b, int i, int j) {
    if (i == 0 || j == 0) return 0;
    if (a.charAt(i - 1) == b.charAt(j - 1)) return 1 + lcs(a, b, i - 1, j - 1);
    return Math.max(lcs(a, b, i - 1, j), lcs(a, b, i, j - 1));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def lcs(a, b, i, j):
    if i == 0 or j == 0:
        return 0
    if a[i - 1] == b[j - 1]:
        return 1 + lcs(a, b, i - 1, j - 1)
    return max(lcs(a, b, i - 1, j), lcs(a, b, i, j - 1))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(m×n)</b> · Space: <b>O(m×n)</b> — dp[i][j] = LCS
                    length of a[0:i] and b[0:j], filled top to bottom using the
                    top, left, and diagonal cells
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
                ? 1 + dp[i - 1][j - 1]   // diagonal
                : Math.max(dp[i - 1][j], dp[i][j - 1]); // top vs left
        }
    }
    return dp[m][n];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]       # diagonal
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  # top vs left
    return dp[m][n]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you reconstruct the
                actual subsequence string, not just its length?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Edit Distance</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given two strings, return the minimum number of insert, delete,
                or replace operations to convert one into the other.
              </p>
              <div className="example">
                Input: a = "horse", b = "ros" Output: 3
              </div>

              <DPGridVisualizer
                title="Edit Distance"
                approaches={editDistanceApproaches}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q4-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q4-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q4-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(3^(m+n))</b> · Space: <b>O(m+n)</b> call stack —
                    try insert, delete, or replace at every mismatch
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int dist(String a, String b, int i, int j) {
    if (i == 0) return j;
    if (j == 0) return i;
    if (a.charAt(i - 1) == b.charAt(j - 1)) return dist(a, b, i - 1, j - 1);
    return 1 + Math.min(
        Math.min(dist(a, b, i - 1, j), dist(a, b, i, j - 1)),
        dist(a, b, i - 1, j - 1)
    );
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def dist(a, b, i, j):
    if i == 0:
        return j
    if j == 0:
        return i
    if a[i - 1] == b[j - 1]:
        return dist(a, b, i - 1, j - 1)
    return 1 + min(dist(a, b, i - 1, j), dist(a, b, i, j - 1), dist(a, b, i - 1, j - 1))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(m×n)</b> · Space: <b>O(m×n)</b> — dp[i][j] =
                    edits to turn a[0:i] into b[0:j], filled top to bottom using
                    the top, left, and diagonal cells
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int minDistance(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
                ? dp[i - 1][j - 1]  // diagonal, no edit
                : 1 + Math.min(Math.min(dp[i - 1][j], dp[i][j - 1]), dp[i - 1][j - 1]); // top, left, diagonal
        }
    }
    return dp[m][n];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def min_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(m + 1):
        dp[i][0] = i
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]      # diagonal, no edit
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])  # top, left, diagonal
    return dp[m][n]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you change the
                recurrence if insert/delete/replace each had different costs?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>0/1 Knapsack</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given item weights and values and a knapsack capacity, choose a
                subset of items (each used at most once) that maximizes total
                value without exceeding the capacity.
              </p>
              <div className="example">
                Input: weights = [1,3,4,5], values = [1,4,5,7], capacity = 7
                Output: 9
              </div>

              <DPGridVisualizer
                title="0/1 Knapsack"
                approaches={knapsackApproaches}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q5-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q5-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q5-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q5-brute">
                  <div className="complexity">
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack — try
                    including or excluding every item
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int knap(int[] w, int[] v, int i, int cap) {
    if (i == 0 || cap == 0) return 0;
    int item = i - 1;
    if (w[item] > cap) return knap(w, v, i - 1, cap);
    return Math.max(
        knap(w, v, i - 1, cap),
        v[item] + knap(w, v, i - 1, cap - w[item])
    );
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def knap(w, v, i, cap):
    if i == 0 or cap == 0:
        return 0
    item = i - 1
    if w[item] > cap:
        return knap(w, v, i - 1, cap)
    return max(knap(w, v, i - 1, cap), v[item] + knap(w, v, i - 1, cap - w[item]))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n×capacity)</b> · Space: <b>O(n×capacity)</b> —
                    dp[i][c] = best value using the first i items within
                    capacity c, filled top to bottom using the top and diagonal
                    cells
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int knapsack(int[] w, int[] v, int capacity) {
    int n = w.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        int item = i - 1;
        for (int c = 0; c <= capacity; c++) {
            dp[i][c] = dp[i - 1][c]; // top: exclude item
            if (w[item] <= c) {
                dp[i][c] = Math.max(dp[i][c], v[item] + dp[i - 1][c - w[item]]); // diagonal: include item
            }
        }
    }
    return dp[n][capacity];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def knapsack(w, v, capacity):
    n = len(w)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        item = i - 1
        for c in range(capacity + 1):
            dp[i][c] = dp[i - 1][c]  # top: exclude item
            if w[item] <= c:
                dp[i][c] = max(dp[i][c], v[item] + dp[i - 1][c - w[item]])  # diagonal: include item
    return dp[n][capacity]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How does the recurrence
                change for the "unbounded knapsack" where each item can be used
                any number of times?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
