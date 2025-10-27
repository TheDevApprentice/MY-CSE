<template>
  <div
    class="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8"
  >
    <div class="max-w-full mx-auto">
      <h2 class="text-3xl font-bold mb-8">À la Une</h2>

      <!-- Carousel Container -->
      <div class="relative">
        <!-- Carousel Track -->
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <!-- Slides (grouped by 3) -->
          <div
            v-for="(group, groupIndex) in groupedNews"
            :key="groupIndex"
            class="w-full flex-shrink-0 px-10 grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto align-center"
          >
            <!-- Individual News Item -->
            <div
              v-for="news in group"
              :key="news.id"
              class="w-[98%] bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              @click="$emit('select-news', news)"
            >
              <div class="flex items-center gap-2 mb-3">
                <span
                  class="px-3 py-1 text-xs font-semibold bg-white/20 rounded-full"
                >
                  {{ news.category }}
                </span>
                <span class="text-sm opacity-80">
                  {{ formatDate(news.date) }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-2 line-clamp-2">
                {{ news.title }}
              </h3>
              <p class="text-sm opacity-90 mb-4 line-clamp-3">
                {{ news.excerpt }}
              </p>
              <button
                class="text-sm font-medium flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                Lire la suite
                <svg
                  class="w-4 h-4"
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

        <!-- Navigation Arrows -->
        <button
          @click="prevSlide"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300"
          :disabled="currentSlide === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentSlide === 0 }"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          @click="nextSlide"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300"
          :disabled="currentSlide >= totalSlides - 1"
          :class="{
            'opacity-50 cursor-not-allowed': currentSlide >= totalSlides - 1,
          }"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- Pagination Dots -->
        <div class="flex justify-center mt-6 space-x-2">
          <button
            v-for="i in totalSlides"
            :key="i"
            @click="currentSlide = i - 1"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="i - 1 === currentSlide ? 'bg-white w-6' : 'bg-white/50 w-3'"
            :aria-label="`Aller au slide ${i}`"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string | Date;
  category: string;
  isUrgent?: boolean;
  image?: string;
}

const props = defineProps<{
  news: NewsItem[];
  itemsPerSlide?: number;
}>();

const emit = defineEmits<{
  (e: "select-news", news: NewsItem): void;
}>();

const currentSlide = ref(0);
const autoPlay = ref(true);
const interval = ref<NodeJS.Timeout | null>(null);

// Clé unique pour le stockage local
const STORAGE_KEY = "featuredCarouselSlide";

// Group news into chunks of itemsPerSlide
const groupedNews = computed(() => {
  const groups = [];
  const itemsPerSlide = props.itemsPerSlide || 3;
  for (let i = 0; i < props.news.length; i += itemsPerSlide) {
    groups.push(props.news.slice(i, i + itemsPerSlide));
  }
  return groups;
});

const totalSlides = computed(() =>
  Math.ceil(props.news.length / (props.itemsPerSlide || 3))
);

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
  saveCurrentSlide();
  resetAutoPlay();
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = totalSlides.value - 1;
  }
  saveCurrentSlide();
  resetAutoPlay();
};

// Sauvegarder la diapositive actuelle
const saveCurrentSlide = () => {
  localStorage.setItem(STORAGE_KEY, currentSlide.value.toString());
};

// Restaurer la diapositive sauvegardée
const restoreSlide = () => {
  const savedSlide = localStorage.getItem(STORAGE_KEY);
  if (savedSlide !== null) {
    const slideIndex = parseInt(savedSlide, 10);
    if (
      !isNaN(slideIndex) &&
      slideIndex >= 0 &&
      slideIndex < totalSlides.value
    ) {
      currentSlide.value = slideIndex;
    }
  }
};

const startAutoPlay = () => {
  if (interval.value) clearInterval(interval.value);
  interval.value = setInterval(() => {
    if (autoPlay.value) {
      nextSlide();
    }
  }, 7000); // Change slide every 7 seconds
};

const resetAutoPlay = () => {
  if (interval.value) clearInterval(interval.value);
  startAutoPlay();
};

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const pauseOnHover = () => {
  autoPlay.value = false;
};

const resumeOnLeave = () => {
  autoPlay.value = true;
  resetAutoPlay();
};

onMounted(() => {
  // Restaurer la diapositive sauvegardée
  nextTick(() => {
    restoreSlide();
  });

  startAutoPlay();

  // Pause carousel when window loses focus
  window.addEventListener("blur", pauseOnHover);
  window.addEventListener("focus", resumeOnLeave);
});

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value);
  window.removeEventListener("blur", pauseOnHover);
  window.removeEventListener("focus", resumeOnLeave);
});
</script>

<style scoped>
/* Custom scrollbar for the carousel */
.carousel-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.carousel-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
