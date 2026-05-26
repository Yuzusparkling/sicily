import { createContext, ReactNode, useEffect } from "react";

const ThemeContext = createContext<{ theme: string }>({ theme: "dark" });

export function ThemeProvider({ children, defaultTheme = "dark" }: { children: ReactNode; defaultTheme?: string }) {
  useEffect(() => {
    document.documentElement.classList.add(defaultTheme);
  }, [defaultTheme]);
  return <ThemeContext.Provider value={{ theme: defaultTheme }}>{children}</ThemeContext.Provider>;
}
