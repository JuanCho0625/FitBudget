import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
} from "../services/budgetService";

function BudgetsPage() {
    const [budgets, setBudgets] =
        useState<any[]>([]);

    const [
        monthlyLimit,
        setMonthlyLimit,
    ] = useState("");

    const [month, setMonth] =
        useState("");

    const [year, setYear] =
        useState("");

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const fetchBudgets =
        async () => {
            try {
                const data =
                    await getBudgets();

                console.log(
                    "Budgets:",
                    data
                );

                setBudgets(data);
            } catch (error) {
                console.error(
                    "Budgets error:",
                    error
                );
            }
        };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleCreate =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            try {
                const budgetData = {
                    monthlyLimit:
                        Number(
                            monthlyLimit
                        ),
                    month:
                        Number(month),
                    year:
                        Number(year),
                };

                if (editingId) {
                    await updateBudget(
                        editingId,
                        budgetData
                    );

                    setEditingId(null);
                } else {
                    await createBudget(
                        budgetData
                    );
                }

                setMonthlyLimit("");
                setMonth("");
                setYear("");

                fetchBudgets();
            } catch (error) {
                console.error(
                    "Create/Update error:",
                    error
                );
            }
        };

    const handleDelete =
        async (id: string) => {
            try {
                await deleteBudget(id);

                fetchBudgets();
            } catch (error) {
                console.error(
                    "Delete error:",
                    error
                );
            }
        };

    const handleEdit = (
        budget: any
    ) => {
        setEditingId(budget._id);

        setMonthlyLimit(
            budget.monthlyLimit.toString()
        );

        setMonth(
            budget.month.toString()
        );

        setYear(
            budget.year.toString()
        );
    };

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <Sidebar />

            <div
                style={{
                    marginLeft: "250px",
                    padding: "40px",
                    width: "100%",
                }}
            >
                <h1
                    style={{
                        marginBottom: "30px",
                    }}
                >
                    Budgets
                </h1>

                <form
                    onSubmit={handleCreate}
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "30px",
                        flexWrap: "wrap",
                    }}
                >
                    <input
                        type="number"
                        placeholder="Monthly Limit"
                        value={
                            monthlyLimit
                        }
                        onChange={(
                            event
                        ) =>
                            setMonthlyLimit(
                                event.target
                                    .value
                            )
                        }
                        style={{
                            padding:
                                "10px",
                        }}
                    />

                    <input
                        type="number"
                        placeholder="Month"
                        value={month}
                        onChange={(
                            event
                        ) =>
                            setMonth(
                                event.target
                                    .value
                            )
                        }
                        style={{
                            padding:
                                "10px",
                        }}
                    />

                    <input
                        type="number"
                        placeholder="Year"
                        value={year}
                        onChange={(
                            event
                        ) =>
                            setYear(
                                event.target
                                    .value
                            )
                        }
                        style={{
                            padding:
                                "10px",
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            padding:
                                "10px 20px",
                            cursor:
                                "pointer",
                        }}
                    >
                        {editingId
                            ? "Update Budget"
                            : "Add Budget"}
                    </button>
                </form>

                <div
                    style={{
                        display: "flex",
                        flexDirection:
                            "column",
                        gap: "20px",
                    }}
                >
                    {budgets.map(
                        (budget) => {
                            const used =
                                Math.floor(
                                    Math.random() *
                                    budget.monthlyLimit
                                );

                            const progress =
                                (
                                    (used /
                                        budget.monthlyLimit) *
                                    100
                                ).toFixed(
                                    0
                                );

                            return (
                                <div
                                    key={
                                        budget._id
                                    }
                                    style={{
                                        background:
                                            "white",
                                        padding:
                                            "20px",
                                        borderRadius:
                                            "12px",
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <h2>
                                        Budget{" "}
                                        {
                                            budget.month
                                        }
                                        /
                                        {
                                            budget.year
                                        }
                                    </h2>

                                    <p>
                                        $
                                        {
                                            used
                                        }{" "}
                                        / $
                                        {
                                            budget.monthlyLimit
                                        }
                                    </p>

                                    <div
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "20px",
                                            background:
                                                "#e5e7eb",
                                            borderRadius:
                                                "10px",
                                            overflow:
                                                "hidden",
                                            marginTop:
                                                "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width:
                                                    `${progress}%`,
                                                height:
                                                    "100%",
                                                background:
                                                    Number(
                                                        progress
                                                    ) >
                                                    80
                                                        ? "#ef4444"
                                                        : "#3b82f6",
                                            }}
                                        />
                                    </div>

                                    <p
                                        style={{
                                            marginTop:
                                                "10px",
                                        }}
                                    >
                                        {
                                            progress
                                        }
                                        %
                                        used
                                    </p>

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            gap: "10px",
                                            marginTop:
                                                "15px",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEdit(
                                                    budget
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    budget._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
}

export default BudgetsPage;