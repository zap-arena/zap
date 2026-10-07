import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  dailyTemperaturesApproaches,
  evalRPNApproaches,
  largestRectangleHistogramApproaches,
  minStackApproaches,
  nextGreaterElementApproaches,
  validParenthesesApproaches,
} from "../../components/guide/stackVisualizations";

export default function StackDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Stack</div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Valid Parentheses
            </a>
            <a className="side-link" href="#q2">
              02 · Next Greater Element
            </a>
            <a className="side-link" href="#q3">
              03 · Daily Temperatures
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q4">
              04 · Min Stack
            </a>
            <a className="side-link" href="#q5">
              05 · Evaluate Reverse Polish Notation
            </a>
            <a className="side-link" href="#q6">
              06 · Largest Rectangle in Histogram
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Stack</span>
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
              <h1>Stack, basic to medium</h1>
              <p>
                Six questions built around last-in-first-out ordering. Each
                brute-force version re-scans data it has already looked at;
                each optimal version keeps a stack of "still relevant"
                candidates so every element is pushed and popped at most once.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Brute force (no stack)
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Optimal (stack-based)
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Valid Parentheses</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a string containing just the characters{" "}
                <code>(</code>, <code>)</code>, <code>{"{"}</code>,{" "}
                <code>{"}"}</code>, <code>[</code>, and <code>]</code>,
                determine whether every bracket is closed in the correct
                order.
              </p>
              <div className="example">
                Input: s = "{"{[()]}"}" Output: true
              </div>

              <AlgoVisualizer
                title="Valid Parentheses"
                approaches={validParenthesesApproaches}
                defaultInput={"{[()]}"}
                inputKind="string"
                structureVariant="stack"
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
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — repeatedly delete
                    adjacent matching pairs until none remain
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean isValid(String s) {
    StringBuilder sb = new StringBuilder(s);
    boolean changed = true;
    while (changed) {
        changed = false;
        for (int i = 0; i < sb.length() - 1; i++) {
            char a = sb.charAt(i), b = sb.charAt(i + 1);
            if ((a=='('&&b==')') || (a=='['&&b==']') || (a=='{'&&b=='}')) {
                sb.delete(i, i + 2);
                changed = true;
                break;
            }
        }
    }
    return sb.length() == 0;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def is_valid(s):
    pairs = {"(": ")", "[": "]", "{": "}"}
    s = list(s)
    changed = True
    while changed:
        changed = False
        for i in range(len(s) - 1):
            if pairs.get(s[i]) == s[i + 1]:
                del s[i:i + 2]
                changed = True
                break
    return len(s) == 0`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — push openers, pop
                    and compare on every closer
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {
        if (pairs.containsValue(c)) {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != pairs.get(c)) return false;
        }
    }
    return stack.isEmpty();
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs.values():
            stack.append(c)
        else:
            if not stack or stack.pop() != pairs[c]:
                return False
    return not stack`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if the string also
                contains other characters that should be ignored? Where would
                that check go in the stack version?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Next Greater Element</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                For each element in an array, find the first element to its
                right that is greater. If none exists, the answer is{" "}
                <code>-1</code>.
              </p>
              <div className="example">
                Input: nums = [2, 1, 2, 4, 3] Output: [4, 2, 4, -1, -1]
              </div>

              <AlgoVisualizer
                title="Next Greater Element"
                approaches={nextGreaterElementApproaches}
                defaultInput={[2, 1, 2, 4, 3]}
                structureVariant="stack"
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
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — scan rightward
                    from every index
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        res[i] = -1;
        for (int j = i + 1; j < n; j++) {
            if (nums[j] > nums[i]) { res[i] = nums[j]; break; }
        }
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def next_greater(nums):
    n = len(nums)
    res = [-1] * n
    for i in range(n):
        for j in range(i + 1, n):
            if nums[j] > nums[i]:
                res[i] = nums[j]
                break
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — walk right to
                    left with a decreasing monotonic stack
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.peek() <= nums[i]) stack.pop();
        res[i] = stack.isEmpty() ? -1 : stack.peek();
        stack.push(nums[i]);
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def next_greater(nums):
    n = len(nums)
    res = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        res[i] = stack[-1] if stack else -1
        stack.append(nums[i])
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What changes if the array
                is circular (the last element can see wrap-around to the
                first)?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Daily Temperatures</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a list of daily temperatures, return an array where{" "}
                <code>answer[i]</code> is the number of days you'd have to
                wait after day <code>i</code> for a warmer temperature.
              </p>
              <div className="example">
                Input: temps = [73, 74, 75, 71, 69, 72] Output: [1, 1, 3, 2, 1,
                0]
              </div>

              <AlgoVisualizer
                title="Daily Temperatures"
                approaches={dailyTemperaturesApproaches}
                defaultInput={[73, 74, 75, 71, 69, 72]}
                structureVariant="stack"
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
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — scan forward
                    from every day
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[j] > t[i]) { res[i] = j - i; break; }
        }
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def daily_temperatures(t):
    n = len(t)
    res = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if t[j] > t[i]:
                res[i] = j - i
                break
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — a stack of
                    indices still waiting for a warmer day
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] res = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && t[stack.peek()] < t[i]) {
            int j = stack.pop();
            res[j] = i - j;
        }
        stack.push(i);
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def daily_temperatures(t):
    n = len(t)
    res = [0] * n
    stack = []
    for i in range(n):
        while stack and t[stack[-1]] < t[i]:
            j = stack.pop()
            res[j] = i - j
        stack.append(i)
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> This is the same pattern as
                Next Greater Element — what's different about what gets
                stored in the stack?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Min Stack</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Design a stack that supports push, pop, top, and retrieving
                the minimum element — all in <code>O(1)</code> time.
              </p>
              <div className="example">
                Input: push(5), push(2), push(7), getMin() Output: 2
              </div>

              <AlgoVisualizer
                title="Min Stack"
                approaches={minStackApproaches}
                defaultInput={[5, 2, 7, 1, 8]}
                structureVariant="stack"
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
                    Time: <b>O(n)</b> per getMin() · Space: <b>O(n)</b> —
                    rescan the whole stack every time
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MinStack {
    Deque<Integer> stack = new ArrayDeque<>();
    void push(int x) { stack.push(x); }
    void pop() { stack.pop(); }
    int top() { return stack.peek(); }
    int getMin() {
        int m = Integer.MAX_VALUE;
        for (int v : stack) m = Math.min(m, v);
        return m;
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MinStack:
    def __init__(self):
        self.stack = []
    def push(self, x):
        self.stack.append(x)
    def pop(self):
        self.stack.pop()
    def top(self):
        return self.stack[-1]
    def get_min(self):
        return min(self.stack)  # O(n) every call`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(1)</b> per operation · Space: <b>O(n)</b> — a
                    second stack tracks the running minimum
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MinStack {
    Deque<Integer> stack = new ArrayDeque<>();
    Deque<Integer> minStack = new ArrayDeque<>();
    void push(int x) {
        stack.push(x);
        int m = minStack.isEmpty() ? x : Math.min(x, minStack.peek());
        minStack.push(m);
    }
    void pop() { stack.pop(); minStack.pop(); }
    int top() { return stack.peek(); }
    int getMin() { return minStack.peek(); }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    def push(self, x):
        self.stack.append(x)
        m = x if not self.min_stack else min(x, self.min_stack[-1])
        self.min_stack.append(m)
    def pop(self):
        self.stack.pop()
        self.min_stack.pop()
    def top(self):
        return self.stack[-1]
    def get_min(self):
        return self.min_stack[-1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you reduce the
                min-stack's memory use when there are long runs without a new
                minimum?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Evaluate Reverse Polish Notation</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Evaluate an arithmetic expression given in Reverse Polish
                (postfix) Notation, where operands and operators are
                whitespace-separated tokens.
              </p>
              <div className="example">
                Input: tokens = "2 1 + 3 *" Output: 9
              </div>

              <AlgoVisualizer
                title="Evaluate Reverse Polish Notation"
                approaches={evalRPNApproaches}
                defaultInput={"2 1 + 3 *"}
                inputKind="string"
                structureVariant="stack"
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
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — repeatedly find
                    the first operator and collapse it with its operands
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int evalRPN(List<String> tokens) {
    tokens = new ArrayList<>(tokens);
    while (tokens.size() > 1) {
        int i = 0;
        while (!isOperator(tokens.get(i))) i++;
        int b = Integer.parseInt(tokens.get(i - 1));
        int a = Integer.parseInt(tokens.get(i - 2));
        int r = apply(tokens.get(i), a, b);
        tokens.subList(i - 2, i + 1).clear();
        tokens.add(i - 2, String.valueOf(r));
    }
    return Integer.parseInt(tokens.get(0));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def eval_rpn(tokens):
    tokens = list(tokens)
    ops = {"+", "-", "*", "/"}
    while len(tokens) > 1:
        i = next(k for k, t in enumerate(tokens) if t in ops)
        a, b = int(tokens[i - 2]), int(tokens[i - 1])
        r = apply(tokens[i], a, b)
        tokens[i - 2:i + 1] = [str(r)]
    return int(tokens[0])`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — push numbers, pop
                    two operands whenever an operator arrives
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int evalRPN(List<String> tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        if (isOperator(t)) {
            int b = stack.pop(), a = stack.pop();
            stack.push(apply(t, a, b));
        } else {
            stack.push(Integer.parseInt(t));
        }
    }
    return stack.peek();
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def eval_rpn(tokens):
    stack = []
    ops = {"+", "-", "*", "/"}
    for t in tokens:
        if t in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(apply(t, a, b))
        else:
            stack.append(int(t))
    return stack[-1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Integer division in RPN
                truncates toward zero — how does that differ from Python's{" "}
                <code>//</code> for negative numbers, and what would you
                change?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Largest Rectangle in Histogram</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array of bar heights forming a histogram, find the
                area of the largest rectangle that fits entirely under the
                skyline.
              </p>
              <div className="example">
                Input: heights = [2, 1, 5, 6, 2, 3] Output: 10
              </div>

              <AlgoVisualizer
                title="Largest Rectangle in Histogram"
                approaches={largestRectangleHistogramApproaches}
                defaultInput={[2, 1, 5, 6, 2, 3]}
                structureVariant="stack"
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
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — for each bar,
                    expand left and right while the height holds
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    for (int i = 0; i < n; i++) {
        int left = i, right = i;
        while (left > 0 && heights[left - 1] >= heights[i]) left--;
        while (right < n - 1 && heights[right + 1] >= heights[i]) right++;
        best = Math.max(best, heights[i] * (right - left + 1));
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def largest_rectangle_area(heights):
    n = len(heights)
    best = 0
    for i in range(n):
        left = right = i
        while left > 0 and heights[left - 1] >= heights[i]:
            left -= 1
        while right < n - 1 and heights[right + 1] >= heights[i]:
            right += 1
        best = max(best, heights[i] * (right - left + 1))
    return best`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — an increasing
                    monotonic stack of bar indices
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] >= h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            best = Math.max(best, height * width);
        }
        stack.push(i);
    }
    return best;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def largest_rectangle_area(heights):
    n = len(heights)
    best = 0
    stack = []
    for i in range(n + 1):
        h = 0 if i == n else heights[i]
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you extend this
                to find the largest rectangle in a 2D binary matrix (the
                "Maximal Rectangle" problem)?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
