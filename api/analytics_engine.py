"""Solving-behavior analytics for progressive ("Code War") chain problems.

Classifies HOW a student solved a chain (optimal from the start, brute force
then optimized, took a shortcut early then had to rework, or struggled
throughout) from signals already captured by submissions + activity logs,
plus a complexity estimate for the accepted solution at each stage.

This is a first-pass rule-based heuristic (not ML) — thresholds below are
named constants so they can be tuned once real usage data is available.
"""
from __future__ import annotations

import difflib
import math
import re
from dataclasses import dataclass, field
from typing import Literal, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

import models
from piston_service import execute, normalize_output

ComplexityLabel = Literal["O(1)/O(log n)", "O(n)", "O(n log n)", "O(n^2)", "O(n^2+)"]

# --- classification thresholds (tune after real cohort data is collected) ---
HIGH_ATTEMPTS_THRESHOLD = 5          # attempts on a single stage considered "a lot of struggle"
LOW_ATTEMPTS_THRESHOLD = 2           # attempts at/under this on the FIRST stage looks like a quick/shortcut solve
FAST_SOLVE_SECONDS = 90              # solving a stage within this looks rushed/copied
HIGH_CHURN_RATIO = 0.55              # normalized edit distance between first/final code in a stage
HIGH_REWRITE_RATIO = 0.6             # normalized edit distance between consecutive-stage accepted code

COMPLEXITY_ORDER: dict[str, int] = {
    "O(1)/O(log n)": 0, "O(n)": 1, "O(n log n)": 2, "O(n^2)": 3, "O(n^2+)": 4,
}


@dataclass
class StageMetric:
    stage_id: str
    stage_order: int
    attempts: int = 0
    runs: int = 0
    errors_seen: set[str] = field(default_factory=set)
    errors_resolved: int = 0
    time_to_solve_seconds: Optional[float] = None
    code_churn: float = 0.0
    cross_stage_rewrite: Optional[float] = None
    complexity: Optional[dict] = None
    solved: bool = False


def _code_similarity(a: str, b: str) -> float:
    """1.0 = identical, 0.0 = completely different (difflib ratio, stdlib only)."""
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


# ---------------------------------------------------------------- complexity
def estimate_complexity_static(code: str, language: str) -> ComplexityLabel:
    """Language-agnostic regex heuristic: nested-loop depth + hash-structure usage."""
    lines = code.splitlines()
    loop_re = re.compile(r"\b(for|while)\b")
    max_depth = 0

    # Depth via indentation for python, brace-depth heuristic otherwise.
    if language == "python":
        depth_stack: list[int] = []
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            indent = len(line) - len(line.lstrip(" "))
            while depth_stack and indent <= depth_stack[-1]:
                depth_stack.pop()
            if loop_re.search(stripped):
                depth_stack.append(indent)
                max_depth = max(max_depth, len(depth_stack))
    else:
        depth = 0
        pending_loop_braces: list[int] = []
        for line in lines:
            for match in re.finditer(r"[{}]|\b(for|while)\b", line):
                token = match.group(0)
                if token in ("for", "while"):
                    pending_loop_braces.append(depth + 1)
                elif token == "{":
                    depth += 1
                    if pending_loop_braces and pending_loop_braces[-1] == depth:
                        max_depth = max(max_depth, len(pending_loop_braces))
                elif token == "}":
                    if pending_loop_braces and pending_loop_braces[-1] >= depth:
                        pending_loop_braces.pop()
                    depth = max(depth - 1, 0)

    has_hash = bool(re.search(r"\bdict\(|\{\}|HashMap|HashSet|unordered_map|unordered_set|\bset\(", code))
    has_recursion = bool(re.search(r"def\s+(\w+)\s*\([^)]*\):[\s\S]*?\b\1\s*\(", code)) or bool(
        re.search(r"\b(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\b\1\s*\(", code)
    )

    if max_depth >= 3:
        return "O(n^2+)"
    if max_depth == 2:
        return "O(n^2)"
    if max_depth == 1:
        return "O(n)" if has_hash or not has_recursion else "O(n log n)"
    if has_recursion:
        return "O(n log n)"
    return "O(1)/O(log n)"


