<!-- components/events/EventSidebar.vue - Version responsive -->
<template>
  <div class="event-sidebar-overlay" @click="handleOverlayClick">
    <div class="event-sidebar" @click.stop>
      <!-- Header avec titre et bouton fermer -->
      <div class="sidebar-header">
        <h3 class="sidebar-title">Détails de l'événement</h3>
        <button @click="$emit('close')" class="close-btn">
          <IconX class="close-icon" />
        </button>
      </div>

      <!-- Contenu de l'événement -->
      <div class="sidebar-content">
        <!-- Image de l'événement -->
        <div class="event-image">
          <img :src="event.image" :alt="event.title" class="event-img" />
          <div class="image-overlay"></div>
          <div class="image-actions">
            <button @click="$emit('shareEvent', event)" class="overlay-btn">
              <IconShare class="overlay-icon" />
            </button>
            <button
              @click="$emit('addToFavorites', event)"
              class="overlay-btn"
              :class="{ 'favorite-active': isFavorite }"
            >
              <IconHeart class="overlay-icon" />
            </button>
          </div>
        </div>

        <!-- Informations de l'événement -->
        <div class="event-info">
          <span
            class="event-category"
            :class="CATEGORY_STYLING[event.category]"
          >
            {{ getCategoryLabel(event.category) }}
          </span>

          <h4 class="event-title">
            {{ event.title }}
          </h4>

          <!-- Métadonnées -->
          <div class="event-meta">
            <div class="meta-item">
              <IconCalendar
                class="meta-icon text-blue-500 dark:text-blue-400"
              />
              <span class="meta-text">{{ formatEventDate(event.date) }}</span>
            </div>
            <div class="meta-item">
              <IconClock class="meta-icon text-green-500 dark:text-green-400" />
              <span class="meta-text">{{ event.time }}</span>
            </div>
            <div class="meta-item">
              <IconMapPin class="meta-icon text-red-500 dark:text-red-400" />
              <span class="meta-text">{{ event.location }}</span>
            </div>
            <div class="meta-item">
              <IconUsers
                class="meta-icon text-purple-500 dark:text-purple-400"
              />
              <span class="meta-text"
                >{{ event.participants }}/{{
                  event.maxParticipants
                }}
                participants</span
              >
            </div>
            <div v-if="event.price" class="meta-item">
              <IconCreditCard
                class="meta-icon text-yellow-500 dark:text-yellow-400"
              />
              <span class="meta-text">{{ event.price }}€</span>
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="progress-section">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${participationPercentage}%` }"
              ></div>
            </div>
            <p class="progress-text">
              {{ Math.round(participationPercentage) }}% complet
            </p>
          </div>

          <!-- Description -->
          <p class="event-description">
            {{ event.description }}
          </p>

          <!-- Liste participants preview -->
          <div
            v-if="event.participantsList && event.participantsList.length > 0"
            class="participants-preview"
          >
            <h5 class="participants-title">Participants</h5>
            <div class="participants-avatars">
              <div
                v-for="participant in event.participantsList.slice(0, 5)"
                :key="participant.id"
                class="participant-avatar"
                :title="participant.name"
              >
                <img
                  :src="participant.avatar"
                  :alt="participant.name"
                  class="avatar-img"
                />
              </div>
              <div
                v-if="event.participantsList.length > 5"
                class="more-participants"
              >
                +{{ event.participantsList.length - 5 }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="event-actions">
            <button
              class="action-btn primary"
              :disabled="isEventFull || isRegistered"
              @click="$emit('registerEvent', event)"
            >
              {{ registrationLabel }}
            </button>

            <div class="action-row">
              <button
                class="action-btn secondary"
                @click="$emit('shareEvent', event)"
              >
                <IconShare class="action-icon" />
                <span class="action-text">Partager</span>
              </button>
              <button
                class="action-btn secondary"
                @click="$emit('addToCalendar', event)"
              >
                <IconCalendar class="action-icon" />
                <span class="action-text">Calendrier</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import type { Event } from "@/components/events/types/event";
import { formatEventDate } from "@/utils/dateUtils";
import {
  EVENT_CATEGORIES,
  CATEGORY_STYLING,
} from "@/components/events/constants/events";

// Icons
const IconX = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));
const IconShare = defineAsyncComponent(() => import("@icons/IconShare.vue"));
const IconHeart = defineAsyncComponent(() => import("@icons/HeartIcon.vue"));
const IconCalendar = defineAsyncComponent(
  () => import("@icons/CalendarIcon.vue")
);
const IconClock = defineAsyncComponent(() => import("@icons/IconClock.vue"));
const IconMapPin = defineAsyncComponent(() => import("@icons/IconMapPin.vue"));
const IconUsers = defineAsyncComponent(() => import("@icons/UserIcon.vue"));
const IconCreditCard = defineAsyncComponent(
  () => import("@icons/IconCreditCard.vue")
);

// Props
interface Props {
  event: Event;
  isFavorite?: boolean;
  isRegistered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  isRegistered: false,
});

// Emits
const emit = defineEmits<{
  close: [];
  registerEvent: [event: Event];
  addToFavorites: [event: Event];
  shareEvent: [event: Event];
  addToCalendar: [event: Event];
}>();

// Computed
const participationPercentage = computed(() => {
  return (props.event.participants / props.event.maxParticipants) * 100;
});

const isEventFull = computed(() => {
  return props.event.participants >= props.event.maxParticipants;
});

const registrationLabel = computed(() => {
  if (props.isRegistered) return "Inscrit";
  if (isEventFull.value) return "Complet";
  return "S'inscrire";
});

// Methods
const getCategoryLabel = (category: string): string => {
  return (
    EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || category
  );
};

const handleOverlayClick = () => {
  // Fermer la sidebar en cliquant sur l'overlay
  // Seulement sur desktop
  if (window.innerWidth >= 768) {
    emit("close");
  }
};
</script>

<style>
@import "tailwindcss";

/* Overlay */
.event-sidebar-overlay {
  @apply fixed inset-0 z-50;
  @apply bg-black/50 backdrop-blur-sm;
}

/* Sidebar Container */
.event-sidebar {
  @apply fixed right-0 w-full max-w-md shadow-2xl;
  @apply bg-white border-l;
  @apply flex flex-col overflow-hidden;
  top: 0;
  height: 100vh;
  height: 100dvh; /* Support pour les navigateurs modernes */
}

.dark .event-sidebar {
  @apply bg-gray-800 border-gray-700;
}

/* Header */
.sidebar-header {
  @apply flex items-center justify-between p-4 mt-30 border-b flex-shrink-0;
  @apply bg-white border-gray-200;
}

.dark .sidebar-header {
  @apply bg-gray-800 border-gray-700;
}

.sidebar-title {
  @apply text-lg font-bold text-gray-900;
}

.dark .sidebar-title {
  @apply text-white;
}

.close-btn {
  @apply p-2 rounded-lg transition-colors duration-200;
  @apply text-gray-500 hover:text-gray-700 hover:bg-gray-100;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.dark .close-btn {
  @apply text-gray-400 hover:text-gray-200 hover:bg-gray-700;
}

.close-icon {
  @apply w-5 h-5;
}

/* Content */
.sidebar-content {
  @apply flex-1 overflow-y-auto p-4 space-y-6;
}

/* Event Image */
.event-image {
  @apply relative w-full h-40 md:h-48 rounded-2xl overflow-hidden;
}

.event-img {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.image-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/60 to-transparent;
}

.dark .image-overlay {
  @apply from-black/70;
}

.image-actions {
  @apply absolute top-3 right-3 flex gap-2;
}

.overlay-btn {
  @apply p-2 rounded-full transition-all duration-200;
  @apply bg-white/20 backdrop-blur-sm text-white hover:bg-white/30;
}

.overlay-btn.favorite-active {
  @apply text-red-500 bg-red-100;
}

.dark .overlay-btn.favorite-active {
  @apply bg-red-900/50;
}

.overlay-icon {
  @apply w-4 h-4;
}

/* Event Info */
.event-info {
  @apply space-y-4;
}

.event-category {
  @apply inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide;
}

.event-title {
  @apply text-xl md:text-2xl font-bold text-gray-900;
}

.dark .event-title {
  @apply text-white;
}

/* Meta Items */
.event-meta {
  @apply space-y-3;
}

.meta-item {
  @apply flex items-center gap-3;
}

.meta-icon {
  @apply w-4 h-4 md:w-5 md:h-5 flex-shrink-0;
}

.meta-text {
  @apply text-sm md:text-base text-gray-700;
}

.dark .meta-text {
  @apply text-gray-200;
}

/* Progress */
.progress-section {
  @apply space-y-2;
}

.progress-bar {
  @apply w-full h-2 md:h-3 rounded-full overflow-hidden;
  @apply bg-gray-200;
}

.dark .progress-bar {
  @apply bg-gray-700;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 rounded-full;
}

.progress-text {
  @apply text-xs md:text-sm text-gray-600;
}

.dark .progress-text {
  @apply text-gray-300;
}

/* Description */
.event-description {
  @apply text-sm md:text-base leading-relaxed text-gray-700;
}

.dark .event-description {
  @apply text-gray-400;
}

/* Participants */
.participants-preview {
  @apply space-y-3;
}

.participants-title {
  @apply text-sm font-bold text-gray-800;
}

.dark .participants-title {
  @apply text-gray-300;
}

.participants-avatars {
  @apply flex items-center gap-2;
}

.participant-avatar {
  @apply w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 shadow-lg;
  @apply border-white transition-transform hover:scale-110;
}

.dark .participant-avatar {
  @apply border-gray-600;
}

.avatar-img {
  @apply w-full h-full object-cover;
}

.more-participants {
  @apply flex items-center justify-center w-8 h-8 md:w-10 md:h-10;
  @apply bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full;
  @apply text-xs font-bold shadow-lg transition-transform hover:scale-110;
}

/* Actions */
.event-actions {
  @apply space-y-3;
}

.action-btn {
  @apply px-4 py-3 rounded-xl font-medium transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.action-btn.primary {
  @apply w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white;
  @apply hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:scale-105;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100;
  @apply disabled:from-gray-400 disabled:to-gray-500;
}

.action-btn.secondary {
  @apply flex-1 flex items-center justify-center gap-2;
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md hover:scale-105;
}

.dark .action-btn.secondary {
  @apply bg-gray-700 text-gray-200 hover:bg-gray-600;
}

.action-row {
  @apply flex gap-3;
}

.action-icon {
  @apply w-4 h-4;
}

.action-text {
  @apply text-sm;
}

/* Responsive Adaptations */
@media (max-width: 768px) {
  .event-sidebar {
    @apply max-w-none w-full;
  }

  .sidebar-content {
    @apply p-3 space-y-4;
  }

  .event-image {
    @apply h-32;
  }

  .event-title {
    @apply text-lg;
  }

  .action-text {
    @apply hidden;
  }

  .action-btn.secondary {
    @apply justify-center;
  }
}

@media (max-width: 480px) {
  .action-row {
    @apply flex-col gap-2;
  }

  .action-btn.secondary {
    @apply w-full;
  }

  .action-text {
    @apply block;
  }
}

/* Assurer que l'overlay ne scroll pas le body */
body.sidebar-open {
  @apply overflow-hidden;
}
</style>
