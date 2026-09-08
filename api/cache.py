"""Upstash Redis cache helper using the REST pipeline API.

Uses the Upstash Redis REST API via HTTP — no persistent TCP connection needed,
which makes it ideal for serverless/Vercel environments.

Usage:
    from cache import cache_get, cache_set, cache_delete, cache_invalidate_contest

All functions are no-ops (fail silently) when UPSTASH_REDIS_REST_URL is not set,
so the app works without Redis in local dev.
"""
import json
import os
import logging
from typing import Optional

# pyrefly: ignore [missing-import]
import httpx

logger = logging.getLogger(__name__)

_URL = os.getenv("UPSTASH_REDIS_REST_URL", "").rstrip("/")
_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")
_ENABLED = bool(_URL and _TOKEN)

# TTLs (seconds)
TTL_CONTESTS_LIST = 30
TTL_CONTEST_DETAIL = 30
TTL_LEADERBOARD = 15
TTL_PROBLEMS = 300   # 5 min
TTL_HOME = 60


def _headers() -> dict:
    return {"Authorization": f"Bearer {_TOKEN}", "Content-Type": "application/json"}


def _pipeline(commands: list) -> Optional[list]:
    """Execute a list of Redis commands in one HTTP round-trip. Returns list of results."""
    if not _ENABLED:
        return None
    try:
        resp = httpx.post(
            f"{_URL}/pipeline",
            headers=_headers(),
            content=json.dumps(commands),
            timeout=1.5,
        )
        return resp.json()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Redis pipeline error: %s", exc)
        return None


def cache_get(key: str):
    """Return parsed JSON value or None on miss/error."""
    results = _pipeline([["GET", key]])
    if not results:
        return None
    raw = results[0].get("result")
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None


def cache_set(key: str, value, ttl: int) -> None:
    """Serialise value as JSON and store with EX ttl."""
    _pipeline([["SET", key, json.dumps(value), "EX", ttl]])


def cache_delete(*keys: str) -> None:
    """Delete one or more keys in a single pipeline call."""
    if not keys:
        return
    _pipeline([["DEL", key] for key in keys])


# ── Convenience invalidation helpers ─────────────────────────────────────────

def cache_invalidate_contest(contest_id: str) -> None:
    """Blow away all cache keys related to a single contest (including per-user problem caches)."""
    # Delete known fixed keys first
    cache_delete(
        "contests:list",
        f"contest:{contest_id}",
        f"contest:{contest_id}:leaderboard",
        "public:home",
    )
    # Scan and delete per-user problem keys: contest:{id}:problems:*
    if not _ENABLED:
        return
    try:
        cursor = 0
        pattern = f"contest:{contest_id}:problems:*"
        while True:
            resp = _pipeline([["SCAN", cursor, "MATCH", pattern, "COUNT", 100]])
            if not resp:
                break
            result = resp[0].get("result", [0, []])
            cursor, keys = result[0], result[1]
            if keys:
                _pipeline([["DEL", k] for k in keys])
            if cursor == 0:
                break
    except Exception as exc:  # noqa: BLE001
        logger.warning("Redis SCAN invalidation error: %s", exc)


def cache_invalidate_problems() -> None:
    """Clear problems list cache."""
    cache_delete("problems:list")
