// composables/useEventPage.ts
import { onMounted, onUnmounted, watch } from "vue";
import { useEvents } from "./useEvents";
import { useFilters } from "./useFilters";
import { useCalendar } from "./useCalendar";
import { useToast } from "@/components/toasts/composables/useToast";
import { useView } from "./useView";
import {
  EVENT_CATEGORIES,
  CATEGORY_STYLING,
  EVENT_CATEGORY_CLASSES,
} from "@/components/events/constants/events";
import type {
  Event,
  ViewType,
  CalendarEventDay,
} from "@/components/events/types/event";

/**
 * Composable principal qui orchestre toute la logique de la page événements
 */
export function useEventPage() {
  // Initialisation des composables
  const eventManager = useEvents();
  const filterManager = useFilters(eventManager.events, eventManager.favorites);
  const calendarManager = useCalendar(filterManager.filteredEvents);
  const toastManager = useToast();
  const viewManager = useView();

  // Méthodes orchestrées
  const selectEvent = (event: Event): void => {
    eventManager.selectEvent(event);
    viewManager.animateEventSidebar();
  };

  const selectDay = (day: CalendarEventDay): void => {
    calendarManager.selectDay(day);
    if (day.events.length > 0) {
      selectEvent(day.events[0]);
    }
  };

  const registerForEvent = async (event: Event): Promise<void> => {
    const success = eventManager.registerForEvent(event);

    if (success) {
      toastManager.showEventRegistrationSuccess(event.title);
      eventManager.saveRegistrationsToStorage();
    } else {
      toastManager.showEventRegistrationError(event.title);
    }
  };

  const addToFavorites = (event: Event): void => {
    const added = eventManager.addToFavorites(event);

    if (added) {
      toastManager.showEventAddedToFavorites();
    } else {
      toastManager.showEventRemovedFromFavorites();
    }

    eventManager.saveFavoritesToStorage();
  };

  const shareEvent = async (event: Event): Promise<void> => {
    try {
      const message = await eventManager.shareEvent(event);
      toastManager.showSuccess(message);
    } catch (error) {
      toastManager.showError("Erreur lors du partage");
    }
  };

  const addToCalendar = (event: Event): void => {
    eventManager.addToCalendar(event);
    toastManager.showSuccess("Événement ajouté au calendrier");
  };

  const applyFilters = (): void => {
    viewManager.closeFiltersModal();
    toastManager.showFiltersApplied();
  };

  const clearFilters = (): void => {
    filterManager.clearFilters();
    toastManager.showFiltersCleared();
  };

  const switchView = async (view: ViewType): Promise<void> => {
    eventManager.clearSelection();
    await viewManager.switchView(view);

    // Animations spécifiques selon la vue
    if (view === "calendar") {
      setTimeout(() => {
        viewManager.animateCalendarDays();
      }, 100);
    } else if (view === "grid" || view === "list") {
      setTimeout(() => {
        viewManager.animateEventCards(".event-card");
      }, 100);
    }
  };

  // Utilitaires pour le template
  const getCategoryLabel = (category: string): string => {
    return (
      EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || category
    );
  };

  const getCategoryStyling = (category: string): string => {
    return CATEGORY_STYLING[category as keyof typeof CATEGORY_STYLING] || "";
  };

  const getEventCategoryClass = (category: string): string => {
    return (
      EVENT_CATEGORY_CLASSES[category as keyof typeof EVENT_CATEGORY_CLASSES] ||
      ""
    );
  };

  // Gestion du cycle de vie
  const initializePage = async (): Promise<void> => {
    viewManager.setLoading(true);

    try {
      // Charger les préférences
      filterManager.loadFiltersFromStorage();
      const preferredView = viewManager.loadViewPreference();

      // Initialiser les données
      await eventManager.init();

      // Configurer la vue
      await viewManager.switchView(preferredView);
      await viewManager.initView();
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      toastManager.showError("Erreur lors du chargement des données");
    } finally {
      viewManager.setLoading(false);
    }
  };

  const cleanupPage = (): void => {
    viewManager.cleanupView();
  };

  // Watchers pour les interactions automatiques
  watch(filterManager.searchQuery, (newQuery) => {
    // Passer automatiquement en vue liste lors d'une recherche
    if (newQuery && viewManager.currentView.value === "calendar") {
      switchView("list");
    }
  });

  watch(filterManager.hasActiveFilters, (hasFilters) => {
    // Indicateur visuel pour les filtres actifs
    if (hasFilters) {
      // Logique pour highlighter les filtres actifs
    }
  });

  // Lifecycle hooks
  onMounted(() => {
    initializePage();
  });

  onUnmounted(() => {
    cleanupPage();
  });

  // Interface publique - SANS SPREAD OPERATORS pour éviter les conflits
  return {
    // Statistiques
    totalParticipants: eventManager.totalParticipants,
    upcomingEvents: eventManager.upcomingEvents,
    monthStats: calendarManager.monthStats,

    // Gestion des événements
    events: eventManager.events,
    selectedEvent: eventManager.selectedEvent,
    favorites: eventManager.favorites,
    registeredEvents: eventManager.registeredEvents,
    loading: viewManager.loading,

    // Fonctions d'événements
    loadEvents: eventManager.loadEvents,
    clearSelection: eventManager.clearSelection,
    isRegistered: eventManager.isRegistered,
    isFavorite: eventManager.isFavorite,
    getRegistrationLabel: eventManager.getRegistrationLabel,
    unregisterFromEvent: eventManager.unregisterFromEvent,
    getEventStats: eventManager.getEventStats,
    saveFavoritesToStorage: eventManager.saveFavoritesToStorage,
    loadFavoritesFromStorage: eventManager.loadFavoritesFromStorage,
    saveRegistrationsToStorage: eventManager.saveRegistrationsToStorage,
    loadRegistrationsFromStorage: eventManager.loadRegistrationsFromStorage,
    init: eventManager.init,

    // Gestion des filtres
    searchQuery: filterManager.searchQuery,
    selectedCategory: filterManager.selectedCategory,
    sortBy: filterManager.sortBy,
    sortOrder: filterManager.sortOrder,
    advancedFilters: filterManager.advancedFilters,
    filteredEvents: filterManager.filteredEvents,
    filteredAndSortedEvents: filterManager.filteredAndSortedEvents,
    hasActiveFilters: filterManager.hasActiveFilters,
    getFilterSummary: filterManager.getFilterSummary,

    // Fonctions de filtres
    clearSearchOnly: filterManager.clearSearchOnly,
    toggleSortOrder: filterManager.toggleSortOrder,
    setSortField: filterManager.setSortField,
    updateAdvancedFilter: filterManager.updateAdvancedFilter,
    resetAdvancedFilters: filterManager.resetAdvancedFilters,
    saveFiltersToStorage: filterManager.saveFiltersToStorage,
    loadFiltersFromStorage: filterManager.loadFiltersFromStorage,

    // Gestion du calendrier
    currentDate: calendarManager.currentDate,
    selectedDay: calendarManager.selectedDay,
    calendarDays: calendarManager.calendarDays,
    currentMonth: calendarManager.currentMonth,
    isCurrentMonth: calendarManager.isCurrentMonth,
    selectedDayEvents: calendarManager.selectedDayEvents,

    // Fonctions du calendrier
    previousMonth: calendarManager.previousMonth,
    nextMonth: calendarManager.nextMonth,
    goToToday: calendarManager.goToToday,
    goToMonth: calendarManager.goToMonth,
    goToDate: calendarManager.goToDate,
    clearDaySelection: calendarManager.clearDaySelection,
    isDateSelected: calendarManager.isDateSelected,
    getDayEvents: calendarManager.getDayEvents,
    hasEventsOnDate: calendarManager.hasEventsOnDate,
    getEventsCountForDate: calendarManager.getEventsCountForDate,
    isToday: calendarManager.isToday,
    isWeekend: calendarManager.isWeekend,
    isPastDate: calendarManager.isPastDate,
    formatCalendarTitle: calendarManager.formatCalendarTitle,
    getMonthEventsSummary: calendarManager.getMonthEventsSummary,
    findNextEventDate: calendarManager.findNextEventDate,
    goToNextEvent: calendarManager.goToNextEvent,
    getWeekDays: calendarManager.getWeekDays,

    // Gestion des vues
    currentView: viewManager.currentView,
    showFiltersModal: viewManager.showFiltersModal,
    isAnimating: viewManager.isAnimating,
    isMobile: viewManager.isMobile,
    isTablet: viewManager.isTablet,

    // Fonctions des vues
    setLoading: viewManager.setLoading,
    animateEventSelection: viewManager.animateEventSelection,
    animateEventSidebar: viewManager.animateEventSidebar,
    animatePageEntry: viewManager.animatePageEntry,
    animateEventCards: viewManager.animateEventCards,
    animateCalendarDays: viewManager.animateCalendarDays,
    openFiltersModal: viewManager.openFiltersModal,
    closeFiltersModal: viewManager.closeFiltersModal,
    isCurrentView: viewManager.isCurrentView,
    getViewLabel: viewManager.getViewLabel,
    updateResponsiveState: viewManager.updateResponsiveState,
    initView: viewManager.initView,
    cleanupView: viewManager.cleanupView,
    saveViewPreference: viewManager.saveViewPreference,
    loadViewPreference: viewManager.loadViewPreference,

    // Gestion des toasts
    toasts: toastManager.toasts,

    // Fonctions des toasts
    showToast: toastManager.showToast,
    removeToast: toastManager.removeToast,
    clearAllToasts: toastManager.clearAllToasts,
    showSuccess: toastManager.showSuccess,
    showError: toastManager.showError,
    showInfo: toastManager.showInfo,
    showWarning: toastManager.showWarning,
    showEventRegistrationSuccess: toastManager.showEventRegistrationSuccess,
    showEventRegistrationError: toastManager.showEventRegistrationError,
    showEventAddedToFavorites: toastManager.showEventAddedToFavorites,
    showEventRemovedFromFavorites: toastManager.showEventRemovedFromFavorites,
    showEventShared: toastManager.showEventShared,
    showEventExported: toastManager.showEventExported,
    showFiltersApplied: toastManager.showFiltersApplied,
    showFiltersCleared: toastManager.showFiltersCleared,
    hasToasts: toastManager.hasToasts,
    getToastCount: toastManager.getToastCount,
    getToastsByType: toastManager.getToastsByType,
    hasErrorToasts: toastManager.hasErrorToasts,
    removeAllToastsByType: toastManager.removeAllToastsByType,
    pauseToastDuration: toastManager.pauseToastDuration,
    resumeToastDuration: toastManager.resumeToastDuration,
    setMaxToasts: toastManager.setMaxToasts,
    getMaxToasts: toastManager.getMaxToasts,
    createTestToast: toastManager.createTestToast,

    // Méthodes principales orchestrées
    selectEvent,
    selectDay,
    registerForEvent,
    addToFavorites,
    shareEvent,
    addToCalendar,
    // exportCalendar,
    switchView,
    applyFilters,
    clearFilters,

    // Utilitaires
    getCategoryLabel,
    getCategoryStyling,
    getEventCategoryClass,

    // Constantes
    EVENT_CATEGORIES,
    CATEGORY_STYLING,
    EVENT_CATEGORY_CLASSES,
  };
}
