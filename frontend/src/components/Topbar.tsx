import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function Topbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { name, role } = useAppSelector((state) => state.auth);
    const cartCount = useAppSelector((state) => state.cart.items.length);
    const alertCount = useAppSelector((state) => state.notifications.alerts.length);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="topbar">
            <Link to="/cart" className="icon-btn" style={{ position: "relative", color: "var(--text)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                    <span className="badge badge-primary" style={{ position: "absolute", top: -4, right: -4, fontSize: 10, padding: "1px 6px" }}>
                        {cartCount}
                    </span>
                )}
            </Link>

            {alertCount > 0 && <span className="badge badge-warning">{alertCount} low stock alert{alertCount > 1 ? "s" : ""}</span>}

            <span className="muted" style={{ fontSize: 14 }}>{name}</span>
            <span className="badge badge-primary">{role}</span>
            <button className="secondary" onClick={handleLogout}>Logout</button>
        </div>
    );
}