<!-- components/dashboards/SASS/admin/views/billing/BillingsView.vue -->
<template>
  <div class="view-header">
    <h1 class="page-title">{{pageTitle}}</h1>
    <p class="page-subtitle">{{pageSubtitle}}</p>
  </div>

  <div class="billings-content">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Carte de statut d'abonnement -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Votre abonnement</h3>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Plan actuel</p>
            <p class="text-xl font-semibold">Premium</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Prochain paiement</p>
            <p class="text-lg">15/07/2023</p>
          </div>
          <button class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Changer de plan
          </button>
        </div>
      </div>

      <!-- Carte de facturation -->
      <div class="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium">Historique des factures</h3>
          <button class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Télécharger tout
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  N° Facture
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Montant
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="invoice in invoices" :key="invoice.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ invoice.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ invoice.number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ invoice.amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Payée' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">Voir</a>
                  <a href="#" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">Télécharger</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Section méthodes de paiement -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-medium">Méthodes de paiement</h3>
        <button class="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Ajouter une carte
        </button>
      </div>
      
      <div class="space-y-4">
        <div v-for="card in paymentMethods" :key="card.id" class="flex items-center justify-between p-4 border rounded-lg">
          <div class="flex items-center">
            <div class="p-2 bg-gray-100 dark:bg-gray-700 rounded-md mr-4">
              <svg class="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="font-medium">{{ card.type }} se terminant par {{ card.last4 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Expire le {{ card.expiry }}</p>
            </div>
          </div>
          <button class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';

// Page info
const pageTitle = ref("Facturation");
const pageSubtitle = ref("Gestion des factures");

// State
const isLoading = ref(false);
const loadingText = ref("Chargement des données...");

const invoices = ref([
{ id: 1, date: '15/06/2023', number: 'INV-2023-06-001', amount: '49,99 €', status: 'Payée' },
{ id: 2, date: '15/05/2023', number: 'INV-2023-05-001', amount: '49,99 €', status: 'Payée' },
{ id: 3, date: '15/04/2023', number: 'INV-2023-04-001', amount: '49,99 €', status: 'Payée' },
{ id: 4, date: '15/03/2023', number: 'INV-2023-03-001', amount: '49,99 €', status: 'Payée' },
]);

const paymentMethods = ref([
{ id: 1, type: 'Visa', last4: '4242', expiry: '12/24' },
{ id: 2, type: 'Mastercard', last4: '5555', expiry: '06/25' },
]);

onMounted(async () => {
await nextTick();
});
</script>

<style scoped>
@import 'tailwindcss';

.billings-view {
@apply p-6;
}

.view-header {
@apply mb-6;
}

.page-title {
@apply text-2xl font-bold text-gray-900;
}

.dark .page-title {
@apply text-white;
}

.page-subtitle {
@apply text-gray-600;
}

.dark .page-subtitle {
@apply text-gray-400;
}

.page-subtitle {
@apply text-gray-600 dark:text-gray-400;
}

table {
@apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

th, td {
@apply px-6 py-4 text-left text-sm;
}

th {
@apply font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}

/* Styles pour les boutons */
button {
@apply transition-colors duration-200;
}

/* Styles pour les liens */
a {
@apply transition-colors duration-200;
}

/* Styles pour les cartes */
.bg-white {
background-color: #fff;
}

.dark .dark\:bg-gray-800 {
background-color: #1f2937;
}

/* Styles pour la pagination */
.pagination {
@apply flex justify-between items-center mt-6;
}

.pagination button {
@apply px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700;
}

.pagination button:disabled {
@apply opacity-50 cursor-not-allowed;
}

/* Styles pour les statuts */
.bg-green-100 {
background-color: #d1fae5;
}

.text-green-800 {
color: #065f46;
}

.bg-yellow-100 {
background-color: #fef3c7;
}

.text-yellow-800 {
color: #92400e;
}

/* Mode sombre pour les statuts */
.dark .bg-green-100 {
background-color: #064e3b;
}

.dark .text-green-800 {
color: #a7f3d0;
}

.dark .bg-yellow-100 {
background-color: #78350f;
}

.dark .text-yellow-800 {
color: #fcd34d;
}
</style>