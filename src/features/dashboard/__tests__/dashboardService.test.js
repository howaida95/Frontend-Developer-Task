import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dashboardService } from '../api/dashboardService';
import { apiRequest } from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
}));

describe('dashboard service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getSummary endpoint', async () => {
    const mockSummary = {
      totalMembers: 100,
      activeMembers: 85,
      sessionsThisMonth: 320,
      averageSessionsPerMember: 3.2,
      changeVsLastMonth: 5.5,
    };
    apiRequest.mockResolvedValue(mockSummary);

    const result = await dashboardService.getSummary();

    expect(apiRequest).toHaveBeenCalled();
    expect(result).toEqual(mockSummary);
  });

  it('passes signal to getSummary for cancellation', async () => {
    const mockSummary = { totalMembers: 100, activeMembers: 85, sessionsThisMonth: 320 };
    apiRequest.mockResolvedValue(mockSummary);

    const controller = new AbortController();
    await dashboardService.getSummary({ signal: controller.signal });

    expect(apiRequest).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ signal: controller.signal })
    );
  });

  it('handles getSummary failure', async () => {
    const error = new Error('Network error');
    apiRequest.mockRejectedValue(error);

    try {
      await dashboardService.getSummary();
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Network error');
    }
  });

  it('handles timeout in getSummary', async () => {
    const error = new Error('Request timeout');
    error.code = 'ECONNABORTED';
    apiRequest.mockRejectedValue(error);

    try {
      await dashboardService.getSummary();
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.code).toBe('ECONNABORTED');
    }
  });

  it('returns summary with all required fields', async () => {
    const mockSummary = {
      totalMembers: 100,
      activeMembers: 85,
      sessionsThisMonth: 320,
      averageSessionsPerMember: 3.2,
      changeVsLastMonth: 5.5,
    };
    apiRequest.mockResolvedValue(mockSummary);

    const result = await dashboardService.getSummary();

    expect(result).toHaveProperty('totalMembers');
    expect(result).toHaveProperty('activeMembers');
    expect(result).toHaveProperty('sessionsThisMonth');
  });
});
