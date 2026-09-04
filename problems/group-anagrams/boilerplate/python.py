import sys


def group_anagrams(words):
    # TODO: return a list of groups; sort each group, then sort groups by first word
    return []


def main():
    data = sys.stdin.read().split("\n")
    n = int(data[0].strip())
    words = [data[1 + i].strip() for i in range(n)]
    for group in group_anagrams(words):
        print(" ".join(group))


if __name__ == "__main__":
    main()
