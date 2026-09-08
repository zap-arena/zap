import sys


def two_sum(nums, target):
    # TODO: implement and return the two indices
    return []


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    target = int(data[1 + n])
    print(" ".join(str(x) for x in two_sum(nums, target)))


if __name__ == "__main__":
    main()
