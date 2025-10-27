<template>
  <div
    class="hero-carousel"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    ref="heroCarousel"
  >
    <!-- Slides Container -->
    <div class="slides-container" ref="slidesContainer">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="hero-slide"
        :class="{ active: index === currentSlide }"
        ref="slideRefs"
        :style="getSlideStyles(index)"
      >
        <div class="hero-content" :ref="(el) => setContentRef(el, index)">
          <h1 class="hero-title">
            {{ slide.title }}
            <span class="hero-highlight">{{ slide.highlight }}</span>
          </h1>
          <p class="hero-description">
            {{ slide.description }}
          </p>
          <div class="hero-actions">
            <button
              class="hero-btn primary"
              @click="slide.primaryAction.handler"
            >
              {{ slide.primaryAction.text }}
            </button>
            <button
              class="hero-btn secondary"
              @click="slide.secondaryAction.handler"
            >
              {{ slide.secondaryAction.text }}
            </button>
          </div>
        </div>

        <!-- Effet décoratif spécifique à chaque slide -->
        <div class="hero-decoration">
          <div
            class="decoration-circle"
            :style="{ background: slide.decorationColor }"
          ></div>
          <div class="decoration-dots"></div>
        </div>
      </div>
    </div>

    <!-- Navigation Dots -->
    <div class="carousel-dots">
      <button
        v-for="(slide, index) in slides"
        :key="`dot-${index}`"
        class="dot"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
        :aria-label="`Aller à la slide ${index + 1}`"
      >
        <span class="dot-inner"></span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" ref="progressBar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";

const router = useRouter();

// ===== REFS OPTIMISÉES =====
const heroCarousel = ref(null);
const slidesContainer = ref(null);
const slideRefs = ref([]);
const contentRefs = ref([]);
const progressBar = ref(null);
const currentSlide = ref(0);
const autoplayInterval = ref(null);
const progressTimeline = ref(null);
const isAutoplayPaused = ref(false);
const isVisible = ref(true);
const isAnimating = ref(false);

// ===== CONFIGURATION OPTIMISÉE =====
const AUTOPLAY_DURATION = 15000; // 15 secondes
const TRANSITION_DURATION = 1; // 1 seconde
const STORAGE_KEY = "hero_current_slide";

// Configuration GSAP optimisée
const gsapConfig = {
  force3D: true,
  autoSleep: 60,
  nullTargetWarn: false,
};

// ===== INTERSECTION OBSERVER POUR PERFORMANCE =====
let intersectionObserver: IntersectionObserver | null = null;

// ===== COMPUTED STYLES OPTIMISÉS =====
const getSlideStyles = (index: number) =>
  computed(() => ({
    contain: "layout style paint",
    willChange: isAnimating.value ? "transform, opacity" : "auto",
    transform: "translateZ(0)", // Force GPU layer
  }));

// ===== GESTION DES REFS OPTIMISÉE =====
const setContentRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    contentRefs.value[index] = el;
  }
};

// Données des slides (inchangées)
const slides = ref([
  {
    title: "Bienvenue sur votre",
    highlight: "Comité d'Entreprise",
    description:
      "Découvrez tous nos services, événements et avantages exclusifs",
    decorationColor:
      "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)",
    primaryAction: {
      text: "Découvrir nos services",
      handler: () => exploreServices(),
    },
    secondaryAction: {
      text: "Voir les événements",
      handler: () => viewEvents(),
    },
  },
  {
    title: "Événements à venir",
    highlight: "Ne ratez rien !",
    description:
      "Barbecue d'été, sorties culturelles, séminaires... Votre agenda CE vous attend",
    decorationColor:
      "radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%)",
    primaryAction: {
      text: "Voir le calendrier",
      handler: () => viewCalendar(),
    },
    secondaryAction: {
      text: "S'inscrire aux événements",
      handler: () => registerEvents(),
    },
  },
  {
    title: "Avantages exclusifs",
    highlight: "Pour vous !",
    description:
      "Réductions partenaires, chèques vacances, billetterie... Profitez de tous vos avantages",
    decorationColor:
      "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
    primaryAction: {
      text: "Découvrir les avantages",
      handler: () => viewBenefits(),
    },
    secondaryAction: {
      text: "Mes réductions",
      handler: () => myDiscounts(),
    },
  },
  {
    title: "Espace membre",
    highlight: "Mon compte CE",
    description:
      "Gérez vos inscriptions, consultez vos avantages et restez informé de toutes les nouveautés",
    decorationColor:
      "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
    primaryAction: {
      text: "Accéder à mon espace",
      handler: () => accessMemberArea(),
    },
    secondaryAction: {
      text: "Mettre à jour mon profil",
      handler: () => updateProfile(),
    },
  },
]);

