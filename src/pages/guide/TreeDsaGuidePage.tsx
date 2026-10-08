import type React from "react";
import TreeTypesGallery from "../../components/guide/TreeTypesGallery";
import TreeVisualizer from "../../components/guide/TreeVisualizer";
import {
  dfsOrderApproaches,
  inorderTraversalApproaches,
  lcaApproaches,
  levelOrderApproaches,
  maxDepthApproaches,
  minDepthApproaches,
  validateBstApproaches,
} from "../../components/guide/treeVisualizations";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function TreeDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Trees</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · Types of Trees
            </a>
            <a className="side-link" href="#q2">
              02 · Depth First Search (DFS)
            </a>
            <a className="side-link" href="#q3">
              03 · Breadth First Search (BFS)
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Basics</div>
            <a className="side-link" href="#q4">
              04 · Binary Tree Inorder Traversal
            </a>
            <a className="side-link" href="#q5">
              05 · Maximum Depth of Binary Tree
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q6">
              06 · Binary Tree Level Order Traversal
            </a>
            <a className="side-link" href="#q7">
              07 · Validate Binary Search Tree
            </a>
            <a className="side-link" href="#q8">
              08 · Lowest Common Ancestor of a BST
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Trees</span>
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
              <h1>Binary Trees, basic to medium</h1>
              <p>
                Start with the shapes a tree can take, then learn the only two
                ways to walk one: depth first with a stack (explicit or the call
                stack) and breadth first with a queue. Every problem after that
                is a variation on those two walks — each brute-force version
                here re-walks a tree it has already seen, while each optimal
                version carries just enough state down the edges to finish in a
                single pass.
              </p>
              <p>
                Each visualiser takes a level-order list where <code>null</code>{" "}
                marks a missing child — the same format LeetCode uses — so you
                can paste your own tree and watch the two approaches diverge.
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
                  Brute force (re-traverses / stores paths)
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
                  Optimal (single pass, bounded memory)
                </span>
              </div>
            </div>

            {/* ---------------------------------------------- Q1 */}
            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Types of Trees</h2>
                <span className="level-badge basic">Reference</span>
              </div>
              <p className="prompt">
                Before any algorithm, know what shape you are standing on. Every
                complexity claim in this course depends on it: the same BST
                lookup is O(log n) on a balanced tree and O(n) on a skewed one,
                and the array-backed heap trick only works because the tree is
                complete.
              </p>

              <TreeTypesGallery />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q1-brute"
                  >
                    Shape → Cost
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Node Definitions
                  </button>
                </div>
                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Height <b>h</b> is the only thing that matters: a balanced
                    tree gives <b>h ≈ log n</b>, a skewed tree gives{" "}
                    <b>h = n</b>
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`// Search cost is h, not n — the shape decides h.
//
// Perfect / balanced     h = O(log n)   -> search O(log n)
// Complete               h = O(log n)   -> array indexing works:
//                                          left = 2i + 1, right = 2i + 2
// Random BST             h = O(log n)   on average
// Degenerate / skewed    h = n          -> search O(n), recursion
//                                          can overflow the stack
//
// A BST only gives you O(log n) if something keeps it balanced:
// AVL and red-black trees rotate on insert and delete to do exactly that.`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`# Nodes in a complete tree can skip pointers entirely:
heap = [1, 3, 2, 7, 4, 9]

def left(i):   return 2 * i + 1
def right(i):  return 2 * i + 2
def parent(i): return (i - 1) // 2

# This is why heapq stores a plain list — the "tree" is implied
# by the indices, and no gaps are allowed anywhere but the end.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Binary nodes hold two fields; an N-ary node holds a list —
                    DFS and BFS are otherwise identical
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`class TreeNode {        // binary
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class NaryNode {        // general / N-ary
    int val;
    List<NaryNode> children = new ArrayList<>();
    NaryNode(int val) { this.val = val; }
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`class TreeNode:          # binary
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None


class NaryNode:          # general / N-ary
    def __init__(self, val):
        self.val = val
        self.children = []`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Insert 1, 2, 3, 4, 5 into an
                empty BST in that order. What shape do you get, and what does a
                lookup for 5 now cost? Which single property of the input caused
                it?
              </div>
            </section>

            {/* ---------------------------------------------- Q2 */}
            <section className="question" id="q2">
              <div className="q-head">
                <span className="q-index">02</span>
                <h2>Depth First Search (DFS)</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Walk the whole tree by following one branch all the way down
                before backtracking. The traversal itself never changes — the
                only decision is <em>when</em> you record the node relative to
                its children, and that single choice gives you preorder, inorder
                and postorder.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14,null,null,4,7] → preorder [8, 3, 1,
                6, 4, 7, 10, 14] · inorder [1, 3, 4, 6, 7, 8, 10, 14] ·
                postorder [1, 4, 7, 6, 3, 14, 10, 8]
              </div>

              <TreeVisualizer
                title="Depth First Search"
                approaches={dfsOrderApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14, null, null, 4, 7]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button className="tab-btn brute active" data-target="q2-pre">
                    Preorder
                  </button>
                  <button className="tab-btn optimal" data-target="q2-in">
                    Inorder
                  </button>
                  <button className="tab-btn optimal" data-target="q2-post">
                    Postorder
                  </button>
                </div>
                <div className="approach-panel active" id="q2-pre">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — node is recorded on
                    arrival, so the output always starts at the root
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void preorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    out.add(node.val);          // before the children
    preorder(node.left, out);
    preorder(node.right, out);
}

