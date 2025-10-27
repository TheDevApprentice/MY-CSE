<template>
  <div class="charts-test-view">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Navigation Tabs -->
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
      >
        <nav
          class="flex space-x-8 px-6 border-b border-gray-200 dark:border-gray-700"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <!-- Stats Cards Section -->
        <div v-if="activeTab === 'stats'" class="space-y-8">
          <div
            class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
          >
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Cartes de Statistiques
              </h2>
            </div>
            <div class="p-6">
              <!-- Stats Grid -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                <StatsCard
                  v-for="(stat, index) in mockStatsCards"
                  :key="index"
                  v-bind="stat"
                  :animated="animationsEnabled"
                  :theme="globalTheme"
                  @click="handleStatsCardClick(stat)"
                  @chart-ready="handleChartReady"
                  class="hover:shadow-lg transition-transform hover:scale-[1.02]"
                />
              </div>

              <!-- Compact Stats -->
              <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3
                  class="text-xl font-semibold text-gray-800 dark:text-white mb-4"
                >
                  Version Compacte
                </h3>
                <div
                  class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                  <StatsCard
                    v-for="(stat, index) in mockStatsCards.slice(0, 4)"
                    :key="`compact-${index}`"
                    v-bind="stat"
                    variant="compact"
                    :animated="animationsEnabled"
                    :theme="globalTheme"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bar Charts Section -->
        <div v-if="activeTab === 'bar'" class="space-y-8">
          <div
            class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
          >
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Graphiques en Barres
              </h2>
            </div>
            <div class="p-6 space-y-8">
              <!-- Standard Bar Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Barres Verticales Standard
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <BarChart
                    ref="barChart1"
                    :config="mockBarData"
                    :theme="globalTheme"
                    :useGradients="useGradients"
                    @chart-ready="handleChartReady"
                    @data-click="handleDataClick"
                    @data-hover="handleDataHover"
                  />
                </div>
              </div>

              <!-- Horizontal Bar Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Barres Horizontales
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <BarChart
                    :config="mockHorizontalBarData"
                    :theme="globalTheme"
                    @chart-ready="handleChartReady"
                  />
                </div>
              </div>

              <!-- Stacked Bar Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Barres Empilées
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <BarChart
                    :config="mockStackedBarData"
                    :theme="globalTheme"
                    @chart-ready="handleChartReady"
                  />
                </div>
              </div>
            </div>

            <!-- Controls -->
            <div
              class="px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            >
              <h3
                class="text-lg font-medium text-gray-800 dark:text-white mb-3"
              >
                Contrôles
              </h3>
              <div class="flex flex-wrap gap-4">
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    v-model="useGradients"
                    class="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  Utiliser les gradients
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Line Charts Section -->
        <div v-if="activeTab === 'line'" class="space-y-8">
          <div
            class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
          >
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Graphiques en Ligne
              </h2>
            </div>
            <div class="p-6 space-y-8">
              <!-- Standard Line Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Ligne Standard avec Contrôles
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <LineChart
                    ref="lineChart1"
                    :config="mockLineData"
                    :theme="globalTheme"
                    :smooth="smoothLines"
                    :showPoints="showPoints"
                    :fillArea="fillArea"
                    :showControls="true"
                    :allowZoom="true"
                    :allowToggleAnimation="true"
                    :allowExport="true"
                    :showTrendInfo="true"
                    @chart-ready="handleChartReady"
                    @data-click="handleDataClick"
                    @zoom-change="handleZoomChange"
                    @export="handleExport"
                  />
                </div>
              </div>

              <!-- Area Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Graphique en Aire
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <LineChart
                    :config="mockAreaLineData"
                    :theme="globalTheme"
                    :fillArea="true"
                    :useGradients="useGradients"
                    @chart-ready="handleChartReady"
                  />
                </div>
              </div>

              <!-- Real-time Chart -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Données en Temps Réel
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    (Mise à jour auto toutes les 3s)
                  </span>
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <LineChart
                    ref="realTimeChart"
                    :labels="realTimeData.labels"
                    :datasets="realTimeDatasets"
                    :theme="globalTheme"
                    :smooth="true"
                    :showPoints="false"
                    @chart-ready="handleChartReady"
                  />
                </div>
              </div>
            </div>

            <!-- Controls -->
            <div
              class="px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            >
              <h3
                class="text-lg font-medium text-gray-800 dark:text-white mb-3"
              >
                Contrôles
              </h3>
              <div class="flex flex-wrap gap-4">
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    v-model="smoothLines"
                    class="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  Lignes lisses
                </label>
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    v-model="showPoints"
                    class="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  Afficher les points
                </label>
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    v-model="fillArea"
                    class="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  Remplir l'aire
                </label>
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    v-model="realTimeUpdates"
                    class="mr-2 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  />
                  Mises à jour temps réel
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie Charts Section -->
        <div v-if="activeTab === 'pie'" class="space-y-8">
          <div
            class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
          >
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Graphiques Circulaires
              </h2>
            </div>
            <div class="p-6 space-y-8">
              <!-- Standard Pie & Doughnut Charts -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Standard Pie Chart -->
                <div class="space-y-4">
                  <h3
                    class="text-lg font-medium text-gray-800 dark:text-gray-200"
                  >
                    Pie Chart Standard
                  </h3>
                  <div class="h-96 rounded-lg overflow-hidden">
                    <PieChart
                      :config="mockPieData"
                      :theme="globalTheme"
                      :showCustomLegend="false"
                      :showControls="true"
                      :allowToggleType="true"
                      :allowExport="true"
                      @chart-ready="handleChartReady"
                      @type-toggle="handleTypeToggle"
                    />
                  </div>
                </div>

                <!-- Doughnut Chart -->
                <div class="space-y-4">
                  <h3
                    class="text-lg font-medium text-gray-800 dark:text-gray-200"
                  >
                    Doughnut avec Légende
                  </h3>
                  <div class="h-96 rounded-lg overflow-hidden">
                    <PieChart
                      :config="mockDoughnutData"
                      :theme="globalTheme"
                      :showCustomLegend="true"
                      :showCenterContent="true"
                      :centerValue="totalTrafficValue"
                      centerLabel="Total"
                      legendTitle="Sources de trafic"
                      @chart-ready="handleChartReady"
                      @segment-toggle="handleSegmentToggle"
                    />
                  </div>
                </div>
              </div>

              <!-- Simple Pie Example -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Mode Simplifié (values + labels)
                </h3>
                <div class="h-96 rounded-lg overflow-hidden">
                  <PieChart
                    :labels="simpleLabels"
                    :values="simpleValues"
                    type="doughnut"
                    :cutout="40"
                    :theme="globalTheme"
                    :showChartInfo="true"
                    :colorScheme="pieColorScheme"
                    @chart-ready="handleChartReady"
                  />
                </div>
              </div>
            </div>

            <!-- Controls -->
            <div
              class="px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
            >
              <h3
                class="text-lg font-medium text-gray-800 dark:text-white mb-3"
              >
                Contrôles
              </h3>
              <div class="flex flex-wrap gap-4">
                <label
                  class="flex items-center text-gray-700 dark:text-gray-300"
                >
                  <select
                    v-model="pieColorScheme"
                    class="px-3 py-1 border border-gray-300 rounded text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="rainbow">Rainbow</option>
                    <option value="blue">Bleu</option>
                    <option value="green">Vert</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Section -->
        <div v-if="activeTab === 'interactive'" class="space-y-8">
          <div
            class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800"
          >
            <div
              class="px-6 py-5 border-b border-gray-200 dark:border-gray-700"
            >
              <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
                Tests Interactifs
              </h2>
            </div>
            <div class="p-6 space-y-8">
              <!-- Dynamic Data -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Données Dynamiques
                </h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">
                      Contrôles
                    </h4>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nombre de points: {{ dynamicDataPoints }}
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        v-model="dynamicDataPoints"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Amplitude: {{ dynamicAmplitude }}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        v-model="dynamicAmplitude"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                  </div>
                  <div class="h-64 rounded-lg overflow-hidden">
                    <LineChart
                      ref="dynamicChart"
                      :labels="dynamicLabels"
                      :datasets="dynamicDatasets"
                      :theme="globalTheme"
                      :smooth="true"
                      @chart-ready="handleChartReady"
                    />
                  </div>
                </div>
              </div>

              <!-- Performance Test -->
              <div class="space-y-4">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Test de Performance
                </h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">
                      Large Dataset ({{ largeDatasetSize }} points)
                    </h4>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Taille du dataset: {{ largeDatasetSize }}
                      </label>
                      <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        v-model="largeDatasetSize"
                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                    </div>
                    <div
                      v-if="performanceResults"
                      class="text-sm text-gray-600 dark:text-gray-400"
                    >
                      <p>
                        Temps de génération:
                        {{ performanceResults.generationTime }}ms
                      </p>
                      <p>
                        Temps de rendu: {{ performanceResults.renderTime }}ms
                      </p>
                    </div>
                  </div>
                  <div class="h-64 rounded-lg overflow-hidden">
                    <LineChart
                      ref="performanceChart"
                      :labels="largeLabels"
                      :datasets="largeDatasets"
                      :theme="globalTheme"
                      :showPoints="false"
                      @chart-ready="handlePerformanceChartReady"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Event Log -->
        <div
          v-if="showEventLog"
          class="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800 mt-8"
        >
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
          >
            <h3 class="text-lg font-medium text-gray-800 dark:text-white">
              Journal des Événements
            </h3>
            <button
              @click="clearEventLog"
              class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Effacer
            </button>
          </div>
          <div class="p-4">
            <div class="max-h-64 overflow-y-auto space-y-2">
              <div
                v-for="(event, index) in eventLog"
                :key="index"
                class="text-sm font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <span class="text-gray-500 dark:text-gray-400">{{
                  event.timestamp
                }}</span>
                <span
                  class="ml-2 font-medium text-gray-800 dark:text-gray-200"
                  >{{ event.type }}</span
                >
                <span class="ml-2 text-gray-600 dark:text-gray-300">{{
                  event.details
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Toggle Event Log Button -->
        <div class="fixed bottom-4 right-4">
          <button
            @click="showEventLog = !showEventLog"
            class="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>{{ showEventLog ? "📝" : "👁️" }}</span>
            <span class="text-sm">Events</span>
          </button>
        </div>

        <!-- Other tabs will be added here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { BarChart, LineChart, PieChart, StatsCard } from "@components/common/ui/charts";
import {
  mockBarData,
  mockHorizontalBarData,
  mockStackedBarData,
  mockLineData,
  mockAreaLineData,
  mockPieData,
  mockDoughnutData,
  mockStatsCards,
  generateRealTimeData,
  testDatasets,
} from "@components/common/ui/charts/constants/MockDataCharts";
import { useTheme } from "@/composables/useTheme";

const isDark = useTheme();
// Global state
const activeTab = ref("stats");
const globalTheme = ref<"auto" | "light" | "dark">(isDark ? "dark" : "light");
const animationsEnabled = ref(true);
const showEventLog = ref(false);
const eventLog = ref<
  Array<{ timestamp: string; type: string; details: string }>
>([]);

// Chart controls
const useGradients = ref(false);
const smoothLines = ref(true);
const showPoints = ref(true);
const fillArea = ref(false);
const realTimeUpdates = ref(true);
const pieColorScheme = ref<"rainbow" | "blue" | "green" | "auto">("rainbow");

// Dynamic data
const dynamicDataPoints = ref(20);
const dynamicAmplitude = ref(50);
const responseTime = ref(245);

// Performance testing
const largeDatasetSize = ref(1000);
const performanceResults = ref<{
  generationTime: number;
  renderTime: number;
} | null>(null);

// Real-time data
const realTimeData = ref(generateRealTimeData());
const realTimeInterval = ref<number | null>(null);

// Navigation tabs
const tabs = [
  { id: "stats", label: "Stats Cards" },
  { id: "bar", label: "Graphiques Barres" },
  { id: "line", label: "Graphiques Ligne" },
  { id: "pie", label: "Graphiques Circulaires" },
  { id: "interactive", label: "Tests Interactifs" },
];

// Simple pie data
const simpleLabels = ref([
  "Frontend",
  "Backend",
  "DevOps",
  "Design",
  "Marketing",
]);
const simpleValues = ref([45, 30, 15, 7, 3]);

// Computed properties
const realTimeDatasets = computed(() => [
  {
    label: "Données temps réel",
    data: realTimeData.value.data,
    borderColor: "rgb(59, 130, 246)",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    tension: 0.4,
    fill: true,
  },
]);

const totalTrafficValue = computed(() => {
  const values = mockDoughnutData.data?.datasets?.[0]?.data || [];
  return values.reduce((sum: number, val) => sum + (val as number), 0);
});

const dynamicLabels = computed(() =>
  Array.from({ length: Number(dynamicDataPoints.value) }, (_, i) => `P${i + 1}`)
);

const dynamicDatasets = computed(() => [
  {
    label: "Données dynamiques",
    data: Array.from({ length: Number(dynamicDataPoints.value) }, () =>
      Math.floor(Math.random() * Number(dynamicAmplitude.value))
    ),
    borderColor: "rgb(168, 85, 247)",
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    tension: 0.4,
  },
]);

const largeLabels = ref<string[]>([]);
const largeDatasets = ref<any[]>([]);

// Methods
const addEvent = (type: string, details: string) => {
  eventLog.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    type,
    details,
  });

  // Garder seulement les 50 derniers événements
  if (eventLog.value.length > 50) {
    eventLog.value = eventLog.value.slice(0, 50);
  }
};

