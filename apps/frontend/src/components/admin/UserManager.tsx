import { useState, useMemo } from "react";
import { Card, Button, Input, Title, Select, Badge } from "../ui";
import { EditUserModal } from "../modals/EditUserModal";
import { BanModal } from "../modals/BanModal";
import { AccountStatus } from "@chad/types";
import type { UserListItem, AdminUpdateDataPayload } from "@chad/types";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import type { Role } from "@chad/types";
import { useTranslation } from "react-i18next";
import { getItemColorStyle } from "../ui/unified";
import { useTheme } from "../../contexts/ThemeContext";

type ActiveModal =
    | { type: "edit"; user: UserListItem }
    | { type: "ban"; user: UserListItem }
    | null;

interface UserManagerProps {
    users: UserListItem[];
    roles: Role[];
    onUpdateUser: (
        id: string,
        data: AdminUpdateDataPayload,
        avatarFile?: File | null,
    ) => Promise<void>;
    onBanUser: (id: string) => Promise<void>;
}

export default function UserManager({
    users,
    roles,
    onUpdateUser,
    onBanUser,
}: UserManagerProps) {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const { theme } = useTheme();

    const uniqueRoles = useMemo(() => {
        const rolesNames = new Set(
            users.map((u) => u.role?.name).filter(Boolean),
        );
        return Array.from(rolesNames);
    }, [users]);

    const filteredUsers = users.filter((u) => {
        const matchSearch = u.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchRole = roleFilter === "ALL" || u.role?.name === roleFilter;
        return matchSearch && matchRole;
    });

    const canBan = currentUser?.role?.permissions?.some(
        (p) => p.action === "BAN_USER",
    );
    const canEditUser = currentUser?.role?.permissions?.some(
        (p) => p.action === "MANAGE_USERS",
    );

    return (
        <div className="flex flex-col gap-6 w-full">
            <Title color="white" className="text-3xl text-left">
                {t("admin.usersManager.title")}
            </Title>

            <div className="flex flex-col md:flex-row items-stretch gap-4 w-full items-center">
                <Input
                    placeholder={t("admin.usersManager.search")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="large"
                    className="flex-1 !bg-white/10 !border-white/20 !text-white !text-left !font-normal placeholder:!text-white/40 !text-lg"
                />
                <Select
                    customSize="large"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="ALL" className="text-black">
                        {t("admin.usersManager.allRoles")}
                    </option>
                    {uniqueRoles.map((role) => (
                        <option key={role} value={role} className="text-black">
                            {role}
                        </option>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col gap-4">
                {filteredUsers.map((user) => (
                    <Card
                        key={user.id}
                        className="w-full"
                        contentClassName="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <Link
                                to={`/users/${user.username}`}
                                className="relative group shrink-0"
                            >
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-600 transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-xl font-bold text-white transition-transform group-hover:scale-105 shrink-0">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                )}
                            </Link>
                            <div className="flex flex-col items-start gap-1 min-w-0">
                                <Link to={`/users/${user.username}`} className="max-w-full">
                                    <span
                                        className="font-bold text-white text-lg hover:text-[var(--ui-color)] transition-colors break-all"
                                        style={{ ...getItemColorStyle(theme) }}
                                    >
                                        {user.username}
                                    </span>
                                </Link>
                                {user.role && (
                                    <Badge color="blue">{user.role.name}</Badge>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                            {canEditUser && currentUser?.id !== user.id && (
                                <>
                                    <Select
                                        value={user.role?.id || ""}
                                        onChange={async (e) => {
                                            const roleId = e.target.value;
                                            await onUpdateUser(user.id, {
                                                roleId,
                                            });
                                        }}
                                        className="!bg-blue-500/20 !border-blue-500/50 hover:!bg-blue-500/30 text-blue-400 font-bold"
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="text-black"
                                        >
                                            {t("admin.usersManager.selectRole")}
                                        </option>
                                        {roles.map((r) => (
                                            <option
                                                key={r.id}
                                                value={r.id}
                                                className="text-black"
                                            >
                                                {r.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Button
                                        color="purple"
                                        onClick={() =>
                                            setActiveModal({
                                                type: "edit",
                                                user,
                                            })
                                        }
                                    >
                                        {t("admin.usersManager.modify")}
                                    </Button>
                                </>
                            )}
                            {canBan && currentUser?.id !== user.id && (
                                <Button
                                    color={
                                        user.accountStatus ===
                                        AccountStatus.BANNED
                                            ? "orange"
                                            : "red"
                                    }
                                    onClick={() =>
                                        setActiveModal({
                                            type: "ban",
                                            user,
                                        })
                                    }
                                >
                                    {user.accountStatus === AccountStatus.BANNED
                                        ? t("admin.usersManager.unban")
                                        : t("admin.usersManager.ban")}
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
                {filteredUsers.length === 0 && (
                    <div className="text-white/60 italic text-center py-4">
                        {t("admin.usersManager.noPlayers")}
                    </div>
                )}
            </div>

            {activeModal?.type === "edit" && (
                <EditUserModal
                    user={activeModal.user}
                    onClose={() => setActiveModal(null)}
                    onUpdateUser={onUpdateUser}
                />
            )}

            {activeModal?.type === "ban" && (
                <BanModal
                    user={activeModal.user}
                    onClose={() => setActiveModal(null)}
                    onBanUser={onBanUser}
                />
            )}
        </div>
    );
}
