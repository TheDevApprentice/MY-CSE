<!-- components/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div
      class="toast-container fixed top-35 right-4 z-[1100] flex flex-col gap-3 pointer-events-none"
      :class="containerClasses"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast group relative flex items-start justify-between px-6 py-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm min-w-[320px] border-l-4 pointer-events-auto"
          :class="getToastClasses(toast)"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <!-- Icône et contenu -->
          <div class="toast-content flex items-start gap-3 flex-1">
            <div class="toast-icon flex-shrink-0 mt-0.5">
              <IconCheck
                v-if="toast.type === 'success'"
                class="w-5 h-5 text-green-500"
              />
              <IconExclamationTriangle
                v-else-if="toast.type === 'error'"
                class="w-5 h-5 text-red-500"
              />
              <IconInfo v-else class="w-5 h-5 text-blue-500" />
            </div>

            <div class="toast-message flex-1">
              <p class="text-gray-800 font-medium text-sm leading-relaxed">
                {{ toast.message }}
              </p>
            </div>
          </div>

          <!-- Bouton de fermeture -->
          <button
            @click="$emit('removeToast', toast.id)"
            class="toast-close flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
            :title="'Fermer la notification'"
          >
            <IconX class="w-4 h-4" />
          </button>

          <!-- Barre de progression -->
          <div
            v-if="showProgress"
            class="progress-bar absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-2xl transition-all duration-100 ease-linear"
            :class="getProgressClasses(toast)"
            :style="{ width: getProgressWidth(toast) }"
          ></div>

          <!-- Indicateur de type visuel -->
          <div
            class="type-indicator absolute top-2 left-2 w-2 h-2 rounded-full"
            :class="getIndicatorClasses(toast)"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import type { Toast, ToastType } from "@/components/events/types/event";

// Components
const IconCheck = defineAsyncComponent(() => import("@icons/IconCheck.vue"));
const IconExclamationTriangle = defineAsyncComponent(
  () => import("@icons/ExclamationTriangleIcon.vue")
);
const IconInfo = defineAsyncComponent(() => import("@icons/IconInfo.vue"));
const IconX = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));

// Props
interface Props {
  toasts: Toast[];
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  showProgress?: boolean;
  maxVisible?: number;
}

const props = withDefaults(defineProps<Props>(), {
  position: "top-right",
  showProgress: true,
  maxVisible: 5,
});

// Emits
defineEmits<{
  removeToast: [id: number];
}>();

// State
const pausedToasts = ref<Set<number>>(new Set());
const progressTimers = ref<
  Map<number, { startTime: number; duration: number; paused: boolean }>
>(new Map());

// Computed
const containerClasses = computed(() => {
  const baseClasses = "toast-container";

  switch (props.position) {
    case "top-left":
      return `${baseClasses} top-4 left-4`;
    case "bottom-right":
      return `${baseClasses} bottom-4 right-4`;
    case "bottom-left":
      return `${baseClasses} bottom-4 left-4`;
    case "top-center":
      return `${baseClasses} top-4 left-1/2 transform -translate-x-1/2`;
    case "bottom-center":
      return `${baseClasses} bottom-4 left-1/2 transform -translate-x-1/2`;
    default:
      return `${baseClasses} top-4 right-4`;
  }
});

const visibleToasts = computed(() => {
  return props.toasts.slice(0, props.maxVisible);
});

// Methods
const getToastClasses = (toast: Toast): string[] => {
  const classes: string[] = [];

  switch (toast.type) {
    case "success":
      classes.push("border-l-green-500");
      break;
    case "error":
      classes.push("border-l-red-500");
      break;
    default:
      classes.push("border-l-blue-500");
  }

  return classes;
};

const getProgressClasses = (toast: Toast): string => {
  switch (toast.type) {
    case "success":
      return "text-green-500";
    case "error":
      return "text-red-500";
    default:
      return "text-blue-500";
  }
};

