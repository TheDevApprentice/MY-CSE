<!-- EventView.vue - Version refactorisée avec responsive et dark mode -->
<template>
  <div class="events-page">
    <!-- Header moderne avec glassmorphism -->
    <div class="events-header">
      <div class="header-container max-w-8xl">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">Événements du CE</h1>
            <p class="page-subtitle">
              Découvrez et participez aux événements de votre comité
              d'entreprise
            </p>
          </div>
          <div class="stats-bar">
            <div class="stat-item">
              <span class="stat-number">{{ events.length }}</span>
              <span class="stat-label">Événements</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalParticipants }}</span>
              <span class="stat-label">Participants</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ upcomingEvents.length }}</span>
              <span class="stat-label">À venir</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content principal -->
    <div class="events-content">
      <div class="content-container">
        <!-- Barre de contrôles unifiée -->
        <div class="unified-controls">
          <div class="controls-content">
            <!-- Barre de recherche - Prend le maximum d'espace -->
            <div class="search-container">
              <IconSearch class="search-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un événement..."
                class="search-input"
              />
              <button
                v-if="searchQuery"
                @click="clearSearchOnly"
                class="clear-search"
              >
                <IconX class="clear-icon" />
              </button>
            </div>

            <!-- Contrôles compacts -->
            <div class="controls-right">
              <!-- Tri par date (seulement si pas en vue calendrier) -->
              <select
                v-if="currentView !== 'calendar'"
                v-model="sortBy"
                class="sort-select"
              >
                <option value="date">Date</option>
                <option value="title">Titre</option>
                <option value="category">Catégorie</option>
                <option value="participants">Participants</option>
              </select>

              <button
                v-if="currentView !== 'calendar'"
                @click="toggleSortOrder"
                class="sort-order-btn"
              >
                <IconArrowUp v-if="sortOrder === 'asc'" class="sort-icon" />
                <IconArrowDown v-else class="sort-icon" />
              </button>

              <!-- Filtre par catégorie -->
              <select v-model="selectedCategory" class="category-select">
                <option value="">Toutes</option>
                <option
                  v-for="(label, key) in EVENT_CATEGORIES"
                  :key="key"
                  :value="key"
                >
                  {{ label }}
                </option>
              </select>

              <!-- Switch de vues -->
              <div class="view-toggle">
                <button
                  class="toggle-btn"
                  :class="{ active: currentView === 'calendar' }"
                  @click="switchView('calendar')"
                >
                  <IconCalendar class="toggle-icon" />
                </button>
                <button
                  class="toggle-btn"
                  :class="{ active: currentView === 'list' }"
                  @click="switchView('list')"
                >
                  <IconList class="toggle-icon" />
                </button>
                <button
                  class="toggle-btn"
                  :class="{ active: currentView === 'grid' }"
                  @click="switchView('grid')"
                >
                  <IconGrid class="toggle-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Vue Calendrier -->
        <CalendarView
          v-if="currentView === 'calendar'"
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

        <!-- Vue Liste -->
        <ListView
          v-else-if="currentView === 'list'"
          ref="listSection"
          :events="filteredAndSortedEvents"
          :loading="loading"
          :search-query="searchQuery"
          @select-event="selectEvent"
          @register-event="registerForEvent"
          @add-to-favorites="addToFavorites"
          @share-event="shareEvent"
        />

        <!-- Vue Grille -->
        <GridView
          v-else
          ref="gridSection"
          :events="filteredAndSortedEvents"
          :loading="loading"
          :search-query="searchQuery"
          @select-event="selectEvent"
          @register-event="registerForEvent"
          @add-to-favorites="addToFavorites"
          @share-event="shareEvent"
        />
      </div>
    </div>

    <!-- Composant de formulaire d'événement -->
    <EventCreationForm
      v-if="showEventForm"
      :show="showEventForm"
      @close="handleEventFormClose"
      @submit="handleEventFormSubmit"
    />

    <!-- Bannière d'action -->
    <section class="action-banner">
      <div class="action-container">
        <div class="action-content">
          <h2 class="action-title">Vous organisez un événement ?</h2>
          <p class="action-subtitle">
            Faites-le nous savoir et nous le partagerons avec toute l'entreprise
            !
          </p>
          <button @click="openEventForm" class="action-btn">
            <svg
              class="action-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Proposer un événement
          </button>
        </div>
      </div>
    </section>

    <!-- Toast Notifications -->
    <ToastContainer :toasts="toasts" @remove-toast="removeToast" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onMounted } from "vue";
