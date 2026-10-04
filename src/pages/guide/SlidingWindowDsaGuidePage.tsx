import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  containsDuplicateIIApproaches,
  findAllAnagramsApproaches,
  fruitIntoBasketsApproaches,
  longestRepeatingCharReplacementApproaches,
  longestSubstringKDistinctApproaches,
  longestSubstringNoRepeatApproaches,
  maxAverageSubarrayApproaches,
  maxSumSubarrayApproaches,
  minSizeSubarraySumApproaches,
  minWindowSubstringApproaches,
} from "../../components/guide/slidingWindowVisualizations";

export default function SlidingWindowDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Sliding Window</div>
          <div className="side-group">
            <div className="side-group-label">Reference</div>
            <a className="side-link" href="#toolkit">
              How sliding window works
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Maximum Sum Subarray of Size K
            </a>
            <a className="side-link" href="#q2">
              02 · Maximum Average Subarray I
            </a>
            <a className="side-link" href="#q3">
              03 · Minimum Size Subarray Sum
            </a>
            <a className="side-link" href="#q4">
              04 · Longest Substring Without Repeating Characters
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q5">
              05 · Longest Substring with At Most K Distinct Characters
            </a>
            <a className="side-link" href="#q6">
              06 · Minimum Window Substring
            </a>
            <a className="side-link" href="#q7">
              07 · Find All Anagrams in a String
            </a>
            <a className="side-link" href="#q8">
              08 · Fruit Into Baskets
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">More Practice</div>
            <a className="side-link" href="#q9">
              09 · Contains Duplicate II
            </a>
            <a className="side-link" href="#q10">
              10 · Longest Repeating Character Replacement
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Sliding Window</span>
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
              <h1>Sliding window, basic to medium</h1>
              <p>
                Eight questions, every one solved by growing and shrinking a
                window over the array or string — never by re-scanning from
                scratch. Each brute-force version recomputes a window from
                nothing; each optimal version slides it, updating only what
                changed.
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
                  Brute force
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
                  Sliding window
                </span>
              </div>
            </div>

            <section className="question" id="toolkit">
              <div className="q-head">
                <span className="q-index">00</span>
                <h2>How sliding window works</h2>
                <span className="level-badge reference">Reference</span>
              </div>
              <p className="prompt">
                A window is just a contiguous range{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "[left, right]" }}
                ></code>{" "}
                that you slide across the array or string, instead of restarting
                from scratch at every position. Every problem below is one of
                two shapes:
              </p>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="toolkit-approach">
                  <button
                    className="tab-btn tool active"
                    data-target="toolkit-fixed"
                  >
                    Fixed-size window
                  </button>
                  <button
                    className="tab-btn tool"
                    data-target="toolkit-variable"
                  >
                    Variable-size window
                  </button>
                </div>

                <div className="approach-panel active" id="toolkit-fixed">
                  <div className="complexity">
                    The window is always exactly k elements wide — build it
                    once, then slide it one step at a time: add what enters on
                    the right, remove what leaves on the left.
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-fixed-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="tp">int</span> windowSum = 0;\n<span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; k; i++) windowSum += arr[i];   <span class="cm">// build the first window</span>\n<span class="tp">int</span> best = windowSum;\n<span class="kw">for</span> (<span class="tp">int</span> i = k; i &lt; arr.length; i++) {\n    windowSum += arr[i] - arr[i - k];   <span class="cm">// slide: add the new element, drop the old one</span>\n    best = Math.max(best, windowSum);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-fixed-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'window_sum = <span class="kw">sum</span>(arr[:k])   <span class="cm"># build the first window</span>\nbest = window_sum\n<span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(k, <span class="kw">len</span>(arr)):\n    window_sum += arr[i] - arr[i - k]   <span class="cm"># slide: add the new element, drop the old one</span>\n    best = <span class="kw">max</span>(best, window_sum)',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="toolkit-variable">
                  <div className="complexity">
                    The window grows on the right to explore, and shrinks on the
                    left whenever it breaks a rule — both pointers only ever
                    move forward, which is what keeps this O(n) instead of
                    O(n²).
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-variable-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="tp">int</span> left = 0;\n<span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; arr.length; right++) {\n    <span class="cm">// expand: bring arr[right] into the window</span>\n    <span class="kw">while</span> (<span class="cm">/* window has broken some rule */</span> <span class="kw">false</span>) {\n        <span class="cm">// shrink: remove arr[left] from the window</span>\n        left++;\n    }\n    <span class="cm">// window [left, right] is valid here \u2014 update the answer</span>\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-variable-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'left = 0\n<span class="kw">for</span> right <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(arr)):\n    <span class="cm"># expand: bring arr[right] into the window</span>\n    <span class="kw">while</span> <span class="kw">False</span>:  <span class="cm"># replace with: window has broken some rule</span>\n        <span class="cm"># shrink: remove arr[left] from the window</span>\n        left += 1\n    <span class="cm"># window [left, right] is valid here \u2014 update the answer</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="twist">
                <strong>One step further:</strong> Both patterns only ever move{" "}
                <code dangerouslySetInnerHTML={{ __html: "left" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "right" }}></code>{" "}
                forward, never backward. Why does that alone guarantee the
                optimal version runs in O(n) instead of O(n·k) or O(n²)?
              </div>
            </section>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Maximum Sum Subarray of Size K</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, find
                the maximum sum of any contiguous subarray of exactly{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>{" "}
                elements.
              </p>
              <div className="example">
                Input: nums = [2, 1, 5, 1, 3, 2], k = 3 Output: 9 ([5, 1, 3])
              </div>

              <AlgoVisualizer
                title="Maximum Sum Subarray of Size K"
                approaches={maxSumSubarrayApproaches}
                defaultInput={[2, 1, 5, 1, 3, 2]}
                needsTarget
                defaultTarget={3}
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
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Time: <b>O(n · k)</b> · Space: <b>O(1)</b> — re-sum all k
                    elements at every starting position
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> maxSumSubarray(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span> maxSum = Integer.MIN_VALUE;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt;= n - k; i++) {\n        <span class="tp">int</span> sum = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; i + k; j++) {\n            sum += nums[j];\n        }\n        maxSum = Math.max(maxSum, sum);\n    }\n    <span class="kw">return</span> maxSum;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q1-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> max_sum_subarray(nums, k):\n    n = <span class="kw">len</span>(nums)\n    max_sum = <span class="kw">float</span>(<span class="st">\'-inf\'</span>)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - k + 1):\n        window_sum = <span class="kw">sum</span>(nums[i:i + k])\n        max_sum = <span class="kw">max</span>(max_sum, window_sum)\n    <span class="kw">return</span> max_sum',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — build the first
                    window once, then slide: add the entering element, drop the
                    leaving one
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> maxSumSubarray(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> windowSum = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; k; i++) {\n        windowSum += nums[i];\n    }\n    <span class="tp">int</span> maxSum = windowSum;\n    <span class="kw">for</span> (<span class="tp">int</span> i = k; i &lt; nums.length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    <span class="kw">return</span> maxSum;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q1-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> max_sum_subarray(nums, k):\n    window_sum = <span class="kw">sum</span>(nums[:k])\n    max_sum = window_sum\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(k, <span class="kw">len</span>(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = <span class="kw">max</span>(max_sum, window_sum)\n    <span class="kw">return</span> max_sum',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code> could be
                larger than the array itself — what should the function do, and
                does your sliding window handle that safely?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Maximum Average Subarray I</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, find
                the maximum average value of any contiguous subarray of exactly{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>{" "}
                elements.
              </p>
              <div className="example">
                Input: nums = [1, 12, -5, -6, 50, 3], k = 4 Output: 12.75 ([12,
                -5, -6, 50] -&gt; 51 / 4)
              </div>

              <AlgoVisualizer
                title="Maximum Average Subarray I"
                approaches={maxAverageSubarrayApproaches}
                defaultInput={[1, 12, -5, -6, 50, 3]}
                needsTarget
                defaultTarget={4}
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
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(n · k)</b> · Space: <b>O(1)</b> — re-sum all k
                    elements at every starting position, then divide
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public double</span> findMaxAverage(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">double</span> maxAvg = Double.NEGATIVE_INFINITY;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt;= n - k; i++) {\n        <span class="tp">int</span> sum = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; i + k; j++) {\n            sum += nums[j];\n        }\n        maxAvg = Math.max(maxAvg, (<span class="tp">double</span>) sum / k);\n    }\n    <span class="kw">return</span> maxAvg;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q2-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> find_max_average(nums, k):\n    n = <span class="kw">len</span>(nums)\n    max_avg = <span class="kw">float</span>(<span class="st">\'-inf\'</span>)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - k + 1):\n        window_sum = <span class="kw">sum</span>(nums[i:i + k])\n        max_avg = <span class="kw">max</span>(max_avg, window_sum / k)\n    <span class="kw">return</span> max_avg',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — track the running
                    sum, only divide by k once at the very end
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public double</span> findMaxAverage(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> windowSum = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; k; i++) {\n        windowSum += nums[i];\n    }\n    <span class="tp">int</span> maxSum = windowSum;\n    <span class="kw">for</span> (<span class="tp">int</span> i = k; i &lt; nums.length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    <span class="kw">return</span> (<span class="tp">double</span>) maxSum / k;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q2-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> find_max_average(nums, k):\n    window_sum = <span class="kw">sum</span>(nums[:k])\n    max_sum = window_sum\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(k, <span class="kw">len</span>(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = <span class="kw">max</span>(max_sum, window_sum)\n    <span class="kw">return</span> max_sum / k',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if some elements were
                negative — does the same slide-and-compare logic still find the
                true maximum average?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Minimum Size Subarray Sum</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array of <b>positive</b> integers{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>,
                return the length of the shortest contiguous subarray whose sum
                is at least{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>.
                Return <code dangerouslySetInnerHTML={{ __html: "0" }}></code>{" "}
                if no such subarray exists.
              </p>
              <div className="example">
                Input: target = 7, nums = [2, 3, 1, 2, 4, 3] Output: 2 ([4, 3])
              </div>

              <AlgoVisualizer
                title="Minimum Size Subarray Sum"
                approaches={minSizeSubarraySumApproaches}
                defaultInput={[2, 3, 1, 2, 4, 3]}
                needsTarget
                defaultTarget={7}
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
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — from every start,
                    grow the window from scratch until it's big enough
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> minSubArrayLen(<span class="tp">int</span> target, <span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span> minLen = Integer.MAX_VALUE;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">int</span> sum = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            sum += nums[j];\n            <span class="kw">if</span> (sum &gt;= target) {\n                minLen = Math.min(minLen, j - i + 1);\n                <span class="kw">break</span>;\n            }\n        }\n    }\n    <span class="kw">return</span> minLen == Integer.MAX_VALUE ? 0 : minLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q3-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_sub_array_len(target, nums):\n    n = <span class="kw">len</span>(nums)\n    min_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        total = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            total += nums[j]\n            <span class="kw">if</span> total &gt;= target:\n                min_len = <span class="kw">min</span>(min_len, j - i + 1)\n                <span class="kw">break</span>\n    <span class="kw">return</span> 0 <span class="kw">if</span> min_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> min_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — grow right to
                    gather sum, shrink left while the sum is already enough
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> minSubArrayLen(<span class="tp">int</span> target, <span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> left = 0, sum = 0;\n    <span class="tp">int</span> minLen = Integer.MAX_VALUE;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; nums.length; right++) {\n        sum += nums[right];\n        <span class="kw">while</span> (sum &gt;= target) {\n            minLen = Math.min(minLen, right - left + 1);\n            sum -= nums[left];\n            left++;\n        }\n    }\n    <span class="kw">return</span> minLen == Integer.MAX_VALUE ? 0 : minLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q3-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_sub_array_len(target, nums):\n    left = 0\n    total = 0\n    min_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    <span class="kw">for</span> right <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(nums)):\n        total += nums[right]\n        <span class="kw">while</span> total &gt;= target:\n            min_len = <span class="kw">min</span>(min_len, right - left + 1)\n            total -= nums[left]\n            left += 1\n    <span class="kw">return</span> 0 <span class="kw">if</span> min_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> min_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if the array could
                contain negative numbers — would shrinking the window while{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "sum &gt;= target" }}
                ></code>{" "}
                still be safe?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Longest Substring Without Repeating Characters</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a string{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code>, find
                the length of the longest substring that has no repeated
                characters.
              </p>
              <div className="example">
                Input: s = "abcabcbb" Output: 3 ("abc")
              </div>

              <AlgoVisualizer
                title="Longest Substring Without Repeating Characters"
                approaches={longestSubstringNoRepeatApproaches}
                defaultInput="abcabcbb"
                inputKind="string"
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
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    from every start, grow the window from scratch until a
                    repeat shows up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> lengthOfLongestSubstring(String s) {\n    <span class="tp">int</span> n = s.length();\n    <span class="tp">int</span> maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">boolean</span>[] seen = <span class="kw">new boolean</span>[128];\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            <span class="tp">char</span> c = s.charAt(j);\n            <span class="kw">if</span> (seen[c]) <span class="kw">break</span>;\n            seen[c] = <span class="kw">true</span>;\n            maxLen = Math.max(maxLen, j - i + 1);\n        }\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q4-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> length_of_longest_substring(s):\n    n = <span class="kw">len</span>(s)\n    max_len = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        seen = [<span class="kw">False</span>] * 128\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            c = s[j]\n            <span class="kw">if</span> seen[<span class="kw">ord</span>(c)]:\n                <span class="kw">break</span>\n            seen[<span class="kw">ord</span>(c)] = <span class="kw">True</span>\n            max_len = <span class="kw">max</span>(max_len, j - i + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    track each character's last position, jump left past a
                    repeat instead of restarting
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> lengthOfLongestSubstring(String s) {\n    <span class="tp">int</span>[] lastSeen = <span class="kw">new int</span>[128];\n    Arrays.fill(lastSeen, -1);\n    <span class="tp">int</span> left = 0, maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">char</span> c = s.charAt(right);\n        <span class="kw">if</span> (lastSeen[c] &gt;= left) {\n            left = lastSeen[c] + 1;\n        }\n        lastSeen[c] = right;\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q4-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> length_of_longest_substring(s):\n    last_seen = [-1] * 128\n    left = 0\n    max_len = 0\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        idx = <span class="kw">ord</span>(c)\n        <span class="kw">if</span> last_seen[idx] &gt;= left:\n            left = last_seen[idx] + 1\n        last_seen[idx] = right\n        max_len = <span class="kw">max</span>(max_len, right - left + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed the actual
                substring, not just its length — what extra bit of information
                would you need to track alongside{" "}
                <code dangerouslySetInnerHTML={{ __html: "maxLen" }}></code>?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Longest Substring with At Most K Distinct Characters</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given a string{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> and an
                integer <code dangerouslySetInnerHTML={{ __html: "k" }}></code>,
                find the length of the longest substring that contains at most{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code> distinct
                characters.
              </p>
              <div className="example">
                Input: s = "eceba", k = 2 Output: 3 ("ece")
              </div>

              <AlgoVisualizer
                title="Longest Substring with At Most K Distinct Characters"
                approaches={longestSubstringKDistinctApproaches}
                defaultInput="eceba"
                inputKind="string"
                needsTarget
                defaultTarget={2}
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
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q5-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    from every start, grow the window from scratch, counting
                    distinct characters as you go
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> lengthOfLongestSubstringKDistinct(String s, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = s.length();\n    <span class="tp">int</span> maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">int</span>[] freq = <span class="kw">new int</span>[128];\n        <span class="tp">int</span> distinct = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            <span class="tp">char</span> c = s.charAt(j);\n            <span class="kw">if</span> (freq[c] == 0) distinct++;\n            freq[c]++;\n            <span class="kw">if</span> (distinct &gt; k) <span class="kw">break</span>;\n            maxLen = Math.max(maxLen, j - i + 1);\n        }\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q5-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> length_of_longest_substring_k_distinct(s, k):\n    n = <span class="kw">len</span>(s)\n    max_len = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        freq = [0] * 128\n        distinct = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            c = s[j]\n            <span class="kw">if</span> freq[<span class="kw">ord</span>(c)] == 0:\n                distinct += 1\n            freq[<span class="kw">ord</span>(c)] += 1\n            <span class="kw">if</span> distinct &gt; k:\n                <span class="kw">break</span>\n            max_len = <span class="kw">max</span>(max_len, j - i + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    grow right, shrink left only while there are more than k
                    distinct characters
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> lengthOfLongestSubstringKDistinct(String s, <span class="tp">int</span> k) {\n    <span class="tp">int</span>[] freq = <span class="kw">new int</span>[128];\n    <span class="tp">int</span> distinct = 0, left = 0, maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">char</span> c = s.charAt(right);\n        <span class="kw">if</span> (freq[c] == 0) distinct++;\n        freq[c]++;\n        <span class="kw">while</span> (distinct &gt; k) {\n            <span class="tp">char</span> leftChar = s.charAt(left);\n            freq[leftChar]--;\n            <span class="kw">if</span> (freq[leftChar] == 0) distinct--;\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q5-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> length_of_longest_substring_k_distinct(s, k):\n    freq = [0] * 128\n    distinct = 0\n    left = 0\n    max_len = 0\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        idx = <span class="kw">ord</span>(c)\n        <span class="kw">if</span> freq[idx] == 0:\n            distinct += 1\n        freq[idx] += 1\n        <span class="kw">while</span> distinct &gt; k:\n            left_idx = <span class="kw">ord</span>(s[left])\n            freq[left_idx] -= 1\n            <span class="kw">if</span> freq[left_idx] == 0:\n                distinct -= 1\n            left += 1\n        max_len = <span class="kw">max</span>(max_len, right - left + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code> were 0 —
                what should the longest valid substring be, and does your loop
                handle that edge case correctly?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Minimum Window Substring</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given strings{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "t" }}></code>, find
                the shortest substring of{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> that
                contains every character of{" "}
                <code dangerouslySetInnerHTML={{ __html: "t" }}></code>,
                including repeats. Return{" "}
                <code dangerouslySetInnerHTML={{ __html: '""' }}></code> if none
                exists.
              </p>
              <div className="example">
                Input: s = "ADOBECODEBANC", t = "ABC" Output: "BANC"
              </div>

              <AlgoVisualizer
                title="Minimum Window Substring"
                approaches={minWindowSubstringApproaches}
                defaultInput="ADOBECODEBANC,ABC"
                inputKind="string"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q6-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q6-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q6-opt">
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q6-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    from every start, grow the window from scratch until it
                    covers all of t
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    <span class="tp">int</span>[] need = <span class="kw">new int</span>[128];\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need[c]++;\n    <span class="tp">int</span> n = s.length();\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">int</span>[] have = <span class="kw">new int</span>[128];\n        <span class="tp">int</span> matched = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            <span class="tp">char</span> c = s.charAt(j);\n            <span class="kw">if</span> (need[c] &gt; 0) {\n                have[c]++;\n                <span class="kw">if</span> (have[c] &lt;= need[c]) matched++;\n            }\n            <span class="kw">if</span> (matched == t.length()) {\n                <span class="kw">if</span> (j - i + 1 &lt; bestLen) {\n                    bestLen = j - i + 1;\n                    bestStart = i;\n                }\n                <span class="kw">break</span>;\n            }\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q6-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = [0] * 128\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[<span class="kw">ord</span>(c)] += 1\n    n = <span class="kw">len</span>(s)\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        have = [0] * 128\n        matched = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            idx = <span class="kw">ord</span>(s[j])\n            <span class="kw">if</span> need[idx] &gt; 0:\n                have[idx] += 1\n                <span class="kw">if</span> have[idx] &lt;= need[idx]:\n                    matched += 1\n            <span class="kw">if</span> matched == <span class="kw">len</span>(t):\n                <span class="kw">if</span> j - i + 1 &lt; best_len:\n                    best_len = j - i + 1\n                    best_start = i\n                <span class="kw">break</span>\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    grow right until valid, then shrink left as far as it stays
                    valid
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    <span class="tp">int</span>[] need = <span class="kw">new int</span>[128];\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need[c]++;\n    <span class="tp">int</span> required = t.length();\n    <span class="tp">int</span>[] have = <span class="kw">new int</span>[128];\n    <span class="tp">int</span> matched = 0, left = 0;\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">char</span> c = s.charAt(right);\n        <span class="kw">if</span> (need[c] &gt; 0) {\n            have[c]++;\n            <span class="kw">if</span> (have[c] &lt;= need[c]) matched++;\n        }\n        <span class="kw">while</span> (matched == required) {\n            <span class="kw">if</span> (right - left + 1 &lt; bestLen) {\n                bestLen = right - left + 1;\n                bestStart = left;\n            }\n            <span class="tp">char</span> leftChar = s.charAt(left);\n            <span class="kw">if</span> (need[leftChar] &gt; 0) {\n                <span class="kw">if</span> (have[leftChar] &lt;= need[leftChar]) matched--;\n                have[leftChar]--;\n            }\n            left++;\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q6-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = [0] * 128\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[<span class="kw">ord</span>(c)] += 1\n    required = <span class="kw">len</span>(t)\n    have = [0] * 128\n    matched = 0\n    left = 0\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        idx = <span class="kw">ord</span>(c)\n        <span class="kw">if</span> need[idx] &gt; 0:\n            have[idx] += 1\n            <span class="kw">if</span> have[idx] &lt;= need[idx]:\n                matched += 1\n        <span class="kw">while</span> matched == required:\n            <span class="kw">if</span> right - left + 1 &lt; best_len:\n                best_len = right - left + 1\n                best_start = left\n            left_idx = <span class="kw">ord</span>(s[left])\n            <span class="kw">if</span> need[left_idx] &gt; 0:\n                <span class="kw">if</span> have[left_idx] &lt;= need[left_idx]:\n                    matched -= 1\n                have[left_idx] -= 1\n            left += 1\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> If{" "}
                <code dangerouslySetInnerHTML={{ __html: "t" }}></code> has
                repeated characters, like{" "}
                <code dangerouslySetInnerHTML={{ __html: '"AABC"' }}></code>,
                why does counting{" "}
                <code dangerouslySetInnerHTML={{ __html: "matched" }}></code>{" "}
                characters (not just distinct ones) matter here?
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Find All Anagrams in a String</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given strings{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "p" }}></code>, return
                every starting index in{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> where a
                substring is an anagram of{" "}
                <code dangerouslySetInnerHTML={{ __html: "p" }}></code>.
              </p>
              <div className="example">
                Input: s = "cbaebabacd", p = "abc" Output: [0, 6]
              </div>

              <AlgoVisualizer
                title="Find All Anagrams in a String"
                approaches={findAllAnagramsApproaches}
                defaultInput="cbaebabacd,abc"
                inputKind="string"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q7-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q7-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q7-opt">
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q7-brute">
                  <div className="complexity">
                    Time: <b>O(n · m)</b> · Space: <b>O(1)</b> (fixed alphabet)
                    — rebuild the window's letter counts from scratch at every
                    position
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;Integer&gt; findAnagrams(String s, String p) {\n    List&lt;Integer&gt; result = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="tp">int</span> n = s.length(), m = p.length();\n    <span class="kw">if</span> (m &gt; n) <span class="kw">return</span> result;\n    <span class="tp">int</span>[] need = <span class="kw">new int</span>[128];\n    <span class="kw">for</span> (<span class="tp">char</span> c : p.toCharArray()) need[c]++;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt;= n - m; i++) {\n        <span class="tp">int</span>[] window = <span class="kw">new int</span>[128];\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; i + m; j++) {\n            window[s.charAt(j)]++;\n        }\n        <span class="kw">if</span> (Arrays.equals(window, need)) {\n            result.add(i);\n        }\n    }\n    <span class="kw">return</span> result;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q7-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> find_anagrams(s, p):\n    result = []\n    n, m = <span class="kw">len</span>(s), <span class="kw">len</span>(p)\n    <span class="kw">if</span> m &gt; n:\n        <span class="kw">return</span> result\n    need = [0] * 128\n    <span class="kw">for</span> c <span class="kw">in</span> p:\n        need[<span class="kw">ord</span>(c)] += 1\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - m + 1):\n        window = [0] * 128\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, i + m):\n            window[<span class="kw">ord</span>(s[j])] += 1\n        <span class="kw">if</span> window == need:\n            result.append(i)\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    the window is always exactly m wide: add what enters, remove
                    what leaves
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;Integer&gt; findAnagrams(String s, String p) {\n    List&lt;Integer&gt; result = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="tp">int</span> n = s.length(), m = p.length();\n    <span class="kw">if</span> (m &gt; n) <span class="kw">return</span> result;\n    <span class="tp">int</span>[] need = <span class="kw">new int</span>[128];\n    <span class="kw">for</span> (<span class="tp">char</span> c : p.toCharArray()) need[c]++;\n    <span class="tp">int</span>[] window = <span class="kw">new int</span>[128];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        window[s.charAt(i)]++;\n        <span class="kw">if</span> (i &gt;= m) {\n            window[s.charAt(i - m)]--;\n        }\n        <span class="kw">if</span> (i &gt;= m - 1 &amp;&amp; Arrays.equals(window, need)) {\n            result.add(i - m + 1);\n        }\n    }\n    <span class="kw">return</span> result;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q7-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> find_anagrams(s, p):\n    result = []\n    n, m = <span class="kw">len</span>(s), <span class="kw">len</span>(p)\n    <span class="kw">if</span> m &gt; n:\n        <span class="kw">return</span> result\n    need = [0] * 128\n    <span class="kw">for</span> c <span class="kw">in</span> p:\n        need[<span class="kw">ord</span>(c)] += 1\n    window = [0] * 128\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        window[<span class="kw">ord</span>(s[i])] += 1\n        <span class="kw">if</span> i &gt;= m:\n            window[<span class="kw">ord</span>(s[i - m])] -= 1\n        <span class="kw">if</span> i &gt;= m - 1 <span class="kw">and</span> window == need:\n            result.append(i - m + 1)\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Comparing two 128-length
                arrays on every step works fine here — but why would that become
                the slow part if this ran inside another, larger loop?
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Fruit Into Baskets</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "fruits" }}></code>{" "}
                where each value is a fruit type, find the length of the longest
                contiguous run that contains <b>at most 2</b> distinct fruit
                types.
              </p>
              <div className="example">
                Input: fruits = [1, 2, 3, 2, 2] Output: 4 ([2, 3, 2, 2])
              </div>

              <AlgoVisualizer
                title="Fruit Into Baskets"
                approaches={fruitIntoBasketsApproaches}
                defaultInput={[1, 2, 3, 2, 2]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q8-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q8-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q8-opt">
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q8-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> extra per window —
                    from every start, grow the window from scratch, counting
                    distinct types as you go
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> totalFruit(<span class="tp">int</span>[] fruits) {\n    <span class="tp">int</span> n = fruits.length;\n    <span class="tp">int</span> maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        Map&lt;Integer, Integer&gt; count = <span class="kw">new</span> HashMap&lt;&gt;();\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            count.merge(fruits[j], 1, Integer::sum);\n            <span class="kw">if</span> (count.size() &gt; 2) <span class="kw">break</span>;\n            maxLen = Math.max(maxLen, j - i + 1);\n        }\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q8-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> total_fruit(fruits):\n    n = <span class="kw">len</span>(fruits)\n    max_len = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        count = {}\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            count[fruits[j]] = count.get(fruits[j], 0) + 1\n            <span class="kw">if</span> <span class="kw">len</span>(count) &gt; 2:\n                <span class="kw">break</span>\n            max_len = <span class="kw">max</span>(max_len, j - i + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q8-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> extra (at most 3
                    types tracked at once) — grow right, shrink left only while
                    more than 2 types are in the window
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> totalFruit(<span class="tp">int</span>[] fruits) {\n    Map&lt;Integer, Integer&gt; count = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="tp">int</span> left = 0, maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; fruits.length; right++) {\n        count.merge(fruits[right], 1, Integer::sum);\n        <span class="kw">while</span> (count.size() &gt; 2) {\n            <span class="tp">int</span> leftType = fruits[left];\n            count.put(leftType, count.get(leftType) - 1);\n            <span class="kw">if</span> (count.get(leftType) == 0) count.remove(leftType);\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q8-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> total_fruit(fruits):\n    count = {}\n    left = 0\n    max_len = 0\n    <span class="kw">for</span> right, fruit <span class="kw">in</span> <span class="kw">enumerate</span>(fruits):\n        count[fruit] = count.get(fruit, 0) + 1\n        <span class="kw">while</span> <span class="kw">len</span>(count) &gt; 2:\n            left_fruit = fruits[left]\n            count[left_fruit] -= 1\n            <span class="kw">if</span> count[left_fruit] == 0:\n                <span class="kw">del</span> count[left_fruit]\n            left += 1\n        max_len = <span class="kw">max</span>(max_len, right - left + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you were allowed 3
                basket types instead of 2 — what's the only line in this
                solution that needs to change?
              </div>
            </section>

            <section className="question" id="q9">
              <div className="q-head">
                <span className="q-index">09</span>
                <h2>Contains Duplicate II</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, return{" "}
                <code dangerouslySetInnerHTML={{ __html: "true" }}></code> if
                there are two distinct indices{" "}
                <code dangerouslySetInnerHTML={{ __html: "i" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "j" }}></code> such
                that{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "nums[i] == nums[j]" }}
                ></code>{" "}
                and{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "abs(i - j) &lt;= k" }}
                ></code>
                .
              </p>
              <div className="example">
                Input: nums = [1, 2, 3, 1], k = 3 Output: true
              </div>

              <AlgoVisualizer
                title="Contains Duplicate II"
                approaches={containsDuplicateIIApproaches}
                defaultInput={[1, 2, 3, 1]}
                needsTarget
                defaultTarget={3}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q9-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q9-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q9-opt">
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q9-brute">
                  <div className="complexity">
                    Time: <b>O(n · k)</b> · Space: <b>O(1)</b> — from every
                    index, check the next k positions for a match
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q9-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> containsNearbyDuplicate(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt;= Math.min(i + k, n - 1); j++) {\n            <span class="kw">if</span> (nums[i] == nums[j]) {\n                <span class="kw">return true</span>;\n            }\n        }\n    }\n    <span class="kw">return false</span>;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q9-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> contains_nearby_duplicate(nums, k):\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, <span class="kw">min</span>(i + k, n - 1) + 1):\n            <span class="kw">if</span> nums[i] == nums[j]:\n                <span class="kw">return True</span>\n    <span class="kw">return False</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q9-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(min(n, k))</b> — keep a
                    window of the last k elements in a set; check membership
                    before adding, drop what falls out the back
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q9-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> containsNearbyDuplicate(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    Set&lt;Integer&gt; window = <span class="kw">new</span> HashSet&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; nums.length; i++) {\n        <span class="kw">if</span> (window.contains(nums[i])) {\n            <span class="kw">return true</span>;\n        }\n        window.add(nums[i]);\n        <span class="kw">if</span> (window.size() &gt; k) {\n            window.remove(nums[i - k]);\n        }\n    }\n    <span class="kw">return false</span>;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q9-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> contains_nearby_duplicate(nums, k):\n    window = <span class="kw">set</span>()\n    <span class="kw">for</span> i, num <span class="kw">in</span> <span class="kw">enumerate</span>(nums):\n        <span class="kw">if</span> num <span class="kw">in</span> window:\n            <span class="kw">return True</span>\n        window.add(num)\n        <span class="kw">if</span> <span class="kw">len</span>(window) &gt; k:\n            window.remove(nums[i - k])\n    <span class="kw">return False</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code> were 0 —
                should the function ever return true, and does your window's
                size check handle that automatically?
              </div>
            </section>

            <section className="question" id="q10">
              <div className="q-head">
                <span className="q-index">10</span>
                <h2>Longest Repeating Character Replacement</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given a string{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> of
                uppercase letters and an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, you may
                replace up to{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>{" "}
                characters with any other uppercase letter. Return the length of
                the longest substring you can make consist of a single repeating
                character.
              </p>
              <div className="example">
                Input: s = "AABABBA", k = 1 Output: 4 ("AABA" -&gt; "AAAA")
              </div>

              <AlgoVisualizer
                title="Longest Repeating Character Replacement"
                approaches={longestRepeatingCharReplacementApproaches}
                defaultInput="AABABBA"
                inputKind="string"
                needsTarget
                defaultTarget={1}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q10-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q10-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q10-opt">
                    Sliding Window
                  </button>
                </div>

                <div className="approach-panel active" id="q10-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    from every start, grow the window from scratch, recomputing
                    the most frequent letter as you go
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q10-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> characterReplacement(String s, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = s.length();\n    <span class="tp">int</span> maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">int</span>[] freq = <span class="kw">new int</span>[26];\n        <span class="tp">int</span> maxFreq = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) {\n            freq[s.charAt(j) - <span class="st">\'A\'</span>]++;\n            maxFreq = Math.max(maxFreq, freq[s.charAt(j) - <span class="st">\'A\'</span>]);\n            <span class="tp">int</span> windowLen = j - i + 1;\n            <span class="kw">if</span> (windowLen - maxFreq &lt;= k) {\n                maxLen = Math.max(maxLen, windowLen);\n            } <span class="kw">else</span> {\n                <span class="kw">break</span>;\n            }\n        }\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q10-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> character_replacement(s, k):\n    n = <span class="kw">len</span>(s)\n    max_len = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        freq = [0] * 26\n        max_freq = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n):\n            idx = <span class="kw">ord</span>(s[j]) - <span class="kw">ord</span>(<span class="st">\'A\'</span>)\n            freq[idx] += 1\n            max_freq = <span class="kw">max</span>(max_freq, freq[idx])\n            window_len = j - i + 1\n            <span class="kw">if</span> window_len - max_freq &lt;= k:\n                max_len = <span class="kw">max</span>(max_len, window_len)\n            <span class="kw">else</span>:\n                <span class="kw">break</span>\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q10-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    grow right, shrink left by exactly one step whenever the
                    window can't be fixed with k replacements
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q10-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> characterReplacement(String s, <span class="tp">int</span> k) {\n    <span class="tp">int</span>[] freq = <span class="kw">new int</span>[26];\n    <span class="tp">int</span> left = 0, maxFreq = 0, maxLen = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">int</span> idx = s.charAt(right) - <span class="st">\'A\'</span>;\n        freq[idx]++;\n        maxFreq = Math.max(maxFreq, freq[idx]);\n        <span class="kw">if</span> (right - left + 1 - maxFreq &gt; k) {\n            freq[s.charAt(left) - <span class="st">\'A\'</span>]--;\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    <span class="kw">return</span> maxLen;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q10-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> character_replacement(s, k):\n    freq = [0] * 26\n    left = 0\n    max_freq = 0\n    max_len = 0\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        idx = <span class="kw">ord</span>(c) - <span class="kw">ord</span>(<span class="st">\'A\'</span>)\n        freq[idx] += 1\n        max_freq = <span class="kw">max</span>(max_freq, freq[idx])\n        <span class="kw">if</span> right - left + 1 - max_freq &gt; k:\n            freq[<span class="kw">ord</span>(s[left]) - <span class="kw">ord</span>(<span class="st">\'A\'</span>)] -= 1\n            left += 1\n        max_len = <span class="kw">max</span>(max_len, right - left + 1)\n    <span class="kw">return</span> max_len',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong>{" "}
                <code dangerouslySetInnerHTML={{ __html: "maxFreq" }}></code> is
                never decreased, even after the window shrinks — why doesn't
                that let the algorithm accept an invalid window?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
