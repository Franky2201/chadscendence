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
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"users" | "ranks" | "roles">(
        "users",
    );
    const hasPermissions =
        (user?.role?.permissions && user.role.permissions.length > 0) ?? false;

    const canManageRanks =
        user?.role?.permissions?.some((p) => p.action === "MANAGE_RANKS") ??
        false;
    const canManageRoles =
        user?.role?.permissions?.some((p) => p.action === "MANAGE_ROLES") ??
        false;
    const canManageUsers =
        user?.role?.permissions?.some((p) => p.action === "MANAGE_USERS") ??
        false;

    const {
        roles,
        permissions,
        ranks,
        users,
        isLoading,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
        handleUpdateUser,
        handleBanUser,
    } = useAdmin(canManageRoles, canManageRanks, canManageUsers);

    useEffect(() => {
        if (!authLoading && !isLoading && !hasPermissions) {
            navigate("/");
        }
    }, [hasPermissions, navigate, authLoading, isLoading]);

    if (authLoading || isLoading || !user)
        return (
            <Window>
                <div className="p-8 text-white font-bold text-center">
                    {t("admin.loading")}
                </div>
            </Window>
        );

    if (!hasPermissions) return null;

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
                    {canManageRanks && (
                        <Button
                            color={activeTab === "ranks" ? "pink" : "grey"}
                            onClick={() => setActiveTab("ranks")}
                        >
                            {t("admin.tabs.ranks")}
                        </Button>
                    )}
                    {canManageRoles && (
                        <Button
                            color={activeTab === "roles" ? "pink" : "grey"}
                            onClick={() => setActiveTab("roles")}
                        >
                            {t("admin.tabs.roles")}
                        </Button>
                    )}
                </div>

                {activeTab === "roles" && canManageRoles && (
                    <RoleManager
                        roles={roles}
                        permissions={permissions}
                        onCreate={handleCreateRole}
                        onUpdate={handleUpdateRole}
                        onDelete={handleDeleteRole}
                    />
                )}

                {activeTab === "ranks" && canManageRanks && (
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
