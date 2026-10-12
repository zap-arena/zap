# ZAP — Agent Quick Reference & Operating Guidelines

Welcome, Agent! This repository is **ZAP**, a competitive programming platform built with **React 19 + TypeScript + Vite + Tailwind CSS** (frontend) and **FastAPI + SQLAlchemy + PostgreSQL** (backend), featuring dual code execution via **in-browser WebAssembly** and remote **Piston**.

---

## 1. Quick Navigation & Context Documents

- [context.md](file:///Users/vuelancer/Downloads/zap%20(1)/context.md): **Start here.** System overview, design system tokens, full list of routes, API routers, WASM execution, Razorpay payments, and progressive chain handling.
- [CODEBASE.md](file:///Users/vuelancer/Downloads/zap%20(1)/CODEBASE.md): Exhaustive codebase reference describing directory structure, ORM tables, schemas, serializers, and judging architecture.
- [WASM_PLAYGROUND_README.md](file:///Users/vuelancer/Downloads/zap%20(1)/WASM_PLAYGROUND_README.md): Architecture of the in-browser WebAssembly runtime (Pyodide, JSCPP, Java runner).

---

## 2. Running Services Locally

- **Frontend (Vite)**: Runs on port `5173`. Proxies `/api/*` to `http://127.0.0.1:8000`.
  ```bash
  npm run dev
  ```
- **Backend (FastAPI)**: Runs on port `8000`.
  ```bash
  source api/.venv/bin/activate
  uvicorn index:app --app-dir api --reload --port 8000
  ```
- **Typecheck & Verification**:
  ```bash
  npx tsc -b
  ```

---

## 3. Critical Platform Rules

### A. Problems Directory vs. Progressive Chains
- **Standard Practice Problems**: Displayed at `/problems` (`src/pages/ProblemsPage.tsx`) and solved at `/problems/:slug` (`src/pages/ProblemWorkspacePage.tsx`).
  - **Rule**: Standard problems MUST query `/api/public/problems?isProgressive=false`.
  - **Progressive Chains (`is_progressive: true`)**: Multi-round battle challenges (e.g. `contains-duplicate-progressive`, `binary-tree-progressive`). These are strictly for Code Wars (`/code-war`) and Debugging Wars (`/debugging-war`), and MUST be excluded from standard problem views.
- **Problem Workspace Execution**: Uses client-side WebAssembly sandbox for zero-latency execution across Python, C++, Java, and C.

### B. Dual Execution Architecture
1. **Client-Side WASM Engine**:
   - Powers `ProblemWorkspacePage.tsx` and `WasmPlaygroundPage.tsx`.
   - Runs entirely in the user's browser (Pyodide for Python, JSCPP for C/C++, client transpiler for Java).
2. **Server-Side Piston Judge**:
   - Powers official contest submissions (`POST /api/submissions`) with strict memory/time limits and cheat mitigation.

### C. Razorpay Payments & Subscriptions
- Handled in `api/routers/payments.py` and `src/pages/ProfilePage.tsx`.
- Gated content: DSA Curriculum (`/curriculum`, `src/pages/CurriculumDSAPage.tsx`) and premium problems.
- Supports coupon validation (`/api/payments/verify-coupon`) and subscription validity countdown.

### D. API & Data Formatting Boundary
- **Database / Python**: `snake_case` (e.g., `is_progressive`, `max_score`, `test_cases`).
- **JSON API / TypeScript**: `camelCase` (e.g., `isProgressive`, `maxScore`, `testCases`).
- Conversions are explicitly handled in `api/serializers.py` and `api/schemas.py`.

---

## 4. UI Aesthetics & Design Tokens
- Dark theme by default (`#0d1117` GitHub dark aesthetic) with electric teal/emerald primary accents.
- Preserves clean, modern, minimalist typography (`Plus Jakarta Sans` for UI, `JetBrains Mono` for code).
- Never use generic red/green/blue styles; utilize curated CSS classes in `src/index.css` (`card-glow`, `verdict-*`, `diff-*`, `sidebar-item`).
