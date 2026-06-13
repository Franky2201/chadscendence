import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { createRoom, joinRoom } from "../../services/rooms";
import { Card, Button, Input } from "../ui/index";
import { useTheme } from "../../contexts/ThemeContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MultiplayerModal({
    isOpen,
    onClose,
}: LoginModalProps) {
    const { user } = useAuth();
    const { openModal } = useModal();
    const { theme } = useTheme();

    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    if (!isOpen) return null;


    const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const roomCode = code.trim().toUpperCase();
        if (!roomCode || isSubmitting) {
            return;
        }

        if (!user) {
            openModal("LOGIN");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const room = await joinRoom(roomCode);
            navigate(`/room/${room.code}`);
            onClose();
        } catch {
            setError("Impossible de rejoindre la salle avec ce code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreate = async () => {
        if (isSubmitting) {
            return;
        }

        if (!user) {
            openModal("LOGIN");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const room = await createRoom();
            navigate(`/room/${room.code}`);
            onClose();
        } catch {
            setError("Impossible de créer la salle.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={onClose}
    >
        <Card className="max-w-md w-full" title="Multijoueur"
        >
                <form
                    className="flex flex-col gap-3 mb-2"
                    onSubmit={handleJoin}
                >
                    <Input
                        type="text"
                        placeholder="Entrer un code de salle"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Button
                        color={theme}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        Rejoindre la salle
                    </Button>
                </form>
                
                <span className="flex justify-self-center mb-3 font-mona-sans-light text-sm text-white/50">
                    OR
                </span>

                <div className="flex flex-col gap-3">
                    <Button
                        color={theme}
                        type="button"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        Créer une salle
                    </Button>
                </div>
        </Card>
      </div>
  );
}