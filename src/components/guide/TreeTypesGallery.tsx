interface MiniNode {
  id: string;
  x: number;
  y: number;
  label: string;
  tone?: "default" | "accent" | "muted";
}

interface MiniTree {
  nodes: MiniNode[];
  edges: [string, string][];
}

interface TreeTypeCard {
  name: string;
  rule: string;
  detail: string;
  usedFor: string;
  tree: MiniTree;
}

const WIDTH = 220;
const HEIGHT = 136;
const ROW = 38;

/** Lays out a level-order list on the mini canvas using heap indices. */
function heapTree(values: (string | null)[], accent: number[] = []): MiniTree {
  const nodes: MiniNode[] = [];
  const edges: [string, string][] = [];
  values.forEach((value, index) => {
    if (value === null) return;
    const depth = Math.floor(Math.log2(index + 1));
    const slots = 2 ** depth;
    const position = index - (slots - 1);
    nodes.push({
      id: String(index),
      x: ((position + 0.5) / slots) * WIDTH,
      y: depth * ROW + 22,
      label: value,
      tone: accent.includes(index) ? "accent" : "default",
    });
    if (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (values[parent] !== null && values[parent] !== undefined) {
        edges.push([String(parent), String(index)]);
      }
    }
  });
  return { nodes, edges };
}

/** Lays out an explicit set of rows for shapes a heap index cannot express. */
function customTree(
  rows: { id: string; label: string; col: number; cols: number }[][],
  edges: [string, string][],
  accent: string[] = [],
): MiniTree {
  const nodes: MiniNode[] = [];
  rows.forEach((row, depth) => {
    for (const cell of row) {
      nodes.push({
        id: cell.id,
        x: ((cell.col + 0.5) / cell.cols) * WIDTH,
        y: depth * ROW + 22,
        label: cell.label,
        tone: accent.includes(cell.id) ? "accent" : "default",
      });
    }
  });
  return { nodes, edges };
}

