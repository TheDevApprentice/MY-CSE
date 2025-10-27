import type { IAuthProvider, AuthResult, AuthCredentials, OAuthCallbackResult } from './providerTypes';
import type { SignupData, BasicUserInfo } from '../authServiceTypes';
import { apiService } from '@services/api';
import { ApiEndpoints } from '@services/api/types';

export class AuthApiProvider implements IAuthProvider {
  async login(credentials?: AuthCredentials): Promise<AuthResult> {
    if (!credentials) throw new Error('Credentials required');
    
    const response = await apiService.post<BasicUserInfo>(ApiEndpoints.login, credentials);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'login',
      data: response.data
    };
  }

  async signup(userData?: SignupData): Promise<AuthResult> {
    if (!userData) throw new Error('User data required');
    
    const response = await apiService.post<BasicUserInfo>(ApiEndpoints.register, userData);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'signup',
      data: response.data
    };
  }

  async logout(): Promise<AuthResult> {
    const response = await apiService.post(ApiEndpoints.logout);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'logout'
    };
  }
  
  async forgotPassword(email: string): Promise<AuthResult> {
    const response = await apiService.post(ApiEndpoints.forgotPassword, { email });
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'forgotPassword',
      data: response.data
    };
  }

  async whoami(): Promise<AuthResult> {
    const response = await apiService.get<BasicUserInfo>(ApiEndpoints.whoami);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'whoami',
      data: response.data
    };
  }

  async validateAccount(validationCode: string): Promise<AuthResult> {
    const response = await apiService.get(ApiEndpoints.validateAccount(validationCode));
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'validateAccount',
      data: response.data
    };
  }

  async suspendAccount(): Promise<AuthResult> {
    const response = await apiService.get(ApiEndpoints.suspendAccount);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'suspendAccount',
      data: response.data
    };
  }
  
  async deleteAccount(): Promise<AuthResult> {
    const response = await apiService.delete(ApiEndpoints.deleteAccount);
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'deleteAccount',
      data: response.data
    };
  }
  
  async deleteAccountByAccountId(accountId: string): Promise<AuthResult> {
    const response = await apiService.delete(ApiEndpoints.deleteAccountByAccountId(accountId));
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'deleteAccountByAccountId',
      data: response.data
    };
  }

  async deleteAccountByUserId(userId: string): Promise<AuthResult> {
    const response = await apiService.delete(ApiEndpoints.deleteAccountByUserId(userId));
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'deleteAccountByUserId',
      data: response.data
    };
  }

  async resetPasswordValidate(validationCode: string): Promise<AuthResult> {
    const response = await apiService.get(ApiEndpoints.resetPasswordValidate(validationCode));
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'resetPasswordValidate',
      data: response.data
    };
  }

  async resetPassword(validationCode: string): Promise<AuthResult> {
    const response = await apiService.post(ApiEndpoints.resetPassword(validationCode));
    
    return {
      success: response.success,
      status: response.status,
      message: response.message,
      provider: 'api',
      action: 'resetPassword',
      data: response.data
    };
  }
  
  async handleCallback(code: string, state: string): Promise<OAuthCallbackResult> {
    const response = await apiService.post<BasicUserInfo>(ApiEndpoints.oauthCallback, { 
      code, 
      state,
      provider: 'api'
    });
    
    return {
      success: true,
      user: response.data
    };
  }
}
