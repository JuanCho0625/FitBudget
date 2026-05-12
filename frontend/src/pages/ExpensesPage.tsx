import { useEffect, useState } from "react";

import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from "../services/expenseService";

function ExpensesPage() {
    const [expenses, setExpenses] =
        useState<any[]>([]);

    const [description, setDescription] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [date, setDate] =
        useState("");

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const fetchExpenses =
        async () => {
            try {
                const data =
                    await getExpenses();

                console.log(
                    "Expenses:",
                    data
                );

                setExpenses(data);
            } catch (error) {
                console.error(
                    "Expenses error:",
                    error
                );
            }
        };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleCreate =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            try {
                if (editingId) {
                    await updateExpense(
                        editingId,
                        {
                            description,
                            amount:
                                Number(amount),
                            date,
                        }
                    );

                    setEditingId(null);
                } else {
                    await createExpense({
                        description,
                        amount:
                            Number(amount),
                        date,
                    });
                }

                setDescription("");
                setAmount("");
                setDate("");

                fetchExpenses();
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
                await deleteExpense(id);

                fetchExpenses();
            } catch (error) {
                console.error(
                    "Delete error:",
                    error
                );
            }
        };

    const handleEdit = (
        expense: any
    ) => {
        console.log(
            "Editing:",
            expense
        );

        setEditingId(expense._id);

        setDescription(
            expense.description
        );

        setAmount(
            expense.amount.toString()
        );

        setDate(
            expense.date.split("T")[0]
        );
    };

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            <h1
                style={{
                    marginBottom: "30px",
                }}
            >
                Expenses
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
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(event) =>
                        setAmount(
                            event.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                        setDate(
                            event.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding:
                            "10px 20px",
                        cursor: "pointer",
                    }}
                >
                    {editingId
                        ? "Update Expense"
                        : "Add Expense"}
                </button>
            </form>

            <table
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse",
                    background: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                }}
            >
                <thead>
                <tr
                    style={{
                        background:
                            "#f3f4f6",
                    }}
                >
                    <th
                        style={{
                            padding:
                                "15px",
                            textAlign:
                                "left",
                        }}
                    >
                        Description
                    </th>

                    <th
                        style={{
                            padding:
                                "15px",
                            textAlign:
                                "left",
                        }}
                    >
                        Amount
                    </th>

                    <th
                        style={{
                            padding:
                                "15px",
                            textAlign:
                                "left",
                        }}
                    >
                        Date
                    </th>

                    <th
                        style={{
                            padding:
                                "15px",
                            textAlign:
                                "left",
                        }}
                    >
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody>
                {expenses.map(
                    (expense) => (
                        <tr
                            key={
                                expense._id
                            }
                            style={{
                                borderBottom:
                                    "1px solid #e5e7eb",
                            }}
                        >
                            <td
                                style={{
                                    padding:
                                        "15px",
                                }}
                            >
                                {
                                    expense.description
                                }
                            </td>

                            <td
                                style={{
                                    padding:
                                        "15px",
                                }}
                            >
                                $
                                {
                                    expense.amount
                                }
                            </td>

                            <td
                                style={{
                                    padding:
                                        "15px",
                                }}
                            >
                                {new Date(
                                    expense.date
                                ).toLocaleDateString()}
                            </td>

                            <td
                                style={{
                                    padding:
                                        "15px",
                                    display:
                                        "flex",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEdit(
                                            expense
                                        )
                                    }
                                    style={{
                                        padding:
                                            "8px 12px",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            expense._id
                                        )
                                    }
                                    style={{
                                        padding:
                                            "8px 12px",
                                        cursor:
                                            "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    );
}

export default ExpensesPage;