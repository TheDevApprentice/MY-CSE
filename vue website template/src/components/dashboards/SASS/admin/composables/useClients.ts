import { useAdminDashboard } from './index';

export function useClients() {
  const { 
    clients,
    loadBillingData, // Charge à la fois clients et factures
    updateClient,
    createClient,
    loading,
    error
  } = useAdminDashboard();

  return {
    clients,
    loadBillingData, // On réutilise loadBillingData qui charge aussi les clients
    updateClient,
    createClient, 
    loading,
    error
  };
}