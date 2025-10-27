import { useAdminDashboard } from './index';

export function useConfiguration() {
  const { 
    notificationsSettings, 
    loadConfiguratorData,
    loading,
    error
  } = useAdminDashboard();

  return {
    notificationsSettings,
    loadConfiguratorData,
    loading,
    error
  };
}