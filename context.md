# ZAP — System Context & Architecture Reference

> **Last Updated:** October 2026  
> **Status:** Active, Production-Ready Development  
> **Primary Stack:** React 19 + TypeScript + Vite + Tailwind CSS | FastAPI + SQLAlchemy + PostgreSQL | WebAssembly Client Judge + Piston Remote Judge | Razorpay Payments

---

## 1. Overview & Current State

ZAP is a full-featured competitive programming and developer learning platform featuring:
- **Real Database Problems Directory & Workspace**: 21+ real database problems with statement rendering, starter boilerplates, testcases, and instant client-side execution via WebAssembly (Pyodide, JSCPP, Java runner).
- **Contests & Code Wars**: Timed competitive programming contests, progressive multi-stage Code Wars (`is_progressive: true`), and interactive Debugging Wars.
- **WASM Playground**: Zero-latency local compiler/interpreter running C, C++, Python, and Java directly inside the browser using WebAssembly.
- **Curriculum / Courses**: DSA learning roadmaps, interactive visualizers, gated behind a Premium tier.
- **Monetization & Razorpay Integration**: Premium subscriptions, coupon verification, order creation, payment signatures, and subscription tracking.
- **Innovative Minimalist Profile**: Custom profile experience tracking subscription validity, available coupons with copy-to-apply, contest performance, and problem solving stats.
- **Admin Suite**: Problem bank management (bulk ZIP import/export), contest scheduling, moderation, participant analytics, and CSV/XLSX export.

---

## 2. Design System & Aesthetics

- **Theme**: Dark IDE aesthetic by default (`#0d1117` GitHub/Vercel dark style) with electric teal/emerald accents. Supports seamless light/dark mode switching via `src/store/theme.ts` (`localStorage['zap-theme']` bound to `<html>.dark`).
- **Typography**: 
  - UI: `Plus Jakarta Sans`, `Inter`, system sans-serif.
  - Code / Editor: `JetBrains Mono`, `Fira Code`, monospace.
- **CSS Tokens & Utilities (`src/index.css`)**:
  - `card-glow`, `sidebar-item`, `surface-*`
  - Verdict badges: `verdict-accepted`, `verdict-wrong-answer`, `verdict-time-limit`, `verdict-runtime-error`
  - Difficulty badges: `diff-easy`, `diff-medium`, `diff-hard`
- **Editor**: `@monaco-editor/react` for contest and workspace code editing with syntax highlighting, auto-completion, line numbers, and custom themes.

---

## 3. Frontend Architecture

### Routing (`src/App.tsx`)
Uses React Router with `RequireAuth` and `RequireAdmin` wrappers:
- **Public / General**:
  - `/` → `HomePage.tsx` (hero, live contests, platform metrics)
  - `/login` → `LoginPage.tsx` (split layout, error feedback)
  - `/register` → `RegisterPage.tsx`
  - `/forgot-password` → `ForgotPasswordPage.tsx`
- **Problems Directory & Workspace**:
  - `/problems` → `ProblemsPage.tsx` (queries `/api/public/problems?isProgressive=false`; progressive chain problems excluded; filter by category/difficulty; random problem picker)
  - `/problems/:slug` → `ProblemWorkspacePage.tsx` (queries `/api/public/problems/:slug`; full IDE with WASM execution, tests, stdin/stdout, constraints, previous/next problem navigation)
- **Contests & Arena**:
  - `/contests` → `ContestsPage.tsx` (live, upcoming, past contests)
  - `/contest/:slug` → `ContestEntryPage.tsx` (instructions, start contest)
  - `/contest/:contestId/workspace` → `ContestWorkspacePage.tsx` (Monaco IDE, live leaderboard, fullscreen lock, submission history)
  - `/contest/:contestId/result` → `ContestResultPage.tsx`
- **Interactive Arenas & Workflows**:
  - `/code-war` → `CodeWarPage.tsx` (progressive chain problems)
  - `/debugging-war` → `DebuggingWarPage.tsx`
  - `/sql-workflow` → `SqlWorkflowPage.tsx`
  - `/workflow-puzzle` → `WorkflowPuzzlePage.tsx`
  - `/wasm-playground` → `WasmPlaygroundPage.tsx`
- **Learning & Quizzes**:
  - `/curriculum` → `CurriculumDSAPage.tsx` (DSA course tracks, premium gated)
  - `/quizzes` → `QuizListPage.tsx`
  - `/quizzes/:quizId` → `QuizTakingPage.tsx`
- **User Profile**:
  - `/profile` → `ProfilePage.tsx` (innovative minimalist UI, subscription validity countdown, active coupon codes, solving statistics)
- **Admin**:
  - `/admin` → `AdminDashboard.tsx`
  - `/admin/problems` → `AdminProblems.tsx` (CRUD, bulk ZIP import, marks editor)
  - `/admin/contests` → `AdminContests.tsx`
  - `/admin/contests/:id` → `AdminContestDetail.tsx` (leaderboard, CSV/XLSX export)
  - `/admin/participants` → `AdminParticipants.tsx`
  - `/admin/submissions` → `AdminSubmissions.tsx`
  - `/admin/logs` → `AdminLogs.tsx`
  - `/admin/users` → `AdminUsers.tsx`

