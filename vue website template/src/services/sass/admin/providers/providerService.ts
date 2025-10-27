import { AdminApiProvider} from './apiProvider';
import { AdminApiMockProvider } from './mockProvider';
import type { IAdminApiProvider, ApiAdminProvider, AdminApiResult } from './providerTypes';

export class ProviderService {
  private providers: Record<ApiAdminProvider, IAdminApiProvider> = {
    api: new AdminApiProvider(),
    mock: new AdminApiMockProvider()
  };

  getProvider(provider: ApiAdminProvider): IAdminApiProvider {
    return this.providers[provider];
  }

  async getAnalyticsStats(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getAnalyticsStats() ?? 
    Promise.reject(new Error('Get analytics data not supported'));
  }

  async getAnalyticsTopPages(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getAnalyticsTopPages() ?? 
    Promise.reject(new Error('Get analytics stats not supported'));
  }

  async getBillingStats(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getBillingStats() ?? 
    Promise.reject(new Error('Get billing stats not supported'));
  }

  async getClients(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getClients() ?? 
    Promise.reject(new Error('Get clients not supported'));
  }

  async getInvoices(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getInvoices() ?? 
    Promise.reject(new Error('Get invoices not supported'));
  }

  async getCompagnies(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getCompagnies() ?? 
    Promise.reject(new Error('Get compagnies not supported'));
  }

  async getAdminUser(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getAdminUser() ?? 
    Promise.reject(new Error('Load admin primary data not supported'));
  }

  async getAdminNotifications(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getAdminNotifications() ?? 
    Promise.reject(new Error('Get admin notifications not supported'));
  }

  async getSupportTickets(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getSupportTickets() ?? 
    Promise.reject(new Error('Get support tickets not supported'));
  }
  async getSupportTicketsStats(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getSupportTicketsStats() ?? 
    Promise.reject(new Error('Get support tickets stats not supported'));
  }
  async getHomeStats(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getHomeStats() ?? 
    Promise.reject(new Error('Get home data not supported'));
  }
  async getRecentsUsers(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getRecentsUsers() ?? 
    Promise.reject(new Error('Get home data not supported'));
  }
  async getRecentsActivities(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getRecentsActivities() ?? 
    Promise.reject(new Error('Get home data not supported'));
  }
  async getAdminNotificationSettings(provider: ApiAdminProvider, ): Promise<AdminApiResult> {
    return this.providers[provider].getAdminNotificationSettings() ?? 
      Promise.reject(new Error('Get admin notifications setting not supported'));
  }

  async createClient(provider: ApiAdminProvider, userData?: any): Promise<AdminApiResult> {
    return this.providers[provider].createClient?.(userData) ?? 
      Promise.reject(new Error('Create client not supported'));
  }

  async updateClient(provider: ApiAdminProvider, userData?: any): Promise<AdminApiResult> {
    return this.providers[provider].updateClient?.(userData) ?? 
      Promise.reject(new Error('Update client not supported'));
  }
}
