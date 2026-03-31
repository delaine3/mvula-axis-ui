import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Order } from "../orders/types/order";

interface OrderColumnsProps {
  onDelete: (id: number) => void;
}

export function getOrderColumns({
  onDelete,
}: OrderColumnsProps): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order #",
      meta: { label: "Order#", sortable: true },
    },
    {
      accessorKey: "vendorName",
      header: "Vendor",
      meta: { label: "Vendor", sortable: true },
    },
    {
      accessorKey: "description",
      header: "Description",
      meta: { label: "Description", sortable: true },
    },
    {
      accessorKey: "createdAt",
      header: "Create Date",
      meta: { label: "Create Date", sortable: true },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated Date",
      meta: { label: "Updated Date", sortable: true },
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
            className="icon-button icon-button-update"
            to={`/orders/${row.original.id}/update`}
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil size={18} />
          </Link>

          <button
            type="button"
            className="icon-button icon-button-delete"
            onClick={(e) => {
              e.stopPropagation();

              const confirmed = window.confirm(
                `Delete order ${row.original.id}?`,
              );
              if (!confirmed) return;

              onDelete(row.original.id);
            }}
            title="Delete order"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];
}
