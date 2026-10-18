/**
 * Global Feature Flag Management System
 * Centralized feature toggles controllable via environment variables (VITE_*)
 * with fallback defaults for local/production environments.
 */

const parseEnvBool = (
  val: string | undefined,
  defaultValue: boolean,
): boolean => {
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
  courses: {
    /** Show interactive trivia games & quizzes in courses/guides (default: true) */
    showTrivia: boolean;
  };
}

/**
 * Feature flag registry.
 * Flags default to false until backend endpoints or redirects are ready.
 */
export const FEATURES: FeatureFlags = {
  reels: {
    showLikeButton: parseEnvBool(
      import.meta.env.VITE_FEATURE_REELS_LIKE,
      false,
    ),
    showSolveButton: parseEnvBool(
      import.meta.env.VITE_FEATURE_REELS_SOLVE,
      false,
    ),
    showGuideButton: parseEnvBool(
      import.meta.env.VITE_FEATURE_REELS_GUIDE,
      false,
    ),
  },
  conceptStory: {
    showDeck: parseEnvBool(import.meta.env.VITE_FEATURE_CONCEPT_STORY, false),
  },
  courses: {
    showTrivia: parseEnvBool(
      import.meta.env.VITE_FEATURE_COURSES_TRIVIA,
      false,
    ),
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

/**
 * Dynamic helper for courses trivia flag with optional localStorage override for local experimentation
 */
export function isTriviaFeatureEnabled(): boolean {
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("zap_feature_courses_trivia");
    if (override !== null) {
      return override === "true";
    }
  }
  return FEATURES.courses.showTrivia;
}

export function setTriviaFeatureOverride(enabled: boolean | null): void {
  if (typeof window === "undefined") return;
  if (enabled === null) {
    localStorage.removeItem("zap_feature_courses_trivia");
  } else {
    localStorage.setItem("zap_feature_courses_trivia", String(enabled));
  }
}
