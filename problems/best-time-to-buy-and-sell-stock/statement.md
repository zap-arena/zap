# Best Time to Buy and Sell Stock

You are given an array `prices` where `prices[i]` is the price of a given stock on day `i`.

You want to maximise your profit by choosing a **single day to buy** one stock and a
**different day in the future to sell** it. Return the maximum profit you can achieve.
If no profit is possible, return `0`.

## Input

- Line 1: integer `n`, the number of days.
- Line 2: `n` space-separated integers, the array `prices`.

## Output

A single integer: the maximum profit.

## Example

Input:

```
6
7 1 5 3 6 4
```

Output:

```
5
```

Buy on day `1` (price `1`) and sell on day `4` (price `6`).

## Constraints

- `1 <= n <= 10^5`
- `0 <= prices[i] <= 10^4`
- You must buy before you sell.
