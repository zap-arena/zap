# Maximum Depth of Binary Tree

Given a binary tree, return its **maximum depth**: the number of nodes along the longest path
from the root down to the farthest leaf.

The tree is supplied in a fixed-size array in level order:

- index `0` holds the root;
- the children of index `i` live at indices `2*i + 1` and `2*i + 2`;
- the value `-1` means "no node here".

An empty tree (`-1` at index `0`) has depth `0`.

## Input

- Line 1: integer `n`, the length of the array.
- Line 2: `n` space-separated integers in level order, using `-1` for missing nodes.

## Output

A single integer: the maximum depth.

## Example

Input:

```
7
3 9 20 -1 -1 15 7
```

Output:

```
3
```

The tree is

```
    3
   / \
  9  20
     / \
    15  7
```

and its longest root-to-leaf path holds `3` nodes.

## Constraints

- `1 <= n <= 2047`
- Each value is `-1` or in `[0, 10^4]`
- Children appear only for nodes that exist.
