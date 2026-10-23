
import { Button } from "./ui/Button";
import { Text } from "./ui/Text";

export function PageState({ loading, error, onRetry }) {
  if (loading)
    return (
      <div className="state-card">
        <div className="spinner" />
        <Text as="p">Loading your salon data…</Text>
      </div>
    );
  if (error)
    return (
      <div className="state-card">
        <div className="state-icon">!</div>
        <Text as="h3">Couldn’t load this data</Text>
        <Text as="p">{error}</Text>
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  return null;
}
