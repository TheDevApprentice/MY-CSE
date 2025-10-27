import { ApiResponse } from '@/services/api';
import type { BasicUserInfo, SignupData } from '../authServiceTypes';

export type AuthProvider = 'google' | 'microsoft' | 'api';
export type AuthAction = 'login' | 'signup' | 'logout' | 'forgotPassword' | 'whoami' | 'refresh' | 'suspendAccount' | 'deleteAccount' | 'deleteAccountByAccountId' | 'deleteAccountByUserId' | 'resetPasswordValidate' | 'resetPassword' | 'validateAccount';

export interface AuthCredentials {
  email: string;
  password: string;
  [key: string]: any;
}

export interface AuthResult<T = any> extends ApiResponse<T> {
  url?: string;
  provider: AuthProvider;
  action: AuthAction;
}

export interface OAuthCallbackResult {
  success: boolean;
  user?: BasicUserInfo;
  error?: string;
}

export interface IAuthProvider {
  // Auth User Methods
  login(credentials?: AuthCredentials): Promise<AuthResult>;
  signup(userData?: SignupData): Promise<AuthResult>;
  logout?(): Promise<AuthResult>;
  refresh?(): Promise<AuthResult>;

  whoami?(): Promise<AuthResult>;

  suspendAccount?(): Promise<AuthResult>;
  deleteAccount?(): Promise<AuthResult>;
  validateAccount?(validationCode: string): Promise<AuthResult>;

  forgotPassword?(email: string): Promise<AuthResult>;
  resetPasswordValidate?(validationCode: string): Promise<AuthResult>;
  resetPassword?(validationCode: string): Promise<AuthResult>;
  
  handleCallback?(code: string, state: string): Promise<OAuthCallbackResult>;

  // Admin Auth Methods
  deleteAccountByAccountId?(accountId: string): Promise<AuthResult>;
  deleteAccountByUserId?(userId: string): Promise<AuthResult>;
}
