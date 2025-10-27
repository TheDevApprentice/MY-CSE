// components/common/MockDataCharts.ts

import type {
  BarChartConfig,
  LineChartConfig,
  PieChartConfig,
  StatsCardConfig,
  DatasetConfig,
} from "../types/types";

// Données pour les graphiques en barres
export const mockBarData: BarChartConfig = {
  title: "Ventes par trimestre 2024",
  data: {
    labels: ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
    datasets: [
      {
        label: "Produit A",
        data: [65, 59, 80, 81],
        backgroundColor: "rgba(79, 70, 229, 0.6)", // indigo-600
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
      },
      {
        label: "Produit B",
        data: [28, 48, 40, 19],
        backgroundColor: "rgba(124, 58, 237, 0.6)", // violet-600
        borderColor: "rgba(124, 58, 237, 1)",
        borderWidth: 2,
      },
      {
        label: "Produit C",
        data: [45, 25, 60, 35],
        backgroundColor: "rgba(69, 99, 255, 0.6)", // indigo-500 plus bleuté
        borderColor: "rgba(109, 99, 255, 1)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Évolution des ventes par produit",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number) {
            return tickValue + "K€";
          },
        },
      },
    },
  },
};

// Données pour les graphiques en barres horizontales
export const mockHorizontalBarData: BarChartConfig = {
  title: "Top 5 des pays par revenus",
  horizontal: true,
  data: {
    labels: ["France", "Allemagne", "Espagne", "Italie", "Royaume-Uni"],
    datasets: [
      {
        label: "Revenus (M€)",
        data: [850, 720, 650, 580, 520],
        backgroundColor: [
          "rgba(74, 222, 128, 0.8)", // emerald-400
          "rgba(45, 212, 191, 0.8)", // teal-400
          "rgba(34, 211, 238, 0.8)", // cyan-400
          "rgba(96, 165, 250, 0.8)", // blue-400
          "rgba(129, 140, 248, 0.8)", // indigo-400
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)", // emerald-500
          "rgba(20, 184, 166, 1)", // teal-500
          "rgba(6, 182, 212, 1)", // cyan-500
          "rgba(59, 130, 246, 1)", // blue-500
          "rgba(99, 102, 241, 1)", // indigo-500
        ],
        borderWidth: 2,
      },
    ],
  },
};

// Données pour les graphiques en barres empilées
export const mockStackedBarData: BarChartConfig = {
  title: "Répartition des équipes par département",
  stacked: true,
  data: {
    labels: ["Tech", "Marketing", "Ventes", "Support", "RH"],
    datasets: [
      {
        label: "Seniors",
        data: [12, 8, 15, 6, 4],
        backgroundColor: "rgba(79, 70, 229, 0.8)", // indigo-600
        stack: "Stack 0",
      },
      {
        label: "Juniors",
        data: [8, 12, 10, 9, 6],
        backgroundColor: "rgba(124, 58, 237, 0.8)", // violet-600
        stack: "Stack 0",
      },
      {
        label: "Stagiaires",
        data: [3, 5, 2, 4, 2],
        backgroundColor: "rgba(139, 92, 246, 0.8)", // violet-500
        stack: "Stack 0",
      },
    ],
  },
};

// Données pour les graphiques en ligne
export const mockLineData: LineChartConfig = {
  title: "Évolution du trafic website",
  data: {
    labels: [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    datasets: [
      {
        label: "Visiteurs uniques",
        data: [
          4500, 5200, 4800, 6100, 7200, 8500, 9200, 8800, 7600, 8100, 8900,
          9500,
        ],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Pages vues",
        data: [
          12000, 15600, 14200, 18300, 21600, 25500, 27600, 26400, 22800, 24300,
          26700, 28500,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Mois",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Nombre",
        },
        suggestedMin: 0,
      },
    },
  },
};

// Données pour graphique en ligne avec aire
export const mockAreaLineData: LineChartConfig = {
  title: "Performance serveur",
  fillArea: true,
  data: {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    datasets: [
      {
        label: "CPU Usage (%)",
        data: [25, 35, 65, 78, 85, 45],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function (tickValue: string | number) {
            return tickValue + "%";
          },
        },
      },
    },
  },
};

// Données pour les graphiques circulaires (Pie)
export const mockPieData: PieChartConfig = {
  title: "Répartition des ventes par région",
  type: "pie",
  data: {
    labels: [
      "Europe",
      "Amérique du Nord",
      "Asie",
      "Amérique du Sud",
      "Afrique",
      "Océanie",
    ],
    datasets: [
      {
        data: [35, 28, 22, 8, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
      },
    ],
  },
};

// Données pour les graphiques en doughnut
export const mockDoughnutData: PieChartConfig = {
  title: "Sources de trafic",
  type: "doughnut",
  cutout: 60,
  data: {
    labels: [
      "Recherche organique",
      "Réseaux sociaux",
      "Email",
      "Publicité",
      "Direct",
    ],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 205, 86, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderWidth: 3,
        borderColor: "#ffffff",
      },
    ],
  },
};

