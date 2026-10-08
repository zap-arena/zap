import type React from "react";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  containsDuplicateApproaches,
  firstUniqueCharApproaches,
  groupAnagramsApproaches,
  longestConsecutiveApproaches,
  subarraySumApproaches,
  topKFrequentApproaches,
  twoSumApproaches,
  validAnagramApproaches,
} from "../../components/guide/hashingVisualizations";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function HashingDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Hashing</div>
          <div className="side-group">
            <div className="side-group-label">Reference</div>
            <a className="side-link" href="#toolkit">
              Map &amp; set basics
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Contains Duplicate
            </a>
            <a className="side-link" href="#q2">
              02 · Two Sum
            </a>
            <a className="side-link" href="#q3">
              03 · Valid Anagram
            </a>
            <a className="side-link" href="#q4">
              04 · First Unique Character
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q5">
              05 · Group Anagrams
            </a>
            <a className="side-link" href="#q6">
              06 · Top K Frequent Elements
            </a>
            <a className="side-link" href="#q7">
              07 · Subarray Sum Equals K
            </a>
            <a className="side-link" href="#q8">
              08 · Longest Consecutive Sequence
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Hashing</span>
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
              <h1>Hashing, basic to medium</h1>
              <p>
                Eight questions, each worked through in more than one way —
                starting from the first idea that comes to mind, through to the
                hash-based approach that gets you to linear time. Every approach
                ships with runnable Java and Python.
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
                  Sub-optimal
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
                  Optimal
                </span>
              </div>
            </div>

            <section className="question" id="toolkit">
              <div className="q-head">
                <span className="q-index">00</span>
                <h2>Map &amp; set basics</h2>
                <span className="level-badge reference">Reference</span>
              </div>
              <p className="prompt">
                Every approach below leans on one of two structures: a{" "}
                <b>map</b> (key → value, for counting or remembering "where have
                I seen this before") or a <b>set</b> (just membership, no value
                attached). Here's how to create, store into, read from, and
                print each one — in Java and Python — before the questions put
                them to use.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="toolkit-approach">
                  <button
                    className="tab-btn tool active"
                    data-target="toolkit-map"
                  >
                    Map / Dictionary
                  </button>
                  <button className="tab-btn tool" data-target="toolkit-set">
                    Set
                  </button>
                </div>

                <div className="approach-panel active" id="toolkit-map">
                  <div className="complexity">
                    Java: <b>HashMap&lt;K, V&gt;</b> · Python: <b>dict</b> —
                    average O(1) insert, lookup, and delete
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-map-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'Map&lt;String, Integer&gt; map = <span class="kw">new</span> HashMap&lt;&gt;();\n\n<span class="cm">// store \u2014 add a new key, or update one that already exists</span>\nmap.put(<span class="st">"apple"</span>, 3);\nmap.put(<span class="st">"banana"</span>, 5);\nmap.put(<span class="st">"apple"</span>, 4);              <span class="cm">// overwrites 3 with 4</span>\n\n<span class="cm">// read a value by key</span>\n<span class="tp">int</span> count = map.get(<span class="st">"apple"</span>);              <span class="cm">// 4</span>\n<span class="tp">int</span> missing = map.getOrDefault(<span class="st">"kiwi"</span>, 0); <span class="cm">// 0, no crash if key is absent</span>\n\n<span class="cm">// check whether a key exists</span>\n<span class="tp">boolean</span> has = map.containsKey(<span class="st">"banana"</span>);    <span class="cm">// true</span>\n\n<span class="cm">// remove a key, and check size</span>\nmap.remove(<span class="st">"banana"</span>);\n<span class="tp">int</span> size = map.size();                     <span class="cm">// 1</span>\n\n<span class="cm">// print every key/value pair</span>\n<span class="kw">for</span> (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {\n    System.out.println(entry.getKey() + <span class="st">" -&gt; "</span> + entry.getValue());\n}\n\n<span class="cm">// or print the whole map in one line</span>\nSystem.out.println(map);                    <span class="cm">// {apple=4}</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-map-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'counts = {}\n\n<span class="cm"># store \u2014 add a new key, or update one that already exists</span>\ncounts[<span class="st">"apple"</span>] = 3\ncounts[<span class="st">"banana"</span>] = 5\ncounts[<span class="st">"apple"</span>] = 4                  <span class="cm"># overwrites 3 with 4</span>\n\n<span class="cm"># read a value by key</span>\ncount = counts[<span class="st">"apple"</span>]                 <span class="cm"># 4 \u2014 raises KeyError if missing</span>\nmissing = counts.get(<span class="st">"kiwi"</span>, 0)        <span class="cm"># 0, no crash if key is absent</span>\n\n<span class="cm"># check whether a key exists</span>\nhas = <span class="st">"banana"</span> <span class="kw">in</span> counts               <span class="cm"># True</span>\n\n<span class="cm"># remove a key, and check size</span>\n<span class="kw">del</span> counts[<span class="st">"banana"</span>]\nsize = <span class="kw">len</span>(counts)                     <span class="cm"># 1</span>\n\n<span class="cm"># print every key/value pair</span>\n<span class="kw">for</span> key, value <span class="kw">in</span> counts.items():\n    <span class="kw">print</span>(key, <span class="st">"-&gt;"</span>, value)\n\n<span class="cm"># or print the whole dict in one line</span>\n<span class="kw">print</span>(counts)                        <span class="cm"># {\'apple\': 4}</span>\n\n<span class="cm"># collections.Counter \u2014 a dict built for exactly this, used a lot below</span>\n<span class="kw">from</span> collections <span class="kw">import</span> Counter\nfreq = Counter([<span class="st">"a"</span>, <span class="st">"b"</span>, <span class="st">"a"</span>])       <span class="cm"># Counter({\'a\': 2, \'b\': 1}), counts itself</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="toolkit-set">
                  <div className="complexity">
                    Java: <b>HashSet&lt;T&gt;</b> · Python: <b>set</b> — average
                    O(1) add, lookup, and delete; no values, no duplicates
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-set-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'Set&lt;Integer&gt; set = <span class="kw">new</span> HashSet&lt;&gt;();\n\n<span class="cm">// store</span>\nset.add(10);\nset.add(20);\nset.add(10);                    <span class="cm">// ignored \u2014 10 is already in the set</span>\n\n<span class="cm">// check membership</span>\n<span class="tp">boolean</span> has = set.contains(20);   <span class="cm">// true</span>\n\n<span class="cm">// remove, and check size</span>\nset.remove(10);\n<span class="tp">int</span> size = set.size();          <span class="cm">// 1</span>\n\n<span class="cm">// print every element</span>\n<span class="kw">for</span> (<span class="tp">int</span> value : set) {\n    System.out.println(value);\n}\n\n<span class="cm">// or print the whole set in one line</span>\nSystem.out.println(set);            <span class="cm">// [20]</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-set-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'seen = <span class="kw">set</span>()\n\n<span class="cm"># store</span>\nseen.add(10)\nseen.add(20)\nseen.add(10)                    <span class="cm"># ignored \u2014 10 is already in the set</span>\n\n<span class="cm"># check membership</span>\nhas = 20 <span class="kw">in</span> seen               <span class="cm"># True</span>\n\n<span class="cm"># remove, and check size</span>\nseen.discard(10)                <span class="cm"># like .remove(), but won\'t raise if missing</span>\nsize = <span class="kw">len</span>(seen)              <span class="cm"># 1</span>\n\n<span class="cm"># print every element</span>\n<span class="kw">for</span> value <span class="kw">in</span> seen:\n    <span class="kw">print</span>(value)\n\n<span class="cm"># or print the whole set in one line</span>\n<span class="kw">print</span>(seen)                    <span class="cm"># {20}</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="twist">
                <strong>One step further:</strong> Iteration order isn't
                guaranteed for a{" "}
                <code dangerouslySetInnerHTML={{ __html: "HashMap" }}></code>/
                <code dangerouslySetInnerHTML={{ __html: "HashSet" }}></code> or
                a plain Python{" "}
                <code dangerouslySetInnerHTML={{ __html: "set" }}></code> — if
                you need insertion order preserved, what structure would you
                reach for in each language?
              </div>
            </section>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Contains Duplicate</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an integer array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>,
                return{" "}
                <code dangerouslySetInnerHTML={{ __html: "true" }}></code> if
                any value appears at least twice, and{" "}
                <code dangerouslySetInnerHTML={{ __html: "false" }}></code> if
                every element is distinct.
              </p>
              <div className="example">
                Input: nums = [1, 2, 3, 1] Output: true Input: nums = [1, 2, 3,
                4] Output: false
              </div>

              <AlgoVisualizer
                title="Contains Duplicate"
                approaches={containsDuplicateApproaches}
                defaultInput={[1, 2, 3, 1]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q1-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q1-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — compare every pair
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> containsDuplicate(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; n; j++) {\n            <span class="kw">if</span> (nums[i] == nums[j]) <span class="kw">return true</span>;\n        }\n    }\n    <span class="kw">return false</span>;\n}',
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
                              '<span class="kw">def</span> contains_duplicate(nums):\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, n):\n            <span class="kw">if</span> nums[i] == nums[j]:\n                <span class="kw">return</span> <span class="kw">True</span>\n    <span class="kw">return</span> <span class="kw">False</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q1-sub">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(1)</b> extra (in-place
                    sort) — sort, then check neighbours
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> containsDuplicate(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span>[] arr = nums.clone();\n    Arrays.sort(arr);\n    <span class="kw">for</span> (<span class="tp">int</span> i = 1; i &lt; arr.length; i++) {\n        <span class="kw">if</span> (arr[i] == arr[i - 1]) <span class="kw">return true</span>;\n    }\n    <span class="kw">return false</span>;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q1-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> contains_duplicate(nums):\n    arr = <span class="kw">sorted</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(1, <span class="kw">len</span>(arr)):\n        <span class="kw">if</span> arr[i] == arr[i - 1]:\n            <span class="kw">return</span> <span class="kw">True</span>\n    <span class="kw">return</span> <span class="kw">False</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — hash map, one pass,
                    stop the moment a key repeats
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> containsDuplicate(<span class="tp">int</span>[] nums) {\n    Map&lt;Integer, Boolean&gt; seen = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        <span class="kw">if</span> (seen.containsKey(num)) <span class="kw">return true</span>;\n        seen.put(num, <span class="kw">true</span>);\n    }\n    <span class="kw">return false</span>;\n}',
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
                              '<span class="kw">def</span> contains_duplicate(nums):\n    seen = {}\n    <span class="kw">for</span> num <span class="kw">in</span> nums:\n        <span class="kw">if</span> num <span class="kw">in</span> seen:\n            <span class="kw">return</span> <span class="kw">True</span>\n        seen[num] = <span class="kw">True</span>\n    <span class="kw">return</span> <span class="kw">False</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed to return
                the duplicate value itself — and there could be more than one?
                Would a set still be enough, or do you need counts too?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Two Sum</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>,
                return the indices of the two numbers that add up to{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>.
                Assume exactly one solution exists.
              </p>
              <div className="example">
                Input: nums = [2, 7, 11, 15], target = 9 Output: [0, 1]
              </div>

              <AlgoVisualizer
                title="Two Sum"
                approaches={twoSumApproaches}
                defaultInput={[2, 7, 11, 15]}
                needsTarget
                defaultTarget={9}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q2-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q2-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q2-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — check every pair
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] twoSum(<span class="tp">int</span>[] nums, <span class="tp">int</span> target) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; n; j++) {\n            <span class="kw">if</span> (nums[i] + nums[j] == target) {\n                <span class="kw">return new int</span>[]{i, j};\n            }\n        }\n    }\n    <span class="kw">return new int</span>[]{-1, -1};\n}',
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
                              '<span class="kw">def</span> two_sum(nums, target):\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, n):\n            <span class="kw">if</span> nums[i] + nums[j] == target:\n                <span class="kw">return</span> [i, j]\n    <span class="kw">return</span> [-1, -1]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q2-sub">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(n)</b> — sort with
                    original indices, then two pointers
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] twoSum(<span class="tp">int</span>[] nums, <span class="tp">int</span> target) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span>[][] indexed = <span class="kw">new int</span>[n][2];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        indexed[i][0] = nums[i];\n        indexed[i][1] = i;\n    }\n    Arrays.sort(indexed, (a, b) -&gt; a[0] - b[0]);\n    <span class="tp">int</span> lo = 0, hi = n - 1;\n    <span class="kw">while</span> (lo &lt; hi) {\n        <span class="tp">int</span> sum = indexed[lo][0] + indexed[hi][0];\n        <span class="kw">if</span> (sum == target) {\n            <span class="kw">return new int</span>[]{indexed[lo][1], indexed[hi][1]};\n        } <span class="kw">else if</span> (sum &lt; target) lo++;\n        <span class="kw">else</span> hi--;\n    }\n    <span class="kw">return new int</span>[]{-1, -1};\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q2-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> two_sum(nums, target):\n    indexed = <span class="kw">sorted</span>(<span class="kw">enumerate</span>(nums), key=<span class="kw">lambda</span> pair: pair[1])\n    lo, hi = 0, <span class="kw">len</span>(indexed) - 1\n    <span class="kw">while</span> lo &lt; hi:\n        s = indexed[lo][1] + indexed[hi][1]\n        <span class="kw">if</span> s == target:\n            <span class="kw">return</span> [indexed[lo][0], indexed[hi][0]]\n        <span class="kw">elif</span> s &lt; target:\n            lo += 1\n        <span class="kw">else</span>:\n            hi -= 1\n    <span class="kw">return</span> [-1, -1]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — hash map of value →
                    index, one pass
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] twoSum(<span class="tp">int</span>[] nums, <span class="tp">int</span> target) {\n    Map&lt;Integer, Integer&gt; indexOf = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; nums.length; i++) {\n        <span class="tp">int</span> complement = target - nums[i];\n        <span class="kw">if</span> (indexOf.containsKey(complement)) {\n            <span class="kw">return new int</span>[]{indexOf.get(complement), i};\n        }\n        indexOf.put(nums[i], i);\n    }\n    <span class="kw">return new int</span>[]{-1, -1};\n}',
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
                              '<span class="kw">def</span> two_sum(nums, target):\n    index_of = {}\n    <span class="kw">for</span> i, num <span class="kw">in</span> <span class="kw">enumerate</span>(nums):\n        complement = target - num\n        <span class="kw">if</span> complement <span class="kw">in</span> index_of:\n            <span class="kw">return</span> [index_of[complement], i]\n        index_of[num] = i\n    <span class="kw">return</span> [-1, -1]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if more than one pair
                could sum to the target and you had to return every pair, with
                no duplicate pairs in the output?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Valid Anagram</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given two strings{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "t" }}></code>, return{" "}
                <code dangerouslySetInnerHTML={{ __html: "true" }}></code> if{" "}
                <code dangerouslySetInnerHTML={{ __html: "t" }}></code> is an
                anagram of{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code> — same
                letters, same counts, any order.
              </p>
              <div className="example">
                Input: s = "anagram", t = "nagaram" Output: true Input: s =
                "rat", t = "car" Output: false
              </div>

              <AlgoVisualizer
                title="Valid Anagram"
                approaches={validAnagramApproaches}
                defaultInput="anagram,nagaram"
                inputKind="string"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q3-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q3-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q3-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q3-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — for each letter in
                    s, remove its first match in t
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> isAnagram(String s, String t) {\n    <span class="kw">if</span> (s.length() != t.length()) <span class="kw">return false</span>;\n    List&lt;Character&gt; chars = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) chars.add(c);\n    <span class="kw">for</span> (<span class="tp">char</span> c : s.toCharArray()) {\n        <span class="kw">if</span> (!chars.remove((Character) c)) <span class="kw">return false</span>;\n    }\n    <span class="kw">return true</span>;\n}',
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
                              '<span class="kw">def</span> is_anagram(s, t):\n    <span class="kw">if</span> <span class="kw">len</span>(s) != <span class="kw">len</span>(t):\n        <span class="kw">return</span> <span class="kw">False</span>\n    remaining = <span class="kw">list</span>(t)\n    <span class="kw">for</span> ch <span class="kw">in</span> s:\n        <span class="kw">if</span> ch <span class="kw">in</span> remaining:\n            remaining.remove(ch)\n        <span class="kw">else</span>:\n            <span class="kw">return</span> <span class="kw">False</span>\n    <span class="kw">return</span> <span class="kw">True</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q3-sub">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(n)</b> — sort both
                    strings and compare
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> isAnagram(String s, String t) {\n    <span class="kw">if</span> (s.length() != t.length()) <span class="kw">return false</span>;\n    <span class="tp">char</span>[] sa = s.toCharArray();\n    <span class="tp">char</span>[] ta = t.toCharArray();\n    Arrays.sort(sa);\n    Arrays.sort(ta);\n    <span class="kw">return</span> Arrays.equals(sa, ta);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q3-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> is_anagram(s, t):\n    <span class="kw">return</span> <span class="kw">sorted</span>(s) == <span class="kw">sorted</span>(t)',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(k)</b> distinct characters —
                    one hash map counting pass
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> isAnagram(String s, String t) {\n    <span class="kw">if</span> (s.length() != t.length()) <span class="kw">return false</span>;\n    Map&lt;Character, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        freq.merge(s.charAt(i), 1, Integer::sum);\n        freq.merge(t.charAt(i), -1, Integer::sum);\n    }\n    <span class="kw">for</span> (<span class="tp">int</span> count : freq.values()) {\n        <span class="kw">if</span> (count != 0) <span class="kw">return false</span>;\n    }\n    <span class="kw">return true</span>;\n}',
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
                              '<span class="kw">def</span> is_anagram(s, t):\n    <span class="kw">if</span> <span class="kw">len</span>(s) != <span class="kw">len</span>(t):\n        <span class="kw">return</span> <span class="kw">False</span>\n    freq = {}\n    <span class="kw">for</span> a, b <span class="kw">in</span> <span class="kw">zip</span>(s, t):\n        freq[a] = freq.get(a, 0) + 1\n        freq[b] = freq.get(b, 0) - 1\n    <span class="kw">return</span> <span class="kw">all</span>(count == 0 <span class="kw">for</span> count <span class="kw">in</span> freq.values())',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Your optimal solution assumes
                lowercase a–z. What breaks if the strings can contain uppercase
                letters, digits, or Unicode — and how would you fix it?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>First Unique Character in a String</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a string{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code>, return
                the index of the first character that does not repeat. Return{" "}
                <code dangerouslySetInnerHTML={{ __html: "-1" }}></code> if
                every character repeats.
              </p>
              <div className="example">
                Input: s = "leetcode" Output: 0 ('l' is first and never repeats)
                Input: s = "loveleetcode" Output: 2 ('v')
              </div>
              <p className="note">
                Two natural approaches here — the hash-map version already
                reaches linear time, so there's no meaningful middle tier.
              </p>

              <AlgoVisualizer
                title="First Unique Character"
                approaches={firstUniqueCharApproaches}
                defaultInput="leetcode"
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
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — for each
                    character, rescan the whole string to count it
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> firstUniqChar(String s) {\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        <span class="tp">boolean</span> unique = <span class="kw">true</span>;\n        <span class="kw">for</span> (<span class="tp">int</span> j = 0; j &lt; s.length(); j++) {\n            <span class="kw">if</span> (i != j &amp;&amp; s.charAt(i) == s.charAt(j)) {\n                unique = <span class="kw">false</span>;\n                <span class="kw">break</span>;\n            }\n        }\n        <span class="kw">if</span> (unique) <span class="kw">return</span> i;\n    }\n    <span class="kw">return</span> -1;\n}',
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
                              '<span class="kw">def</span> first_uniq_char(s):\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n        unique = <span class="kw">True</span>\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n            <span class="kw">if</span> i != j <span class="kw">and</span> s[i] == s[j]:\n                unique = <span class="kw">False</span>\n                <span class="kw">break</span>\n        <span class="kw">if</span> unique:\n            <span class="kw">return</span> i\n    <span class="kw">return</span> -1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> (fixed alphabet) —
                    count once, then scan for the first count-of-1
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> firstUniqChar(String s) {\n    Map&lt;Character, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : s.toCharArray()) {\n        freq.merge(c, 1, Integer::sum);\n    }\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        <span class="kw">if</span> (freq.get(s.charAt(i)) == 1) <span class="kw">return</span> i;\n    }\n    <span class="kw">return</span> -1;\n}',
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
                              '<span class="kw">def</span> first_uniq_char(s):\n    freq = {}\n    <span class="kw">for</span> ch <span class="kw">in</span> s:\n        freq[ch] = freq.get(ch, 0) + 1\n    <span class="kw">for</span> i, ch <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        <span class="kw">if</span> freq[ch] == 1:\n            <span class="kw">return</span> i\n    <span class="kw">return</span> -1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed the first
                character that occurs exactly twice instead of exactly once?
                Does the same frequency-array idea still get you there in one
                pass?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Group Anagrams</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array of strings{" "}
                <code dangerouslySetInnerHTML={{ __html: "strs" }}></code>,
                group the anagrams together. Return the groups in any order.
              </p>
              <div className="example">
                Input: strs = ["eat","tea","tan","ate","nat","bat"] Output:
                [["eat","tea","ate"], ["tan","nat"], ["bat"]]
              </div>

              <AlgoVisualizer
                title="Group Anagrams"
                approaches={groupAnagramsApproaches}
                defaultInput="eat|tea|tan|ate|nat|bat"
                inputKind="string"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q5-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q5-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q5-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q5-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q5-brute">
                  <div className="complexity">
                    Time: <b>O(n² · k)</b> · Space: <b>O(n · k)</b> — compare
                    every string against every group's representative
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;List&lt;String&gt;&gt; groupAnagrams(String[] strs) {\n    List&lt;List&lt;String&gt;&gt; groups = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="tp">boolean</span>[] used = <span class="kw">new boolean</span>[strs.length];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; strs.length; i++) {\n        <span class="kw">if</span> (used[i]) <span class="kw">continue</span>;\n        List&lt;String&gt; group = <span class="kw">new</span> ArrayList&lt;&gt;();\n        group.add(strs[i]);\n        used[i] = <span class="kw">true</span>;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; strs.length; j++) {\n            <span class="kw">if</span> (!used[j] &amp;&amp; isAnagram(strs[i], strs[j])) {\n                group.add(strs[j]);\n                used[j] = <span class="kw">true</span>;\n            }\n        }\n        groups.add(group);\n    }\n    <span class="kw">return</span> groups;\n}\n<span class="kw">private boolean</span> isAnagram(String a, String b) {\n    <span class="kw">if</span> (a.length() != b.length()) <span class="kw">return false</span>;\n    Map&lt;Character, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; a.length(); i++) {\n        freq.merge(a.charAt(i), 1, Integer::sum);\n        freq.merge(b.charAt(i), -1, Integer::sum);\n    }\n    <span class="kw">for</span> (<span class="tp">int</span> count : freq.values()) <span class="kw">if</span> (count != 0) <span class="kw">return false</span>;\n    <span class="kw">return true</span>;\n}',
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
                              '<span class="kw">def</span> group_anagrams(strs):\n    groups = []\n    used = [<span class="kw">False</span>] * <span class="kw">len</span>(strs)\n    <span class="kw">for</span> i, s <span class="kw">in</span> <span class="kw">enumerate</span>(strs):\n        <span class="kw">if</span> used[i]:\n            <span class="kw">continue</span>\n        group = [s]\n        used[i] = <span class="kw">True</span>\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, <span class="kw">len</span>(strs)):\n            <span class="kw">if</span> <span class="kw">not</span> used[j] <span class="kw">and</span> <span class="kw">sorted</span>(s) == <span class="kw">sorted</span>(strs[j]):\n                group.append(strs[j])\n                used[j] = <span class="kw">True</span>\n        groups.append(group)\n    <span class="kw">return</span> groups',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q5-sub">
                  <div className="complexity">
                    Time: <b>O(n · k log k)</b> · Space: <b>O(n · k)</b> — hash
                    map keyed by the sorted string
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;List&lt;String&gt;&gt; groupAnagrams(String[] strs) {\n    Map&lt;String, List&lt;String&gt;&gt; groups = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (String s : strs) {\n        <span class="tp">char</span>[] chars = s.toCharArray();\n        Arrays.sort(chars);\n        String key = <span class="kw">new</span> String(chars);\n        groups.computeIfAbsent(key, k -&gt; <span class="kw">new</span> ArrayList&lt;&gt;()).add(s);\n    }\n    <span class="kw">return new</span> ArrayList&lt;&gt;(groups.values());\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q5-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">from</span> collections <span class="kw">import</span> defaultdict\n<span class="kw">def</span> group_anagrams(strs):\n    groups = defaultdict(<span class="kw">list</span>)\n    <span class="kw">for</span> s <span class="kw">in</span> strs:\n        key = <span class="st">""</span>.join(<span class="kw">sorted</span>(s))\n        groups[key].append(s)\n    <span class="kw">return list</span>(groups.values())',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n · k)</b> · Space: <b>O(n · k)</b> — hash map
                    keyed by a count signature built from another hash map, no
                    per-string sort
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;List&lt;String&gt;&gt; groupAnagrams(String[] strs) {\n    Map&lt;String, List&lt;String&gt;&gt; groups = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (String s : strs) {\n        Map&lt;Character, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n        <span class="kw">for</span> (<span class="tp">char</span> c : s.toCharArray()) {\n            freq.merge(c, 1, Integer::sum);\n        }\n        StringBuilder key = <span class="kw">new</span> StringBuilder();\n        <span class="kw">for</span> (<span class="tp">char</span> c = <span class="st">\'a\'</span>; c &lt;= <span class="st">\'z\'</span>; c++) {\n            key.append(<span class="st">\'#\'</span>).append(freq.getOrDefault(c, 0));\n        }\n        groups.computeIfAbsent(key.toString(), k -&gt; <span class="kw">new</span> ArrayList&lt;&gt;()).add(s);\n    }\n    <span class="kw">return new</span> ArrayList&lt;&gt;(groups.values());\n}',
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
                              '<span class="kw">from</span> collections <span class="kw">import</span> defaultdict\n<span class="kw">def</span> group_anagrams(strs):\n    groups = defaultdict(<span class="kw">list</span>)\n    <span class="kw">for</span> s <span class="kw">in</span> strs:\n        freq = {}\n        <span class="kw">for</span> ch <span class="kw">in</span> s:\n            freq[ch] = freq.get(ch, 0) + 1\n        key = <span class="st">""</span>.join(<span class="kw">f</span><span class="st">"#{freq.get(chr(c), 0)}"</span> <span class="kw">for</span> c <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">ord</span>(<span class="st">\'a\'</span>), <span class="kw">ord</span>(<span class="st">\'z\'</span>) + 1))\n        groups[key].append(s)\n    <span class="kw">return list</span>(groups.values())',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The key is built by looping
                over a fixed 'a' to 'z' range. What would you need to change
                about the key if the strings could contain uppercase letters or
                any Unicode character?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Top K Frequent Elements</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an integer array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, return
                the <code dangerouslySetInnerHTML={{ __html: "k" }}></code> most
                frequent elements, in any order.
              </p>
              <div className="example">
                Input: nums = [1,1,1,2,2,3], k = 2 Output: [1, 2]
              </div>

              <AlgoVisualizer
                title="Top K Frequent Elements"
                approaches={topKFrequentApproaches}
                defaultInput={[1, 1, 1, 2, 2, 3]}
                needsTarget
                defaultTarget={2}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q6-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q6-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q6-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q6-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q6-brute">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(n)</b> — count with a
                    hash map, sort all keys by frequency
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] topKFrequent(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    Map&lt;Integer, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        freq.merge(num, 1, Integer::sum);\n    }\n    List&lt;Integer&gt; keys = <span class="kw">new</span> ArrayList&lt;&gt;(freq.keySet());\n    keys.sort((a, b) -&gt; freq.get(b) - freq.get(a));\n    <span class="tp">int</span>[] result = <span class="kw">new int</span>[k];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; k; i++) {\n        result[i] = keys.get(i);\n    }\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">from</span> collections <span class="kw">import</span> Counter\n<span class="kw">def</span> top_k_frequent(nums, k):\n    freq = Counter(nums)\n    ordered = <span class="kw">sorted</span>(freq.items(), key=<span class="kw">lambda</span> pair: -pair[1])\n    <span class="kw">return</span> [num <span class="kw">for</span> num, _ <span class="kw">in</span> ordered[:k]]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q6-sub">
                  <div className="complexity">
                    Time: <b>O(n log k)</b> · Space: <b>O(n)</b> — count, then
                    keep a min-heap of size k
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] topKFrequent(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    Map&lt;Integer, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        freq.merge(num, 1, Integer::sum);\n    }\n    PriorityQueue&lt;<span class="tp">int</span>[]&gt; heap = <span class="kw">new</span> PriorityQueue&lt;&gt;((a, b) -&gt; a[1] - b[1]);\n    <span class="kw">for</span> (Map.Entry&lt;Integer, Integer&gt; entry : freq.entrySet()) {\n        heap.offer(<span class="kw">new int</span>[]{entry.getKey(), entry.getValue()});\n        <span class="kw">if</span> (heap.size() &gt; k) heap.poll();\n    }\n    <span class="tp">int</span>[] result = <span class="kw">new int</span>[k];\n    <span class="kw">for</span> (<span class="tp">int</span> i = k - 1; i &gt;= 0; i--) {\n        result[i] = heap.poll()[0];\n    }\n    <span class="kw">return</span> result;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q6-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">import</span> heapq\n<span class="kw">from</span> collections <span class="kw">import</span> Counter\n<span class="kw">def</span> top_k_frequent(nums, k):\n    freq = Counter(nums)\n    heap = []\n    <span class="kw">for</span> num, count <span class="kw">in</span> freq.items():\n        heapq.heappush(heap, (count, num))\n        <span class="kw">if</span> <span class="kw">len</span>(heap) &gt; k:\n            heapq.heappop(heap)\n    <span class="kw">return</span> [num <span class="kw">for</span> _, num <span class="kw">in</span> heap]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — bucket by frequency
                    using a second hash map, no comparisons needed
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] topKFrequent(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    Map&lt;Integer, Integer&gt; freq = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        freq.merge(num, 1, Integer::sum);\n    }\n    Map&lt;Integer, List&lt;Integer&gt;&gt; buckets = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (Map.Entry&lt;Integer, Integer&gt; entry : freq.entrySet()) {\n        buckets.computeIfAbsent(entry.getValue(), b -&gt; <span class="kw">new</span> ArrayList&lt;&gt;()).add(entry.getKey());\n    }\n    <span class="tp">int</span>[] result = <span class="kw">new int</span>[k];\n    <span class="tp">int</span> idx = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> f = nums.length; f &gt;= 1 &amp;&amp; idx &lt; k; f--) {\n        <span class="kw">for</span> (<span class="tp">int</span> num : buckets.getOrDefault(f, Collections.emptyList())) {\n            result[idx++] = num;\n            <span class="kw">if</span> (idx == k) <span class="kw">break</span>;\n        }\n    }\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">def</span> top_k_frequent(nums, k):\n    freq = {}\n    <span class="kw">for</span> num <span class="kw">in</span> nums:\n        freq[num] = freq.get(num, 0) + 1\n    buckets = {}\n    <span class="kw">for</span> num, count <span class="kw">in</span> freq.items():\n        buckets.setdefault(count, []).append(num)\n    result = []\n    <span class="kw">for</span> count <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(nums), 0, -1):\n        <span class="kw">for</span> num <span class="kw">in</span> buckets.get(count, []):\n            result.append(num)\n            <span class="kw">if</span> <span class="kw">len</span>(result) == k:\n                <span class="kw">return</span> result\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if the result had to be
                sorted by frequency (highest first), with ties broken by the
                smaller value? Which of the three approaches adapts most easily?
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Subarray Sum Equals K</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an integer array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> and
                an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>, return
                the number of contiguous subarrays whose sum equals{" "}
                <code dangerouslySetInnerHTML={{ __html: "k" }}></code>.
              </p>
              <div className="example">
                Input: nums = [1, 1, 1], k = 2 Output: 2 ([1,1] appears twice)
              </div>

              <AlgoVisualizer
                title="Subarray Sum Equals K"
                approaches={subarraySumApproaches}
                defaultInput={[1, 1, 1]}
                needsTarget
                defaultTarget={2}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q7-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q7-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q7-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q7-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q7-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — every start index,
                    growing the running sum as the end index moves
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> subarraySum(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> count = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; nums.length; i++) {\n        <span class="tp">int</span> sum = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; nums.length; j++) {\n            sum += nums[j];\n            <span class="kw">if</span> (sum == k) count++;\n        }\n    }\n    <span class="kw">return</span> count;\n}',
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
                              '<span class="kw">def</span> subarray_sum(nums, k):\n    count = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(nums)):\n        total = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, <span class="kw">len</span>(nums)):\n            total += nums[j]\n            <span class="kw">if</span> total == k:\n                count += 1\n    <span class="kw">return</span> count',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q7-sub">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — precompute prefix
                    sums, then check every pair of endpoints
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> subarraySum(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span>[] prefix = <span class="kw">new int</span>[n + 1];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        prefix[i + 1] = prefix[i] + nums[i];\n    }\n    <span class="tp">int</span> count = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt;= n; j++) {\n            <span class="kw">if</span> (prefix[j] - prefix[i] == k) count++;\n        }\n    }\n    <span class="kw">return</span> count;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q7-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> subarray_sum(nums, k):\n    n = <span class="kw">len</span>(nums)\n    prefix = [0] * (n + 1)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        prefix[i + 1] = prefix[i] + nums[i]\n    count = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, n + 1):\n            <span class="kw">if</span> prefix[j] - prefix[i] == k:\n                count += 1\n    <span class="kw">return</span> count',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — running prefix sum
                    + hash map of prefix-sum frequencies
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> subarraySum(<span class="tp">int</span>[] nums, <span class="tp">int</span> k) {\n    Map&lt;Integer, Integer&gt; prefixCount = <span class="kw">new</span> HashMap&lt;&gt;();\n    prefixCount.put(0, 1);\n    <span class="tp">int</span> sum = 0, count = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        sum += num;\n        count += prefixCount.getOrDefault(sum - k, 0);\n        prefixCount.merge(sum, 1, Integer::sum);\n    }\n    <span class="kw">return</span> count;\n}',
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
                              '<span class="kw">from</span> collections <span class="kw">import</span> defaultdict\n<span class="kw">def</span> subarray_sum(nums, k):\n    prefix_count = defaultdict(<span class="kw">int</span>)\n    prefix_count[0] = 1\n    total, count = 0, 0\n    <span class="kw">for</span> num <span class="kw">in</span> nums:\n        total += num\n        count += prefix_count[total - k]\n        prefix_count[total] += 1\n    <span class="kw">return</span> count',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if, instead of counting
                subarrays, you had to return the length of the longest subarray
                that sums to k? Does the same prefix-sum map still work, or does
                it need to store something different?
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Longest Consecutive Sequence</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an unsorted array of integers{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>,
                return the length of the longest run of consecutive integers.
                Must run in{" "}
                <code dangerouslySetInnerHTML={{ __html: "O(n)" }}></code> for
                full credit.
              </p>
              <div className="example">
                Input: nums = [100, 4, 200, 1, 3, 2] Output: 4 (the sequence is
                1, 2, 3, 4)
              </div>

              <AlgoVisualizer
                title="Longest Consecutive Sequence"
                approaches={longestConsecutiveApproaches}
                defaultInput={[100, 4, 200, 1, 3, 2]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q8-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q8-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn subopt" data-target="q8-sub">
                    Sub-Optimal
                  </button>
                  <button className="tab-btn optimal" data-target="q8-opt">
                    Optimal
                  </button>
                </div>

                <div className="approach-panel active" id="q8-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> (≈O(n³) with a naive linear{" "}
                    <code
                      dangerouslySetInnerHTML={{ __html: "contains" }}
                    ></code>
                    ) · Space: <b>O(1)</b> — from every number, walk forward
                    while the next value exists somewhere in the array
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> longestConsecutive(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> longest = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        <span class="tp">int</span> current = num;\n        <span class="tp">int</span> length = 1;\n        <span class="kw">while</span> (contains(nums, current + 1)) {\n            current++;\n            length++;\n        }\n        longest = Math.max(longest, length);\n    }\n    <span class="kw">return</span> longest;\n}\n<span class="kw">private boolean</span> contains(<span class="tp">int</span>[] nums, <span class="tp">int</span> target) {\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) {\n        <span class="kw">if</span> (num == target) <span class="kw">return true</span>;\n    }\n    <span class="kw">return false</span>;\n}',
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
                              '<span class="kw">def</span> longest_consecutive(nums):\n    longest = 0\n    <span class="kw">for</span> num <span class="kw">in</span> nums:\n        current = num\n        length = 1\n        <span class="kw">while</span> (current + 1) <span class="kw">in</span> nums:\n            current += 1\n            length += 1\n        longest = <span class="kw">max</span>(longest, length)\n    <span class="kw">return</span> longest',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q8-sub">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(n)</b> (or O(1) with
                    in-place sort) — sort, then scan once for the longest run
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-sub-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> longestConsecutive(<span class="tp">int</span>[] nums) {\n    <span class="kw">if</span> (nums.length == 0) <span class="kw">return</span> 0;\n    <span class="tp">int</span>[] arr = nums.clone();\n    Arrays.sort(arr);\n    <span class="tp">int</span> longest = 1, current = 1;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 1; i &lt; arr.length; i++) {\n        <span class="kw">if</span> (arr[i] == arr[i - 1]) <span class="kw">continue</span>;\n        <span class="kw">if</span> (arr[i] == arr[i - 1] + 1) {\n            current++;\n        } <span class="kw">else</span> {\n            current = 1;\n        }\n        longest = Math.max(longest, current);\n    }\n    <span class="kw">return</span> longest;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q8-sub-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> longest_consecutive(nums):\n    <span class="kw">if</span> <span class="kw">not</span> nums:\n        <span class="kw">return</span> 0\n    arr = <span class="kw">sorted</span>(nums)\n    longest = current = 1\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(1, <span class="kw">len</span>(arr)):\n        <span class="kw">if</span> arr[i] == arr[i - 1]:\n            <span class="kw">continue</span>\n        <span class="kw">if</span> arr[i] == arr[i - 1] + 1:\n            current += 1\n        <span class="kw">else</span>:\n            current = 1\n        longest = <span class="kw">max</span>(longest, current)\n    <span class="kw">return</span> longest',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q8-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — hash map for O(1)
                    membership; only start counting from a number whose
                    predecessor is absent
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> longestConsecutive(<span class="tp">int</span>[] nums) {\n    Map&lt;Integer, Boolean&gt; present = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">int</span> num : nums) present.put(num, <span class="kw">true</span>);\n    <span class="tp">int</span> longest = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> num : present.keySet()) {\n        <span class="kw">if</span> (!present.containsKey(num - 1)) {\n            <span class="tp">int</span> current = num;\n            <span class="tp">int</span> length = 1;\n            <span class="kw">while</span> (present.containsKey(current + 1)) {\n                current++;\n                length++;\n            }\n            longest = Math.max(longest, length);\n        }\n    }\n    <span class="kw">return</span> longest;\n}',
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
                              '<span class="kw">def</span> longest_consecutive(nums):\n    present = {}\n    <span class="kw">for</span> num <span class="kw">in</span> nums:\n        present[num] = <span class="kw">True</span>\n    longest = 0\n    <span class="kw">for</span> num <span class="kw">in</span> present:\n        <span class="kw">if</span> (num - 1) <span class="kw">not in</span> present:\n            current = num\n            length = 1\n            <span class="kw">while</span> (current + 1) <span class="kw">in</span> present:\n                current += 1\n                length += 1\n            longest = <span class="kw">max</span>(longest, length)\n    <span class="kw">return</span> longest',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you had to return the
                actual sequence of numbers, not just its length? Which approach
                makes that easiest to reconstruct?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
