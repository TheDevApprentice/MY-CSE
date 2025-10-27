<template>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: system-ui;
      text-align: center;
    "
  >
    <div>
      <h1>⚠️ Erreur</h1>
      <p>L'application n'a pas pu démarrer.</p>
      <button
        onclick="location.reload()"
        style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer"
      >
        Recharger
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
