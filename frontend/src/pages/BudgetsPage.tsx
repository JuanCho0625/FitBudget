import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgetService";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function BudgetsPage() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchBudgets = async () => {
        try { setBudgets(await getBudgets()); } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchBudgets(); }, []);

    const resetForm = () => {
        setMonthlyLimit(""); setMonth(""); setYear(new Date().getFullYear().toString());
        setEditingId(null); setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const data = { monthlyLimit: Number(monthlyLimit), month: Number(month), year: Number(year) };
            if (editingId) { await updateBudget(editingId, data); }
            else { await createBudget(data); }
            resetForm(); fetchBudgets();
        } catch (err) { setError("Error al guardar el presupuesto."); }
    };

    const handleEdit = (b: any) => {
        setEditingId(b._id);
        setMonthlyLimit(b.monthlyLimit.toString());
        setMonth(b.month.toString());
        setYear(b.year.toString());
    };

    const handleDelete = async (id: string) => {
        try { await deleteBudget(id); fetchBudgets(); } catch (e) { console.error(e); }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="page-content">
                <div className="page-header">
                    <h1 className="page-title">Presupuestos</h1>
                    <p className="page-subtitle">Define límites de gasto mensual</p>
                </div>

                <div className="form-card">
                    <h2>{editingId ? "Editar presupuesto" : "Nuevo presupuesto"}</h2>
                    <form onSubmit={handleSubmit} className="form-row">
                        <div className="form-field" style={{ maxWidth: 180 }}>
                            <label className="form-label">Límite mensual</label>
                            <input className="form-input" type="number" placeholder="0.00"
                                value={monthlyLimit} onChange={e => setMonthlyLimit(e.target.value)} required min="1" step="0.01" />
                        </div>
                        <div className="form-field" style={{ maxWidth: 160 }}>
                            <label className="form-label">Mes</label>
                            <select className="form-input" value={month} onChange={e => setMonth(e.target.value)} required>
                                <option value="">-- Mes --</option>
                                {MONTHS.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                            </select>
                        </div>
                        <div className="form-field" style={{ maxWidth: 120 }}>
                            <label className="form-label">Año</label>
                            <input className="form-input" type="number" placeholder="2026"
                                value={year} onChange={e => setYear(e.target.value)} required min="2020" max="2100" />
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? "Actualizar" : "Agregar"}
                            </button>
                            {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancelar</button>}
                        </div>
                    </form>
                    {error && <p className="alert alert-error" style={{ marginTop: 12 }}>{error}</p>}
                </div>

                {budgets.length === 0 ? (
                    <div className="empty-state"><p>Sin presupuestos registrados</p></div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                        {budgets.map(budget => {
                            const pct = Math.min(Number(budget.percentageUsed ?? 0), 100);
                            const isOver = pct >= 80;
                            return (
                                <div key={budget._id} className="card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                        <div>
                                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                                                {MONTHS[(budget.month ?? 1) - 1]} {budget.year}
                                            </h3>
                                            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
                                                Límite: ${budget.monthlyLimit?.toLocaleString("es-MX")}
                                            </p>
                                        </div>
                                        <span className="badge" style={{ background: isOver ? "var(--danger-light)" : "var(--success-light)", color: isOver ? "var(--danger)" : "var(--success)" }}>
                                            {pct.toFixed(0)}%
                                        </span>
                                    </div>

                                    <div className="progress-track">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${pct}%`,
                                                background: isOver ? "var(--danger)" : "var(--primary)",
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(budget)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(budget._id)}>Eliminar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BudgetsPage;
