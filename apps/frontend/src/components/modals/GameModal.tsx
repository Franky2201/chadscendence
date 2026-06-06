import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { createRoom, joinRoom } from "../../services/rooms";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GameModal({ isOpen, onClose }: LoginModalProps) {
    const { user } = useAuth();
    const { openModal } = useModal();
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl p-10 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Multijoueur
                </h2>

                {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-4 mb-6" onSubmit={handleJoin}>
                    <input
                        type="text"
                        placeholder="Entrer un code de salle"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-gray-100 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        Rejoindre la salle
                    </button>
                </form>

                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold hover:bg-pink-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        Créer une salle
                    </button>
                </div>
            </div>
        </div>
    );
}
