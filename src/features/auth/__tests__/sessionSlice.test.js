import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import sessionReducer, { clearSession } from '../sessionSlice';
import authReducer, { login, hydrateSession, logout } from '../authSlice';

vi.mock('@features/auth/api', () => ({
  authService: { login: vi.fn(), logout: vi.fn(), me: vi.fn() },
}));
import { authService } from '@features/auth/api';

describe('session slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with anonymous status', () => {
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });

  it('sets checking status during hydration', async () => {
    authService.me.mockResolvedValue({ user: { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' } });
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    const promise = store.dispatch(hydrateSession());
    expect(store.getState().session.status).toBe('checking');
    
    await promise;
  });

  it('sets authenticated status after successful login', async () => {
    const user = { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' };
    authService.login.mockResolvedValue({ user });
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(login({ email: 'admin@example.com', password: 'password' }));
    expect(store.getState().session.status).toBe('authenticated');
    expect(store.getState().session.authenticated).toBe(true);
    expect(store.getState().session.user).toEqual(user);
  });

  it('stays anonymous if login user is not admin', async () => {
    authService.login.mockResolvedValue({ user: { id: 2, name: { en: 'User', ar: 'مستخدم' }, email: 'user@example.com', role: 'member' } });
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(login({ email: 'user@example.com', password: 'password' }));
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });

  it('sets authenticated status after successful hydration', async () => {
    const user = { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' };
    authService.me.mockResolvedValue({ user });
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(hydrateSession());
    expect(store.getState().session.status).toBe('authenticated');
    expect(store.getState().session.authenticated).toBe(true);
    expect(store.getState().session.user).toEqual(user);
  });

  it('returns to anonymous status on logout', async () => {
    authService.logout.mockResolvedValue({});
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(logout());
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });

  it('clears session on demand', () => {
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    store.dispatch(clearSession());
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });

  it('returns to anonymous on failed hydration', async () => {
    authService.me.mockRejectedValue(new Error('Unauthorized'));
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(hydrateSession());
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });

  it('returns to anonymous on failed login', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    const store = configureStore({ reducer: { session: sessionReducer, auth: authReducer } });
    
    await store.dispatch(login({ email: 'admin@example.com', password: 'wrong' }));
    expect(store.getState().session.status).toBe('anonymous');
    expect(store.getState().session.authenticated).toBe(false);
    expect(store.getState().session.user).toBe(null);
  });
});
