"use client";
import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext({
    darkMode: false,
    toggleDarkMode: () => { },
});

export const ThemeProvider = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode((prev) => !prev) }}>
            {children}
        </ThemeContext.Provider>
    );
};
