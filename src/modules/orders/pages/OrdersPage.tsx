import { DataTable } from "../../../components/ui/DataTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, getOrders } from "../api/ordersApi";
import { getOrderColumns } from "../../columns/orderColumns";

export function OrdersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const search = params.get("search") ?? "";
  const sortBy = params.get("sortBy") ?? "id";
  const direction = (params.get("direction") ?? "desc") as "asc" | "desc";
  const page = Number(params.get("page") ?? 0);
  const size = Number(params.get("size") ?? 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, size, search, sortBy, direction],
    queryFn: () =>
      getOrders({
        page,
        size,
        search: search.trim() || undefined,
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

  const columns = getOrderColumns({
    onDelete: (id) => deleteMutation.mutate(id),
  });

  const updateParams = (updates: Record<string, string | number>) => {
    const next = new URLSearchParams(params);

    Object.entries(updates).forEach(([key, value]) => {
      const stringValue = String(value);

      if (stringValue.trim() === "") {
        next.delete(key);
      } else {
        next.set(key, stringValue);
      }
    });

    setParams(next);
  };

  function handleSort(columnId: string) {
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
  }

  function handlePreviousPage() {
    updateParams({
      page: Math.max(page - 1, 0),
    });
  }

  function handleNextPage() {
    updateParams({
      page: data && page + 1 < data.totalPages ? page + 1 : page,
    });
  }

  function handlePageSizeChange(nextSize: number) {
    updateParams({
      size: nextSize,
      page: 0,
    });
  }

  function handleCreateClick() {
    navigate("/orders/new");
  }

  return (
    <section style={{ padding: "1.5rem" }}>
      <DataTable
        title="Orders"
        data={data?.items ?? []}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No orders found."
        sorting={{
          sortBy,
          direction,
          onSort: handleSort,
        }}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
        search={{
          value: search,
          placeholder: "Search orders",
          onChange: (value) =>
            updateParams({
              search: value,
              page: 0,
            }),
        }}
        createAction={{
          label: "Create Order",
          onClick: handleCreateClick,
        }}
        pagination={{
          page: data?.page ?? 0,
          totalPages: data?.totalPages ?? 1,
          size,
          onPreviousPage: handlePreviousPage,
          onNextPage: handleNextPage,
          onPageSizeChange: handlePageSizeChange,
        }}
      />
    </section>
  );
}
