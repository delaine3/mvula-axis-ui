import { useState } from "react";
import type { CreateDisbursementPaymentRequest } from "../types/disbursement";

interface DisbursementPaymentFormProps {
  onSubmit: (payload: CreateDisbursementPaymentRequest) => Promise<void>;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const defaultValues: CreateDisbursementPaymentRequest = {
  datePaid: "",
  amountPaid: 0,
  paymentMethod: "",
  notes: "",
};

export default function DisbursementPaymentForm({
  onSubmit,
  isSubmitting = false,
  errorMessage = "",
}: DisbursementPaymentFormProps) {
  const [form, setForm] =
    useState<CreateDisbursementPaymentRequest>(defaultValues);

  const isInvalid = !form.datePaid || !form.amountPaid || form.amountPaid <= 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      ...form,
      paymentMethod: form.paymentMethod?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    });

    setForm(defaultValues);
  }

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-grid">
        <div className="form-field">
          <input
            className="floating-input"
            type="date"
            value={form.datePaid}
            onChange={(e) => setForm({ ...form, datePaid: e.target.value })}
            required
          />
          <label className="floating-label">Date Paid</label>
        </div>

        <div className="form-field">
          <input
            className="floating-input"
            type="number"
            step="0.01"
            value={form.amountPaid}
            onChange={(e) =>
              setForm({ ...form, amountPaid: Number(e.target.value) })
            }
            required
          />
          <label className="floating-label">Amount Paid</label>
        </div>

        <div className="form-field">
          <input
            className="floating-input"
            value={form.paymentMethod ?? ""}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
          />
          <label className="floating-label">Payment Method</label>
        </div>

        <div className="form-field form-field-full">
          <textarea
            className="floating-input"
            rows={4}
            value={form.notes ?? ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <label className="floating-label">Notes</label>
        </div>
      </div>

      <div className="form-actions">
        <button
          className="button"
          type="submit"
          disabled={isSubmitting || isInvalid}
        >
          {isSubmitting ? "Adding..." : "Add Payment"}
        </button>
        {errorMessage && <p className="muted-text">{errorMessage}</p>}
      </div>
    </form>
  );
}
