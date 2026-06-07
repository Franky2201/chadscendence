import { useState } from "react";
import { Button, Input } from "../ui";
import { adminUpdateUser } from "../../services/users";
import type { UserListItem } from "../../services/users";
import { toast } from "sonner";

interface EditUserModalProps {
    user: UserListItem;
    onClose: () => void;
    onSuccess: (updated: UserListItem) => void;
}

export function EditUserModal({
    user,
    onClose,
    onSuccess,
}: EditUserModalProps) {
    const [username, setUsername] = useState(user.username);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? "");
    const [bio, setBio] = useState(user.bio ?? "");
    const [score, setScore] = useState(String(user.score));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const updated = await adminUpdateUser(user.id, {
                username: username.trim() || undefined,
                avatarUrl: avatarUrl.trim() || undefined,
                bio: bio.trim() || null,
                score: score !== "" ? Number(score) : undefined,
            });
            onSuccess(updated);
            onClose();
        } catch {
            toast.error("Impossible de modifier le profil.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4">
                <h2 className="text-lg font-bold text-white">
                    Modifier{" "}
                    <span className="text-blue-400">{user.username}</span>
                </h2>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Pseudo</label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            color="blue"
                            size="small"
                            className="w-full text-left"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">
                            Avatar URL
                        </label>
                        <Input
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            color="blue"
                            size="small"
                            className="w-full text-left"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={2}
                            className="w-full rounded-xl px-3 py-2 text-sm bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-400">Score</label>
                        <Input
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            type="number"
                            min={0}
                            color="blue"
                            size="small"
                            className="w-full text-left"
                        />
                    </div>
                </div>

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
                        color="blue"
                        size="small"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
