import sys


def merge(a, b):
    # TODO: implement and return the merged sorted list
    return []


def main():
    data = sys.stdin.read().split()
    m = int(data[0])
    a = [int(x) for x in data[1:1 + m]]
    n = int(data[1 + m])
    b = [int(x) for x in data[2 + m:2 + m + n]]
    print(" ".join(str(x) for x in merge(a, b)))


if __name__ == "__main__":
    main()
