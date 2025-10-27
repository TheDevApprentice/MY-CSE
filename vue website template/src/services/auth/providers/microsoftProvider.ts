import type { IAuthProvider, AuthResult, OAuthCallbackResult } from './providerTypes';
import { apiService } from '@services/api';

export class AuthMicrosoftProvider implements IAuthProvider {
  private readonly config = {
    clientId: import.meta.env.VITE_VUE_APP_MICROSOFT_CLIENT_ID,
    redirectUri: import.meta.env.VITE_VUE_APP_REDIRECT_URI,
    authority: import.meta.env.VITE_VUE_APP_MICROSOFT_CLIENT_AUTHORITY,
    scopes: import.meta.env.VITE_VUE_APP_MICROSOFT_CLIENT_SCOPES.split(',')
  };

  async login(): Promise<AuthResult> {
    return this.initiateAuth('login');
  }

  async signup(): Promise<AuthResult> {
    return this.initiateAuth('signup');
  }

  private initiateAuth(action: string): AuthResult {
    const authUrl = new URL(`${this.config.authority}/oauth2/v2.0/authorize`);
    authUrl.searchParams.append('client_id', this.config.clientId);
    authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', this.config.scopes.join(' '));
    authUrl.searchParams.append('state', action);
    return {
      data: null,
      success: true,
      status: 200,
      message: 'Success',
      url: authUrl.toString(),
      provider: 'microsoft',
      action: action as any
    };
  }

  async handleCallback(code: string, state: string): Promise<OAuthCallbackResult> {
    const response = await apiService.post('/auth/oauth/callback', {
      code,
      state,
      provider: 'microsoft'
    });
    
    return {
      success: true,
      user: response.data
    };
  }
}
