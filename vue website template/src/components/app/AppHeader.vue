<template>
  <header
    class="fixed left-0 right-0 top-0 z-40 w-full"
    role="banner"
    :aria-label="$t('navigation.main')"
  >
    <!-- Section principale du header -->
    <div
      :class="[
        'w-full shadow-sm transition-all duration-500 border-b backdrop-blur-lg',
        isDark
          ? 'bg-gray-900 border-gray-700 text-gray-100'
          : 'bg-white border-gray-200 text-gray-900',
      ]"
    >
      <div
        class="container mx-auto flex items-center justify-between h-16 px-4 sm:px-0"
      >
        <!-- Version Alternative Plus Minimaliste -->
        <div class="flex items-center">
          <button
            @click="scrollToTop()"
            class="group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            :aria-label="$t('navigation.home')"
          >
            <!-- Logo Minimal -->
            <div class="relative">
              <div
                class="w-25 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                :class="{
                  'bg-gradient-to-br from-blue-600 to-emerald-600': isDark,
                  'bg-gradient-to-br from-blue-500 to-emerald-500': !isDark,
                }"
              >
                <span class="text-white font-bold text-lg">Mon CSE</span>
              </div>
            </div>
          </button>
        </div>

        <!-- Navigation -->
        <nav
          class="flex items-center justify-center flex-1 h-full mx-4"
          role="navigation"
          :aria-label="$t('navigation.main')"
        >
          <!-- Desktop navigation -->
          <div class="hidden md:flex items-center h-full space-x-2">
            <button
              v-for="item in navItems"
              :key="item.id"
              class="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus:outline-none bg-transparent border-none shadow-none"
              :class="[
                isDark
                  ? $route.path === item.path
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                  : $route.path === item.path
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900',
                'group',
              ]"
              @click="$router.push(item.path)"
              :aria-current="$route.path === item.path ? 'page' : undefined"
              style="background: none; border: none"
            >
              <span class="relative flex items-center justify-center">
                <span>{{ $t(item.label) }}</span>
                <span
                  class="absolute left-0 -bottom-1 w-full h-0.5 rounded-full transition-all duration-300 origin-left"
                  :class="[
                    $route.path === item.path
                      ? isDark
                        ? 'bg-blue-400 scale-x-100 opacity-100'
                        : 'bg-blue-600 scale-x-100 opacity-100'
                      : 'bg-transparent scale-x-0 opacity-0',
                    'group-hover:scale-x-100 group-hover:opacity-60',
                  ]"
                ></span>
              </span>
            </button>
          </div>
          <!-- Mobile navigation placeholder -->
          <div class="md:hidden">
            <transition name="fade">
              <div
                v-if="showMobileMenu"
                class="absolute top-16 left-0 w-full shadow-lg z-50 flex flex-col items-center py-4 space-y-2 md:hidden animate-fade-in"
                :class="isDark ? 'bg-gray-900' : 'bg-white'"
              >
                <button
                  v-for="item in navItems"
                  :key="item.id + '-mobile'"
                  class="w-full px-4 py-2 text-base font-medium rounded-md text-left focus:outline-none bg-transparent border-none shadow-none"
                  :class="[
                    isDark
                      ? $route.path === item.path
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                      : $route.path === item.path
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900',
                    'group',
                  ]"
                  @click="
                    $router.push(item.path);
                    showMobileMenu = false;
                  "
                  :aria-current="$route.path === item.path ? 'page' : undefined"
                  style="background: none; border: none"
                >
                  <span>{{ $t(item.label) }}</span>
                </button>

                <!-- Mobile Auth Button in Menu -->
                <div
                  class="w-full px-4 pt-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    @click="
                      handleAuthClick('signin');
                      showMobileMenu = false;
                    "
                    :class="[
                      'w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500'
                        : 'bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500',
                    ]"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <IconSignIn class="w-4 h-4" />
                      <span>{{ $t("header.auth.signIn") }}</span>
                    </span>
                  </button>
                </div>
                <div
                  class="w-full px-4 pt-2 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    @click="
                      handleAuthClick('signup');
                      showMobileMenu = false;
                    "
                    :class="[
                      'w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isDark
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500',
                    ]"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <IconSignUp class="w-4 h-4" />
                      <span>{{ $t("header.auth.signUp") }}</span>
                    </span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </nav>

        <!-- Right: Theme & Language & Auth & Company Social Links & Mobile Menu -->
        <div class="flex items-center justify-end gap-2 z-50 min-w-0">
          <div
            ref="mainControlsContainer"
            class="flex items-center gap-1.5 ml-auto main-controls-container"
          >
            <ThemeToggle />
            <div class="h-6 w-px bg-[var(--glass-border)]"></div>
            <LanguageSwitcher />

            <!-- Desktop Auth Button avec animations GSAP optimisées -->
            <div class="hidden md:flex items-center gap-2" v-if="shouldAnimate">
              <div class="h-6 w-px bg-[var(--glass-border)]"></div>

              <div
                ref="authButtonRef"
                class="auth-container group relative w-56 h-12 rounded-xl overflow-hidden text-sm font-semibold shadow-lg transition-all duration-300"
                :class="[
                  isDark
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500 text-white',
                ]"
                @mouseleave="resetAuthButton"
                :style="authContainerStyles"
              >
                <!-- Effet de lumière animé -->
                <div
                  class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  :class="[
                    isDark
                      ? 'bg-gradient-to-r from-blue-400/20 via-blue-300/20 to-emerald-400/20'
                      : 'bg-gradient-to-r from-blue-300/30 via-blue-200/30 to-emerald-300/30',
                  ]"
                ></div>

                <!-- Bouton Sign In -->
                <button
                  ref="signInRef"
                  @click="handleAuthClick('signin')"
                  @mouseenter="animateToSignIn"
                  class="signin-btn absolute left-0 top-0 h-full flex items-center justify-center gap-2 px-3 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent overflow-hidden"
                  :style="signInStyles"
                >
                  <IconSignIn class="w-5 h-5 shrink-0" />
                  <span
                    ref="signInTextRef"
                    class="signin-text whitespace-nowrap font-medium"
                    :style="textStyles"
                    >{{ $t("header.auth.signIn") }}</span
                  >
                </button>

                <!-- Bouton Sign Up -->
                <button
                  ref="signUpRef"
                  @click="handleAuthClick('signup')"
                  @mouseenter="animateToSignUp"
                  class="signup-btn absolute right-0 top-0 h-full flex items-center justify-center gap-2 px-3 z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent overflow-hidden"
                  :style="signUpStyles"
                >
                  <IconSignUp class="w-5 h-5 shrink-0" />
                  <span
                    ref="signUpTextRef"
                    class="signup-text whitespace-nowrap font-medium"
                    :style="textStyles"
                    >{{ $t("header.auth.signUp") }}</span
                  >
                </button>

                <!-- Indicateur de hover -->
                <div
                  class="absolute bottom-0 left-0 h-1 bg-white/60 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"
                ></div>
              </div>
            </div>
          </div>

          <!-- Company Social Links - Animated with GSAP (Desktop Only) -->
          <div
            ref="socialLinksContainer"
            class="hidden lg:flex items-center gap-2 ml-4 opacity-0 absolute right-0 mr-4 social-links-container"
            :style="socialContainerStyles"
            v-if="shouldAnimate"
          >
            <div
              ref="socialSeparator"
              class="h-6 w-px bg-[var(--glass-border)] opacity-0 social-separator"
              :style="separatorStyles"
            ></div>
            <div ref="socialIconsWrapper" class="flex items-center gap-3">
              <div
                v-for="(social, index) in companySocialLinks"
                :key="social.name"
                :ref="(el) => setSocialIconRef(el, index)"
                class="group opacity-0 social-icon-item"
                :style="iconItemStyles(index)"
              >
                <a
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  "
                  :title="social.label"
                >
                  <component :is="social.icon" class="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <!-- Mobile navigation: burger menu -->
          <div class="md:hidden">
            <button
              @click="showMobileMenu = !showMobileMenu"
              :aria-label="$t('navigation.toggleMenu')"
              class="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ml-2"
              style="border: none"
            >
              <svg
                v-if="!showMobileMenu"
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  watch,
  nextTick,
} from "vue";
import { gsap } from "gsap";

