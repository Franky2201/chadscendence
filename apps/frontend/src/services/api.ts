import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        // Detect "fake" 200s from SilentAuthFilter
        if (response.data && response.data.error === true) {
            const status = response.data.statusCode || 500;
            const message = response.data.message?.toLowerCase() || "";
            const isBanned = status === 403 || message.includes("banned");

            if (isBanned && window.location.pathname !== "/banned") {
                window.location.href = "/banned";
            }

            // Reject so try/catch works, but browser console stays clean (no red XHR)
            return Promise.reject({
                response: {
                    status,
                    data: response.data,
                },
            });
        }
        return response;
    },
    (error) => {
        // This handler should ideally not be reached for most API calls
        // because SilentAuthFilter turns them into 200s.
        // But for network errors or if the filter is bypassed:
        return Promise.reject(error);
    },
);

export default api;
