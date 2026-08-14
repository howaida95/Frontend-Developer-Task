export const ENDPOINTS = Object.freeze({
  auth: {
    login: '/api/auth/login',
    me: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  club: {
    summary: '/api/club/summary',
    members: '/api/club/members',
    member: (id) => `/api/club/members/${id}`,
    sessions: (id) => `/api/club/members/${id}/sessions`,
  },
});
