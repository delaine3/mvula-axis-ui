import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/ordersApi";

export function OrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders</p>;

  return (
    <section>
      <h2>Orders</h2>

      <ul>
        {data?.items.map((order) => (
          <li key={order.id}>
            {order.vendor} — {order.totalAmount}
          </li>
        ))}
      </ul>
    </section>
  );
}
