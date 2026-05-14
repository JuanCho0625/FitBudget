import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#d97706",
    "#16a34a",
    "#2563eb",
    "#ef4444",
    "#8b5cf6",
    "#f97316",
    "#0ea5e9",
    "#ec4899",
];

interface ExpensesPieChartProps {
    data: any[];
}

function ExpensesPieChart({
                              data,
                          }: ExpensesPieChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="empty-state" style={{ padding: "32px 0" }}>
                <p>Sin datos de gastos</p>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <PieChart width={320} height={260}>
                <Pie
                    data={data}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={40}
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: 8,
                        color: "var(--text-1)",
                        fontSize: 13,
                    }}
                />
                <Legend
                    formatter={(value) => <span style={{ color: "var(--text-2)", fontSize: 12 }}>{value}</span>}
                />
            </PieChart>
        </div>
    );
}

export default ExpensesPieChart;