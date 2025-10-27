import { useAdminDashboard } from './index';

export function useSupport() {
  const { 
    supportTickets, 
    supportStats, 
    supportLineChartData, 
    supportBarChartData,
    loadSupportData,
    loading,
    error
  } = useAdminDashboard();

  return {
    supportTickets,
    supportStats,
    supportLineChartData,
    supportBarChartData,
    loadSupportData,
    loading,
    error
  };
}