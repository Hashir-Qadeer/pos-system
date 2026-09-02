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
            <div style={{ maxWidth: 500, margin: "40px auto" }}>
                <h2>Categories</h2>

                <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <input
                        type="text"
                        placeholder="New category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ flex: 1, padding: 8 }}
                    />
                    <button type="submit">Add</button>
                </form>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {status === "loading" && <p>Loading...</p>}

                <ul style={{ listStyle: "none", padding: 0 }}>
                    {items.map((category) => (
                        <li
                            key={category.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "8px 0",
                                borderBottom: "1px solid #333",
                            }}
                        >
                            {category.name}
                            <button onClick={() => dispatch(deleteCategory(category.id))}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}