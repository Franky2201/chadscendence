import axios from 'axios';

export const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || 'Erreur de connexion avec le serveur';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Une erreur inattendue est survenue';
};
