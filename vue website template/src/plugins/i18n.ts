// src/plugins/i18n.ts (Optimisé et corrigé)
import { App } from "vue";
import { createI18n, type I18nOptions } from "vue-i18n";
import { I18nKey, type CustomI18nUtils } from "../keys/injection";

// Types pour la configuration i18n
export interface I18nConfig {
  locale?: string;
  fallbackLocale?: string;
  legacy?: boolean;
  globalInjection?: boolean;
  messages?: Record<string, any>;
  availableLocales?: string[];
  localeMessages?: Record<string, () => Promise<any>>;
}

export interface CustomI18nPlugin {
  install(app: App): Promise<void>;
  i18n?: any;
}

export const createCustomI18n = (config: I18nConfig = {}): CustomI18nPlugin => {
  let i18nInstance: any = null;

  return {
    async install(app: App) {
      // Configuration par défaut
      const defaultConfig: I18nConfig = {
        locale: "fr",
        fallbackLocale: "en",
        legacy: false,
        globalInjection: true,
        messages: {},
        availableLocales: ["fr", "en", "es"],
        ...config,
      };

      // Chargement dynamique des messages de traduction
      const messages: Record<string, any> = {};

      if (config.localeMessages) {
        // Chargement asynchrone des messages
        for (const [locale, loader] of Object.entries(config.localeMessages)) {
          try {
            messages[locale] = await loader();
          } catch (error) {
            console.warn(`Failed to load locale ${locale}:`, error);
            messages[locale] = {};
          }
        }
      } else {
        // Messages fournis directement
        Object.assign(messages, config.messages || {});
      }

      // Créer l'instance i18n
      const i18nOptions: I18nOptions = {
        legacy: defaultConfig.legacy,
        locale: defaultConfig.locale,
        fallbackLocale: defaultConfig.fallbackLocale,
        globalInjection: defaultConfig.globalInjection,
        messages,
      };

      i18nInstance = createI18n(i18nOptions);

      // Installer le plugin i18n standard AVANT nos utilitaires
      app.use(i18nInstance);

      // Ajouter des méthodes utilitaires avancées
      const i18nUtils: CustomI18nUtils = {
        // Instance i18n pour injection
        instance: i18nInstance,

        // Méthodes utilitaires
        setLocale: (locale: string) => {
          if (defaultConfig.availableLocales?.includes(locale)) {
            i18nInstance.global.locale.value = locale;
            localStorage.setItem("app-locale", locale);

            // Émettre un événement pour réagir au changement
            window.dispatchEvent(
              (() => new CustomEvent("locale-changed", {
                detail: {
                  locale,
                  previousLocale: i18nInstance.global.locale.value,
                },
              }))()
            );
          }
        },

        getLocale: () => i18nInstance.global.locale.value,

        getAvailableLocales: () => defaultConfig.availableLocales || [],

        hasTranslation: (key: string, locale?: string) => {
          return i18nInstance.global.te(key, locale);
        },

        loadLocaleMessages: async (locale: string) => {
          if (!config.localeMessages?.[locale]) return false;

          try {
            const messages = await config.localeMessages[locale]();
            i18nInstance.global.setLocaleMessage(locale, messages);
            return true;
          } catch (error) {
            console.error(`Failed to load locale ${locale}:`, error);
            return false;
          }
        },

        // Formatage de date et nombre avec fallback
        formatDate: (date: Date | number, format?: string, locale?: string) => {
          try {
            return i18nInstance.global.d(date, format, locale);
          } catch (error) {
            console.warn("Date formatting error:", error);
            return (() => new Date(date).toLocaleDateString(
              locale || defaultConfig.locale
            ))();
          }
        },

        formatNumber: (number: number, format?: string, locale?: string) => {
          try {
            return i18nInstance.global.n(number, format, locale);
          } catch (error) {
            console.warn("Number formatting error:", error);
            return (() => number.toLocaleString(locale || defaultConfig.locale))();
          }
        },
      };

      // Exposition via injection avec clé typée
      app.provide(I18nKey, i18nUtils);

      // Aussi disponible globalement pour utilisation avancée
      app.config.globalProperties.$customI18n = i18nUtils;

      // Restaurer la locale depuis localStorage
      const savedLocale = localStorage.getItem("app-locale");
      if (
        savedLocale &&
        defaultConfig.availableLocales?.includes(savedLocale)
      ) {
        i18nUtils.setLocale(savedLocale);
      }

      console.log(
        "✅ Custom i18n plugin initialized with locale:",
        i18nUtils.getLocale()
      );
    },

    get i18n() {
      return i18nInstance;
    },
  };
};
