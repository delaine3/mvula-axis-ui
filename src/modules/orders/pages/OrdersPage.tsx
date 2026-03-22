import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/DataTable";
import type { Order } from "../types/order";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, getOrders } from "../api/ordersApi";
import { useState } from "react";

export function OrdersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, size, search, sortBy, direction],
    queryFn: () =>
      getOrders({
        page,
        size,
        search,
        sortBy,
        direction,
      }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const confirmed = window.confirm(
              `Delete order ${row.original.id}?`,
            );
            if (!confirmed) return;
            deleteMutation.mutate(row.original.id);
          }}
        >
          Delete
        </button>
      ),
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
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <input
          placeholder="Search orders"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">ID</option>
          <option value="vendor">Vendor</option>
          <option value="description">Description</option>
          <option value="status">Status</option>
          <option value="totalAmount">Total Amount</option>
          <option value="createdAt">Created At</option>
        </select>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
      />
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "16px",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </button>

        <span>
          Page {data?.page !== undefined ? data.page + 1 : 1} of{" "}
          {data?.totalPages ?? 1}
        </span>

        <button
          type="button"
          onClick={() =>
            setPage((prev) =>
              data && prev + 1 < data.totalPages ? prev + 1 : prev,
            )
          }
          disabled={!data || page + 1 >= data.totalPages}
        >
          Next
        </button>

        <select
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>{" "}
    </section>
  );
}
