import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ isOpen, onClose }: LoginModalProps) {
  const { user } = useAuth();
  const { openModal } = useModal();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

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
          Prêt à jouer ?
        </h2>

        <form className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Code de la partie"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition"
          >
            Rejoindre
          </button>
        </form>

        <div className="flex flex-col gap-3">
          <button
            onClick={user ? () => { navigate('/room') } : () => openModal('LOGIN')}
            className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition"
          >
            Créer une partie
          </button>
        </div>
      </div>
    </div>
  );
}
