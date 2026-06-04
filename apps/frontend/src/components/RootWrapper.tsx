import { Outlet } from "react-router-dom";
import ModalRoot from "./modals/ModalRoot";
import ChatPanel from "./friends/ChatPanel";

export default function RootWrapper() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <main className="flex-1">
                <Outlet />
            </main>
            <ModalRoot />
            <ChatPanel />
        </div>
    );
}
