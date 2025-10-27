<!-- components/common/calendar/Calendar.vue - Version sans redimensionnement -->
<template>
  <div class="calendar-section" :class="{ dark: isDark }">
    <div class="calendar-layout w-full max-w-7xl min-h-screen">
      <!-- Calendrier principal - Prend toujours toute la largeur -->
      <div class="calendar-main">
        <div
          class="calendar-container backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <!-- Header calendrier -->
          <div
            class="calendar-header flex flex-col lg:flex-row justify-between items-center mb-6 gap-4"
          >
            <div class="calendar-nav flex items-center gap-4">
              <button @click="$emit('previousMonth')" class="nav-btn">
                <IconChevronLeft class="w-6 h-6" />
              </button>
              <button @click="$emit('goToToday')" class="today-btn">
                {{ todayLabel }}
              </button>
              <button @click="$emit('nextMonth')" class="nav-btn">
                <IconChevronRight class="w-6 h-6" />
              </button>
            </div>

            <h2
              class="calendar-title text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 capitalize"
              style="font-size: clamp(1.25rem, 4vw, 1.75rem)"
            >
              {{ formatCalendarTitle(currentDate) }}
            </h2>

            <div class="calendar-actions flex items-center gap-3">
              <slot name="actions"></slot>
            </div>
          </div>

          <!-- Grid calendrier -->
          <div class="calendar-grid">
            <!-- En-têtes des jours -->
            <div
              class="calendar-days-header grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4"
            >
              <div
                v-for="day in daysOfWeek"
                :key="day"
                class="day-header text-center font-semibold text-gray-600 dark:text-gray-300 text-sm py-3"
                style="font-size: clamp(0.65rem, 2vw, 0.875rem)"
              >
                {{ day }}
              </div>
            </div>

            <!-- Jours du calendrier -->
            <div class="calendar-days grid grid-cols-7 gap-1 sm:gap-2">
              <div
                v-for="day in calendarDays"
                :key="`${day.date}-${day.isCurrentMonth}`"
                class="calendar-day group relative bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-1 sm:p-3 min-h-[80px] xs:min-h-[100px] lg:min-h-[120px] cursor-pointer transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105 hover:shadow-lg"
                :class="getDayClasses(day)"
                @click="$emit('selectDay', day)"
              >
                <span
                  class="day-number font-bold text-gray-800 dark:text-gray-200 text-sm lg:text-base"
                  :class="getDayNumberClasses(day)"
                  style="font-size: clamp(0.75rem, 3vw, 1rem)"
                >
                  {{ day.day }}
                </span>

                <!-- Slot pour les items du jour -->
                <div
                  v-if="day.items && day.items.length > 0"
                  class="day-items mt-2 space-y-1"
                >
                  <slot
                    name="day-item"
                    :items="day.items"
                    :day="day"
                    :maxVisible="maxItemsPerDay"
                  >
                    <!-- Rendu par défaut -->
                    <div
                      v-for="item in day.items.slice(0, maxItemsPerDay)"
                      :key="item.id"
                      class="day-item px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-pointer"
                      :class="getItemClasses(item)"
                      @click.stop="$emit('selectItem', item)"
                    >
                      {{ getItemTitle(item) }}
                    </div>
                    <div
                      v-if="day.items.length > maxItemsPerDay"
                      class="more-items text-xs text-gray-600 dark:text-gray-400 font-medium px-1"
                    >
                      +{{ day.items.length - maxItemsPerDay }}
                      {{ moreItemsLabel }}
                    </div>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar en overlay via slot - Ne prend pas de place dans le layout -->
      <slot
        name="sidebar"
        :selectedItem="selectedItem"
        :selectedDay="selectedDay"
      >
        <!-- Sidebar par défaut seulement si pas de slot personnalisé -->
        <transition
          name="sidebar"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="translate-x-full opacity-0"
          enter-to-class="translate-x-0 opacity-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="translate-x-0 opacity-100"
          leave-to-class="translate-x-full opacity-0"
        >
          <div v-if="showSidebar" class="calendar-sidebar-default">
            <CalendarSidebar
              v-if="selectedItem"
              :title="sidebarTitle"
              @close="closeSidebar"
            >
              <template #content>
                <div class="p-4 text-gray-700 dark:text-gray-300">
                  Aucun contenu défini pour la sidebar
                </div>
              </template>
            </CalendarSidebar>
          </div>
        </transition>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from "vue";
import { formatCalendarTitle, isSameDay } from "@/utils/dateUtils";
import { CalendarDay, CalendarItem } from "./types/types";
import { useTheme } from "@/composables/useTheme";

// Components
const CalendarSidebar = defineAsyncComponent(
  () => import("./CalendarSidebar.vue")
);
const IconChevronLeft = defineAsyncComponent(
  () => import("@icons/IconChevronLeft.vue")
);
const IconChevronRight = defineAsyncComponent(
  () => import("@icons/IconChevronRight.vue")
);

