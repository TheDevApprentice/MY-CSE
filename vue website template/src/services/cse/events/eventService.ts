import type { Event, Participant } from "@/components/events/types/event";
import { mockDataEvents } from "@/components/events/constants/mockDataEvents";

/**
 * Service pour la gestion des données d'événements
 */
export class EventService {
  /**
   * Récupère la liste des événements (simule un appel API)
   */
  static async getEvents(): Promise<Event[]> {
    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Devras être remplacé par un call vers notre api
    
    return mockDataEvents;
  }

  /**
   * Récupère un événement par son ID
   */
  static async getEventById(id: number): Promise<Event | null> {
    const events = await this.getEvents(); // Aura besoin d'être remplacé par un call api pour aller chercher uniquement la donnée souhaiter
    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100));
    return events.find((event) => event.id === id) || null;
  }

  /**
   * Partage un événement via l'API Web Share ou copie du lien
   * Pas de call à notre api nécessaire
   */
  static async shareEvent(event: Event): Promise<string> {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return "Événement partagé avec succès";
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}?event=${event.id}`;
      await navigator.clipboard.writeText(url);
      return "Lien copié dans le presse-papier";
    }
  }

  /**
   * Calcule les statistiques des événements
   */
  static async getEventStats(events: Event[]) {
    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100));
    // devras être un call vers notre api
    const totalParticipants = events.reduce(
      (sum, event) => sum + event.participants,
      0
    );
    const upcomingEvents = events.filter((event) => event.date >= new Date());

    return {
      totalEvents: events.length,
      totalParticipants,
      upcomingEvents: upcomingEvents.length,
      categories: this.getCategoryDistribution(events),
    };
  }

  /**
   * Obtient la répartition par catégorie
   */
  private static async getCategoryDistribution(events: Event[]) {
    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Devras être remplacé par un call vers notre api
    return events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
