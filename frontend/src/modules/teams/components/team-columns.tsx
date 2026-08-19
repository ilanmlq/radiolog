import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { Team } from "../team.model"
import { DataTableColumnHeader } from "@/modules/admin/components/data-table"
import { UpdateTeamDialog } from "./update-team-dialog"
import { MemberSummary } from "@/modules/members";

const columnHelper = createColumnHelper<Team>()

export const getTeamColumns = (
  teams: Team[],
  membres: MemberSummary[],
  fetchData: () => void
): ColumnDef<Team, any>[] => [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    enableSorting: true,
  }),
    columnHelper.accessor("teamLeaders", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Responsables" />
      ),
      cell: (info) => (
        <span className="font-medium">
          {info.getValue()?.join(", ")}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("description", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
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
          <UpdateTeamDialog team={row.original}
            teams={teams}
            membres={membres}
            fetch={fetchData}
          />
        </div>
      ),
    }),
];