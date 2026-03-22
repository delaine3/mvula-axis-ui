import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface SortingConfig {
  sortBy: string;
  direction: "asc" | "desc";
  onSort: (columnId: string) => void;
}

interface PaginationConfig {
  page: number;
  totalPages: number;
  size: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageSizeChange: (size: number) => void;
}

interface ColumnMeta {
  label?: string;
  sortable?: boolean;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  onRowClick?: (row: TData) => void;
  isLoading?: boolean;
  isError?: boolean;
  title?: string;
  emptyMessage?: string;
  sorting?: SortingConfig;
  pagination?: PaginationConfig;
}

export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  isError = false,
  title,
  emptyMessage = "No data found.",
  sorting,
  pagination,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div>
        {title && <h2>{title}</h2>}
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {title && <h2>{title}</h2>}
        <p>Failed to load data.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div>
        {title && <h2>{title}</h2>}
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | ColumnMeta
                  | undefined;
                const columnId = header.column.id;
                const isSortable = Boolean(sorting && meta?.sortable);

                return (
                  <th
                    key={header.id}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {header.isPlaceholder ? null : isSortable ? (
                      <button
                        type="button"
                        onClick={() => sorting?.onSort(columnId)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          font: "inherit",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {meta?.label ?? columnId}{" "}
                        {sorting?.sortBy === columnId
                          ? sorting.direction === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              style={{ cursor: onRowClick ? "pointer" : "default" }}
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
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
            onClick={pagination.onPreviousPage}
            disabled={pagination.page === 0}
          >
            Previous
          </button>

          <span>
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={pagination.onNextPage}
            disabled={pagination.page + 1 >= pagination.totalPages}
          >
            Next
          </button>

          <select
            value={pagination.size}
            onChange={(e) =>
              pagination.onPageSizeChange(Number(e.target.value))
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      )}
    </div>
  );
}
