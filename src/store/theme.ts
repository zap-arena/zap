import { useState, useEffect } from "react";

const STORAGE_KEY = "zap-theme";
const ACCENT_KEY = "zap-accent";

type Theme = "dark" | "light";

const getInitial = (): Theme => {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "dark";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  localStorage.setItem(STORAGE_KEY, theme);
};

// Apply immediately on load (avoids flash)
applyTheme(getInitial());

let _theme: Theme = getInitial();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const themeStore = {
  get: () => _theme,
  toggle: () => {
    _theme = _theme === "dark" ? "light" : "dark";
    applyTheme(_theme);
    applyAccent(_accent); // re-apply so the accent picks the new mode's shade
    notify();
  },
  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(themeStore.get());
  useEffect(() => themeStore.subscribe(() => setTheme(themeStore.get())), []);
  return { theme, toggle: themeStore.toggle };
};

/* ── Accent (theme) color ─────────────────────────────────────
   Overrides the `--primary` family of CSS variables inline on the
   root element so a single selection recolours every component that
   uses `--primary`, `--ring`, `--gradient-*` or `--shadow-glow`.
   Each accent carries a light + dark shade (shadcn palette). */

export type AccentId =
  | "slate"
  | "red"
  | "rose"
  | "orange"
  | "amber"
  | "yellow"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "violet"
  | "fuchsia";

interface Shade {
  /** "H S% L%" triple for --primary */
  primary: string;
  /** "H S% L%" triple for --primary-foreground */
  fg: string;
}

export interface Accent {
  id: AccentId;
  label: string;
  /** Swatch dot shown in the picker */
  dot: { h: number; s: number; l: number };
  light: Shade;
  dark: Shade;
}

export const ACCENTS: Accent[] = [
  {
    id: "slate",
    label: "Slate",
    dot: { h: 215, s: 20, l: 47 },
    light: { primary: "222.2 47.4% 11.2%", fg: "210 40% 98%" },
    dark: { primary: "210 40% 98%", fg: "222.2 47.4% 11.2%" },
  },
  {
    id: "red",
    label: "Red",
    dot: { h: 0, s: 72, l: 51 },
    light: { primary: "0 72.2% 50.6%", fg: "0 85.7% 97.3%" },
    dark: { primary: "0 72.2% 50.6%", fg: "0 85.7% 97.3%" },
  },
  {
    id: "rose",
    label: "Rose",
    dot: { h: 347, s: 77, l: 50 },
    light: { primary: "346.8 77.2% 49.8%", fg: "355.7 100% 97.3%" },
    dark: { primary: "346.8 77.2% 49.8%", fg: "355.7 100% 97.3%" },
  },
  {
    id: "orange",
    label: "Orange",
    dot: { h: 25, s: 95, l: 53 },
    light: { primary: "24.6 95% 53.1%", fg: "60 9.1% 97.8%" },
    dark: { primary: "20.5 90.2% 48.2%", fg: "60 9.1% 97.8%" },
  },
  {
    id: "amber",
    label: "Amber",
    dot: { h: 38, s: 92, l: 50 },
    light: { primary: "37.7 92.1% 50.2%", fg: "26 83.3% 14.1%" },
    dark: { primary: "37.7 92.1% 50.2%", fg: "26 83.3% 14.1%" },
  },
  {
    id: "yellow",
    label: "Yellow",
    dot: { h: 48, s: 96, l: 53 },
    light: { primary: "47.9 95.8% 53.1%", fg: "26 83.3% 14.1%" },
    dark: { primary: "47.9 95.8% 53.1%", fg: "26 83.3% 14.1%" },
  },
  {
    id: "green",
    label: "Green",
    dot: { h: 142, s: 71, l: 45 },
    light: { primary: "142.1 76.2% 36.3%", fg: "355.7 100% 97.3%" },
    dark: { primary: "142.1 70.6% 45.3%", fg: "144.9 80.4% 10%" },
  },
  {
    id: "emerald",
    label: "Emerald",
    dot: { h: 160, s: 84, l: 39 },
    light: { primary: "160.1 84.1% 39.4%", fg: "210 40% 98%" },
    dark: { primary: "160.1 84.1% 39.4%", fg: "210 40% 98%" },
  },
  {
    id: "teal",
    label: "Teal",
    dot: { h: 173, s: 80, l: 40 },
    light: { primary: "173.4 80.4% 40%", fg: "210 40% 98%" },
    dark: { primary: "173.4 80.4% 40%", fg: "210 40% 98%" },
  },
  {
    id: "cyan",
    label: "Cyan",
    dot: { h: 189, s: 94, l: 43 },
    light: { primary: "188.7 94.5% 42.7%", fg: "210 40% 98%" },
    dark: { primary: "188.7 94.5% 42.7%", fg: "210 40% 98%" },
  },
  {
    id: "blue",
    label: "Blue",
    dot: { h: 221, s: 83, l: 53 },
    light: { primary: "221.2 83.2% 53.3%", fg: "210 40% 98%" },
    dark: { primary: "217.2 91.2% 59.8%", fg: "222.2 47.4% 11.2%" },
  },
  {
    id: "indigo",
    label: "Indigo",
    dot: { h: 239, s: 84, l: 67 },
    light: { primary: "243.4 75.4% 58.6%", fg: "210 40% 98%" },
    dark: { primary: "234.5 89.5% 73.9%", fg: "222.2 47.4% 11.2%" },
  },
  {
    id: "violet",
    label: "Violet",
    dot: { h: 262, s: 83, l: 58 },
    light: { primary: "262.1 83.3% 57.8%", fg: "210 20% 98%" },
    dark: { primary: "263.4 70% 50.4%", fg: "210 20% 98%" },
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    dot: { h: 292, s: 84, l: 58 },
    light: { primary: "292.2 84.1% 60.6%", fg: "210 40% 98%" },
    dark: { primary: "292.2 84.1% 60.6%", fg: "210 40% 98%" },
  },
];

