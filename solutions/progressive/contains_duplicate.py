import os
import json
import random

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems/contains-duplicate-progressive"

def write_tc(stage, tc_idx, name, inp, out, hidden=False):
    tc_dir = os.path.join(base_dir, "testcases", f"stage-{stage}")
    if not os.path.exists(tc_dir):
        os.makedirs(tc_dir)
        
    tc_data = {
        "name": name,
        "input": str(inp).strip(),
        "expected_output": str(out).strip(),
        "hidden": hidden,
        "marks": 10,
        "order": tc_idx
    }
    tc_path = os.path.join(tc_dir, f"tc{tc_idx}.json")
    with open(tc_path, "w") as f:
        json.dump(tc_data, f, indent=2)

def solve_stage_1(arr):
    return "1" if len(set(arr)) < len(arr) else "0"

def solve_stage_2(arr):
    seen = set()
    for i, num in enumerate(arr):
        if num in seen:
            return str(i)
        seen.add(num)
    return "-1"

def solve_stage_3(arr):
    from collections import Counter
    c = Counter(arr)
    return str(sum(1 for k, v in c.items() if v >= 2))

def solve_stage_4(arr):
    from collections import Counter
    if not arr: return ""
    c = Counter(arr)
    mx_freq = max(c.values())
    candidates = [k for k, v in c.items() if v == mx_freq]
    return str(min(candidates))

def solve_stage_5(arr):
    from collections import Counter
    c = Counter(arr)
    dups = sorted([k for k, v in c.items() if v >= 2])
    return " ".join(map(str, dups))

def solve_stage_6(arr):
    seen = {}
    for i, num in enumerate(arr):
        if num in seen and i - seen[num] <= 3:
            return "1"
        seen[num] = i
    return "0"

def solve_stage_7(arr):
    seen = {}
    mx = 0
    l = 0
    for r, num in enumerate(arr):
        if num in seen and seen[num] >= l:
            l = seen[num] + 1
        mx = max(mx, r - l + 1)
        seen[num] = r
    return str(mx)

def generate_testcases():
    testcases = [
        [1, 2, 3, 2, 5],
        [1, 2, 3, 4, 5],
        [1, 1, 1, 1],
        [1, 2, 3, 1, 2, 3],
        [1, 2, 3, 4, 1], # dist > 3
    ]
    
    # 5 large random test cases
    for _ in range(2):
        # mostly unique
        arr = list(range(1000))
        random.shuffle(arr)
        # insert a few duplicates
        for _ in range(5):
            arr[random.randint(0, 999)] = arr[random.randint(0, 999)]
        testcases.append(arr)
        
    for _ in range(3):
        # random numbers with many duplicates
        arr = [random.randint(1, 100) for _ in range(1000)]
        testcases.append(arr)

    solvers = {
        1: solve_stage_1,
        2: solve_stage_2,
        3: solve_stage_3,
        4: solve_stage_4,
        5: solve_stage_5,
        6: solve_stage_6,
        7: solve_stage_7,
    }
    
    # Clear existing test cases to ensure exactly 10
    import shutil
    for stage in range(1, 8):
        stage_dir = os.path.join(base_dir, "testcases", f"stage-{stage}")
        if os.path.exists(stage_dir):
            shutil.rmtree(stage_dir)
            
    for stage in range(1, 8):
        tc_idx = 1
        for arr in testcases:
            inp = f"{len(arr)}\n{' '.join(map(str, arr))}" if arr else "0\n"
            out = solvers[stage](arr)
            hidden = tc_idx > 5
            write_tc(stage, tc_idx, f"Sample {tc_idx}" if not hidden else f"Hidden {tc_idx}", inp, out, hidden)
            tc_idx += 1

if __name__ == "__main__":
    generate_testcases()
    print("Generated 10 robust testcases for all stages of contains-duplicate-progressive!")
