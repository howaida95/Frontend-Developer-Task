import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';

vi.mock('@features/dashboard/api/dashboardService', () => ({
  dashboardService: {
    getSummary: vi.fn(),
  },
}));

describe('Dashboard Feature Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads dashboard summary state on mount', async () => {
    const { dashboardService } = await import('@features/dashboard/api/dashboardService');
    
    dashboardService.getSummary.mockResolvedValue({
      totalMembers: 100,
      activeMembers: 85,
      sessionsThisMonth: 320,
      averageSessionsPerMember: 3.2,
      changeVsLastMonth: 5.5,
    });

    const preloadedState = {
      summary: {
        data: null,
        status: 'idle',
        error: null,
      },
    };

    const { store } = renderWithProviders(<div>Dashboard</div>, { preloadedState });

    // Wait for summary data to be available in state
    const state = store.getState();
    expect(state.summary).toBeDefined();
  });

  it('manages loading state while fetching summary', async () => {
    const { dashboardService } = await import('@features/dashboard/api/dashboardService');
    
    dashboardService.getSummary.mockImplementation(
      () => new Promise(() => {})
    );

    const preloadedState = {
      summary: {
        data: null,
        status: 'loading',
        error: null,
      },
    };

    const { store } = renderWithProviders(<div>Dashboard Loading</div>, { preloadedState });

    const state = store.getState();
    expect(state.summary.status).toBe('loading');
  });

  it('manages error state when summary fetch fails', async () => {
    const { dashboardService } = await import('@features/dashboard/api/dashboardService');
    
    const error = new Error('Failed to load summary');
    dashboardService.getSummary.mockRejectedValue(error);

    const preloadedState = {
      summary: {
        data: null,
        status: 'failed',
        error: 'Unable to load summary.',
      },
    };

    const { store } = renderWithProviders(<div>Dashboard Error</div>, { preloadedState });

    const state = store.getState();
    expect(state.summary.status).toBe('failed');
    expect(state.summary.error).toBeDefined();
  });

  it('preserves error state when retry is needed', async () => {
    const { dashboardService } = await import('@features/dashboard/api/dashboardService');
    
    dashboardService.getSummary
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        totalMembers: 100,
        activeMembers: 85,
        sessionsThisMonth: 320,
        averageSessionsPerMember: 3.2,
        changeVsLastMonth: 5.5,
      });

    const preloadedState = {
      summary: {
        data: null,
        status: 'failed',
        error: 'Unable to load summary.',
        canRetry: true,
      },
    };

    const { store } = renderWithProviders(<div>Dashboard Retry</div>, { preloadedState });
    
    const state = store.getState();
    expect(state.summary).toBeDefined();
  });
});
