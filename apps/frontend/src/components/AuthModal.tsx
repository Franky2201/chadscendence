import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/auth/login', { identifier, password });

            const userResponse = await api.get('/users/me');

            login(userResponse.data);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Erreur de connexion");
        }
    };

    const handleIntraLogin = () => {
        window.location.href = 'http://localhost:3000/auth/42';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl p-10 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>

                {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
                    <input
                        type="text" placeholder="Identifiant" value={identifier} onChange={e => setIdentifier(e.target.value)}
                        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" required
                    />
                    <input
                        type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500" required
                    />
                    <button type="submit" className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition">
                        Se connecter
                    </button>
                </form>

                <div className="flex flex-col gap-3">
                    <button onClick={handleIntraLogin} className="w-full bg-gray-900 text-white rounded-xl py-3 font-bold hover:bg-gray-800 transition">
                        Continuer avec 42
                    </button>
                </div>
            </div>
        </div>
    );
}
