import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getDisbursementById,
  getDisbursementPayments,
} from "../api/disbursementApi";
import { getPaymentColumns } from "../../columns/paymentColumns";
import { DataTable } from "../../../components/ui/DataTable";
import DetailGrid from "../../../components/ui/DetailGrid";
import DetailField from "../../../components/ui/DetailField";

export function DisbursementDetailsPage() {
  const { disbursementId } = useParams();
  const id = Number(disbursementId);

  const [paymentSortBy, setPaymentSortBy] = useState("datePaid");
  const [paymentSortDirection, setPaymentSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [paymentPage, setPaymentPage] = useState(0);
  const [paymentSize] = useState(10);

  const {
    data: disbursement,
    isLoading: isDisbursementLoading,
    isError: isDisbursementError,
  } = useQuery({
    queryKey: ["disbursement", id],
    queryFn: () => getDisbursementById(id),
    enabled: !!id,
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

  if (isDisbursementLoading) return <p>Loading disbursement...</p>;
  if (isDisbursementError) return <p>Failed to load disbursement.</p>;
  if (!disbursement) return <p>Disbursement not found.</p>;

  if (isPaymentsError) {
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
          <DetailGrid>
            <DetailField label="Payee Name" value={disbursement.payeeName} />
            <DetailField label="Payee Type" value={disbursement.payeeType} />
            <DetailField
              label="Service Description"
              value={disbursement.serviceDescription}
            />
            <DetailField label="Status" value={disbursement.status} />
            <DetailField
              label="Total Charged"
              value={`${disbursement.currency} ${Number(disbursement.totalCharged).toFixed(2)}`}
            />
            <DetailField
              label="Total Paid"
              value={`${disbursement.currency} ${Number(disbursement.totalPaid).toFixed(2)}`}
            />
            <DetailField
              label="Balance Outstanding"
              value={`${disbursement.currency} ${Number(disbursement.balanceOutstanding).toFixed(2)}`}
            />
            <DetailField label="Due Date" value={disbursement.dueDate ?? "-"} />
            <DetailField
              label="Installment"
              value={disbursement.isInstallment ? "Yes" : "No"}
            />
            <DetailField
              label="Installment Count"
              value={disbursement.installmentCount ?? "-"}
            />
            <DetailField
              label="Notes"
              value={disbursement.notes || "-"}
              fullWidth
            />
          </DetailGrid>
        </div>

        <p>Failed to load payments.</p>
      </section>
    );
  }

  const payments = paymentResponse?.content ?? [];
  const totalPaymentPages = paymentResponse?.totalPages ?? 0;

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
        <DetailGrid>
          <DetailField label="Payee Name" value={disbursement.payeeName} />
          <DetailField label="Payee Type" value={disbursement.payeeType} />
          <DetailField
            label="Service Description"
            value={disbursement.serviceDescription}
          />
          <DetailField label="Status" value={disbursement.status} />
          <DetailField
            label="Total Charged"
            value={`${disbursement.currency} ${Number(disbursement.totalCharged).toFixed(2)}`}
          />
          <DetailField
            label="Total Paid"
            value={`${disbursement.currency} ${Number(disbursement.totalPaid).toFixed(2)}`}
          />
          <DetailField
            label="Balance Outstanding"
            value={`${disbursement.currency} ${Number(disbursement.balanceOutstanding).toFixed(2)}`}
          />
          <DetailField label="Due Date" value={disbursement.dueDate ?? "-"} />
          <DetailField
            label="Installment"
            value={disbursement.isInstallment ? "Yes" : "No"}
          />
          <DetailField
            label="Installment Count"
            value={disbursement.installmentCount ?? "-"}
          />
          <DetailField
            label="Notes"
            value={disbursement.notes || "-"}
            fullWidth
          />
        </DetailGrid>
      </div>

      {isPaymentsLoading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
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
    </section>
  );
}
