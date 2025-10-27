<!-- components/dashboards/SASS/admin/views/billing/BillingsView.vue -->
<template>
  <div id="billing-view" href="#billing-view" class="view" ref="billingsRef">
    <div id="view-header" class="view-header" href="#view-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <div id="billing-content" class="content" href="#billing-content">
      <!-- Statistiques -->
      <div id="stats-grid" href="#stats-grid" class="stats-grid">
        <StatsCard
          v-for="(stat, index) in billingStats"
          :key="index"
          v-bind="stat"
          class="hover:shadow-lg transition-transform hover:scale-[1.02]"
        />
      </div>

      <!-- Graphiques -->
      <div id="charts-section" href="#charts-section" class="charts-section">
        <!-- Évolution du chiffre d'affaires -->
        <div id="chart-container" class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Évolution du chiffre d'affaires</h3>
          </div>
          <div class="chart-content">
            <LineChart
              theme="auto"
              :labels="['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin']"
              :datasets="[
                {
                  label: 'CA (en €)',
                  data: [1800, 1950, 2100, 2250, 2400, 2450],
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
              ]"
            />
          </div>
        </div>

        <!-- Répartition des paiements -->
        <div id="chart-container" class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Statut des paiements</h3>
          </div>
          <div class="chart-content">
            <BarChart
              theme="auto"
              :labels="['Payées', 'En attente', 'En retard', 'Non payées']"
              :datasets="[
                {
                  data: [24, 3, 2, 1],
                  backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#DC2626'],
                },
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Liste des clients -->
      <div id="table-container" href="#table-container" class="table-container">
        <div id="table-header" href="#table-header" class="table-header">
          <h3 class="table-title">Clients et abonnements</h3>
        </div>
        <DataTable
          :headers="clientHeaders"
          :items="clients"
          :show-actions="true"
          :actions="[{ name: 'view', handler: viewClient }]"
        />
      </div>

      <div id="table-container" href="#table-container" class="table-container">
        <div id="table-header" href="#table-header" class="table-header">
          <h3 class="table-title">Historique des factures</h3>
        </div>
        <DataTable
          :headers="invoiceHeaders"
          :items="invoices"
          :show-actions="true"
          :actions="[
            { name: 'view', handler: viewInvoice },
            { name: 'download', handler: downloadInvoice },
          ]"
        />
      </div>
    </div>

    <!-- Composant de facture caché pour le téléchargement -->
    <div
      id="hidden-invoice"
      href="#hidden-invoice"
      ref="hiddenInvoiceRef"
      class="hidden-invoice border border-gray-200 dark:border-gray-700 rounded-xl"
    >
      <BillTemplate
        v-if="downloadInvoiceData.invoice"
        :company="downloadInvoiceData.company"
        :client="downloadInvoiceData.client"
        :invoice="downloadInvoiceData.invoice"
        :items="downloadInvoiceData.items"
        ref="billTemplateRef"
      />
    </div>
  </div>

  <!-- Modaux existants -->
  <FormModal
    v-model:show="showClientModal"
    :title="`Abonnement - ${currentClient?.name || ''}`"
    submit-text="Fermer"
    width="max-w-2xl"
  >
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium text-gray-500">Client</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentClient?.companyName }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Email</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentClient?.email }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Plan</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentClient?.plan }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Prochain paiement</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentClient?.nextPayment }}
          </p>
        </div>
      </div>

      <!-- DataTable des factures du client -->
      <div class="relative right-15 mt-6 w-full">
        <h4 class="text-sm font-medium text-gray-500 mb-2">
          Historique des factures
        </h4>
        <DataTable
          :headers="[
            { text: 'Date', value: 'date' },
            { text: 'N° Facture', value: 'number' },
            { text: 'Montant', value: 'amount' },
            { text: 'Statut', value: 'status' },
          ]"
          :items="invoices.filter((i) => i.clientId === currentClient?.id)"
          :show-actions="true"
          :actions="[
            { name: 'view', handler: viewInvoice },
            { name: 'download', handler: downloadInvoice },
          ]"
          class="w-full"
        />
      </div>
    </div>
  </FormModal>

  <FormModal
    v-model:show="showInvoiceModal"
    :title="`Facture ${currentInvoice?.number || ''}`"
    submit-text="Fermer"
    width="max-w-5xl"
  >
    <div class="space-y-4 mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium text-gray-500">Client</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentInvoice?.client }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Date</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentInvoice?.date }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Montant</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentInvoice?.amount }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Statut</h4>
          <span
            class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="
              currentInvoice?.status === 'Payée'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            "
          >
            {{ currentInvoice?.status }}
          </span>
        </div>
      </div>

      <button
        @click="showInvoiceDetails = !showInvoiceDetails"
        class="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {{ showInvoiceDetails ? "Masquer la facture" : "Afficher la facture" }}
        <IconArrowDown v-if="!showInvoiceDetails" class="w-4 h-4" />
        <IconArrowUp v-else class="w-4 h-4" />
      </button>
      <div class="flex justify-between items-center mb-6">
        <button
          @click="downloadInvoice(currentInvoice)"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <IconDownload class="w-4 h-4" />
          Télécharger
        </button>
      </div>
      <Transition name="fade-slide" mode="out-in">
        <div
          id="invoice"
          v-if="showInvoiceDetails"
          class="border border-gray-200 dark:border-gray-700 rounded-xl"
        >
          <BillTemplate
            :company="currentCompany"
            :client="currentClient"
            :invoice="currentInvoice"
            :items="invoiceItems"
          />
        </div>
      </Transition>
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick} from "vue";
import StatsCard from "@/components/common/ui/charts/StatsCard.vue";
import LineChart from "@/components/common/ui/charts/LineChart.vue";
import DataTable from "@/components/common/ui/tables/DataTable.vue";
import FormModal from "@/components/common/ui/modals/FormModal.vue";
import BarChart from "@/components/common/ui/charts/BarChart.vue";
import BillTemplate from "@/components/common/template/bills/Bills.vue";
import IconArrowDown from "@icons/IconArrowDown.vue";
import IconArrowUp from "@icons/IconArrowUp.vue";
import IconDownload from "@icons/IconDownload.vue";
import { useView } from "@/components/dashboards/SASS/admin/composables/useView";
import { useInvoiceDownload } from "@/composables/useInvoiceDownload";
import { AdminView } from "@/components/dashboards/SASS/admin/types/admin";
import { useBillings } from "../../composables/useBillings";

