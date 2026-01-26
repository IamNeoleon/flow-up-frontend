export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";

const isBrowser = typeof window !== "undefined";

export const getStoredTheme = (): ThemeMode | null => {
	if (!isBrowser) return null;
	const value = window.localStorage.getItem(STORAGE_KEY);
	if (value === "light" || value === "dark" || value === "system") {
		return value;
	}
	return null;
};

export const getSystemTheme = (): ResolvedTheme => {
	if (!isBrowser) return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const resolveTheme = (theme: ThemeMode): ResolvedTheme => {
	return theme === "system" ? getSystemTheme() : theme;
};

export const applyThemeClass = (theme: ThemeMode) => {
	if (!isBrowser) return;
	const resolved = resolveTheme(theme);
	document.documentElement.classList.toggle("dark", resolved === "dark");
};

export const setStoredTheme = (theme: ThemeMode) => {
	if (!isBrowser) return;
	window.localStorage.setItem(STORAGE_KEY, theme);
};

export const getInitialTheme = (): ThemeMode => {
	return getStoredTheme() ?? "system";
};

export const applyInitialTheme = () => {
	const initial = getInitialTheme();
	applyThemeClass(initial);
	return initial;
};
