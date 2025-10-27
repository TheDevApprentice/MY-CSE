<template>
  <div class="auth-view absolute flex py-6 justify-center overflow-hidden">
    <!-- Main Layout Container -->
    <div
      class="relative w-full max-w-6xl mx-auto py-4 sm:py-0 flex flex-col sm:flex-row items-center gap-12"
    >
      <!-- Left: Auth Container -->
      <div
        ref="authContainer"
        class="relative w-full max-w-xl py-4 px-8 rounded-2xl shadow-2xl backdrop-blur-sm border"
        :class="[
          isDark
            ? 'border-gray-700/50 text-gray-100'
            : 'border-gray-200/50 text-gray-900',
        ]"
      >
        <!-- Logo/Header -->
        <div
          ref="headerSection"
          class="flex flex-row items-center justify-center mb-2"
        >
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
            :class="[
              isDark
                ? 'bg-gradient-to-br from-blue-600 to-emerald-600'
                : 'bg-gradient-to-br from-blue-500 to-emerald-500',
            ]"
          >
            <IconUser class="w-8 h-8 text-white" />
          </div>
          <div
            class="px-6 mb-3 flex flex-col items-center align-center justify-center"
          >
            <h1
              ref="title"
              class="text-2xl font-bold mb-2"
              :class="isDark ? 'text-gray-100' : 'text-gray-900'"
            >
              {{ getFormTitle() }}
            </h1>
            <p
              ref="subtitle"
              class="text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ getFormSubtitle() }}
            </p>
          </div>
        </div>

        <!-- Form Container (SEULE PARTIE QUI ANIME) -->
        <div ref="formContainer" class="relative overflow-hidden">
          <!-- Sign In Form -->
          <form
            ref="signInForm"
            v-show="currentType === 'signin'"
            @submit.prevent="handleSignIn"
            class="space-y-6"
          >
            <div ref="signInFields" class="space-y-4">
              <div>
                <label
                  for="signin-email"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ $t("auth.email") }}
                </label>
                <input
                  id="signin-email"
                  v-model="signInData.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  :class="[
                    isDark
                      ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                      : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                  ]"
                  :placeholder="$t('auth.emailPlaceholder')"
                />
              </div>
              <div>
                <label
                  for="signin-password"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ $t("auth.password") }}
                </label>
                <div class="relative">
                  <input
                    id="signin-password"
                    v-model="signInData.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    class="w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    :class="[
                      isDark
                        ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                    ]"
                    :placeholder="$t('auth.passwordPlaceholder')"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IconEye v-if="!showPassword" class="w-5 h-5" />
                    <IconEyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              :class="[
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                  : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
              ]"
            >
              <span
                v-if="!isLoading"
                class="flex items-center justify-center gap-2"
              >
                <IconSignIn class="w-5 h-5" />
                {{ $t("auth.signIn") }}
              </span>
              <IconLoader v-else class="w-5 h-5 animate-spin mx-auto" />
            </button>
          </form>

          <!-- Sign Up Form -->
          <form
            ref="signUpForm"
            v-show="currentType === 'signup'"
            @submit.prevent="handleSignUp"
            class="space-y-6"
          >
            <div ref="signUpFields" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    for="signup-firstname"
                    class="block text-sm font-medium mb-2"
                    :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                  >
                    {{ $t("auth.firstName") }}
                  </label>
                  <input
                    id="signup-firstname"
                    v-model="signUpData.firstName"
                    type="text"
                    autocomplete="given-name"
                    required
                    class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    :class="[
                      isDark
                        ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                    ]"
                    :placeholder="$t('auth.firstNamePlaceholder')"
                  />
                </div>
                <div>
                  <label
                    for="signup-lastname"
                    class="block text-sm font-medium mb-2"
                    :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                  >
                    {{ $t("auth.lastName") }}
                  </label>
                  <input
                    id="signup-lastname"
                    v-model="signUpData.lastName"
                    type="text"
                    autocomplete="family-name"
                    required
                    class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    :class="[
                      isDark
                        ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                    ]"
                    :placeholder="$t('auth.lastNamePlaceholder')"
                  />
                </div>
              </div>
              <div>
                <label
                  for="signup-email"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ $t("auth.email") }}
                </label>
                <input
                  id="signup-email"
                  v-model="signUpData.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  :class="[
                    isDark
                      ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                      : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                  ]"
                  :placeholder="$t('auth.emailPlaceholder')"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative">
                  <label
                    for="signup-password"
                    class="block text-sm font-medium mb-2"
                    :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                  >
                    {{ $t("auth.password") }}
                  </label>
                  <div class="relative">
                    <input
                      id="signup-password"
                      v-model="signUpData.password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      class="w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      :class="[
                        isDark
                          ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                          : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                      ]"
                      :placeholder="$t('auth.passwordPlaceholder')"
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <IconEye v-if="!showPassword" class="w-5 h-5" />
                      <IconEyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    for="signup-confirm-password"
                    class="block text-sm font-medium mb-2"
                    :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                  >
                    {{ $t("auth.confirmPassword") }}
                  </label>
                  <input
                    id="signup-confirm-password"
                    v-model="signUpData.confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password-confirm"
                    required
                    class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    :class="[
                      isDark
                        ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                        : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                    ]"
                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              :class="[
                isDark
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
              ]"
            >
              <span
                v-if="!isLoading"
                class="flex items-center justify-center gap-2"
              >
                <IconSignUp class="w-5 h-5" />
                {{ $t("auth.signUp") }}
              </span>
              <IconLoader v-else class="w-5 h-5 animate-spin mx-auto" />
            </button>
          </form>

          <!-- Forgot Password Form -->
          <form
            ref="forgotForm"
            v-show="currentType === 'forgot'"
            @submit.prevent="handleForgotPassword"
            class="space-y-6"
          >
            <div ref="forgotFields" class="space-y-4">
              <div>
                <label
                  for="forgot-email"
                  class="block text-sm font-medium mb-2"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ $t("auth.email") }}
                </label>
                <input
                  id="forgot-email"
                  v-model="forgotData.email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  :class="[
                    isDark
                      ? 'bg-gray-800/50 border-gray-600 text-gray-100 placeholder-gray-400'
                      : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500',
                  ]"
                  :placeholder="$t('auth.emailPlaceholder')"
                />
              </div>
              <div
                class="p-4 rounded-lg"
                :class="[
                  isDark
                    ? 'bg-purple-900/20 border border-purple-700/30'
                    : 'bg-purple-50 border border-purple-200',
                ]"
              >
                <p
                  class="text-sm"
                  :class="isDark ? 'text-purple-300' : 'text-purple-700'"
                >
                  {{ $t("auth.forgotPasswordInfo") }}
                </p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              :class="[
                isDark
                  ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
                  : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
              ]"
            >
              <span
                v-if="!isLoading"
                class="flex items-center justify-center gap-2"
              >
                <IconMail class="w-5 h-5" />
                {{ $t("auth.sendResetLink") }}
              </span>
              <IconLoader v-else class="w-5 h-5 animate-spin mx-auto" />
            </button>
          </form>
        </div>

        <!-- Form Switchers (STATIQUE - PAS D'ANIMATION) -->
        <div class="mt-8 space-y-4">
          <!-- Main Switchers -->
          <div class="flex justify-center space-x-4">
            <!-- <button
              v-if="currentType !== 'signin'"
              @click="switchToForm('signin')"
              class="text-sm font-medium transition-colors hover:underline"
              :class="
                isDark
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-500'
              "
            >
              {{ $t("auth.backToSignIn") }}
            </button> -->
            <button
              v-if="currentType !== 'signup'"
              @click="switchToForm('signup')"
              class="text-sm font-medium transition-colors hover:underline"
              :class="
                isDark
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-emerald-600 hover:text-emerald-500'
              "
            >
              {{ $t("auth.createAccount") }}
            </button>
          </div>

          <!-- Forgot Password -->
          <div class="text-center">
            <button
              v-if="currentType === 'signin'"
              @click="switchToForm('forgot')"
              class="text-sm font-medium transition-colors hover:underline"
              :class="
                isDark
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-600 hover:text-purple-500'
              "
            >
              {{ $t("auth.forgotPassword") }}
            </button>
          </div>
        </div>
      </div>

      <!-- BARRE VERTICALE DE SÉPARATION -->
      <div
        class="hidden lg:flex flex-col items-center justify-center self-stretch min-h-[450px]"
      >
        <!-- Ligne du haut -->
        <div
          class="w-px flex-1"
          :class="[
            isDark
              ? 'bg-gradient-to-b from-transparent via-gray-600 to-gray-600'
              : 'bg-gradient-to-b from-transparent via-gray-400 to-gray-400',
          ]"
        ></div>

        <!-- Badge "OU" -->
        <div
          class="px-6 py-3 rounded-full backdrop-blur-md border text-sm font-medium shadow-lg my-4"
          :class="[
            isDark
              ? 'bg-gray-800/70 border-gray-600 text-gray-300'
              : 'bg-white/70 border-gray-300 text-gray-600',
          ]"
        >
          {{ $t("auth.or") }}
        </div>

        <!-- Ligne du bas -->
        <div
          class="w-px flex-1"
          :class="[
            isDark
              ? 'bg-gradient-to-b from-gray-600 via-gray-600 to-transparent'
              : 'bg-gradient-to-b from-gray-400 via-gray-400 to-transparent',
          ]"
        ></div>
      </div>

      <!-- Right: Social Login (STATIQUE - PAS D'ANIMATION) -->
      <div class="hidden lg:flex items-center w-full max-w-sm">
        <div
          class="w-full py-8 px-6 rounded-2xl shadow-xl backdrop-blur-xl border"
          :class="[isDark ? 'border-gray-700/30' : 'border-gray-200/30']"
        >
          <div class="text-center mb-6">
            <h3
              class="text-lg font-semibold mb-2"
              :class="isDark ? 'text-gray-100' : 'text-gray-900'"
            >
              {{ $t("auth.quickLogin") }}
            </h3>
            <p
              class="text-sm"
              :class="isDark ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ $t("auth.quickLoginSubtitle") }}
            </p>
          </div>

          <!-- Social Login Buttons -->
          <div class="space-y-4">
            <button
              @click="handleGoogleLogin"
              class="w-full py-3 px-4 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
              :class="[
                isDark
                  ? 'bg-gray-800/50 border-gray-600 text-gray-100 hover:bg-gray-700/50 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
              ]"
            >
              <span class="flex items-center justify-center gap-3">
                <IconGoogle class="w-5 h-5" />
                {{ $t("auth.continueWithGoogle") }}
              </span>
            </button>
            <button
              @click="handleMicrosoftLogin"
              class="w-full py-3 px-4 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
              :class="[
                isDark
                  ? 'bg-gray-800/50 border-gray-600 text-gray-100 hover:bg-gray-700/50 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
              ]"
            >
              <span class="flex items-center justify-center gap-3">
                <IconOutlook class="w-5 h-5" />
                {{ $t("auth.continueWithMicrosoft") }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile: Divider and Social (visible only on mobile) -->
      <div class="lg:hidden mt-8 space-y-4 w-full">
        <!-- Divider -->
        <div class="flex items-center">
          <div
            class="flex-1 h-px"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"
          ></div>
          <span
            class="px-4 text-sm"
            :class="isDark ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ $t("auth.or") }}
          </span>
          <div
            class="flex-1 h-px"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-300'"
          ></div>
        </div>

        <!-- Social Login -->
        <div class="space-y-3">
          <button
            @click="handleGoogleLogin"
            class="w-full py-3 px-4 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
            :class="[
              isDark
                ? 'bg-gray-800/50 border-gray-600 text-gray-100 hover:bg-gray-700/50 focus:ring-gray-500'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
            ]"
          >
            <span class="flex items-center justify-center gap-3">
              <IconGoogle class="w-5 h-5" />
              {{ $t("auth.continueWithGoogle") }}
            </span>
          </button>
          <button
            @click="handleMicrosoftLogin"
            class="w-full py-3 px-4 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
            :class="[
              isDark
                ? 'bg-gray-800/50 border-gray-600 text-gray-100 hover:bg-gray-700/50 focus:ring-gray-500'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-500',
            ]"
          >
            <span class="flex items-center justify-center gap-3">
              <IconOutlook class="w-5 h-5" />
              {{ $t("auth.continueWithMicrosoft") }}
            </span>
          </button>
        </div>
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
  watch,
  nextTick,
} from "vue";
import { gsap } from "gsap";
import { useRouter, useRoute } from "vue-router";
import { useTheme } from "@/composables/useTheme";
import { useI18n } from "@/composables/useI18n";
import { AuthService } from "@/services/auth/authService";

