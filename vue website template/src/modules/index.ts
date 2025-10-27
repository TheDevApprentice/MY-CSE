// src/types/index.ts (Fichier principal qui exporte tout)
// Ce fichier peut servir à centraliser tous les types si tu préfères

export type { CustomI18nUtils } from "../keys/injection";

export interface LocaleConfig {
  locale: string;
  fallback: string;
  available: readonly string[];
}