import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-main">
                <Topbar />
                <div className="app-content">{children}</div>
            </div>
        </div>
    );
}