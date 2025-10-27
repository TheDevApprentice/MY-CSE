<!-- components/events/EventSidebar.vue - Utilisant CalendarSidebar générique -->
<template>
  <CalendarSidebar
    title="Détails de l'événement"
    :data="event"
    content-padding="p-6"
    width="420px"
    @close="$emit('close')"
  >
    <!-- Header personnalisé -->
    <template #header="{ title }">
      <h3 class="text-xl font-bold text-slate-800 dark:text-slate-200">
        {{ title }}
      </h3>
    </template>

    <!-- Contenu de l'événement directement dans le slot -->
    <template #content>
      <div class="event-sidebar-content">
        <!-- Image de l'événement -->
        <div
          class="event-image relative w-full h-48 rounded-2xl overflow-hidden mb-6 group"
        >
          <img
            :src="event.image"
            :alt="event.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            class="image-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent dark:from-black/70"
          ></div>
          <div class="image-actions absolute top-4 right-4 flex gap-2">
            <button @click="$emit('shareEvent', event)" class="overlay-btn">
              <IconShare class="w-4 h-4" />
            </button>
            <button
              @click="$emit('addToFavorites', event)"
              class="overlay-btn"
              :class="{
                'text-red-500 bg-red-100 dark:bg-red-900/50': isFavorite,
              }"
            >
              <IconHeart class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Informations de l'événement -->
        <div class="event-info">
          <span
            class="event-category inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
            :class="CATEGORY_STYLING[event.category]"
          >
            {{ getCategoryLabel(event.category) }}
          </span>

          <h4
            class="event-title text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4"
          >
            {{ event.title }}
          </h4>

          <!-- Métadonnées -->
          <div class="event-meta space-y-3 mb-6">
            <div
              class="meta-item flex items-center gap-3 text-slate-700 dark:text-slate-200"
            >
              <IconCalendar class="w-5 h-5 text-blue-500 dark:text-blue-400" />
              {{ formatEventDate(event.date) }}
            </div>
            <div
              class="meta-item flex items-center gap-3 text-slate-700 dark:text-slate-200"
            >
              <IconClock class="w-5 h-5 text-green-500 dark:text-green-400" />
              {{ event.time }}
            </div>
            <div
              class="meta-item flex items-center gap-3 text-slate-700 dark:text-slate-200"
            >
              <IconMapPin class="w-5 h-5 text-red-500 dark:text-red-400" />
              {{ event.location }}
            </div>
            <div
              class="meta-item flex items-center gap-3 text-slate-700 dark:text-slate-200"
            >
              <IconUsers class="w-5 h-5 text-purple-500 dark:text-purple-400" />
              {{ event.participants }}/{{ event.maxParticipants }} participants
            </div>
            <div
              v-if="event.price"
              class="meta-item flex items-center gap-3 text-slate-700 dark:text-slate-200"
            >
              <IconCreditCard
                class="w-5 h-5 text-yellow-500 dark:text-yellow-400"
              />
              {{ event.price }}€
            </div>
          </div>

          <!-- Barre de progression -->
          <div class="progress-section mb-6">
            <div
              class="progress-bar w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden"
            >
              <div
                class="progress-fill h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 rounded-full"
                :style="{ width: `${participationPercentage}%` }"
              ></div>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {{ Math.round(participationPercentage) }}% complet
            </p>
          </div>

          <!-- Description -->
          <p
            class="event-description text-slate-700 dark:text-slate-400 leading-relaxed mb-6"
          >
            {{ event.description }}
          </p>

          <!-- Liste participants preview -->
          <div
            v-if="event.participantsList && event.participantsList.length > 0"
            class="participants-preview mb-6"
          >
            <h5
              class="text-sm font-bold text-slate-800 dark:text-slate-300 mb-3"
            >
              Participants
            </h5>
            <div class="participants-avatars flex items-center gap-2">
              <div
                v-for="participant in event.participantsList.slice(0, 5)"
                :key="participant.id"
                class="participant-avatar w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-lg transition-transform hover:scale-110"
                :title="participant.name"
              >
                <img
                  :src="participant.avatar"
                  :alt="participant.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div
                v-if="event.participantsList.length > 5"
                class="more-participants flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-lg transition-transform hover:scale-110"
              >
                +{{ event.participantsList.length - 5 }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="event-actions space-y-3">
            <button
              class="action-btn primary w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-gray-400 disabled:to-gray-500"
              :disabled="isEventFull || isRegistered"
              @click="$emit('registerEvent', event)"
            >
              {{ registrationLabel }}
            </button>

            <div class="action-row flex gap-3">
              <button
                class="action-btn secondary flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center justify-center gap-2"
                @click="$emit('shareEvent', event)"
              >
                <IconShare class="w-4 h-4" />
                Partager
              </button>
              <button
                class="action-btn secondary flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center justify-center gap-2"
                @click="$emit('addToCalendar', event)"
              >
                <IconCalendar class="w-4 h-4" />
                Calendrier
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CalendarSidebar>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import type { Event } from "@/components/events/types/event";
import { formatEventDate } from "@/utils/dateUtils";
import {
  EVENT_CATEGORIES,
  CATEGORY_STYLING,
} from "@/components/events/constants/events";

// Components
const CalendarSidebar = defineAsyncComponent(
  () => import("@/components/common/ui/calendar/CalendarSidebar.vue")
);
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
defineEmits<{
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
</script>
