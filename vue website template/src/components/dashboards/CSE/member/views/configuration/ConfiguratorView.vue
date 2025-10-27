<!-- components/dashboards/SASS/admin/views/configuration/ConfiguratorView.vue -->
<template>
    <div class="view-header">
      <h1 class="page-title">{{pageTitle}}</h1>
      <p class="page-subtitle">{{pageSubtitle}}</p>
    </div>

    <div class="configurator-content">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Paramètres généraux -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section Thème -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Apparence</h2>

            <div class="space-y-6">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  >Thème</label
                >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    @click="setTheme('light')"
                    class="p-4 border-2 rounded-lg text-center transition-all duration-200"
                    :class="{
                      'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900':
                        theme === 'light',
                      'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500':
                        theme !== 'light',
                    }"
                  >
                    <div class="flex flex-col items-center">
                      <div
                        class="w-full h-16 mb-2 bg-gray-100 rounded flex items-center justify-center"
                      >
                        <div
                          class="w-3/4 h-3/4 bg-white border border-gray-200 rounded shadow-sm"
                        ></div>
                      </div>
                      <span>Clair</span>
                    </div>
                  </button>
                  <button
                    @click="setTheme('dark')"
                    class="p-4 border-2 rounded-lg text-center transition-all duration-200"
                    :class="{
                      'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900':
                        theme === 'dark',
                      'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500':
                        theme !== 'dark',
                    }"
                  >
                    <div class="flex flex-col items-center">
                      <div
                        class="w-full h-16 mb-2 bg-gray-800 rounded flex items-center justify-center"
                      >
                        <div
                          class="w-3/4 h-3/4 bg-gray-700 border border-gray-600 rounded shadow-sm"
                        ></div>
                      </div>
                      <span>Sombre</span>
                    </div>
                  </button>
                  <button
                    @click="setTheme('system')"
                    class="p-4 border-2 rounded-lg text-center transition-all duration-200"
                    :class="{
                      'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900':
                        theme === 'system',
                      'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500':
                        theme !== 'system',
                    }"
                  >
                    <div class="flex flex-col items-center">
                      <div
                        class="w-full h-16 mb-2 bg-gradient-to-r from-gray-100 to-gray-800 rounded flex items-center justify-center"
                      >
                        <div
                          class="w-1/3 h-3/4 bg-white border-r border-gray-200 rounded-l"
                        ></div>
                        <div
                          class="w-2/3 h-3/4 bg-gray-700 border-l border-gray-600 rounded-r"
                        ></div>
                      </div>
                      <span>Système</span>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  >Couleur principale</label
                >
                <div class="flex flex-wrap gap-3">
                  <button
                    v-for="color in colors"
                    :key="color"
                    @click="primaryColor = color"
                    class="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-110"
                    :class="
                      primaryColor === color
                        ? 'ring-2 ring-offset-2 ring-blue-500'
                        : ''
                    "
                    :style="{ backgroundColor: color }"
                    :title="color"
                  ></button>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                  >Densité de l'interface</label
                >
                <div class="flex space-x-4">
                  <button
                    v-for="density in densities"
                    :key="density.value"
                    @click="uiDensity = density.value"
                    class="flex-1 p-3 border rounded-lg text-center transition-colors"
                    :class="{
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20':
                        uiDensity === density.value,
                      'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500':
                        uiDensity !== density.value,
                    }"
                  >
                    <div class="flex flex-col items-center">
                      <div class="w-full h-10 mb-2 flex items-end space-x-1">
                        <div
                          v-for="(height, i) in density.bars"
                          :key="i"
                          class="bg-blue-500 rounded-t"
                          :class="[height, 'w-3']"
                        ></div>
                      </div>
                      <span class="text-sm">{{ density.label }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Section Notifications -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-medium mb-4">Notifications</h2>

            <div class="space-y-4">
              <div
                v-for="(setting, key) in notificationSettings"
                :key="key"
                class="flex items-start justify-between"
              >
                <div class="flex-1">
                  <h3
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {{ setting.label }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ setting.description }}
                  </p>
                </div>
                <div class="ml-4">
                  <label
                    class="relative inline-flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      v-model="setting.enabled"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aperçu -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6"
          >
            <h2 class="text-lg font-medium mb-4">Aperçu</h2>

            <div class="space-y-4">
              <div
                class="p-4 rounded-lg"
                :style="{ backgroundColor: primaryColor + '1a' }"
              >
                <h3 class="font-medium mb-2" :style="{ color: primaryColor }">
                  Carte d'aperçu
                </h3>
                <p class="text-sm" :style="{ color: primaryColor + 'cc' }">
                  Ceci est un aperçu de votre configuration actuelle.
                </p>
              </div>

              <button
                class="w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
                :style="{
                  backgroundColor: primaryColor,
                  '&:hover': { backgroundColor: darkenColor(primaryColor, 10) },
                }"
              >
                Bouton principal
              </button>

              <div class="p-4 border rounded-lg">
                <h3 class="font-medium mb-2">Titre de section</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  Contenu de la section avec du texte de démonstration.
                </p>
              </div>

              <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                    >
                      <svg
                        class="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Notification exemple
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Voici un exemple de notification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                @click="saveSettings"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Enregistrer les modifications
              </button>
              <button
                @click="resetSettings"
                class="w-full mt-3 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useTheme } from "@/composables/useTheme";

