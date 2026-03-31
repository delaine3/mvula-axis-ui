import type { ChangeEvent } from "react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface FloatingSelectProps<T extends string> {
  id: string;
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholderOption?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function FloatingSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholderOption,
  disabled = false,
  required = false,
  className = "",
}: FloatingSelectProps<T>) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value as T);
  }

  return (
    <div className={`form-field select-wrapper ${className}`.trim()}>
      <select
        id={id}
        className="floating-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
      >
        {placeholderOption ? (
          <option value="" disabled>
            {placeholderOption}
          </option>
        ) : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor={id} className="floating-label">
        {label}
      </label>
    </div>
  );
}
