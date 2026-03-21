import { useParams } from "react-router-dom";

export function OrderDetailsPage() {
  const { orderId } = useParams();

  return (
    <section>
      <h2>Order Details</h2>
      <p>Viewing order: {orderId}</p>
    </section>
  );
}
