import { api } from './api';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('api service', () => {
  it('getAlerts should call correct URL and return data', async () => {
    const mockData = [{ location: 'Tel Aviv' }];
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await api.getAlerts();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/alerts'));
    expect(result).toEqual(mockData);
  });

  it('getAlerts should throw error if response not ok', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: false });

    await expect(api.getAlerts()).rejects.toThrow('Failed to fetch alerts');
  });

  it('createAlert should post data and return response', async () => {
    const res = { status: 201 };
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => res,
    });

    const data = {
      location: 'Tel Aviv',
      parameter: 'temperature',
      operator: '>',
      threshold: 30,
      description: 'Hot',
      email: 'test@example.com',
    };

    const result = await api.createAlert(
      data.location,
      data.parameter,
      data.operator,
      data.threshold,
      data.description,
      data.email,
    );

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/alerts'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, threshold: 30 }),
      }),
    );

    expect(result.ok).toBe(true);
  });

  it('createAlert should throw error if request fails', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: false });

    await expect(api.createAlert('a', 'b', '>', 1, 'c', 'd')).rejects.toThrow(
      'Failed to create alert',
    );
  });

  it('deleteAlert should call correct URL and do nothing on 204', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ status: 204 });

    await api.deleteAlert('123');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/alerts/123'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('deleteAlert should throw error on non-204 response', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      status: 400,
      json: async () => ({ error: 'Bad request' }),
    });

    await expect(api.deleteAlert('123')).rejects.toThrow('Bad request');
  });

  it('updateAlert should PUT updated alert and return response json', async () => {
    const updated = { _id: 'abc', location: 'NY', parameter: 'windSpeed' };
    const mockResponse = { success: true };

    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await api.updateAlert(updated);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/alerts/abc'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updated),
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('updateAlert should throw error if response not ok', async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({ ok: false });

    await expect(api.updateAlert({ _id: 'bad' })).rejects.toThrow('Failed to update alert');
  });
});
