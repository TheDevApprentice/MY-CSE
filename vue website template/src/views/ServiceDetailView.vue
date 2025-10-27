<template>
  <div
    class="service-detail z-30 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- En-tête avec image de fond -->
    <div
      class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-13 overflow-hidden"
    >
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="container mx-auto px-4 relative z-30">
        <button
          @click="$router.go(-1)"
          class="flex items-center text-white hover:text-blue-100 mb-6 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>

        <div class="z-30 flex flex-col md:flex-row md:items-center gap-6">
          <div
            class="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center text-white"
            :class="service.gradient"
          >
            <component :is="service.icon" class="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <div>
            <span
              class="inline-block px-3 py-1 text-sm font-semibold text-white bg-white/20 rounded-full mb-2"
            >
              {{ service.category }}
            </span>
            <h1 class="text-3xl md:text-4xl font-bold text-white">
              {{ service.name }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="relative container mx-auto px-4 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Colonne de gauche - Description et détails -->
        <div class="w-full lg:w-1/3 space-y-6">
          <!-- Section description -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Description
            </h2>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ service.fullDescription || service.description }}
            </p>
          </div>

          <!-- Section détails -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Détails du service
            </h2>

            <div class="space-y-4">
              <div
                v-for="(detail, index) in service.details"
                :key="index"
                class="flex items-start"
              >
                <div class="flex-shrink-0 h-6 w-6 text-blue-500 mr-3 mt-0.5">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p class="text-gray-700 dark:text-gray-200">
                  {{ detail }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne de droite - Contenu spécifique -->
        <div class="w-full lg:w-2/3">
          <!-- En-tête avec recherche et filtres -->
          <div
            v-if="service.content && hasFilterableContent"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
          >
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4"
            >
              <!-- Barre de recherche -->
              <div class="relative flex-1 max-w-md">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :placeholder="getSearchPlaceholder()"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon
                    class="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  />
                </button>
              </div>

              <!-- Bouton filtre -->
              <button
                @click="showFilters = !showFilters"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FunnelIcon
                  class="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-300"
                />
                Filtres
                <span
                  v-if="activeFilterCount > 0"
                  class="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-xs font-medium text-white"
                >
                  {{ activeFilterCount }}
                </span>
              </button>
            </div>

            <!-- Panneau des filtres -->
            <div
              v-if="showFilters && availableFilterTypes.length > 0"
              class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-4"
            >
              <div
                v-for="filterType in availableFilterTypes"
                :key="filterType.key"
                class="space-y-2"
              >
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ filterType.label }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in filterType.options"
                    :key="option"
                    @click="toggleFilter(filterType.key, option)"
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      isFilterActive(filterType.key, option)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
                    ]"
                  >
                    {{ option }}
                  </button>
                </div>
              </div>

              <!-- Bouton pour vider les filtres -->
              <div
                v-if="activeFilterCount > 0"
                class="pt-2 border-t border-gray-200 dark:border-gray-700"
              >
                <button
                  @click="clearAllFilters"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Effacer tous les filtres
                </button>
              </div>
            </div>
          </div>

          <!-- Contenu pour la billetterie -->
          <div
            v-if="service.id === 1 && service.content?.events"
            class="space-y-6"
          >
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Événements à venir
                </h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ filteredEvents.length }} événement(s) trouvé(s)
                </span>
              </div>

              <div v-if="filteredEvents.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">
                  Aucun événement ne correspond à vos critères de recherche.
                </p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="event in filteredEvents"
                  :key="event.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div class="h-40 bg-gray-200 dark:bg-gray-700 relative">
                    <div
                      class="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded"
                    >
                      {{ event.category }}
                    </div>
                    <div class="absolute top-2 left-2">
                      <span
                        v-for="tag in event.tags.slice(0, 2)"
                        :key="tag"
                        class="inline-block bg-black/50 text-white text-xs px-2 py-1 rounded-full mr-1 mb-1"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  <div class="p-4">
                    <h3
                      class="font-bold text-lg text-gray-900 dark:text-white mb-1"
                    >
                      {{ event.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      <svg
                        class="w-4 h-4 inline-block mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ event.location }}
                    </p>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      <svg
                        class="w-4 h-4 inline-block mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {{ event.date }}
                    </p>
                    <div class="flex justify-between items-center">
                      <div>
                        <span class="text-sm text-gray-500 line-through mr-2"
                          >{{ event.price }}€</span
                        >
                        <span
                          class="text-lg font-bold text-blue-600 dark:text-blue-400"
                          >{{ event.discountPrice }}€</span
                        >
                      </div>
                      <button
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu pour les chèques cadeaux -->
          <div
            v-else-if="service.id === 2 && service.content?.offers"
            class="space-y-6"
          >
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Nos offres exclusives
                </h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ filteredOffers.length }} offre(s) trouvée(s)
                </span>
              </div>

              <div v-if="filteredOffers.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">
                  Aucune offre ne correspond à vos critères de recherche.
                </p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="offer in filteredOffers"
                  :key="offer.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <h3
                          class="font-bold text-lg text-gray-900 dark:text-white"
                        >
                          {{ offer.brand }}
                        </h3>
                        <span
                          class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {{ offer.sector }}
                        </span>
                      </div>
                      <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        <span
                          class="font-medium text-green-600 dark:text-green-400"
                          >{{ offer.discount }}</span
                        >
                        dès {{ offer.minAmount }}€ d'achat
                      </p>
                      <div class="flex flex-wrap gap-1 mt-2">
                        <span
                          v-for="(category, idx) in offer.categories"
                          :key="idx"
                          class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full"
                        >
                          {{ category }}
                        </span>
                      </div>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="(tag, idx) in offer.tags"
                          :key="`tag-${idx}`"
                          class="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-1 rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                    <button
                      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
                    >
                      En profiter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu par défaut pour les autres services -->
          <div
            v-else
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center"
          >
            <div class="max-w-md mx-auto">
              <div
                class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                :class="service.gradient"
              >
                <component :is="service.icon" class="w-10 h-10 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Découvrez nos offres {{ service.name.toLowerCase() }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Bientôt disponible ! Nous préparons des offres exceptionnelles
                pour vous.
              </p>
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Être informé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section
      class="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-100 py-16 mt-16 relative overflow-hidden"
    >
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Vous avez des questions ?
          </h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Notre équipe est là pour vous aider.
          </p>
          <button
            @click="contactSupport"
            class="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
          >
            Contacter le support
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  servicesData,
  serviceFilterConfig,
} from "@/components/services/constants/mockDataServices";

