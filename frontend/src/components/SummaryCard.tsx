type SummaryCardProps = {
    title: string;
    value: number;
};

function SummaryCard({
                         title,
                         value,
                     }: SummaryCardProps) {
    return (
        <div className="summary-card">
            <h3>{title}</h3>

            <p>${value}</p>
        </div>
    );
}

export default SummaryCard;