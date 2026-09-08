# Number of Islands

Given a `rows x cols` grid where `'1'` is land and `'0'` is water, count the number of
**islands**. An island is a group of land cells connected **horizontally or vertically**
(diagonals do not connect). Assume the grid is surrounded by water on all sides.

## Input

- Line 1: two integers `rows` and `cols`.
- Next `rows` lines: each a string of `cols` characters, `'0'` or `'1'`.

## Output

A single integer: the number of islands.

## Example

Input:

```
4 5
11000
11000
00100
00011
```

Output:

```
3
```

## Constraints

- `1 <= rows, cols <= 300`
- Every character is `'0'` or `'1'`

A flood fill (DFS/BFS) or union-find over the grid solves this in `O(rows * cols)`.
