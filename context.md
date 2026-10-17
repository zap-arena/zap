# ZAP — Context & Architecture

## Overview
ZAP (**[codezap.in](https://codezap.in)**) is an active, tinker-first online coding and DSA mastery platform built to overcome traditional tutorial fatigue and passive AI chatbot spoonfeeding. It combines interactive algorithmic visualizers, TikTok-style DSA micro-learning reels, 4-beat concept narrative decks, a real-time contest arena, and an administrative contest management system.

## Domain & Deployment
- Production Site: `https://codezap.in`
- API Proxy: Vercel serverless function rewrite `/api/*` to FastAPI backend; in local dev, Vite proxies `/api` to `localhost:8000`.

## Design System
- Dark IDE aesthetic: near-black (`#0d1117` GitHub-style) + electric teal primary
- Light/Dark mode support: via `src/store/theme.ts` pub-sub store + localStorage (`zap-theme`) on `<html class="dark">`
- Fonts: Plus Jakarta Sans (UI) + JetBrains Mono (code/mono)
- Custom CSS tokens in `src/index.css`: `verdict-*`, `diff-*`, `surface-*`, `card-glow`, `sidebar-item`, glassmorphism utilities
- Tailwind CSS extended with status colors and responsive breakpoints

## Feature Flag Management (`src/config/features.ts`)
Centralized, typed feature toggles controllable via environment variables (`VITE_*`) with safe default fallbacks:
- `FEATURES.reels.showLikeButton` (`VITE_FEATURE_REELS_LIKE`, default: `false`)
- `FEATURES.reels.showSolveButton` (`VITE_FEATURE_REELS_SOLVE`, default: `false`)
- `FEATURES.reels.showGuideButton` (`VITE_FEATURE_REELS_GUIDE`, default: `false`)
- `FEATURES.conceptStory.showDeck` (`VITE_FEATURE_CONCEPT_STORY`, default: `false`)
Always gate unreleased or unstable interactive UI experiments through this config.

## Core Features & Subsystems

### 1. Interactive DSA Guides (`src/pages/guide/`)
Curated deep-dive guides for core algorithmic patterns:
- `/guide/sliding-window` — Sliding Window guide with live visualizer
- `/guide/two-pointer` — Two Pointers guide with interactive pointer controls
- Other guides: `/guide/graphs`, `/guide/trees`, `/guide/hashing`, `/guide/sdlc`, `/guide/queues`
- **Focus Mode Engine (`src/hooks/useGuideLogic.ts`)**: Single-problem focus mode with keyboard navigation (`←`/`→`), auto-sidebar synchronization, and question progress counters.

### 2. AlgoReels Micro-Learning (`src/components/reels/`)
Instagram/TikTok-style swipeable algorithmic micro-bites designed for modern attention spans:
- `src/components/reels/AlgoReelsPlayer.tsx`: Vertical swipe & scroll container, keyboard navigation (`ArrowUp`/`ArrowDown`), progress bars, trivia card interactions. Rendered via React `createPortal` to `document.body` for glitch-free fullscreen on mobile viewports.
- `src/components/reels/AlgoReelsTray.tsx`: Horizontal reel preview tray on the home page.
- `src/data/algoReels.ts`: 9 curated topics (Two Pointers, Sliding Window, HashMaps, Binary Search, Trees, Dynamic Programming, Graphs, Bit Manipulation, Sorting/Greedy).
- `src/lib/soundEffects.ts`: Synthesized Web Audio API 8-bit sound effects (zero audio assets, 100% code-driven: pop, success, error, swipe, fanfare).

### 3. 4-Beat Concept Stories (`src/components/guide/ConceptStoryDeck.tsx`)
Narrative-driven 4-card mental model decks:
1. **Disaster**: Real-world catastrophe or engineering constraint
2. **The Trap**: The naive $O(N^2)$ failure
3. **The Epiphany**: Visual spatial trick
4. **The Blueprint**: Reusable boilerplate code formula
- Data: `src/data/conceptStories.ts`
- Gated via `FEATURES.conceptStory.showDeck`

### 4. Contest Arena & CodeWar (`src/pages/`)
- `/contest/:slug` → Contest entry & instructions
- `/contest/:contestId/workspace` → Fullscreen competitive coding IDE (Monaco Editor, multi-language support: Python, C++, Java, C, live testcase runner)
- `/codewar` → Live real-time debugging battleground
- `/contest/:contestId/result` → Detailed submission verdicts and leaderboard

### 5. Admin Suite (`src/pages/admin/`)
- Dashboard, Problem Bank CRUD + JSON/Markdown importer, Contest scheduling, Submissions viewer, Execution audit logs, and Analytics.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Sonner toasts.
- **Backend**: FastAPI (`api/index.py`), SQLAlchemy, PostgreSQL, Python 3.11+.
- **Execution Judge**: Outbound HTTP integration with self-hosted Piston sandbox.
- **Verification**: `pnpm tsc --noEmit` and `pnpm build` must always pass with 0 errors.

