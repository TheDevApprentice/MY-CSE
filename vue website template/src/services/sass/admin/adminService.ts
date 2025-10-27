// components/dashboards/SASS/admin/services/adminService.ts
import { ProviderService } from "@/services/sass/admin/providers/providerService";

const providerService = new ProviderService();
const tempvalueprovider = 'mock'

/**
 * Service pour la gestion des données du dashboard admin
 */
export class AdminService {
  /**
   * Récupère les données analytics (simule un appel API)
   */
  static async getAnalyticsStats(): Promise<any> {
    const result = await providerService.getAnalyticsStats(tempvalueprovider);
    return result.data;
  }
  static async getAnalyticsTopPages(): Promise<any> {
    const result = await providerService.getAnalyticsTopPages(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les données de facturation
   */
  static async getBillingStats(): Promise<any> {
    const result = await providerService.getBillingStats(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère la liste des clients
   */
  static async getClients(): Promise<any> {
    const result = await providerService.getClients(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère la liste des factures
   */
  static async getInvoices(): Promise<any> {
    const result = await providerService.getInvoices(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère la liste des sociétés
   */
  static async getCompagnies(): Promise<any> {
    const result = await providerService.getCompagnies(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les données de configuration
   */
  static async getAdminUser(): Promise<any> {
    const result = await providerService.getAdminUser(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les données de notification
   */
  static async getAdminNotifications(): Promise<any> {
    const result = await providerService.getAdminNotifications(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les tickets de support
   */
  static async getSupportTickets(): Promise<any> {
    const result = await providerService.getSupportTickets(tempvalueprovider);
    return result.data;
  }
  static async getSupportTicketsStats(): Promise<any> {
    const result = await providerService.getSupportTicketsStats(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les données pour la vue d'accueil
   */
  static async getHomeStats(): Promise<any> {
    const result = await providerService.getHomeStats(tempvalueprovider);
    return result.data;
  }
  static async getRecentsUsers(): Promise<any> {
    const result = await providerService.getRecentsUsers(tempvalueprovider);
    return result.data;
  }
  static async getRecentsActivities(): Promise<any> {
    const result = await providerService.getRecentsActivities(tempvalueprovider);
    return result.data;
  }

  /**
   * Récupère les données de configuration
   */
  static async getAdminNotificationSettings(): Promise<any> {
    const result = await providerService.getAdminNotificationSettings(tempvalueprovider);
    return result.data;
  }

  /**
   * Met à jour un client
   */
  static async updateClient(clientData: any): Promise<any> {
    const result = await providerService.updateClient(tempvalueprovider, clientData);
    return result.data;
  }

  /**
   * Crée un nouveau client
   */
  static async createClient(clientData: any): Promise<any> {
    const result = await providerService.createClient(tempvalueprovider, clientData);
    return result.data;
  }
}
