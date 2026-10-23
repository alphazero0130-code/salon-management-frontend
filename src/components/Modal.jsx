import { useId } from "react";

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
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
      </form>
    </div>
  );
}
