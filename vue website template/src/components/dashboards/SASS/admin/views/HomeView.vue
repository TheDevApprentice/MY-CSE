<template>
  <div
    id="home-view"
    href="#home-view"
    class="view"
    ref="homeRef"
    v-if="!loading"
  >
    <div id="home-content" class="content" href="#home-content">
      <!-- Cartes de statistiques avec StatsCard -->
      <div id="stats-grid" href="#stats-grid" class="stats-grid">
        <StatsCard
          v-for="(stat, index) in homeStats"
          :key="index"
          v-bind="stat"
          class="hover:shadow-lg transition-transform hover:scale-[1.02]"
        />
      </div>

      <!-- Graphiques et tableaux -->
      <div id="charts-section" href="#charts-section" class="charts-section">
        <div
          id="chart-container"
          href="#chart-container"
          class="chart-container"
        >
          <div id="chart-header" href="#chart-header" class="chart-header">
            <h3 class="chart-title">Évolution des ventes</h3>
            <div class="chart-filters">
              <button
                v-for="period in chartPeriods"
                :key="period.value"
                @click="selectedPeriod = period.value"
                class="filter-btn"
                :class="{ active: selectedPeriod === period.value }"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <BarChart
              theme="auto"
              :labels="chartLabels"
              :datasets="[
                {
                  data: chartData,
                },
              ]"
              :useGradients="true"
              :barOptions="{
                borderRadius: 8,
                borderSkipped: false,
              }"
            />
          </div>
        </div>

        <!-- Tableau des utilisateurs récents -->
        <div
          id="table-container"
          href="#table-container"
          class="table-container"
        >
          <div class="table-header">
            <h3 class="table-title">Utilisateurs récents</h3>
            <button @click="showAllUsers" class="dashboard-view-all-btn">
              Voir tout
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div class="table-content">
            <DataTable
              :headers="headers"
              :items="recentUsers"
              :show-actions="true"
              :actions="[
                { name: 'edit', handler: handleEdit },
                { name: 'delete', handler: handleDelete },
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Activité récente -->
      <div
        id="activity-section"
        href="#activity-section"
        class="activity-section"
      >
        <div class="activity-container">
          <div class="activity-header">
            <h3 class="activity-title">Activité récente</h3>
            <button @click="clearActivity" class="clear-btn">Effacer</button>
          </div>
          <div class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon" :class="activity.type">
                <component
                  :is="'svg'"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="getActivityIcon(activity.type)"
                  />
                </component>
              </div>
              <div class="activity-content">
                <p class="activity-text">{{ activity.message }}</p>
                <span class="activity-time">{{
                  formatTime(activity.time)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Raccourcis rapides -->
        <div class="shortcuts-container">
          <h3 class="shortcuts-title">Raccourcis rapides</h3>
          <div class="shortcuts-grid">
            <button
              v-for="shortcut in quickShortcuts"
              :key="shortcut.id"
              @click="handleShortcut(shortcut)"
              class="shortcut-btn"
            >
              <component
                :is="'svg'"
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="shortcut.icon"
                />
              </component>
              <span class="shortcut-label">{{ shortcut.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        v-model:show="showDeleteModal"
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
        confirm-text="Supprimer"
        cancel-text="Annuler"
        type="danger"
        @confirm="handleDeleteConfirm"
        @cancel="handleDeleteCancel"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import { useView } from "../composables/useView";
import { AdminView } from "../types/admin";
import BarChart from "@/components/common/ui/charts/BarChart.vue";
import StatsCard from "@/components/common/ui/charts/StatsCard.vue";
import DataTable from "@/components/common/ui/tables/DataTable.vue";
import ConfirmModal from "@/components/common/ui/modals/ConfirmModal.vue";
import type { TableHeader, TableItem } from "@/components/common/ui/tables";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { chartPeriods, useChartLabels } from "@/utils/chartUtils";
import { useHome } from "../composables/useHome";

// Utilisation du composable
const { loading, animateViewEnter } = useView([AdminView.HOME]);
const { homeStats, recentUsers, recentActivities, loadHomeData } = useHome();

const homeRef = ref<HTMLElement | null>(null);

// State
const selectedPeriod = ref<string>("week");
const chartLabels = useChartLabels(selectedPeriod);

const showDeleteModal = ref(false);
// State
const itemToDelete = ref<TableItem | null>(null);

const chartData = computed(() => {
  switch (selectedPeriod.value) {
    case "day":
      return [12, 19, 3, 5, 2, 3, 9];
    case "week":
      return [40, 55, 30, 45, 25, 35, 50];
    case "month":
      return [120, 190, 130, 150, 180, 145, 200];
    case "year":
      return [1200, 1900, 1300, 1500, 1800, 1450, 2000];
    default:
      return [40, 55, 30, 45, 25, 35, 50];
  }
});

// Recent users
const headers = ref<TableHeader[]>([
  {
    text: "Utilisateur",
    value: "name",
    type: "image",
    imageField: "avatar",
  },
  { text: "Email", value: "email" },
  {
    text: "Statut",
    value: "status",
    formatter: (value: string) => {
      return value === "active"
        ? "Actif"
        : value === "inactive"
        ? "Inactif"
        : "Suspendu";
    },
  },
  {
    text: "Dernière connexion",
    value: "lastLogin",
    formatter: formatDate,
  },
]);

// Quick shortcuts
const quickShortcuts = ref([
  {
    id: 1,
    label: "Créer utilisateur",
    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
    action: "create-user",
  },
  {
    id: 2,
    label: "Rapport mensuel",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 002-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    action: "monthly-report",
  },
  {
    id: 3,
    label: "Paramètres",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    action: "settings",
  },
  {
    id: 4,
    label: "Support",
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    action: "support",
  },
]);

const handleEdit = async (user: any) => {
  console.log("Éditer utilisateur:", user);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("form-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const handleDelete = async (item: TableItem) => {
  console.log("Supprimer utilisateur:", item);
  itemToDelete.value = item;
  showDeleteModal.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("confirm-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const handleDeleteConfirm = () => {
  if (itemToDelete.value) {
    console.log("Deleting item:", itemToDelete.value);
    // Logique de suppression ici
  }
  showDeleteModal.value = false;
};

const handleDeleteCancel = () => {
  showDeleteModal.value = false;
};
const showAllUsers = () => {
  console.log("Afficher tous les utilisateurs");
};

const clearActivity = () => {
  recentActivities.value = [];
};

const handleShortcut = (shortcut: any) => {
  console.log("Raccourci:", shortcut.action);
};

const getActivityIcon = (type: string) => {
  const icons = {
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    order: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    system:
      "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    security:
      "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  };
  return icons[type] || icons.system;
};

// Lifecycle
onMounted(async () => {
  await loadHomeData()
  .then(async () => {
    if (homeRef.value) {
      animateViewEnter(homeRef.value);
    }
    await nextTick();
  })  
  .catch((error) => {
    console.error("Error loading adlinDashboard homeview data:", error);
  });
});
</script>

<style scoped>
@import "tailwindcss";

/* Activity Section */
.activity-section {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-8;
}

.activity-container {
  @apply lg:col-span-2 rounded-xl shadow-sm border p-6;
}

.activity-container {
  @apply bg-white border-gray-200;
}

.dark .activity-container {
  @apply bg-gray-800 border-gray-700;
}

.activity-header {
  @apply flex items-center justify-between mb-6;
}

.activity-title {
  @apply text-xl font-semibold;
}

.activity-title {
  @apply text-gray-900;
}

.dark .activity-title {
  @apply text-white;
}

.clear-btn {
  @apply text-sm font-medium hover:underline transition-colors duration-200;
}

.clear-btn {
  @apply text-red-600;
}

.dark .clear-btn {
  @apply text-red-400;
}

.activity-list {
  @apply space-y-4;
}

.activity-item {
  @apply flex items-start space-x-3 p-3 rounded-lg 
           transition-colors duration-200;
}

.activity-item {
  @apply hover:bg-gray-50;
}

.dark .activity-item {
  @apply hover:bg-gray-700;
}

.activity-icon {
  @apply w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0;
}

.activity-icon.user {
  @apply bg-blue-100 text-blue-600;
}

.dark .activity-icon.user {
  @apply bg-blue-900/20 text-blue-400;
}

.activity-icon.order {
  @apply bg-green-100 text-green-600;
}

.dark .activity-icon.order {
  @apply bg-green-900/20 text-green-400;
}

.activity-icon.system {
  @apply bg-purple-100 text-purple-600;
}

.dark .activity-icon.system {
  @apply bg-purple-900/20 text-purple-400;
}

.activity-icon.security {
  @apply bg-red-100 text-red-600;
}

.dark .activity-icon.security {
  @apply bg-red-900/20 text-red-400;
}

.activity-content {
  @apply flex-1 space-y-1;
}

.activity-text {
  @apply text-sm;
}

.activity-text {
  @apply text-gray-900;
}

.dark .activity-text {
  @apply text-white;
}

.activity-time {
  @apply text-xs;
}

.activity-time {
  @apply text-gray-500;
}

.dark .activity-time {
  @apply text-gray-400;
}

/* Shortcuts */
.shortcuts-container {
  @apply rounded-xl shadow-sm border p-6;
}

.shortcuts-container {
  @apply bg-white border-gray-200;
}

.dark .shortcuts-container {
  @apply bg-gray-800 border-gray-700;
}

.shortcuts-title {
  @apply text-xl font-semibold mb-6;
}

.shortcuts-title {
  @apply text-gray-900;
}

.dark .shortcuts-title {
  @apply text-white;
}

.shortcuts-grid {
  @apply grid grid-cols-2 gap-4;
}

.shortcut-btn {
  @apply flex flex-col items-center space-y-2 p-4 rounded-lg 
           transition-all duration-200 hover:scale-105;
}

.shortcut-btn {
  @apply bg-gray-50 hover:bg-gray-100;
}

.dark .shortcut-btn {
  @apply bg-gray-700 hover:bg-gray-600;
}

.shortcut-label {
  @apply text-sm font-medium text-center;
}

.shortcut-label {
  @apply text-gray-700;
}

.dark .shortcut-label {
  @apply text-gray-300;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .activity-section {
    @apply grid-cols-1;
  }

  .shortcuts-grid {
    @apply grid-cols-1;
  }
}
</style>
