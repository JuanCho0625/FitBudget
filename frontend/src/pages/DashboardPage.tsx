import { useEffect, useState } from "react";

import { getDashboardSummary } from "../services/dashboardService";

import {
    getExpensesByCategory,
    getMonthlyExpenses,
} from "../services/chartService";

import { socket }
    from "../services/socketService";

import SummaryCard from "../components/SummaryCard";

import ExpensesPieChart from "../components/charts/ExpensesPieChart";
import MonthlyExpensesChart from "../components/charts/MonthlyExpensesChart";

import Sidebar from "../components/Sidebar";

function DashboardPage() {
    const [summary, setSummary] =
        useState<any>(null);

    const [
        expensesByCategory,
        setExpensesByCategory,
    ] = useState<any[]>([]);

    const [
        monthlyExpenses,
        setMonthlyExpenses,
    ] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData =
            async () => {
                try {
                    const summaryData =
                        await getDashboardSummary();

                    setSummary(summaryData);

                    console.log(
                        "Dashboard summary:",
                        summaryData
                    );

                    const categoryData =
                        await getExpensesByCategory();

                    setExpensesByCategory(
                        categoryData
                    );

                    console.log(
                        "Expenses by category:",
                        categoryData
                    );

                    const monthlyExpensesData =
                        await getMonthlyExpenses();

                    setMonthlyExpenses(
                        monthlyExpensesData
                    );

                    console.log(
                        "Monthly expenses:",
                        monthlyExpensesData
                    );
                } catch (error) {
                    console.error(
                        "Dashboard error:",
                        error
                    );
                }
            };

        fetchDashboardData();

        const token =
            localStorage.getItem(
                "token"
            );

        socket.auth = { token };
        socket.connect();

        // Decode JWT to get userId and join the private room
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                socket.emit("join-user-room", payload.id);
            } catch (_) {}
        }

        socket.on("update-dashboard", () => {
            fetchDashboardData();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
                    FitBudget Dashboard
                </h1>

                {summary ? (
                    <>
                        <div className="summary-container">
                            <SummaryCard
                                title="Total Income"
                                value={summary.totalIncomes}
                            />

                            <SummaryCard
                                title="Total Expenses"
                                value={summary.totalExpenses}
                            />

                            <SummaryCard
                                title="Apartados"
                                value={summary.totalSaved ?? 0}
                            />

                            <SummaryCard
                                title="Balance"
                                value={summary.balance}
                            />
                        </div>

                        <div
                            style={{
                                marginTop: "40px",
                            }}
                        >
                            <h2>
                                Expenses by Category
                            </h2>

                            <ExpensesPieChart
                                data={
                                    expensesByCategory
                                }
                            />
                        </div>

                        <MonthlyExpensesChart
                            data={
                                monthlyExpenses
                            }
                        />
                    </>
                ) : (
                    <p>
                        Loading dashboard...
                    </p>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;