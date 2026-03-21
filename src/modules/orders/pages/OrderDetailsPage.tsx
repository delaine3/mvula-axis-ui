import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";

export function OrderDetailsPage() {
  const { orderId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  if (isLoading) return <p>Loading order...</p>;
  if (isError) return <p>Failed to load order</p>;

  const order = data?.items.find((o) => o.id === Number(orderId));

  if (!order) return <p>Order not found</p>;

  return (
    <section>
      <h2>Order {order.id}</h2>

      <p>
        <strong>Vendor:</strong> {order.vendor}
      </p>
      <p>
        <strong>Description:</strong> {order.description}
      </p>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Total: E</strong>
        {order.totalAmount}
      </p>

      <h3>Items</h3>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.productName} — {item.quantity} × {item.unitPrice}
          </li>
        ))}
      </ul>
    </section>
  );
}
