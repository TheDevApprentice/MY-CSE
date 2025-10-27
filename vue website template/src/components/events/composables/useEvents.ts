// composables/useEvents.ts
import { ref, computed } from "vue";
import type { Event, UseEventsReturn } from "@/components/events/types/event";
import { EventService } from "@/services/cse/events/eventService";
import { createGoogleCalendarUrl } from "@/utils/dateUtils";

/**
 * Composable pour la gestion des événements
 */
export function useEvents(): UseEventsReturn {
  // État réactif
  const events = ref<Event[]>([]);
  const selectedEvent = ref<Event | null>(null);
  const favorites = ref<number[]>([]);
  const registeredEvents = ref<number[]>([]);
  const loading = ref(false);

  // Computed
  const totalParticipants = computed(() =>
    events.value.reduce((sum, event) => sum + event.participants, 0)
  );

  const upcomingEvents = computed(() =>
    events.value.filter((event) => event.date >= new Date())
  );

  // Méthodes
  const loadEvents = async (): Promise<void> => {
    loading.value = true;
    try {
      events.value = await EventService.getEvents();
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    } finally {
      loading.value = false;
    }
  };

  const selectEvent = (event: Event): void => {
    selectedEvent.value = event;
  };

  const clearSelection = (): void => {
    selectedEvent.value = null;
  };

  const isRegistered = (event: Event): boolean => {
    return registeredEvents.value.includes(event.id);
  };

  const isFavorite = (event: Event): boolean => {
    return favorites.value.includes(event.id);
  };

  const getRegistrationLabel = (event: Event): string => {
    if (isRegistered(event)) return "Inscrit";
    if (event.participants >= event.maxParticipants) return "Complet";
    return "S'inscrire";
  };

  const registerForEvent = (event: Event): boolean => {
    if (event.participants < event.maxParticipants && !isRegistered(event)) {
      event.participants++;
      registeredEvents.value.push(event.id);
      return true;
    }
    return false;
  };

  const unregisterFromEvent = (event: Event): boolean => {
    if (isRegistered(event) && event.participants > 0) {
      event.participants--;
      registeredEvents.value = registeredEvents.value.filter(
        (id) => id !== event.id
      );
      return true;
    }
    return false;
  };

  const addToFavorites = (event: Event): boolean => {
    if (isFavorite(event)) {
      favorites.value = favorites.value.filter((id) => id !== event.id);
      return false; // Retiré des favoris
    } else {
      favorites.value.push(event.id);
      return true; // Ajouté aux favoris
    }
  };

  const shareEvent = async (event: Event): Promise<string> => {
    try {
      return await EventService.shareEvent(event);
    } catch (error) {
      console.error("Erreur lors du partage:", error);
      throw error;
    }
  };

  const addToCalendar = (event: Event): void => {
    const calendarUrl = createGoogleCalendarUrl({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    });
    window.open(calendarUrl, "_blank");
  };

  const getEventStats = () => {
    return EventService.getEventStats(events.value);
  };

  // Persistance locale (optionnel)
  const saveFavoritesToStorage = (): void => {
    try {
      localStorage.setItem("event-favorites", JSON.stringify(favorites.value));
    } catch (error) {
      console.warn("Impossible de sauvegarder les favoris:", error);
    }
  };

  const loadFavoritesFromStorage = (): void => {
    try {
      const stored = localStorage.getItem("event-favorites");
      if (stored) {
        favorites.value = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Impossible de charger les favoris:", error);
    }
  };

  const saveRegistrationsToStorage = (): void => {
    try {
      localStorage.setItem(
        "event-registrations",
        JSON.stringify(registeredEvents.value)
      );
    } catch (error) {
      console.warn("Impossible de sauvegarder les inscriptions:", error);
    }
  };

  const loadRegistrationsFromStorage = (): void => {
    try {
      const stored = localStorage.getItem("event-registrations");
      if (stored) {
        registeredEvents.value = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Impossible de charger les inscriptions:", error);
    }
  };

  // Initialisation
  const init = async (): Promise<void> => {
    loadFavoritesFromStorage();
    loadRegistrationsFromStorage();
    await loadEvents();
  };

  return {
    // État
    events,
    selectedEvent,
    favorites,
    registeredEvents,
    loading,

    // Computed
    totalParticipants,
    upcomingEvents,

    // Méthodes
    loadEvents,
    selectEvent,
    clearSelection,
    isRegistered,
    isFavorite,
    getRegistrationLabel,
    registerForEvent,
    unregisterFromEvent,
    addToFavorites,
    shareEvent,
    addToCalendar,
    getEventStats,
    saveFavoritesToStorage,
    loadFavoritesFromStorage,
    saveRegistrationsToStorage,
    loadRegistrationsFromStorage,
    init,
  };
}
