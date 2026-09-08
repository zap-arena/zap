# Longest Common Subsequence

Given two strings `a` and `b`, return the length of their **longest common subsequence**.
If there is no common subsequence, return `0`.

A *subsequence* is formed by deleting zero or more characters from a string without changing
the relative order of the remaining characters. A *common* subsequence is a subsequence of
both strings.

## Input

- Line 1: the string `a`.
- Line 2: the string `b`.

## Output

A single integer: the length of the longest common subsequence.

## Example

Input:

```
abcde
ace
```

Output:

```
3
```

`"ace"` appears as a subsequence in both strings.

## Constraints

- `1 <= |a|, |b| <= 1000`
- Both strings contain only lowercase English letters.

The classic solution is an `O(|a| * |b|)` table.
