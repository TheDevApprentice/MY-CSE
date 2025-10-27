// composables/useFilters.ts
import { ref, computed, watch, type Ref } from "vue";
import type {
  Event,
  AdvancedFilters,
  SortField,
  SortOrder,
  UseFiltersReturn,
} from "@/components/events/types/event";
import { DEFAULT_ADVANCED_FILTERS } from "@/components/events/constants/events";

/**
 * Composable pour la gestion des filtres et du tri
 */
export function useFilters(
  events: Ref<Event[]>,
  favorites: Ref<number[]>
): UseFiltersReturn {
  // État réactif
  const searchQuery = ref("");
  const selectedCategory = ref("");
  const sortBy = ref<SortField>("date");
  const sortOrder = ref<SortOrder>("asc");
  const advancedFilters = ref<AdvancedFilters>({ ...DEFAULT_ADVANCED_FILTERS });

  // Computed - Filtrage
  const filteredEvents = computed((): Event[] => {
    let filtered = [...events.value];

    // Filtre de recherche textuelle
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (selectedCategory.value) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory.value
      );
    }

    // Filtres avancés
    filtered = applyAdvancedFilters(filtered);

    return filtered;
  });

  // Computed - Tri
  const filteredAndSortedEvents = computed((): Event[] => {
    const sorted = [...filteredEvents.value];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortBy.value) {
        case "date":
          compareValue = a.date.getTime() - b.date.getTime();
          break;
        case "title":
          compareValue = a.title.localeCompare(b.title, "fr", {
            sensitivity: "base",
          });
          break;
        case "category":
          compareValue = a.category.localeCompare(b.category, "fr", {
            sensitivity: "base",
          });
          break;
        case "participants":
          compareValue = a.participants - b.participants;
          break;
        default:
          compareValue = 0;
      }

      return sortOrder.value === "asc" ? compareValue : -compareValue;
    });

    return sorted;
  });

  // Méthodes privées
  const applyAdvancedFilters = (events: Event[]): Event[] => {
    let filtered = [...events];

    // Filtre par date de début
    if (advancedFilters.value.startDate) {
      const startDate = new Date(advancedFilters.value.startDate);
      filtered = filtered.filter((event) => event.date >= startDate);
    }

    // Filtre par date de fin
    if (advancedFilters.value.endDate) {
      const endDate = new Date(advancedFilters.value.endDate);
      endDate.setHours(23, 59, 59, 999); // Fin de journée
      filtered = filtered.filter((event) => event.date <= endDate);
    }

    // Filtre par lieu
    if (advancedFilters.value.location?.trim()) {
      const location = advancedFilters.value.location.toLowerCase().trim();
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(location)
      );
    }

    // Filtre par prix maximum
    if (
      advancedFilters.value.maxPrice !== null &&
      advancedFilters.value.maxPrice >= 0
    ) {
      filtered = filtered.filter(
        (event) =>
          !event.price || event.price <= advancedFilters.value.maxPrice!
      );
    }

    // Filtre par places disponibles minimum
    if (
      advancedFilters.value.minAvailableSpots !== null &&
      advancedFilters.value.minAvailableSpots >= 0
    ) {
      filtered = filtered.filter(
        (event) =>
          event.maxParticipants - event.participants >=
          advancedFilters.value.minAvailableSpots!
      );
    }

    // Filtre - seulement les événements avec places disponibles
    if (advancedFilters.value.onlyAvailable) {
      filtered = filtered.filter(
        (event) => event.participants < event.maxParticipants
      );
    }

    // Filtre - seulement les favoris
    if (advancedFilters.value.onlyFavorites) {
      filtered = filtered.filter((event) => favorites.value.includes(event.id));
    }

    return filtered;
  };

  // Méthodes publiques
  const clearFilters = (): void => {
    searchQuery.value = "";
    selectedCategory.value = "";
    sortBy.value = "date";
    sortOrder.value = "asc";
    advancedFilters.value = { ...DEFAULT_ADVANCED_FILTERS };
  };

  const clearSearchOnly = (): void => {
    searchQuery.value = "";
  };

  const toggleSortOrder = (): void => {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  };

  const setSortField = (field: SortField): void => {
    if (sortBy.value === field) {
      toggleSortOrder();
    } else {
      sortBy.value = field;
      sortOrder.value = "asc";
    }
  };

  const updateAdvancedFilter = <K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ): void => {
    advancedFilters.value[key] = value;
  };

  const resetAdvancedFilters = (): void => {
    advancedFilters.value = { ...DEFAULT_ADVANCED_FILTERS };
  };

  const hasActiveFilters = computed((): boolean => {
    return (
      searchQuery.value.trim() !== "" ||
      selectedCategory.value !== "" ||
      advancedFilters.value.startDate !== "" ||
      advancedFilters.value.endDate !== "" ||
      (advancedFilters.value.location?.trim() || "") !== "" ||
      advancedFilters.value.maxPrice !== null ||
      advancedFilters.value.minAvailableSpots !== null ||
      advancedFilters.value.onlyAvailable ||
      advancedFilters.value.onlyFavorites
    );
  });

  const getFilterSummary = computed((): string => {
    const parts: string[] = [];

    if (searchQuery.value.trim()) {
      parts.push(`Recherche: "${searchQuery.value}"`);
    }

    if (selectedCategory.value) {
      parts.push(`Catégorie: ${selectedCategory.value}`);
    }

    if (advancedFilters.value.onlyAvailable) {
      parts.push("Places disponibles");
    }

    if (advancedFilters.value.onlyFavorites) {
      parts.push("Favoris uniquement");
    }

    return parts.length > 0 ? parts.join(" • ") : "Aucun filtre actif";
  });

  // Persistance (optionnel)
  const saveFiltersToStorage = (): void => {
    try {
      const filtersToSave = {
        selectedCategory: selectedCategory.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        advancedFilters: advancedFilters.value,
      };
      localStorage.setItem("event-filters", JSON.stringify(filtersToSave));
    } catch (error) {
      console.warn("Impossible de sauvegarder les filtres:", error);
    }
  };

  const loadFiltersFromStorage = (): void => {
    try {
      const stored = localStorage.getItem("event-filters");
      if (stored) {
        const parsedFilters = JSON.parse(stored);
        selectedCategory.value = parsedFilters.selectedCategory || "";
        sortBy.value = parsedFilters.sortBy || "date";
        sortOrder.value = parsedFilters.sortOrder || "asc";
        advancedFilters.value = {
          ...DEFAULT_ADVANCED_FILTERS,
          ...parsedFilters.advancedFilters,
        };
      }
    } catch (error) {
      console.warn("Impossible de charger les filtres:", error);
    }
  };

  // Watchers pour la persistance automatique
  watch(
    [selectedCategory, sortBy, sortOrder, advancedFilters],
    () => {
      saveFiltersToStorage();
    },
    { deep: true }
  );

  return {
    // État
    searchQuery,
    selectedCategory,
    sortBy,
    sortOrder,
    advancedFilters,

    // Computed
    filteredEvents,
    filteredAndSortedEvents,
    hasActiveFilters,
    getFilterSummary,

    // Méthodes
    clearFilters,
    clearSearchOnly,
    toggleSortOrder,
    setSortField,
    updateAdvancedFilter,
    resetAdvancedFilters,
    saveFiltersToStorage,
    loadFiltersFromStorage,
  };
}
