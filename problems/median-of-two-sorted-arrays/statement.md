# Median of Two Sorted Arrays

Given two sorted arrays `a` and `b` of sizes `m` and `n`, return the **median** of the two
arrays combined.

For an odd total length the median is the middle element; for an even total length it is the
average of the two middle elements. Print the result with **exactly 5 digits** after the
decimal point.

## Input

- Line 1: integer `m`, the length of `a`.
- Line 2: `m` space-separated integers (empty line when `m == 0`).
- Line 3: integer `n`, the length of `b`.
- Line 4: `n` space-separated integers (empty line when `n == 0`).

## Output

The median, formatted with 5 decimal places (for example `2.50000`).

## Example

Input:

```
2
1 2
2
3 4
```

Output:

```
2.50000
```

The merged array is `[1, 2, 3, 4]`, so the median is `(2 + 3) / 2 = 2.5`.

## Constraints

- `0 <= m, n <= 1000` and `m + n >= 1`
- `-10^6 <= a[i], b[i] <= 10^6`
- Both arrays are sorted ascending.

The intended solution runs in `O(log(min(m, n)))` using binary search on the partition.
