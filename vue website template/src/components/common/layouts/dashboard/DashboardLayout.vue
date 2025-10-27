<template>
  <div
    class="dashboard-layout"
    :class="{ 'sidebar-collapsed': sidebarCollapsed }"
  >
    <!-- Sidebar Navigation -->
    <SidebarNavigation
      :collapsed="sidebarCollapsed"
      :currentUser="currentUser"
      :mobile-open="sidebarMobileOpen"
      :navigation-items="navigationItems"
      @toggle-collapsed="toggleSidebarCollapsed"
      @toggle-mobile="toggleSidebarMobile"
      @navigate="handleNavigation"
    />

    <!-- Main Content Area -->
    <div class="dashboard-main-content">
      <!-- Header Dashboard -->
      <HeaderDashboard
        :title="pageTitle"
        :subtitle="pageSubtitle"
        :show-search="showSearch"
        :show-notifications="showNotifications"
        :currentUser="currentUser"
        :notifications="notifications"
        @toggle-mobile="toggleSidebarMobile"
        @search="handleSearch"
        @profile-action="handleProfileAction"
      >
        <template #actions v-if="$slots.headerActions">
          <slot name="headerActions"></slot>
        </template>
      </HeaderDashboard>

      <!-- Breadcrumb Navigation -->
      <div class="dashboard-breadcrumb-container" v-if="breadcrumbs.length > 0">
        <BreadcrumbNav
          :breadcrumbs="breadcrumbs"
          @navigate="handleBreadcrumbNavigation"
        />
      </div>

      <!-- Page Content -->
      <main
        class="dashboard-page-content"
        ref="contentRef"
        href="#dashboard-page-content"
      >
        <div class="dashboard-content-wrapper">
          <!-- Page Header (optionnel) -->
          <div class="dashboard-page-header" v-if="$slots.pageHeader">
            <slot name="pageHeader"></slot>
          </div>

          <!-- Main Page Content -->
          <div class="dashboard-page-main">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>

    <!-- Overlay pour mobile -->
    <div
      class="dashboard-mobile-overlay"
      :class="{ 'dashboard-overlay-active': sidebarMobileOpen }"
      @click="toggleSidebarMobile"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";
import SidebarNavigation from "./SidebarNavigation.vue";
import HeaderDashboard from "./HeaderDashboard.vue";
import BreadcrumbNav from "./BreadcrumbNav.vue";
import { nextTick } from "vue";
import { BreadcrumbItem, NavigationItem, Notification } from "./types/types";
import { User } from "@/services/api";

interface Props {
  // Layout state
  loading?: boolean;
  loadingText?: string;

  // Page info
  pageTitle?: string;
  pageSubtitle?: string;

  // Header options
  showSearch?: boolean;
  showNotifications?: boolean;

  // Navigation
  navigationItems?: NavigationItem[];
  breadcrumbs?: BreadcrumbItem[];

  // User & notifications
  currentUser: User;
  notifications?: Notification[];

  // Sidebar state
  initialSidebarCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: "Chargement...",
  pageTitle: "Dashboard",
  showSearch: true,
  showNotifications: true,
  navigationItems: () => [],
  breadcrumbs: () => [],
  currentUser: () => ({} as User),
  notifications: () => [],
  initialSidebarCollapsed: false,
});

const emit = defineEmits<{
  search: [query: string];
  navigate: [item: any];
  profileAction: [action: string];
  sidebarToggle: [collapsed: boolean];
}>();

const router = useRouter();

// Refs
const contentRef = ref<HTMLElement | null>(null);

// State
const sidebarCollapsed = ref(props.initialSidebarCollapsed);
const sidebarMobileOpen = ref(false);

// Methods
const toggleSidebarCollapsed = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  emit("sidebarToggle", sidebarCollapsed.value);

  // Save preference to localStorage
  localStorage.setItem("sidebar-collapsed", sidebarCollapsed.value.toString());
};

const toggleSidebarMobile = () => {
  sidebarMobileOpen.value = !sidebarMobileOpen.value;
};

