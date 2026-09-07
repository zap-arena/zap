"""Unit tests for the Code War solving-behaviour analysis. No database or judge needed.

    cd api && .venv/bin/python test_analytics_engine.py
"""
from analytics_engine import (
    StageMetric,
    classify_pattern,
    compute_behavior_score,
    detect_approach,
    estimate_complexity_static,
)

PASSED: list[str] = []
FAILED: list[str] = []


def check(name: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSED.append(name)
        print(f"  PASS  {name}")
    else:
        FAILED.append(name)
        print(f"  FAIL  {name}{(' -> ' + detail) if detail else ''}")


def stage(order, *, attempts=1, solved=True, complexity=None, seconds=30.0,
          errors=(), resolved=0, rewrite=None, runs=0, reuse=None, approach=None) -> StageMetric:
    m = StageMetric(stage_id=f"s{order}", stage_order=order)
    m.attempts = attempts
    m.runs = runs
    m.solved = solved
    m.time_to_solve_seconds = seconds
    m.errors_seen = set(errors)
    m.errors_resolved = resolved
    m.cross_stage_rewrite = rewrite
    m.code_reuse = reuse
    if approach:
        m.approach = {"label": approach, "techniques": [], "loopDepth": 2 if approach == "brute_force" else 1}
    if complexity:
        m.complexity = {"label": complexity, "confidence": "low", "empirical": None, "static": complexity}
    return m


def main() -> int:
    print("[1] Static complexity heuristic")
    cases = [
        ("no loops", "print(1)\n", "O(1)/O(log n)"),
        ("single loop", "for i in range(n):\n    print(i)\n", "O(n)"),
        ("nested loops", "for i in range(n):\n    for j in range(n):\n        print(i)\n", "O(n^2)"),
        ("triple nested", "for a in x:\n    for b in x:\n        for c in x:\n            pass\n", "O(n^2+)"),
        ("loop with dict", "d = {}\nfor i in x:\n    d[i] = 1\n", "O(n)"),
    ]
    for label, code, expected in cases:
        got = estimate_complexity_static(code, "python")
        check(f"{label} -> {expected}", got == expected, got)

    check("C-style nested braces -> O(n^2)", estimate_complexity_static(
        "int main(){ for(int i=0;i<n;i++){ for(int j=0;j<n;j++){ x++; } } }", "cpp",
    ) == "O(n^2)", estimate_complexity_static(
        "int main(){ for(int i=0;i<n;i++){ for(int j=0;j<n;j++){ x++; } } }", "cpp"))

    print("\n[2] Optimal solver is not mislabelled as struggling")
    optimal = [stage(i, attempts=1, complexity="O(n)") for i in range(1, 5)]
    expected = {f"s{i}": "O(n)" for i in range(1, 5)}
    check("all stages on target, one attempt each",
          classify_pattern(optimal, expected) == "optimal_from_start",
          classify_pattern(optimal, expected))

    print("\n[3] A single sub-optimal stage does not mean struggling")
    mostly = [stage(1, complexity="O(n)"), stage(2, complexity="O(n)"),
              stage(3, complexity="O(n)"), stage(4, complexity="O(n^2)")]
    check("3 of 4 on target, low effort",
          classify_pattern(mostly, expected) == "optimal_from_start",
          classify_pattern(mostly, expected))

    print("\n[4] Brute force first, optimised later")
    improving = [stage(1, complexity="O(n^2)"), stage(2, complexity="O(n^2)"),
                 stage(3, complexity="O(n)"), stage(4, complexity="O(n)")]
    check("first stage above target, last on target",
          classify_pattern(improving, expected) == "brute_then_optimized",
          classify_pattern(improving, expected))

    print("\n[5] High effort is what marks a struggling candidate")
    effortful = [stage(1, attempts=7, complexity="O(n)"), stage(2, attempts=8, complexity="O(n)")]
    check("many attempts per stage",
          classify_pattern(effortful, expected) == "struggling",
          classify_pattern(effortful, expected))

    unresolved = [stage(1, attempts=3, complexity="O(n)",
                        errors=("WRONG_ANSWER", "RUNTIME_ERROR", "TIME_LIMIT_EXCEEDED"), resolved=0)]
    check("errors seen but never resolved",
          classify_pattern(unresolved, expected) == "struggling",
          classify_pattern(unresolved, expected))

    print("\n[6] Consistently brute force, but effortless")
    brute = [stage(i, attempts=1, complexity="O(n^2)") for i in range(1, 5)]
    check("every stage above target",
          classify_pattern(brute, expected) == "struggling",
          classify_pattern(brute, expected))

    print("\n[7] Shortcut early then heavy rework")
    shortcut = [
        stage(1, attempts=1, complexity="O(n^2)", seconds=20.0),
        stage(2, attempts=2, complexity="O(n^2)", seconds=200.0),
        stage(3, attempts=6, complexity="O(n^2)", seconds=400.0, rewrite=0.8),
    ]
    check("fast sloppy start, reworked at the end",
          classify_pattern(shortcut, expected) == "shortcut_then_rework",
          classify_pattern(shortcut, expected))

    print("\n[8] Unattempted stages are ignored")
    partial = [stage(1, attempts=1, complexity="O(n)"), stage(2, attempts=1, complexity="O(n)"),
               stage(3, attempts=0, solved=False), stage(4, attempts=0, solved=False)]
    check("trailing untouched stages do not skew the verdict",
          classify_pattern(partial, expected) == "optimal_from_start",
          classify_pattern(partial, expected))
    check("no attempts at all -> struggling",
          classify_pattern([stage(1, attempts=0, solved=False)], expected) == "struggling")

    print("\n[9] Behaviour score ranks a clean solver above a messy one")
    clean = [stage(i, attempts=1, seconds=20.0, complexity="O(n)") for i in range(1, 5)]
    messy = [stage(i, attempts=6, seconds=400.0, complexity="O(n^2)",
                   errors=("WRONG_ANSWER",), resolved=0) for i in range(1, 5)]
    cohort = [clean, messy]
    clean_score = compute_behavior_score(clean, cohort)
    messy_score = compute_behavior_score(messy, cohort)
    check("clean solver scores higher", clean_score > messy_score, f"{clean_score} vs {messy_score}")
    check("scores stay within 0-100", all(0 <= s <= 100 for s in (clean_score, messy_score)),
          f"{clean_score}, {messy_score}")

    print("\n[10] Doing nothing must not outscore real progress")
    idle = [stage(1, attempts=1, solved=False, seconds=0.0)] + [
        stage(i, attempts=0, solved=False, seconds=0.0) for i in range(2, 5)
    ]
    partial = [stage(i, attempts=2, seconds=120.0, complexity="O(n)") for i in range(1, 4)] + [
        stage(4, attempts=1, solved=False, seconds=0.0)
    ]
    cohort2 = [idle, partial]
    idle_score = compute_behavior_score(idle, cohort2)
    partial_score = compute_behavior_score(partial, cohort2)
    check("solving 3 of 4 beats solving none", partial_score > idle_score,
          f"partial={partial_score} idle={idle_score}")

    print("\n[11] Approach detection separates brute force from data structures")
    nested_scan = """for i in range(n):
    for j in range(i):
        if a[i] == a[j]:
            print(i)
"""
    hashed = """seen = set()
for v in a:
    if v in seen:
        print(1)
    seen.add(v)
"""
    binary = """lo, hi = 0, n
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] < t:
        lo = mid + 1
    else:
        hi = mid
"""
    check("nested scan with no structure -> brute force",
          detect_approach(nested_scan, "python")["label"] == "brute_force",
          detect_approach(nested_scan, "python")["label"])
    hd = detect_approach(hashed, "python")
    check("single pass with a set -> data structure", hd["label"] == "data_structure", hd["label"])
    check("hash technique is reported", "hash-map/set" in hd["techniques"], str(hd["techniques"]))
    bd = detect_approach(binary, "python")
    check("binary search technique is reported", "binary-search" in bd["techniques"], str(bd["techniques"]))
    check("loop depth is reported", detect_approach(nested_scan, "python")["loopDepth"] == 2,
          str(detect_approach(nested_scan, "python")["loopDepth"]))

    print("\n[12] Brute force is caught even when the complexity target is met")
    # O(n) label but nested loops and no data structure: complexity alone would call this optimal.
    sneaky = [stage(i, attempts=1, complexity="O(n)", approach="brute_force") for i in range(1, 5)]
    check("approach overrides a passing complexity label",
          classify_pattern(sneaky, expected) == "struggling",
          classify_pattern(sneaky, expected))

    print("\n[13] Reusing the previous stage's solution scores above rewriting it")
    evolving = [stage(i, attempts=1, seconds=60.0, complexity="O(n)", reuse=0.9) for i in range(1, 5)]
    rewriting = [stage(i, attempts=1, seconds=60.0, complexity="O(n)", reuse=0.05) for i in range(1, 5)]
    cohort3 = [evolving, rewriting]
    evolving_score = compute_behavior_score(evolving, cohort3)
    rewriting_score = compute_behavior_score(rewriting, cohort3)
    check("incremental beats full rewrite", evolving_score > rewriting_score,
          f"evolving={evolving_score} rewriting={rewriting_score}")

    print("\n[14] Recursion detection only fires on genuine self-calls")
    helper_called_from_main = """def solve(nums):
    return len(nums)


def main():
    print(solve([1, 2, 3]))
"""
    truly_recursive = """def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
"""
    check("a helper called from main is not recursion",
          "recursion" not in detect_approach(helper_called_from_main, "python")["techniques"],
          str(detect_approach(helper_called_from_main, "python")["techniques"]))
    check("a self-calling function is recursion",
          "recursion" in detect_approach(truly_recursive, "python")["techniques"],
          str(detect_approach(truly_recursive, "python")["techniques"]))

    print(f"\n{len(PASSED)} passed, {len(FAILED)} failed")
    if FAILED:
        for name in FAILED:
            print(f"  - {name}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
