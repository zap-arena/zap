/**
 * Global Feature Flag Management System
 * Centralized feature toggles controllable via environment variables (NEXT_PUBLIC_*)
 * with fallback defaults for local/production environments.
 */

const parseEnvBool = (val: string | undefined, defaultValue: boolean): boolean => {
  if (val === undefined || val === "") return defaultValue;
  return val.toLowerCase() === "true" || val === "1";
};

export interface FeatureFlags {
  reels: {
    /** Show like reaction button on reels (default: false) */
    showLikeButton: boolean;
    /** Show problem solver / visualizer button on reels (default: false) */
    showSolveButton: boolean;
    /** Show full curriculum guide deep-link button on reels (default: false) */
    showGuideButton: boolean;
  };
  conceptStory: {
    /** Show 4-beat concept story deck on guide pages (default: false) */
    showDeck: boolean;
  };
}

/**
 * Feature flag registry.
 * Flags default to false until backend endpoints or redirects are ready.
 */
export const FEATURES: FeatureFlags = {
  reels: {
    showLikeButton: parseEnvBool(process.env.NEXT_PUBLIC_FEATURE_REELS_LIKE, false),
    showSolveButton: parseEnvBool(process.env.NEXT_PUBLIC_FEATURE_REELS_SOLVE, false),
    showGuideButton: parseEnvBool(process.env.NEXT_PUBLIC_FEATURE_REELS_GUIDE, false),
  },
  conceptStory: {
    showDeck: parseEnvBool(process.env.NEXT_PUBLIC_FEATURE_CONCEPT_STORY, false),
  },
};

/**
 * Helper utility to query feature status dynamically
 */
export function isFeatureEnabled<K extends keyof FeatureFlags>(
  category: K,
  key: keyof FeatureFlags[K],
): boolean {
  return Boolean(FEATURES[category]?.[key]);
}
