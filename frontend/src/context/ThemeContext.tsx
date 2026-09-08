import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type ThemePreset = "ocean" | "violet" | "emerald" | "darcula";

export interface ThemeState {
  preset: ThemePreset;
  buttonColor: string;
  fontName: string;
  fontData: string;
}

export interface ThemeContextValue extends ThemeState {
  setPreset: (preset: ThemePreset) => void;
  setButtonColor: (color: string) => void;
  uploadFont: (file: File) => Promise<void>;
  clearFont: () => void;
  resetTheme: () => void;
}

const STORAGE_KEY = "userflow_theme_prefs_v2";

const defaults: ThemeState = {
  preset: "ocean",
  buttonColor: "",
  fontName: "",
  fontData: ""
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaults, ...parsed };
      }
    } catch {
      // Fallback to defaults
    }
    return defaults;
  });

  const setPreset = useCallback((preset: ThemePreset) => {
    setTheme((prev) => ({ ...prev, preset }));
  }, []);

  const setButtonColor = useCallback((buttonColor: string) => {
    setTheme((prev) => ({ ...prev, buttonColor }));
  }, []);

  const uploadFont = useCallback(async (file: File) => {
    if (!/\.(ttf|otf|woff|woff2)$/i.test(file.name)) {
      throw new Error("Please choose a valid .ttf, .otf, .woff, or .woff2 font file.");
    }
    if (file.size > 2.5 * 1024 * 1024) {
      throw new Error("Font file size must be 2.5MB or smaller.");
    }

    const fontData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read font file."));
      reader.readAsDataURL(file);
    });

    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fontName = `UserFont_${cleanName}`;

    try {
      const face = new FontFace(fontName, `url(${fontData})`);
      await face.load();
      document.fonts.add(face);
      setTheme((prev) => ({ ...prev, fontName, fontData }));
    } catch {
      throw new Error("Could not parse or load the font.");
    }
  }, []);

  const clearFont = useCallback(() => {
    setTheme((prev) => ({ ...prev, fontName: "", fontData: "" }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(defaults);
  }, []);

  // Persist theme state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // Ignore write errors (e.g. Safari private browsing)
    }
  }, [theme]);

  // Rehydrate custom FontFace from base64 on page load
  useEffect(() => {
    if (!theme.fontData || !theme.fontName) return;

    let isMounted = true;
    const face = new FontFace(theme.fontName, `url(${theme.fontData})`);
    face
      .load()
      .then((loaded) => {
        if (isMounted) document.fonts.add(loaded);
      })
      .catch((err) => {
        console.warn("Could not rehydrate font:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [theme.fontData, theme.fontName]);

  // Compose active theme: preset dataset, button color override, and custom font family
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme.preset;

    if (theme.buttonColor) {
      root.style.setProperty("--accent-override", theme.buttonColor);
    } else {
      root.style.removeProperty("--accent-override");
    }

    if (theme.fontName) {
      root.style.setProperty("--font-family", `"${theme.fontName}", Inter, system-ui, sans-serif`);
    } else {
      root.style.removeProperty("--font-family");
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      ...theme,
      setPreset,
      setButtonColor,
      uploadFont,
      clearFont,
      resetTheme
    }),
    [theme, setPreset, setButtonColor, uploadFont, clearFont, resetTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}