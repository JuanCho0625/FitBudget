import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const NAV_ITEMS = [
    { to: "/dashboard",    label: "Dashboard",      icon: "▦" },
    { to: "/incomes",      label: "Ingresos",        icon: "↑" },
    { to: "/expenses",     label: "Gastos",          icon: "↓" },
    { to: "/budgets",      label: "Presupuestos",    icon: "◈" },
    { to: "/saving-goals", label: "Metas de Ahorro", icon: "◎" },
    { to: "/categories",   label: "Categorías",      icon: "⊞" },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { dark, toggle } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div style={{
            width: "var(--sidebar-w)",
            height: "100vh",
            background: "var(--sidebar-bg)",
            position: "fixed",
            left: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid var(--sidebar-border)",
        }}>
            {/* Logo */}
            <div style={{
                padding: "28px 20px 20px",
                borderBottom: "1px solid #292524",
            }}>
                <div style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#d97706",
                    letterSpacing: "-0.5px",
                }}>
                    FitBudget
                </div>
                <div style={{ fontSize: 11, color: "#78716c", marginTop: 2 }}>
                    Control financiero
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
                {NAV_ITEMS.map(({ to, label, icon }) => {
                    const active = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "9px 12px",
                                borderRadius: "var(--radius-md)",
                                textDecoration: "none",
                                fontSize: 14,
                                fontWeight: active ? 600 : 400,
                                color: active ? "#fff" : "#a8a29e",
                                background: active ? "var(--sidebar-active)" : "transparent",
                                transition: "background 0.15s, color 0.15s",
                            }}
                            onMouseEnter={e => {
                                if (!active) (e.currentTarget as HTMLElement).style.background = "var(--sidebar-hover)";
                                if (!active) (e.currentTarget as HTMLElement).style.color = "#e7e5e4";
                            }}
                            onMouseLeave={e => {
                                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                                if (!active) (e.currentTarget as HTMLElement).style.color = "#a8a29e";
                            }}
                        >
                            <span style={{ fontSize: 16, width: 20, textAlign: "center", opacity: active ? 1 : 0.7 }}>
                                {icon}
                            </span>
                            {label}
                            {active && (
                                <span style={{
                                    marginLeft: "auto",
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    background: "#d97706",
                                }} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Theme toggle + Logout */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid #292524", display: "flex", flexDirection: "column", gap: 8 }}>
                {/* Night mode toggle */}
                <button
                    onClick={toggle}
                    style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "transparent",
                        border: "1px solid #3d3936",
                        borderRadius: "var(--radius-md)",
                        color: "#a8a29e",
                        fontSize: 14,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "background 0.15s, color 0.15s",
                        cursor: "pointer",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#292524";
                        (e.currentTarget as HTMLElement).style.color = "#e7e5e4";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#a8a29e";
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{dark ? "☀️" : "🌙"}</span>
                        {dark ? "Modo claro" : "Modo oscuro"}
                    </span>
                    {/* Toggle pill */}
                    <span style={{
                        width: 32, height: 18,
                        background: dark ? "#d97706" : "#3d3936",
                        borderRadius: 99,
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                    }}>
                        <span style={{
                            position: "absolute",
                            top: 2,
                            left: dark ? 16 : 2,
                            width: 14, height: 14,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.2s",
                        }} />
                    </span>
                </button>

                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        padding: "9px 12px",
                        background: "transparent",
                        border: "1px solid #3d3936",
                        borderRadius: "var(--radius-md)",
                        color: "#a8a29e",
                        fontSize: 14,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        transition: "background 0.15s, color 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = "#7f1d1d";
                        (e.currentTarget as HTMLElement).style.color = "#fca5a5";
                        (e.currentTarget as HTMLElement).style.borderColor = "#7f1d1d";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#a8a29e";
                        (e.currentTarget as HTMLElement).style.borderColor = "#3d3936";
                    }}
                >
                    <span>⎋</span> Cerrar sesión
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
