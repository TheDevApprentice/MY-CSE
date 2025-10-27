<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Overlay avec flou -->
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm"
      @click="requestClose"
    ></div>

    <!-- Modal de confirmation de sauvegarde -->
    <div
      v-if="showSaveDraftModal"
      class="fixed inset-0 flex items-center justify-center z-60"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Enregistrer le brouillon ?
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Voulez-vous enregistrer ce brouillon pour plus tard ?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeForm(false)"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Supprimer
          </button>
          <button
            @click="closeForm(true)"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de soumission -->
    <div
      v-if="showSubmitConfirmModal"
      class="fixed inset-0 flex items-center justify-center z-60"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Confirmer la soumission
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Êtes-vous sûr de vouloir soumettre cet événement ?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showSubmitConfirmModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Annuler
          </button>
          <button
            @click="submitEventForm"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <div
      class="relative bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            Proposer un événement
          </h3>
          <button
            @click="requestClose"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="requestSubmitForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Titre de l'événement *</label
              >
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Titre de l'événement"
              />
            </div>

            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Catégorie *</label
              >
              <select
                v-model="formData.category"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Événement">Événement</option>
                <option value="Formation">Formation</option>
                <option value="Atelier">Atelier</option>
                <option value="Conférence">Conférence</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Date *</label
              >
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Heure *</label
              >
              <input
                v-model="formData.time"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Lieu *</label
            >
            <input
              v-model="formData.location"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Lieu de l'événement"
            />
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Description détaillée *</label
            >
            <textarea
              v-model="formData.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Décrivez votre événement en détail..."
            ></textarea>
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Image de couverture</label
            >
            <div class="flex items-center space-x-4">
              <div class="flex-1">
                <input
                  v-model="formData.image"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="URL de l'image"
                />
              </div>
              <button
                type="button"
                @click="showGallery = !showGallery"
                class="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Galerie
              </button>
            </div>

            <!-- Aperçu de l'image -->
            <div v-if="formData.image" class="mt-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Aperçu :
              </div>
              <img
                :src="formData.image"
                alt="Aperçu"
                class="h-32 w-auto object-cover rounded"
              />
            </div>

            <!-- Galerie d'images -->
            <div v-if="showGallery" class="mt-4">
              <div
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sélectionner une image :
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(image, index) in imageGallery"
                  :key="index"
                  @click="selectImage(image)"
                  class="cursor-pointer border-2 rounded overflow-hidden transition-all"
                  :class="{
                    'border-blue-500': formData.image === image,
                    'border-transparent': formData.image !== image,
                  }"
                >
                  <img
                    :src="image"
                    :alt="'Image ' + (index + 1)"
                    class="h-20 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Email de contact *</label
              >
              <input
                v-model="formData.contact"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Votre Email"
              />
            </div>

            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Nombre maximum de participants</label
              >
              <input
                v-model="formData.maxParticipants"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Illimité si vide"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Prix (en €)</label
            >
            <div class="relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                v-model="formData.price"
                type="number"
                min="0"
                step="0.01"
                class="pl-7 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div
            class="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-6"
          >
            <div class="text-sm text-gray-500 dark:text-gray-400">
              <span v-if="isFormDirty" class="inline-flex items-center">
                <svg
                  class="w-4 h-4 mr-1 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Brouillon enregistré
              </span>
            </div>
            <div class="flex space-x-3">
              <button
                type="button"
                @click="requestClose"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Soumettre l'événement
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- Toast Notifications -->
  <ToastContainer :toasts="toasts" @remove-toast="removeToast" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from "vue";
import { useToast } from "@/components/toasts/composables/useToast";
import { useEventPage } from "@/components/events/composables/useEventPage";
const ToastContainer = defineAsyncComponent(
  () => import("@/components/toasts/ToastContainer.vue")
);
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
const {
  // État
  toasts,
  removeToast,
} = useEventPage();

const emit = defineEmits(["close", "submit"]);

const { showToast } = useToast();

// État du formulaire
const showSaveDraftModal = ref(false);
const showSubmitConfirmModal = ref(false);
const isFormDirty = ref(false);
const showGallery = ref(false);
const STORAGE_KEY = "eventDraft";

// Données du formulaire
const formData = ref({
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  category: "Événement",
  image: "",
  contact: "",
  maxParticipants: "",
  price: "",
});

// Galerie d'images libres de droits
const imageGallery = [
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1511578314323-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1511578314323-379afb476865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
];

// Charger le brouillon depuis le localStorage
const loadDraft = () => {
  const draft = localStorage.getItem(STORAGE_KEY);
  if (draft) {
    try {
      const parsedDraft = JSON.parse(draft);
      // Vérifier si le brouillon est récent (moins de 7 jours)
      if (
        parsedDraft.savedAt &&
        Date.now() - new Date(parsedDraft.savedAt).getTime() <
          7 * 24 * 60 * 60 * 1000
      ) {
        formData.value = parsedDraft.data;
        isFormDirty.value = true;
        return true;
      } else {
        // Supprimer le brouillon s'il est trop ancien
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Erreur lors du chargement du brouillon:", e);
    }
  }
  return false;
};

// Sauvegarder le brouillon dans le localStorage
const saveDraft = () => {
  if (isFormDirty.value) {
    const draft = {
      data: formData.value,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }
};

// Supprimer le brouillon
const clearDraft = () => {
  localStorage.removeItem(STORAGE_KEY);
  isFormDirty.value = false;
};

// Sélectionner une image depuis la galerie
const selectImage = (imageUrl: string) => {
  formData.value.image = imageUrl;
  showGallery.value = false;
};

// Demander confirmation avant de fermer
const requestClose = () => {
  if (isFormDirty.value) {
    showSaveDraftModal.value = true;
  } else {
    closeForm();
  }
};

// Fermer le formulaire
const closeForm = (saveDraftRef: boolean = false) => {
  if (!saveDraftRef) {
    clearDraft();
  } else {
    saveDraft();
  }
  showSaveDraftModal.value = false;
  emit("close");
};

// Demander confirmation avant de soumettre
const requestSubmitForm = () => {
  showSubmitConfirmModal.value = true;
};

// Soumettre le formulaire
const submitEventForm = () => {
  // Émettre l'événement avec les données du formulaire
  emit("submit", formData.value);

  // Supprimer le brouillon
  clearDraft();

  // Fermer la modale de confirmation
  showSubmitConfirmModal.value = false;
};

// Observer les changements dans le formulaire
watch(
  formData,
  () => {
    if (props.show) {
      isFormDirty.value = true;
      // Sauvegarder automatiquement après un délai
      const saveTimeout = setTimeout(() => {
        saveDraft();
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  },
  { deep: true }
);

// Charger le brouillon au montage
onMounted(() => {
  if (props.show) {
    const hasDraft = loadDraft();
    if (hasDraft) {
      showToast("Un brouillon a été chargé", "info");
    }
  }
});
</script>
