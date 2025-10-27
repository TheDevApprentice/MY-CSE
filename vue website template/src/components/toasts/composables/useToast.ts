// composables/useToast.ts
import { ref, nextTick } from "vue";
import type {
  Toast,
  ToastType,
  UseToastReturn,
} from "@/components/events/types/event";
import { TOAST_DURATION } from "@/components/events/constants/events";

/**
 * Composable pour la gestion des notifications toast
 */
export function useToast(): UseToastReturn {
  // État réactif
  const toasts = ref<Toast[]>([]);
  const maxToasts = ref(5); // Limite du nombre de toasts affichés

  // Méthodes
  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = TOAST_DURATION
  ): void => {
    const toast: Toast = {
      id: Date.now() + Math.random(), // ID unique
      message: message.trim(),
      type,
    };

    // Ajouter le toast
    toasts.value.push(toast);

    // Limiter le nombre de toasts affichés
    if (toasts.value.length > maxToasts.value) {
      toasts.value = toasts.value.slice(-maxToasts.value);
    }

    // Programmer la suppression automatique
    if (duration > 0) {
      setTimeout(() => {
        removeToast(toast.id);
      }, duration);
    }
  };

  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAllToasts = (): void => {
    toasts.value = [];
  };

  // Méthodes de convenance pour différents types
  const showSuccess = (message: string, duration?: number): void => {
    showToast(message, "success", duration);
  };

  const showError = (message: string, duration?: number): void => {
    showToast(message, "error", duration);
  };

  const showInfo = (message: string, duration?: number): void => {
    showToast(message, "info", duration);
  };

  const showWarning = (message: string, duration?: number): void => {
    showToast(message, "error", duration); // Utilise le style error pour warning
  };

  // Méthodes pour les actions sur événements
  const showEventRegistrationSuccess = (eventTitle: string): void => {
    showSuccess(`Inscription confirmée pour "${eventTitle}"`);
  };

  const showEventRegistrationError = (eventTitle: string): void => {
    showError(`Impossible de s'inscrire à "${eventTitle}"`);
  };

  const showEventAddedToFavorites = (): void => {
    showSuccess("Ajouté aux favoris");
  };

  const showEventRemovedFromFavorites = (): void => {
    showInfo("Retiré des favoris");
  };

  const showEventShared = (): void => {
    showSuccess("Lien copié dans le presse-papier");
  };

  const showEventExported = (): void => {
    showSuccess("Calendrier exporté avec succès");
  };

  const showFiltersApplied = (): void => {
    showInfo("Filtres appliqués");
  };

  const showFiltersCleared = (): void => {
    showInfo("Filtres effacés");
  };

  // Gestion avancée
  const hasToasts = (): boolean => {
    return toasts.value.length > 0;
  };

  const getToastCount = (): number => {
    return toasts.value.length;
  };

  const getToastsByType = (type: ToastType): Toast[] => {
    return toasts.value.filter((toast) => toast.type === type);
  };

  const hasErrorToasts = (): boolean => {
    return toasts.value.some((toast) => toast.type === "error");
  };

  const removeAllToastsByType = (type: ToastType): void => {
    toasts.value = toasts.value.filter((toast) => toast.type !== type);
  };

  // Méthodes pour l'animation et l'UX
  const pauseToastDuration = (id: number): void => {
    // Cette méthode pourrait être étendue pour gérer la pause des timers
    // Pour l'instant, c'est un placeholder pour une fonctionnalité future
    console.log(`Pause duration for toast ${id}`);
  };

  const resumeToastDuration = (id: number): void => {
    // Cette méthode pourrait être étendue pour gérer la reprise des timers
    // Pour l'instant, c'est un placeholder pour une fonctionnalité future
    console.log(`Resume duration for toast ${id}`);
  };

  // Configuration
  const setMaxToasts = (max: number): void => {
    maxToasts.value = Math.max(1, Math.min(10, max)); // Entre 1 et 10

    // Ajuster la liste actuelle si nécessaire
    if (toasts.value.length > maxToasts.value) {
      toasts.value = toasts.value.slice(-maxToasts.value);
    }
  };

  const getMaxToasts = (): number => {
    return maxToasts.value;
  };

  // Méthodes pour les tests et le debug
  const createTestToast = (type: ToastType = "info"): void => {
    const messages = {
      success: "Test de notification de succès",
      error: "Test de notification d'erreur",
      info: "Test de notification d'information",
    };

    showToast(messages[type], type);
  };

  return {
    // État
    toasts,

    // Méthodes principales
    showToast,
    removeToast,
    clearAllToasts,

    // Méthodes de convenance
    showSuccess,
    showError,
    showInfo,
    showWarning,

    // Méthodes spécifiques aux événements
    showEventRegistrationSuccess,
    showEventRegistrationError,
    showEventAddedToFavorites,
    showEventRemovedFromFavorites,
    showEventShared,
    showEventExported,
    showFiltersApplied,
    showFiltersCleared,

    // Utilitaires
    hasToasts,
    getToastCount,
    getToastsByType,
    hasErrorToasts,
    removeAllToastsByType,

    // Animation
    pauseToastDuration,
    resumeToastDuration,

    // Configuration
    setMaxToasts,
    getMaxToasts,

    // Test/Debug
    createTestToast,
  };
}