// Iterative: a stack, right pushed first so left pops first.
List<Integer> preorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    if (root != null) stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        out.add(node.val);
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
    }
    return out;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def preorder(node, out):
    if not node:
        return
    out.append(node.val)        # before the children
    preorder(node.left, out)
    preorder(node.right, out)


def preorder_iter(root):
    out, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        out.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return out`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-in">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — node is recorded
                    between the two subtrees, which sorts a BST
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);          // between the children
    inorder(node.right, out);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def inorder(node, out):
    if not node:
        return
    inorder(node.left, out)
    out.append(node.val)        # between the children
    inorder(node.right, out)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-post">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — node is recorded
                    last, so children are always finished first
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void postorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    postorder(node.left, out);
    postorder(node.right, out);
    out.add(node.val);          // after the children
}

// Bottom-up results fall out of postorder naturally:
int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    return 1 + Math.max(left, right);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def postorder(node, out):
    if not node:
        return
    postorder(node.left, out)
    postorder(node.right, out)
    out.append(node.val)        # after the children


def height(node):
    if not node:
        return 0
    return 1 + max(height(node.left), height(node.right))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Reverse the preorder
                iterative loop (push left first, then right) and reverse the
                final list. Which of the three orders did you just build, and
                why does that trick work?
              </div>
            </section>

            {/* ---------------------------------------------- Q3 */}
            <section className="question" id="q3">
              <div className="q-head">
                <span className="q-index">03</span>
                <h2>Breadth First Search (BFS)</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Walk the tree one level at a time with a queue instead of a
                stack. Because a level is fully drained before the next one
                starts, the first node of a kind that BFS meets is always the
                shallowest one — which is exactly what <em>minimum depth</em>{" "}
                needs. Return the number of nodes on the shortest root-to-leaf
                path.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14,null,null,4,7] Output: 3 (8 → 3 → 1)
              </div>

              <TreeVisualizer
                title="Minimum Depth via BFS"
                approaches={minDepthApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14, null, null, 4, 7]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q3-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q3-brute"
                  >
                    DFS
                  </button>
                  <button className="tab-btn optimal" data-target="q3-opt">
                    BFS
                  </button>
                </div>
                <div className="approach-panel active" id="q3-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> always · Space: <b>O(h)</b> — DFS has to
                    finish every branch before it can compare them, so it can
                    never stop early
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int minDepth(TreeNode root) {
    if (root == null) return 0;
    if (root.left == null) return 1 + minDepth(root.right);
    if (root.right == null) return 1 + minDepth(root.left);
    return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def min_depth(root):
    if not root:
        return 0
    if not root.left:
        return 1 + min_depth(root.right)
    if not root.right:
        return 1 + min_depth(root.left)
    return 1 + min(min_depth(root.left), min_depth(root.right))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> worst case, far less in practice · Space:{" "}
                    <b>O(w)</b> — the first leaf dequeued is provably the
                    shallowest, so BFS returns on the spot
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int minDepth(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    int depth = 1;
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            if (node.left == null && node.right == null) return depth;
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        depth++;
    }
    return depth;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque


def min_depth(root):
    if not root:
        return 0
    queue = deque([(root, 1)])
    while queue:
        node, depth = queue.popleft()
        if not node.left and not node.right:
            return depth            # first leaf is the shallowest
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    return 0`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Swap the queue for a stack in
                the BFS version and nothing crashes — but the early return
                becomes wrong. Why does the FIFO order, and only the FIFO order,
                make "first leaf found" mean "shallowest leaf"?
              </div>
            </section>

            {/* ---------------------------------------------- Q4 */}
            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Binary Tree Inorder Traversal</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Return the values of a binary tree in inorder (left → node →
                right). Solve it recursively first, then without recursion.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14,null,null,4,7] Output: [1, 3, 4, 6,
                7, 8, 10, 14]
              </div>

              <TreeVisualizer
                title="Binary Tree Inorder Traversal"
                approaches={inorderTraversalApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14, null, null, 4, 7]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q4-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q4-brute"
                  >
                    Recursive
                  </button>
                  <button className="tab-btn optimal" data-target="q4-opt">
                    Iterative
                  </button>
                </div>
                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — the call stack
                    grows with the height, so a skewed tree can overflow it
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<Integer> inorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    dfs(root, out);
    return out;
}

