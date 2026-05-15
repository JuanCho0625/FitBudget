import { useEffect, useState } from "react";
import { getIncomes, createIncome, updateIncome, deleteIncome } from "../services/incomeService";
import { getCategories } from "../services/categoryService";
import Sidebar from "../components/Sidebar";

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayMid = new Date(todayMid);
    yesterdayMid.setDate(yesterdayMid.getDate() - 1);
    const dMid = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (dMid.getTime() === todayMid.getTime()) return "Hoy";
    if (dMid.getTime() === yesterdayMid.getTime()) return "Ayer";
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function IncomesPage() {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            const [inc, cats] = await Promise.all([getIncomes(), getCategories("income")]);
            setIncomes(inc);
            setCategories(cats);
        } catch (err) {
            console.error("Incomes error:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setDescription(""); setAmount("");
        setCategoryId(""); setEditingId(null); setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!categoryId) { setError("Selecciona una categoría"); return; }
        try {
            const payload = { description, amount: Number(amount), categoryId };
            if (editingId) {
                await updateIncome(editingId, payload);
            } else {
                await createIncome(payload);
            }
            resetForm();
            fetchData();
        } catch (err) {
            setError("Error al guardar el ingreso.");
        }
    };

    const handleEdit = (income: any) => {
        setEditingId(income._id);
        setDescription(income.description);
        setAmount(income.amount.toString());
        setCategoryId(income.categoryId?._id ?? income.categoryId ?? "");
        setError("");
    };

    const handleDelete = async (id: string) => {
        try { await deleteIncome(id); fetchData(); } catch (err) { console.error(err); }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="page-content">
                <div className="page-header">
                    <h1 className="page-title">Ingresos</h1>
                    <p className="page-subtitle">Registra y controla tus ingresos</p>
                </div>

                <div className="form-card">
                    <h2>{editingId ? "Editar ingreso" : "Nuevo ingreso"}</h2>
                    <form onSubmit={handleSubmit} className="form-row">
                        <div className="form-field">
                            <label className="form-label">Descripción</label>
                            <input className="form-input" type="text" placeholder="Ej. Sueldo mensual"
                                value={description} onChange={e => setDescription(e.target.value)} required />
                        </div>
                        <div className="form-field" style={{ maxWidth: 140 }}>
                            <label className="form-label">Monto</label>
                            <input className="form-input" type="number" placeholder="0.00"
                                value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
                        </div>
                        <div className="form-field" style={{ maxWidth: 180 }}>
                            <label className="form-label">Categoría</label>
                            <select className="form-input" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                                <option value="">-- Seleccionar --</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? "Actualizar" : "Agregar"}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancelar</button>
                            )}
                        </div>
                    </form>
                    {error && <p className="alert alert-error" style={{ marginTop: 12 }}>{error}</p>}
                </div>

                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Fecha</th>
                                <th style={{ textAlign: "right" }}>Monto</th>
                                <th style={{ textAlign: "center" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.length === 0 ? (
                                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-3)", padding: 32 }}>Sin ingresos registrados</td></tr>
                            ) : incomes.map(income => (
                                <tr key={income._id}>
                                    <td style={{ fontWeight: 500 }}>{income.description}</td>
                                    <td>
                                        <span className="badge badge-income">{income.categoryId?.name ?? "—"}</span>
                                    </td>
                                    <td style={{ color: "var(--text-2)" }}>{formatDate(income.date)}</td>
                                    <td style={{ textAlign: "right", fontWeight: 600, color: "var(--success)" }}>
                                        +${income.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(income)}>Editar</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(income._id)}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default IncomesPage;
