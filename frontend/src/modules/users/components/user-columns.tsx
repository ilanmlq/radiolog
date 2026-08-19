import { ShieldCheck } from "lucide-react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/modules/admin/components/data-table"
import { UserSummary } from "@/modules/users"

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "Jamais"

  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const columnHelper = createColumnHelper<UserSummary>()

export const userColumns: ColumnDef<UserSummary, any>[] = [
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
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Adresse e-mail" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId) as string
      return value.toLowerCase().includes(filterValue.toLowerCase())
    },
    enableSorting: true,
  }),
  columnHelper.accessor("isAdmin", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Admin" />
    ),
    cell: (info) =>
      info.getValue() ? (
        <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/5 text-primary">
          <ShieldCheck className="size-3" />
          Admin
        </Badge>
      ) : null,
    enableSorting: true,
  }),
  columnHelper.accessor("lastLoginAt", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dernière connexion" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground">{formatDate(info.getValue())}</span>
    ),
    enableSorting: true,
  }),
]