void dfs(TreeNode node, List<Integer> out) {
    if (node == null) return;
    dfs(node.left, out);
    out.add(node.val);
    dfs(node.right, out);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def inorder(root):
    out = []

    def dfs(node):
        if not node:
            return
        dfs(node.left)
        out.append(node.val)
        dfs(node.right)

    dfs(root)
    return out`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — same shape, but the
                    stack is an ordinary heap-allocated list you control
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<Integer> inorder(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();
        out.add(cur.val);
        cur = cur.right;
    }
    return out;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def inorder(root):
    out, stack, cur = [], [], root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        out.append(cur.val)
        cur = cur.right
    return out`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Inorder on a BST comes out
                sorted. Which single line do you move to turn this into preorder
                or postorder, and why does only inorder give you the sorted
                order?
              </div>
            </section>

            {/* ---------------------------------------------- Q5 */}
            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Maximum Depth of Binary Tree</h2>
                <span className="level-badge basic">Basic</span>
              </div>
              <p className="prompt">
                Return the number of nodes along the longest path from the root
                down to the farthest leaf.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14,null,null,4,7] Output: 4
              </div>

              <TreeVisualizer
                title="Maximum Depth of Binary Tree"
                approaches={maxDepthApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14, null, null, 4, 7]}
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
                    Time: <b>O(n · h)</b> · Space: <b>O(h)</b> — one full
                    traversal per level just to ask whether that level exists
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int maxDepth(TreeNode root) {
    int depth = 0;
    while (hasLevel(root, 0, depth)) depth++;
    return depth;
}

