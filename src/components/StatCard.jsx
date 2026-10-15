function StatCard({ title, value, description }) {
  return (
    <div className="stat-card">
      <p>{title}</p>
      <h2>{value}</h2>
      <small>{description}</small>
    </div>
  );
}

export default StatCard;
