import sys

sys.setrecursionlimit(20000)


def max_depth(tree, index=0):
    # TODO: implement; tree[i] == -1 means the node is missing,
    # children of i are at 2*i+1 and 2*i+2
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    tree = [int(x) for x in data[1:1 + n]]
    print(max_depth(tree))


if __name__ == "__main__":
    main()
