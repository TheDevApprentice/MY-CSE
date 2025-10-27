<template>
  <div class="relative group z-50">
    <button
      @click="showDropdown = !showDropdown"
      type="button"
      class="flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
      :class="[
        isDark
          ? 'bg-gray-800/70 border-gray-700 shadow-lg hover:bg-gray-800/90 hover:shadow-xl'
          : 'bg-white/70 border-gray-200 shadow-lg hover:bg-white/90 hover:shadow-xl',
        'backdrop-blur-[6px] hover:-translate-y-0.5',
      ]"
      :aria-label="$t('language.switch')"
      :aria-expanded="showDropdown"
      aria-haspopup="true"
    >
      <CountryFlag
        :country="currentLocale.flag"
        size="normal"
        class="absolute top-[1.3rem] left-[2.04rem] -translate-x-1/2 -translate-y-1/2 object-cover rounded-[5px] shadow border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
      />
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 min-w-[180px] py-2 px-1 rounded-3xl z-50 flex flex-col backdrop-blur-[8px] shadow-2xl border transition-all duration-200"
        :class="[
          isDark
            ? 'bg-gray-900/80 border-white/20 ring-1 ring-white/10'
            : 'bg-white/80 border-white/60 ring-1 ring-black/10',
        ]"
        style="box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.13)"
        role="menu"
        aria-orientation="vertical"
      >
        <template v-for="(locale, idx) in availableLocales" :key="locale.code">
          <button
            @click="changeLanguage(locale.code)"
            class="flex items-center gap-3 w-full px-4 py-2 text-base text-left rounded-2xl transition-all duration-150"
            :class="[
              'backdrop-blur-sm',
              locale.code === currentLocale.code
                ? isDark
                  ? 'bg-blue-900/60 text-blue-200 font-semibold shadow-sm'
                  : 'bg-blue-100/70 text-blue-700 font-semibold shadow-sm'
                : isDark
                ? 'text-gray-200 hover:bg-white/10 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700',
            ]"
            role="menuitem"
          >
            <CountryFlag
              :country="locale.flag"
              size="normal"
              class="relative bottom-[0.3rem] object-cover"
            />
            <span class="flex-1 text-center">{{ locale.name }}</span>
            <svg
              v-if="locale.code === currentLocale.code"
              class="ml-2 w-5 h-5 text-blue-500 dark:text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <div
            v-if="idx < availableLocales.length - 1"
            class="mx-4 my-1 h-px bg-gray-200 dark:bg-gray-700"
          ></div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import CountryFlag from "vue-country-flag-next";
import { useTheme } from "@/composables/useTheme";
import { useI18n } from "@/composables/useI18n";

// ===== COMPOSABLES =====
const { isDark } = useTheme();
const { t, setLocale, getLocale, getAvailableLocales } = useI18n();

// ===== ÉTAT LOCAL =====
const showDropdown = ref(false);

// ===== CONFIGURATION DES LANGUES =====
// Configuration des langues disponibles avec leurs drapeaux et noms
const localesConfig = {
  fr: { code: "fr", name: "Français", flag: "FR" },
  en: { code: "en", name: "English", flag: "GB" },
  es: { code: "es", name: "Español", flag: "ES" },
} as const;

// ===== COMPUTED =====
// Obtenir la liste des langues disponibles depuis notre plugin
const availableLocalesCodes = computed(() => getAvailableLocales());

// Filtrer et mapper les langues disponibles avec leur configuration
const availableLocales = computed(() =>
  availableLocalesCodes.value
    .filter((code) => code in localesConfig)
    .map((code) => localesConfig[code as keyof typeof localesConfig])
);

// Locale actuelle avec configuration
const currentLocale = computed(() => {
  const currentCode = getLocale();
  return (
    localesConfig[currentCode as keyof typeof localesConfig] || localesConfig.fr
  );
});

// ===== MÉTHODES =====
// Changer de langue en utilisant notre plugin
const changeLanguage = (newLocale: string) => {
  const currentCode = getLocale();

  if (newLocale !== currentCode) {
    // Utiliser la méthode de notre plugin pour changer la langue
    setLocale(newLocale);

    // Fermer le dropdown
    showDropdown.value = false;

    // Mettre à jour l'attribut lang sur la balise html
    document.documentElement.lang = newLocale;

    // Log pour debug
    console.log(`🌍 Language changed from ${currentCode} to ${newLocale}`);

    // Émettre un événement personnalisé pour d'autres composants
    window.dispatchEvent(
      new CustomEvent("language-changed", {
        detail: {
          from: currentCode,
          to: newLocale,
          timestamp: Date.now(),
        },
      })
    );
  } else {
    // Si c'est la même langue, juste fermer le dropdown
    showDropdown.value = false;
  }
};

// Fermer le dropdown quand on clique en dehors
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".group")) {
    showDropdown.value = false;
  }
};

// Gérer la touche Escape
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && showDropdown.value) {
    showDropdown.value = false;
  }
};

// ===== CYCLE DE VIE =====
onMounted(() => {
  // Ajouter les écouteurs d'événements
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);

  // Synchroniser l'attribut lang avec la langue actuelle
  document.documentElement.lang = getLocale();

  // Log de debug
  if (import.meta.env.DEV) {
    console.log("🗣️ LanguageSelector mounted with locale:", getLocale());
    console.log("📋 Available locales:", getAvailableLocales());
  }
});

onUnmounted(() => {
  // Nettoyer les écouteurs d'événements
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
button {
  background: rgba(31, 38, 135, 0.1);
  box-shadow: 0 4px 24px 0 rgba(99, 102, 241, 0.1),
    0 0 40px 8px rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  transition: box-shadow 0.4s cubic-bezier(0.4, 2, 0.6, 1), background 0.3s;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5),
    0 4px 24px 0 rgba(30, 40, 90, 0.14);
  border-color: #3b82f6;
}

button:hover {
  box-shadow: 0 6px 32px 0 rgba(30, 40, 90, 0.2),
    0 2px 12px 0 rgba(30, 40, 90, 0.2);
  filter: brightness(1.04) saturate(1.05);
}

/* Dropdown modern style */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Option hover & active */
button[role="menuitem"] {
  transition: background 0.2s, color 0.2s;
}

button[role="menuitem"]:hover {
  filter: brightness(1.06);
}

/* Flag style */
.w-7.h-5 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