const TREE_TYPES: TreeTypeCard[] = [
  {
    name: "Binary Tree",
    rule: "Every node has at most 2 children",
    detail:
      "The loosest shape: no ordering and no balance is promised, so any question about a value means looking at every node.",
    usedFor:
      "Expression trees, decision trees, the base case for everything below",
    tree: heapTree(["A", "B", "C", "D", null, null, "G"]),
  },
  {
    name: "Full / Proper Binary Tree",
    rule: "Every node has exactly 0 or 2 children",
    detail:
      "No node is allowed a single child. A full tree with i internal nodes always has exactly i + 1 leaves.",
    usedFor: "Huffman coding trees, binary expression trees",
    tree: heapTree(["A", "B", "C", "D", "E", "F", "G"], [3, 4, 5, 6]),
  },
  {
    name: "Complete Binary Tree",
    rule: "Every level full except the last, which fills left to right",
    detail:
      "The gap-free shape is what lets you store the tree in a flat array: the children of index i live at 2i+1 and 2i+2.",
    usedFor: "Array-backed heaps, segment trees",
    tree: heapTree(["A", "B", "C", "D", "E", "F", null], [3, 4, 5]),
  },
  {
    name: "Perfect Binary Tree",
    rule: "All internal nodes have 2 children and all leaves are on one level",
    detail:
      "A perfect tree of height h holds exactly 2^(h+1) \u2212 1 nodes, so half of them are leaves \u2014 the best case for height.",
    usedFor: "Complexity proofs, fixed-size tournament brackets",
    tree: heapTree(["A", "B", "C", "D", "E", "F", "G"], [0]),
  },
  {
    name: "Binary Search Tree (BST)",
    rule: "left subtree < node < right subtree, recursively",
    detail:
      "Ordering turns search into a decision at each node instead of a scan, and an inorder walk comes out sorted for free.",
    usedFor:
      "Ordered maps and sets, range queries, the LCA trick in this course",
    tree: heapTree(["8", "3", "10", "1", "6", null, "14"], [0, 1, 2]),
  },
  {
    name: "Balanced Tree (AVL / Red-Black)",
    rule: "Subtree heights differ by a bounded amount at every node",
    detail:
      "Rotations on insert and delete keep the height at O(log n), which is what makes the BST guarantee hold in the worst case too.",
    usedFor: "std::map, TreeMap, database indexes",
    tree: heapTree(["9", "5", "13", "2", "7", "11", "15"], [1, 2]),
  },
  {
    name: "Degenerate / Skewed Tree",
    rule: "Every node has only one child",
    detail:
      "The worst case for a BST: it collapses into a linked list, so search becomes O(n) and deep recursion can blow the call stack.",
    usedFor: "The failure mode balancing exists to prevent",
    tree: customTree(
      [
        [{ id: "a", label: "1", col: 0, cols: 5 }],
        [{ id: "b", label: "2", col: 1, cols: 5 }],
        [{ id: "c", label: "3", col: 2, cols: 5 }],
        [{ id: "d", label: "4", col: 3, cols: 5 }],
      ],
      [
        ["a", "b"],
        ["b", "c"],
        ["c", "d"],
      ],
      ["a", "b", "c", "d"],
    ),
  },
  {
    name: "Heap (Min-Heap)",
    rule: "Complete tree where every parent \u2264 both of its children",
    detail:
      "Only the root is ordered against everything else, so the minimum is O(1) but there is no useful left/right ordering to search by.",
    usedFor: "Priority queues, heap sort, Dijkstra and A*",
    tree: heapTree(["1", "3", "2", "7", "4", "9", null], [0]),
  },
  {
    name: "N-ary / General Tree",
    rule: "A node may have any number of children",
    detail:
      "Children are held in a list instead of left/right fields, so DFS and BFS still work \u2014 you just loop over the children array.",
    usedFor: "File systems, the DOM, org charts, tries",
    tree: customTree(
      [
        [{ id: "r", label: "/", col: 1, cols: 3 }],
        [
          { id: "x", label: "a", col: 0, cols: 4 },
          { id: "y", label: "b", col: 1.5, cols: 4 },
          { id: "z", label: "c", col: 3, cols: 4 },
        ],
        [
          { id: "p", label: "d", col: 0.5, cols: 5 },
          { id: "q", label: "e", col: 1.6, cols: 5 },
          { id: "s", label: "f", col: 2.7, cols: 5 },
          { id: "t", label: "g", col: 3.8, cols: 5 },
        ],
      ],
      [
        ["r", "x"],
        ["r", "y"],
        ["r", "z"],
        ["y", "p"],
        ["y", "q"],
        ["y", "s"],
        ["z", "t"],
      ],
      ["y"],
    ),
  },
];

const TONE_STYLE = {
  default: { border: "#30363d", bg: "#161b22", text: "#c9d1d9" },
  accent: { border: "#58a6ff", bg: "#0d1f38", text: "#93c5fd" },
  muted: { border: "#21262d", bg: "#0d1117", text: "#6e7681" },
} as const;

function MiniTreeSvg({
  tree,
  name,
}: Readonly<{ tree: MiniTree; name: string }>) {
  const byId = new Map(tree.nodes.map((n) => [n.id, n]));
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
      style={{ display: "block", maxHeight: 150 }}
      role="img"
      aria-label={`${name} diagram`}
    >
      <title>{name}</title>
      {tree.edges.map(([from, to]) => {
        const a = byId.get(from);
        const b = byId.get(to);
        if (!a || !b) return null;
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#30363d"
            strokeWidth={1.4}
          />
        );
      })}
      {tree.nodes.map((node) => {
        const tone = TONE_STYLE[node.tone ?? "default"];
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={13}
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

export default function TreeTypesGallery() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
      }}
    >
      {TREE_TYPES.map((type) => (
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
            <MiniTreeSvg tree={type.tree} name={type.name} />
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
