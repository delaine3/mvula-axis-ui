import { useQuery } from "@tanstack/react-query";
import { type ColumnDef } from "@tanstack/react-table";
import { getOrders } from "../api/ordersApi";
import { DataTable } from "../../../components/ui/DataTable";
import type { Order } from "../types/order";

export function OrdersPage() {
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

      <DataTable data={data?.items ?? []} columns={columns} />
    </section>
  );
}
