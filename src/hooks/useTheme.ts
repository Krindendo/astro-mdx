import * as React from "react";

const colorSchemes = ["light", "dark", "system"];
const MEDIA = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "theme";

export type SystemThemeMode = "light" | "dark";
export type ThemeMode = "light" | "dark" | "system";

type ThemeModeOptions = {
  defaultValue?: ThemeMode;
};

type ThemeModeResult = {
  themes: string[];
  theme: ThemeMode;
  systemTheme: SystemThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
};

export function useTheme(options?: ThemeModeOptions): ThemeModeResult {
  const [theme, setThemeState] = React.useState<ThemeMode>(() =>
    getTheme(LOCAL_STORAGE_KEY, "system")
  );
  const [systemTheme, setSystemTheme] = React.useState<SystemThemeMode>(() =>
    getSystemTheme()
  );

  const applyTheme = React.useCallback((theme: ThemeMode) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === "system") {
      resolved = getSystemTheme();
    }

    const d = document.documentElement;
    d.classList.remove(...colorSchemes);

    if (resolved) {
      d.classList.add(resolved);
    }

    const colorScheme = colorSchemes.includes(resolved) ? resolved : "system";
    // @ts-ignore
    d.style.colorScheme = colorScheme;

    disableAnimation();
  }, []);

  const setTheme = React.useCallback((theme: ThemeMode) => {
    setThemeState(theme);

    // Save to storage
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, theme);
    } catch (e) {
      // Unsupported
    }
  }, []);

  const handleMediaQuery = React.useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      const resolved = getSystemTheme();
      setSystemTheme(resolved);

      if (theme === "system") {
        applyTheme("system");
      }
    },
    [theme]
  );

  // localStorage event handling
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== LOCAL_STORAGE_KEY) {
        return;
      }
      let theme: ThemeMode = "system";
      if (e.newValue && colorSchemes.includes(e.newValue)) {
        theme = e.newValue as ThemeMode;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme]);

  // Whenever theme or forcedTheme changes, apply it
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Always listen to System preference
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  const isDarkMode =
    theme === "dark" || (theme === "system" && getSystemTheme() === "dark");

  return {
    isDarkMode,
    theme,
    systemTheme,
    themes: colorSchemes,
    setTheme,
  };
}

// Helpers
const getTheme = (key: string, fallback?: string) => {
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (error) {
    // Unsupported
    console.error(error);
  }
  return (theme || fallback) as ThemeMode;
};

const getSystemTheme = () => {
  const isDark = window.matchMedia(MEDIA).matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

const disableAnimation = () => {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
    )
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};
