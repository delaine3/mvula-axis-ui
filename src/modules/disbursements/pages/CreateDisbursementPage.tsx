import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDisbursement } from "../api/disbursementApi";
import type { CreateDisbursementRequest } from "../types/disbursement";
import DisbursementForm from "../components/DisbursementForm";

export function CreateDisbursementPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(payload: CreateDisbursementRequest) {
    try {
      setErrorMessage("");
      setIsSubmitting(true);

      await createDisbursement(payload);

      navigate("/disbursements");
    } catch (error) {
      console.error("Failed to create disbursement", error);
      setErrorMessage("Failed to create disbursement");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-container">
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <DisbursementForm
        onSubmit={handleSubmit}
        mode={"create"}
        errorMessage={""}
      />
    </section>
  );
}
