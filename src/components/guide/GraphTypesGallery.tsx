interface MiniNode {
  id: string;
  x: number;
  y: number;
  label: string;
  tone?: "default" | "accent" | "muted" | "alt";
}

interface MiniEdge {
  from: string;
  to: string;
  directed?: boolean;
  weight?: number;
  dim?: boolean;
}

interface MiniGraph {
  nodes: MiniNode[];
  edges: MiniEdge[];
}

interface GraphTypeCard {
  name: string;
  rule: string;
  detail: string;
  usedFor: string;
  graph: MiniGraph;
}

const WIDTH = 220;
const HEIGHT = 140;
const R = 13;

const TONE_STYLE: Record<
  NonNullable<MiniNode["tone"]>,
  { bg: string; border: string; text: string }
> = {
  default: { bg: "#161b22", border: "#30363d", text: "#c9d1d9" },
  accent: { bg: "#17324f", border: "#58a6ff", text: "#cce3ff" },
  muted: { bg: "#10151c", border: "#21262d", text: "#6e7681" },
  alt: { bg: "#2b1f3d", border: "#bc8cff", text: "#e3d4ff" },
};

/** Places vertices on a grid of `cols` columns so layouts stay readable. */
function grid(
  cells: {
    id: string;
    label: string;
    col: number;
    row: number;
    tone?: MiniNode["tone"];
  }[],
  cols: number,
  rows: number,
): MiniNode[] {
  return cells.map((cell) => ({
    id: cell.id,
    label: cell.label,
    tone: cell.tone,
    x: ((cell.col + 0.5) / cols) * WIDTH,
    y: ((cell.row + 0.5) / rows) * HEIGHT,
  }));
}

/** Places vertices evenly on a circle, first vertex at the top. */
function ring(
  labels: string[],
  tone?: (label: string, index: number) => MiniNode["tone"],
): MiniNode[] {
  return labels.map((label, index) => {
    const angle = (index / labels.length) * Math.PI * 2 - Math.PI / 2;
    return {
      id: label,
      label,
      tone: tone?.(label, index),
      x: WIDTH / 2 + Math.cos(angle) * (WIDTH * 0.3),
      y: HEIGHT / 2 + Math.sin(angle) * (HEIGHT * 0.33),
    };
  });
}

const e = (
  from: string,
  to: string,
  extra: Partial<MiniEdge> = {},
): MiniEdge => ({
  from,
  to,
  ...extra,
});