const handleNavigation = (item: any) => {
  // Close mobile sidebar on navigation
  sidebarMobileOpen.value = false;
  emit("navigate", item);
};

const handleBreadcrumbNavigation = (item: BreadcrumbItem) => {
  if (item.path) {
    router.push(item.path);
  }
};

const handleSearch = (query: string) => {
  emit("search", query);
};

const handleProfileAction = (action: string) => {
  emit("profileAction", action);
};

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarMobileOpen.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  await nextTick();
  // Restore sidebar state from localStorage
  const savedState = localStorage.getItem("sidebar-collapsed");
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === "true";
  }

  // Add resize listener
  window.addEventListener("resize", handleResize);

  // Animate content on mount
  if (contentRef.value) {
    gsap.fromTo(
      contentRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
@import "tailwindcss";

/* Layout */
.dashboard-layout {
  @apply min-h-screen bg-gray-50 transition-all duration-300 ease-in-out;
}

.dark .dashboard-layout {
  @apply bg-gray-900;
}

/* Main Content */
.dashboard-main-content {
  @apply flex flex-col min-h-screen;
  margin-left: 280px;
  transition: margin-left 0.3s ease-in-out;
}

.sidebar-collapsed .dashboard-main-content {
  margin-left: 95px;
}

@media (max-width: 1024px) {
  .dashboard-main-content {
    margin-left: 0;
  }
}

/* Breadcrumb */
.dashboard-breadcrumb-container {
  @apply bg-white border-b border-gray-200;
}

.dark .dashboard-breadcrumb-container {
  @apply bg-gray-900 border-gray-700;
}

/* Page Content */
.dashboard-page-content {
  @apply flex-1 overflow-auto;
}

.dashboard-content-wrapper {
  @apply container mx-auto px-6 py-6 max-w-full;
}

.dashboard-page-header {
  @apply mb-6;
}

.dashboard-page-main {
  @apply space-y-6;
}

.dashboard-page-footer {
  @apply mt-8 pt-6 border-t border-gray-200;
}

.dark .dashboard-page-footer {
  @apply border-gray-700;
}

/* Mobile Overlay */
.dashboard-mobile-overlay {
  @apply fixed inset-0 bg-black/50 z-30 lg:hidden
           opacity-0 pointer-events-none
           transition-opacity duration-300;
}

.dashboard-overlay-active {
  @apply opacity-100 pointer-events-auto;
}

/* Transitions */
/* Smooth transitions pour le contenu */
.dashboard-page-content {
  transition: all 0.3s ease-in-out;
}

/* Animation pour les changements de page */
.dashboard-page-enter-active,
.dashboard-page-leave-active {
  transition: all 0.3s ease-in-out;
}

.dashboard-page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.dashboard-page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .dashboard-content-wrapper {
    @apply px-4 py-4;
  }
}

/* Scrollbar Styling */
.dashboard-page-content::-webkit-scrollbar {
  width: 6px;
}

.dashboard-page-content::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.dark .dashboard-page-content::-webkit-scrollbar-track {
  @apply bg-gray-800;
}

.dashboard-page-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

.dark .dashboard-page-content::-webkit-scrollbar-thumb {
  @apply bg-gray-600;
}

.dashboard-page-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

.dark .dashboard-page-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

/* Focus States */
.dashboard-layout *:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

.dark .dashboard-layout *:focus {
  @apply ring-offset-gray-900;
}

.dashboard-page-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.dashboard-page-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Focus states for accessibility */
.dashboard-layout *:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900;
}

.dashboard-page-content::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.dashboard-page-content::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}

/* Focus states for accessibility */
.dashboard-layout *:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900;
}

/* Print styles */
@media print {
  .dashboard-sidebar-navigation,
  .dashboard-header {
    display: none !important;
  }

  .dashboard-main-content {
    margin-left: 0 !important;
  }

  .dashboard-page-content {
    @apply shadow-none;
  }
}
</style>
