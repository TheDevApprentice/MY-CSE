<!-- components/events/CalendarView.vue - Utilisant Calendar générique -->
<template>
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
      <!-- Uncomment si besoin d'exporter -->
      <!-- <button @click="$emit('exportCalendar')" class="export-btn">
        <IconDownload class="w-5 h-5" />
        Exporter
      </button> -->
    </template>

    <!-- Slot personnalisé pour les événements du jour -->
    <template #day-item="{ items, day, maxVisible }">
      <div
        v-for="event in items.slice(0, maxVisible)"
        :key="event.id"
        class="day-event px-2 py-1 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer"
        :class="EVENT_CATEGORY_CLASSES[event.category]"
        @click.stop="handleSelectEvent(event)"
      >
        {{ event.title }}
      </div>
      <div
        v-if="items.length > maxVisible"
        class="more-events text-xs text-gray-600 dark:text-gray-400 font-medium px-1"
      >
        +{{ items.length - maxVisible }} événements
      </div>
    </template>

    <!-- Sidebar personnalisée pour les événements -->
    <template #sidebar="{ selectedItem }">
      <CalendarSideBarView
        v-if="selectedItem"
        :event="selectedItem"
        :is-dark-mode="isDark"
        :is-favorite="isEventFavorite(selectedItem)"
        :is-registered="isEventRegistered(selectedItem)"
        @register-event="$emit('registerEvent', $event)"
        @add-to-favorites="$emit('addToFavorites', $event)"
        @share-event="$emit('shareEvent', $event)"
        @add-to-calendar="$emit('addToCalendar', $event)"
        @close="handleCloseSidebar"
      />
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
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
const CalendarSideBarView = defineAsyncComponent(
  () => import("./CalendarSideBarView.vue")
);
const IconDownload = defineAsyncComponent(
  () => import("@icons/IconDownload.vue")
);

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
</script>

<style scoped>
.export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dark .export-btn {
  background: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

.export-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .export-btn:hover {
  background: #4b5563;
  color: #f9fafb;
}

/* Styles pour les événements du calendrier */
.day-event {
  /* Styles déjà définis dans le template avec les classes Tailwind */
}

.more-events {
  /* Styles déjà définis dans le template avec les classes Tailwind */
}
</style>
