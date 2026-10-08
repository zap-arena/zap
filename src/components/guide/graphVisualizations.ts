import type {
  GraphApproachRunner,
  GraphEdgeState,
  GraphNodeState,
  GraphStep,
  GraphVizEdge,
  GraphVizNode,
  ParsedGraph,
} from "./GraphVisualizer";

type Approaches = Partial<
  Record<
    "undirected" | "directed" | "brute" | "optimal" | "alt",
    GraphApproachRunner
  >
>;

type NodeStates = Map<number, GraphNodeState>;
type NodeNotes = Map<number, string>;
/** keyed by `${from}-${to}` in the orientation the edge was declared */
type EdgeStates = Map<string, GraphEdgeState>;

const edgeKey = (from: number, to: number) => `${from}-${to}`;

function snapshot(
  graph: ParsedGraph,
  states: NodeStates,
  edgeStates: EdgeStates = new Map(),
  notes?: NodeNotes,
): { nodes: GraphVizNode[]; edges: GraphVizEdge[] } {
  const nodes: GraphVizNode[] = graph.nodes.map((node) => ({
    id: node.id,
    x: node.x,
    y: node.y,
    label: node.label,
    state: states.get(node.id) ?? "idle",
    note: notes?.get(node.id),
  }));
  const edges: GraphVizEdge[] = graph.edges.map((edge) => ({
    from: edge.from,
    to: edge.to,
    directed: edge.directed,
    weight: edge.weight,
    state:
      edgeStates.get(edgeKey(edge.from, edge.to)) ??
      (edge.directed
        ? "idle"
        : (edgeStates.get(edgeKey(edge.to, edge.from)) ?? "idle")),
  }));
  return { nodes, edges };
}

function emptyGraphStep(message: string): GraphStep[] {
  return [
    {
      description: message,
      nodes: [],
      edges: [],
      variables: {},
      headline: "Empty graph",
      tag: { label: "Done", tone: "info" },
      done: true,
    },
  ];
}

/** Resolves a target field to a vertex id, falling back to the first vertex. */
function resolveVertex(graph: ParsedGraph, raw: string | undefined): number {
  if (raw !== undefined) {
    const byLabel = graph.idOf(raw);
    if (byLabel !== undefined) return byLabel;
  }
  return graph.nodes[0]?.id ?? 0;
}

/** Marks the edge that was actually traversed, in whichever direction it exists. */
function markTraversed(
  graph: ParsedGraph,
  edgeStates: EdgeStates,
  from: number,
  to: number,
  state: GraphEdgeState,
) {
  const direct = graph.edges.find((e) => e.from === from && e.to === to);
  if (direct) {
    edgeStates.set(edgeKey(from, to), state);
    return;
  }
  const reverse = graph.edges.find(
    (e) => !e.directed && e.from === to && e.to === from,
  );
  if (reverse) edgeStates.set(edgeKey(to, from), state);
}

export const DEFAULT_UNDIRECTED = "A-B, A-C, B-D, C-D, C-E, D-F, E-F";
export const DEFAULT_DIRECTED = "A>B, A>C, B>D, C>D, D>E, E>F, F>C";
export const DEFAULT_DAG = "A>C, B>C, C>D, C>E, D>F, E>F";
export const DEFAULT_WEIGHTED =
  "A-B:4, A-C:2, B-C:5, B-D:10, C-E:3, E-D:4, D-F:11";
export const DEFAULT_COMPONENTS = "A-B, B-C, D-E, F";

/* ------------------------------------------------------------------ */
/* 02 · Graph DFS                                                       */
/* ------------------------------------------------------------------ */