// ===== COMPOSABLES =====
const router = useRouter();
const route = useRoute();
const { isDark } = useTheme();
const { t } = useI18n();

// ===== IMPORT DYNAMIQUE DES ICÔNES =====
const IconUser = defineAsyncComponent(() => import("@icons/UserIcon.vue"));
const IconSignIn = defineAsyncComponent(() => import("@icons/IconSignIn.vue"));
const IconSignUp = defineAsyncComponent(() => import("@icons/IconSignUp.vue"));
const IconMail = defineAsyncComponent(() => import("@icons/EmailIcon.vue"));
const IconEye = defineAsyncComponent(() => import("@icons/IconEye.vue"));
const IconEyeOff = defineAsyncComponent(() => import("@icons/IconEyeOff.vue"));
const IconLoader = defineAsyncComponent(() => import("@icons/IconLoader.vue"));
const IconGoogle = defineAsyncComponent(() => import("@icons/IconGoogle.vue"));
const IconOutlook = defineAsyncComponent(() => import("@icons/IconOutlook.vue"));

// ===== REFS POUR GSAP (SEULEMENT LES ÉLÉMENTS QUI ANIMENT) =====
const authContainer = ref(null);
const title = ref(null);
const subtitle = ref(null);
const formContainer = ref(null);
const signInFields = ref(null);
const signUpFields = ref(null);
const forgotFields = ref(null);

