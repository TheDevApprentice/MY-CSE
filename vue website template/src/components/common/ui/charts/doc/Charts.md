# 📊 Components Charts

Une collection de composants de graphiques hautement configurables basés sur Chart.js pour votre application Vue 3.

## 🚀 Installation

Les composants utilisent Chart.js comme dépendance. Assurez-vous qu'il est installé :

```bash
npm install chart.js
```

## 📁 Structure

```
components/common/charts/
├── BarChart.vue        # Graphiques en barres
├── LineChart.vue       # Graphiques en ligne
├── PieChart.vue        # Graphiques circulaires (pie/doughnut)
├── StatsCard.vue       # Cartes de statistiques avec mini-graphiques
├── types.ts            # Types TypeScript
├── index.ts            # Exports et utilitaires
└── README.md           # Cette documentation
```

## 🎯 Composants disponibles

### BarChart.vue
Graphiques en barres verticales et horizontales avec support des barres empilées.

```vue
<template>
  <BarChart 
    :config="barConfig" 
    @chart-ready="onChartReady"
    @data-click="onDataClick"
  />
</template>

<script setup>
import { BarChart } from '@/components/common/charts';

const barConfig = {
  title: "Ventes par mois",
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    datasets: [{
      label: 'Ventes 2024',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  }
};
</script>
```

**Props principales :**
- `config`: Configuration complète du graphique
- `horizontal`: Mode horizontal (défaut: false)
- `stacked`: Barres empilées (défaut: false)
- `loading`: État de chargement
- `useGradients`: Utiliser des gradients

### LineChart.vue
Graphiques en ligne avec support des aires remplies et animations avancées.

```vue
<template>
  <LineChart 
    :labels="['Jan', 'Fév', 'Mar', 'Avr', 'Mai']"
    :datasets="datasets"
    :smooth="true"
    :fillArea="true"
    :showControls="true"
    @data-hover="onDataHover"
  />
</template>

<script setup>
import { LineChart } from '@/components/common/charts';

const datasets = [{
  label: 'Revenus',
  data: [65, 59, 80, 81, 56],
  borderColor: 'rgb(75, 192, 192)',
  tension: 0.4
}];
</script>
```

**Props principales :**
- `smooth`: Lignes lissées (défaut: true)
- `showPoints`: Afficher les points (défaut: true)
- `fillArea`: Remplir l'aire sous la courbe
- `showTrendInfo`: Afficher les informations de tendance
- `allowZoom`: Permettre le zoom

### PieChart.vue
Graphiques circulaires (pie et doughnut) avec légende personnalisable.

```vue
<template>
  <PieChart 
    :labels="['Rouge', 'Bleu', 'Jaune']"
    :values="[300, 50, 100]"
    type="doughnut"
    :showCustomLegend="true"
    :showCenterContent="true"
    centerValue="450"
    centerLabel="Total"
  />
</template>
```

**Props principales :**
- `type`: 'pie' ou 'doughnut'
- `values`: Array simple de valeurs
- `cutout`: Pourcentage du centre évidé (pour doughnut)
- `showCustomLegend`: Légende personnalisée
- `colorScheme`: 'rainbow', 'auto', ou couleur spécifique

### StatsCard.vue
Cartes de statistiques avec mini-graphiques et indicateurs de changement.

```vue
<template>
  <StatsCard 
    title="Revenus totaux"
    :value="125400"
    prefix="€"
    :change="{ value: 12.5, type: 'increase', period: 'vs mois dernier' }"
    color="green"
    :chart="{ type: 'line', data: [65, 59, 80, 81, 56, 55, 40] }"
    @click="navigateToDetails"
  />
</template>
```

**Props principales :**
- `title`: Titre de la carte
- `value`: Valeur principale (number ou string)
- `change`: Objet décrivant le changement
- `chart`: Configuration du mini-graphique
- `onClick`: Handler de clic

## 🎨 Configuration avancée

### Types de configuration

```typescript
// Configuration complète pour BarChart
const barConfig: BarChartConfig = {
  title: "Mon graphique",
  data: {
    labels: string[],
    datasets: DatasetConfig[]
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic'
    },
    scales: {
      x: { display: true },
      y: { beginAtZero: true }
    }
  },
  barOptions: {
    barPercentage: 0.8,
    categoryPercentage: 0.9
  }
};
```

### Utilisation des couleurs

```typescript
import { CHART_COLORS, CHART_COLORS_ALPHA } from '@/components/common/charts';

// Couleurs disponibles
const colors = {
  primary: CHART_COLORS.blue,      // #3B82F6
  success: CHART_COLORS.green,     // #22C55E
  warning: CHART_COLORS.yellow,    // #FBBF24
  danger: CHART_COLORS.red,        // #EF4444
  // ... et bien d'autres
};

// Utilisation avec transparence
const dataset = {
  backgroundColor: CHART_COLORS_ALPHA.blue,  // Version transparente
  borderColor: CHART_COLORS.blue
};
```

### Gradients

```typescript
// Configuration de gradient
const gradientConfig: GradientConfig = {
  start: '#FF6B6B',
  end: '#4ECDC4',
  direction: 'vertical' // 'horizontal', 'diagonal'
};

// Utilisation
<BarChart :useGradients="true" :gradientConfig="gradientConfig" />
```

## 🛠 Utilitaires

### Fonctions utilitaires

