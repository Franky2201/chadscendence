import { useState } from 'react';
import { register } from '../../services/auth';
import { getMe } from '../../services/users';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { extractErrorMessage } from '../../services/error';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledEmail?: string;
}

export default function RegisterModal({
  isOpen,
  onClose,
  prefilledEmail = '',
}: RegisterModalProps) {
  const { login } = useAuth();
  const { openModal } = useModal();

  const [email, setEmail] = useState(prefilledEmail);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register({ email, username, password });

      const userResponse = await getMe();
      login(userResponse);
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
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
          Bienvenue !
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            Créer un compte
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => openModal('LOGIN')}
            className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold hover:bg-gray-800 transition"
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
