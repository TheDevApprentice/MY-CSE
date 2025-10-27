import { ApiResponse } from "@/services/api";

export type ApiAdminProvider = 'api' | 'mock';
export type AdminAction =
  | 'getAnalyticsStats'
  | 'getAnalyticsTopPages'
  | 'getBillingStats'
  | 'getClients'
  | 'getInvoices'
  | 'getCompagnies'
  | 'getAdminUser'
  | 'getAdminNotifications'
  | 'getSupportTickets'
  | 'getSupportTicketsStats'
  | 'getHomeStats'
  | 'getRecentsUsers'
  | 'getRecentsActivities'
  | 'getAdminNotificationSettings'
  | 'updateClient'
  | 'createClient';

export interface AdminApiResult<T = any> extends ApiResponse<T> {
  url?: string;
  provider: ApiAdminProvider;
  action: AdminAction;
}

export interface IAdminApiProvider {
  getAnalyticsStats(): Promise<AdminApiResult>;
  getAnalyticsTopPages(): Promise<AdminApiResult>;
  getBillingStats(): Promise<AdminApiResult>;
  getClients(): Promise<AdminApiResult>;
  getInvoices(): Promise<AdminApiResult>;
  getCompagnies(): Promise<AdminApiResult>;
  getAdminUser(): Promise<AdminApiResult>;
  getAdminNotifications(): Promise<AdminApiResult>;
  getSupportTickets(): Promise<AdminApiResult>;
  getSupportTicketsStats(): Promise<AdminApiResult>;
  getHomeStats(): Promise<AdminApiResult>;
  getRecentsUsers(): Promise<AdminApiResult>;
  getRecentsActivities(): Promise<AdminApiResult>;
  getAdminNotificationSettings(): Promise<AdminApiResult>;
  updateClient(clientData: any): Promise<AdminApiResult>;
  createClient(clientData: any): Promise<AdminApiResult>;
}
