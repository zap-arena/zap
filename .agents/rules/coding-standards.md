# Coding Standards & Feature Flags Rules for ZAP (codezap.in)

## 1. Strict TypeScript & Quality Standards
- `tsconfig.json` has `noUnusedLocals` and `noUnusedParameters` enabled with Next.js TypeScript plugin.
- Never leave unused imports, unreferenced variables, or unhandled types.
- Always run `pnpm tsc --noEmit` and `pnpm build` before completing any task.
- Code should pass with 0 errors.

## 2. Next.js 15 App Router & SSR Safety
- **Client Directive**: Add `"use client"` at the very top of all interactive view components, hooks, visualizers, and stateful widgets.
- **SSR Global Access**: Never access `window`, `document`, `localStorage`, or `sessionStorage` in module scope or during initial render. Always gate behind `typeof window !== "undefined"` or run inside `useEffect()`.
- **Navigation**: Always use `next/link` (`<Link href="...">`) and `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`, `useParams`). Never import `react-router` or `react-router-dom`.
- **Heavy Client Libraries**: Dynamically import browser-only libraries (e.g., Monaco Editor, Leaflet) using `dynamic(() => import(...), { ssr: false })`.

## 3. Feature Flags System (`src/config/features.ts`)
- All experimental, canary, or WIP features **must** be declared and managed in `src/config/features.ts`.
- Declare feature flags in `FeatureFlags` with environment variable overrides (`process.env.NEXT_PUBLIC_*`) and default to `false`.
- When disabling or hiding features, gate both navigation triggers (sidebar links, buttons) and rendered DOM sections using `FEATURES.<category>.<flag> && (...)`.
- Never delete working experimental code; preserve it behind feature flags so it can be re-enabled instantly.

## 4. Safe Development Commands
- Typecheck: `pnpm tsc --noEmit`
- Production Build: `pnpm build`
- Frontend Dev Server: `pnpm run dev --port 5173`
- Backend Dev Server: `cd api && .venv/bin/uvicorn index:app --reload --port 8000`

