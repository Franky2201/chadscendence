import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import users from '../services/users';

export default function Home() {
    const { user, isLoading, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteMe = async () => {
        await users.deleteMe();
        logout();
    };

    if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                Transcendence
            </h1>

            {user ? (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-xl">Bienvenue, <span className="font-bold text-pink-500">{user.username}</span> !</p>
                    <img src={user.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full" />
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-pink-600 rounded-full font-bold hover:bg-pink-700 transition">Jouer</button>
                        <button onClick={logout} className="px-6 py-3 bg-slate-700 rounded-full font-bold hover:bg-slate-600 transition">Se déconnecter</button>
                        <button onClick={handleDeleteMe} className="px-6 py-3 bg-red-700 rounded-full font-bold hover:bg-red-800 transition">Supprimer mon compte</button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-pink-600 rounded-full text-xl font-bold hover:bg-pink-700 transition shadow-lg hover:shadow-pink-500/50"
                >
                    Se connecter pour jouer
                </button>
            )}

            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
