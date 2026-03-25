import '@testing-library/jest-dom/vitest';
import { beforeEach, vi } from 'vitest';

const finalAttackResponse = {
  '1501': {
    name: '駆逐イ級',
    final_attack: [{ key: 'dummy 単縦 dummy 砲撃', val: 50 }]
  }
};

const fleetPatternResponse = {
  '1-1': {
    'A-1': {
      form: '単縦',
      fleet: [1501]
    }
  }
};

const createJsonResponse = (body: unknown): Response => {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    headers: {
      get: () => 'application/json'
    }
  } as unknown as Response;
};

const mockFetchImplementation = async (input: RequestInfo | URL): Promise<Response> => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
      ? input.toString()
      : input.url;

  if (requestUrl.includes('/assets/final_attack.json')) {
    return createJsonResponse(finalAttackResponse);
  }
  if (requestUrl.includes('/assets/fleets_pattern.json')) {
    return createJsonResponse(fleetPatternResponse);
  }

  return createJsonResponse({});
};

const mockFetch = vi.fn((input: RequestInfo | URL) => mockFetchImplementation(input));
const mockedFetch = mockFetch as unknown as typeof fetch;

Object.defineProperty(globalThis, 'fetch', {
  configurable: true,
  writable: true,
  value: mockedFetch
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    writable: true,
    value: mockedFetch
  });
}

beforeEach(() => {
  mockFetch.mockReset();
  mockFetch.mockImplementation((input: RequestInfo | URL) => mockFetchImplementation(input));
});
