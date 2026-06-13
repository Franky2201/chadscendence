import { useState } from "react";
import { login as loginAuth } from "../../services/auth";
import { getMe } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../ui/index";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await loginAuth({ identifier, password });
            const userResponse = await getMe();

            if (userResponse.accountStatus === "banned") {
                window.location.href = "/banned";
                return;
            }

            login(userResponse);
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { status: number } };
            // If the interceptor already redirected or handled it, this might not be needed
            // but we keep a fallback toast if redirection didn't happen.
            if (err.response?.status === 403) {
                toast.error(t("home.identification.login.banned"));
                window.location.href = "/banned";
            } else {
                toast.error(t("home.identification.login.error"));
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <Card
                className="max-w-md w-full"
                title={t("home.identification.login.title")}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder={t(
                            "home.identification.login.emailOrUsername",
                        )}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full"
                        size="large"
                        required
                    />
                    <Input
                        type="password"
                        placeholder={t("home.identification.login.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        size="large"
                        required
                    />
                    <Button
                        color={theme}
                        type="submit"
                        className="w-full"
                        size="large"
                    >
                        {t("home.identification.login.login")}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
