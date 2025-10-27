import { AuthGoogleProvider } from './googleProvider';
import { AuthMicrosoftProvider } from './microsoftProvider';
import { AuthApiProvider } from './apiProvider';
import type { IAuthProvider, AuthProvider, AuthResult, OAuthCallbackResult } from './providerTypes';

export class ProviderService {
  private providers: Record<AuthProvider, IAuthProvider> = {
    google: new AuthGoogleProvider(),
    microsoft: new AuthMicrosoftProvider(),
    api: new AuthApiProvider()
  };

  getProvider(provider: AuthProvider): IAuthProvider {
    return this.providers[provider];
  }

  async login(provider: AuthProvider, credentials?: any): Promise<AuthResult> {
    return this.providers[provider].login(credentials)?? 
    Promise.reject(new Error('Login not supported'));
  }

  async signup(provider: AuthProvider, userData?: any): Promise<AuthResult> {
    return this.providers[provider].signup?.(userData) ?? 
      Promise.reject(new Error('Signup not supported'));
  }

  async logout(provider: AuthProvider): Promise<AuthResult> {
    return this.providers[provider].logout?.() ?? 
      Promise.reject(new Error('Logout not supported'));
  }

  async forgotPassword(provider: AuthProvider, email: string): Promise<AuthResult> {
    return this.providers[provider].forgotPassword?.(email) ?? 
      Promise.reject(new Error('Forgot password not supported'));
  }
  
  async handleCallback(
    provider: AuthProvider,
    code: string,
    state: string
  ): Promise<OAuthCallbackResult> {
    return this.providers[provider].handleCallback?.(code, state) ?? 
      Promise.reject(new Error('Callback handling not supported'));
  }

}
