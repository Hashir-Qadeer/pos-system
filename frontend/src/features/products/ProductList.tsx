import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "./productsSlice";
import { addItem } from "../cart/cartSlice";
import Navbar from "../../components/Navbar";

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

    return (
        <div>
            <Navbar />

            <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
                <h2>Products</h2>

                {status === "loading" && <p className="muted">Loading...</p>}
                {error && <p className="error-text">{error}</p>}

                {status === "idle" && items.length > 0 && (
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ marginBottom: 16, width: "100%", maxWidth: 300 }}
                        />

                        <table>
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredItems.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.sku}</td>
                                        <td>{product.name}</td>
                                        <td>{product.categoryName}</td>
                                        <td>Rs. {product.price}</td>

                                        {(() => {
                                            const inCart =
                                                cartItems.find(
                                                    (i) => i.productId === product.id
                                                )?.quantity ?? 0;

                                            const available = product.stockQty - inCart;

                                            return (
                                                <>
                                                    <td>{available}</td>

                                                    <td>
                                                        <button
                                                            onClick={() =>
                                                                dispatch(
                                                                    addItem({
                                                                        productId: product.id,
                                                                        sku: product.sku,
                                                                        name: product.name,
                                                                        price: product.price,
                                                                        quantity: 1,
                                                                        availableStock:
                                                                            product.stockQty,
                                                                    })
                                                                )
                                                            }
                                                            disabled={available <= 0}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </td>
                                                </>
                                            );
                                        })()}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {status === "idle" && items.length === 0 && (
                    <p className="muted">No products found.</p>
                )}
            </div>
        </div>
    );
}
