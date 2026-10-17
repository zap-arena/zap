# 🤖 Agent Guidelines & Coding Standards for ZAP (codezap.in)

Welcome, AI Agent! This file is your operational manual when working on the **ZAP** codebase (`https://codezap.in`).

> **Note on Customization Roots**:  
> In Antigravity / modern AI agents, this root `AGENTS.md` file is automatically loaded as a project-wide rule. If modular skills (`skills/<skill_name>/SKILL.md`) or granular rules (`rules/*.md`) are required in the future, they can be placed in `.agents/` relative to this root.

---

## 1. Core Principles & Philosophy

1. **Tinker-First Active Pedagogy**:
   - Never replace interactive simulations with long static walls of text.
   - Ground DSA concepts in spatial, visual, and state-manipulating UI components.
   - Respect the 4-Beat Story model: Disaster → The Trap → The Epiphany → The Blueprint.

2. **Zero Breaking Changes**:
   - Do not delete experimental or WIP features. Instead, gate them cleanly using `src/config/features.ts`.
   - Ensure light mode and dark mode both look gorgeous and legible with proper contrast.
   - Maintain mobile responsiveness: test at small viewports (e.g. 390px / Pixel / iPhone) as well as desktop.

3. **Strict TypeScript & Build Standards**:
   - `tsconfig.app.json` has `noUnusedLocals` and `noUnusedParameters` enabled.
   - Never leave unused imports, variables, or unhandled types.
   - Always run `pnpm tsc --noEmit` and `pnpm build` to verify every change before finishing.

---

## 2. Feature Flags System (`src/config/features.ts`)

All experimental, canary, or WIP features **must** be declared and managed in [`src/config/features.ts`](src/config/features.ts):

```typescript
export interface FeatureFlags {
  reels: {
    showLikeButton: boolean;
    showSolveButton: boolean;
    showGuideButton: boolean;
  };
  conceptStory: {
    showDeck: boolean;
  };
}
```

- When adding a new feature, declare it in `FeatureFlags` with a `VITE_*` environment variable parser and a default value (default to `false` if not yet fully live).
- When disabling a feature, gate both the navigation triggers (sidebar links, buttons) and the rendered DOM sections using `FEATURES.<category>.<flag> && (...)`.

---

## 3. Directory Layout & Key Locations

| Directory / File | Description |
|---|---|
| `src/config/features.ts` | Centralized feature flag manager. |
| `src/components/reels/` | `AlgoReelsPlayer.tsx` & `AlgoReelsTray.tsx` — mobile-friendly reels with vertical gestures and audio feedback. |
| `src/components/guide/` | `ConceptStoryDeck.tsx`, algorithm visualizers (Sliding Window, Two Pointer, Trees, Graphs). |
| `src/data/algoReels.ts` | 9 curated reels with trivia questions, time/space complexities, and pattern advice. |
| `src/data/conceptStories.ts` | Curated 4-beat story decks for foundational algorithms. |
| `src/hooks/useGuideLogic.ts` | Focus-mode navigation engine for guide pages. |
| `src/lib/soundEffects.ts` | Code-only 8-bit sound effects synthesizer using the Web Audio API (zero audio files needed). |
| `src/pages/guide/` | DSA interactive curriculum guide pages. |
| `src/pages/` | `HomePage.tsx`, `ContestWorkspacePage.tsx`, `CodeWarPage.tsx`, etc. |
| `docs/INTERACTIVE_PEDAGOGY.md`| The design theory, micro-interaction pillars, and educational roadmap. |
| `docs/dev-to-blog.md` | Public announcement article in Dev.to markdown format. |

---

## 4. UI & Interaction Guidelines

- **Mobile Viewports**:
  - Fullscreen overlays (like `AlgoReelsPlayer`) must use `createPortal(..., document.body)` to escape any parent CSS `contain`, `transform`, or `overflow: hidden` restrictions.
  - Implement touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) for swipe gestures.
- **Audio Feedback**:
  - Always check user gesture context before playing audio. Use `soundEffects.play(...)` from `src/lib/soundEffects.ts`.
- **Light & Dark Mode**:
  - Use semantic Tailwind classes (e.g., `bg-background text-foreground border-border`) or custom theme tokens. Avoid hardcoded hex colors that fail in light mode.

---

## 5. Development & Verification Commands

```bash
# Typecheck
pnpm tsc --noEmit

# Production build
pnpm build

# Start frontend dev server
pnpm run dev --port 5115

# Start backend dev server
cd api && .venv/bin/uvicorn index:app --reload --port 8000
```