import { useEventPage } from "@/components/events/composables/useEventPage";
import EventCreationForm from "@/components/news/EventCreationForm.vue";
import { EventService } from "@/services/cse/events/eventService";
import { useToast } from "@/components/toasts/composables/useToast";
import { Event } from "@/components/events/composables";
import { ViewType } from "@/components/events/types/event";

// Composants dynamiques
const CalendarView = defineAsyncComponent(
  () => import("@/components/events/CalendarView.vue")
);
const ListView = defineAsyncComponent(
  () => import("@/components/events/ListVIew.vue")
);
const GridView = defineAsyncComponent(
  () => import("@/components/events/GridView.vue")
);
const ToastContainer = defineAsyncComponent(
  () => import("@/components/toasts/ToastContainer.vue")
);

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

const { showToast } = useToast();

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
const handleEventFormSubmit = (formData: any) => {
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
  const preferredView: string | null = localStorage.getItem("preferred-view");
  if (preferredView) {
    switchView(preferredView as ViewType);
  }
  const eventId = localStorage.getItem("selectedEventId");
  if (eventId) {
    console.log("Event ID trouvé :", eventId);
    const eventSelected: Event | null = await EventService.getEventById(
      Number(eventId)
    );
    if (eventSelected) {
      selectEvent(eventSelected);
    }
  }
});
</script>

<style>
@import "tailwindcss";

/* Page Layout */
.events-page {
  @apply min-h-screen w-full z-10;
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .events-page {
    padding-top: calc(4.6rem + 3.5rem);
  }
}

