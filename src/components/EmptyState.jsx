import { Text } from "./ui/Text";

export function EmptyState({ icon = "⌕", title, description, children }) {
  return (
    <div className="empty-state">
      <Text as="span">{icon}</Text>
      <Text as="strong">{title}</Text>
      {description && <Text as="p">{description}</Text>}
      {children}
    </div>
  );
}