async def estimate_complexity_empirical(
    stage: models.ProblemStage, language: str, code: str
) -> Optional[ComplexityLabel]:
    """Runs the accepted code against small/medium/large perf-tier cases and fits a growth curve."""
    tiers = {"small": None, "medium": None, "large": None}
    size_hint = {"small": 1, "medium": 2, "large": 3}  # relative input-size proxy when not encoded in the case name
    for tc in stage.test_cases:
        if tc.perf_tier in tiers:
            tiers[tc.perf_tier] = tc

    points: list[tuple[float, float]] = []
    for tier, tc in tiers.items():
        if not tc:
            continue
        execution = await execute(language, code, tc.input, stage.time_limit or 5)
        result = execution.get("result") or {}
        run_result = result.get("run") or {}
        if execution["status"] != "COMPLETED":
            continue
        if normalize_output(run_result.get("stdout") or run_result.get("output")) != normalize_output(tc.expected_output):
            continue
        n = len(tc.input) or size_hint[tier]
        t = max(execution["elapsedMs"], 1)
        points.append((math.log(n), math.log(t)))

    if len(points) < 2:
        return None

    # Simple least-squares slope of log(time) vs log(n).
    mean_x = sum(p[0] for p in points) / len(points)
    mean_y = sum(p[1] for p in points) / len(points)
    denom = sum((p[0] - mean_x) ** 2 for p in points)
    if denom == 0:
        return None
    slope = sum((p[0] - mean_x) * (p[1] - mean_y) for p in points) / denom

    if slope < 0.3:
        return "O(1)/O(log n)"
    if slope < 1.2:
        return "O(n)"
    if slope < 1.7:
        return "O(n log n)"
    if slope < 2.5:
        return "O(n^2)"
    return "O(n^2+)"


async def estimate_complexity(stage: models.ProblemStage, language: str, code: str) -> dict:
    static_label = estimate_complexity_static(code, language)
    empirical_label = await estimate_complexity_empirical(stage, language, code)
    label = empirical_label or static_label
    confidence = "high" if empirical_label and empirical_label == static_label else "low"
    return {"label": label, "confidence": confidence, "empirical": empirical_label, "static": static_label}


# ------------------------------------------------------------------ metrics
def compute_stage_metrics(db: Session, contest_id: str, user_id: str, problem_id: str) -> list[StageMetric]:
    stages = db.scalars(
        select(models.ProblemStage).where(models.ProblemStage.problem_id == problem_id)
        .order_by(models.ProblemStage.stage_order)
    ).all()

    activity = db.scalars(select(models.ContestActivityLog).where(
        models.ContestActivityLog.contest_id == contest_id, models.ContestActivityLog.user_id == user_id,
        models.ContestActivityLog.problem_id == problem_id,
    ).order_by(models.ContestActivityLog.created_at)).all()
    unlock_times = {
        a.event_metadata.get("newStageOrder"): a.created_at
        for a in activity if a.event_type == "STAGE_UNLOCKED"
    }

    metrics: list[StageMetric] = []
    prev_accepted_code: Optional[str] = None
    for stage in stages:
        subs = db.scalars(select(models.Submission).where(
            models.Submission.contest_id == contest_id, models.Submission.user_id == user_id,
            models.Submission.problem_id == problem_id, models.Submission.stage_id == stage.id,
        ).order_by(models.Submission.submitted_at)).all()

        m = StageMetric(stage_id=stage.id, stage_order=stage.stage_order)
        m.attempts = len(subs)
        m.runs = sum(
            1 for a in activity
            if a.event_type == "CODE_RUN" and a.event_metadata.get("stageId") == stage.id
        )

        seen_errors: set[str] = set()
        accepted = None
        for s in subs:
            if s.status != "ACCEPTED":
                seen_errors.add(s.status)
            elif accepted is None:
                accepted = s
                m.errors_resolved = len(seen_errors)

        m.errors_seen = seen_errors
        m.solved = accepted is not None

        unlock_at = unlock_times.get(stage.stage_order)
        if accepted and unlock_at:
            m.time_to_solve_seconds = (accepted.submitted_at - unlock_at).total_seconds()
        elif accepted and stage.stage_order == 1:
            # First stage has no unlock event; approximate with the first submission's timestamp.
            m.time_to_solve_seconds = (accepted.submitted_at - subs[0].submitted_at).total_seconds() or None

        if subs and accepted:
            m.code_churn = 1 - _code_similarity(subs[0].source_code, accepted.source_code)
        if prev_accepted_code and subs:
            m.cross_stage_rewrite = 1 - _code_similarity(prev_accepted_code, subs[0].source_code)
        if accepted:
            prev_accepted_code = accepted.source_code

        metrics.append(m)

    return metrics


