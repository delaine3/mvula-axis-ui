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

interface SearchConfig {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

interface CreateActionConfig {
  label?: string;
  onClick: () => void;
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
  search?: SearchConfig;
  createAction?: CreateActionConfig;
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
  search,
  createAction,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const showToolbar = Boolean(search || createAction);

  return (
    <div className="card">
      {title && <h2>{title}</h2>}

      {showToolbar && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {search ? (
            <input
              className="text-input"
              type="text"
              value={search.value}
              placeholder={search.placeholder ?? "Search"}
              onChange={(event) => search.onChange(event.target.value)}
            />
          ) : (
            <div />
          )}

          {createAction ? (
            <button
              className="button"
              type="button"
              onClick={createAction.onClick}
            >
              {createAction.label ?? "Create"}
            </button>
          ) : null}
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Failed to load data.</p>
      ) : data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <>
          <div style={{ backgroundColor: "#ccded3", padding: "4px" }}>
            <table
              style={{
                backgroundColor: "#ccded3",
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ backgroundColor: "#ccded3" }}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    style={{ backgroundColor: "#ccded3" }}
                    key={headerGroup.id}
                  >
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
                            backgroundColor: "#ccded3",
                            textAlign: "left",
                            padding: "12px",
                            borderBottom: "1px solid #ccded3",
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
                          borderBottom: "1px solid #e4ede8",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                className="button button-secondary"
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
                className="button button-secondary"
                type="button"
                onClick={pagination.onNextPage}
                disabled={pagination.page + 1 >= pagination.totalPages}
              >
                Next
              </button>

              <select
                className="select-input"
                value={pagination.size}
                onChange={(event) =>
                  pagination.onPageSizeChange(Number(event.target.value))
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}
