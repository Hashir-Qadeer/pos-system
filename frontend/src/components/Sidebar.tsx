import { NavLink } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function Sidebar() {
    const role = useAppSelector((state) => state.auth.role);

    return (
        <div className="sidebar">
            <div className="sidebar-logo">POS System</div>

            <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Register
            </NavLink>

            {role === "Admin" && (
                <NavLink to="/categories" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24H4a1 1 0 0 0-1 1v5.59a2 2 0 0 0 .59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83Z" />
                        <circle cx="7.5" cy="7.5" r="1.5" />
                    </svg>
                    Categories
                </NavLink>
            )}
        </div>
    );
}