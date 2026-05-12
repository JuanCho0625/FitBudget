import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardSummary } from "../services/dashboardService";
import SummaryCard from "../components/SummaryCard";

function DashboardPage() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState<any>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/");
    };

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const data = await getDashboardSummary();

                console.log("Dashboard summary:", data);

                setSummary(data);
            } catch (error) {
                console.error("Dashboard error:", error);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>FitBudget Dashboard</h1>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {summary ? (
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
                        title="Balance"
                        value={summary.balance}
                    />
                </div>
            ) : (
                <p>Loading dashboard...</p>
            )}
        </div>
    );
}

export default DashboardPage;