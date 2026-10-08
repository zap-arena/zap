import type React from "react";
import GraphTypesGallery from "../../components/guide/GraphTypesGallery";
import GraphVisualizer from "../../components/guide/GraphVisualizer";
import {
  connectedComponentsApproaches,
  cycleDetectionApproaches,
  DEFAULT_COMPONENTS,
  DEFAULT_DAG,
  DEFAULT_UNDIRECTED,
  DEFAULT_WEIGHTED,
  dijkstraApproaches,
  graphBfsApproaches,
  graphDfsApproaches,
  topoSortApproaches,
} from "../../components/guide/graphVisualizations";
import Navbar from "../../components/Navbar";
import { useGuideLogic } from "../../hooks/useGuideLogic";

export default function GraphDsaGuidePage() {
  useGuideLogic();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="layout">
        <nav className="sidebar" aria-label="Question navigation">
          <div className="sidebar-title">Graphs</div>
          <div className="side-group">
            <div className="side-group-label">Foundations</div>
            <a className="side-link" href="#q1">
              01 · Types of Graphs
            </a>
            <a className="side-link" href="#q2">
              02 · Depth First Search (DFS)
            </a>
            <a className="side-link" href="#q3">
              03 · Breadth First Search (BFS)
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Medium</div>
            <a className="side-link" href="#q4">
              04 · Cycle Detection
            </a>
            <a className="side-link" href="#q5">
              05 · Topological Sort
            </a>
            <a className="side-link" href="#q6">
              06 · Number of Connected Components
            </a>
          </div>
          <div className="side-group">
            <div className="side-group-label">Weighted</div>
            <a className="side-link" href="#q7">
              07 · Shortest Path with Weights
            </a>
          </div>
        </nav>

        <div className="main">
          <div className="topbar">
            <div className="brand">
              <span className="mark">Graphs</span>
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
              <h1>Graphs, foundations to shortest paths</h1>
              <p>
                A graph is a tree that stopped promising anything: edges can
                point back, two paths can meet, and whole chunks can be
                unreachable. Exactly one line of code buys back all of that
                safety — the visited set — and almost every algorithm here is
                DFS or BFS plus one extra piece of bookkeeping carried alongside
                it.
              </p>
              <p>
                Every visualiser takes an <b>edge list</b>: write{" "}
                <code>A-B</code> for an undirected edge, <code>A&gt;B</code> for
                a directed one, and add <code>:4</code> for a weight. A bare
                name like <code>F</code> adds an isolated vertex, so you can
                build disconnected graphs too.
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
                  Brute force (re-searches / ignores structure)
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
                  Optimal (one pass, each edge touched once)
                </span>
              </div>
            </div>

            {/* ---------------------------------------------- Q1 */}
            <section className="question" id="q1">
              <div className="q-head">
                <span className="q-index">01</span>
                <h2>Types of Graphs</h2>
                <span className="level-badge basic">Reference</span>
              </div>
              <p className="prompt">
                Four independent questions decide which algorithm you are even
                allowed to use: are the edges directed, are they weighted, is
                there a cycle, and is the whole thing connected? Get one of them
                wrong and a correct-looking algorithm returns a wrong answer —
                BFS on a weighted graph is the classic example.
              </p>

              <GraphTypesGallery />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q1-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q1-brute"
                  >
                    Adjacency Matrix
                  </button>
                  <button className="tab-btn optimal" data-target="q1-opt">
                    Adjacency List
                  </button>
                </div>
                <div className="approach-panel active" id="q1-brute">
                  <div className="complexity">
                    Space: <b>O(V²)</b> always · edge lookup <b>O(1)</b> ·
                    iterating one vertex&apos;s neighbours <b>O(V)</b> even if
                    it has none
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean[][] adj = new boolean[V][V];

void addEdge(int u, int v, boolean directed) {
    adj[u][v] = true;
    if (!directed) adj[v][u] = true;
}

// Instant answer to "is there an edge u-v?"
boolean hasEdge(int u, int v) { return adj[u][v]; }

// But a traversal pays O(V) per vertex no matter how sparse,
// so a full DFS costs O(V^2) instead of O(V + E).
for (int v = 0; v < V; v++)
    if (adj[u][v]) { /* neighbour */ }`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`adj = [[0] * V for _ in range(V)]

def add_edge(u, v, directed=False):
    adj[u][v] = 1
    if not directed:
        adj[v][u] = 1

# Worth it only when the graph is dense (E close to V^2),
# or when you need O(1) edge tests in a tight loop.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q1-opt">
                  <div className="complexity">
                    Space: <b>O(V + E)</b> · iterating neighbours is
                    proportional to the real degree, which is what makes DFS and
                    BFS <b>O(V + E)</b>
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < V; i++) adj.add(new ArrayList<>());

