import sys


def solve(nums):
    # TODO: implement the logic described in the current stage's statement
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    print(solve(nums))


if __name__ == "__main__":
    main()
