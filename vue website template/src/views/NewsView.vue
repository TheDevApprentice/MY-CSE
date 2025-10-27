<!-- NewsView.vue -->
<template>
  <div class="news-view min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Section Héro avec carrousel -->
    <section class="relative">
      <div
        class="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent"
      ></div>
      <div class="container max-w-full px-4 mx-auto pt-5 relative z-10">
        <!-- <div class="max-w-4xl mx-auto text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Actualités du Comité d'Entreprise
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            Restez informé des dernières actualités, événements et avantages proposés par votre CE.
          </p>
        </div> -->

        <!-- Carrousel des actualités en vedette -->
        <FeaturedNewsCarousel
          :news="featuredNews"
          :items-per-slide="3"
          @select-news="handleNewsSelect"
          class="mb-16"
        />
      </div>
    </section>

    <!-- Grille des actualités -->
    <NewsGrid
      :news="allNews"
      :items-per-page="9"
      @select-news="handleNewsSelect"
      class=""
    />

    <!-- Bannière d'action -->
    <section
      class="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-100 py-16 mt-16 relative overflow-hidden"
    >
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Vous organisez un événement, une formation, un atelier, une
            conférence ou autre ?
          </h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Faites-le nous savoir et nous le partagerons avec toute l'entreprise
            !
          </p>
          <button
            @click="openEventForm"
            class="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Proposer un événement
          </button>
        </div>
      </div>
    </section>

    <EventCreationForm
      v-if="showEventForm"
      :show="showEventForm"
      @close="handleEventFormClose"
      @submit="handleEventFormSubmit"
    />

    <div
      class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      v-if="selectedNews"
    >
      <div class="relative">
        <img
          :src="
            selectedNews.image ||
            'https://via.placeholder.com/1200x600?text=Actualité'
          "
          :alt="selectedNews.title"
          class="w-full h-64 object-cover rounded-t-xl"
        />
        <button
          @click="selectedNews = null"
          class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Composant de formulaire d'événement -->
      <EventCreationForm
        v-if="showEventForm"
        :show="showEventForm"
        @close="handleEventFormClose"
        @submit="handleEventFormSubmit"
      />

      <!-- Modal de détail d'actualité -->
      <div
        v-if="selectedNews"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="selectedNews = null"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          v-if="selectedNews"
        >
          <div class="relative">
            <img
              :src="
                selectedNews.image ||
                'https://via.placeholder.com/1200x600?text=Actualité'
              "
              :alt="selectedNews.title"
              class="w-full h-64 object-cover rounded-t-xl"
            />
            <button
              @click="selectedNews = null"
              class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="p-6">
            <div class="flex items-center gap-2 mb-4">
              <span
                class="px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {{ selectedNews.category }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(selectedNews.date) }}
              </span>
              <span
                v-if="selectedNews.isUrgent"
                class="ml-auto px-2 py-1 text-xs font-bold bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-full flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                Urgent
              </span>
            </div>

            <h2
              class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {{ selectedNews.title }}
            </h2>

            <div class="prose dark:prose-invert max-w-none">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ selectedNews.content || selectedNews.excerpt }}
              </p>

              <div v-if="selectedNews.additionalContent" class="mt-6">
                <h3 class="text-xl font-semibold mb-3">
                  Détails supplémentaires
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ selectedNews.additionalContent }}
                </p>
              </div>

              <div v-if="selectedNews.cta" class="mt-8">
                <a
                  :href="selectedNews.cta.url"
                  class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  {{ selectedNews.cta.label }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import FeaturedNewsCarousel from "@/components/news/FeaturedNewsCarousel.vue";
import NewsGrid from "@/components/news/NewsGrid.vue";
import EventCreationForm from "@/components/news/EventCreationForm.vue";
import { useToast } from "@/components/toasts/composables/useToast";
import { mockDataNews } from "@/components/news/constants/mockDataNews";

// Initialisation du toast
const { showToast } = useToast();

// Données des actualités (à remplacer par un appel API)
const allNews = ref(mockDataNews);

// Actualités mises en avant (les 6 plus récentes)
const featuredNews = computed(() => {
  return [...allNews.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
});

// Actualité sélectionnée pour la modale
const selectedNews = ref(null);
const router = useRouter();

// Formater la date
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

// Gérer la sélection d'une actualité
const handleNewsSelect = (news) => {
  selectedNews.value = news;
};

// Surveiller les changements de selectedNews pour mettre à jour le localStorage
watch(selectedNews, (newValue) => {
  if (newValue) {
    localStorage.setItem("selectedNewsId", newValue.id.toString());
  } else {
    localStorage.removeItem("selectedNewsId");
  }
});

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

// Au chargement de la page, vérifier si une actualité est sélectionnée dans l'URL
onMounted(() => {
  // Vérifier si une actualité est sélectionnée dans le localStorage
  const savedNewsId = localStorage.getItem("selectedNewsId");
  if (savedNewsId) {
    const newsId = parseInt(savedNewsId);
    const news = allNews.value.find((n) => n.id === newsId);
    if (news) {
      selectedNews.value = news;
    } else {
      // Nettoyer le localStorage si l'actualité n'existe plus
      localStorage.removeItem("selectedNewsId");
    }
  }
});
</script>

<style scoped>
.news-view {
  scroll-behavior: smooth;
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .news-view {
    padding-top: calc(4.6rem + 3.5rem);
  }
}
</style>
