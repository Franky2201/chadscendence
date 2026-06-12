import { useState, useEffect } from "react";
import type { Role, Permission, Rank, PermissionAction } from "@chad/types";
import { toast } from "sonner";
import {
    getRoles,
    getPermissions,
    createRole,
    updateRole,
    deleteRole,
} from "../services/roles";
import { getRanks } from "../services/ranks";
import {
    getAllUsers,
    adminUpdateUser,
    banUser,
    uploadAvatarForUser,
} from "../services/users";
import type { UserListItem, AdminUpdateDataPayload } from "@chad/types";
import { useTranslation } from "react-i18next";

export const useAdmin = (
    canManageRoles: boolean,
    canManageRanks: boolean,
    canManageUsers: boolean,
) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const [rolesData, permsData, ranksData, usersData] =
                    await Promise.all([
                        canManageRoles || canManageUsers
                            ? getRoles()
                            : Promise.resolve([]),
                        canManageRoles ? getPermissions() : Promise.resolve([]),
                        canManageRanks ? getRanks() : Promise.resolve([]),
                        getAllUsers(),
                    ]);

                setRoles(rolesData);
                setPermissions(permsData);
                setRanks(ranksData);
                setUsers(usersData);
            } catch {
                toast.error(t("admin.notification.loadingError"));
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, [canManageRoles, canManageRanks, canManageUsers]);

    const handleCreateRole = async (name: string, perms: string[]) => {
        try {
            const newRole = await createRole({
                name,
                permissions: perms as PermissionAction[],
            });
            setRoles((prev) => [...prev, { ...newRole, userCount: 0 }]);
            toast.success(t("admin.notification.roleCreated"));
        } catch {
            toast.error(t("admin.notification.creationError"));
        }
    };

    const handleUpdateRole = async (
        id: string,
        name: string,
        perms: string[],
    ) => {
        try {
            const updated = await updateRole(id, {
                name,
                permissions: perms as PermissionAction[],
            });
            setRoles((prev) =>
                prev.map((r) => (r.id === id ? { ...r, ...updated } : r)),
            );
            toast.success(t("admin.notification.roleUpdated"));
        } catch {
            toast.error(t("admin.notification.updateRoleError"));
        }
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await deleteRole(id);
            setRoles((prev) => prev.filter((r) => r.id !== id));
            toast.success(t("admin.notification.roleDeleted"));
        } catch {
            toast.error(t("admin.notification.deletedError"));
        }
    };

    const handleUpdateUser = async (
        id: string,
        data: AdminUpdateDataPayload,
        avatarFile?: File | null,
    ) => {
        try {
            if (avatarFile) {
                await uploadAvatarForUser(id, avatarFile);
            }
            const updated = await adminUpdateUser(id, data);
            setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
            toast.success(t("admin.notification.profileUpdated"));
        } catch {
            toast.error(t("admin.notification.updateProfileError"));
            throw new Error("Update failed");
        }
    };

    const handleBanUser = async (id: string) => {
        try {
            const result = await banUser(id);
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, accountStatus: result.accountStatus }
                        : u,
                ),
            );
            toast.success(t("admin.notification.statusUpdate"));
        } catch {
            toast.error(t("admin.notification.statusUpdateError"));
            throw new Error("Ban failed");
        }
    };

    return {
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
    };
};
