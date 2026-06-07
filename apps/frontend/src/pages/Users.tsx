import { useEffect, useState } from "react";
import { Window, Button, Input, Title } from "../components/ui";
import { UserCard } from "../components/users/UserCard";
import { getAllUsers } from "../services/users";
import type { UserListItem } from "../services/users";
import { useAuth } from "../contexts/AuthContext";
import { useFriends } from "../contexts/FriendsContext";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";

export default function UsersPage() {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const { friends, sentRequests, sendRequest } = useFriends();
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    useEffect(() => {
        getAllUsers()
            .then(setUsers)
            .catch(() =>
                setError(t("users.error")),
            )
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Window>
            <Header />
            <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full p-8">
                <Title color="white" className="text-3xl text-left">
                    {t("users.title")}
                </Title>

                <div className="relative z-10 flex flex-col items-start gap-2">
                    <Input
                        placeholder={t("users.search")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xl !bg-white/10 !border-white/20 !text-white !text-left !font-normal placeholder:!text-white/40 !text-lg !py-3"
                    />
                    <p className="text-slate-400 text-sm">
                        {isLoading
                            ? t("users.loading")
                            : t("users.playersCount", { count: filteredUsers.length })}
                    </p>
                </div>

                <div className="relative z-10 flex-1 pb-10">
                    {isLoading && (
                        <div className="flex items-center justify-center h-64 text-slate-400">
                            {t("users.loading")}
                        </div>
                    )}

                    {error && (
                        <div className="flex items-center justify-center h-64 text-red-400">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="flex flex-wrap gap-6 justify-start">
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    actions={
                                        currentUser &&
                                            currentUser.id !== user.id ? (
                                            (() => {
                                                const isFriend = friends.some((f) => f.id === user.id);
                                                const isPending = sentRequests.some((r) => r.addresseeId === user.id);
                                                
                                                if (isFriend) {
                                                    return (
                                                        <Button color="grey" size="small" className="w-full" disabled>
                                                            {t("users.friend")}
                                                        </Button>
                                                    );
                                                }
                                                
                                                if (isPending) {
                                                    return (
                                                        <Button color="orange" size="small" className="w-full" disabled>
                                                            {t("users.pending")}
                                                        </Button>
                                                    );
                                                }
                                                
                                                return (
                                                    <Button
                                                        color="green"
                                                        size="small"
                                                        className="w-full"
                                                        onClick={() => sendRequest(user.id)}
                                                    >
                                                        {t("users.addFriend")}
                                                    </Button>
                                                );
                                            })()
                                        ) : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </Window >
    );
}
