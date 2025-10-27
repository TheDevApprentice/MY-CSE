// constants/events.ts
import type {
  EventCategory,
  AdvancedFilters,
} from "@/components/events/types/event";

export const DAYS_OF_WEEK = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
] as const;

export const EVENT_CATEGORIES: Record<EventCategory, string> = {
  sortie: "Sorties",
  culture: "Culture",
  sport: "Sport",
  formation: "Formation",
  social: "Événements sociaux",
} as const;

export const EVENT_CATEGORY_CLASSES: Record<EventCategory, string> = {
  sortie: "bg-blue-500",
  culture: "bg-purple-500",
  sport: "bg-green-500",
  formation: "bg-orange-500",
  social: "bg-red-500",
} as const;

export const CATEGORY_STYLING: Record<EventCategory, string> = {
  sortie: "bg-blue-100 text-blue-800",
  culture: "bg-purple-100 text-purple-800",
  sport: "bg-green-100 text-green-800",
  formation: "bg-orange-100 text-orange-800",
  social: "bg-red-100 text-red-800",
} as const;

export const SORT_OPTIONS = [
  { value: "date", label: "Trier par date" },
  { value: "title", label: "Trier par titre" },
  { value: "category", label: "Trier par catégorie" },
  { value: "participants", label: "Trier par participants" },
] as const;

export const CALENDAR_GRID_CELLS = 42; // 6 semaines × 7 jours

export const TOAST_DURATION = 5000; // 5 secondes

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  startDate: "",
  endDate: "",
  location: "",
  maxPrice: null,
  minAvailableSpots: null,
  onlyAvailable: false,
  onlyFavorites: false,
};
