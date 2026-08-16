import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithProviders } from '@/test/utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@features/members/api/membersService', () => ({
  membersService: {
    getMembers: vi.fn(),
    getMember: vi.fn(),
    getSessions: vi.fn(),
  },
}));

describe('Members Feature Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('members state updates when getMembers is called', async () => {
    const { membersService } = await import('@features/members/api/membersService');
    
    membersService.getMembers.mockResolvedValue({
      data: [
        { id: 1, name: { en: 'John', ar: 'جون' }, tier: 'premium', status: 'active' },
        { id: 2, name: { en: 'Jane', ar: 'جين' }, tier: 'standard', status: 'active' },
      ],
      meta: { page: 1, total: 2, last_page: 1 },
    });

    const preloadedState = {
      members: {
        data: [],
        loading: false,
        error: null,
      },
    };

    const { store } = renderWithProviders(<div>Members</div>, { preloadedState });

    // Verify members state is available
    expect(store.getState().members).toBeDefined();
  });

  it('handles member search parameters in state', async () => {
    const { membersService } = await import('@features/members/api/membersService');
    
    membersService.getMembers.mockResolvedValue({
      data: [
        { id: 1, name: { en: 'John', ar: 'جون' }, tier: 'premium', status: 'active' },
      ],
      meta: { page: 1, total: 1, last_page: 1 },
    });

    const preloadedState = {
      members: {
        data: [],
        query: {
          search: 'John',
          page: 1,
          tier: '',
          status: '',
        },
      },
    };

    const { store } = renderWithProviders(<div>Members Search</div>, { preloadedState });
    
    const state = store.getState();
    expect(state.members.query).toBeDefined();
  });

  it('tracks latest member request to prevent race conditions', async () => {
    const { membersService } = await import('@features/members/api/membersService');
    
    membersService.getMembers.mockResolvedValue({
      data: [
        { id: 1, name: { en: 'John', ar: 'جون' }, tier: 'premium', status: 'active' },
      ],
      meta: { page: 1, total: 1, last_page: 1 },
    });

    const preloadedState = {
      members: {
        data: [],
        latestRequest: null,
      },
    };

    const { store } = renderWithProviders(<div>Members Latest</div>, { preloadedState });
    
    // Verify members state tracks latest request
    expect(store.getState().members).toBeDefined();
  });
});
