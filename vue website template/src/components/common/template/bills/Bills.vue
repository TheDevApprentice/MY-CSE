<template>
  <div class="bill-template bg-white dark:bg-gray-800 p-4">
    <!-- En-tête avec logo et info société -->
    <div class="flex justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">FACTURE</h1>
        <p class="text-gray-500">N° {{ invoice.number }}</p>
      </div>
      <div class="text-right">
        <img src="@/assets/vue.svg" alt="Logo" class="h-12" />
        <p class="mt-2 text-sm">
          {{ company.companyName }}<br />
          {{ company.address.street }}<br />
          {{ company.address.zip }} {{ company.address.city }}<br />
          SIRET : {{ company.siret }}<br />
          TVA Intra : {{ company.vat }}
        </p>
      </div>
    </div>

    <!-- Dates et client -->
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <h2 class="font-medium mb-2">Date d'émission :</h2>
        <p>{{ invoice.date }}</p>

        <h2 class="font-medium mt-4 mb-2">Date d'échéance :</h2>
        <p>{{ invoice.dueDate }}</p>
      </div>
      <div>
        <h2 class="font-medium mb-2">Facturé à :</h2>
        <p>
          {{ client.companyName }}<br />
          {{ client.facturationAddresse.street }}<br />
          {{ client.facturationAddresse.zip }}
          {{ client.facturationAddresse.city }}
        </p>
      </div>
    </div>

    <!-- Détails de la facture -->
    <table class="w-full mb-8">
      <thead>
        <tr class="border-b">
          <th class="text-left pb-2">Description</th>
          <th class="text-right pb-2">Prix unitaire</th>
          <th class="text-right pb-2">Quantité</th>
          <th class="text-right pb-2">Total HT</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index" class="border-b">
          <td class="py-4">{{ item.description }}</td>
          <td class="text-right">{{ item.unitPrice }} €</td>
          <td class="text-right">{{ item.quantity }}</td>
          <td class="text-right">{{ item.amountHT }} €</td>
        </tr>
      </tbody>
    </table>

    <!-- Total et mentions légales -->
    <div class="grid grid-cols-2 gap-8">
      <div>
        <h3 class="font-medium mb-2">Mentions légales :</h3>
        <p class="text-xs text-gray-500">
          En cas de retard de paiement, seront exigibles, conformément à
          l'article L. 441-6 du code de commerce, une indemnité forfaitaire pour
          frais de recouvrement de 40€ et une indemnité calculée sur la base de
          trois fois le taux d'intérêt légal.
        </p>
      </div>
      <div class="text-right">
        <div class="mb-2">
          <span class="mr-4">Total HT :</span>
          <span>{{ invoice.amountHT }} €</span>
        </div>
        <div class="mb-2">
          <span class="mr-4">TVA (20%) :</span>
          <span>{{ invoice.tax }} €</span>
        </div>
        <div class="text-xl font-bold">
          <span class="mr-4">Total TTC :</span>
          <span>{{ invoice.amount }} €</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  company: {
    type: Object,
    required: true,
    default: () => ({
      name: "Votre Société",
      address: "123 Rue de l'Exemple",
      zip: "75000",
      city: "Paris",
      siret: "123 456 789 00010",
      vat: "FR12345678901",
    }),
  },
  client: {
    type: Object,
    required: true,
  },
  invoice: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.bill-template {
  font-family: "Helvetica", "Arial", sans-serif;
  color: #333;
}

.dark .bill-template {
  color: #e5e7eb;
  border: 1px solid #374151;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 0;
  text-align: left;
}

th {
  border-bottom: 2px solid #e5e7eb;
}

.dark th {
  border-bottom-color: #374151;
}
</style>
