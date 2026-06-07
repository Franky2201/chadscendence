import { Card, Button } from "../ui";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";
import { useTranslation } from "react-i18next";

export function Profile({ className = "" }: { className?: string }) {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const { openPanel } = useChat();
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
                <div className="flex flex-col ml-2">
                    <div className="flex flex-wrap gap-2">
                        <p className="text-3xl font-bold">{user?.username}</p>
                    </div>
                    Rating : {user?.score}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Button color="green" onClick={openPanel} size="medium">
                    {t("home.profile.friends")}
                </Button>
                <Button color="red" onClick={handleLogout} size="medium">
                    {t("home.profile.logout")}
                </Button>
            </div>
        </Card>
    );
}
