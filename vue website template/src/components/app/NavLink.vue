<template>
  <a
    :href="`#${item.id}`"
    class="nav-link relative px-2 py-1 text-sm font-medium transition-colors duration-200"
    :class="{
      'text-primary': isActive,
      'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white':
        !isActive,
    }"
    @click="handleClick"
  >
    {{ item.label }}
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const route = useRoute();

const isActive = computed(() => {
  return route.hash === `#${props.item.id}`;
});

const handleClick = (e: Event) => {
  emit("click", e);

  // Smooth scroll to section
  const targetId = (e.target as HTMLElement).getAttribute("href");
  if (targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
};
</script>

<style scoped>
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Animation au survol */
.nav-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: 0.5s;
}

.nav-link:hover::before {
  transform: translateX(100%);
}
</style>
