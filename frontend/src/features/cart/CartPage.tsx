import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeItem, updateQuantity, checkout, clearCart } from "./cartSlice";
import AppShell from "../../components/AppShell";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, checkoutStatus, checkoutError, lastOrder } = useAppSelector((state) => state.cart);
    const { userId } = useAppSelector((state) => state.auth);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (!userId || items.length === 0 || checkoutStatus === "loading") return;
        dispatch(
            checkout({
                cashierId: userId,
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            })
        );
    };

    if (lastOrder) {
        return (
            <AppShell>
                <div style={{ maxWidth: 460, margin: "40px auto" }}>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: "var(--success-bg)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>
                        <h2>Sale complete</h2>
                        <p className="muted">Order #{lastOrder.id}</p>
                        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "Space Grotesk", margin: "12px 0" }}>
                            Rs. {lastOrder.totalAmount}
                        </div>
                        <div style={{ textAlign: "left", marginTop: 16 }}>
                            {lastOrder.items.map((item) => (
                                <div
                                    key={item.productId}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: "1px solid var(--border)",
                                        fontSize: 14,
                                    }}
                                >
                                    <span>{item.productName} × {item.quantity}</span>
                                    <span style={{ fontWeight: 600 }}>Rs. {item.subtotal}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            style={{ width: "100%", marginTop: 20 }}
                            onClick={() => {
                                dispatch(clearCart());
                                navigate("/products");
                            }}
                        >
                            Start new sale
                        </button>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <Link to="/products" className="muted" style={{ fontSize: 14, display: "inline-block", marginBottom: 16 }}>
                ← Back to Register
            </Link>
            <h1>Review sale</h1>

            {items.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: 48 }}>
                    <p className="muted">No items in this sale yet.</p>
                    <Link to="/products"><button style={{ marginTop: 8 }}>Go to Register</button></Link>
                </div>
            )}

            {items.length > 0 && (
                <div style={{ maxWidth: 640 }}>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Subtotal</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.productId}>
                                        <td>{item.name}</td>
                                        <td>Rs. {item.price}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min={1}
                                                max={item.availableStock}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    dispatch(updateQuantity({ productId: item.productId, quantity: Number(e.target.value) }))
                                                }
                                                style={{ width: 56 }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: 600 }}>Rs. {item.price * item.quantity}</td>
                                        <td>
                                            <button className="danger" onClick={() => dispatch(removeItem(item.productId))}>
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="card"
                        style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        <span style={{ fontSize: 16 }}>Total</span>
                        <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "Space Grotesk" }}>Rs. {total}</span>
                    </div>

                    {checkoutError && <p className="error-text" style={{ marginTop: 12 }}>{checkoutError}</p>}

                    <button
                        onClick={handleCheckout}
                        disabled={checkoutStatus === "loading"}
                        style={{ width: "100%", padding: 14, marginTop: 16, fontSize: 16 }}
                    >
                        {checkoutStatus === "loading" ? "Processing..." : "Complete sale"}
                    </button>
                </div>
            )}
        </AppShell>
    );
}