/* Header */
.events-header {
  @apply relative z-20;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.events-header::before {
  @apply absolute inset-0 pointer-events-none;
  content: "";
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" fill-opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" fill-opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" fill-opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" fill-opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.header-container {
  @apply mx-auto px-6 py-8;
}

.header-content {
  @apply flex justify-between items-start gap-4 flex-wrap relative z-10;
}

.header-left {
  @apply flex-1 min-w-0;
}

.page-title {
  @apply text-4xl lg:text-5xl font-bold text-white mb-2;
}

.page-subtitle {
  @apply text-lg text-white/80;
}

.stats-bar {
  @apply flex gap-4 lg:gap-8 flex-wrap justify-end;
}

.stat-item {
  @apply flex flex-col items-center p-3 lg:p-4 rounded-xl backdrop-blur-lg border;
  @apply bg-white/10 border-white/20;
}

.stat-number {
  @apply text-2xl lg:text-3xl font-bold text-white;
}

.stat-label {
  @apply text-xs lg:text-sm text-white/70 uppercase tracking-wide;
}

/* Content */
.events-content {
  @apply pt-4 z-20;
}

.content-container {
  @apply max-w-7xl mx-auto px-4 lg:px-6;
}

/* Unified Controls */
.unified-controls {
  @apply z-50 backdrop-blur-xl rounded-2xl p-3 mb-8 shadow-lg border;
  @apply bg-white/90 border-gray-200;
}

.dark .unified-controls {
  @apply bg-gray-800/90 border-gray-700;
}

.controls-content {
  @apply flex items-center gap-3 w-full;
}

/* Search Container - Prend le maximum d'espace */
.search-container {
  @apply relative flex-1 min-w-0;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10;
  @apply text-gray-400;
}

.dark .search-icon {
  @apply text-gray-500;
}

.search-input {
  @apply w-full pl-10 pr-10 py-2.5 rounded-lg border font-medium transition-all duration-300;
  @apply bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500;
  @apply focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20;
}

.dark .search-input {
  @apply bg-gray-700 border-gray-600 text-white placeholder-gray-400;
  @apply focus:bg-gray-600 focus:border-blue-400;
}

.clear-search {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-colors duration-200;
  @apply text-gray-400 hover:text-gray-600;
}

.dark .clear-search {
  @apply text-gray-500 hover:text-gray-300;
}

.clear-icon {
  @apply w-4 h-4;
}

/* Controls Right */
.controls-right {
  @apply flex items-center gap-2 flex-shrink-0;
}

/* Sort Select */
.sort-select {
  @apply px-3 py-2.5 rounded-lg border font-medium cursor-pointer transition-all duration-200;
  @apply bg-gray-50 border-gray-200 text-gray-800;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply text-sm min-w-0;
}

.dark .sort-select {
  @apply bg-gray-700 border-gray-600 text-white;
}

/* Sort Order Button */
.sort-order-btn {
  @apply p-2.5 rounded-lg border transition-all duration-200;
  @apply bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.dark .sort-order-btn {
  @apply bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600;
}

.sort-icon {
  @apply w-4 h-4;
}

/* Category Select */
.category-select {
  @apply px-3 py-2.5 rounded-lg border font-medium cursor-pointer transition-all duration-200;
  @apply bg-gray-50 border-gray-200 text-gray-800;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply text-sm min-w-0 max-w-24 lg:max-w-32;
}

.dark .category-select {
  @apply bg-gray-700 border-gray-600 text-white;
}

/* View Toggle */
.view-toggle {
  @apply flex rounded-lg p-1 border;
  @apply bg-gray-50 border-gray-200;
}

.dark .view-toggle {
  @apply bg-gray-700 border-gray-600;
}

.toggle-btn {
  @apply flex items-center p-2 rounded-md font-medium transition-all duration-200;
  @apply text-gray-600 hover:text-gray-800 hover:bg-gray-100;
}

.dark .toggle-btn {
  @apply text-gray-400 hover:text-gray-200 hover:bg-gray-600;
}

.toggle-btn.active {
  @apply bg-blue-500 text-white shadow-md;
}

.toggle-icon {
  @apply w-4 h-4;
}

/* Action Banner */
.action-banner {
  @apply relative overflow-hidden mt-16 py-16;
  @apply bg-gradient-to-r from-blue-600 to-blue-700 text-white;
}

.action-container {
  @apply container mx-auto px-4 relative z-10;
}

.action-content {
  @apply max-w-4xl mx-auto text-center;
}

.action-title {
  @apply text-3xl md:text-4xl font-bold mb-4;
}

.action-subtitle {
  @apply text-xl mb-8 max-w-2xl mx-auto opacity-90;
}

.action-btn {
  @apply inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300;
  @apply bg-white text-blue-700 hover:bg-gray-100;
  @apply transform hover:-translate-y-0.5 hover:shadow-lg;
}

.action-icon {
  @apply w-5 h-5;
}

/* Responsive Overrides */
@media (max-width: 1024px) {
  .header-content {
    @apply flex-col items-stretch;
  }

  .stats-bar {
    @apply justify-center;
  }
}

@media (max-width: 768px) {
  .events-page {
    @apply p-0;
  }

  .header-container {
    @apply px-4 py-6;
  }

  .events-content {
    @apply px-0;
  }

  .content-container {
    @apply px-4;
  }

  .unified-controls {
    @apply p-2;
  }

  .controls-content {
    @apply gap-2;
  }

  .search-input {
    @apply py-2 text-sm;
  }

  .sort-select,
  .category-select {
    @apply py-2 px-2 text-xs;
  }

  .category-select {
    @apply max-w-20;
  }

  .toggle-btn {
    @apply p-1.5;
  }

  .toggle-icon {
    @apply w-3.5 h-3.5;
  }
}

@media (max-width: 480px) {
  .page-title {
    @apply text-2xl;
  }

  .stats-bar {
    @apply flex-col gap-2;
  }

  .stat-item {
    @apply flex-row justify-between p-3;
  }

  .category-select {
    @apply max-w-16 text-xs;
  }

  .sort-select {
    @apply hidden;
  }

  .sort-order-btn {
    @apply hidden;
  }
}

/* Assure que les sélecteurs ne dépassent pas */
select {
  @apply max-w-full overflow-hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
