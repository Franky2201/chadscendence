import { useState } from "react";
import { useAdmin } from "../hooks/useAdmin";
import RoleManager from "../components/admin/RoleManager";
import UserManager from "../components/admin/UserManager";
import { Window, Title, Button } from "../components/ui";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminPage() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"users" | "ranks" | "roles">(
        "users",
    );
    const {
        roles,
        permissions,
        users,
        isLoading,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
        handleUpdateUser,
        handleBanUser,
    } = useAdmin();

    const hasPermissions =
        user?.role?.permissions && user.role.permissions.length > 0;

    useEffect(() => {
        if (!hasPermissions) {
            navigate("/");
        }
    }, [hasPermissions, navigate]);

    if (!hasPermissions) return null;

    if (isLoading)
        return (
            <Window>
                <div className="p-8 text-white font-bold text-center">
                    {t("admin.loading")}
                </div>
            </Window>
        );

    return (
        <Window>
            <Header />
            <div className="max-w-6xl mx-auto flex flex-col gap-8 w-full p-8">
                <Title color="white" className="text-3xl">
                    {t("admin.title")}
                </Title>

                <div className="flex gap-4 border-b border-white/10 pb-4">
                    <Button
                        color={activeTab === "users" ? "pink" : "grey"}
                        onClick={() => setActiveTab("users")}
                    >
                        {t("admin.tabs.users")}
                    </Button>
                    <Button
                        color={activeTab === "ranks" ? "pink" : "grey"}
                        onClick={() => setActiveTab("ranks")}
                    >
                        {t("admin.tabs.ranks")}
                    </Button>
                    <Button
                        color={activeTab === "roles" ? "pink" : "grey"}
                        onClick={() => setActiveTab("roles")}
                    >
                        {t("admin.tabs.roles")}
                    </Button>
                </div>

                {activeTab === "roles" && (
                    <RoleManager
                        roles={roles}
                        permissions={permissions}
                        onCreate={handleCreateRole}
                        onUpdate={handleUpdateRole}
                        onDelete={handleDeleteRole}
                    />
                )}

                {activeTab === "ranks" && (
                    <div className="text-white/50 italic">
                        Composant RankManager à insérer ici
                    </div>
                )}

                {activeTab === "users" && (
                    <UserManager
                        users={users}
                        roles={roles}
                        onUpdateUser={handleUpdateUser}
                        onBanUser={handleBanUser}
                    />
                )}
            </div>
        </Window>
    );
}
