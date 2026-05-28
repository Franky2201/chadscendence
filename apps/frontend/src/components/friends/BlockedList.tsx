import { useFriends } from '../../contexts/FriendsContext';

export default function BlockedList() {
  const { blockedUsers, unblockUser } = useFriends();

  if (blockedUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      <h3 className="text-white/60 text-sm uppercase font-bold tracking-wider pt-4 border-t border-white/10">
        Utilisateurs bloqués
      </h3>
      <div className="flex flex-col gap-3">
        {blockedUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-row items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover grayscale"
              />
              <span className="text-white font-medium line-through">
                {user.username}
              </span>
            </div>
            <button
              onClick={() => unblockUser(user.id)}
              className="bg-slate-700/50 hover:bg-slate-600 text-white text-sm font-bold py-1.5 px-3 rounded-lg transition-colors"
            >
              Débloquer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
