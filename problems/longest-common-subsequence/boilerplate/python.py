import sys


def longest_common_subsequence(a, b):
    # TODO: implement and return the LCS length
    return 0


def main():
    data = sys.stdin.read().split("\n")
    a = data[0].strip()
    b = data[1].strip() if len(data) > 1 else ""
    print(longest_common_subsequence(a, b))


if __name__ == "__main__":
    main()
