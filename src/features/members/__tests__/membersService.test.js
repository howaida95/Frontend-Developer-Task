import { beforeEach, describe, expect, it, vi } from 'vitest';
import { membersService } from '../api/membersService';
import { apiRequest } from '@shared/api/client';

vi.mock('@shared/api/client', () => ({
  apiRequest: vi.fn(),
}));

describe('members service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getMembers endpoint with query parameters', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: { en: 'John', ar: 'جون' }, memberNumber: 'RSC-00001' },
        { id: 2, name: { en: 'Jane', ar: 'جين' }, memberNumber: 'RSC-00002' },
      ],
      meta: { page: 1, per_page: 25, total: 2, last_page: 1 },
    };
    apiRequest.mockResolvedValue(mockResponse);

    const query = { page: 1, search: '', tier: '', status: '', sort: 'sessionsThisMonth', dir: 'desc' };
    const result = await membersService.getMembers({ signal: undefined, query });

    expect(apiRequest).toHaveBeenCalled();
    expect(result.data.length).toBe(2);
    expect(result.meta.total).toBe(2);
  });

  it('includes search parameter in getMembers request', async () => {
    const mockResponse = { data: [], meta: { page: 1, per_page: 25, total: 0, last_page: 1 } };
    apiRequest.mockResolvedValue(mockResponse);

    const query = { page: 1, search: 'John', tier: '', status: '', sort: 'sessionsThisMonth', dir: 'desc' };
    await membersService.getMembers({ query });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.search).toBe('John');
  });

  it('includes filter parameters in getMembers request', async () => {
    const mockResponse = { data: [], meta: { page: 1, per_page: 25, total: 0, last_page: 1 } };
    apiRequest.mockResolvedValue(mockResponse);

    const query = { page: 1, search: '', tier: 'premium', status: 'active', sort: 'sessionsThisMonth', dir: 'asc' };
    await membersService.getMembers({ query });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.tier).toBe('premium');
    expect(callArgs.params.status).toBe('active');
  });

  it('includes sort parameters in getMembers request', async () => {
    const mockResponse = { data: [], meta: { page: 1, per_page: 25, total: 0, last_page: 1 } };
    apiRequest.mockResolvedValue(mockResponse);

    const query = { page: 2, search: '', tier: '', status: '', sort: 'totalSessions', dir: 'desc' };
    await membersService.getMembers({ query });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.page).toBe(2);
    expect(callArgs.params.sort).toBe('totalSessions');
    expect(callArgs.params.dir).toBe('desc');
  });

  it('calls getMember endpoint with member ID', async () => {
    const mockMember = {
      id: 1,
      name: { en: 'John', ar: 'جون' },
      memberNumber: 'RSC-00001',
      email: 'john@example.com',
      tier: 'premium',
      status: 'active',
    };
    apiRequest.mockResolvedValue({ data: mockMember });

    const result = await membersService.getMember({ id: 1 });

    expect(apiRequest).toHaveBeenCalled();
    expect(result.data).toEqual(mockMember);
  });

  it('passes signal to getMember for cancellation', async () => {
    apiRequest.mockResolvedValue({ data: {} });

    const controller = new AbortController();
    await membersService.getMember({ signal: controller.signal, id: 1 });

    expect(apiRequest).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ signal: controller.signal })
    );
  });

  it('calls getSessions endpoint with pagination', async () => {
    const mockSessions = {
      data: [
        { id: '1-0', date: '2024-08-15', className: { en: 'Yoga', ar: 'يوغا' }, durationMinutes: 60 },
        { id: '1-1', date: '2024-08-13', className: { en: 'Swimming', ar: 'سباحة' }, durationMinutes: 45 },
      ],
      meta: { page: 1, per_page: 10, total: 45, last_page: 5 },
    };
    apiRequest.mockResolvedValue(mockSessions);

    const result = await membersService.getSessions({ id: 1, page: 1 });

    expect(apiRequest).toHaveBeenCalled();
    expect(result.data.length).toBe(2);
    expect(result.meta.total).toBe(45);
  });

  it('includes page parameter in getSessions request', async () => {
    const mockSessions = { data: [], meta: { page: 2, per_page: 10, total: 50, last_page: 5 } };
    apiRequest.mockResolvedValue(mockSessions);

    await membersService.getSessions({ id: 1, page: 2 });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.page).toBe(2);
  });

  it('uses default perPage value of 10 in getSessions', async () => {
    const mockSessions = { data: [], meta: { page: 1, per_page: 10, total: 25, last_page: 3 } };
    apiRequest.mockResolvedValue(mockSessions);

    await membersService.getSessions({ id: 1 });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.per_page).toBe(10);
  });

  it('allows custom perPage value in getSessions', async () => {
    const mockSessions = { data: [], meta: { page: 1, per_page: 20, total: 50, last_page: 3 } };
    apiRequest.mockResolvedValue(mockSessions);

    await membersService.getSessions({ id: 1, perPage: 20 });

    const callArgs = apiRequest.mock.calls[0][1];
    expect(callArgs.params.per_page).toBe(20);
  });

  it('handles getMembers failure', async () => {
    const error = new Error('Network error');
    apiRequest.mockRejectedValue(error);

    try {
      const query = { page: 1, search: '', tier: '', status: '', sort: 'sessionsThisMonth', dir: 'desc' };
      await membersService.getMembers({ query });
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Network error');
    }
  });

  it('handles getMember failure', async () => {
    const error = new Error('Member not found');
    apiRequest.mockRejectedValue(error);

    try {
      await membersService.getMember({ id: 999 });
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Member not found');
    }
  });

  it('handles getSessions failure', async () => {
    const error = new Error('Network error');
    apiRequest.mockRejectedValue(error);

    try {
      await membersService.getSessions({ id: 1 });
      expect.fail('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('Network error');
    }
  });
});
