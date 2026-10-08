import type React from "react";
import AlgoVisualizer from "../../components/guide/AlgoVisualizer";
import {
  linkedListCycleApproaches,
  mergeTwoSortedListsApproaches,
  middleOfLinkedListApproaches,
  palindromeLinkedListApproaches,
  removeNthFromEndApproaches,
  reverseLinkedListApproaches,
} from "../../components/guide/linkedListVisualizations";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function LinkedListDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Linked List</div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q1">
              01 · Reverse Linked List
            </a>
            <a className="side-link" href="#q2">
              02 · Linked List Cycle
            </a>
            <a className="side-link" href="#q3">
              03 · Merge Two Sorted Lists
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q4">
              04 · Remove Nth Node From End
            </a>
            <a className="side-link" href="#q5">
              05 · Middle of the Linked List
            </a>
            <a className="side-link" href="#q6">
              06 · Palindrome Linked List
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Linked List</span>
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
              <h1>Linked List, basic to medium</h1>
              <p>
                Six questions built around pointer manipulation. Each
                brute-force version copies values into an array (or makes a
                second pass) to sidestep the pointer juggling; each optimal
                version re-links nodes directly in a single pass with O(1) extra
                space.
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
                  Brute force (extra space / two pass)
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
                  Optimal (in-place / one pass)
                </span>
              </div>
            </div>

            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Reverse Linked List</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given the head of a singly linked list, reverse the list and
                return the new head.
              </p>
              <div className="example">
                Input: 1 → 2 → 3 → 4 → 5 Output: 5 → 4 → 3 → 2 → 1
              </div>

              <AlgoVisualizer
                title="Reverse Linked List"
                approaches={reverseLinkedListApproaches}
                defaultInput={[1, 2, 3, 4, 5]}
                arrayVariant="linked-list"
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
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — copy values into an
                    array, build a brand-new reversed list
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode reverseList(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
    Collections.reverse(vals);
    ListNode dummy = new ListNode(0), cur = dummy;
    for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def reverse_list(head):
    vals = []
    n = head
    while n:
        vals.append(n.val)
        n = n.next
    vals.reverse()
    dummy = cur = ListNode(0)
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — re-point each
                    node's next pointer backward while walking
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    return prev`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you reverse only a
                sub-section of the list, between positions <code>left</code> and{" "}
                <code>right</code>?
              </div>
            </section>

            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Linked List Cycle</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given the head of a linked list, determine if the list has a
                cycle (some node's next pointer loops back to an earlier node).
              </p>
              <div className="example">
                Input: 1 → 2 → 3 → 4 → (back to 3) Output: true
              </div>

              <AlgoVisualizer
                title="Linked List Cycle"
                approaches={linkedListCycleApproaches}
                defaultInput={[1, 2, 3, 4, 5]}
                arrayVariant="linked-list"
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
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — remember every node
                    visited in a set; a repeat means a cycle
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    for (ListNode n = head; n != null; n = n.next) {
        if (!seen.add(n)) return true;
    }
    return false;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def has_cycle(head):
    seen = set()
    n = head
    while n:
        if n in seen:
            return True
        seen.add(n)
        n = n.next
    return False`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — Floyd's slow/fast
                    pointers; they can only meet if there's a cycle
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Once a cycle is detected, how
                would you find the exact node where the cycle begins, still in
                O(1) space?
              </div>
            </section>

            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Merge Two Sorted Lists</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Merge two sorted linked lists into one sorted list by splicing
                their nodes together.
              </p>
              <div className="example">
                Input: l1 = 1→3→5→7, l2 = 2→4→6 Output: 1→2→3→4→5→6→7
              </div>

              <AlgoVisualizer
                title="Merge Two Sorted Lists"
                approaches={mergeTwoSortedListsApproaches}
                defaultInput={[1, 3, 5, 7]}
                arrayVariant="linked-list"
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
                    Time: <b>O((m+n) log(m+n))</b> · Space: <b>O(m+n)</b> — dump
                    every value into one array and sort it
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    List<Integer> all = new ArrayList<>();
    for (ListNode n = l1; n != null; n = n.next) all.add(n.val);
    for (ListNode n = l2; n != null; n = n.next) all.add(n.val);
    Collections.sort(all);
    ListNode dummy = new ListNode(0), cur = dummy;
    for (int v : all) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def merge_two_lists(l1, l2):
    vals = []
    for n in (l1, l2):
        while n:
            vals.append(n.val)
            n = n.next
    vals.sort()
    dummy = cur = ListNode(0)
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(m+n)</b> · Space: <b>O(1)</b> extra — walk both
                    lists once, re-linking nodes directly, no sorting needed
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else { tail.next = l2; l2 = l2.next; }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def merge_two_lists(l1, l2):
    dummy = tail = ListNode(0)
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> How would you extend the
                optimal approach to merge <code>k</code> sorted lists
                efficiently (hint: a heap)?
              </div>
            </section>

            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Remove Nth Node From End of List</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given the head of a linked list, remove the <code>n</code>-th
                node from the end and return the head.
              </p>
              <div className="example">
                Input: 1→2→3→4→5, n = 2 Output: 1→2→3→5
              </div>

              <AlgoVisualizer
                title="Remove Nth Node From End of List"
                approaches={removeNthFromEndApproaches}
                defaultInput={[1, 2, 3, 4, 5]}
                arrayVariant="linked-list"
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
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — count the length
                    first, then walk again to the target node
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode removeNthFromEnd(ListNode head, int n) {
    int len = 0;
    for (ListNode cur = head; cur != null; cur = cur.next) len++;
    ListNode dummy = new ListNode(0, head), cur = dummy;
    for (int i = 0; i < len - n; i++) cur = cur.next;
    cur.next = cur.next.next;
    return dummy.next;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def remove_nth_from_end(head, n):
    length = 0
    cur = head
    while cur:
        length += 1
        cur = cur.next
    dummy = ListNode(0, head)
    cur = dummy
    for _ in range(length - n):
        cur = cur.next
    cur.next = cur.next.next
    return dummy.next`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — advance a lead
                    pointer n steps first, then move both pointers together
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode lead = dummy, trail = dummy;
    for (int i = 0; i < n; i++) lead = lead.next;
    while (lead.next != null) {
        lead = lead.next;
        trail = trail.next;
    }
    trail.next = trail.next.next;
    return dummy.next;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    lead = trail = dummy
    for _ in range(n):
        lead = lead.next
    while lead.next:
        lead = lead.next
        trail = trail.next
    trail.next = trail.next.next
    return dummy.next`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Why does starting both
                pointers from a dummy node (before the real head) simplify the
                edge case where the head itself is removed?
              </div>
            </section>

            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Middle of the Linked List</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Given the head of a singly linked list, return the middle node.
                If there are two middle nodes, return the second one.
              </p>
              <div className="example">Input: 1→2→3→4→5→6 Output: 4</div>

              <AlgoVisualizer
                title="Middle of the Linked List"
                approaches={middleOfLinkedListApproaches}
                defaultInput={[1, 2, 3, 4, 5, 6]}
                arrayVariant="linked-list"
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
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — count the length,
                    then walk again to length / 2
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode middleNode(ListNode head) {
    int len = 0;
    for (ListNode n = head; n != null; n = n.next) len++;
    ListNode cur = head;
    for (int i = 0; i < len / 2; i++) cur = cur.next;
    return cur;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def middle_node(head):
    length = 0
    n = head
    while n:
        length += 1
        n = n.next
    cur = head
    for _ in range(length // 2):
        cur = cur.next
    return cur`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — one pass: slow
                    moves 1 step, fast moves 2; slow lands on the middle
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> This same slow/fast technique
                shows up in cycle detection and palindrome checking — what's the
                common idea behind all three?
              </div>
            </section>

            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Palindrome Linked List</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given the head of a singly linked list, determine if it reads
                the same forward and backward.
              </p>
              <div className="example">Input: 1→2→2→1 Output: true</div>

              <AlgoVisualizer
                title="Palindrome Linked List"
                approaches={palindromeLinkedListApproaches}
                defaultInput={[1, 2, 2, 1]}
                arrayVariant="linked-list"
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
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q6-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — copy every value
                    out, then compare with two pointers
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean isPalindrome(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode n = head; n != null; n = n.next) vals.add(n.val);
    int i = 0, j = vals.size() - 1;
    while (i < j) {
        if (!vals.get(i).equals(vals.get(j))) return false;
        i++; j--;
    }
    return true;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def is_palindrome(head):
    vals = []
    n = head
    while n:
        vals.append(n.val)
        n = n.next
    return vals == vals[::-1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(1)</b> — find the middle,
                    reverse the second half in place, compare halves
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`public boolean isPalindrome(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next; fast = fast.next.next;
    }
    ListNode secondHalf = reverse(slow);
    ListNode first = head, second = secondHalf;
    while (second != null) {
        if (first.val != second.val) return false;
        first = first.next; second = second.next;
    }
    return true;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def is_palindrome(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    second = reverse(slow)
    first = head
    while second:
        if first.val != second.val:
            return False
        first = first.next
        second = second.next
    return True`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The optimal approach mutates
                the list while reversing the second half — how would you restore
                the original list afterward if that matters?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
