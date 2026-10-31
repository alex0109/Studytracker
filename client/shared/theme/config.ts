export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

// Light unless the user picked dark; the system setting is not followed on purpose
export const DEFAULT_THEME: Theme = "light";

export const THEME_COOKIE = "theme";

export const resolveTheme = (value: unknown): Theme =>
  value === "dark" ? "dark" : DEFAULT_THEME;