import { useRouter, useRoute } from "vue-router";
import { useTheme } from "@/composables/useTheme";

// ===== COMPOSABLES =====
const router = useRouter();
const route = useRoute();
const { isDark } = useTheme();

// ===== IMPORT DYNAMIQUE DES COMPOSANTS =====
const LanguageSwitcher = defineAsyncComponent(
  () => import("./LanguageSwitcher.vue")
);
const ThemeToggle = defineAsyncComponent(() => import("./ThemeToggle.vue"));

// Import des nouvelles icônes d'authentification
const IconSignIn = defineAsyncComponent(() => import("@icons/IconSignIn.vue"));
const IconSignUp = defineAsyncComponent(() => import("@icons/IconSignUp.vue"));

// Import des icônes pour les réseaux sociaux d'entreprise
const IconLinkedin = defineAsyncComponent(
  () => import("@icons/IconLinkedin.vue")
);
const IconTwitter = defineAsyncComponent(
  () => import("@icons/IconTwitter.vue")
);
const IconInstagram = defineAsyncComponent(
  () => import("@icons/IconInstagram.vue")
);
const IconYoutube = defineAsyncComponent(
  () => import("@icons/IconYoutube.vue")
);

// ===== ÉTAT LOCAL =====
const showMobileMenu = ref(false);
const isScrolled = ref(false);
const isMobile = ref(false); // Détection responsive
const isTablet = ref(false); // Détection tablet

