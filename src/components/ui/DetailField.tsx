type DetailFieldProps = {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
};

export default function DetailField({
  label,
  value,
  fullWidth = false,
}: DetailFieldProps) {
  return (
    <div className={`form-field ${fullWidth ? "form-field-full" : ""}`}>
      <label className="form-label">{label}</label>
      <p>{value}</p>
    </div>
  );
}
