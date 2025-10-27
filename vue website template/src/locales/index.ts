// src/locales/index.ts (Optimisé)
export const localeMessages = {
  fr: () => import("./fr.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
  es: () => import("./es.json").then((m) => m.default),
};

// Configuration des langues disponibles avec leurs drapeaux et noms
export const localesDefault = {
  fr: { code: "fr", name: "Français", flag: "FR" },
  en: { code: "en", name: "English", flag: "GB" },
  es: { code: "es", name: "Español", flag: "ES" },
} as const;

// Configuration des locales disponibles
export const localeConfig = {
  availableLocales: ["fr", "en", "es"] as const,
  defaultLocale: "fr" as const,
  fallbackLocale: "en" as const,
  globalInjection: true,
  legacy: false,
};

// Types pour les locales (optionnel mais utile)
export type AvailableLocale = (typeof localeConfig.availableLocales)[number];
