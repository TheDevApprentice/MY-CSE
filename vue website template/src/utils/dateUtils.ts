// utils/dateUtils.ts
import type { Event, CalendarEventDay } from '@/components/events/types/event';

/**
 * Vérifie si deux dates correspondent au même jour
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Formate le titre du calendrier (ex: "janvier 2025")
 */
export const formatCalendarTitle = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Formate une date complète pour l'affichage d'événement
 */
export const formatEventDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Formate le jour (ex: "15")
 */
export const formatDay = (date: Date): string => {
  return date.getDate().toString().padStart(2, "0");
};

/**
 * Formate le mois court (ex: "jan")
 */
export const formatMonth = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);
};

/**
 * Crée une URL de calendrier Google pour un événement
 */
export const createGoogleCalendarUrl = (event: { 
  title: string; 
  description: string; 
  date: Date; 
  location: string 
}): string => {
  const startDate = event.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endDate = new Date(event.date.getTime() + 2 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}`;
};

/**
 * Génère les jours du calendrier pour un mois donné
 */
export const generateCalendarDays = (currentDate: Date, events: Event[]): CalendarEventDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0

  const days: CalendarEventDay[] = [];

  // Jours du mois précédent
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      day: date.getDate(),
      date: new Date(date),
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  // Jours du mois actuel
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const isToday = isSameDay(date, new Date());
    const dayEvents = events.filter((event) => isSameDay(event.date, date));

    days.push({
      day,
      date: new Date(date),
      isCurrentMonth: true,
      isToday,
      events: dayEvents,
    });
  }

  // Jours du mois suivant
  const totalCells = 42; // 6 semaines × 7 jours
  const remainingCells = totalCells - days.length;

  for (let day = 1; day <= remainingCells; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      day,
      date: new Date(date),
      isCurrentMonth: false,
      isToday: false,
      events: [],
    });
  }

  return days;
};