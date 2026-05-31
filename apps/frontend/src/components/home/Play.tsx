import { Card, Button } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";

export function Play({ className = "" }: { className?: string }) {
    const { user } = useAuth();
    return (
        <Card className={className} title="Play">
            <div className="flex flex-col w-full h-full justify-center gap-3">
                <Button className="w-full">Party</Button>
                <Button className="w-full">Solo</Button>
                {user && <Button className="w-full">Multiplayer</Button>}
                {user && <Button className="w-full">Custom Game</Button>}
            </div>
        </Card>
    );
}
