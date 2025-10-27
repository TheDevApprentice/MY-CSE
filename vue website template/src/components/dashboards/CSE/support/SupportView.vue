<!-- components/dashboards/SASS/admin/views/support/SupportView.vue -->
<template>
  <div class="view-header">
    <h1 class="page-title">{{pageTitle}}</h1>
    <p class="page-subtitle">{{pageSubtitle}}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Page info
const pageTitle = ref("Support");
const pageSubtitle = ref("Gérez les tickets et les demandes de support");

// State
const isLoading = ref(false);
const loadingText = ref("Chargement des données...");

</script>

<style scoped>
@import "tailwindcss";
</style>
