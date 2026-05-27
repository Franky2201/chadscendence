import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input } from '../components/ui';
import { updateMe } from '../services/users';

export default function ProfilePage() {
  const { user, isLoading, logout, login } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );

  const handleEdit = () => {
    setUsername(user.username);
    setAvatarUrl(user.avatarUrl);
    setBio(user.bio ?? '');
    setPassword('');
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMe({
        username: username || undefined,
        avatarUrl: avatarUrl || undefined,
        bio: bio || undefined,
        password: password || undefined,
      });
      login(updated);
      setEditing(false);
    } catch {
      setError('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-slate-900 bg-cover bg-center text-white font-sans"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 p-8">
        <Link
          to="/"
          className="absolute top-8 left-8 text-xl font-bold hover:text-[#E43A70] transition-colors hover:scale-105"
        >
          ← Accueil
        </Link>

        <div
          className="flex flex-col items-center gap-6 p-10 w-full max-w-lg rounded-[32px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
          }}
        >
          <img
            src={editing && avatarUrl ? avatarUrl : user.avatarUrl}
            alt="avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-white/20 shadow-xl"
          />

          {!editing ? (
            <>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-4xl font-black">{user.username}</h1>
                <p className="text-white/60 text-lg">{user.email}</p>
                <p className="text-2xl mt-1">
                  {user.rank.icon} {user.rank.name}
                </p>
                <p className="text-3xl font-bold text-[#FFD931]">
                  {user.score} pts
                </p>
                {user.bio && (
                  <p className="text-white/70 text-base text-center max-w-sm mt-1 italic">
                    {user.bio}
                  </p>
                )}
                {user.role === 'admin' && (
                  <span className="text-xs bg-[#E43A70] px-3 py-1 rounded-full font-bold uppercase tracking-widest mt-1">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex gap-4 mt-2 flex-wrap justify-center">
                <Button onClick={handleEdit} size="medium">
                  Modifier le profil
                </Button>
                <Button onClick={handleLogout} size="medium">
                  Se déconnecter
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-4 w-full">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur"
                  className="w-full"
                />
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL de l'avatar"
                  className="w-full"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Biographie (optionnelle)"
                  rows={3}
                  className="w-full rounded-2xl px-6 py-3 text-base font-bold bg-slate-950 text-slate-50 border border-slate-500 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 resize-none"
                />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nouveau mot de passe (optionnel)"
                  className="w-full"
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>

              <div className="flex gap-4 mt-2 flex-wrap justify-center">
                <Button onClick={handleSave} disabled={saving} size="medium">
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button onClick={() => setEditing(false)} size="medium">
                  Annuler
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
