import React, { createContext, useState, useContext, useCallback } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../style/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  themeMode: "light" | "dark";
  setThemeMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const localTheme =
    (window.localStorage.getItem("theme") as "light" | "dark") || "light";
  const [themeMode, setThemeMode] = useState<"light" | "dark">(localTheme);
  const themeObject = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <StyledThemeProvider theme={themeObject}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  const { themeMode, setThemeMode } = context;
  const toggleTheme = useCallback(() => {
    if (themeMode === "light") {
      setThemeMode("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      setThemeMode("light");
      window.localStorage.setItem("theme", "light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeMode]);

  return [themeMode, toggleTheme];
};

export { ThemeProvider, useTheme };
