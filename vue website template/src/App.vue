// App.vue
<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineAsyncComponent,
  computed,
  nextTick,
  Suspense,
} from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import ComponentLoading from "@/components/common/general/ComponentLoading.vue";
import ErrorComponent from "@/components/common/general/ErrorComponent.vue";
import { useTheme } from "@/composables/useTheme";

// ===== DONNÉES RÉACTIVES =====
const isAppInitialized = ref(false);
const isLayoutReady = ref(false);

const { isDark } = useTheme();
const route = useRoute();
const router = useRouter();

// ===== COMPOSANTS LAYOUT OPTIMISÉS =====
// ✅ OPTIMISÉ: Délais réduits et timeouts optimisés pour les composants layout
const AppHeader = defineAsyncComponent({
  loader: () => import("./components/app/AppHeader.vue"),
  loadingComponent: ComponentLoading,
  errorComponent: ErrorComponent,
  delay: 200, // ✅ RÉDUIT: 200ms au lieu de 2000ms
  timeout: 5000, // ✅ AUGMENTÉ: Plus de temps pour éviter les timeouts
});

const AppHeroSection = defineAsyncComponent({
  loader: () => import("./components/app/AppHeroSection.vue"),
  loadingComponent: ComponentLoading,
  errorComponent: ErrorComponent,
  delay: 300, // ✅ OPTIMISÉ: Légèrement décalé
  timeout: 5000,
});

const AppFooter = defineAsyncComponent({
  loader: () => import("./components/app/AppFooter.vue"),
  loadingComponent: ComponentLoading,
  errorComponent: ErrorComponent,
  delay: 100, // ✅ OPTIMISÉ: Footer en priorité
  timeout: 5000,
});

const AppBackground = defineAsyncComponent({
  loader: () => import("./components/app/AppBackground.vue"),
  loadingComponent: ComponentLoading,
  errorComponent: ErrorComponent,
  delay: 500, // ✅ OPTIMISÉ: Background en dernier
  timeout: 5000,
});

// ===== SYSTÈME DE TRANSITIONS DYNAMIQUES OPTIMISÉ =====

// ✅ OPTIMISÉ: Transition depuis les meta de route
const currentTransition = computed(() => {
  return route.meta?.transition || "route-blur-depth";
});

const transitionDirection = ref("forward");

// ✅ OPTIMISÉ: Direction basée sur l'historique du navigateur
const getTransitionDirection = () => {
  // Utiliser l'API History pour détecter back/forward
  const navigation = (window as any).navigation;
  if (navigation && navigation.currentEntry) {
    transitionDirection.value =
      navigation.traverseType === "back" ? "backward" : "forward";
  } else {
    // Fallback pour navigateurs non supportés
    transitionDirection.value = "forward";
  }
};

// ===== COMPUTED OPTIMISÉS =====
const shouldShowFooter = computed(() => {
  const hiddenFooterRoutes = ["/404-not-found"];
  return !hiddenFooterRoutes.includes(route.fullPath);
});
const shouldShowAppHeroHeader = computed(() => {
  const hiddenAppHeroHeaderRoutes = [
    "/dashboard/sass/",
    "/dashboard/cse/",
    "/404-not-found",
  ];
  return !hiddenAppHeroHeaderRoutes.some((routePrefix) =>
    route.fullPath.startsWith(routePrefix)
  );
});
const transitionClasses = computed(() => ({
  [`${currentTransition.value}`]: true,
  [`${currentTransition.value}--${transitionDirection.value}`]:
    transitionDirection.value !== "same",
}));

// ===== FONCTIONS OPTIMISÉES =====
const initializeApp = async () => {
  try {
    console.log("🚀 Initializing App component...");
    const locale = localStorage.getItem("app-locale")
    if(!locale || locale.length === 0){
      console.log("Locale not found, setting to fr-FR")
      localStorage.setItem("app-locale", "fr-FR")
    }
    await finalizeAppInit();
  } catch (error) {
    console.error("❌ Error initializing app:", error);
  }
};

