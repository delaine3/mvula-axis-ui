import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/DataTable";
import type { Order } from "../types/order";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, getOrders } from "../api/ordersApi";

export function OrdersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const search = params.get("search") ?? "";
  const sortBy = params.get("sortBy") ?? "id";
  const direction = params.get("direction") ?? "desc";
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, size, search, sortBy, direction],
    queryFn: () =>
      getOrders({
        page,
        size,
        search,
        sortBy,
        sortDir: direction,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateParams = (updates: Record<string, string | number>) => {
    const next = new URLSearchParams(params);

    Object.entries(updates).forEach(([key, value]) => {
      next.set(key, String(value));
    });

    setParams(next);
  };

  const handleSort = (columnId: string) => {
    if (sortBy === columnId) {
      updateParams({
        direction: direction === "asc" ? "desc" : "asc",
        page: 0,
      });
    } else {
      updateParams({
        sortBy: columnId,
        direction: "asc",
        page: 0,
      });
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { label: "ID", sortable: true },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      meta: { label: "Vendor", sortable: true },
    },
    {
      accessorKey: "description",
      header: "Description",
      meta: { label: "Description", sortable: true },
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: { label: "Status", sortable: true },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      meta: { label: "Total Amount", sortable: true },
    },
    {
      id: "actions",
      header: "Actions",
      meta: { label: "Actions", sortable: false },
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            to={`/orders/${row.original.id}/edit`}
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Link>

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
        </div>
      ),
    },
  ];

  return (
    <section>
      <h2>Orders</h2>

      <div style={{ marginBottom: "16px", display: "flex", gap: "12px" }}>
        <Link to="/orders/new">Create Order</Link>

        <input
          placeholder="Search orders"
          value={search}
          onChange={(e) =>
            updateParams({
              search: e.target.value,
              page: 0,
            })
          }
        />
      </div>

      <DataTable
        data={data?.items ?? []}
        columns={columns}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No orders found."
        sorting={{
          sortBy,
          direction: direction as "asc" | "desc",
          onSort: handleSort,
        }}
        pagination={{
          page: data?.page ?? 0,
          totalPages: data?.totalPages ?? 1,
          size,
          onPreviousPage: () => updateParams({ page: Math.max(page - 1, 0) }),
          onNextPage: () =>
            updateParams({
              page: data && page + 1 < data.totalPages ? page + 1 : page,
            }),
          onPageSizeChange: (nextSize) =>
            updateParams({ size: nextSize, page: 0 }),
        }}
      />
    </section>
  );
}