// Nouvelles refs pour le bouton auth
const authButtonRef = ref(null);
const signInRef = ref(null);
const signUpRef = ref(null);
const signInTextRef = ref(null);
const signUpTextRef = ref(null);
const authTimeline = ref(null);

// ===== REFS POUR LES ANIMATIONS GSAP =====
const socialLinksContainer = ref(null);
const socialSeparator = ref(null);
const socialIconsWrapper = ref(null);
const socialIconRefs = ref([]);
const mainControlsContainer = ref(null); // Ref pour animer le décalage des contrôles

// Timeline GSAP pour les animations
let animationTimeline: gsap.core.Timeline | null = null;
let scrollTimeout: number | null = null;
let intersectionObserver: IntersectionObserver | null = null;

// ===== OPTIMISATIONS PERFORMANCE =====

// Configuration GSAP optimisée
const gsapConfig = {
  force3D: true,
  autoSleep: 60,
  nullTargetWarn: false,
  units: { rotation: "deg" },
};

// Détection des animations réduites
const prefersReducedMotion = ref(
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
);

// Computed pour savoir si on doit animer
const shouldAnimate = computed(
  () => !isMobile.value && !isTablet.value && !prefersReducedMotion.value
);

// Styles computed pour l'optimisation
const authContainerStyles = computed(() => ({
  contain: "layout style paint",
  willChange: authTimeline.value ? "transform" : "auto",
  isolation: "isolate",
  transform: "translateZ(0)",
}));

const signInStyles = computed(() => ({
  contain: "layout style",
  willChange: authTimeline.value ? "width, opacity" : "auto",
  transition: "none",
}));

const signUpStyles = computed(() => ({
  contain: "layout style",
  willChange: authTimeline.value ? "width, opacity" : "auto",
  transition: "none",
}));

const textStyles = computed(() => ({
  willChange: authTimeline.value ? "opacity" : "auto",
  transition: "none",
}));

const socialContainerStyles = computed(() => ({
  contain: "layout style paint",
  willChange: animationTimeline ? "transform, opacity" : "auto",
  transform: "translateX(40px) scale(0.9) translateZ(0)",
}));

const separatorStyles = computed(() => ({
  willChange: animationTimeline ? "transform, opacity" : "auto",
  transform: "scaleY(0) translateZ(0)",
}));

const iconItemStyles = (index: number) =>
  computed(() => ({
    willChange: animationTimeline ? "transform, opacity" : "auto",
    transform: `translateY(30px) translateX(20px) scale(0.7) rotate(15deg) translateZ(0)`,
  }));

// ===== NAVIGATION ITEMS =====
const navItems = computed(() => [
  {
    id: "doc",
    label: "navigation.doc",
    path: "/doc",
  },
  {
    id: "admin",
    label: "navigation.admin",
    path: "/dashboard/sass/admin",
  },
  {
    id: "cse",
    label: "navigation.cse",
    path: "/dashboard/cse/member",
  },
]);

// Liens sociaux du comité d'entreprise
const companySocialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/hugo-abric/",
    icon: IconLinkedin,
    label: "LinkedIn Entreprise",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/votre-entreprise",
    icon: IconTwitter,
    label: "Twitter Entreprise",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/votre-entreprise",
    icon: IconInstagram,
    label: "Instagram Entreprise",
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@votre-entreprise",
    icon: IconYoutube,
    label: "YouTube Entreprise",
  },
];

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  if (route.path !== "/") {
    router.push("/");
  }
}

