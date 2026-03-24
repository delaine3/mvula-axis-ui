import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders, updateOrder } from "../api/ordersApi";
import { OrderForm, type OrderFormValues } from "../components/OrderForm";
import { getVendors } from "../../vendors/api/vendorsApi";

export function EditOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: getVendors,
  });

  const order = data?.items.find((o) => o.id === Number(orderId));

  if (isLoading) return <p>Loading order...</p>;
  if (isError) return <p>Failed to load order</p>;
  if (!order) return <p>Order not found</p>;

  const initialValues: OrderFormValues = {
    useNewVendor: false,
    isPaid: false,
    vendorId: String(order.vendorId),
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
    description: order.description,
    status: order.status,
    items:
      order.items.length > 0
        ? order.items.map((item) => ({
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }))
        : [{ productName: "", quantity: 1, unitPrice: 0 }],
  };

  return (
    <OrderForm
      mode="edit"
      initialValues={initialValues}
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      vendors={vendors}
      onSubmit={async (values) => {
        try {
          setErrorMessage("");
          setIsSubmitting(true);

          await updateOrder(order.id, {
            vendorId: Number(values.vendorId),
            isPaid: Boolean(values.isPaid),
            description: values.description,
            status: values.status,
            items: values.items,
          });

          navigate("/orders");
        } catch (error) {
          console.error("Failed to update order", error);
          setErrorMessage("Failed to update order");
        } finally {
          setIsSubmitting(false);
        }
      }}
    />
  );
}
