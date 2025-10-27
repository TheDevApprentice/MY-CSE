<!-- components/GridView.vue -->
<template>
  <div class="grid-section">
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
        <p class="text-gray-600 text-center max-w-md">
          {{
            searchQuery
              ? "Essayez avec d'autres mots-clés ou modifiez vos filtres"
              : "Aucun événement ne correspond à vos critères de recherche"
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

      <!-- Grid des événements -->
      <div
        v-else
        class="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <TransitionGroup name="grid" tag="div" class="contents">
          <div
            v-for="event in events"
            :key="event.id"
            class="event-card group bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg border border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col"
            :class="{
              'border-red-300 bg-red-50/90': isFavorite(event),
              'border-green-300 bg-green-50/90': isRegistered(event),
              'opacity-75': isPastEvent(event),
            }"
            @click="$emit('selectEvent', event)"
          >
            <!-- Image -->
            <div class="card-image relative overflow-hidden h-48">
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
                class="card-category absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
                :class="CATEGORY_STYLING[event.category]"
              >
                {{ getCategoryLabel(event.category) }}
              </div>

              <!-- Bouton favori -->
              <button
                @click.stop="$emit('addToFavorites', event)"
                class="favorite-btn absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-200 hover:bg-white hover:scale-110 shadow-lg"
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

              <!-- Indicateurs d'état -->
              <div
                class="status-indicators absolute bottom-4 left-4 flex gap-1"
              >
                <div
                  v-if="isRegistered(event)"
                  class="status-badge bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  Inscrit
                </div>
                <div
                  v-if="event.participants >= event.maxParticipants"
                  class="status-badge bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  Complet
                </div>
                <div
                  v-if="isPastEvent(event)"
                  class="status-badge bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  Passé
                </div>
              </div>
            </div>

            <!-- Contenu -->
            <div class="card-content p-6 flex gap-4 flex-1">
              <!-- Date -->
              <div
                class="card-date flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-4 min-w-[70px] shadow-lg"
              >
                <span class="date-day text-2xl font-bold leading-none">
                  {{ formatDay(event.date) }}
                </span>
                <span
                  class="date-month text-xs uppercase tracking-wide opacity-90"
                >
                  {{ formatMonth(event.date) }}
                </span>
              </div>

              <!-- Info -->
              <div class="card-info flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    class="card-title text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                  >
                    {{ event.title }}
                  </h3>

                  <div class="card-meta space-y-1 mb-3">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                      <IconClock class="w-4 h-4 flex-shrink-0" />
                      <span class="truncate">{{ event.time }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                      <IconMapPin class="w-4 h-4 flex-shrink-0" />
                      <span class="truncate">{{ event.location }}</span>
                    </div>
                    <div
                      v-if="event.price"
                      class="flex items-center gap-2 text-sm font-semibold text-blue-600"
                    >
                      <IconCreditCard class="w-4 h-4 flex-shrink-0" />
                      <span>{{ event.price }}€</span>
                    </div>
                  </div>
                </div>

                <!-- Participants -->
                <div class="card-participants">
                  <div
                    class="flex items-center gap-2 text-sm text-gray-600 mb-2"
                  >
                    <IconUsers class="w-4 h-4" />
                    <span
                      >{{ event.participants }}/{{
                        event.maxParticipants
                      }}</span
                    >
                    <span class="text-xs font-medium ml-auto">
                      {{ Math.round(getParticipationPercentage(event)) }}%
                    </span>
                  </div>
                  <div
                    class="participants-progress w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                  >
                    <div
                      class="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                      :style="{
                        width: `${getParticipationPercentage(event)}%`,
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="card-actions p-6 border-t border-gray-200 flex gap-3">
              <button
                class="card-btn primary flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                :disabled="
                  event.participants >= event.maxParticipants ||
                  isRegistered(event) ||
                  isPastEvent(event)
                "
                @click.stop="$emit('registerEvent', event)"
              >
                {{ getRegistrationLabel(event) }}
              </button>

              <button
                class="card-btn secondary p-3 bg-gray-100 text-gray-600 rounded-xl transition-all duration-200 hover:bg-gray-200 hover:shadow-md flex items-center justify-center flex-shrink-0"
                @click.stop="$emit('shareEvent', event)"
                title="Partager l'événement"
              >
                <IconShare class="w-4 h-4" />
              </button>
            </div>

            <!-- Description preview au hover -->
            <div
              class="description-preview absolute inset-0 bg-white/95 backdrop-blur-sm p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            >
              <div class="h-full flex flex-col justify-center">
                <h4 class="font-bold text-gray-800 mb-2">{{ event.title }}</h4>
                <p class="text-sm text-gray-600 line-clamp-6">
                  {{ event.description }}
                </p>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Statistiques de la grille -->
      <div
        v-if="events.length > 0 && !loading"
        class="grid-stats mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20"
      >
        <div
          class="stats-content flex justify-between items-center flex-wrap gap-4"
        >
          <div class="stats-left">
            <p class="text-gray-600">
              <span class="font-semibold text-gray-800">{{
                events.length
              }}</span>
              événement{{ events.length > 1 ? "s" : "" }} affiché{{
                events.length > 1 ? "s" : ""
              }}
            </p>
          </div>
          <div class="stats-right flex gap-6">
            <div class="stat-item text-center">
              <div class="stat-value text-lg font-bold text-blue-600">
                {{ availableEvents }}
              </div>
              <div class="stat-label text-xs text-gray-600">Disponibles</div>
            </div>
            <div class="stat-item text-center">
              <div class="stat-value text-lg font-bold text-green-600">
                {{ registeredCount }}
              </div>
              <div class="stat-label text-xs text-gray-600">Inscrits</div>
            </div>
            <div class="stat-item text-center">
              <div class="stat-value text-lg font-bold text-red-600">
                {{ favoriteCount }}
              </div>
              <div class="stat-label text-xs text-gray-600">Favoris</div>
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

// Computed
const availableEvents = computed(() => {
  return props.events.filter(
    (event) => event.participants < event.maxParticipants && !isPastEvent(event)
  ).length;
});

const registeredCount = computed(() => {
  return props.events.filter((event) => isRegistered(event)).length;
});

const favoriteCount = computed(() => {
  return props.events.filter((event) => isFavorite(event)).length;
});

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
  if (isPastEvent(event)) return "Terminé";
  if (isRegistered(event)) return "Inscrit";
  if (event.participants >= event.maxParticipants) return "Complet";
  return "S'inscrire";
};
</script>

<style scoped>
/* Animations de transition pour la grille */
.grid-enter-active,
.grid-leave-active {
  transition: all 0.6s ease;
}

.grid-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.grid-move {
  transition: transform 0.6s ease;
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

/* Utilitaires pour la limitation de lignes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-6 {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr !important;
    gap: 1rem;
  }

  .card-content {
    padding: 1rem !important;
    gap: 1rem;
  }

  .card-actions {
    padding: 1rem 1.5rem !important;
  }

  .stats-content {
    flex-direction: column;
    text-align: center;
  }

  .stats-right {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .card-date {
    min-width: 60px !important;
    padding: 0.75rem !important;
  }

  .date-day {
    font-size: 1.25rem !important;
  }

  .card-title {
    font-size: 1.125rem !important;
  }

  .card-meta {
    margin-bottom: 0.75rem !important;
  }
}

/* Amélioration des effets hover */
.event-card:hover .card-date {
  transform: scale(1.05);
}

.event-card:hover .description-preview {
  backdrop-filter: blur(8px);
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

/* Styles pour les badges de statut */
.status-badge {
  backdrop-filter: blur(4px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* Animation spéciale pour la preview de description */
.description-preview {
  border-radius: 1.5rem;
}

.group:hover .description-preview {
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Amélioration de la grille sur grands écrans */
@media (min-width: 1280px) {
  .events-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1536px) {
  .events-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