const XMarkIcon = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));
const MagnifyingGlassIcon = defineAsyncComponent(
  () => import("@icons/IconSearch.vue")
);
const FunnelIcon = defineAsyncComponent(() => import("@icons/IconFilter.vue"));

const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const showFilters = ref(false);
const activeFilters = ref<Record<string, string[]>>({});

// Récupérer l'ID du service depuis les paramètres de route
const serviceIdName = decodeURIComponent(route.params.name as string);

// Trouver le service correspondant
const service = ref(
  servicesData.find((s) => s.name === serviceIdName) || servicesData[0]
);

// Computed pour vérifier si le service a du contenu filtrable
const hasFilterableContent = computed(() => {
  return (
    service.value.content &&
    ((service.value.content.events &&
      service.value.content.events.length > 0) ||
      (service.value.content.offers && service.value.content.offers.length > 0))
  );
});

// Computed pour obtenir les types de filtres disponibles pour ce service
const availableFilterTypes = computed(() => {
  const config = serviceFilterConfig[service.value.id];
  return config ? config.filterTypes : [];
});

// Computed pour compter les filtres actifs
const activeFilterCount = computed(() => {
  return Object.values(activeFilters.value).reduce(
    (acc, filters) => acc + filters.length,
    0
  );
});

// Computed pour les événements filtrés
const filteredEvents = computed(() => {
  if (!service.value.content?.events) return [];

  let events = service.value.content.events;

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    events = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.eventType.toLowerCase().includes(query) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filtrage par filtres actifs
  Object.entries(activeFilters.value).forEach(([filterKey, filterValues]) => {
    if (filterValues.length > 0) {
      events = events.filter((event) => {
        if (filterKey === "tags") {
          return filterValues.some((value) => event.tags.includes(value));
        } else {
          return filterValues.includes(
            event[filterKey as keyof typeof event] as string
          );
        }
      });
    }
  });

  return events;
});

// Computed pour les offres filtrées
const filteredOffers = computed(() => {
  if (!service.value.content?.offers) return [];

  let offers = service.value.content.offers;

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    offers = offers.filter(
      (offer) =>
        offer.brand.toLowerCase().includes(query) ||
        offer.sector.toLowerCase().includes(query) ||
        offer.categories.some((cat) => cat.toLowerCase().includes(query)) ||
        offer.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filtrage par filtres actifs
  Object.entries(activeFilters.value).forEach(([filterKey, filterValues]) => {
    if (filterValues.length > 0) {
      offers = offers.filter((offer) => {
        if (filterKey === "categories" || filterKey === "tags") {
          return filterValues.some((value) => offer[filterKey].includes(value));
        } else {
          return filterValues.includes(
            offer[filterKey as keyof typeof offer] as string
          );
        }
      });
    }
  });

  return offers;
});

// Fonctions
const getSearchPlaceholder = () => {
  if (service.value.id === 1) {
    return "Rechercher un événement...";
  } else if (service.value.id === 2) {
    return "Rechercher une offre...";
  }
  return "Rechercher...";
};

const toggleFilter = (filterType: string, value: string) => {
  if (!activeFilters.value[filterType]) {
    activeFilters.value[filterType] = [];
  }

  const index = activeFilters.value[filterType].indexOf(value);
  if (index > -1) {
    activeFilters.value[filterType].splice(index, 1);
  } else {
    activeFilters.value[filterType].push(value);
  }
};

const isFilterActive = (filterType: string, value: string) => {
  return activeFilters.value[filterType]?.includes(value) || false;
};

const clearAllFilters = () => {
  activeFilters.value = {};
  searchQuery.value = "";
};

const contactSupport = () => {
  console.log("Contacter le support pour le service:", service.value.name);
};

// Mettre à jour le titre de la page
onMounted(() => {
  if (!service.value) {
    router.push({ name: "services" });
  }
  document.title = `${service.value.name} | Services CE`;
});
</script>

<style scoped>
@import "tailwindcss";
.service-detail {
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .service-detail {
    padding-top: calc(4.6rem + 3.5rem);
  }
}

.router-link-active {
  @apply text-blue-600 font-medium;
}
</style>
