# Valid Palindrome

A phrase is a **palindrome** if, after converting all uppercase letters to lowercase and
removing every character that is not a letter or digit, it reads the same forwards and
backwards.

Given a string `s`, decide whether it is a palindrome.

## Input

- Line 1: the string `s`. It may contain spaces, punctuation and mixed case.

## Output

Print `true` if `s` is a palindrome, otherwise `false`.

## Example

Input:

```
A man, a plan, a canal: Panama
```

Output:

```
true
```

After cleaning, `s` becomes `"amanaplanacanalpanama"`.

## Constraints

- `1 <= |s| <= 2 * 10^5`
- `s` consists of printable ASCII characters.

Two pointers walking inwards solve this in `O(n)` time and `O(1)` extra space.