const finalizeAppInit = async () => {
  await nextTick();

  // ✅ OPTIMISÉ: Attendre que le layout soit prêt
  await new Promise((resolve) => {
    const checkLayout = () => {
      if (isLayoutReady.value) {
        resolve(true);
      } else {
        setTimeout(checkLayout, 50);
      }
    };
    checkLayout();
  });

  isAppInitialized.value = true;
  console.log("✅ App component initialized successfully");

  if (import.meta.env.DEV) {
    console.log("📊 App State:", {
      route: route.fullPath,
      transition: currentTransition.value,
      layoutReady: isLayoutReady.value,
    });
  }
};

// ===== BANNIÈRE WIP OPTIMISÉE =====
const showWipBanner = ref(false);
const storageKeyWip = "wipBannerLastOk";

function checkWipBanner() {
  try {
    const lastOk = localStorage.getItem(storageKeyWip);
    if (!lastOk) return true;
    const lastDate = new Date(parseInt(lastOk, 10));
    const now = new Date();
    return now.getTime() - lastDate.getTime() > 86400000; // ✅ OPTIMISÉ: getTime()
  } catch (e) {
    return true;
  }
}

function closeWipBanner() {
  try {
    localStorage.setItem(storageKeyWip, Date.now().toString());
    showWipBanner.value = false;
  } catch (e) {
    console.warn("Could not save banner state");
    showWipBanner.value = false;
  }
}

// ===== WATCHERS OPTIMISÉS =====
// ✅ OPTIMISÉ: Watcher avec debouncing pour les transitions
let transitionTimeout: number | null = null;
watch(
  route,
  (newRoute, oldRoute) => {
    if (transitionTimeout) clearTimeout(transitionTimeout);

    transitionTimeout = setTimeout(() => {
      if (oldRoute) {
        getTransitionDirection();
        console.log(
          `🎭 Transition: ${oldRoute.fullPath} → ${newRoute.fullPath} (${currentTransition.value})`
        );
      }
    }, 16); // ✅ OPTIMISÉ: Un frame de délai
  },
  { immediate: false }
);

// ===== CYCLE DE VIE OPTIMISÉ =====
onMounted(async () => {
  await nextTick();
  console.log("📱 App component mounted");

  // ✅ OPTIMISÉ: Vérifier la bannière en async
  if (checkWipBanner()) {
    showWipBanner.value = true;
  }

  // ✅ OPTIMISÉ: Marquer le layout comme prêt après un délai
  setTimeout(() => {
    isLayoutReady.value = true;
  }, 1000);

  // ✅ OPTIMISÉ: Initialiser l'app
  await initializeApp();
});

onUnmounted(() => {
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }
  console.log("🧹 App cleanup completed");
});
</script>

<template>
  <div class="app-content">
    <!-- ✅ OPTIMISÉ: Suspense séparé pour le layout -->
    <AppHeader />
    <AppHeroSection v-if="shouldShowAppHeroHeader" />
    <AppBackground />
    <!-- Main content avec Suspense séparé pour les routes -->
    <main class="main-content">
      <!-- Bannière WIP -->
      <Transition name="fade">
        <div
          v-if="showWipBanner"
          class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto bg-white/10 dark:bg-black/10"
        >
          <div class="wip-banner-glass">
            <svg
              class="wip-banner-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="12"
                :class="
                  isDark
                    ? 'wip-banner-icon-bg-dark'
                    : 'wip-banner-icon-bg-light'
                "
              />
              <path
                d="M12 7v5"
                stroke-width="2"
                stroke-linecap="round"
                :class="
                  isDark
                    ? 'wip-banner-icon-fg-dark'
                    : 'wip-banner-icon-fg-light'
                "
              />
              <circle
                cx="12"
                cy="16"
                r="1.5"
                :class="
                  isDark
                    ? 'wip-banner-icon-fg-dark'
                    : 'wip-banner-icon-fg-light'
                "
              />
            </svg>
            <h2 class="wip-banner-title">Site en cours de travail</h2>
            <p class="wip-banner-text">
              Certaines animations peuvent être momentanément ralenties.<br />
              Ce problème sera bientôt résolu. Merci de votre compréhension !
            </p>
            <button @click="closeWipBanner" class="wip-banner-btn">
              J'ai compris
            </button>
          </div>
        </div>
      </Transition>

      <!-- ✅ OPTIMISÉ: RouterView avec Suspense optimisé -->
      <Suspense>
        <template #default>
          <RouterView v-slot="{ Component, route: currentRoute }">
            <Transition
              :name="currentTransition"
              mode="out-in"
              appear
              :class="transitionClasses"
            >
              <component
                :is="Component"
                :key="currentRoute.fullPath"
                class="page-content transition-container"
              />
            </Transition>
          </RouterView>
        </template>
        <template #fallback>
          <div class="route-loading">
            <ComponentLoading />
          </div>
        </template>
      </Suspense>

      <AppFooter v-if="shouldShowFooter" />
    </main>
  </div>
