# Coding Standards & Feature Flags Rules for ZAP (codezap.in)

## 1. Strict TypeScript & Quality Standards
- `tsconfig.app.json` has `noUnusedLocals` and `noUnusedParameters` enabled.
- Never leave unused imports, unreferenced variables, or unhandled types.
- Always run `pnpm tsc --noEmit` and `pnpm build` before completing any task.
- Code should pass with 0 errors.

## 2. Feature Flags System (`src/config/features.ts`)
- All experimental, canary, or WIP features **must** be declared and managed in `src/config/features.ts`.
- Declare feature flags in `FeatureFlags` with environment variable overrides (`VITE_*`) and default to `false`.
- When disabling or hiding features, gate both navigation triggers (sidebar links, buttons) and rendered DOM sections using `FEATURES.<category>.<flag> && (...)`.
- Never delete working experimental code; preserve it behind feature flags so it can be re-enabled instantly.

## 3. Safe Development Commands
- Typecheck: `pnpm tsc --noEmit`
- Production Build: `pnpm build`
- Frontend Dev Server: `pnpm run dev --port 5173`
- Backend Dev Server: `cd api && .venv/bin/uvicorn index:app --reload --port 8000`
