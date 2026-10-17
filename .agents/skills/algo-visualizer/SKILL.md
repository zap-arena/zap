---
name: algo-visualizer
description: >-
  Use this skill when building, updating, or debugging interactive algorithm visualizers
  or step-by-step state animations in src/components/guide/.
---

# Interactive Algorithm Visualizer Development Guide

This skill guides you through creating or modifying interactive algorithm visualizers and state generators in `src/components/guide/`.

## Architecture & File Locations

- **Visualizer Engines**:
  - `AlgoVisualizer.tsx`: Generic array, pointer, and window state visualizer.
  - `GraphVisualizer.tsx`: Node/edge network, BFS/DFS traversal step inspector.
  - `TreeVisualizer.tsx`: Binary trees, BSTs, and traversals.
  - `RecursionVisualizer.tsx`: Stack frame simulation for recursive trees.
  - `DPGridVisualizer.tsx`: 1D/2D Dynamic Programming memoization grids.
- **State Step Generators** (`*Visualizations.ts`):
  - `slidingWindowVisualizations.ts`, `twoPointerVisualizations.ts`, `graphVisualizations.ts`, etc.

## How to Author a Visualization Approach

In the relevant `*Visualizations.ts` file, export approach configurations satisfying the visualization engine interface:

```typescript
export interface VisualizationStep {
  array: (number | string)[];
  pointers: {
    name: string;
    index: number;
    color?: string; // semantic color e.g. "cyan", "emerald", "amber"
  }[];
  window?: {
    start: number;
    end: number;
  };
  highlights?: number[]; // indices to highlight
  description: string;   // short plain-English explanation of this exact step
  codeLine: number;      // 1-indexed line number in the code snippet
  variables?: Record<string, string | number | boolean>;
}
```

## Critical Rules for Visualizers:

1. **Step Granularity**: Break state transitions into micro-steps. Never jump from loop start to loop end in one step.
2. **Synchronized Code Highlighting**: Always map `codeLine` accurately to the active line of code being executed.
3. **Contrast & Themes**: Do not use hardcoded hex colors for nodes, array bars, or pointers. Use CSS variables or Tailwind tokens (`bg-card`, `text-foreground`, `border-border`, `bg-primary/20`) so light and dark modes look crisp.
4. **Focus Mode**: Ensure the container uses `className="question"` with an `id` when placed inside a curriculum page so `useGuideLogic.ts` can control focus navigation.
5. **Always Verify**: Run `pnpm tsc --noEmit` after editing.
