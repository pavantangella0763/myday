import api from './client';
import type { Profile } from '../types';

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>('/profile');
  return data;
}

export async function updateBudget(monthlyBudget: number): Promise<Profile> {
  const { data } = await api.put<Profile>('/profile/budget', { monthlyBudget });
  return data;
}
