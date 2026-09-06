import sys


def max_profit(prices):
    # TODO: implement and return the maximum profit
    return 0


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    prices = [int(x) for x in data[1:1 + n]]
    print(max_profit(prices))


if __name__ == "__main__":
    main()
