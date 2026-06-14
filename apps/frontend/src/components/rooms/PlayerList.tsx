import { useTranslation } from "react-i18next";
import { Badge, Button, Card } from "../ui";
import { useChat } from "../../contexts/ChatContext";
import type { EnrichedPlayer } from "../../hooks/useRoom";

interface PlayerListProps {
    players: EnrichedPlayer[];
    maxPlayers: number;
}

export function PlayerList({ players, maxPlayers }: PlayerListProps) {
    const { t } = useTranslation();
    const { openPanel } = useChat();

    return (
        <Card className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2">
                        {t("room.playerList.label")}
                    </p>
                    <div className="text-sm"></div>
                </div>
            </div>

            <div className="flex flex-col gap-3 py-2">
                {players.map((player) => (
                    <Badge
                        key={player.id}
                        type="translation"
                        color={player.host ? "pink" : "grey"}
                        className="flex items-center"
                    >
                        <div className="flex items-center gap-3 w-full px-2 py-1">
                            {player.avatarUrl ? (
                                <img
                                    src={player.avatarUrl}
                                    alt={player.username}
                                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center border border-white/20">
                                    <span className="text-xs font-bold text-white">
                                        {player.username
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                </div>
                            )}

                            <span className="font-semibold text-sm flex-1">
                                {player.leaderboardRank
                                    ? `#${player.leaderboardRank}`
                                    : "#-"}{" "}
                                - {player.username}
                            </span>

                            <div className="flex items-center gap-2">
                                {player.host && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 bg-black/10 px-1.5 py-0.5 rounded">
                                        {t("room.playerList.host")}
                                    </span>
                                )}
                            </div>
                            <span className="font-semibold text-sm">
                                {player.score}
                            </span>
                        </div>
                    </Badge>
                ))}
            </div>

            <div className="pt-2">
                <Button
                    color="green"
                    onClick={openPanel}
                    size="medium"
                    className="w-full"
                >
                    {t("home.profile.friends") || "Mes amis"}
                </Button>
            </div>
        </Card>
    );
}
