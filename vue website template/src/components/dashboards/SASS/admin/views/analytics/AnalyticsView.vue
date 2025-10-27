<!-- components/dashboards/SASS/admin/views/analytics/analyticsView.vue -->
<template>
  <div
    id="analytics-view"
    href="#analytics-view"
    class="view"
    ref="analyticsRef"
  >
    <div id="view-header" href="#view-header" class="view-header">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <p class="page-subtitle">{{ pageSubtitle }}</p>
    </div>

    <div
      id="analytics-content"
      href="#analytics-content"
      class="content"
      ref="analyticsRef"
    >
      <!-- Cartes de statistiques -->
      <div id="stats-grid" href="#stats-grid" class="stats-grid">
        <StatsCard
          v-for="(stat, index) in analyticsStats"
          :key="index"
          v-bind="stat"
          class="hover:shadow-lg transition-transform hover:scale-[1.02]"
        />
      </div>

      <!-- Graphiques principaux -->
      <div id="charts-section" href="#charts-section" class="charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Trafic mensuel</h3>
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
              :datasets="analyticsChartData"
              :useGradients="true"
            />
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3 class="chart-title">Répartition par catégorie</h3>
          </div>
          <div class="chart-content">
            <BarChart
              theme="auto"
              :labels="['Mobile', 'Desktop', 'Tablette']"
              :datasets="analyticsBarChartData"
            />
          </div>
        </div>
      </div>

      <!-- Tableau des pages les plus visitées -->
      <div id="table-container" href="#table-container" class="table-container">
        <div id="table-header" href="#table-header" class="table-header">
          <h3 class="table-title">Pages les plus visitées</h3>
        </div>
        <div id="table-content" href="#table-content" class="table-content">
          <DataTable :headers="pageHeaders" :items="topPages" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import StatsCard from "@/components/common/ui/charts/StatsCard.vue";
import LineChart from "@/components/common/ui/charts/LineChart.vue";
import BarChart from "@/components/common/ui/charts/BarChart.vue";
import DataTable from "@/components/common/ui/tables/DataTable.vue";
import { useView } from "@/components/dashboards/SASS/admin/composables/useView";
import { AdminView } from "@/components/dashboards/SASS/admin/types/admin";
import { chartPeriods, useChartLabels } from "@/utils/chartUtils";
import { useAnalytics } from "@/components/dashboards/SASS/admin/composables/useAnalytics";

// Utilisation du composable useView
const { animateViewEnter } = useView([AdminView.ANALYTICS]);
const { analyticsStats, topPages, analyticsChartData, analyticsBarChartData, loadAnalyticsData } =
  useAnalytics();

// Page info
const pageTitle = ref("Analytics");
const pageSubtitle = ref("Statistiques et analyses");

// State
const selectedPeriod = ref<string>("week");
const chartLabels = useChartLabels(selectedPeriod);
const analyticsRef = ref<HTMLElement | null>(null);

// Table data
const pageHeaders = ref([
  { text: "Page", value: "page" },
  { text: "Visites", value: "visits" },
  { text: "Durée moyenne", value: "avgDuration" },
  { text: "Taux de rebond", value: "bounceRate" },
]);

// Lifecycle
onMounted(async () => {
  await loadAnalyticsData()
  .then(async () => {
    if (analyticsRef.value) {
      animateViewEnter(analyticsRef.value);
    }
    await nextTick();
  })
  .catch((error) => {
    console.error("Error loading analytics data:", error);
  });
});
</script>

<style scoped>
@import "tailwindcss";
</style>
