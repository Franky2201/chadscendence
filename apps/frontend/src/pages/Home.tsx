import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

export default function HomePage() {
    const { user, isLoading, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div
            className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
            style={{ backgroundImage: "url('/background.png')" }}
        >
            <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
            <div className="relative z-10 flex h-full min-h-screen">
                <div className="flex w-1/2 flex-col items-start gap-10 pl-10 pt-10">
                    <img src="/logo.png" alt="WhoIsChad" className="w-72 object-contain drop-shadow-2xl" />

                    <button className="w-72 rounded-2xl border-2 border-white/80 bg-[#E43A70] py-4 text-center text-3xl font-black tracking-wide text-white shadow-xl drop-shadow-lg transition-transform hover:scale-105">
                        Jouer
                    </button>

                    <div className="flex flex-1 flex-col justify-between mt-10">
                        <nav className="flex flex-col gap-5 text-xl font-bold">
                            <Link to="/faq" className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105">
                                Les jeux
                            </Link>
                            {user && (
                                <>
                                    <Link to="/friends" className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105">
                                        Mes amis
                                    </Link>
                                    <Link to="/history" className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105">
                                        Historique
                                    </Link>
                                </>
                            )}
                            <a href="https://cdn.intra.42.fr/pdf/pdf/203995/en.subject.pdf" target="_blank" rel="noopener noreferrer" className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105">
                                Subject
                            </a>
                            <Link to="/about" className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105">
                                Credits
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="flex w-1/2 flex-col items-end gap-10 pr-10 pt-10">
                    {user ? (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-xl">Bienvenue, <span className="font-bold text-pink-500">{user.username}</span> !</p>
                            <img src={user.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full" />
                            <button onClick={logout} className="px-6 py-3 bg-slate-700 rounded-full font-bold hover:bg-slate-600 transition">Se déconnecter</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 rounded-full border-2 border-white/20 bg-[#E43A70] px-5 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
                        >
                            Se connecter
                        </button>
                    )}
                </div>
            </div>
            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
