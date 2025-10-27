<!-- components/common/charts/PieChart.vue -->
<template>
  <div
    class="pie-chart-container"
    :class="[className, { 'is-loading': loading }]"
  >
    <!-- Loading state -->
    <div v-if="loading" class="chart-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Chargement du graphique...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="chart-error">
      <div class="error-icon">⚠️</div>
      <span class="error-text">{{ error }}</span>
    </div>

    <!-- Chart canvas -->
    <canvas
      v-else
      ref="chartCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    ></canvas>

    <!-- Chart center content (for doughnut) -->
    <div
      v-if="showCenterContent && isDoughnut && chartInstance"
      class="chart-center-content"
      :style="centerContentStyle"
    >
      <div class="center-value">{{ centerValue }}</div>
      <div class="center-label">{{ centerLabel }}</div>
    </div>

    <!-- Chart legend (custom) -->
    <div v-if="showCustomLegend && chartInstance" class="custom-legend">
      <div class="legend-title" v-if="legendTitle">{{ legendTitle }}</div>
      <div class="legend-items">
        <div
          v-for="(item, index) in legendItems"
          :key="index"
          class="legend-item"
          :class="{ 'legend-item-hidden': item.hidden }"
          @click="toggleDataset(index)"
        >
          <div
            class="legend-color"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">
            {{ formatValue(item.value) }}
            <span class="legend-percentage">({{ item.percentage }}%)</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Chart controls -->
    <div v-if="showControls && chartInstance" class="chart-controls">
      <button
        v-if="allowToggleAnimation"
        @click="toggleAnimation"
        class="control-button"
        title="Activer/Désactiver les animations"
      >
        {{ animationEnabled ? "⏸️" : "▶️" }}
      </button>
      <button
        v-if="allowExport"
        @click="downloadChart"
        class="control-button"
        title="Télécharger le graphique"
      >
        💾
      </button>
      <button
        v-if="allowToggleType"
        @click="toggleChartType"
        class="control-button"
        title="Basculer entre pie et doughnut"
      >
        🍩
      </button>
    </div>

    <!-- Chart stats overlay -->
    <div v-if="showChartInfo && chartInstance" class="chart-info">
      <div
        class="chart-title"
        v-if="finalConfig.options?.plugins?.title?.display"
      >
        {{ finalConfig.options.plugins.title.text }}
      </div>
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">Total:</span>
          <span class="stat-value">{{ formatValue(totalValue) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Segments:</span>
          <span class="stat-value">{{ chartData.length }}</span>
        </div>
        <div class="stat-item" v-if="largestSegment">
          <span class="stat-label">Plus grand:</span>
          <span class="stat-value"
            >{{ largestSegment.label }} ({{ largestSegment.percentage }}%)</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  shallowRef,
} from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  PieController, // ← AJOUTÉ
  DoughnutController, // ← AJOUTÉ
  Tooltip,
  Legend,
  Title,
  type Chart,
  type ChartConfiguration,
  type ChartData,
  type ChartOptions,
} from "chart.js";

import type {
  PieChartConfig,
  ChartEvents,
  DatasetConfig,
  createGradient,
  GradientConfig,
} from "./types/types";
import { CHART_COLORS, CHART_COLORS_ALPHA } from "./types/types";
// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  ArcElement,
  PieController, // ← AJOUTÉ
  DoughnutController, // ← AJOUTÉ
  Tooltip,
  Legend,
  Title
);

// Props
interface Props extends PieChartConfig, ChartEvents {
  // Configuration spécifique aux graphiques circulaires
  config?: PieChartConfig;

  // Données alternatives (si pas dans config)
  labels?: string[];
  datasets?: DatasetConfig[];
  values?: number[]; // Pour simplifier: juste un array de valeurs

  // Options d'affichage
  loading?: boolean;
  error?: string;
  showChartInfo?: boolean;
  showCenterContent?: boolean;
  showCustomLegend?: boolean;
  showControls?: boolean;

  // Center content (pour doughnut)
  centerValue?: string | number;
  centerLabel?: string;

  // Legend customization
  legendTitle?: string;
  legendPosition?: "top" | "bottom" | "left" | "right" | "custom";

