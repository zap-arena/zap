# Merge Sorted Array

You are given two integer arrays `a` and `b`, both sorted in **non-decreasing order**.
Merge them into a single array sorted in non-decreasing order.

Aim for `O(m + n)` time using two pointers rather than concatenating and re-sorting.

## Input

- Line 1: integer `m`, the length of `a`.
- Line 2: `m` space-separated integers (this line is empty when `m == 0`).
- Line 3: integer `n`, the length of `b`.
- Line 4: `n` space-separated integers (this line is empty when `n == 0`).

## Output

`m + n` space-separated integers: the merged sorted array.

## Example

Input:

```
3
1 2 3
3
2 5 6
```

Output:

```
1 2 2 3 5 6
```

## Constraints

- `0 <= m, n <= 10^5` and `m + n >= 1`
- `-10^9 <= a[i], b[i] <= 10^9`
- Both arrays are already sorted ascending.
