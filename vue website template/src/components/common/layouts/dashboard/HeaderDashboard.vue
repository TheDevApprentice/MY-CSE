<template>
  <header
    id="dashboard-header"
    href="#dashboard-header"
    class="dashboard-header"
    ref="headerRef"
  >
    <div
      id="header-content"
      href="#header-content"
      class="dashboard-header-content"
    >
      <!-- Left section: Menu burger (mobile) + Title -->
      <div id="header-left" href="#header-left" class="dashboard-header-left">
        <button
          @click="$emit('toggleMobile')"
          class="dashboard-mobile-menu-btn lg:hidden"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="dashboard-header-title">
          <h1 class="dashboard-title-text">{{ title }}</h1>
          <p class="dashboard-subtitle-text" v-if="subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Center section: Search bar (optionnel) -->
      <!-- <div class="dashboard-header-center" v-if="showSearch">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher..."
              class="search-input"
              v-model="searchQuery"
              @input="$emit('search', searchQuery)"
            >
            <button v-if="searchQuery" @click="clearSearch" class="search-clear">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div> -->

      <!-- Right section: Actions + Notifications + Profile -->
      <div class="dashboard-header-right">
        <!-- Actions personnalisées -->
        <div class="dashboard-header-actions" v-if="$slots.actions">
          <slot name="actions"></slot>
        </div>

        <!-- Notifications -->
        <div class="dashboard-notification-container" v-if="showNotifications">
          <button
            @click="toggleNotifications"
            class="dashboard-notification-btn"
            :class="{ 'dashboard-has-notifications': unreadCount > 0 }"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-5-5-5 5h5zm0 0v-7a6 6 0 10-12 0v7h12z"
              />
            </svg>
            <span v-if="unreadCount > 0" class="dashboard-notification-badge">
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
          </button>

          <!-- Dropdown notifications -->
          <div
            class="dashboard-notification-dropdown"
            :class="{ 'dashboard-dropdown-open': notificationsOpen }"
            v-if="notificationsOpen"
          >
            <div class="dashboard-dropdown-header">
              <h3 class="dashboard-dropdown-title">Notifications</h3>
              <button @click="markAllAsRead" class="dashboard-mark-all-btn">
                Tout marquer comme lu
              </button>
            </div>
            <div class="dashboard-notifications-list">
              <div
                v-for="notification in notifications"
                :key="notification.id"
                class="dashboard-notification-item"
                :class="{ 'dashboard-unread': !notification.read }"
              >
                <div class="dashboard-notification-icon">
                  <div
                    class="dashboard-notification-icon-wrapper"
                    :class="notification.type"
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
                        :d="getNotificationIcon(notification.type)"
                      />
                    </svg>
                  </div>
                </div>
                <div class="dashboard-notification-content">
                  <p class="dashboard-notification-title">
                    {{ notification.title }}
                  </p>
                  <p class="dashboard-notification-text">
                    {{ notification.message }}
                  </p>
                  <span class="dashboard-notification-time">{{
                    formatTime(notification.time)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { gsap } from "gsap";
import { nextTick } from "vue";
import { Notification } from "./types/types";
import { User } from "@/services/api";

interface Props {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  currentUser: User;
  notifications?: Notification[];
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  showNotifications: true,
  notifications: () => [],
});

const emit = defineEmits<{
  toggleMobile: [];
  search: [query: string];
  profileAction: [action: string];
}>();

const headerRef = ref<HTMLElement | null>(null);
const notificationsOpen = ref(false);

const unreadCount = computed(() => {
  return props.notifications.filter((n) => !n.read).length;
});

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value;
};

const markAllAsRead = () => {
  props.notifications.forEach((n) => (n.read = true));
};

const getNotificationIcon = (type: string) => {
  const icons: Record<string, string> = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z",
    error:
      "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return icons[type] || icons.info;
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return "À l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
};

onMounted(async () => {
  await nextTick();
  gsap.fromTo(
    headerRef.value,
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
  );
});
</script>

<style scoped>
@import "tailwindcss";

