<template>
  <div
    class="services-page min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- Bannière d'en-tête -->
    <div
      class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-28 overflow-hidden"
    >
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Nos Services CE</h1>
          <p class="text-xl md:text-2xl text-blue-100">
            Découvrez tous les avantages et services mis à votre disposition
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-grid-white/[0.05] opacity-30"></div>
    </div>

    <!-- Grille des services -->
    <div class="container mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="service in servicesData"
          :key="service.id"
          class="z-30 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
          @click="openService(service)"
        >
          <div class="h-48 bg-gradient-to-r" :class="service.gradient">
            <div class="h-full flex items-center justify-center">
              <component :is="service.icon" class="w-16 h-16 text-white" />
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ service.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ service.description }}
            </p>
            <button
              class="text-blue-600 dark:text-blue-400 font-medium flex items-center group"
            >
              En savoir plus
              <svg
                class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
      </div>
    </div>

    <!-- Section d'appel à l'action -->
    <section
      class="bg-gradient-to-r from-blue-600 to-blue-700 text-white h-100 py-16 mt-16 relative overflow-hidden"
    >
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Notre équipe est à votre disposition pour répondre à toutes vos
            questions et vous accompagner dans vos démarches.
          </p>
          <button
            @click="contactSupport"
            class="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { servicesData } from "@/components/services/constants/mockDataServices";

const router = useRouter();

const openService = (service: any) => {
  router.push({
    name: "service-detail",
    params: { name: service.name },
  });
};

const contactSupport = () => {
  // Navigation vers la page de contact
  // router.push({ name: 'contact' });
};
</script>

<style scoped>
.services-page {
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .services-page {
    padding-top: calc(4.6rem + 3.2rem);
  }
}
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Style pour le mode sombre */
.dark .bg-grid-white {
  opacity: 0.1;
}
</style>
