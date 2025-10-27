<template>
  <div
    class="cse-loading fixed inset-0 z-50 top-0 left-0 w-full h-full right-0"
  >
    <!-- Fond animé -->
    <div class="background-animation">
      <div
        v-for="i in 8"
        :key="i"
        class="floating-orb"
        :style="getOrbStyle(i)"
      ></div>
    </div>

    <!-- Contenu principal -->
    <div class="content">
      <!-- Logo CSE -->
      <div class="loading-logo">
        <div class="logo-container">
          <div class="logo-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M7 17H17"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="logo-glow"></div>
        </div>
        <h1 class="logo-text">Espace CSE</h1>
        <div class="logo-subtitle">Chargement en cours</div>
      </div>

      <!-- Spinner -->
      <div class="spinner-container">
        <div class="spinner-ring">
          <div class="ring-segment"></div>
          <div class="ring-segment"></div>
          <div class="ring-segment"></div>
        </div>
      </div>

      <!-- Message de chargement -->
      <div class="loading-message">
        <p class="message-text">
          {{ message || "Préparation de votre espace..." }}
        </p>
        <div class="loading-dots">
          <span
            v-for="i in 3"
            :key="i"
            class="dot"
            :style="`--delay: ${i * 0.2}s`"
          ></span>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${progress}%` }">
              <div class="progress-glow"></div>
            </div>
          </div>
        </div>
        <div class="progress-label">
          <span>Chargement...</span>
          <span class="progress-percentage">{{ Math.round(progress) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Props
defineProps<{
  message?: string;
  duration?: number; // Durée totale en millisecondes
}>();

// État du chargement
const progress = ref(0);
const startTime = ref(0);
const animationFrame = ref<number>();

// Style dynamique pour les orbes flottants
const getOrbStyle = (index: number) => {
  const size = 100 + Math.random() * 200;
  const duration = 15 + Math.random() * 15;
  const delay = Math.random() * 5;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const opacity = 0.2 + Math.random() * 0.3;

  return {
    "--size": `${size}px`,
    "--duration": `${duration}s`,
    "--delay": `${delay}s`,
    "--x": `${x}%`,
    "--y": `${y}%`,
    "--opacity": opacity,
    "--hue": 220 + Math.random() * 60, // Bleu à violet
  };
};

// Animation de la barre de progression
const animateProgress = (timestamp: number) => {
  if (!startTime.value) startTime.value = timestamp;

  const elapsed = timestamp - startTime.value;
  const progressValue = Math.min(elapsed / 1000, 1); // 1 seconde pour 100%

  // Courbe d'accélération
  progress.value = easeInOutCubic(progressValue) * 100;

  if (progressValue < 1) {
    animationFrame.value = requestAnimationFrame(animateProgress);
  }
};

// Fonction d'interpolation pour une animation fluide
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

// Démarrer l'animation
onMounted(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  animationFrame.value = requestAnimationFrame(animateProgress);

  // Simulation de chargement si l'animation est trop rapide
  const interval = setInterval(() => {
    if (progress.value < 100) {
      const remaining = 100 - progress.value;
      const increment = remaining > 10 ? 1 : 0.2;
      progress.value = Math.min(progress.value + increment, 100);
    } else {
      clearInterval(interval);
    }
  }, 100);

  return () => {
    if (animationFrame.value) {
      cancelAnimationFrame(animationFrame.value);
    }
    clearInterval(interval);
  };
});
</script>

<style scoped>
@import "tailwindcss";

/* Variables CSS */
:root {
  --primary: 210, 100%, 60%;
  --secondary: 260, 90%, 65%;
  --bg-dark: 222, 47%, 11%;
  --bg-darker: 217, 33%, 17%;
}

.cse-loading {
  @apply bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900;
  @apply flex items-center justify-center p-6;
  color: white;
}

/* Fond animé */
.background-animation {
  @apply absolute inset-0 overflow-hidden;
}

.floating-orb {
  position: absolute;
  width: var(--size, 200px);
  height: var(--size, 200px);
  left: var(--x, 50%);
  top: var(--y, 50%);
  background: radial-gradient(
    circle at center,
    hsla(var(--hue, 220), 100%, 70%, var(--opacity, 0.2)) 0%,
    hsla(var(--hue, 220), 100%, 70%, 0) 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(20px);
  animation: float var(--duration, 20s) var(--delay, 0s) infinite alternate
    ease-in-out;
  will-change: transform;
}

/* Contenu principal */
.content {
  @apply relative z-10 max-w-md w-full;
  backdrop-filter: blur(10px);
  background: rgba(15, 23, 42, 0.6);
  @apply rounded-2xl p-8 shadow-2xl border border-white/5;
}

/* Logo */
.loading-logo {
  @apply mb-8 text-center relative;
}

.logo-container {
  @apply relative w-24 h-24 mx-auto mb-4;
}

.logo-icon {
  @apply w-full h-full text-blue-400 relative z-10;
  animation: float 6s ease-in-out infinite;
}

.logo-glow {
  @apply absolute inset-0 rounded-full bg-blue-500/20 blur-xl;
  animation: pulse 4s ease-in-out infinite;
}

.logo-text {
  @apply text-2xl md:text-3xl font-bold mb-1 bg-clip-text text-transparent;
  background-image: linear-gradient(to right, #60a5fa, #a78bfa);
  text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
}

.logo-subtitle {
  @apply text-blue-200/80 text-sm font-medium tracking-wide;
  letter-spacing: 0.1em;
}

/* Spinner */
.spinner-container {
  @apply relative w-24 h-24 mx-auto mb-8;
  perspective: 800px;
}

.spinner-ring {
  @apply w-full h-full relative;
  transform-style: preserve-3d;
  animation: spin 6s linear infinite;
}

.ring-segment {
  @apply absolute border-2 rounded-full border-t-transparent;
  border-color: hsl(var(--primary));
  border-top-color: transparent;
  animation: spin 3s cubic-bezier(0.5, 0, 0.5, 1) infinite;

  &:nth-child(1) {
    @apply inset-0;
    border-width: 3px;
    animation-delay: -0.15s;
  }

  &:nth-child(2) {
    @apply inset-2;
    border-width: 2px;
    animation-delay: -0.3s;
    border-color: hsl(var(--secondary));
  }

  &:nth-child(3) {
    @apply inset-4;
    border-width: 1px;
    animation-delay: -0.45s;
  }
}

/* Message */
.loading-message {
  @apply mb-8;
}

.message-text {
  @apply text-blue-100 text-lg font-medium mb-4;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

.loading-dots {
  @apply flex gap-2 justify-center;
}

.dot {
  @apply w-2 h-2 rounded-full bg-blue-400;
  animation: bounce 1.4s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

/* Barre de progression */
.progress-container {
  @apply w-full max-w-xs mx-auto;
}

.progress-bar {
  @apply relative h-2.5 rounded-full overflow-hidden mb-2;
  background: rgba(30, 41, 59, 0.5);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.progress-track {
  @apply h-full w-full rounded-full overflow-hidden relative;
}

.progress-fill {
  @apply h-full relative;
  background: linear-gradient(
    90deg,
    hsl(var(--primary)),
    hsl(var(--secondary))
  );
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 15px -3px rgba(96, 165, 250, 0.4);
}

.progress-glow {
  @apply absolute inset-0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0)
  );
  animation: shine 2s ease-in-out infinite;
  transform: translateX(-100%) skewX(-15deg);
}

.progress-label {
  @apply flex justify-between text-xs text-blue-200/80 mt-1;
  font-variant-numeric: tabular-nums;
}

.progress-percentage {
  @apply font-mono font-medium;
  background: linear-gradient(90deg, #93c5fd, #c4b5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-10px) translateX(5px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}

/* Effets de survol */
@media (hover: hover) {
  .content {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .cse-loading:hover .content {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 10px 10px -5px rgba(0, 0, 0, 0.1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .content {
    @apply p-6;
  }

  .logo-container {
    @apply w-20 h-20;
  }

  .logo-text {
    @apply text-xl;
  }

  .spinner-container {
    @apply w-20 h-20;
  }

  .message-text {
    @apply text-base;
  }

  .progress-container {
    @apply w-full;
  }
}

/* Dark theme */
.dark .cse-loading {
  @apply bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900;
}

.dark .content {
  background: rgba(15, 23, 42, 0.8);
  @apply border-white/10;
}

.dark .logo-icon {
  @apply text-blue-300;
}

.dark .logo-glow {
  @apply bg-blue-400/20;
}

.dark .logo-text {
  background-image: linear-gradient(to right, #93c5fd, #a78bfa);
}

.dark .logo-subtitle {
  @apply text-blue-300/80;
}

.dark .message-text {
  @apply text-blue-200;
}

.dark .dot {
  @apply bg-blue-300;
}

.dark .progress-bar {
  background: rgba(51, 65, 85, 0.5);
}

.dark .progress-label {
  @apply text-blue-300/80;
}

.dark .floating-orb {
  background: radial-gradient(
    circle at center,
    hsla(var(--hue, 220), 100%, 80%, var(--opacity, 0.15)) 0%,
    hsla(var(--hue, 220), 100%, 80%, 0) 70%
  );
}

.dark .ring-segment {
  &:nth-child(1) {
    border-color: hsl(210, 100%, 70%);
  }

  &:nth-child(2) {
    border-color: hsl(260, 90%, 75%);
  }

  &:nth-child(3) {
    border-color: hsl(210, 100%, 60%);
  }
}

.dark .progress-fill {
  background: linear-gradient(90deg, hsl(210, 100%, 70%), hsl(260, 90%, 75%));
}

.dark .progress-glow {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0)
  );
}

.dark .progress-percentage {
  background: linear-gradient(90deg, #bfdbfe, #ddd6fe);
}
</style>