### State & Stores (`src/store/`)
- `auth.ts`: Authentication store, JWT token storage, user role (`admin` | `user`), premium status.
- `theme.ts`: Light/dark mode toggle store.
- `submissions.ts`: Client-side submission and problem execution cache.
- `use-mobile.tsx`: Responsive breakpoint hook.

---

## 4. Backend Architecture (`api/`)

FastAPI app structured with flat module imports (`sys.path` setup in `index.py`):
- `index.py`: Entry point, CORS config, rate limiting, startup DB initialization, admin bootstrap.
- `database.py`: SQLAlchemy engine & session factory (`get_db`). Normalizes Neon/PostgreSQL connection strings.
- `models.py`: PostgreSQL tables: `User`, `Problem`, `TestCase`, `Contest`, `ContestProblem`, `ContestParticipant`, `Submission`, `SubmissionTestResult`, `ExecutionLog`, `PaymentOrder`, `Subscription`.
- `serializers.py` & `schemas.py`: Snake_case ORM to camelCase API transformation; hides secret testcases unless authorized.
- `piston_service.py`: Client for remote Piston judge execution.
- `scoring.py`: Sequential testcase execution, output trimming/normalization, marks calculation.

### API Routers (`api/routers/`)
- `problems.py`:
  - `GET /api/public/problems?isProgressive=false`: Public problem bank. Standard practice problems only.
  - `GET /api/public/problems/{slug}` (and `/api/problems/{slug}`): Public problem statement, sample tests, boilerplates.
  - `GET /api/admin/problems`: Admin problem list with hidden test cases.
  - `POST /api/admin/problems/import-zip`: Bulk ZIP problem import.
- `contests.py`: Contest lifecycle (`start`, `session`, `finish`), code drafts, submissions, leaderboards.
- `submissions.py`: `/api/code/run` (unscored) and `/api/submissions` (scored judging).
- `payments.py`: Razorpay order creation (`/api/payments/razorpay/create-order`), verification (`/api/payments/razorpay/verify`), and coupon validation (`/api/payments/verify-coupon`).
- `profile.py`: `/api/me/profile` candidate statistics, active coupons, and premium subscription details.
- `auth.py`: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
- `admin.py`: Global statistics, export CSV/XLSX, execution logs, user list.
- `quizzes.py`: Quiz list and submission evaluation.

---

## 5. Dual Execution Engine (WASM + Piston)

1. **Client-Side WASM Engine** (`src/lib/wasm-runner/` & WebAssembly):
   - Used for zero-latency execution in `ProblemWorkspacePage.tsx` and `WasmPlaygroundPage.tsx`.
   - Python: Pyodide WebAssembly runtime.
   - C++ / C: JSCPP / Clang WASM runner.
   - Java: In-browser Java execution transpile engine.
   - Executes testcases in memory directly on the user's browser without placing load on backend servers.
2. **Server-Side Piston Judge** (`api/piston_service.py`):
   - Used for official contest submissions and verified anti-cheat scoring.
   - Runs against configured Piston instances (`PISTON_ENDPOINTS`).

---

## 6. Progressive Chain Problems vs. Standard Problems

- **Database Flag**: `is_progressive: bool` on `Problem` model.
- **Progressive Chain Problems (`is_progressive=True`)**: Multi-stage Code War problems (e.g. `contains-duplicate-progressive`, `binary-tree-progressive`). Displayed in `/code-war` and `/debugging-war`.
- **Standard Problems (`is_progressive=False`)**: Individual competitive programming problems. Displayed in `/problems` (Problems tab).
- **Rule**: Standard problems directory MUST ALWAYS query `/api/public/problems?isProgressive=false` and filter out any progressive chains.

---

## 7. Key Operational Commands

```bash
# Frontend dev server (Vite, port 5173)
npm run dev

# Backend dev server (FastAPI, port 8000)
source api/.venv/bin/activate
uvicorn index:app --app-dir api --reload --port 8000

# TypeScript Typecheck
npx tsc -b

# Production Build
npm run build
```

---

## 8. Critical Environment Variables (`.env`)

- `DATABASE_URL`: PostgreSQL connection string (PostgreSQL 15+ / Neon).
- `JWT_SECRET`: Secret key for PyJWT HMAC-SHA256 tokens.
- `RAZORPAY_KEY_ID`: Razorpay public key (or test key `rzp_test_*`).
- `RAZORPAY_KEY_SECRET`: Razorpay secret key.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: Default administrator seeded on startup.
- `PISTON_ENDPOINTS`: Comma-separated Piston API URLs (e.g. `http://127.0.0.1:2000`).
- `VITE_API_BASE_URL`: Base URL for API calls (defaults to `/api` via Vite proxy).
