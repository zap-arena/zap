import type React from "react";
import Navbar from "../../components/Navbar";
import PatternRecognitionVisualizer from "../../components/guide/PatternRecognitionVisualizer";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import { isTriviaFeatureEnabled } from "../../config/features";

export default function PatternRecognitionGuidePage() {
  useGuideLogic();
  const showTrivia = isTriviaFeatureEnabled();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Pattern Recognition navigation">
          <div className="sidebar-title flex items-center gap-2">
            <span>Finding Nemo&apos;s Patterns</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
              Interactive Course
            </span>
          </div>

          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#toolkit">
              00 · The Finding Nemo Mindset
            </a>
            <a className="side-link" href="#visualizer">
              ⚡ Interactive Sonar Compass
            </a>
          </div>

          <div className="side-group">
            <div className="side-group-label">The 4-Step Pipeline</div>
            <a className="side-link" href="#q1">
              01 · Step 1: Constraint Depth (N)
            </a>
            <a className="side-link" href="#q2">
              02 · Step 2: Input Structure Radar
            </a>
            <a className="side-link" href="#q3">
              03 · Step 3: Output Format Decoder
            </a>
            <a className="side-link" href="#q4">
              04 · Step 4: 13 Trigger Keywords
            </a>
          </div>

          <div className="side-group">
            <div className="side-group-label">Case Studies (500 Problems Later)</div>
            <a className="side-link" href="#q5">
              05 · Case 1: Word Break (DP / Trie)
            </a>
            <a className="side-link" href="#q6">
              06 · Case 2: Daily Temperatures (Mono-Stack)
            </a>
            <a className="side-link" href="#q7">
              07 · Case 3: Koko Bananas (BS on Answer)
            </a>
          </div>

          {showTrivia && (
            <div className="side-group">
              <div className="side-group-label">Interactive Challenge</div>
              <a className="side-link text-amber-400" href="#trivia-quest">
                🫧 Nemo&apos;s Coral Trivia Quest
              </a>
            </div>
          )}
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Interactive Course: Pattern Recognition</span>
              <span className="sub">
                Finding Nemo Edition · The 4-Step Decision Pipeline
              </span>
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
            {/* Header / Intro */}
            <div className="intro">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                <span>🐠 Based on Bitflip&apos;s 500-Problem Video Guide</span>
              </div>
              <h1>How to Instantly Recognize LeetCode Patterns</h1>
              <p>
                When you start LeetCode, every problem feels like an impossible riddle requiring a custom, divine trick.
                500 problems later, you realize there are only <strong>15 to 20 core patterns</strong> wrapped in different stories.
                You don&apos;t need to memorize hundreds of problems—you just need the <strong>4-Step Mental Sonar</strong>:
                Constraints → Input Radar → Output Decoder → Keyword Lexicon.
              </p>

              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "#06b6d4" } as React.CSSProperties}
                  />
                  Step 1: Constraints (N)
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "#3b82f6" } as React.CSSProperties}
                  />
                  Step 2: Input Structure
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "#8b5cf6" } as React.CSSProperties}
                  />
                  Step 3: Output Format
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "#10b981" } as React.CSSProperties}
                  />
                  Step 4: Trigger Keywords
                </span>
              </div>
            </div>

            {/* Section 0: The Finding Nemo Mindset */}
            <section className="question" id="toolkit">
              <div className="q-head">
                <span className="q-index">00</span>
                <h2>The Finding Nemo Mindset: Marlin vs. Dory vs. Crush</h2>
                <span className="level-badge reference">Pedagogy</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Think of the 3,000+ problems on LeetCode as the vast Pacific Ocean. Nemo is lost somewhere near Sydney Harbor, and your job is to find the optimal path without drowning in exponential time.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="text-2xl mb-1">🐡</div>
                    <div className="font-bold text-foreground">
                      Marlin: The Anxious Brute-Forcer
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Marlin inspects every single grain of sand ($O(2^N)$ or $O(N^2)$). He burns through all his oxygen, hits Time Limit Exceeded (TLE), and panics in interviews.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="text-2xl mb-1">🐟</div>
                    <div className="font-bold text-foreground">
                      Dory: The DP Memoizer
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Dory suffers from short-term memory loss! If she solves a subproblem, she must write it in her memoization notebook so she never recomputes it twice ($O(N)$).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="text-2xl mb-1">🐢</div>
                    <div className="font-bold text-foreground">
                      Crush: Surfing the EAC
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Crush rides the East Australian Current. When $N = 10^9$, he cuts the search space in half with every barrel roll using Binary Search ($O(\log N)$).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs space-y-2">
                  <div className="font-bold text-cyan-300">
                    💡 The 4-Beat Story of Mastery:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li><strong>The Disaster:</strong> You open a Medium problem, code a nested loop, and get slapped with a TLE.</li>
                    <li><strong>The Trap:</strong> You try to remember the exact LeetCode problem ID or memorize solutions like trivia.</li>
                    <li><strong>The Epiphany:</strong> The problem statement is secretly giving you the algorithm through its constraints and keywords!</li>
                    <li><strong>The Blueprint:</strong> The 4-step pipeline below decodes any problem in under 10 seconds.</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Section: The Interactive Visualizer */}
            <section className="question" id="visualizer">
              <div className="q-head">
                <span className="q-index">⚡</span>
                <h2>Interactive 4-Step Sonar &amp; Scanner</h2>
                <span className="level-badge active">Interactive Simulator</span>
              </div>

              <p className="prompt">
                Use the interactive console below to experiment with the constraint depth gauge, inspect input/output data structure rules, search the trigger lexicon, and test your skills in Nemo&apos;s Trivia Quest:
              </p>

              <PatternRecognitionVisualizer />
            </section>

            {/* Section 1: Constraints (N) */}
            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Step 1: Check The Constraints (The Silent Gatekeeper)</h2>
                <span className="level-badge basic">Core Rule</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  In competitive programming and technical interviews, servers can perform roughly <strong>$10^8$ basic operations per second</strong>.
                  Before reading the problem narrative, glance down at the input size $N$. It immediately tells you what algorithms are physically capable of passing.
                </p>

                <div className="overflow-x-auto my-4 border border-border rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted text-foreground border-b border-border">
                        <th className="p-3 font-bold">Constraint (N)</th>
                        <th className="p-3 font-bold">Max Allowed Complexity</th>
                        <th className="p-3 font-bold">Viable Patterns</th>
                        <th className="p-3 font-bold">Forbidden (TLE!)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3 font-mono font-bold text-cyan-400">N ≤ 20</td>
                        <td className="p-3 font-mono">O(2^N) or O(N!)</td>
                        <td className="p-3">Backtracking, Recursion, Bitmask DP, Subsets</td>
                        <td className="p-3 text-rose-400">Overthinking / Complex Trees</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-blue-400">10^3 ≤ N ≤ 10^5</td>
                        <td className="p-3 font-mono">O(N) or O(N log N)</td>
                        <td className="p-3">Sliding Window, Two Pointers, Heaps, HashMaps, 1D DP</td>
                        <td className="p-3 text-rose-400">O(N²) Nested Loops (10¹⁰ ops!)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-400">N ≥ 10^7 or 10^9</td>
                        <td className="p-3 font-mono">O(log N) or O(1)</td>
                        <td className="p-3">Binary Search on Answer, Closed Math, Bitwise ops</td>
                        <td className="p-3 text-rose-400">Any O(N) Loop (Takes 10+ seconds!)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border">
                  <h4 className="font-bold text-foreground text-sm mb-2">
                    Why Marlin got trapped:
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    If $N = 10^5$, writing <code>for i in range(n): for j in range(i, n):</code> generates $5 \times 10^9$ operations.
                    At $10^8$ ops/sec, your solution will run for <strong>50 seconds</strong>. The judge kills your code after 1.0 second.
                    The moment you see $N = 10^5$, eliminate all nested loop solutions immediately!
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Input Structure Radar */}
            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Step 2: Analyze Input Format (The Data Radar)</h2>
                <span className="level-badge basic">Core Rule</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  The input data structure dictates how your code moves through memory. Each data format maps directly to specific algorithmic maneuvers:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>🌳 Tree / BST</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      <li><strong>DFS / Recursion:</strong> Finding maximum path, diameter, or checking properties.</li>
                      <li><strong>BFS / Queue:</strong> Level-order traversal or shortest distance in unweighted tree.</li>
                      <li><strong>BST In-Order:</strong> Strictly sorted order (validation, Kth smallest).</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>🕸️ Graph (Nodes &amp; Edges)</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      <li><strong>BFS:</strong> Shortest path in unweighted graphs (Word Ladder).</li>
                      <li><strong>DFS:</strong> Connected components, cycle detection, path exploration.</li>
                      <li><strong>Union-Find:</strong> Dynamic connectivity, redundant connections.</li>
                      <li><strong>Topological Sort:</strong> Course scheduling, task dependency ordering.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>🗺️ 2D Grid / Matrix</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      <li><strong>DFS / BFS Flood Fill:</strong> Number of Islands, Rotten Oranges.</li>
                      <li><strong>2D DP:</strong> Unique Paths, Minimum Path Sum (depends on top &amp; left).</li>
                      <li><strong>Bounds check:</strong> Always verify <code>0 &lt;= r &lt; R &amp;&amp; 0 &lt;= c &lt; C</code>.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-2">
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>📊 Sorted Array</span>
                    </div>
                    <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                      <li><strong>Two Pointers:</strong> Left &amp; Right converging (Two Sum II, 3Sum).</li>
                      <li><strong>Binary Search:</strong> Exact target lookup in $O(\log N)$.</li>
                      <li><strong>Greedy:</strong> Interval scheduling by start or end time.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Output Format Decoder */}
            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Step 3: Analyze Output Format (The Decoder)</h2>
                <span className="level-badge medium">Decision Logic</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Most developers forget to check what the function actually returns! The return signature is one of the strongest clues on LeetCode:
                </p>

                <div className="space-y-3 my-4">
                  <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        Returns: <code>List&lt;List&lt;Integer&gt;&gt;</code> or <code>List&lt;List&lt;String&gt;&gt;</code>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Generating all subsets, combinations, permutations, or paths.
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
                      🎯 Backtracking (95% of cases)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        Returns: <code>int</code> (Single Number: Max Profit, Min Cost, Number of Ways)
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Finding an optimum among combinatorial choices.
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                      🎯 Dynamic Programming or Greedy
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        Returns: <code>void</code> (In-place array / string modification with O(1) memory)
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Remove duplicates, move zeroes, sort colors in-place.
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                      🎯 Two Pointers (Read &amp; Write)
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-foreground text-sm">
                        Returns: <code>int[]</code> (Order sequence respecting prerequisites)
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Valid task schedule, course schedule, alien dictionary order.
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      🎯 Topological Sort or Priority Queue
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: 13 Trigger Keywords */}
            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Step 4: The 13 Trigger Keywords Radar</h2>
                <span className="level-badge medium">Pattern Reflex</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Experienced interview candidates develop instant keyword reflexes. When these specific words appear in a prompt, their subconscious immediately selects the pattern template:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
                  {[
                    { trigger: "Contiguous subarray / substring", pattern: "Sliding Window", icon: "🪟" },
                    { trigger: "Sorted array + find pair", pattern: "Two Pointers", icon: "👉👈" },
                    { trigger: "Next greater element / Daily temp", pattern: "Monotonic Stack", icon: "🥞" },
                    { trigger: "Top K elements / Running median", pattern: "Min/Max Heap", icon: "⛰️" },
                    { trigger: "Minimize the maximum / Capacity", pattern: "Binary Search on Answer", icon: "🎯" },
                    { trigger: "Number of ways / Max profit", pattern: "Dynamic Programming", icon: "🧠" },
                    { trigger: "Connected components / groups", pattern: "Union-Find (DSU)", icon: "🤝" },
                    { trigger: "Word dictionary prefix search", pattern: "Trie (Prefix Tree)", icon: "🔤" },
                    { trigger: "All possible permutations/subsets", pattern: "Backtracking", icon: "🌲" },
                  ].map((kw) => (
                    <div key={kw.trigger} className="p-3.5 rounded-xl bg-card border border-border">
                      <div className="text-xl mb-1">{kw.icon}</div>
                      <div className="text-xs font-bold text-foreground">
                        &ldquo;{kw.trigger}&rdquo;
                      </div>
                      <div className="text-xs font-semibold text-cyan-400 mt-1">
                        → {kw.pattern}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: Case Study 1 */}
            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Case Study 1: Word Break (LeetCode 139)</h2>
                <span className="level-badge medium">Medium</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong>Prompt:</strong> Given a string <code>s</code> and dictionary of strings <code>wordDict</code>, return <code>true</code> if <code>s</code> can be segmented into a space-separated sequence of dictionary words.
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="font-bold text-foreground">Executing the 4-Step Sonar:</div>
                  <div>1. <strong>Constraints:</strong> <code>s.length &lt;= 300</code>. $O(N^2)$ is only 90,000 operations. Well below $10^8$. Polynomial time is safe.</div>
                  <div>2. <strong>Input:</strong> String + List of Words. Substring slicing with prefix checks.</div>
                  <div>3. <strong>Output:</strong> <code>boolean</code>. Reachability query: can we form the entire word?</div>
                  <div>4. <strong>Trigger:</strong> &ldquo;Can be segmented&rdquo; + overlapping prefix subproblems = <strong>1D Dynamic Programming</strong>.</div>
                </div>

                <div className="code-panel">
                  <div className="code-header">
                    <span>Word Break Blueprint (O(N²) DP)</span>
                  </div>
                  <pre className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto rounded-b-xl">
{`# Python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    words = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True # Base: empty string is valid

    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 6: Case Study 2 */}
            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Case Study 2: Daily Temperatures (LeetCode 739)</h2>
                <span className="level-badge medium">Medium</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong>Prompt:</strong> Given an array of integers <code>temperatures</code>, return an array <code>answer</code> such that <code>answer[i]</code> is the number of days you must wait after the $i$-th day to get a warmer temperature.
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="font-bold text-foreground">Executing the 4-Step Sonar:</div>
                  <div>1. <strong>Constraints:</strong> $N = 10^5$. An $O(N^2)$ brute force is $10^{10}$ ops = <strong>Instant TLE</strong>! Must be $O(N)$.</div>
                  <div>2. <strong>Input:</strong> 1D array of integers.</div>
                  <div>3. <strong>Output:</strong> Array of distances to the next matching element.</div>
                  <div>4. <strong>Trigger:</strong> &ldquo;Next warmer day&rdquo; = <strong>Next Greater Element</strong> = <strong>Monotonic Stack</strong>!</div>
                </div>

                <div className="code-panel">
                  <div className="code-header">
                    <span>Daily Temperatures Blueprint (O(N) Monotonic Stack)</span>
                  </div>
                  <pre className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto rounded-b-xl">
{`// Java
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] ans = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Monotonic stack of indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIdx = stack.pop();
            ans[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    return ans;
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Section 7: Case Study 3 */}
            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Case Study 3: Koko Eating Bananas (LeetCode 875)</h2>
                <span className="level-badge medium">Medium</span>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong>Prompt:</strong> Return the minimum integer speed $K$ such that Koko can eat all piles of bananas within $H$ hours.
                </p>

                <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                  <div className="font-bold text-foreground">Executing the 4-Step Sonar:</div>
                  <div>1. <strong>Constraints:</strong> $H \le 10^9$. We cannot linearly try every speed $1, 2, 3 \dots 10^9$.</div>
                  <div>2. <strong>Input:</strong> Array of piles + hours threshold.</div>
                  <div>3. <strong>Output:</strong> Single minimal integer (speed).</div>
                  <div>4. <strong>Trigger:</strong> &ldquo;Minimum speed to achieve goal&rdquo; with monotonic feasibility (if speed $K$ works, $K+1$ also works) = <strong>Binary Search on Answer</strong>.</div>
                </div>

                <div className="code-panel">
                  <div className="code-header">
                    <span>Koko Eating Bananas Blueprint (O(N log(max_pile)) Binary Search)</span>
                  </div>
                  <pre className="p-4 bg-slate-950 font-mono text-xs text-slate-200 overflow-x-auto rounded-b-xl">
{`# Python
import math

def minEatingSpeed(piles: list[int], h: int) -> int:
    left, right = 1, max(piles)
    
    while left < right:
        mid = (left + right) // 2
        hours_needed = sum(math.ceil(p / mid) for p in piles)
        
        if hours_needed <= h:
            right = mid  # Feasible, try smaller speed
        else:
            left = mid + 1  # Too slow, increase speed
            
    return left`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Gated Trivia Anchor */}
            {showTrivia && (
              <section className="question" id="trivia-quest">
                <div className="q-head">
                  <span className="q-index">🫧</span>
                  <h2>Nemo&apos;s Coral Trivia Quest</h2>
                  <span className="level-badge active">Game Challenge</span>
                </div>
                <p className="prompt">
                  Ready to test your pattern reflexes? Head back to the <strong>⚡ Interactive Sonar Compass</strong> section above and click on the <strong>🫧 Nemo&apos;s Coral Trivia Quest</strong> tab to play the 10-question challenge!
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
