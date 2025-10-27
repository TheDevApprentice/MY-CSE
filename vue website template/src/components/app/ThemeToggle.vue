<template>
  <button
    @click="toggleTheme"
    type="button"
    class="theme-toggle-glass flex items-center justify-center w-10 h-10 rounded-full outline-none transition-all duration-200"
    :class="[
      isDark
        ? 'dark text-blue-300 hover:text-white border border-gray-700 hover:border-gray-600'
        : 'text-yellow-500 hover:text-yellow-600 bg-white border border-gray-200 hover:border-gray-300',
      'focus-visible:outline-none',
      'transform hover:-translate-y-0.5',
      'transition-all duration-200 ease-in-out',
    ]"
    :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
  >
    <span class="sr-only">
      {{ isDark ? "Passer en mode clair" : "Passer en mode sombre" }}
    </span>
    <span class="relative w-5 h-5 flex items-center justify-center">
      <!-- Sun -->
      <svg
        v-show="!isDark"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        :class="{ 'text-yellow-500': !isDark }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <!-- Moon + étoiles -->
      <template v-if="isDark">
        <span class="relative w-5 h-5 flex items-center justify-center">
          <!-- Lune -->
          <svg
            v-if="isDark"
            class="w-4 h-4 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :class="{ 'text-blue-300': isDark }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </span>
      </template>
    </span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}
.theme-toggle-glass {
  background: rgba(31, 38, 135, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 4px 24px 0 rgba(99, 102, 241, 0.01),
    0 0 40px 8px rgba(59, 130, 246, 0.01);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
  transition: box-shadow 0.4s cubic-bezier(0.4, 2, 0.6, 1), background 0.3s;
}
.theme-toggle-glass.dark {
  background: rgba(10, 10, 20, 0.92);
}

.theme-toggle-glass:hover {
  box-shadow: 0 8px 20px 0 rgba(30, 34, 84, 0.2),
    0 0 38px 12px rgba(59, 130, 246, 0.2), 0 0 60px 16px rgba(59, 130, 246, 0.2);
  background: rgba(31, 38, 135, 0.18);
}
</style>
