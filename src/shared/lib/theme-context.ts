import { createContext, useContext } from "react";
import type { ResolvedTheme, ThemeMode } from "./theme";

export type ThemeContextValue = {
	theme: ThemeMode;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}
	return ctx;
};

export { ThemeContext };
