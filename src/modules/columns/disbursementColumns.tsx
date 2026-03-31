import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Disbursement } from "../disbursements/types/disbursement";

interface DisbursementColumnsProps {
  onDelete: (id: number) => void;
}

export function getDisbursementColumns({
  onDelete,
}: DisbursementColumnsProps): ColumnDef<Disbursement>[] {
  return [
    {
      accessorKey: "payeeName",
      header: "Payee",
      meta: { label: "Payee", sortable: true },
    },
    {
      accessorKey: "payeeType",
      header: "Type",
      meta: { label: "Type", sortable: true },
    },
    {
      accessorKey: "serviceDescription",
      header: "Service",
      meta: { label: "Service", sortable: true },
    },
    {
      accessorKey: "totalCharged",
      header: "Total",
      cell: ({ row }) =>
        `${row.original.currency} ${Number(row.original.totalCharged).toFixed(2)}`,
      meta: { label: "Total", sortable: true },
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: { label: "Status", sortable: true },
    },
    {
      id: "actions",
      header: "Actions",
      meta: { label: "Actions", sortable: false },
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            className="icon-button icon-button-update"
            to={`/disbursements/${row.original.id}/update`}
            onClick={(event) => event.stopPropagation()}
          >
            <Pencil size={18} />
          </Link>

          <button
            type="button"
            className="icon-button icon-button-delete"
            onClick={(event) => {
              event.stopPropagation();

              const confirmed = window.confirm(
                `Delete disbursement ${row.original.id}?`,
              );
              if (!confirmed) return;

              onDelete(row.original.id);
            }}
            title="Delete disbursement"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];
}
