import sys


def search(nums, target):
    # TODO: implement and return the index of target, or -1
    return -1


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    target = int(data[1 + n])
    print(search(nums, target))


if __name__ == "__main__":
    main()
