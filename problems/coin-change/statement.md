# Coin Change

You are given an array `coins` of distinct denominations and an integer `amount`.
Return the **fewest number of coins** needed to make up `amount`. You may use each
denomination an unlimited number of times.

If the amount cannot be made from any combination of coins, return `-1`.
Making the amount `0` requires `0` coins.

## Input

- Line 1: integer `n`, the number of denominations.
- Line 2: `n` space-separated integers, the array `coins`.
- Line 3: integer `amount`.

## Output

A single integer: the minimum number of coins, or `-1`.

## Example

Input:

```
3
1 2 5
11
```

Output:

```
3
```

`11 = 5 + 5 + 1` uses three coins, and no combination uses fewer.

## Constraints

- `1 <= n <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 10^4`

A bottom-up DP over amounts runs in `O(n * amount)`.
