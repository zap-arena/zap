import sys


def is_palindrome(s):
    # TODO: implement and return True or False
    return False


def main():
    s = sys.stdin.readline().rstrip("\n").rstrip("\r")
    print("true" if is_palindrome(s) else "false")


if __name__ == "__main__":
    main()
