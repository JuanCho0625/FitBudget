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

function MonthlyExpensesChart({
                                  data,
                              }: Props) {
    return (
        <div
            style={{
                width: "100%",
                height: 300,
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                marginTop: "40px",
            }}
        >
            <h2>Monthly Expenses</h2>

            <ResponsiveContainer>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="_id" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="total"
                        fill="#8884d8"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MonthlyExpensesChart;