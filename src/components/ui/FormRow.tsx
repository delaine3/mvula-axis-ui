type FormRowProps = {
  children: React.ReactNode;
};

export default function FormRow({ children }: FormRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
}
