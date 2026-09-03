# Product of Array Except Self

Given an integer array `nums`, return an array `answer` such that `answer[i]` equals the
product of all the elements of `nums` **except** `nums[i]`.

You must solve it in `O(n)` time **without using the division operator**.

## Input

- Line 1: integer `n`, the number of elements.
- Line 2: `n` space-separated integers, the array `nums`.

## Output

`n` space-separated integers: the array `answer`.

## Example

Input:

```
4
1 2 3 4
```

Output:

```
24 12 8 6
```

`answer[0] = 2*3*4 = 24`, `answer[1] = 1*3*4 = 12`, `answer[2] = 1*2*4 = 8`,
`answer[3] = 1*2*3 = 6`.

## Constraints

- `2 <= n <= 10^5`
- `-30 <= nums[i] <= 30`
- Division is not allowed.
