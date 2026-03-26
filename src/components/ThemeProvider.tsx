"use client";

import { createContext, useContext, useEffect, useState, ReactNode, startTransition } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<{ theme: Theme; mounted: boolean }>({
        theme: "light",
        mounted: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem("titan-theme") as Theme;
        let initial: Theme;

        if (saved) {
            initial = saved;
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            initial = prefersDark ? "dark" : "light";
        }

        document.documentElement.setAttribute("data-theme", initial);
        startTransition(() => {
            setState({ theme: initial, mounted: true });
        });
    }, []);

    const toggleTheme = () => {
        const next = state.theme === "light" ? "dark" : "light";
        startTransition(() => {
            setState((prev) => ({ ...prev, theme: next }));
        });
        localStorage.setItem("titan-theme", next);
        document.documentElement.setAttribute("data-theme", next);
    };

    if (!state.mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
