import { useState } from "react";
import { Button } from "../ui";
import { sendFriendRequest } from "../../services/friends";
import type { UserListItem } from "../../services/users";

interface AddFriendModalProps {
    user: UserListItem;
    onClose: () => void;
}

export function AddFriendModal({ user, onClose }: AddFriendModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await sendFriendRequest(user.id);
            setSuccess(true);
            setTimeout(onClose, 1200);
        } catch {
            setError("Impossible d'envoyer la demande.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white">Ajouter en ami</h2>
                <p className="text-slate-300 text-sm">
                    Envoyer une demande d'ami à{" "}
                    <span className="font-bold text-white">{user.username}</span>{" "}
                    ?
                </p>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && (
                    <p className="text-green-400 text-sm">Demande envoyée !</p>
                )}

                <div className="flex gap-2 justify-end">
                    <Button color="grey" size="small" onClick={onClose} disabled={isLoading}>
                        Annuler
                    </Button>
                    <Button
                        color="green"
                        size="small"
                        onClick={handleConfirm}
                        disabled={isLoading || success}
                    >
                        {isLoading ? "Envoi..." : "Envoyer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
