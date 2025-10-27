import { ref } from 'vue';
import { AdminService } from '@/services/sass/admin/adminService';
import type { AdminUser } from '@/components/dashboards/SASS/admin/types';

export function useAdminDashboard() {
  // State
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  // Config
  const user = ref<AdminUser | null>(null);
  const notifications = ref<any[]>([]);
  const notificationsSettings = ref<any[]>([]);
  
  // Home
  const homeStats = ref<any>({});
  const recentUsers = ref<any[]>([]);
  const recentActivities = ref<any[]>([]);
  
  // Analytics
  const analyticsStats = ref<any>({});
  const topPages = ref<any[]>([]);
  const analyticsChartData = ref<any>({});
  const analyticsBarChartData = ref<any>({});  

  // Billing
  const billingStats = ref<any>({});
  const clients = ref<any[]>([]);
  const invoices = ref<any[]>([]);
  const companies = ref<any[]>([]);
  
  // Support
  const supportTickets = ref<any[]>([]);
  const supportStats = ref<any>({});
  const supportLineChartData = ref<any>({});
  const supportBarChartData = ref<any>({});

  // Config methods
  const loadAdminPrimaryData = async () => {
    try {
      loading.value = true;
      const data = await AdminService.getAdminUser();
      user.value = data;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  const getAdminNotifications = async () => {
    try {
      loading.value = true;
      const data = await AdminService.getAdminNotifications();
      notifications.value = data;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Home methods
  const loadHomeData = async () => {
    try {
      loading.value = true;
      const dataStats = await AdminService.getHomeStats();
      const dataRecentUsers = await AdminService.getRecentsUsers();
      const dataRecentActivities = await AdminService.getRecentsActivities();
      homeStats.value = dataStats;
      recentUsers.value = dataRecentUsers;
      recentActivities.value = dataRecentActivities;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Analytics methods
  const loadAnalyticsData = async () => {
    try {
      loading.value = true;
      const dataStats = await AdminService.getAnalyticsStats();
      const dataTopPages = await AdminService.getAnalyticsTopPages();
      analyticsStats.value = dataStats.stats;
      topPages.value = dataTopPages;
      analyticsChartData.value = dataStats.chartData;
      analyticsBarChartData.value = dataStats.barChartData;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Billing methods
  const loadBillingData = async () => {
    try {
      loading.value = true;
      const dataStats = await AdminService.getBillingStats();
      const dataClients = await AdminService.getClients();
      const dataInvoice = await AdminService.getInvoices();
      const dataCompagnies = await AdminService.getCompagnies();
      billingStats.value = dataStats;
      clients.value = dataClients;
      invoices.value = dataInvoice;
      companies.value = dataCompagnies;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Support methods
  const loadSupportData = async () => {
    try {
      loading.value = true;
      const dataSupportTickets = await AdminService.getSupportTickets();
      const dataSupportStats = await AdminService.getSupportTicketsStats();
      supportTickets.value = dataSupportTickets;
      supportStats.value = dataSupportStats.stats;
      supportBarChartData.value = dataSupportStats.barChartData;
      supportLineChartData.value = dataSupportStats.lineChartData;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };


    // Support methods
    const loadConfiguratorData = async () => {
      try {
        loading.value = true;
        const data = await AdminService.getAdminNotificationSettings();
        notificationsSettings.value = data;
      } catch (err) {
        error.value = err as Error;
      } finally {
        loading.value = false;
      }
    };

  // Client CRUD
  const updateClient = async (clientData: any) => {
    try {
      loading.value = true;
      const updated = await AdminService.updateClient(clientData);
      const index = clients.value.findIndex(c => c.id === clientData.id);
      if (index !== -1) clients.value[index] = updated;
      return updated;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createClient = async (clientData: any) => {
    try {
      loading.value = true;
      const created = await AdminService.createClient(clientData);
      clients.value.push(created);
      return created;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    loading,
    error,
    
    // Admin Primary data
    user,
    notifications,
    loadAdminPrimaryData,
    getAdminNotifications,

    // Home
    homeStats,
    loadHomeData,
    
    // User activity data
    recentUsers,
    recentActivities,

    // Analytics
    analyticsStats,
    topPages,
    analyticsChartData,
    analyticsBarChartData,
    loadAnalyticsData,
    
    // Billing
    billingStats,
    clients,
    invoices,
    companies,
    loadBillingData,
    updateClient,
    createClient,
    
    // Support
    supportTickets,
    supportStats,
    supportBarChartData,
    supportLineChartData,
    loadSupportData,

    // Configurator
    loadConfiguratorData,
    notificationsSettings,
  };
}