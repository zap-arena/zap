# ZAP — Context

## Design System
- Dark IDE aesthetic: near-black (#0d1117 GitHub-style) + electric teal primary
- Fonts: Plus Jakarta Sans (UI) + JetBrains Mono (code/mono)
- Custom CSS tokens in index.css: verdict-*, diff-*, surface-*, card-glow, sidebar-item
- Tailwind extended with success/warning/info colors

## Pages & Routes (HashRouter)
- `/` → HomePage (landing, contest list, problems list)
- `/login` → LoginPage (split layout)
- `/register` → RegisterPage
- `/contest/:slug` → ContestEntryPage (pre-start, instructions)
- `/contest/:contestId/workspace` → ContestWorkspacePage (full IDE)
- `/contest/:contestId/result` → ContestResultPage
- `/admin` → AdminDashboard
- `/admin/problems` → AdminProblems (CRUD + import dialog)
- `/admin/contests` → AdminContests (list + create dialog)
- `/admin/contests/:id` → AdminContestDetail (results + export CSV/XLSX)
- `/admin/participants` → AdminParticipants (with detail dialog)
- `/admin/submissions` → AdminSubmissions (with source code view)
- `/admin/logs` → AdminLogs (execution audit trail)
- `/admin/users` → AdminUsers

## Components
- `Navbar` — top nav for public pages
- `AdminLayout` — sidebar layout for all admin pages
- `ContestTimer` — countdown with urgent animation
- `VerdictBadge` — color-coded verdict chips
- `DifficultyBadge` — Easy/Medium/Hard chips
- `CodeEditor` — textarea-based editor with line numbers, tab support

## Auth Store (src/store/auth.ts)
- Lightweight pub/sub store, no zustand
- Demo: admin@codearena.io → admin role; any email → user role
- `useAuth()` hook

## Mock Data (src/data/mock.ts)
- 5 problems, 3 contests, 5 participants, 7 submissions, 4 exec logs, leaderboard

## Key Decisions
- No Monaco npm package (not pre-installed) → custom textarea editor with line numbers
- All contest workspace state is local (mock); backend integration stub-ready
- All admin routes protected by RequireAdmin guard

## Theme
- Light/dark mode via `src/store/theme.ts` pub-sub store + localStorage
- Toggle persists as `zap-theme` in localStorage, applied on `<html>` class
- `ThemeToggle` component in Navbar, AdminLayout sidebar, Workspace topbar
- Light mode is `:root` default; dark mode is `.dark` class override

## Recent Changes
- Fixed: Navbar.tsx was missing `import ThemeToggle` (caused ReferenceError crash)
- TestCase type now has `marks: number` (0 for samples, editable for hidden)
- Mock data updated with marks on all test cases
- AdminProblems: expand/collapse all test cases; marks input per hidden TC; auto-reset marks to 0 on toggle to public
- ContestWorkspacePage: Reset button in editor toolbar resets code to boilerplate with toast
- ContestWorkspacePage: Auto-enters fullscreen on contest start; fullscreen toggle button in topbar (Maximize/Minimize)
- All 4 languages (C, C++, Java, Python) supported in workspace + boilerplates in mock

## TODOs
- Wire to real FastAPI backend
- Add Monaco npm package when available
- Implement real autosave debounce endpoint calls
