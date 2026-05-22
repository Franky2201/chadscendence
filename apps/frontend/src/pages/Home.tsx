import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui';
import { useModal } from '../contexts/ModalContext';

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();
  const { openModal } = useModal();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
      <div className="relative z-10 flex h-full min-h-screen">
        <div className="flex w-1/2 flex-col items-start gap-10 pl-10 pt-10">
          <img
            src="/logo.png"
            alt="WhoIsChad"
            className="w-72 object-contain drop-shadow-2xl"
          />

          <button
            onClick={() => openModal('GAME')}
            className="w-72 rounded-2xl border-2 border-white/80 bg-[#E43A70] py-4 text-center text-3xl font-black tracking-wide text-white shadow-xl drop-shadow-lg transition-transform hover:scale-105"
          >
            Jouer
          </button>

          {!user && (
            <Button onClick={() => openModal('LOGIN')} size="large">
              Se connecter
            </Button>
          )}

          <div className="flex flex-1 flex-col justify-between mt-10">
            <nav className="flex flex-col gap-5 text-xl font-bold">
              <Link
                to="/faq"
                className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105"
              >
                Les jeux
              </Link>
              {user && (
                <>
                  <Link
                    to="/friends"
                    className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105"
                  >
                    Mes amis
                  </Link>
                  <Link
                    to="/history"
                    className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105"
                  >
                    Historique
                  </Link>
                </>
              )}
              <a
                href="https://cdn.intra.42.fr/pdf/pdf/203995/en.subject.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105"
              >
                Subject
              </a>
              <Link
                to="/about"
                className="w-fit text-2xl hover:text-[#E43A70] transition-colors hover:scale-105"
              >
                Credits
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex w-1/2 flex-col items-end gap-10 pr-10 pt-10">
          {user && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.avatarUrl}
                onClick={logout}
                alt="avatar"
                className="w-40 h-40 rounded-full hover:cursor-pointer transition-transform hover:scale-110"
              />
              <h2 className="text-3xl">{user.username}</h2>
              <h2 className="text-3xl">{user.rank.icon} {user.rank.name} - {user.score}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
