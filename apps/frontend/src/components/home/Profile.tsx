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
                <p className="ml-2 text-3xl font-bold">{user?.username}</p>
            </div>
            <div className="flex flex-col gap-3">
                <Button color="red" onClick={handleLogout} size="medium">
                    Logout
                </Button>
                <Button color="green" size="medium">
                    Friends
                </Button>
            </div>
        </Card>
    );
}