// ===== ÉTAT LOCAL =====
const currentType = ref("signin");
const isLoading = ref(false);
const showPassword = ref(false);

// Créer les fonction de login, signup, rapidGoogleSignIn , rapidGoogleSignUp, rapidMicrosofSignup, ect comme abstraction qui utilise AuthService

// Données des formulaires
const signInData = ref({
  email: "",
  password: "",
});

const signUpData = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const forgotData = ref({
  email: "",
});

// Timeline GSAP
let formTransitionTimeline: gsap.core.Timeline | null = null;

// ===== COMPUTED =====
const getFormTitle = () => {
  switch (currentType.value) {
    case "signin":
      return t("auth.welcomeBack");
    case "signup":
      return t("auth.createAccount");
    case "forgot":
      return t("auth.resetPassword");
    default:
      return t("auth.welcomeBack");
  }
};

const getFormSubtitle = () => {
  switch (currentType.value) {
    case "signin":
      return t("auth.signInSubtitle");
    case "signup":
      return t("auth.signUpSubtitle");
    case "forgot":
      return t("auth.forgotPasswordSubtitle");
    default:
      return t("auth.signInSubtitle");
  }
};

// ===== ANIMATIONS GSAP (SIMPLIFIÉES) =====
function initializeAnimations() {
  if (!authContainer.value) return;

  // Animation d'entrée simple
  gsap.fromTo(
    authContainer.value,
    {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "back.out(1.4)",
    }
  );
}

