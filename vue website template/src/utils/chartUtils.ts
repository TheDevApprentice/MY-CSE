import { ref, computed, type Ref } from "vue";

export const chartPeriods = ref([
  { label: "Jour", value: "day" },
  { label: "Semaine", value: "week" },
  { label: "Mois", value: "month" },
  { label: "Année", value: "year" },
]);

export const useChartLabels = (selectedPeriod: Ref<string>) => {
  return computed(() => {
    switch (selectedPeriod.value) {
      case "day":
        return ["00h", "04h", "08h", "12h", "16h", "20h", "24h"];
      case "week":
        return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      case "month":
        return ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
      case "year":
        return ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
      default:
        return ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    }
  });
};
