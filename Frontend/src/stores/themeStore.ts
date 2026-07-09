import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.add("light");
    } else {
      // System choice
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(isDark ? "dark" : "light");
    }
  };

  return {
    theme: (localStorage.getItem("global-theme") as Theme) || "light",

    setTheme: (theme) => {
      localStorage.setItem("global-theme", theme);
      set({ theme });
      applyTheme(theme);
    },

    initTheme: () => {
      const theme = get().theme;
      applyTheme(theme);

      // Listen to system preference shifts if theme is set to 'system'
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        if (get().theme === "system") {
          applyTheme("system");
        }
      };

      mediaQuery.addEventListener("change", listener);
    },
  };
});
