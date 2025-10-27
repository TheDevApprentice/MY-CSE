<template>
  <div class="news-component">
    <div class="news-header">
      <h3 class="news-title">Actualités</h3>
      <p class="news-subtitle">Dernières nouvelles</p>
    </div>

    <div class="news-content">
      <div
        v-if="latestNews"
        v-for="latestNew in latestNews.slice(0, 3)"
        :key="latestNew.id"
        class="latest-news"
        @click="viewNews(latestNew.id)"
      >
        <div class="news-badge">
          <span class="badge-text">{{ latestNew.category }}</span>
        </div>
        <h4 class="news-headline">{{ latestNew.title }}</h4>
        <p class="news-date">{{ formatDate(latestNew.date) }}</p>
      </div>

      <div class="news-stats">
        <div class="stat-item">
          <span class="stat-number">{{ newsCount }}</span>
          <span class="stat-label">Articles</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ weeklyCount }}</span>
          <span class="stat-label">Cette semaine</span>
        </div>
      </div>
    </div>

    <button class="read-more-btn" @click="viewAllNews">
      Lire toutes les actualités
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
import { mockDataNews } from "@/components/news/constants/mockDataNews";

const today = new Date();
// On récupère la date d'il y a 2 semaines
const twoWeeksAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 14);

// On filtre les news pour ne garder que celles de la semaine d'avant et d'aujourd'hui
// On trie ensuite les news par date descendante
const latestNews = computed(() =>
  mockDataNews
    .filter((news) => news.date > twoWeeksAgo && news.date <= today)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
);

const newsCount = ref(12);
const weeklyCount = ref(3);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
};
const router = useRouter();

const viewAllNews = () => {
  console.log("Voir toutes les actualités");
  router.push("/news");
};
const viewNews = (newsId: number) => {
  console.log("Voir actualité selected");
  localStorage.setItem("selectedNewsId", newsId.toString());
  router.push("/news");
};
</script>

<style scoped>
.news-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.news-component:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.news-header {
  margin-bottom: 1.5rem;
}

.news-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.news-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.latest-news {
  flex: 1;
}

.news-badge {
  margin-bottom: 0.75rem;
}

.badge-text {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.news-headline {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.news-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.news-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
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
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.read-more-btn {
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

.read-more-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .news-component {
    padding: 1rem;
  }

  .news-title {
    font-size: 1.25rem;
  }

  .news-headline {
    font-size: 1rem;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .news-stats {
    padding: 0.75rem;
  }
}
</style>
