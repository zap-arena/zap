from typing import Union
import io
import json
import re
import zipfile

# Limits guard against zip bombs and oversized uploads.
MAX_ZIP_BYTES = 20 * 1024 * 1024
MAX_TOTAL_UNCOMPRESSED_BYTES = 100 * 1024 * 1024
MAX_ENTRIES = 5000
MAX_FILE_BYTES = 5 * 1024 * 1024

LANGUAGES = ("c", "cpp", "java", "python")
LANGUAGE_BY_STEM = {"c": "c", "cpp": "cpp", "java": "java", "python": "python", "py": "python"}
LANGUAGE_BY_EXT = {".c": "c", ".cpp": "cpp", ".cc": "cpp", ".cxx": "cpp", ".java": "java", ".py": "python"}
DIFFICULTIES = ("Easy", "Medium", "Hard")


class ImportError_(Exception):
    """Raised when the uploaded archive cannot be read at all."""


def _pick(data: dict, *keys, default=None):
    for key in keys:
        if key in data and data[key] is not None:
            return data[key]
    return default


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", (value or "").lower()).strip("-")


def _natural_key(name: str):
    return [int(part) if part.isdigit() else part for part in re.split(r"(\d+)", name)]


def _safe_entries(zf: zipfile.ZipFile) -> list[zipfile.ZipInfo]:
    entries = [i for i in zf.infolist() if not i.is_dir()]
    if len(entries) > MAX_ENTRIES:
        raise ImportError_(f"Archive contains too many files (limit {MAX_ENTRIES})")

    total = 0
    safe: list[zipfile.ZipInfo] = []
    for info in entries:
        name = info.filename.replace("\\", "/")
        # Reject absolute paths and traversal segments (zip-slip).
        if name.startswith("/") or re.match(r"^[a-zA-Z]:", name) or ".." in name.split("/"):
            raise ImportError_(f"Unsafe path in archive: {info.filename}")
        if name.startswith("__MACOSX/") or name.split("/")[-1].startswith("."):
            continue
        if info.file_size > MAX_FILE_BYTES:
            raise ImportError_(f"File too large in archive: {name}")
        total += info.file_size
        if total > MAX_TOTAL_UNCOMPRESSED_BYTES:
            raise ImportError_("Archive expands beyond the allowed size limit")
        info.filename = name
        safe.append(info)
    return safe


def _strip_common_root(entries: list[zipfile.ZipInfo]) -> dict[str, Union[bytes, zipfile.ZipInfo]]:
    """Drop a single wrapping folder so both problems.zip layouts work."""
    roots = {e.filename.split("/")[0] for e in entries}
    if len(roots) != 1:
        return {e.filename: e for e in entries}
    root = roots.pop()
    if any(e.filename == f"{root}/problem.json" for e in entries):
        return {e.filename: e for e in entries}
    return {e.filename[len(root) + 1:]: e for e in entries if len(e.filename) > len(root) + 1}


def _read_text(zf: zipfile.ZipFile, info: zipfile.ZipInfo) -> str:
    return zf.read(info).decode("utf-8-sig", errors="replace")


def _parse_test_case(raw: dict, index: int) -> dict:
    return {
        "name": str(_pick(raw, "name", default=f"Test case {index}")),
        "input": str(_pick(raw, "input", default="")),
        "expectedOutput": str(_pick(raw, "expected_output", "expectedOutput", "output", default="")),
        "hidden": bool(_pick(raw, "hidden", default=False)),
        "marks": int(_pick(raw, "marks", "score", default=0) or 0),
        "order": int(_pick(raw, "order", default=index) or index),
        "perfTier": (_pick(raw, "perf_tier", "perfTier", default=None) or None),
    }


def _parse_test_cases_at(zf: zipfile.ZipFile, files: dict, prefix: str, errors: list[str]) -> list[dict]:
    test_cases: list[dict] = []
    names = sorted(
        (n for n in files if n.startswith(prefix) and n.lower().endswith(".json") and "/" not in n[len(prefix):]),
        key=_natural_key,
    )
    for index, name in enumerate(names, start=1):
        try:
            raw = json.loads(_read_text(zf, files[name]))
            if not isinstance(raw, dict):
                raise ValueError("must contain a JSON object")
            test_cases.append(_parse_test_case(raw, index))
        except ValueError as exc:
            errors.append(f"{name.split('/')[-1]} is invalid: {exc}")
    test_cases.sort(key=lambda tc: tc["order"])
    return test_cases


def _parse_stage(meta: dict, index: int, zf: zipfile.ZipFile, folder: str, files: dict, errors: list[str]) -> dict:
    stage_order = int(_pick(meta, "stageOrder", "stage_order", default=index) or index)
    testcases_dir = str(_pick(meta, "testcasesDir", "testcases_dir", default=f"stage-{stage_order}"))
    prefix = f"{folder}/testcases/{testcases_dir}/"
    test_cases = _parse_test_cases_at(zf, files, prefix, errors)
    if not test_cases:
        errors.append(f"Stage {stage_order} has no test cases under testcases/{testcases_dir}/")
    return {
        "stageOrder": stage_order,
        "title": str(_pick(meta, "title", default=f"Stage {stage_order}")),
        "statement": str(_pick(meta, "statement", default="")),
        "expectedComplexity": _pick(meta, "expectedComplexity", "expected_complexity", default=None),
        "timeLimit": _pick(meta, "timeLimit", "time_limit", default=None),
        "memoryLimit": _pick(meta, "memoryLimit", "memory_limit", default=None),
        "maxScore": int(_pick(meta, "maxScore", "max_score", default=100) or 100),
        "testCases": test_cases,
    }


