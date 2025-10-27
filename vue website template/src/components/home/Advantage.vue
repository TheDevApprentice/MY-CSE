<template>
  <div class="advantage-component">
    <div class="advantage-header">
      <h3 class="advantage-title">Avantages</h3>
      <p class="advantage-subtitle">Offres spéciales exclusives</p>
    </div>

    <div class="advantage-content">
      <div class="featured-offer" v-if="featuredOffer">
        <div class="offer-badge">
          <span class="badge-text">{{ featuredOffer.discount }}</span>
          <span class="badge-label">de réduction</span>
        </div>
        <div class="offer-info">
          <h4 class="offer-title">{{ featuredOffer.title }}</h4>
          <p class="offer-description">{{ featuredOffer.description }}</p>
          <div class="offer-validity">
            <span class="validity-text"
              >Valable jusqu'au {{ formatDate(featuredOffer.validUntil) }}</span
            >
          </div>
        </div>
      </div>

      <div class="offers-grid">
        <div
          v-for="offer in quickOffers"
          :key="offer.id"
          class="quick-offer"
          @click="viewOffer(offer)"
        >
          <div class="quick-offer-icon">
            <component :is="offer.icon" class="w-5 h-5" />
          </div>
          <div class="quick-offer-info">
            <span class="quick-offer-title">{{ offer.title }}</span>
            <span class="quick-offer-discount">-{{ offer.discount }}%</span>
          </div>
        </div>
      </div>
    </div>

    <button class="view-advantages-btn" @click="viewAdvantage(featuredOffer)">
      Découvrir l'avantage
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
import { ref, defineAsyncComponent, markRaw } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Import icons with markRaw to prevent unnecessary reactivity
const iconImports = {
  CarIcon: markRaw(defineAsyncComponent(() => import("@icons/CarIcon.vue"))),
  HomeIcon: markRaw(defineAsyncComponent(() => import("@icons/HomeIcon.vue"))),
};

const featuredOffer = ref({
  id: 6,
  title: "Vacances d'été",
  name: "Vacances & Loisirs",
  description: "Séjours et voyages organisés",
  discount: "25%",
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Dans 30 jours
});

const quickOffers = ref([
  {
    id: 3,
    title: "Transport",
    discount: "20",
    icon: iconImports.CarIcon,
  },
  {
    id: 4,
    title: "Logement",
    discount: "10",
    icon: iconImports.HomeIcon,
  },
]);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  }).format(date);
};

const viewOffer = (offer: any) => {
  console.log("Voir l'offre:", offer.title);
  // TODO: Navigation vers l'offre spécifique
};

const viewAdvantage = (service: any) => {
  console.log("Voir l'avantage");
  router.push({ name: "service-detail", params: { name: service.name } });
};
</script>

<style scoped>
.advantage-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.advantage-component:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.advantage-header {
  margin-bottom: 1.5rem;
}

.advantage-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.advantage-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.advantage-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.featured-offer {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.offer-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.badge-text {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.badge-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.offer-info {
  text-align: center;
}

.offer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.offer-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.75rem;
}

.validity-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.offers-grid {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
}

.quick-offer {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-offer:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.quick-offer-icon {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-offer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.quick-offer-title {
  font-size: 0.75rem;
  color: white;
  font-weight: 500;
}

.quick-offer-discount {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

.view-advantages-btn {
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

.view-advantages-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .advantage-component {
    padding: 1rem;
  }

  .advantage-title {
    font-size: 1.25rem;
  }

  .featured-offer {
    padding: 1rem;
  }

  .badge-text {
    font-size: 1.5rem;
  }

  .offers-grid {
    gap: 0.5rem;
  }

  .quick-offer {
    padding: 0.5rem;
  }

  .quick-offer-title {
    font-size: 0.7rem;
  }
}
</style>
