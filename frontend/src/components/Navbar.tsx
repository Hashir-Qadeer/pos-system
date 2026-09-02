import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { name, role } = useAppSelector((state) => state.auth);
    const cartCount = useAppSelector((state) => state.cart.items.length);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 32px",
                borderBottom: "1px solid var(--border)",
                background: "var(--surface)",
            }}
        >
            <Link to="/products" style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
                POS System
            </Link>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <span className="muted">
                    {name} · {role}
                </span>
                {role === "Admin" && <Link to="/categories">Categories</Link>}
                <Link to="/cart">Cart ({cartCount})</Link>
                <button className="secondary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

