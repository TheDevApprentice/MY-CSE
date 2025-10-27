<template>
  <aside
    class="dashboard-sidebar"
    :class="{
      'sidebar-collapsed': collapsed,
      'sidebar-mobile-open': mobileOpen,
    }"
    ref="sidebarRef"
  >
    <!-- Header de la sidebar -->
    <div class="dashboard-sidebar-header">
      <div class="dashboard-sidebar-logo">
        <div
          class="dashboard-logo-icon"
          :class="{
            'bg-gradient-to-br from-blue-600 to-emerald-600': isDark,
            'bg-gradient-to-br from-blue-500 to-emerald-500': !isDark,
          }"
        >
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span class="dashboard-logo-text" v-if="!collapsed">Dashboard</span>
      </div>

      <!-- Toggle button pour desktop -->
      <button
        @click="toggleCollapsed"
        class="dashboard-toggle-btn hidden lg:flex"
        :class="{ 'rotate-180': collapsed }"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation principale -->
    <nav class="dashboard-sidebar-nav">
      <ul class="dashboard-nav-list">
        <li
          v-for="item in navigationItems"
          :key="item.name"
          class="dashboard-nav-item"
        >
          <!-- Item avec sous-menu -->
          <div v-if="item.children" class="dashboard-nav-item-dropdown">
            <button
              @click="toggleSubmenu(item.name)"
              class="dashboard-nav-link dashboard-nav-link-dropdown"
              :class="{ active: isSubmenuOpen(item.name) }"
            >
              <div class="dashboard-nav-link-content">
                <component
                  :is="'svg'"
                  class="dashboard-nav-icon"
                  v-html="item.icon"
                ></component>
                <span class="dashboard-nav-text" v-if="!collapsed">{{
                  item.label
                }}</span>
              </div>
              <svg
                class="dashboard-nav-arrow"
                :class="{
                  'dashboard-nav-arrow-open': isSubmenuOpen(item.name),
                }"
                v-if="!collapsed"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <!-- Sous-menu -->
            <ul
              class="dashboard-submenu"
              :class="{ 'dashboard-submenu-open': isSubmenuOpen(item.name) }"
              v-if="!collapsed"
            >
              <li v-for="child in item.children" :key="child.name">
                <router-link
                  :to="child.path"
                  class="dashboard-submenu-link"
                  :class="{
                    'dashboard-submenu-link-active': $route.path === child.path,
                  }"
                  @click="$emit('navigate', child)"
                >
                  <span class="dashboard-submenu-dot"></span>
                  {{ child.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Item simple -->
          <router-link
            v-else
            :to="item.path"
            class="dashboard-nav-link"
            :class="{ 'dashboard-nav-link-active': $route.path === item.path }"
            @click="$emit('navigate', item)"
          >
            <div class="dashboard-nav-link-content">
              <component
                :is="'svg'"
                class="dashboard-nav-icon"
                v-html="item.icon"
              ></component>
              <span class="dashboard-nav-text" v-if="!collapsed">{{
                item.label
              }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer de la sidebar -->
    <div class="dashboard-sidebar-footer" v-if="!collapsed">
      <div class="dashboard-user-info">
        <div class="dashboard-user-avatar">
          <img
            :src="currentUser?.avatar"
            :alt="currentUser?.name"
            class="dashboard-avatar-img"
          />
        </div>
        <div class="dashboard-user-details">
          <p class="dashboard-user-name">{{ currentUser?.name }}</p>
          <p class="dashboard-user-role">{{ currentUser?.roles.join(", ") }}</p>
        </div>
      </div>
    </div>

    <!-- Overlay pour mobile -->
    <div
      class="dashboard-sidebar-overlay lg:hidden"
      :class="{ 'dashboard-overlay-visible': mobileOpen }"
      @click="closeMobile"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick} from "vue";
import { gsap } from "gsap";
import { useTheme } from "@/composables/useTheme";
import { NavigationChild, NavigationItem } from "./types/types";
import { AdminUser } from "@/components/dashboards/SASS/admin/types";

interface Props {
  collapsed?: boolean;
  mobileOpen?: boolean;
  navigationItems?: NavigationItem[];
  currentUser?: AdminUser;
}

const isDark = useTheme();
const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  mobileOpen: false,
  navigationItems: () => [],
});

const emit = defineEmits<{
  toggleCollapsed: [];
  toggleMobile: [];
  navigate: [item: NavigationItem | NavigationChild];
}>();

const sidebarRef = ref<HTMLElement | null>(null);
const openSubmenus = ref<Set<string>>(new Set());

const toggleCollapsed = () => {
  emit("toggleCollapsed");
};

const closeMobile = () => {
  emit("toggleMobile");
};

const toggleSubmenu = (name: string) => {
  if (openSubmenus.value.has(name)) {
    openSubmenus.value.delete(name);
  } else {
    openSubmenus.value.add(name);
  }
};

const isSubmenuOpen = (name: string) => {
  return openSubmenus.value.has(name);
};

onMounted(async () => {
  await nextTick();
  const navItems: any[] = sidebarRef.value?.querySelectorAll(
    ".dashboard-nav-item"
  );

  if (!navItems) {
    console.error("No navigation items found  in html");
    return;
  }

  gsap.fromTo(
    navItems,
    {
      opacity: 0,
      x: -20,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.2,
    }
  );
});
</script>

<style scoped>
@import "tailwindcss";

/* Styles de base */
.dashboard-sidebar {
  @apply fixed top-0 left-0 h-full
         shadow-xl
         transition-all duration-300 ease-in-out z-40;
  width: 280px;
  transition: width 0.3s ease-in-out;
}

