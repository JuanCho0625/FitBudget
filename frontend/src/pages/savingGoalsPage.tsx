import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getSavingGoals, createSavingGoal, updateSavingGoal, deleteSavingGoal } from "../services/savingGoalService";

function SavingGoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [goalName, setGoalName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
    const [depositError, setDepositError] = useState<Record<string, string>>({});

    const fetchGoals = async () => {
        try { setGoals(await getSavingGoals()); } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchGoals(); }, []);

    const resetForm = () => {
        setGoalName(""); setTargetAmount(""); setCurrentAmount("");
        setDeadline(""); setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { goalName, targetAmount: Number(targetAmount), currentAmount: Number(currentAmount), deadline };
            if (editingId) { await updateSavingGoal(editingId, data); }
            else { await createSavingGoal(data); }
            resetForm(); fetchGoals();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (g: any) => {
        setEditingId(g._id); setGoalName(g.goalName);
        setTargetAmount(g.targetAmount.toString());
        setCurrentAmount(g.currentAmount.toString());
        setDeadline(g.deadline.split("T")[0]);
    };

    const handleDelete = async (id: string) => {
        try { await deleteSavingGoal(id); fetchGoals(); } catch (e) { console.error(e); }
    };

    const handleDeposit = async (goal: any) => {
        const raw = depositAmounts[goal._id] ?? "";
        const amount = Number(raw);
        if (!raw || amount <= 0) {
            setDepositError(p => ({ ...p, [goal._id]: "Ingresa un monto mayor a 0" }));
            return;
        }
        const remaining = goal.targetAmount - goal.currentAmount;
        if (amount > remaining) {
            setDepositError(p => ({ ...p, [goal._id]: `Máximo a abonar: $${remaining.toFixed(2)}` }));
            return;
        }
        try {
            await updateSavingGoal(goal._id, { addAmount: amount });
            setDepositAmounts(p => ({ ...p, [goal._id]: "" }));
            setDepositError(p => ({ ...p, [goal._id]: "" }));
            fetchGoals();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="page-layout">
            <Sidebar />
            <div className="page-content">
                <div className="page-header">
                    <h1 className="page-title">Metas de Ahorro</h1>
                    <p className="page-subtitle">Visualiza y avanza hacia tus objetivos financieros</p>
                </div>

                <div className="form-card">
                    <h2>{editingId ? "Editar meta" : "Nueva meta de ahorro"}</h2>
                    <form onSubmit={handleSubmit} className="form-row">
                        <div className="form-field">
                            <label className="form-label">Nombre</label>
                            <input className="form-input" type="text" placeholder="Ej. Viaje de graduación"
                                value={goalName} onChange={e => setGoalName(e.target.value)} required />
                        </div>
                        <div className="form-field" style={{ maxWidth: 150 }}>
                            <label className="form-label">Monto objetivo</label>
                            <input className="form-input" type="number" placeholder="0.00"
                                value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required min="1" step="0.01" />
                        </div>
                        <div className="form-field" style={{ maxWidth: 150 }}>
                            <label className="form-label">Monto inicial</label>
                            <input className="form-input" type="number" placeholder="0.00"
                                value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} min="0" step="0.01" />
                        </div>
                        <div className="form-field" style={{ maxWidth: 160 }}>
                            <label className="form-label">Fecha límite</label>
                            <input className="form-input" type="date" value={deadline}
                                onChange={e => setDeadline(e.target.value)} required />
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                            <button type="submit" className="btn btn-primary">
                                {editingId ? "Actualizar" : "Crear meta"}
                            </button>
                            {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancelar</button>}
                        </div>
                    </form>
                </div>

                {goals.length === 0 ? (
                    <div className="empty-state"><p>Sin metas de ahorro. ¡Crea tu primera meta!</p></div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                        {goals.map(goal => {
                            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                            const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
                            const done = goal.status === "completed" || remaining === 0;

                            return (
                                <div key={goal._id} className="card" style={{
                                    borderTop: `3px solid ${done ? "var(--success)" : "var(--primary)"}`,
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{goal.goalName}</h3>
                                        {done ? (
                                            <span className="badge" style={{ background: "var(--success-light)", color: "var(--success)" }}>✓ Completada</span>
                                        ) : (
                                            <span className="badge badge-neutral">Activa</span>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}>
                                        <span>Ahorrado: <strong style={{ color: "var(--text-1)" }}>${goal.currentAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</strong></span>
                                        <span>Meta: <strong style={{ color: "var(--text-1)" }}>${goal.targetAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</strong></span>
                                    </div>

                                    <div className="progress-track">
                                        <div className="progress-fill" style={{
                                            width: `${pct}%`,
                                            background: done ? "var(--success)" : "var(--primary)",
                                        }} />
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
                                        <span style={{ color: "var(--text-2)" }}>{pct.toFixed(0)}% completado</span>
                                        {!done && <span style={{ color: "var(--text-2)" }}>Falta: <strong style={{ color: "var(--text-1)" }}>${remaining.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</strong></span>}
                                    </div>

                                    <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>
                                        Fecha límite: {new Date(goal.deadline).toLocaleDateString("es-MX")}
                                    </p>

                                    {!done && (
                                        <div style={{ marginTop: 16, padding: "14px", background: "var(--bg)", borderRadius: "var(--radius-md)" }}>
                                            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Abonar a la meta</p>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    placeholder="Monto"
                                                    value={depositAmounts[goal._id] ?? ""}
                                                    onChange={e => setDepositAmounts(p => ({ ...p, [goal._id]: e.target.value }))}
                                                    min="0.01" step="0.01"
                                                    style={{ flex: 1 }}
                                                />
                                                <button className="btn btn-success btn-sm" onClick={() => handleDeposit(goal)}>
                                                    Abonar
                                                </button>
                                            </div>
                                            {depositError[goal._id] && (
                                                <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>{depositError[goal._id]}</p>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(goal)}>Editar</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(goal._id)}>Eliminar</button>
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

export default SavingGoalsPage;