function animateFormTransition(fromType: string, toType: string) {
  if (!formContainer.value) return;

  // Tuer les animations précédentes
  if (formTransitionTimeline) {
    formTransitionTimeline.kill();
  }

  const fromFields = getFieldsRef(fromType);
  const toFields = getFieldsRef(toType);

  if (!fromFields || !toFields) return;

  formTransitionTimeline = gsap.timeline({
    defaults: { ease: "power3.inOut" },
  });

  // Animation titre/sous-titre seulement
  formTransitionTimeline
    .to([title.value, subtitle.value], {
      opacity: 0,
      y: -15,
      duration: 0.25,
    })
    .call(() => {
      currentType.value = toType;
    })
    .to([title.value, subtitle.value], {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: "back.out(1.7)",
    });

  // Animation champs seulement
  formTransitionTimeline.to(
    fromFields,
    {
      opacity: 0,
      x: -60,
      duration: 0.3,
    },
    "-=0.4"
  );

  formTransitionTimeline
    .set(toFields, {
      opacity: 0,
      x: 60,
    })
    .to(toFields, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
}

function getFieldsRef(type: string) {
  switch (type) {
    case "signin":
      return signInFields.value;
    case "signup":
      return signUpFields.value;
    case "forgot":
      return forgotFields.value;
    default:
      return null;
  }
}

// ===== MÉTHODES =====
function switchToForm(type: string) {
  if (type === currentType.value) return;

  const fromType = currentType.value;

  // Mettre à jour l'URL
  router.replace({
    path: "/auth",
    query: { type },
  });

  // Animer la transition (SEULEMENT le formulaire)
  animateFormTransition(fromType, type);
}

function handleSignIn() {
  isLoading.value = true;

  // Simuler une requête API
  setTimeout(() => {
    console.log("Sign In:", signInData.value);
    isLoading.value = false;
    AuthService.loginWithEmail(signInData.value.email, signInData.value.password);
    router.push("/");
  }, 2000);
}

function handleSignUp() {
  if (signUpData.value.password !== signUpData.value.confirmPassword) {
    alert(t("auth.passwordMismatch"));
    return;
  }

  isLoading.value = true;

  setTimeout(() => {
    console.log("Sign Up:", signUpData.value);
    isLoading.value = false;
    AuthService.signupWithEmail(signUpData.value);
    router.push("/");
  }, 2000);
}

function handleForgotPassword() {
  isLoading.value = true;

  setTimeout(() => {
    console.log("Forgot Password:", forgotData.value);
    isLoading.value = false;
    AuthService.forgotPassword(forgotData.value.email);
    alert(t("auth.resetLinkSent"));
  }, 2000);
}

function handleGoogleLogin() {
  try {
    isLoading.value = true;
    AuthService.quickLoginWithGoogle();
    router.push("/");
  } catch (error) {
    alert(t("auth.googleLoginError"));
  } finally {
    isLoading.value = false;
  }
}

function handleMicrosoftLogin() {
  try {
    isLoading.value = true;
    AuthService.quickLoginWithMicrosoft();
    router.push("/");
  } catch (error) {
    alert(t("auth.microsoftLoginError"));
  } finally {
    isLoading.value = false;
  }
}

// ===== WATCHERS =====
watch(
  () => route.query.type,
  (newType) => {
    if (
      newType &&
      typeof newType === "string" &&
      newType !== currentType.value
    ) {
      const fromType = currentType.value;
      animateFormTransition(fromType, newType);
    }
  },
  { immediate: true }
);

// ===== CYCLE DE VIE =====
onMounted(() => {
  const urlType = route.query.type as string;
  if (urlType && ["signin", "signup", "forgot"].includes(urlType)) {
    currentType.value = urlType;
  }

  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  nextTick(() => {
    setTimeout(() => {
      initializeAnimations();
    }, 100);
  });

  if (import.meta.env.DEV) {
    console.log(" AuthView mounted with targeted GSAP animations");
  }
});

onUnmounted(() => {
  if (formTransitionTimeline) {
    formTransitionTimeline.kill();
    formTransitionTimeline = null;
  }

  gsap.killTweensOf([
    authContainer.value,
    title.value,
    subtitle.value,
    signInFields.value,
    signUpFields.value,
    forgotFields.value,
  ]);
});
</script>

<style scoped>
/* Base styles */
.auth-view {
  min-height: 100vh;
  background-attachment: fixed;
  padding-top: calc(4rem + 3.2rem);
}

/* Mobile Layout */
@media (max-width: 768px) {
  .auth-view {
    padding-top: calc(4.6rem + 3.5rem);
  }
}

/* Form animations */
.form-container {
  position: relative;
  overflow: hidden;
}

/* Input focus styles */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.dark input:focus {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

/* Loading button */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Vertical separator styles */
.vertical-separator {
  background: linear-gradient(
    to bottom,
    transparent,
    currentColor,
    transparent
  );
  opacity: 0.6;
}
.horizontal-separator {
  background: linear-gradient(to right, transparent, currentColor, transparent);
  opacity: 0.6;
}
/* Custom scrollbar */
@media (hover: hover) {
  ::-webkit-scrollbar {
    width: 8px;
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

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus states */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .auth-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}

/* Mobile layout */
@media (max-width: 1023px) {
  .max-w-6xl .flex {
    flex-direction: column;
    gap: 2rem;
  }
}

/* Print styles */
@media print {
  .auth-page {
    display: none;
  }
}
</style>
