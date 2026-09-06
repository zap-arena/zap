import sys


def trap(height):
    # TODO: implement and return the trapped water
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    height = [int(x) for x in data[1:1 + n]]
    print(trap(height))


if __name__ == "__main__":
    main()
