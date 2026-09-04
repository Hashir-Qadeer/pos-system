import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "./productsSlice";
import { addItem, updateQuantity, removeItem } from "../cart/cartSlice";
import AppShell from "../../components/AppShell";

export default function ProductList() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);
    const cartItems = useAppSelector((state) => state.cart.items);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filteredItems = items.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <AppShell>
            <div className="register-layout">
                <div className="register-main">
                    <h1>Register</h1>
                    <p className="muted">Select items to add them to the current sale.</p>

                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: "100%", maxWidth: 360, marginTop: 16 }}
                    />

                    {status === "loading" && <p className="muted">Loading...</p>}
                    {error && <p className="error-text">{error}</p>}

                    <div className="product-grid">
                        {filteredItems.map((product) => {
                            const inCart = cartItems.find((i) => i.productId === product.id);
                            const available = product.stockQty - (inCart?.quantity ?? 0);
                            const lowStock = product.stockQty <= product.reorderLevel;

                            return (
                                <div className="product-card" key={product.id}>
                                    <div className="muted" style={{ fontSize: 12 }}>{product.sku}</div>
                                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                                    <div className="muted" style={{ fontSize: 13 }}>{product.categoryName}</div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                                        <span style={{ fontWeight: 700 }}>Rs. {product.price}</span>
                                        <span className={`badge ${lowStock ? "badge-warning" : "badge-muted"}`}>
                                            {available} left
                                        </span>
                                    </div>

                                    {inCart ? (
                                        <div className="qty-stepper" style={{ marginTop: 6 }}>
                                            <button
                                                onClick={() =>
                                                    inCart.quantity === 1
                                                        ? dispatch(removeItem(product.id))
                                                        : dispatch(updateQuantity({ productId: product.id, quantity: inCart.quantity - 1 }))
                                                }
                                            >
                                                −
                                            </button>
                                            <span style={{ fontWeight: 600 }}>{inCart.quantity}</span>
                                            <button
                                                disabled={available <= 0}
                                                onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: inCart.quantity + 1 }))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            disabled={product.stockQty === 0}
                                            style={{ marginTop: 6 }}
                                            onClick={() =>
                                                dispatch(
                                                    addItem({
                                                        productId: product.id,
                                                        sku: product.sku,
                                                        name: product.name,
                                                        price: product.price,
                                                        quantity: 1,
                                                        availableStock: product.stockQty,
                                                    })
                                                )
                                            }
                                        >
                                            Add to sale
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="cart-panel">
                    <h3>Current sale</h3>
                    {cartItems.length === 0 && <p className="muted">No items added yet.</p>}
                    {cartItems.map((item) => (
                        <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <div>
                                <div style={{ fontSize: 14 }}>{item.name}</div>
                                <div className="muted" style={{ fontSize: 12 }}>{item.quantity} × Rs. {item.price}</div>
                            </div>
                            <div style={{ fontWeight: 600 }}>Rs. {item.quantity * item.price}</div>
                        </div>
                    ))}

                    {cartItems.length > 0 && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 18, fontWeight: 700 }}>
                                <span>Total</span>
                                <span>Rs. {total}</span>
                            </div>
                            <Link to="/cart">
                                <button style={{ width: "100%", marginTop: 16, padding: 12 }}>Review &amp; checkout</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </AppShell>
    );
}