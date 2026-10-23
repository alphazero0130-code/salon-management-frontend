import { useId } from "react";
import { Button } from "./ui/Button";
import { Text } from "./ui/Text";

export function Modal({
  eyebrow,
  title,
  subtitle,
  subtitleClassName = "muted",
  onClose,
  onSubmit,
  children,
}) {
  const titleId = useId();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            {eyebrow && (
              <Text as="p" className="eyebrow">
                {eyebrow}
              </Text>
            )}
            <Text as="h2" id={titleId}>
              {title}
            </Text>
            {subtitle && (
              <Text as="p" className={subtitleClassName}>
                {subtitle}
              </Text>
            )}
          </div>
          <Button
            variant="icon"
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        {children}
      </form>
    </div>
  );
}