void addEdge(int u, int v, boolean directed) {
    adj.get(u).add(v);
    if (!directed) adj.get(v).add(u);   // both ways
}

// Weighted variant: store the weight next to the target.
record Edge(int to, int weight) {}
List<List<Edge>> weighted = new ArrayList<>();

// Real graphs are sparse (E ~ V), so this is the default choice.`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import defaultdict

adj = defaultdict(list)

def add_edge(u, v, directed=False):
    adj[u].append(v)
    if not directed:
        adj[v].append(u)

# Weighted:
wadj = defaultdict(list)
wadj[u].append((v, w))

# Edge test is now O(degree), which is the trade you make
# for traversals that cost O(V + E) instead of O(V^2).`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> A social network has 1
                billion users and roughly 300 friends each. Work out the memory
                for both representations. Which one is physically impossible,
                and by how many orders of magnitude?
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
                Follow one edge as deep as it goes, then back up and try the
                next. The code is tree DFS with one addition: a visited set.
                Without it a single cycle makes the walk run forever, and with
                it every vertex is entered exactly once.
              </p>
              <div className="example">
                Input: A-B, A-C, B-D, C-D, C-E, D-F, E-F from A → visits [A, B,
                D, C, E, F] — D is reachable from both B and C, and the second
                attempt is skipped
              </div>

              <GraphVisualizer
                title="Graph DFS"
                approaches={graphDfsApproaches}
                defaultInput={DEFAULT_UNDIRECTED}
                targetFields={[{ label: "Start", defaultValue: "A" }]}
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q2-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q2-brute"
                  >
                    Recursive
                  </button>
                  <button className="tab-btn optimal" data-target="q2-opt">
                    Iterative
                  </button>
                </div>
                <div className="approach-panel active" id="q2-brute">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — the recursion
                    depth is the longest path, so a 100 000-vertex chain
                    overflows the call stack
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`void dfs(int u, List<List<Integer>> adj, boolean[] visited, List<Integer> out) {
    visited[u] = true;
    out.add(u);
    for (int v : adj.get(u)) {
        if (!visited[v]) dfs(v, adj, visited, out);
    }
}

// One call only covers one component.
List<Integer> dfsAll(List<List<Integer>> adj, int n) {
    boolean[] visited = new boolean[n];
    List<Integer> out = new ArrayList<>();
    for (int u = 0; u < n; u++)
        if (!visited[u]) dfs(u, adj, visited, out);
    return out;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def dfs(u, adj, visited, out):
    visited.add(u)
    out.append(u)
    for v in adj[u]:
        if v not in visited:
            dfs(v, adj, visited, out)


def dfs_all(adj, nodes):
    visited, out = set(), []
    for u in nodes:
        if u not in visited:
            dfs(u, adj, visited, out)
    return out

# CPython's default recursion limit is 1000 — a long chain
# raises RecursionError long before it runs out of memory.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q2-opt">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — same work, but
                    the stack lives on the heap, so depth is limited by memory
                    rather than by the runtime
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<Integer> dfs(int start, List<List<Integer>> adj, int n) {
    boolean[] visited = new boolean[n];
    List<Integer> out = new ArrayList<>();
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int u = stack.pop();
        if (visited[u]) continue;   // it may have been pushed twice
        visited[u] = true;
        out.add(u);
        List<Integer> nbrs = adj.get(u);
        for (int i = nbrs.size() - 1; i >= 0; i--) {
            int v = nbrs.get(i);
            if (!visited[v]) stack.push(v);
        }
    }
    return out;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def dfs(start, adj):
    visited, out = set(), []
    stack = [start]

    while stack:
        u = stack.pop()
        if u in visited:          # duplicate push, discard it
            continue
        visited.add(u)
        out.append(u)
        for v in reversed(adj[u]):
            if v not in visited:
                stack.append(v)
    return out

# Marking on *pop* rather than on push is what keeps duplicate
# pushes harmless — and reversing matches the recursive order.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> The iterative version can
                push the same vertex several times before it is ever popped. Why
                does that not break correctness, and what is the worst-case size
                the stack can reach?
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
                Find the fewest edges between two vertices. BFS drains distance
                0, then distance 1, then distance 2 — so the first time it
                dequeues the goal, no shorter route can possibly exist. DFS has
                no such guarantee and must finish every path before it can be
                sure.
              </p>
              <div className="example">
                Input: A-B, A-C, B-D, C-D, C-E, D-F, E-F · from A to F → 3 edges
                (A → B → D → F), found after dequeuing only part of the graph
              </div>

              <GraphVisualizer
                title="Shortest Path, Unweighted"
                approaches={graphBfsApproaches}
                defaultInput={DEFAULT_UNDIRECTED}
                targetFields={[
                  { label: "Start", defaultValue: "A" },
                  { label: "Goal", defaultValue: "F" },
                ]}
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
                    Time: <b>O(V!)</b> worst case · Space: <b>O(V)</b> — every
                    simple path has to be enumerated and compared
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int best = Integer.MAX_VALUE;

void dfs(int u, int goal, int depth, Set<Integer> onPath, List<List<Integer>> adj) {
    if (u == goal) { best = Math.min(best, depth); return; }
    onPath.add(u);
    for (int v : adj.get(u))
        if (!onPath.contains(v)) dfs(v, goal, depth + 1, onPath, adj);
    onPath.remove(u);     // backtrack: v may belong to another path
}

// The first route DFS finds is just whichever branch it tried first,
// so it cannot return early — it has to see them all.`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def shortest_dfs(start, goal, adj):
    best = float("inf")

    def dfs(u, depth, on_path):
        nonlocal best
        if u == goal:
            best = min(best, depth)
            return
        on_path.add(u)
        for v in adj[u]:
            if v not in on_path:
                dfs(v, depth + 1, on_path)
        on_path.discard(u)   # must un-mark, or valid paths get cut

    dfs(start, 0, set())
    return best`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q3-opt">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — the queue is
                    sorted by distance for free, so the first arrival is already
                    the shortest
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int shortestPath(int start, int goal, List<List<Integer>> adj, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, -1);
    dist[start] = 0;

    Deque<Integer> queue = new ArrayDeque<>();
    queue.add(start);

    while (!queue.isEmpty()) {
        int u = queue.poll();
        if (u == goal) return dist[u];      // first arrival is optimal
        for (int v : adj.get(u)) {
            if (dist[v] == -1) {            // first time = shortest time
                dist[v] = dist[u] + 1;
                queue.add(v);
            }
        }
    }
    return -1;      // different component
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def shortest_path(start, goal, adj):
    dist = {start: 0}
    parent = {}
    queue = deque([start])

    while queue:
        u = queue.popleft()
        if u == goal:
            path = []
            while u is not None:
                path.append(u)
                u = parent.get(u)
            return dist[goal], path[::-1]
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                parent[v] = u
                queue.append(v)
    return -1, []

# Mark distances when you *enqueue*, never when you dequeue —
# otherwise a vertex can enter the queue many times.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Run BFS from both the start
                and the goal at the same time and stop when the two frontiers
                meet. If the branching factor is b and the distance is d, why
                does that turn b^d into roughly 2·b^(d/2)?
              </div>
            </section>

            {/* ---------------------------------------------- Q4 */}
            <section className="question" id="q4">
              <div className="q-head">
                <span className="q-index">04</span>
                <h2>Cycle Detection</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                &quot;Does following the edges ever bring me back?&quot; The
                answer needs two genuinely different rules. Undirected: an
                already-visited neighbour is a cycle <em>unless</em> it is the
                vertex you came from. Directed: an already-visited vertex is
                fine — only one that is still on the current path counts.
              </p>
              <div className="example">
                Undirected A-B, B-C, C-D, D-B, D-E → cycle B–C–D–B · Directed
                A&gt;B, B&gt;C, C&gt;D, D&gt;B, A&gt;E → cycle B→C→D→B
              </div>

              <GraphVisualizer
                title="Undirected: visited + parent"
                approaches={{ undirected: cycleDetectionApproaches.undirected }}
                defaultInput="A-B, B-C, C-D, D-B, D-E"
              />

              <GraphVisualizer
                title="Directed: recursion stack"
                approaches={{ directed: cycleDetectionApproaches.directed }}
                defaultInput="A>B, B>C, C>D, D>B, A>E"
              />

              <div className="tabs-wrapper">
                <div className="approach-tabs" data-tabgroup="q4-approach">
                  <button
                    className="tab-btn brute active"
                    data-target="q4-brute"
                  >
                    Undirected
                  </button>
                  <button className="tab-btn optimal" data-target="q4-opt">
                    Directed
                  </button>
                </div>
                <div className="approach-panel active" id="q4-brute">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — skipping the
                    parent is mandatory, because every undirected edge exists in
                    both adjacency lists
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean dfs(int u, int parent, List<List<Integer>> adj, boolean[] visited) {
    visited[u] = true;
    for (int v : adj.get(u)) {
        if (v == parent) continue;        // the edge we arrived on
        if (visited[v]) return true;      // a real back edge
        if (dfs(v, u, adj, visited)) return true;
    }
    return false;
}

boolean hasCycle(List<List<Integer>> adj, int n) {
    boolean[] visited = new boolean[n];
    for (int u = 0; u < n; u++)
        if (!visited[u] && dfs(u, -1, adj, visited)) return true;
    return false;   // acyclic + connected == a tree
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def has_cycle(adj, nodes):
    visited = set()

    def dfs(u, parent):
        visited.add(u)
        for v in adj[u]:
            if v == parent:
                continue
            if v in visited or dfs(v, u):
                return True
        return False

    return any(u not in visited and dfs(u, None) for u in nodes)

# Careful: "skip the parent" only works for simple graphs.
# With parallel edges, A-B twice really is a cycle.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q4-opt">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — a vertex
                    reachable by two different paths is legal, so only an edge
                    into the <em>active</em> path is a cycle
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean dfs(int u, List<List<Integer>> adj, boolean[] visited, boolean[] onStack) {
    visited[u] = true;
    onStack[u] = true;
    for (int v : adj.get(u)) {
        if (onStack[v]) return true;                       // back edge
        if (!visited[v] && dfs(v, adj, visited, onStack)) return true;
        // visited but not onStack -> cross edge, perfectly fine
    }
    onStack[u] = false;      // u is no longer on the current path
    return false;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`WHITE, GREY, BLACK = 0, 1, 2   # unseen, on path, finished

