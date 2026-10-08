import type {
  TreeApproachRunner,
  TreeInput,
  TreeStep,
  TreeVizNode,
} from "./TreeVisualizer";
import { ROW_HEIGHT, VIEW_WIDTH } from "./TreeVisualizer";

type Approaches = Partial<Record<"brute" | "optimal", TreeApproachRunner>>;

export interface TreeModelNode {
  /** heap index: root = 0, children of i are 2i+1 and 2i+2 */
  id: number;
  parentId: number | null;
  value: number;
  depth: number;
  x: number;
  y: number;
  left: TreeModelNode | null;
  right: TreeModelNode | null;
}

type StateMap = Map<number, TreeVizNode["state"]>;
type NoteMap = Map<number, string>;

/**
 * Builds a binary tree from a LeetCode-style level-order list where `null`
 * marks a missing child. Positions come from the heap index so every level is
 * evenly spread across the 0-1000 virtual canvas.
 */
export function buildTree(values: TreeInput): {
  root: TreeModelNode | null;
  nodes: TreeModelNode[];
} {
  const nodes: TreeModelNode[] = [];
  if (values.length === 0 || values[0] === null || values[0] === undefined) {
    return { root: null, nodes };
  }

  const make = (value: number, id: number, parentId: number | null) => {
    const depth = Math.floor(Math.log2(id + 1));
    const slotsInRow = 2 ** depth;
    const positionInRow = id - (slotsInRow - 1);
    const node: TreeModelNode = {
      id,
      parentId,
      value,
      depth,
      x: ((positionInRow + 0.5) / slotsInRow) * VIEW_WIDTH,
      y: depth * ROW_HEIGHT + ROW_HEIGHT * 0.5,
      left: null,
      right: null,
    };
    nodes.push(node);
    return node;
  };

  const root = make(values[0] as number, 0, null);
  const queue: TreeModelNode[] = [root];
  let cursor = 1;
  while (queue.length > 0 && cursor < values.length) {
    const parent = queue.shift() as TreeModelNode;
    const leftValue = values[cursor++];
    if (leftValue !== null && leftValue !== undefined) {
      parent.left = make(leftValue, parent.id * 2 + 1, parent.id);
      queue.push(parent.left);
    }
    if (cursor >= values.length) break;
    const rightValue = values[cursor++];
    if (rightValue !== null && rightValue !== undefined) {
      parent.right = make(rightValue, parent.id * 2 + 2, parent.id);
      queue.push(parent.right);
    }
  }

  nodes.sort((a, b) => a.id - b.id);
  return { root, nodes };
}

function snapshot(
  nodes: TreeModelNode[],
  states: StateMap,
  notes?: NoteMap,
): TreeVizNode[] {
  return nodes.map((node) => ({
    id: node.id,
    parentId: node.parentId,
    x: node.x,
    y: node.y,
    label: node.value,
    state: states.get(node.id) ?? "idle",
    note: notes?.get(node.id),
  }));
}

function emptyTreeStep(message: string): TreeStep[] {
  return [
    {
      description: message,
      nodes: [],
      variables: {},
      headline: "Empty tree",
      tag: { label: "Done", tone: "info" },
      done: true,
    },
  ];
}

const DEFAULT_TREE: TreeInput = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7];

/* ------------------------------------------------------------------ */
/* 01 · Inorder Traversal                                              */
/* ------------------------------------------------------------------ */