.dashboard-header {
  @apply shadow-sm sticky top-0 left-0 right-0 z-30;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.dashboard-header-content {
  @apply flex items-center justify-between px-6 py-4;
}

.dashboard-header-left {
  @apply flex items-center space-x-4;
}

.dashboard-mobile-menu-btn {
  @apply p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200;
}

.dashboard-header-title {
  @apply space-y-1;
}

.dashboard-title-text {
  @apply text-xl font-semibold text-gray-900;
}

.dashboard-subtitle-text {
  @apply text-sm text-gray-500;
}

.dashboard-header-center {
  @apply flex-1 max-w-md mx-8;
}

.dashboard-search-container {
  @apply relative;
}

.dashboard-search-input-wrapper {
  @apply flex items-center relative;
}

.dashboard-search-icon {
  @apply absolute left-3 w-5 h-5 text-gray-400;
}

.dashboard-search-input {
  @apply w-full pl-10 pr-10 py-2 
         bg-gray-50 border border-gray-200 
         rounded-lg text-sm
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-all duration-200;
}

.dashboard-search-clear {
  @apply absolute right-3 p-1 text-gray-400 
         hover:text-gray-600 transition-colors duration-200;
}

.dashboard-header-right {
  @apply flex items-center space-x-4;
}

.dashboard-header-actions {
  @apply flex items-center space-x-2;
}

.dashboard-notification-container {
  @apply relative;
}

.dashboard-notification-btn {
  @apply relative p-2 text-gray-600 
         hover:bg-gray-100 rounded-lg transition-colors duration-200;
}

.dashboard-notification-badge {
  @apply absolute -top-1 -right-1 bg-red-500 text-white 
         text-xs rounded-full w-5 h-5 flex items-center justify-center
         font-medium;
}

.dashboard-notification-dropdown {
  @apply absolute right-0 top-full mt-2 w-80 
         bg-white border border-gray-200 
         rounded-lg shadow-lg z-50
         transform opacity-0 scale-95 pointer-events-none
         transition-all duration-200;
}

.dashboard-dropdown-open {
  @apply opacity-100 scale-100 pointer-events-auto;
}

.dashboard-dropdown-header {
  @apply p-4 border-b border-gray-200;
}

.dashboard-dropdown-title {
  @apply text-lg font-semibold text-gray-900;
}

.dashboard-mark-all-btn {
  @apply text-sm text-blue-600 hover:underline transition-colors duration-200;
}

.dashboard-notifications-list {
  @apply max-h-64 overflow-y-auto;
}

.dashboard-notification-item {
  @apply flex items-start space-x-3 p-4 
         hover:bg-gray-50 transition-colors duration-200;
}

.dashboard-notification-item.unread {
  @apply bg-blue-50;
}

.dashboard-notification-icon {
  @apply flex-shrink-0;
}

.dashboard-icon-wrapper {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
}

.dashboard-icon-wrapper.info {
  @apply bg-blue-100 text-blue-600;
}

.dashboard-icon-wrapper.success {
  @apply bg-green-100 text-green-600;
}

.dashboard-icon-wrapper.warning {
  @apply bg-yellow-100 text-yellow-600;
}

.dashboard-icon-wrapper.error {
  @apply bg-red-100 text-red-600;
}

.dashboard-notification-content {
  @apply flex-1 space-y-1;
}

.dashboard-notification-title {
  @apply text-sm font-medium text-gray-900;
}

.dashboard-notification-text {
  @apply text-sm text-gray-600;
}

.dashboard-notification-time {
  @apply text-xs text-gray-500;
}

.dashboard-arrow-open {
  @apply rotate-180;
}

.dashboard-user-info {
  @apply flex items-center space-x-3;
}

.dashboard-user-avatar {
  @apply w-10 h-10 rounded-full object-cover;
}

.dashboard-user-details {
  @apply flex-1;
}

.dashboard-user-name {
  @apply text-sm font-medium;
}

.dashboard-user-email {
  @apply text-xs;
}

.dashboard-dropdown-menu {
  @apply py-2;
}

.dashboard-dropdown-item {
  @apply flex items-center space-x-3 px-4 py-2 
         text-sm text-gray-700 transition-colors duration-200;
}

.dashboard-dropdown-divider {
  @apply my-2 border-t border-gray-200;
}

.dark .dashboard-header {
  @apply bg-gray-900 border-gray-700;
}

.dark .dashboard-mobile-menu-btn {
  @apply text-gray-300 hover:bg-gray-800;
}

.dark .dashboard-title-text {
  @apply text-white;
}

.dark .dashboard-subtitle-text {
  @apply text-gray-400;
}

.dark .dashboard-search-icon {
  @apply text-gray-500;
}

.dark .dashboard-search-input {
  @apply bg-gray-800 border-gray-700 text-gray-300;
}

.dark .dashboard-search-clear {
  @apply text-gray-500 hover:text-gray-300;
}

.dark .dashboard-notification-btn {
  @apply text-gray-300 hover:bg-gray-800;
}

.dark .dashboard-notification-badge {
  @apply bg-red-500 text-white;
}

.dark .dashboard-notification-dropdown {
  @apply bg-gray-800 border-gray-700;
}

.dark .dashboard-dropdown-title {
  @apply text-white;
}

.dark .dashboard-mark-all-btn {
  @apply text-blue-400 hover:underline;
}

.dark .dashboard-notification-item {
  @apply hover:bg-gray-700;
}

.dark .dashboard-notification-item.unread {
  @apply bg-blue-900/10;
}

.dark .dashboard-icon-wrapper.info {
  @apply bg-blue-900/20 text-blue-400;
}

.dark .dashboard-icon-wrapper.success {
  @apply bg-green-900/20 text-green-400;
}

.dark .dashboard-icon-wrapper.warning {
  @apply bg-yellow-900/20 text-yellow-400;
}

.dark .dashboard-icon-wrapper.error {
  @apply bg-red-900/20 text-red-400;
}

.dark .dashboard-notification-title {
  @apply text-white;
}

.dark .dashboard-notification-text {
  @apply text-gray-300;
}

.dark .dashboard-notification-time {
  @apply text-gray-400;
}

.dark .dashboard-dropdown-item {
  @apply text-gray-300 hover:bg-gray-700;
}
</style>
