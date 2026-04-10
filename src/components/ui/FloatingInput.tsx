type FloatingInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
};

export default function FloatingInput({
  id,
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  multiline = false,
}: FloatingInputProps) {
  return (
    <div className="form-field">
      {multiline ? (
        <textarea
          id={id}
          className="floating-input"
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="floating-input"
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
        />
      )}
      <label htmlFor={id} className="floating-label">
        {label}
      </label>
    </div>
  );
}
