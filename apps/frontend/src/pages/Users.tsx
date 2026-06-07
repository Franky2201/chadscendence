import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Input } from "../components/ui";
import { UserCard } from "../components/users/UserCard";
import { AddFriendModal } from "../components/modals/AddFriendModal";
import { EditUserModal } from "../components/modals/EditUserModal";
import { BanModal } from "../components/modals/BanModal";
import { getAllUsers, AccountStatus } from "../services/users";
import type { UserListItem } from "../services/users";
import { useAuth } from "../contexts/AuthContext";
import { useFriends } from "../contexts/FriendsContext";

type ActiveModal =
    | { type: "friend"; user: UserListItem }
    | { type: "edit"; user: UserListItem }
    | { type: "ban"; user: UserListItem }
    | null;

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const { friends, sentRequests } = useFriends();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(() =>
                setError("Impossible de charger la liste des joueurs."),
            )
            .finally(() => setIsLoading(false));
    }, []);

    const updateUserInList = (updated: UserListItem) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? updated : u)),
        );
    };

    const updateUserStatus = (userId: string, accountStatus: AccountStatus) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, accountStatus } : u)),
        );
    };

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
                        <h1 className="text-4xl font-black tracking-wide drop-shadow-xl">
                            Joueurs
                        </h1>
                        <Link to="/">
                            <Button>Retour</Button>
                        </Link>
                    </div>
                </div>

                <div className="relative z-10 px-10 pb-4 flex items-center gap-6">
                    <Input
                        placeholder="Rechercher un joueur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-72 !bg-white/10 !border-white/20 !text-white !text-left !font-normal placeholder:!text-white/40"
                    />
                    <p className="text-slate-400 text-sm">
                        {isLoading
                            ? "Chargement..."
                            : `${filteredUsers.length} joueur${filteredUsers.length !== 1 ? "s" : ""}`}
                    </p>
                </div>

                <div className="relative z-10 flex-1 px-10 pb-10">
                    {isLoading && (
                        <div className="flex items-center justify-center h-64 text-slate-400">
                            Chargement...
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center h-64 text-red-400">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    actions={
                                        currentUser &&
                                        currentUser.id !== user.id ? (
                                            <>
                                                {!friends.some(
                                                    (f) => f.id === user.id,
                                                ) &&
                                                    !sentRequests.some(
                                                        (r) =>
                                                            r.addresseeId ===
                                                            user.id,
                                                    ) && (
                                                        <Button
                                                            color="green"
                                                            size="small"
                                                            className="w-full"
                                                            onClick={() =>
                                                                setActiveModal({
                                                                    type: "friend",
                                                                    user,
                                                                })
                                                            }
                                                        >
                                                            Ajouter comme ami
                                                        </Button>
                                                    )}
                                                <Button
                                                    color="blue"
                                                    size="small"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setActiveModal({
                                                            type: "edit",
                                                            user,
                                                        })
                                                    }
                                                >
                                                    Modifier
                                                </Button>
                                                <Button
                                                    color={
                                                        user.accountStatus ===
                                                        AccountStatus.BANNED
                                                            ? "orange"
                                                            : "red"
                                                    }
                                                    size="small"
                                                    className="w-full"
                                                    onClick={() =>
                                                        setActiveModal({
                                                            type: "ban",
                                                            user,
                                                        })
                                                    }
                                                >
                                                    {user.accountStatus ===
                                                    AccountStatus.BANNED
                                                        ? "Débannir"
                                                        : "Bannir"}
                                                </Button>
                                            </>
                                        ) : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activeModal?.type === "friend" && (
                <AddFriendModal
                    user={activeModal.user}
                    onClose={() => setActiveModal(null)}
                />
            )}

            {activeModal?.type === "edit" && (
                <EditUserModal
                    user={activeModal.user}
                    onClose={() => setActiveModal(null)}
                    onSuccess={updateUserInList}
                />
            )}

            {activeModal?.type === "ban" && (
                <BanModal
                    user={activeModal.user}
                    onClose={() => setActiveModal(null)}
                    onSuccess={(accountStatus) =>
                        updateUserStatus(activeModal.user.id, accountStatus)
                    }
                />
            )}
        </div>
    );
}
