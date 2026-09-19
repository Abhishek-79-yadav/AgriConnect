import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// Applies a "dark" class to <html>, which flips the CSS variables defined
// in index.css (--color-ink/paper/card/line) — since every page already
// uses those semantic tokens (bg-paper, text-ink, bg-card, border-line)
// instead of raw colors, this alone reskins the whole app.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
