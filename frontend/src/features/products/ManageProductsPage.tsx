import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts, createProduct, deleteProduct } from "./productsSlice";
import { fetchCategories } from "../categories/categoriesSlice";
import AppShell from "../../components/AppShell";

export default function ManageProductsPage() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.products);
    const { items: categories } = useAppSelector((state) => state.categories);

    const [form, setForm] = useState({
        sku: "",
        name: "",
        price: "",
        stockQty: "",
        reorderLevel: "",
        categoryId: "",
    });

    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!form.sku || !form.name || !form.categoryId) return;

        dispatch(
            createProduct({
                sku: form.sku,
                name: form.name,
                price: Number(form.price),
                stockQty: Number(form.stockQty),
                reorderLevel: Number(form.reorderLevel),
                categoryId: Number(form.categoryId),
            })
        );
        setForm({ sku: "", name: "", price: "", stockQty: "", reorderLevel: "", categoryId: "" });
    };

    return (
        <AppShell>
            <h1>Products</h1>
            <p className="muted">Add and manage your product catalog.</p>

            <div className="card" style={{ marginTop: 20, maxWidth: 720 }}>
                <h3 style={{ marginBottom: 12 }}>Add product</h3>
                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
                    <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                    <input type="number" placeholder="Stock quantity" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} required />
                    <input type="number" placeholder="Reorder level" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} required />
                    <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <button type="submit" style={{ gridColumn: "1 / -1" }}>Add product</button>
                </form>
                {error && <p className="error-text" style={{ marginTop: 8 }}>{error}</p>}
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: 20 }}>
                {status === "loading" && <p className="muted" style={{ padding: 20 }}>Loading...</p>}
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
                        {items.map((p) => (
                            <tr key={p.id}>
                                <td>{p.sku}</td>
                                <td>{p.name}</td>
                                <td>{p.categoryName}</td>
                                <td>Rs. {p.price}</td>
                                <td>{p.stockQty}</td>
                                <td>
                                    <button className="danger" onClick={() => dispatch(deleteProduct(p.id))}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppShell>
    );
}