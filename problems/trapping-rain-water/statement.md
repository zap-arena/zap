# Trapping Rain Water

Given `n` non-negative integers representing an elevation map where the width of each bar is
`1`, compute how much water can be trapped after raining.

Water above index `i` is bounded by the tallest bar to its left and the tallest bar to its
right: it holds `min(maxLeft, maxRight) - height[i]` units when that value is positive.

## Input

- Line 1: integer `n`, the number of bars.
- Line 2: `n` space-separated non-negative integers, the array `height`.

## Output

A single integer: the total amount of trapped water.

## Example

Input:

```
12
0 1 0 2 1 0 1 3 2 1 2 1
```

Output:

```
6
```

## Constraints

- `1 <= n <= 2 * 10^4`
- `0 <= height[i] <= 10^5`

An `O(n)` time, `O(1)` space two-pointer solution exists.
