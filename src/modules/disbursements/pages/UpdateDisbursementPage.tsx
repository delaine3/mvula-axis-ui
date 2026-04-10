import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDisbursementPayment,
  getDisbursementById,
  getDisbursementPayments,
  updateDisbursement,
} from "../api/disbursementApi";
import DisbursementForm from "../components/DisbursementForm";
import type {
  CreateDisbursementPaymentRequest,
  CreateDisbursementRequest,
} from "../types/disbursement";
import DisbursementPaymentForm from "../components/DisbursementPaymentForm";
import { DataTable } from "../../../components/ui/DataTable";
import { getPaymentColumns } from "../../columns/paymentColumns";

export function UpdateDisbursementPage() {
  const { disbursementId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [paymentSortBy, setPaymentSortBy] = useState("datePaid");
  const [paymentSortDirection, setPaymentSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentSize] = useState(10);
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
  function handlePaymentSort(columnId: string) {
    const nextDirection: "asc" | "desc" =
      paymentSortBy === columnId && paymentSortDirection === "asc"
        ? "desc"
        : "asc";

    setPaymentSortBy(columnId);
    setPaymentSortDirection(nextDirection);
    setPaymentPage(0);
  }
  const paymentColumns = getPaymentColumns({
    currency: disbursement?.currency ?? "SZL",
  });
  const {
    data: paymentResponse,
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useQuery({
    queryKey: [
      "disbursement-payments",
      id,
      paymentPage,
      paymentSize,
      paymentSortBy,
      paymentSortDirection,
    ],
    queryFn: () =>
      getDisbursementPayments({
        disbursementId: id,
        page: paymentPage,
        size: paymentSize,
        sortBy: paymentSortBy,
        direction: paymentSortDirection,
      }),
    enabled: !!id,
  });
  const payments = paymentResponse?.content ?? [];
  const totalPaymentPages = paymentResponse?.totalPages ?? 0;
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
          <>
            <DataTable
              title="Payments"
              data={payments}
              columns={paymentColumns}
              emptyMessage="No payments recorded."
              sorting={{
                sortBy: paymentSortBy,
                direction: paymentSortDirection,
                onSort: handlePaymentSort,
              }}
            />

            <div className="table-pagination">
              <button
                type="button"
                onClick={() => setPaymentPage((prev) => Math.max(prev - 1, 0))}
                disabled={paymentPage === 0}
              >
                Previous
              </button>

              <span>
                Page {paymentPage + 1} of {Math.max(totalPaymentPages, 1)}
              </span>

              <button
                type="button"
                onClick={() =>
                  setPaymentPage((prev) =>
                    prev + 1 < totalPaymentPages ? prev + 1 : prev,
                  )
                }
                disabled={paymentPage + 1 >= totalPaymentPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
