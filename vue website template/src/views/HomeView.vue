<!-- HomeView.vue -->
<template>
  <div id="home" ref="homeContainer" class="home-container pt-5">
    <div class="bento-grid">
      <!-- Hero Principal -->
      <div id="hero" class="bento-item hero-main" data-area="hero">
        <Hero />
      </div>

      <!-- Services du CE -->
      <div id="services" class="bento-item services-box" data-area="services">
        <Service />
      </div>

      <!-- Actualités -->
      <div id="news" class="bento-item news-box" data-area="news">
        <News />
      </div>

      <!-- Événements à venir -->
      <div id="events" class="bento-item events-box" data-area="events">
        <Events />
      </div>

      <!-- Avantages / Offres -->
      <div id="offers" class="bento-item offers-box" data-area="offers">
        <Advantage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  nextTick,
} from "vue";
import { gsap } from "gsap";
import { useRoute } from "vue-router";
import { useTheme } from "@/composables/useTheme";

// Import des composants
import Hero from "@/components/home/Hero.vue";
import Service from "@/components/home/Services.vue";
import News from "@/components/home/News.vue";
import Events from "@/components/home/Events.vue";
import Advantage from "@/components/home/Advantage.vue";

const homeContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  console.log("🏠 HomePage montée avec layout Bento Box modularisé");

  // Animation d'entrée pour les boîtes
  if (homeContainer.value) {
    const bentoItems = homeContainer.value.querySelectorAll(".bento-item");

    gsap.set(bentoItems, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });

    gsap.to(bentoItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.2)",
    });
  }
});

onUnmounted(() => {
  // Nettoyer les animations GSAP
  if (homeContainer.value) {
    gsap.killTweensOf(homeContainer.value.querySelectorAll(".bento-item"));
  }
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding-bottom: 1rem;
  /* padding: 1rem 1rem; */
  /* padding-top: calc(5.5rem + 3rem);  */
  /* Header (64px) + HeroSection compact (~48px) + marge */
  /* background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); */
  transition: all 0.3s ease;
  padding-top: calc(5rem + 3.5rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .home-container {
    padding-top: calc(4.6rem + 3.5rem);
  }
}
.dark .home-container {
  /* background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); */
}

.bento-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(4, minmax(175px, auto));
  grid-template-areas:
    "hero hero hero hero hero hero hero hero hero hero hero hero "
    "hero hero hero hero hero hero hero hero hero hero hero hero "
    "hero hero hero hero hero hero hero hero hero hero hero hero "
    "news news news news news news services services services services services services"
    "news news news news news news services services services services services services"
    "offers offers offers offers offers offers events events events events events events";
}

/* === RESPONSIVE BREAKPOINTS === */

/* Tablet Layout */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(5, minmax(120px, auto));
    grid-template-areas:
      "hero hero hero hero hero hero hero hero"
      "hero hero hero hero hero hero hero hero"
      "hero hero hero hero hero hero hero hero"
      "news news news news news news services services services services services services"
      "news news news news news news services services services services services services"
      "offers offers offers offers offers offers events events events events events events";
  }
}

/* Mobile Layout */
@media (max-width: 768px) {
  .home-container {
    /* padding: 1rem 0.5rem; */
    /* padding-top: calc(6rem + 4rem);  */
    /* Ajustement spécifique mobile */
    padding-top: calc(1rem + 1rem);
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, minmax(100px, auto));
    gap: 1rem;
    grid-template-areas:
      "hero hero hero hero"
      "hero hero hero hero"
      "services services services services"
      "news news news news"
      "events events events events"
      "offers offers offers offers";
  }
}

/* === BENTO ITEMS === */

.bento-item {
  border-radius: 1.5rem;
  padding: 0; /* Suppression du padding car géré par les composants */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 2px solid;

  /* Pour afficher les composants */
  display: flex;
  align-items: stretch; /* Permet aux composants de prendre toute la hauteur */
  justify-content: stretch;
  min-height: 120px;
}

.bento-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.dark .bento-item:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* === ZONES SPÉCIFIQUES AVEC COULEURS === */

/* Hero Principal */
.hero-main {
  grid-area: hero;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  /* border-color: #2563eb; */
  border: none;
  color: white;
}

/* Services */
.services-box {
  grid-area: services;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-color: #7c3aed;
  color: white;
}

/* News */
.news-box {
  grid-area: news;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-color: #d97706;
  color: white;
}

/* Events */
.events-box {
  grid-area: events;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-color: #dc2626;
  color: white;
}

/* Offers */
.offers-box {
  grid-area: offers;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-color: #0891b2;
  color: white;
}

/* === ANIMATIONS ET EFFETS === */

.bento-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  pointer-events: none;
}

.bento-item:hover::before {
  transform: translateX(100%);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .bento-item {
    min-height: 80px;
  }
}
</style>
