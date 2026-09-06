import sys


def num_islands(grid):
    # TODO: implement; grid is a list of strings of '0' and '1'
    return 0


def main():
    data = sys.stdin.read().split("\n")
    rows, cols = (int(x) for x in data[0].split())
    grid = [data[1 + r].strip() for r in range(rows)]
    print(num_islands(grid))


if __name__ == "__main__":
    main()
