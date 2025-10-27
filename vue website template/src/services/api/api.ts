// src/services/api.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiResponse, RequestConfig } from ".";
import { CookieUtils } from "@/utils/cookieUtils";

// ===== CONFIGURATION =====
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
} as const;

// ===== CLASSE API SERVICE =====
class ApiService {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  // ===== CONFIGURATION DES INTERCEPTEURS =====
  private setupInterceptors(): void {
    // Intercepteur de requête
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return this.handleRequest(config);
      },
      (error: AxiosError) => {
        return this.handleRequestError(error);
      }
    );

    // Intercepteur de réponse
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return this.handleResponse(response);
      },
      (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  // ===== GESTION DES REQUÊTES =====
  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    // Ajouter le token d'authentification si disponible
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter la locale actuelle
    const locale = this.getCurrentLocale();
    if (locale) {
      config.headers["Accept-Language"] = locale;
    }

    // Log en développement
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  }

  private handleRequestError(error: AxiosError): Promise<never> {
    console.error("❌ Request Error:", error);
    return Promise.reject(this.formatError(error));
  }

  // ===== GESTION DES RÉPONSES =====
  private handleResponse(response: AxiosResponse): AxiosResponse {
    if (import.meta.env.DEV) {
      console.log(
        `✅ ${response.status} ${response.config.url}`,
        response.data
      );
    }

    return response;
  }

  private async handleResponseError(error: AxiosError): Promise<never> {
    const config = error.config as RequestConfig;

    // Gestion de l'authentification
    if (error.response?.status === 401 && !config?.skipAuth) {
      return this.handle401Error(error);
    }

    // Retry logic pour les erreurs réseau
    if (
      this.shouldRetry(error) &&
      (config?.retries ?? API_CONFIG.retries) > 0
    ) {
      return this.retryRequest(error);
    }

    // Gestion des erreurs spécifiques
    if (!config?.skipErrorHandling) {
      this.handleSpecificErrors(error);
    }

    return Promise.reject(this.formatError(error));
  }

  // ===== GESTION DE L'AUTHENTIFICATION =====
  private async handle401Error(error: AxiosError): Promise<never> {
    const config = error.config as RequestConfig;

    if (this.isRefreshing) {
      // Si un refresh est en cours, mettre en queue
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return this.instance(config);
      });
    }

    this.isRefreshing = true;

    try {
      const newToken = await this.refreshToken();

      // Résoudre toutes les requêtes en attente
      this.processQueue(null, newToken);

      // Relancer la requête originale
      if (config.headers) {
        config.headers.Authorization = `Bearer ${newToken}`;
      }
      return this.instance(config);
    } catch (refreshError) {
      this.processQueue(refreshError, null);
      this.handleAuthError();
      return Promise.reject(this.formatError(error));
    } finally {
      this.isRefreshing = false;
    }
  }

  private processQueue(error: any, token: string | null): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  // ===== RETRY LOGIC =====
  private shouldRetry(error: AxiosError): boolean {
    return (
      !error.response ||
      error.response.status >= 500 ||
      error.code === "NETWORK_ERROR" ||
      error.code === "TIMEOUT"
    );
  }

  private async retryRequest(error: AxiosError): Promise<never> {
    const config = error.config as RequestConfig;
    const retries = (config.retries ?? API_CONFIG.retries) - 1;

    await this.delay(API_CONFIG.retryDelay);

    return this.instance({
      ...config,
      retries,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ===== MÉTHODES UTILITAIRES =====
  private getAuthToken(): string | null {
    return CookieUtils.get("auth_token");
  }

  private getCurrentLocale(): string {
    // Tenter de récupérer la locale depuis le localStorage ou le navigateur
    return (
      localStorage.getItem("app-locale") ||
      navigator.language.split("-")[0] ||
      "fr"
    );
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = CookieUtils.get("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token: newRefreshToken } = response.data;

    CookieUtils.set("auth_token", access_token);
    CookieUtils.set("refresh_token", newRefreshToken);

    return access_token;
  }

  private handleAuthError(): void {
    // Nettoyer les tokens
    CookieUtils.remove("auth_token");
    CookieUtils.remove("refresh_token");
  }

  private handleSpecificErrors(error: AxiosError): void {
    const status = error.response?.status;

    switch (status) {
      case 403:
        console.warn("⚠️ Access forbidden - insufficient permissions");
        break;
      case 404:
        console.warn("⚠️ Resource not found");
        break;
      case 422:
        console.warn("⚠️ Validation error:", error.response?.data);
        break;
      case 429:
        console.warn("⚠️ Rate limit exceeded");
        break;
      case 500:
        console.error("❌ Internal server error");
        break;
      default:
        console.error("❌ API Error:", error.message);
    }
  }

  private formatError(error: AxiosError): ApiError {
    const response = error.response;

    return {
      message:
        response?.data?.message || error.message || "Une erreur est survenue",
      status: response?.status,
      code: error.code,
      data: response?.data,
    };
  }

  // ===== MÉTHODES PUBLIQUES =====

  // GET
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, config);
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // POST
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // PUT
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data, config);
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // PATCH
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<T>(url, data, config);
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // DELETE
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url, config);
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // UPLOAD
  async upload<T = any>(
    url: string,
    file: File,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await this.instance.post<T>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return this.normalizeResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // DOWNLOAD
  async download(
    url: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    try {
      const response = await this.instance.get(url, {
        ...config,
        responseType: "blob",
      });

      // Créer un lien de téléchargement
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw error;
    }
  }

  // MÉTHODES UTILITAIRES
  setAuthToken(token: string): void {
    CookieUtils.set("auth_token", token);
  }

  clearAuthToken(): void {
    CookieUtils.remove("auth_token");
    CookieUtils.remove("refresh_token");
  }

  setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  getBaseURL(): string {
    return this.instance.defaults.baseURL || "";
  }

  // Normaliser la réponse
  private normalizeResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      message: response.statusText,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
    };
  }

  // Accès à l'instance Axios pour les cas avancés
  get axiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// ===== INSTANCE SINGLETON =====
export const apiService = new ApiService();
export default apiService;
