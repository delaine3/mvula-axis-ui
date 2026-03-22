import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/ordersApi";
import { OrderForm, type OrderFormValues } from "../components/OrderForm";

const emptyValues: OrderFormValues = {
  vendor: "",
  description: "",
  status: "PENDING",
  items: [{ productName: "", quantity: 1, unitPrice: 0 }],
};

export function CreateOrderPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <OrderForm
      mode="create"
      initialValues={emptyValues}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSubmit={async (values) => {
        try {
          setErrorMessage("");
          setIsSubmitting(true);

          await createOrder(values);
          navigate("/orders");
        } catch (error) {
          console.error("Failed to create order", error);
          setErrorMessage("Failed to create order");
        } finally {
          setIsSubmitting(false);
        }
      }}
    />
  );
}
