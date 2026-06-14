import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    plugins: [react(), tailwindcss(), basicSsl()],
    server: {
        host: "0.0.0.0",
        port: 8443,
        strictPort: true,
        hmr: {
            protocol: "wss",
            port: 8443,
        },
        proxy: {
            "/api": {
                target: "https://backend:3000",
                secure: false,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/socket.io": {
                target: "https://backend:3000",
                ws: true,
                secure: false,
                changeOrigin: true,
            },
            "/uploads": {
                target: "https://backend:3000",
                secure: false,
                changeOrigin: true,
            },
        },
    },
});
