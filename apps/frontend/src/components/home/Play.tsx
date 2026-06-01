import { Card, IconButton } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";

export function Play({ className = "" }: { className?: string }) {
    const { user } = useAuth();
    const { openModal } = useModal();

    return (
        <Card
            className={className}
            contentClassName={`flex flex-wrap justify-center gap-3`}
            title="Play"
            onClick={() => openModal("PLAY")}
        >
            <IconButton img="game_party.svg">Party</IconButton>
            <IconButton img="game_solo.svg">Solo</IconButton>
            {user && <IconButton img="game_multi.svg">Multi</IconButton>}
            {user && <IconButton img="game_custom.svg">Custom</IconButton>}
            {user && <IconButton img="game_tournament.svg">Cup</IconButton>}
            {user && <IconButton img="game_online.svg">Online</IconButton>}
        </Card>
    );
}
