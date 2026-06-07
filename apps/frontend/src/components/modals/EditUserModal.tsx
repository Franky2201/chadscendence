import { useState, useRef } from "react";
import { Button, Input } from "../ui";
import type { UserListItem, AdminUpdateData } from "../../services/users";
import { useTranslation } from "react-i18next";

interface EditUserModalProps {
    user: UserListItem;
    onClose: () => void;
    onUpdateUser: (
        id: string,
        data: AdminUpdateData,
        avatarFile?: File | null,
    ) => Promise<void>;
}

export function EditUserModal({
    user,
    onClose,
    onUpdateUser,
}: EditUserModalProps) {
    const { t } = useTranslation();
    const [username, setUsername] = useState(user.username);
    const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bio, setBio] = useState(user.bio ?? "");
    const [score, setScore] = useState(String(user.score));
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onUpdateUser(
                user.id,
                {
                    username: username.trim() || undefined,
                    bio: bio.trim() || null,
                    score: score !== "" ? Number(score) : undefined,
                },
                avatarFile,
            );
            onClose();
        } catch {
            // error handled in useAdmin
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 w-full max-w-lg shadow-2xl flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-white">
                    {t("admin.usersManager.editModal.title")}{" "}
                    <span className="text-blue-400">{user.username}</span>
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-400">
                            {t("admin.usersManager.editModal.avatar")}
                        </label>
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <img
                                src={avatarPreview || "/default-avatar.png"}
                                alt="avatar"
                                className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg transition-all group-hover:opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded-lg">
                                    {t("admin.usersManager.editModal.modify")}
                                </span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-400">
                            {t("admin.usersManager.editModal.username")}
                        </label>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            color="blue"
                            className="w-full text-left"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-400">
                            {t("admin.usersManager.editModal.bio")}
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full rounded-2xl px-4 py-3 text-base bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-slate-400">
                            {t("admin.usersManager.editModal.score")}
                        </label>
                        <Input
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            type="number"
                            min={0}
                            color="blue"
                            className="w-full text-left"
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                    <Button color="grey" onClick={onClose} disabled={isLoading}>
                        {t("admin.usersManager.editModal.cancel")}
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("admin.usersManager.editModal.saving")
                            : t("admin.usersManager.editModal.save")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
