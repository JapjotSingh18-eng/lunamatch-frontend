// MetricCard.jsx

function MetricCard({
  title,
  value,
  suffix = "",
}) {
  const isUnavailable =
    value === null ||
    value === undefined ||
    value === "" ||
    value === "Not reliable";

  const displayValue =
    isUnavailable
      ? "Not reliable"
      : value;

  return (
    <div className="metric-card">
      <span>{title}</span>

      <strong>
        {displayValue}
        {!isUnavailable && suffix}
      </strong>
    </div>
  );
}

export default MetricCard;