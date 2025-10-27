<!-- components/common/calendar/CalendarSidebar.vue - Version générique -->
<template>
  <div
    class="generic-sidebar relative right-0 top-8 bottom-0 h-[calc(100vh-0px)] w-[420px] border-0 border-gray-200/50 dark:border-slate-600/40 rounded-xs"
    :class="{ dark: isDark }"
  >
    <div
      class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-2xl dark:shadow-black/40 border-l border-gray-200/50 dark:border-slate-600/40 overflow-hidden h-full"
    >
      <!-- Header personnalisable -->
      <div
        class="sidebar-header flex justify-between items-center p-6 border-b border-gray-200/70 dark:border-slate-700/60"
      >
        <slot name="header" :title="title">
          <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200">
            {{ title }}
          </h3>
        </slot>

        <button
          @click="$emit('close')"
          class="close-btn dark:hover:bg-slate-700"
        >
          <slot name="close-icon">
            <IconX class="w-6 h-6" />
          </slot>
        </button>
      </div>

      <!-- Contenu principal -->
      <div
        class="sidebar-content max-h-[calc(100vh-100px)] overflow-y-auto"
        :class="contentPadding"
      >
        <slot name="content" :data="data">
          <!-- Contenu par défaut si rien n'est fourni -->
          <div class="p-6 text-center text-gray-500 dark:text-gray-400">
            Aucun contenu défini pour cette sidebar
          </div>
        </slot>
      </div>

      <!-- Footer optionnel -->
      <div
        v-if="$slots.footer"
        class="sidebar-footer border-t border-gray-200/70 dark:border-slate-700/60"
        :class="footerPadding"
      >
        <slot name="footer" :data="data"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();

// Components
const IconX = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));

// Props
interface Props {
  title?: string;
  data?: any;
  contentPadding?: string;
  footerPadding?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Détails",
  data: null,
  contentPadding: "p-6",
  footerPadding: "p-6",
  width: "420px",
});

// Emits
defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.generic-sidebar {
  animation: slideInRight 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: v-bind(width);
}

@keyframes slideInRight {
  from {
    transform: translateX(80%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.dark .close-btn {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  border-color: #475569;
  color: #e2e8f0;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.2);
}

.close-btn:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #1e293b;
  transform: scale(1.05);
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.1);
}

.dark .close-btn:hover {
  background: linear-gradient(135deg, #475569 0%, #374151 100%);
  color: #f8fafc;
  box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.3);
}

/* Responsive */
@media (max-width: 1280px) {
  .generic-sidebar {
    width: 100vw !important;
    left: 0 !important;
  }
}

@media (max-width: 768px) {
  .sidebar-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    padding: 1rem;
  }

  .sidebar-content {
    padding: 0.75rem;
  }
}

/* Améliorations de l'accessibilité */
.close-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dark .close-btn:focus {
  outline-color: #60a5fa;
}
</style>
