// composables/index.ts
// Export de tous les composables pour faciliter les imports

export { useEvents } from "./useEvents";
export { useFilters } from "./useFilters";
export { useCalendar } from "./useCalendar";
export { useToast } from "@/components/toasts/composables/useToast";
export { useView } from "./useView";
export { useEventPage } from "./useEventPage";

// Re-export des types
export type {
  Event,
  Participant,
  Toast,
  CalendarEventDay,
  AdvancedFilters,
  UseEventsReturn,
  UseFiltersReturn,
  UseCalendarReturn,
  UseToastReturn,
  UseEventViewReturn,
} from "@/components/events/types/event";

// Re-export des constantes
export {
  DAYS_OF_WEEK,
  EVENT_CATEGORIES,
  EVENT_CATEGORY_CLASSES,
  CATEGORY_STYLING,
  SORT_OPTIONS,
  CALENDAR_GRID_CELLS,
  TOAST_DURATION,
  DEFAULT_ADVANCED_FILTERS,
} from "@/components/events/constants/events";

// Re-export des utilitaires
export {
  isSameDay,
  formatCalendarTitle,
  formatEventDate,
  formatDay,
  formatMonth,
  createGoogleCalendarUrl,
  generateCalendarDays,
} from "@/utils/dateUtils";

// Re-export du service
export { EventService } from "@/services/cse/events/eventService";