const handleChartReady = (chart: any) => {
  addEvent("CHART_READY", `Chart initialisé (${chart.config.type})`);
};

const handleDataClick = (event: any, elements: any[], data: any) => {
  if (data) {
    addEvent("DATA_CLICK", `Clic sur: ${data.label} = ${data.value}`);
  }
};

const handleDataHover = (event: any, elements: any[], data: any) => {
  if (data) {
    addEvent("DATA_HOVER", `Survol: ${data.label} = ${data.value}`);
  }
};

const handleStatsCardClick = (stat: any) => {
  addEvent("STATS_CLICK", `Carte cliquée: ${stat.title}`);
};

const handleZoomChange = (zoomLevel: number) => {
  addEvent("ZOOM", `Niveau de zoom: ${zoomLevel}`);
};

const handleExport = (format: string, data: string) => {
  addEvent("EXPORT", `Graphique exporté en ${format}`);
};

const handleTypeToggle = (type: "pie" | "doughnut") => {
  addEvent("TYPE_TOGGLE", `Type changé vers: ${type}`);
};

const handleSegmentToggle = (index: number, visible: boolean) => {
  addEvent(
    "SEGMENT_TOGGLE",
    `Segment ${index} ${visible ? "affiché" : "masqué"}`
  );
};

const refreshRealTimeData = () => {
  realTimeData.value = generateRealTimeData();
  responseTime.value = Math.floor(Math.random() * 500) + 100;
  addEvent("REALTIME", "Données temps réel actualisées");
};

