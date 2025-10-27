import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiService } from '@/services/api/api';

describe('ApiService Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock console.warn pour tester les logs
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Formatage des erreurs', () => {
    it('devrait formater une erreur avec réponse serveur', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        },
        message: 'Error',
        code: 'ERR_BAD_REQUEST',
        config: {}
      };
      
      const result = apiService['formatError'](error as any);
      expect(result).toEqual({
        message: 'Not found',
        status: 404,
        code: 'ERR_BAD_REQUEST',
        data: { message: 'Not found' }
      });
    });

    it('devrait formater une erreur sans réponse serveur', () => {
      const error = {
        message: 'Network Error',
        code: 'NETWORK_ERROR',
        config: {}
      };
      
      const result = apiService['formatError'](error as any);
      expect(result).toEqual({
        message: 'Network Error',
        code: 'NETWORK_ERROR'
      });
    });
  });

  describe('Gestion des erreurs spécifiques', () => {
    it('devrait logger un avertissement pour une erreur 403', () => {
      const error = { response: { status: 403, data: {} }, config: {} };
      
      apiService['handleSpecificErrors'](error as any);
      expect(console.warn).toHaveBeenCalledWith(
        '⚠️ Access forbidden - insufficient permissions'
      );
    });

    // Tests similaires pour les autres codes d'erreur...
  });

  describe('Logique de retry', () => {
    it('devrait retenter pour une erreur réseau', () => {
      const error = { code: 'NETWORK_ERROR', config: {} };
      const result = apiService['shouldRetry'](error as any);
      expect(result).toBe(true);
    });

    it('ne devrait pas retenter pour une erreur 400', () => {
      const error = { response: { status: 400 }, config: {} };
      const result = apiService['shouldRetry'](error as any);
      expect(result).toBe(false);
    });
  });
});
