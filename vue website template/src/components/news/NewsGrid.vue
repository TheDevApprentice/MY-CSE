<template>
  <div class="container mx-auto px-4 z-10">
    <!-- Filtres -->
    <div class="mb-12">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <h2 class="text-2xl text-dark dark:text-white font-bold z-10">
          Toutes les actualités
        </h2>
        <div class="flex flex-wrap gap-3 z-10">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="toggleCategory(category.id)"
            class="px-4 py-2 rounded-full text-dark dark:text-dark text-sm font-medium transition-colors z-10"
            :class="{
              'bg-blue-600 dark:text-dark': selectedCategories.includes(
                category.id
              ),
              'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600':
                !selectedCategories.includes(category.id),
            }"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div class="relative max-w-md mb-8">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher une actualité..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          class="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Grille d'actualités -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 z-10"
    >
      <article
        v-for="news in paginatedNews"
        :key="news.id"
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:-translate-y-1 z-20"
      >
        <div class="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          <img
            :src="news.image || 'https://via.placeholder.com/600x400?text=Actu'"
            :alt="news.title"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div
            v-if="news.isUrgent"
            class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20"
          >
            <svg
              class="w-3 h-3 flex-shrink-0"
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
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8"
          >
            <span class="text-xs text-white/90 font-medium">{{
              formatDate(news.date)
            }}</span>
            <h3 class="text-white font-bold text-lg mt-1 line-clamp-2">
              {{ news.title }}
            </h3>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow">
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              class="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full font-medium"
            >
              {{ news.category }}
            </span>
          </div>

          <p
            class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow text-sm leading-relaxed"
          >
            {{ news.excerpt }}
          </p>

          <button
            @click="$emit('select-news', news)"
            class="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors mt-auto pt-2 group"
          >
            Lire la suite
            <svg
              class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
      </article>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center mt-8 z-10">
      <div class="flex items-center gap-2 z-20">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="p-2 z-40 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        <div class="flex items-center gap-1 z-30">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-lg flex items-center justify-center z-30"
            :class="{
              'bg-blue-600 text-white': currentPage === page,
              'hover:bg-gray-100 dark:hover:bg-gray-700': currentPage !== page,
            }"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string | Date;
  category: string;
  isUrgent?: boolean;
  image?: string;
  content?: string;
}

const props = defineProps<{
  news: NewsItem[];
  itemsPerPage?: number;
}>();

const emit = defineEmits<{
  (e: "select-news", news: NewsItem): void;
}>();

// État des filtres
const searchQuery = ref("");
const selectedCategories = ref<string[]>([]);
const currentPage = ref(1);

// Catégories disponibles
const categories = computed(() => {
  const allCategories = new Set<string>();
  props.news.forEach((item) => allCategories.add(item.category));
  return Array.from(allCategories).map((cat, index) => ({
    id: cat.toLowerCase().replace(/\s+/g, "-"),
    name: cat,
  }));
});

// Filtrer les actualités
const filteredNews = computed(() => {
  return props.news.filter((item) => {
    // Filtre par recherche
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase());

    // Filtre par catégorie
    const matchesCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(
        item.category.toLowerCase().replace(/\s+/g, "-")
      );

    return matchesSearch && matchesCategory;
  });
});

// Pagination
const itemsPerPage = props.itemsPerPage || 6;
const totalPages = computed(() =>
  Math.ceil(filteredNews.value.length / itemsPerPage)
);

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredNews.value.slice(start, end);
});

// Méthodes
const toggleCategory = (categoryId: string) => {
  const index = selectedCategories.value.indexOf(categoryId);
  if (index === -1) {
    selectedCategories.value.push(categoryId);
  } else {
    selectedCategories.value.splice(index, 1);
  }
  currentPage.value = 1; // Reset à la première page lors du changement de filtre
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Réinitialiser la pagination lorsque les filtres changent
watch([searchQuery, selectedCategories], () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
