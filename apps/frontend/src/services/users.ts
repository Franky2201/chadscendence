import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  githubId?: string;
  intraId?: string;
  role: 'user' | 'admin';
  score: number;
  rank: {
    id: string;
    name: string;
    minScore: number;
    icon?: string;
  };
}

interface UpdateMe {
  username?: string;
  oldPassword?: string;
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
  console.log(res.data);
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
