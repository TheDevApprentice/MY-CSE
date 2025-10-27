<template>
  <div class="test-view-container">
    <!-- Header principal aligné sur Service.vue -->
    <div
      class="main-header bg-gradient-to-r from-blue-600 to-blue-800 text-white"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div class="text-center">
          <h1
            class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-4"
          >
            Test Common Components
          </h1>
          <p class="max-w-3xl mx-auto text-xl text-blue-100">
            Test et démonstration des composants communs
          </p>
        </div>
      </div>
    </div>

    <!-- Sections redessinées -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Section Charts -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
          @click="expandedSections.charts = !expandedSections.charts"
        >
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3"
          >
            <span
              class="transition-transform duration-200"
              :class="{ 'rotate-90': expandedSections.charts }"
            >
              ▶
            </span>
            Composants Charts
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ expandedSections.charts ? "Masquer" : "Afficher" }}
          </span>
        </div>
        <div v-show="expandedSections.charts" class="p-6">
          <TestChart />
        </div>
      </div>

      <!-- Section Tables -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
          @click="expandedSections.tables = !expandedSections.tables"
        >
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3"
          >
            <span
              class="transition-transform duration-200"
              :class="{ 'rotate-90': expandedSections.tables }"
            >
              ▶
            </span>
            Composants Tableaux
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ expandedSections.tables ? "Masquer" : "Afficher" }}
          </span>
        </div>
        <div v-show="expandedSections.tables" class="p-6">
          <TestTables />
        </div>
      </div>

      <!-- Section Calendar -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
          @click="expandedSections.calendar = !expandedSections.calendar"
        >
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3"
          >
            <span
              class="transition-transform duration-200"
              :class="{ 'rotate-90': expandedSections.calendar }"
            >
              ▶
            </span>
            Composants Calendrier
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ expandedSections.calendar ? "Masquer" : "Afficher" }}
          </span>
        </div>
        <div v-show="expandedSections.calendar" class="p-6">
          <TestCalendar />
        </div>
      </div>

      <!-- Section Forms -->
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800"
      >
        <div
          class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
          @click="expandedSections.forms = !expandedSections.forms"
        >
          <h2
            class="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3"
          >
            <span
              class="transition-transform duration-200"
              :class="{ 'rotate-90': expandedSections.forms }"
            >
              ▶
            </span>
            Composants Formulaire
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ expandedSections.forms ? "Masquer" : "Afficher" }}
          </span>
        </div>
        <div v-show="expandedSections.forms" class="p-6">
          <TestForms />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import TestChart from "@/components/common/ui/tests/TestCharts.vue";
import TestTables from "@/components/common/ui/tests/TestTables.vue";
import TestCalendar from "@/components/common/ui/tests/TestCalendar.vue";
import TestForms from "@/components/common/ui/tests/TestForms.vue";

const expandedSections = reactive({
  charts: false,
  tables: false,
  calendar: false,
  forms: false,
});
</script>

<style scoped>
@import "tailwindcss";

.test-view-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .test-view-container {
    padding-top: calc(4.6rem + 3.5rem);
  }
}

.main-header {
  @apply bg-white shadow-sm border-b sticky top-0 z-10;
  backdrop-filter: blur(10px);
}

.header-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4;
}

/* Dark mode */
.dark .test-view-container {
  background-color: #111827;
}

.dark .main-header {
  background-color: #1f2937;
  border-color: #374151;
}
</style>
