import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import {
    getSavingGoals,
    createSavingGoal,
    updateSavingGoal,
    deleteSavingGoal,
} from "../services/savingGoalService";

function SavingGoalsPage() {
    const [goals, setGoals] =
        useState<any[]>([]);

    const [goalName, setGoalName] =
        useState("");

    const [
        targetAmount,
        setTargetAmount,
    ] = useState("");

    const [
        currentAmount,
        setCurrentAmount,
    ] = useState("");

    const [deadline, setDeadline] =
        useState("");

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const fetchGoals =
        async () => {
            try {
                const data =
                    await getSavingGoals();

                console.log(
                    "Saving goals:",
                    data
                );

                setGoals(data);
            } catch (error) {
                console.error(
                    "Saving goals error:",
                    error
                );
            }
        };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreate =
        async (
            event: React.FormEvent
        ) => {
            event.preventDefault();

            try {
                const goalData = {
                    goalName,
                    targetAmount:
                        Number(
                            targetAmount
                        ),
                    currentAmount:
                        Number(
                            currentAmount
                        ),
                    deadline,
                };

                if (editingId) {
                    await updateSavingGoal(
                        editingId,
                        goalData
                    );

                    setEditingId(null);
                } else {
                    await createSavingGoal(
                        goalData
                    );
                }

                setGoalName("");
                setTargetAmount("");
                setCurrentAmount("");
                setDeadline("");

                fetchGoals();
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
                await deleteSavingGoal(
                    id
                );

                fetchGoals();
            } catch (error) {
                console.error(
                    "Delete error:",
                    error
                );
            }
        };

    const handleEdit = (
        goal: any
    ) => {
        setEditingId(goal._id);

        setGoalName(
            goal.goalName
        );

        setTargetAmount(
            goal.targetAmount.toString()
        );

        setCurrentAmount(
            goal.currentAmount.toString()
        );

        setDeadline(
            goal.deadline.split("T")[0]
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
                    Saving Goals
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
                        placeholder="Goal Name"
                        value={goalName}
                        onChange={(
                            event
                        ) =>
                            setGoalName(
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
                        placeholder="Target Amount"
                        value={
                            targetAmount
                        }
                        onChange={(
                            event
                        ) =>
                            setTargetAmount(
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
                        placeholder="Current Amount"
                        value={
                            currentAmount
                        }
                        onChange={(
                            event
                        ) =>
                            setCurrentAmount(
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
                        type="date"
                        value={deadline}
                        onChange={(
                            event
                        ) =>
                            setDeadline(
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
                            ? "Update Goal"
                            : "Add Goal"}
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
                    {goals.map(
                        (goal) => {
                            const progress =
                                (
                                    (goal.currentAmount /
                                        goal.targetAmount) *
                                    100
                                ).toFixed(
                                    0
                                );

                            return (
                                <div
                                    key={
                                        goal._id
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
                                        🎯{" "}
                                        {
                                            goal.goalName
                                        }
                                    </h2>

                                    <p>
                                        $
                                        {
                                            goal.currentAmount
                                        }{" "}
                                        / $
                                        {
                                            goal.targetAmount
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
                                                    "#22c55e",
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
                                    </p>

                                    <p>
                                        Deadline:{" "}
                                        {new Date(
                                            goal.deadline
                                        ).toLocaleDateString()}
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
                                                    goal
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    goal._id
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

export default SavingGoalsPage;