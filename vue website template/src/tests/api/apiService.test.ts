import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import axios from 'axios';
import { apiService } from '@/services/api/api';

// Mock axios (doit être hoisté en haut du fichier)
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: vi.fn().mockReturnValue(mockAxiosInstance),
    },
    create: vi.fn().mockReturnValue(mockAxiosInstance),
  };
});

// Mock global pour document, localStorage et location
beforeAll(() => {
  vi.stubGlobal('document', {
    cookie: '',
  });
  
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  });

  vi.stubGlobal('location', {
    protocol: 'https:',
  });
});

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // On mock la création d'instance directement dans le mock axios
    (axios.create as any).mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      }
    });
  });

  describe('Gestion des tokens', () => {
    it('setAuthToken() devrait définir le token dans les cookies', () => {
      document.cookie = '';
      apiService.setAuthToken('test-token');
      expect(document.cookie).toContain('auth_token=test-token');
      expect(document.cookie).toContain('HttpOnly');
    });

    it('clearAuthToken() devrait supprimer les tokens des cookies', () => {
      // On mock document.cookie pour simuler le comportement réel
      let cookieValue = 'auth_token=test; refresh_token=test';
      
      Object.defineProperty(document, 'cookie', {
        get: vi.fn(() => cookieValue),
        set: vi.fn((val: string) => {
          if (val.includes('auth_token=;')) {
            cookieValue = cookieValue.replace(/auth_token=[^;]*/, 'auth_token=;');
          }
          if (val.includes('refresh_token=;')) {
            cookieValue = cookieValue.replace(/refresh_token=[^;]*/, 'refresh_token=;');
          }
        }),
        configurable: true
      });
      
      apiService.clearAuthToken();
      
      expect(cookieValue).toMatch(/auth_token=;/);
      expect(cookieValue).toMatch(/refresh_token=;/);
    });
  });
});