export const inorderTraversalApproaches: Approaches = {
  brute: {
    label: "Recursive (hidden call stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(h) call stack \u2014 every node is visited once, but the depth of the recursion is the height of the tree, so a skewed tree can overflow the stack",
    code: [
      "function inorder(node, out) {",
      "  if (!node) return;",
      "  inorder(node.left, out);",
      "  out.push(node.value);",
      "  inorder(node.right, out);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("Nothing to traverse.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const out: number[] = [];

      const visit = (node: TreeModelNode | null, depth: number) => {
        if (!node) return;
        states.set(node.id, "active");
        steps.push({
          description: `Call inorder(${node.value}) \u2014 the call stack grows to depth ${depth + 1}; recurse left first`,
          nodes: snapshot(nodes, states),
          output: [...out],
          outputLabel: "inorder",
          variables: { node: node.value, "stack depth": depth + 1 },
          headline: `inorder(${node.value})`,
          tag: { label: "Go Left", tone: "info" },
          codeLine: 3,
        });
        visit(node.left, depth + 1);
        out.push(node.value);
        states.set(node.id, "visited");
        steps.push({
          description: `Left subtree of ${node.value} is finished, so ${node.value} is appended to the output before moving right`,
          nodes: snapshot(nodes, states),
          output: [...out],
          outputLabel: "inorder",
          variables: { node: node.value, visited: out.length },
          headline: `visit ${node.value}`,
          tag: { label: "Output", tone: "success" },
          codeLine: 4,
        });
        visit(node.right, depth + 1);
      };

      visit(root, 0);
      steps.push({
        description:
          "Recursion unwinds completely. The output is sorted whenever the tree is a BST, because inorder always reads left \u2192 node \u2192 right.",
        nodes: snapshot(nodes, states),
        output: [...out],
        outputLabel: "inorder",
        variables: { result: out.join(", ") },
        headline: `[${out.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Iterative (explicit stack)",
    complexity:
      "Time: O(n) \u00b7 Space: O(h) explicit stack \u2014 the same work, but the stack lives on the heap so depth is bounded by memory instead of the runtime's call-stack limit",
    code: [
      "const stack = [];",
      "let cur = root;",
      "while (cur || stack.length) {",
      "  while (cur) { stack.push(cur); cur = cur.left; }",
      "  cur = stack.pop();",
      "  out.push(cur.value);",
      "  cur = cur.right;",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("Nothing to traverse.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const out: number[] = [];
      const stack: TreeModelNode[] = [];
      let cur: TreeModelNode | null = root;

      while (cur || stack.length > 0) {
        while (cur) {
          stack.push(cur);
          states.set(cur.id, "active");
          steps.push({
            description: `Push ${cur.value} and keep walking left \u2014 the stack remembers where to come back to`,
            nodes: snapshot(nodes, states),
            output: [...out],
            outputLabel: "inorder",
            structure: { label: "stack", entries: stack.map((n) => n.value) },
            variables: { cur: cur.value },
            headline: `push(${cur.value})`,
            tag: { label: "Go Left", tone: "info" },
            codeLine: 4,
          });
          cur = cur.left;
        }
        const node = stack.pop() as TreeModelNode;
        out.push(node.value);
        states.set(node.id, "visited");
        steps.push({
          description: `No left child left to explore \u2014 pop ${node.value}, record it, then switch to its right subtree`,
          nodes: snapshot(nodes, states),
          output: [...out],
          outputLabel: "inorder",
          structure: { label: "stack", entries: stack.map((n) => n.value) },
          variables: { popped: node.value, visited: out.length },
          headline: `visit ${node.value}`,
          tag: { label: "Output", tone: "success" },
          codeLine: 6,
        });
        cur = node.right;
      }

      steps.push({
        description:
          "The stack is empty and no node is pending \u2014 the iterative walk produced exactly the same order as the recursive one, with no recursion depth risk.",
        nodes: snapshot(nodes, states),
        output: [...out],
        outputLabel: "inorder",
        structure: { label: "stack", entries: [] },
        variables: { result: out.join(", ") },
        headline: `[${out.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 02 · Maximum Depth of a Binary Tree                                 */
/* ------------------------------------------------------------------ */

export const maxDepthApproaches: Approaches = {
  brute: {
    label: "Brute Force (re-scan per level)",
    complexity:
      "Time: O(n \u00b7 h) \u00b7 Space: O(h) \u2014 ask \u201cis any node at depth d?\u201d for d = 0, 1, 2 \u2026 and re-walk the whole tree for every question",
    code: [
      "let depth = 0;",
      "while (nodesAtDepth(root, depth).length > 0) {",
      "  depth++;            // full traversal each time",
      "}",
      "return depth;",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree has depth 0.");
      const steps: TreeStep[] = [];
      const maxDepth = Math.max(...nodes.map((n) => n.depth));
      let scans = 0;

      for (let depth = 0; depth <= maxDepth + 1; depth++) {
        const states: StateMap = new Map();
        const atDepth = nodes.filter((n) => n.depth === depth);
        for (const node of nodes) {
          states.set(node.id, node.depth === depth ? "active" : "idle");
        }
        scans += nodes.length;
        const found = atDepth.length > 0;
        steps.push({
          description: found
            ? `Walk every one of the ${nodes.length} nodes just to learn that depth ${depth} is occupied by ${atDepth.map((n) => n.value).join(", ")}`
            : `Walk all ${nodes.length} nodes again and find nothing at depth ${depth} \u2014 the answer is ${depth}`,
          nodes: snapshot(nodes, states),
          variables: {
            "level probed": depth,
            "nodes touched so far": scans,
          },
          headline: found
            ? `level ${depth}: ${atDepth.length} node(s)`
            : `level ${depth}: empty`,
          tag: found
            ? { label: "Full Re-scan", tone: "danger" }
            : { label: "Stop", tone: "success" },
          codeLine: found ? 3 : 5,
        });
      }

      const finalStates: StateMap = new Map(
        nodes.map((n) => [
          n.id,
          (n.depth === maxDepth ? "result" : "visited") as TreeVizNode["state"],
        ]),
      );
      steps.push({
        description: `Depth is ${maxDepth + 1}, but it cost ${scans} node visits \u2014 roughly h full traversals instead of one.`,
        nodes: snapshot(nodes, finalStates),
        variables: { depth: maxDepth + 1, "nodes touched": scans },
        headline: `maxDepth = ${maxDepth + 1}`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (one BFS pass)",
    complexity:
      "Time: O(n) \u00b7 Space: O(w) \u2014 one level-by-level sweep; each node enters and leaves the queue exactly once",
    code: [
      "let queue = [root], depth = 0;",
      "while (queue.length) {",
      "  const next = [];",
      "  for (const node of queue) {",
      "    if (node.left) next.push(node.left);",
      "    if (node.right) next.push(node.right);",
      "  }",
      "  queue = next; depth++;",
      "}",
      "return depth;",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree has depth 0.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      let queue: TreeModelNode[] = [root];
      let depth = 0;

      while (queue.length > 0) {
        for (const node of queue) states.set(node.id, "active");
        depth++;
        steps.push({
          description: `Level ${depth} holds ${queue.map((n) => n.value).join(", ")} \u2014 increment the depth counter once for the whole level`,
          nodes: snapshot(nodes, states),
          structure: { label: "queue", entries: queue.map((n) => n.value) },
          variables: { depth, "level size": queue.length },
          headline: `depth = ${depth}`,
          tag: { label: "Level Sweep", tone: "info" },
          codeLine: 8,
        });
        const next: TreeModelNode[] = [];
        for (const node of queue) {
          if (node.left) next.push(node.left);
          if (node.right) next.push(node.right);
          states.set(node.id, "visited");
        }
        queue = next;
      }

      const deepest = Math.max(...nodes.map((n) => n.depth));
      for (const node of nodes) {
        if (node.depth === deepest) states.set(node.id, "result");
      }
      steps.push({
        description: `The queue is empty after ${depth} levels \u2014 every node was touched exactly once, so this is O(n) instead of O(n \u00b7 h).`,
        nodes: snapshot(nodes, states),
        structure: { label: "queue", entries: [] },
        variables: { depth, "nodes touched": nodes.length },
        headline: `maxDepth = ${depth}`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 03 · Level Order Traversal                                          */
/* ------------------------------------------------------------------ */

export const levelOrderApproaches: Approaches = {
  brute: {
    label: "Brute Force (one traversal per level)",
    complexity:
      "Time: O(n \u00b7 h) \u00b7 Space: O(h) \u2014 for every level, walk the entire tree and keep only the nodes whose depth matches",
    code: [
      "for (let d = 0; d < height(root); d++) {",
      "  const level = [];",
      "  collect(root, 0, d, level);   // full walk",
      "  result.push(level);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("Nothing to traverse.");
      const steps: TreeStep[] = [];
      const maxDepth = Math.max(...nodes.map((n) => n.depth));
      const result: number[][] = [];
      let touched = 0;

      for (let d = 0; d <= maxDepth; d++) {
        const states: StateMap = new Map();
        const level: number[] = [];
        for (const node of nodes) {
          touched++;
          if (node.depth === d) {
            level.push(node.value);
            states.set(node.id, "active");
          } else if (node.depth < d) {
            states.set(node.id, "visited");
          }
        }
        result.push(level);
        steps.push({
          description: `Level ${d}: re-walk all ${nodes.length} nodes, discard the ${nodes.length - level.length} that are at another depth, and keep ${level.join(", ")}`,
          nodes: snapshot(nodes, states),
          output: result.flat(),
          outputLabel: "result",
          variables: {
            level: d,
            "nodes touched": touched,
            wasted: touched - result.flat().length,
          },
          headline: `[${level.join(", ")}]`,
          tag: { label: "Re-scan", tone: "danger" },
          codeLine: 3,
        });
      }

      const finalStates: StateMap = new Map(
        nodes.map((n) => [n.id, "visited" as TreeVizNode["state"]]),
      );
      steps.push({
        description: `Correct, but each of the ${maxDepth + 1} levels paid for a full traversal \u2014 ${touched} visits for ${nodes.length} nodes.`,
        nodes: snapshot(nodes, finalStates),
        output: result.flat(),
        outputLabel: "result",
        variables: { levels: result.length, "nodes touched": touched },
        headline: result.map((lvl) => `[${lvl.join(",")}]`).join(" "),
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (BFS with a queue)",
    complexity:
      "Time: O(n) \u00b7 Space: O(w) \u2014 a queue holds one level at a time; every node is enqueued and dequeued exactly once",
    code: [
      "const queue = [root];",
      "while (queue.length) {",
      "  const size = queue.length, level = [];",
      "  for (let i = 0; i < size; i++) {",
      "    const node = queue.shift();",
      "    level.push(node.value);",
      "    if (node.left) queue.push(node.left);",
      "    if (node.right) queue.push(node.right);",
      "  }",
      "  result.push(level);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("Nothing to traverse.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const queue: TreeModelNode[] = [root];
      const result: number[][] = [];
      let touched = 0;

      states.set(root.id, "active");
      steps.push({
        description: `Seed the queue with the root ${root.value}. The queue size at the top of each round is exactly the width of that level.`,
        nodes: snapshot(nodes, states),
        output: [],
        outputLabel: "result",
        structure: { label: "queue", entries: [root.value] },
        variables: { "queue size": 1 },
        headline: `queue = [${root.value}]`,
        tag: { label: "Start", tone: "info" },
        codeLine: 1,
      });

      while (queue.length > 0) {
        const size = queue.length;
        const level: number[] = [];
        for (let i = 0; i < size; i++) {
          const node = queue.shift() as TreeModelNode;
          touched++;
          level.push(node.value);
          states.set(node.id, "visited");
          if (node.left) {
            queue.push(node.left);
            states.set(node.left.id, "active");
          }
          if (node.right) {
            queue.push(node.right);
            states.set(node.right.id, "active");
          }
          steps.push({
            description: `Dequeue ${node.value}, add it to the current level, and enqueue its ${[node.left && "left", node.right && "right"].filter(Boolean).join(" and ") || "no"} child${node.left && node.right ? "ren" : ""}`,
            nodes: snapshot(nodes, states),
            output: [...result.flat(), ...level],
            outputLabel: "result",
            structure: { label: "queue", entries: queue.map((n) => n.value) },
            variables: {
              dequeued: node.value,
              level: result.length,
              "nodes touched": touched,
            },
            headline: `visit ${node.value}`,
            tag: { label: "Dequeue", tone: "info" },
            codeLine: 5,
          });
        }
        result.push(level);
        steps.push({
          description: `Level ${result.length - 1} is complete: [${level.join(", ")}]. Everything still queued belongs to the next level.`,
          nodes: snapshot(nodes, states),
          output: result.flat(),
          outputLabel: "result",
          structure: { label: "queue", entries: queue.map((n) => n.value) },
          variables: { levels: result.length, "nodes touched": touched },
          headline: `[${level.join(", ")}]`,
          tag: { label: "Level Done", tone: "success" },
          codeLine: 10,
        });
      }

      steps.push({
        description: `${touched} visits for ${nodes.length} nodes \u2014 the queue boundary replaces the repeated depth filtering of the brute force version.`,
        nodes: snapshot(nodes, states),
        output: result.flat(),
        outputLabel: "result",
        structure: { label: "queue", entries: [] },
        variables: { levels: result.length, "nodes touched": touched },
        headline: result.map((lvl) => `[${lvl.join(",")}]`).join(" "),
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 04 · Validate Binary Search Tree                                    */
/* ------------------------------------------------------------------ */

function subtreeNodes(node: TreeModelNode | null): TreeModelNode[] {
  if (!node) return [];
  return [node, ...subtreeNodes(node.left), ...subtreeNodes(node.right)];
}

export const validateBstApproaches: Approaches = {
  brute: {
    label: "Brute Force (re-scan both subtrees)",
    complexity:
      "Time: O(n\u00b2) \u00b7 Space: O(h) \u2014 at every node, walk its entire left subtree and entire right subtree to compare every descendant",
    code: [
      "function isBST(node) {",
      "  if (!node) return true;",
      "  if (max(allValues(node.left)) >= node.value) return false;",
      "  if (min(allValues(node.right)) <= node.value) return false;",
      "  return isBST(node.left) && isBST(node.right);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree is a valid BST.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      let comparisons = 0;
      let valid = true;

      for (const node of nodes) {
        const left = subtreeNodes(node.left);
        const right = subtreeNodes(node.right);
        comparisons += left.length + right.length;
        const badLeft = left.find((n) => n.value >= node.value);
        const badRight = right.find((n) => n.value <= node.value);
        const localStates: StateMap = new Map(states);
        localStates.set(node.id, "active");
        for (const descendant of [...left, ...right]) {
          localStates.set(descendant.id, "visited");
        }

        if (badLeft || badRight) {
          const offender = badLeft ?? (badRight as TreeModelNode);
          localStates.set(offender.id, "rejected");
          steps.push({
            description: `Node ${node.value}: descendant ${offender.value} is on the wrong side \u2014 the tree is not a BST`,
            nodes: snapshot(nodes, localStates),
            variables: { node: node.value, comparisons },
            headline: `${offender.value} breaks ${node.value}`,
            tag: { label: "Invalid", tone: "danger" },
            codeLine: badLeft ? 3 : 4,
          });
          valid = false;
          break;
        }

        steps.push({
          description: `Node ${node.value}: re-read all ${left.length} left descendants and all ${right.length} right descendants to confirm they stay on the correct side`,
          nodes: snapshot(nodes, localStates),
          variables: {
            node: node.value,
            "left subtree": left.map((n) => n.value).join(", ") || "\u2014",
            "right subtree": right.map((n) => n.value).join(", ") || "\u2014",
            comparisons,
          },
          headline: `check ${node.value}`,
          tag: { label: "Re-scan Subtrees", tone: "danger" },
          codeLine: 3,
        });
        states.set(node.id, "visited");
      }

      steps.push({
        description: valid
          ? `Valid BST, but every node re-read its whole subtree \u2014 ${comparisons} comparisons for ${nodes.length} nodes.`
          : "A single misplaced descendant is enough to reject the tree.",
        nodes: snapshot(
          nodes,
          new Map(
            nodes.map((n) => [
              n.id,
              (valid ? "visited" : "idle") as TreeVizNode["state"],
            ]),
          ),
        ),
        variables: { valid, comparisons },
        headline: valid ? "isValidBST = true" : "isValidBST = false",
        tag: { label: "Done", tone: valid ? "info" : "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (min/max bounds)",
    complexity:
      "Time: O(n) \u00b7 Space: O(h) \u2014 push an allowed (low, high) range down the tree; each node is checked once against its inherited window",
    code: [
      "function isBST(node, low, high) {",
      "  if (!node) return true;",
      "  if (node.value <= low || node.value >= high) return false;",
      "  return isBST(node.left, low, node.value)",
      "      && isBST(node.right, node.value, high);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree is a valid BST.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const notes: NoteMap = new Map();
      let checks = 0;
      let valid = true;

      const fmt = (v: number) =>
        v === Number.NEGATIVE_INFINITY
          ? "-\u221e"
          : v === Number.POSITIVE_INFINITY
            ? "+\u221e"
            : String(v);

      const visit = (
        node: TreeModelNode | null,
        low: number,
        high: number,
      ): boolean => {
        if (!node) return true;
        checks++;
        notes.set(node.id, `(${fmt(low)}, ${fmt(high)})`);
        const ok = node.value > low && node.value < high;
        states.set(node.id, ok ? "active" : "rejected");
        steps.push({
          description: ok
            ? `${node.value} must land inside (${fmt(low)}, ${fmt(high)}) \u2014 it does, so narrow the window for its children`
            : `${node.value} is outside its allowed window (${fmt(low)}, ${fmt(high)}) \u2014 reject immediately, no subtree scan needed`,
          nodes: snapshot(nodes, states, notes),
          variables: {
            node: node.value,
            window: `(${fmt(low)}, ${fmt(high)})`,
            checks,
          },
          headline: ok
            ? `${fmt(low)} < ${node.value} < ${fmt(high)}`
            : `${node.value} \u2209 (${fmt(low)}, ${fmt(high)})`,
          tag: ok
            ? { label: "In Range", tone: "success" }
            : { label: "Violation", tone: "danger" },
          codeLine: 3,
        });
        if (!ok) return false;
        states.set(node.id, "visited");
        return (
          visit(node.left, low, node.value) &&
          visit(node.right, node.value, high)
        );
      };

      valid = visit(root, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);

      steps.push({
        description: valid
          ? `Every node passed its inherited window after exactly ${checks} checks \u2014 one pass instead of a subtree re-scan per node.`
          : "The bound that failed came from an ancestor, which is why comparing a node only with its direct parent is not enough.",
        nodes: snapshot(nodes, states, notes),
        variables: { valid, checks },
        headline: valid ? "isValidBST = true" : "isValidBST = false",
        tag: { label: "Done", tone: valid ? "success" : "danger" },
        done: true,
      });
      return steps;
    },
  },
};

/* ------------------------------------------------------------------ */
/* 05 · Lowest Common Ancestor in a BST                                */
/* ------------------------------------------------------------------ */

export const lcaApproaches: Approaches = {
  brute: {
    label: "Brute Force (store both root paths)",
    complexity:
      "Time: O(n) \u00b7 Space: O(n) \u2014 search the tree twice to build two root-to-node paths, then compare them position by position",
    code: [
      "const pathP = findPath(root, p);  // full search",
      "const pathQ = findPath(root, q);  // full search",
      "let i = 0;",
      "while (pathP[i] === pathQ[i]) i++;",
      "return pathP[i - 1];",
    ],
    run: (values, targetA, targetB): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("No nodes, no ancestor.");
      const p = targetA ?? 1;
      const q = targetB ?? 7;
      const steps: TreeStep[] = [];

      const findPath = (value: number): TreeModelNode[] => {
        const path: TreeModelNode[] = [];
        const dfs = (node: TreeModelNode | null): boolean => {
          if (!node) return false;
          path.push(node);
          if (node.value === value) return true;
          if (dfs(node.left) || dfs(node.right)) return true;
          path.pop();
          return false;
        };
        dfs(root);
        return path;
      };

      const pathP = findPath(p);
      const pathQ = findPath(q);

      if (pathP.length === 0 || pathQ.length === 0) {
        return [
          {
            description: `Either ${p} or ${q} is not in this tree \u2014 pick values that exist in the level-order input.`,
            nodes: snapshot(nodes, new Map()),
            variables: { p, q },
            headline: "Value not found",
            tag: { label: "Invalid Input", tone: "danger" },
            done: true,
          },
        ];
      }

      const statesP: StateMap = new Map(
        pathP.map((n) => [n.id, "active" as TreeVizNode["state"]]),
      );
      steps.push({
        description: `First full search: the root-to-${p} path is ${pathP.map((n) => n.value).join(" \u2192 ")}. Every node on the way had to be stored.`,
        nodes: snapshot(nodes, statesP),
        output: pathP.map((n) => n.value),
        outputLabel: `path to ${p}`,
        variables: { p, "path length": pathP.length },
        headline: `path(${p})`,
        tag: { label: "Search 1", tone: "danger" },
        codeLine: 1,
      });

      const statesQ: StateMap = new Map(statesP);
      for (const n of pathQ) statesQ.set(n.id, "active");
      steps.push({
        description: `Second full search: the root-to-${q} path is ${pathQ.map((n) => n.value).join(" \u2192 ")}. The tree has now been traversed twice.`,
        nodes: snapshot(nodes, statesQ),
        output: pathQ.map((n) => n.value),
        outputLabel: `path to ${q}`,
        variables: { q, "path length": pathQ.length },
        headline: `path(${q})`,
        tag: { label: "Search 2", tone: "danger" },
        codeLine: 2,
      });

      let i = 0;
      while (
        i < pathP.length &&
        i < pathQ.length &&
        pathP[i].id === pathQ[i].id
      ) {
        const states: StateMap = new Map(statesQ);
        states.set(pathP[i].id, "result");
        steps.push({
          description: `Position ${i}: both paths still agree on ${pathP[i].value}, so the answer is at least this deep`,
          nodes: snapshot(nodes, states),
          output: [pathP[i].value],
          outputLabel: "common prefix",
          variables: { i, common: pathP[i].value },
          headline: `${pathP[i].value} = ${pathQ[i].value}`,
          tag: { label: "Still Shared", tone: "info" },
          codeLine: 4,
        });
        i++;
      }

      const lca = pathP[i - 1];
      const finalStates: StateMap = new Map(statesQ);
      finalStates.set(lca.id, "result");
      steps.push({
        description: `The paths diverge at position ${i}, so the last shared node ${lca.value} is the lowest common ancestor \u2014 found only after two traversals and O(n) extra memory.`,
        nodes: snapshot(nodes, finalStates),
        output: [lca.value],
        outputLabel: "lca",
        variables: { p, q, lca: lca.value },
        headline: `LCA(${p}, ${q}) = ${lca.value}`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "Optimal (single BST descent)",
    complexity:
      "Time: O(h) \u00b7 Space: O(1) \u2014 BST ordering tells you which way to turn, so one walk from the root is enough and nothing is stored",
    code: [
      "let node = root;",
      "while (node) {",
      "  if (p < node.value && q < node.value) node = node.left;",
      "  else if (p > node.value && q > node.value) node = node.right;",
      "  else return node;   // the split point",
      "}",
    ],
    run: (values, targetA, targetB): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("No nodes, no ancestor.");
      const p = targetA ?? 1;
      const q = targetB ?? 7;
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      let node: TreeModelNode | null = root;
      let visits = 0;

      while (node) {
        visits++;
        states.set(node.id, "active");
        if (p < node.value && q < node.value) {
          steps.push({
            description: `Both ${p} and ${q} are smaller than ${node.value}, so the ancestor cannot be here \u2014 the entire right subtree is skipped`,
            nodes: snapshot(nodes, states),
            variables: { node: node.value, p, q, "nodes visited": visits },
            headline: `${p}, ${q} < ${node.value}`,
            tag: { label: "Go Left", tone: "info" },
            codeLine: 3,
          });
          states.set(node.id, "visited");
          node = node.left;
        } else if (p > node.value && q > node.value) {
          steps.push({
            description: `Both ${p} and ${q} are larger than ${node.value}, so move right and skip the whole left subtree`,
            nodes: snapshot(nodes, states),
            variables: { node: node.value, p, q, "nodes visited": visits },
            headline: `${p}, ${q} > ${node.value}`,
            tag: { label: "Go Right", tone: "info" },
            codeLine: 4,
          });
          states.set(node.id, "visited");
          node = node.right;
        } else {
          states.set(node.id, "result");
          steps.push({
            description: `${p} and ${q} fall on opposite sides of ${node.value} (or one of them is ${node.value}) \u2014 this split point is the lowest common ancestor`,
            nodes: snapshot(nodes, states),
            variables: { p, q, lca: node.value, "nodes visited": visits },
            headline: `LCA(${p}, ${q}) = ${node.value}`,
            tag: { label: "Split Point", tone: "success" },
            codeLine: 5,
            done: true,
          });
          return steps;
        }
      }

      steps.push({
        description: `Walked off the tree \u2014 ${p} or ${q} is not present in this BST.`,
        nodes: snapshot(nodes, states),
        variables: { p, q, "nodes visited": visits },
        headline: "Not found",
        tag: { label: "Invalid Input", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
};

type DfsApproaches = Partial<
  Record<"preorder" | "inorder" | "postorder", TreeApproachRunner>
>;

/* ------------------------------------------------------------------ */
/* Depth First Search \u00b7 preorder / inorder / postorder                  */
/* ------------------------------------------------------------------ */

type DfsOrder = "preorder" | "inorder" | "postorder";

const DFS_CODE: Record<DfsOrder, string[]> = {
  preorder: [
    "function dfs(node) {",
    "  if (!node) return;",
    "  out.push(node.value);   // visit BEFORE children",
    "  dfs(node.left);",
    "  dfs(node.right);",
    "}",
  ],
  inorder: [
    "function dfs(node) {",
    "  if (!node) return;",
    "  dfs(node.left);",
    "  out.push(node.value);   // visit BETWEEN children",
    "  dfs(node.right);",
    "}",
  ],
  postorder: [
    "function dfs(node) {",
    "  if (!node) return;",
    "  dfs(node.left);",
    "  dfs(node.right);",
    "  out.push(node.value);   // visit AFTER children",
    "}",
  ],
};

const DFS_VISIT_LINE: Record<DfsOrder, number> = {
  preorder: 3,
  inorder: 4,
  postorder: 5,
};

const DFS_SUMMARY: Record<DfsOrder, string> = {
  preorder:
    "Preorder reads a node the moment it is reached, so the output starts at the root \u2014 this is the order you use to copy or serialise a tree.",
  inorder:
    "Inorder waits until the whole left subtree is done, so on a BST the output comes out sorted.",
  postorder:
    "Postorder only records a node once both children are finished, so it is the order you use to delete a tree or to combine results bottom-up.",
};

function makeDfsRunner(order: DfsOrder, label: string): TreeApproachRunner {
  return {
    label,
    complexity: `Time: O(n) \u00b7 Space: O(h) \u2014 DFS follows one branch to the bottom before backtracking, so the only memory is the call stack, which is as deep as the tree is tall`,
    code: DFS_CODE[order],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("Nothing to traverse.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const notes: NoteMap = new Map();
      const out: number[] = [];
      const callStack: number[] = [];

      const record = (node: TreeModelNode) => {
        out.push(node.value);
        notes.set(node.id, `#${out.length}`);
        states.set(node.id, "visited");
        steps.push({
          description: `Record ${node.value} \u2014 ${
            order === "preorder"
              ? "preorder stamps the node on arrival, before either child is touched"
              : order === "inorder"
                ? "its left subtree is finished, so inorder stamps it now, before going right"
                : "both of its children are finished, so postorder can finally stamp it"
          }`,
          nodes: snapshot(nodes, states, notes),
          output: [...out],
          outputLabel: order,
          structure: { label: "call stack", entries: [...callStack] },
          variables: { node: node.value, recorded: out.length },
          headline: `visit ${node.value}`,
          tag: { label: "Output", tone: "success" },
          codeLine: DFS_VISIT_LINE[order],
        });
      };

      const visit = (node: TreeModelNode | null) => {
        if (!node) return;
        callStack.push(node.value);
        if (states.get(node.id) !== "visited") states.set(node.id, "active");
        steps.push({
          description: `Descend into ${node.value} \u2014 DFS always goes as deep as it can before it backtracks, so the call stack is now ${callStack.length} frame(s) tall`,
          nodes: snapshot(nodes, states, notes),
          output: [...out],
          outputLabel: order,
          structure: { label: "call stack", entries: [...callStack] },
          variables: { node: node.value, "stack depth": callStack.length },
          headline: `dfs(${node.value})`,
          tag: { label: "Descend", tone: "info" },
          codeLine: 2,
        });

        if (order === "preorder") record(node);
        visit(node.left);
        if (order === "inorder") record(node);
        visit(node.right);
        if (order === "postorder") record(node);

        callStack.pop();
      };

      visit(root);
      steps.push({
        description: DFS_SUMMARY[order],
        nodes: snapshot(nodes, states, notes),
        output: [...out],
        outputLabel: order,
        structure: { label: "call stack", entries: [] },
        variables: { result: out.join(", "), "nodes visited": out.length },
        headline: `[${out.join(", ")}]`,
        tag: { label: "Done", tone: "success" },
        done: true,
      });
      return steps;
    },
  };
}

export const dfsOrderApproaches: DfsApproaches = {
  preorder: makeDfsRunner(
    "preorder",
    "Preorder (node \u2192 left \u2192 right)",
  ),
  inorder: makeDfsRunner("inorder", "Inorder (left \u2192 node \u2192 right)"),
  postorder: makeDfsRunner(
    "postorder",
    "Postorder (left \u2192 right \u2192 node)",
  ),
};

/* ------------------------------------------------------------------ */
/* Breadth First Search \u00b7 minimum depth                                */
/* ------------------------------------------------------------------ */

export const minDepthApproaches: Approaches = {
  brute: {
    label: "DFS (explores every branch)",
    complexity:
      "Time: O(n) \u00b7 Space: O(h) \u2014 depth first cannot stop early: the shallowest leaf may be the very first one it meets, but it has no way to know that without finishing the rest of the tree",
    code: [
      "function dfs(node) {",
      "  if (!node) return Infinity;",
      "  if (!node.left && !node.right) return 1;",
      "  return 1 + Math.min(dfs(node.left), dfs(node.right));",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree has minimum depth 0.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const notes: NoteMap = new Map();
      let visits = 0;
      let best = Number.POSITIVE_INFINITY;

      const visit = (node: TreeModelNode | null, depth: number): number => {
        if (!node) return Number.POSITIVE_INFINITY;
        visits++;
        states.set(node.id, "active");
        const isLeaf = !node.left && !node.right;
        if (isLeaf) {
          best = Math.min(best, depth);
          notes.set(node.id, `leaf d=${depth}`);
        }
        steps.push({
          description: isLeaf
            ? `${node.value} is a leaf at depth ${depth} \u2014 record it, but DFS still has to unwind and check every remaining branch`
            : `Visit ${node.value} at depth ${depth} and keep descending \u2014 DFS has no idea whether a shallower leaf exists elsewhere`,
          nodes: snapshot(nodes, states, notes),
          structure: { label: "path depth", entries: [depth] },
          variables: {
            node: node.value,
            depth,
            "best leaf so far": best === Number.POSITIVE_INFINITY ? "-" : best,
            "nodes visited": visits,
          },
          headline: isLeaf ? `leaf ${node.value}` : `dfs(${node.value})`,
          tag: isLeaf
            ? { label: "Leaf Found", tone: "success" }
            : { label: "Descend", tone: "info" },
          codeLine: isLeaf ? 3 : 4,
        });
        if (isLeaf) {
          states.set(node.id, "visited");
          return 1;
        }
        const result =
          1 +
          Math.min(visit(node.left, depth + 1), visit(node.right, depth + 1));
        states.set(node.id, "visited");
        return result;
      };

      const answer = visit(root, 1);
      const finalStates: StateMap = new Map(
        nodes.map((n) => [n.id, "visited" as TreeVizNode["state"]]),
      );
      for (const node of nodes) {
        if (!node.left && !node.right && node.depth + 1 === answer) {
          finalStates.set(node.id, "result");
        }
      }
      steps.push({
        description: `Minimum depth is ${answer}, but DFS touched all ${visits} nodes to prove it \u2014 it has to finish every branch before it can compare them.`,
        nodes: snapshot(nodes, finalStates, notes),
        variables: { "min depth": answer, "nodes visited": visits },
        headline: `minDepth = ${answer}`,
        tag: { label: "Done", tone: "danger" },
        done: true,
      });
      return steps;
    },
  },
  optimal: {
    label: "BFS (stops at the first leaf)",
    complexity:
      "Time: O(n) worst case but usually far less \u00b7 Space: O(w) \u2014 breadth first finishes a whole level before starting the next, so the very first leaf it meets is guaranteed to be the shallowest and it can return immediately",
    code: [
      "const queue = [[root, 1]];",
      "while (queue.length) {",
      "  const [node, depth] = queue.shift();",
      "  if (!node.left && !node.right) return depth;  // first leaf wins",
      "  if (node.left) queue.push([node.left, depth + 1]);",
      "  if (node.right) queue.push([node.right, depth + 1]);",
      "}",
    ],
    run: (values): TreeStep[] => {
      const { root, nodes } = buildTree(values);
      if (!root) return emptyTreeStep("An empty tree has minimum depth 0.");
      const steps: TreeStep[] = [];
      const states: StateMap = new Map();
      const notes: NoteMap = new Map();
      const queue: { node: TreeModelNode; depth: number }[] = [
        { node: root, depth: 1 },
      ];
      let visits = 0;

      while (queue.length > 0) {
        const { node, depth } = queue.shift() as (typeof queue)[number];
        visits++;
        states.set(node.id, "active");
        notes.set(node.id, `d=${depth}`);
        const isLeaf = !node.left && !node.right;

        if (isLeaf) {
          states.set(node.id, "result");
          steps.push({
            description: `${node.value} is a leaf at depth ${depth}. Because BFS drains level ${depth - 1} before it ever looks at level ${depth}, no shallower leaf can exist \u2014 return immediately.`,
            nodes: snapshot(nodes, states, notes),
            structure: {
              label: "queue",
              entries: queue.map((e) => e.node.value),
            },
            variables: {
              node: node.value,
              depth,
              "nodes visited": visits,
              "nodes skipped": nodes.length - visits,
            },
            headline: `minDepth = ${depth}`,
            tag: { label: "Early Exit", tone: "success" },
            codeLine: 4,
            done: true,
          });
          return steps;
        }

        if (node.left) queue.push({ node: node.left, depth: depth + 1 });
        if (node.right) queue.push({ node: node.right, depth: depth + 1 });
        states.set(node.id, "visited");
        steps.push({
          description: `Dequeue ${node.value} (depth ${depth}); it has children, so push them and move on \u2014 the queue always holds nodes in non-decreasing depth order`,
          nodes: snapshot(nodes, states, notes),
          structure: {
            label: "queue",
            entries: queue.map((e) => e.node.value),
          },
          variables: {
            node: node.value,
            depth,
            "queue size": queue.length,
            "nodes visited": visits,
          },
          headline: `dequeue ${node.value}`,
          tag: { label: "Expand", tone: "info" },
          codeLine: 3,
        });
      }

      steps.push({
        description: "The queue drained without finding a leaf.",
        nodes: snapshot(nodes, states, notes),
        variables: { "nodes visited": visits },
        headline: "No leaf",
        tag: { label: "Done", tone: "info" },
        done: true,
      });
      return steps;
    },
  },
};

export { DEFAULT_TREE };
