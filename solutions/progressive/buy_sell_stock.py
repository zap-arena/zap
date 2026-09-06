import os
import json
import random
import shutil

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems/buy-sell-stock-progressive"

def create_dirs():
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(os.path.join(base_dir, "boilerplate"))
    os.makedirs(os.path.join(base_dir, "testcases"))
    for i in range(1, 7):
        os.makedirs(os.path.join(base_dir, "testcases", f"stage-{i}"))

def write_problem_json():
    problem = {
        "title": "Best Time to Buy and Sell Stock (Code War Chain)",
        "slug": "buy-sell-stock-progressive",
        "difficulty": "Hard",
        "isProgressive": True,
        "inputFormat": "Line 1: integer n, the number of days.\nLine 2: n space-separated integers, the prices.\nLine 3: integer F, the transaction fee.\nLine 4: integer K, the maximum number of transactions.",
        "outputFormat": "A single integer, the maximum profit for the current stage.",
        "constraints": "1 <= n <= 10^5\n0 <= prices[i] <= 10^4\n0 <= F <= 10^4\n1 <= K <= 10^9",
        "examples": [
            {
                "input": "6\n7 1 5 3 6 4\n0\n0",
                "output": "5",
                "explanation": "Example for Stage 1: Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5."
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
                "title": "Stage 1 - Single Transaction",
                "statement": "Find the maximum profit you can achieve with **exactly one** transaction (buy once and sell once). Ignore `F` and `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 100,
                "testcasesDir": "stage-1"
            },
            {
                "stageOrder": 2,
                "title": "Stage 2 - Infinite Transactions",
                "statement": "Find the maximum profit you can achieve with **unlimited** transactions (buy and sell as many times as you want, but you must sell before you buy again). Ignore `F` and `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-2"
            },
            {
                "stageOrder": 3,
                "title": "Stage 3 - Transaction Fee",
                "statement": "Find the maximum profit with **unlimited** transactions, but you must pay a transaction fee `F` for every completed trade (buy + sell). Ignore `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-3"
            },
            {
                "stageOrder": 4,
                "title": "Stage 4 - Cooldown Period",
                "statement": "Find the maximum profit with **unlimited** transactions, but after you sell your stock, you cannot buy stock on the next day (i.e., a 1-day cooldown period). Ignore `F` and `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-4"
            },
            {
                "stageOrder": 5,
                "title": "Stage 5 - At Most 2 Transactions",
                "statement": "Find the maximum profit you can achieve with **at most two** transactions. Ignore `F` and `K`.",
                "expectedComplexity": "O(n)",
                "maxScore": 200,
                "testcasesDir": "stage-5"
            },
            {
                "stageOrder": 6,
                "title": "Stage 6 - At Most K Transactions",
                "statement": "Find the maximum profit you can achieve with **at most K** transactions. Ignore `F`.",
                "expectedComplexity": "O(n * min(n, K))",
                "maxScore": 250,
                "testcasesDir": "stage-6"
            }
        ]
    }
    with open(os.path.join(base_dir, "problem.json"), "w") as f:
        json.dump(problem, f, indent=2)

def write_boilerplates():
    with open(os.path.join(base_dir, "boilerplate", "python.py"), "w") as f:
        f.write("import sys\n\ndef solve():\n    # Read input\n    pass\n\nif __name__ == '__main__':\n    solve()\n")
    with open(os.path.join(base_dir, "boilerplate", "c.c"), "w") as f:
        f.write("#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n")
    with open(os.path.join(base_dir, "boilerplate", "cpp.cpp"), "w") as f:
        f.write("#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n")
    with open(os.path.join(base_dir, "boilerplate", "java.java"), "w") as f:
        f.write("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n")

# Solvers
def solve_stage_1(n, prices, F, K):
    if not prices: return 0
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return str(max_profit)

def solve_stage_2(n, prices, F, K):
    max_profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i-1]:
            max_profit += prices[i] - prices[i-1]
    return str(max_profit)

def solve_stage_3(n, prices, F, K):
    if not prices: return 0
    cash = 0
    hold = -prices[0]
    for i in range(1, len(prices)):
        cash = max(cash, hold + prices[i] - F)
        hold = max(hold, cash - prices[i])
    return str(cash)

def solve_stage_4(n, prices, F, K):
    if not prices: return 0
    sell = 0
    prev_sell = 0
    buy = -prices[0]
    for i in range(1, len(prices)):
        temp = sell
        sell = max(sell, buy + prices[i])
        buy = max(buy, prev_sell - prices[i])
        prev_sell = temp
    return str(sell)

def solve_stage_5(n, prices, F, K):
    if not prices: return 0
    buy1 = buy2 = float('inf')
    sell1 = sell2 = 0
    for price in prices:
        buy1 = min(buy1, price)
        sell1 = max(sell1, price - buy1)
        buy2 = min(buy2, price - sell1)
        sell2 = max(sell2, price - buy2)
    return str(sell2)

def solve_stage_6(n, prices, F, K):
    if not prices: return 0
    if K >= n // 2:
        return solve_stage_2(n, prices, F, K)
    
    dp = [[0] * n for _ in range(K + 1)]
    for i in range(1, K + 1):
        max_diff = -prices[0]
        for j in range(1, n):
            dp[i][j] = max(dp[i][j-1], prices[j] + max_diff)
            max_diff = max(max_diff, dp[i-1][j] - prices[j])
    return str(dp[K][n-1])

def generate_testcases():
    testcases = [
        # (prices, F, K)
        ([7, 1, 5, 3, 6, 4], 2, 2),
        ([1, 2, 3, 4, 5], 1, 1),
        ([7, 6, 4, 3, 1], 1, 2),
        ([3, 3, 5, 0, 0, 3, 1, 4], 1, 2),
        ([1, 2, 4, 2, 5, 7, 2, 4, 9, 0], 2, 4),
        ([], 1, 1),
        ([5], 1, 1),
    ]
    
    # Generate random test cases
    for _ in range(10):
        length = random.randint(10, 50)
        prices = [random.randint(0, 100) for _ in range(length)]
        testcases.append((prices, random.randint(0, 5), random.randint(1, 10)))
        
    for _ in range(10):
        length = random.randint(100, 1000)
        prices = [random.randint(0, 1000) for _ in range(length)]
        testcases.append((prices, random.randint(0, 10), random.randint(1, 100)))

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
        for prices, F, K in testcases:
            n = len(prices)
            inp = f"{n}\n" + " ".join(map(str, prices)) + f"\n{F}\n{K}"
            out = solvers[stage](n, prices, F, K)
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
    print("Stock Generation complete!")
