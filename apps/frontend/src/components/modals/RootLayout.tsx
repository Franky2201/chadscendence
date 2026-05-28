import { Outlet } from "react-router-dom";
import ModalRoot from "./ModalRoot";

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>
            <ModalRoot />
        </div>
    );
}
