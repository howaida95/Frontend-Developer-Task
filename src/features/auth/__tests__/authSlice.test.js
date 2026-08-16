import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout, hydrateSession, clearError } from '../authSlice';
import sessionReducer from '../sessionSlice';

vi.mock('@features/auth/api', () => ({
  authService: { login: vi.fn(), logout: vi.fn(), me: vi.fn() },
}));
import { authService } from '@features/auth/api';

describe('auth slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts in idle status with no error', () => {
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    expect(store.getState().auth.status).toBe('idle');
    expect(store.getState().auth.error).toBe(null);
  });

  it('sets status to loading during login', async () => {
    authService.login.mockResolvedValue({ user: { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' } });
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    const promise = store.dispatch(login({ email: 'admin@example.com', password: 'password' }));
    expect(store.getState().auth.status).toBe('loading');
    
    await promise;
    expect(store.getState().auth.status).toBe('succeeded');
  });

  it('sets error on login rejection', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    await store.dispatch(login({ email: 'admin@example.com', password: 'wrong' }));
    expect(store.getState().auth.status).toBe('failed');
    expect(store.getState().auth.error).toBe('Invalid credentials');
  });

  it('rejects non-admin users during login', async () => {
    authService.login.mockResolvedValue({ user: { id: 2, name: { en: 'User', ar: 'مستخدم' }, email: 'user@example.com', role: 'member' } });
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    await store.dispatch(login({ email: 'user@example.com', password: 'password' }));
    expect(store.getState().auth.status).toBe('failed');
    expect(store.getState().auth.error).toBe('Only administrators can access this portal.');
  });

  it('sets status to checking during session hydration', async () => {
    authService.me.mockResolvedValue({ user: { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' } });
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    const promise = store.dispatch(hydrateSession());
    expect(store.getState().auth.status).toBe('checking');
    
    await promise;
    expect(store.getState().auth.status).toBe('succeeded');
  });

  it('rejects non-admin users during hydration', async () => {
    authService.me.mockResolvedValue({ user: { id: 2, name: { en: 'User', ar: 'مستخدم' }, email: 'user@example.com', role: 'member' } });
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    await store.dispatch(hydrateSession());
    expect(store.getState().auth.status).toBe('idle');
  });

  it('clears error on demand', () => {
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    // Set an error manually
    store.dispatch(login({ email: 'admin@example.com', password: 'wrong' }));
    
    // Then wait and clear
    setTimeout(() => {
      expect(store.getState().auth.error).not.toBe(null);
      store.dispatch(clearError());
      expect(store.getState().auth.error).toBe(null);
    }, 100);
  });

  it('returns to idle status after logout', async () => {
    authService.logout.mockResolvedValue({});
    const store = configureStore({ reducer: { auth: authReducer, session: sessionReducer } });
    
    await store.dispatch(logout());
    expect(store.getState().auth.status).toBe('idle');
    expect(store.getState().auth.error).toBe(null);
  });
});
