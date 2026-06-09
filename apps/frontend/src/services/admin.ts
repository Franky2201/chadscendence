import api from "./api";
import type { Rank, Permission, Role } from "@chad/types";

export const getRoles = async (): Promise<Role[]> => {
    const res = await api.get("/roles");
    return res.data;
};

export const getPermissions = async (): Promise<Permission[]> => {
    const res = await api.get("/roles/permissions");
    return res.data;
};

export const createRole = async (data: {
    name: string;
    permissions: string[];
}): Promise<Role> => {
    const res = await api.post("/roles", data);
    return res.data;
};

export const updateRole = async (
    id: string,
    data: { name?: string; permissions?: string[] },
): Promise<Role> => {
    const res = await api.patch(`/roles/${id}`, data);
    return res.data;
};

export const deleteRole = async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
};

export const getRanks = async (): Promise<Rank[]> => {
    const res = await api.get("/ranks");
    return res.data;
};
