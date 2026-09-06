import sys


def top_k_frequent(nums, k):
    # TODO: return the k most frequent values, by frequency desc then value asc
    return []


def main():
    data = sys.stdin.read().split()
    n = int(data[0])
    nums = [int(x) for x in data[1:1 + n]]
    k = int(data[1 + n])
    print(" ".join(str(x) for x in top_k_frequent(nums, k)))


if __name__ == "__main__":
    main()
