<template>
  <div class="service-component">
    <div class="service-header">
      <h3 class="service-title">Services CE</h3>
      <p class="service-subtitle">Tous nos services à votre disposition</p>
    </div>

    <div class="service-content">
      <!-- Grid des services principaux -->
      <div class="services-grid">
        <div
          v-for="service in servicesData.slice(0, 4)"
          :key="service.id"
          class="service-item"
          @click="openService(service)"
        >
          <div class="service-icon">
            <component :is="service.icon" class="w-6 h-6" />
          </div>
          <div class="service-info">
            <h4 class="service-name">{{ service.name }}</h4>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="service-stats">
        <div class="stat-item">
          <span class="stat-number">{{ servicesData.length }}</span>
          <span class="stat-label">Services</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ featuredServicesCount }}</span>
          <span class="stat-label">Populaires</span>
        </div>
      </div>
    </div>

    <!-- Bouton d'action -->
    <button class="view-more-btn" @click="viewAllServices">
      Voir tous les services
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { servicesData } from "@/components/services/constants/mockDataServices";

const router = useRouter();

// Compter les services populaires
const featuredServicesCount = computed(() => {
  return servicesData.filter((service) => service.popular).length || 0;
});

const openService = (service: any) => {
  console.log("Ouvrir service:", service.name);
  router.push({ name: "service-detail", params: { name: service.name } });
};

const viewAllServices = () => {
  console.log("Voir tous les services");
  router.push({ name: "services" });
};
</script>

<style scoped>
.service-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-component:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Header */
.service-header {
  margin-bottom: 1.5rem;
  text-align: left;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.service-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Content principal */
.service-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
}

/* Grid des services - 2x2 */
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 80px;
}

.service-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.service-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  color: white;
  flex-shrink: 0;
}

.service-info {
  text-align: center;
}

.service-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  margin: 0;
  line-height: 1.3;
  text-align: center;
}

/* Statistiques */
.service-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  margin-top: auto;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
}

/* Bouton d'action */
.view-more-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.view-more-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* === RESPONSIVE === */

/* Mobile Layout */
@media (max-width: 768px) {
  .service-component {
    padding: 1rem;
  }

  .service-title {
    font-size: 1.25rem;
  }

  .service-subtitle {
    font-size: 0.8rem;
  }

  .services-grid {
    gap: 0.75rem;
  }

  .service-item {
    padding: 1rem 0.75rem;
    min-height: 70px;
  }

  .service-icon {
    width: 2rem;
    height: 2rem;
  }

  .service-name {
    font-size: 0.75rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .view-more-btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}

/* Très petit mobile */
@media (max-width: 480px) {
  .service-component {
    padding: 0.75rem;
  }

  .service-content {
    gap: 1rem;
  }

  .services-grid {
    gap: 0.5rem;
  }

  .service-item {
    padding: 0.75rem 0.5rem;
    min-height: 65px;
  }

  .service-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .service-name {
    font-size: 0.7rem;
    line-height: 1.2;
  }

  .service-stats {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
