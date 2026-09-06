import os
import json
import random
import shutil

base_dir = "/Users/vuelancer/Downloads/zap (1)/problems/valid-parentheses-progressive"

def create_dirs():
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(os.path.join(base_dir, "boilerplate"))
    os.makedirs(os.path.join(base_dir, "testcases"))
    for i in range(1, 8):
        os.makedirs(os.path.join(base_dir, "testcases", f"stage-{i}"))

def write_problem_json():
    problem = {
        "title": "Valid Parentheses (Code War Chain)",
        "slug": "valid-parentheses-progressive",
        "difficulty": "Medium",
        "isProgressive": True,
        "inputFormat": "A single string s consisting of bracket characters.",
        "outputFormat": "A single line output as described by the current stage.",
        "constraints": "1 <= s.length <= 10^5",
        "examples": [
            {
                "input": "()[]{}",
                "output": "1",
                "explanation": "Valid parenthesis string."
            }
        ],
        "tags": ["string", "stack", "code-war"],
        "languages": ["c", "cpp", "java", "python"],
        "timeLimit": 3,
        "memoryLimit": 256,
        "maxScore": 100,
        "status": "active",
        "stages": [
            {
                "stageOrder": 1,
                "title": "Stage 1 - Count Brackets",
                "statement": "Given a string `s`, print two space-separated integers: the total number of opening brackets `(`, `[`, `{` and the total number of closing brackets `)`, `]`, `}`.",
                "expectedComplexity": "O(n)",
                "maxScore": 100,
                "testcasesDir": "stage-1"
            },
            {
                "stageOrder": 2,
                "title": "Stage 2 - Balanced Counts",
                "statement": "Print `1` if the total number of opening brackets exactly equals the total number of closing brackets, otherwise print `0`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-2"
            },
            {
                "stageOrder": 3,
                "title": "Stage 3 - Valid Parentheses (Single Type)",
                "statement": "The string will only contain `(` and `)`. Print `1` if it is a valid parenthesis sequence (properly closed and nested), otherwise print `0`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-3"
            },
            {
                "stageOrder": 4,
                "title": "Stage 4 - Valid Parentheses (All Types)",
                "statement": "The string contains all types of brackets `()[]{}`. Print `1` if it is a valid sequence, otherwise print `0`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-4"
            },
            {
                "stageOrder": 5,
                "title": "Stage 5 - Maximum Nesting Depth",
                "statement": "For a valid string of `()[]{}` brackets, print the maximum nesting depth. If the string is NOT valid, print `-1`.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-5"
            },
            {
                "stageOrder": 6,
                "title": "Stage 6 - Minimum Additions to Make Valid",
                "statement": "The string contains only `(` and `)`. Print the minimum number of parentheses that must be added to make the sequence valid.",
                "expectedComplexity": "O(n)",
                "maxScore": 150,
                "testcasesDir": "stage-6"
            },
            {
                "stageOrder": 7,
                "title": "Stage 7 - Longest Valid Parentheses Substring",
                "statement": "The string contains only `(` and `)`. Print the length of the longest contiguous valid parentheses substring.",
                "expectedComplexity": "O(n)",
                "maxScore": 200,
                "testcasesDir": "stage-7"
            }
        ]
    }
    with open(os.path.join(base_dir, "problem.json"), "w") as f:
        json.dump(problem, f, indent=2)

def write_boilerplates():
    # Python
    with open(os.path.join(base_dir, "boilerplate", "python.py"), "w") as f:
        f.write("import sys\n\ndef solve():\n    # Read input\n    # s = sys.stdin.read().strip()\n    pass\n\nif __name__ == '__main__':\n    solve()\n")
    # C
    with open(os.path.join(base_dir, "boilerplate", "c.c"), "w") as f:
        f.write("#include <stdio.h>\n#include <string.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n")
    # C++
    with open(os.path.join(base_dir, "boilerplate", "cpp.cpp"), "w") as f:
        f.write("#include <iostream>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n")
    # Java
    with open(os.path.join(base_dir, "boilerplate", "java.java"), "w") as f:
        f.write("import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n")

# -- Stage Solvers --
def solve_stage_1(s):
    op = sum(1 for c in s if c in "([{")
    cl = sum(1 for c in s if c in ")]}")
    return f"{op} {cl}"

def solve_stage_2(s):
    op = sum(1 for c in s if c in "([{")
    cl = sum(1 for c in s if c in ")]}")
    return "1" if op == cl else "0"

