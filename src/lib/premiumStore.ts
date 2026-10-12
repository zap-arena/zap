import { useEffect, useState } from "react";
import { authStore } from "../store/auth";

const PREMIUM_KEY = "zap_is_premium";
const PREMIUM_PLAN_KEY = "zap_premium_plan";
const PREMIUM_EXPIRES_KEY = "zap_premium_expires_at";
const UPDATE_EVENT_KEY = "zap-premium-status-updated";

export interface PremiumState {
  isPremium: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export function isUserPremium(): boolean {
  // Check authStore user first
  const user = authStore.getUser();
  if (user?.isPremium) return true;

  // Fallback to local storage (for persistent guest or fast client cache)
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(PREMIUM_KEY);
    return val === "true";
  }
  return false;
}

export function getPremiumPlan(): string | null {
  const user = authStore.getUser();
  if (user?.premiumPlan) return user.premiumPlan;
  if (typeof window !== "undefined") {
    return localStorage.getItem(PREMIUM_PLAN_KEY);
  }
  return null;
}

export function setLocalPremium(planId: string, durationDays: number = 30): void {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + durationDays);

  localStorage.setItem(PREMIUM_KEY, "true");
  localStorage.setItem(PREMIUM_PLAN_KEY, planId);
  localStorage.setItem(PREMIUM_EXPIRES_KEY, expires.toISOString());

  // Also update auth user if present
  const user = authStore.getUser();
  if (user) {
    authStore.setUser({
      ...user,
      isPremium: true,
      premiumPlan: planId,
      premiumExpiresAt: expires.toISOString(),
    });
  }

  window.dispatchEvent(
    new CustomEvent(UPDATE_EVENT_KEY, {
      detail: { isPremium: true, plan: planId, expiresAt: expires.toISOString() },
    })
  );
}

export function clearLocalPremium(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREMIUM_KEY);
  localStorage.removeItem(PREMIUM_PLAN_KEY);
  localStorage.removeItem(PREMIUM_EXPIRES_KEY);

  const user = authStore.getUser();
  if (user) {
    authStore.setUser({
      ...user,
      isPremium: false,
      premiumPlan: undefined,
      premiumExpiresAt: undefined,
    });
  }

  window.dispatchEvent(
    new CustomEvent(UPDATE_EVENT_KEY, {
      detail: { isPremium: false, plan: null, expiresAt: null },
    })
  );
}

export function usePremiumStatus(): PremiumState {
  const [state, setState] = useState<PremiumState>(() => ({
    isPremium: isUserPremium(),
    plan: getPremiumPlan(),
    expiresAt: typeof window !== "undefined" ? localStorage.getItem(PREMIUM_EXPIRES_KEY) : null,
  }));

  useEffect(() => {
    const handleUpdate = () => {
      setState({
        isPremium: isUserPremium(),
        plan: getPremiumPlan(),
        expiresAt: localStorage.getItem(PREMIUM_EXPIRES_KEY),
      });
    };

    window.addEventListener(UPDATE_EVENT_KEY, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    const unsubscribeAuth = authStore.subscribe(handleUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT_KEY, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      unsubscribeAuth();
    };
  }, []);

  return state;
}
