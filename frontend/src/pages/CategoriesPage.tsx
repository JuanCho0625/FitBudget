import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { getCategories, createCategory, deleteCategory } from "../services/categoryService";

const PALETTE = [
    "#d97706","#f97316","#ef4444","#ec4899","#8b5cf6",
    "#6366f1","#2563eb","#0ea5e9","#14b8a6","#16a34a",
    "#a3e635","#94a3b8",
];

function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [color, setColor] = useState("#d97706");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try { setCategories(await getCategories()); } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setLoading(true);
        try {
            await createCategory({ name: name.trim(), type, color });
            setName(""); setColor("#d97706");
            fetchCategories();
        } catch (err) {
            if (axios.isAxiosError(err)) setError(err.response?.data?.message || "Error al crear categoría");
            else setError("Error inesperado");
        } finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        try { await deleteCategory(id); fetchCategories(); } catch (e) { console.error(e); }
    };

    const expenses = categories.filter(c => c.type === "expense");
    const incomes  = categories.filter(c => c.type === "income");

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="page-content">
                <div className="page-header">
                    <h1 className="page-title">Categorías</h1>
                    <p className="page-subtitle">Gestiona las categorías de ingresos y gastos</p>
                </div>

                {/* Create form */}
                <div className="form-card" style={{ maxWidth: 580 }}>
                    <h2>Crear categoría personalizada</h2>
                    <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div className="form-row">
                            <div className="form-field">
                                <label className="form-label">Nombre</label>
                                <input className="form-input" type="text" placeholder="Ej. Mascotas"
                                    value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="form-field" style={{ maxWidth: 150 }}>
                                <label className="form-label">Tipo</label>
                                <select className="form-input" value={type} onChange={e => setType(e.target.value as "income" | "expense")}>
                                    <option value="expense">Gasto</option>
                                    <option value="income">Ingreso</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <p className="form-label" style={{ marginBottom: 8 }}>Color</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                                {PALETTE.map(c => (
                                    <button key={c} type="button" onClick={() => setColor(c)} style={{
                                        width: 28, height: 28, borderRadius: "50%", background: c, border: "none",
                                        outline: color === c ? `3px solid ${c}` : "none",
                                        outlineOffset: 2,
                                        cursor: "pointer", padding: 0, transition: "transform 0.1s",
                                        transform: color === c ? "scale(1.2)" : "scale(1)",
                                    }} />
                                ))}
                                <input type="color" value={color} onChange={e => setColor(e.target.value)}
                                    style={{ width: 28, height: 28, border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", padding: 2 }}
                                    title="Color personalizado" />
                                <span style={{ fontSize: 13, color: "var(--text-2)", marginLeft: 4 }}>
                                    Vista previa:&nbsp;
                                    <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: color, verticalAlign: "middle" }} />
                                </span>
                            </div>
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Creando..." : "Crear categoría"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Lists */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    <CategoryGroup title="Gastos" categories={expenses} onDelete={handleDelete} accentClass="badge-expense" />
                    <CategoryGroup title="Ingresos" categories={incomes} onDelete={handleDelete} accentClass="badge-income" />
                </div>
            </div>
        </div>
    );
}

function CategoryGroup({ title, categories, onDelete, accentClass }: {
    title: string;
    categories: any[];
    onDelete: (id: string) => void;
    accentClass: string;
}) {
    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`badge ${accentClass}`}>{categories.length}</span>
                {title}
            </h2>
            <div className="table-card">
                {categories.length === 0 ? (
                    <p style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>Sin categorías</p>
                ) : (
                    <table>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat._id}>
                                    <td style={{ width: 32 }}>
                                        <span className="color-dot" style={{ background: cat.color, width: 12, height: 12 }} />
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{cat.name}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => onDelete(cat._id)}
                                            title="Eliminar"
                                            style={{ color: "var(--text-3)", fontSize: 18 }}
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage;
