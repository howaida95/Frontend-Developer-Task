import { beforeEach, describe, expect, it, vi } from 'vitest';
import api, { apiRequest } from '@shared/api/client';

beforeEach(() => vi.restoreAllMocks());

describe('apiRequest', () => {
  it('uses credentialed Axios requests without exposing an Authorization token', async () => {
    const request = vi.spyOn(api, 'request').mockResolvedValue({ data: { data: 'ok' } });

    await expect(apiRequest('/api/test')).resolves.toEqual({ data: 'ok' });

    expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: '/api/test' }));
    expect(request.mock.calls[0][0].headers.Authorization).toBeUndefined();
  });

  it('normalizes API errors', async () => {
    vi.spyOn(api, 'request').mockRejectedValue({
      response: { status: 500, data: { message: 'Oops', code: 'UPSTREAM_ERROR' } },
    });

    await expect(apiRequest('/api/test')).rejects.toEqual(
      expect.objectContaining({ message: 'Oops', status: 500, code: 'UPSTREAM_ERROR' }),
    );
  });
});
