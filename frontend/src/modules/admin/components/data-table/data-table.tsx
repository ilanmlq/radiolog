import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type Table as TanStackTable,
  type PaginationState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
  renderToolbarActions?: (table: TanStackTable<TData>) => React.ReactNode
  pagination: PaginationState
  sorting: SortingState
  globalFilter?: string
  rowCount: number
  isLoading?: boolean
  onPageChange: (pagination: PaginationState) => void
  onSortingChange: (sorting: SortingState | ((old: SortingState) => SortingState)) => void
  onGlobalFilterChange?: (value: string) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Rechercher...",
  onRowClick,
  renderToolbarActions,
  pagination,
  sorting,
  globalFilter,
  rowCount,
  isLoading = false,
  onPageChange,
  onSortingChange,
  onGlobalFilterChange,
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(rowCount / pagination.pageSize),
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      onPageChange(newPagination)
    },
    onGlobalFilterChange: (value: string) => {
      onGlobalFilterChange?.(value)
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    manualFiltering: true,
    rowCount,
  })

  return (
    <div className="rounded-lg border border-border bg-card">
      {globalFilter && onGlobalFilterChange ? (
        <DataTableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={onGlobalFilterChange}
          searchPlaceholder={searchPlaceholder}
          renderActions={renderToolbarActions}
        />
      ) : null}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={
                    index === 0 ? "pl-4" :
                      header.id === "actions" ? "w-12 pr-4" : ""
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Chargement...
                </p>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Aucun résultat
                </p>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={
                      index === 0 ? "pl-4" :
                        cell.column.id === "actions" ? "pr-4" : ""
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataTablePagination table={table} />
    </div>
  )
}


