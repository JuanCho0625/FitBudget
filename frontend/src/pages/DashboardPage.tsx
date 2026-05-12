import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardSummary } from "../services/dashboardService";

import {
    getExpensesByCategory,
    getMonthlyExpenses,
} from "../services/chartService";

import SummaryCard from "../components/SummaryCard";

import ExpensesPieChart from "../components/charts/ExpensesPieChart";
import MonthlyExpensesChart from "../components/charts/MonthlyExpensesChart";

function DashboardPage() {
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/");
    };

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
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>
                    FitBudget Dashboard
                </h1>

                <button
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {summary ? (
                <>
                    <div className="summary-container">
                        <SummaryCard
                            title="Total Income"
                            value={
                                summary.totalIncomes
                            }
                        />

                        <SummaryCard
                            title="Total Expenses"
                            value={
                                summary.totalExpenses
                            }
                        />

                        <SummaryCard
                            title="Balance"
                            value={
                                summary.balance
                            }
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
                        data={monthlyExpenses}
                    />
                </>
            ) : (
                <p>
                    Loading dashboard...
                </p>
            )}
        </div>
    );
}

export default DashboardPage;