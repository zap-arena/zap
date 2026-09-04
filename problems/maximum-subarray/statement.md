# Maximum Subarray

Given an integer array `nums`, find the contiguous subarray containing **at least one number**
which has the largest sum, and return that sum.

## Input

- Line 1: integer `n`, the number of elements.
- Line 2: `n` space-separated integers, the array `nums`.

## Output

A single integer: the maximum subarray sum.

## Example

Input:

```
9
-2 1 -3 4 -1 2 1 -5 4
```

Output:

```
6
```

The subarray `[4, -1, 2, 1]` has the largest sum, `6`.

## Constraints

- `1 <= n <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

A linear-time solution (Kadane's algorithm) is expected.
