import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeItem, updateQuantity, checkout, clearCart } from "./cartSlice";
import Navbar from "../../components/Navbar";
export default function CartPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { items, checkoutStatus, checkoutError, lastOrder } = useAppSelector((state) => state.cart);
    const { userId } = useAppSelector((state) => state.auth);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (!userId || items.length === 0) return;

        dispatch(
            checkout({
                cashierId: userId,
                items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
            })
        );
    };

    if (lastOrder) {
        return (
            <div>
                <Navbar />
                <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 24px" }}>
                    <div className="card" style={{ textAlign: "center" }}>
                        <h2 style={{ color: "var(--success)" }}>Order Complete</h2>
                        <p className="muted">Order #{lastOrder.id}</p>
                        <p style={{ fontSize: 20, fontWeight: 600 }}>Total: Rs. {lastOrder.totalAmount}</p>
                        <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
                            {lastOrder.items.map((item) => (
                                <li key={item.productId} style={{ padding: "6px 0" }}>
                                    {item.productName} × {item.quantity} — Rs. {item.subtotal}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => {
                                dispatch(clearCart());
                                navigate("/products");
                            }}
                            style={{ width: "100%", marginTop: 12 }}
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 24px" }}>
                <h2>Cart</h2>

                {items.length === 0 && <p className="muted">Cart is empty.</p>}

                {items.length > 0 && (
                    <>
                        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
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
                                                        dispatch(
                                                            updateQuantity({
                                                                productId: item.productId,
                                                                quantity: Number(e.target.value),
                                                            })
                                                        )
                                                    }
                                                    style={{ width: 60 }}
                                                />
                                            </td>
                                            <td>Rs. {item.price * item.quantity}</td>
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

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0 }}>Total: Rs. {total}</h3>
                        </div>

                        {checkoutError && <p className="error-text">{checkoutError}</p>}

                        <button
                            onClick={handleCheckout}
                            disabled={checkoutStatus === "loading"}
                            style={{ width: "100%", padding: 14, marginTop: 16, fontSize: 16 }}
                        >
                            {checkoutStatus === "loading" ? "Processing..." : "Checkout"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}