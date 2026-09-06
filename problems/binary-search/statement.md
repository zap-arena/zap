# Binary Search

Given a sorted array of distinct integers `nums` and an integer `target`, return the index of
`target` inside `nums`. If `target` does not exist, return `-1`.

Your solution must run in `O(log n)` time.

## Input

- Line 1: integer `n`, the number of elements.
- Line 2: `n` space-separated integers, sorted in ascending order.
- Line 3: integer `target`.

## Output

A single integer: the index of `target`, or `-1`.

## Example

Input:

```
6
-1 0 3 5 9 12
9
```

Output:

```
4
```

## Constraints

- `1 <= n <= 10^5`
- `-10^9 <= nums[i], target <= 10^9`
- All values in `nums` are distinct and sorted ascending.
