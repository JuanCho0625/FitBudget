import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: any[];
}

function MonthlyExpensesChart({ data }: Props) {
    return (
        <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="_id" tick={{ fill: "var(--text-2)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-2)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{
                            background: "var(--card-bg)",
                            border: "1px solid var(--card-border)",
                            borderRadius: 8,
                            color: "var(--text-1)",
                            fontSize: 13,
                        }}
                        cursor={{ fill: "var(--bg-2)" }}
                    />
                    <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyExpensesChart;