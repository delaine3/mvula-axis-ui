import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getDisbursementById,
  updateDisbursement,
} from "../api/disbursementApi";
import DisbursementForm from "../components/DisbursementForm";
import type { CreateDisbursementRequest } from "../types/disbursement";

export function UpdateDisbursementPage() {
  const { disbursementId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const initialValues: CreateDisbursementRequest = {
    payeeName: disbursement.payeeName,
    payeeType: disbursement.payeeType,
    serviceDescription: disbursement.serviceDescription,
    totalCharged: disbursement.totalCharged,
    currency: disbursement.currency,
    dueDate: disbursement.dueDate ?? "",
    isInstallment: disbursement.isInstallment,
    installmentCount: disbursement.installmentCount ?? undefined,
    notes: disbursement.notes ?? "",
    disbursementStatus: disbursement.status,
  };
  return (
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
  );
}
