<template>
  <div class="events-component">
    <div class="home-events-header">
      <h3 class="events-title">Événements</h3>
      <p class="events-subtitle">Prochains événements CE</p>
    </div>

    <div class="events-content">
      <div
        v-if="nextEvents"
        v-for="nextEvent in nextEvents.slice(0, 2)"
        :key="nextEvent.id"
        class="next-event"
        @click="viewEvent(nextEvent.id)"
      >
        <div class="event-date">
          <span class="date-day">{{ formatDay(nextEvent.date) }}</span>
          <span class="date-month">{{ formatMonth(nextEvent.date) }}</span>
        </div>
        <div class="event-info">
          <h4 class="event-title">{{ nextEvent.title }}</h4>
          <p class="event-location">{{ nextEvent.location }}</p>
          <div class="event-participants">
            <span class="participants-count">{{ nextEvent.participants }}</span>
            <span class="participants-label">participants</span>
          </div>
        </div>
      </div>

      <div class="events-summary">
        <div class="summary-item">
          <span class="summary-number">{{ upcomingCount }}</span>
          <span class="summary-label">À venir</span>
        </div>
        <div class="summary-item">
          <span class="summary-number">{{ monthCount }}</span>
          <span class="summary-label">Ce mois</span>
        </div>
      </div>
    </div>

    <button class="view-events-btn" @click="viewAllEvents">
      Voir le calendrier d'événements
      <svg
        class="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { EventService } from "@/services/cse/events/eventService";

const nextEvents = ref();
async function loadNextEvents() {
  await EventService.getEvents().then((events) => {
    nextEvents.value = events;
  });
}

const upcomingCount = ref(8);
const monthCount = ref(3);

const formatDay = (date: Date) => {
  return date.getDate().toString().padStart(2, "0");
};

const formatMonth = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date);
};

const router = useRouter();

const viewAllEvents = () => {
  console.log("Vers la page des événements");
  router.push("/events");
};

const viewEvent = (eventId: number) => {
  console.log("Vers la page de l'événement");
  localStorage.setItem("preferred-view", "calendar");
  localStorage.setItem("selectedEventId", eventId.toString());
  router.push("/events");
};

onMounted(async () => {
  await loadNextEvents();
});
</script>

<style scoped>
.events-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.events-component:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.home-events-header {
  margin-bottom: 1.5rem;
}

.events-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.events-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.events-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.next-event {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 60px;
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.event-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.event-location {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.event-participants {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.participants-count {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.participants-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.events-summary {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.summary-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-events-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.view-events-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .events-component {
    padding: 1rem;
  }

  .events-title {
    font-size: 1.25rem;
  }

  .next-event {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .event-date {
    min-width: 50px;
    padding: 0.5rem;
  }

  .date-day {
    font-size: 1.25rem;
  }

  .event-title {
    font-size: 0.9rem;
  }

  .summary-number {
    font-size: 1.25rem;
  }
}
</style>
