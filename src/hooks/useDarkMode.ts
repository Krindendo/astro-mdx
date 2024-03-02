import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "dark-mode";

export type ThemeMode = "system" | "dark" | "light";

type DarkModeOptions = {
  defaultValue?: DarkMode;
};

type ThemeModeResult = {
  isDarkMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: Dispatch<SetStateAction<ThemeMode>>;
};

export function useDarkMode(options?: ThemeModeOptions): ThemeModeResult {
  const defaultValue = options?.defaultValue ?? "system";

  const isDarkOS = window.matchMedia(COLOR_SCHEME_QUERY).matches;
  const [mode, setMode] = useLocalStorage(LOCAL_STORAGE_KEY, defaultValue);

  const isDarkMode = mode === "dark" || (mode === "system" && isDarkOS);

  if (isDarkMode) {
    window.document.documentElement.classList.add("dark");
  } else {
    window.document.documentElement.classList.remove("dark");
  }

  return {
    isDarkMode,
    darkMode: mode,
    setDarkMode: setMode,
  };
}

/*
  const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })();

  if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  window.localStorage.setItem("theme", theme);

  //"light" | "dark" | "system"
  const setTheme = (theme) => {
    const element = document.documentElement;
    if (theme === "system") {
      theme = "light";
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      }
    }

    if (theme === "dark") {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }

    const isDark = element.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  document.getElementById("select-light").addEventListener("click", () => {
    setTheme("light");
  });
  document.getElementById("select-dark").addEventListener("click", () => {
    setTheme("dark");
  });
  document.getElementById("select-system").addEventListener("click", () => {
    setTheme("system");
  });

*/
