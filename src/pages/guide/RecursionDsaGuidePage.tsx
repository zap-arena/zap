import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";
import RecursionVisualizer from "../../components/guide/RecursionVisualizer";
import {
  climbingStairsApproaches,
  factorialApproaches,
  fibonacciApproaches,
  permutationsApproaches,
  powerApproaches,
  reverseStringRecursiveApproaches,
  subsetsApproaches,
  sumOfDigitsApproaches,
} from "../../components/guide/recursionVisualizations";

export default function RecursionDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Recursion</div>
          <div className="side-group">
            <div className="side-group-label">Reference</div>
            <a className="side-link" href="#toolkit">
              Base case &amp; recursive case
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Factorial of N
            </a>
            <a className="side-link" href="#q2">
              02 · Fibonacci Number
            </a>
            <a className="side-link" href="#q3">
              03 · Power(x, n)
            </a>
            <a className="side-link" href="#q4">
              04 · Sum of Digits
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q5">
              05 · Reverse a String
            </a>
            <a className="side-link" href="#q6">
              06 · Climbing Stairs
            </a>
            <a className="side-link" href="#q7">
              07 · Subsets (Power Set)
            </a>
            <a className="side-link" href="#q8">
              08 · Permutations
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Recursion</span>
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
              <h1>Recursion, basic to medium</h1>
              <p>
                Eight questions, every one solved by a function that calls
                itself — a base case that stops the recursion, and a recursive
                case that breaks the problem into a smaller version of itself.
                Each brute-force version repeats work it's already done; each
                optimal version remembers or restructures to avoid it.
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
                  Optimal (memoized / iterative / in-place)
                </span>
              </div>
            </div>

            <section className="question" id="toolkit">
              <div className="q-head">
                <span className="q-index">00</span>
                <h2>Base case &amp; recursive case</h2>
                <span className="level-badge reference">Reference</span>
              </div>
              <p className="prompt">
                Every recursive function needs exactly two parts: a{" "}
                <b>base case</b> that stops the recursion without calling
                itself again, and a <b>recursive case</b> that calls itself with
                a smaller or simpler input, moving toward that base case.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-panel active" id="toolkit-shape">
                  <div className="complexity">
                    Skip the base case and the function never stops — it blows
                    the call stack. Skip progress toward the base case
                    (shrinking the input) and the same thing happens.
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int solve(int n) {
    if (n <= 0) return 0;      // base case — stops the recursion
    return n + solve(n - 1);  // recursive case — smaller input, moves toward base case
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def solve(n):
    if n <= 0:
        return 0              # base case — stops the recursion
    return n + solve(n - 1)   # recursive case — smaller input, moves toward base case`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="twist">
                <strong>One step further:</strong> Every recursive call adds a
                frame to the call stack. For an input of size n, how many
                frames are alive at the deepest point — and what happens if n
                is too large for the stack to hold?
              </div>
            </section>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Factorial of N</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a non-negative integer <code>n</code>, compute{" "}
                <code>n!</code> = n × (n-1) × ... × 1, with{" "}
                <code>0! = 1</code>.
              </p>
              <div className="example">Input: n = 5 Output: 120</div>

              <RecursionVisualizer
                title="Factorial of N"
                approaches={factorialApproaches}
                defaultInput={[0, 1, 2, 3, 4, 5]}
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
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> call stack — recurse
                    down to 0, multiply back up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — no call stack, just
                    a running product
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public long factorial(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> For large n, factorial(n)
                overflows a 64-bit integer. What would you change to compute it
                exactly, and what would that cost?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Fibonacci Number</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given <code>n</code>, return the n-th Fibonacci number, where{" "}
                <code>fib(0) = 0</code>, <code>fib(1) = 1</code>, and{" "}
                <code>fib(n) = fib(n-1) + fib(n-2)</code>.
              </p>
              <div className="example">Input: n = 6 Output: 8</div>

              <RecursionVisualizer
                title="Fibonacci Number"
                approaches={fibonacciApproaches}
                defaultInput={[0, 1, 2, 3, 4, 5, 6]}
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
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack —
                    recomputes the same fib(k) many times
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — build the table
                    bottom-up, each value computed exactly once
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int fib(int n) {
    int[] table = new int[n + 1];
    if (n >= 1) table[1] = 1;
    for (int i = 2; i <= n; i++) {
        table[i] = table[i - 1] + table[i - 2];
    }
    return table[n];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def fib(n):
    table = [0] * (n + 1)
    if n >= 1:
        table[1] = 1
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The bottom-up table only
                ever looks at the last two values. Can you solve this with
                O(1) space instead of O(n)?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Power(x, n)</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Implement <code>pow(x, n)</code>, computing <code>x</code>{" "}
                raised to the integer power <code>n</code>.
              </p>
              <div className="example">Input: x = 2, n = 10 Output: 1024</div>

              <RecursionVisualizer
                title="Power(x, n)"
                approaches={powerApproaches}
                defaultInput={[2]}
                needsTarget
                defaultTarget={10}
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
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> call stack —
                    multiply by x, n times
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public double power(double x, int n) {
    if (n == 0) return 1;
    return x * power(x, n - 1);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def power(x, n):
    if n == 0:
        return 1
    return x * power(x, n - 1)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(log n)</b> · Space: <b>O(log n)</b> call stack —
                    square the base, halve the exponent
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public double power(double x, int n) {
    if (n == 0) return 1;
    double half = power(x, n / 2);
    return (n % 2 == 0) ? half * half : half * half * x;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def power(x, n):
    if n == 0:
        return 1
    half = power(x, n // 2)
    return half * half if n % 2 == 0 else half * half * x`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What changes if{" "}
                <code>n</code> can be negative?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Sum of Digits</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a non-negative integer as a string, return the sum of its
                digits.
              </p>
              <div className="example">Input: s = "12345" Output: 15</div>

              <RecursionVisualizer
                title="Sum of Digits"
                approaches={sumOfDigitsApproaches}
                defaultInput="12345"
                inputKind="string"
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
                    Time: <b>O(d)</b> digits · Space: <b>O(d)</b> call stack —
                    peel the last digit, recurse on the rest
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int sumDigits(String s) {
    if (s.isEmpty()) return 0;
    int last = s.charAt(s.length() - 1) - '0';
    return last + sumDigits(s.substring(0, s.length() - 1));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def sum_digits(s):
    if not s:
        return 0
    return int(s[-1]) + sum_digits(s[:-1])`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(d)</b> · Space: <b>O(1)</b> — same work, no call
                    stack
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int sumDigits(String s) {
    int sum = 0;
    for (char c : s.toCharArray()) {
        sum += c - '0';
    }
    return sum;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def sum_digits(s):
    return sum(int(ch) for ch in s)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you had to keep
                summing digits until only one digit remains (the "digital
                root")? Is there a non-recursive formula for that?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Reverse a String</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Reverse a string using recursion.
              </p>
              <div className="example">Input: s = "hello" Output: "olleh"</div>

              <RecursionVisualizer
                title="Reverse a String"
                approaches={reverseStringRecursiveApproaches}
                defaultInput="hello"
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
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — builds a brand-new
                    reversed string on the way back up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public String reverse(String s) {
    if (s.isEmpty()) return "";
    return reverse(s.substring(1)) + s.charAt(0);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def reverse(s):
    if not s:
        return ""
    return reverse(s[1:]) + s[0]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> call stack, O(1)
                    extra data — swap the ends, recurse inward
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public void reverse(char[] s, int left, int right) {
    if (left >= right) return;
    char temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    reverse(s, left + 1, right - 1);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def reverse(s, left, right):
    if left >= right:
        return
    s[left], s[right] = s[right], s[left]
    reverse(s, left + 1, right - 1)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> This still uses O(n) stack
                frames. What would make it tail-recursive, and does your
                language actually optimize tail calls?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Climbing Stairs</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                You can climb 1 or 2 steps at a time. Given <code>n</code>{" "}
                stairs, return how many distinct ways you can climb to the top.
              </p>
              <div className="example">Input: n = 5 Output: 8</div>

              <RecursionVisualizer
                title="Climbing Stairs"
                approaches={climbingStairsApproaches}
                defaultInput={[0, 1, 2, 3, 4, 5]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q6-approach">
                  <button className="tab-btn brute active" data-target="q6-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q6-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q6-brute">
                  <div className="complexity">
                    Time: <b>O(2^n)</b> · Space: <b>O(n)</b> call stack —
                    recomputes ways(k) many times, identical shape to Fibonacci
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int ways(int n) {
    if (n <= 1) return 1;
    return ways(n - 1) + ways(n - 2);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def ways(n):
    if n <= 1:
        return 1
    return ways(n - 1) + ways(n - 2)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — build ways[0..n]
                    once, bottom-up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int ways(int n) {
    int[] ways = new int[n + 1];
    ways[0] = 1;
    if (n >= 1) ways[1] = 1;
    for (int i = 2; i <= n; i++) {
        ways[i] = ways[i - 1] + ways[i - 2];
    }
    return ways[n];
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def ways(n):
    table = [1] * (n + 1)
    for i in range(2, n + 1):
        table[i] = table[i - 1] + table[i - 2]
    return table[n]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you could also
                climb 3 steps at a time? Which line of the DP version needs to
                change?
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Subsets (Power Set)</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array of unique integers <code>nums</code>, return all
                possible subsets (the power set).
              </p>
              <div className="example">
                Input: nums = [1, 2, 3] Output: [[], [1], [2], [1,2], [3],
                [1,3], [2,3], [1,2,3]]
              </div>

              <RecursionVisualizer
                title="Subsets (Power Set)"
                approaches={subsetsApproaches}
                defaultInput={[1, 2, 3]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q7-approach">
                  <button className="tab-btn brute active" data-target="q7-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q7-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q7-brute">
                  <div className="complexity">
                    Time: <b>O(n · 2^n)</b> · Space: <b>O(n)</b> call stack —
                    branch on including or excluding each element
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void subsets(int[] nums, int i, List<Integer> path, List<List<Integer>> result) {
    if (i == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    subsets(nums, i + 1, path, result);           // exclude
    path.add(nums[i]);
    subsets(nums, i + 1, path, result);           // include
    path.remove(path.size() - 1);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def subsets(nums, i, path, result):
    if i == len(nums):
        result.append(list(path))
        return
    subsets(nums, i + 1, path, result)            # exclude
    subsets(nums, i + 1, path + [nums[i]], result)  # include`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(n · 2^n)</b> · Space: <b>O(1)</b> extra per
                    subset — no recursion, one bitmask per subset
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) subset.add(nums[i]);
        }
        result.add(subset);
    }
    return result;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def subsets(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        result.append(subset)
    return result`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What changes if{" "}
                <code>nums</code> can contain duplicates and the subsets
                themselves must be unique?
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Permutations</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array of distinct integers <code>nums</code>, return
                all possible permutations, in any order.
              </p>
              <div className="example">
                Input: nums = [1, 2, 3] Output: [[1,2,3], [1,3,2], [2,1,3],
                [2,3,1], [3,1,2], [3,2,1]]
              </div>

              <RecursionVisualizer
                title="Permutations"
                approaches={permutationsApproaches}
                defaultInput={[1, 2, 3]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q8-approach">
                  <button className="tab-btn brute active" data-target="q8-brute">
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q8-opt">
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q8-brute">
                  <div className="complexity">
                    Time: <b>O(n · n!)</b> · Space: <b>O(n)</b> per call —
                    copies the remaining list at every level
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void permute(List<Integer> remaining, List<Integer> path, List<List<Integer>> result) {
    if (remaining.isEmpty()) {
        result.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < remaining.size(); i++) {
        List<Integer> rest = new ArrayList<>(remaining);
        int chosen = rest.remove(i);
        path.add(chosen);
        permute(rest, path, result);
        path.remove(path.size() - 1);
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def permute(remaining, path, result):
    if not remaining:
        result.append(list(path))
        return
    for i in range(len(remaining)):
        rest = remaining[:i] + remaining[i + 1:]
        permute(rest, path + [remaining[i]], result)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q8-opt">
                  <div className="complexity">
                    Time: <b>O(n · n!)</b> · Space: <b>O(n)</b> call stack only
                    — swaps in place, no extra lists per call
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void permute(int[] nums, int k, List<List<Integer>> result) {
    if (k == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int v : nums) perm.add(v);
        result.add(perm);
        return;
    }
    for (int i = k; i < nums.length; i++) {
        swap(nums, k, i);
        permute(nums, k + 1, result);
        swap(nums, k, i);
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def permute(nums, k, result):
    if k == len(nums):
        result.append(list(nums))
        return
    for i in range(k, len(nums)):
        nums[k], nums[i] = nums[i], nums[k]
        permute(nums, k + 1, result)
        nums[k], nums[i] = nums[i], nums[k]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What changes if{" "}
                <code>nums</code> can contain duplicates and permutations
                themselves must be unique?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
