// src/keys/injection.ts - Types corrigés et complets
import { type InjectionKey } from "vue";
import type { gsap as GSAPType } from "gsap";

// Interface pour nos utilitaires i18n custom
export interface CustomI18nUtils {
  instance: any;
  setLocale: (locale: string) => void;
  getLocale: () => string;
  getAvailableLocales: () => string[];
  hasTranslation: (key: string, locale?: string) => boolean;
  loadLocaleMessages: (locale: string) => Promise<boolean>;
  formatDate: (date: Date | number, format?: string, locale?: string) => string;
  formatNumber: (number: number, format?: string, locale?: string) => string;
}

// Clés d'injection typées
export const I18nKey: InjectionKey<CustomI18nUtils> = Symbol("i18n");