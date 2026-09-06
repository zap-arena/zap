import os
import json
import random
import shutil

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems/maximum-subarray-progressive"

def create_dirs():
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(os.path.join(base_dir, "boilerplate"))
    os.makedirs(os.path.join(base_dir, "testcases"))
    for i in range(1, 7):
        os.makedirs(os.path.join(base_dir, "testcases", f"stage-{i}"))

def write_problem_json():
    problem = {
        "title": "Maximum Subarray (Code War Chain)",
        "slug": "maximum-subarray-progressive",
        "difficulty": "Medium",
        "isProgressive": True,
        "inputFormat": "Line 1: integer n, length of array.\nLine 2: n space-separated integers.\nLine 3: integer K (length requirement or divisor).\nLine 4: integer T (target sum).",
        "outputFormat": "A single integer, the answer for the current stage.",
        "constraints": "1 <= n <= 10^5\n-10^4 <= arr[i] <= 10^4\n1 <= K <= n\n-10^9 <= T <= 10^9",
        "examples": [
            {
                "input": "9\n-2 1 -3 4 -1 2 1 -5 4\n2\n6",
                "output": "6",
                "explanation": "For Stage 1: The contiguous subarray [4,-1,2,1] has the largest sum = 6."
            }
        ],
        "tags": ["array", "dynamic-programming", "sliding-window", "prefix-sum", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 2,
        "memoryLimit": 256,
        "maxScore": 100,
        "status": "active",
        "stages": [
            {
                "stageOrder": 1,
                "title": "Stage 1 - Maximum Subarray Sum",
                "statement": "Find the contiguous subarray with the largest sum. (Kadane's Algorithm). Ignore `K` and `T`.",
                "expectedComplexity": "O(n)",
                "maxScore": 100,
                "testcasesDir": "stage-1"
            },
            {
                "stageOrder": 2,
                "title": "Stage 2 - Max Circular Subarray Sum",
                "statement": "The array wraps around (the last element connects to the first). Find the largest circular subarray sum. Ignore `K` and `T`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-2"
            },
            {
                "stageOrder": 3,
                "title": "Stage 3 - Subarray of Length Exactly K",
                "statement": "Find the maximum subarray sum of length **exactly** `K`. Ignore `T`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-3"
            },
            {
                "stageOrder": 4,
                "title": "Stage 4 - Subarray of Length At Least K",
                "statement": "Find the maximum subarray sum of length **at least** `K`. Ignore `T`.",
                "expectedComplexity": "O(n)",
                "maxScore": 200,
                "testcasesDir": "stage-4"
            },
            {
                "stageOrder": 5,
                "title": "Stage 5 - Subarray Sum Equals Target",
                "statement": "Count the number of contiguous subarrays that sum to exactly `T`. Ignore `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 200,
                "testcasesDir": "stage-5"
            },
            {
                "stageOrder": 6,
                "title": "Stage 6 - Subarray Sum Divisible by K",
                "statement": "Count the number of contiguous subarrays whose sum is divisible by `K`. Ignore `T`.",
                "expectedComplexity": "O(n)",
                "maxScore": 250,
                "testcasesDir": "stage-6"
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
def solve_stage_1(n, arr, K, T):
    cur = 0
    mx = -float('inf')
    for x in arr:
        cur = max(x, cur + x)
        mx = max(mx, cur)
    return str(mx)

def solve_stage_2(n, arr, K, T):
    def kadane(nums):
        cur, mx = 0, -float('inf')
        for x in nums:
            cur = max(x, cur + x)
            mx = max(mx, cur)
        return mx
    
    max_normal = kadane(arr)
    if max_normal < 0: return str(max_normal)
    total = sum(arr)
    min_cur = 0
    min_so_far = float('inf')
    for x in arr:
        min_cur = min(x, min_cur + x)
        min_so_far = min(min_so_far, min_cur)
    return str(max(max_normal, total - min_so_far))

def solve_stage_3(n, arr, K, T):
    if K > n: return "0"
    s = sum(arr[:K])
    mx = s
    for i in range(K, n):
        s += arr[i] - arr[i-K]
        mx = max(mx, s)
    return str(mx)

def solve_stage_4(n, arr, K, T):
    if K > n: return "0"
    s = sum(arr[:K])
    res = s
    min_pref = 0
    pref = 0
    for i in range(K, n):
        s += arr[i]
        pref += arr[i-K]
        min_pref = min(min_pref, pref)
        res = max(res, s - min_pref)
    return str(res)

def solve_stage_5(n, arr, K, T):
    from collections import defaultdict
    counts = defaultdict(int)
    counts[0] = 1
    s = 0
    ans = 0
    for x in arr:
        s += x
        ans += counts[s - T]
        counts[s] += 1
    return str(ans)

def solve_stage_6(n, arr, K, T):
    from collections import defaultdict
    counts = defaultdict(int)
    counts[0] = 1
    s = 0
    ans = 0
    for x in arr:
        s += x
        mod = s % K
        if mod < 0: mod += K
        ans += counts[mod]
        counts[mod] += 1
    return str(ans)

def generate_testcases():
    testcases = [
        # (arr, K, T)
        ([-2, 1, -3, 4, -1, 2, 1, -5, 4], 2, 6),
        ([5, -3, 5], 1, 5),
        ([3, -1, 2, -1], 2, 2),
        ([1, 1, 1, 1, 1], 2, 3),
        ([-3, -2, -1], 1, -1),
        ([4, 5, 0, -2, -3, 1], 3, 5),
    ]
    
    # Generate random test cases
    for _ in range(10):
        length = random.randint(10, 50)
        arr = [random.randint(-100, 100) for _ in range(length)]
        testcases.append((arr, random.randint(1, length), random.randint(-50, 50)))
        
    for _ in range(10):
        length = random.randint(100, 1000)
        arr = [random.randint(-1000, 1000) for _ in range(length)]
        testcases.append((arr, random.randint(1, length), random.randint(-500, 500)))

    solvers = {
        1: solve_stage_1,
        2: solve_stage_2,
        3: solve_stage_3,
        4: solve_stage_4,
        5: solve_stage_5,
        6: solve_stage_6,
    }
    
    for stage in range(1, 7):
        tc_idx = 1
        for arr, K, T in testcases:
            n = len(arr)
            inp = f"{n}\n" + " ".join(map(str, arr)) + f"\n{K}\n{T}"
            out = solvers[stage](n, arr, K, T)
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
    print("Max Subarray Generation complete!")
