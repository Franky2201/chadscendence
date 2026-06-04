import { Card, Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function Profile({ className = "" }: { className?: string }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <Card className={className} title="Profile" href="/profile">
            <div className="flex flex-wrap mb-4">
                <img
                    className="rounded-xl w-20 h-20 border"
                    src={user ? user.avatarUrl : "/avatar.jpg"}
                />
                <p className="ml-2 text-3xl font-bold">{user?.username}</p>
            </div>
            <Button color="red" onClick={handleLogout} size="medium">
                Logout
            </Button>
        </Card>
    );
}