```typescript
import { chartUtils } from '@/components/common/charts';

// Formater des valeurs
chartUtils.formatValue(1234567); // "1.2M"

// Générer des couleurs
chartUtils.generateColors(5, 'rainbow'); // Array de 5 couleurs

// Calculer une tendance
chartUtils.calculateTrend([10, 15, 12, 18]); 
// { direction: 'up', percentage: 80 }

// Transformer des données
const chartData = chartUtils.transformDataForChart(
  [
    { label: 'Produit A', value: 100 },
    { label: 'Produit B', value: 150 }
  ],
  'bar'
);
```

### Présets de configuration

```typescript
import { chartPresets } from '@/components/common/charts';

// Graphique simple
const config = chartPresets.simpleBar(
  [10, 20, 30], 
  ['A', 'B', 'C'], 
  'Mon titre'
);

// Stats pour dashboard
const statsConfig = chartPresets.dashboardStats(
  1250,  // valeur
  15.5,  // changement en %
  'Revenus'
);
```

### Hook useChart (Composition API)

```typescript
import { useChart } from '@/components/common/charts';

export default {
  setup() {
    const { chartRef, chartInstance, createChart, updateChart } = useChart();
    
    onMounted(() => {
      createChart({
        type: 'bar',
        data: { /* ... */ },
        options: { /* ... */ }
      });
    });
    
    return { chartRef };
  }
};
```

## 🎯 Exemples d'usage

### Dashboard avec plusieurs métriques

```vue
<template>
  <div class="dashboard-grid">
    <StatsCard 
      title="Utilisateurs actifs"
      :value="userStats.active"
      :change="userStats.change"
      color="blue"
      :chart="userStats.chart"
    />
    
    <StatsCard 
      title="Revenus"
      :value="revenueStats.total"
      prefix="€"
      :change="revenueStats.change"
      color="green"
      :chart="revenueStats.chart"
    />
    
    <div class="chart-container">
      <LineChart 
        :config="salesTrendConfig"
        :showControls="true"
        @chart-ready="onSalesChartReady"
      />
    </div>
  </div>
</template>
```

### Graphique avec données dynamiques

```vue
<template>
  <BarChart 
    ref="chartRef"
    :datasets="datasets"
    :labels="labels"
    :loading="loading"
    @chart-ready="setupRealTimeUpdates"
  />
</template>

<script setup>
const chartRef = ref();
const loading = ref(true);
const datasets = ref([]);
const labels = ref([]);

// Mise à jour en temps réel
const setupRealTimeUpdates = (chart) => {
  setInterval(() => {
    // Ajouter de nouvelles données
    addNewDataPoint(chart);
  }, 5000);
};

const addNewDataPoint = (chart) => {
  chartRef.value?.addData('Nouveau', [Math.random() * 100]);
};
</script>
```

### Thème sombre automatique

```vue
<template>
  <LineChart 
    :config="adaptedConfig"
    :theme="currentTheme"
  />
</template>

<script setup>
import { chartUtils } from '@/components/common/charts';

const currentTheme = ref('auto');
const baseConfig = { /* configuration de base */ };

const adaptedConfig = computed(() => {
  if (chartUtils.isDarkMode()) {
    return chartUtils.applyDarkTheme(baseConfig);
  }
  return baseConfig;
});
</script>
```

## 🎛 Configuration responsive

Tous les composants sont responsive par défaut. Configurations spéciales :

```vue
<template>
  <!-- Mobile : graphique compact -->
  <StatsCard 
    :class="{ 'mobile-compact': isMobile }"
    variant="compact"
    :chart="mobileChartConfig"
  />
  
  <!-- Desktop : graphique détaillé -->
  <LineChart 
    v-if="!isMobile"
    :config="desktopConfig"
    :showControls="true"
  />
</template>
```

## ♿ Accessibilité

Les composants incluent :
- Support ARIA automatique
- Navigation clavier
- Contraste élevé
- Textes alternatifs
- Descriptions détaillées

```vue
<BarChart 
  ariaLabel="Graphique des ventes mensuelles"
  ariaDescription="Graphique en barres montrant l'évolution des ventes sur 12 mois"
  :config="config"
/>
```

## 🔧 Personnalisation CSS

```css
/* Variables CSS pour personnalisation */
.stats-card {
  --card-bg: #ffffff;
  --card-border: #e5e7eb;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --value-color: #111827;
  --title-color: #6b7280;
}

/* Mode sombre */
@media (prefers-color-scheme: dark) {
  .stats-card {
    --card-bg: #1f2937;
    --card-border: #374151;
    --value-color: #f9fafb;
    --title-color: #d1d5db;
  }
}
```

## 🐛 Dépannage

### Problèmes courants

1. **Chart.js n'est pas défini**
   ```bash
   npm install chart.js
   ```

2. **Graphique ne s'affiche pas**
   - Vérifiez que le conteneur a une hauteur définie
   - Attendez que les données soient chargées avant d'initialiser

3. **Performance avec beaucoup de données**
   - Utilisez `decimation` pour les grandes datasets
   - Implémentez la pagination des données

4. **Responsivité**
   - Définissez `maintainAspectRatio: false` pour plus de contrôle
   - Utilisez les breakpoints CSS pour les configurations mobiles

## 📈 Roadmap

- [ ] Support des graphiques 3D
- [ ] Animations personnalisées avancées
- [ ] Export en PDF/SVG
- [ ] Mode temps réel avec WebSockets
- [ ] Thèmes personnalisés
- [ ] Graphiques combinés (bar + line)

## 🤝 Contribution

Pour contribuer à ces composants :

1. Respectez les types TypeScript existants
2. Ajoutez des tests pour les nouvelles fonctionnalités
3. Maintenez la compatibilité avec Chart.js
4. Documentez les nouvelles props/événements

---

**Développé avec ❤️**