const GRAPH_TYPES: GraphTypeCard[] = [
  {
    name: "Undirected Graph",
    rule: "Every edge works in both directions",
    detail:
      "An edge A \u2013 B means A can reach B and B can reach A. That symmetry is why cycle detection here needs the \u201cignore the parent\u201d rule \u2014 otherwise every single edge would look like a 2-cycle.",
    usedFor: "Friendship networks, road maps without one-way streets, mazes",
    graph: {
      nodes: ring(["A", "B", "C", "D"]),
      edges: [e("A", "B"), e("B", "C"), e("C", "D"), e("D", "A")],
    },
  },
  {
    name: "Directed Graph (Digraph)",
    rule: "Each edge points one way only",
    detail:
      "A \u2192 B says nothing about B \u2192 A. Reachability stops being symmetric, so \u201cvisited\u201d alone no longer proves a cycle \u2014 you need to know whether the vertex is on the current path.",
    usedFor: "Task dependencies, web links, state machines, build graphs",
    graph: {
      nodes: ring(["A", "B", "C", "D"]),
      edges: [
        e("A", "B", { directed: true }),
        e("B", "C", { directed: true }),
        e("C", "D", { directed: true }),
        e("A", "D", { directed: true }),
      ],
    },
  },
  {
    name: "Weighted Graph",
    rule: "Edges carry a cost, not just a connection",
    detail:
      "The number of edges stops being a useful measure of distance. BFS still finds the fewest hops, but the fewest hops can easily be the most expensive route \u2014 that gap is exactly what Dijkstra closes.",
    usedFor: "Shortest route by time or price, network latency, flight costs",
    graph: {
      nodes: ring(["A", "B", "C", "D"]),
      edges: [
        e("A", "B", { weight: 4 }),
        e("B", "C", { weight: 2 }),
        e("C", "D", { weight: 7 }),
        e("A", "D", { weight: 1 }),
      ],
    },
  },
  {
    name: "Cyclic Graph",
    rule: "At least one path returns to its start",
    detail:
      "Following edges can bring you back where you began. Any traversal must carry a visited set or it will loop forever \u2014 this is the single biggest difference from tree recursion.",
    usedFor: "Deadlock detection, circular imports, currency arbitrage",
    graph: {
      nodes: ring(["A", "B", "C"], (_l, i) => (i < 3 ? "accent" : "default")),
      edges: [
        e("A", "B", { directed: true }),
        e("B", "C", { directed: true }),
        e("C", "A", { directed: true }),
      ],
    },
  },
  {
    name: "DAG (Directed Acyclic)",
    rule: "Directed, and no cycle anywhere",
    detail:
      "Being acyclic is what makes a linear ordering possible: there is always at least one vertex with nothing pointing at it. Topological sort only exists for this shape.",
    usedFor: "Build systems, course prerequisites, spreadsheet recalculation",
    graph: {
      nodes: grid(
        [
          { id: "A", label: "A", col: 0, row: 0, tone: "accent" },
          { id: "B", label: "B", col: 0, row: 2, tone: "accent" },
          { id: "C", label: "C", col: 1, row: 1 },
          { id: "D", label: "D", col: 2, row: 0 },
          { id: "E", label: "E", col: 2, row: 2 },
        ],
        3,
        3,
      ),
      edges: [
        e("A", "C", { directed: true }),
        e("B", "C", { directed: true }),
        e("C", "D", { directed: true }),
        e("C", "E", { directed: true }),
      ],
    },
  },
  {
    name: "Disconnected Graph",
    rule: "Some vertices cannot reach others at all",
    detail:
      "One traversal only covers the component you started in. To touch every vertex you must loop over the vertex list and start a fresh search from each unvisited one \u2014 the count of those restarts is the number of components.",
    usedFor: "Islands in a grid, friend clusters, network partition checks",
    graph: {
      nodes: grid(
        [
          { id: "A", label: "A", col: 0, row: 0, tone: "accent" },
          { id: "B", label: "B", col: 1, row: 1, tone: "accent" },
          { id: "C", label: "C", col: 0, row: 2, tone: "accent" },
          { id: "D", label: "D", col: 3, row: 0, tone: "alt" },
          { id: "E", label: "E", col: 3, row: 2, tone: "alt" },
        ],
        4,
        3,
      ),
      edges: [e("A", "B"), e("B", "C"), e("D", "E")],
    },
  },
  {
    name: "Tree (as a graph)",
    rule: "Connected, undirected, exactly V \u2212 1 edges",
    detail:
      "A tree is just the thinnest possible connected graph. Add one more edge anywhere and you create a cycle; remove one and it falls apart. Every tree algorithm is a graph algorithm that is allowed to skip the visited set.",
    usedFor: "Hierarchies, spanning trees, parse trees, file systems",
    graph: {
      nodes: grid(
        [
          { id: "A", label: "A", col: 1, row: 0, tone: "accent" },
          { id: "B", label: "B", col: 0, row: 1 },
          { id: "C", label: "C", col: 2, row: 1 },
          { id: "D", label: "D", col: 0, row: 2 },
          { id: "E", label: "E", col: 2, row: 2 },
        ],
        3,
        3,
      ),
      edges: [e("A", "B"), e("A", "C"), e("B", "D"), e("C", "E")],
    },
  },
  {
    name: "Complete Graph",
    rule: "Every vertex joins every other vertex",
    detail:
      "With V vertices there are V(V\u22121)/2 edges, so E grows quadratically. This is the dense end of the scale \u2014 the case where an adjacency matrix finally beats an adjacency list.",
    usedFor:
      "Travelling-salesman instances, all-pairs comparisons, tournaments",
    graph: {
      nodes: ring(["A", "B", "C", "D", "E"]),
      edges: [
        e("A", "B"),
        e("A", "C"),
        e("A", "D"),
        e("A", "E"),
        e("B", "C"),
        e("B", "D"),
        e("B", "E"),
        e("C", "D"),
        e("C", "E"),
        e("D", "E"),
      ],
    },
  },
  {
    name: "Bipartite Graph",
    rule: "Vertices split into two sides; edges only cross",
    detail:
      "Equivalent to being 2-colourable, and equivalent to having no odd-length cycle. You can test it with a single BFS that colours each level the opposite of the previous one.",
    usedFor:
      "Job\u2013applicant matching, students\u2013courses, recommendation graphs",
    graph: {
      nodes: grid(
        [
          { id: "A", label: "A", col: 0, row: 0, tone: "accent" },
          { id: "B", label: "B", col: 0, row: 1, tone: "accent" },
          { id: "C", label: "C", col: 0, row: 2, tone: "accent" },
          { id: "X", label: "X", col: 2, row: 0, tone: "alt" },
          { id: "Y", label: "Y", col: 2, row: 2, tone: "alt" },
        ],
        3,
        3,
      ),
      edges: [e("A", "X"), e("B", "X"), e("B", "Y"), e("C", "Y")],
    },
  },
  {
    name: "Multigraph / Self-loop",
    rule: "Repeated edges and edges to self are allowed",
    detail:
      "A simple graph forbids both. When they are allowed, anything that assumes \u201cat most one edge per pair\u201d breaks \u2014 including the naive parent check for undirected cycles, since a self-loop is a cycle of length one.",
    usedFor: "Transport networks with parallel routes, flow networks, automata",
    graph: {
      nodes: grid(
        [
          { id: "A", label: "A", col: 0, row: 1, tone: "accent" },
          { id: "B", label: "B", col: 1, row: 1 },
          { id: "C", label: "C", col: 2, row: 1, tone: "alt" },
        ],
        3,
        2,
      ),
      edges: [e("A", "B"), e("B", "C"), e("C", "C", { directed: true })],
    },
  },
];

