import type React from "react";
import Navbar from "../components/Navbar";

export default function CurriculumDSAPage() {


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container">
        <section className="hero">
          <span className="hero-tag">Complete Course Companion</span>
          <h1 className="hero-title">Master Data Structures & Algorithms</h1>
          <p className="hero-subtitle">
            Interactive problem banks, deep-dive pattern guides, step-by-step
            code walkthroughs in Java & Python, and curated homework problem
            sets.
          </p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-val">13</div>
              <div className="stat-lbl">Core DSA Guides</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">100+</div>
              <div className="stat-lbl">Solved Class Examples</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">15</div>
              <div className="stat-lbl">Extra Homework Problems</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">Java / Py</div>
              <div className="stat-lbl">Dual Implementations</div>
            </div>
          </div>
        </section>

        <section id="modules">
          <div className="section-header">
            <h2 className="section-title">📚 Course Modules & Topic Guides</h2>
            <p className="section-desc">
              Select a module to view complete visual explanations, step-by-step
              walkthroughs, and code templates.
            </p>
          </div>

          <div className="materials-grid">
            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🔑</div>
                  <span className="module-badge">8 Core Problems</span>
                </div>
                <h3 className="module-title">Hashing & Hash Tables</h3>
                <p className="module-desc">
                  Master constant-time lookups, frequency counting, prefix sums
                  with hash maps, and index tracking techniques.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Two Sum</li>
                  <li className="topic-tag">Group Anagrams</li>
                  <li className="topic-tag">Top K Frequent</li>
                  <li className="topic-tag">Subarray Sum = K</li>
                  <li className="topic-tag">Longest Consecutive</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/hashing" className="btn-open">
                <span>Explore Hashing Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🪟</div>
                  <span className="module-badge">10 Core Problems</span>
                </div>
                <h3 className="module-title">Sliding Window Pattern</h3>
                <p className="module-desc">
                  Learn fixed and dynamic window techniques to solve subarray &
                  substring optimal length problems efficiently.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Max Sum Subarray</li>
                  <li className="topic-tag">Min Size Subarray</li>
                  <li className="topic-tag">Longest Substring</li>
                  <li className="topic-tag">Min Window Substring</li>
                  <li className="topic-tag">Fruit Into Baskets</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/sliding-window" className="btn-open">
                <span>Explore Sliding Window Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">👉👈</div>
                  <span className="module-badge">13 Core Problems</span>
                </div>
                <h3 className="module-title">Two Pointer Algorithms</h3>
                <p className="module-desc">
                  Utilize converging pointers, fast/slow pointers, and boundary
                  partitioning on sorted or linear collections.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Two Sum II</li>
                  <li className="topic-tag">Container Most Water</li>
                  <li className="topic-tag">3Sum</li>
                  <li className="topic-tag">Trapping Rain Water</li>
                  <li className="topic-tag">Sort Colors</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/two-pointer" className="btn-open">
                <span>Explore Two Pointers Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🔁</div>
                  <span className="module-badge">8 Core Problems</span>
                </div>
                <h3 className="module-title">Recursion</h3>
                <p className="module-desc">
                  Master base cases, recursive cases, memoization, and
                  in-place recursive techniques — from factorial to
                  permutations.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Fibonacci Number</li>
                  <li className="topic-tag">Power(x, n)</li>
                  <li className="topic-tag">Climbing Stairs</li>
                  <li className="topic-tag">Subsets</li>
                  <li className="topic-tag">Permutations</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/recursion" className="btn-open">
                <span>Explore Recursion Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🧱</div>
                  <span className="module-badge">6 Core Problems</span>
                </div>
                <h3 className="module-title">Stack</h3>
                <p className="module-desc">
                  Master last-in-first-out ordering with monotonic stacks,
                  bracket matching, and O(1) auxiliary tracking.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Valid Parentheses</li>
                  <li className="topic-tag">Next Greater Element</li>
                  <li className="topic-tag">Daily Temperatures</li>
                  <li className="topic-tag">Min Stack</li>
                  <li className="topic-tag">Largest Rectangle</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/stack" className="btn-open">
                <span>Explore Stack Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🚋</div>
                  <span className="module-badge">5 Core Problems</span>
                </div>
                <h3 className="module-title">Queue</h3>
                <p className="module-desc">
                  Master first-in-first-out ordering with circular buffers,
                  monotonic deques, and streaming frequency tracking.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Queue using Stacks</li>
                  <li className="topic-tag">Moving Average</li>
                  <li className="topic-tag">First Unique Character</li>
                  <li className="topic-tag">Sliding Window Maximum</li>
                  <li className="topic-tag">Circular Queue</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/queue" className="btn-open">
                <span>Explore Queue Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🔗</div>
                  <span className="module-badge">6 Core Problems</span>
                </div>
                <h3 className="module-title">Linked List</h3>
                <p className="module-desc">
                  Master pointer manipulation with in-place reversal,
                  slow/fast pointers, and single-pass merging.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Reverse Linked List</li>
                  <li className="topic-tag">Linked List Cycle</li>
                  <li className="topic-tag">Merge Two Sorted Lists</li>
                  <li className="topic-tag">Remove Nth From End</li>
                  <li className="topic-tag">Palindrome Linked List</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/linked-list" className="btn-open">
                <span>Explore Linked List Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">📊</div>
                  <span className="module-badge">5 Core Problems</span>
                </div>
                <h3 className="module-title">1D Dynamic Programming</h3>
                <p className="module-desc">
                  Master tabulation over a single running index — recursion
                  with overlapping subproblems collapsed into a simple array
                  fill.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">House Robber</li>
                  <li className="topic-tag">Maximum Subarray</li>
                  <li className="topic-tag">Coin Change</li>
                  <li className="topic-tag">Longest Increasing Subsequence</li>
                  <li className="topic-tag">Decode Ways</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/dp-1d" className="btn-open">
                <span>Explore 1D DP Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🧮</div>
                  <span className="module-badge">5 Core Problems</span>
                </div>
                <h3 className="module-title">2D Dynamic Programming</h3>
                <p className="module-desc">
                  Master grid-walk and sequence-pair recurrences — two
                  indices, one table, filled once.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Unique Paths</li>
                  <li className="topic-tag">Minimum Path Sum</li>
                  <li className="topic-tag">Longest Common Subsequence</li>
                  <li className="topic-tag">Edit Distance</li>
                  <li className="topic-tag">0/1 Knapsack</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/dp-2d" className="btn-open">
                <span>Explore 2D DP Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">☕</div>
                  <span className="module-badge">12 Topics</span>
                </div>
                <h3 className="module-title">Java OOPs Concepts</h3>
                <p className="module-desc">
                  Master classes, objects, and the four pillars —
                  encapsulation, abstraction, inheritance, and polymorphism —
                  with real-world analogies and diagrams.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Encapsulation</li>
                  <li className="topic-tag">Abstraction</li>
                  <li className="topic-tag">Inheritance Types</li>
                  <li className="topic-tag">Overloading vs Overriding</li>
                  <li className="topic-tag">Access Modifiers</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/oops" className="btn-open">
                <span>Explore Java OOPs Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🧩</div>
                  <span className="module-badge">6 Topics</span>
                </div>
                <h3 className="module-title">OOPs Visual Blueprint</h3>
                <p className="module-desc">
                  A diagram-first companion to Java OOPs — procedural vs
                  OOPs, class/object blueprints, the ATM encapsulation
                  metaphor, and all 5 inheritance types visualized.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">Class vs Object</li>
                  <li className="topic-tag">Encapsulation</li>
                  <li className="topic-tag">Abstraction</li>
                  <li className="topic-tag">5 Inheritance Types</li>
                  <li className="topic-tag">Polymorphism</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/oops-visual" className="btn-open">
                <span>Explore OOPs Visual Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🗄️</div>
                  <span className="module-badge">15 Topics</span>
                </div>
                <h3 className="module-title">SQL Blueprint</h3>
                <p className="module-desc">
                  Master data types, ACID, normalization, joins, keys, and
                  query execution order — everything for SQL interviews.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">ACID Properties</li>
                  <li className="topic-tag">Normalization</li>
                  <li className="topic-tag">SQL Joins</li>
                  <li className="topic-tag">GROUP BY &amp; HAVING</li>
                  <li className="topic-tag">CTEs</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/sql" className="btn-open">
                <span>Explore SQL Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🔁</div>
                  <span className="module-badge">6 Topics</span>
                </div>
                <h3 className="module-title">SDLC Blueprint</h3>
                <p className="module-desc">
                  Master the Software Development Life Cycle — its six
                  phases, and the Waterfall, Agile, V-Model, and Spiral
                  process models.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">6 SDLC Phases</li>
                  <li className="topic-tag">Waterfall Model</li>
                  <li className="topic-tag">Agile Methodology</li>
                  <li className="topic-tag">V-Model</li>
                  <li className="topic-tag">Spiral Model</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/sdlc" className="btn-open">
                <span>Explore SDLC Guide</span>
                <span>→</span>
              </a>
            </div>

            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🤖</div>
                  <span className="module-badge">3 Topics</span>
                </div>
                <h3 className="module-title">AI Basics</h3>
                <p className="module-desc">
                  A quick primer on Artificial Intelligence, Machine Learning, and Deep Learning, including an interactive interview quiz.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">What is AI?</li>
                  <li className="topic-tag">AI vs ML vs DL</li>
                  <li className="topic-tag">Interview Quiz</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/ai-basics" className="btn-open">
                <span>Explore AI Basics</span>
                <span>→</span>
              </a>
            </div>
            <div
              className="module-card"
              style={
                {
                  "--card-accent": "hsl(var(--primary))",
                } as React.CSSProperties
              }
            >
              <div>
                <div className="card-header">
                  <div className="module-icon">🔌</div>
                  <span className="module-badge">8 Topics</span>
                </div>
                <h3 className="module-title">API Basics</h3>
                <p className="module-desc">
                  Understand what APIs are, how REST and GraphQL work, how to connect from the frontend, and how to securely handle API keys.
                </p>
                <ul className="topic-list">
                  <li className="topic-tag">REST APIs</li>
                  <li className="topic-tag">Frontend Fetching</li>
                  <li className="topic-tag">API Security</li>
                  <li className="topic-tag">Webhooks</li>
                  <li className="topic-tag">GraphQL</li>
                </ul>
              </div>
              <a href="/curriculum/dsa/api-basics" className="btn-open">
                <span>Explore API Basics</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </section>

        {/* <section id="homework" className="homework-section">
          <div className="section-header">
            <h2 className="section-title">
              🧠 Additional Homework & Practice Problems
            </h2>
            <p className="section-desc">
              Test your understanding with these supplementary challenges (not
              covered in the main guide walkthroughs). Hints and approach
              breakdowns are provided for each!
            </p>
          </div>

          <div className="filter-bar">
            <button className="filter-btn active" data-filter="all">
              All Homework (15)
            </button>
            <button className="filter-btn" data-filter="hashing">
              Hashing (5)
            </button>
            <button className="filter-btn" data-filter="sliding-window">
              Sliding Window (5)
            </button>
            <button className="filter-btn" data-filter="two-pointers">
              Two Pointers (5)
            </button>
          </div>

          <div className="hw-grid" id="hwContainer">
            <div className="hw-card" data-category="hashing">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">1. 4Sum II</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Hashing</span>
                </div>
              </div>
              <p className="hw-statement">
                Given four integer arrays <code>nums1</code>, <code>nums2</code>
                , <code>nums3</code>, and <code>nums4</code> of length{" "}
                <code>n</code>, return the number of tuples{" "}
                <code>(i, j, k, l)</code> such that{" "}
                <code>nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0</code>.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums1 = [1,2], nums2 = [-2,-1], nums3 =
                [-1,2], nums4 = [0,2]
                <span>Output:</span> 2<span>Explanation:</span> (0, 0, 0, 1)
                -&gt; 1 + (-2) + (-1) + 2 = 0 & (1, 1, 0, 0) -&gt; 2 + (-1) +
                (-1) + 0 = 0
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw1");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw1");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/4sum-ii/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw1" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Instead of iterating over all 4 arrays in O(N⁴), split them
                  into two pairs! Compute all possible sums of{" "}
                  <code>nums1[i] + nums2[j]</code> and store their frequencies
                  in a Hash Map.
                </p>
              </div>
              <div id="appr-hw1" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. Store frequency of <code>(a + b)</code> for all{" "}
                  <code>a ∈ nums1, b ∈ nums2</code> in a HashMap.
                  <br />
                  2. Iterate through <code>c ∈ nums3, d ∈ nums4</code> and check
                  if <code>-(c + d)</code> exists in the map. Add its frequency
                  to total count.
                  <br />
                  <strong>Time Complexity:</strong> O(N²)
                  <br />
                  <strong>Space Complexity:</strong> O(N²)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="hashing">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">2. Subarray Sums Divisible by K</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Hashing & Prefix Sum</span>
                </div>
              </div>
              <p className="hw-statement">
                Given an integer array <code>nums</code> and an integer{" "}
                <code>k</code>, return the number of non-empty subarrays that
                have a sum divisible by <code>k</code>.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [4,5,0,-2,-3,1], k = 5
                <span>Output:</span> 7<span>Explanation:</span> There are 7
                subarrays with sum divisible by 5 (e.g., [4, 5, 0, -2, -3, 1]
                sum=5, [5] sum=5, [5, 0] sum=5, etc.).
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw2");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw2");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/subarray-sums-divisible-by-k/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw2" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  If two prefix sums have the same remainder when divided by{" "}
                  <code>k</code>, the subarray between them is divisible by{" "}
                  <code>k</code>. Be careful with negative remainders (add{" "}
                  <code>k</code> if remainder &lt; 0).
                </p>
              </div>
              <div id="appr-hw2" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. Keep a running prefix sum.
                  <br />
                  2. Calculate <code>rem = (prefixSum % k + k) % k</code>.<br />
                  3. Maintain a remainder frequency map. If <code>rem</code> was
                  seen before, add frequency to result.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(K)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="hashing">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">3. Insert Delete GetRandom O(1)</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">
                    Hashing & Dynamic Array
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Implement the <code>RandomizedSet</code> class supporting{" "}
                <code>insert(val)</code>, <code>remove(val)</code>, and{" "}
                <code>getRandom()</code> in average <code>O(1)</code> time
                complexity.
              </p>
              <div className="hw-example">
                <span>Operations:</span> insert(1), remove(2), insert(2),
                getRandom(), remove(1), insert(2), getRandom()
                <span>Returns:</span> true, false, true, 1 or 2, true, false, 2
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw3");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw3");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/insert-delete-getrandom-o1/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw3" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  HashMaps provide O(1) lookup/deletion, but cannot pick a
                  random element in O(1). Combine a HashMap (val -&gt; index)
                  with a dynamic Array (list of values). To delete in O(1), swap
                  target with last element in array!
                </p>
              </div>
              <div id="appr-hw3" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. <code>insert(val)</code>: Append val to array end, store
                  its index in map.
                  <br />
                  2. <code>remove(val)</code>: Look up index in map, copy last
                  array element into this index, pop last array element, update
                  map.
                  <br />
                  3. <code>getRandom()</code>: Pick random index{" "}
                  <code>rand() % list.size()</code>.<br />
                  <strong>Time Complexity:</strong> O(1) average for all ops
                  <br />
                  <strong>Space Complexity:</strong> O(N)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="hashing">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">4. Isomorphic Strings</h3>
                  <span className="badge-diff diff-easy">Easy</span>
                  <span className="hw-topic-badge">
                    Hashing & Character Mapping
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Given two strings <code>s</code> and <code>t</code>, determine
                if they are isomorphic. Two strings are isomorphic if the
                characters in <code>s</code> can be replaced to get{" "}
                <code>t</code> while preserving character order and 1-to-1
                mapping.
              </p>
              <div className="hw-example">
                <span>Input:</span> s = "egg", t = "add" -&gt;{" "}
                <span>Output:</span> true
                <span>Input:</span> s = "foo", t = "bar" -&gt;{" "}
                <span>Output:</span> false
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw4");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw4");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/isomorphic-strings/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw4" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  A character <code>c1</code> in <code>s</code> must map to
                  exactly one character <code>c2</code> in <code>t</code>, and
                  NO two characters in <code>s</code> can map to the same
                  character in <code>t</code> (bijection).
                </p>
              </div>
              <div id="appr-hw4" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Use two HashMaps (or arrays of size 256): <code>mapSToT</code>{" "}
                  and <code>mapTToS</code>. Iterate through both strings
                  simultaneously and check for consistent mappings.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1) ASCII space
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="hashing">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">5. Design Underground System</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">
                    System Design & Hashing
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Design a subway tracking system that supports checking in
                passengers, checking out passengers, and calculating average
                travel time between any two stations.
              </p>
              <div className="hw-example">
                <span>Operations:</span> checkIn(id, stationName, t),
                checkOut(id, stationName, t), getAverageTime(startStation,
                endStation)
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw5");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw5");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/design-underground-system/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw5" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Use two HashMaps: one for active passenger check-ins{" "}
                  <code>id -&gt; (station, time)</code> and one for completed
                  trip stats{" "}
                  <code>
                    "startStation-&gt;endStation" -&gt; (totalTime, count)
                  </code>
                  .
                </p>
              </div>
              <div id="appr-hw5" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  When passenger checks out, compute{" "}
                  <code>duration = t - startTime</code>, remove from checkIn
                  map, and add duration to travelStats map for key{" "}
                  <code>start + "&gt;" + end</code>.<br />
                  <strong>Time Complexity:</strong> O(1) for all operations
                  <br />
                  <strong>Space Complexity:</strong> O(P + S²)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="sliding-window">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">6. Max Consecutive Ones III</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Dynamic Sliding Window</span>
                </div>
              </div>
              <p className="hw-statement">
                Given a binary array <code>nums</code> and an integer{" "}
                <code>k</code>, return the maximum number of consecutive{" "}
                <code>1</code>'s in the array if you can flip at most{" "}
                <code>k</code> <code>0</code>'s.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2
                <span>Output:</span> 6<span>Explanation:</span> [1,1,1,0,0,
                <u>1,1,1,1,1,1</u>] - flip 2 zeros to get 6 consecutive ones.
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw6");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw6");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/max-consecutive-ones-iii/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw6" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Reframe the problem: Find the longest contiguous subarray
                  containing at most <code>k</code> zeros! Expand window with{" "}
                  <code>right</code> pointer, shrink with <code>left</code>{" "}
                  whenever zero count exceeds <code>k</code>.
                </p>
              </div>
              <div id="appr-hw6" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. Expand window using <code>right</code>. Count zeros
                  encountered.
                  <br />
                  2. If <code>zeroCount &gt; k</code>, increment{" "}
                  <code>left</code> until <code>zeroCount &lt;= k</code>.<br />
                  3. Track <code>maxLen = max(maxLen, right - left + 1)</code>.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="sliding-window">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">7. Permutation in String</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Fixed Sliding Window</span>
                </div>
              </div>
              <p className="hw-statement">
                Given two strings <code>s1</code> and <code>s2</code>, return{" "}
                <code>true</code> if <code>s2</code> contains a permutation of{" "}
                <code>s1</code>, or <code>false</code> otherwise.
              </p>
              <div className="hw-example">
                <span>Input:</span> s1 = "ab", s2 = "eidbaooo" -&gt;{" "}
                <span>Output:</span> true (s2 contains "ba")
                <span>Input:</span> s1 = "ab", s2 = "eidboaoo" -&gt;{" "}
                <span>Output:</span> false
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw7");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw7");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/permutation-in-string/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw7" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  A permutation has the exact same character frequencies. Use a
                  fixed sliding window of size equal to <code>len(s1)</code>{" "}
                  across <code>s2</code> and compare frequency arrays.
                </p>
              </div>
              <div id="appr-hw7" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Maintain frequency map for <code>s1</code> and current window
                  in <code>s2</code>. Slide window by 1 character each step (add
                  incoming, remove outgoing) and compare 26-char arrays.
                  <br />
                  <strong>Time Complexity:</strong> O(26 × N) = O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="sliding-window">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">
                    8. Subarrays with K Different Integers
                  </h3>
                  <span className="badge-diff diff-hard">Hard</span>
                  <span className="hw-topic-badge">
                    Advanced Sliding Window
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Given an integer array <code>nums</code> and an integer{" "}
                <code>k</code>, return the number of good subarrays where the
                number of distinct integers in the subarray is exactly{" "}
                <code>k</code>.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [1,2,1,2,3], k = 2 -&gt;{" "}
                <span>Output:</span> 7<span>Subarrays:</span> [1,2], [2,1],
                [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw8");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw8");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/subarrays-with-k-different-integers/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw8" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Finding "exactly K distinct" directly with sliding window is
                  tricky. Instead, use the key mathematical identity:{" "}
                  <code>exactly(K) = atMost(K) - atMost(K - 1)</code>!
                </p>
              </div>
              <div id="appr-hw8" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Write a helper function <code>atMost(k)</code> that counts
                  subarrays with at most <code>k</code> distinct elements using
                  sliding window. Then answer is{" "}
                  <code>atMost(k) - atMost(k - 1)</code>.<br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(N)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="sliding-window">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">9. Grumpy Bookstore Owner</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Fixed Window Technique</span>
                </div>
              </div>
              <p className="hw-statement">
                You have <code>customers</code> array and a binary{" "}
                <code>grumpy</code> array. Using a secret technique, you can
                stay non-grumpy for <code>minutes</code> consecutive minutes.
                Maximize satisfied customers.
              </p>
              <div className="hw-example">
                <span>Input:</span> customers = [1,0,1,2,1,1,7,5], grumpy =
                [0,1,0,1,0,1,0,1], minutes = 3<span>Output:</span> 16 (Base
                satisfied = 10, max boost from 3-min window = 6)
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw9");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw9");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/grumpy-bookstore-owner/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw9" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  First sum up customers who are ALREADY satisfied (where{" "}
                  <code>grumpy[i] == 0</code>). Then use a fixed sliding window
                  of size <code>minutes</code> to find the window that yields
                  the maximum EXTRA satisfied customers.
                </p>
              </div>
              <div id="appr-hw9" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Total = BaseSatisfied + MaxWindowExtra. Slide window of length{" "}
                  <code>minutes</code> to track extra satisfied customers.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="sliding-window">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">
                    10. Longest Substring with At Least K Repeating Characters
                  </h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">
                    Sliding Window with Constraint
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Given a string <code>s</code> and integer <code>k</code>, return
                the length of the longest substring of <code>s</code> such that
                the frequency of each character in this substring is greater
                than or equal to <code>k</code>.
              </p>
              <div className="hw-example">
                <span>Input:</span> s = "aaabb", k = 3 -&gt;{" "}
                <span>Output:</span> 3 ("aaa")
                <span>Input:</span> s = "ababbc", k = 2 -&gt;{" "}
                <span>Output:</span> 5 ("ababb")
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw10");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw10");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/longest-substring-with-at-least-k-repeating-characters/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw10" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Iterate over the target number of UNIQUE characters in the
                  substring (from 1 to 26). For a fixed target count of unique
                  characters, sliding window can expand and shrink
                  deterministically!
                </p>
              </div>
              <div id="appr-hw10" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Outer loop: <code>numUniqueTarget = 1..26</code>. Inner loop:
                  sliding window tracking unique characters and how many have
                  count ≥ <code>k</code>.<br />
                  <strong>Time Complexity:</strong> O(26 × N) = O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="two-pointers">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">11. 4Sum</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Two Pointers & Sorting</span>
                </div>
              </div>
              <p className="hw-statement">
                Given an array <code>nums</code> of <code>n</code> integers,
                return an array of all the unique quadruplets{" "}
                <code>[nums[a], nums[b], nums[c], nums[d]]</code> such that
                their sum equals <code>target</code>.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [1,0,-1,0,-2,2], target = 0
                <span>Output:</span> [[-2,-1,1,2], [-2,0,0,2], [-1,0,0,1]]
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw11");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw11");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/4sum/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw11" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Sort the array. Fix the first two numbers with nested loops{" "}
                  <code>i</code> and <code>j</code>, then use two pointers{" "}
                  <code>left</code> and <code>right</code> for the remaining two
                  numbers. Skip duplicates at all levels!
                </p>
              </div>
              <div id="appr-hw11" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. Sort array.
                  <br />
                  2. Outer loops <code>i</code> and <code>j</code>.<br />
                  3. Two pointers <code>left = j + 1</code>,{" "}
                  <code>right = n - 1</code>.<br />
                  4. Adjust pointers based on sum vs target.
                  <br />
                  <strong>Time Complexity:</strong> O(N³)
                  <br />
                  <strong>Space Complexity:</strong> O(1) extra space
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="two-pointers">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">12. 3Sum Closest</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Two Pointers</span>
                </div>
              </div>
              <p className="hw-statement">
                Given an integer array <code>nums</code> and a{" "}
                <code>target</code>, find three integers in <code>nums</code>{" "}
                such that the sum is closest to <code>target</code>. Return the
                sum of the three integers.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [-1,2,1,-4], target = 1 -&gt;{" "}
                <span>Output:</span> 2 (-1 + 2 + 1 = 2)
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw12");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw12");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/3sum-closest/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw12" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Sort the array first. Fix element <code>i</code>, then place
                  two pointers at <code>i+1</code> and <code>n-1</code>. Update
                  closest sum if <code>abs(currentSum - target)</code> is
                  smaller.
                </p>
              </div>
              <div id="appr-hw12" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Sort array. Loop <code>i</code> from <code>0</code> to{" "}
                  <code>n-3</code>. Use <code>left</code> &amp;{" "}
                  <code>right</code> pointers. If <code>sum &lt; target</code>,{" "}
                  <code>left++</code>; if <code>sum &gt; target</code>,{" "}
                  <code>right--</code>.<br />
                  <strong>Time Complexity:</strong> O(N²)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="two-pointers">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">13. Partition Labels</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">Two Pointers & Greedy</span>
                </div>
              </div>
              <p className="hw-statement">
                Partition string <code>s</code> into as many parts as possible
                so that each letter appears in at most one part, and return a
                list of sizes of these parts.
              </p>
              <div className="hw-example">
                <span>Input:</span> s = "ababcbacadefegdehijhklij"
                <span>Output:</span> [9,7,8] ("ababcbaca", "defegde",
                "hijhklij")
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw13");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw13");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/partition-labels/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw13" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Record the LAST occurrence index of each character first. Then
                  iterate through string maintaining a boundary{" "}
                  <code>maxLast = max(maxLast, lastIndex[char])</code>. When
                  index reaches <code>maxLast</code>, cut a partition!
                </p>
              </div>
              <div id="appr-hw13" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  1. Store <code>lastIndex</code> for all characters in
                  array/map.
                  <br />
                  2. Use two pointers <code>start</code> and <code>end</code> to
                  track partition boundaries.
                  <br />
                  3. When <code>i == end</code>, record length{" "}
                  <code>end - start + 1</code>, set <code>start = i + 1</code>.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1) ASCII space
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="two-pointers">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">14. Sort Array By Parity II</h3>
                  <span className="badge-diff diff-easy">Easy</span>
                  <span className="hw-topic-badge">Two Pointers</span>
                </div>
              </div>
              <p className="hw-statement">
                Given an array <code>nums</code> with half even and half odd
                numbers, rearrange the array in-place so that whenever{" "}
                <code>nums[i]</code> is odd, <code>i</code> is odd, and whenever{" "}
                <code>nums[i]</code> is even, <code>i</code> is even.
              </p>
              <div className="hw-example">
                <span>Input:</span> nums = [4,2,5,7] -&gt; <span>Output:</span>{" "}
                [4,5,2,7] (or [4,7,2,5])
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw14");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw14");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/sort-array-by-parity-ii/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw14" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Use two pointers: <code>evenPtr = 0</code> (step by 2) and{" "}
                  <code>oddPtr = 1</code> (step by 2). When{" "}
                  <code>nums[evenPtr]</code> is odd and{" "}
                  <code>nums[oddPtr]</code> is even, swap them!
                </p>
              </div>
              <div id="appr-hw14" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Advance <code>evenPtr</code> while element at{" "}
                  <code>evenPtr</code> is even. Advance <code>oddPtr</code>{" "}
                  while element at <code>oddPtr</code> is odd. If both pointers
                  are misaligned, swap elements.
                  <br />
                  <strong>Time Complexity:</strong> O(N)
                  <br />
                  <strong>Space Complexity:</strong> O(1)
                </p>
              </div>
            </div>

            <div className="hw-card" data-category="two-pointers">
              <div className="hw-header">
                <div className="hw-title-group">
                  <h3 className="hw-title">15. Interval List Intersections</h3>
                  <span className="badge-diff diff-medium">Medium</span>
                  <span className="hw-topic-badge">
                    Two Pointers & Intervals
                  </span>
                </div>
              </div>
              <p className="hw-statement">
                Given two lists of closed intervals <code>firstList</code> and{" "}
                <code>secondList</code> sorted by start time, return the
                intersection of these two interval lists.
              </p>
              <div className="hw-example">
                <span>Input:</span> firstList = [[0,2],[5,10],[13,23],[24,25]],
                secondList = [[1,5],[8,12],[15,24],[25,26]]
                <span>Output:</span>{" "}
                [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
              </div>
              <div className="hw-actions">
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("hint-hw15");
                  }}
                >
                  💡 Hint
                </button>
                <button
                  className="toggle-btn"
                  onClick={() => {
                    toggleExpand("appr-hw15");
                  }}
                >
                  ⚡ Approach & Complexity
                </button>
                <a
                  href="https://leetcode.com/problems/interval-list-intersections/"
                  target="_blank"
                  rel="noopener"
                  className="lc-link"
                >
                  Solve on LeetCode ↗
                </a>
              </div>
              <div id="hint-hw15" className="expand-box">
                <h4>💡 Hint</h4>
                <p>
                  Intersection starts at <code>max(startA, startB)</code> and
                  ends at <code>min(endA, endB)</code>. An intersection exists
                  if <code>start &lt;= end</code>. Advance pointer for whichever
                  interval ends earlier!
                </p>
              </div>
              <div id="appr-hw15" className="expand-box">
                <h4>⚡ Recommended Approach</h4>
                <p>
                  Use two pointers <code>i</code> and <code>j</code>. Calculate
                  overlap. If{" "}
                  <code>firstList[i].end &lt; secondList[j].end</code>,{" "}
                  <code>i++</code>; else <code>j++</code>.<br />
                  <strong>Time Complexity:</strong> O(N + M)
                  <br />
                  <strong>Space Complexity:</strong> O(1) extra space
                </p>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
