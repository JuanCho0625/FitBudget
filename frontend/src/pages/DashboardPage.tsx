import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import { getExpensesByCategory, getMonthlyExpenses } from "../services/chartService";
import { socket } from "../services/socketService";
import SummaryCard from "../components/SummaryCard";
import ExpensesPieChart from "../components/charts/ExpensesPieChart";
import MonthlyExpensesChart from "../components/charts/MonthlyExpensesChart";
import Sidebar from "../components/Sidebar";

function DashboardPage() {
    const [summary, setSummary] = useState<any>(null);
    const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
    const [monthlyExpenses, setMonthlyExpenses] = useState<any[]>([]);

    const fetchDashboardData = async () => {
        try {
            const [summaryData, categoryData, monthlyData] = await Promise.all([
                getDashboardSummary(),
                getExpensesByCategory(),
                getMonthlyExpenses(),
            ]);
            setSummary(summaryData);
            setExpensesByCategory(categoryData);
            setMonthlyExpenses(monthlyData);
        } catch (error) {
            console.error("Dashboard error:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const token = localStorage.getItem("token");
        socket.auth = { token };
        socket.connect();

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                socket.emit("join-user-room", payload.id);
            } catch (_) {}
        }

        socket.on("update-dashboard", () => { fetchDashboardData(); });

        return () => { socket.disconnect(); };
    }, []);

    return (
        <div className="page-layout">
            <Sidebar />

            <div className="page-content">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Resumen de tus finanzas personales</p>
                </div>

                {summary ? (
                    <>
                        <div className="summary-container">
                            <SummaryCard
                                title="Ingresos totales"
                                value={summary.totalIncomes}
                                accent="var(--success)"
                            />
                            <SummaryCard
                                title="Gastos totales"
                                value={summary.totalExpenses}
                                accent="var(--danger)"
                            />
                            <SummaryCard
                                title="Apartados"
                                value={summary.totalSaved ?? 0}
                                accent="var(--info)"
                            />
                            <SummaryCard
                                title="Balance disponible"
                                value={summary.balance}
                                accent={summary.balance >= 0 ? "var(--primary)" : "var(--danger)"}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                            <div className="card">
                                <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "var(--text-2)" }}>
                                    Gastos por categoría
                                </h2>
                                <ExpensesPieChart data={expensesByCategory} />
                            </div>

                            <div className="card">
                                <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "var(--text-2)" }}>
                                    Gastos mensuales
                                </h2>
                                <MonthlyExpensesChart data={monthlyExpenses} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Cargando datos...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardPage;
