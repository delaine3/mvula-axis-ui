import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDisbursementPayment,
  getDisbursementById,
  updateDisbursement,
} from "../api/disbursementApi";
import DisbursementForm from "../components/DisbursementForm";
import type {
  CreateDisbursementPaymentRequest,
  CreateDisbursementRequest,
} from "../types/disbursement";
import DisbursementPaymentForm from "../components/DisbursementPaymentForm";

export function UpdateDisbursementPage() {
  const { disbursementId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
  const id = Number(disbursementId);

  const {
    data: disbursement,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["disbursement", id],
    queryFn: () => getDisbursementById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading disbursement...</p>;
  if (isError) return <p>Failed to load disbursement</p>;
  if (!disbursement) return <p>Disbursement not found</p>;

  const initialValues: CreateDisbursementRequest = {
    payeeName: disbursement.payeeName,
    payeeType: disbursement.payeeType,
    serviceDescription: disbursement.serviceDescription,
    totalCharged: disbursement.totalCharged,
    currency: disbursement.currency,
    dueDate: disbursement.dueDate ?? "",
    notes: disbursement.notes ?? "",
    isInstallment: false,
    disbursementStatus: "",
  };
  return (
    <section className="vertical-form">
      <DisbursementForm
        mode="update"
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={async (values) => {
          try {
            setErrorMessage("");
            setIsSubmitting(true);

            await updateDisbursement(id, values);

            navigate("/disbursements");
          } catch (error) {
            console.error("Failed to update disbursement", error);
            setErrorMessage("Failed to update disbursement");
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
      <DisbursementPaymentForm
        isSubmitting={isSubmittingPayment}
        errorMessage={paymentErrorMessage}
        onSubmit={async (payload: CreateDisbursementPaymentRequest) => {
          try {
            setPaymentErrorMessage("");
            setIsSubmittingPayment(true);

            await addDisbursementPayment(id, payload);

            await refetch();
            await queryClient.invalidateQueries({
              queryKey: ["disbursements"],
            });
          } catch (error) {
            console.error("Failed to add payment", error);
            setPaymentErrorMessage("Failed to add payment");
          } finally {
            setIsSubmittingPayment(false);
          }
        }}
      />
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
