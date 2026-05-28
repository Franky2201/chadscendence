import api from './api';

export interface Game {
  id: string;
  name: string;
  description: string;
  port: number;
  status: string;
}

export const getGames = async (): Promise<Game[]> => {
  const response = await api.get<Game[]>('/games');
  return response.data;
};
