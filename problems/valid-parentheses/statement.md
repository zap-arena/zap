# Valid Parentheses

Given a string `s` containing only the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`,
determine whether the string is **valid**.

A string is valid when:

1. Every open bracket is closed by a bracket of the **same type**.
2. Brackets are closed in the **correct order**.
3. Every closing bracket has a matching open bracket.

## Input

- Line 1: the string `s`.

## Output

Print `true` if `s` is valid, otherwise print `false`.

## Example

Input:

```
()[]{}
```

Output:

```
true
```

Each bracket is immediately closed by its own type, so the sequence is valid.

## Constraints

- `1 <= |s| <= 10^4`
- `s` consists only of the characters `()[]{}`
