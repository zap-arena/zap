# ZAP — Codebase Reference

A competitive-programming contest platform. **Next.js 15 App Router + React 19 + TypeScript** frontend, **FastAPI + SQLAlchemy + PostgreSQL** backend, with code execution delegated to a self-hosted **Piston** judge. Deployed as a single Vercel project: the frontend as Next.js serverless/edge routes, the backend as one Python serverless function.

> This document describes every tracked file and folder. Generated/vendored directories (`node_modules`, `.next`, `.venv`, `.postgres`) are described as a group at the end.

---

## Table of contents

- [Request flow (how it fits together)](#request-flow)
- [Root — build & tooling config](#root--build--tooling-config)
- [Root — environment & deployment](#root--environment--deployment)
- [`api/` — FastAPI backend](#api--fastapi-backend)
- [`api/routers/` — HTTP route modules](#apirouters--http-route-modules)
- [`src/` — frontend entry & shared code](#src--frontend-entry--shared-code)
- [`src/app/` — Next.js App Router routes](#srcapp--nextjs-app-router-routes)
- [`src/views/` — participant-facing & guide views](#srcviews--participant-facing--guide-views)
- [`src/views/admin/` — admin pages](#srcviewsadmin--admin-pages)
- [`src/components/` — shared components](#srccomponents--shared-components)
- [`problems/` — importable problem bank](#problems--importable-problem-bank)
- [Stale files](#stale-files)
- [Generated / ignored directories](#generated--ignored-directories)

---

## Request flow

```mermaid
flowchart LR
    B[Browser<br/>Next.js 15 App] -->|"/api/*"| P[Next.js dev rewrite<br/>or Vercel rewrite]
    P --> F[FastAPI<br/>api/index.py]
    F --> D[(PostgreSQL)]
    F -->|"POST /execute"| J[Piston judge]
```

- The frontend always calls relative paths under `/api`. In development, [next.config.ts](next.config.ts) rewrites `/api/:path*` to `http://127.0.0.1:8000/api/:path*`; in production, the `rewrites` rule in [vercel.json](vercel.json) routes them to the Python serverless function.
- FastAPI routes are declared with their **full** `/api/...` path (there is no router prefix stripping), so the same URL works in both environments.
- All code execution is outbound HTTP to Piston. The backend never runs untrusted code itself.

---

## Root — build & tooling config

| File | Purpose |
|---|---|
| [next.config.ts](next.config.ts) | Next.js configuration. Rewrites `/api/:path*` to `http://127.0.0.1:8000/api/:path*` and provides webpack fallback shims (`fs: false`, `path: false`) for heavy client libraries. |
| [package.json](package.json) | Frontend manifest. Scripts: `dev` (`next dev --port 5173`), `build` (`next build`), `start` (`next start`), `typecheck` (`tsc --noEmit`), `lint` (`eslint .`), `format` (`eslint . --fix`). Key deps: Next.js 15, React 19, TanStack Query, `@monaco-editor/react`, Radix UI primitives, Tailwind, Lucide icons, Sonner toasts. |
| [tsconfig.json](tsconfig.json) | Unified TypeScript config with Next.js plugin (`"name": "next"`), strict typechecks (`noUnusedLocals`, `noUnusedParameters`), path aliases (`@/*` → `./src/*`), and stubs integration. |
| [next-env.d.ts](next-env.d.ts) | Next.js TypeScript declarations file for App Router support. |
| [tailwind.config.js](tailwind.config.js) | Tailwind setup: class-based dark mode, content globs over `src/`, theme colours wired to the CSS variables defined in `src/app/globals.css`. |
| [postcss.config.js](postcss.config.js) | Runs Tailwind + Autoprefixer. |
| [eslint.config.js](eslint.config.js) | ESLint flat config (JS, TypeScript, React Hooks, Next.js). |
| [components.json](components.json) | shadcn/ui CLI config (new-york style, TSX, Lucide icons, path aliases). Used when generating new `ui/` components. |
| [package-lock.json](package-lock.json) / [pnpm-lock.yaml](pnpm-lock.yaml) | Package lockfiles. `pnpm` is the standard package manager for development and builds. |


---

## Root — environment & deployment

| File | Purpose |
|---|---|
| [vercel.json](vercel.json) | Deployment config. Builds the Vite frontend to `dist`, registers `api/index.py` as a serverless function (`maxDuration` 30s), rewrites `/api/(.*)` to it, and uses `excludeFiles` to keep venvs/DB/artifacts out of the function bundle. |
| [.vercelignore](.vercelignore) | Excludes local venvs, the local Postgres cluster, `render/`, `node_modules`, and **`.env` files** from upload. Critical because this folder is not a git repo, so CLI deploys have no `.gitignore` to fall back on. |
| [.python-version](.python-version) | Pins the Vercel Python runtime to 3.12. |
| `.env` | **Untracked.** The single source of configuration: `DATABASE_URL`, `JWT_SECRET`, `PISTON_ENDPOINTS`, `PISTON_API_KEY`, `CORS_ORIGINS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, plus `VITE_API_BASE_URL` for the frontend. In production these belong in Vercel Project Settings instead. |
| `.env.example` | Committed template for the above, documenting which vars are backend vs. frontend. |
| [.gitignore](.gitignore) | Ignores `node_modules`, `dist`, venvs, `.postgres/`, `render/`, and `.env` files. |
| [.vscode/settings.json](.vscode/settings.json) | Editor workspace settings — explorer/tree preferences and search/file exclusions for `__pycache__`, `.venv`, etc. |
| `.vscode/mcp.json` | MCP server definitions for editor tooling. Not used by the application. |
| [README.md](README.md) | **Still the stock Vite + React template README.** Contains no project-specific information. |
| [context.md](context.md) | A 64-line design/architecture note (design tokens, route list, key decisions). **Partly stale** — it describes mock data in `src/data/mock.ts` and says Monaco is unavailable, both of which are no longer true. |

---

## `api/` — FastAPI backend

Modules use **flat imports** (`from database import ...`, `import models`). `index.py` inserts its own directory onto `sys.path` so this works both under `uvicorn --app-dir api` locally and on Vercel, where the working directory is the project root.

| File | Purpose |
|---|---|
| [api/index.py](api/index.py) | Application entry point and the Vercel function handler (exports `app`). Loads `.env` **before** importing modules that read env vars at import time, configures CORS, applies a small in-process rate limiter to `/api/code/run` and `/api/submissions`, creates tables on startup, bootstraps the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`, and mounts every router. |
| [api/database.py](api/database.py) | SQLAlchemy engine/session setup. Normalises `postgres://` and `postgresql://` URLs to `postgresql+psycopg://` (so Neon/Vercel connection strings work unchanged), defines the declarative `Base`, and exposes the `get_db()` request dependency. Engine is `None` when `DATABASE_URL` is unset. |
| [api/models.py](api/models.py) | All ORM tables: `User`, `Problem`, `TestCase`, `Contest`, `ContestProblem`, `ContestModerator`, `ContestParticipant`, `CodeDraft`, `Submission`, `SubmissionTestResult`, `ExecutionLog`, `ContestActivityLog`. IDs are 32-char hex strings generated in Python. |
| [api/schemas.py](api/schemas.py) | Pydantic request/response models. Uses **camelCase** field names to match the frontend, in contrast to the snake_case ORM columns. Includes validation such as "endTime must be after startTime". |
| [api/serializers.py](api/serializers.py) | Converts ORM objects into the camelCase JSON shapes the frontend expects. Also enforces test-case privacy: hidden cases return only `{id, name, hidden, marks}` unless `include_hidden=True`. |
| [api/security.py](api/security.py) | Password hashing (`passlib` + bcrypt) and JWT issue/decode (`PyJWT`, HS256, 12-hour expiry). Raises if `JWT_SECRET` is unset rather than signing with an empty key. |
| [api/deps.py](api/deps.py) | FastAPI dependencies: `get_current_user`, `get_optional_user`, `require_admin`. These are the authorization boundary for every protected route. |
| [api/scoring.py](api/scoring.py) | Judging orchestration. `run_public()` powers the "Run" button (custom stdin, unscored); `judge_submission()` runs every test case sequentially, compares normalised output, and aggregates marks; `compute_problem_score()` implements full vs. partial scoring. Aborts the run and forces score 0 on `COMPILATION_ERROR`/`JUDGE_UNAVAILABLE`. |
| [api/piston_service.py](api/piston_service.py) | HTTP client for the Piston judge. Round-robins across `PISTON_ENDPOINTS` with failover, retries the whole ring up to 3 times with backoff, maps language → source filename (`java` → `Main.java`), and translates Piston's response into a verdict status. |
| [api/problem_import.py](api/problem_import.py) | Parses a bulk-import ZIP into problem dictionaries. Handles both layouts (with/without a wrapping root folder), accepts camelCase or snake_case keys, natural-sorts `tc1…tc10`, and derives languages from `boilerplate/` filenames. Security limits: rejects zip-slip paths, caps archive size (20 MB), uncompressed size (100 MB), entry count, and per-file size. |
| [api/seed.py](api/seed.py) | Standalone test-data seeder (not imported by the app). Creates 5 users, loads the `problems/` bank through the real ZIP importer, and builds three contests — live, upcoming and past — with participants and synthetic submissions so leaderboards and profiles have realistic data. Idempotent: matches on email/slug and updates rather than duplicating. `--reset` removes only its own rows; `--no-submissions` skips the fake submissions. |
| [api/rate_limit.py](api/rate_limit.py) | Fixed-window request limiter backed by the `rate_limits` table, so the count is shared across serverless instances instead of living in one process's memory. Identities are SHA-256 hashed before storage, expired rows are swept probabilistically, and it degrades to an in-memory limiter if the database is unavailable. Tunable via `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS`. |
| [api/requirements.txt](api/requirements.txt) | Backend dependencies: FastAPI, Uvicorn, Pydantic, SQLAlchemy 2, psycopg 3, PyJWT, passlib + bcrypt (pinned to 4.0.1 — 5.x breaks passlib), httpx, openpyxl, email-validator, python-multipart. |

---

## `api/routers/` — HTTP route modules

| File | Purpose |
|---|---|
| [api/routers/__init__.py](api/routers/__init__.py) | Empty; marks the directory as a package. |
| [api/routers/auth.py](api/routers/auth.py) | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`. Registration always assigns the `user` role — admins are created only via the startup bootstrap or a direct DB change. |
| [api/routers/problems.py](api/routers/problems.py) | Public problem listing/detail, admin CRUD, server-side **problem search** (`GET /api/admin/problems/search`, with LIKE wildcards escaped), and the **bulk ZIP import** endpoint (`POST /api/admin/problems/import-zip`) supporting a `dry_run` preview. Delete is a soft delete (`status = archived`). |
| [api/routers/contests.py](api/routers/contests.py) | The largest router. Public contest list/detail; participant lifecycle (`start`, `session`, `finish`); contest problems; code-draft save/load; personal submissions; leaderboard; and admin CRUD, publish, participants and results. `compute_status()` derives `scheduled`/`active`/`completed` from the clock, and `start` returns 403 outside the contest window. Delete is a soft delete (`status = cancelled`). |
| [api/routers/submissions.py](api/routers/submissions.py) | `POST /api/code/run` (unscored execution) and `POST /api/submissions` (full judge run). Enforces language support, contest participation, per-problem submit cooldown, and marks submissions landing after `contest.end_time` as `is_late` — those are stored but scored 0 and never update the participant's leaderboard totals. |
| [api/routers/profile.py](api/routers/profile.py) | `GET /api/me/profile`. Aggregates the signed-in user's contests, per-contest score/solved counts, per-problem breakdown, and leaderboard rank, excluding late submissions. |
| [api/routers/admin.py](api/routers/admin.py) | Admin reporting: platform statistics, filterable submission list, execution logs, user directory, and contest results **export to CSV/XLSX**. All routes require `require_admin`, so the export must be fetched with the auth header (not a plain link). |
| [api/routers/public.py](api/routers/public.py) | `GET /api/public/home` — one unauthenticated call returning the landing-page snapshot (upcoming/live contests, sample problems, headline counts). |

---

## `src/` — frontend entry & shared code

| File | Purpose |
|---|---|
| [src/app/layout.tsx](src/app/layout.tsx) | Next.js root layout. Provides the `<html>` and `<body>` shell, global metadata, font configurations, and wraps all pages in `Providers`. |
| [src/app/globals.css](src/app/globals.css) | The design system: light/dark CSS custom properties, typography, and utility classes (`card-glow`, `verdict-*`, `diff-*`, `sidebar-item`). |
| [src/components/Providers.tsx](src/components/Providers.tsx) | Client-side root provider mounting `QueryClientProvider`, `RouteTransitionLoader`, and `Toaster`. |
| [src/components/AuthGuard.tsx](src/components/AuthGuard.tsx) | Client-side route protection. Redirects unauthenticated users to `/login`. |
| [src/components/AdminGuard.tsx](src/components/AdminGuard.tsx) | Client-side route protection for administrative routes (`/admin/*`). Requires `user.role === 'admin'`. |
| [src/lib/api.ts](src/lib/api.ts) | The single HTTP client. Attaches the bearer token, unwraps errors into `ApiError`, clears the token on 401, and provides `get/post/put/delete`, `upload` (multipart), and `download` (authenticated blob download). Base URL defaults to `/api`. Guarded for SSR. |
| [src/lib/utils.ts](src/lib/utils.ts) | `cn()` — merges Tailwind classes via `clsx` + `tailwind-merge`. |
| [src/types/index.ts](src/types/index.ts) | Shared TypeScript interfaces mirroring the API payloads (`Problem`, `TestCase`, `Contest`, `ContestProblem`, `ContestModerator`, `Submission`, `LeaderboardEntry`, …). |
| [src/types/next-stubs.d.ts](src/types/next-stubs.d.ts) | Type stubs for Next.js navigation, dynamic import, metadata, and vendor types. |
| [src/store/auth.ts](src/store/auth.ts) | Minimal pub/sub auth store. Persists the JWT in `localStorage` (guarded for SSR), restores the session via `/auth/me`, and exposes `useAuth()` with `login`/`register`/`logout`. |
| [src/store/theme.ts](src/store/theme.ts) | Pub/sub dark-mode store. Persists to `localStorage` under `zap-theme` (guarded for SSR) and toggles the `dark` class on `<html>`. |
| [src/hooks/use-mobile.tsx](src/hooks/use-mobile.tsx) | `useIsMobile()` — media-query hook for the ≤767px breakpoint, used by the sidebar. |

---

## `src/app/` — Next.js App Router routes

File-based route endpoints mapping cleanly to views:

| Route Directory | URL Path | View Mounted |
|---|---|---|
| `src/app/page.tsx` | `/` | `src/views/HomePage.tsx` |
| `src/app/login/page.tsx` | `/login` | `src/views/LoginPage.tsx` |
| `src/app/register/page.tsx` | `/register` | `src/views/RegisterPage.tsx` |
| `src/app/forgot-password/page.tsx` | `/forgot-password` | `src/views/ForgotPasswordPage.tsx` |
| `src/app/profile/page.tsx` | `/profile` | `src/views/ProfilePage.tsx` (wrapped in `AuthGuard`) |
| `src/app/contests/page.tsx` | `/contests` | `src/views/ContestsPage.tsx` |
| `src/app/contest/[slug]/page.tsx` | `/contest/:slug` | `src/views/ContestEntryPage.tsx` |
| `src/app/contest/[slug]/workspace/page.tsx` | `/contest/:slug/workspace` | `src/views/ContestWorkspacePage.tsx` (wrapped in `AuthGuard`) |
| `src/app/contest/[slug]/result/page.tsx` | `/contest/:slug/result` | `src/views/ContestResultPage.tsx` |
| `src/app/codewar/page.tsx` | `/codewar` | `src/views/CodeWarPage.tsx` |
| `src/app/codewar/debugging/page.tsx` | `/codewar/debugging` | `src/views/DebuggingWarPage.tsx` |
| `src/app/curriculum/dsa/page.tsx` | `/curriculum/dsa` | `src/views/CurriculumDSAPage.tsx` |
| `src/app/curriculum/dsa/[topic]/page.tsx` | `/curriculum/dsa/:topic` | `src/views/guide/*GuidePage.tsx` |
| `src/app/admin/layout.tsx` | `/admin/*` | `src/components/AdminLayout.tsx` (wrapped in `AdminGuard`) |
| `src/app/admin/page.tsx` | `/admin` | `src/views/admin/AdminDashboard.tsx` |
| `src/app/admin/contests/page.tsx` | `/admin/contests` | `src/views/admin/AdminContests.tsx` |
| `src/app/admin/problems/page.tsx` | `/admin/problems` | `src/views/admin/AdminProblems.tsx` |
| `src/app/not-found.tsx` | 404 handler | `src/views/NotFound.tsx` |

---

## `src/views/` — participant-facing & guide views

All interactive views reside in `src/views/` (marked with `"use client"`):

| File | Purpose |
|---|---|
| [src/views/HomePage.tsx](src/views/HomePage.tsx) | Public landing page: hero, platform stats, live/upcoming contests and featured problems, driven by `/api/public/home`. |
| [src/views/LoginPage.tsx](src/views/LoginPage.tsx) | Split-layout sign-in form with password visibility toggle and redirect-back-to-referrer. |
| [src/views/RegisterPage.tsx](src/views/RegisterPage.tsx) | Self-service registration (min 8-character password). New accounts always get the `user` role. |
| [src/views/ContestEntryPage.tsx](src/views/ContestEntryPage.tsx) | Pre-contest briefing: description, problem summary, admin-authored **instructions**, and the Start Contest button that begins the participant's timer. |
| [src/views/ContestWorkspacePage.tsx](src/views/ContestWorkspacePage.tsx) | The contest IDE. Monaco editor (loaded with `dynamic(..., { ssr: false })`) with per-language boilerplate, resizable panels, custom stdin, Run and Submit, countdown timer, fullscreen mode. |
| [src/views/ContestResultPage.tsx](src/views/ContestResultPage.tsx) | Post-contest summary: final score, rank, problems solved, and a per-problem results table. |
| [src/views/ProfilePage.tsx](src/views/ProfilePage.tsx) | Candidate profile at `/profile`. Shows lifetime stats and contest breakdown. |
| [src/views/NotFound.tsx](src/views/NotFound.tsx) | 404 card with a link home. |
| [src/views/guide/](src/views/guide/) | Interactive curriculum guide pages (`SlidingWindowDsaGuidePage.tsx`, `TwoPointerDsaGuidePage.tsx`, `GraphDsaGuidePage.tsx`, etc.). |

## `src/views/admin/` — admin pages

Mounted under `/admin` and guarded by `AdminGuard`.

| File | Purpose |
|---|---|
| [src/views/admin/AdminDashboard.tsx](src/views/admin/AdminDashboard.tsx) | Overview: headline counts plus recent submissions, contests and execution logs. |
| [src/views/admin/AdminProblems.tsx](src/views/admin/AdminProblems.tsx) | Problem bank management. Table with filters; create/edit dialog covering details, test cases (public/hidden + marks) and per-language boilerplate; archive with confirmation; and the **bulk ZIP import** dialog with a validated dry-run preview. |
| [src/views/admin/AdminContests.tsx](src/views/admin/AdminContests.tsx) | Contest management. Shared create/edit form with title, description, instructions, start/end datetime pickers, attempt duration, scoring mode, moderator selection, a debounced server-backed **problem picker**, and reorderable attached problems with per-problem scores. Publish, copy URL, and delete (with confirmation). |
| [src/views/admin/AdminContestDetail.tsx](src/views/admin/AdminContestDetail.tsx) | Single-contest report: participation summary, leaderboard, submissions, and authenticated CSV/XLSX export. |
| [src/views/admin/AdminParticipants.tsx](src/views/admin/AdminParticipants.tsx) | Participants across contests, with a per-participant detail dialog showing their submissions. |
| [src/views/admin/AdminSubmissions.tsx](src/views/admin/AdminSubmissions.tsx) | Global submission browser with filters and a source-code viewer. |
| [src/views/admin/AdminLogs.tsx](src/views/admin/AdminLogs.tsx) | Execution audit trail with status/language filters and aggregate timings. |
| [src/views/admin/AdminUsers.tsx](src/views/admin/AdminUsers.tsx) | Read-only user directory (name, email, role, joined date). |


---

## `src/components/` — shared components

**In use:**

| File | Purpose |
|---|---|
| [src/components/AdminLayout.tsx](src/components/AdminLayout.tsx) | Sidebar shell for every admin page: navigation, collapsible mobile drawer, theme toggle, and user menu. |
| [src/components/Navbar.tsx](src/components/Navbar.tsx) | Top bar for public/participant pages: brand link, theme toggle, and the user dropdown (Admin Dashboard / Profile / Logout). |
| [src/components/ContestTimer.tsx](src/components/ContestTimer.tsx) | HH:MM:SS countdown that turns urgent under 5 minutes and fires `onExpire()`. |
| [src/components/VerdictBadge.tsx](src/components/VerdictBadge.tsx) | Maps a submission status to a coloured chip. |
| [src/components/DifficultyBadge.tsx](src/components/DifficultyBadge.tsx) | Easy/Medium/Hard chip. |
| [src/components/ThemeToggle.tsx](src/components/ThemeToggle.tsx) | Dark/light switch bound to the theme store. |
| `src/components/ui/` | **53 shadcn/ui primitives** (Radix + Tailwind): dialog, alert-dialog, select, table, tabs, checkbox, command, popover, resizable, sonner, sidebar, etc. Generated by the shadcn CLI and excluded from linting. Not all 53 are used — they were added as a set. |

Every other component in this directory is imported somewhere; the leftover template components that used to sit here have been deleted.

---

## `problems/` — importable problem bank

Sample content in the exact layout the ZIP importer expects. **Not read at runtime** — it is zipped and uploaded through the admin UI.

```
problems/<slug>/
├── problem.json          metadata: title, difficulty, io format, constraints,
│                         examples, tags, languages, limits, maxScore
├── statement.md          full markdown problem statement
├── boilerplate/          c.c · cpp.cpp · java.java · python.py (stdin/stdout
│                         wiring done, solution body left as TODO)
└── testcases/            tc1..tc4.json — { name, input, expected_output,
                          hidden, marks, order }
```

Included problems: `two-sum`, `reverse-string`, `fizz-buzz` — each with 4 test cases (2 visible, 2 hidden) totalling 100 marks.

> Note: `java.java` must be materialised as `Main.java` at execution time, since the boilerplate declares `public class Main`. `piston_service.py` already maps the language to that filename.

---

## Stale files

The dead template components, unused assets and junk artifacts that used to live here were removed on 2026-09-03: `HelloWorld.tsx`, `index.ts`, `login-form.tsx`, `app-sidebar.tsx`, `nav-main.tsx`, `nav-user.tsx`, `team-switcher.tsx`, the three `src/assets/*.svg` files, `src/data/`, `api/pd.txt`, both `._.DS_Store` files, `render/`, and the stray `.venv/` and `api/venv/` virtualenvs. Typecheck and production build both pass without them.

What remains questionable:

| Path | Status |
|---|---|
| [README.md](README.md) | Still the stock Vite template \u2014 no project content. Worth replacing with real setup instructions. |
| [context.md](context.md) | Design notes that have drifted from reality (references mock fixtures that no longer exist; claims Monaco is unavailable although it is a dependency). |
| [bun.lock](bun.lock) + [package-lock.json](package-lock.json) | Two package managers' lockfiles coexist. The project is driven with npm; keeping both risks dependency drift. |
| [bundle-artifact.sh](bundle-artifact.sh) | The only consumer of `render/`, which no longer exists. Unused by Vercel and invokes `pnpm`. |

---

## Generated / ignored directories

Excluded from git and from Vercel uploads; recreate them locally as needed.

| Path | What it is |
|---|---|
| `node_modules/` | npm/pnpm dependencies. `pnpm install`. |
| `.next/` | Next.js build cache and server/client bundle output. `pnpm build`. |
| `api/.venv/` | Backend virtualenv (~117 MB). `python -m venv api/.venv` + `pip install -r api/requirements.txt`. |
| `.postgres/` | Local PostgreSQL 18 server binaries and the `data/` cluster (~220 MB), extracted from the `postgresql-binaries` wheel so Postgres can run without admin rights or Docker. |
| `.playwright-mcp/` | Scratch output from browser tooling. |


---

## Conventions worth knowing

1. **Naming boundary.** The database and Python internals use `snake_case`; every JSON payload crossing the API uses `camelCase`. `serializers.py` and `schemas.py` are where the translation happens — keep it there.
2. **Soft deletes.** Problems become `archived`, contests become `cancelled`. Rows are never removed, so historical results stay intact.
3. **Parent before child.** When creating a `Contest` or `Problem` with child rows, the parent must be `db.add()`-ed and `db.flush()`-ed first — its primary key is generated by a Python-side default that only runs at flush time.
4. **Schema changes need manual SQL.** Startup calls `Base.metadata.create_all`, which creates missing *tables* but never adds *columns* to existing ones. New columns require an explicit `ALTER TABLE` against each environment.
5. **Late submissions.** Anything landing after `contest.end_time` is persisted with `is_late = true` and score 0, and is excluded from participant totals, the leaderboard, and profile statistics.

---

## Known gaps

- **Moderators are cosmetic.** `ContestModerator` rows are stored and displayed, but every admin route still checks `require_admin`, so being a moderator grants no additional access.
- **Cold-start DDL.** `create_all` plus the admin bootstrap run on every cold start, adding latency on serverless.
- **Feature Flags.** Experimental features like `conceptStory.showDeck` and specific reel action buttons are gated via `src/config/features.ts`.
