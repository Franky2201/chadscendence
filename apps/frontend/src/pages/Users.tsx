import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Window, Title, Input, Button, Select } from "../components/ui";
import { Header } from "../components/Header";
import { UserCard } from "../components/users/UserCard";
import { useAuth } from "../contexts/AuthContext";
import { useFriends } from "../contexts/FriendsContext";
import { getAllUsers } from "../services/users";
import { getRanks } from "../services/ranks";
import type { UserListItem, Rank } from "@chad/types";
import { useTheme } from "../contexts/ThemeContext";

const ITEMS_PER_PAGE = 2;
type SortOption = "alpha_asc" | "alpha_desc" | "rating_desc" | "rating_asc";

export default function UsersPage() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const { friends, sentRequests, sendRequest } = useFriends();

    const [users, setUsers] = useState<UserListItem[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRank, setSelectedRank] = useState<string>("ALL");
    const [sortBy, setSortBy] = useState<SortOption>("alpha_asc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        Promise.all([getAllUsers(), getRanks()])
            .then(([usersData, ranksData]) => {
                setUsers(usersData);
                setRanks(ranksData);
            })
            .catch(() => toast.error(t("users.error")))
            .finally(() => setIsLoading(false));
    }, [t]);

    const { paginatedUsers, totalPages, totalResults } = useMemo(() => {
        let processed = users.filter((u) => {
            const matchSearch = u.username
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchRank =
                selectedRank === "ALL" || u.rank?.name === selectedRank;
            return matchSearch && matchRank;
        });

        processed = processed.sort((a, b) => {
            if (sortBy === "rating_desc")
                return (b.rating || 0) - (a.rating || 0);
            if (sortBy === "rating_asc")
                return (a.rating || 0) - (b.rating || 0);
            if (sortBy === "alpha_asc")
                return a.username.localeCompare(b.username);
            if (sortBy === "alpha_desc")
                return b.username.localeCompare(a.username);
            return 0;
        });

        const total = processed.length;
        const totalPagesCalc = Math.ceil(total / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginated = processed.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE,
        );

        return {
            paginatedUsers: paginated,
            totalPages: totalPagesCalc,
            totalResults: total,
        };
    }, [users, searchQuery, selectedRank, sortBy, currentPage]);

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleRankChange = (val: string) => {
        setSelectedRank(val);
        setCurrentPage(1);
    };

    const handleSortChange = (val: SortOption) => {
        setSortBy(val);
        setCurrentPage(1);
    };

    return (
        <Window>
            <Header />
            <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full p-8">
                <Title color="white" className="text-3xl text-left">
                    {t("users.title")}
                </Title>

                <div className="relative z-10 flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                    <Input
                        placeholder={t("users.search")}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full !bg-black/20 !border-white/20 !text-white !text-left !font-normal placeholder:!text-white/40 !text-lg !py-3"
                    />

                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 w-full sm:w-auto">
                            <Select
                                value={selectedRank}
                                onChange={(e) =>
                                    handleRankChange(e.target.value)
                                }
                                className="text-white border border-white/20 rounded-xl pl-4 pr-12 py-2 outline-none"
                            >
                                <option value="ALL">
                                    {t("users.allRanks")}
                                </option>
                                {ranks.map((rank) => (
                                    <option key={rank.id} value={rank.name}>
                                        {rank.name}
                                    </option>
                                ))}
                            </Select>

                            <div className="flex gap-2 p-2 rounded-xl border border-white/10">
                                <Button
                                    color={
                                        sortBy === "alpha_asc" ? theme : "grey"
                                    }
                                    disabled={sortBy === "alpha_asc"}
                                    onClick={() =>
                                        handleSortChange("alpha_asc")
                                    }
                                >
                                    {t("users.sort.alphaAsc")}
                                </Button>
                                <Button
                                    color={
                                        sortBy === "alpha_desc" ? theme : "grey"
                                    }
                                    disabled={sortBy === "alpha_desc"}
                                    onClick={() =>
                                        handleSortChange("alpha_desc")
                                    }
                                >
                                    {t("users.sort.alphaDesc")}
                                </Button>
                                <Button
                                    color={
                                        sortBy === "rating_desc"
                                            ? theme
                                            : "grey"
                                    }
                                    disabled={sortBy === "rating_desc"}
                                    onClick={() =>
                                        handleSortChange("rating_desc")
                                    }
                                >
                                    {t("users.sort.ratingDesc")}
                                </Button>
                                <Button
                                    color={
                                        sortBy === "rating_asc" ? theme : "grey"
                                    }
                                    disabled={sortBy === "rating_asc"}
                                    onClick={() =>
                                        handleSortChange("rating_asc")
                                    }
                                >
                                    {t("users.sort.ratingAsc")}
                                </Button>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm font-mono">
                            {isLoading
                                ? t("users.loading")
                                : t("users.playersCount", {
                                      count: totalResults,
                                  })}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex-1 min-h-[50vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64 text-slate-400">
                            {t("users.loading")}...
                        </div>
                    ) : totalResults === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 font-mono italic bg-black/20 rounded-2xl border border-white/5">
                            {t("users.noResults")}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
                            {paginatedUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    actions={
                                        currentUser &&
                                        currentUser.id !== user.id
                                            ? (() => {
                                                  const isFriend = friends.some(
                                                      (f) => f.id === user.id,
                                                  );
                                                  const isPending =
                                                      sentRequests.some(
                                                          (r) =>
                                                              r.addresseeId ===
                                                              user.id,
                                                      );

                                                  if (isFriend) {
                                                      return (
                                                          <Button
                                                              color={theme}
                                                              className="w-full"
                                                              disabled
                                                          >
                                                              {t(
                                                                  "users.friend",
                                                              )}
                                                          </Button>
                                                      );
                                                  }

                                                  if (isPending) {
                                                      return (
                                                          <Button
                                                              color="orange"
                                                              className="w-full"
                                                              disabled
                                                          >
                                                              {t(
                                                                  "users.pending",
                                                              )}
                                                          </Button>
                                                      );
                                                  }

                                                  return (
                                                      <Button
                                                          color="green"
                                                          className="w-full"
                                                          onClick={() =>
                                                              sendRequest(
                                                                  user.id,
                                                              )
                                                          }
                                                      >
                                                          {t("users.addFriend")}
                                                      </Button>
                                                  );
                                              })()
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                {!isLoading && totalPages > 1 && (
                    <div className="relative z-10 flex items-center justify-center gap-4 py-6 mt-auto">
                        <Button
                            color="grey"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                        >
                            {t("users.pagination.previous")}
                        </Button>

                        <span className="text-white font-mono bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                            {t("users.pagination.page", {
                                current: currentPage,
                                total: totalPages,
                            })}
                        </span>

                        <Button
                            color="grey"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1),
                                )
                            }
                        >
                            {t("users.pagination.next")}
                        </Button>
                    </div>
                )}
            </div>
        </Window>
    );
}
