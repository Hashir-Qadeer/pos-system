import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeItem, updateQuantity, checkout, clearCart } from "./cartSlice";

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
            <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center" }}>
                <h2>Order Complete</h2>
                <p>Order #{lastOrder.id}</p>
                <p>Total: Rs. {lastOrder.totalAmount}</p>
                <ul style={{ textAlign: "left", listStyle: "none", padding: 0 }}>
                    {lastOrder.items.map((item) => (
                        <li key={item.productId}>
                            {item.productName} × {item.quantity} — Rs. {item.subtotal}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={() => {
                        dispatch(clearCart());
                        navigate("/products");
                    }}
                >
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>Cart</h2>
            <p>
                <Link to="/products">← Back to Products</Link>
            </p>

            {items.length === 0 && <p>Cart is empty.</p>}

            {items.length > 0 && (
                <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                                <th style={{ padding: 8 }}>Item</th>
                                <th style={{ padding: 8 }}>Price</th>
                                <th style={{ padding: 8 }}>Qty</th>
                                <th style={{ padding: 8 }}>Subtotal</th>
                                <th style={{ padding: 8 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.productId} style={{ borderBottom: "1px solid #eee" }}>
                                    <td style={{ padding: 8 }}>{item.name}</td>
                                    <td style={{ padding: 8 }}>Rs. {item.price}</td>
                                    <td style={{ padding: 8 }}>
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
                                            style={{ width: 50 }}
                                        />
                                    </td>
                                    <td style={{ padding: 8 }}>Rs. {item.price * item.quantity}</td>
                                    <td style={{ padding: 8 }}>
                                        <button onClick={() => dispatch(removeItem(item.productId))}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 style={{ textAlign: "right" }}>Total: Rs. {total}</h3>

                    {checkoutError && <p style={{ color: "red" }}>{checkoutError}</p>}

                    <button
                        onClick={handleCheckout}
                        disabled={checkoutStatus === "loading"}
                        style={{ width: "100%", padding: 10, marginTop: 12 }}
                    >
                        {checkoutStatus === "loading" ? "Processing..." : "Checkout"}
                    </button>
                </>
            )}
        </div>
    );
}