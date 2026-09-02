import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchCategories, createCategory, deleteCategory } from "./categoriesSlice";
import Navbar from "../../components/Navbar";

export default function CategoriesPage() {
    const dispatch = useAppDispatch();
    const { items, status, error } = useAppSelector((state) => state.categories);
    const [name, setName] = useState("");

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        dispatch(createCategory({ name: name.trim() }));
        setName("");
    };

    return (
        <div>
            <Navbar />
            <div style={{ maxWidth: 500, margin: "40px auto", padding: "0 24px" }}>
                <h2>Categories</h2>

                <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                    <input
                        type="text"
                        placeholder="New category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="submit">Add</button>
                </form>

                {error && <p className="error-text">{error}</p>}
                {status === "loading" && <p className="muted">Loading...</p>}

                <div className="card" style={{ padding: 0 }}>
                    {items.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "14px 20px",
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            {category.name}
                            <button className="danger" onClick={() => dispatch(deleteCategory(category.id))}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}