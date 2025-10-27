// composables/useCalendar.ts
import { ref, computed, type ComputedRef } from "vue";
import type {
  Event,
  CalendarEventDay,
  UseCalendarReturn,
} from "@/components/events/types/event";
import {
  generateCalendarDays,
  formatCalendarTitle,
  isSameDay,
} from "@/utils/dateUtils";

/**
 * Composable pour la gestion du calendrier
 */
export function useCalendar(
  filteredEvents: ComputedRef<Event[]>
): UseCalendarReturn {
  // État réactif
  const currentDate = ref(new Date());
  const selectedDay = ref<Date | null>(null);

  // Computed
  const calendarDays = computed((): CalendarEventDay[] => {
    return generateCalendarDays(currentDate.value, filteredEvents.value);
  });

  const currentMonth = computed((): string => {
    return formatCalendarTitle(currentDate.value);
  });

  const isCurrentMonth = computed((): boolean => {
    const now = new Date();
    return (
      currentDate.value.getFullYear() === now.getFullYear() &&
      currentDate.value.getMonth() === now.getMonth()
    );
  });

  const selectedDayEvents = computed((): Event[] => {
    if (!selectedDay.value) return [];

    return filteredEvents.value.filter((event) =>
      isSameDay(event.date, selectedDay.value!)
    );
  });

  const monthStats = computed(() => {
    const currentMonthEvents = filteredEvents.value.filter(
      (event) =>
        event.date.getFullYear() === currentDate.value.getFullYear() &&
        event.date.getMonth() === currentDate.value.getMonth()
    );

    const totalParticipants = currentMonthEvents.reduce(
      (sum, event) => sum + event.participants,
      0
    );

    const categoriesCount = currentMonthEvents.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      eventsCount: currentMonthEvents.length,
      totalParticipants,
      categoriesCount,
      averageParticipants:
        currentMonthEvents.length > 0
          ? Math.round(totalParticipants / currentMonthEvents.length)
          : 0,
    };
  });

  // Méthodes de navigation
  const previousMonth = (): void => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
    clearDaySelection();
  };

  const nextMonth = (): void => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
    clearDaySelection();
  };

  const goToToday = (): void => {
    const today = new Date();
    currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1);
    selectedDay.value = today;
  };

  const goToMonth = (year: number, month: number): void => {
    currentDate.value = new Date(year, month, 1);
    clearDaySelection();
  };

  const goToDate = (date: Date): void => {
    currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
    selectedDay.value = new Date(date);
  };

  // Méthodes de sélection
  const selectDay = (day: CalendarEventDay): void => {
    selectedDay.value = day.date;
  };

  const clearDaySelection = (): void => {
    selectedDay.value = null;
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDay.value ? isSameDay(selectedDay.value, date) : false;
  };

  // Méthodes utilitaires
  const getDayEvents = (date: Date): Event[] => {
    return filteredEvents.value.filter((event) => isSameDay(event.date, date));
  };

  const hasEventsOnDate = (date: Date): boolean => {
    return getDayEvents(date).length > 0;
  };

  const getEventsCountForDate = (date: Date): number => {
    return getDayEvents(date).length;
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Dimanche ou Samedi
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Méthodes d'export/navigation avancée
  const getMonthEventsSummary = () => {
    const events = filteredEvents.value.filter(
      (event) =>
        event.date.getFullYear() === currentDate.value.getFullYear() &&
        event.date.getMonth() === currentDate.value.getMonth()
    );

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      day: event.date.getDate(),
      category: event.category,
      participants: event.participants,
      maxParticipants: event.maxParticipants,
    }));
  };

  const findNextEventDate = (): Date | null => {
    const now = new Date();
    const futureEvents = filteredEvents.value
      .filter((event) => event.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    return futureEvents.length > 0 ? futureEvents[0].date : null;
  };

  const goToNextEvent = (): boolean => {
    const nextEventDate = findNextEventDate();
    if (nextEventDate) {
      goToDate(nextEventDate);
      return true;
    }
    return false;
  };

  // Méthodes pour la génération de vues personnalisées
  const getWeekDays = (startDate: Date): CalendarEventDay[] => {
    const days: CalendarEventDay[] = [];
    const current = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      const dayEvents = getDayEvents(date);

      days.push({
        day: date.getDate(),
        date: new Date(date),
        isCurrentMonth: date.getMonth() === currentDate.value.getMonth(),
        isToday: isToday(date),
        events: dayEvents,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  return {
    // État
    currentDate,
    selectedDay,

    // Computed
    calendarDays,
    currentMonth,
    isCurrentMonth,
    selectedDayEvents,
    monthStats,

    // Navigation
    previousMonth,
    nextMonth,
    goToToday,
    goToMonth,
    goToDate,

    // Sélection
    selectDay,
    clearDaySelection,
    isDateSelected,

    // Utilitaires
    getDayEvents,
    hasEventsOnDate,
    getEventsCountForDate,
    isToday,
    isWeekend,
    isPastDate,
    formatCalendarTitle: () => formatCalendarTitle(currentDate.value),

    // Avancé
    getMonthEventsSummary,
    findNextEventDate,
    goToNextEvent,
    getWeekDays,
  };
}
