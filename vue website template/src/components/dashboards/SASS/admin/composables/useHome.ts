import { useAdminDashboard } from './index';

export function useHome() {
  const { 
    homeStats, 
    recentUsers, 
    recentActivities, 
    loadHomeData,
    loading,
    error
  } = useAdminDashboard();

  return {
    homeStats,
    recentUsers,
    recentActivities,
    loadHomeData,
    loading,
    error
  };
}