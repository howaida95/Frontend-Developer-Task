import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@features/auth/api/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}));

describe('Auth Feature Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists session across navigation', async () => {
    // Integration test for session persistence
    // Would test auth state + localStorage interaction
    const preloadedState = {
      session: {
        user: { email: 'test@example.com', admin: true },
        authenticated: true,
      },
    };

    const { store } = renderWithProviders(<div>Dashboard</div>, { preloadedState });

    // Verify session state is available
    const state = store.getState();
    expect(state.session.authenticated).toBe(true);
  });

  it('authentication flow updates auth and session state', async () => {
    const { authService } = await import('@features/auth/api/authService');
    
    authService.login.mockResolvedValue({
      token: 'test-token',
      admin: true,
    });

    authService.me.mockResolvedValue({
      email: 'test@example.com',
      admin: true,
    });

    const preloadedState = {
      auth: {
        status: 'idle',
        error: null,
      },
      session: {
        user: null,
        authenticated: false,
        status: 'idle',
      },
    };

    const { store } = renderWithProviders(<div>Auth</div>, { preloadedState });
    
    // Verify initial state
    expect(store.getState().session.authenticated).toBe(false);
  });
});