// ===== OPTIMISATION: INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
  if (!shouldAnimate.value || !socialLinksContainer.value) return;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && animationTimeline) {
          // Pause les animations si pas visible pour économiser les ressources
          animationTimeline.pause();
        } else if (entry.isIntersecting && animationTimeline) {
          // Reprendre si visible
          animationTimeline.resume();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  intersectionObserver.observe(socialLinksContainer.value);
}

// ===== INITIALISATION OPTIMISÉE DU BOUTON AUTH =====
function initializeAuthButton() {
  if (
    !signInRef.value ||
    !signUpRef.value ||
    !signInTextRef.value ||
    !signUpTextRef.value
  ) {
    return;
  }

  // ✅ OPTIMISÉ: Batch DOM operations with RAF
  requestAnimationFrame(() => {
    // Clean up first
    const authElements = [
      signInRef.value,
      signUpRef.value,
      signInTextRef.value,
      signUpTextRef.value,
    ];

    authElements.forEach((el) => el && gsap.killTweensOf(el));

    // Initialize elements
    if (
      signInRef.value &&
      signUpRef.value &&
      signInTextRef.value &&
      signUpTextRef.value
    ) {
      gsap.set(
        [
          signInRef.value,
          signUpRef.value,
          signInTextRef.value,
          signUpTextRef.value,
        ],
        {
          clearProps: "all",
        }
      );

      gsap.set(signInRef.value, { width: "75%", ease: "none" });
      gsap.set(signUpRef.value, { width: "25%", ease: "none" });
      gsap.set(signInTextRef.value, { opacity: 1, ease: "none" });
      gsap.set(signUpTextRef.value, { opacity: 0, ease: "none" });
    }
  });
}

