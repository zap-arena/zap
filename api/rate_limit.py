"""Request rate limiting.

Uses PostgreSQL as the shared counter store so the limit holds across serverless
instances, which an in-process dict cannot do. Falls back to an in-memory limiter
when no database is configured (local dev without DATABASE_URL).
"""

import hashlib
import os
import random
import time
from collections import defaultdict, deque

from sqlalchemy import text

from database import engine


def _int_env(name: str, default: int) -> int:
    try:
        return max(1, int(os.getenv(name, default)))
    except ValueError:
        return default


WINDOW_SECONDS = _int_env("RATE_LIMIT_WINDOW_SECONDS", 10)
MAX_REQUESTS = _int_env("RATE_LIMIT_REQUESTS", 20)

# Chance of sweeping expired rows on any given request, so the table stays bounded
# without needing a scheduled job.
_CLEANUP_PROBABILITY = 0.01

_memory_buckets: dict[str, deque] = defaultdict(deque)


class RateLimitResult:
    __slots__ = ("allowed", "retry_after")

    def __init__(self, allowed: bool, retry_after: int = 0):
        self.allowed = allowed
        self.retry_after = retry_after


def bucket_key(identity: str, scope: str) -> str:
    """Hash the identity so raw tokens are never stored or logged."""
    digest = hashlib.sha256(f"{scope}:{identity}".encode()).hexdigest()[:40]
    window_start = int(time.time()) // WINDOW_SECONDS
    return f"{digest}:{window_start}"


def _check_memory(key: str) -> RateLimitResult:
    now = time.monotonic()
    bucket = _memory_buckets[key]
    while bucket and now - bucket[0] > WINDOW_SECONDS:
        bucket.popleft()
    if not bucket:
        # Drop empty buckets so the dict cannot grow without bound.
        _memory_buckets.pop(key, None)
        bucket = _memory_buckets[key]
    if len(bucket) >= MAX_REQUESTS:
        return RateLimitResult(False, retry_after=int(WINDOW_SECONDS - (now - bucket[0])) + 1)
    bucket.append(now)
    return RateLimitResult(True)


def _check_database(key: str) -> RateLimitResult:
    seconds_into_window = int(time.time()) % WINDOW_SECONDS
    retry_after = WINDOW_SECONDS - seconds_into_window

    with engine.begin() as conn:
        # Atomic increment: concurrent instances cannot both read a stale count.
        count = conn.execute(
            text("""
                INSERT INTO rate_limits (bucket, hits, expires_at)
                VALUES (:bucket, 1, now() + make_interval(secs => :ttl))
                ON CONFLICT (bucket) DO UPDATE SET hits = rate_limits.hits + 1
                RETURNING hits
            """),
            {"bucket": key, "ttl": WINDOW_SECONDS * 2},
        ).scalar_one()

        if random.random() < _CLEANUP_PROBABILITY:
            conn.execute(text("DELETE FROM rate_limits WHERE expires_at < now()"))

    if count > MAX_REQUESTS:
        return RateLimitResult(False, retry_after=retry_after)
    return RateLimitResult(True)


def check(identity: str, scope: str) -> RateLimitResult:
    """Count one request against the limit and report whether it is allowed."""
    key = bucket_key(identity, scope)
    if engine is None:
        return _check_memory(key)
    try:
        return _check_database(key)
    except Exception:  # noqa: BLE001 - never block traffic because the store is down
        return _check_memory(key)
