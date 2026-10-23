const variants = {
  primary: "btn btn-primary",
  secondary: "btn btn-light",
  text: "text-btn",
  icon: "icon-btn",
  danger: "icon-btn danger-text",
  logout: "logout-btn",
  destructive: "delete-appointment",
};

const sizes = {
  small: "btn-small",
  wide: "btn-wide",
};

export function Button({
  variant = "primary",
  size,
  className = "",
  type = "button",
  children,
  ...props
}) {
  const classes = [
    variants[variant] || variants.primary,
    size && sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
