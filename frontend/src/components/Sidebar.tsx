import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/");
    };

    return (
        <div
            style={{
                width: "250px",
                height: "100vh",
                background: "#111827",
                color: "white",
                padding: "30px 20px",
                position: "fixed",
                left: 0,
                top: 0,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2
                style={{
                    marginBottom: "40px",
                }}
            >
                FitBudget
            </h2>

            <nav
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <Link
                    to="/dashboard"
                    style={linkStyle}
                >
                    Dashboard
                </Link>

                <Link
                    to="/expenses"
                    style={linkStyle}
                >
                    Expenses
                </Link>

                <Link
                    to="/incomes"
                    style={linkStyle}
                >
                    Incomes
                </Link>

                <Link
                    to="/saving-goals"
                    style={linkStyle}
                >
                    Saving Goals
                </Link>
            </nav>

            <Link
                to="/budgets"
                style={linkStyle}
            >
                Budgets
            </Link>

            <button
                onClick={handleLogout}
                style={{
                    marginTop: "40px",
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: "bold",
                }}
            >
                Logout
            </button>
        </div>
    );
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
};

export default Sidebar;