  // Controls
  allowToggleAnimation?: boolean;
  allowExport?: boolean;
  allowToggleType?: boolean;

  // Pie-specific options
  startAngle?: number;
  enableHover?: boolean;
  hoverOffset?: number;
  borderWidth?: number;
  spacing?: number;

  // Styling
  theme?: "light" | "dark" | "auto";
  colorScheme?: keyof typeof CHART_COLORS | "auto" | "rainbow";

  // Gradient support
  useGradients?: boolean;
  gradientConfig?: GradientConfig;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  maintainAspectRatio: true,
  responsive: true,
  loading: false,
  showChartInfo: false,
  showCenterContent: false,
  showCustomLegend: false,
  showControls: false,
  allowToggleAnimation: false,
  allowExport: false,
  allowToggleType: false,
  theme: "auto",
  colorScheme: "rainbow",
  useGradients: false,
  type: "doughnut",
  cutout: 50,
  radius: undefined,
  rotation: 0,
  circumference: 360,
  legendPosition: "top",
  startAngle: 0,
  enableHover: true,
  hoverOffset: 4,
  borderWidth: 0,
  spacing: 0,
  centerValue: "",
  centerLabel: "",
  className: "",
  ariaLabel: "Graphique circulaire",
  ariaDescription: "Graphique circulaire interactif",
});

// Emits
const emit = defineEmits<{
  "chart-ready": [chart: Chart];
  "chart-destroy": [];
  "chart-update": [chart: Chart];
  "chart-resize": [chart: Chart, size: { width: number; height: number }];
  "data-click": [event: any, elements: any[], data: any];
  "data-hover": [event: any, elements: any[], data: any];
  "dataset-hover": [event: any, datasetIndex: number];
  "dataset-click": [event: any, datasetIndex: number];
  "animation-toggle": [enabled: boolean];
  export: [format: string, data: string];
  "type-toggle": [type: "pie" | "doughnut"];
  "segment-toggle": [index: number, visible: boolean];
}>();

// Refs
const chartCanvas = ref<HTMLCanvasElement>();
const chartInstance = shallowRef<Chart | null>(null);
const animationEnabled = ref(true);
const currentType = ref<"pie" | "doughnut">(props.type || "doughnut");

// Computed properties
const canvasWidth = computed(() => props.width || undefined);
const canvasHeight = computed(() => props.height || undefined);

const isDoughnut = computed(() => currentType.value === "doughnut");

const datasets = computed(() => {
  if (props.values && props.labels) {
    // Mode simplifié: créer un dataset à partir des valeurs
    return [
      {
        data: props.values,
        backgroundColor: generateColors(props.values.length),
        borderColor: generateBorderColors(props.values.length),
        borderWidth: props.borderWidth,
      },
    ];
  }
  return props.config?.data?.datasets || props.datasets || [];
});

const labels = computed(() => {
  return props.config?.data?.labels || props.labels || [];
});

const chartData = computed(() => {
  if (!datasets.value.length || !datasets.value[0].data.length) return [];

  const data = datasets.value[0].data;
  const backgroundColors = datasets.value[0].backgroundColor as string[];

  return labels.value.map((label, index) => ({
    label,
    value: data[index] as number,
    color: Array.isArray(backgroundColors)
      ? backgroundColors[index]
      : backgroundColors,
    percentage: (((data[index] as number) / totalValue.value) * 100).toFixed(1),
    hidden: false,
  }));
});

const totalValue = computed(() => {
  if (!datasets.value.length || !datasets.value[0].data.length) return 0;
  return datasets.value[0].data.reduce(
    (sum, value) => sum + (value as number),
    0
  );
});

const largestSegment = computed(() => {
  if (!chartData.value.length) return null;

  const largest = chartData.value.reduce((max, current) =>
    current.value > max.value ? current : max
  );

  return largest;
});

const legendItems = computed(() => chartData.value);

const centerContentStyle = computed(() => {
  if (!chartCanvas.value) return {};

  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  };
});