// Page info
const pageTitle = ref("Configuration");
const pageSubtitle = ref("Gestion des paramètres du sass");

// State
const isLoading = ref(false);
const loadingText = ref("Chargement des données...");

const { setTheme, toggleTheme } = useTheme();
// Thème
const theme = ref(localStorage.getItem('data-theme') || 'system');

// Couleur principale
const colors = [
  "#3B82F6", // blue-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#EF4444", // red-500
  "#F59E0B", // amber-500
  "#10B981", // emerald-500
  "#06B6D4", // cyan-500
  "#6366F1", // indigo-500
];

const primaryColor = ref(localStorage.getItem("primaryColor") || "#3B82F6");

// Densité de l'interface
const densities = [
  { value: "compact", label: "Compacte", bars: ["h-3", "h-4", "h-5", "h-6"] },
  { value: "normal", label: "Normale", bars: ["h-2", "h-4", "h-6", "h-8"] },
  {
    value: "comfortable",
    label: "Confortable",
    bars: ["h-1", "h-3", "h-5", "h-7"],
  },
];

const uiDensity = ref(localStorage.getItem("uiDensity") || "normal");

// Paramètres de notification
const notificationSettings = ref([
  {
    key: "email",
    label: "Notifications par email",
    description: "Recevoir des notifications par email",
    enabled: true,
  },
  {
    key: "updates",
    label: "Mises à jour du système",
    description: "Être informé des mises à jour importantes",
    enabled: true,
  },
  {
    key: "newsletter",
    label: "Newsletter",
    description: "Recevoir notre newsletter mensuelle",
    enabled: false,
  },
  {
    key: "marketing",
    label: "Offres promotionnelles",
    description: "Recevoir des offres spéciales et promotions",
    enabled: false,
  },
]);

// Fonction pour assombrir une couleur
const darkenColor = (color: string, percent: number) => {
  // Implémentation simplifiée - en production, utilisez une bibliothèque comme 'color'
  return color; // Retourne la couleur d'origine pour l'exemple
};

// Définir le thème
// const setTheme = (newTheme: string) => {
//   theme.value = newTheme;
//   setTheme(newTheme);
// };

// Sauvegarder les paramètres
const saveSettings = () => {
  localStorage.setItem("primaryColor", primaryColor.value);
  localStorage.setItem("uiDensity", uiDensity.value);

  // Ici, vous pourriez envoyer les paramètres au serveur
  console.log("Paramètres sauvegardés", {
    theme: theme.value,
    primaryColor: primaryColor.value,
    uiDensity: uiDensity.value,
    notifications: notificationSettings.value,
  });

  // Afficher une notification de succès
  alert("Paramètres sauvegardés avec succès !");
};

// Réinitialiser les paramètres
const resetSettings = () => {
  if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
    localStorage.removeItem("data-theme");
    localStorage.removeItem("primaryColor");
    localStorage.removeItem("uiDensity");

    // Réappliquer les valeurs par défaut
    theme.value = "system";
    primaryColor.value = "#3B82F6";
    uiDensity.value = "normal";
    notificationSettings.value.forEach((setting) => {
      setting.enabled = ["email", "updates"].includes(setting.key);
    });

    setTheme("system");
  }
};

onMounted(() => {
  // Appliquer le thème au chargement
  setTheme(theme.value);
});

// Surveiller les changements de préférence système
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (theme.value === "system") {
    setTheme("system");
  }
});
</script>

<style scoped>
@import "tailwindcss";

.configurator-view {
  @apply p-6;
}

.view-header {
  @apply mb-6;
}

.page-title {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}

.page-subtitle {
  @apply text-gray-600 dark:text-gray-400;
}

/* Styles pour les cartes */
.bg-white {
  background-color: #fff;
}

.dark .dark\:bg-gray-800 {
  background-color: #1f2937;
}

/* Styles pour les boutons */
button {
  @apply transition-colors duration-200;
}

/* Styles pour les champs de formulaire */
input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}

/* Styles pour les cases à cocher et boutons radio */
input[type="checkbox"],
input[type="radio"] {
  @apply h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800;
}

/* Styles pour les étiquettes */
label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
}

/* Styles pour les onglets */
.tab {
  @apply px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300;
}

.tab.active {
  @apply border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400;
}

/* Styles pour les badges */
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.badge-blue {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200;
}

.badge-green {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.badge-yellow {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}

.badge-red {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200;
}

/* Styles pour les messages d'alerte */
.alert {
  @apply p-4 mb-4 text-sm rounded-lg;
}

.alert-success {
  @apply text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800;
}

.alert-error {
  @apply text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800;
}

.alert-warning {
  @apply text-yellow-700 bg-yellow-100 dark:bg-yellow-200 dark:text-yellow-800;
}

.alert-info {
  @apply text-blue-700 bg-blue-100 dark:bg-blue-200 dark:text-blue-800;
}
</style>
