export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3001';

export type FailureKind = 'unauthorized' | 'offline' | 'server';

export class ApiError extends Error {
  constructor(public readonly kind: FailureKind, message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export function classifyResponse(status: number): ApiError {
  if (status === 401) return new ApiError('unauthorized', 'Session invalid or expired. Please sign in again.', 401);
  return new ApiError('server', `Request failed (${status}). Please retry.`, status);
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface Checkpoint {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  createdAt: string;
}

export interface CheckpointInput {
  label: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  connected = true,
): Promise<T> {
  if (!connected) {
    throw new ApiError('offline', 'You are offline. Connect to a network and try again.');
  }

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body !== undefined) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new ApiError('offline', 'The API is unreachable. Check your network and API address.');
  }

  if (!response.ok) {
    throw classifyResponse(response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('server', 'The server returned an invalid response.');
  }
}

export function login(email: string, password: string, connected: boolean) {
  return requestJson<LoginResponse>('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }, undefined, connected);
}

export function getCheckpoints(token: string, connected: boolean) {
  return requestJson<Checkpoint[]>('/api/checkpoints', {}, token, connected);
}

export function saveCheckpoint(token: string, checkpoint: CheckpointInput, connected: boolean) {
  return requestJson<Checkpoint>('/api/checkpoints', {
    method: 'POST', body: JSON.stringify(checkpoint),
  }, token, connected);
}
