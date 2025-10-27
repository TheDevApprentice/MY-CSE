// src/services/types.ts

import { AxiosRequestConfig } from "axios";
import { ApiAuthEndpoints } from "./authRoutes";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  // status?: string;
  roles: string[];
  permissions: string[];
  created_at?: string;
  updated_at?: string;
  lastLogin?: Date;
}
export interface PaginationResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Endpoints typés
export type EndpointWithParams<T extends string | number = string> = (param: T) => string;

export const ApiEndpoints = {
  // Auth
  ...ApiAuthEndpoints,

  // Users
  users: "/v1/users",
  userById: (id: string) => `/v1/users/${id}`,
} as const;

export type ApiEndpointsType = typeof ApiEndpoints;
export type ApiEndpointKey = keyof ApiEndpointsType;

// Configuration des environnements
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface EnvironmentConfig {
  development: ApiConfig;
  staging: ApiConfig;
  production: ApiConfig;
}

// ===== TYPES =====
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  retries?: number;
}
