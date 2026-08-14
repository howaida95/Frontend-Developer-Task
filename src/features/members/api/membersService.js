import { apiRequest } from '@shared/api/client';
import { ENDPOINTS } from '@shared/api/endpoints';

export const membersService = {
  getMembers: ({ signal, query }) =>
    apiRequest(ENDPOINTS.club.members, {
      signal,
      params: {
        page: query.page,
        per_page: 25,
        search: query.search,
        tier: query.tier,
        status: query.status,
        sort: query.sort,
        dir: query.dir,
      },
    }),

  getMember: ({ signal, id }) => apiRequest(ENDPOINTS.club.member(id), { signal }),

  getSessions: ({ signal, id, page = 1, perPage = 10 }) =>
    apiRequest(ENDPOINTS.club.sessions(id), {
      signal,
      params: { page, per_page: perPage },
    }),
};
