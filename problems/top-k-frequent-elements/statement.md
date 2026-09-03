# Top K Frequent Elements

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

Because ties would otherwise be ambiguous, print the answer ordered by:

1. **descending frequency**, then
2. **ascending value** for elements with the same frequency.

## Input

- Line 1: integer `n`, the number of elements.
- Line 2: `n` space-separated integers, the array `nums`.
- Line 3: integer `k`.

## Output

`k` space-separated integers in the order described above.

## Example

Input:

```
6
1 1 1 2 2 3
2
```

Output:

```
1 2
```

`1` occurs three times, `2` occurs twice.

## Constraints

- `1 <= n <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <=` the number of distinct values in `nums`

A heap or bucket sort over the frequency map beats a full `O(n log n)` sort.
