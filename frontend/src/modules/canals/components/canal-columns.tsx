import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/modules/admin/components/data-table"
import { CanalSummary } from "@/modules/canals"
import { CanalActionsCell } from '@/modules/canals/components/canal-column-actions.tsx';

const columnHelper = createColumnHelper<CanalSummary>()

export const canalColumns: ColumnDef<CanalSummary, any>[] = [
  columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: (info) => (
      <span className="font-mono text-xs text-muted-foreground">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("number", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Numéro" />
    ),
    cell: (info) => (
      <span className="font-semibold text-base">
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground max-w-md truncate block">
        {info.getValue() || "—"}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <CanalActionsCell canal={row.original} />,
    enableSorting: false,
  }),
]
