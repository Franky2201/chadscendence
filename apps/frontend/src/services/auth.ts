import api from './api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
};

export const logout = async (): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/auth/logout');
  return res.data;
};

export const withIntra = (): void => {
  window.location.href = 'http://localhost:3000/auth/42';
};

export const withGithub = (): void => {
  window.location.href = 'http://localhost:3000/auth/github';
};
