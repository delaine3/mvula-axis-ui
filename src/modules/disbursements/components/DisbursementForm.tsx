import { useState } from "react";
import type {
  CreateDisbursementRequest,
  PayeeType,
} from "../types/disbursement";
import { Link } from "react-router-dom";
import { FloatingSelect } from "../../../components/ui/FloatingSelect";
import FloatingInput from "../../../components/ui/FloatingInput";

interface DisbursementFormProps {
  onSubmit: (payload: CreateDisbursementRequest) => Promise<void>;
  initialValues?: CreateDisbursementRequest;
  isSubmitting?: boolean;
  mode: "create" | "update";
  errorMessage: string;
}

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

const payeeTypeOptions = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "CONTRACTOR", label: "Contractor" },
  { value: "SUPPLIER", label: "Supplier" },
  { value: "SERVICE_PROVIDER", label: "Service Provider" },
  { value: "LANDLORD", label: "Landlord" },
  { value: "OTHER", label: "Other" },
] satisfies { value: PayeeType; label: string }[];

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

  const submitLabel =
    isSubmitting || submitting
      ? mode === "create"
        ? "Creating..."
        : "Saving..."
      : mode === "create"
        ? "Create Disbursement"
        : "Save Changes";

  const isInvalid =
    !form.payeeName.trim() ||
    !form.serviceDescription.trim() ||
    !form.totalCharged;

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
          <FloatingInput
            id="payee-name"
            label="Payee Name"
            value={form.payeeName}
            onChange={(value) => setForm({ ...form, payeeName: value })}
            required
          />

          <FloatingSelect<PayeeType>
            id="payee-type"
            label="Payee Type"
            value={form.payeeType}
            options={payeeTypeOptions}
            onChange={(value) =>
              setForm({
                ...form,
                payeeType: value,
              })
            }
          />

          <FloatingInput
            id="service-description"
            label="Service Description"
            value={form.serviceDescription}
            onChange={(value) =>
              setForm({
                ...form,
                serviceDescription: value,
              })
            }
            required
          />

          <FloatingInput
            id="total-charged"
            label="Total Charged"
            type="number"
            value={String(form.totalCharged)}
            onChange={(value) =>
              setForm({
                ...form,
                totalCharged: Number(value),
              })
            }
            required
          />

          <FloatingInput
            id="currency"
            label="Currency"
            value={form.currency}
            onChange={(value) => setForm({ ...form, currency: value })}
          />

          <FloatingInput
            id="due-date"
            label="Due Date"
            type="date"
            value={form.dueDate ?? ""}
            onChange={(value) => setForm({ ...form, dueDate: value })}
          />

          <div className="form-field form-field-full">
            <FloatingInput
              id="notes"
              label="Notes"
              value={form.notes ?? ""}
              onChange={(value) => setForm({ ...form, notes: value })}
              multiline
            />
          </div>
        </div>

        <div className="form-actions">
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              className="button"
              type="submit"
              disabled={isSubmitting || submitting || isInvalid}
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
