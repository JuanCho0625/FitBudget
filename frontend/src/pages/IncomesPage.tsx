import { useEffect, useState } from "react";

import { getIncomes, createIncome, updateIncome, deleteIncome } from "../services/incomeService";
import { getCategories } from "../services/categoryService";
import Sidebar from "../components/Sidebar";

function IncomesPage() {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const fetchIncomes = async () => {
        try {
            const data = await getIncomes();
            setIncomes(data);
        } catch (err) {
            console.error("Incomes error:", err);
        }
    };

    useEffect(() => {
        fetchIncomes();
        getCategories("income").then(setCategories).catch(console.error);
    }, []);

    const resetForm = () => {
        setDescription("");
        setAmount("");
        setDate("");
        setCategoryId("");
        setEditingId(null);
        setError("");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!categoryId) {
            setError("Selecciona una categoría");
            return;
        }

        try {
            if (editingId) {
                await updateIncome(editingId, {
                    description,
                    amount: Number(amount),
                    date,
                    categoryId,
                });
            } else {
                await createIncome({
                    description,
                    amount: Number(amount),
                    date,
                    categoryId,
                });
            }
            resetForm();
            fetchIncomes();
        } catch (err) {
            console.error("Create/Update error:", err);
            setError("Error al guardar el ingreso. Verifica los datos.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteIncome(id);
            fetchIncomes();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleEdit = (income: any) => {
        setEditingId(income._id);
        setDescription(income.description);
        setAmount(income.amount.toString());
        setDate(income.date.split("T")[0]);
        setCategoryId(income.categoryId?._id ?? income.categoryId ?? "");
        setError("");
    };

    const inputStyle = { padding: "10px", minWidth: 140 };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ marginLeft: "250px", padding: "40px", width: "100%" }}>
                <h1 style={{ marginBottom: "30px" }}>Incomes</h1>

                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}
                >
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="number"
                        placeholder="Monto"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                        style={inputStyle}
                    />

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={inputStyle}
                    />

                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        style={inputStyle}
                    >
                        <option value="">-- Categoría --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
                        {editingId ? "Update Income" : "Add Income"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{ padding: "10px 20px", cursor: "pointer" }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>

                {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        background: "white",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginTop: "20px",
                    }}
                >
                    <thead>
                        <tr style={{ background: "#f3f4f6" }}>
                            <th style={{ padding: "15px", textAlign: "left" }}>Descripción</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Monto</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Categoría</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Fecha</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {incomes.map((income) => (
                            <tr key={income._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "15px" }}>{income.description}</td>
                                <td style={{ padding: "15px" }}>${income.amount}</td>
                                <td style={{ padding: "15px" }}>
                                    {income.categoryId?.name ?? "—"}
                                </td>
                                <td style={{ padding: "15px" }}>
                                    {new Date(income.date).toLocaleDateString()}
                                </td>
                                <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(income)}
                                        style={{ padding: "8px 12px", cursor: "pointer" }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(income._id)}
                                        style={{ padding: "8px 12px", cursor: "pointer" }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomesPage;