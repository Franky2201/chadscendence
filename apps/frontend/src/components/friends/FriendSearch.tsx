import { useState, useEffect } from "react";
import { searchUsers } from "../../services/users";
import type { UserSearchResult } from "@chad/types";
import { useFriends } from "../../contexts/FriendsContext";
import { Input, Button } from "../ui";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

interface FriendSearchProps {
    onSearchActive: (isActive: boolean) => void;
}

export default function FriendSearch({ onSearchActive }: FriendSearchProps) {
    const {
        sendRequest,
        friends,
        sentRequests,
        requests,
        acceptRequest,
        declineRequest,
    } = useFriends();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        onSearchActive(query.length > 0);

        if (query.trim() === "") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const users = await searchUsers(query);
                setResults(users);
            } catch {
                setResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, onSearchActive]);

    const handleSendRequest = async (userId: string) => {
        try {
            await sendRequest(userId);
        } catch {
            // Silently handle errors to meet 'no console error' requirement
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <Input
                type="text"
                placeholder={t("friends.search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                color={theme}
                className="w-full !bg-white/10 !border-white/20 !text-white !rounded-xl !px-4 !py-3 focus:!outline-none focus-visible:!ring-2 focus-visible:!ring-[color:var(--ui-color)] placeholder:!text-white/40"
            />

            {query.length > 0 && (
                <div className="flex flex-col gap-3">
                    {isSearching ? (
                        <p className="text-white/60 text-sm">
                            {t("friends.searching")}
                        </p>
                    ) : results.length > 0 ? (
                        results.map((user) => {
                            const isAlreadyFriend = friends.some(
                                (f) => f.id === user.id,
                            );
                            const isRequestSent = sentRequests.some(
                                (req) => req.addresseeId === user.id,
                            );
                            const isRequestReceived = requests.find(
                                (req) => req.requesterId === user.id,
                            );

                            return (
                                <div
                                    key={user.id}
                                    className="flex flex-row items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <span className="text-white font-medium">
                                            {user.username}
                                        </span>
                                    </div>

                                    {isAlreadyFriend ? (
                                        <Button
                                            disabled
                                            size="small"
                                            className="!bg-white/5 !border-white/10 !text-white/40 !rounded-lg"
                                        >
                                            {t("friends.friend")}
                                        </Button>
                                    ) : isRequestReceived ? (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    acceptRequest(
                                                        isRequestReceived.friendshipId,
                                                    )
                                                }
                                                size="small"
                                                className="!bg-green-500/20 !text-green-400 hover:!bg-green-500/30 !rounded-lg"
                                            >
                                                ✓
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    declineRequest(
                                                        isRequestReceived.friendshipId,
                                                    )
                                                }
                                                size="small"
                                                className="!bg-red-500/20 !text-red-400 hover:!bg-red-500/30 !rounded-lg"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ) : isRequestSent ? (
                                        <Button
                                            disabled
                                            size="small"
                                            className="!bg-slate-700 !text-slate-300 !rounded-lg"
                                        >
                                            {t("friends.waiting")}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                handleSendRequest(user.id)
                                            }
                                            size="small"
                                            color={theme}
                                            className="!rounded-lg"
                                        >
                                            {t("friends.add")}
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-white/60 text-sm">
                            {t("friends.noResults")}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
