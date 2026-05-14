import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import {
    getSavingGoals,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
} from "../services/savingGoalService";

function SavingGoalsPage() {
    const [goals, setGoals] = useState<any[]>([]);
    const [goalName, setGoalName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [deadline, setDeadline] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    // deposit input per goal: { [goalId]: amountString }
    const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
    const [depositError, setDepositError] = useState<Record<string, string>>({});

    const fetchGoals = async () => {
        try {
            const data = await getSavingGoals();
            setGoals(data);
        } catch (error) {
            console.error("Saving goals error:", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const resetForm = () => {
        setGoalName("");
        setTargetAmount("");
        setCurrentAmount("");
        setDeadline("");
        setEditingId(null);
    };

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const goalData = {
                goalName,
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount),
                deadline,
            };

            if (editingId) {
                await updateSavingGoal(editingId, goalData);
            } else {
                await createSavingGoal(goalData);
            }

            resetForm();
            fetchGoals();
        } catch (error) {
            console.error("Create/Update error:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSavingGoal(id);
            fetchGoals();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleEdit = (goal: any) => {
        setEditingId(goal._id);
        setGoalName(goal.goalName);
        setTargetAmount(goal.targetAmount.toString());
        setCurrentAmount(goal.currentAmount.toString());
        setDeadline(goal.deadline.split("T")[0]);
    };

    const handleDeposit = async (goal: any) => {
        const raw = depositAmounts[goal._id] ?? "";
        const amount = Number(raw);

        if (!raw || amount <= 0) {
            setDepositError((prev) => ({ ...prev, [goal._id]: "Ingresa un monto válido mayor a 0" }));
            return;
        }

        const remaining = goal.targetAmount - goal.currentAmount;
        if (amount > remaining) {
            setDepositError((prev) => ({
                ...prev,
                [goal._id]: `El monto excede lo que falta ($${remaining.toFixed(2)})`,
            }));
            return;
        }

        try {
            await updateSavingGoal(goal._id, { addAmount: amount });
            setDepositAmounts((prev) => ({ ...prev, [goal._id]: "" }));
            setDepositError((prev) => ({ ...prev, [goal._id]: "" }));
            fetchGoals();
        } catch (error) {
            console.error("Deposit error:", error);
        }
    };

    const inputStyle = { padding: "10px" };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ marginLeft: "250px", padding: "40px", width: "100%" }}>
                <h1 style={{ marginBottom: "30px" }}>Saving Goals</h1>

                <form
                    onSubmit={handleCreate}
                    style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}
                >
                    <input
                        type="text"
                        placeholder="Nombre de la meta"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Monto objetivo"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                        min="1"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        placeholder="Monto inicial (opcional)"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        min="0"
                        style={inputStyle}
                    />
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                        {editingId ? "Update Goal" : "Add Goal"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} style={{ padding: "10px 20px", cursor: "pointer" }}>
                            Cancelar
                        </button>
                    )}
                </form>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {goals.map((goal) => {
                        const progress = Math.min(
                            (goal.currentAmount / goal.targetAmount) * 100,
                            100
                        ).toFixed(0);
                        const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
                        const isCompleted = goal.status === "completed" || remaining === 0;

                        return (
                            <div
                                key={goal._id}
                                style={{
                                    background: "white",
                                    padding: "20px",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    borderLeft: isCompleted ? "4px solid #22c55e" : "4px solid #e5e7eb",
                                }}
                            >
                                <h2 style={{ marginBottom: 8 }}>
                                    {isCompleted ? "✅" : "🎯"} {goal.goalName}
                                    {isCompleted && (
                                        <span style={{ fontSize: 14, color: "#22c55e", marginLeft: 10 }}>
                                            ¡Meta alcanzada!
                                        </span>
                                    )}
                                </h2>

                                <p style={{ margin: "4px 0" }}>
                                    Ahorrado: <strong>${goal.currentAmount.toFixed(2)}</strong> / ${goal.targetAmount.toFixed(2)}
                                </p>
                                <p style={{ margin: "4px 0", color: isCompleted ? "#22c55e" : "#6b7280" }}>
                                    {isCompleted ? "Completada" : `Falta: $${remaining.toFixed(2)}`}
                                </p>

                                {/* Barra de progreso */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: 20,
                                        background: "#e5e7eb",
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        marginTop: 10,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${progress}%`,
                                            height: "100%",
                                            background: isCompleted ? "#22c55e" : "#3b82f6",
                                            transition: "width 0.4s ease",
                                        }}
                                    />
                                </div>
                                <p style={{ marginTop: 6, marginBottom: 4 }}>{progress}%</p>

                                <p style={{ color: "#6b7280", fontSize: 14 }}>
                                    Fecha límite: {new Date(goal.deadline).toLocaleDateString()}
                                </p>

                                {/* Abonar a la meta */}
                                {!isCompleted && (
                                    <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                                        <input
                                            type="number"
                                            placeholder="Monto a abonar"
                                            value={depositAmounts[goal._id] ?? ""}
                                            onChange={(e) =>
                                                setDepositAmounts((prev) => ({ ...prev, [goal._id]: e.target.value }))
                                            }
                                            min="0.01"
                                            step="0.01"
                                            style={{ padding: "8px 12px", width: 160 }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleDeposit(goal)}
                                            style={{
                                                padding: "8px 16px",
                                                cursor: "pointer",
                                                background: "#3b82f6",
                                                color: "white",
                                                border: "none",
                                                borderRadius: 6,
                                            }}
                                        >
                                            Abonar
                                        </button>
                                        {depositError[goal._id] && (
                                            <span style={{ color: "red", fontSize: 13 }}>
                                                {depositError[goal._id]}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Editar / Eliminar */}
                                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                                    <button type="button" onClick={() => handleEdit(goal)} style={{ padding: "8px 12px", cursor: "pointer" }}>
                                        Edit
                                    </button>
                                    <button type="button" onClick={() => handleDelete(goal._id)} style={{ padding: "8px 12px", cursor: "pointer" }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default SavingGoalsPage;