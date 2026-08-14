import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { hydrateSession, login, logout } from '@features/auth/authSlice';
import sessionReducer from '@features/auth/sessionSlice';
vi.mock('@features/auth/api', () => ({
  authService: { login: vi.fn(), logout: vi.fn(), me: vi.fn() },
}));
import { authService } from '@features/auth/api';

describe('authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('starts anonymous on initial load', () => {
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });

    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
  });

  it('attempts session hydration on app load', async () => {
    authService.me.mockResolvedValue({
      user: {
        id: 1,
        name: { en: 'Admin', ar: 'مدير' },
        email: 'admin@example.com',
        role: 'admin',
      },
    });

    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    await store.dispatch(hydrateSession());

    expect(authService.me).toHaveBeenCalled();
    expect(store.getState().session.status).toBe('authenticated');
    expect(store.getState().session.user.email).toBe('admin@example.com');
  });

  it('stores the authenticated user without exposing a token to Redux', async () => {
    authService.login.mockResolvedValue({
      user: { id: 1, name: { en: 'Admin', ar: 'مدير' }, email: 'admin@example.com', role: 'admin' },
    });
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    await store.dispatch(login({ email: 'admin@example.com', password: 'secret' }));
    expect(store.getState().session.user.email).toBe('admin@example.com');
    expect(store.getState().session.authenticated).toBe(true);
    expect(store.getState().session.token).toBeUndefined();
  });

  it('blocks non-admin users from accessing the dashboard', async () => {
    authService.login.mockResolvedValue({
      user: { id: 2, name: { en: 'Member', ar: 'عضو' }, email: 'member@example.com', role: 'member' },
    });

    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    const result = await store.dispatch(login({ email: 'member@example.com', password: 'secret' }));

    expect(result.type).toBe('auth/login/rejected');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBeNull();
  });

  it('clears the client session as soon as logout starts', async () => {
    authService.login.mockResolvedValue({
      user: { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com' },
    });
    authService.logout.mockReturnValue(new Promise(() => {}));

    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    await store.dispatch(login({ email: 'admin@example.com', password: 'secret' }));

    store.dispatch(logout());

    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.user).toBeNull();
  });
});
