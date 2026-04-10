type DetailGridProps = {
  children: React.ReactNode;
};

export default function DetailGrid({ children }: DetailGridProps) {
  return <div className="form-grid">{children}</div>;
}