const handlePerformanceChartReady = (chart: any) => {
  if (performanceResults.value) {
    const renderTime = Math.round(
      performance.now() -
        (performance.now() - (performanceResults.value.generationTime || 0))
    );
    performanceResults.value.renderTime = renderTime;
    addEvent("PERFORMANCE", `Chart rendu en ${renderTime}ms`);
  }
};

const clearEventLog = () => {
  eventLog.value = [];
};

// Real-time updates
const startRealTimeUpdates = () => {
  if (realTimeInterval.value) return;

  realTimeInterval.value = window.setInterval(() => {
    if (realTimeUpdates.value) {
      refreshRealTimeData();
    }
  }, 3000);
};

const stopRealTimeUpdates = () => {
  if (realTimeInterval.value) {
    clearInterval(realTimeInterval.value);
    realTimeInterval.value = null;
  }
};

// Lifecycle
onMounted(() => {
  addEvent("MOUNT", "TestView montée");
  startRealTimeUpdates();
  //   generateLargeDataset();
});

onUnmounted(() => {
  stopRealTimeUpdates();
  addEvent("UNMOUNT", "TestView démontée");
});
</script>

<style scoped>
.charts-test-view {
  min-height: 100vh;
  background-color: #f9fafb;
}

.test-header {
  backdrop-filter: blur(10px);
}

/* Scrollbar pour le log d'événements */
.max-h-48::-webkit-scrollbar {
  width: 6px;
}

.max-h-48::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-48::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animations pour les cartes */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-card {
  animation: slideIn 0.3s ease-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .test-header .flex {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .lg\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .charts-test-view {
    background-color: #111827;
  }

  .bg-white {
    background-color: #1f2937 !important;
    color: #f9fafb;
  }

  .text-gray-900 {
    color: #f9fafb !important;
  }

  .text-gray-600 {
    color: #d1d5db !important;
  }

  .border {
    border-color: #374151 !important;
  }
}
</style>
