import api from './client';
import type { AuthResponse } from '../types';

export async function registerRequest(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { email, password, displayName });
  return data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}
