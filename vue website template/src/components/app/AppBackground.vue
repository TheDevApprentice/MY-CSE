<template>
  <div
    class="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden transition-all duration-300"
    :class="[
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    ]"
  >
    <!-- Background Effects -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <!-- Animated orbs -->
      <div
        ref="orb1"
        class="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        :class="isDark ? 'bg-blue-500' : 'bg-blue-400'"
        style="top: -10%; left: -10%"
      ></div>
      <div
        ref="orb2"
        class="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        :class="isDark ? 'bg-emerald-500' : 'bg-emerald-400'"
        style="bottom: -10%; right: -10%"
      ></div>
      <div
        ref="orb3"
        class="absolute w-64 h-64 rounded-full opacity-15 blur-2xl"
        :class="isDark ? 'bg-purple-500' : 'bg-purple-400'"
        style="top: 30%; right: 20%"
      ></div>
    </div>
    <!-- Container pour les particules bleues animées -->
    <div
      ref="particlesContainerAnimatedBlue"
      class="absolute inset-0 pointer-events-none z-0"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  watch,
  nextTick,
} from "vue";
import { gsap } from "gsap";
import { useTheme } from "@composables/useTheme";
const { isDark } = useTheme();

const particlesContainerAnimatedBlue = ref<HTMLElement | null>(null);

// Nombre de particules pour l'animation de fond
const PARTICLE_COUNT_BLUE = 30;

let blueParticles: HTMLElement[] = [];
let blueParticleAnimations: any[] = [];

// Fonction pour créer les particules bleues
const createBlueParticles = () => {
  if (!particlesContainerAnimatedBlue.value) return;

  // Nettoyer les particules bleues existantes
  blueParticleAnimations.forEach((animation) => animation.kill());
  blueParticleAnimations = [];
  particlesContainerAnimatedBlue.value.innerHTML = "";
  blueParticles = [];

  for (let i = 0; i < PARTICLE_COUNT_BLUE; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particlesAnimatedBlue");

    // Propriétés de la particule bleue
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const animationDelay = Math.random() * 0.1;
    const animationDuration = 12 + Math.random() * 6;

    // Appliquer les styles
    particle.style.position = "absolute";
    particle.style.width = "4px";
    particle.style.height = "4px";
    particle.style.background = "rgba(34, 211, 238, 0.6)";
    particle.style.borderRadius = "50%";
    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.filter = "blur(1px)";
    particle.style.boxShadow = "0 0 10px rgba(34, 211, 238, 0.3)";
    particle.style.willChange = "transform, opacity";
    particle.style.backfaceVisibility = "hidden";
    particle.style.transform = "translateZ(0)";
    particle.style.pointerEvents = "none";

    // Ajouter la particule au DOM
    particlesContainerAnimatedBlue.value.appendChild(particle);

    // Animation GSAP plus douce et constante pour les particules bleues
    const moveDistance = 100 + Math.random() * 100; // Distance variable entre 100 et 200px
    const angle = Math.random() * Math.PI * 2; // Angle aléatoire
    const moveX = Math.cos(angle) * moveDistance;
    const moveY = Math.sin(angle) * moveDistance;

    const animation = gsap
      .timeline({ repeat: -1, delay: animationDelay })
      .fromTo(
        particle,
        {
          opacity: 0,
          scale: 0.5,
          x: 0,
          y: 0,
        },
        {
          opacity: 0.8,
          scale: 1,
          duration: animationDuration * 0.1,
          ease: "power2.out",
        }
      )
      .to(particle, {
        x: moveX,
        y: moveY,
        scale: 1.2,
        opacity: 0.9,
        duration: animationDuration * 0.7,
        ease: "sine.inOut",
      })
      .to(particle, {
        opacity: 0,
        scale: 0.8,
        duration: animationDuration * 0.2,
        ease: "power2.in",
      });

    blueParticles.push(particle);
    blueParticleAnimations.push(animation);
  }

  console.log(`Created ${blueParticles.length} blue particles`);
};

onMounted(async () => {
  await nextTick();
  // Attendre que les polices soient chargées
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  // Créer les particules
  createBlueParticles();
});

onUnmounted(() => {
  // Nettoyer toutes les animations GSAP
  blueParticleAnimations.forEach((animation) => animation.kill());
  gsap.killTweensOf(particlesContainerAnimatedBlue.value);

  // Nettoyer les tableaux
  blueParticleAnimations = [];
  blueParticles = [];
});
</script>

<style scoped>
/* @import "tailwindcss"; */

/* Particules grises plus grosses */
.particle-gray {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Particules bleues d'arrière-plan */
.particlesAnimatedBlue {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
