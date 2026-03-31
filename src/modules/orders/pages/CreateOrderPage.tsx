import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createOrder } from "../api/ordersApi";
import { OrderForm, type OrderFormValues } from "../components/OrderForm";
import { getVendors } from "../../vendors/api/vendorsApi";

export function CreateOrderPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const initialValues: OrderFormValues = {
    useNewVendor: false,
    isPaid: false,
    vendorId: "",
    newVendor: {
      name: "",
      category: "",
      isActive: true,
      website: "",
      taxNumber: "",
      address: {
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateOrProvince: "",
        postalCode: "",
        country: "Eswatini",
      },
      offersDelivery: false,
      contactPerson: "",
      contactNumber: "",
      email: "",
      notes: "",
      paymentTerms: "",
      preferredCurrency: "SZL",
    },
    description: "",
    status: "PENDING",
    items: [{ productName: "", quantity: 1, unitPrice: 0 }],
  };

  return (
    <OrderForm
      mode="create"
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      vendors={vendors}
      onSubmit={async (values) => {
        try {
          setErrorMessage("");
          setIsSubmitting(true);

          await createOrder({
            vendorId: values.useNewVendor ? undefined : Number(values.vendorId),
            newVendor: values.useNewVendor ? values.newVendor : undefined,
            isPaid: Boolean(values.isPaid),
            description: values.description,
            status: values.status,
            items: values.items,
          });

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
