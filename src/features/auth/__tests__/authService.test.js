import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from '../api/authService';
import { apiRequest } from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
}));

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls login endpoint with email and password', async () => {
    const mockUser = { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' };
    apiRequest.mockResolvedValue({ user: mockUser });

    const result = await authService.login({ email: 'admin@example.com', password: 'password' });
    
    expect(apiRequest).toHaveBeenCalled();
    expect(result.user).toEqual(mockUser);
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');
    apiRequest.mockRejectedValue(error);

    try {
      await authService.login({ email: 'admin@example.com', password: 'wrong' });
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Invalid credentials');
    }
  });

  it('calls me endpoint with optional signal', async () => {
    const mockUser = { id: 1, name: { en: 'Admin', ar: 'أدمن' }, email: 'admin@example.com', role: 'admin' };
    apiRequest.mockResolvedValue({ user: mockUser });

    const controller = new AbortController();
    const result = await authService.me({ signal: controller.signal });

    expect(apiRequest).toHaveBeenCalled();
    expect(result.user).toEqual(mockUser);
  });

  it('calls logout endpoint', async () => {
    apiRequest.mockResolvedValue({});

    const result = await authService.logout();

    expect(apiRequest).toHaveBeenCalled();
    expect(result).toEqual({});
  });

  it('handles logout failure gracefully', async () => {
    const error = new Error('Network error');
    apiRequest.mockRejectedValue(error);

    try {
      await authService.logout();
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Network error');
    }
  });
});
