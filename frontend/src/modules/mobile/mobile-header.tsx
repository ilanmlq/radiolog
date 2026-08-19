import { Zap } from "lucide-react"
import { useOrganisation } from "@/modules/organisations"
import { useEvent } from "@/modules/events"

export function MobileHeader() {
  const { organisationName, activeEventId } = useOrganisation()
  const { events } = useEvent()

  const activeEvent = events.find((e) => e.id === activeEventId)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="size-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-semibold leading-tight text-foreground">
            {organisationName}
          </h1>
          <p className="text-[11px] font-medium leading-tight text-muted-foreground">
            {activeEvent?.name ?? "Aucun événement actif"}
          </p>
        </div>
      </div>
    </header>
  )
}