export const graphDfsApproaches: Approaches = {
  brute: {
    label: "Recursive (call stack)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 each vertex is marked once and each edge is looked at once; the depth of the recursion is the length of the longest path, so a long chain can overflow the call stack",
    code: [
      "function dfs(u) {",
      "  visited.add(u);",
      "  order.push(u);",
      "  for (const v of adj[u]) {",
      "    if (!visited.has(v)) dfs(v);   // skip is what stops cycles",
      "  }",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const visited = new Set<number>();
      const order: string[] = [];
      const callStack: string[] = [];

      const dfs = (u: number) => {
        visited.add(u);
        order.push(graph.labelOf(u));
        notes.set(u, `#${order.length}`);
        states.set(u, "active");
        callStack.push(graph.labelOf(u));
        steps.push({
          description: `Mark ${graph.labelOf(u)} visited and record it. Unlike a tree, a graph can reach the same vertex from several directions, so the visited set is what keeps this terminating.`,
          ...snapshot(graph, states, edgeStates, notes),
          output: [...order],
          outputLabel: "dfs order",
          structure: { label: "call stack", entries: [...callStack] },
          variables: {
            u: graph.labelOf(u),
            visited: visited.size,
            "stack depth": callStack.length,
          },
          headline: `visit ${graph.labelOf(u)}`,
          tag: { label: "Visit", tone: "success" },
          codeLine: 3,
        });

        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (visited.has(v)) {
            markTraversed(graph, edgeStates, u, v, "rejected");
            steps.push({
              description: `${graph.labelOf(v)} is already visited, so the edge ${graph.labelOf(u)} \u2192 ${graph.labelOf(v)} is skipped \u2014 without this check the walk would loop forever.`,
              ...snapshot(graph, states, edgeStates, notes),
              output: [...order],
              outputLabel: "dfs order",
              structure: { label: "call stack", entries: [...callStack] },
              variables: { u: graph.labelOf(u), v: graph.labelOf(v) },
              headline: `skip ${graph.labelOf(v)}`,
              tag: { label: "Already Seen", tone: "danger" },
              codeLine: 5,
            });
            markTraversed(graph, edgeStates, u, v, "idle");
            continue;
          }
          markTraversed(graph, edgeStates, u, v, "used");
          states.set(u, "visited");
          dfs(v);
          states.set(u, "active");
        }

        states.set(u, "visited");
        callStack.pop();
      };

      dfs(start);
      const unreached = graph.nodes.filter((n) => !visited.has(n.id));
      steps.push({
        description:
          unreached.length > 0
            ? `DFS from ${graph.labelOf(start)} reached ${visited.size} of ${graph.nodes.length} vertices. ${unreached.map((n) => n.label).join(", ")} sit in a different component \u2014 one DFS only covers the component you start in.`
            : `DFS from ${graph.labelOf(start)} reached all ${visited.size} vertices, following each edge once.`,
        ...snapshot(graph, states, edgeStates, notes),
        output: [...order],
        outputLabel: "dfs order",
        structure: { label: "call stack", entries: [] },
        variables: { order: order.join(" \u2192 "), visited: visited.size },
        headline: `[${order.join(", ")}]`,
        tag: {
          label: "Done",
          tone: unreached.length > 0 ? "info" : "success",
        },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Iterative (explicit stack)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 identical work with the stack moved onto the heap, so depth is bounded by memory instead of the runtime's recursion limit",
    code: [
      "const stack = [start];",
      "while (stack.length) {",
      "  const u = stack.pop();",
      "  if (visited.has(u)) continue;",
      "  visited.add(u); order.push(u);",
      "  for (const v of [...adj[u]].reverse())",
      "    if (!visited.has(v)) stack.push(v);",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const visited = new Set<number>();
      const order: string[] = [];
      const stack: number[] = [start];

      while (stack.length > 0) {
        const u = stack.pop() as number;
        if (visited.has(u)) {
          steps.push({
            description: `${graph.labelOf(u)} was pushed more than once and is already visited \u2014 pop and discard. The visited check on pop is what makes duplicate pushes harmless.`,
            ...snapshot(graph, states, edgeStates, notes),
            output: [...order],
            outputLabel: "dfs order",
            structure: {
              label: "stack",
              entries: stack.map((n) => graph.labelOf(n)),
            },
            variables: { popped: graph.labelOf(u), visited: visited.size },
            headline: `discard ${graph.labelOf(u)}`,
            tag: { label: "Stale Entry", tone: "danger" },
            codeLine: 4,
          });
          continue;
        }

        visited.add(u);
        order.push(graph.labelOf(u));
        notes.set(u, `#${order.length}`);
        states.set(u, "active");

        const pushed: string[] = [];
        for (const { to: v } of [...(graph.adjacency.get(u) ?? [])].reverse()) {
          if (!visited.has(v)) {
            stack.push(v);
            pushed.push(graph.labelOf(v));
            markTraversed(graph, edgeStates, u, v, "used");
          }
        }

        steps.push({
          description:
            pushed.length > 0
              ? `Pop ${graph.labelOf(u)}, record it, and push its unvisited neighbours ${pushed.join(", ")}. The last one pushed is the first one popped, which is what makes this depth first.`
              : `Pop ${graph.labelOf(u)} and record it \u2014 every neighbour is already visited, so nothing new goes on the stack and the walk backtracks.`,
          ...snapshot(graph, states, edgeStates, notes),
          output: [...order],
          outputLabel: "dfs order",
          structure: {
            label: "stack",
            entries: stack.map((n) => graph.labelOf(n)),
          },
          variables: {
            u: graph.labelOf(u),
            pushed: pushed.length,
            "stack size": stack.length,
          },
          headline: `visit ${graph.labelOf(u)}`,
          tag: { label: "Visit", tone: "success" },
          codeLine: 5,
        });
        states.set(u, "visited");
      }

      steps.push({
        description: `The stack drained after ${order.length} vertices \u2014 same component, same depth-first shape, no recursion involved.`,
        ...snapshot(graph, states, edgeStates, notes),
        output: [...order],
        outputLabel: "dfs order",
        structure: { label: "stack", entries: [] },
        variables: { order: order.join(" \u2192 "), visited: visited.size },
        headline: `[${order.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 03 · Graph BFS \u00b7 shortest path in an unweighted graph                */
/* ------------------------------------------------------------------ */

export const graphBfsApproaches: Approaches = {
  brute: {
    label: "DFS (must finish every path)",
    complexity:
      "Time: O(V!) worst case \u00b7 Space: O(V) \u2014 to be sure a path is shortest, plain DFS has to enumerate every simple path and keep the best, because the first one it finds is whichever branch it happened to take",
    code: [
      "function dfs(u, depth) {",
      "  if (u === goal) { best = Math.min(best, depth); return; }",
      "  onPath.add(u);",
      "  for (const v of adj[u])",
      "    if (!onPath.has(v)) dfs(v, depth + 1);",
      "  onPath.delete(u);   // backtrack: v may be on another path",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const goal = resolveVertex(graph, targets[1]);
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const onPath = new Set<number>();
      const path: string[] = [];
      let best = Number.POSITIVE_INFINITY;
      let bestPath: string[] = [];
      let explored = 0;
      const MAX_STEPS = 70;

      const dfs = (u: number, depth: number) => {
        if (steps.length > MAX_STEPS) return;
        explored++;
        path.push(graph.labelOf(u));

        if (u === goal) {
          const improved = depth < best;
          if (improved) {
            best = depth;
            bestPath = [...path];
          }
          states.set(u, improved ? "result" : "rejected");
          steps.push({
            description: improved
              ? `Reached ${graph.labelOf(goal)} along ${path.join(" \u2192 ")} with ${depth} edge(s) \u2014 a new best, but DFS still has to try every other path to be sure.`
              : `Reached ${graph.labelOf(goal)} again along ${path.join(" \u2192 ")} with ${depth} edge(s), which is no better than ${best}. The work was wasted.`,
            ...snapshot(graph, states, new Map(), notes),
            structure: { label: "current path", entries: [...path] },
            variables: {
              depth,
              "best so far": best,
              "paths explored": explored,
            },
            headline: improved ? `new best = ${depth}` : `no better (${depth})`,
            tag: improved
              ? { label: "Candidate", tone: "info" }
              : { label: "Wasted Path", tone: "danger" },
            codeLine: 2,
          });
          states.set(u, "idle");
          path.pop();
          return;
        }

        onPath.add(u);
        states.set(u, "active");
        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (!onPath.has(v)) dfs(v, depth + 1);
        }
        onPath.delete(u);
        states.set(u, "idle");
        path.pop();
      };

      dfs(start, 0);

      const finalStates: NodeStates = new Map();
      for (const label of bestPath) {
        const id = graph.idOf(label);
        if (id !== undefined) finalStates.set(id, "result");
      }
      steps.push({
        description: `Shortest distance is ${best === Number.POSITIVE_INFINITY ? "unreachable" : best}, but only after enumerating ${explored} path prefixes. DFS has no notion of "closest first", so every branch has to be finished before the answer is trustworthy.`,
        ...snapshot(graph, finalStates, new Map()),
        variables: {
          "min edges": best === Number.POSITIVE_INFINITY ? "\u221e" : best,
          path: bestPath.join(" \u2192 ") || "-",
          "prefixes explored": explored,
        },
        headline:
          best === Number.POSITIVE_INFINITY ? "unreachable" : `dist = ${best}`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "BFS (level by level)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 the queue holds vertices in non-decreasing distance order, so the first time the goal is dequeued its distance is already minimal and the search can stop",
    code: [
      "const queue = [start]; dist[start] = 0;",
      "while (queue.length) {",
      "  const u = queue.shift();",
      "  if (u === goal) return dist[u];   // first arrival is shortest",
      "  for (const v of adj[u])",
      "    if (dist[v] === undefined) {",
      "      dist[v] = dist[u] + 1; queue.push(v);",
      "    }",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const goal = resolveVertex(graph, targets[1]);
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const dist = new Map<number, number>([[start, 0]]);
      const parent = new Map<number, number>();
      const queue: number[] = [start];
      const order: string[] = [];
      notes.set(start, "d=0");
      let visits = 0;

      while (queue.length > 0) {
        const u = queue.shift() as number;
        visits++;
        order.push(graph.labelOf(u));
        states.set(u, "active");

        if (u === goal) {
          const chain: string[] = [];
          let cursor: number | undefined = goal;
          while (cursor !== undefined) {
            chain.unshift(graph.labelOf(cursor));
            const prev: number | undefined = parent.get(cursor);
            if (prev !== undefined)
              markTraversed(graph, edgeStates, prev, cursor, "used");
            cursor = prev;
          }
          for (const label of chain) {
            const id = graph.idOf(label);
            if (id !== undefined) states.set(id, "result");
          }
          steps.push({
            description: `Dequeued ${graph.labelOf(goal)} at distance ${dist.get(goal)}. BFS empties distance ${(dist.get(goal) ?? 1) - 1} completely before it touches distance ${dist.get(goal)}, so no shorter route can exist \u2014 return now.`,
            ...snapshot(graph, states, edgeStates, notes),
            output: [...order],
            outputLabel: "bfs order",
            structure: {
              label: "queue",
              entries: queue.map((n) => graph.labelOf(n)),
            },
            variables: {
              distance: dist.get(goal) ?? 0,
              path: chain.join(" \u2192 "),
              "vertices dequeued": visits,
            },
            headline: `dist = ${dist.get(goal)}`,
            tag: { label: "Early Exit", tone: "success" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }

        const discovered: string[] = [];
        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (!dist.has(v)) {
            dist.set(v, (dist.get(u) ?? 0) + 1);
            parent.set(v, u);
            notes.set(v, `d=${dist.get(v)}`);
            queue.push(v);
            discovered.push(graph.labelOf(v));
            markTraversed(graph, edgeStates, u, v, "used");
          }
        }

        steps.push({
          description:
            discovered.length > 0
              ? `Dequeue ${graph.labelOf(u)} (distance ${dist.get(u)}) and discover ${discovered.join(", ")} at distance ${(dist.get(u) ?? 0) + 1}. Each vertex gets its distance exactly once, the first time it is reached.`
              : `Dequeue ${graph.labelOf(u)} (distance ${dist.get(u)}); every neighbour already has a distance, so nothing new is enqueued.`,
          ...snapshot(graph, states, edgeStates, notes),
          output: [...order],
          outputLabel: "bfs order",
          structure: {
            label: "queue",
            entries: queue.map((n) => graph.labelOf(n)),
          },
          variables: {
            u: graph.labelOf(u),
            "dist[u]": dist.get(u) ?? 0,
            "queue size": queue.length,
          },
          headline: `dequeue ${graph.labelOf(u)}`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 7,
        });
        states.set(u, "visited");
      }

      steps.push({
        description: `The queue drained without reaching ${graph.labelOf(goal)} \u2014 it is in a different component, so no path exists.`,
        ...snapshot(graph, states, edgeStates, notes),
        variables: { "vertices dequeued": visits, distance: "\u221e" },
        headline: "unreachable",
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 04 · Cycle detection                                                 */
/* ------------------------------------------------------------------ */

export const cycleDetectionApproaches: Approaches = {
  undirected: {
    label: "Undirected (visited + parent)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 in an undirected graph every edge can be walked back along, so the only extra rule is: an already-visited neighbour that is not the vertex you came from closes a cycle",
    code: [
      "function dfs(u, parent) {",
      "  visited.add(u);",
      "  for (const v of adj[u]) {",
      "    if (v === parent) continue;        // the edge we arrived on",
      "    if (visited.has(v)) return true;   // cycle",
      "    if (dfs(v, u)) return true;",
      "  }",
      "  return false;",
      "}",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to check.");
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const edgeStates: EdgeStates = new Map();
      const visited = new Set<number>();
      let found = false;

      const dfs = (u: number, parent: number | null): boolean => {
        visited.add(u);
        states.set(u, "active");
        steps.push({
          description: `Enter ${graph.labelOf(u)}${parent === null ? " as the root of this search" : ` from ${graph.labelOf(parent)}`} and mark it visited.`,
          ...snapshot(graph, states, edgeStates),
          variables: {
            u: graph.labelOf(u),
            parent: parent === null ? "-" : graph.labelOf(parent),
            visited: visited.size,
          },
          headline: `dfs(${graph.labelOf(u)})`,
          tag: { label: "Visit", tone: "info" },
          codeLine: 2,
        });

        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (v === parent) {
            steps.push({
              description: `${graph.labelOf(v)} is the vertex we arrived from. In an undirected graph that edge exists in both directions, so skipping it is what stops every single edge looking like a 2-cycle.`,
              ...snapshot(graph, states, edgeStates),
              variables: { u: graph.labelOf(u), v: graph.labelOf(v) },
              headline: `skip parent ${graph.labelOf(v)}`,
              tag: { label: "Parent Edge", tone: "info" },
              codeLine: 4,
            });
            continue;
          }
          if (visited.has(v)) {
            markTraversed(graph, edgeStates, u, v, "rejected");
            states.set(u, "rejected");
            states.set(v, "rejected");
            steps.push({
              description: `${graph.labelOf(v)} is already visited and is not the parent, so the edge ${graph.labelOf(u)} \u2013 ${graph.labelOf(v)} closes a cycle. The graph is cyclic.`,
              ...snapshot(graph, states, edgeStates),
              variables: {
                u: graph.labelOf(u),
                v: graph.labelOf(v),
                cycle: true,
              },
              headline: "cycle found",
              tag: { label: "Cycle", tone: "danger" },
              codeLine: 5,
              done: true,
            });
            found = true;
            return true;
          }
          markTraversed(graph, edgeStates, u, v, "used");
          if (dfs(v, u)) return true;
        }

        states.set(u, "visited");
        return false;
      };

      for (const node of graph.nodes) {
        if (found) break;
        if (!visited.has(node.id)) dfs(node.id, null);
      }

      if (!found) {
        steps.push({
          description: `Every vertex was explored and no non-parent back edge was ever found \u2014 the graph is acyclic. An undirected acyclic connected graph is exactly a tree.`,
          ...snapshot(graph, states, edgeStates),
          variables: { cycle: false, visited: visited.size },
          headline: "no cycle",
          tag: { label: "Acyclic", tone: "success" },
          codeLine: 8,
          done: true,
        });
      }
      return steps;
    },
  },
  directed: {
    label: "Directed (recursion stack)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 \u201calready visited\u201d is not enough here: a vertex reachable by two different paths is fine. Only an edge back into a vertex still on the current recursion stack is a cycle",
    code: [
      "function dfs(u) {",
      "  onStack.add(u); visited.add(u);",
      "  for (const v of adj[u]) {",
      "    if (onStack.has(v)) return true;      // back edge = cycle",
      "    if (!visited.has(v) && dfs(v)) return true;",
      "  }",
      "  onStack.delete(u);   // done: u is no longer on the path",
      "  return false;",
      "}",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to check.");
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const visited = new Set<number>();
      const onStack = new Set<number>();
      const stackLabels: string[] = [];
      let found = false;

      const dfs = (u: number): boolean => {
        visited.add(u);
        onStack.add(u);
        stackLabels.push(graph.labelOf(u));
        states.set(u, "active");
        notes.set(u, "on stack");
        steps.push({
          description: `Push ${graph.labelOf(u)} onto the recursion stack. Everything currently on the stack is part of the path we are standing on right now.`,
          ...snapshot(graph, states, edgeStates, notes),
          structure: { label: "recursion stack", entries: [...stackLabels] },
          variables: { u: graph.labelOf(u), "on stack": onStack.size },
          headline: `dfs(${graph.labelOf(u)})`,
          tag: { label: "Descend", tone: "info" },
          codeLine: 2,
        });

        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (onStack.has(v)) {
            markTraversed(graph, edgeStates, u, v, "rejected");
            for (const label of stackLabels) {
              const id = graph.idOf(label);
              if (id !== undefined) states.set(id, "rejected");
            }
            steps.push({
              description: `${graph.labelOf(v)} is still on the recursion stack, so ${graph.labelOf(u)} \u2192 ${graph.labelOf(v)} points back into the current path \u2014 that is a directed cycle.`,
              ...snapshot(graph, states, edgeStates, notes),
              structure: {
                label: "recursion stack",
                entries: [...stackLabels],
              },
              variables: {
                u: graph.labelOf(u),
                v: graph.labelOf(v),
                cycle: true,
              },
              headline: `cycle: ${stackLabels.slice(stackLabels.indexOf(graph.labelOf(v))).join(" \u2192 ")} \u2192 ${graph.labelOf(v)}`,
              tag: { label: "Back Edge", tone: "danger" },
              codeLine: 4,
              done: true,
            });
            found = true;
            return true;
          }
          if (!visited.has(v)) {
            markTraversed(graph, edgeStates, u, v, "used");
            if (dfs(v)) return true;
          } else {
            steps.push({
              description: `${graph.labelOf(v)} was visited on an earlier branch but is no longer on the stack, so this is a cross edge, not a cycle. This is the case a plain visited set would get wrong.`,
              ...snapshot(graph, states, edgeStates, notes),
              structure: {
                label: "recursion stack",
                entries: [...stackLabels],
              },
              variables: { u: graph.labelOf(u), v: graph.labelOf(v) },
              headline: `cross edge \u2192 ${graph.labelOf(v)}`,
              tag: { label: "Not A Cycle", tone: "info" },
              codeLine: 5,
            });
          }
        }

        onStack.delete(u);
        stackLabels.pop();
        states.set(u, "visited");
        notes.set(u, "finished");
        steps.push({
          description: `${graph.labelOf(u)} has no remaining edges, so it leaves the recursion stack. From here on, an edge into ${graph.labelOf(u)} is a cross edge and perfectly legal.`,
          ...snapshot(graph, states, edgeStates, notes),
          structure: { label: "recursion stack", entries: [...stackLabels] },
          variables: { u: graph.labelOf(u), "on stack": onStack.size },
          headline: `pop ${graph.labelOf(u)}`,
          tag: { label: "Backtrack", tone: "info" },
          codeLine: 7,
        });
        return false;
      };

      for (const node of graph.nodes) {
        if (found) break;
        if (!visited.has(node.id)) dfs(node.id);
      }

      if (!found) {
        steps.push({
          description: `No edge ever pointed back into the active path, so this directed graph is acyclic \u2014 a DAG, which is exactly the precondition topological sort needs.`,
          ...snapshot(graph, states, edgeStates, notes),
          variables: { cycle: false, visited: visited.size },
          headline: "DAG (no cycle)",
          tag: { label: "Acyclic", tone: "success" },
          codeLine: 8,
          done: true,
        });
      }
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 05 · Topological sort                                                */
/* ------------------------------------------------------------------ */

function indegrees(graph: ParsedGraph): Map<number, number> {
  const deg = new Map<number, number>();
  for (const node of graph.nodes) deg.set(node.id, 0);
  for (const edge of graph.edges) {
    deg.set(edge.to, (deg.get(edge.to) ?? 0) + 1);
    if (!edge.directed) deg.set(edge.from, (deg.get(edge.from) ?? 0) + 1);
  }
  return deg;
}

export const topoSortApproaches: Approaches = {
  brute: {
    label: "Brute Force (re-scan every round)",
    complexity:
      "Time: O(V\u00b2 + V\u00b7E) \u00b7 Space: O(V) \u2014 each round recomputes every indegree from scratch just to find one vertex with no prerequisites left",
    code: [
      "while (remaining.size) {",
      "  const deg = recomputeAllIndegrees();  // full rescan",
      "  const u = remaining.find(v => deg[v] === 0);",
      "  if (!u) throw new Error('cycle');",
      "  order.push(u); remaining.delete(u);",
      "}",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to order.");
      const steps: GraphStep[] = [];
      const remaining = new Set(graph.nodes.map((n) => n.id));
      const order: string[] = [];
      let scans = 0;

      while (remaining.size > 0) {
        const deg = new Map<number, number>();
        for (const id of remaining) deg.set(id, 0);
        for (const edge of graph.edges) {
          if (remaining.has(edge.from) && remaining.has(edge.to)) {
            deg.set(edge.to, (deg.get(edge.to) ?? 0) + 1);
          }
        }
        scans += graph.edges.length;

        const states: NodeStates = new Map();
        const notes: NodeNotes = new Map();
        for (const node of graph.nodes) {
          if (!remaining.has(node.id)) {
            states.set(node.id, "visited");
            continue;
          }
          notes.set(node.id, `in=${deg.get(node.id) ?? 0}`);
        }

        const pick = [...remaining].find((id) => (deg.get(id) ?? 0) === 0);
        if (pick === undefined) {
          for (const id of remaining) states.set(id, "rejected");
          steps.push({
            description: `Every remaining vertex still has a prerequisite, which can only happen if they form a cycle \u2014 no topological order exists.`,
            ...snapshot(graph, states, new Map(), notes),
            output: [...order],
            outputLabel: "order",
            variables: { remaining: remaining.size, "edge scans": scans },
            headline: "cycle \u2014 no valid order",
            tag: { label: "Impossible", tone: "danger" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }

        states.set(pick, "active");
        order.push(graph.labelOf(pick));
        remaining.delete(pick);
        steps.push({
          description: `Re-scanned all ${graph.edges.length} edges to rebuild every indegree, then took ${graph.labelOf(pick)} because it has none left. The scan is thrown away and repeated next round.`,
          ...snapshot(graph, states, new Map(), notes),
          output: [...order],
          outputLabel: "order",
          variables: {
            picked: graph.labelOf(pick),
            remaining: remaining.size,
            "edge scans": scans,
          },
          headline: `take ${graph.labelOf(pick)}`,
          tag: { label: "Full Re-scan", tone: "danger" },
          codeLine: 3,
        });
      }

      const finalStates: NodeStates = new Map(
        graph.nodes.map((n) => [n.id, "visited" as GraphNodeState]),
      );
      steps.push({
        description: `Valid order found, but it cost ${scans} edge inspections \u2014 the same indegrees were recomputed once per vertex.`,
        ...snapshot(graph, finalStates),
        output: [...order],
        outputLabel: "order",
        variables: { order: order.join(" \u2192 "), "edge scans": scans },
        headline: `[${order.join(", ")}]`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (Kahn's algorithm)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 indegrees are computed once and then only decremented along the edge that was just removed, so every edge is touched exactly once",
    code: [
      "const indeg = countIndegrees();        // one pass",
      "const queue = vertices.filter(v => indeg[v] === 0);",
      "while (queue.length) {",
      "  const u = queue.shift(); order.push(u);",
      "  for (const v of adj[u])",
      "    if (--indeg[v] === 0) queue.push(v);",
      "}",
      "if (order.length < V) throw new Error('cycle');",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to order.");
      const steps: GraphStep[] = [];
      const deg = indegrees(graph);
      const notes: NodeNotes = new Map();
      const states: NodeStates = new Map();
      const edgeStates: EdgeStates = new Map();
      const order: string[] = [];
      let touches = graph.edges.length;

      for (const node of graph.nodes)
        notes.set(node.id, `in=${deg.get(node.id) ?? 0}`);
      const queue = graph.nodes
        .filter((n) => (deg.get(n.id) ?? 0) === 0)
        .map((n) => n.id);
      for (const id of queue) states.set(id, "active");

      steps.push({
        description: `Count every indegree in a single pass over the ${graph.edges.length} edges. ${queue.length === 0 ? "Nothing starts at zero, which already signals a cycle." : `${queue.map((id) => graph.labelOf(id)).join(", ")} have no prerequisites, so they seed the queue.`}`,
        ...snapshot(graph, states, edgeStates, notes),
        output: [],
        outputLabel: "order",
        structure: {
          label: "queue",
          entries: queue.map((id) => graph.labelOf(id)),
        },
        variables: { "edge touches": touches, "queue size": queue.length },
        headline: "indegrees counted once",
        tag: { label: "Setup", tone: "info" },
        codeLine: 1,
      });

      while (queue.length > 0) {
        const u = queue.shift() as number;
        order.push(graph.labelOf(u));
        states.set(u, "visited");
        notes.set(u, `#${order.length}`);

        const freed: string[] = [];
        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          touches++;
          deg.set(v, (deg.get(v) ?? 0) - 1);
          notes.set(v, `in=${deg.get(v)}`);
          markTraversed(graph, edgeStates, u, v, "used");
          if ((deg.get(v) ?? 0) === 0) {
            queue.push(v);
            states.set(v, "active");
            freed.push(graph.labelOf(v));
          }
        }

        steps.push({
          description:
            freed.length > 0
              ? `Output ${graph.labelOf(u)} and remove its outgoing edges. That drops ${freed.join(", ")} to indegree 0, so they join the queue \u2014 no rescan needed, only the affected neighbours changed.`
              : `Output ${graph.labelOf(u)}. Its neighbours still have other prerequisites, so the queue is unchanged.`,
          ...snapshot(graph, states, edgeStates, notes),
          output: [...order],
          outputLabel: "order",
          structure: {
            label: "queue",
            entries: queue.map((id) => graph.labelOf(id)),
          },
          variables: {
            u: graph.labelOf(u),
            freed: freed.length,
            "edge touches": touches,
          },
          headline: `output ${graph.labelOf(u)}`,
          tag: { label: "Emit", tone: "success" },
          codeLine: 6,
        });
      }

      if (order.length < graph.nodes.length) {
        for (const node of graph.nodes) {
          if (!order.includes(node.label)) states.set(node.id, "rejected");
        }
        steps.push({
          description: `Only ${order.length} of ${graph.nodes.length} vertices came out. The rest never reached indegree 0, which is the definitive proof of a cycle \u2014 Kahn's algorithm detects it for free.`,
          ...snapshot(graph, states, edgeStates, notes),
          output: [...order],
          outputLabel: "order",
          variables: { emitted: order.length, total: graph.nodes.length },
          headline: "cycle \u2014 no valid order",
          tag: { label: "Impossible", tone: "danger" },
          codeLine: 8,
          done: true,
        });
        return steps;
      }

      steps.push({
        description: `All ${order.length} vertices emitted in ${touches} edge touches \u2014 one pass to count, one pass to decrement. Any vertex appears only after everything pointing at it.`,
        ...snapshot(graph, states, edgeStates, notes),
        output: [...order],
        outputLabel: "order",
        structure: { label: "queue", entries: [] },
        variables: { order: order.join(" \u2192 "), "edge touches": touches },
        headline: `[${order.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 06 · Connected components                                            */
/* ------------------------------------------------------------------ */

export const connectedComponentsApproaches: Approaches = {
  brute: {
    label: "Brute Force (pairwise reachability)",
    complexity:
      "Time: O(V\u00b2 \u00b7 (V + E)) \u00b7 Space: O(V) \u2014 ask \u201ccan u reach v?\u201d for every pair and run a fresh search for each question",
    code: [
      "for (const u of vertices)",
      "  for (const v of vertices)",
      "    if (reachable(u, v))      // a whole search per pair",
      "      union(u, v);",
      "return countDistinctGroups();",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to group.");
      const steps: GraphStep[] = [];
      const group = new Map<number, number>();
      let groupCount = 0;
      let searches = 0;

      const reachable = (from: number, to: number) => {
        searches++;
        const seen = new Set<number>([from]);
        const stack = [from];
        while (stack.length) {
          const cur = stack.pop() as number;
          if (cur === to) return true;
          for (const { to: nxt } of graph.adjacency.get(cur) ?? []) {
            if (!seen.has(nxt)) {
              seen.add(nxt);
              stack.push(nxt);
            }
          }
        }
        return false;
      };

      for (const u of graph.nodes) {
        if (group.has(u.id)) continue;
        const id = groupCount++;
        group.set(u.id, id);
        const members = [u.label];

        for (const v of graph.nodes) {
          if (v.id === u.id || group.has(v.id)) continue;
          if (reachable(u.id, v.id)) {
            group.set(v.id, id);
            members.push(v.label);
          }
        }

        const states: NodeStates = new Map();
        const notes: NodeNotes = new Map();
        for (const node of graph.nodes) {
          const g = group.get(node.id);
          if (g === undefined) continue;
          states.set(node.id, g === id ? "active" : "visited");
          notes.set(node.id, `g${g + 1}`);
        }
        steps.push({
          description: `Asked \u201ccan ${u.label} reach x?\u201d for every other vertex, running a separate search each time. Group ${id + 1} is ${members.join(", ")} \u2014 after ${searches} full searches.`,
          ...snapshot(graph, states, new Map(), notes),
          variables: {
            group: id + 1,
            members: members.join(", "),
            "searches run": searches,
          },
          headline: `group ${id + 1}: ${members.join(", ")}`,
          tag: { label: "Repeated Search", tone: "danger" },
          codeLine: 3,
        });
      }

      const finalStates: NodeStates = new Map();
      const finalNotes: NodeNotes = new Map();
      for (const node of graph.nodes) {
        finalStates.set(node.id, "visited");
        finalNotes.set(node.id, `g${(group.get(node.id) ?? 0) + 1}`);
      }
      steps.push({
        description: `${groupCount} component(s) found, but it took ${searches} independent searches \u2014 the same vertices were re-explored over and over.`,
        ...snapshot(graph, finalStates, new Map(), finalNotes),
        variables: { components: groupCount, "searches run": searches },
        headline: `${groupCount} component(s)`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (one sweep of DFS)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 walk the vertex list once; every time you meet an unvisited vertex that is a brand-new component, and a single flood fill claims all of it",
    code: [
      "let count = 0;",
      "for (const u of vertices) {",
      "  if (visited.has(u)) continue;",
      "  count++;                    // new component",
      "  flood(u);                   // claims the whole component",
      "}",
      "return count;",
    ],
    run: (graph): GraphStep[] => {
      if (graph.nodes.length === 0) return emptyGraphStep("Nothing to group.");
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const visited = new Set<number>();
      let count = 0;
      let touches = 0;

      for (const seed of graph.nodes) {
        if (visited.has(seed.id)) continue;
        count++;
        const members: string[] = [];
        const stack = [seed.id];
        visited.add(seed.id);

        steps.push({
          description: `${seed.label} has not been visited by any earlier flood, so by definition it belongs to a component nobody has claimed yet \u2014 component ${count} starts here.`,
          ...snapshot(graph, states, edgeStates, notes),
          variables: { seed: seed.label, components: count },
          headline: `new component ${count}`,
          tag: { label: "New Seed", tone: "info" },
          codeLine: 4,
        });

        while (stack.length > 0) {
          const u = stack.pop() as number;
          touches++;
          members.push(graph.labelOf(u));
          states.set(u, "visited");
          notes.set(u, `c${count}`);
          for (const { to: v } of graph.adjacency.get(u) ?? []) {
            touches++;
            if (!visited.has(v)) {
              visited.add(v);
              stack.push(v);
              markTraversed(graph, edgeStates, u, v, "used");
            }
          }
        }

        steps.push({
          description: `The flood from ${seed.label} claimed ${members.join(", ")}. Every one of those vertices is now permanently marked, so the outer loop will skip all of them \u2014 which is why one pass is enough.`,
          ...snapshot(graph, states, edgeStates, notes),
          variables: {
            component: count,
            members: members.join(", "),
            "edge touches": touches,
          },
          headline: `component ${count}: ${members.join(", ")}`,
          tag: { label: "Flood Fill", tone: "success" },
          codeLine: 5,
        });
      }

      steps.push({
        description: `${count} component(s) in ${touches} touches \u2014 each vertex entered the stack once and each edge was looked at once, no matter how many components there were.`,
        ...snapshot(graph, states, edgeStates, notes),
        variables: { components: count, "edge touches": touches },
        headline: `${count} component(s)`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 07 · Dijkstra                                                        */
/* ------------------------------------------------------------------ */

export const dijkstraApproaches: Approaches = {
  brute: {
    label: "BFS (ignores the weights)",
    complexity:
      "Time: O(V + E) \u00b7 Space: O(V) \u2014 fast, but it optimises hop count, not cost. On a weighted graph it happily returns a 1-edge path of weight 100 over a 2-edge path of weight 3",
    code: [
      "const queue = [start]; dist[start] = 0;",
      "while (queue.length) {",
      "  const u = queue.shift();",
      "  for (const v of adj[u])",
      "    if (dist[v] === undefined) {",
      "      dist[v] = dist[u] + 1;   // hops, not weight!",
      "      queue.push(v);",
      "    }",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const goal = resolveVertex(graph, targets[1]);
      const steps: GraphStep[] = [];
      const states: NodeStates = new Map();
      const notes: NodeNotes = new Map();
      const edgeStates: EdgeStates = new Map();
      const hops = new Map<number, number>([[start, 0]]);
      const parent = new Map<number, number>();
      const queue = [start];
      notes.set(start, "0 hops");

      while (queue.length > 0) {
        const u = queue.shift() as number;
        states.set(u, "active");
        const found: string[] = [];
        for (const { to: v } of graph.adjacency.get(u) ?? []) {
          if (!hops.has(v)) {
            hops.set(v, (hops.get(u) ?? 0) + 1);
            parent.set(v, u);
            notes.set(v, `${hops.get(v)} hops`);
            queue.push(v);
            found.push(graph.labelOf(v));
            markTraversed(graph, edgeStates, u, v, "used");
          }
        }
        steps.push({
          description:
            found.length > 0
              ? `Dequeue ${graph.labelOf(u)} and reach ${found.join(", ")} in ${(hops.get(u) ?? 0) + 1} hop(s). The edge weights are sitting right there and BFS never looks at them.`
              : `Dequeue ${graph.labelOf(u)}; every neighbour already has a hop count, so nothing changes.`,
          ...snapshot(graph, states, edgeStates, notes),
          structure: {
            label: "queue",
            entries: queue.map((id) => graph.labelOf(id)),
          },
          variables: {
            u: graph.labelOf(u),
            "hops[u]": hops.get(u) ?? 0,
            "queue size": queue.length,
          },
          headline: `dequeue ${graph.labelOf(u)}`,
          tag: { label: "Hop Count", tone: "info" },
          codeLine: 6,
        });
        states.set(u, "visited");
      }

      const chain: string[] = [];
      let cursor: number | undefined = goal;
      let cost = 0;
      while (cursor !== undefined) {
        chain.unshift(graph.labelOf(cursor));
        const prev: number | undefined = parent.get(cursor);
        if (prev !== undefined) {
          const w =
            graph.adjacency.get(prev)?.find((e) => e.to === cursor)?.weight ??
            1;
          cost += w;
          markTraversed(graph, edgeStates, prev, cursor, "rejected");
        }
        cursor = prev;
      }
      for (const label of chain) {
        const id = graph.idOf(label);
        if (id !== undefined) states.set(id, "rejected");
      }

      steps.push({
        description: `BFS returns ${chain.join(" \u2192 ")}: only ${hops.get(goal) ?? 0} hop(s), but the weights along it add up to ${cost}. Fewest edges is simply not the same question as lowest cost.`,
        ...snapshot(graph, states, edgeStates, notes),
        variables: {
          path: chain.join(" \u2192 "),
          hops: hops.get(goal) ?? 0,
          "actual cost": cost,
        },
        headline: `cost ${cost} (${hops.get(goal) ?? 0} hops)`,
        tag: { label: "Wrong Metric", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Dijkstra (cheapest frontier first)",
    complexity:
      "Time: O(E log V) with a binary heap \u00b7 Space: O(V) \u2014 always settle the cheapest unsettled vertex. With non-negative weights nothing can later make it cheaper, so once settled it is final",
    code: [
      "dist[start] = 0;",
      "while (unsettled.size) {",
      "  const u = cheapestUnsettled();   // heap pop",
      "  settled.add(u);",
      "  for (const [v, w] of adj[u])",
      "    if (dist[u] + w < dist[v])",
      "      dist[v] = dist[u] + w;       // relax",
      "}",
    ],
    run: (graph, targets): GraphStep[] => {
      if (graph.nodes.length === 0)
        return emptyGraphStep("Nothing to explore.");
      const start = resolveVertex(graph, targets[0]);
      const goal = resolveVertex(graph, targets[1]);
      const steps: GraphStep[] = [];
      const dist = new Map<number, number>();
      const parent = new Map<number, number>();
      const settled = new Set<number>();
      for (const node of graph.nodes)
        dist.set(node.id, Number.POSITIVE_INFINITY);
      dist.set(start, 0);

      const noteFor = (id: number) => {
        const d = dist.get(id) ?? Number.POSITIVE_INFINITY;
        return d === Number.POSITIVE_INFINITY ? "\u221e" : String(d);
      };
      const buildNotes = () => {
        const notes: NodeNotes = new Map();
        for (const node of graph.nodes) notes.set(node.id, noteFor(node.id));
        return notes;
      };

      while (settled.size < graph.nodes.length) {
        let best: number | null = null;
        for (const node of graph.nodes) {
          if (settled.has(node.id)) continue;
          if (
            best === null ||
            (dist.get(node.id) ?? Number.POSITIVE_INFINITY) <
              (dist.get(best) ?? Number.POSITIVE_INFINITY)
          ) {
            best = node.id;
          }
        }
        if (best === null) break;
        if (
          (dist.get(best) ?? Number.POSITIVE_INFINITY) ===
          Number.POSITIVE_INFINITY
        )
          break;

        const u = best;
        settled.add(u);

        const states: NodeStates = new Map();
        const edgeStates: EdgeStates = new Map();
        for (const id of settled) states.set(id, "visited");
        states.set(u, "active");
        for (const [child, p] of parent) {
          markTraversed(graph, edgeStates, p, child, "used");
        }

        steps.push({
          description: `${graph.labelOf(u)} is the cheapest unsettled vertex at cost ${dist.get(u)}. Every other route to it would have to pass through something that already costs at least that much, so with non-negative weights this distance is final.`,
          ...snapshot(graph, states, edgeStates, buildNotes()),
          structure: {
            label: "unsettled",
            entries: graph.nodes
              .filter((n) => !settled.has(n.id))
              .map((n) => `${n.label}=${noteFor(n.id)}`),
          },
          variables: {
            settling: graph.labelOf(u),
            "dist[u]": dist.get(u) ?? 0,
            settled: settled.size,
          },
          headline: `settle ${graph.labelOf(u)} @ ${dist.get(u)}`,
          tag: { label: "Settle", tone: "info" },
          codeLine: 3,
        });

        const relaxed: string[] = [];
        for (const { to: v, weight } of graph.adjacency.get(u) ?? []) {
          if (settled.has(v)) continue;
          const candidate = (dist.get(u) ?? 0) + weight;
          if (candidate < (dist.get(v) ?? Number.POSITIVE_INFINITY)) {
            const old = dist.get(v) ?? Number.POSITIVE_INFINITY;
            dist.set(v, candidate);
            parent.set(v, u);
            relaxed.push(
              `${graph.labelOf(v)}: ${old === Number.POSITIVE_INFINITY ? "\u221e" : old} \u2192 ${candidate}`,
            );
          }
        }

        if (relaxed.length > 0) {
          const states2: NodeStates = new Map();
          const edgeStates2: EdgeStates = new Map();
          for (const id of settled) states2.set(id, "visited");
          states2.set(u, "active");
          for (const [child, p] of parent) {
            markTraversed(graph, edgeStates2, p, child, "used");
          }
          steps.push({
            description: `Going through ${graph.labelOf(u)} is cheaper for ${relaxed.join(", ")}. Relaxing only rewrites a tentative distance \u2014 settled vertices are never revisited.`,
            ...snapshot(graph, states2, edgeStates2, buildNotes()),
            structure: {
              label: "unsettled",
              entries: graph.nodes
                .filter((n) => !settled.has(n.id))
                .map((n) => `${n.label}=${noteFor(n.id)}`),
            },
            variables: { from: graph.labelOf(u), relaxed: relaxed.length },
            headline: `relax via ${graph.labelOf(u)}`,
            tag: { label: "Relax", tone: "success" },
            codeLine: 7,
          });
        }
      }

      const chain: string[] = [];
      let cursor: number | undefined = goal;
      const finalStates: NodeStates = new Map();
      const finalEdges: EdgeStates = new Map();
      while (cursor !== undefined) {
        chain.unshift(graph.labelOf(cursor));
        finalStates.set(cursor, "result");
        const prev: number | undefined = parent.get(cursor);
        if (prev !== undefined)
          markTraversed(graph, finalEdges, prev, cursor, "used");
        cursor = prev;
      }

      steps.push({
        description: `Cheapest route to ${graph.labelOf(goal)} is ${chain.join(" \u2192 ")} at cost ${dist.get(goal)} \u2014 more edges than the BFS answer, and less total weight. Note this argument collapses the moment a weight is negative.`,
        ...snapshot(graph, finalStates, finalEdges, buildNotes()),
        variables: {
          path: chain.join(" \u2192 "),
          cost: dist.get(goal) ?? "\u221e",
          edges: Math.max(0, chain.length - 1),
        },
        headline: `cost = ${dist.get(goal)}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};
