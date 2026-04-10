import type { ColumnDef } from "@tanstack/react-table";

export interface Payment {
  id: number;
  datePaid: string;
  amountPaid: number;
  paymentMethod?: string | null;
  referenceNumber?: string | null;
  notes?: string | null;
}

interface PaymentColumnsProps {
  currency: string;
  onDelete?: (id: number) => void;
}

export function getPaymentColumns({
  currency,
}: PaymentColumnsProps): ColumnDef<Payment>[] {
  return [
    {
      accessorKey: "datePaid",
      header: "Date Paid",
      meta: { label: "Date Paid", sortable: true },
    },
    {
      accessorKey: "amountPaid",
      header: "Amount",
      meta: { label: "Amount", sortable: true },
      cell: ({ row }) =>
        `${currency} ${Number(row.original.amountPaid).toFixed(2)}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      meta: { label: "Method", sortable: true },
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference",
      meta: { label: "Reference", sortable: true },
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      accessorKey: "notes",
      header: "Notes",
      meta: { label: "Notes", sortable: true },
      cell: ({ getValue }) => getValue() || "-",
    },
  ];
}