// ===== ANIMATIONS GSAP OPTIMISÉES POUR LE BOUTON AUTH =====
function animateToSignIn() {
  if (
    !signInRef.value ||
    !signUpRef.value ||
    !signInTextRef.value ||
    !signUpTextRef.value
  ) {
    return;
  }

  if (authTimeline.value) {
    authTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Utiliser will-change seulement pendant l'animation
  const authElements = [
    signInRef.value,
    signUpRef.value,
    signInTextRef.value,
    signUpTextRef.value,
  ];
  gsap.set(authElements, { willChange: "width, opacity" });

  authTimeline.value = gsap.timeline({
    defaults: {
      ease: "power3.out",
      force3D: true,
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation
      gsap.set(authElements, { willChange: "auto" });
    },
  });

  // Animation de slide : SignIn prend 75%, SignUp reste à 25%
  authTimeline.value
    .to(signInRef.value, {
      width: "75%",
      duration: 0.6,
      ease: "power3.out",
    })
    .to(
      signUpRef.value,
      {
        width: "25%",
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.6"
    )
    .to(
      signInTextRef.value,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .to(
      signUpTextRef.value,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.6"
    );
}

function animateToSignUp() {
  if (
    !signInRef.value ||
    !signUpRef.value ||
    !signInTextRef.value ||
    !signUpTextRef.value
  ) {
    return;
  }

  if (authTimeline.value) {
    authTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Utiliser will-change seulement pendant l'animation
  const authElements = [
    signInRef.value,
    signUpRef.value,
    signInTextRef.value,
    signUpTextRef.value,
  ];
  gsap.set(authElements, { willChange: "width, opacity" });

  authTimeline.value = gsap.timeline({
    defaults: {
      ease: "power3.out",
      force3D: true,
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation
      gsap.set(authElements, { willChange: "auto" });
    },
  });

  // Animation de slide : SignUp prend 75%, SignIn devient juste icône (25%)
  authTimeline.value
    .to(signUpRef.value, {
      width: "75%",
      duration: 0.6,
      ease: "power3.out",
    })
    .to(
      signInRef.value,
      {
        width: "25%",
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.6"
    )
    .to(
      signUpTextRef.value,
      {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .to(
      signInTextRef.value,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.6"
    );
}

function resetAuthButton() {
  if (
    !shouldAnimate.value ||
    !signInRef.value ||
    !signUpRef.value ||
    !signInTextRef.value ||
    !signUpTextRef.value
  ) {
    return;
  }

  if (authTimeline.value) {
    authTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Utiliser will-change seulement pendant l'animation
  const authElements = [
    signInRef.value,
    signUpRef.value,
    signInTextRef.value,
    signUpTextRef.value,
  ];
  gsap.set(authElements, { willChange: "width, opacity" });

  authTimeline.value = gsap.timeline({
    defaults: {
      ease: "power3.out",
      force3D: true,
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation
      gsap.set(authElements, { willChange: "auto" });
    },
  });

  // Retour à l'état par défaut : "Se connecter" visible + icône signup
  authTimeline.value
    .to(signInRef.value, {
      width: "75%",
      duration: 0.5,
      ease: "power3.out",
    })
    .to(
      signUpRef.value,
      {
        width: "25%",
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .to(
      signInTextRef.value,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.2"
    )
    .to(
      signUpTextRef.value,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.5"
    );
}

// ===== GESTION DE L'AUTHENTIFICATION =====
function handleAuthClick(type = "signin") {
  if (type === "signin") {
    router.push("/auth?type=signin");
  } else {
    router.push("/auth?type=signup");
  }
}

// ===== GESTION DU SCROLL OPTIMISÉE =====
function handleScroll() {
  isScrolled.value = window.scrollY > 100;
}

// ✅ OPTIMISÉ: Débouncer les animations scroll
const debouncedAnimateSocialLinks = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    if (isScrolled.value && shouldAnimate.value) {
      // ✅ OPTIMISÉ: Utiliser RAF pour décaler l'animation
      requestAnimationFrame(() => {
        animateSocialLinksIn();
      });
    }
  }, 16); // ~1 frame à 60fps
};

// ===== GESTION RESPONSIVE OPTIMISÉE =====
function handleResize() {
  const width = window.innerWidth;

  // Breakpoints de Tailwind: sm: 640px, md: 768px, lg: 1024px
  isMobile.value = width < 768;
  isTablet.value = width >= 768 && width < 1024;

  // Si on passe en mobile/tablet et qu'une animation est en cours, la nettoyer
  if ((isMobile.value || isTablet.value) && animationTimeline) {
    animationTimeline.kill();
    animationTimeline = null;

    // ✅ OPTIMISÉ: Remettre les éléments dans leur état initial avec RAF
    requestAnimationFrame(() => {
      if (mainControlsContainer.value) {
        gsap.set(mainControlsContainer.value, { x: 0, willChange: "auto" });
      }
      if (socialLinksContainer.value) {
        gsap.set(socialLinksContainer.value, {
          opacity: 0,
          x: 40,
          scale: 0.9,
          willChange: "auto",
        });
      }
    });
  }
}

// ===== GESTION DES REFS POUR GSAP =====
function setSocialIconRef(el, index) {
  if (el) {
    socialIconRefs.value[index] = el;
  }
}

// ===== ANIMATIONS GSAP SPECTACULAIRES OPTIMISÉES =====
function animateSocialLinksIn() {
  // Vérifier si on est sur desktop (lg et plus) et si animation autorisée
  if (
    !shouldAnimate.value ||
    !socialLinksContainer.value ||
    !mainControlsContainer.value
  ) {
    return;
  }

  // Tuer toute animation existante
  if (animationTimeline) {
    animationTimeline.kill();
  }

  // ✅ OPTIMISÉ: Préparer will-change pour tous les éléments
  const allElements = [
    mainControlsContainer.value,
    socialLinksContainer.value,
    socialSeparator.value,
    ...socialIconRefs.value.filter(Boolean),
  ];

  gsap.set(allElements, { willChange: "transform, opacity" });

  // ✅ OPTIMISÉ: Timeline avec configuration optimisée
  animationTimeline = gsap.timeline({
    defaults: {
      ease: "power3.out",
      force3D: true,
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation principale
      gsap.set(allElements, { willChange: "auto" });

      // Animation de respiration continue et subtile
      if (shouldAnimate.value) {
        gsap.to(socialIconRefs.value.filter(Boolean), {
          scale: 1.02,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
          willChange: "transform",
        });
      }
    },
  });

  // Étape 0: Décaler les contrôles principaux vers la gauche pour faire de la place
  animationTimeline.to(mainControlsContainer.value, {
    x: -80,
    duration: 0.4,
    ease: "power3.out",
  });

  // Étape 1: Animation d'entrée du conteneur avec effet de rebond
  animationTimeline.to(
    socialLinksContainer.value,
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.4)",
    },
    "-=0.2"
  );

  // Étape 2: Animation du séparateur avec effet élastique
  animationTimeline.to(
    socialSeparator.value,
    {
      opacity: 1,
      scaleY: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.6)",
      transformOrigin: "center",
    },
    "-=0.3"
  );

  // ✅ OPTIMISÉ: Animation groupée avec stagger au lieu de forEach
  const validIconRefs = socialIconRefs.value.filter(Boolean);
  if (validIconRefs.length > 0) {
    animationTimeline.to(
      validIconRefs,
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "elastic.out(1.2, 0.5)",
        transformOrigin: "center center",
        stagger: 0.08,
      },
      "-=0.5"
    );

    // Effet de brillance finale groupé
    animationTimeline
      .to(
        validIconRefs,
        {
          scale: 1.1,
          duration: 0.15,
          ease: "power2.out",
          stagger: 0.04,
        },
        "-=0.2"
      )
      .to(validIconRefs, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        stagger: 0.04,
      });
  }
}

function animateSocialLinksOut() {
  // Vérifier si les éléments existent
  if (!socialLinksContainer.value || !mainControlsContainer.value) {
    return;
  }

  // Tuer l'animation précédente
  if (animationTimeline) {
    animationTimeline.kill();
  }

  // ✅ OPTIMISÉ: Arrêter les animations de respiration
  const validIconRefs = socialIconRefs.value.filter(Boolean);
  gsap.killTweensOf(validIconRefs);

  // ✅ OPTIMISÉ: Préparer will-change
  const allElements = [
    mainControlsContainer.value,
    socialLinksContainer.value,
    socialSeparator.value,
    ...validIconRefs,
  ];

  gsap.set(allElements, { willChange: "transform, opacity" });

  // ✅ OPTIMISÉ: Timeline pour la sortie avec effets dramatiques
  animationTimeline = gsap.timeline({
    defaults: {
      ease: "power3.in",
      force3D: true,
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation
      gsap.set(allElements, { willChange: "auto" });
    },
  });

  // ✅ OPTIMISÉ: Animation de sortie groupée au lieu de forEach
  if (validIconRefs.length > 0) {
    animationTimeline.to(validIconRefs.slice().reverse(), {
      opacity: 0,
      y: -30,
      x: 25,
      scale: 0.6,
      rotation: -25,
      duration: 0.45,
      ease: "back.in(1.7)",
      stagger: 0.06,
    });
  }

  // Animation du séparateur
  animationTimeline.to(
    socialSeparator.value,
    {
      opacity: 0,
      scaleY: 0,
      duration: 0.3,
      ease: "power3.in",
    },
    "-=0.2"
  );

  // Animation finale du conteneur
  animationTimeline.to(
    socialLinksContainer.value,
    {
      opacity: 0,
      x: 50,
      scale: 0.8,
      duration: 0.4,
      ease: "power3.in",
    },
    "-=0.25"
  );

  // Remettre les contrôles principaux à leur position initiale
  animationTimeline.to(
    mainControlsContainer.value,
    {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    },
    "-=0.3"
  );
}

// ===== GESTION DES ÉVÉNEMENTS =====
function handleClickOutside(event: MouseEvent) {
  if (showMobileMenu.value) {
    const header = document.querySelector("header");
    if (header && !header.contains(event.target as Node)) {
      showMobileMenu.value = false;
    }
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" && showMobileMenu.value) {
    showMobileMenu.value = false;
  }
}

// ===== CYCLE DE VIE OPTIMISÉ =====
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeyDown);
  window.addEventListener("scroll", handleScroll, { passive: true }); // ✅ OPTIMISÉ: passive listener
  window.addEventListener("resize", handleResize, { passive: true }); // ✅ OPTIMISÉ: passive listener

  // Détecter les changements de préférence de mouvement
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
    prefersReducedMotion.value = e.matches;
  };
  mediaQuery.addEventListener("change", handleMotionPreferenceChange);

  // Initialiser la détection responsive
  handleResize();

  // ✅ OPTIMISÉ: Configuration GSAP optimale pour performance
  gsap.config(gsapConfig);

  // ✅ OPTIMISÉ: Configuration adaptée mobile/desktop
  if (
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    gsap.config({
      force3D: false,
      autoSleep: 30,
    });
  }

  if (import.meta.env.DEV) {
    console.log("🧭 Header mounted with GSAP optimizations");
    console.log("📦 GSAP version:", gsap.version);
    console.log("🎯 Should animate:", shouldAnimate.value);
  }

  // ✅ OPTIMISÉ: Initialiser avec une approche plus robuste et décalée
  nextTick(() => {
    initializeAuthButton();

    // ✅ OPTIMISÉ: Setup intersection observer après un délai
    setTimeout(() => {
      setupIntersectionObserver();
    }, 500);
  });

  // Cleanup function for media query
  onUnmounted(() => {
    mediaQuery.removeEventListener("change", handleMotionPreferenceChange);
  });
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);

  // ✅ OPTIMISÉ: Nettoyer les timeouts
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // ✅ OPTIMISÉ: Disconnect intersection observer
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  // ✅ OPTIMISÉ: Nettoyer complètement toutes les animations GSAP
  if (animationTimeline) {
    animationTimeline.kill();
    animationTimeline = null;
  }

  // Nettoyer les animations du bouton auth
  if (authTimeline.value) {
    authTimeline.value.kill();
    authTimeline.value = null;
  }

  // ✅ OPTIMISÉ: Kill tous les tweens en une fois avec batch
  const allAnimatedElements = [
    authButtonRef.value,
    signInRef.value,
    signUpRef.value,
    signInTextRef.value,
    signUpTextRef.value,
    socialLinksContainer.value,
    socialSeparator.value,
    mainControlsContainer.value,
    ...socialIconRefs.value,
  ].filter(Boolean);

  if (allAnimatedElements.length > 0) {
    gsap.killTweensOf(allAnimatedElements);
    // ✅ OPTIMISÉ: Reset will-change en batch
    gsap.set(allAnimatedElements, { willChange: "auto" });
  }

  // Vider le tableau des refs
  socialIconRefs.value = [];

  if (import.meta.env.DEV) {
    console.log("🧹 Header unmounted and cleaned up");
  }
});

