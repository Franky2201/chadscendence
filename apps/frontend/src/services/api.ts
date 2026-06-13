import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        // Detect "fake" 200s from SilentAuthFilter
        if (
            response.data &&
            response.data.error === true &&
            (response.data.statusCode === 401 ||
                response.data.statusCode === 403)
        ) {
            const status = response.data.statusCode;
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
        // Silently handle real 401/403 just in case the filter missed something
        // but typically the filter will have caught them.
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            return new Promise(() => {}); // Never resolve/reject to stay silent? No, that's bad.
        }
        return Promise.reject(error);
    },
);

export default api;
