import sys


def max_subarray(nums):
    # TODO: implement and return the maximum subarray sum
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    print(max_subarray(nums))


if __name__ == "__main__":
    main()
