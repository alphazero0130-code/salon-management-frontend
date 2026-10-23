export function PersonCell({ name, detail }) {
  const displayName = name || "Unknown user";

  return (
    <div className="person-cell">
      <span className="person-avatar">
        {displayName.slice(0, 1).toUpperCase()}
      </span>
      <div>
        <strong>{displayName}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}
