import api from './api';

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
