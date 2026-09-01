import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "./productsSlice";
import { addItem } from "../cart/cartSlice";
import Navbar from "../../components/Navbar";
export default function ProductList() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);
    
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <>
        
            <Navbar />
            <div style={{ maxWidth: 800, margin: "40px auto" }}>
                <h2>Products</h2>
            
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
                                <th style={{ padding: 8 }}>Action</th>
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

                                    <td style={{ padding: 8 }}>
                                        <button
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
                                            disabled={product.stockQty === 0}
                                        >
                                            Add to Cart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {status === "idle" && items.length === 0 && <p>No products found.</p>}
            </div>
        </>
    );
}

