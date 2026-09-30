import React from "react";
import { useGuideLogic } from "../../hooks/useGuideLogic";
import Navbar from "../../components/Navbar";

export default function TwoPointerDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Two Pointers</div>
          <div className="side-group">
            <div className="side-group-label">Reference</div>
            <a className="side-link" href="#toolkit">
              How two pointers work
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Reverse String
            </a>
            <a className="side-link" href="#q2">
              02 · Valid Palindrome
            </a>
            <a className="side-link" href="#q3">
              03 · Two Sum II — Sorted Array
            </a>
            <a className="side-link" href="#q4">
              04 · Move Zeroes
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q5">
              05 · Remove Duplicates from Sorted Array
            </a>
            <a className="side-link" href="#q6">
              06 · Container With Most Water
            </a>
            <a className="side-link" href="#q7">
              07 · 3Sum
            </a>
            <a className="side-link" href="#q8">
              08 · Trapping Rain Water
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">More Practice</div>
            <a className="side-link" href="#q9">
              09 · Squares of a Sorted Array
            </a>
            <a className="side-link" href="#q10">
              10 · Sort Colors
            </a>
            <a className="side-link" href="#q11">
              11 · Merge Sorted Array
            </a>
            <a className="side-link" href="#q12">
              12 · Boats to Save People
            </a>
            <a className="side-link" href="#q13">
              13 · Minimum Window Substring
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Two Pointers</span>
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

          <div className="content">
            <div className="intro">
              <h1>Two pointers, basic to medium</h1>
              <p>
                Eight questions, every single one solved by walking two index
                variables through the array or string — no hash maps, no sets,
                no extra arrays. Just a brute-force baseline next to the
                two-pointer version that gets you to linear time.
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
                  Two pointer
                </span>
              </div>
            </div>

            <section className="question" id="toolkit">
              <div className="q-head">
                <span className="q-index">00</span>
                <h2>How two pointers work</h2>
                <span className="level-badge reference">Reference</span>
              </div>
              <p className="prompt">
                Instead of one index crawling through the array, you keep{" "}
                <b>two</b> index variables and move them based on a rule — no
                extra data structure required. Almost every problem below is one
                of two shapes:
              </p>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="toolkit-approach">
                  <button
                    className="tab-btn tool active"
                    data-target="toolkit-converge"
                  >
                    Converging pointers
                  </button>
                  <button
                    className="tab-btn tool"
                    data-target="toolkit-fastslow"
                  >
                    Fast &amp; slow pointers
                  </button>
                </div>

                <div className="approach-panel active" id="toolkit-converge">
                  <div className="complexity">
                    One pointer starts at each end and they move toward each
                    other — used when the array is sorted, or you're comparing
                    from both sides in (like checking a palindrome).
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-converge-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="tp">int</span> left = 0, right = arr.length - 1;\n<span class="kw">while</span> (left &lt; right) {\n    <span class="cm">// look at arr[left] and arr[right] together</span>\n    <span class="cm">// decide which side to move, based on what you find</span>\n    left++;\n    right--;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-converge-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'left, right = 0, <span class="kw">len</span>(arr) - 1\n<span class="kw">while</span> left &lt; right:\n    <span class="cm"># look at arr[left] and arr[right] together</span>\n    <span class="cm"># decide which side to move, based on what you find</span>\n    left += 1\n    right -= 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="toolkit-fastslow">
                  <div className="complexity">
                    Both pointers start at the front and move the same
                    direction, but at different speeds — used to compact an
                    array in place (skip, overwrite, or shift elements) in one
                    pass.
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="toolkit-fastslow-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="tp">int</span> slow = 0;\n<span class="kw">for</span> (<span class="tp">int</span> fast = 0; fast &lt; arr.length; fast++) {\n    <span class="cm">// fast scans every element</span>\n    <span class="kw">if</span> (<span class="cm">/* arr[fast] belongs in the result */</span> <span class="kw">true</span>) {\n        arr[slow] = arr[fast];\n        slow++;                 <span class="cm">// slow only moves when we keep something</span>\n    }\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="toolkit-fastslow-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              'slow = 0\n<span class="kw">for</span> fast <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(arr)):\n    <span class="cm"># fast scans every element</span>\n    <span class="kw">if</span> <span class="kw">True</span>:  <span class="cm"># replace with: arr[fast] belongs in the result</span>\n        arr[slow] = arr[fast]\n        slow += 1                <span class="cm"># slow only moves when we keep something</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="twist">
                <strong>One step further:</strong> Both patterns get you to O(n)
                time with O(1) extra space. What do they have in common that
                makes an extra array or hash map unnecessary here?
              </div>
            </section>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Reverse String</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a character array{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code>, reverse
                it in place.
              </p>
              <div className="example">
                Input: s = ['h','e','l','l','o'] Output: ['o','l','l','e','h']
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q1-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — build a new
                    reversed copy, then write it back
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> reverseString(<span class="tp">char</span>[] s) {\n    <span class="tp">char</span>[] result = <span class="kw">new char</span>[s.length];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length; i++) {\n        result[i] = s[s.length - 1 - i];\n    }\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length; i++) {\n        s[i] = result[i];\n    }\n}',
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
                              '<span class="kw">def</span> reverse_string(s):\n    result = [<span class="kw">None</span>] * <span class="kw">len</span>(s)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n        result[i] = s[<span class="kw">len</span>(s) - 1 - i]\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n        s[i] = result[i]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — swap from both ends
                    inward, no copy needed
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q1-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> reverseString(<span class="tp">char</span>[] s) {\n    <span class="tp">int</span> left = 0, right = s.length - 1;\n    <span class="kw">while</span> (left &lt; right) {\n        <span class="tp">char</span> temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}',
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
                              '<span class="kw">def</span> reverse_string(s):\n    left, right = 0, <span class="kw">len</span>(s) - 1\n    <span class="kw">while</span> left &lt; right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed to reverse
                only the letters in the string, leaving digits and punctuation
                exactly where they were?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Valid Palindrome</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a string{" "}
                <code dangerouslySetInnerHTML={{ __html: "s" }}></code>, return{" "}
                <code dangerouslySetInnerHTML={{ __html: "true" }}></code> if
                it's a palindrome once you ignore case and skip anything that
                isn't a letter or digit.
              </p>
              <div className="example">
                Input: s = "A man, a plan, a canal: Panama" Output: true Input:
                s = "race a car" Output: false
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q2-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q2-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — build a cleaned
                    copy, then compare it to its own reverse
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> isPalindrome(String s) {\n    StringBuilder cleaned = <span class="kw">new</span> StringBuilder();\n    <span class="kw">for</span> (<span class="tp">char</span> c : s.toCharArray()) {\n        <span class="kw">if</span> (Character.isLetterOrDigit(c)) {\n            cleaned.append(Character.toLowerCase(c));\n        }\n    }\n    String forward = cleaned.toString();\n    String backward = <span class="kw">new</span> StringBuilder(forward).reverse().toString();\n    <span class="kw">return</span> forward.equals(backward);\n}',
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
                              '<span class="kw">def</span> is_palindrome(s):\n    cleaned = [ch.lower() <span class="kw">for</span> ch <span class="kw">in</span> s <span class="kw">if</span> ch.isalnum()]\n    forward = <span class="st">""</span>.join(cleaned)\n    backward = <span class="st">""</span>.join(<span class="kw">reversed</span>(cleaned))\n    <span class="kw">return</span> forward == backward',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — walk in from both
                    ends, skipping non-alphanumeric characters as you go
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q2-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public boolean</span> isPalindrome(String s) {\n    <span class="tp">int</span> left = 0, right = s.length() - 1;\n    <span class="kw">while</span> (left &lt; right) {\n        <span class="kw">while</span> (left &lt; right &amp;&amp; !Character.isLetterOrDigit(s.charAt(left))) left++;\n        <span class="kw">while</span> (left &lt; right &amp;&amp; !Character.isLetterOrDigit(s.charAt(right))) right--;\n        <span class="kw">if</span> (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {\n            <span class="kw">return false</span>;\n        }\n        left++;\n        right--;\n    }\n    <span class="kw">return true</span>;\n}',
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
                              '<span class="kw">def</span> is_palindrome(s):\n    left, right = 0, <span class="kw">len</span>(s) - 1\n    <span class="kw">while</span> left &lt; right:\n        <span class="kw">while</span> left &lt; right <span class="kw">and</span> <span class="kw">not</span> s[left].isalnum():\n            left += 1\n        <span class="kw">while</span> left &lt; right <span class="kw">and</span> <span class="kw">not</span> s[right].isalnum():\n            right -= 1\n        <span class="kw">if</span> s[left].lower() != s[right].lower():\n            <span class="kw">return</span> <span class="kw">False</span>\n        left += 1\n        right -= 1\n    <span class="kw">return</span> <span class="kw">True</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you were allowed to
                delete at most one character to still call it a palindrome —
                does the same two-pointer walk still work, or does it need a
                fallback?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Two Sum II — Sorted Array</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given a <b>sorted</b> array{" "}
                <code dangerouslySetInnerHTML={{ __html: "numbers" }}></code>{" "}
                and an integer{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>,
                return the 1-indexed positions of the two numbers that add up to{" "}
                <code dangerouslySetInnerHTML={{ __html: "target" }}></code>.
              </p>
              <div className="example">
                Input: numbers = [2, 7, 11, 15], target = 9 Output: [1, 2]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q3-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q3-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q3-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — check every pair,
                    ignoring that the array is sorted
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] twoSum(<span class="tp">int</span>[] numbers, <span class="tp">int</span> target) {\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; numbers.length; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; numbers.length; j++) {\n            <span class="kw">if</span> (numbers[i] + numbers[j] == target) {\n                <span class="kw">return new int</span>[]{i + 1, j + 1};\n            }\n        }\n    }\n    <span class="kw">return new int</span>[]{-1, -1};\n}',
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
                              '<span class="kw">def</span> two_sum(numbers, target):\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(numbers)):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, <span class="kw">len</span>(numbers)):\n            <span class="kw">if</span> numbers[i] + numbers[j] == target:\n                <span class="kw">return</span> [i + 1, j + 1]\n    <span class="kw">return</span> [-1, -1]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — the sort order
                    tells each pointer which way to move
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q3-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] twoSum(<span class="tp">int</span>[] numbers, <span class="tp">int</span> target) {\n    <span class="tp">int</span> left = 0, right = numbers.length - 1;\n    <span class="kw">while</span> (left &lt; right) {\n        <span class="tp">int</span> sum = numbers[left] + numbers[right];\n        <span class="kw">if</span> (sum == target) {\n            <span class="kw">return new int</span>[]{left + 1, right + 1};\n        } <span class="kw">else if</span> (sum &lt; target) {\n            left++;\n        } <span class="kw">else</span> {\n            right--;\n        }\n    }\n    <span class="kw">return new int</span>[]{-1, -1};\n}',
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
                              '<span class="kw">def</span> two_sum(numbers, target):\n    left, right = 0, <span class="kw">len</span>(numbers) - 1\n    <span class="kw">while</span> left &lt; right:\n        total = numbers[left] + numbers[right]\n        <span class="kw">if</span> total == target:\n            <span class="kw">return</span> [left + 1, right + 1]\n        <span class="kw">elif</span> total &lt; target:\n            left += 1\n        <span class="kw">else</span>:\n            right -= 1\n    <span class="kw">return</span> [-1, -1]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if the array wasn't
                sorted? Would two pointers still work directly, or would you
                need an extra step first — and what would that step cost you?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Move Zeroes</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>, move
                all <code dangerouslySetInnerHTML={{ __html: "0" }}></code>s to
                the end while keeping the relative order of the non-zero
                elements — in place.
              </p>
              <div className="example">
                Input: nums = [0, 1, 0, 3, 12] Output: [1, 3, 12, 0, 0]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q4-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q4-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q4-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — every time you
                    find a zero, shift everything after it left by one
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> moveZeroes(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span> i = 0;\n    <span class="kw">while</span> (i &lt; n - 1) {\n        <span class="kw">if</span> (nums[i] == 0) {\n            <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n - 1; j++) {\n                nums[j] = nums[j + 1];\n            }\n            nums[n - 1] = 0;\n        } <span class="kw">else</span> {\n            i++;\n        }\n    }\n}',
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
                              '<span class="kw">def</span> move_zeroes(nums):\n    n = <span class="kw">len</span>(nums)\n    i = 0\n    <span class="kw">while</span> i &lt; n - 1:\n        <span class="kw">if</span> nums[i] == 0:\n            <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, n - 1):\n                nums[j] = nums[j + 1]\n            nums[n - 1] = 0\n        <span class="kw">else</span>:\n            i += 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — fast/slow pointers,
                    swap non-zero values forward as you go
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q4-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> moveZeroes(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> slow = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> fast = 0; fast &lt; nums.length; fast++) {\n        <span class="kw">if</span> (nums[fast] != 0) {\n            <span class="tp">int</span> temp = nums[slow];\n            nums[slow] = nums[fast];\n            nums[fast] = temp;\n            slow++;\n        }\n    }\n}',
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
                              '<span class="kw">def</span> move_zeroes(nums):\n    slow = 0\n    <span class="kw">for</span> fast <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(nums)):\n        <span class="kw">if</span> nums[fast] != 0:\n            nums[slow], nums[fast] = nums[fast], nums[slow]\n            slow += 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if, instead of zeroes,
                you had to push all negative numbers to the end while keeping
                everyone else's relative order — does the same fast/slow rule
                still apply?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Remove Duplicates from Sorted Array</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given a <b>sorted</b> array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>,
                remove the duplicates in place so each value appears once, and
                return the new length.
              </p>
              <div className="example">
                Input: nums = [1, 1, 2, 2, 3] Output: 3 (nums becomes [1, 2, 3,
                ...])
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q5-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q5-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q5-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q5-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — every time you
                    find a duplicate, shift everything after it left by one
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> removeDuplicates(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span> i = 0;\n    <span class="kw">while</span> (i &lt; n - 1) {\n        <span class="kw">if</span> (nums[i] == nums[i + 1]) {\n            <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; n - 1; j++) {\n                nums[j] = nums[j + 1];\n            }\n            n--;\n        } <span class="kw">else</span> {\n            i++;\n        }\n    }\n    <span class="kw">return</span> n;\n}',
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
                              '<span class="kw">def</span> remove_duplicates(nums):\n    n = <span class="kw">len</span>(nums)\n    i = 0\n    <span class="kw">while</span> i &lt; n - 1:\n        <span class="kw">if</span> nums[i] == nums[i + 1]:\n            <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, n - 1):\n                nums[j] = nums[j + 1]\n            n -= 1\n        <span class="kw">else</span>:\n            i += 1\n    <span class="kw">return</span> n',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — fast/slow pointers,
                    slow only advances when a new value shows up
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q5-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> removeDuplicates(<span class="tp">int</span>[] nums) {\n    <span class="kw">if</span> (nums.length == 0) <span class="kw">return</span> 0;\n    <span class="tp">int</span> slow = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> fast = 1; fast &lt; nums.length; fast++) {\n        <span class="kw">if</span> (nums[fast] != nums[slow]) {\n            slow++;\n            nums[slow] = nums[fast];\n        }\n    }\n    <span class="kw">return</span> slow + 1;\n}',
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
                              '<span class="kw">def</span> remove_duplicates(nums):\n    <span class="kw">if</span> <span class="kw">not</span> nums:\n        <span class="kw">return</span> 0\n    slow = 0\n    <span class="kw">for</span> fast <span class="kw">in</span> <span class="kw">range</span>(1, <span class="kw">len</span>(nums)):\n        <span class="kw">if</span> nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    <span class="kw">return</span> slow + 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if each value were
                allowed to appear at most twice, instead of once — how would the
                condition that moves{" "}
                <code dangerouslySetInnerHTML={{ __html: "slow" }}></code>{" "}
                forward need to change?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Container With Most Water</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "height" }}></code>{" "}
                where{" "}
                <code dangerouslySetInnerHTML={{ __html: "height[i]" }}></code>{" "}
                is the height of a vertical line at position{" "}
                <code dangerouslySetInnerHTML={{ __html: "i" }}></code>, find
                two lines that, together with the x-axis, hold the most water.
              </p>
              <div className="example">
                Input: height = [1, 8, 6, 2, 5, 4, 8, 3, 7] Output: 49
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q6-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q6-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q6-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q6-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — check every pair
                    of lines
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> maxArea(<span class="tp">int</span>[] height) {\n    <span class="tp">int</span> max = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; height.length; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; height.length; j++) {\n            <span class="tp">int</span> area = Math.min(height[i], height[j]) * (j - i);\n            max = Math.max(max, area);\n        }\n    }\n    <span class="kw">return</span> max;\n}',
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
                              '<span class="kw">def</span> max_area(height):\n    best = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(height)):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, <span class="kw">len</span>(height)):\n            area = <span class="kw">min</span>(height[i], height[j]) * (j - i)\n            best = <span class="kw">max</span>(best, area)\n    <span class="kw">return</span> best',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — start at both ends,
                    always move the pointer at the shorter line
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q6-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> maxArea(<span class="tp">int</span>[] height) {\n    <span class="tp">int</span> left = 0, right = height.length - 1;\n    <span class="tp">int</span> max = 0;\n    <span class="kw">while</span> (left &lt; right) {\n        <span class="tp">int</span> area = Math.min(height[left], height[right]) * (right - left);\n        max = Math.max(max, area);\n        <span class="kw">if</span> (height[left] &lt; height[right]) {\n            left++;\n        } <span class="kw">else</span> {\n            right--;\n        }\n    }\n    <span class="kw">return</span> max;\n}',
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
                              '<span class="kw">def</span> max_area(height):\n    left, right = 0, <span class="kw">len</span>(height) - 1\n    best = 0\n    <span class="kw">while</span> left &lt; right:\n        area = <span class="kw">min</span>(height[left], height[right]) * (right - left)\n        best = <span class="kw">max</span>(best, area)\n        <span class="kw">if</span> height[left] &lt; height[right]:\n            left += 1\n        <span class="kw">else</span>:\n            right -= 1\n    <span class="kw">return</span> best',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why is it always safe to move
                the pointer at the shorter line inward, and never the taller
                one?
              </div>
            </section>

            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>3Sum</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>,
                return all unique triplets{" "}
                <code dangerouslySetInnerHTML={{ __html: "[a, b, c]" }}></code>{" "}
                such that{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "a + b + c == 0" }}
                ></code>
                . No duplicate triplets in the output.
              </p>
              <div className="example">
                Input: nums = [-1, 0, 1, 2, -1, -4] Output: [[-1, -1, 2], [-1,
                0, 1]]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q7-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q7-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q7-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q7-brute">
                  <div className="complexity">
                    Time: <b>O(n³)</b> · Space: <b>O(1)</b> extra — sort first
                    so duplicates sit next to each other, then check every
                    triple
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;List&lt;Integer&gt;&gt; threeSum(<span class="tp">int</span>[] nums) {\n    Arrays.sort(nums);\n    List&lt;List&lt;Integer&gt;&gt; result = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n - 2; i++) {\n        <span class="kw">if</span> (i &gt; 0 &amp;&amp; nums[i] == nums[i - 1]) <span class="kw">continue</span>;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + 1; j &lt; n - 1; j++) {\n            <span class="kw">if</span> (j &gt; i + 1 &amp;&amp; nums[j] == nums[j - 1]) <span class="kw">continue</span>;\n            <span class="kw">for</span> (<span class="tp">int</span> k = j + 1; k &lt; n; k++) {\n                <span class="kw">if</span> (k &gt; j + 1 &amp;&amp; nums[k] == nums[k - 1]) <span class="kw">continue</span>;\n                <span class="kw">if</span> (nums[i] + nums[j] + nums[k] == 0) {\n                    result.add(Arrays.asList(nums[i], nums[j], nums[k]));\n                }\n            }\n        }\n    }\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">def</span> three_sum(nums):\n    nums.sort()\n    result = []\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - 2):\n        <span class="kw">if</span> i &gt; 0 <span class="kw">and</span> nums[i] == nums[i - 1]:\n            <span class="kw">continue</span>\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + 1, n - 1):\n            <span class="kw">if</span> j &gt; i + 1 <span class="kw">and</span> nums[j] == nums[j - 1]:\n                <span class="kw">continue</span>\n            <span class="kw">for</span> k <span class="kw">in</span> <span class="kw">range</span>(j + 1, n):\n                <span class="kw">if</span> k &gt; j + 1 <span class="kw">and</span> nums[k] == nums[k - 1]:\n                    <span class="kw">continue</span>\n                <span class="kw">if</span> nums[i] + nums[j] + nums[k] == 0:\n                    result.append([nums[i], nums[j], nums[k]])\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> extra — fix one
                    number, then two-pointer sweep the rest for a pair that
                    cancels it out
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q7-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> List&lt;List&lt;Integer&gt;&gt; threeSum(<span class="tp">int</span>[] nums) {\n    Arrays.sort(nums);\n    List&lt;List&lt;Integer&gt;&gt; result = <span class="kw">new</span> ArrayList&lt;&gt;();\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n - 2; i++) {\n        <span class="kw">if</span> (i &gt; 0 &amp;&amp; nums[i] == nums[i - 1]) <span class="kw">continue</span>;\n        <span class="tp">int</span> left = i + 1, right = n - 1;\n        <span class="kw">while</span> (left &lt; right) {\n            <span class="tp">int</span> sum = nums[i] + nums[left] + nums[right];\n            <span class="kw">if</span> (sum == 0) {\n                result.add(Arrays.asList(nums[i], nums[left], nums[right]));\n                left++;\n                right--;\n                <span class="kw">while</span> (left &lt; right &amp;&amp; nums[left] == nums[left - 1]) left++;\n                <span class="kw">while</span> (left &lt; right &amp;&amp; nums[right] == nums[right + 1]) right--;\n            } <span class="kw">else if</span> (sum &lt; 0) {\n                left++;\n            } <span class="kw">else</span> {\n                right--;\n            }\n        }\n    }\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">def</span> three_sum(nums):\n    nums.sort()\n    result = []\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - 2):\n        <span class="kw">if</span> i &gt; 0 <span class="kw">and</span> nums[i] == nums[i - 1]:\n            <span class="kw">continue</span>\n        left, right = i + 1, n - 1\n        <span class="kw">while</span> left &lt; right:\n            total = nums[i] + nums[left] + nums[right]\n            <span class="kw">if</span> total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                left += 1\n                right -= 1\n                <span class="kw">while</span> left &lt; right <span class="kw">and</span> nums[left] == nums[left - 1]:\n                    left += 1\n                <span class="kw">while</span> left &lt; right <span class="kw">and</span> nums[right] == nums[right + 1]:\n                    right -= 1\n            <span class="kw">elif</span> total &lt; 0:\n                left += 1\n            <span class="kw">else</span>:\n                right -= 1\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if you needed 4 numbers
                that sum to a target instead of 3 — how would you extend this
                same fix-one-and-sweep pattern?
              </div>
            </section>

            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Trapping Rain Water</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "height" }}></code>{" "}
                representing an elevation map, return how much water it can trap
                after raining.
              </p>
              <div className="example">
                Input: height = [0,1,0,2,1,0,1,3,2,1,2,1] Output: 6
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q8-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q8-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q8-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q8-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — for every
                    position, rescan left and right to find the tallest wall on
                    each side
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> trap(<span class="tp">int</span>[] height) {\n    <span class="tp">int</span> total = 0;\n    <span class="tp">int</span> n = height.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="tp">int</span> leftMax = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = 0; j &lt;= i; j++) leftMax = Math.max(leftMax, height[j]);\n        <span class="tp">int</span> rightMax = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; n; j++) rightMax = Math.max(rightMax, height[j]);\n        total += Math.min(leftMax, rightMax) - height[i];\n    }\n    <span class="kw">return</span> total;\n}',
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
                              '<span class="kw">def</span> trap(height):\n    total = 0\n    n = <span class="kw">len</span>(height)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        left_max = <span class="kw">max</span>(height[:i + 1])\n        right_max = <span class="kw">max</span>(height[i:])\n        total += <span class="kw">min</span>(left_max, right_max) - height[i]\n    <span class="kw">return</span> total',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q8-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — track the running
                    max from each side, move whichever pointer sees the shorter
                    wall
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q8-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> trap(<span class="tp">int</span>[] height) {\n    <span class="tp">int</span> left = 0, right = height.length - 1;\n    <span class="tp">int</span> leftMax = 0, rightMax = 0;\n    <span class="tp">int</span> total = 0;\n    <span class="kw">while</span> (left &lt; right) {\n        <span class="kw">if</span> (height[left] &lt;= height[right]) {\n            leftMax = Math.max(leftMax, height[left]);\n            total += leftMax - height[left];\n            left++;\n        } <span class="kw">else</span> {\n            rightMax = Math.max(rightMax, height[right]);\n            total += rightMax - height[right];\n            right--;\n        }\n    }\n    <span class="kw">return</span> total;\n}',
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
                              '<span class="kw">def</span> trap(height):\n    left, right = 0, <span class="kw">len</span>(height) - 1\n    left_max = right_max = 0\n    total = 0\n    <span class="kw">while</span> left &lt; right:\n        <span class="kw">if</span> height[left] &lt;= height[right]:\n            left_max = <span class="kw">max</span>(left_max, height[left])\n            total += left_max - height[left]\n            left += 1\n        <span class="kw">else</span>:\n            right_max = <span class="kw">max</span>(right_max, height[right])\n            total += right_max - height[right]\n            right -= 1\n    <span class="kw">return</span> total',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why is comparing{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "height[left]" }}
                ></code>{" "}
                and{" "}
                <code
                  dangerouslySetInnerHTML={{ __html: "height[right]" }}
                ></code>{" "}
                enough to know that one side's trapped water is already fully
                decided?
              </div>
            </section>

            <section className="question" id="q9">
              <div className="q-head">
                <span className="q-index">09</span>
                <h2>Squares of a Sorted Array</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given an integer array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code>{" "}
                sorted in non-decreasing order (it may contain negatives),
                return an array of the squares of each number, also sorted in
                non-decreasing order.
              </p>
              <div className="example">
                Input: nums = [-4, -1, 0, 3, 10] Output: [0, 1, 9, 16, 100]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q9-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q9-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q9-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q9-brute">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(n)</b> — square every
                    element, then sort the result
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q9-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] sortedSquares(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span>[] result = <span class="kw">new int</span>[n];\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        result[i] = nums[i] * nums[i];\n    }\n    Arrays.sort(result);\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">def</span> sorted_squares(nums):\n    result = [x * x <span class="kw">for</span> x <span class="kw">in</span> nums]\n    result.sort()\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q9-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> for the output — the
                    largest square always sits at one of the two ends, so fill
                    the answer from the back
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q9-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span>[] sortedSquares(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="tp">int</span>[] result = <span class="kw">new int</span>[n];\n    <span class="tp">int</span> left = 0, right = n - 1;\n    <span class="kw">for</span> (<span class="tp">int</span> i = n - 1; i &gt;= 0; i--) {\n        <span class="tp">int</span> leftSq = nums[left] * nums[left];\n        <span class="tp">int</span> rightSq = nums[right] * nums[right];\n        <span class="kw">if</span> (leftSq &gt; rightSq) {\n            result[i] = leftSq;\n            left++;\n        } <span class="kw">else</span> {\n            result[i] = rightSq;\n            right--;\n        }\n    }\n    <span class="kw">return</span> result;\n}',
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
                              '<span class="kw">def</span> sorted_squares(nums):\n    n = <span class="kw">len</span>(nums)\n    result = [0] * n\n    left, right = 0, n - 1\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n - 1, -1, -1):\n        left_sq = nums[left] * nums[left]\n        right_sq = nums[right] * nums[right]\n        <span class="kw">if</span> left_sq &gt; right_sq:\n            result[i] = left_sq\n            left += 1\n        <span class="kw">else</span>:\n            result[i] = right_sq\n            right -= 1\n    <span class="kw">return</span> result',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if the array had no
                negative numbers at all — could you skip the two-pointer
                comparison entirely? How would your code detect that case?
              </div>
            </section>

            <section className="question" id="q10">
              <div className="q-head">
                <span className="q-index">10</span>
                <h2>Sort Colors</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums" }}></code> with
                only the values{" "}
                <code dangerouslySetInnerHTML={{ __html: "0" }}></code>,{" "}
                <code dangerouslySetInnerHTML={{ __html: "1" }}></code>, and{" "}
                <code dangerouslySetInnerHTML={{ __html: "2" }}></code>{" "}
                (representing red, white, and blue), sort it in place — without
                using a sorting library — so equal values end up adjacent, in
                the order 0, 1, 2.
              </p>
              <div className="example">
                Input: nums = [2, 0, 2, 1, 1, 0] Output: [0, 0, 1, 1, 2, 2]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q10-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q10-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q10-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q10-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(1)</b> — bubble the larger
                    values toward the end, one adjacent swap at a time
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q10-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> sortColors(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> n = nums.length;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = 0; j &lt; n - i - 1; j++) {\n            <span class="kw">if</span> (nums[j] &gt; nums[j + 1]) {\n                <span class="tp">int</span> temp = nums[j];\n                nums[j] = nums[j + 1];\n                nums[j + 1] = temp;\n            }\n        }\n    }\n}',
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
                              '<span class="kw">def</span> sort_colors(nums):\n    n = <span class="kw">len</span>(nums)\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(n - i - 1):\n            <span class="kw">if</span> nums[j] &gt; nums[j + 1]:\n                nums[j], nums[j + 1] = nums[j + 1], nums[j]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q10-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — Dutch National Flag
                    partition: three pointers split the array into 0s, 1s, and
                    2s in a single pass
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q10-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> sortColors(<span class="tp">int</span>[] nums) {\n    <span class="tp">int</span> low = 0, mid = 0, high = nums.length - 1;\n    <span class="kw">while</span> (mid &lt;= high) {\n        <span class="kw">if</span> (nums[mid] == 0) {\n            swap(nums, low, mid);\n            low++;\n            mid++;\n        } <span class="kw">else if</span> (nums[mid] == 1) {\n            mid++;\n        } <span class="kw">else</span> {\n            swap(nums, mid, high);\n            high--;\n        }\n    }\n}\n\n<span class="kw">private void</span> swap(<span class="tp">int</span>[] nums, <span class="tp">int</span> i, <span class="tp">int</span> j) {\n    <span class="tp">int</span> temp = nums[i];\n    nums[i] = nums[j];\n    nums[j] = temp;\n}',
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
                              '<span class="kw">def</span> sort_colors(nums):\n    low, mid, high = 0, 0, <span class="kw">len</span>(nums) - 1\n    <span class="kw">while</span> mid &lt;= high:\n        <span class="kw">if</span> nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        <span class="kw">elif</span> nums[mid] == 1:\n            mid += 1\n        <span class="kw">else</span>:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> What if there were 4 distinct
                values instead of 3 — does the three-pointer partition still
                generalize, or would you need a different approach entirely?
              </div>
            </section>

            <section className="question" id="q11">
              <div className="q-head">
                <span className="q-index">11</span>
                <h2>Merge Sorted Array</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                You're given two sorted arrays{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums1" }}></code> and{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums2" }}></code>.{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums1" }}></code> has
                length{" "}
                <code dangerouslySetInnerHTML={{ __html: "m + n" }}></code> —
                its first{" "}
                <code dangerouslySetInnerHTML={{ __html: "m" }}></code> elements
                are valid, and the last{" "}
                <code dangerouslySetInnerHTML={{ __html: "n" }}></code> are
                placeholders. Merge{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums2" }}></code> into{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums1" }}></code> in
                place so{" "}
                <code dangerouslySetInnerHTML={{ __html: "nums1" }}></code>{" "}
                becomes one sorted array.
              </p>
              <div className="example">
                Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n =
                3 Output: [1, 2, 2, 3, 5, 6]
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q11-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q11-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q11-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q11-brute">
                  <div className="complexity">
                    Time: <b>O((m+n) log(m+n))</b> · Space: <b>O(1)</b> extra —
                    copy nums2 into the empty slots, then sort the whole array
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q11-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> merge(<span class="tp">int</span>[] nums1, <span class="tp">int</span> m, <span class="tp">int</span>[] nums2, <span class="tp">int</span> n) {\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        nums1[m + i] = nums2[i];\n    }\n    Arrays.sort(nums1);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q11-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> merge(nums1, m, nums2, n):\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        nums1[m + i] = nums2[i]\n    nums1.sort()',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q11-opt">
                  <div className="complexity">
                    Time: <b>O(m + n)</b> · Space: <b>O(1)</b> — fill nums1 from
                    the back, always placing the larger of the two current tails
                    so nothing gets overwritten before it's read
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q11-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public void</span> merge(<span class="tp">int</span>[] nums1, <span class="tp">int</span> m, <span class="tp">int</span>[] nums2, <span class="tp">int</span> n) {\n    <span class="tp">int</span> i = m - 1, j = n - 1, k = m + n - 1;\n    <span class="kw">while</span> (j &gt;= 0) {\n        <span class="kw">if</span> (i &gt;= 0 &amp;&amp; nums1[i] &gt; nums2[j]) {\n            nums1[k--] = nums1[i--];\n        } <span class="kw">else</span> {\n            nums1[k--] = nums2[j--];\n        }\n    }\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q11-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> merge(nums1, m, nums2, n):\n    i, j, k = m - 1, n - 1, m + n - 1\n    <span class="kw">while</span> j &gt;= 0:\n        <span class="kw">if</span> i &gt;= 0 <span class="kw">and</span> nums1[i] &gt; nums2[j]:\n            nums1[k] = nums1[i]\n            i -= 1\n        <span class="kw">else</span>:\n            nums1[k] = nums2[j]\n            j -= 1\n        k -= 1',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why does merging from the
                back avoid the overwrite problem that merging from the front
                would cause?
              </div>
            </section>

            <section className="question" id="q12">
              <div className="q-head">
                <span className="q-index">12</span>
                <h2>Boats to Save People</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given an array of people's weights and a weight{" "}
                <code dangerouslySetInnerHTML={{ __html: "limit" }}></code> per
                boat (at most 2 people per boat), return the minimum number of
                boats needed to carry everyone across.
              </p>
              <div className="example">
                Input: people = [3, 2, 2, 1], limit = 3 Output: 3 ([1,2], [2],
                [3])
              </div>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q12-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q12-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn optimal" data-target="q12-opt">
                    Two Pointer
                  </button>
                </div>

                <div className="approach-panel active" id="q12-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(n)</b> — sort first, then
                    for each unused person scan from the heaviest end for a
                    partner that still fits
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q12-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> numRescueBoats(<span class="tp">int</span>[] people, <span class="tp">int</span> limit) {\n    Arrays.sort(people);\n    <span class="tp">int</span> n = people.length;\n    <span class="tp">boolean</span>[] used = <span class="kw">new boolean</span>[n];\n    <span class="tp">int</span> boats = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; n; i++) {\n        <span class="kw">if</span> (used[i]) <span class="kw">continue</span>;\n        used[i] = <span class="kw">true</span>;\n        boats++;\n        <span class="kw">for</span> (<span class="tp">int</span> j = n - 1; j &gt; i; j--) {\n            <span class="kw">if</span> (!used[j] &amp;&amp; people[i] + people[j] &lt;= limit) {\n                used[j] = <span class="kw">true</span>;\n                <span class="kw">break</span>;\n            }\n        }\n    }\n    <span class="kw">return</span> boats;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q12-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> num_rescue_boats(people, limit):\n    people.sort()\n    n = <span class="kw">len</span>(people)\n    used = [<span class="kw">False</span>] * n\n    boats = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(n):\n        <span class="kw">if</span> used[i]:\n            <span class="kw">continue</span>\n        used[i] = <span class="kw">True</span>\n        boats += 1\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(n - 1, i, -1):\n            <span class="kw">if</span> <span class="kw">not</span> used[j] <span class="kw">and</span> people[i] + people[j] &lt;= limit:\n                used[j] = <span class="kw">True</span>\n                <span class="kw">break</span>\n    <span class="kw">return</span> boats',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q12-opt">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> (sorting dominates) · Space:{" "}
                    <b>O(1)</b> extra — sort once, then pair the lightest
                    remaining person with the heaviest; if they fit, both go,
                    otherwise the heaviest goes alone
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q12-opt-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public int</span> numRescueBoats(<span class="tp">int</span>[] people, <span class="tp">int</span> limit) {\n    Arrays.sort(people);\n    <span class="tp">int</span> left = 0, right = people.length - 1;\n    <span class="tp">int</span> boats = 0;\n    <span class="kw">while</span> (left &lt;= right) {\n        <span class="kw">if</span> (people[left] + people[right] &lt;= limit) {\n            left++;\n        }\n        right--;\n        boats++;\n    }\n    <span class="kw">return</span> boats;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q12-opt-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> num_rescue_boats(people, limit):\n    people.sort()\n    left, right = 0, <span class="kw">len</span>(people) - 1\n    boats = 0\n    <span class="kw">while</span> left &lt;= right:\n        <span class="kw">if</span> people[left] + people[right] &lt;= limit:\n            left += 1\n        right -= 1\n        boats += 1\n    <span class="kw">return</span> boats',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why does it always work to
                pair the lightest remaining person with the heaviest remaining
                person, rather than trying other combinations?
              </div>
            </section>

            <section className="question" id="q13">
              <div className="q-head">
                <span className="q-index">13</span>
                <h2>Minimum Window Substring</h2>
                <span className="level-badge hard">Medium-Hard</span>
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
              <p
                className="note"
                style={{ margin: "0 0 16px" } as React.CSSProperties}
              >
                Six ways to solve this one, from slowest to fastest-in-practice.
                Every solution uses a HashMap for the letter counts.
              </p>

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q13-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q13-brute"
                  >
                    Brute Force
                  </button>
                  <button className="tab-btn brute" data-target="q13-better">
                    Better Brute
                  </button>
                  <button className="tab-btn optimal" data-target="q13-map">
                    Two Pointer + HashMap
                  </button>
                  <button className="tab-btn optimal" data-target="q13-counter">
                    Single-Map Counter
                  </button>
                  <button className="tab-btn tool" data-target="q13-filtered">
                    Filtered String
                  </button>
                  <button className="tab-btn tool" data-target="q13-binary">
                    Binary Search
                  </button>
                </div>

                <div className="approach-panel active" id="q13-brute">
                  <div className="complexity">
                    Time: <b>O(n³)</b> · Space: <b>O(n + m)</b> — try every
                    substring; for each one, build a HashMap of its letters and
                    check it covers t
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-brute-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    String best = <span class="st">""</span>;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        <span class="kw">for</span> (<span class="tp">int</span> j = i + t.length(); j &lt;= s.length(); j++) {\n            String sub = s.substring(i, j);\n            <span class="kw">if</span> (covers(sub, need) &amp;&amp; (best.isEmpty() || sub.length() &lt; best.length())) {\n                best = sub;\n            }\n        }\n    }\n    <span class="kw">return</span> best;\n}\n\n<span class="kw">private</span> <span class="tp">boolean</span> covers(String sub, Map&lt;Character, Integer&gt; need) {\n    Map&lt;Character, Integer&gt; have = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : sub.toCharArray()) have.merge(c, 1, Integer::sum);\n    <span class="kw">for</span> (Map.Entry&lt;Character, Integer&gt; e : need.entrySet()) {\n        <span class="kw">if</span> (have.getOrDefault(e.getKey(), 0) &lt; e.getValue()) <span class="kw">return</span> <span class="kw">false</span>;\n    }\n    <span class="kw">return</span> <span class="kw">true</span>;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-brute-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    best = <span class="st">""</span>\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i + <span class="kw">len</span>(t), <span class="kw">len</span>(s) + 1):\n            sub = s[i:j]\n            <span class="kw">if</span> covers(sub, need) <span class="kw">and</span> (best == <span class="st">""</span> <span class="kw">or</span> <span class="kw">len</span>(sub) &lt; <span class="kw">len</span>(best)):\n                best = sub\n    <span class="kw">return</span> best\n\n<span class="kw">def</span> covers(sub, need):\n    have = {}\n    <span class="kw">for</span> c <span class="kw">in</span> sub:\n        have[c] = have.get(c, 0) + 1\n    <span class="kw">return</span> <span class="kw">all</span>(have.get(c, 0) &gt;= k <span class="kw">for</span> c, k <span class="kw">in</span> need.items())',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="approach-panel" id="q13-better">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(m)</b> — fix a start, grow
                    the end one letter at a time, stop at the first end that
                    covers t
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-better-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        Map&lt;Character, Integer&gt; have = <span class="kw">new</span> HashMap&lt;&gt;();\n        <span class="tp">int</span> formed = 0;\n        <span class="kw">for</span> (<span class="tp">int</span> j = i; j &lt; s.length(); j++) {\n            <span class="tp">char</span> c = s.charAt(j);\n            <span class="kw">if</span> (need.containsKey(c)) {\n                have.merge(c, 1, Integer::sum);\n                <span class="kw">if</span> (have.get(c).equals(need.get(c))) formed++;\n            }\n            <span class="kw">if</span> (formed == need.size()) {\n                <span class="kw">if</span> (j - i + 1 &lt; bestLen) {\n                    bestLen = j - i + 1;\n                    bestStart = i;\n                }\n                <span class="kw">break</span>;\n            }\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-better-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n    <span class="kw">for</span> i <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(s)):\n        have = {}\n        formed = 0\n        <span class="kw">for</span> j <span class="kw">in</span> <span class="kw">range</span>(i, <span class="kw">len</span>(s)):\n            c = s[j]\n            <span class="kw">if</span> c <span class="kw">in</span> need:\n                have[c] = have.get(c, 0) + 1\n                <span class="kw">if</span> have[c] == need[c]:\n                    formed += 1\n            <span class="kw">if</span> formed == <span class="kw">len</span>(need):\n                <span class="kw">if</span> j - i + 1 &lt; best_len:\n                    best_len = j - i + 1\n                    best_start = i\n                <span class="kw">break</span>\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                  <p className="note">
                    Saves the O(n) re-check per substring by updating the counts
                    incrementally, but still restarts the whole scan from every
                    start.
                  </p>
                </div>

                <div className="approach-panel" id="q13-map">
                  <div className="complexity">
                    Time: <b>O(n + m)</b> · Space: <b>O(k)</b> (distinct
                    letters) —{" "}
                    <code dangerouslySetInnerHTML={{ __html: "need" }}></code>{" "}
                    and{" "}
                    <code dangerouslySetInnerHTML={{ __html: "window" }}></code>{" "}
                    maps, plus{" "}
                    <code dangerouslySetInnerHTML={{ __html: "formed" }}></code>{" "}
                    = how many distinct letters of t are fully satisfied
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-map-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    Map&lt;Character, Integer&gt; window = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="tp">int</span> formed = 0, left = 0;\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">char</span> c = s.charAt(right);\n        window.merge(c, 1, Integer::sum);\n        <span class="kw">if</span> (need.containsKey(c) &amp;&amp; window.get(c).equals(need.get(c))) formed++;\n\n        <span class="kw">while</span> (formed == need.size()) {\n            <span class="kw">if</span> (right - left + 1 &lt; bestLen) {\n                bestLen = right - left + 1;\n                bestStart = left;\n            }\n            <span class="tp">char</span> l = s.charAt(left);\n            window.put(l, window.get(l) - 1);\n            <span class="kw">if</span> (need.containsKey(l) &amp;&amp; window.get(l) &lt; need.get(l)) formed--;\n            left++;\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-map-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    window = {}\n    formed = 0\n    left = 0\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        window[c] = window.get(c, 0) + 1\n        <span class="kw">if</span> c <span class="kw">in</span> need <span class="kw">and</span> window[c] == need[c]:\n            formed += 1\n\n        <span class="kw">while</span> formed == <span class="kw">len</span>(need):\n            <span class="kw">if</span> right - left + 1 &lt; best_len:\n                best_len = right - left + 1\n                best_start = left\n            l = s[left]\n            window[l] -= 1\n            <span class="kw">if</span> l <span class="kw">in</span> need <span class="kw">and</span> window[l] &lt; need[l]:\n                formed -= 1\n            left += 1\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                  <p className="note">
                    The standard interview answer. Comparing counts with{" "}
                    <code
                      dangerouslySetInnerHTML={{ __html: ".equals()" }}
                    ></code>{" "}
                    matters in Java:{" "}
                    <code dangerouslySetInnerHTML={{ __html: "==" }}></code> on
                    two Integer objects breaks for values above 127.
                  </p>
                </div>

                <div className="approach-panel" id="q13-counter">
                  <div className="complexity">
                    Time: <b>O(n + m)</b> · Space: <b>O(k)</b> — one map only:
                    it starts as t's counts, and every letter that enters the
                    window subtracts from it
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-counter-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    <span class="tp">int</span> missing = t.length(), left = 0;\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; s.length(); right++) {\n        <span class="tp">char</span> c = s.charAt(right);\n        <span class="kw">if</span> (need.getOrDefault(c, 0) &gt; 0) missing--;\n        need.merge(c, -1, Integer::sum);\n\n        <span class="kw">while</span> (missing == 0) {\n            <span class="kw">if</span> (right - left + 1 &lt; bestLen) {\n                bestLen = right - left + 1;\n                bestStart = left;\n            }\n            <span class="tp">char</span> l = s.charAt(left);\n            need.merge(l, 1, Integer::sum);\n            <span class="kw">if</span> (need.get(l) &gt; 0) missing++;\n            left++;\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-counter-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    missing = <span class="kw">len</span>(t)\n    left = 0\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n\n    <span class="kw">for</span> right, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        <span class="kw">if</span> need.get(c, 0) &gt; 0:\n            missing -= 1\n        need[c] = need.get(c, 0) - 1\n\n        <span class="kw">while</span> missing == 0:\n            <span class="kw">if</span> right - left + 1 &lt; best_len:\n                best_len = right - left + 1\n                best_start = left\n            l = s[left]\n            need[l] += 1\n            <span class="kw">if</span> need[l] &gt; 0:\n                missing += 1\n            left += 1\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                  <p className="note">
                    A positive value means that letter is still missing; zero or
                    negative means covered (or not needed).{" "}
                    <code
                      dangerouslySetInnerHTML={{ __html: "missing" }}
                    ></code>{" "}
                    is the total number of letters still owed, so the window is
                    valid exactly when it reaches 0.
                  </p>
                </div>

                <div className="approach-panel" id="q13-filtered">
                  <div className="complexity">
                    Time: <b>O(n + f)</b> where f = letters of s that appear in
                    t · Space: <b>O(f)</b> — drop every letter that can't
                    matter, then run the two pointers over what's left
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-filtered-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    List&lt;<span class="tp">int</span>[]&gt; filtered = <span class="kw">new</span> ArrayList&lt;&gt;();          <span class="cm">// {index in s, letter}</span>\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        <span class="kw">if</span> (need.containsKey(s.charAt(i))) filtered.add(<span class="kw">new</span> <span class="tp">int</span>[]{i, s.charAt(i)});\n    }\n\n    Map&lt;Character, Integer&gt; window = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="tp">int</span> formed = 0, left = 0;\n    <span class="tp">int</span> bestLen = Integer.MAX_VALUE, bestStart = 0;\n\n    <span class="kw">for</span> (<span class="tp">int</span> right = 0; right &lt; filtered.size(); right++) {\n        <span class="tp">char</span> c = (<span class="tp">char</span>) filtered.get(right)[1];\n        window.merge(c, 1, Integer::sum);\n        <span class="kw">if</span> (window.get(c).equals(need.get(c))) formed++;\n\n        <span class="kw">while</span> (formed == need.size()) {\n            <span class="tp">int</span> start = filtered.get(left)[0];\n            <span class="tp">int</span> end = filtered.get(right)[0];\n            <span class="kw">if</span> (end - start + 1 &lt; bestLen) {\n                bestLen = end - start + 1;\n                bestStart = start;\n            }\n            <span class="tp">char</span> l = (<span class="tp">char</span>) filtered.get(left)[1];\n            window.put(l, window.get(l) - 1);\n            <span class="kw">if</span> (window.get(l) &lt; need.get(l)) formed--;\n            left++;\n        }\n    }\n    <span class="kw">return</span> bestLen == Integer.MAX_VALUE ? <span class="st">""</span> : s.substring(bestStart, bestStart + bestLen);\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-filtered-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    filtered = [(i, c) <span class="kw">for</span> i, c <span class="kw">in</span> <span class="kw">enumerate</span>(s) <span class="kw">if</span> c <span class="kw">in</span> need]   <span class="cm"># (index in s, letter)</span>\n\n    window = {}\n    formed = 0\n    left = 0\n    best_len = <span class="kw">float</span>(<span class="st">\'inf\'</span>)\n    best_start = 0\n\n    <span class="kw">for</span> right <span class="kw">in</span> <span class="kw">range</span>(<span class="kw">len</span>(filtered)):\n        c = filtered[right][1]\n        window[c] = window.get(c, 0) + 1\n        <span class="kw">if</span> window[c] == need[c]:\n            formed += 1\n\n        <span class="kw">while</span> formed == <span class="kw">len</span>(need):\n            start = filtered[left][0]\n            end = filtered[right][0]\n            <span class="kw">if</span> end - start + 1 &lt; best_len:\n                best_len = end - start + 1\n                best_start = start\n            l = filtered[left][1]\n            window[l] -= 1\n            <span class="kw">if</span> window[l] &lt; need[l]:\n                formed -= 1\n            left += 1\n    <span class="kw">return</span> <span class="st">""</span> <span class="kw">if</span> best_len == <span class="kw">float</span>(<span class="st">\'inf\'</span>) <span class="kw">else</span> s[best_start:best_start + best_len]',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                  <p className="note">
                    Best when s is huge and t is tiny (e.g. s has a million
                    letters, t is "ABC"): the two-pointer phase only touches the
                    letters that matter. Each kept letter remembers its original
                    index so the answer can still be sliced from s.
                  </p>
                </div>

                <div className="approach-panel" id="q13-binary">
                  <div className="complexity">
                    Time: <b>O(n log n)</b> · Space: <b>O(k)</b> — binary search
                    the answer's length; for each guess, slide one fixed-size
                    window across s and ask "does any window of this length
                    cover t?"
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel" id="q13-binary-java">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">public</span> String minWindow(String s, String t) {\n    <span class="kw">if</span> (s.length() &lt; t.length()) <span class="kw">return</span> <span class="st">""</span>;\n    Map&lt;Character, Integer&gt; need = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="kw">for</span> (<span class="tp">char</span> c : t.toCharArray()) need.merge(c, 1, Integer::sum);\n\n    <span class="tp">int</span> lo = t.length(), hi = s.length();\n    String best = <span class="st">""</span>;\n    <span class="kw">while</span> (lo &lt;= hi) {\n        <span class="tp">int</span> mid = (lo + hi) / 2;\n        String found = windowOfLength(s, mid, need);\n        <span class="kw">if</span> (found != <span class="kw">null</span>) {\n            best = found;\n            hi = mid - 1;              <span class="cm">// a window this long works, try shorter</span>\n        } <span class="kw">else</span> {\n            lo = mid + 1;              <span class="cm">// too short, go longer</span>\n        }\n    }\n    <span class="kw">return</span> best;\n}\n\n<span class="kw">private</span> String windowOfLength(String s, <span class="tp">int</span> len, Map&lt;Character, Integer&gt; need) {\n    Map&lt;Character, Integer&gt; window = <span class="kw">new</span> HashMap&lt;&gt;();\n    <span class="tp">int</span> formed = 0;\n    <span class="kw">for</span> (<span class="tp">int</span> i = 0; i &lt; s.length(); i++) {\n        <span class="tp">char</span> c = s.charAt(i);\n        window.merge(c, 1, Integer::sum);\n        <span class="kw">if</span> (need.containsKey(c) &amp;&amp; window.get(c).equals(need.get(c))) formed++;\n\n        <span class="kw">if</span> (i &gt;= len) {                <span class="cm">// slide: drop the letter leaving on the left</span>\n            <span class="tp">char</span> out = s.charAt(i - len);\n            <span class="kw">if</span> (need.containsKey(out) &amp;&amp; window.get(out).equals(need.get(out))) formed--;\n            window.put(out, window.get(out) - 1);\n        }\n        <span class="kw">if</span> (i &gt;= len - 1 &amp;&amp; formed == need.size()) {\n            <span class="kw">return</span> s.substring(i - len + 1, i + 1);\n        }\n    }\n    <span class="kw">return</span> <span class="kw">null</span>;\n}',
                          }}
                        ></code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel" id="q13-binary-py">
                        <code
                          dangerouslySetInnerHTML={{
                            __html:
                              '<span class="kw">def</span> min_window(s, t):\n    <span class="kw">if</span> <span class="kw">len</span>(s) &lt; <span class="kw">len</span>(t):\n        <span class="kw">return</span> <span class="st">""</span>\n    need = {}\n    <span class="kw">for</span> c <span class="kw">in</span> t:\n        need[c] = need.get(c, 0) + 1\n\n    lo, hi = <span class="kw">len</span>(t), <span class="kw">len</span>(s)\n    best = <span class="st">""</span>\n    <span class="kw">while</span> lo &lt;= hi:\n        mid = (lo + hi) // 2\n        found = window_of_length(s, mid, need)\n        <span class="kw">if</span> found is <span class="kw">not</span> <span class="kw">None</span>:\n            best = found\n            hi = mid - 1               <span class="cm"># a window this long works, try shorter</span>\n        <span class="kw">else</span>:\n            lo = mid + 1               <span class="cm"># too short, go longer</span>\n    <span class="kw">return</span> best\n\n<span class="kw">def</span> window_of_length(s, length, need):\n    window = {}\n    formed = 0\n    <span class="kw">for</span> i, c <span class="kw">in</span> <span class="kw">enumerate</span>(s):\n        window[c] = window.get(c, 0) + 1\n        <span class="kw">if</span> c <span class="kw">in</span> need <span class="kw">and</span> window[c] == need[c]:\n            formed += 1\n\n        <span class="kw">if</span> i &gt;= length:                <span class="cm"># slide: drop the letter leaving on the left</span>\n            out = s[i - length]\n            <span class="kw">if</span> out <span class="kw">in</span> need <span class="kw">and</span> window[out] == need[out]:\n                formed -= 1\n            window[out] -= 1\n        <span class="kw">if</span> i &gt;= length - 1 <span class="kw">and</span> formed == <span class="kw">len</span>(need):\n            <span class="kw">return</span> s[i - length + 1:i + 1]\n    <span class="kw">return</span> <span class="kw">None</span>',
                          }}
                        ></code>
                      </pre>
                    </div>
                  </div>
                  <p className="note">
                    Works because coverage is monotonic: if some window of
                    length L covers t, then some window of length L + 1 does
                    too. Slower than the two-pointer answer, but a good example
                    of "binary search on the answer".
                  </p>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> In the two-pointer versions
                neither pointer ever moves backward, yet the inner{" "}
                <code dangerouslySetInnerHTML={{ __html: "while" }}></code> loop
                sits inside the{" "}
                <code dangerouslySetInnerHTML={{ __html: "for" }}></code> loop.
                Why is the total work still O(n) and not O(n²)?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
