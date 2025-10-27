<!-- @mouseenter="handleMouseEnter" -->

<template>
  <div
    ref="heroContainer"
    class="hero-section fixed top-16 left-0 right-0 z-40 transition-all duration-300"
    :class="[
      isExpanded ? 'hero-expanded' : 'hero-compact',
      isDark ? 'hero-dark' : 'hero-light',
    ]"
    @mouseleave="handleMouseLeave"
  >
    <!-- Barre compacte avec indicateur -->
    <div
      ref="compactBar"
      class="compact-bar relative w-full backdrop-blur-lg border-b transition-all duration-300"
      :class="[
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
        isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100',
      ]"
    >
      <div
        class="container mx-auto px-4 py-2 flex items-center justify-between"
      >
        <!-- Indicateur d'actualités -->
        <div class="flex items-center gap-3">
          <div
            class="notification-dot w-2 h-2 rounded-full animate-pulse"
            :class="hasUrgentNews ? 'bg-red-500' : 'bg-blue-500'"
          ></div>
          <span
            class="text-sm font-medium"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ latestNewsTitle }}
          </span>
        </div>

        <!-- Actions compactes -->
        <div class="flex items-center gap-2">
          <button
            @click="toggleExpansion"
            class="compact-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            :class="[
              isDark
                ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600'
                : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300',
            ]"
          >
            <component
              :is="ChevronDownIcon"
              class="w-3 h-3 transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded }"
            />
            <span>{{ $t("hero.viewMore") }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Section expandue -->
    <div
      ref="expandedSection"
      class="expanded-section absolute top-0 left-0 right-0 backdrop-blur-xl border-b shadow-2xl transition-all duration-500"
      :class="[
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
        isExpanded
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-full pointer-events-none',
      ]"
    >
      <div class="container mx-auto px-4 py-6">
        <!-- Header de la section expandue -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full"
              :class="
                hasUrgentNews ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
              "
            ></div>
            <h2
              class="text-xl font-bold"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              {{ $t("hero.title") }}
            </h2>
          </div>
          <button
            @click="toggleExpansion"
            class="close-btn p-2 rounded-full transition-all duration-200"
            :class="[
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50',
            ]"
          >
            <component :is="XMarkIcon" class="w-5 h-5" />
          </button>
        </div>

        <!-- Contenu principal en grille -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Actualités urgentes -->
          <div
            v-if="hasUrgentNews"
            class="urgent-news lg:col-span-2 p-6 rounded-xl border-l-4 border-red-500 shadow-lg flex flex-col h-full min-h-[300px]"
            :class="[
              isDark
                ? 'bg-red-900/20 border-red-500'
                : 'bg-red-50/80 border-red-500',
              'relative overflow-hidden',
            ]"
          >
            <div class="relative overflow-hidden flex-1 flex flex-col">
              <!-- Carousel container -->
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="urgent-badge flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-500 shadow-sm"
                >
                  <component
                    :is="ExclamationTriangleIcon"
                    class="w-3.5 h-3.5"
                  />
                  <span>{{ $t("hero.urgent") }}</span>
                </div>
              </div>
              <div
                class="transition-transform duration-500 ease-in-out flex-1 flex flex-col justify-center align-center items-center"
              >
                <div
                  v-for="(news, index) in urgentNewsList"
                  :key="news.id"
                  class="w-[85%] flex-shrink-0 px-1"
                  :class="{
                    'opacity-1 h-0 overflow-hidden':
                      index !== currentUrgentNewsIndex,
                  }"
                >
                  <h3
                    class="font-bold text-lg mb-3 leading-tight transition-opacity duration-300"
                    :class="isDark ? 'text-red-200' : 'text-red-800'"
                  >
                    {{ news.title }}
                  </h3>
                  <p
                    class="text-sm leading-relaxed mb-4 transition-opacity duration-300"
                    :class="isDark ? 'text-red-100' : 'text-red-700'"
                  >
                    {{ news.excerpt }}
                  </p>
                  <button
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
                    :class="
                      isDark
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    "
                    @click="openNews(news)"
                  >
                    <span>{{ $t("hero.readMore") }}</span>
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
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Navigation dots -->
              <div class="flex justify-center mt-6 space-x-2">
                <button
                  v-for="(news, index) in urgentNewsList"
                  :key="`dot-${news.id}`"
                  @click="goToNews(index)"
                  @mouseenter="pauseCarousel"
                  @mouseleave="resumeCarousel"
                  class="w-2 h-2 rounded-full transition-all duration-300 focus:outline-none"
                  :class="{
                    'w-6 bg-red-500': index === currentUrgentNewsIndex,
                    'bg-red-400/50 hover:bg-red-400':
                      index !== currentUrgentNewsIndex,
                  }"
                  :aria-label="`Aller à l'actualité ${index + 1}`"
                ></button>
              </div>

              <!-- Navigation arrows -->
              <button
                @click="prevNews"
                @mouseenter="pauseCarousel"
                @mouseleave="resumeCarousel"
                class="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors duration-200 focus:outline-none"
                :class="{ 'opacity-0': currentUrgentNewsIndex === 0 }"
                :disabled="currentUrgentNewsIndex === 0"
                aria-label="Actualité précédente"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                @click="nextNews"
                @mouseenter="pauseCarousel"
                @mouseleave="resumeCarousel"
                class="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors duration-200 focus:outline-none"
                :class="{
                  'opacity-0':
                    currentUrgentNewsIndex === urgentNewsList.length - 1,
                }"
                :disabled="currentUrgentNewsIndex === urgentNewsList.length - 1"
                aria-label="Actualité suivante"
              >
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
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Actualités récentes -->
          <div
            class="recent-news"
            :class="hasUrgentNews ? 'lg:col-span-1' : 'lg:col-span-2'"
          >
            <div class="flex items-center justify-between mb-4">
              <h4
                class="font-semibold flex items-center gap-2"
                :class="isDark ? 'text-gray-200' : 'text-gray-800'"
              >
                <component :is="NewspaperIcon" class="w-4 h-4" />
                {{ $t("hero.recentNews") }}
              </h4>

              <!-- Bouton Voir plus à côté du titre -->
              <button
                @click="openAllNews"
                class="see-more-btn group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 border"
                :class="[
                  isDark
                    ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/50 hover:border-gray-600 text-gray-300 hover:text-gray-100'
                    : 'bg-white/60 hover:bg-white border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800',
                ]"
              >
                <span>{{ $t("hero.seeMore") }}</span>
                <svg
                  class="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
            <div class="space-y-4">
              <div
                v-for="news in recentNews.slice(0, 3)"
                :key="news.id"
                class="news-item group p-4 rounded-xl transition-all duration-300 cursor-pointer border shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                :class="[
                  isDark
                    ? 'bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/30 hover:border-gray-600'
                    : 'bg-white/70 hover:bg-white border-gray-200 hover:border-gray-300',
                ]"
                @click="openNews(news)"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="news-category px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                    :class="getCategoryStyle(news.category)"
                  >
                    {{ news.category }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5
                      class="font-semibold text-sm line-clamp-2 group-hover:underline transition-all duration-200 mb-1"
                      :class="isDark ? 'text-gray-100' : 'text-gray-800'"
                    >
                      {{ news.title }}
                    </h5>
                    <p
                      class="text-xs"
                      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                    >
                      {{ formatDate(news.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Services du CE -->
          <!-- <div 
              class="ce-services"
              :class="hasUrgentNews ? 'lg:col-span-3' : 'lg:col-span-1'"
            >
              <h4 
                class="font-semibold mb-4 flex items-center gap-2"
                :class="isDark ? 'text-gray-200' : 'text-gray-800'"
              >
                <component :is="BuildingOfficeIcon" class="w-4 h-4" />
                {{ $t('hero.ceServices') }}
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="service in ceServices" 
                  :key="service.id"
                  class="service-item group p-4 rounded-xl text-center transition-all duration-300 cursor-pointer border shadow-sm hover:shadow-lg transform hover:-translate-y-1"
                  :class="[
                    isDark 
                      ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/50 hover:border-gray-600' 
                      : 'bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300'
                  ]"
                  @click="openService(service)"
                >
                  <component 
                    :is="service.icon" 
                    class="w-7 h-7 mx-auto mb-3 group-hover:scale-110 transition-all duration-300"
                    :class="isDark ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'"
                  />
                  <span 
                    class="text-sm font-medium block"
                    :class="isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'"
                  >
                    {{ service.name }}
                  </span>
                </div>
              </div>
            </div>-->
        </div>

        <!-- Actions rapides -->
        <div
          class="flex items-center justify-between mt-6 pt-6 border-t"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <div class="flex items-center gap-3">
            <button
              class="quick-action group flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :class="[
                isDark
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 border border-blue-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-blue-200',
              ]"
              @click="openAllNews"
            >
              <component
                :is="NewspaperIcon"
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
              />
              <span>{{ $t("hero.viewAllNews") }}</span>
            </button>
            <button
              class="quick-action group flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :class="[
                isDark
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 border border-emerald-500/20'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-200',
              ]"
              @click="openServices"
            >
              <component
                :is="BuildingOfficeIcon"
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
              />
              <span>{{ $t("hero.viewServices") }}</span>
            </button>
          </div>
          <div
            class="text-xs px-3 py-2 rounded-lg"
            :class="
              isDark
                ? 'text-gray-400 bg-gray-800/30'
                : 'text-gray-500 bg-gray-100/50'
            "
          >
            {{ $t("hero.lastUpdate") }}: {{ formatDate(lastUpdateDate) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";
import { gsap } from "gsap";
import { useTheme } from "@/composables/useTheme";
import { useI18n } from "@/composables/useI18n";
import { mockDataNews } from "@/components/news/constants/mockDataNews";

// ===== COMPOSABLES =====
const { isDark } = useTheme();
const { t } = useI18n();

// ===== PROPS =====
const props = defineProps({
  mode: {
    type: String,
    default: "auto", // 'auto', 'compact', 'expanded'
    validator: (value: string) =>
      ["auto", "compact", "expanded"].includes(value),
  },
  autoShow: {
    type: Boolean,
    default: false,
  },
  expandable: {
    type: Boolean,
    default: true,
  },
});

// ===== ICÔNES =====
const ChevronDownIcon = defineAsyncComponent(
  () => import("@icons/ChevronDownIcon.vue")
);
const XMarkIcon = defineAsyncComponent(() => import("@icons/XMarkIcon.vue"));
const ExclamationTriangleIcon = defineAsyncComponent(
  () => import("@icons/ExclamationTriangleIcon.vue")
);
const NewspaperIcon = defineAsyncComponent(
  () => import("@icons/NewspaperIcon.vue")
);
const BuildingOfficeIcon = defineAsyncComponent(
  () => import("@icons/BuildingOfficeIcon.vue")
);
const GiftIcon = defineAsyncComponent(() => import("@icons/GiftIcon.vue"));
const CalendarIcon = defineAsyncComponent(
  () => import("@icons/CalendarIcon.vue")
);
const TicketIcon = defineAsyncComponent(() => import("@icons/TicketIcon.vue"));
const HeartIcon = defineAsyncComponent(() => import("@icons/HeartIcon.vue"));

// ===== REFS =====
const heroContainer = ref<HTMLElement | null>(null);
const compactBar = ref<HTMLElement | null>(null);
const expandedSection = ref<HTMLElement | null>(null);

// ===== ÉTAT =====
const isExpanded = ref(false);
const isHovering = ref(false);
const expandTimeout = ref<number | null>(null);

// ===== DONNÉES MOCKÉES (à remplacer par votre API) =====
const urgentNewsList = ref([
  {
    id: 1,
    title: "Nouvelle politique de télétravail",
    excerpt:
      "Veuillez consulter et signer le nouveau règlement de télétravail avant le 15 juin. Des modifications importantes concernent les horaires et l'équipement fourni.",
    date: new Date(),
    category: "RH",
  },
  {
    id: 2,
    title: "Formation sécurité incendie obligatoire",
    excerpt:
      "Une formation sécurité incendie est obligatoire pour tous les employés. Veuillez vous inscrire avant le 20 juin.",
    date: new Date(),
    category: "Formation",
  },
  {
    id: 3,
    title: "Mise à jour des règles de sécurité",
    excerpt:
      "Nouvelles directives de sécurité mises en place. Tous les employés doivent prendre connaissance des nouvelles procédures.",
    date: new Date(),
    category: "Sécurité",
  },
]);

const currentUrgentNewsIndex = ref(0);
const urgentNews = computed(
  () => urgentNewsList.value[currentUrgentNewsIndex.value]
);
const carouselInterval = ref<number | null>(null);
const isCarouselPaused = ref(false);
const CAROUSEL_INTERVAL_MS = 10000; // 10 secondes

const today = new Date();
// On récupère la date d'il y a 2 semaines
const twoWeeksAgo = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 14);

// On filtre les news pour ne garder que celles de la semaine d'avant et d'aujourd'hui
// On trie ensuite les news par date descendante
const recentNews = computed(() =>
  mockDataNews
    .filter((news) => news.date > twoWeeksAgo && news.date <= today)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
);
// const recentNews = ref([
//   {
//     id: 4,
//     title: "Barbecue d'été du CE - Inscriptions ouvertes",
//     date: new Date(Date.now() - 86400000), // Hier
//     category: "Événement"
//   },
//   {
//     id: 5,
//     title: "Nouveaux tarifs préférentiels cinéma",
//     date: new Date(Date.now() - 2 * 86400000), // Avant-hier
//     category: "Avantage"
//   },
//   {
//     id: 6,
//     title: "Formation secourisme - Places disponibles",
//     date: new Date(Date.now() - 3 * 86400000),
//     category: "Formation"
//   }
// ]);

// const ceServices = ref([
//   {
//     id: 1,
//     name: "Billetterie",
//     icon: TicketIcon
//   },
//   {
//     id: 2,
//     name: "Cadeaux",
//     icon: GiftIcon
//   },
//   {
//     id: 3,
//     name: "Événements",
//     icon: CalendarIcon
//   },
//   {
//     id: 4,
//     name: "Solidarité",
//     icon: HeartIcon
//   }
// ]);

const lastUpdateDate = ref(new Date());

// ===== COMPUTED =====
const hasUrgentNews = computed(() => {
  return urgentNews.value && urgentNews.value.title.length > 0;
});

const latestNewsTitle = computed(() => {
  if (hasUrgentNews.value) {
    return urgentNews.value.title;
  }
  return recentNews.value[0]?.title || t("hero.noNews");
});

// ===== MÉTHODES =====
const toggleExpansion = () => {
  if (!props.expandable) return;
  isExpanded.value = !isExpanded.value;

  if (isExpanded.value) {
    animateExpand();
  } else {
    animateCollapse();
  }
};

const handleMouseEnter = () => {
  if (!props.expandable) return;
  isHovering.value = true;

  // Délai avant expansion au hover
  if (expandTimeout.value) {
    clearTimeout(expandTimeout.value);
  }

  expandTimeout.value = setTimeout(() => {
    if (isHovering.value && !isExpanded.value) {
      isExpanded.value = true;
      animateExpand();
    }
  }, 800) as unknown as number;
};

const handleMouseLeave = () => {
  isHovering.value = false;

  if (expandTimeout.value) {
    clearTimeout(expandTimeout.value);
    expandTimeout.value = null;
  }

  // Auto-collapse après un délai si ouvert par hover
  setTimeout(() => {
    if (!isHovering.value && isExpanded.value) {
      isExpanded.value = false;
      animateCollapse();
    }
  }, 2000);
};

const animateExpand = () => {
  if (!expandedSection.value || !compactBar.value) return;

  const tl = gsap.timeline();

  tl.to(compactBar.value, {
    opacity: 0,
    duration: 0.2,
    ease: "power2.out",
  })
    .set(expandedSection.value, {
      display: "block",
    })
    .fromTo(
      expandedSection.value,
      {
        opacity: 0,
        y: -50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.2)",
      }
    );
};

const animateCollapse = () => {
  if (!expandedSection.value || !compactBar.value) return;

  const tl = gsap.timeline();

  tl.to(expandedSection.value, {
    opacity: 0,
    y: -30,
    scale: 0.98,
    duration: 0.3,
    ease: "power2.in",
  })
    .set(expandedSection.value, {
      display: "none",
    })
    .to(compactBar.value, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    });
};

const getCategoryStyle = (category: string) => {
  const styles = {
    RH: isDark.value ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700",
    Événement: isDark.value
      ? "bg-blue-900/50 text-blue-300"
      : "bg-blue-100 text-blue-700",
    Avantage: isDark.value
      ? "bg-emerald-900/50 text-emerald-300"
      : "bg-emerald-100 text-emerald-700",
    Formation: isDark.value
      ? "bg-purple-900/50 text-purple-300"
      : "bg-purple-100 text-purple-700",
  };
  return (
    styles[category as keyof typeof styles] ||
    (isDark.value ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700")
  );
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Actions (à implémenter selon vos besoins)
const openNews = (news: any) => {
  console.log("Ouvrir actualité:", news);
  // TODO: Router vers la page de l'actualité
};

const openService = (service: any) => {
  console.log("Ouvrir service:", service);
  // TODO: Router vers le service
};

const openAllNews = () => {
  console.log("Ouvrir toutes les actualités");
  // TODO: Router vers la page des actualités
};

const openServices = () => {
  console.log("Ouvrir tous les services");
  // TODO: Router vers la page des services
};

const goToNews = (index: number) => {
  currentUrgentNewsIndex.value = index;
};

const prevNews = () => {
  if (currentUrgentNewsIndex.value > 0) {
    currentUrgentNewsIndex.value--;
  } else {
    currentUrgentNewsIndex.value = urgentNewsList.value.length - 1;
  }
};

const nextNews = () => {
  if (currentUrgentNewsIndex.value < urgentNewsList.value.length - 1) {
    currentUrgentNewsIndex.value++;
  } else {
    currentUrgentNewsIndex.value = 0;
  }
};

const pauseCarousel = () => {
  isCarouselPaused.value = true;
};

const resumeCarousel = () => {
  isCarouselPaused.value = false;
};

// ===== WATCHERS =====
watch(
  () => props.autoShow,
  (newValue) => {
    if (newValue && !isExpanded.value) {
      isExpanded.value = true;
      nextTick(() => animateExpand());
    }
  }
);

watch(
  () => currentUrgentNewsIndex,
  () => {
    if (!isCarouselPaused.value) {
      carouselInterval.value = setTimeout(() => {
        nextNews();
      }, CAROUSEL_INTERVAL_MS) as unknown as number;
    }
  }
);

// ===== CYCLE DE VIE =====
onMounted(() => {
  // Auto-expansion si nécessaire
  if (props.autoShow || props.mode === "expanded") {
    isExpanded.value = true;
  }

  console.log("🏢 AppHeroSection monté avec mode:", props.mode);

  if (urgentNewsList.value.length > 1) {
    carouselInterval.value = setTimeout(() => {
      nextNews();
    }, CAROUSEL_INTERVAL_MS) as unknown as number;
  }
});

onUnmounted(() => {
  if (expandTimeout.value) {
    clearTimeout(expandTimeout.value);
  }

  if (carouselInterval.value) {
    clearTimeout(carouselInterval.value);
  }

  // Nettoyer les animations GSAP
  if (heroContainer.value) {
    gsap.killTweensOf(heroContainer.value);
  }
});
</script>

<style scoped>
.hero-section {
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.hero-compact {
  height: auto;
}

.hero-expanded {
  height: auto;
}

.compact-bar {
  min-height: 40px;
}

.expanded-section {
  min-height: 100vh;
  max-height: 100vh;
  t: 90vh;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

/* Masquer la scrollbar pour WebKit browsers (Chrome, Safari, Edge) */
.expanded-section::-webkit-scrollbar {
  display: none;
}

.notification-dot {
  will-change: transform;
}

.news-item:hover {
  transform: translateY(-2px);
}

.service-item:hover {
  transform: translateY(-4px);
}

.quick-action:hover {
  transform: translateY(-2px);
}

.compact-btn:hover {
  transform: translateY(-1px);
}

.see-more-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .see-more-btn:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Professional shadows */
.shadow-professional {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-professional-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .shadow-professional {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.dark .shadow-professional-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Focus states */
button:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

/* Professional glass effect */
.glass-effect {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .glass-effect {
  background: rgba(17, 24, 39, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .expanded-section {
    max-height: 350px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .lg\:col-span-2,
  .lg\:col-span-3 {
    grid-column: 1;
  }
}
</style>
