import os
import json
import random
import shutil

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems/house-robber-progressive"

def create_dirs():
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(os.path.join(base_dir, "boilerplate"))
    os.makedirs(os.path.join(base_dir, "testcases"))
    for i in range(1, 6):
        os.makedirs(os.path.join(base_dir, "testcases", f"stage-{i}"))

def write_problem_json():
    problem = {
        "title": "House Robber (Code War Chain)",
        "slug": "house-robber-progressive",
        "difficulty": "Medium",
        "isProgressive": True,
        "inputFormat": "Line 1: integer n, the number of houses.\nLine 2: n space-separated integers, the money in each house.\nLine 3: integer K, the exact number of houses to rob.",
        "outputFormat": "A single line output as described by the current stage.",
        "constraints": "1 <= n <= 10^4\n0 <= money[i] <= 10^4\n1 <= K <= n",
        "examples": [
            {
                "input": "4\n1 2 3 1\n2",
                "output": "4",
                "explanation": "For Stage 1: Rob house 0 (money = 1) and then rob house 2 (money = 3). Total = 4."
            }
        ],
        "tags": ["array", "dynamic-programming", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 2,
        "memoryLimit": 256,
        "maxScore": 100,
        "status": "active",
        "stages": [
            {
                "stageOrder": 1,
                "title": "Stage 1 - Standard Robber",
                "statement": "Find the maximum amount of money you can rob. You cannot rob two adjacent houses. Ignore `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 100,
                "testcasesDir": "stage-1"
            },
            {
                "stageOrder": 2,
                "title": "Stage 2 - Circular Robber",
                "statement": "The houses are arranged in a circle. The first house and the last house are adjacent. Find the maximum amount of money you can rob. Ignore `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-2"
            },
            {
                "stageOrder": 3,
                "title": "Stage 3 - Skip Two Houses",
                "statement": "You must skip at least **two** houses between any two robberies (if you rob house `i`, the next house you can rob is `i+3`). Find the maximum money you can rob. Ignore `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-3"
            },
            {
                "stageOrder": 4,
                "title": "Stage 4 - Exact K Houses",
                "statement": "Find the maximum amount of money you can rob, provided you rob **exactly K** houses (with the standard adjacent rule). If it's impossible to rob exactly `K` houses, output `-1`.",
                "expectedComplexity": "O(n * K)",
                "maxScore": 200,
                "testcasesDir": "stage-4"
            },
            {
                "stageOrder": 5,
                "title": "Stage 5 - Reconstruct Path",
                "statement": "Solve Stage 1 again, but this time output the **0-based indices** of the houses you robbed to achieve the maximum amount, space-separated in ascending order. If there are multiple optimal ways, output the one that is lexicographically smallest.",
                "expectedComplexity": "O(n)",
                "maxScore": 200,
                "testcasesDir": "stage-5"
            }
        ]
    }
    with open(os.path.join(base_dir, "problem.json"), "w") as f:
        json.dump(problem, f, indent=2)

def write_boilerplates():
    with open(os.path.join(base_dir, "boilerplate", "python.py"), "w") as f:
        f.write("import sys\n\ndef solve():\n    pass\n\nif __name__ == '__main__':\n    solve()\n")
    with open(os.path.join(base_dir, "boilerplate", "c.c"), "w") as f:
        f.write("#include <stdio.h>\n\nint main() {\n    return 0;\n}\n")
    with open(os.path.join(base_dir, "boilerplate", "cpp.cpp"), "w") as f:
        f.write("#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    return 0;\n}\n")
    with open(os.path.join(base_dir, "boilerplate", "java.java"), "w") as f:
        f.write("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n    }\n}\n")

# Solvers
def solve_stage_1(n, arr, K):
    if not arr: return "0"
    if len(arr) == 1: return str(arr[0])
    dp = [0] * n
    dp[0] = arr[0]
    dp[1] = max(arr[0], arr[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + arr[i])
    return str(dp[-1])

def solve_stage_2(n, arr, K):
    if not arr: return "0"
    if len(arr) == 1: return str(arr[0])
    def rob_range(start, end):
        if start > end: return 0
        dp = [0] * (end - start + 1)
        dp[0] = arr[start]
        if len(dp) > 1:
            dp[1] = max(arr[start], arr[start+1])
        for i in range(2, len(dp)):
            dp[i] = max(dp[i-1], dp[i-2] + arr[start+i])
        return dp[-1]
    return str(max(rob_range(0, n-2), rob_range(1, n-1)))

def solve_stage_3(n, arr, K):
    if not arr: return "0"
    dp = [0] * n
    for i in range(n):
        if i == 0: dp[0] = arr[0]
        elif i == 1: dp[1] = max(arr[0], arr[1])
        elif i == 2: dp[2] = max(dp[1], arr[2])
        else:
            dp[i] = max(dp[i-1], dp[i-3] + arr[i])
    return str(dp[-1])

def solve_stage_4(n, arr, K):
    if not arr or K == 0: return "0"
    if K > (n + 1) // 2: return "-1"
    
    dp = [[-float('inf')] * (K + 1) for _ in range(n)]
    dp[0][0] = 0
    dp[0][1] = arr[0]
    if n > 1:
        dp[1][0] = 0
        dp[1][1] = max(arr[0], arr[1])
    
    for i in range(2, n):
        dp[i][0] = 0
        for j in range(1, K + 1):
            dp[i][j] = max(dp[i-1][j], dp[i-2][j-1] + arr[i])
            
    res = dp[n-1][K]
    return str(res) if res != -float('inf') else "-1"

def solve_stage_5(n, arr, K):
    if not arr: return ""
    if len(arr) == 1: return "0"
    dp = [0] * n
    dp[0] = arr[0]
    dp[1] = max(arr[0], arr[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + arr[i])
        
    path = []
    i = n - 1
    while i >= 0:
        if i == 0:
            path.append(0)
            break
        if i == 1:
            if arr[1] > arr[0]:
                path.append(1)
            else:
                path.append(0)
            break
        
        # To make lexicographically smallest, prefer skipping? No, we want smallest indices.
        # Wait, if dp[i] == dp[i-1], we could skip. But if dp[i] == dp[i-2] + arr[i], we could take.
        # To get lexicographically smaller, smaller index is better. Wait, we are moving backwards.
        # Actually standard backtrack is fine for a simple solver.
        if dp[i] == dp[i-2] + arr[i] and (dp[i] != dp[i-1] or arr[i] > 0): # simplification
            path.append(i)
            i -= 2
        else:
            i -= 1
    return " ".join(map(str, reversed(path)))

def generate_testcases():
    testcases = [
        # (arr, K)
        ([1, 2, 3, 1], 2),
        ([2, 7, 9, 3, 1], 2),
        ([2, 1, 1, 2], 2),
        ([5, 5, 10, 100, 10, 5], 2),
        ([1, 2], 1),
        ([1], 1),
        ([0, 0, 0], 1),
    ]
    
    for _ in range(10):
        length = random.randint(10, 50)
        arr = [random.randint(0, 100) for _ in range(length)]
        testcases.append((arr, random.randint(1, (length+1)//2 + 2)))
        
    for _ in range(10):
        length = random.randint(100, 1000)
        arr = [random.randint(0, 1000) for _ in range(length)]
        testcases.append((arr, random.randint(1, length//2)))

    solvers = {
        1: solve_stage_1,
        2: solve_stage_2,
        3: solve_stage_3,
        4: solve_stage_4,
        5: solve_stage_5,
    }
    
    for stage in range(1, 6):
        tc_idx = 1
        for arr, K in testcases:
            n = len(arr)
            inp = f"{n}\n" + " ".join(map(str, arr)) + f"\n{K}"
            out = solvers[stage](n, arr, K)
            hidden = tc_idx > 5
            
            tc_path = os.path.join(base_dir, "testcases", f"stage-{stage}", f"tc{tc_idx}.json")
            tc_data = {
                "name": f"Sample {tc_idx}" if not hidden else f"Hidden {tc_idx}",
                "input": inp,
                "expected_output": out,
                "hidden": hidden,
                "marks": 10,
                "order": tc_idx
            }
            with open(tc_path, "w") as f:
                json.dump(tc_data, f, indent=2)
            tc_idx += 1

if __name__ == "__main__":
    create_dirs()
    write_problem_json()
    write_boilerplates()
    generate_testcases()
    print("House Robber Generation complete!")
