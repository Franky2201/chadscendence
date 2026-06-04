import { useState } from "react";
import { register } from "../../services/auth";
import { getMe } from "../../services/users";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../ui/index";
import { toast } from "sonner";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterModal({
    isOpen,
    onClose,
}: RegisterModalProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await register({ email, username, password });

            const userResponse = await getMe();
            login(userResponse);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <Card className="max-w-md w-full" title="Register">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        size="large"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Input
                        size="large"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Input
                        size="large"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full"
                        required
                    />
                    <Button type="submit" className="w-full" size="large">
                        Créer un compte
                    </Button>
                </form>
            </Card>
        </div>
    );
}
