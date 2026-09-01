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
                padding: "12px 24px",
                borderBottom: "1px solid #333",
            }}
        >
            <Link to="/products" style={{ fontWeight: "bold" }}>
                POS System
            </Link>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <span>
                    {name} ({role})
                </span>
                <Link to="/cart">Cart ({cartCount})</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}