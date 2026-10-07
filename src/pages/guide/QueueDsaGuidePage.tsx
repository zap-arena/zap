import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  circularQueueApproaches,
  firstUniqueCharStreamApproaches,
  movingAverageApproaches,
  queueUsingStacksApproaches,
  slidingWindowMaximumApproaches,
} from "../../components/guide/queueVisualizations";

export default function QueueDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Queue</div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Implement Queue using Stacks
            </a>
            <a className="side-link" href="#q2">
              02 · Moving Average from Data Stream
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q3">
              03 · First Unique Character in a Stream
            </a>
            <a className="side-link" href="#q4">
              04 · Sliding Window Maximum
            </a>
            <a className="side-link" href="#q5">
              05 · Design Circular Queue
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Queue</span>
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
              <h1>Queue, basic to medium</h1>
              <p>
                Five questions built around first-in-first-out ordering. Each
                brute-force version redoes work on every operation; each
                optimal version keeps a queue (or deque) so stale data leaves
                from the front in constant time instead of being rescanned.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Brute force (rescans / rebuilds)
                </span>
                <span className="legend-item">
                  <span
                    className="legend-swatch"
                    style={{ background: "hsl(var(--primary))" } as React.CSSProperties}
                  ></span>
                  Optimal (queue / deque based)
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Implement Queue using Stacks</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Implement a FIFO queue using only two LIFO stacks, supporting{" "}
                <code>enqueue</code> and <code>dequeue</code>.
              </p>
              <div className="example">
                Input: enqueue(1,2,3), dequeue() Output: 1
              </div>

              <AlgoVisualizer
                title="Implement Queue using Stacks"
                approaches={queueUsingStacksApproaches}
                defaultInput={[1, 2, 3, 4]}
                structureVariant="queue"
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
                    Time: <b>O(n)</b> per dequeue · Space: <b>O(n)</b> —
                    reverse the whole stack through a helper every time
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MyQueue {
    Deque<Integer> in = new ArrayDeque<>();
    void push(int x) { in.push(x); }
    int pop() {
        Deque<Integer> tmp = new ArrayDeque<>();
        while (in.size() > 1) tmp.push(in.pop());
        int front = in.pop();
        while (!tmp.isEmpty()) in.push(tmp.pop());
        return front;
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MyQueue:
    def __init__(self):
        self.in_stack = []
    def push(self, x):
        self.in_stack.append(x)
    def pop(self):
        tmp = []
        while len(self.in_stack) > 1:
            tmp.append(self.in_stack.pop())
        front = self.in_stack.pop()
        while tmp:
            self.in_stack.append(tmp.pop())
        return front`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(1)</b> amortized · Space: <b>O(n)</b> — an
                    in-stack for pushes, an out-stack for pops
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MyQueue {
    Deque<Integer> in = new ArrayDeque<>(), out = new ArrayDeque<>();
    void push(int x) { in.push(x); }
    int pop() {
        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());
        return out.pop();
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []
    def push(self, x):
        self.in_stack.append(x)
    def pop(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
        return self.out_stack.pop()`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Each element moves between
                the stacks at most once in its lifetime — why does that make
                the optimal version amortized O(1) even though a single
                dequeue call can still be O(n)?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Moving Average from Data Stream</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a stream of integers and a window size <code>k</code>,
                calculate the moving average of the last <code>k</code>{" "}
                values each time a new value arrives.
              </p>
              <div className="example">
                Input: readings = [1, 10, 3, 5], k = 3 Output: 1, 5.5, 4.67,
                6.0
              </div>

              <AlgoVisualizer
                title="Moving Average from Data Stream"
                approaches={movingAverageApproaches}
                defaultInput={[1, 10, 3, 5, 8]}
                structureVariant="queue"
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
                    Time: <b>O(k)</b> per reading · Space: <b>O(n)</b> —
                    re-sum the last k values from scratch every time
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MovingAverage {
    List<Integer> readings = new ArrayList<>();
    int k;
    double next(int val) {
        readings.add(val);
        int from = Math.max(0, readings.size() - k);
        List<Integer> window = readings.subList(from, readings.size());
        return window.stream().mapToInt(Integer::intValue).average().orElse(0);
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MovingAverage:
    def __init__(self, k):
        self.k = k
        self.readings = []
    def next(self, val):
        self.readings.append(val)
        window = self.readings[-self.k:]
        return sum(window) / len(window)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(1)</b> per reading · Space: <b>O(k)</b> — a
                    queue holds exactly the window, a running sum updates
                    incrementally
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MovingAverage {
    Queue<Integer> queue = new LinkedList<>();
    int k; double sum = 0;
    double next(int val) {
        queue.add(val);
        sum += val;
        if (queue.size() > k) sum -= queue.poll();
        return sum / queue.size();
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

class MovingAverage:
    def __init__(self, k):
        self.k = k
        self.queue = deque()
        self.sum = 0
    def next(self, val):
        self.queue.append(val)
        self.sum += val
        if len(self.queue) > self.k:
            self.sum -= self.queue.popleft()
        return self.sum / len(self.queue)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed the
                moving <i>median</i> instead of the average — would a simple
                queue still be enough?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>First Unique Character in a Stream</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Characters arrive one at a time. After each character, report
                the first character seen so far that has appeared exactly
                once, or "none" if there isn't one.
              </p>
              <div className="example">
                Input: stream = "aabc" Output: 'a', none, 'b', 'b'
              </div>

              <AlgoVisualizer
                title="First Unique Character in a Stream"
                approaches={firstUniqueCharStreamApproaches}
                defaultInput={"aabcb"}
                inputKind="string"
                structureVariant="queue"
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
                    Time: <b>O(n)</b> per query · Space: <b>O(n)</b> — rescan
                    everything seen so far on every new character
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class FirstUnique {
    StringBuilder stream = new StringBuilder();
    Character next(char c) {
        stream.append(c);
        for (char ch : stream.toString().toCharArray()) {
            if (count(stream, ch) == 1) return ch;
        }
        return null;
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class FirstUnique:
    def __init__(self):
        self.stream = ""
    def next(self, c):
        self.stream += c
        for ch in self.stream:
            if self.stream.count(ch) == 1:
                return ch
        return None`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(1)</b> amortized · Space: <b>O(n)</b> — a queue
                    of candidates, stale duplicates dropped from the front
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class FirstUnique {
    Queue<Character> queue = new LinkedList<>();
    Map<Character, Integer> count = new HashMap<>();
    Character next(char c) {
        count.merge(c, 1, Integer::sum);
        queue.add(c);
        while (!queue.isEmpty() && count.get(queue.peek()) > 1) queue.poll();
        return queue.isEmpty() ? null : queue.peek();
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque, Counter

class FirstUnique:
    def __init__(self):
        self.queue = deque()
        self.count = Counter()
    def next(self, c):
        self.count[c] += 1
        self.queue.append(c)
        while self.queue and self.count[self.queue[0]] > 1:
            self.queue.popleft()
        return self.queue[0] if self.queue else None`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why is it safe to only
                ever remove from the front of the candidate queue, never from
                the middle?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Sliding Window Maximum</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array and a window size <code>k</code>, return the
                maximum value in each sliding window of size <code>k</code> as
                it moves from left to right.
              </p>
              <div className="example">
                Input: nums = [1, 3, -1, -3, 5, 3], k = 3 Output: [3, 3, 5, 5]
              </div>

              <AlgoVisualizer
                title="Sliding Window Maximum"
                approaches={slidingWindowMaximumApproaches}
                defaultInput={[1, 3, -1, -3, 5, 3]}
                structureVariant="queue"
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
                    Time: <b>O(n·k)</b> · Space: <b>O(1)</b> extra — scan
                    every window from scratch
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n - k + 1];
    for (int i = 0; i + k <= n; i++) {
        int m = Integer.MIN_VALUE;
        for (int j = i; j < i + k; j++) m = Math.max(m, nums[j]);
        res[i] = m;
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def max_sliding_window(nums, k):
    n = len(nums)
    res = []
    for i in range(n - k + 1):
        res.append(max(nums[i:i + k]))
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(k)</b> — a monotonic deque
                    of indices; the front is always the window max
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
        dq.addLast(i);
        if (dq.peekFirst() <= i - k) dq.pollFirst();
        if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # indices, decreasing values
    res = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The deque stores indices,
                not values — why is that necessary for the eviction check to
                work?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Design Circular Queue</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Design a fixed-capacity circular queue supporting{" "}
                <code>enqueue</code> and <code>dequeue</code> in O(1), reusing
                freed slots without shifting elements.
              </p>
              <div className="example">
                Input: capacity = 4, enqueue(1,2,3,4,5) Output: slot 0 reused
                for 5 after dequeuing 1
              </div>

              <AlgoVisualizer
                title="Design Circular Queue"
                approaches={circularQueueApproaches}
                defaultInput={[1, 2, 3, 4, 5, 6]}
                structureVariant="queue"
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
                    Time: <b>O(n)</b> per dequeue · Space: <b>O(n)</b> — a
                    plain array; dequeuing shifts every remaining element
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MyCircularQueue {
    List<Integer> arr = new ArrayList<>();
    int capacity;
    boolean enqueue(int x) {
        if (arr.size() >= capacity) return false;
        arr.add(x);
        return true;
    }
    boolean dequeue() {
        if (arr.isEmpty()) return false;
        arr.remove(0); // shifts every remaining element
        return true;
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MyCircularQueue:
    def __init__(self, capacity):
        self.arr = []
        self.capacity = capacity
    def enqueue(self, x):
        if len(self.arr) >= self.capacity:
            return False
        self.arr.append(x)
        return True
    def dequeue(self):
        if not self.arr:
            return False
        self.arr.pop(0)  # O(n) shift
        return True`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(1)</b> per operation · Space: <b>O(capacity)</b>{" "}
                    — a fixed array with head/tail indices that wrap via
                    modulo
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class MyCircularQueue {
    int[] buf; int head = 0, tail = 0, size = 0, capacity;
    MyCircularQueue(int k) { capacity = k; buf = new int[k]; }
    boolean enqueue(int x) {
        if (size == capacity) return false;
        buf[tail] = x;
        tail = (tail + 1) % capacity;
        size++;
        return true;
    }
    boolean dequeue() {
        if (size == 0) return false;
        head = (head + 1) % capacity;
        size--;
        return true;
    }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class MyCircularQueue:
    def __init__(self, k):
        self.buf = [0] * k
        self.capacity = k
        self.head = self.tail = self.size = 0
    def enqueue(self, x):
        if self.size == self.capacity:
            return False
        self.buf[self.tail] = x
        self.tail = (self.tail + 1) % self.capacity
        self.size += 1
        return True
    def dequeue(self):
        if self.size == 0:
            return False
        self.head = (self.head + 1) % self.capacity
        self.size -= 1
        return True`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How do you distinguish a
                completely full buffer from a completely empty one when
                head == tail, without the separate <code>size</code> counter?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
