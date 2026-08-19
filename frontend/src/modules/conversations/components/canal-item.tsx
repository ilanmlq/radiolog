import { CanalSummary } from "@/modules/canals/canal.model"

interface CanalItemProps {
  canal: CanalSummary
  isSelected: boolean
  onClick: (canal: CanalSummary) => void
}

export function CanalItem({ canal, isSelected, onClick }: CanalItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(canal)}
      className={`flex w-full items-center gap-4 border-b border-border p-4 text-left transition-colors ${isSelected ? "bg-card" : "hover:bg-accent"
        }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isSelected ? "bg-primary" : "bg-muted"
          }`}
      >
        <span
          className={`text-xl font-bold ${isSelected ? "text-primary-foreground" : "text-foreground"
            }`}
        >
          {canal.number}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-bold text-foreground">{canal.name}</span>
        <p className="truncate text-sm text-muted-foreground">
          {canal.description || "Aucune description"}
        </p>
      </div>
    </button>
  )
}
