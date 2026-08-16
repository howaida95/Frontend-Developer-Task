import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { summaryReducer, fetchSummary } from '../summarySlice';

vi.mock('@features/dashboard/api', () => ({
  dashboardService: { getSummary: vi.fn() },
}));
import { dashboardService } from '@features/dashboard/api';

describe('summary slice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with idle status', () => {
    const store = configureStore({ reducer: { summary: summaryReducer } });
    expect(store.getState().summary.status).toBe('idle');
    expect(store.getState().summary.data).toBe(null);
    expect(store.getState().summary.error).toBe(null);
  });

  it('sets loading status when fetching summary', async () => {
    const mockData = { totalMembers: 100, activeMembers: 85, sessionsThisMonth: 320, averageSessionsPerMember: 3.2, changeVsLastMonth: 5.5 };
    dashboardService.getSummary.mockResolvedValue(mockData);
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    const promise = store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('loading');
    
    await promise;
  });

  it('sets succeeded status and data on successful fetch', async () => {
    const mockData = { totalMembers: 100, activeMembers: 85, sessionsThisMonth: 320, averageSessionsPerMember: 3.2, changeVsLastMonth: 5.5 };
    dashboardService.getSummary.mockResolvedValue(mockData);
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('succeeded');
    expect(store.getState().summary.data).toEqual(mockData);
    expect(store.getState().summary.error).toBe(null);
  });

  it('sets failed status and error message on failed fetch', async () => {
    const errorMessage = 'Network error';
    dashboardService.getSummary.mockRejectedValue(new Error(errorMessage));
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('failed');
    expect(store.getState().summary.error).toBe(errorMessage);
    expect(store.getState().summary.data).toBe(null);
  });

  it('clears error on retry', async () => {
    const mockData = { totalMembers: 100, activeMembers: 85, sessionsThisMonth: 320, averageSessionsPerMember: 3.2, changeVsLastMonth: 5.5 };
    dashboardService.getSummary.mockRejectedValueOnce(new Error('Network error'));
    dashboardService.getSummary.mockResolvedValueOnce(mockData);
    
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    // First attempt fails
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('failed');
    expect(store.getState().summary.error).toBe('Network error');
    
    // Second attempt succeeds
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('succeeded');
    expect(store.getState().summary.data).toEqual(mockData);
    expect(store.getState().summary.error).toBe(null);
  });

  it('preserves data during loading on retry', async () => {
    const mockData = { totalMembers: 100, activeMembers: 85, sessionsThisMonth: 320, averageSessionsPerMember: 3.2, changeVsLastMonth: 5.5 };
    dashboardService.getSummary.mockResolvedValueOnce(mockData);
    dashboardService.getSummary.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    // First successful fetch
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.data).toEqual(mockData);
    
    // Start second fetch that never completes
    store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('loading');
    // Data should still be preserved
    expect(store.getState().summary.data).toEqual(mockData);
  });

  it('handles default error message', async () => {
    dashboardService.getSummary.mockRejectedValue(null);
    const store = configureStore({ reducer: { summary: summaryReducer } });
    
    await store.dispatch(fetchSummary());
    expect(store.getState().summary.status).toBe('failed');
    expect(store.getState().summary.error).toBe('Unable to load summary.');
  });
});
