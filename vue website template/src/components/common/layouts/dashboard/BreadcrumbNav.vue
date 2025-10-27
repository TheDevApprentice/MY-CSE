<template>
  <nav
    aria-label="Breadcrumb"
    class="dashboard-breadcrumb-nav"
    ref="breadcrumbRef"
  >
    <ol class="dashboard-breadcrumb-list">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="item.path || index"
        class="dashboard-breadcrumb-item"
        :class="{ current: index === breadcrumbs.length - 1 }"
      >
        <!-- Home icon pour le premier élément -->
        <div class="dashboard-breadcrumb-content">
          <svg
            v-if="index === 0"
            class="dashboard-breadcrumb-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>

          <!-- Lien cliquable pour tous sauf le dernier -->
          <router-link
            v-if="index < breadcrumbs.length - 1 && item.path"
            :to="item.path"
            class="dashboard-breadcrumb-link"
            @click="$emit('navigate', item)"
          >
            {{ item.label }}
          </router-link>

          <!-- Texte simple pour le dernier élément -->
          <span v-else class="dashboard-breadcrumb-current">
            {{ item.label }}
          </span>
        </div>

        <!-- Séparateur -->
        <svg
          v-if="index < breadcrumbs.length - 1"
          class="dashboard-breadcrumb-separator"
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
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";
import { BreadcrumbItem } from "./types/types";

interface Props {
  breadcrumbs: BreadcrumbItem[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  navigate: [item: BreadcrumbItem];
}>();

const breadcrumbRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await nextTick();
  if (breadcrumbRef.value) {
    const items = breadcrumbRef.value.querySelectorAll(
      ".dashboard-breadcrumb-item"
    );

    gsap.fromTo(
      items,
      {
        opacity: 0,
        x: -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }
});
</script>

<style scoped>
@import "tailwindcss";

.dashboard-breadcrumb-nav {
  @apply py-3 px-1;
}

.dashboard-breadcrumb-list {
  @apply flex items-center space-x-1 text-sm;
}

.dashboard-breadcrumb-item {
  @apply flex items-center;
  transition: all 0.2s ease;
}

.dashboard-breadcrumb-content {
  @apply flex items-center space-x-2;
}

.dashboard-breadcrumb-icon {
  @apply w-4 h-4;
}

.dashboard-breadcrumb-icon {
  @apply text-gray-500;
}

.dark .dashboard-breadcrumb-icon {
  @apply text-gray-400;
}

.dashboard-breadcrumb-link {
  @apply font-medium transition-colors duration-200 relative overflow-hidden;
}

.dashboard-breadcrumb-link {
  @apply text-gray-600 hover:text-blue-600;
}

.dark .dashboard-breadcrumb-link {
  @apply text-gray-300 hover:text-blue-400;
}

.dashboard-breadcrumb-link::before {
  content: "";
  @apply absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300;
}

.dashboard-breadcrumb-link::before {
  @apply bg-blue-600;
}

.dark .dashboard-breadcrumb-link::before {
  @apply bg-blue-400;
}

.dashboard-breadcrumb-link:hover::before {
  @apply w-full;
}

.dashboard-breadcrumb-current {
  @apply font-semibold;
}

.dashboard-breadcrumb-current {
  @apply text-gray-900;
}

.dark .dashboard-breadcrumb-current {
  @apply text-white;
}

.dashboard-breadcrumb-separator {
  @apply w-4 h-4 mx-2;
}

.dashboard-breadcrumb-separator {
  @apply text-gray-400;
}

.dark .dashboard-breadcrumb-separator {
  @apply text-gray-500;
}

.dashboard-breadcrumb-item:hover {
  transform: translateX(2px);
}

.dashboard-breadcrumb-item.current {
  @apply text-gray-900;
}

.dark .dashboard-breadcrumb-item.current {
  @apply text-white;
}
</style>