function MiniGraphSvg({
  graph,
  name,
}: Readonly<{ graph: MiniGraph; name: string }>) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const markerId = `mini-arrow-${name.replace(/[^a-z]/gi, "")}`;
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      style={{ display: "block", maxHeight: 150 }}
      role="img"
      aria-label={`${name} diagram`}
    >
      <title>{name}</title>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b949e" />
        </marker>
      </defs>
      {graph.edges.map((edge) => {
        const a = byId.get(edge.from);
        const b = byId.get(edge.to);
        if (!a || !b) return null;
        const key = `${edge.from}-${edge.to}`;

        if (edge.from === edge.to) {
          return (
            <path
              key={key}
              d={`M ${a.x - 5} ${a.y - R + 1} A 11 11 0 1 1 ${a.x + 5} ${a.y - R + 1}`}
              fill="none"
              stroke="#8b949e"
              strokeWidth={1.4}
              markerEnd={`url(#${markerId})`}
            />
          );
        }

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const pad = R + 1;
        const endPad = edge.directed ? R + 5 : pad;
        const x1 = a.x + (dx / len) * pad;
        const y1 = a.y + (dy / len) * pad;
        const x2 = b.x - (dx / len) * endPad;
        const y2 = b.y - (dy / len) * endPad;
        return (
          <g key={key}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={edge.dim ? "#21262d" : "#8b949e"}
              strokeWidth={1.4}
              markerEnd={edge.directed ? `url(#${markerId})` : undefined}
            />
            {edge.weight !== undefined && (
              <>
                <circle
                  cx={(a.x + b.x) / 2}
                  cy={(a.y + b.y) / 2}
                  r={8}
                  fill="#0d1117"
                  stroke="#30363d"
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 + 3.5}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="#d29922"
                >
                  {edge.weight}
                </text>
              </>
            )}
          </g>
        );
      })}
      {graph.nodes.map((node) => {
        const tone = TONE_STYLE[node.tone ?? "default"];
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={R}
              fill={tone.bg}
              stroke={tone.border}
              strokeWidth={1.6}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={tone.text}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function GraphTypesGallery() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {GRAPH_TYPES.map((type) => (
        <article
          key={type.name}
          style={{
            border: "1px solid #30363d",
            borderRadius: 12,
            background: "#0d1117",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <header>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "#e6edf3",
              }}
            >
              {type.name}
            </h3>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 12.5,
                color: "#58a6ff",
                fontWeight: 600,
              }}
            >
              {type.rule}
            </p>
          </header>

          <div
            style={{
              border: "1px solid #21262d",
              borderRadius: 10,
              background: "#161b22",
              padding: "6px 4px",
            }}
          >
            <MiniGraphSvg graph={type.graph} name={type.name} />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 12.5,
              lineHeight: 1.55,
              color: "#8b949e",
            }}
          >
            {type.detail}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#6e7681" }}>
            <span style={{ color: "#3fb950", fontWeight: 600 }}>
              Used for:{" "}
            </span>
            {type.usedFor}
          </p>
        </article>
      ))}
    </div>
  );
}
