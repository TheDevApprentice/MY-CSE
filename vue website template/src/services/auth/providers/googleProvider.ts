import type { IAuthProvider, AuthResult, OAuthCallbackResult } from './providerTypes';
import { apiService } from '@services/api';

export class AuthGoogleProvider implements IAuthProvider {
  private readonly config = {
    clientId: import.meta.env.VITE_VUE_APP_GOOGLE_CLIENT_ID,
    redirectUri: import.meta.env.VITE_VUE_APP_REDIRECT_URI,
    scope: 'openid email profile'
  };

  async login(): Promise<AuthResult> {
    return this.initiateAuth('login');
  }

  async signup(): Promise<AuthResult> {
    return this.initiateAuth('signup');
  }

  private initiateAuth(action: string): AuthResult {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', this.config.clientId);
    authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', this.config.scope);
    authUrl.searchParams.append('state', action);
    return {
      data: null,
      success: true,
      status: 200,
      message: 'Success',
      url: authUrl.toString(),
      provider: 'google',
      action: action as any
    };
  }

  async handleCallback(code: string, state: string): Promise<OAuthCallbackResult> {
    const response = await apiService.post('/auth/oauth/callback', {
      code,
      state,
      provider: 'google'
    });
    
    return {
      success: true,
      user: response.data
    };
  }
}
