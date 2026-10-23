
import { SelectField } from "./ui/SelectField";
import { Text } from "./ui/Text";
import { TextAreaField } from "./ui/TextAreaField";
import { TextField } from "./ui/TextField";

export function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  min,
  max,
  minLength,
  options,
  disabled = false,
  multiline = false,
  className = "",
}) {
  return (
    <label className={`field ${className}`.trim()}>
      <Text as="span">
        {label}
        {required && <i> *</i>}
      </Text>
      {options ? (
        <SelectField
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </SelectField>
      ) : multiline ? (
        <TextAreaField
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          disabled={disabled}
        />
      ) : (
        <TextField
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
          minLength={minLength}
          disabled={disabled}
        />
      )}
    </label>
  );
}
