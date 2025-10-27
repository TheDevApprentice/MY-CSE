// src/services/index.ts - Export central

import apiService from "./api";

// Service principal
export { default as apiService } from "./api";
export { apiService as api } from "./api";

// Types

export type {
  ApiError,
  ApiResponse,
  RequestConfig,
  PaginationParams,
  PaginationResponse,
  AuthTokens,
  User,
  ApiConfig,
  EnvironmentConfig,
} from "./types";

// Export de convenance pour les imports courts
export const {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
  setAuthToken,
  clearAuthToken,
  setBaseURL,
  getBaseURL,
} = apiService;
