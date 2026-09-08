import sys


def product_except_self(nums):
    # TODO: implement without using division
    return []


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    print(" ".join(str(x) for x in product_except_self(nums)))


if __name__ == "__main__":
    main()
