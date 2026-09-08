# Two Sum

Given an array of integers `nums` and an integer `target`, return the **indices** of the two
numbers such that they add up to `target`.

Each input has exactly one solution, and you may not use the same element twice.
Return the indices in increasing order, separated by a single space.

## Input

- Line 1: integer `n`, the number of elements.
- Line 2: `n` space-separated integers, the array `nums`.
- Line 3: integer `target`.

## Output

Two space-separated indices `i` and `j` with `i < j` such that `nums[i] + nums[j] == target`.

## Example

Input:

```
4
2 7 11 15
9
```

Output:

```
0 1
```

Because `nums[0] + nums[1] == 2 + 7 == 9`.

## Constraints

- `2 <= n <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- Exactly one valid answer exists.