</template>

<style>
@import "tailwindcss";

/* ===== BANNIÈRE GLASSMORPHISME ===== */
.wip-banner-glass {
  @apply flex flex-col items-center max-w-[90vw] px-8 py-10 rounded-3xl border border-white/30 shadow-2xl backdrop-blur-xl saturate-150;
  background: rgba(255, 255, 255, 0.18);
  @apply dark:bg-neutral-900/70 dark:border-neutral-700;
}
.wip-banner-icon {
  @apply mb-4 w-12 h-12;
}
.wip-banner-title {
  @apply font-semibold text-xl text-gray-900 text-center mb-2;
}
.dark .wip-banner-title {
  @apply font-semibold text-xl text-gray-100 text-center mb-2;
}
.wip-banner-text {
  @apply text-base text-gray-800 text-center max-w-xs;
}
.dark .wip-banner-text {
  @apply text-base text-gray-300 text-center max-w-xs;
}
.wip-banner-btn {
  @apply mt-6 px-6 py-2 text-base font-medium rounded-full shadow transition bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300;
}
.dark .wip-banner-btn {
  @apply mt-6 px-6 py-2 text-base font-medium rounded-full shadow transition bg-yellow-400 text-yellow-900 hover:bg-yellow-300 focus:outline-none focus:ring-2  focus:ring-yellow-500;
}

/* Icone SVG couleurs light/dark */
.wip-banner-icon-bg-light {
  fill: #fff3cd;
}
.wip-banner-icon-bg-dark {
  fill: #2d2d2d;
}
.wip-banner-icon-fg-light {
  fill: #f59e42;
  stroke: #f59e42;
}
.wip-banner-icon-fg-dark {
  fill: #fbbf24;
  stroke: #fbbf24;
}

/* ===== LAYOUT GLOBAL ===== */
.app-container {
  position: relative;
  transition: all 0.3s ease;
  flex: 1;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.app-content {
  position: relative;
}

.main-content {
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    rgb(249, 250, 251) 0%,
    rgb(243, 244, 246) 100%
  );
  color: rgb(17, 24, 39);
  transition: all 0.3s ease;
}

.page-content {
  flex: 1;
}

.transition-container {
  position: relative;
  overflow: hidden;
}

/* Dark mode */
.dark .main-content {
  background: linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(31, 41, 55) 100%);
  color: rgb(243, 244, 246);
}

/* ===== TRANSITIONS PROFESSIONNELLES ===== */

