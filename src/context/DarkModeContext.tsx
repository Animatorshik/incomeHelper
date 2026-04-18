import React, { createContext, useContext, useState, useEffect } from 'react';

type DarkModeContextType = {
    isDark: boolean;
    toggle: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({ isDark: false, toggle: () => undefined });

export const useDarkMode = () => useContext(DarkModeContext);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    const toggle = () => setIsDark((prev) => !prev);

    return (
        <DarkModeContext.Provider value={{ isDark, toggle }}>
            {children}
        </DarkModeContext.Provider>
    );
}