boolean hasLevel(TreeNode node, int cur, int want) {
    if (node == null) return false;
    if (cur == want) return true;
    return hasLevel(node.left, cur + 1, want)
        || hasLevel(node.right, cur + 1, want);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def max_depth(root):
    def has_level(node, cur, want):
        if not node:
            return False
        if cur == want:
            return True
        return (has_level(node.left, cur + 1, want)
                or has_level(node.right, cur + 1, want))

    depth = 0
    while has_level(root, 0, depth):
        depth += 1
    return depth`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(w)</b> — a single BFS sweep;
                    each node is enqueued and dequeued exactly once
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    int depth = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        depth++;
    }
    return depth;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def max_depth(root):
    if not root:
        return 0
    queue, depth = deque([root]), 0
    while queue:
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        depth += 1
    return depth`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The one-line recursive
                version <code>1 + max(depth(left), depth(right))</code> is also
                O(n). On what kind of tree would you still prefer the BFS
                version, and what fails first?
              </div>
            </section>

            {/* ---------------------------------------------- Q6 */}
            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Binary Tree Level Order Traversal</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Return the node values grouped level by level, from the root
                downwards and left to right within each level.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14] Output: [[8], [3, 10], [1, 6, 14]]
              </div>

              <TreeVisualizer
                title="Binary Tree Level Order Traversal"
                approaches={levelOrderApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14]}
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
                    Time: <b>O(n · h)</b> · Space: <b>O(h)</b> — every level
                    re-walks the whole tree and throws away the nodes at other
                    depths
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    for (int d = 0; d < height(root); d++) {
        List<Integer> level = new ArrayList<>();
        collect(root, 0, d, level);
        result.add(level);
    }
    return result;
}

