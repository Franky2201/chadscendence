import { useState, useEffect } from "react";
import type { Role, Permission, Rank } from "@chad/types";
import { toast } from "sonner";
import {
    getRoles,
    getPermissions,
    createRole,
    updateRole,
    deleteRole,
    getRanks,
} from "../services/admin";

export const useAdmin = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                const [rolesData, permsData, ranksData] = await Promise.all([
                    getRoles(),
                    getPermissions(),
                    getRanks(),
                ]);

                setRoles(rolesData);
                setPermissions(permsData);
                setRanks(ranksData);
            } catch {
                toast.error("Erreur de chargement des données");
            } finally {
                setIsLoading(false);
            }
        };

        void loadData();
    }, []);

    const handleCreateRole = async (name: string, perms: string[]) => {
        try {
            const newRole = await createRole({ name, permissions: perms });
            setRoles((prev) => [...prev, { ...newRole, userCount: 0 }]);
            toast.success("Rôle créé");
        } catch {
            toast.error("Erreur lors de la création");
        }
    };

    const handleUpdateRole = async (
        id: string,
        name: string,
        perms: string[],
    ) => {
        try {
            const updated = await updateRole(id, { name, permissions: perms });
            setRoles((prev) =>
                prev.map((r) => (r.id === id ? { ...r, ...updated } : r)),
            );
            toast.success("Rôle mis à jour");
        } catch {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleDeleteRole = async (id: string) => {
        try {
            await deleteRole(id);
            setRoles((prev) => prev.filter((r) => r.id !== id));
            toast.success("Rôle supprimé");
        } catch {
            toast.error("Impossible de supprimer ce rôle");
        }
    };

    return {
        roles,
        permissions,
        ranks,
        isLoading,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
    };
};
