import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isBanned =
            error.response?.status === 403 ||
            (error.response?.status === 401 &&
                error.response.data?.message?.toLowerCase().includes("banned"));

        if (isBanned) {
            if (window.location.pathname !== "/banned") {
                window.location.href = "/banned";
            }
            // Return a resolved promise to suppress the red error in the console
            // for these "controlled" situations.
            return Promise.resolve({
                data: { success: false, banned: true },
                status: 200,
                statusText: "OK",
                headers: {},
                config: error.config,
            });
        }
        return Promise.reject(error);
    },
);

export default api;