void collect(TreeNode node, int cur, int want, List<Integer> out) {
    if (node == null) return;
    if (cur == want) { out.add(node.val); return; }
    collect(node.left, cur + 1, want, out);
    collect(node.right, cur + 1, want, out);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def level_order(root):
    def collect(node, cur, want, out):
        if not node:
            return
        if cur == want:
            out.append(node.val)
            return
        collect(node.left, cur + 1, want, out)
        collect(node.right, cur + 1, want, out)

    result = []
    for d in range(height(root)):
        level = []
        collect(root, 0, d, level)
        result.append(level)
    return result`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(w)</b> — the queue length at
                    the start of each round is exactly the width of that level
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> queue = new ArrayDeque<>();
    queue.add(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        result.add(level);
    }
    return result;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def level_order(root):
    if not root:
        return []
    queue, result = deque([root]), []
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Capturing{" "}
                <code>size = queue.length</code> before the inner loop is the
                whole trick. What goes wrong if you read the queue length inside
                the loop instead?
              </div>
            </section>

            {/* ---------------------------------------------- Q7 */}
            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Validate Binary Search Tree</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Decide whether a binary tree is a valid BST: every value in the
                left subtree must be smaller than the node, and every value in
                the right subtree larger — not just the direct children.
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14] → true · [8,3,10,1,9] → false (9 is
                in the left subtree of 8)
              </div>

              <TreeVisualizer
                title="Validate Binary Search Tree"
                approaches={validateBstApproaches}
                defaultInput={[8, 3, 10, 1, 9, null, 14]}
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
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q7-brute">
                  <div className="complexity">
                    Time: <b>O(n²)</b> · Space: <b>O(h)</b> — each node rescans
                    both of its subtrees in full
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean isValidBST(TreeNode node) {
    if (node == null) return true;
    for (int v : values(node.left))  if (v >= node.val) return false;
    for (int v : values(node.right)) if (v <= node.val) return false;
    return isValidBST(node.left) && isValidBST(node.right);
}

List<Integer> values(TreeNode node) {
    if (node == null) return List.of();
    List<Integer> all = new ArrayList<>(List.of(node.val));
    all.addAll(values(node.left));
    all.addAll(values(node.right));
    return all;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def values(node):
    if not node:
        return []
    return [node.val] + values(node.left) + values(node.right)

def is_valid_bst(node):
    if not node:
        return True
    if any(v >= node.val for v in values(node.left)):
        return False
    if any(v <= node.val for v in values(node.right)):
        return False
    return is_valid_bst(node.left) and is_valid_bst(node.right)`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(h)</b> — push an allowed
                    (low, high) window down the edges and check each node once
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean isValidBST(TreeNode root) {
    return check(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

boolean check(TreeNode node, long low, long high) {
    if (node == null) return true;
    if (node.val <= low || node.val >= high) return false;
    return check(node.left, low, node.val)
        && check(node.right, node.val, high);
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def is_valid_bst(root):
    def check(node, low, high):
        if not node:
            return True
        if node.val <= low or node.val >= high:
            return False
        return (check(node.left, low, node.val)
                and check(node.right, node.val, high))

    return check(root, float("-inf"), float("inf"))`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The default tree above is
                invalid because 9 sits under 8 through the left edge, even
                though 9 &gt; 3 keeps its parent happy. Which bound catches it,
                and why does an inorder walk catch the same thing with a single
                previous-value variable?
              </div>
            </section>

            {/* ---------------------------------------------- Q8 */}
            <section className="question" id="q8">
              <div className="q-head">
                <span className="q-index">08</span>
                <h2>Lowest Common Ancestor of a BST</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Given a BST and two values <code>p</code> and <code>q</code>,
                return the deepest node that has both of them as descendants (a
                node may be a descendant of itself).
              </p>
              <div className="example">
                Input: [8,3,10,1,6,null,14,null,null,4,7], p = 1, q = 7 Output:
                3
              </div>

              <TreeVisualizer
                title="Lowest Common Ancestor of a BST"
                approaches={lcaApproaches}
                defaultInput={[8, 3, 10, 1, 6, null, 14, null, null, 4, 7]}
                targetFields={[
                  { label: "p", defaultValue: 1 },
                  { label: "q", defaultValue: 7 },
                ]}
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
                    Optimal
                  </button>
                </div>
                <div className="approach-panel active" id="q8-brute">
                  <div className="complexity">
                    Time: <b>O(n)</b> · Space: <b>O(n)</b> — two searches that
                    ignore the ordering, plus both stored paths
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`TreeNode lca(TreeNode root, int p, int q) {
    List<TreeNode> pathP = new ArrayList<>(), pathQ = new ArrayList<>();
    findPath(root, p, pathP);
    findPath(root, q, pathQ);
    int i = 0;
    while (i < pathP.size() && i < pathQ.size()
           && pathP.get(i) == pathQ.get(i)) i++;
    return pathP.get(i - 1);
}

boolean findPath(TreeNode node, int target, List<TreeNode> path) {
    if (node == null) return false;
    path.add(node);
    if (node.val == target) return true;
    if (findPath(node.left, target, path)) return true;
    if (findPath(node.right, target, path)) return true;
    path.remove(path.size() - 1);
    return false;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def find_path(node, target, path):
    if not node:
        return False
    path.append(node)
    if node.val == target:
        return True
    if find_path(node.left, target, path) or find_path(node.right, target, path):
        return True
    path.pop()
    return False

def lca(root, p, q):
    path_p, path_q = [], []
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    i = 0
    while i < len(path_p) and i < len(path_q) and path_p[i] is path_q[i]:
        i += 1
    return path_p[i - 1]`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q8-opt">
                  <div className="complexity">
                    Time: <b>O(h)</b> · Space: <b>O(1)</b> — the BST ordering
                    decides each turn, so one descent with no extra memory is
                    enough
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`TreeNode lca(TreeNode root, int p, int q) {
    TreeNode node = root;
    while (node != null) {
        if (p < node.val && q < node.val)      node = node.left;
        else if (p > node.val && q > node.val) node = node.right;
        else return node;
    }
    return null;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def lca(root, p, q):
    node = root
    while node:
        if p < node.val and q < node.val:
            node = node.left
        elif p > node.val and q > node.val:
            node = node.right
        else:
            return node
    return None`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The optimal version only
                works because the tree is ordered. What is the smallest change
                that makes it correct for a plain binary tree, and what does
                that cost you?
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
