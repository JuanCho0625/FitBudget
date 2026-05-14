type SummaryCardProps = {
    title: string;
    value: number;
    accent?: string;
    prefix?: string;
};

function SummaryCard({ title, value, accent, prefix = "$" }: SummaryCardProps) {
    const isNegative = value < 0;
    const formatted = Math.abs(value).toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div
            className="summary-card"
            style={{ "--accent": accent } as React.CSSProperties}
        >
            <h3>{title}</h3>
            <p style={{ color: isNegative ? "var(--danger)" : "var(--text-1)" }}>
                {isNegative ? "-" : ""}{prefix}{formatted}
            </p>
        </div>
    );
}

export default SummaryCard;
