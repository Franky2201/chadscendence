import { Card, Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import { useTheme } from "../../contexts/ThemeContext";

export function Profile({ className = "" }: { className?: string }) {
    const { user, logout } = useAuth();
    const { openPanel } = useChat();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <Card
            className={className}
            contentClassName="grid content-between"
            title="Profile"
            href="/profile"
        >
            <div className="flex flex-wrap mb-4">
                <img
                    className="rounded-xl w-20 h-20 border"
                    src={user ? user.avatarUrl : "/avatar.jpg"}
                />
                <div className="flex flex-col">
                    <p className="ml-2 text-3xl font-bold">{user?.username}</p>
                    <p className="ml-2 text-2xl font-medium">{user?.role.name === 'User' ? '' : user?.role.name} {user?.score}</p>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Button color="green" onClick={openPanel} size="medium">
                    Friends
                </Button>
                <Button color="red" onClick={handleLogout} size="medium">
                    Logout
                </Button>
            </div>
        </Card>
    );
}
