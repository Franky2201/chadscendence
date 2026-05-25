import { useState } from 'react';
import axios from 'axios';
import { login as loginAuth, withIntra } from '../../services/auth';
import { getMe } from '../../services/users';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { extractErrorMessage } from '../../services/error';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const { openModal } = useModal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await loginAuth({ email, password });
      const userResponse = await getMe();
      login(userResponse);
      onClose();
    } catch (err) {
      const errorMessage = extractErrorMessage(err);

      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 404 ||
          errorMessage.includes('Account not found'))
      ) {
        openModal('REGISTER', { prefilledEmail: email });
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-10 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Se connecter
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition"
          >
            Se connecter
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => openModal('REGISTER', { prefilledEmail: email })}
            className="w-full bg-gray-200 text-gray-900 rounded-xl py-3 font-bold hover:bg-gray-300 transition"
          >
            Créer un compte
          </button>
          <button
            onClick={withIntra}
            className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold hover:bg-gray-800 transition"
          >
            Continuer avec 42
          </button>
        </div>
      </div>
    </div>
  );
}
