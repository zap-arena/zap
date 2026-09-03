import sys


def find_median_sorted_arrays(a, b):
    # TODO: implement and return the median as a float
    return 0.0


def main():
    data = sys.stdin.read().split()
    m = int(data[0])
    a = [int(x) for x in data[1:1 + m]]
    n = int(data[1 + m])
    b = [int(x) for x in data[2 + m:2 + m + n]]
    print("%.5f" % find_median_sorted_arrays(a, b))


if __name__ == "__main__":
    main()
