# Reverse Linked List

Given the `head` of a singly linked list, reverse the list and return the new head.

The driver code in each boilerplate builds the list from the input and prints the values of
the list you return, so you only need to implement the reversal itself. Both the iterative
(`O(1)` extra space) and the recursive approaches are accepted.

## Input

- Line 1: integer `n`, the number of nodes.
- Line 2: `n` space-separated integers, the values from head to tail. The line is empty when
  `n == 0`.

## Output

The values of the reversed list from head to tail, separated by single spaces. For an empty
list, print an empty line.

## Example

Input:

```
5
1 2 3 4 5
```

Output:

```
5 4 3 2 1
```

## Constraints

- `0 <= n <= 5000`
- `-5000 <= node value <= 5000`
