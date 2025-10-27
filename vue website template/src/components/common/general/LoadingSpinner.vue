<template>
  <div class="loading-spinner-container" v-if="visible">
    <div class="loading-backdrop" :class="{ 'backdrop-blur-sm': blur }"></div>
    <div class="loading-content">
      <div class="spinner" ref="spinnerRef">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text" v-if="text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

interface Props {
  visible?: boolean;
  text?: string;
  blur?: boolean;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  text: "",
  blur: true,
  size: "md",
});

const spinnerRef = ref<HTMLElement | null>(null);
let animation: gsap.core.Timeline | null = null;

onMounted(() => {
  if (props.visible && spinnerRef.value) {
    animation = gsap.timeline({ repeat: -1 });

    const rings = spinnerRef.value.querySelectorAll(".spinner-ring");

    animation
      .set(rings, { rotation: 0 })
      .to(rings[0], { rotation: 360, duration: 1.2, ease: "none" })
      .to(rings[1], { rotation: -360, duration: 1.8, ease: "none" }, 0)
      .to(rings[2], { rotation: 360, duration: 2.4, ease: "none" }, 0);
  }
});

onUnmounted(() => {
  if (animation) {
    animation.kill();
  }
});
</script>

<style scoped>
@import "tailwindcss";

.loading-spinner-container {
  @apply fixed inset-0 z-50 flex items-center justify-center;
}

.loading-backdrop {
  @apply absolute inset-0 bg-white/80 dark:bg-gray-900/80;
}

.loading-content {
  @apply relative z-10 flex flex-col items-center space-y-4;
}

.spinner {
  @apply relative;
  width: 64px;
  height: 64px;
}

.spinner-ring {
  @apply absolute border-4 rounded-full;
  width: 100%;
  height: 100%;
}

.spinner-ring:nth-child(1) {
  @apply border-blue-500 border-t-transparent;
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  @apply border-purple-500 border-r-transparent;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: -0.1s;
}

.spinner-ring:nth-child(3) {
  @apply border-pink-500 border-b-transparent;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: -0.2s;
}

.loading-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-300 animate-pulse;
}
</style>
