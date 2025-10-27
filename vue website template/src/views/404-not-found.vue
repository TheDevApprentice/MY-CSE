<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- Animation flottante -->
      <div class="floating-elements">
        <div class="floating-circle" ref="circle1"></div>
        <div class="floating-circle" ref="circle2"></div>
      </div>

      <!-- SVG 404 stylisé en arrière-plan -->
      <div class="error-icon" ref="errorIcon">
        <svg viewBox="0 0 240 240" class="error-svg-icon">
          <circle cx="120" cy="120" r="100" class="error-icon-circle" />
          <path d="M70,70 L170,170 M70,170 L170,70" class="error-icon-cross" />
          <text x="120" y="130" class="error-icon-text">404</text>
        </svg>
      </div>

      <h1
        class="error-code"
        ref="errorCode"
        @mouseenter="triggerGlitch"
        @click="triggerGlitch"
      >
        404
      </h1>
      <h2 class="error-title" ref="errorTitle">Page non trouvée</h2>
      <p class="error-message" ref="errorMessage">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="button-group">
        <router-link to="/" class="home-link" ref="homeLink">
          Retour à l'accueil
        </router-link>
        <!-- <button 
          @click="goBack"
          class="back-link"
          ref="backLink"
        >
          Page précédente
        </button> -->
        <router-link @click="goBack" to="/" class="home-link" ref="backLink">
          Page précédente
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { useRouter } from "vue-router";

const router = useRouter();
const errorCode = ref(null);
const errorTitle = ref(null);
const errorMessage = ref(null);
const homeLink = ref(null);
const backLink = ref(null);
const circle1 = ref(null);
const circle2 = ref(null);
const errorIcon = ref(null);

const goBack = () => router.back();

const triggerGlitch = () => {
  gsap.to(".error-code", {
    duration: 2.5, // Ralenti
    x: () => Math.random() * 3 - 1.5, // Réduction du mouvement horizontal
    color: () => {
      // Couleurs plus douces et moins saturées
      const colors = ["#f472b6", "#60a5fa", "#34d399"];
      return colors[Math.floor(Math.random() * colors.length)];
    },
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut", // Transition plus douce
  });
};

onMounted(() => {
  // Démarrer l'effet glitch automatiquement
  triggerGlitch();

  // Animation des cercles flottants
  gsap.to(circle1.value, {
    duration: 15,
    x: 40,
    y: 60,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.to(circle2.value, {
    duration: 20,
    x: -30,
    y: -40,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Animation de l'icône 404
  gsap.from(errorIcon.value, {
    duration: 1.5,
    scale: 0,
    rotation: 360,
    ease: "elastic.out(1, 0.5)",
    delay: 0.3,
  });

  // Animation continue de l'icône
  gsap.to(errorIcon.value, {
    duration: 8,
    rotation: 5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  // Animation du texte
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(errorCode.value, {
    duration: 0.8,
    y: -80,
    opacity: 0,
    ease: "back.out(1.7)",
  });

  tl.from(
    errorTitle.value,
    {
      duration: 0.6,
      y: 40,
      opacity: 0,
      ease: "power2.out",
    },
    "-=0.4"
  );

  tl.from(
    errorMessage.value,
    {
      duration: 0.6,
      y: 40,
      opacity: 0,
      ease: "power2.out",
    },
    "-=0.3"
  );

  tl.from(
    homeLink.value,
    {
      duration: 0.5,
      scale: 0,
      opacity: 0,
      ease: "back.out(2)",
    },
    "-=0.2"
  );

  tl.from(
    backLink.value,
    {
      duration: 0.8,
      y: 20,
      opacity: 0,
      ease: "back.out(1.7)",
      delay: 0.4,
    },
    "-=0.2"
  );
});
</script>

<style scoped>
@import "tailwindcss";

.not-found-container {
  @apply min-h-screen flex items-center justify-center bg-gray-50;
}

.dark .not-found-container {
  @apply bg-gray-800;
}

.error-code {
  @apply text-9xl font-bold text-indigo-600;
  will-change: transform, color;
  animation: glitch-effect 0.5s infinite alternate;
}

@keyframes glitch-effect {
  0% {
    text-shadow: 2px 0 0 #f43f5e, -2px 0 0 #3b82f6;
  }
  100% {
    text-shadow: -2px 0 0 #f43f5e, 2px 0 0 #3b82f6;
  }
}

.dark .error-code {
  @apply text-indigo-400;
}

.error-title {
  @apply text-2xl font-semibold text-gray-800 mb-2;
}

.dark .error-title {
  @apply text-gray-100;
}

.error-message {
  @apply text-gray-600 mb-6;
}

.dark .error-message {
  @apply text-gray-200;
}

.button-group {
  @apply flex gap-4 justify-center mt-8 pr-40;
}

.home-link,
.back-link {
  @apply inline-block px-6 py-3 rounded-lg transition-all duration-300;
  transform: scale(1);
  will-change: transform;
  min-width: 180px;
  text-align: center;
}

.home-link {
  @apply bg-indigo-600 text-white hover:bg-indigo-700;
}

.dark .home-link {
  @apply bg-indigo-600 hover:bg-indigo-500;
}

.back-link {
  @apply px-6 py-3 bg-gray-200 text-gray-800 rounded-lg 
         hover:bg-gray-300 transition-all duration-300
         min-w-[180px] text-center;
}

.dark .back-link {
  @apply bg-gray-700 text-gray-100 hover:bg-gray-600;
}

.error-icon-circle {
  @apply fill-none stroke-[6px] stroke-indigo-400;
}

.dark .error-icon-circle {
  @apply stroke-indigo-600;
}

.error-icon-cross {
  @apply fill-none stroke-[6px] stroke-current text-indigo-600;
}

.dark .error-icon-cross {
  @apply text-indigo-400;
}

.error-icon-text {
  @apply fill-current text-indigo-600;
  @apply text-6xl font-bold;
  text-anchor: middle;
  dominant-baseline: middle;
}

.dark .error-icon-text {
  @apply text-indigo-400;
}

.floating-elements {
  @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.floating-circle {
  @apply absolute rounded-full opacity-20;
  filter: blur(40px);
}

.floating-circle:nth-child(1) {
  @apply w-64 h-64 bg-indigo-400;
  top: 20%;
  left: 10%;
}

.dark .floating-circle:nth-child(1) {
  @apply bg-indigo-600/30;
}

.floating-circle:nth-child(2) {
  @apply w-80 h-80 bg-purple-400;
  bottom: 15%;
  right: 10%;
}

.dark .floating-circle:nth-child(2) {
  @apply bg-purple-600/30;
}

.error-icon {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  @apply w-80 h-80 opacity-10 pointer-events-none;
  z-index: 0;
}

.dark .error-icon {
  @apply opacity-20;
}

.error-svg-icon {
  @apply w-full h-full;
}

/* Ajustements pour le z-index */
.not-found-content > *:not(.error-icon, .floating-elements) {
  position: relative;
  z-index: 1;
}

/* Ajouts pour les animations */
.error-code,
.error-title,
.error-message {
  will-change: transform, opacity;
}

.home-link,
.back-link {
  will-change: transform;
  transform-origin: center;
}
</style>
