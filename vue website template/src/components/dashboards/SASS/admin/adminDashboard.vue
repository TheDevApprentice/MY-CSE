<!-- adminDashboard.vue -->
<template>
  <DashboardLayout
    class="dashboard-admin"
    :page-title="pageTitle"
    :page-subtitle="pageSubtitle"
    :loading="loading"
    :loading-text="loadingText"
    :breadcrumbs="computedBreadcrumbs"
    :navigation-items="navigationItems"
    :current-user="user"
    :notifications="notifications"
    :show-search="true"
    :show-notifications="true"
    @search="handleSearch"
    @navigate="handleNavigation"
    @profile-action="handleProfileAction"
    @sidebar-toggle="handleSidebarToggle"
  >
    <!-- Actions dans le header -->
    <template #headerActions>
      <button
        @click="refreshData"
        class="btn btn-secondary"
        :disabled="loading"
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 0115.356 2M15 15v5h-.582M4.642 15A8.001 8.001 0 0019.418 15m0 0V15a8 8 0 01-15.356-2"
          />
        </svg>
        Actualiser
      </button>
    </template>

    <!-- Contenu principal du dashboard -->
    <div
      id="dashboard-content"
      href="#dashboard-content"
      class="dashboard-content"
      ref="dashboardRef"
    >
      <router-view />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useView } from "@/components/dashboards/SASS/admin/composables/useView";
import DashboardLayout from "@/components/common/layouts/dashboard/DashboardLayout.vue";
import { useRoute } from "vue-router";
import { nextTick } from "vue";
import { BreadcrumbItem } from "@/components/common/layouts/dashboard/types/types";
import { useAdminDashboard } from "./composables/index";

const route = useRoute();
const { navigationItems, loading } = useView([]);
const { user, notifications, loadAdminPrimaryData, getAdminNotifications } = useAdminDashboard();

// State
const loadingText = ref("Chargement des données...");
const dashboardRef = ref<HTMLElement | null>(null);

// Page info
const pageTitle = ref("Administration");
const pageSubtitle = ref("Tableau de bord administrateur");

// Breadcrumbs
const computedBreadcrumbs = computed(() => {
  // Auto-generate breadcrumbs from route if not provided
  const pathSegments = route.path.split("/").filter((segment) => segment);
  const breadcrumbs: BreadcrumbItem[] = [
    // { label: "Accueil", path: "/dashboard" },
  ];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    if (index > 0) {
      // Skip 'dashboard' as it's already in home
      breadcrumbs.push({
        label:
          segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
        path: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    }
  });

  return breadcrumbs;
});

// Methods
// Functionnality to keep for later implemation
const handleSearch = (query: string) => {
  console.log("Recherche:", query);
  // Implement search logic
};

const handleNavigation = (item: any) => {
  console.log("Navigation vers:", item);
  // Implement navigation logic
};

const handleProfileAction = (action: string) => {
  console.log("Action profil:", action);
  // Implement profile actions
};

const handleSidebarToggle = (collapsed: boolean) => {
  console.log("Sidebar collapsed:", collapsed);
};

const refreshData = async () => {
  loadingText.value = "Actualisation des données...";

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Données actualisées");
};

onMounted(async () => {
  await loadAdminPrimaryData();
  await getAdminNotifications();
  await nextTick();
});
</script>

<style>
@import "tailwindcss";

.dashboard-admin {
  padding-top: calc(1rem + 3rem);
}

.dashboard-content {
  @apply space-y-8;
}

.view {
  @apply p-6;
}

.view-header {
  @apply mb-6;
}

.content {
  @apply space-y-8;
}

.page-info {
  @apply text-sm;
}

.page-info {
  @apply text-gray-700;
}

.dark .page-info {
  @apply text-gray-300;
}

.page-title {
  @apply text-2xl font-bold text-gray-900;
}

.dark .page-title {
  @apply text-white;
}

.page-subtitle {
  @apply text-gray-600;
}

.dark .page-subtitle {
  @apply text-gray-400;
}

.dashboard-view-all-btn {
  @apply flex items-center text-sm font-medium 
           hover:underline transition-colors duration-200;
}

.dashboard-view-all-btn {
  @apply text-blue-600;
}

.dark .dashboard-view-all-btn {
  @apply text-blue-400;
}

/* Stats Grid */
.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

/* Charts Section */
.charts-section {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.chart-content {
  @apply space-y-8 pt-3 h-full;
}

.chart-container,
.table-container {
  @apply rounded-xl shadow-sm border p-6;
}

.chart-container,
.table-container {
  @apply bg-white border-gray-200;
}

.dark .chart-container,
.dark .table-container {
  @apply bg-gray-800 border-gray-700;
}

.chart-header,
.table-header {
  @apply flex items-center justify-between mb-6;
}

.chart-title,
.table-title {
  @apply text-xl font-semibold;
}

.chart-title,
.table-title {
  @apply text-gray-900;
}

.dark .chart-title,
.dark .table-title {
  @apply text-white;
}

.chart-filters {
  @apply flex space-x-2;
}

/* Button styles */
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg 
         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white 
         focus:ring-blue-500 shadow-sm hover:shadow-md;
}

.btn-secondary {
  @apply hover:bg-gray-200 text-gray-700 focus:ring-gray-500;
}

.btn-secondary {
  @apply bg-gray-100;
}

.dark .btn-secondary {
  @apply bg-gray-700 hover:bg-gray-600 text-gray-300;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.actions-bar {
  @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4;
}

.filters {
  @apply flex items-center gap-2;
}

.filter-select {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
         focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md;
}

.filter-select {
  @apply bg-white border text-gray-900;
}

.dark .filter-select {
  @apply bg-gray-700 border-gray-600 text-white;
}

.filter-btn {
  @apply px-3 py-1 text-sm font-medium rounded-lg 
         transition-colors duration-200;
}

.filter-btn {
  @apply text-gray-600 hover:bg-gray-100;
}

.dark .filter-btn {
  @apply text-gray-400 hover:bg-gray-700;
}

.filter-btn.active {
  @apply bg-blue-100 text-blue-600;
}

.dark .filter-btn.active {
  @apply bg-blue-900/20 text-blue-400;
}

/* Styles pour les cartes */
.bg-white {
  background-color: #fff;
}

.dark .dark\:bg-gray-800 {
  background-color: #1f2937;
}

/* Styles pour les statuts */
.bg-green-100 {
  background-color: #d1fae5;
}

.text-green-800 {
  color: #065f46;
}

.bg-yellow-100 {
  background-color: #fef3c7;
}

.text-yellow-800 {
  color: #92400e;
}

/* Mode sombre pour les statuts */
.dark .bg-green-100 {
  background-color: #064e3b;
}

.dark .text-green-800 {
  color: #a7f3d0;
}

.dark .bg-yellow-100 {
  background-color: #78350f;
}

.dark .text-yellow-800 {
  color: #fcd34d;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .dashboard-admin {
    padding-top: calc(4.6rem + 3.5rem);
  }
  .stats-grid {
    @apply grid-cols-1;
  }

  .charts-section {
    @apply grid-cols-1;
  }
}
</style>
