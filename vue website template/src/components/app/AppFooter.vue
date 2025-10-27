<template>
  <footer
    class="relative bottom-0 left-0 right-0 z-0 backdrop-blur border-t w-full h-[calc(100vh-118px)] overflow-hidden transition-footer-colors"
    :class="[
      isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200',
    ]"
  >
    <!-- Footer principal -->
    <div
      class="container h-[80%] sm:h-[85%] md:h-[90%] lg:h-[85%] mx-auto px-4 py-12"
    >
      <!-- Structure desktop : 4 colonnes -->
      <div class="hidden md:grid grid-cols-4 gap-8">
        <!-- Colonne 1 : À propos de l'entreprise -->
        <div class="flex flex-col gap-4">
          <div
            :class="
              isDark
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            "
            class="text-2xl font-bold bg-clip-text text-transparent"
          >
            {{ $t("footer.companyname") }}
          </div>
          <p
            class="text-sm leading-relaxed transition-footer-colors"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ $t("footer.companyDescription") }}
          </p>

          <!-- Technologies utilisées -->
          <!-- <div class="flex flex-wrap gap-2 mt-2">
            <div 
              v-for="tech in technologies" 
              :key="tech.name"
              class="tech-badge group"
              :class="isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'"
            >
              <component :is="tech.icon" class="w-3 h-3" />
              <span class="text-xs">{{ tech.name }}</span>
            </div>
          </div> -->
        </div>

        <!-- Colonne 2 : Services -->
        <div class="flex flex-col gap-4">
          <h3
            class="text-lg font-semibold transition-footer-colors"
            :class="isDark ? 'text-gray-100' : 'text-gray-900'"
          >
            {{ $t("footer.services.title") }}
          </h3>
          <ul class="space-y-2">
            <li v-for="service in services" :key="service.key">
              <a
                :href="service.url"
                class="text-sm transition-colors duration-200 hover:underline"
                :class="
                  isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                "
              >
                {{ $t(service.label) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Colonne 3 : Entreprise -->
        <div class="flex flex-col gap-4">
          <h3
            class="text-lg font-semibold transition-footer-colors"
            :class="isDark ? 'text-gray-100' : 'text-gray-900'"
          >
            {{ $t("footer.company.title") }}
          </h3>
          <ul class="space-y-2">
            <li v-for="link in companyLinks" :key="link.key">
              <a
                :href="link.url"
                class="text-sm transition-colors duration-200 hover:underline"
                :class="
                  isDark
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                "
              >
                {{ $t(link.label) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Colonne 4 : Contact & Réseaux sociaux -->
        <div class="flex flex-col gap-4">
          <h3
            class="text-lg font-semibold transition-footer-colors"
            :class="isDark ? 'text-gray-100' : 'text-gray-900'"
          >
            {{ $t("footer.contact.title") }}
          </h3>

          <!-- Informations de contact -->
          <div class="space-y-2">
            <div
              class="flex items-center gap-2 text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              <!-- <EmailIcon class="w-4 h-4" /> -->
              <a
                href="mailto:contact@votreentreprise.com"
                class="hover:underline"
              >
                contact@votreentreprise.com
              </a>
            </div>
            <div
              class="flex items-center gap-2 text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              <!-- <PhoneIcon class="w-4 h-4" /> -->
              <span>+33 1 23 45 67 89</span>
            </div>
            <div
              class="flex items-start gap-2 text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              <!-- <MapPinIcon class="w-4 h-4 mt-0.5" /> -->
              <span>123 Rue de l'Innovation<br />75001 Paris, France</span>
            </div>
          </div>

          <!-- Réseaux sociaux professionnels -->
          <div class="space-y-3 mt-4">
            <h4
              class="text-sm font-medium"
              :class="isDark ? 'text-gray-200' : 'text-gray-800'"
            >
              {{ $t("footer.social.title") }}
            </h4>
            <div class="flex gap-3">
              <div
                v-for="social in socialLinks"
                :key="social.name"
                class="group"
              >
                <a
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-110"
                  :class="
                    isDark
                      ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  "
                  :title="social.label"
                >
                  <component :is="social.icon" class="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Structure mobile : empilée -->
      <div class="md:hidden space-y-8">
        <!-- Nom et description de l'entreprise -->
        <div class="text-center space-y-3">
          <div
            :class="
              isDark
                ? 'bg-gradient-to-r from-blue-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            "
            class="text-2xl font-bold bg-clip-text text-transparent"
          >
            {{ $t("footer.companyname") }}
          </div>
          <p
            class="text-sm leading-relaxed transition-footer-colors max-w-sm mx-auto"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ $t("footer.companyDescription") }}
          </p>

          <!-- Technologies pour mobile -->
          <!-- <div class="flex flex-wrap justify-center gap-2 mt-4">
            <div 
              v-for="tech in technologies" 
              :key="tech.name"
              class="tech-badge"
              :class="isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-700'"
            >
              <component :is="tech.icon" class="w-3 h-3" />
              <span class="text-xs">{{ tech.name }}</span>
            </div>
          </div> -->
        </div>

        <!-- Services et Entreprise en 2 colonnes -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Services -->
          <div class="space-y-3">
            <h3
              class="text-base font-semibold transition-footer-colors"
              :class="isDark ? 'text-gray-100' : 'text-gray-900'"
            >
              {{ $t("footer.services.title") }}
            </h3>
            <ul class="space-y-2">
              <li v-for="service in services" :key="service.key">
                <a
                  :href="service.url"
                  class="text-sm transition-colors duration-200 hover:underline"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  "
                >
                  {{ $t(service.label) }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Entreprise -->
          <div class="space-y-3">
            <h3
              class="text-base font-semibold transition-footer-colors"
              :class="isDark ? 'text-gray-100' : 'text-gray-900'"
            >
              {{ $t("footer.company.title") }}
            </h3>
            <ul class="space-y-2">
              <li v-for="link in companyLinks" :key="link.key">
                <a
                  :href="link.url"
                  class="text-sm transition-colors duration-200 hover:underline"
                  :class="
                    isDark
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  "
                >
                  {{ $t(link.label) }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact et réseaux sociaux -->
        <div class="text-center space-y-4">
          <h3
            class="text-base font-semibold transition-footer-colors"
            :class="isDark ? 'text-gray-100' : 'text-gray-900'"
          >
            {{ $t("footer.contact.title") }}
          </h3>

          <!-- Contact info -->
          <div class="space-y-2">
            <div
              class="flex items-center justify-center gap-2 text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              <!-- <EmailIcon class="w-4 h-4" /> -->
              <a
                href="mailto:contact@votreentreprise.com"
                class="hover:underline"
              >
                contact@votreentreprise.com
              </a>
            </div>
            <div
              class="flex items-center justify-center gap-2 text-sm"
              :class="isDark ? 'text-gray-300' : 'text-gray-600'"
            >
              <!-- <PhoneIcon class="w-4 h-4" /> -->
              <span>+33 1 23 45 67 89</span>
            </div>
          </div>

          <!-- Social links -->
          <div class="flex justify-center gap-3 mt-4">
            <div v-for="social in socialLinks" :key="social.name" class="group">
              <a
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:scale-110"
                :class="
                  isDark
                    ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                "
                :title="social.label"
              >
                <component :is="social.icon" class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Séparateur -->
    <div
      class="border-t"
      :class="isDark ? 'border-gray-800' : 'border-gray-200'"
    ></div>

    <!-- Bas du footer : Copyright et liens légaux -->
    <div
      class="container h-[20%] sm:h-[15%] md:h-[10%] lg:h-[15%] mx-auto px-4 py-6"
    >
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <div
          class="text-sm text-center md:text-left transition-footer-colors"
          :class="[isDark ? 'text-gray-400' : 'text-gray-500']"
        >
          &copy; {{ new Date().getFullYear() }} {{ $t("footer.company.name") }}.
          {{ $t("footer.copyright") }}
        </div>

        <!-- Liens légaux -->
        <div class="flex flex-wrap justify-center gap-6">
          <a
            v-for="legal in legalLinks"
            :key="legal.key"
            :href="legal.url"
            class="text-sm transition-colors duration-200 hover:underline"
            :class="
              isDark
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            {{ $t(legal.label) }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
} from "vue";

import { useTheme } from "@/composables/useTheme";

// Import des icônes de contact
// const EmailIcon = defineAsyncComponent(
//   () => import('@icons/EmailIcon.vue')
// );
// const PhoneIcon = defineAsyncComponent(
//   () => import('@icons/PhoneIcon.vue')
// );
// const MapPinIcon = defineAsyncComponent(
//   () => import('@icons/MapPinIcon.vue')
// );

// Import des icônes sociales
const IconLinkedin = defineAsyncComponent(() =>
  import("@icons/IconLinkedin.vue")
);
const IconGithub = defineAsyncComponent(() => import("@icons/IconGithub.vue"));
const IconTwitter = defineAsyncComponent(() =>
  import("@icons/IconTwitter.vue")
);
const IconInstagram = defineAsyncComponent(() =>
  import("@icons/IconInstagram.vue")
);

// Import des icônes technologies
const VueIcon = defineAsyncComponent(() => import("@icons/VueIcon.vue"));
const ViteIcon = defineAsyncComponent(() => import("@icons/ViteIcon.vue"));
const TailwindIcon = defineAsyncComponent(() =>
  import("@icons/TailwindIcon.vue")
);
const GsapIcon = defineAsyncComponent(() => import("@icons/GsapIcon.vue"));
const LucideIcon = defineAsyncComponent(() => import("@icons/LucideIcon.vue"));

const { isDark } = useTheme();

// Technologies utilisées
const technologies = [
  { name: "Vue.js", icon: VueIcon },
  { name: "Vite", icon: ViteIcon },
  { name: "Tailwind", icon: TailwindIcon },
  { name: "GSAP", icon: GsapIcon },
  { name: "Lucide", icon: LucideIcon },
];

// Services proposés
const services = [
  {
    key: "web-dev",
    label: "footer.services.webDev",
    url: "/services/web-development",
  },
  {
    key: "mobile-dev",
    label: "footer.services.mobileDev",
    url: "/services/mobile-development",
  },
  {
    key: "consulting",
    label: "footer.services.consulting",
    url: "/services/consulting",
  },
  {
    key: "maintenance",
    label: "footer.services.maintenance",
    url: "/services/maintenance",
  },
  { key: "design", label: "footer.services.design", url: "/services/design" },
];

// Liens entreprise
const companyLinks = [
  { key: "about", label: "footer.company.about", url: "/about" },
  { key: "team", label: "footer.company.team", url: "/team" },
  { key: "careers", label: "footer.company.careers", url: "/careers" },
  { key: "blog", label: "footer.company.blog", url: "/blog" },
  { key: "partners", label: "footer.company.partners", url: "/partners" },
];

// Liens légaux
const legalLinks = [
  { key: "privacy", label: "footer.legal.privacy", url: "/privacy" },
  { key: "terms", label: "footer.legal.terms", url: "/terms" },
  { key: "cookies", label: "footer.legal.cookies", url: "/cookies" },
  { key: "sitemap", label: "footer.legal.sitemap", url: "/sitemap" },
];

// Liens sociaux professionnels
const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/votreentreprise/",
    icon: IconLinkedin,
    label: "LinkedIn",
  },
  {
    name: "GitHub",
    url: "https://github.com/votreentreprise",
    icon: IconGithub,
    label: "GitHub",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/votreentreprise",
    icon: IconTwitter,
    label: "Twitter",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/votreentreprise",
    icon: IconInstagram,
    label: "Instagram",
  },
];
</script>

<style scoped>
@import "tailwindcss";

.tech-badge {
  @apply flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 hover:scale-105;
}

.tech-badge:hover {
  @apply shadow-sm;
}

/* Améliorer la lisibilité des liens */
a:hover {
  @apply transition-all duration-200;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tech-badge {
    @apply text-xs px-1.5 py-0.5;
  }
}

/* Focus styles */
a:focus-visible {
  @apply outline-2 outline-offset-2 outline-blue-500 rounded;
}

/* Smooth transitions */
* {
  @apply transition-colors duration-200;
}
</style>
