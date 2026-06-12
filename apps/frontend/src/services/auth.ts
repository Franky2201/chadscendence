import api from "./api";
import type { RegisterPayload, LoginPayload, AuthResponse } from "@chad/types";

const backendUrl = import.meta.env.PROD
    ? "/api"
    : import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const checkAuthStatus = async () => {
    const res = await api.get("/auth/check");
    return res.data;
};

export const register = async (
    data: RegisterPayload,
): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", data);
    return res.data;
};

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", data);
    return res.data;
};

export const logout = async (): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/logout");
    return res.data;
};

export const withIntra = () => {
    window.location.href = `${backendUrl}/auth/42`;
};

export const withGithub = () => {
    window.location.href = `${backendUrl}/auth/github`;
};
