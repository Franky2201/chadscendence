import api from "./api";
import type {
    Permission,
    Role,
    CreateRolePayload,
    UpdateRolePayload,
} from "@chad/types";

export const getRoles = async (): Promise<Role[]> => {
    const res = await api.get<Role[]>("/roles");
    return res.data;
};

export const getPermissions = async (): Promise<Permission[]> => {
    const res = await api.get<Permission[]>("/roles/permissions");
    return res.data;
};

export const createRole = async (data: CreateRolePayload): Promise<Role> => {
    const res = await api.post<Role>("/roles", data);
    return res.data;
};

export const updateRole = async (
    id: string,
    data: UpdateRolePayload,
): Promise<Role> => {
    const res = await api.patch<Role>(`/roles/${id}`, data);
    return res.data;
};

export const deleteRole = async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
};
