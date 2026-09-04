import sys


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    # TODO: reverse the list and return the new head
    return head


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    vals = [int(x) for x in data[1:1 + n]]

    head = None
    for v in reversed(vals):
        head = ListNode(v, head)

    out = []
    node = reverse_list(head)
    while node is not None:
        out.append(str(node.val))
        node = node.next
    print(" ".join(out))


if __name__ == "__main__":
    main()
