type ToggleFieldProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
};

export default function ToggleField({
  label,
  value,
  onChange,
  trueLabel = "Yes",
  falseLabel = "No",
}: ToggleFieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <div className="toggle-group" role="group" aria-label={label}>
        <button
          type="button"
          className={`toggle-option ${!value ? "toggle-option--active" : ""}`}
          onClick={() => onChange(false)}
        >
          {falseLabel}
        </button>

        <button
          type="button"
          className={`toggle-option ${value ? "toggle-option--active" : ""}`}
          onClick={() => onChange(true)}
        >
          {trueLabel}
        </button>
      </div>
    </div>
  );
}