const { animateViewEnter } = useView([AdminView.BILLING]);
const { downloadInvoiceAsHTML } = useInvoiceDownload();
const { companies, clients, invoices, loadBillingData, billingStats } = useBillings();

// Page info
const pageTitle = ref("Facturation");
const pageSubtitle = ref("Gestion des factures et paiements");

const billingsRef = ref<HTMLElement | null>(null);
const hiddenInvoiceRef = ref(null);
const billTemplateRef = ref(null);
const showClientModal = ref<boolean>(false);
const currentClient = ref<any>(null);
const showInvoiceModal = ref<boolean>(false);
const currentInvoice = ref<any>(null);
const currentCompany = ref<any>(null);
const showInvoiceDetails = ref<boolean>(false);

const clientHeaders = ref([
  { text: "Client", value: "companyName" },
  { text: "Email", value: "email" },
  { text: "Plan", value: "plan" },
  { text: "Prochain paiement", value: "nextPayment" },
  { text: "Statut", value: "status" },
]);

const invoiceHeaders = ref([
  { text: "Date", value: "date" },
  { text: "Client", value: "client" },
  { text: "N° Facture", value: "number" },
  { text: "Montant", value: "amount" },
  { text: "Statut", value: "status" },
]);

const invoiceItems = computed(() => {
  return currentInvoice.value?.items || [];
});

// Données pour le téléchargement de facture
const downloadInvoiceData = ref({
  company: null as any,
  client: null as any,
  invoice: null as any,
  items: [] as any[],
});

const viewClient = async (client: any) => {
  currentClient.value = client;
  showClientModal.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("form-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

const viewInvoice = async (invoice: any) => {
  currentInvoice.value = invoice;
  currentClient.value = clients.value.find((c) => c.id === invoice.clientId);
  currentCompany.value =
    companies.value.find((c) => c.id === (invoice.companyId || 1)) ||
    companies.value[0];
  showInvoiceModal.value = true;
  await new Promise((resolve) => setTimeout(resolve, 300));
  const scrollto = document.getElementById("form-modal");
  if (scrollto) {
    scrollto.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
};

// Nouvelle fonction de téléchargement améliorée
const downloadInvoice = async (invoice: any) => {
  try {
    console.log("Début du téléchargement de la facture:", invoice.number);

    // 1. Préparer les données pour le composant caché
    const invoiceClient = clients.value.find((c) => c.id === invoice.clientId);
    const invoiceCompany =
      companies.value.find((c) => c.id === (invoice.companyId || 1)) ||
      companies.value[0];

    downloadInvoiceData.value = {
      company: invoiceCompany,
      client: invoiceClient,
      invoice: invoice,
      items: invoice.items || [],
    };

    // 2. Attendre le prochain tick pour que Vue.js rende le composant
    await downloadInvoiceAsHTML(hiddenInvoiceRef);
  } catch (error) {
    console.error("Erreur lors du téléchargement de la facture:", error);
  } finally {
    // 7. Nettoyer les données
    downloadInvoiceData.value = {
      company: null,
      client: null,
      invoice: null,
      items: [],
    };
  }
};

onMounted(async () => {

  await loadBillingData()
  .then(async () => {
    if (billingsRef.value) {
      animateViewEnter(billingsRef.value);
    }
    await nextTick();
  })
  .catch((error) => {
    console.error("Error loading billing data:", error);
  });
});
</script>

<style scoped>
@import "tailwindcss";

/* Style pour le composant caché */
.hidden-invoice {
  position: absolute !important;
  left: -9999px !important;
  top: -9999px !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
</style>
