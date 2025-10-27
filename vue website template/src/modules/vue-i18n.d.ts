// src/types/vue-i18n.d.ts (Corrigé et simplifié)
import { ComponentCustomProperties } from "vue";
import type { CustomI18nUtils } from "../keys/injection";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    // ✅ Fonctions de traduction (vue-i18n standard) - Disponibles partout
    $t: (key: string, values?: Record<string, any>) => string;
    $te: (key: string) => boolean;
    $d: (value: Date | number, format?: string) => string;
    $n: (value: number, format?: string) => string;

    // ✅ Instance i18n complète (vue-i18n standard)
    $i18n: {
      locale: { value: string };
      availableLocales: string[];
      fallbackLocale: { value: string };
      t: (key: string, values?: Record<string, any>) => string;
      te: (key: string) => boolean;
      d: (date: Date | number, format?: string) => string;
      n: (number: number, format?: string) => string;
    };

    // ✅ Utilitaires custom (notre plugin) - Pour fonctionnalités avancées
    $customI18n: CustomI18nUtils;
  }
}
