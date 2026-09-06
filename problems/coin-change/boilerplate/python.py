import sys


def coin_change(coins, amount):
    # TODO: implement and return the minimum coin count, or -1
    return -1


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    coins = [int(x) for x in data[1:1 + n]]
    amount = int(data[1 + n])
    print(coin_change(coins, amount))


if __name__ == "__main__":
    main()
