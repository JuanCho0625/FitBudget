import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

type ExpensesPieChartProps = {
    labels: string[];
    values: number[];
};

function ExpensesPieChart({
                              labels,
                              values,
                          }: ExpensesPieChartProps) {
    const data = {
        labels,

        datasets: [
            {
                label: "Expenses",

                data: values,

                borderWidth: 1,
            },
        ],
    };

    return (
        <div
            style={{
                width: "400px",
                backgroundColor: "white",
                padding: "1rem",
                borderRadius: "10px",
            }}
        >
            <Pie data={data} />
        </div>
    );
}

export default ExpensesPieChart;