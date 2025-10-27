<template>
  <div
    class="forms-test-view p-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen"
  >
    <form
      @submit.prevent="handleSubmit"
      class="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
    >
      <!-- DatePicker -->
      <FormField ref="el => fieldRefs.birthdate = el" name="birthdate" required>
        <DatePicker
          name="birthdate"
          label="Date de naissance *"
          required
          v-model="formData.birthdate"
        />
      </FormField>

      <!-- FileUpload -->
      <FormField ref="el => fieldRefs.documents = el" name="documents">
        <FileUpload
          label="Documents"
          name="documents"
          v-model:files="formData.documents"
          accept=".pdf,.doc,.docx"
          multiple
          :max-size="5000000"
        />
      </FormField>

      <!-- RichTextEditor -->
      <FormField ref="el => fieldRefs.description = el" name="description">
        <RichTextEditor
          label="Description *"
          name="description"
          v-model="formData.description"
        />
      </FormField>

      <button
        type="submit"
        class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        :disabled="isSubmitting"
      >
        <span v-if="!isSubmitting">Soumettre</span>
        <span v-else>Envoi en cours...</span>
      </button>

      <div v-if="submitError" class="text-red-500 mt-2">
        {{ submitError }}
      </div>
    </form>

    <!-- Aperçu des données -->
    <div class="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Données du formulaire :
      </h2>
      <pre
        class="text-sm p-4 bg-gray-50 dark:bg-gray-700 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200"
      >
        {{ JSON.stringify(formData, null, 2) }}
      </pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FormField from "@components/common/ui/forms/FormField/FormField.vue";
import DatePicker from "@components/common/ui/forms/DatePicker/DatePicker.vue";
import FileUpload from "@components/common/ui/forms/FileUpload/FileUpload.vue";
import RichTextEditor from "@components/common/ui/forms/RichTextEditor/RichTextEditor.vue";

const formData = ref({
  birthdate: "",
  documents: [],
  description: "",
});

const fieldRefs = ref<Record<string, { validate: () => Promise<boolean> }>>({});

const isSubmitting = ref(false);
const submitError = ref("");

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = "";

  try {
    const isValid = await validateForm();

    if (!isValid) {
      submitError.value = "Veuillez corriger les erreurs dans le formulaire";
      return;
    }

    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Formulaire soumis:", formData.value);
    alert("Formulaire soumis avec succès !");
  } catch (err) {
    submitError.value = "Erreur lors de la soumission";
  } finally {
    isSubmitting.value = false;
  }
};

const validateForm = async () => {
  let isValid = true;
  for (const validator of Object.values(fieldRefs.value)) {
    if (!(await validator.validate())) {
      isValid = false;
    }
  }
  return isValid;
};
</script>

<style scoped>
.forms-test-view {
  min-height: 100vh;
}
</style>
