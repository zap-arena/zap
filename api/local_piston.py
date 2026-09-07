"""Minimal Piston-compatible judge for local development.

The public Piston hosts are unreachable from many networks, so this serves just enough of the
Piston v2 API (`/api/v2/runtimes`, `/api/v2/execute`) for the backend to judge submissions.

    cd api && .venv/bin/python local_piston.py            # serves http://127.0.0.1:2000/api/v2

Then point the backend at it:

    PISTON_ENDPOINTS=http://127.0.0.1:2000/api/v2

WARNING: this executes submitted code directly on your machine with no sandboxing. It binds to
127.0.0.1 and is intended for local testing only - never expose it or run it in production.
"""
import os
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path

from fastapi import FastAPI
from pydantic import BaseModel

HOST = os.getenv("LOCAL_PISTON_HOST", "127.0.0.1")
PORT = int(os.getenv("LOCAL_PISTON_PORT", "2000"))

MAX_OUTPUT_CHARS = 64_000


class FileIn(BaseModel):
    name: str = "main.txt"
    content: str = ""


class ExecuteRequest(BaseModel):
    language: str
    version: str = "*"
    files: list[FileIn] = []
    stdin: str = ""
    run_timeout: int = 5000
    compile_timeout: int = 10000


app = FastAPI(title="Local Piston (dev only)")


def _clip(text: str) -> str:
    return text if len(text) <= MAX_OUTPUT_CHARS else text[:MAX_OUTPUT_CHARS] + "\n...[truncated]"


def _empty_compile() -> dict:
    return {"code": 0, "signal": None, "stdout": "", "stderr": "", "output": ""}


def _result(compile_stage: dict, run_stage: dict) -> dict:
    return {"language": "", "version": "0.0.0", "compile": compile_stage, "run": run_stage}


def _run(cmd: list[str], stdin: str, timeout_s: float, cwd: str) -> dict:
    """Execute a command, shaping the outcome like a Piston run stage."""
    try:
        proc = subprocess.run(
            cmd, input=stdin, capture_output=True, text=True, timeout=timeout_s, cwd=cwd,
        )
    except subprocess.TimeoutExpired:
        # Piston reports a killed run via SIGKILL, which the backend maps to TIME_LIMIT_EXCEEDED.
        return {"code": None, "signal": "SIGKILL", "stdout": "", "stderr": "Execution timed out", "output": ""}
    except FileNotFoundError as exc:
        return {"code": 1, "signal": None, "stdout": "", "stderr": str(exc), "output": ""}

    stdout, stderr = _clip(proc.stdout), _clip(proc.stderr)
    signal_name = None
    code = proc.returncode
    if code is not None and code < 0:
        signal_name = f"SIG{-code}"
        code = None
    return {"code": code, "signal": signal_name, "stdout": stdout, "stderr": stderr, "output": stdout + stderr}


def _compile(cmd: list[str], timeout_s: float, cwd: str) -> dict:
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_s, cwd=cwd)
    except subprocess.TimeoutExpired:
        return {"code": 1, "signal": None, "stdout": "", "stderr": "Compilation timed out", "output": ""}
    except FileNotFoundError:
        return {
            "code": 1, "signal": None, "stdout": "",
            "stderr": f"Toolchain not installed on this machine: {cmd[0]}", "output": "",
        }
    stderr = _clip(proc.stderr)
    # Warnings on stderr would otherwise be read as a compilation error by the backend.
    return {
        "code": proc.returncode, "signal": None, "stdout": _clip(proc.stdout),
        "stderr": stderr if proc.returncode != 0 else "", "output": stderr,
    }


def _toolchain(*names: str) -> str | None:
    for name in names:
        found = shutil.which(name)
        if found:
            return found
    return None


@app.get("/api/v2/runtimes")
def runtimes() -> list[dict]:
    available = []
    if sys.executable:
        available.append({"language": "python", "version": "3.12.0", "aliases": ["py", "python3"]})
    if _toolchain("cc", "clang", "gcc"):
        available.append({"language": "c", "version": "11.0.0", "aliases": []})
    if _toolchain("c++", "clang++", "g++"):
        available.append({"language": "cpp", "version": "11.0.0", "aliases": ["c++"]})
    if _toolchain("javac") and _toolchain("java"):
        available.append({"language": "java", "version": "17.0.0", "aliases": []})
    return available


@app.post("/api/v2/execute")
def execute(payload: ExecuteRequest) -> dict:
    source = payload.files[0].content if payload.files else ""
    language = payload.language.lower()
    run_timeout = max(payload.run_timeout, 1000) / 1000
    compile_timeout = max(payload.compile_timeout, 1000) / 1000

    workdir = tempfile.mkdtemp(prefix=f"piston-{uuid.uuid4().hex[:8]}-")
    try:
        if language == "python":
            path = Path(workdir) / "main.py"
            path.write_text(source, encoding="utf-8")
            return _result(_empty_compile(), _run([sys.executable, str(path)], payload.stdin, run_timeout, workdir))

        if language in ("c", "cpp"):
            is_c = language == "c"
            src = Path(workdir) / ("main.c" if is_c else "main.cpp")
            src.write_text(source, encoding="utf-8")
            binary = Path(workdir) / "main"
            compiler = _toolchain("cc", "clang", "gcc") if is_c else _toolchain("c++", "clang++", "g++")
            if not compiler:
                return _result(
                    {**_empty_compile(), "code": 1, "stderr": f"No {language} compiler found on this machine"},
                    {"code": None, "signal": None, "stdout": "", "stderr": "", "output": ""},
                )
            std = ["-std=c11"] if is_c else ["-std=c++17"]
            compiled = _compile([compiler, *std, "-O2", str(src), "-o", str(binary)], compile_timeout, workdir)
            if compiled["code"] != 0:
                return _result(compiled, {"code": None, "signal": None, "stdout": "", "stderr": "", "output": ""})
            return _result(compiled, _run([str(binary)], payload.stdin, run_timeout, workdir))

        if language == "java":
            src = Path(workdir) / "Main.java"
            src.write_text(source, encoding="utf-8")
            if not (_toolchain("javac") and _toolchain("java")):
                return _result(
                    {**_empty_compile(), "code": 1, "stderr": "No JDK found on this machine"},
                    {"code": None, "signal": None, "stdout": "", "stderr": "", "output": ""},
                )
            compiled = _compile(["javac", str(src)], compile_timeout, workdir)
            if compiled["code"] != 0:
                return _result(compiled, {"code": None, "signal": None, "stdout": "", "stderr": "", "output": ""})
            return _result(compiled, _run(["java", "-cp", workdir, "Main"], payload.stdin, run_timeout, workdir))

        return _result(
            {**_empty_compile(), "code": 1, "stderr": f"Unsupported language: {payload.language}"},
            {"code": None, "signal": None, "stdout": "", "stderr": "", "output": ""},
        )
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


if __name__ == "__main__":
    import uvicorn

    print(f"Local Piston (dev only, no sandboxing) on http://{HOST}:{PORT}/api/v2")
    uvicorn.run(app, host=HOST, port=PORT, log_level="warning")
