import { describe, expect, it, vi } from 'vitest';
import { ApiError, classifyResponse, requestJson } from '../api/client';

describe('authenticated API boundary', () => {
  it('classifies HTTP 401 as unauthorized', () => {
    expect(classifyResponse(401)).toMatchObject({ kind: 'unauthorized', status: 401 });
  });

  it('does not call fetch when offline', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(requestJson('/api/checkpoints', {}, 'test-token', false))
      .rejects.toMatchObject({ kind: 'offline' });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('turns an actual 401 response into a typed error', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 })
    );
    await expect(requestJson('/api/checkpoints', {}, 'invalid-token'))
      .rejects.toBeInstanceOf(ApiError);
    await expect(requestJson('/api/checkpoints', {}, 'invalid-token'))
      .rejects.toMatchObject({ kind: 'unauthorized', status: 401 });
    fetchSpy.mockRestore();
  });
});