def _parse_problem(zf: zipfile.ZipFile, folder: str, files: dict[str, zipfile.ZipInfo]) -> dict:
    errors: list[str] = []

    try:
        meta = json.loads(_read_text(zf, files[f"{folder}/problem.json"]))
        if not isinstance(meta, dict):
            raise ValueError("problem.json must contain a JSON object")
    except (KeyError, ValueError) as exc:
        meta = {}
        errors.append(f"problem.json could not be read: {exc}")

    title = str(_pick(meta, "title", default="")).strip() or folder.replace("-", " ").title()
    slug = slugify(str(_pick(meta, "slug", default="")) or folder)
    difficulty = str(_pick(meta, "difficulty", default="Easy"))
    if difficulty not in DIFFICULTIES:
        errors.append(f"difficulty must be one of {', '.join(DIFFICULTIES)}")
        difficulty = "Easy"

    statement_key = f"{folder}/statement.md"
    description = _read_text(zf, files[statement_key]) if statement_key in files else ""
    if not description:
        description = str(_pick(meta, "description", default=""))
    if not description.strip():
        errors.append("Missing statement.md and description")

    boilerplates: dict[str, str] = {}
    prefix = f"{folder}/boilerplate/"
    for name, info in files.items():
        if not name.startswith(prefix):
            continue
        filename = name[len(prefix):]
        if "/" in filename:
            continue
        stem, _, ext = filename.rpartition(".")
        language = LANGUAGE_BY_STEM.get(stem.lower()) or LANGUAGE_BY_EXT.get(f".{ext.lower()}")
        if language:
            boilerplates[language] = _read_text(zf, info)

    languages = [lang for lang in _pick(meta, "languages", default=[]) or [] if lang in LANGUAGES]
    if not languages:
        languages = sorted(boilerplates.keys()) or ["cpp", "python"]

    is_progressive = bool(_pick(meta, "isProgressive", "is_progressive", default=False))
    raw_stages = _pick(meta, "stages", default=[]) or []
    stages = [
        _parse_stage(s, i, zf, folder, files, errors)
        for i, s in enumerate(raw_stages, start=1) if isinstance(s, dict)
    ]
    stages.sort(key=lambda s: s["stageOrder"])
    if is_progressive and not stages:
        errors.append("isProgressive is true but no stages were defined")

    test_cases: list[dict] = []
    if not is_progressive:
        tc_prefix = f"{folder}/testcases/"
        tc_names = sorted(
            (n for n in files if n.startswith(tc_prefix) and n.lower().endswith(".json") and "/" not in n[len(tc_prefix):]),
            key=_natural_key,
        )
        for index, name in enumerate(tc_names, start=1):
            try:
                raw = json.loads(_read_text(zf, files[name]))
                if not isinstance(raw, dict):
                    raise ValueError("must contain a JSON object")
                test_cases.append(_parse_test_case(raw, index))
            except ValueError as exc:
                errors.append(f"{name.split('/')[-1]} is invalid: {exc}")
        test_cases.sort(key=lambda tc: tc["order"])
        if not test_cases:
            errors.append("No test cases found")

    time_limit = int(_pick(meta, "timeLimit", "time_limit", default=2) or 2)
    memory_limit = int(_pick(meta, "memoryLimit", "memory_limit", default=256) or 256)
    max_score = int(_pick(meta, "maxScore", "max_score", default=100) or 100)
    if not 1 <= time_limit <= 15:
        errors.append("timeLimit must be between 1 and 15 seconds")
    if not 16 <= memory_limit <= 1024:
        errors.append("memoryLimit must be between 16 and 1024 MB")
    if not 0 <= max_score <= 10000:
        errors.append("maxScore must be between 0 and 10000")
    if not slug:
        errors.append("Could not derive a slug for this problem")

    return {
        "folder": folder,
        "slug": slug,
        "title": title,
        "difficulty": difficulty,
        "description": description,
        "inputFormat": str(_pick(meta, "inputFormat", "input_format", default="")),
        "outputFormat": str(_pick(meta, "outputFormat", "output_format", default="")),
        "constraints": str(_pick(meta, "constraints", default="")),
        "examples": [e for e in _pick(meta, "examples", default=[]) or [] if isinstance(e, dict)],
        "tags": [str(t) for t in _pick(meta, "tags", default=[]) or []],
        "languages": languages,
        "boilerplates": boilerplates,
        "testCases": test_cases,
        "timeLimit": time_limit,
        "memoryLimit": memory_limit,
        "maxScore": max_score,
        "status": "archived" if _pick(meta, "status", default="active") == "archived" else "active",
        "isProgressive": is_progressive,
        "stages": stages,
        "testCasesCount": len(test_cases) if not is_progressive else sum(len(s["testCases"]) for s in stages),
        "boilerplatesCount": len(boilerplates),
        "valid": not errors,
        "errors": errors,
    }


def parse_archive(data: bytes) -> list[dict]:
    if len(data) > MAX_ZIP_BYTES:
        raise ImportError_("ZIP file is larger than the 20 MB limit")

    try:
        zf = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile as exc:
        raise ImportError_(f"Not a valid ZIP file: {exc}") from exc

    with zf:
        files = _strip_common_root(_safe_entries(zf))
        folders = sorted({name.split("/")[0] for name in files if "/" in name})
        parsed = [
            _parse_problem(zf, folder, files)
            for folder in folders
            if f"{folder}/problem.json" in files
        ]

    if not parsed:
        raise ImportError_("No problem folders containing problem.json were found")
    return parsed
