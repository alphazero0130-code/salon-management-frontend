import { Text } from "./ui/Text";

export function PersonCell({ name, detail }) {
  const displayName = name || "Unknown user";

  return (
    <div className="person-cell">
      <span className="person-avatar">
        {displayName.slice(0, 1).toUpperCase()}
      </span>
      <div>
        <Text as="strong">{displayName}</Text>
        {detail && <Text as="small">{detail}</Text>}
      </div>
    </div>
  );
}
