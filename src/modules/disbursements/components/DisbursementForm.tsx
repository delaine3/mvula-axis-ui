import { useState } from "react";
import type {
  CreateDisbursementRequest,
  DisbursementStatus,
  PayeeType,
} from "../types/disbursement";
import { Link } from "react-router-dom";

interface DisbursementFormProps {
  onSubmit: (payload: CreateDisbursementRequest) => Promise<void>;
  initialValues?: CreateDisbursementRequest;
  isSubmitting?: boolean;
  mode: "create" | "update";
  errorMessage: string;
}

const payeeTypes: PayeeType[] = [
  "EMPLOYEE",
  "CONTRACTOR",
  "SUPPLIER",
  "SERVICE_PROVIDER",
  "LANDLORD",
  "OTHER",
];

const defaultValues: CreateDisbursementRequest = {
  payeeName: "",
  payeeType: "CONTRACTOR",
  serviceDescription: "",
  totalCharged: 0,
  currency: "SZL",
  dueDate: "",
  isInstallment: false,
  installmentCount: undefined,
  notes: "",
  disbursementStatus: "",
};

export default function DisbursementForm({
  onSubmit,
  mode,
  initialValues,
  isSubmitting = false,
  errorMessage,
}: DisbursementFormProps) {
  const [form, setForm] = useState<CreateDisbursementRequest>(
    initialValues ?? defaultValues,
  );
  const pageTitle =
    mode === "create" ? "Create Disbursement" : "Update Disbursement";

  const [submitting, setSubmitting] = useState(false);
  const submitLabel = isSubmitting
    ? mode === "create"
      ? "Creating..."
      : "Saving..."
    : mode === "create"
      ? "Create Disbursement"
      : "Save Changes";
  const isInvalid = !form.totalCharged;
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        dueDate: form.dueDate || undefined,
        installmentCount: form.isInstallment
          ? form.installmentCount
          : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">{pageTitle}</h2>
        <Link to="/disbursements" className="button-link button-secondary">
          Back to Disbursements
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          {/* Payee Name */}
          <div className="form-field">
            <input
              className="floating-input"
              value={form.payeeName}
              onChange={(e) => setForm({ ...form, payeeName: e.target.value })}
              required
            />
            <label className="floating-label">Payee Name</label>
          </div>

          {/* Payee Type */}
          <div className="form-field select-wrapper">
            <select
              className="floating-select"
              value={form.payeeType}
              onChange={(e) =>
                setForm({
                  ...form,
                  payeeType: e.target.value as PayeeType,
                })
              }
            >
              {payeeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label className="floating-label">Payee Type</label>
          </div>

          {/* Service Description */}
          <div className="form-field">
            <input
              className="floating-input"
              value={form.serviceDescription}
              onChange={(e) =>
                setForm({
                  ...form,
                  serviceDescription: e.target.value,
                })
              }
              required
            />
            <label className="floating-label">Service Description</label>
          </div>

          {/* Total Charged */}
          <div className="form-field">
            <input
              className="floating-input"
              type="number"
              step="0.01"
              value={form.totalCharged}
              onChange={(e) =>
                setForm({
                  ...form,
                  totalCharged: Number(e.target.value),
                })
              }
              required
            />
            <label className="floating-label">Total Charged</label>
          </div>

          {/* Currency */}
          <div className="form-field">
            <input
              className="floating-input"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            />
            <label className="floating-label">Currency</label>
          </div>

          {/* Due Date */}
          <div className="form-field">
            <input
              className="floating-input"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <label className="floating-label">Due Date</label>
          </div>
          {/* Notes */}
          <div className="form-field form-field-full">
            <textarea
              id="notes"
              className="floating-input"
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
            <label htmlFor="notes" className="floating-label">
              Notes
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              className="button"
              type="submit"
              disabled={isSubmitting || isInvalid}
            >
              {submitLabel}
            </button>

            {errorMessage && <p className="muted-text">{errorMessage}</p>}
          </div>
        </div>
      </form>
    </section>
  );
}
