import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { apiService } from '@/services/api/api';

// Mock global pour document et localStorage
beforeAll(() => {
  vi.stubGlobal('document', {
    cookie: 'auth_token=test-token',
  });
  
  vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockReturnValue('fr-FR'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });
  
  vi.stubGlobal('navigator', {
    language: 'fr-FR',
  });
});

describe('ApiService Interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock document cookie
    document.cookie = 'auth_token=test-token';
  });

  describe('Intercepteur de requête', () => {
    it('devrait ajouter le token d\'auth si disponible', () => {
      const config = { headers: {}, url: '/test', method: 'get' };
      const result = apiService['handleRequest'](config as any);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('ne devrait pas ajouter le token si absent', () => {
      document.cookie = '';
      
      const config = { headers: {}, url: '/test', method: 'get' };
      const result = apiService['handleRequest'](config as any);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('devrait ajouter la locale dans les headers', () => {
      const config = { headers: {}, url: '/test', method: 'get' };
      const result = apiService['handleRequest'](config as any);
      
      expect(result.headers['Accept-Language']).toBe('fr-FR');
    });
  });

  describe('Intercepteur de réponse', () => {
    it('devrait formater correctement la réponse', () => {
      const response = {
        data: { id: 1 },
        status: 200,
        statusText: 'OK',
        config: { url: '/test' }
      };
      
      const result = apiService['handleResponse'](response as any);
      expect(result).toEqual(response);
    });
  });
});
