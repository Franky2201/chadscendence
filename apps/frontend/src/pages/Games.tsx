import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getGames } from '../services/games';
import type { Game } from '../services/games';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGames()
      .then((data) => setGames(data))
      .catch((err) => console.error('Failed to fetch games:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans p-10"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-slate-900/80" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-pink-500 hover:text-pink-400 mb-8 inline-block font-bold"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-5xl font-black mb-10 tracking-tight">LES JEUX</h1>

        {loading ? (
          <div className="text-2xl">Chargement des jeux...</div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-pink-500/50 transition-colors"
              >
                <h2 className="text-2xl font-bold mb-4">{game.name}</h2>
                <p className="text-slate-300 mb-6">{game.description}</p>
                <div className="flex items-center gap-3">
                  <span className="bg-green-600 px-4 py-2 rounded-full text-sm font-bold uppercase">
                    {game.status}
                  </span>
                  <button className="bg-pink-600 px-6 py-2 rounded-xl font-bold hover:bg-pink-700 transition">
                    Jouer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 text-center">
            <h2 className="text-2xl font-bold mb-4">Aucun jeu disponible</h2>
            <p className="text-slate-300">
              Les serveurs de jeu sont actuellement hors ligne. Revenez plus
              tard !
            </p>
          </div>
        )}

        {games.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 opacity-50 cursor-not-allowed">
              <h2 className="text-2xl font-bold mb-4">D'autres jeux...</h2>
              <p className="text-slate-300 mb-6">
                De nouveaux défis arrivent bientôt sur Chadscendence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
