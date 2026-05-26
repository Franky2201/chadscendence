import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui';
import Friends from '../components/friends/Friends';

export default function FriendsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">
        Chargement...
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
        <h1 className="text-3xl font-bold">Accès refusé</h1>
        <p>Veuillez vous connecter pour voir vos amis.</p>
        <Link to="/">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90" />
      
      <div className="relative z-10 flex flex-col h-full min-h-screen">
        <div className="flex w-full justify-between items-center p-10">
          <Link to="/">
            <img
              src="/logo.png"
              alt="WhoIsChad"
              className="w-48 object-contain drop-shadow-2xl transition-transform hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black tracking-wide drop-shadow-xl">Mes Amis</h1>
            <Link to="/">
              <Button>Retour</Button>
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-1 justify-center items-start pt-10">
          <Friends />
        </div>
      </div>
    </div>
  );
}
