import { useState } from "react";
import { Button } from "../ui";
import { banUser, AccountStatus } from "../../services/users";
import type { UserListItem } from "../../services/users";

interface BanModalProps {
    user: UserListItem;
    onClose: () => void;
    onSuccess: (accountStatus: AccountStatus) => void;
}

export function BanModal({ user, onClose, onSuccess }: BanModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isBanned = user.accountStatus === AccountStatus.BANNED;

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await banUser(user.id);
            onSuccess(result.accountStatus);
            onClose();
        } catch {
            setError("Impossible d'effectuer cette action.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white">
                    {isBanned ? "Débannir le joueur" : "Bannir le joueur"}
                </h2>
                <p className="text-slate-300 text-sm">
                    {isBanned ? "Débannir" : "Bannir"}{" "}
                    <span className="font-bold text-white">
                        {user.username}
                    </span>{" "}
                    ?
                    {!isBanned && (
                        <span className="block mt-1 text-slate-400">
                            Le joueur ne pourra plus se connecter.
                        </span>
                    )}
                </p>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-2 justify-end">
                    <Button
                        color="grey"
                        size="small"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        color={isBanned ? "orange" : "red"}
                        size="small"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "..." : "Confirmer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
