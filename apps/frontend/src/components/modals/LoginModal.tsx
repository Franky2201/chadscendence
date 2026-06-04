import { useState } from "react";
import { login as loginAuth } from "../../services/auth";
import { getMe } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../ui/index";
import { toast } from "sonner";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await loginAuth({ identifier, password });
            const userResponse = await getMe();
            login(userResponse);
            onClose();
        } catch {
            toast.error("Invalid credentials");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <Card className="max-w-md w-full" title="Log in">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        placeholder="Email or username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
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
