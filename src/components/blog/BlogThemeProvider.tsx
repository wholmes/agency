"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const BlogThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useBlogTheme() {
  return useContext(BlogThemeContext);
}

const STORAGE_KEY = "bmc-blog-theme";

export default function BlogThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const resolved = stored === "light" ? "light" : "dark";
    setTheme(resolved);
    document.documentElement.setAttribute("data-blog-theme", resolved);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-blog-theme", next);
  };

  return (
    <BlogThemeContext.Provider value={{ theme, toggle }}>
      <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 150ms" }}>
        {children}
      </div>
    </BlogThemeContext.Provider>
  );
}