def has_cycle(adj, nodes):
    colour = dict.fromkeys(nodes, WHITE)

    def dfs(u):
        colour[u] = GREY
        for v in adj[u]:
            if colour[v] == GREY:          # points into the active path
                return True
            if colour[v] == WHITE and dfs(v):
                return True
        colour[u] = BLACK                  # finished, safe to revisit
        return False

    return any(colour[u] == WHITE and dfs(u) for u in nodes)

# Using only a visited set here reports a cycle for the DAG
# A->B, A->C, B->D, C->D, which has none.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> In the directed version,
                resetting <code>onStack[u]</code> on the way out is the whole
                trick. Build a 4-vertex DAG that is wrongly reported as cyclic
                if you forget that line.
              </div>
            </section>

            {/* ---------------------------------------------- Q5 */}
            <section className="question" id="q5">
              <div className="q-head">
                <span className="q-index">05</span>
                <h2>Topological Sort</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Order the vertices of a DAG so every edge points forwards —
                tasks before the tasks that depend on them. The obvious version
                recomputes every indegree each round; Kahn&apos;s algorithm
                counts them once and then only adjusts the neighbours of the
                vertex it just removed.
              </p>
              <div className="example">
                Input: A&gt;C, B&gt;C, C&gt;D, C&gt;E, D&gt;F, E&gt;F → [A, B,
                C, D, E, F] — A and B are interchangeable, which is why a
                topological order is not unique
              </div>

              <GraphVisualizer
                title="Topological Sort"
                approaches={topoSortApproaches}
                defaultInput={DEFAULT_DAG}
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
                    Time: <b>O(V² + V·E)</b> · Space: <b>O(V)</b> — a full
                    indegree rebuild per output vertex
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<Integer> topoSlow(List<List<Integer>> adj, int n) {
    Set<Integer> remaining = new LinkedHashSet<>();
    for (int i = 0; i < n; i++) remaining.add(i);
    List<Integer> order = new ArrayList<>();

    while (!remaining.isEmpty()) {
        int[] indeg = new int[n];                  // thrown away each round
        for (int u : remaining)
            for (int v : adj.get(u))
                if (remaining.contains(v)) indeg[v]++;

        Integer pick = null;
        for (int u : remaining) if (indeg[u] == 0) { pick = u; break; }
        if (pick == null) throw new IllegalStateException("cycle");

        order.add(pick);
        remaining.remove(pick);
    }
    return order;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def topo_slow(adj, nodes):
    remaining = set(nodes)
    order = []

    while remaining:
        indeg = dict.fromkeys(remaining, 0)
        for u in remaining:                 # full rescan, every round
            for v in adj[u]:
                if v in remaining:
                    indeg[v] += 1

        pick = next((u for u in remaining if indeg[u] == 0), None)
        if pick is None:
            raise ValueError("cycle")
        order.append(pick)
        remaining.discard(pick)
    return order`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q5-opt">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — one pass to
                    count, one decrement per edge, and cycle detection comes
                    free
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`List<Integer> kahn(List<List<Integer>> adj, int n) {
    int[] indeg = new int[n];
    for (int u = 0; u < n; u++)
        for (int v : adj.get(u)) indeg[v]++;        // single pass

    Deque<Integer> queue = new ArrayDeque<>();
    for (int u = 0; u < n; u++) if (indeg[u] == 0) queue.add(u);

    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : adj.get(u))
            if (--indeg[v] == 0) queue.add(v);      // only the neighbours
    }

    if (order.size() < n) throw new IllegalStateException("cycle");
    return order;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def kahn(adj, nodes):
    indeg = dict.fromkeys(nodes, 0)
    for u in nodes:
        for v in adj[u]:
            indeg[v] += 1

    queue = deque(u for u in nodes if indeg[u] == 0)
    order = []

    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                queue.append(v)

    if len(order) < len(nodes):
        raise ValueError("cycle")   # stuck vertices == a cycle
    return order`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Swap the queue for a
                min-heap. You now get the lexicographically smallest valid
                order. What does that cost, and why can you not get the same
                result by sorting the output afterwards?
              </div>
            </section>

            {/* ---------------------------------------------- Q6 */}
            <section className="question" id="q6">
              <div className="q-head">
                <span className="q-index">06</span>
                <h2>Number of Connected Components</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Count the separate islands. The brute force asks &quot;can u
                reach v?&quot; for every pair and runs a fresh search each time.
                The optimal version notices that one flood fill permanently
                claims an entire component, so a single sweep of the vertex list
                is enough.
              </p>
              <div className="example">
                Input: A-B, B-C, D-E, F → 3 components: &#123;A, B, C&#125;,
                &#123;D, E&#125; and the isolated &#123;F&#125;
              </div>

              <GraphVisualizer
                title="Connected Components"
                approaches={connectedComponentsApproaches}
                defaultInput={DEFAULT_COMPONENTS}
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
                    Time: <b>O(V² · (V + E))</b> · Space: <b>O(V)</b> — a
                    complete search per pair of vertices
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`boolean reachable(int from, int to, List<List<Integer>> adj, int n) {
    boolean[] seen = new boolean[n];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(from); seen[from] = true;
    while (!stack.isEmpty()) {
        int u = stack.pop();
        if (u == to) return true;
        for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; stack.push(v); }
    }
    return false;
}

