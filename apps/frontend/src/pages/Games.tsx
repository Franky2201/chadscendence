import { Link } from 'react-router-dom';

export default function GamesPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 hover:border-pink-500/50 transition-colors">
            <h2 className="text-2xl font-bold mb-4">Pong</h2>
            <p className="text-slate-300 mb-6">
              Le classique indémodable. Affrontez vos amis dans des parties
              endiablées.
            </p>
            <span className="bg-pink-600 px-4 py-2 rounded-full text-sm font-bold">
              BIENTÔT DISPONIBLE
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 opacity-50 cursor-not-allowed">
            <h2 className="text-2xl font-bold mb-4">D'autres jeux...</h2>
            <p className="text-slate-300 mb-6">
              De nouveaux défis arrivent bientôt sur Chadscendence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
