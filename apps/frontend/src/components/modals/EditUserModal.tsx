import { useState, useRef } from "react";
import { Button, Input, Card } from "../ui";
import { getItemColorStyle } from "../ui/unified";
import { useTheme } from "../../contexts/ThemeContext";
import type { UserListItem, AdminUpdateDataPayload } from "@chad/types";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

interface EditUserModalProps {
    user: UserListItem;
    onClose: () => void;
    onUpdateUser: (
        id: string,
        data: AdminUpdateDataPayload,
        avatarFile?: File | null,
    ) => Promise<void>;
}

export function EditUserModal({
    user,
    onClose,
    onUpdateUser,
}: EditUserModalProps) {
    const { t } = useTranslation();
    const { refreshUser } = useAuth();
    const { theme } = useTheme();
    const [username, setUsername] = useState(user.username);
    const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bio, setBio] = useState(user.bio ?? "");
    const [rating, setRating] = useState(String(user.rating));
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
                    rating: rating !== "" ? Number(rating) : undefined,
                },
                avatarFile,
            );
            refreshUser();
            onClose();
        } catch {
            // error handled in useAdmin
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <Card
                color={theme}
                className="w-full max-w-lg"
                title={`${t("admin.usersManager.editModal.title")} ${user.username}`}
                contentClassName="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-6">
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
                                    className="w-32 h-32 md:w-40 md:h-40 object-cover border-2 border-white/20 shadow-lg transition-all group-hover:opacity-50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold bg-black/60 px-2 py-1">
                                        {t(
                                            "admin.usersManager.editModal.modify",
                                        )}
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

                        <div className="flex flex-col gap-4 justify-end w-full">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-slate-400">
                                    {t("admin.usersManager.editModal.username")}
                                </label>
                                <Input
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    color={theme}
                                    className="w-full text-left"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-slate-400">
                                    {t("admin.usersManager.editModal.rating")}
                                </label>
                                <Input
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    type="number"
                                    min={0}
                                    color={theme}
                                    className="w-full text-left"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-sm font-bold text-slate-400">
                            {t("admin.usersManager.editModal.bio")}
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full relative inline-flex items-center justify-center rounded-xl font-bold focus-visible:outline-none focus-visible:ring-2 transition-all duration-100 ease-in-out hover:ring-1 bg-[color:var(--ui-color)]/50 ring-[color:var(--ui-color)] px-3 py-2 text-md resize-none text-left"
                            style={getItemColorStyle(theme)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                    <Button color="grey" onClick={onClose} disabled={isLoading}>
                        {t("admin.usersManager.editModal.cancel")}
                    </Button>
                    <Button
                        color={theme}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("admin.usersManager.editModal.saving")
                            : t("admin.usersManager.editModal.save")}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
