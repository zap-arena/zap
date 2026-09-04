# Setup

Getting CodeArena / ZAP running on a fresh machine. The repository ships **without a database** — everything below creates one for you.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | 20 or newer | Includes `npm`. |
| **Python** | 3.12 or 3.13 | Must be on `PATH` as `python`. 3.14 also works locally, but production targets 3.12 (see `.python-version`). |
| **PostgreSQL** | — | **Not required.** The setup script downloads a self-contained server as a pip wheel, so you need no installer, no admin rights and no Docker. |
| **Piston judge** | — | Required only to *run/submit* code. See [Code execution](#code-execution). |

Check what you have:

```powershell
node --version
npm --version
python --version
```

---

## Quick start

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

or

```powershell
npm run setup
```

The script is safe to re-run — each step is skipped or updated in place if it already exists. It will:

1. Verify `node`, `npm` and `python` are available
2. `npm install`
3. Create `api\.venv` and install `api\requirements.txt`
4. Create `.env` from `.env.example` and generate a random `JWT_SECRET`
5. Download and start a local PostgreSQL server under `.postgres\`, then create the `codearena` database
6. Create the schema and load seed data

Then start the two dev servers in separate terminals:

```powershell
# Terminal 1 - backend (must run from the api folder)
cd api
.\.venv\Scripts\python.exe -m uvicorn index:app --reload --port 8000

# Terminal 2 - frontend
npm run dev
```

Open <http://localhost:5173>.

### Options

| Command | Effect |
|---|---|
| `.\setup.ps1 -DatabaseUrl "postgresql://user:pass@host/db"` | Use your own database (e.g. Neon) instead of the local one. |
| `.\setup.ps1 -DbPort 5433` | Run the local PostgreSQL on a different port. |
| `.\setup.ps1 -SkipSeed` | Set everything up but leave the database empty. |
| `.\setup.ps1 -ResetSeed` | Delete the previously seeded rows and recreate them. |

---

## What the seed data gives you

Loaded by [api/seed.py](api/seed.py), which can also be run on its own:

```powershell
api\.venv\Scripts\python.exe api\seed.py            # seed or refresh
api\.venv\Scripts\python.exe api\seed.py --reset    # wipe seeded rows, then reseed
```

**Accounts** — every seeded candidate uses the password `Test@12345`:

| Role | Email | Password |
|---|---|---|
| Admin (bootstrapped from `.env`) | `admin@local.dev` | `Admin@12345` |
| Admin (seeded) | `seed.admin@local.dev` | `Test@12345` |
| Candidate | `aarav@local.dev` | `Test@12345` |
| Candidate | `priya@local.dev` | `Test@12345` |
| Candidate | `rahul@local.dev` | `Test@12345` |
| Candidate | `sneha@local.dev` | `Test@12345` |

**Problems** — the three in [problems/](problems) (`two-sum`, `reverse-string`, `fizz-buzz`), each with 4 test cases (2 visible, 2 hidden) and boilerplate for C, C++, Java and Python.

**Contests** — one per lifecycle state, so every screen has something to show:

| Contest | Window | Use it to test |
|---|---|---|
| Seed Live Contest | started 1 h ago, ends in 3 h | Entering a contest, the workspace, live submissions |
| Seed Upcoming Contest | starts in 2 days | The "opens at …" block on entry |
| Seed Past Contest | ended 2 days ago | Results, leaderboard, profile history |

*Seed Past Contest* has 4 ranked participants with a full leaderboard, and *Seed Live Contest* has 2 in progress.

> Seeded submissions are written directly to the database and are **not** judged by Piston, so they load instantly and work without a judge configured.

---

## Code execution

Running and submitting code is delegated to a [Piston](https://github.com/engineer-man/piston) server. Without one, the editor returns `JUDGE_UNAVAILABLE` — everything else still works.

Set the base URL in `.env`, **without** a trailing `/execute`:

```
PISTON_ENDPOINTS=http://your-piston-host:2000/api/v2
PISTON_API_KEY=
```

Notes:
- Self-hosted Piston serves under `/api/v2`. Using `/api` gives `404 {"message":"Not Found"}`.
- Multiple hosts can be comma-separated; the backend round-robins and fails over between them, retrying up to 3 times.
- The **public** `emkc.org` Piston API has been whitelist-only since 2026-02-15 and will return `401`. Host your own or get whitelisted.

Verify an endpoint before configuring it:

```powershell
curl.exe -s -X POST "http://your-piston-host:2000/api/v2/execute" `
  -H "Content-Type: application/json" `
  -d '{\"language\":\"python\",\"version\":\"*\",\"files\":[{\"name\":\"main.py\",\"content\":\"print(1)\"}]}'
```

---

## Environment variables

All configuration lives in a single `.env` at the repository root (never committed).

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string. `postgres://` and `postgresql://` are both accepted. |
| `JWT_SECRET` | yes | Signing key for auth tokens. Login fails without it. |
| `PISTON_ENDPOINTS` | for code execution | Comma-separated Piston base URLs. |
| `PISTON_API_KEY` | no | Only if your Piston instance requires one. |
| `CORS_ORIGINS` | no | Comma-separated allowed origins. Defaults to `*`. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no | If both are set, this admin is created on startup. |
| `RATE_LIMIT_REQUESTS` | no | Max judge requests per window per user. Default `20`. |
| `RATE_LIMIT_WINDOW_SECONDS` | no | Length of the rate limit window. Default `10`. |
| `VITE_API_BASE_URL` | no | Frontend API base. Defaults to `/api`, which is correct for both dev and production. |

On Vercel, set these in **Project Settings → Environment Variables** instead — `.env` is excluded from deploys by `.vercelignore`.

---

## Managing the local database

The server lives entirely inside `.postgres\` and is not registered as a Windows service, so it does not start automatically after a reboot.

```powershell
$bin = (Get-ChildItem .\.postgres -Directory -Filter 'postgresql-*' | Select-Object -First 1).FullName + '\bin'

& "$bin\pg_ctl.exe" -D .\.postgres\data -l .\.postgres\server.log start   # start
& "$bin\pg_ctl.exe" -D .\.postgres\data stop                              # stop
& "$bin\pg_isready.exe" -h 127.0.0.1 -p 5432                              # status
& "$bin\psql.exe" -h 127.0.0.1 -p 5432 -U postgres -d codearena           # SQL shell
```

To start completely fresh, stop the server, delete `.postgres\data`, and re-run `setup.ps1`.

---

## Troubleshooting

**`pip install` fails with `Could not find a version that satisfies the requirement ...`**
You are likely behind a corporate proxy that blocks `pypi.org`. Point pip at your internal mirror in `%APPDATA%\pip\pip.ini`:

```ini
[global]
index-url = https://<user>%40<domain>:<token>@<artifactory-host>/artifactory/api/pypi/<repo>/simple
trusted-host = <artifactory-host>
```

URL-encode `@` in the username as `%40` — an unencoded `@` makes pip parse the token as a port and crash with `ValueError: Port could not be cast to integer`. Keep the whole URL on one line.

**`setup.ps1` cannot be loaded because running scripts is disabled**
Use the bypass form: `powershell -ExecutionPolicy Bypass -File .\setup.ps1`.

**Backend starts but every request 500s with `RuntimeError: DATABASE_URL is not configured`**
`.env` is missing or `DATABASE_URL` is blank. Re-run `setup.ps1`.

**`ModuleNotFoundError: No module named 'database'`**
Uvicorn was started from the wrong directory. Run it from `api\`, or pass `--app-dir api`.

**Login returns 500**
`JWT_SECRET` is empty in `.env`.

**Port 5432 already in use**
Another PostgreSQL is running. Either use it via `-DatabaseUrl`, or pick another port with `-DbPort 5433`.

**Changes to `.env` have no effect**
The backend reads `.env` only at startup and `--reload` watches `.py` files only. Restart uvicorn.

**Stale uvicorn processes serving old code**
On Windows several processes can bind the same port, so an old instance may answer. Kill them all:

```powershell
Get-CimInstance Win32_Process -Filter "Name='python.exe'" |
  Where-Object { $_.CommandLine -like '*uvicorn*' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

---

## Upgrading an existing database

Startup calls `Base.metadata.create_all`, which creates missing **tables** but never adds **columns** to existing ones. A brand-new database from `setup.ps1` is always correct, but if you are updating an older one, apply new columns manually — for example:

```sql
ALTER TABLE contests    ADD COLUMN IF NOT EXISTS instructions TEXT NOT NULL DEFAULT '';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS is_late BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE contest_activity_logs ADD COLUMN IF NOT EXISTS client_event_id VARCHAR(64);
ALTER TABLE contest_activity_logs ADD COLUMN IF NOT EXISTS occurred_at TIMESTAMPTZ;
ALTER TABLE contest_activity_logs ADD CONSTRAINT uq_activity_client_event UNIQUE (user_id, client_event_id);

CREATE TABLE IF NOT EXISTS contest_moderators (
  id VARCHAR(32) PRIMARY KEY,
  contest_id VARCHAR(32) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uq_contest_moderator UNIQUE (contest_id, user_id)
);

CREATE TABLE IF NOT EXISTS contest_notifications (
  id VARCHAR(32) PRIMARY KEY,
  contest_id VARCHAR(32) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_by VARCHAR(32),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_limits (
  bucket VARCHAR(80) PRIMARY KEY,
  hits INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_rate_limits_expires_at ON rate_limits (expires_at);
```

Progressive ("Code War") chain problem support adds new columns and tables
(`Base.metadata.create_all` creates the new tables `problem_stages` and
`contest_chain_progress` automatically; the columns below need to be added
manually on an existing database):

```sql
ALTER TABLE problems    ADD COLUMN IF NOT EXISTS is_progressive BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE contests    ADD COLUMN IF NOT EXISTS mode VARCHAR(20) NOT NULL DEFAULT 'standard';
ALTER TABLE test_cases  ADD COLUMN IF NOT EXISTS stage_id VARCHAR(32) REFERENCES problem_stages(id) ON DELETE CASCADE;
ALTER TABLE test_cases  ADD COLUMN IF NOT EXISTS perf_tier VARCHAR(10);
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS stage_id VARCHAR(32) REFERENCES problem_stages(id) ON DELETE CASCADE;
```

---

See [CODEBASE.md](CODEBASE.md) for a file-by-file description of the project.
