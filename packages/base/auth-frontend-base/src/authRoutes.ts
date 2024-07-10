export const AUTH_BASE_ROUTE = '/auth';

export const authRoutes = {
  login: `${AUTH_BASE_ROUTE}/login`,
  signup: `${AUTH_BASE_ROUTE}/signup`,
  verifyEmailRequired: `${AUTH_BASE_ROUTE}/verify-email-required`,
  verifyEmailProcess: `${AUTH_BASE_ROUTE}/verify-email-process`,
  resetPasswordRequest: `${AUTH_BASE_ROUTE}/reset-password-request`,
  resetPasswordConfirm: `${AUTH_BASE_ROUTE}/reset-password-confirm`,
};

export const authRoutesList = Object.values(authRoutes);