// ===== WATCHERS OPTIMISÉS =====
watch(
  isScrolled,
  async (newValue) => {
    // ✅ OPTIMISÉ: Ne déclencher les animations que si autorisées
    if (!shouldAnimate.value) {
      return;
    }

    await nextTick(); // Attendre que les refs soient disponibles

    if (newValue) {
      // ✅ OPTIMISÉ: Utiliser la version debouncée
      debouncedAnimateSocialLinks();
    } else {
      // ✅ OPTIMISÉ: Utiliser RAF pour les animations de sortie aussi
      requestAnimationFrame(() => {
        animateSocialLinksOut();
      });
    }
  },
  { immediate: false }
);

// ✅ OPTIMISÉ: Watcher pour la responsivité
watch(
  [isMobile, isTablet],
  ([newMobile, newTablet]) => {
    // Si on passe en mobile/tablet, tuer les animations
    if ((newMobile || newTablet) && animationTimeline) {
      animationTimeline.kill();
      animationTimeline = null;

      // ✅ OPTIMISÉ: Remettre en état initial avec RAF
      requestAnimationFrame(() => {
        if (mainControlsContainer.value) {
          gsap.set(mainControlsContainer.value, { x: 0, willChange: "auto" });
        }
        if (socialLinksContainer.value) {
          gsap.set(socialLinksContainer.value, {
            opacity: 0,
            x: 40,
            scale: 0.9,
            willChange: "auto",
          });
        }
      });
    }
  },
  { immediate: true }
);

