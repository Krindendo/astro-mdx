import * as React from "react";

const colorSchemes = ["light", "dark", "system"];
const MEDIA = "(prefers-color-scheme: dark)";
const LOCAL_STORAGE_KEY = "theme";

export type ThemeMode = "light" | "dark" | "system";

type ThemeModeOptions = {
  defaultValue?: ThemeMode;
};

type ThemeModeResult = {
  themes: string[];
  theme?: string;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
};

export function useTheme(options?: ThemeModeOptions): ThemeModeResult {
  const [theme, setThemeState] = React.useState(() =>
    getTheme(LOCAL_STORAGE_KEY, "system")
  );
  const [resolvedTheme, setResolvedTheme] = React.useState(() =>
    getTheme(LOCAL_STORAGE_KEY)
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

    //disableAnimation()
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
      setResolvedTheme(resolved);

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
    themes: colorSchemes,
    setTheme,
  };
}

const getTheme = (key: string, fallback?: string) => {
  let theme;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (e) {
    // Unsupported
  }
  return (theme || fallback) as ThemeMode;
};

const getSystemTheme = () => {
  const isDark = window.matchMedia(MEDIA).matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

//const defaultValue = options?.defaultValue ?? "system";

//const isDarkOS = window.matchMedia(COLOR_SCHEME_QUERY).matches;
//const [mode, setMode] = useLocalStorage(LOCAL_STORAGE_KEY, defaultValue);

//const isDarkMode = mode === "dark" || (mode === "system" && isDarkOS);

// if (isDarkMode) {
//   window.document.documentElement.classList.add("dark");
// } else {
//   window.document.documentElement.classList.remove("dark");
// }

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
