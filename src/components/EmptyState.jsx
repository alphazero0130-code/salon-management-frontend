export function EmptyState({ icon = "⌕", title, description, children }) {
  return (
    <div className="empty-state">
      <span>{icon}</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}
