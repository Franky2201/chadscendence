import { useState } from "react";
import { Button, Card } from "../ui";
import { useTheme } from "../../contexts/ThemeContext";
import { AccountStatus } from "@chad/types";
import type { UserListItem } from "@chad/types";
import { useTranslation } from "react-i18next";

interface BanModalProps {
    user: UserListItem;
    onClose: () => void;
    onBanUser: (id: string) => Promise<void>;
}

export function BanModal({ user, onClose, onBanUser }: BanModalProps) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const isBanned = user.accountStatus === AccountStatus.BANNED;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onBanUser(user.id);
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
                title={
                    isBanned
                        ? t("admin.usersManager.banModal.unbanTitle")
                        : t("admin.usersManager.banModal.banTitle")
                }
                contentClassName="flex flex-col gap-6"
            >
                <p className="text-slate-300 text-base">
                    {isBanned
                        ? t("admin.usersManager.banModal.unban")
                        : t("admin.usersManager.banModal.ban")}{" "}
                    <span className="font-bold text-white">
                        {user.username}
                    </span>{" "}
                    ?
                    {!isBanned && (
                        <span className="block mt-1 text-slate-400">
                            {t("admin.usersManager.banModal.warning")}
                        </span>
                    )}
                </p>

                <div className="flex gap-4 justify-end mt-4">
                    <Button color="grey" onClick={onClose} disabled={isLoading}>
                        {t("admin.usersManager.banModal.cancel")}
                    </Button>
                    <Button
                        color={isBanned ? "orange" : "red"}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("admin.usersManager.banModal.loading")
                            : t("admin.usersManager.banModal.confirm")}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