// ✅ OPTIMISÉ: Watcher pour shouldAnimate
watch(
  shouldAnimate,
  (newValue) => {
    if (!newValue) {
      // Nettoyer toutes les animations si elles sont désactivées
      if (animationTimeline) {
        animationTimeline.kill();
        animationTimeline = null;
      }
      if (authTimeline.value) {
        authTimeline.value.kill();
        authTimeline.value = null;
      }

      // Remettre en état initial
      requestAnimationFrame(() => {
        const allElements = [
          mainControlsContainer.value,
          socialLinksContainer.value,
          authButtonRef.value,
          signInRef.value,
          signUpRef.value,
          signInTextRef.value,
          signUpTextRef.value,
          ...socialIconRefs.value,
        ].filter(Boolean);

        gsap.set(allElements, {
          clearProps: "all",
          willChange: "auto",
        });
      });
    } else {
      // Réinitialiser si les animations sont réactivées
      nextTick(() => {
        initializeAuthButton();
        setupIntersectionObserver();
      });
    }
  },
  { immediate: false }
);
</script>

<style scoped>
/* ===== OPTIMISATIONS CSS POUR PERFORMANCE ===== */

/* Base styles with optimizations */
header {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  /* ✅ OPTIMISÉ: Isolation pour éviter les repaints globaux */
  isolation: isolate;
}
/* Optimisations pour le logo */
.logo-container {
  contain: layout style;
  will-change: transform;
}

/* Animation de l'icône au hover */
svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
}

