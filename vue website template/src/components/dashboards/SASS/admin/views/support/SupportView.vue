<!-- components/dashboards/SASS/admin/views/support/SupportView.vue -->
<template>
  <div id="support-view" href="#support-view" class="view" ref="supportRef">
    <div class="view-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <div
      id="support-content"
      href="#support-content"
      class="content"
      ref="supportRef"
    >
      <!-- Cartes de statistiques -->
      <div id="stats-grid" href="#stats-grid" class="stats-grid">
        <StatsCard
          v-for="(stat, index) in supportStats"
          :key="index"
          v-bind="stat"
          class="hover:shadow-lg transition-transform hover:scale-[1.02]"
        />
      </div>

      <!-- Graphiques principaux -->
      <div id="charts-section" href="#charts-section" class="charts-section">
        <div
          id="chart-container"
          href="#chart-container"
          class="chart-container"
        >
          <div id="chart-header" href="#chart-header" class="chart-header">
            <h3 class="chart-title">Évolution des tickets</h3>
            <div class="chart-filters">
              <button
                v-for="period in chartPeriods"
                :key="period.value"
                @click="selectedPeriod = period.value"
                class="filter-btn"
                :class="{ active: selectedPeriod === period.value }"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="chart-content">
            <LineChart
              theme="auto"
              :labels="chartLabels"
              :datasets="supportLineChartData"
              :useGradients="true"
            />
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Répartition par priorité</h3>
          </div>
          <div class="chart-content">
            <BarChart
              theme="auto"
              :labels="['Basse', 'Moyenne', 'Haute', 'Critique']"
              :datasets="supportBarChartData"
            />
          </div>
        </div>
      </div>

      <!-- Tableau des tickets récents -->
      <div id="table-container" href="#table-container" class="table-container">
        <div class="table-header">
          <h3 class="table-title">Tickets récents</h3>
        </div>
        <div class="table-content">
          <DataTable
            :headers="ticketHeaders"
            :items="supportTickets"
            :show-actions="true"
            :actions="[{ name: 'view', handler: viewTicket }]"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de visualisation du ticket -->
  <FormModal
    href="#ticket-modal"
    v-model:show="showTicketModal"
    :title="`Ticket #${currentTicket?.id || ''}`"
    submit-text="Fermer"
    cancel-text=""
    cancel-visible="false"
    @submit="showTicketModal = false"
    width="max-w-2xl"
  >
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="text-sm font-medium text-gray-500">Sujet</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentTicket?.subject }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Client</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentTicket?.client }}
          </p>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Statut</h4>
          <span
            class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusColor(currentTicket?.status)"
          >
            {{ currentTicket?.status }}
          </span>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Priorité</h4>
          <span
            class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getPriorityColor(currentTicket?.priority)"
          >
            {{ currentTicket?.priority }}
          </span>
        </div>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Date</h4>
          <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
            {{ currentTicket?.date }}
          </p>
        </div>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-500">Description</h4>
        <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui
          mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor
          neque eu tellus rhoncus ut eleifend nibh porttitor.
        </p>
      </div>
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import StatsCard from "@/components/common/ui/charts/StatsCard.vue";
import LineChart from "@/components/common/ui/charts/LineChart.vue";
import BarChart from "@/components/common/ui/charts/BarChart.vue";
import DataTable from "@/components/common/ui/tables/DataTable.vue";
import FormModal from "@/components/common/ui/modals/FormModal.vue";
import { useView } from "@/components/dashboards/SASS/admin/composables/useView";
import { chartPeriods, useChartLabels } from "@/utils/chartUtils";
import { getPriorityColor, getStatusColor } from "../../utils/supportColor";
import { AdminView } from "@/components/dashboards/SASS/admin/types/admin";
import { useSupport } from '../../composables/useSupport';

const { animateViewEnter } = useView([AdminView.SUPPORT]);

// State
const selectedPeriod = ref<string>("week");
const chartLabels = useChartLabels(selectedPeriod);

const supportRef = ref<HTMLElement | null>(null);

// Page info
const pageTitle = ref("Support");
const pageSubtitle = ref("Gestion des tickets et demandes");

const { 
  supportTickets, 
  supportStats, 
  supportLineChartData,
  supportBarChartData,
  loadSupportData 
} = useSupport();

// Table data
const ticketHeaders = ref([
  { text: "Sujet", value: "subject" },
  { text: "Client", value: "client" },
  { text: "Statut", value: "status" },
  { text: "Priorité", value: "priority" },
  { text: "Date", value: "date" },
]);

const showTicketModal = ref(false);
const currentTicket = ref<any>(null);

const viewTicket = async (ticket: any) => {
  currentTicket.value = ticket;
  showTicketModal.value = true;
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

// Lifecycle
onMounted(async () => {
  await loadSupportData()
  .then(async () => {
    if (supportRef.value) {
      animateViewEnter(supportRef.value);
    }
    await nextTick();
  })  
  .catch((error) => {
    console.error("Error loading support data:", error);
  });
});
</script>

<style scoped>
@import "tailwindcss";
</style>
