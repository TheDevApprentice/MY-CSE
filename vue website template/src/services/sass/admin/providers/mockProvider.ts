import type {
  IAdminApiProvider,
  AdminApiResult,
  AdminAction,
} from "./providerTypes";
// import { apiService } from '@services/api';
import {
  mockAdminCurrentUser,
  mockAdminNotifications,
  mockHomeViewStatsCards,
  mockHomeViewRecentUsers,
  mockHomeViewRecentActivities,
  mockAnalyticsViewStatsCards,
  mockAnalyticsViewTopPages,
  mockAnalyticsViewLineChartData,
  mockBillingViewStats,
  mockClients,
  mockInvoices,
  mockCompanies,
  mockSupportViewTickets,
  mockSupportViewStatsCards,
  mockSupportViewLineChart,
  mockAdminNotificationSettings,
  mockSupportViewBarChart,
  mockAnalyticsViewBarChartData,
} from "@/components/dashboards/SASS/admin/constants/mockDataAdmin";

// Helper to produce a standard result
const makeResult = <T = any>(
  action: AdminAction,
  data: T,
  status = 200
): AdminApiResult<T> => ({
  success: true,
  status,
  message: "OK",
  provider: "api",
  action,
  data,
});

export class AdminApiMockProvider implements IAdminApiProvider {
  async getAnalyticsStats(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getAnalyticsData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getAnalyticsStats", {
      stats: mockAnalyticsViewStatsCards,
      chartData: mockAnalyticsViewLineChartData,
      barChartData: mockAnalyticsViewBarChartData,
    });
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getAnalyticsTopPages(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getAnalyticsData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getAnalyticsTopPages", mockAnalyticsViewTopPages);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getBillingStats(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getBillingStats());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getBillingStats", mockBillingViewStats);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getClients(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getClients());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getClients", mockClients);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getInvoices(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getInvoices());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getInvoices", mockInvoices);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getCompagnies(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getCompagnies());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getCompagnies", mockCompanies);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getAdminUser(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getAdminUser());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getAdminUser", mockAdminCurrentUser);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getAdminNotifications(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getAdminNotifications());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getAdminNotifications", mockAdminNotifications);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getSupportTickets(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getSupportTickets());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getSupportTickets", mockSupportViewTickets);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getSupportTicketsStats(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getSupportTickets());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getSupportTicketsStats", {
      stats: mockSupportViewStatsCards,
      barChartData: mockSupportViewBarChart,
      lineChartData: mockSupportViewLineChart,
    });
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getHomeStats(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getHomeData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getHomeStats", mockHomeViewStatsCards);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getRecentsUsers(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getHomeData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getRecentsUsers", mockHomeViewRecentUsers);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
  async getRecentsActivities(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getHomeData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getRecentsActivities", mockHomeViewRecentActivities);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async getAdminNotificationSettings(): Promise<AdminApiResult> {
    // const response = await apiService.get(ApiEndpoints.getConfigurationData());

    await new Promise((r) => setTimeout(r, 200));
    const response = makeResult("getAdminNotificationSettings", mockAdminNotificationSettings);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async updateClient(clientData: any): Promise<AdminApiResult> {
    // const response = await apiService.put(`/v1/admin/clients/${clientData.id}`, clientData);
    await new Promise((r) => setTimeout(r, 300));
    const response = makeResult("updateClient", clientData);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }

  async createClient(clientData: any): Promise<AdminApiResult> {
    // const response = await apiService.post(`/v1/admin/clients`, clientData);
    await new Promise((r) => setTimeout(r, 300));
    const response = makeResult("createClient", clientData);
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: response.provider,
      action: response.action,
      data: response.data,
    };
  }
}
