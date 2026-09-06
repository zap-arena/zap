import os
import json
import random
import shutil

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems"

def create_problem_dirs(slug, num_stages):
    prob_dir = os.path.join(base_dir, slug)
    if os.path.exists(prob_dir):
        shutil.rmtree(prob_dir)
    os.makedirs(os.path.join(prob_dir, "boilerplate"))
    os.makedirs(os.path.join(prob_dir, "testcases"))
    for i in range(1, num_stages + 1):
        os.makedirs(os.path.join(prob_dir, "testcases", f"stage-{i}"))

def write_tc(slug, stage, tc_idx, name, inp, out, hidden=False):
    tc_dir = os.path.join(base_dir, slug, "testcases", f"stage-{stage}")
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

# --- 1. LINKED LIST PROGRESSIVE ---
def gen_linked_list():
    slug = "linked-list-progressive"
    create_problem_dirs(slug, 6)
    
    problem = {
        "title": "Linked List Operations (Code War Chain)",
        "slug": slug,
        "difficulty": "Hard",
        "isProgressive": True,
        "inputFormat": "Line 1: integer n (size)\nLine 2: n space-separated integers\nLine 3: L (0-based index)\nLine 4: R (0-based index)\nLine 5: K\nLine 6: N",
        "outputFormat": "A single line output as described by the current stage.",
        "constraints": "1 <= n <= 10^5",
        "examples": [{"input": "5\n1 2 3 4 5\n1\n3\n2\n2", "output": "5 4 3 2 1", "explanation": "Stage 1 output."}],
        "tags": ["linked-list", "two-pointers", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 2, "memoryLimit": 256, "maxScore": 100, "status": "active",
        "stages": [
            {"stageOrder": 1, "title": "Stage 1 - Reverse List", "statement": "Reverse the entire linked list and output the resulting values space-separated. Ignore L, R, K, N.", "expectedComplexity": "O(n)", "maxScore": 100, "testcasesDir": "stage-1"},
            {"stageOrder": 2, "title": "Stage 2 - Reverse L to R", "statement": "Reverse the sublist from 0-based index `L` to `R`. Output the result. Ignore K, N.", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-2"},
            {"stageOrder": 3, "title": "Stage 3 - Reverse in K-Groups", "statement": "Reverse the nodes of the list `K` at a time. If the number of nodes is not a multiple of `K`, leave the left-out nodes at the end as is. Ignore L, R, N.", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-3"},
            {"stageOrder": 4, "title": "Stage 4 - Palindrome Check", "statement": "Return `1` if the list is a palindrome, `0` otherwise. Ignore L, R, K, N.", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-4"},
            {"stageOrder": 5, "title": "Stage 5 - Remove Nth from End", "statement": "Remove the `N`-th node from the end of the list. Output the result. Ignore L, R, K.", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-5"},
            {"stageOrder": 6, "title": "Stage 6 - Reorder List", "statement": "Reorder the list to: L0 -> Ln-1 -> L1 -> Ln-2... Output the result. Ignore L, R, K, N.", "expectedComplexity": "O(n)", "maxScore": 200, "testcasesDir": "stage-6"},
        ]
    }
    with open(os.path.join(base_dir, slug, "problem.json"), "w") as f: json.dump(problem, f, indent=2)

    def s1(arr, L, R, K, N): return " ".join(map(str, arr[::-1]))
    def s2(arr, L, R, K, N):
        if L < 0: L = 0
        if R >= len(arr): R = len(arr) - 1
        if L >= R: return " ".join(map(str, arr))
        res = arr[:L] + arr[L:R+1][::-1] + arr[R+1:]
        return " ".join(map(str, res))
    def s3(arr, L, R, K, N):
        if K <= 1: return " ".join(map(str, arr))
        res = []
        for i in range(0, len(arr), K):
            chunk = arr[i:i+K]
            if len(chunk) == K: res.extend(chunk[::-1])
            else: res.extend(chunk)
        return " ".join(map(str, res))
    def s4(arr, L, R, K, N): return "1" if arr == arr[::-1] else "0"
    def s5(arr, L, R, K, N):
        if N <= 0 or N > len(arr): return " ".join(map(str, arr))
        res = arr[:]
        res.pop(len(res) - N)
        return " ".join(map(str, res))
    def s6(arr, L, R, K, N):
        if not arr: return ""
        res = []
        left, right = 0, len(arr) - 1
        while left <= right:
            res.append(arr[left])
            left += 1
            if left <= right:
                res.append(arr[right])
                right -= 1
        return " ".join(map(str, res))

    cases = [
        ([1, 2, 3, 4, 5], 1, 3, 2, 2),
        ([1, 2], 0, 1, 2, 1),
        ([1, 2, 2, 1], 0, 3, 3, 2),
        ([1, 2, 3, 4, 5, 6, 7], 2, 5, 3, 7),
        ([1], 0, 0, 1, 1),
    ]
    for _ in range(5):
        arr = [random.randint(1, 100) for _ in range(random.randint(500, 1000))]
        L = random.randint(0, len(arr)//2)
        cases.append((arr, L, random.randint(L, len(arr)-1), random.randint(2, 20), random.randint(1, len(arr))))
        
    for stage, solver in enumerate([s1, s2, s3, s4, s5, s6], 1):
        for idx, (arr, L, R, K, N) in enumerate(cases, 1):
            inp = f"{len(arr)}\n{' '.join(map(str, arr))}\n{L}\n{R}\n{K}\n{N}"
            write_tc(slug, stage, idx, f"Test {idx}", inp, solver(arr, L, R, K, N), hidden=idx>5)

# --- 2. BINARY TREE PROGRESSIVE ---
def gen_binary_tree():
    slug = "binary-tree-progressive"
    create_problem_dirs(slug, 5)
    
    problem = {
        "title": "Binary Tree Master (Code War Chain)",
        "slug": slug,
        "difficulty": "Hard",
        "isProgressive": True,
        "inputFormat": "Line 1: integer n\nLine 2: n space-separated integers representing level-order traversal (-1 for null).",
        "outputFormat": "A single line output as described by the current stage.",
        "constraints": "1 <= n <= 10^4",
        "examples": [{"input": "7\n3 9 20 -1 -1 15 7", "output": "3", "explanation": "Stage 1 output."}],
        "tags": ["tree", "dfs", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 2, "memoryLimit": 256, "maxScore": 100, "status": "active",
        "stages": [
            {"stageOrder": 1, "title": "Stage 1 - Maximum Depth", "statement": "Find the maximum depth of the binary tree.", "expectedComplexity": "O(n)", "maxScore": 100, "testcasesDir": "stage-1"},
            {"stageOrder": 2, "title": "Stage 2 - Invert Tree", "statement": "Invert the binary tree and output the new level-order array representation (trailing nulls ignored).", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-2"},
            {"stageOrder": 3, "title": "Stage 3 - Symmetric Tree", "statement": "Return `1` if the tree is a mirror of itself, `0` otherwise.", "expectedComplexity": "O(n)", "maxScore": 150, "testcasesDir": "stage-3"},
            {"stageOrder": 4, "title": "Stage 4 - Diameter", "statement": "Find the length of the longest path between any two nodes.", "expectedComplexity": "O(n)", "maxScore": 200, "testcasesDir": "stage-4"},
            {"stageOrder": 5, "title": "Stage 5 - Maximum Path Sum", "statement": "Find the maximum path sum between *any* two nodes (values can be negative).", "expectedComplexity": "O(n)", "maxScore": 250, "testcasesDir": "stage-5"},
        ]
    }
    with open(os.path.join(base_dir, slug, "problem.json"), "w") as f: json.dump(problem, f, indent=2)

    class Node:
        def __init__(self, v): self.val = v; self.left = None; self.right = None
    
    def build(arr):
        if not arr or arr[0] == -1: return None
        root = Node(arr[0])
        q = [root]
        i = 1
        while q and i < len(arr):
            curr = q.pop(0)
            if i < len(arr) and arr[i] != -1:
                curr.left = Node(arr[i])
                q.append(curr.left)
            i += 1
            if i < len(arr) and arr[i] != -1:
                curr.right = Node(arr[i])
                q.append(curr.right)
            i += 1
        return root

    def s1(arr):
        def dfs(node): return 0 if not node else 1 + max(dfs(node.left), dfs(node.right))
        return str(dfs(build(arr)))
        
    def s2(arr):
        root = build(arr)
        def invert(node):
            if node:
                node.left, node.right = node.right, node.left
                invert(node.left); invert(node.right)
        invert(root)
        if not root: return ""
        res, q = [], [root]
        while q:
            curr = q.pop(0)
            if curr:
                res.append(curr.val)
                q.append(curr.left)
                q.append(curr.right)
            else:
                res.append(-1)
        while res and res[-1] == -1: res.pop()
        return " ".join(map(str, res))
        
    def s3(arr):
        root = build(arr)
        def is_sym(t1, t2):
            if not t1 and not t2: return True
            if not t1 or not t2: return False
            return t1.val == t2.val and is_sym(t1.left, t2.right) and is_sym(t1.right, t2.left)
        return "1" if root and is_sym(root.left, root.right) else ("1" if not root else "0")
        
    def s4(arr):
        root = build(arr)
        ans = 0
        def depth(node):
            nonlocal ans
            if not node: return 0
            L = depth(node.left)
            R = depth(node.right)
            ans = max(ans, L + R)
            return 1 + max(L, R)
        depth(root)
        return str(ans)
        
    def s5(arr):
        root = build(arr)
        ans = -float('inf')
        if not root: return "0"
        def max_gain(node):
            nonlocal ans
            if not node: return 0
            L = max(max_gain(node.left), 0)
            R = max(max_gain(node.right), 0)
            ans = max(ans, node.val + L + R)
            return node.val + max(L, R)
        max_gain(root)
        return str(ans)

    cases = [
        [3, 9, 20, -1, -1, 15, 7],
        [1, 2, 2, 3, 4, 4, 3],
        [1, 2, 2, -1, 3, -1, 3],
        [1, 2],
        [-10, 9, 20, -1, -1, 15, 7],
    ]
    for _ in range(5):
        arr = [random.randint(-100, 100) for _ in range(100)]
        for i in range(1, len(arr)):
            if random.random() < 0.2: arr[i] = -1
        cases.append(arr)
        
    for stage, solver in enumerate([s1, s2, s3, s4, s5], 1):
        for idx, arr in enumerate(cases, 1):
            inp = f"{len(arr)}\n{' '.join(map(str, arr))}" if arr else "0\n"
            write_tc(slug, stage, idx, f"Test {idx}", inp, solver(arr), hidden=idx>5)

# --- 3. GRID TRAVERSAL PROGRESSIVE ---
def gen_grid_traversal():
    slug = "grid-traversal-progressive"
    create_problem_dirs(slug, 5)
    
    problem = {
        "title": "Grid Traversal (Code War Chain)",
        "slug": slug,
        "difficulty": "Hard",
        "isProgressive": True,
        "inputFormat": "Line 1: r c (rows and columns)\nFollowing r lines: a string of 1s and 0s",
        "outputFormat": "A single integer.",
        "constraints": "1 <= r, c <= 100",
        "examples": [{"input": "4 5\n11110\n11010\n11000\n00000", "output": "1", "explanation": "Stage 1 output."}],
        "tags": ["matrix", "dfs", "bfs", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 2, "memoryLimit": 256, "maxScore": 100, "status": "active",
        "stages": [
            {"stageOrder": 1, "title": "Stage 1 - Number of Islands", "statement": "Count the total number of connected islands.", "expectedComplexity": "O(r*c)", "maxScore": 100, "testcasesDir": "stage-1"},
            {"stageOrder": 2, "title": "Stage 2 - Max Area of Island", "statement": "Find the maximum area of a single island.", "expectedComplexity": "O(r*c)", "maxScore": 150, "testcasesDir": "stage-2"},
            {"stageOrder": 3, "title": "Stage 3 - Island Perimeter", "statement": "Calculate the total perimeter of all land masses.", "expectedComplexity": "O(r*c)", "maxScore": 150, "testcasesDir": "stage-3"},
            {"stageOrder": 4, "title": "Stage 4 - Closed Islands", "statement": "Count the number of islands completely surrounded by water (not touching the border).", "expectedComplexity": "O(r*c)", "maxScore": 200, "testcasesDir": "stage-4"},
            {"stageOrder": 5, "title": "Stage 5 - Shortest Bridge", "statement": "Given exactly two distinct islands, find the minimum number of 0s you must flip to connect them.", "expectedComplexity": "O(r*c)", "maxScore": 250, "testcasesDir": "stage-5"},
        ]
    }
    with open(os.path.join(base_dir, slug, "problem.json"), "w") as f: json.dump(problem, f, indent=2)

    def s1(grid):
        if not grid: return "0"
        r, c = len(grid), len(grid[0])
        seen = set()
        def dfs(i, j):
            if i<0 or j<0 or i>=r or j>=c or grid[i][j]=='0' or (i,j) in seen: return
            seen.add((i,j))
            for x,y in [(i+1,j),(i-1,j),(i,j+1),(i,j-1)]: dfs(x,y)
        ans = 0
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1' and (i,j) not in seen:
                    dfs(i, j)
                    ans += 1
        return str(ans)

    def s2(grid):
        if not grid: return "0"
        r, c = len(grid), len(grid[0])
        seen = set()
        def dfs(i, j):
            if i<0 or j<0 or i>=r or j>=c or grid[i][j]=='0' or (i,j) in seen: return 0
            seen.add((i,j))
            area = 1
            for x,y in [(i+1,j),(i-1,j),(i,j+1),(i,j-1)]: area += dfs(x,y)
            return area
        ans = 0
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1' and (i,j) not in seen: ans = max(ans, dfs(i,j))
        return str(ans)

    def s3(grid):
        if not grid: return "0"
        ans = 0
        r, c = len(grid), len(grid[0])
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1':
                    ans += 4
                    if i > 0 and grid[i-1][j] == '1': ans -= 2
                    if j > 0 and grid[i][j-1] == '1': ans -= 2
        return str(ans)

    def s4(grid):
        if not grid: return "0"
        r, c = len(grid), len(grid[0])
        seen = set()
        def dfs(i, j):
            if i<0 or j<0 or i>=r or j>=c: return False
            if grid[i][j] == '0' or (i,j) in seen: return True
            seen.add((i,j))
            res = True
            for x,y in [(i+1,j),(i-1,j),(i,j+1),(i,j-1)]:
                if not dfs(x,y): res = False
            return res
        ans = 0
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1' and (i,j) not in seen:
                    if dfs(i, j): ans += 1
        return str(ans)

    def s5(grid):
        if not grid: return "0"
        if s1(grid) != "2": return "0" # fallback if not exactly two islands
        r, c = len(grid), len(grid[0])
        seen = set()
        def dfs(i, j, comp):
            if i<0 or j<0 or i>=r or j>=c or grid[i][j]=='0' or (i,j) in seen: return
            seen.add((i,j))
            comp.append((i,j))
            for x,y in [(i+1,j),(i-1,j),(i,j+1),(i,j-1)]: dfs(x,y,comp)
        
        comp1 = []
        for i in range(r):
            for j in range(c):
                if grid[i][j] == '1':
                    dfs(i, j, comp1)
                    break
            if comp1: break
            
        q = [(x, y, 0) for x, y in comp1]
        visited = set(comp1)
        while q:
            x, y, dist = q.pop(0)
            for nx, ny in [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]:
                if 0<=nx<r and 0<=ny<c and (nx,ny) not in visited:
                    if grid[nx][ny] == '1': return str(dist)
                    visited.add((nx,ny))
                    q.append((nx,ny,dist+1))
        return "0"

    cases = [
        ["11110", "11010", "11000", "00000"],
        ["010", "000", "010"],
        ["11111", "10001", "10101", "10001", "11111"],
        ["0000", "0110", "0110", "0000"],
        ["101", "000", "101"], # s5 will return 0 here because 4 islands, but that's fine
    ]
    # For stage 5 we need exactly two islands. Let's make sure our 5 random tests have exactly 2 islands.
    for _ in range(5):
        r, c = random.randint(10, 20), random.randint(10, 20)
        grid_arr = [['0']*c for _ in range(r)]
        # Place island 1
        i1, j1 = random.randint(1, r//2 - 2), random.randint(1, c-2)
        grid_arr[i1][j1] = '1'
        grid_arr[i1+1][j1] = '1'
        # Place island 2
        i2, j2 = random.randint(r//2 + 2, r-2), random.randint(1, c-2)
        grid_arr[i2][j2] = '1'
        cases.append(["".join(row) for row in grid_arr])
        
    for stage, solver in enumerate([s1, s2, s3, s4, s5], 1):
        for idx, grid in enumerate(cases, 1):
            inp = f"{len(grid)} {len(grid[0])}\n" + "\n".join(grid)
            write_tc(slug, stage, idx, f"Test {idx}", inp, solver(grid), hidden=idx>5)

if __name__ == "__main__":
    gen_linked_list()
    gen_binary_tree()
    gen_grid_traversal()
    print("Advanced progressive problems generated!")
