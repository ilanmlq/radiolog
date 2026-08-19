import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
  searchPlaceholder?: string
  renderActions?: (table: Table<TData>) => React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder = "Rechercher...",
  renderActions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      {renderActions?.(table)}
    </div>
  )
}
