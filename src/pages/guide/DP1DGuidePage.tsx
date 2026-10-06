import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  coinChangeApproaches,
  decodeWaysApproaches,
  houseRobberApproaches,
  longestIncreasingSubsequenceApproaches,
  maximumSubarrayApproaches,
} from "../../components/guide/dp1DVisualizations";

export default function DP1DGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">1D Dynamic Programming</div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · House Robber
            </a>
            <a className="side-link" href="#q2">
              02 · Maximum Subarray
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q3">
              03 · Coin Change
            </a>
            <a className="side-link" href="#q4">
              04 · Longest Increasing Subsequence
            </a>
            <a className="side-link" href="#q5">
              05 · Decode Ways
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">1D DP</span>
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
              <h1>1D Dynamic Programming, basic to medium</h1>
              <p>
                Five questions where the answer for position <code>i</code>{" "}
                depends only on a handful of earlier positions. Each brute-force
                version re-derives every subproblem from scratch through plain
                recursion; each optimal version fills a 1D table once, left to
                right, reusing every answer it already computed.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Brute force (naive recursion)
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Optimal (tabulation)
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>House Robber</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array of non-negative integers representing money in
                houses along a street, find the maximum amount you can rob
                without robbing two adjacent houses.
              </p>
              <div className="example">
                Input: nums = [2, 7, 9, 3, 1] Output: 12
              </div>

              <AlgoVisualizer
                title="House Robber"
                approaches={houseRobberApproaches}
                defaultInput={[2, 7, 9, 3, 1]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button className="tab-btn brute active" data-target="q1-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack — try
                    robbing or skipping every house
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int rob(int[] nums, int i) {
    if (i < 0) return 0;
    return Math.max(rob(nums, i - 1), nums[i] + rob(nums, i - 2));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def rob(nums, i):
    if i < 0:
        return 0
    return max(rob(nums, i - 1), nums[i] + rob(nums, i - 2))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — fill dp[i] left to
                    right, each house computed once
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    return dp[n - 1];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def rob(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    dp = [0] * n
    dp[0], dp[1] = nums[0], max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
    return dp[-1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would the recurrence
                change if the houses were arranged in a circle (the first and
                last house are now adjacent)?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Maximum Subarray</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an integer array, find the contiguous subarray (of any
                length, at least one element) with the largest sum.
              </p>
              <div className="example">
                Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] Output: 6 ([4,
                -1, 2, 1])
              </div>

              <AlgoVisualizer
                title="Maximum Subarray"
                approaches={maximumSubarrayApproaches}
                defaultInput={[-2, 1, -3, 4, -1, 2, 1, -5, 4]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button className="tab-btn brute active" data-target="q2-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q2-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — sum every
                    possible subarray
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int maxSubArray(int[] nums) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            best = Math.max(best, sum);
        }
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def max_sub_array(nums):
    best = float("-inf")
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            best = max(best, total)
    return best`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — Kadane's
                    algorithm, one running best-ending-here value
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def max_sub_array(nums):
    cur = best = nums[0]
    for n in nums[1:]:
        cur = max(n, cur + n)
        best = max(best, cur)
    return best`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you also return
                the start and end indices of the best subarray, not just its
                sum?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Coin Change</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given coin denominations and a target amount, return the
                fewest number of coins needed to make that amount, or{" "}
                <code>-1</code> if it's impossible.
              </p>
              <div className="example">
                Input: coins = [1, 2, 5], amount = 11 Output: 3 (5 + 5 + 1)
              </div>

              <AlgoVisualizer
                title="Coin Change"
                approaches={coinChangeApproaches}
                defaultInput={[11]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q3-approach">
                  <button className="tab-btn brute active" data-target="q3-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q3-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(coins^amount)</b> · Space: <b>O(amount)</b>{" "}
                    call stack — try every coin at every remaining amount
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int coinChange(int[] coins, int amount) {
    if (amount == 0) return 0;
    if (amount < 0) return Integer.MAX_VALUE / 2;
    int best = Integer.MAX_VALUE / 2;
    for (int c : coins) {
        best = Math.min(best, 1 + coinChange(coins, amount - c));
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def coin_change(coins, amount):
    if amount == 0:
        return 0
    if amount < 0:
        return float("inf")
    return min(1 + coin_change(coins, amount - c) for c in coins)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(amount × coins)</b> · Space: <b>O(amount)</b> —
                    fill dp[0..amount] once, bottom-up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE / 2);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (a - c >= 0) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] >= Integer.MAX_VALUE / 2 ? -1 : dp[amount];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def coin_change(coins, amount):
    dp = [0] + [float("inf")] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float("inf") else -1`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you change this
                to count the <i>number of distinct ways</i> to make the
                amount, instead of the minimum coins?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Longest Increasing Subsequence</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an integer array, return the length of the longest
                strictly increasing subsequence.
              </p>
              <div className="example">
                Input: nums = [10, 9, 2, 5, 3, 7, 101, 18] Output: 4 ([2, 3, 7,
                101])
              </div>

              <AlgoVisualizer
                title="Longest Increasing Subsequence"
                approaches={longestIncreasingSubsequenceApproaches}
                defaultInput={[10, 9, 2, 5, 3, 7, 101, 18]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q4-approach">
                  <button className="tab-btn brute active" data-target="q4-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q4-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack —
                    every element either extends the subsequence or is
                    skipped
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int lis(int[] nums, int i, int prev) {
    if (i == nums.length) return 0;
    int skip = lis(nums, i + 1, prev);
    int take = 0;
    if (prev == -1 || nums[i] > nums[prev]) {
        take = 1 + lis(nums, i + 1, i);
    }
    return Math.max(skip, take);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def lis(nums, i, prev):
    if i == len(nums):
        return 0
    skip = lis(nums, i + 1, prev)
    take = 0
    if prev == -1 or nums[i] > nums[prev]:
        take = 1 + lis(nums, i + 1, i)
    return max(skip, take)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — dp[i] = length
                    of the longest increasing subsequence ending at i
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int best = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def length_of_lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> This O(n²) can be improved
                to O(n log n) using binary search on a "tails" array — why
                does that trick work?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Decode Ways</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                A string of digits can be decoded into letters (A=1 ... Z=26).
                Given an encoded string, count the number of ways it can be
                decoded.
              </p>
              <div className="example">
                Input: s = "226" Output: 3 ("BZ", "VF", "BBF")
              </div>

              <AlgoVisualizer
                title="Decode Ways"
                approaches={decodeWaysApproaches}
                defaultInput={"226"}
                inputKind="string"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q5-approach">
                  <button className="tab-btn brute active" data-target="q5-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q5-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q5-brute">
                  <div className="complexity">
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack —
                    branch on every 1-digit or 2-digit decode choice
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int numDecodings(String s, int i) {
    if (i == s.length()) return 1;
    if (s.charAt(i) == '0') return 0;
    int ways = numDecodings(s, i + 1);
    if (i + 1 < s.length() && Integer.parseInt(s.substring(i, i + 2)) <= 26) {
        ways += numDecodings(s, i + 2);
    }
    return ways;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def num_decodings(s, i):
    if i == len(s):
        return 1
    if s[i] == "0":
        return 0
    ways = num_decodings(s, i + 1)
    if i + 1 < len(s) and int(s[i:i + 2]) <= 26:
        ways += num_decodings(s, i + 2)
    return ways`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — dp[i] = number of
                    ways to decode the first i characters
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        if (s.charAt(i - 1) != '0') dp[i] += dp[i - 1];
        int two = Integer.parseInt(s.substring(i - 2, i));
        if (two >= 10 && two <= 26) dp[i] += dp[i - 2];
    }
    return dp[n];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def num_decodings(s):
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1 if s[0] != "0" else 0
    for i in range(2, n + 1):
        if s[i - 1] != "0":
            dp[i] += dp[i - 1]
        two = int(s[i - 2:i])
        if 10 <= two <= 26:
            dp[i] += dp[i - 2]
    return dp[n]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would the recurrence
                change if the string could also contain the wildcard
                character <code>*</code> (meaning any digit 1-9)?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
