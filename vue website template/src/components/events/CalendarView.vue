<!-- components/events/CalendarView.vue - Version avec sidebar responsive -->
<template>
  <div class="calendar-view">
    <!-- Calendrier principal -->
    <Calendar
      :calendar-days="calendarDaysWithEvents"
      :current-date="currentDate"
      :selected-day="selectedDay"
      :selected-item="selectedEvent"
      :is-dark-mode="isDark"
      :days-of-week="DAYS_OF_WEEK"
      :max-items-per-day="2"
      item-title-key="title"
      item-class-key="categoryClass"
      today-label="Aujourd'hui"
      more-items-label="événements"
      sidebar-title="Détails de l'événement"
      @select-day="$emit('selectDay', $event)"
      @select-item="handleSelectEvent"
      @previous-month="$emit('previousMonth')"
      @next-month="$emit('nextMonth')"
      @go-to-today="$emit('goToToday')"
      @close-sidebar="handleCloseSidebar"
    >
      <!-- Slot pour les actions du header -->
      <template #actions>
        <!-- Actions additionnelles si nécessaire -->
      </template>

      <!-- Slot personnalisé pour les événements du jour -->
      <template #day-item="{ items, day, maxVisible }">
        <div
          v-for="event in items.slice(0, maxVisible)"
          :key="event.id"
          class="day-event"
          :class="EVENT_CATEGORY_CLASSES[event.category]"
          @click.stop="handleSelectEvent(event)"
        >
          {{ event.title }}
        </div>
        <div v-if="items.length > maxVisible" class="more-events">
          +{{ items.length - maxVisible }} événements
        </div>
      </template>

      <!-- Pas de sidebar dans le Calendar générique, on utilise notre propre sidebar -->
      <template #sidebar>
        <!-- Sidebar personnalisée responsive pour les événements -->
        <EventSidebar
          v-if="selectedEvent"
          :event="selectedEvent"
          :is-dark-mode="isDark"
          :is-favorite="isEventFavorite(selectedEvent)"
          :is-registered="isEventRegistered(selectedEvent)"
          @register-event="$emit('registerEvent', $event)"
          @add-to-favorites="$emit('addToFavorites', $event)"
          @share-event="$emit('shareEvent', $event)"
          @add-to-calendar="$emit('addToCalendar', $event)"
          @close="handleCloseSidebar"
        />
      </template>
    </Calendar>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, watch, nextTick } from "vue";
import type { Event, CalendarEventDay } from "@/components/events/types/event";
import {
  DAYS_OF_WEEK,
  EVENT_CATEGORY_CLASSES,
} from "@/components/events/constants/events";
import { useTheme } from "@/composables/useTheme";

// Components
const Calendar = defineAsyncComponent(
  () => import("@/components/common/ui/calendar/Calendar.vue")
);
const EventSidebar = defineAsyncComponent(() => import("./components/EventSidebar.vue"));

const { isDark } = useTheme();

// Props
interface Props {
  calendarDays: CalendarEventDay[];
  currentDate: Date;
  selectedDay: Date | null;
  selectedEvent: Event | null;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  selectDay: [day: CalendarEventDay];
  selectEvent: [event: Event];
  previousMonth: [];
  nextMonth: [];
  goToToday: [];
  exportCalendar: [];
  registerEvent: [event: Event];
  addToFavorites: [event: Event];
  shareEvent: [event: Event];
  addToCalendar: [event: Event];
  closeSidebar: [];
}>();

// Computed - Adapter les données pour le composant générique
const calendarDaysWithEvents = computed(() => {
  return props.calendarDays.map((day) => ({
    ...day,
    items:
      day.events?.map((event) => ({
        ...event,
        categoryClass: EVENT_CATEGORY_CLASSES[event.category],
      })) || [],
  }));
});

// Methods
const handleSelectEvent = (event: Event) => {
  emit("selectEvent", event);
};

const handleCloseSidebar = () => {
  emit("closeSidebar");
};

// Méthodes pour vérifier l'état des événements
const isEventFavorite = (event: Event): boolean => {
  // TODO: Implémenter la logique de vérification des favoris
  // Peut être récupéré depuis un store, localStorage, ou API
  return false;
};

const isEventRegistered = (event: Event): boolean => {
  // TODO: Implémenter la logique de vérification d'inscription
  // Peut être récupéré depuis un store, localStorage, ou API
  return false;
};

// Gérer le scroll du body quand la sidebar est ouverte
watch(
  () => props.selectedEvent,
  (newEvent, oldEvent) => {
    nextTick(() => {
      if (newEvent && !oldEvent) {
        // Sidebar s'ouvre
        document.body.classList.add("sidebar-open");
      } else if (!newEvent && oldEvent) {
        // Sidebar se ferme
        document.body.classList.remove("sidebar-open");
      }
    });
  }
);

// Nettoyer les classes du body quand le composant est démonté
import { onUnmounted } from "vue";
onUnmounted(() => {
  document.body.classList.remove("sidebar-open");
});
</script>

<style>
@import "tailwindcss";

.calendar-view {
  @apply relative;
}

/* Styles pour les événements du jour */
.day-event {
  @apply px-2 py-1 rounded-lg text-xs font-medium text-white;
  @apply transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer;
  @apply truncate;
}

.more-events {
  @apply text-xs font-medium px-1;
  @apply text-gray-600;
}

.dark .more-events {
  @apply text-gray-400;
}

/* Responsive pour les événements du jour */
@media (max-width: 768px) {
  .day-event {
    @apply text-xs px-1 py-0.5;
  }

  .more-events {
    @apply text-xs;
  }
}

/* Assurer que l'overlay ne scroll pas le body */
:global(body.sidebar-open) {
  overflow: hidden;
}
</style>