.sidebar-collapsed {
  width: 95px;
}

/* Thème clair */
.dashboard-sidebar {
  @apply bg-white border-r border-gray-200;
}

/* Thème sombre */
.dark .dashboard-sidebar {
  @apply bg-gray-900 border-gray-700;
}

.sidebar-mobile-open {
  @apply lg:translate-x-0;
}

@media (max-width: 1024px) {
  .dashboard-sidebar {
    @apply -translate-x-full;
  }
}

/* Header */
.dashboard-sidebar-header {
  @apply flex items-center justify-between p-6 border-b;
}

.dashboard-sidebar-header {
  @apply border-gray-200;
}

.dark .dashboard-sidebar-header {
  @apply border-gray-700;
}

.dashboard-sidebar-logo {
  @apply flex items-center space-x-3;
}

.dashboard-logo-icon {
  @apply w-10 h-10 text-white rounded-lg flex items-center justify-center;
}

.dashboard-logo-text {
  @apply text-xl font-bold;
}

.dashboard-logo-text {
  @apply text-gray-900;
}

.dark .dashboard-logo-text {
  @apply text-white;
}

.dashboard-toggle-btn {
  @apply w-8 h-8 ml-2 rounded-lg items-center justify-center
         transition-all duration-200;
}

.dashboard-toggle-btn {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

.dark .dashboard-toggle-btn {
  @apply bg-gray-800 text-gray-300 hover:bg-gray-700;
}

/* Navigation */
.dashboard-sidebar-nav {
  @apply flex-1 px-4 py-6 overflow-y-auto;
}

.dashboard-nav-list {
  @apply space-y-2;
}

.dashboard-nav-item {
  @apply w-full;
}

.dashboard-nav-link {
  @apply flex items-center justify-between w-full px-4 py-3
         rounded-lg transition-all duration-200
         relative overflow-hidden;
}

.dashboard-nav-link {
  @apply text-gray-700 hover:bg-blue-50 hover:text-blue-600;
}

.dark .dashboard-nav-link {
  @apply text-gray-300 hover:bg-gray-800 hover:text-blue-400;
}

.dashboard-nav-link.active {
  @apply bg-blue-100 text-blue-600;
}

.dark .dashboard-nav-link.active {
  @apply bg-blue-900/20 text-blue-400;
}

.dashboard-nav-link-content {
  @apply flex items-center space-x-3;
}

.dashboard-nav-icon {
  @apply w-5 h-5 flex-shrink-0;
  fill: none;
  stroke: currentColor;
  viewbox: 0 0 24 24;
}

.dashboard-nav-text {
  @apply font-medium;
}

.dashboard-nav-arrow {
  @apply w-4 h-4 transition-transform duration-200;
}

.dashboard-nav-arrow-open {
  @apply rotate-180;
}

/* Submenu */
.dashboard-nav-item-dropdown {
  @apply w-full;
}

.dashboard-nav-link-dropdown {
  @apply cursor-pointer;
}

.dashboard-submenu {
  @apply mt-2 ml-8 space-y-1 overflow-hidden transition-all duration-300;
  max-height: 0;
}

.dashboard-submenu-open {
  max-height: 200px;
}

.dashboard-submenu-link {
  @apply flex items-center space-x-3 px-4 py-2 text-sm
         rounded-lg transition-all duration-200;
}

.dashboard-submenu-link {
  @apply text-gray-600 hover:text-blue-600 hover:bg-blue-50;
}

.dark .dashboard-submenu-link {
  @apply text-gray-400 hover:text-blue-400 hover:bg-gray-800;
}

.dashboard-submenu-link.active {
  @apply text-blue-600 bg-blue-50;
}

.dark .dashboard-submenu-link.active {
  @apply text-blue-400 bg-blue-900/20;
}

.dashboard-submenu-dot {
  @apply w-2 h-2 rounded-full;
}

.dashboard-submenu-dot {
  @apply bg-gray-400;
}

.dark .dashboard-submenu-dot {
  @apply bg-gray-500;
}

/* Footer */
.dashboard-sidebar-footer {
  @apply p-4 border-t;
}

.dashboard-sidebar-footer {
  @apply border-gray-200;
}

.dark .dashboard-sidebar-footer {
  @apply border-gray-700;
}

.dashboard-user-info {
  @apply flex items-center space-x-3;
}

.dashboard-user-avatar {
  @apply w-10 h-10 rounded-full overflow-hidden;
}

.dashboard-avatar-img {
  @apply w-full h-full object-cover;
}

.dashboard-user-details {
  @apply flex-1;
}

.dashboard-user-name {
  @apply text-sm font-medium;
}

.dashboard-user-name {
  @apply text-gray-900;
}

.dark .dashboard-user-name {
  @apply text-white;
}

.dashboard-user-role {
  @apply text-xs;
}

.dashboard-user-role {
  @apply text-gray-500;
}

.dark .dashboard-user-role {
  @apply text-gray-400;
}

/* Overlay */
.dashboard-sidebar-overlay {
  @apply fixed inset-0 bg-black/50 opacity-0 pointer-events-none 
         transition-opacity duration-300;
}

.dashboard-overlay-visible {
  @apply opacity-100 pointer-events-auto;
}

/* Animations */
.dashboard-nav-link::before {
  content: "";
  @apply absolute left-0 top-0 w-1 h-full
         transform -translate-x-full transition-transform duration-200;
}

.dashboard-nav-link::before {
  @apply bg-blue-600;
}

.dark .dashboard-nav-link::before {
  @apply bg-blue-400;
}

.dashboard-nav-link.active::before,
.dashboard-nav-link:hover::before {
  @apply translate-x-0;
}
</style>