// ===== MÉTHODES D'ACTION (INCHANGÉES) =====
const exploreServices = () => {
  console.log("Explorer les services");
  const servicesSection = document.getElementById("services");
  if (servicesSection) {
    servicesSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const viewEvents = () => {
  console.log("Voir les événements");
  const eventsSection = document.getElementById("events");
  if (eventsSection) {
    eventsSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const viewCalendar = () => {
  console.log("Voir le calendrier");
  const eventsSection = document.getElementById("events");
  if (eventsSection) {
    eventsSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const registerEvents = () => {
  console.log("S'inscrire aux événements");
  const eventsSection = document.getElementById("events");
  if (eventsSection) {
    eventsSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const viewBenefits = () => {
  console.log("Voir les avantages");
  const offersSection = document.getElementById("offers");
  if (offersSection) {
    offersSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const myDiscounts = () => {
  console.log("Mes réductions");
  const offersSection = document.getElementById("offers");
  if (offersSection) {
    offersSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const accessMemberArea = () => {
  console.log("Accéder à mon espace");
  router.push("/auth?type=signin");
};

const updateProfile = () => {
  console.log("Mettre à jour mon profil");
  // router.push("/profile");
};

// ===== MÉTHODES DU CARROUSEL OPTIMISÉES =====

// ✅ OPTIMISÉ: Débouncing pour éviter les clics multiples
let slideTransitionTimeout: number | null = null;

const goToSlide = (index: number) => {
  if (index === currentSlide.value || isAnimating.value) return;

  // ✅ OPTIMISÉ: Débouncing
  if (slideTransitionTimeout) {
    clearTimeout(slideTransitionTimeout);
  }

  slideTransitionTimeout = setTimeout(() => {
    const previousSlide = currentSlide.value;
    currentSlide.value = index;

    // ✅ OPTIMISÉ: Utiliser RAF pour décaler l'animation
    requestAnimationFrame(() => {
      animateSlideTransition(previousSlide, index);
      resetProgressBar();
    });
  }, 16); // ~1 frame
};

const nextSlide = () => {
  const nextIndex = (currentSlide.value + 1) % slides.value.length;
  goToSlide(nextIndex);
};

// ✅ OPTIMISÉ: Animation avec performance améliorée
const animateSlideTransition = (from: number, to: number) => {
  if (!slideRefs.value[from] || !slideRefs.value[to] || !isVisible.value)
    return;

  const fromSlide = slideRefs.value[from];
  const toSlide = slideRefs.value[to];
  const toContent = contentRefs.value[to];

  // ✅ OPTIMISÉ: Marquer comme en cours d'animation
  isAnimating.value = true;

  // ✅ OPTIMISÉ: Préparer will-change avant animation
  const animatedElements = [fromSlide, toSlide, toContent].filter(Boolean);
  gsap.set(animatedElements, { willChange: "transform, opacity" });

  // ✅ OPTIMISÉ: Timeline GSAP avec configuration optimisée
  const tl = gsap.timeline({
    defaults: {
      force3D: true,
      ease: "power2.inOut",
    },
    onComplete: () => {
      // ✅ OPTIMISÉ: Nettoyer will-change après animation
      gsap.set(animatedElements, { willChange: "auto" });
      isAnimating.value = false;

      // ✅ OPTIMISÉ: Nettoyage avec RAF
      requestAnimationFrame(() => {
        gsap.set(fromSlide, {
          x: "0%",
          zIndex: 1,
        });
      });
    },
  });

  // Sortie de l'ancienne slide (timing identique)
  tl.to(fromSlide, {
    x: to > from ? "-100%" : "100%",
    opacity: 0,
    duration: TRANSITION_DURATION,
  });

  // Préparation de la nouvelle slide (timing identique)
  tl.set(
    toSlide,
    {
      x: to > from ? "100%" : "-100%",
      opacity: 0,
      zIndex: 10,
    },
    0
  );

  // Entrée de la nouvelle slide (timing identique)
  tl.to(
    toSlide,
    {
      x: "0%",
      opacity: 1,
      duration: TRANSITION_DURATION,
    },
    0.2
  );

  // ✅ OPTIMISÉ: Animation du contenu avec cache de l'élément
  if (toContent) {
    tl.fromTo(
      toContent,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      0.6
    );
  }
};

// ✅ OPTIMISÉ: Autoplay avec gestion de visibilité
const startAutoplay = () => {
  if (autoplayInterval.value) clearInterval(autoplayInterval.value);

  autoplayInterval.value = setInterval(() => {
    if (!isAutoplayPaused.value && isVisible.value && !isAnimating.value) {
      nextSlide();
    }
  }, AUTOPLAY_DURATION);

  startProgressBar();
};

// ✅ OPTIMISÉ: Pause avec vérification d'état
const pauseAutoplay = () => {
  isAutoplayPaused.value = true;
  if (progressTimeline.value && !progressTimeline.value.paused()) {
    progressTimeline.value.pause();
  }
};

// ✅ OPTIMISÉ: Resume avec vérification d'état
const resumeAutoplay = () => {
  isAutoplayPaused.value = false;
  if (progressTimeline.value && progressTimeline.value.paused()) {
    progressTimeline.value.resume();
  }
};

// ✅ OPTIMISÉ: Progress bar avec will-change intelligent
const startProgressBar = () => {
  if (!progressBar.value || !isVisible.value) return;

  if (progressTimeline.value) {
    progressTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Préparer will-change
  gsap.set(progressBar.value, { willChange: "width" });

  progressTimeline.value = gsap.fromTo(
    progressBar.value,
    {
      width: "0%",
    },
    {
      width: "100%",
      duration: AUTOPLAY_DURATION / 1000,
      ease: "none",
      force3D: true,
      onComplete: () => {
        // ✅ OPTIMISÉ: Nettoyer will-change
        gsap.set(progressBar.value, { willChange: "auto" });

        if (!isAutoplayPaused.value && isVisible.value) {
          resetProgressBar();
        }
      },
    }
  );
};

// ✅ OPTIMISÉ: Reset progress bar avec RAF
const resetProgressBar = () => {
  if (!progressBar.value) return;

  if (progressTimeline.value) {
    progressTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Utiliser RAF pour les opérations DOM
  requestAnimationFrame(() => {
    gsap.set(progressBar.value, { width: "0%", willChange: "auto" });

    setTimeout(() => {
      if (!isAutoplayPaused.value && isVisible.value) {
        startProgressBar();
      }
    }, 100);
  });
};

// ===== INTERSECTION OBSERVER POUR OPTIMISATION =====
const setupIntersectionObserver = () => {
  if (!heroCarousel.value) return;

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible.value = entry.isIntersecting;

        if (!entry.isIntersecting) {
          // ✅ OPTIMISÉ: Pause tout quand pas visible
          pauseAutoplay();
          if (progressTimeline.value) {
            progressTimeline.value.pause();
          }
        } else {
          // ✅ OPTIMISÉ: Reprendre quand visible
          if (!isAutoplayPaused.value) {
            resumeAutoplay();
            if (progressTimeline.value && progressTimeline.value.paused()) {
              progressTimeline.value.resume();
            }
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "50px",
    }
  );

  intersectionObserver.observe(heroCarousel.value);
};

// ===== SAUVEGARDE/RESTAURATION (INCHANGÉES) =====
const saveCurrentSlide = () => {
  try {
    localStorage.setItem(STORAGE_KEY, currentSlide.value.toString());
  } catch (e) {
    console.warn("Could not save current slide to localStorage");
  }
};

const restoreCurrentSlide = () => {
  try {
    const savedSlide = localStorage.getItem(STORAGE_KEY);
    if (savedSlide !== null) {
      const slideIndex = parseInt(savedSlide, 10);
      if (
        !isNaN(slideIndex) &&
        slideIndex >= 0 &&
        slideIndex < slides.value.length
      ) {
        currentSlide.value = slideIndex;

        // ✅ OPTIMISÉ: Utiliser RAF pour les opérations DOM
        requestAnimationFrame(() => {
          slideRefs.value.forEach((slide, index) => {
            if (slide) {
              if (index !== slideIndex) {
                gsap.set(slide, {
                  x: index < slideIndex ? "-100%" : "100%",
                  opacity: 0,
                  force3D: true,
                });
              } else {
                gsap.set(slide, {
                  x: "0%",
                  opacity: 1,
                  force3D: true,
                });
              }
            }
          });
        });
      }
    }
  } catch (e) {
    console.warn("Could not restore current slide from localStorage");
  }
};

// ===== CYCLE DE VIE OPTIMISÉ =====
onMounted(() => {
  // ✅ OPTIMISÉ: Configuration GSAP optimale
  gsap.config(gsapConfig);

  nextTick(() => {
    // ✅ OPTIMISÉ: Setup intersection observer
    setupIntersectionObserver();

    // Restaurer la slide sauvegardée
    restoreCurrentSlide();

    // ✅ OPTIMISÉ: Initialisation des slides avec RAF
    requestAnimationFrame(() => {
      if (slideRefs.value.length > 0) {
        // On ne réinitialise pas si on a restauré une slide
        if (!localStorage.getItem(STORAGE_KEY)) {
          slideRefs.value.forEach((slide, index) => {
            if (slide && index !== 0) {
              gsap.set(slide, {
                x: "100%",
                opacity: 0,
                force3D: true,
              });
            }
          });
        }
      }

      // ✅ OPTIMISÉ: Démarrage de l'autoplay avec délai
      setTimeout(() => {
        if (isVisible.value) {
          startAutoplay();
        }
      }, 1000);
    });
  });
});

// ✅ OPTIMISÉ: Watcher avec debouncing
let saveTimeout: number | null = null;
watch(currentSlide, () => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveCurrentSlide();
  }, 100);
});

// ✅ OPTIMISÉ: Cleanup complet
onUnmounted(() => {
  // Nettoyer les timeouts
  if (slideTransitionTimeout) {
    clearTimeout(slideTransitionTimeout);
  }
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  // Nettoyer l'autoplay
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
  }

  // Nettoyer les timelines GSAP
  if (progressTimeline.value) {
    progressTimeline.value.kill();
  }

  // ✅ OPTIMISÉ: Kill tous les tweens des slides
  const allSlideElements = slideRefs.value.filter(Boolean);
  const allContentElements = contentRefs.value.filter(Boolean);
  const allElements = [
    ...allSlideElements,
    ...allContentElements,
    progressBar.value,
  ].filter(Boolean);

  if (allElements.length > 0) {
    gsap.killTweensOf(allElements);
    gsap.set(allElements, { willChange: "auto" });
  }

  // Nettoyer intersection observer
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  // Vider les refs
  slideRefs.value = [];
  contentRefs.value = [];
});
</script>

<style scoped>
/* ===== OPTIMISATIONS CSS POUR PERFORMANCE ===== */

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1.5rem;
  background: transparent;
  /* ✅ OPTIMISÉ: Containment pour isoler les animations */
  contain: layout style paint;
  /* ✅ OPTIMISÉ: Force GPU layer */
  transform: translateZ(0);
}

.slides-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  /* ✅ OPTIMISÉ: Containment pour les slides */
  contain: layout style;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  background: transparent;
  /* ✅ OPTIMISÉ: Containment et GPU */
  contain: layout style paint;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Première slide : dégradé bleu original */
.hero-slide:nth-child(1) {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
}
.hero-slide:nth-child(1) .hero-highlight {
  background: linear-gradient(45deg, #06b6d4 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  color: white;
}

/* Deuxième slide : dégradé violet-indigo */
.hero-slide:nth-child(2) {
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
}
.hero-slide:nth-child(2) .hero-highlight {
  background: linear-gradient(45deg, #06b6d4 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  color: white;
}

/* Troisième slide : dégradé vert-bleu */
.hero-slide:nth-child(3) {
  background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
}
.hero-slide:nth-child(3) .hero-highlight {
  background: linear-gradient(45deg, #10b981 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  color: white;
}

/* Quatrième slide : dégradé orange-rose */
.hero-slide:nth-child(4) {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
}
.hero-slide:nth-child(4) .hero-highlight {
  background: linear-gradient(45deg, #f59e0b 10%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  color: white;
}

.hero-slide.active {
  z-index: 5;
}

.hero-content {
  text-align: center;
  z-index: 10;
  max-width: 600px;
  position: relative;
  /* ✅ OPTIMISÉ: Containment pour le contenu */
  contain: layout style;
  will-change: transform, opacity;
  transform: translateZ(0);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 180px;
  /* ✅ OPTIMISÉ: GPU acceleration pour les boutons */
  transform: translateZ(0);
  will-change: transform;
}

.hero-btn.primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.hero-btn.primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.hero-btn.secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.hero-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  /* ✅ OPTIMISÉ: Isolation des décorations */
  contain: layout style;
}

.decoration-circle {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  /* ✅ OPTIMISÉ: GPU acceleration */
  will-change: transform;
  transform: translateZ(0);
}

.decoration-dots {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 100px;
  height: 100px;
  background-image: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 2px,
    transparent 2px
  );
  background-size: 20px 20px;
  opacity: 0.5;
  /* ✅ OPTIMISÉ: GPU acceleration */
  transform: translateZ(0);
}

/* Navigation Dots */
.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 20;
  /* ✅ OPTIMISÉ: Containment pour les dots */
  contain: layout style;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;
  overflow: hidden;
  /* ✅ OPTIMISÉ: GPU acceleration */
  transform: translateZ(0);
  will-change: transform;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.dot.active {
  background: white;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.dot-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.dot.active .dot-inner {
  background: rgba(0, 0, 0, 0.3);
}

/* Progress Bar */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 20;
  /* ✅ OPTIMISÉ: Containment pour la progress bar */
  contain: layout style;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  width: 0%;
  transition: width 0.3s ease;
  /* ✅ OPTIMISÉ: GPU acceleration */
  will-change: width;
  transform: translateZ(0);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateZ(0);
  }
  50% {
    transform: translateY(-20px) translateZ(0);
  }
}

/* === RESPONSIVE OPTIMISÉ POUR LE GRID === */

/* Large Desktop - Garde le design original */
@media (min-width: 1200px) {
  .hero-slide {
    padding: 2.5rem;
  }

  .hero-title {
    font-size: 2.75rem;
  }

  .hero-description {
    font-size: 1.2rem;
  }
}

/* Desktop/Tablet Portrait */
@media (max-width: 1024px) {
  .hero-slide {
    padding: 2rem 1.5rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-btn {
    min-width: 160px;
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
  }

  .decoration-circle {
    width: 150px;
    height: 150px;
  }
}

/* Tablet/Mobile Large */
@media (max-width: 768px) {
  .hero-slide {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }

  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .hero-btn {
    min-width: 200px;
    padding: 0.75rem 1.25rem;
    font-size: 0.85rem;
  }

  .carousel-dots {
    bottom: 1.5rem;
    gap: 0.5rem;
  }

  .dot {
    width: 10px;
    height: 10px;
  }

  .decoration-circle {
    width: 120px;
    height: 120px;
    top: -30px;
    right: -30px;
  }

  .decoration-dots {
    width: 80px;
    height: 80px;
    bottom: 15px;
    left: 15px;
  }
}

/* Mobile Standard */
@media (max-width: 480px) {
  .hero-slide {
    padding: 1rem 0.75rem;
  }

  .hero-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.1;
  }

  .hero-description {
    font-size: 0.8rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .hero-btn {
    min-width: 180px;
    padding: 0.7rem 1rem;
    font-size: 0.8rem;
  }

  .carousel-dots {
    bottom: 1rem;
    gap: 0.4rem;
  }

  .dot {
    width: 8px;
    height: 8px;
  }

  .decoration-circle {
    width: 100px;
    height: 100px;
    top: -25px;
    right: -25px;
  }

  .decoration-dots {
    width: 60px;
    height: 60px;
    bottom: 10px;
    left: 10px;
    background-size: 15px 15px;
  }
}

/* Mobile Petit */
@media (max-width: 360px) {
  .hero-slide {
    padding: 0.75rem 0.5rem;
  }

  .hero-title {
    font-size: 1.3rem;
  }

  .hero-description {
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .hero-btn {
    min-width: 160px;
    padding: 0.6rem 0.8rem;
    font-size: 0.75rem;
  }

  .carousel-dots {
    bottom: 0.75rem;
  }
}

/* Optimisations pour hauteur limitée (spécial grid) */
@media (max-height: 400px) {
  .hero-slide {
    padding: 0.75rem;
  }

  .hero-title {
    font-size: 1.4rem;
    margin-bottom: 0.4rem;
  }

  .hero-description {
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .hero-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    min-width: 140px;
  }

  .carousel-dots {
    bottom: 0.5rem;
  }

  .decoration-circle {
    display: none; /* Masquer sur très petite hauteur */
  }
}

/* ✅ OPTIMISÉ: Reduced motion avec désactivation des performances */
@media (prefers-reduced-motion: reduce) {
  .decoration-circle {
    animation: none;
    will-change: auto;
  }

  .hero-btn:hover {
    transform: none;
  }

  .dot:hover {
    transform: scale(1.1);
  }

  .hero-carousel,
  .hero-slide,
  .hero-content,
  .progress-fill {
    will-change: auto !important;
    contain: none !important;
  }
}

/* ✅ OPTIMISÉ: High DPI optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .hero-carousel,
  .hero-slide,
  .decoration-circle {
    transform: translateZ(0) scale(1);
  }
}
</style>
