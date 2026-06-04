import { useFriends } from "../../contexts/FriendsContext";
import { useChat } from "../../contexts/ChatContext";

export default function FriendList() {
    const {
        friends,
        requests,
        sentRequests,
        isLoading,
        acceptRequest,
        declineRequest,
        removeFriend,
        blockUser,
    } = useFriends();
    const { openChat } = useChat();

    if (isLoading)
        return (
            <p className="text-white/60 text-[16px]">Chargement des amis...</p>
        );

    return (
        <div className="flex flex-col gap-6 w-full">
            {(requests.length > 0 || sentRequests.length > 0) && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-white/60 text-sm uppercase font-bold tracking-wider">
                        Demandes en attente
                    </h3>
                    {requests.map((req) => (
                        <div
                            key={req.friendshipId}
                            className="flex flex-row items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={req.avatarUrl}
                                    alt={req.username}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-white font-medium">
                                    {req.username}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        acceptRequest(req.friendshipId)
                                    }
                                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 p-2 rounded-lg transition-colors"
                                >
                                    ✓
                                </button>
                                <button
                                    onClick={() =>
                                        declineRequest(req.friendshipId)
                                    }
                                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 p-2 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                    {sentRequests.map((req) => (
                        <div
                            key={req.friendshipId}
                            className="flex flex-row items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 border-dashed opacity-70"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={req.avatarUrl}
                                    alt={req.username}
                                    className="w-10 h-10 rounded-full object-cover grayscale"
                                />
                                <span className="text-white font-medium">
                                    {req.username}
                                </span>
                            </div>
                            <div className="flex gap-2 pr-2">
                                <span className="text-white/50 text-sm italic">
                                    En attente...
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4">
                <h3 className="text-white/60 text-sm uppercase font-bold tracking-wider">
                    Mes Amis
                </h3>
                {friends.length === 0 ? (
                    <p className="text-white/40 italic">
                        Vous n'avez pas encore d'amis.
                    </p>
                ) : (
                    friends.map((friend) => (
                        <div
                            key={friend.friendshipId}
                            className="flex flex-row items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={friend.avatarUrl}
                                        alt={friend.username}
                                        className={`w-[50px] h-[50px] rounded-full object-cover border-2 transition-colors ${
                                            friend.status === "online"
                                                ? "border-green-500"
                                                : "border-transparent"
                                        }`}
                                    />
                                    {friend.status === "online" && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1E1E1E] rounded-full"></span>
                                    )}
                                </div>
                                <span className="text-white text-lg font-medium">
                                    {friend.username}
                                </span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                    onClick={() =>
                                        openChat({
                                            id: friend.id,
                                            username: friend.username,
                                            avatarUrl: friend.avatarUrl,
                                        })
                                    }
                                    className="text-blue-400/70 hover:text-blue-400 font-bold"
                                    title="Message privé"
                                >
                                    💬
                                </button>
                                <button
                                    onClick={() =>
                                        removeFriend(friend.friendshipId)
                                    }
                                    className="text-red-400/70 hover:text-red-400"
                                    title="Retirer l'ami"
                                >
                                    ✕
                                </button>
                                <button
                                    onClick={() => blockUser(friend.id)}
                                    className="text-slate-400/70 hover:text-red-600 font-bold"
                                    title="Bloquer"
                                >
                                    Ø
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
