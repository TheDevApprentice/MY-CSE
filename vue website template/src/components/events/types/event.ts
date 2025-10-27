// types/event.ts
import { CalendarDay } from "@/components/common/ui/calendar/types/types";
import { ComputedRef, Ref } from "vue";

// Types littéraux
export type EventCategory =
  | "sortie"
  | "culture"
  | "sport"
  | "formation"
  | "social";
export type ToastType = "success" | "error" | "info";
export type ViewType = "calendar" | "list" | "grid";
export type SortField = "date" | "title" | "category" | "participants";
export type SortOrder = "asc" | "desc";

// Interfaces principales
export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: EventCategory;
  participants: number;
  maxParticipants: number;
  image: string;
  price?: number;
  participantsList?: Participant[];
}

export interface Participant {
  id: number;
  name: string;
  avatar: string;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface CalendarEventDay extends CalendarDay {
  events: Event[];
}

export interface AdvancedFilters {
  startDate: string;
  endDate: string;
  location: string;
  maxPrice: number | null;
  minAvailableSpots: number | null;
  onlyAvailable: boolean;
  onlyFavorites: boolean;
}

// Interfaces pour les composables
export interface UseEventsReturn {
  events: Ref<Event[]>;
  selectedEvent: Ref<Event | null>;
  favorites: Ref<number[]>;
  registeredEvents: Ref<number[]>;
  loading: Ref<boolean>;
  totalParticipants: ComputedRef<number>;
  upcomingEvents: ComputedRef<Event[]>;
  loadEvents: () => Promise<void>;
  selectEvent: (event: Event) => void;
  clearSelection: () => void;
  isRegistered: (event: Event) => boolean;
  isFavorite: (event: Event) => boolean;
  getRegistrationLabel: (event: Event) => string;
  registerForEvent: (event: Event) => boolean;
  unregisterFromEvent: (event: Event) => boolean;
  addToFavorites: (event: Event) => boolean;
  shareEvent: (event: Event) => Promise<string>;
  addToCalendar: (event: Event) => void;
  getEventStats: () => any;
  saveFavoritesToStorage: () => void;
  loadFavoritesFromStorage: () => void;
  saveRegistrationsToStorage: () => void;
  loadRegistrationsFromStorage: () => void;
  init: () => Promise<void>;
}

export interface UseFiltersReturn {
  searchQuery: Ref<string>;
  selectedCategory: Ref<string>;
  sortBy: Ref<SortField>;
  sortOrder: Ref<SortOrder>;
  advancedFilters: Ref<AdvancedFilters>;
  filteredEvents: ComputedRef<Event[]>;
  filteredAndSortedEvents: ComputedRef<Event[]>;
  hasActiveFilters: ComputedRef<boolean>;
  getFilterSummary: ComputedRef<string>;
  clearFilters: () => void;
  clearSearchOnly: () => void;
  toggleSortOrder: () => void;
  setSortField: (field: SortField) => void;
  updateAdvancedFilter: <K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => void;
  resetAdvancedFilters: () => void;
  saveFiltersToStorage: () => void;
  loadFiltersFromStorage: () => void;
}

export interface UseCalendarReturn {
  currentDate: Ref<Date>;
  selectedDay: Ref<Date | null>;
  calendarDays: ComputedRef<CalendarDay[]>;
  currentMonth: ComputedRef<string>;
  isCurrentMonth: ComputedRef<boolean>;
  selectedDayEvents: ComputedRef<Event[]>;
  monthStats: ComputedRef<{
    eventsCount: number;
    totalParticipants: number;
    categoriesCount: Record<string, number>;
    averageParticipants: number;
  }>;
  previousMonth: () => void;
  nextMonth: () => void;
  goToToday: () => void;
  goToMonth: (year: number, month: number) => void;
  goToDate: (date: Date) => void;
  selectDay: (day: CalendarDay) => void;
  clearDaySelection: () => void;
  isDateSelected: (date: Date) => boolean;
  getDayEvents: (date: Date) => Event[];
  hasEventsOnDate: (date: Date) => boolean;
  getEventsCountForDate: (date: Date) => number;
  isToday: (date: Date) => boolean;
  isWeekend: (date: Date) => boolean;
  isPastDate: (date: Date) => boolean;
  formatCalendarTitle: () => string;
  getMonthEventsSummary: () => any[];
  findNextEventDate: () => Date | null;
  goToNextEvent: () => boolean;
  getWeekDays: (startDate: Date) => CalendarDay[];
}

export interface UseToastReturn {
  toasts: Ref<Toast[]>;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
  clearAllToasts: () => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showEventRegistrationSuccess: (eventTitle: string) => void;
  showEventRegistrationError: (eventTitle: string) => void;
  showEventAddedToFavorites: () => void;
  showEventRemovedFromFavorites: () => void;
  showEventShared: () => void;
  showEventExported: () => void;
  showFiltersApplied: () => void;
  showFiltersCleared: () => void;
  hasToasts: () => boolean;
  getToastCount: () => number;
  getToastsByType: (type: ToastType) => Toast[];
  hasErrorToasts: () => boolean;
  removeAllToastsByType: (type: ToastType) => void;
  pauseToastDuration: (id: number) => void;
  resumeToastDuration: (id: number) => void;
  setMaxToasts: (max: number) => void;
  getMaxToasts: () => number;
  createTestToast: (type?: ToastType) => void;
}

export interface UseEventViewReturn {
  currentView: Ref<ViewType>;
  loading: Ref<boolean>;
  showFiltersModal: Ref<boolean>;
  isAnimating: Ref<boolean>;
  isMobile: Ref<boolean>;
  isTablet: Ref<boolean>;
  calendarSection: Ref<HTMLElement | null>;
  listSection: Ref<HTMLElement | null>;
  gridSection: Ref<HTMLElement | null>;
  eventSidebar: Ref<HTMLElement | null>;
  selectedEvent: Ref<Event | null>;
  switchView: (view: ViewType) => Promise<void>;
  setLoading: (state: boolean) => void;
  animateEventSelection: (eventElement: HTMLElement) => Promise<void>;
  animateEventSidebar: () => Promise<void>;
  animatePageEntry: () => Promise<void>;
  animateEventCards: (selector: string) => Promise<void>;
  animateCalendarDays: () => Promise<void>;
  openFiltersModal: () => void;
  closeFiltersModal: () => void;
  isCurrentView: (view: ViewType) => boolean;
  getViewLabel: (view: ViewType) => string;
  updateResponsiveState: () => void;
  initView: () => Promise<void>;
  cleanupView: () => void;
  saveViewPreference: (view: ViewType) => void;
  loadViewPreference: () => ViewType;
}
