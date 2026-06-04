import { useState } from "react";
import axios from "axios";
import { login as loginAuth } from "../../services/auth";
import { getMe } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import { extractErrorMessage } from "../../services/error";
import { Button, Input, Card } from "../ui/index";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();
    const { openModal } = useModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await loginAuth({ email, password });
            const userResponse = await getMe();
            login(userResponse);
            onClose();
        } catch (err) {
            const errorMessage = extractErrorMessage(err);

            if (
                axios.isAxiosError(err) &&
                (err.response?.status === 404 ||
                    errorMessage.includes("Account not found"))
            ) {
                openModal("REGISTER", { prefilledEmail: email });
            } else {
                setError(errorMessage);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <Card className="max-w-md w-full" title="Log in">
                {error && (
                    <p className="text-[color:var(--color-red)] text-center mb-4 font-medium">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        size="large"
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        size="large"
                        required
                    />
                    <Button type="submit" className="w-full" size="large">
                        Login
                    </Button>
                </form>
            </Card>
        </div>
    );
}