int countSlow(List<List<Integer>> adj, int n) {
    int[] group = new int[n];
    Arrays.fill(group, -1);
    int count = 0;
    for (int u = 0; u < n; u++) {
        if (group[u] != -1) continue;
        group[u] = count++;
        for (int v = 0; v < n; v++)                 // a whole search per pair
            if (group[v] == -1 && reachable(u, v, adj, n)) group[v] = group[u];
    }
    return count;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def reachable(src, dst, adj):
    seen, stack = {src}, [src]
    while stack:
        u = stack.pop()
        if u == dst:
            return True
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                stack.append(v)
    return False


def count_slow(adj, nodes):
    group, count = {}, 0
    for u in nodes:
        if u in group:
            continue
        group[u] = count
        count += 1
        for v in nodes:                   # re-explores the same vertices
            if v not in group and reachable(u, v, adj):
                group[v] = group[u]
    return count`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q6-opt">
                  <div className="complexity">
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — every vertex
                    and every edge is touched exactly once, regardless of the
                    number of components
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int countComponents(List<List<Integer>> adj, int n) {
    boolean[] visited = new boolean[n];
    int count = 0;

    for (int start = 0; start < n; start++) {
        if (visited[start]) continue;
        count++;                                // untouched == brand new
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(start); visited[start] = true;
        while (!stack.isEmpty()) {
            int u = stack.pop();
            for (int v : adj.get(u))
                if (!visited[v]) { visited[v] = true; stack.push(v); }
        }
    }
    return count;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`def count_components(adj, nodes):
    visited, count = set(), 0

    for start in nodes:
        if start in visited:
            continue
        count += 1                  # nobody flooded it, so it is new
        stack = [start]
        visited.add(start)
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if v not in visited:
                    visited.add(v)
                    stack.append(v)
    return count

# Union-Find solves it in near O(V + E) too, and additionally
# handles edges arriving one at a time (streaming).`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Edges now arrive one at a
                time and you must report the component count after each one.
                Flood fill would restart every time — which structure gives you
                the answer in near-constant time per edge, and why?
              </div>
            </section>

            {/* ---------------------------------------------- Q7 */}
            <section className="question" id="q7">
              <div className="q-head">
                <span className="q-index">07</span>
                <h2>Shortest Path with Weights</h2>
                <span className="level-badge medium">Medium</span>
              </div>
              <p className="prompt">
                Weights break BFS. BFS minimises the number of edges, which has
                nothing to do with total cost — it will happily pick a single
                edge of weight 10 over two edges of weight 2. Dijkstra fixes it
                by always expanding the cheapest unsettled vertex instead of the
                nearest one.
              </p>
              <div className="example">
                Input: A-B:4, A-C:2, B-C:5, B-D:10, C-E:3, E-D:4, D-F:11 · A → D
                → BFS says A→B→D (2 hops, cost 14); Dijkstra says A→C→E→D (3
                hops, cost 9)
              </div>

              <GraphVisualizer
                title="Dijkstra vs BFS"
                approaches={dijkstraApproaches}
                defaultInput={DEFAULT_WEIGHTED}
                targetFields={[
                  { label: "Start", defaultValue: "A" },
                  { label: "Goal", defaultValue: "D" },
                ]}
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
                    Time: <b>O(V + E)</b> · Space: <b>O(V)</b> — fast, and
                    answers the wrong question on a weighted graph
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`// BFS counts hops. On a weighted graph that is not the cost.
int[] hops = new int[n];
Arrays.fill(hops, -1);
hops[start] = 0;
Deque<Integer> queue = new ArrayDeque<>();
queue.add(start);

while (!queue.isEmpty()) {
    int u = queue.poll();
    for (Edge e : adj.get(u)) {
        if (hops[e.to()] == -1) {
            hops[e.to()] = hops[u] + 1;   // e.weight() is never read
            queue.add(e.to());
        }
    }
}

// Equivalent to pretending every weight is 1. Which is exactly
// why BFS *is* correct when every weight really is 1.`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`from collections import deque

def bfs_hops(start, adj):
    hops = {start: 0}
    queue = deque([start])
    while queue:
        u = queue.popleft()
        for v, _weight in adj[u]:      # the weight is discarded
            if v not in hops:
                hops[v] = hops[u] + 1
                queue.append(v)
    return hops

# A 1-edge route of weight 100 beats a 2-edge route of weight 3
# under this metric. The code is right; the metric is wrong.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="approach-panel" id="q7-opt">
                  <div className="complexity">
                    Time: <b>O(E log V)</b> with a binary heap · Space:{" "}
                    <b>O(V)</b> — needs non-negative weights, which is what
                    makes a settled distance final
                  </div>
                  <div className="lang-wrapper code-split">
                    <div className="code-col col-java">
                      <div className="code-label java">Java</div>
                      <pre className="code-panel">
                        <code>{`int[] dijkstra(int start, List<List<Edge>> adj, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[start] = 0;

    PriorityQueue<int[]> pq =
        new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    pq.add(new int[] { start, 0 });

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int u = top[0], d = top[1];
        if (d > dist[u]) continue;            // stale heap entry
        for (Edge e : adj.get(u)) {
            int candidate = d + e.weight();
            if (candidate < dist[e.to()]) {
                dist[e.to()] = candidate;     // relax
                pq.add(new int[] { e.to(), candidate });
            }
        }
    }
    return dist;
}`}</code>
                      </pre>
                    </div>
                    <div className="code-col col-py">
                      <div className="code-label py">Python</div>
                      <pre className="code-panel">
                        <code>{`import heapq

def dijkstra(start, adj):
    dist = {start: 0}
    heap = [(0, start)]

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float("inf")):
            continue                     # stale entry, already improved
        for v, w in adj[u]:
            candidate = d + w
            if candidate < dist.get(v, float("inf")):
                dist[v] = candidate
                heapq.heappush(heap, (candidate, v))
    return dist

# "Lazy deletion": push duplicates and skip stale pops, because
# heapq has no decrease-key operation.`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="twist">
                <strong>One step further:</strong> Dijkstra&apos;s proof rests
                on &quot;no later path can be cheaper&quot;. Construct a
                3-vertex graph with one negative edge where it returns the wrong
                answer, then name the algorithm you would reach for instead.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
