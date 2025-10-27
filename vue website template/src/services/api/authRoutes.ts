export const ApiAuthEndpoints = {
    // Auth
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    logout: "/v1/auth/logout",
    oauthCallback: "/v1/auth/oauth-callback",
    refresh: "/v1/auth/refresh",
    whoami: "/v1/auth/whoami",
    forgotPassword: `/v1/auth/forgot-password`,
    validateAccount: (code: string) => `/v1/auth/validate-account/${code}`,
    resetPasswordValidate: (code: string) => `/v1/auth/reset-password-validate/${code}`,
    resetPassword: (code: string) => `/v1/auth/reset-password/${code}`,
    deleteAccount: "/v1/auth/delete-account",
    suspendAccount: "/v1/auth/suspend-account",
    deleteAccountByAccountId: (id: string) => `/v1/auth/delete-account-accountId/${id}`,
    deleteAccountByUserId: (id: string) => `/v1/auth/delete-account-userId/${id}`,
  } as const;