import api from './api';
import type { Rank } from '@chad/types';

export type { Rank };

interface CreateRank {
  name: string;
  minScore: number;
  icon?: string;
}

interface UpdateRank {
  name?: string;
  minScore?: number;
  icon?: string;
}

const getRanks = async () => {
  const res = await api.get('/ranks');
  return res.data;
};

const getRank = async (id: string) => {
  const res = await api.get(`/ranks/${id}`);
  return res.data;
};

const createRank = async (data: CreateRank) => {
  const res = await api.post('/ranks', data);
  return res.data;
};

const updateRank = async (id: string, data: UpdateRank) => {
  const res = await api.patch(`/ranks/${id}`, data);
  return res.data;
};

const deleteRank = async (id: string) => {
  const res = await api.delete(`/ranks/${id}`);
  return res.data;
};

export default { getRanks, getRank, createRank, updateRank, deleteRank };