def solve_stage_3(s):
    bal = 0
    for c in s:
        if c == '(': bal += 1
        elif c == ')': bal -= 1
        if bal < 0: return "0"
    return "1" if bal == 0 else "0"

def solve_stage_4(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return "0"
        else:
            stack.append(char)
    return "1" if not stack else "0"

def solve_stage_5(s):
    if solve_stage_4(s) == "0":
        return "-1"
    max_depth = 0
    current_depth = 0
    for c in s:
        if c in "([{":
            current_depth += 1
            max_depth = max(max_depth, current_depth)
        elif c in ")]}":
            current_depth -= 1
    return str(max_depth)

def solve_stage_6(s):
    bal = 0
    additions = 0
    for c in s:
        if c == '(': bal += 1
        elif c == ')': bal -= 1
        if bal < 0:
            additions += 1
            bal += 1
    additions += bal
    return str(additions)

def solve_stage_7(s):
    max_len = 0
    stack = [-1]
    for i, char in enumerate(s):
        if char == '(':
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    return str(max_len)

def generate_testcases():
    import string
    
    # We will generate base strings that will be evaluated for all stages.
    # But note: Stage 3, 6, 7 only expect '(' and ')'.
    # We will split testcase generation into two sets: purely () strings, and mixed ()[]{} strings.
    
    # 1. generate () strings
    parens_strings = [
        "()",
        "()()",
        "(())",
        "(()(()))",
        ")(",
        "())(",
        "((((",
        "))))",
        "((())(()",
        ")()())",
        "(()(((()",
        "((()()()()",
        "()()((()",
        ""
    ]
    for _ in range(5):
        length = random.randint(100, 500)
        s = "".join(random.choices(['(', ')'], k=length))
        parens_strings.append(s)
        
    # generate valid parens strings
    for _ in range(5):
        s = ""
        for _ in range(50):
            s = "(" + s + ")"
        parens_strings.append(s)
        
    # 2. generate mixed strings
    mixed_strings = [
        "()[]{}",
        "([{}])",
        "([)]",
        "{[]}",
        "{[(])}",
        "[{}]",
        "(([]))",
        "{[()]}"
    ]
    for _ in range(10):
        length = random.randint(100, 500)
        s = "".join(random.choices(['(', ')', '[', ']', '{', '}'], k=length))
        mixed_strings.append(s)
        
    def write_tc(stage, tc_idx, name, inp, out, hidden=False, marks=10):
        tc_path = os.path.join(base_dir, "testcases", f"stage-{stage}", f"tc{tc_idx}.json")
        tc_data = {
            "name": name,
            "input": inp,
            "expected_output": out,
            "hidden": hidden,
            "marks": marks,
            "order": tc_idx
        }
        with open(tc_path, "w") as f:
            json.dump(tc_data, f, indent=2)

    solvers = {
        1: solve_stage_1,
        2: solve_stage_2,
        3: solve_stage_3,
        4: solve_stage_4,
        5: solve_stage_5,
        6: solve_stage_6,
        7: solve_stage_7,
    }
    
    for stage in range(1, 8):
        # Determine string pool for this stage
        pool = parens_strings if stage in [3, 6, 7] else parens_strings + mixed_strings
        
        tc_idx = 1
        for s in pool:
            if not s and tc_idx > 1: continue # only one empty string
            inp = s if s else " " # avoid completely empty input just in case, or leave it empty? we can leave it empty.
            if not s: inp = ""
            
            # calculate expected output
            out = solvers[stage](inp)
            hidden = tc_idx > 5
            write_tc(stage, tc_idx, f"Sample {tc_idx}", inp, out, hidden, 10)
            tc_idx += 1
            
        # Ensure we have at least 15 testcases
        while tc_idx <= 15:
            # generate random for padding
            if stage in [3, 6, 7]:
                length = random.randint(50, 1000)
                s = "".join(random.choices(['(', ')'], k=length))
            else:
                length = random.randint(50, 1000)
                s = "".join(random.choices(['(', ')', '[', ']', '{', '}'], k=length))
            out = solvers[stage](s)
            write_tc(stage, tc_idx, f"Hidden {tc_idx}", s, out, True, 10)
            tc_idx += 1


if __name__ == "__main__":
    create_dirs()
    write_problem_json()
    write_boilerplates()
    generate_testcases()
    print("Generation complete!")
