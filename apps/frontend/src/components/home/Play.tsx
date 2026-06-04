import { Card, IconButton } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";

export function Play({ className = "" }: { className?: string }) {
    const { user } = useAuth();
    const { openModal } = useModal();

    return (
        <Card
            className={className}
            contentClassName={`flex flex-wrap justify-center items-center gap-3`}
            title="Play"
            description="More info"
            onClick={() => openModal("PLAY")}
        >
            <IconButton className="h-24" size="small" img="game_party.svg">
                Party
            </IconButton>
            <IconButton className="h-24" size="small" img="game_solo.svg">
                Solo
            </IconButton>
            {user && (
                <IconButton className="h-24" size="small" img="game_multi.svg">
                    Multi
                </IconButton>
            )}
            {user && (
                <IconButton className="h-24" size="small" img="game_custom.svg">
                    Custom
                </IconButton>
            )}
            {user && (
                <IconButton
                    className="h-24"
                    size="small"
                    img="game_tournament.svg"
                >
                    Cup
                </IconButton>
            )}
            {user && (
                <IconButton className="h-24" size="small" img="game_online.svg">
                    Online
                </IconButton>
            )}
        </Card>
    );
}