// Données pour les cartes de statistiques
// Données pour les cartes de statistiques
export const mockStatsCards: StatsCardConfig[] = [
  {
    title: "Revenus totaux",
    value: 1250847,
    prefix: "€",
    change: {
      value: 12.5,
      type: "increase",
      period: "vs mois dernier",
    },
    color: "green",
    chart: {
      type: "line",
      data: [65, 59, 80, 81, 56, 55, 40, 65, 78, 90, 85, 92],
      color: "rgb(34, 197, 94)",
      showTooltip: true,
    },
    iconType: "revenue",
  },
  {
    title: "Utilisateurs actifs",
    value: 2847,
    change: {
      value: 8.2,
      type: "increase",
      period: "vs mois dernier",
    },
    color: "green",
    chart: {
      type: "line",
      data: [45, 52, 48, 61, 72, 58, 65],
      color: "rgb(59, 130, 246)",
      showTooltip: true,
    },
    iconType: "users",
  },
  {
    title: "Taux de conversion",
    value: "3.24",
    suffix: "%",
    change: {
      value: 2.1,
      type: "decrease",
      period: "vs période précédente",
    },
    color: "orange",
    chart: {
      type: "line",
      data: [3.8, 3.6, 3.2, 3.0, 3.4, 3.1, 3.24],
      color: "rgb(239, 68, 68)",
      showTooltip: true,
    },
    iconType: "analytics",
  },
  {
    title: "Commandes",
    value: 1247,
    change: {
      value: 3.0,
      type: "decrease",
      period: "ce mois",
    },
    color: "orange",
    chart: {
      type: "line",
      data: [45, 62, 55, 48, 42, 38, 35, 40, 45, 48, 52, 47],
      color: "rgb(251, 146, 60)",
      showTooltip: true,
    },
    iconType: "orders",
  },
  {
    title: "Performance",
    value: "99.8",
    suffix: "%",
    change: {
      value: 0.2,
      type: "increase",
      period: "uptime",
    },
    color: "gray",
    chart: {
      type: "line",
      data: [99.9, 99.7, 99.8, 99.9, 99.6, 99.8, 99.9, 99.8],
      color: "rgb(34, 197, 94)",
      showTooltip: true,
    },
    iconType: "dashboard",
  },
  {
    title: "Paramètres actifs",
    value: 48,
    change: {
      value: 0,
      type: "increase",
      period: "configurations",
    },
    color: "gray",
    chart: {
      type: "line",
      data: [25, 32, 28, 35, 42, 38, 48, 48, 48, 48],
      color: "rgb(107, 114, 128)",
      showTooltip: true,
    },
    iconType: "settings",
  },
];

// Données pour test des graphiques en temps réel
export const generateRealTimeData = () => {
  const now = new Date();
  const data = [];
  const labels = [];

  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // Toutes les minutes
    labels.push(
      time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
    data.push(Math.floor(Math.random() * 100) + 20);
  }

  return { labels, data };
};

// Données pour test des couleurs personnalisées
export const mockCustomColorsData = {
  labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
  datasets: [
    {
      label: "Productivité",
      data: [85, 92, 78, 89, 94],
      backgroundColor: [
        "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
        "linear-gradient(45deg, #45B7D1, #96CEB4)",
        "linear-gradient(45deg, #FECA57, #FF9FF3)",
        "linear-gradient(45deg, #48CAE4, #023E8A)",
        "linear-gradient(45deg, #F38BA8, #A2D2FF)",
      ],
    },
  ],
};

// Configuration pour test de responsivité
export const mockResponsiveConfigs = {
  mobile: {
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            boxWidth: 12,
            font: { size: 10 },
          },
        },
      },
      scales: {
        x: { ticks: { maxTicksLimit: 4 } },
        y: { ticks: { maxTicksLimit: 5 } },
      },
    },
  },
  desktop: {
    options: {
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            boxWidth: 16,
            font: { size: 12 },
          },
        },
      },
    },
  },
};

// Données pour test d'animations
export const mockAnimationConfigs = {
  bounce: {
    animation: {
      duration: 2000,
      easing: "easeInOutBounce",
    },
  },
  elastic: {
    animation: {
      duration: 1500,
      easing: "easeInOutElastic",
    },
  },
  none: {
    animation: false,
  },
};

// Export des datasets pour tests spécifiques
export const testDatasets = {
  // Dataset avec beaucoup de données (performance)
  largDataset: {
    labels: Array.from({ length: 100 }, (_, i) => `Point ${i + 1}`),
    data: Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000)),
  },

  // Dataset avec valeurs négatives
  negativeValues: {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai"],
    data: [-25, 15, -10, 30, -5],
  },

  // Dataset avec valeurs nulles/vides
  sparseData: {
    labels: ["A", "B", "C", "D", "E", "F"],
    data: [10, null, 25, undefined, 15, 30],
  },
};

// Configuration pour test des thèmes
export const themeConfigs = {
  light: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    gridColor: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    gridColor: "rgba(255, 255, 255, 0.1)",
  },
  corporate: {
    backgroundColor: "#f8f9fa",
    textColor: "#343a40",
    gridColor: "rgba(52, 58, 64, 0.1)",
    primaryColor: "#007bff",
  },
};
