import api from './api';
import type { Game } from '@chad/types';

export type { Game };

export const getGames = async (): Promise<Game[]> => {
  const response = await api.get<Game[]>('/games');
  return response.data;
};
