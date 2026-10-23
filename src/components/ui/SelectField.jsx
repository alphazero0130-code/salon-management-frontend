export function SelectField({ className = "", children, ...props }) {
  return (
    <select className={className} {...props}>
      {children}
    </select>
  );
}
