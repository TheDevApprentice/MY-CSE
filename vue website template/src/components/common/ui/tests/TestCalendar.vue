<template>
  <div class="test-calendar-view p-6">
    <CalendarView
      ref="calendarSection"
      :calendar-days="calendarDays"
      :current-date="currentDate"
      :selected-day="selectedDay"
      :selected-event="selectedEvent"
      @select-day="selectDay"
      @select-event="selectEvent"
      @previous-month="previousMonth"
      @next-month="nextMonth"
      @go-to-today="goToToday"
      @register-event="registerForEvent"
      @add-to-favorites="addToFavorites"
      @share-event="shareEvent"
      @add-to-calendar="addToCalendar"
      @close-sidebar="clearSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { useEventPage } from "@/components/events/composables/useEventPage";
// import EventCreationForm from "@/components/news/EventCreationForm.vue";
import { EventService } from "@/services/cse/events/eventService";

// Composants dynamiques
const CalendarView = defineAsyncComponent(
  () => import("@/components/events/CalendarView.vue")
);
// const ListView = defineAsyncComponent(
//   () => import("@/components/events/ListView.vue")
// );
// const GridView = defineAsyncComponent(
//   () => import("@/components/events/GridView.vue")
// );
// const ToastContainer = defineAsyncComponent(
//   () => import("@/components/toasts/ToastContainer.vue")
// );

// Icons
const IconCalendar = defineAsyncComponent(
  () => import("@icons/CalendarIcon.vue")
);
const IconList = defineAsyncComponent(() => import("@icons/IconList.vue"));
const IconGrid = defineAsyncComponent(() => import("@icons/IconGrid.vue"));
const IconSearch = defineAsyncComponent(() => import("@icons/IconSearch.vue"));
const IconX = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));
const IconArrowUp = defineAsyncComponent(
  () => import("@icons/IconArrowUp.vue")
);
const IconArrowDown = defineAsyncComponent(
  () => import("@icons/IconArrowDown.vue")
);

// État du formulaire d'événement
const showEventForm = ref(false);

// Ouvrir le formulaire d'événement
const openEventForm = () => {
  showEventForm.value = true;
};

// Gérer la fermeture du formulaire
const handleEventFormClose = () => {
  showEventForm.value = false;
};

// Gérer la soumission du formulaire
const handleEventFormSubmit = (formData) => {
  // Ici, vous pouvez ajouter la logique pour envoyer le formulaire au serveur
  console.log("Formulaire soumis :", formData);

  // Afficher un message de succès
  showToast("Votre événement a été soumis avec succès !", "success");

  // Fermer le formulaire
  showEventForm.value = false;
};

// Utilisation du composable principal
const {
  // État
  events,
  totalParticipants,
  upcomingEvents,
  currentView,
  loading,
  searchQuery,
  selectedCategory,
  sortBy,
  sortOrder,
  currentDate,
  selectedDay,
  calendarDays,
  selectedEvent,
  toasts,
  getEventById,
  // Méthodes
  selectEvent,
  selectDay,
  registerForEvent,
  addToFavorites,
  shareEvent,
  addToCalendar,
  switchView,
  exportCalendar,
  clearSearchOnly,
  clearSelection,
  toggleSortOrder,
  previousMonth,
  nextMonth,
  goToToday,
  removeToast,
  filteredAndSortedEvents,

  // Constantes
  EVENT_CATEGORIES,
} = useEventPage();

onMounted(async () => {
  const preferredView = localStorage.getItem("preferred-view");
  if (preferredView) {
    switchView(preferredView);
  }
  const eventId = localStorage.getItem("selectedEventId");
  if (eventId) {
    console.log("Event ID trouvé :", eventId);
    const eventSelected = await EventService.getEventById(Number(eventId));
    selectEvent(eventSelected);
  }
});
</script>

<style scoped>
.events-page {
  min-height: 100vh;
}

.events-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.events-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" fill-opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" fill-opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" fill-opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" fill-opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Mobile responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .controls-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .controls-left {
    flex-direction: column;
    gap: 1rem;
  }

  .controls-right {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .events-page {
    padding: 0;
  }

  .header-container {
    padding: 1.5rem;
  }

  .events-content {
    padding: 1rem;
  }

  .unified-controls {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem !important;
  }

  .stats-bar {
    justify-content: center;
  }

  .controls-left {
    flex-wrap: wrap;
  }

  .search-container {
    order: 1;
    width: 100%;
  }

  .search-input {
    width: 100% !important;
  }
}
.test-calendar-view {
  height: auto;
}

.day-event {
  margin-bottom: 2px;
}

.more-events {
  margin-top: 2px;
}
</style>
