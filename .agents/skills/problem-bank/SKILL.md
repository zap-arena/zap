---
name: problem-bank
description: >-
  Use this skill when creating, importing, or editing competitive programming problems,
  test cases, or multi-language starter code templates.
---

# Competitive Problem Bank & Test Case Authoring Guide

Use this skill when creating or maintaining contest problems and judge configurations.

## Problem Anatomy

Every problem in ZAP consists of:
1. **Metadata**: Title, slug, difficulty (`Easy` | `Medium` | `Hard`), category/tag, points.
2. **Statement (`statement.md`)**:
   - Description with real-world or intuitive context.
   - Input format and Output format.
   - Constraints ($1 \le N \le 10^5$, etc.).
   - Examples with input, output, and step-by-step explanations.
3. **Multi-Language Boilerplates**:
   - **Python** (`solution.py`): Standard `sys.stdin.read` or `input()` parsing.
   - **C++** (`solution.cpp`): Fast I/O (`cin.tie(NULL)`), solution function.
   - **Java** (`Main.java`): Public class `Main` with `Scanner` or `BufferedReader`.
   - **C** (`solution.c`): `scanf` / `printf` wiring.
4. **Test Suite**:
   - **Public Samples** (`hidden = false`, `marks = 0`): Clean, small inputs displayed to the user in the contest IDE.
   - **Hidden Test Cases** (`hidden = true`, `marks > 0`): Comprehensive test suite evaluating:
     - Edge cases (empty array, single element, negative numbers, all duplicates).
     - Boundary constraints ($N = 10^5$, values up to $10^9$ requiring 64-bit integers).
     - Adversarial cases (worst-case inputs causing $O(N^2)$ to trigger Time Limit Exceeded).

## Marks & Scoring Rules
- Total marks across all hidden test cases should sum to 100 points per problem.
- Public sample test cases must always have `marks: 0`.

## JSON Problem Format for Bulk Import
```json
{
  "title": "Reverse String",
  "slug": "reverse-string",
  "difficulty": "Easy",
  "description": "# Reverse String\n\nGiven a string `s`, return the reversed string.",
  "boilerplates": {
    "python": "def solve():\n    pass",
    "cpp": "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
    "java": "public class Main {\n    public static void main(String[] args) {}\n}",
    "c": "#include <stdio.h>\nint main() { return 0; }"
  },
  "testCases": [
    { "input": "hello", "expectedOutput": "olleh", "hidden": false, "marks": 0 },
    { "input": "racecar", "expectedOutput": "racecar", "hidden": true, "marks": 50 },
    { "input": "a", "expectedOutput": "a", "hidden": true, "marks": 50 }
  ]
}
```