// Génération automatique des couleurs
const generateColors = (count: number): string[] => {
  if (props.colorScheme === "rainbow") {
    return Array.from({ length: count }, (_, i) => {
      const hue = (i * 360) / count;
      return `hsl(${hue}, 70%, 60%)`;
    });
  }

  const colorKeys = Object.keys(CHART_COLORS || {});
  return Array.from({ length: count }, (_, i) => {
    const colorKey = colorKeys[
      i % colorKeys.length
    ] as keyof typeof CHART_COLORS;
    return CHART_COLORS?.[colorKey] || "#3B82F6";
  });
};

const generateBorderColors = (count: number): string[] => {
  return Array.from({ length: count }, () => "#ffffff");
};

// Configuration finale du graphique
const finalConfig = computed<ChartConfiguration<"pie" | "doughnut">>(() => {
  const baseConfig: ChartConfiguration<"pie" | "doughnut"> = {
    type: currentType.value,
    data: {
      labels: labels.value,
      datasets: processedDatasets.value,
    },
    options: {
      responsive: props.responsive,
      maintainAspectRatio: props.maintainAspectRatio,
      plugins: {
        legend: {
          display: !props.showCustomLegend && props.legendPosition !== "custom",
          position:
            props.legendPosition === "custom" ? "top" : props.legendPosition,
          labels: {
            usePointStyle: true,
            padding: 20,
            color: "rgba(0, 0, 0, 0.7)",
            font: {
              size: 12,
            },
            generateLabels: (chart) => {
              const datasets = chart.data.datasets;
              if (!datasets.length) return [];

              const dataset = datasets[0];
              return dataset.data.map((value, index) => ({
                text: `${chart.data.labels?.[index]} (${formatValue(
                  value as number
                )})`,
                fillStyle: Array.isArray(dataset.backgroundColor)
                  ? dataset.backgroundColor[index]
                  : dataset.backgroundColor,
                strokeStyle: Array.isArray(dataset.borderColor)
                  ? dataset.borderColor[index]
                  : dataset.borderColor,
                lineWidth: dataset.borderWidth as number,
                hidden: false,
                index,
              }));
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          padding: 12,
          callbacks: {
            title: (tooltipItems) => {
              return tooltipItems[0]?.label || "";
            },
            label: (context) => {
              const value = context.parsed;
              const percentage = ((value / totalValue.value) * 100).toFixed(1);
              return `${formatValue(value)} (${percentage}%)`;
            },
            afterLabel: (context) => {
              const index = context.dataIndex;
              const rank =
                chartData.value
                  .map((item, i) => ({ ...item, originalIndex: i }))
                  .sort((a, b) => b.value - a.value)
                  .findIndex((item) => item.originalIndex === index) + 1;
              return `Rang: ${rank}/${chartData.value.length}`;
            },
          },
        },
        title: {
          display: !!props.title,
          text: props.title,
          color: "rgba(0, 0, 0, 0.8)",
          font: {
            size: 16,
            weight: "bold",
          },
          padding: 20,
        },
      },
      animation: animationEnabled.value
        ? {
            animateRotate: true,
            animateScale: false,
            duration: 1000,
            easing: "easeInOutCubic",
          }
        : false,
      hover: {
        mode: "nearest",
        intersect: true,
      },
      elements: {
        arc: {
          borderWidth: props.borderWidth,
          hoverBorderWidth: props.borderWidth + 1,
          hoverOffset: props.enableHover ? props.hoverOffset : 0,
        },
      },
      // Options spécifiques au type
      ...(isDoughnut.value && {
        cutout:
          typeof props.cutout === "string" ? props.cutout : `${props.cutout}%`,
      }),
      radius: props.radius,
      rotation: (props.rotation * Math.PI) / 180,
      circumference: (props.circumference * Math.PI) / 180,
      spacing: props.spacing,
      onClick: handleChartClick,
      onHover: handleChartHover,
    },
    plugins: props.plugins || [],
  };

  // Merge avec la configuration personnalisée
  if (props.config?.options) {
    return mergeConfigurations(
      baseConfig,
      props.config as ChartConfiguration<"pie" | "doughnut">
    );
  }

  // Merge avec les options individuelles
  if (props.options) {
    baseConfig.options = mergeDeep(baseConfig.options || {}, props.options);
  }

  return baseConfig;
});

// Datasets traités avec couleurs et gradients
const processedDatasets = computed(() => {
  return datasets.value.map((dataset, index) => {
    const processedDataset = { ...dataset };

    // Application automatique des couleurs si non spécifiées
    if (!dataset.backgroundColor) {
      const colors = generateColors(dataset.data.length);

      if (props.useGradients && chartCanvas.value) {
        try {
          processedDataset.backgroundColor = colors.map((color) => {
            const gradientConfig: GradientConfig = props.gradientConfig || {
              start: color,
              end: adjustColorBrightness(color, -20),
              direction: "vertical",
            };
            return createGradient?.(chartCanvas.value!, gradientConfig);
          });
        } catch {
          processedDataset.backgroundColor = colors;
        }
      } else {
        processedDataset.backgroundColor = colors;
      }
    }

    if (!dataset.borderColor) {
      processedDataset.borderColor = generateBorderColors(dataset.data.length);
    }

    processedDataset.borderWidth = props.borderWidth;
    processedDataset.spacing = props.spacing;

    return processedDataset;
  });
});

// Méthodes utilitaires
const formatValue = (value: number): string => {
  if (typeof value !== "number") return String(value);

  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toLocaleString();
};

const adjustColorBrightness = (color: string, amount: number): string => {
  // Simple brightness adjustment for gradients
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const B = ((num >> 8) & 0x00ff) + amt;
  const G = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
      (G < 255 ? (G < 1 ? 0 : G) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

const isObject = (item: any): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const mergeConfigurations = (
  base: ChartConfiguration<"pie" | "doughnut">,
  custom: ChartConfiguration<"pie" | "doughnut">
): ChartConfiguration<"pie" | "doughnut"> => {
  return {
    ...base,
    ...custom,
    data: {
      ...base.data,
      ...custom.data,
      datasets: custom.data?.datasets || base.data?.datasets || [],
    },
    options: mergeDeep(base.options || {}, custom.options || {}),
  };
};

// Event handlers
const handleChartClick = (event: any, elements: any[]) => {
  if (elements.length > 0) {
    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const dataIndex = element.index;
    const dataset = finalConfig.value.data.datasets[datasetIndex];
    const data = {
      datasetIndex,
      dataIndex,
      dataset,
      value: dataset.data[dataIndex],
      label: finalConfig.value.data.labels?.[dataIndex],
      percentage: chartData.value[dataIndex]?.percentage,
    };

    emit("data-click", event, elements, data);

    if (props.onElementClick) {
      props.onElementClick(event, elements);
    }
  }
};

const handleChartHover = (event: any, elements: any[]) => {
  if (elements.length > 0) {
    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const dataIndex = element.index;
    const dataset = finalConfig.value.data.datasets[datasetIndex];
    const data = {
      datasetIndex,
      dataIndex,
      dataset,
      value: dataset.data[dataIndex],
      label: finalConfig.value.data.labels?.[dataIndex],
      percentage: chartData.value[dataIndex]?.percentage,
    };

    emit("data-hover", event, elements, data);

    if (props.onElementHover) {
      props.onElementHover(event, elements);
    }
  }
};

const handleClick = (event: MouseEvent) => {
  // Délégué à Chart.js
};

const handleMouseMove = (event: MouseEvent) => {
  // Délégué à Chart.js
};

const handleMouseLeave = (event: MouseEvent) => {
  // Reset hover state
};

// Control methods
const toggleAnimation = () => {
  animationEnabled.value = !animationEnabled.value;
  emit("animation-toggle", animationEnabled.value);
  updateChart();
};

const toggleChartType = () => {
  currentType.value = currentType.value === "pie" ? "doughnut" : "pie";
  emit("type-toggle", currentType.value);
  initChart();
};

const toggleDataset = (index: number) => {
  if (chartInstance.value) {
    chartInstance.value.toggleDataVisibility(index);
    chartInstance.value.update();
    emit("segment-toggle", index, chartInstance.value.isDatasetVisible(index));
  }
};

const downloadChart = () => {
  if (chartInstance.value) {
    const url = chartInstance.value.toBase64Image("image/png", 1);
    const link = document.createElement("a");
    link.download = `pie-chart-${Date.now()}.png`;
    link.href = url;
    link.click();
    emit("export", "png", url);
  }
};

// Méthodes publiques
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.update();
    emit("chart-update", chartInstance.value);
  }
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
    const size = {
      width: chartInstance.value.width,
      height: chartInstance.value.height,
    };
    emit("chart-resize", chartInstance.value, size);
  }
};

const exportChart = (format: "png" | "jpeg" = "png", quality = 1) => {
  if (chartInstance.value) {
    return chartInstance.value.toBase64Image(`image/${format}`, quality);
  }
  return null;
};

const highlightSegment = (index: number) => {
  if (chartInstance.value) {
    chartInstance.value.setActiveElements([{ datasetIndex: 0, index }]);
    chartInstance.value.update("none");
  }
};

const resetHighlight = () => {
  if (chartInstance.value) {
    chartInstance.value.setActiveElements([]);
    chartInstance.value.update("none");
  }
};

// Lifecycle
const initChart = async () => {
  if (!chartCanvas.value) return;

  try {
    // Détruire l'instance existante
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    // Créer la nouvelle instance
    chartInstance.value = new ChartJS(chartCanvas.value, finalConfig.value);

    // Accessibility
    if (props.ariaLabel) {
      chartCanvas.value.setAttribute("aria-label", props.ariaLabel);
    }
    if (props.ariaDescription) {
      chartCanvas.value.setAttribute("aria-description", props.ariaDescription);
    }
    chartCanvas.value.setAttribute("role", "img");

    emit("chart-ready", chartInstance.value);

    if (props.onChartReady) {
      props.onChartReady(chartInstance.value);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation du graphique:", error);
    emit("chart-destroy");
  }
};

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
    emit("chart-destroy");

    if (props.onChartDestroy) {
      props.onChartDestroy();
    }
  }
};

