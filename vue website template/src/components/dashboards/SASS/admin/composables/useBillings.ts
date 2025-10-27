import { useAdminDashboard } from './index';

export function useBillings() {
  const { 
    billingStats, 
    clients, 
    invoices, 
    companies,
    loadBillingData,
    loading,
    error
  } = useAdminDashboard();

  return {
    billingStats,
    clients,
    invoices,
    companies,
    loadBillingData,
    loading,
    error
  };
}