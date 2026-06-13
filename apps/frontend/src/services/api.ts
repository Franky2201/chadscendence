import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message?.toLowerCase() || "";

        const isBanned =
            status === 403 ||
            (status === 401 && message.includes("banned"));

        if (isBanned) {
            if (window.location.pathname !== "/banned") {
                window.location.href = "/banned";
            }
            return Promise.resolve({
                data: { success: false, banned: true },
                status: 200,
            });
        }

        // Handle other 401s silently (session expired or unauthorized)
        if (status === 401) {
            // If we are already on banned, just stop there
            if (window.location.pathname === "/banned") {
                return Promise.resolve({ data: {}, status: 200 });
            }
            return Promise.resolve({ data: { success: false }, status: 200 });
        }

        return Promise.reject(error);
    },
);

export default api;
