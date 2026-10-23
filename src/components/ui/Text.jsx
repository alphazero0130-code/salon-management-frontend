import { Colors } from "../../theme/colors";

export function Text({
  as: Element = "span",
  color,
  className,
  style,
  children,
  ...props
}) {
  return (
    <Element
      className={className}
      style={{
        ...style,
        ...(color && { color: Colors[color] || color }),
      }}
      {...props}
    >
      {children}
    </Element>
  );
}
