import { apiRequest } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';

export const authService = {
  login: ({ email, password }) =>
    apiRequest(ENDPOINTS.auth.login, {
      method: 'POST',
      body: { email, password },
    }),

  me: ({ signal } = {}) =>
    apiRequest(ENDPOINTS.auth.me, {
      signal,
      timeout: 2500,
      maxRetries: 0,
      suppressUnauthorizedHandler: true,
    }),

  logout: () =>
    apiRequest(ENDPOINTS.auth.logout, {
      method: 'POST',
      timeout: 2500,
      maxRetries: 0,
      suppressUnauthorizedHandler: true,
    }),
};
