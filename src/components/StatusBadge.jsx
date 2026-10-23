import { Text } from "./ui/Text";

export function StatusBadge({ status, children = status, className = "" }) {
  return (
    <Text as="span" className={`status status-${status} ${className}`.trim()}>
      {children}
    </Text>
  );
}