def attach_complexity(metrics: list[StageMetric], complexities: dict[str, dict]) -> None:
    """Attach precomputed {stage_id: complexity_dict} results (from estimate_complexity) onto metrics."""
    for m in metrics:
        m.complexity = complexities.get(m.stage_id)


# -------------------------------------------------------------- classification
Pattern = Literal["optimal_from_start", "brute_then_optimized", "shortcut_then_rework", "struggling"]


def classify_pattern(metrics: list[StageMetric], expected_complexities: dict[str, Optional[str]]) -> Pattern:
    if not metrics:
        return "struggling"

    def rank(label: Optional[str]) -> int:
        return COMPLEXITY_ORDER.get(label or "", 2)

    def expected_rank(stage_id: str) -> int:
        return COMPLEXITY_ORDER.get(expected_complexities.get(stage_id) or "", 2)

    above_expected = [
        rank((m.complexity or {}).get("label")) > expected_rank(m.stage_id) for m in metrics if m.complexity
    ]
    total_attempts = sum(m.attempts for m in metrics)
    early = metrics[0]
    late = metrics[-1]

    improving = len(above_expected) >= 2 and above_expected[0] and not above_expected[-1]
    shortcut_early = (
        early.attempts <= LOW_ATTEMPTS_THRESHOLD
        and (early.time_to_solve_seconds or 0) <= FAST_SOLVE_SECONDS
        and (early.complexity or {}).get("label") not in (None, "O(1)/O(log n)", "O(n)")
    )
    reworked_late = (late.attempts >= HIGH_ATTEMPTS_THRESHOLD) or (late.cross_stage_rewrite or 0) >= HIGH_REWRITE_RATIO

    if shortcut_early and reworked_late:
        return "shortcut_then_rework"
    if improving:
        return "brute_then_optimized"
    if any(above_expected) or total_attempts >= HIGH_ATTEMPTS_THRESHOLD * len(metrics):
        return "struggling"
    return "optimal_from_start"


def compute_behavior_score(metrics: list[StageMetric], cohort: list[list[StageMetric]]) -> int:
    """0-100, cohort-normalized (min-max within the contest); higher = cleaner/more efficient solving."""
    def total_attempts(ms: list[StageMetric]) -> int:
        return sum(m.attempts for m in ms)

    def total_time(ms: list[StageMetric]) -> float:
        return sum(m.time_to_solve_seconds or 0 for m in ms)

    def unresolved_error_ratio(ms: list[StageMetric]) -> float:
        seen = sum(len(m.errors_seen) for m in ms)
        resolved = sum(m.errors_resolved for m in ms)
        return 1 - (resolved / seen) if seen else 0.0

    def optimal_ratio(ms: list[StageMetric]) -> float:
        labeled = [m for m in ms if m.complexity]
        if not labeled:
            return 0.5
        return sum(1 for m in labeled if COMPLEXITY_ORDER.get(m.complexity["label"], 2) <= 1) / len(labeled)

    def rewrite_ratio(ms: list[StageMetric]) -> float:
        vals = [m.cross_stage_rewrite for m in ms if m.cross_stage_rewrite is not None]
        return sum(vals) / len(vals) if vals else 0.0

    def normalize(value: float, all_values: list[float]) -> float:
        lo, hi = min(all_values), max(all_values)
        if hi - lo < 1e-9:
            return 0.5
        return (value - lo) / (hi - lo)

    cohort_attempts = [total_attempts(c) for c in cohort] or [total_attempts(metrics)]
    cohort_time = [total_time(c) for c in cohort] or [total_time(metrics)]

    w_attempts, w_time, w_errors, w_optimal, w_rewrite = 25, 20, 20, 25, 10
    score = 100.0
    score -= w_attempts * normalize(total_attempts(metrics), cohort_attempts)
    score -= w_time * normalize(total_time(metrics), cohort_time)
    score -= w_errors * unresolved_error_ratio(metrics)
    score += w_optimal * optimal_ratio(metrics) - w_optimal * 0.5  # centered: no bonus/penalty at 50% optimal
    score -= w_rewrite * rewrite_ratio(metrics)
    return max(0, min(100, round(score)))