/* 1. ZOOM BLUR - Home (Spectaculaire) */
.route-zoom-blur-enter-active {
  transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.route-zoom-blur-leave-active {
  transition: all 0.8s cubic-bezier(0.7, 0, 0.84, 0);
}

.route-zoom-blur-enter-from {
  opacity: 0;
  filter: blur(20px) brightness(1.2) saturate(1.3);
  transform: scale(0.8) translateY(100px) rotateX(10deg);
}

.route-zoom-blur-leave-to {
  opacity: 0;
  filter: blur(15px) brightness(0.8);
  transform: scale(1.1) translateY(-50px) rotateX(-5deg);
}

.route-zoom-blur-enter-to,
.route-zoom-blur-leave-from {
  opacity: 1;
  filter: blur(0px) brightness(1) saturate(1);
  transform: scale(1) translateY(0) rotateX(0deg);
}

/* 2. SLIDE PARALLAX - Services */
.route-slide-parallax-enter-active {
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.route-slide-parallax-leave-active {
  transition: all 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.route-slide-parallax-enter-from {
  opacity: 0;
  transform: translateX(100%) skewX(-5deg) scale(0.95);
  filter: blur(8px);
}

.route-slide-parallax-leave-to {
  opacity: 0;
  transform: translateX(-100%) skewX(5deg) scale(1.05);
  filter: blur(5px);
}

.route-slide-parallax-enter-to,
.route-slide-parallax-leave-from {
  opacity: 1;
  transform: translateX(0) skewX(0deg) scale(1);
  filter: blur(0px);
}

/* 3. DEPTH SLIDE - Service Detail */
.route-depth-slide-enter-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.route-depth-slide-leave-active {
  transition: all 0.7s cubic-bezier(0.6, 0, 0.8, 0.2);
}

.route-depth-slide-enter-from {
  opacity: 0;
  transform: translateZ(-200px) translateY(80px) rotateY(15deg);
  filter: blur(12px) brightness(0.7);
}

.route-depth-slide-leave-to {
  opacity: 0;
  transform: translateZ(100px) translateY(-40px) rotateY(-10deg);
  filter: blur(8px) brightness(1.3);
}

.route-depth-slide-enter-to,
.route-depth-slide-leave-from {
  opacity: 1;
  transform: translateZ(0) translateY(0) rotateY(0deg);
  filter: blur(0px) brightness(1);
}

/* 4. FADE ELEGANT - News */
.route-fade-elegant-enter-active {
  transition: all 1.1s cubic-bezier(0.23, 1, 0.32, 1);
}

.route-fade-elegant-leave-active {
  transition: all 0.6s cubic-bezier(0.7, 0, 0.84, 0);
}

.route-fade-elegant-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
  filter: blur(6px) contrast(0.8);
}

.route-fade-elegant-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
  filter: blur(4px) contrast(1.2);
}

.route-fade-elegant-enter-to,
.route-fade-elegant-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px) contrast(1);
}

/* 5. BOUNCE MODERN - Events */
.route-bounce-modern-enter-active {
  transition: all 1.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.route-bounce-modern-leave-active {
  transition: all 0.7s cubic-bezier(0.6, 0.04, 0.98, 0.335);
}

.route-bounce-modern-enter-from {
  opacity: 0;
  transform: scale(0.3) rotate(10deg) translateY(100px);
  filter: blur(10px) hue-rotate(30deg);
}

.route-bounce-modern-leave-to {
  opacity: 0;
  transform: scale(1.2) rotate(-5deg) translateY(-50px);
  filter: blur(6px) hue-rotate(-15deg);
}

.route-bounce-modern-enter-to,
.route-bounce-modern-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg) translateY(0);
  filter: blur(0px) hue-rotate(0deg);
}

/* 6. ROTATE SCALE - Advantages */
.route-rotate-scale-enter-active {
  transition: all 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.route-rotate-scale-leave-active {
  transition: all 0.8s cubic-bezier(0.6, 0.04, 0.98, 0.335);
}

.route-rotate-scale-enter-from {
  opacity: 0;
  transform: rotate(180deg) scale(0.5) translateY(60px);
  filter: blur(15px) sepia(0.3);
}

.route-rotate-scale-leave-to {
  opacity: 0;
  transform: rotate(-90deg) scale(1.3) translateY(-30px);
  filter: blur(8px) sepia(0.1);
}

.route-rotate-scale-enter-to,
.route-rotate-scale-leave-from {
  opacity: 1;
  transform: rotate(0deg) scale(1) translateY(0);
  filter: blur(0px) sepia(0);
}

/* 7. SECURITY FADE - Auth */
.route-security-fade-enter-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.route-security-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.7, 0, 0.84, 0);
}

