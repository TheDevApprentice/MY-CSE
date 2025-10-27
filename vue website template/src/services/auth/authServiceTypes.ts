// Types spécifiques au AuthService
export interface BasicUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiAuthResponse {
  success: boolean;
  user?: BasicUserInfo;
  token?: string;
  error?: string;
}