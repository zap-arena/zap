# Feature Flags Governance for ZAP (codezap.in)

## 1. Single Source of Truth
- All feature flags must be defined in `src/config/features.ts`.
- Never create ad-hoc local flags or inline environment checks (`process.env.*`) scattered across UI components.

## 2. Naming & Declaration Schema
- Group flags logically by feature domain:
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
- Environment variables must follow the Next.js public prefix pattern: `NEXT_PUBLIC_FEATURE_<CATEGORY>_<NAME>`.
- Use the helper `parseEnvBool(process.env.NEXT_PUBLIC_..., defaultBoolean)` to ensure falsy and string `'false'` values are handled safely.

## 3. Safe Gating Practice
- When disabling a feature:
  1. Gate the trigger links/buttons: `{FEATURES.<domain>.<flag> && (<Link ... />)}`.
  2. Gate the rendered section or modal: `{FEATURES.<domain>.<flag> && (<Section ... />)}`.
  3. **Preserve the implementation code** — do not delete components or handlers.
- When querying flag status dynamically in functions, use `isFeatureEnabled(category, key)`.