.group:hover svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Badge CSE */
.badge-cse {
  transform: translateZ(0);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .logo-text-container {
    display: none;
  }

  svg {
    height: 2rem;
    width: 2rem;
  }
}

/* Dark mode optimizations */
.dark svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.dark .group:hover svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
/* ✅ OPTIMISÉ: Containment et will-change pour GSAP */
.main-controls-container {
  contain: layout style;
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}

.social-links-container {
  contain: layout style paint;
  will-change: transform, opacity;
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0); /* Force GPU layer */
}

.social-separator {
  contain: layout style;
  will-change: transform, opacity;
  transform: translateZ(0);
}

.social-icon-item {
  contain: layout style;
  will-change: transform, opacity, scale;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Navigation buttons */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

/* ✅ OPTIMISÉ: Auth container styles avec containment */
.auth-container {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  contain: layout style paint;
  isolation: isolate;
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}

.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.auth-container:hover::before {
  opacity: 1;
}

/* ✅ OPTIMISÉ: Styles des boutons auth - optimisé pour width animations */
.signin-btn,
.signup-btn {
  /* Supprimer TOUTES les transitions pour laisser GSAP gérer */
  transition: none !important;
  contain: layout style;
  will-change: width, opacity;
  backface-visibility: hidden;
  /* Position initiale par défaut */
  width: 50%; /* sera overridé par GSAP */
}

.signin-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.signup-btn:hover {
  background: rgba(16, 185, 129, 0.1);
}

.signin-text,
.signup-text {
  white-space: nowrap;
  overflow: hidden;
  /* ✅ OPTIMISÉ: Supprimer les transitions CSS pour laisser GSAP gérer */
  transition: none !important;
  will-change: opacity;
  contain: layout style;
}

/* États de focus optimisés */
.signin-btn:focus-visible,
.signup-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

/* Effet de brillance pour le slide optimisé */
.auth-container .signin-btn::after,
.auth-container .signup-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
  pointer-events: none;
  will-change: transform;
}

.auth-container .signin-btn:hover::after {
  left: 100%;
}

.auth-container .signup-btn:hover::after {
  left: 100%;
}

/* Effet de brillance optimisé */
.auth-container::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: rotate(45deg) translate(-100%, -100%);
  transition: transform 0.6s ease;
  pointer-events: none;
  will-change: transform;
}

.auth-container:hover::after {
  transform: rotate(45deg) translate(100%, 100%);
}

/* Auth button specific styles */
button:focus-visible {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

button:active {
  transform: translateY(0);
}

/* Mobile menu animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease;
}

/* Language selector */
:deep(.country-flag) {
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.country-flag:hover) {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Theme transition */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

.dark::view-transition-old(root) {
  z-index: 9999;
}

.dark::view-transition-new(root) {
  z-index: 1;
}

/* Scrollbar styles */
@media (hover: hover) {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .dark ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .dark ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

/* ✅ OPTIMISÉ: Responsive optimizations avec containment */
@media (max-width: 1023px) {
  .social-links-container {
    display: none !important;
  }

  .main-controls-container {
    contain: none; /* Pas besoin de containment sur mobile */
  }
}

/* ✅ OPTIMISÉ: Reduced motion preference avec cleanup */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .auth-container,
  .signin-btn,
  .signup-btn,
  .signin-text,
  .signup-text,
  .social-links-container,
  .social-icon-item,
  .main-controls-container {
    transition: none !important;
    will-change: auto !important;
    contain: none !important;
  }

  .auth-container::after {
    display: none;
  }
}

/* ✅ OPTIMISÉ: États dark/light avec will-change optimal */
.dark .auth-container {
  border-color: rgba(255, 255, 255, 0.05);
}

.dark .auth-container::before {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
}

/* Focus styles optimisés */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* ✅ OPTIMISÉ: Print styles */
@media print {
  header {
    display: none;
  }

  .auth-container,
  .social-links-container {
    display: none;
  }
}

/* ✅ OPTIMISÉ: Prefetch optimizations pour les animations */
@media (prefers-reduced-motion: no-preference) {
  .auth-container {
    will-change: transform;
  }

  .social-links-container {
    will-change: transform, opacity;
  }

  .main-controls-container {
    will-change: transform;
  }
}

/* ✅ OPTIMISÉ: High DPI optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .auth-container,
  .social-icon-item {
    /* Utiliser des transformations plus légères sur les écrans haute densité */
    transform: translateZ(0) scale(1);
  }
}
</style>
