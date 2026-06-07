import type { UserListItem } from "../../services/users";

interface UserCardProps {
    user: UserListItem;
    actions?: React.ReactNode;
}

export function UserCard({ user, actions }: UserCardProps) {
    return (
        <div className="flex flex-col items-center gap-3 bg-slate-800/70 border border-slate-700 rounded-2xl p-5 backdrop-blur-sm">
            <div className="relative">
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-600"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center text-2xl font-bold text-white">
                        {user.username[0].toUpperCase()}
                    </div>
                )}
                <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-800 ${
                        user.status === "online"
                            ? "bg-green-400"
                            : "bg-slate-500"
                    }`}
                />
            </div>

            <div className="text-center">
                <p className="font-bold text-white">{user.username}</p>
                <p className="text-xs text-slate-400">{user.score} pts</p>
            </div>

            {actions && (
                <div className="flex flex-col w-full gap-2 mt-1">{actions}</div>
            )}
        </div>
    );
}
