<!-- components/ListView.vue -->
<template>
  <div class="list-section">
    <div class="events-container">
      <!-- État de chargement -->
      <div
        v-if="loading"
        class="loading-state flex flex-col items-center justify-center py-20"
      >
        <div
          class="spinner w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-600 font-medium">Chargement des événements...</p>
      </div>

      <!-- État vide -->
      <div
        v-else-if="events.length === 0"
        class="empty-state flex flex-col items-center justify-center py-20"
      >
        <IconCalendar class="w-20 h-20 text-gray-300 mb-6" />
        <h3 class="text-2xl font-bold text-gray-700 mb-2">
          Aucun événement trouvé
        </h3>
        <p class="text-gray-600">
          {{
            searchQuery
              ? "Essayez avec d'autres mots-clés"
              : "Aucun événement ne correspond à vos filtres"
          }}
        </p>
        <button
          v-if="searchQuery"
          @click="$emit('clearSearch')"
          class="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200"
        >
          Effacer la recherche
        </button>
      </div>

      <!-- Liste des événements -->
      <div v-else class="events-list space-y-4">
        <TransitionGroup name="list" tag="div" class="space-y-4">
          <div
            v-for="event in events"
            :key="event.id"
            class="event-card group bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-row h-32"
            :class="{
              'border-red-300 bg-red-50/90': isFavorite(event),
              'border-green-300 bg-green-50/90': isRegistered(event),
            }"
            @click="$emit('selectEvent', event)"
          >
            <!-- Image -->
            <div class="card-image relative overflow-hidden w-48 flex-shrink-0">
              <img
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div
                class="image-overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
              ></div>

              <!-- Badge catégorie -->
              <div
                class="card-category absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                :class="CATEGORY_STYLING[event.category]"
              >
                {{ getCategoryLabel(event.category) }}
              </div>

              <!-- Bouton favori -->
              <button
                @click.stop="$emit('addToFavorites', event)"
                class="favorite-btn absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-white hover:scale-110"
                :class="{
                  'text-red-500 bg-red-100': isFavorite(event),
                  'text-gray-600': !isFavorite(event),
                }"
                :title="
                  isFavorite(event)
                    ? 'Retirer des favoris'
                    : 'Ajouter aux favoris'
                "
              >
                <IconHeart class="w-4 h-4" />
              </button>
            </div>

            <!-- Contenu -->
            <div class="card-content p-6 flex gap-4 flex-1">
              <!-- Date -->
              <div
                class="card-date flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-3 min-w-[60px]"
              >
                <span class="date-day text-xl font-bold leading-none">
                  {{ formatDay(event.date) }}
                </span>
                <span
                  class="date-month text-xs uppercase tracking-wide opacity-90"
                >
                  {{ formatMonth(event.date) }}
                </span>
              </div>

              <!-- Info -->
              <div class="card-info flex-1">
                <h3
                  class="card-title text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200"
                >
                  {{ event.title }}
                </h3>

                <div class="card-meta space-y-1 mb-2">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <IconClock class="w-4 h-4" />
                    {{ event.time }}
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <IconMapPin class="w-4 h-4" />
                    {{ event.location }}
                  </div>
                  <div
                    v-if="event.price"
                    class="flex items-center gap-2 text-sm font-semibold text-blue-600"
                  >
                    <IconCreditCard class="w-4 h-4" />
                    {{ event.price }}€
                  </div>
                </div>

                <!-- Participants -->
                <div
                  class="card-participants flex items-center gap-2 text-sm text-gray-600"
                >
                  <IconUsers class="w-4 h-4" />
                  <span
                    >{{ event.participants }}/{{ event.maxParticipants }}</span
                  >
                  <div
                    class="participants-progress flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2"
                  >
                    <div
                      class="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      :style="{
                        width: `${getParticipationPercentage(event)}%`,
                      }"
                    ></div>
                  </div>
                  <span class="text-xs font-medium">
                    {{ Math.round(getParticipationPercentage(event)) }}%
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="card-actions border-l flex-col justify-center w-36 p-4 flex gap-3"
            >
              <button
                class="card-btn primary flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                :disabled="
                  event.participants >= event.maxParticipants ||
                  isRegistered(event)
                "
                @click.stop="$emit('registerEvent', event)"
              >
                {{ getRegistrationLabel(event) }}
              </button>

              <button
                class="card-btn secondary p-3 bg-gray-100 text-gray-600 rounded-xl transition-all duration-200 hover:bg-gray-200 hover:shadow-md flex items-center justify-center"
                @click.stop="$emit('shareEvent', event)"
                title="Partager l'événement"
              >
                <IconShare class="w-4 h-4" />
              </button>
            </div>

            <!-- Indicateurs d'état -->
            <div class="status-indicators absolute top-2 left-2 flex gap-1">
              <div
                v-if="isRegistered(event)"
                class="status-badge bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold"
              >
                Inscrit
              </div>
              <div
                v-if="event.participants >= event.maxParticipants"
                class="status-badge bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
              >
                Complet
              </div>
              <div
                v-if="isPastEvent(event)"
                class="status-badge bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold"
              >
                Passé
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Bouton de chargement supplémentaire (pagination future) -->
      <div
        v-if="events.length > 0 && !loading"
        class="load-more-section text-center mt-8"
      >
        <p class="text-gray-600 text-sm">
          {{ events.length }} événement{{
            events.length > 1 ? "s" : ""
          }}
          affiché{{ events.length > 1 ? "s" : "" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import type { Event } from "@/components/events/types/event";
import { formatDay, formatMonth } from "@/utils/dateUtils";
import {
  EVENT_CATEGORIES,
  CATEGORY_STYLING,
} from "@/components/events/constants/events";

// Components
const IconCalendar = defineAsyncComponent(
  () => import("@icons/CalendarIcon.vue")
);
const IconClock = defineAsyncComponent(() => import("@icons/IconClock.vue"));
const IconMapPin = defineAsyncComponent(() => import("@icons/IconMapPin.vue"));
const IconUsers = defineAsyncComponent(() => import("@icons/UserIcon.vue"));
const IconCreditCard = defineAsyncComponent(
  () => import("@icons/IconCreditCard.vue")
);
const IconHeart = defineAsyncComponent(() => import("@icons/HeartIcon.vue"));
const IconShare = defineAsyncComponent(() => import("@icons/IconShare.vue"));

// Props
interface Props {
  events: Event[];
  loading?: boolean;
  searchQuery?: string;
  favorites?: number[];
  registeredEvents?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchQuery: "",
  favorites: () => [],
  registeredEvents: () => [],
});

// Emits
defineEmits<{
  selectEvent: [event: Event];
  registerEvent: [event: Event];
  addToFavorites: [event: Event];
  shareEvent: [event: Event];
  clearSearch: [];
}>();

// Methods
const getCategoryLabel = (category: string): string => {
  return (
    EVENT_CATEGORIES[category as keyof typeof EVENT_CATEGORIES] || category
  );
};

const getParticipationPercentage = (event: Event): number => {
  return (event.participants / event.maxParticipants) * 100;
};

const isFavorite = (event: Event): boolean => {
  return props.favorites.includes(event.id);
};

const isRegistered = (event: Event): boolean => {
  return props.registeredEvents.includes(event.id);
};

const isPastEvent = (event: Event): boolean => {
  return event.date < new Date();
};

const getRegistrationLabel = (event: Event): string => {
  if (isRegistered(event)) return "Inscrit";
  if (event.participants >= event.maxParticipants) return "Complet";
  if (isPastEvent(event)) return "Terminé";
  return "S'inscrire";
};
</script>

<style scoped>
/* Animations de transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.5s ease;
}

/* Animation du spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Styles responsives */
@media (max-width: 768px) {
  .event-card {
    flex-direction: column !important;
    height: auto !important;
  }

  .card-image {
    width: 100% !important;
    height: 200px !important;
  }

  .card-content {
    flex-direction: column;
    gap: 1rem;
  }

  .card-date {
    align-self: flex-start;
    min-width: 80px;
  }

  .card-actions {
    border-left: none !important;
    border-top: 1px solid #e5e7eb;
    width: 100% !important;
    flex-direction: row !important;
    padding: 1rem 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .events-list {
    padding: 0 1rem;
  }

  .card-content {
    padding: 1rem !important;
  }

  .card-actions {
    gap: 0.5rem !important;
  }

  .card-btn {
    font-size: 0.875rem;
    padding: 0.75rem 1rem !important;
  }
}

/* États de hover améliorés */
.event-card:hover .card-image img {
  transform: scale(1.05);
}

.event-card:hover .card-date {
  transform: scale(1.05);
}

/* Accessibilité */
.event-card:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.card-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Amélioration des badges de statut */
.status-indicators {
  z-index: 10;
}

.status-badge {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}
</style>
