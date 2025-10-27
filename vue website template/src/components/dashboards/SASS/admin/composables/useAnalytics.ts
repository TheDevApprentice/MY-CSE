import { useAdminDashboard } from './index';

export function useAnalytics() {
  const { 
    analyticsStats, 
    topPages, 
    analyticsChartData, 
    loadAnalyticsData,
    loading,
    error
  } = useAdminDashboard();

  return {
    analyticsStats,
    topPages,
    analyticsChartData,
    loadAnalyticsData,
    loading,
    error
  };
}