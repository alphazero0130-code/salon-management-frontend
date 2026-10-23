export function StatusBadge({ status, children = status, className = "" }) {
  return (
    <span className={`status status-${status} ${className}`.trim()}>
      {children}
    </span>
  );
}