.route-security-fade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  filter: blur(8px) grayscale(0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.route-security-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(1.02);
  filter: blur(5px) grayscale(0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.route-security-fade-enter-to,
.route-security-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px) grayscale(0);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

/* 8. BLUR DEPTH - Default */
.route-blur-depth-enter-active {
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.route-blur-depth-leave-active {
  transition: all 0.7s cubic-bezier(0.7, 0, 0.84, 0);
}

.route-blur-depth-enter-from {
  opacity: 0;
  filter: blur(12px) brightness(1.1);
  transform: translateY(50px) scale(0.96);
}

.route-blur-depth-leave-to {
  opacity: 0;
  filter: blur(8px) brightness(0.9);
  transform: translateY(-25px) scale(1.02);
}

.route-blur-depth-enter-to,
.route-blur-depth-leave-from {
  opacity: 1;
  filter: blur(0px) brightness(1);
  transform: translateY(0) scale(1);
}

/* ===== VARIATIONS DIRECTIONNELLES ===== */

/* Forward/Backward pour slides */
.route-slide-parallax--backward .route-slide-parallax-enter-from {
  transform: translateX(-100%) skewX(5deg) scale(0.95);
}

.route-slide-parallax--backward .route-slide-parallax-leave-to {
  transform: translateX(100%) skewX(-5deg) scale(1.05);
}

/* ===== RESPONSIVE OPTIMIZATIONS ===== */
@media (max-width: 768px) {
  /* Réduire les effets sur mobile pour les performances */
  .route-zoom-blur-enter-from,
  .route-zoom-blur-leave-to {
    filter: blur(10px) brightness(1.1);
    transform: scale(0.9) translateY(50px);
  }

  .route-slide-parallax-enter-from,
  .route-slide-parallax-leave-to {
    filter: blur(4px);
    transform: translateX(50%) scale(0.98);
  }

  .route-depth-slide-enter-from,
  .route-depth-slide-leave-to {
    filter: blur(6px);
    transform: translateY(40px) rotateY(5deg);
  }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
  .route-zoom-blur-enter-active,
  .route-zoom-blur-leave-active,
  .route-slide-parallax-enter-active,
  .route-slide-parallax-leave-active,
  .route-depth-slide-enter-active,
  .route-depth-slide-leave-active,
  .route-fade-elegant-enter-active,
  .route-fade-elegant-leave-active,
  .route-bounce-modern-enter-active,
  .route-bounce-modern-leave-active,
  .route-rotate-scale-enter-active,
  .route-rotate-scale-leave-active,
  .route-security-fade-enter-active,
  .route-security-fade-leave-active,
  .route-blur-depth-enter-active,
  .route-blur-depth-leave-active {
    transition: opacity 0.3s ease !important;
  }

  .route-zoom-blur-enter-from,
  .route-zoom-blur-leave-to,
  .route-slide-parallax-enter-from,
  .route-slide-parallax-leave-to,
  .route-depth-slide-enter-from,
  .route-depth-slide-leave-to,
  .route-fade-elegant-enter-from,
  .route-fade-elegant-leave-to,
  .route-bounce-modern-enter-from,
  .route-bounce-modern-leave-to,
  .route-rotate-scale-enter-from,
  .route-rotate-scale-leave-to,
  .route-security-fade-enter-from,
  .route-security-fade-leave-to,
  .route-blur-depth-enter-from,
  .route-blur-depth-leave-to {
    filter: none !important;
    transform: none !important;
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Styles pour la modale */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(20px);
  opacity: 0;
}
/* Animation de survol des cartes */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
