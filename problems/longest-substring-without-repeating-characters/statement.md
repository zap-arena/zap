# Longest Substring Without Repeating Characters

Given a string `s`, find the length of the **longest substring** that contains no repeated
characters.

A substring is a contiguous block of characters; `"pwke"` is a subsequence of `"pwwkew"`,
not a substring.

## Input

- Line 1: the string `s`. It may be empty.

## Output

A single integer: the length of the longest substring with all distinct characters.

## Example

Input:

```
abcabcbb
```

Output:

```
3
```

`"abc"` is the longest run of distinct characters.

## Constraints

- `0 <= |s| <= 5 * 10^4`
- `s` contains printable ASCII characters and no spaces.

A sliding-window solution runs in `O(n)`.
