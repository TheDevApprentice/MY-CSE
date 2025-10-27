// src/composables/useI18n.ts
import { inject } from "vue";
import { useI18n as useVueI18n } from "vue-i18n";
import { I18nKey, type CustomI18nUtils } from "@/keys/injection";

/**
 * Composable pour utiliser i18n dans les scripts
 * Combine vue-i18n standard + nos utilitaires custom
 */
export function useI18n() {
  // Vue i18n standard (pour $t, $te, etc.)
  const { t, te, d, n, locale, availableLocales } = useVueI18n();

  // Nos utilitaires custom
  const customI18n = inject(I18nKey);

  if (!customI18n) {
    throw new Error(
      "CustomI18n plugin not found. Make sure it's installed correctly."
    );
  }

  return {
    // Fonctions vue-i18n standard
    t,
    te,
    d,
    n,
    locale,
    availableLocales,

    // Nos utilitaires custom
    setLocale: customI18n.setLocale,
    getLocale: customI18n.getLocale,
    getAvailableLocales: customI18n.getAvailableLocales,
    hasTranslation: customI18n.hasTranslation,
    loadLocaleMessages: customI18n.loadLocaleMessages,
    formatDate: customI18n.formatDate,
    formatNumber: customI18n.formatNumber,

    // Instance complète si besoin
    instance: customI18n.instance,
  };
}

/**
 * Version légère pour n'utiliser que les fonctions de base
 */
export function useTranslation() {
  const { t, te } = useVueI18n();
  return { t, te };
}