const getIndicatorClasses = (toast: Toast): string => {
  switch (toast.type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};

const getProgressWidth = (toast: Toast): string => {
  const timer = progressTimers.value.get(toast.id);
  if (!timer || timer.paused) {
    return "100%";
  }

  const elapsed = Date.now() - timer.startTime;
  const remaining = Math.max(0, timer.duration - elapsed);
  const percentage = (remaining / timer.duration) * 100;

  return `${percentage}%`;
};

const pauseToast = (id: number): void => {
  pausedToasts.value.add(id);
  const timer = progressTimers.value.get(id);
  if (timer) {
    timer.paused = true;
  }
};

const resumeToast = (id: number): void => {
  pausedToasts.value.delete(id);
  const timer = progressTimers.value.get(id);
  if (timer) {
    timer.paused = false;
    timer.startTime =
      Date.now() - (timer.duration - (Date.now() - timer.startTime));
  }
};

// Watchers
watch(
  () => props.toasts,
  (newToasts, oldToasts) => {
    // Initialiser les timers pour les nouveaux toasts
    const oldIds = new Set(oldToasts?.map((t) => t.id) || []);

    newToasts.forEach((toast) => {
      if (!oldIds.has(toast.id) && !progressTimers.value.has(toast.id)) {
        progressTimers.value.set(toast.id, {
          startTime: Date.now(),
          duration: 5000, // 5 secondes par défaut
          paused: false,
        });
      }
    });

    // Nettoyer les timers des toasts supprimés
    const currentIds = new Set(newToasts.map((t) => t.id));
    Array.from(progressTimers.value.keys()).forEach((id) => {
      if (!currentIds.has(id)) {
        progressTimers.value.delete(id);
        pausedToasts.value.delete(id);
      }
    });
  },
  { deep: true, immediate: true }
);

// Fonction utilitaire pour formater les messages
const formatMessage = (message: string): string => {
  // Limite la longueur du message et ajoute des ellipses si nécessaire
  const maxLength = 200;
  if (message.length > maxLength) {
    return message.substring(0, maxLength) + "...";
  }
  return message;
};

// Fonction pour obtenir l'icône appropriée
const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "exclamation-triangle";
    default:
      return "information-circle";
  }
};

// Fonction pour obtenir la couleur du thème
const getThemeColor = (type: ToastType): string => {
  switch (type) {
    case "success":
      return "#10b981"; // green-500
    case "error":
      return "#ef4444"; // red-500
    default:
      return "#3b82f6"; // blue-500
  }
};

// Gestion du redimensionnement
const updateContainerPosition = (): void => {
  const container = document.querySelector(".toast-container") as HTMLElement;
  if (container && window.innerWidth < 640) {
    // Sur mobile, centrer les toasts
    container.style.left = "50%";
    container.style.right = "auto";
    container.style.transform = "translateX(-50%)";
  }
};

// Lifecycle
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  window.addEventListener("resize", updateContainerPosition);
  updateContainerPosition();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainerPosition);
});
</script>

<style scoped>
/* Animations des toasts */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-move {
  transition: transform 0.4s ease;
}

/* Styles pour les différentes positions */
.toast-container {
  max-width: calc(100vw - 2rem);
}

/* Amélioration pour mobile */
@media (max-width: 640px) {
  .toast {
    min-width: 280px !important;
    max-width: calc(100vw - 2rem) !important;
    margin: 0 auto;
  }

  .toast-container {
    left: 1rem !important;
    right: 1rem !important;
    transform: none !important;
  }
}

/* Animation de la barre de progression */
.progress-bar {
  animation: progressShrink 5s linear forwards;
}

@keyframes progressShrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Pause l'animation au hover */
.toast:hover .progress-bar {
  animation-play-state: paused;
}

/* Effet de flou au scroll */
.toast-container {
  backdrop-filter: blur(8px);
}

/* Amélioration de l'accessibilité */
.toast:focus-within {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Styles pour les états d'interaction */
.toast-close:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
  outline-style: dashed;
}

/* Animation au hover pour le bouton de fermeture */
.toast-close:hover {
  transform: scale(1.1);
}

/* Gradient subtil pour l'arrière-plan */
.toast {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
}

/* Ombre portée dynamique */
.toast {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.toast:hover {
  box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15),
    0 15px 15px -5px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
}

/* Indicateur visuel pour le type de notification */
.type-indicator {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}

/* Animation de l'indicateur */
.type-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Désactiver l'animation sur preference */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move,
  .progress-bar,
  .type-indicator {
    animation: none !important;
    transition: none !important;
  }
}
</style>
