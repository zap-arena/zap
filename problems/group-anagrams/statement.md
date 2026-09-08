# Group Anagrams

Given an array of strings, group the words that are **anagrams** of each other. Two words are
anagrams when one is a rearrangement of the letters of the other.

To keep the output deterministic:

- sort the words inside each group lexicographically;
- print the groups in ascending order of their first word.

## Input

- Line 1: integer `n`, the number of words.
- Next `n` lines: one non-empty lowercase word per line.

## Output

One group per line: the group's words separated by single spaces.

## Example

Input:

```
6
eat
tea
tan
ate
nat
bat
```

Output:

```
ate eat tea
bat
nat tan
```

## Constraints

- `1 <= n <= 10^4`
- `1 <= |word| <= 100`
- Words contain only lowercase English letters.
