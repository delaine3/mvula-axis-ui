import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDisbursementById } from "../api/disbursementApi";
import { getPaymentColumns } from "../../columns/paymentColumns";
import { DataTable } from "../../../components/ui/DataTable";
import DetailGrid from "../../../components/ui/DetailGrid";
import DetailField from "../../../components/ui/DetailField";
import { useMemo, useState } from "react";

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
  const paymentColumns = getPaymentColumns({
    currency: disbursement.currency,
  });
  const [paymentSortBy, setPaymentSortBy] = useState("paymentDate");
  const [paymentSortDirection, setPaymentSortDirection] = useState<
    "asc" | "desc"
  >("desc");

  function handlePaymentSort(columnId: string) {
    const nextDirection: "asc" | "desc" =
      paymentSortBy === columnId && paymentSortDirection === "asc"
        ? "desc"
        : "asc";

    setPaymentSortBy(columnId);
    setPaymentSortDirection(nextDirection);
  }

  function handleUndoPayment(paymentId: number) {
    console.log("Undo payment:", paymentId);
    // later this can call your mutation, for example:
    // undoPaymentMutation.mutate(paymentId);
  }

  const sortedPayments = useMemo(() => {
    if (!disbursement?.payments) return [];

    return [...disbursement.payments].sort((a, b) => {
      const aValue = a[paymentSortBy as keyof typeof a];
      const bValue = b[paymentSortBy as keyof typeof b];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // date handling
      if (
        paymentSortBy === "paymentDate" ||
        paymentSortBy.toLowerCase().includes("date")
      ) {
        const aTime = new Date(String(aValue)).getTime();
        const bTime = new Date(String(bValue)).getTime();

        if (aTime < bTime) return paymentSortDirection === "asc" ? -1 : 1;
        if (aTime > bTime) return paymentSortDirection === "asc" ? 1 : -1;
        return 0;
      }

      // number handling
      if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue < bValue) return paymentSortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return paymentSortDirection === "asc" ? 1 : -1;
        return 0;
      }

      // string/default handling
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return paymentSortDirection === "asc" ? -1 : 1;
      if (aString > bString) return paymentSortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [disbursement?.payments, paymentSortBy, paymentSortDirection]);

  return (
    <section className="page-container ">
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
      {disbursement.payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <DataTable
          title="Payments"
          data={sortedPayments}
          columns={paymentColumns}
          emptyMessage="No payments recorded."
          sorting={{
            sortBy: paymentSortBy,
            direction: paymentSortDirection,
            onSort: handlePaymentSort,
          }}
        />
      )}
    </section>
  );
}
