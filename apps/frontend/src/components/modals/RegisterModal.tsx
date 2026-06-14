import { useState } from "react";
import { register } from "../../services/auth";
import { getMe } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../ui/index";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const genericErrorMsg = t("home.identification.register.error");

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.match(emailRegex)) {
            toast.error(genericErrorMsg);
            return;
        }

        if (
            !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) ||
            password.length < 8
        ) {
            toast.error(genericErrorMsg);
            return;
        }

        try {
            await register({
                email,
                username,
                password,
            });

            const userResponse = await getMe();
            login(userResponse);
            onClose();
        } catch {
            toast.error(genericErrorMsg);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onMouseDown={onClose}
        >
            <Card
                className="max-w-md w-full"
                title={t("home.identification.register.title")}
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                    noValidate
                >
                    <Input
                        size="large"
                        type="email"
                        placeholder={t("home.identification.register.email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Input
                        size="large"
                        type="text"
                        placeholder={t("home.identification.register.username")}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Input
                        size="large"
                        type="password"
                        placeholder={t("home.identification.register.password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Button
                        color={theme}
                        type="submit"
                        className="w-full"
                        size="large"
                    >
                        {t("home.identification.register.register")}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