const DEFAULT_ACCENT: AccentId = "blue";

const parseHsl = (v: string) => {
  const [h, s, l] = v.replace(/%/g, "").trim().split(/\s+/).map(Number);
  return { h, s, l };
};

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Accent colour as a hex string (for the Monaco code editor).
export const accentHex = (a: Accent): string =>
  hslToHex(a.dot.h, a.dot.s, a.dot.l);

const applyAccent = (a: Accent) => {
  const root = document.documentElement;
  const shade = _theme === "dark" ? a.dark : a.light;
  const { h, s, l } = parseHsl(shade.primary);
  const glowHue = (h + 16) % 360;
  root.style.setProperty("--primary", shade.primary);
  root.style.setProperty("--primary-foreground", shade.fg);
  root.style.setProperty("--ring", shade.primary);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${h} ${s}% ${l}%), hsl(${glowHue} ${Math.min(s + 6, 100)}% ${Math.min(l + 8, 92)}%))`,
  );
  root.style.setProperty(
    "--gradient-glow",
    `radial-gradient(ellipse at 50% 0%, hsl(${h} ${s}% ${l}% / 0.08) 0%, transparent 70%)`,
  );
  root.style.setProperty(
    "--shadow-glow",
    `0 0 30px hsl(${h} ${s}% ${l}% / 0.2)`,
  );
  localStorage.setItem(ACCENT_KEY, a.id);
};

const getInitialAccent = (): Accent => {
  const id =
    typeof window === "undefined" ? null : localStorage.getItem(ACCENT_KEY);
  return (
    ACCENTS.find((a) => a.id === id) ??
    ACCENTS.find((a) => a.id === DEFAULT_ACCENT)!
  );
};

// Apply immediately on load (avoids flash)
applyAccent(getInitialAccent());

let _accent: Accent = getInitialAccent();
const accentListeners = new Set<() => void>();
const notifyAccent = () => accentListeners.forEach((fn) => fn());

export const accentStore = {
  get: () => _accent,
  set: (id: AccentId) => {
    const next = ACCENTS.find((a) => a.id === id);
    if (!next || next.id === _accent.id) return;
    _accent = next;
    applyAccent(next);
    notifyAccent();
  },
  subscribe: (fn: () => void) => {
    accentListeners.add(fn);
    return () => {
      accentListeners.delete(fn);
    };
  },
};

export const useAccent = () => {
  const [accent, setAccent] = useState<Accent>(accentStore.get());
  useEffect(
    () => accentStore.subscribe(() => setAccent(accentStore.get())),
    [],
  );
  return { accent, setAccent: accentStore.set, accents: ACCENTS };
};
