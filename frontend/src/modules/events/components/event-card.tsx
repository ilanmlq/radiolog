import { Event } from '../event.model';
import { getStatusConfig } from '../helpers/event-status';
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function EventCard({ event, isActive, isSelected, onSelect }: {
  event: Event
  isActive?: boolean
  isSelected?: boolean
  onSelect?: () => void
}) {
  const status = getStatusConfig(event.status)
  const StatusIcon = status.icon

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border bg-card text-left transition-all",
        isSelected
          ? "border-primary ring-1 ring-primary/20"
          : "border-border hover:border-primary/30 hover:shadow-sm"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-base font-semibold leading-none text-foreground">
                {event.name}
              </h3>
              {event.description && (
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>
                  {format(event.startAt, "d MMM yyyy", { locale: fr })} –{" "}
                  {format(event.endAt, "d MMM yyyy", { locale: fr })}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Active indicator */}
          {isActive && (
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
              <span className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
              Actif
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="mt-3">
          <Badge
            variant="outline"
            className={cn("gap-1", status.className)}
          >
            <StatusIcon className={cn("size-3", event.status === "active" && "animate-spin")} />
            {status.label}
          </Badge>
        </div>
      </div>
    </button>
  )
}