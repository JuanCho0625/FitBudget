import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import { getCategories, createCategory, deleteCategory } from "../services/categoryService";

const DEFAULT_COLORS = [
    "#f97316", "#eab308", "#22c55e", "#14b8a6",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
    "#f43f5e", "#0ea5e9", "#a3e635", "#94a3b8",
];

function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [color, setColor] = useState("#6366f1");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Categories error:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await createCategory({ name: name.trim(), type, color });
            setName("");
            setColor("#6366f1");
            fetchCategories();
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Error al crear categoría");
            } else {
                setError("Error inesperado");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const expenses = categories.filter((c) => c.type === "expense");
    const incomes = categories.filter((c) => c.type === "income");

    const inputStyle = { padding: "10px", fontSize: 14 };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ marginLeft: "250px", padding: "40px", width: "100%" }}>
                <h1 style={{ marginBottom: 30 }}>Categorías</h1>

                {/* Formulario nueva categoría */}
                <div
                    style={{
                        background: "white",
                        padding: 24,
                        borderRadius: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        marginBottom: 40,
                        maxWidth: 600,
                    }}
                >
                    <h2 style={{ marginBottom: 16 }}>Crear categoría personalizada</h2>
                    <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <input
                                type="text"
                                placeholder="Nombre de la categoría"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ ...inputStyle, flex: 1, minWidth: 180 }}
                            />

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as "income" | "expense")}
                                style={{ ...inputStyle, minWidth: 130 }}
                            >
                                <option value="expense">Gasto</option>
                                <option value="income">Ingreso</option>
                            </select>
                        </div>

                        {/* Paleta de colores */}
                        <div>
                            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>Color:</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                {DEFAULT_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            background: c,
                                            border: color === c ? "3px solid #1e293b" : "2px solid transparent",
                                            cursor: "pointer",
                                            padding: 0,
                                        }}
                                    />
                                ))}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    title="Color personalizado"
                                    style={{ width: 28, height: 28, border: "none", cursor: "pointer", padding: 0 }}
                                />
                            </div>
                        </div>

                        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 24px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                cursor: "pointer",
                                fontWeight: "bold",
                                alignSelf: "flex-start",
                            }}
                        >
                            {loading ? "Creando..." : "Crear categoría"}
                        </button>
                    </form>
                </div>

                {/* Listas por tipo */}
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    <CategoryList title="Gastos" categories={expenses} onDelete={handleDelete} />
                    <CategoryList title="Ingresos" categories={incomes} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
}

function CategoryList({
    title,
    categories,
    onDelete,
}: {
    title: string;
    categories: any[];
    onDelete: (id: string) => void;
}) {
    return (
        <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ marginBottom: 16 }}>{title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((cat) => (
                    <div
                        key={cat._id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "white",
                            padding: "12px 16px",
                            borderRadius: 10,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                            borderLeft: `4px solid ${cat.color}`,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: cat.color,
                                    display: "inline-block",
                                }}
                            />
                            <span style={{ fontWeight: 500 }}>{cat.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onDelete(cat._id)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                fontSize: 18,
                                lineHeight: 1,
                                padding: "0 4px",
                            }}
                            title="Eliminar categoría"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoriesPage;
