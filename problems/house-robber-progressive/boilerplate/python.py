import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    
    n = int(input_data[0])
    arr = [int(x) for x in input_data[1:n+1]]
    K = int(input_data[n+1]) if len(input_data) > n+1 else 0
    
    # TODO: Write your solution for Stage 1 here
    # Find the maximum amount of money you can rob (no adjacent houses).
    
    print("0")

if __name__ == '__main__':
    solve()