// Props
interface Props {
  calendarDays: CalendarDay[];
  currentDate: Date;
  selectedDay?: Date | null;
  selectedItem?: CalendarItem | null;
  daysOfWeek?: string[];
  maxItemsPerDay?: number;
  itemTitleKey?: string;
  itemClassKey?: string;
  defaultItemClasses?: string;
  todayLabel?: string;
  moreItemsLabel?: string;
  sidebarTitle?: string;
}

const { isDark } = useTheme();

const props = withDefaults(defineProps<Props>(), {
  daysOfWeek: () => ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  maxItemsPerDay: 2,
  itemTitleKey: "title",
  itemClassKey: "class",
  defaultItemClasses: "bg-blue-500 text-white",
  todayLabel: "Aujourd'hui",
  moreItemsLabel: "autres",
  sidebarTitle: "Détails",
});

// Emits
const emit = defineEmits<{
  selectDay: [day: CalendarDay];
  selectItem: [item: CalendarItem];
  previousMonth: [];
  nextMonth: [];
  goToToday: [];
  closeSidebar: [];
}>();

// Computed
const showSidebar = computed(() => {
  return !!(props.selectedItem || props.selectedDay);
});

// Methods
const closeSidebar = () => {
  emit("closeSidebar");
};

const getDayClasses = (day: CalendarDay): string[] => {
  const classes: string[] = [];

  if (!day.isCurrentMonth) {
    classes.push("opacity-40");
  }

  if (day.isToday) {
    classes.push(
      "bg-blue-100",
      "dark:bg-blue-900/50",
      "ring-2",
      "ring-blue-300",
      "dark:ring-blue-500"
    );
  }

  if (day.items && day.items.length > 0) {
    classes.push(
      "bg-gradient-to-br",
      "from-blue-100",
      "to-blue-100",
      "dark:from-blue-900/30",
      "dark:to-blue-900/30"
    );
  }

  if (day.isToday && day.items && day.items.length > 0) {
    classes.push(
      "bg-gradient-to-br",
      "from-blue-200",
      "to-purple-200",
      "dark:from-blue-800/50",
      "dark:to-purple-800/50",
      "ring-2",
      "ring-blue-400",
      "dark:ring-blue-500"
    );
  }

  if (props.selectedDay && isSameDay(props.selectedDay, day.date)) {
    classes.push(
      "ring-2",
      "ring-purple-300",
      "dark:ring-purple-500",
      "bg-purple-100",
      "dark:bg-purple-900/30"
    );
  }

  return classes;
};

const getDayNumberClasses = (day: CalendarDay): string[] => {
  const classes: string[] = [];

  if (!day.isCurrentMonth) {
    classes.push("text-gray-400", "dark:text-gray-600");
  }

  if (day.isToday) {
    classes.push("text-blue-600", "dark:text-blue-400");
  }

  return classes;
};

const getItemClasses = (item: CalendarItem): string => {
  return item[props.itemClassKey] || props.defaultItemClasses;
};

const getItemTitle = (item: CalendarItem): string => {
  return (
    item[props.itemTitleKey] || item.name || item.title || "Item sans titre"
  );
};
</script>

<style>
@import "tailwindcss";

/* Layout simplifié - Le calendrier prend toujours toute la largeur */
.calendar-layout {
  @apply flex relative;
}

.calendar-main {
  @apply flex-1 p-4 lg:p-8;
}

/* Sidebar par défaut (seulement si pas de slot personnalisé) */
.calendar-sidebar-default {
  @apply fixed top-0 right-0 h-full w-full max-w-md z-50;
}

/* Boutons de navigation */
.nav-btn,
.today-btn {
  @apply flex items-center justify-center px-3 py-2 lg:px-4 lg:py-3;
  @apply bg-gray-50 border border-gray-200 rounded-xl;
  @apply text-gray-600 font-medium cursor-pointer;
  @apply transition-all duration-300 hover:bg-gray-100 hover:text-gray-800;
  @apply hover:-translate-y-0.5 hover:shadow-lg;
}

.dark .nav-btn,
.dark .today-btn {
  @apply bg-gray-700 border-gray-600 text-gray-300;
  @apply hover:bg-gray-600 hover:text-gray-100;
}

.nav-btn {
  @apply px-2 py-2 lg:px-3 lg:py-3;
}

/* Jours du calendrier */
.calendar-day {
  @apply border border-transparent;
}

.calendar-day:hover {
  @apply border-blue-300;
  @apply -translate-y-1;
}

.dark .calendar-day:hover {
  @apply border-blue-500;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-main {
    @apply p-2;
  }

  .calendar-container {
    @apply p-3;
  }

  .calendar-day {
    @apply min-h-[70px] p-1;
  }

  .day-item {
    @apply text-xs px-1 py-0.5;
  }
}

@media (max-width: 480px) {
  .calendar-header {
    @apply flex-col gap-3;
  }

  .calendar-nav {
    @apply order-2;
  }

  .calendar-title {
    @apply order-1 text-center;
  }

  .calendar-actions {
    @apply order-3;
  }
}

/* Animations pour la sidebar par défaut */
.sidebar-enter-active,
.sidebar-leave-active {
  @apply transition-all duration-500;
}

.sidebar-enter-from {
  @apply translate-x-full opacity-0;
}

.sidebar-leave-to {
  @apply translate-x-full opacity-0;
}
</style>
