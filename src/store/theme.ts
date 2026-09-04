import { useState, useEffect } from "react";

const STORAGE_KEY = "zap-theme";

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
