import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/modules/admin/components/data-table"
import { MemberSummary } from "@/modules/members"
import { UpdateMemberDialog } from "./edit-member-dialog"

const columnHelper = createColumnHelper<MemberSummary>()

export const memberColumns: ColumnDef<MemberSummary, any>[] = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground">
        {info.getValue()[0]}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("phone", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Numéro de téléphone" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground">
        {info.getValue()[0]}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("roleTitles", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: (info) => (
      <span className="text-muted-foreground">
        {info.getValue()[0]}
      </span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("teamName", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipe" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.display({
    id: "actions",
    header: "Modifier",
    cell: ({ row }) => (
      <div
        className="flex justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <UpdateMemberDialog member={row.original} />
      </div>
    ),
  }),
]
