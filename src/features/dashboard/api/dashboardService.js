import { apiRequest } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';

export const dashboardService = {
  getSummary: ({ signal } = {}) => apiRequest(ENDPOINTS.club.summary, { signal }),
};
