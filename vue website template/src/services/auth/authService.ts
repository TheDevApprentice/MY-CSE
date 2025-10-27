import type { BasicUserInfo, SignupData } from "./authServiceTypes";
import type {
  AuthResult,
  OAuthCallbackResult,
} from "./providers/providerTypes";
import { ProviderService } from "./providers/providerService";

const providerService = new ProviderService();

/**
 * Service pour la gestion de l'authentification
 */
export class AuthService {
  /**
   * Connexion avec email/mot de passe
   */
  static async loginWithEmail(
    email: string,
    password: string
  ): Promise<BasicUserInfo> {
    const result = await providerService.login("api", { email, password });
    if (!result.data?.user) throw new Error("Login failed");
    return result.data.user;
  }

  /**
   * Inscription avec email/mot de passe
   */
  static async signupWithEmail(userData: SignupData): Promise<BasicUserInfo> {
    const result = await providerService.signup("api", userData);
    if (!result.data?.user) throw new Error("Signup failed");
    return result.data.user;
  }

  /**
   * Connexion rapide avec Google
   */
  static async quickLoginWithGoogle(): Promise<AuthResult> {
    return providerService.login("google");
  }

  /**
   * Connexion rapide avec Microsoft
   */
  static async quickLoginWithMicrosoft(): Promise<AuthResult> {
    return providerService.login("microsoft");
  }

  /**
   * Inscription rapide avec Google
   */
  static async quickSignUpWithGoogle(): Promise<AuthResult> {
    return providerService.signup("google");
  }

  /**
   * Inscription rapide avec Microsoft
   */
  static async quickSignUpWithMicrosoft(): Promise<AuthResult> {
    return providerService.signup("microsoft");
  }

  /**
   * Déconnexion
   */
  static async logout(): Promise<void> {
    await providerService.logout("api");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
  }

  /**
   * Mot de passe oublié
   */
  static async forgotPassword(email: string): Promise<void> {
    await providerService.forgotPassword("api", email);
  }

  /**
   * Gère le callback OAuth
   */
  static async handleOAuthCallback(
    provider: "google" | "microsoft",
    code: string,
    state: string
  ): Promise<OAuthCallbackResult> {
    return providerService.handleCallback(provider, code, state);
  }
}