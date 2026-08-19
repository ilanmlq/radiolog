import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Table } from "@tanstack/react-table"
import { PAGE_SIZE_OPTIONS } from '@/lib/pagination-contants';

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [...PAGE_SIZE_OPTIONS],
}: DataTablePaginationProps<TData>) {
  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize
  const firstElementPos = currentPage * pageSize + 1;
  const lastElementPos = currentPage * pageSize + table.getFilteredRowModel().rows.length;
  const totalElementCount = table.getRowCount();

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Lignes par page
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger size="sm" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length === 0
            ? "Aucun resultat"
            : `${firstElementPos}–${lastElementPos} sur ${totalElementCount}`}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          aria-label="Page precedente"
        >
          <ChevronLeft className="size-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(i)}
            aria-label={`Page ${i + 1}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          aria-label="Page suivante"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
