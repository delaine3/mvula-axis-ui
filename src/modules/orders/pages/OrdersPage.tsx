import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getOrders } from "../api/ordersApi";
import { DataTable } from "../../../components/ui/DataTable";
import type { Order } from "../types/order";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function OrdersPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
    },
  ];

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders</p>;

  return (
    <section>
      <h2>Orders</h2>
      <div style={{ marginBottom: "16px" }}>
        <Link to="/orders/new">Create Order</Link>
      </div>
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
      />{" "}
    </section>
  );
}
