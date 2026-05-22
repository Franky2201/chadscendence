import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
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
  password?: string;
  avatarUrl?: string;
  bio?: string;
}

const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

const updateMe = async (data: UpdateMe) => {
  const res = await api.patch('/users/me', data);
  return res.data;
};

const deleteMe = async () => {
  const res = await api.delete('/users/me');
  return res.data;
};

export default { getMe, updateMe, deleteMe };
