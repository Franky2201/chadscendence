import { Link } from "react-router-dom";
import type { UserListItem } from "../../services/users";

interface UserCardProps {
    user: UserListItem;
    actions?: React.ReactNode;
}

export function UserCard({ user, actions }: UserCardProps) {
    return (
        <div className="flex flex-col items-center justify-between w-56 h-64 bg-slate-800/70 border border-slate-700 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center gap-3">
                <Link
                    to={`/profile/${user.username}`}
                    className="relative group"
                >
                    {user.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-20 h-20 rounded-full object-cover border-2 border-slate-600 transition-transform group-hover:scale-105 shadow-md"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-3xl font-bold text-white transition-transform group-hover:scale-105 shadow-md">
                            {user.username[0].toUpperCase()}
                        </div>
                    )}
                    <span
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-800 ${
                            user.status === "online"
                                ? "bg-green-400"
                                : "bg-slate-500"
                        }`}
                    />
                </Link>

                <div className="text-center mt-2">
                    <Link to={`/profile/${user.username}`}>
                        <p className="font-bold text-lg text-white hover:text-pink-400 transition-colors">
                            {user.username}
                        </p>
                    </Link>
                    <p className="text-sm text-slate-400">{user.score} pts</p>
                </div>
            </div>

            {actions && (
                <div className="flex flex-col w-full gap-2 mt-auto">
                    {actions}
                </div>
            )}
        </div>
    );
}
