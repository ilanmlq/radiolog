import { DataTable } from "./data-table/data-table"

interface ModuleTableProps{
  title: string
}

export default function ModuleTable({
  title,
}: ModuleTableProps) {
  return (
    <DataTable
      columns={[]}
      data={[]}
      searchPlaceholder={`Rechercher dans ${title.toLowerCase()}...`}
      onRowClick={undefined}
      renderToolbarActions={undefined}
      pagination={{ pageIndex: 0, pageSize: 10 }}
      sorting={[]}
      globalFilter=""
      rowCount={0}
      isLoading={false}
      onPageChange={console.log}
      onSortingChange={console.log}
      onGlobalFilterChange={console.log}
    />
  )
}