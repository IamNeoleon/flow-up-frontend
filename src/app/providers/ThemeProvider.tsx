import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext } from "@/shared/lib/theme-context";
import {
	applyThemeClass,
	getInitialTheme,
	getSystemTheme,
	resolveTheme,
	setStoredTheme,
	type ThemeMode
} from "@/shared/lib/theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
	const resolvedTheme = resolveTheme(theme);

	useEffect(() => {
		applyThemeClass(theme);
		setStoredTheme(theme);
	}, [theme]);

	useEffect(() => {
		if (theme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			const systemTheme = getSystemTheme();
			document.documentElement.classList.toggle("dark", systemTheme === "dark");
		};
		media.addEventListener("change", handleChange);
		return () => media.removeEventListener("change", handleChange);
	}, [theme]);

	const value = useMemo(
		() => ({ theme, resolvedTheme, setTheme }),
		[theme, resolvedTheme]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
