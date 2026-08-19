import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import type { Column } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLButtonElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="font-medium">{title}</span>
  }

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={`inline-flex items-center gap-1 text-left font-medium hover:text-foreground transition-colors ${className || ""}`}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" />
      )}
    </button>
  )
}
