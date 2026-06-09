import api from "./api";
import type { Permission, Role } from "@chad/types";

interface CreateRole {
    name: string;
    permissions: Permission[];
}

interface UpdateRole {
    name?: string;
    permissions?: Permission[];
}

export const getRoles = async () => {
    const res = await api.get<Role[]>("/roles");
    return res.data;
};

export const getPermissions = async () => {
    const res = await api.get<Permission[]>("/roles/permissions");
    return res.data;
};

export const createRole = async (data: CreateRole) => {
    const res = await api.post<Role>("/roles", data);
    return res.data;
};

export const updateRole = async (
    id: string,
    data: UpdateRole,
) => {
    const res = await api.patch<Role>(`/roles/${id}`, data);
    return res.data;
};

export const deleteRole = async (id: string) => {
    const res = await api.delete<void>(`/roles/${id}`);
    return res.data;
};
