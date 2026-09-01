import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "./productsSlice";

export default function ProductList() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);
    const { name, role } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div style={{ maxWidth: 800, margin: "40px auto" }}>
            <h2>Products</h2>
            <p>
                Logged in as {name} ({role})
            </p>

            {status === "loading" && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {status === "idle" && items.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                            <th style={{ padding: 8 }}>SKU</th>
                            <th style={{ padding: 8 }}>Name</th>
                            <th style={{ padding: 8 }}>Category</th>
                            <th style={{ padding: 8 }}>Price</th>
                            <th style={{ padding: 8 }}>Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((product) => (
                            <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: 8 }}>{product.sku}</td>
                                <td style={{ padding: 8 }}>{product.name}</td>
                                <td style={{ padding: 8 }}>{product.categoryName}</td>
                                <td style={{ padding: 8 }}>Rs. {product.price}</td>
                                <td style={{ padding: 8 }}>{product.stockQty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {status === "idle" && items.length === 0 && <p>No products found.</p>}
        </div>
    );
}