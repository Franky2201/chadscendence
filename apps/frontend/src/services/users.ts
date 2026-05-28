import api from './api';
import { UserStatus, UserRole } from '@chad/types';
import type { User } from '@chad/types';

export type { User };
export { UserStatus, UserRole };

interface UpdateMe {
  username?: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
}

export type LeaderboardType = {
  id: string | number;
  username: string;
  avatarUrl: string;
  score: number;
}[];

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (data: UpdateMe): Promise<User> => {
  const res = await api.patch<User>('/users/me', data);
  return res.data;
};

export const deleteMe = async (): Promise<{ message: string }> => {
  const res = await api.delete<{ message: string }>('/users/me');
  return res.data;
};

export const getLeaderboard = async (
  count: number,
): Promise<LeaderboardType> => {
  const res = await api.get<LeaderboardType>(
    `/users/leaderboard?count=${count}`,
  );
  return res.data;
};
