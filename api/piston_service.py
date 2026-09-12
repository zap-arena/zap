from typing import Optional
import asyncio
import os
import time
from itertools import count
from typing import Any

# pyrefly: ignore [missing-import]
import httpx

FILENAMES = {"python": "main.py", "cpp": "main.cpp", "c": "main.c", "java": "Main.java"}

MAX_ATTEMPTS = 3
RETRY_BACKOFF_SECONDS = 0.75
DEFAULT_RUN_TIMEOUT_SECONDS = 50

_endpoint_cursor = count()
_client = httpx.AsyncClient()


def piston_endpoints() -> list[str]:
    raw = os.getenv("PISTON_ENDPOINTS", "")
    return [e.strip().rstrip("/") for e in raw.split(",") if e.strip()]


def auth_headers() -> dict[str, str]:
    key = os.getenv("PISTON_API_KEY")
    return {"X-API-Key": key} if key else {}


def ordered_endpoints() -> list[str]:
    endpoints = piston_endpoints()
    if not endpoints:
        return []
    start = next(_endpoint_cursor) % len(endpoints)
    return endpoints[start:] + endpoints[:start]


def result_status(result: dict[str, Any]) -> str:
    compile_result = result.get("compile") or {}
    run_result = result.get("run") or {}
    if (
        compile_result.get("code") not in (None, 0)
        or compile_result.get("stderr")
        or compile_result.get("signal")
    ):
        return "COMPILATION_ERROR"
    if run_result.get("signal") == "SIGKILL":
        return "TIME_LIMIT_EXCEEDED"
    if run_result.get("signal") or run_result.get("code") not in (None, 0):
        return "RUNTIME_ERROR"
    return "COMPLETED"


def normalize_output(value: Optional[str]) -> str:
    return (value or "").replace("\r\n", "\n").strip()


async def execute(language: str, code: str, stdin: str, time_limit: int = 50) -> dict[str, Any]:
    """Round-robin over healthy Piston endpoints with failover on error."""
    filename = FILENAMES.get(language, "main.txt")
    run_timeout_seconds = DEFAULT_RUN_TIMEOUT_SECONDS
    payload = {
        "language": language,
        "version": "*",
        "files": [{"name": filename, "content": code}],
        "stdin": stdin,
        "run_timeout": run_timeout_seconds * 1000,
        "compile_timeout": 50000,
    }

    last_error = "No Piston endpoint configured"
    started_at = time.perf_counter()
    timeout = httpx.Timeout(run_timeout_seconds + 15.0)

    # A single blip would otherwise zero an entire submission, so retry the whole ring.
    for attempt in range(MAX_ATTEMPTS):
        if attempt:
            await asyncio.sleep(RETRY_BACKOFF_SECONDS * attempt)
        for endpoint in ordered_endpoints():
            try:
                response = await _client.post(
                    f"{endpoint}/execute", 
                    json=payload,
                    headers=auth_headers(),
                    timeout=timeout
                )
                if response.status_code >= 500:
                    response.raise_for_status()
                elif not response.is_success:
                    return {
                        "ok": False,
                        "endpoint": endpoint,
                        "elapsedMs": round((time.perf_counter() - started_at) * 1000),
                        "status": "JUDGE_UNAVAILABLE",
                        "error": f"HTTP {response.status_code}: {response.text}",
                        "result": {},
                    }
                
                result = response.json()
                return {
                    "ok": True,
                    "endpoint": endpoint,
                    "elapsedMs": round((time.perf_counter() - started_at) * 1000),
                    "result": result,
                    "status": result_status(result),
                }
            except Exception as error:  # noqa: BLE001 - failover to next endpoint
                last_error = str(error)
        if not piston_endpoints():
            break

    return {
        "ok": False,
        "endpoint": "none",
        "elapsedMs": round((time.perf_counter() - started_at) * 1000),
        "status": "JUDGE_UNAVAILABLE",
        "error": last_error,
        "result": {},
    }


async def health() -> dict[str, Any]:
    endpoints = piston_endpoints()
    
    async def check_endpoint(endpoint: str) -> dict[str, Any]:
        try:
            response = await _client.get(f"{endpoint}/runtimes", headers=auth_headers(), timeout=5.0)
            return {
                "endpoint": endpoint,
                "ok": response.is_success,
                "runtimeCount": len(response.json()) if response.is_success else 0,
            }
        except Exception as error:  # noqa: BLE001
            return {"endpoint": endpoint, "ok": False, "error": str(error)}

    if not endpoints:
        return {"ok": False, "endpoints": []}

    results = await asyncio.gather(*(check_endpoint(e) for e in endpoints))
    return {"ok": any(r["ok"] for r in results), "endpoints": results}