// Watchers
watch(
  [
    () => props.config,
    () => props.data,
    () => props.datasets,
    () => props.labels,
    () => props.values,
    () => props.options,
  ],
  async () => {
    await nextTick();
    if (chartInstance.value) {
      updateChart();
    } else {
      initChart();
    }
  },
  { deep: true }
);

watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      nextTick(initChart);
    }
  }
);

// Hooks
onMounted(() => {
  if (!props.loading) {
    nextTick(initChart);
  }
});

onUnmounted(() => {
  destroyChart();
});

// Expose des méthodes publiques
defineExpose({
  updateChart,
  resizeChart,
  exportChart,
  toggleDataset,
  highlightSegment,
  resetHighlight,
  toggleAnimation,
  toggleChartType,
  chart: chartInstance,
});
</script>

<style scoped>
.pie-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pie-chart-container.is-loading {
  justify-content: center;
}

.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text,
.error-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.error-icon {
  font-size: 2rem;
}

.chart-error {
  color: #ef4444;
}

.chart-center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.center-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #374151;
  line-height: 1;
}

.center-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.chart-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.chart-info {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.75rem;
  color: #6b7280;
  pointer-events: none;
  min-width: 140px;
}

.chart-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.chart-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #374151;
}

.custom-legend {
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
}

.legend-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  text-align: center;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-item-hidden {
  opacity: 0.5;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.legend-value {
  font-weight: 600;
  color: #374151;
}

.legend-percentage {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.25rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .pie-chart-container {
    min-height: 250px;
  }

  .chart-info {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 1rem;
    display: inline-block;
  }

  .chart-controls {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 1rem;
    justify-content: center;
  }

  .custom-legend {
    max-width: 100%;
  }

  .legend-items {
    max-height: 200px;
    overflow-y: auto;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .chart-info {
    background: rgba(31, 41, 55, 0.95);
    color: #d1d5db;
  }

  .chart-title,
  .stat-value,
  .legend-label,
  .legend-value {
    color: #f9fafb;
  }

  .center-value {
    color: #f9fafb;
  }

  .center-label {
    color: #d1d5db;
  }

  .control-button {
    background: rgba(31, 41, 55, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }

  .control-button:hover {
    background: rgba(31, 41, 55, 1);
  }

  .legend-item {
    background: rgba(31, 41, 55, 0.5);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .legend-item:hover {
    background: rgba(31, 41, 55, 0.8);
  }
}

/* Focus styles for accessibility */
.pie-chart-container canvas:focus,
.control-button:focus,
.legend-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
