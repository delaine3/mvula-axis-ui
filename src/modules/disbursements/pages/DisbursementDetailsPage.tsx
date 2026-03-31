import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDisbursementById } from "../api/disbursementApi";

export function DisbursementDetailsPage() {
  const { disbursementId } = useParams();
  const id = Number(disbursementId);

  const {
    data: disbursement,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["disbursement", id],
    queryFn: () => getDisbursementById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading disbursement...</p>;
  if (isError) return <p>Failed to load disbursement</p>;
  if (!disbursement) return <p>Disbursement not found</p>;

  return (
    <section className="page-container">
      <div className="page-header">
        <h2 className="page-title">Disbursement Details</h2>
        <Link
          to={`/disbursements/${disbursement.id}/update`}
          className="button-link"
        >
          Update Disbursement
        </Link>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">Payee Name</label>
            <p>{disbursement.payeeName}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Payee Type</label>
            <p>{disbursement.payeeType}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Service Description</label>
            <p>{disbursement.serviceDescription}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Status</label>
            <p>{disbursement.status}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Total Charged</label>
            <p>
              {disbursement.currency}{" "}
              {Number(disbursement.totalCharged).toFixed(2)}
            </p>
          </div>

          <div className="form-field">
            <label className="form-label">Total Paid</label>
            <p>
              {disbursement.currency}{" "}
              {Number(disbursement.totalPaid).toFixed(2)}
            </p>
          </div>

          <div className="form-field">
            <label className="form-label">Balance Outstanding</label>
            <p>
              {disbursement.currency}{" "}
              {Number(disbursement.balanceOutstanding).toFixed(2)}
            </p>
          </div>

          <div className="form-field">
            <label className="form-label">Due Date</label>
            <p>{disbursement.dueDate ?? "-"}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Installment</label>
            <p>{disbursement.isInstallment ? "Yes" : "No"}</p>
          </div>

          <div className="form-field">
            <label className="form-label">Installment Count</label>
            <p>{disbursement.installmentCount ?? "-"}</p>
          </div>

          <div className="form-field form-field-full">
            <label className="form-label">Notes</label>
            <p>{disbursement.notes || "-"}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3>Payments</h3>

        {disbursement.payments.length === 0 ? (
          <p>No payments recorded yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Date Paid
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Amount</th>
                <th style={{ textAlign: "left", padding: "12px" }}>Method</th>
                <th style={{ textAlign: "left", padding: "12px" }}>
                  Reference
                </th>
                <th style={{ textAlign: "left", padding: "12px" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {disbursement.payments.map((payment) => (
                <tr key={payment.id}>
                  <td style={{ padding: "12px" }}>{payment.datePaid}</td>
                  <td style={{ padding: "12px" }}>
                    {disbursement.currency}{" "}
                    {Number(payment.amountPaid).toFixed(2)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {payment.paymentMethod || "-"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {payment.referenceNumber || "-"}
                  </td>
                  <td style={{ padding: "12px" }}>{payment.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
