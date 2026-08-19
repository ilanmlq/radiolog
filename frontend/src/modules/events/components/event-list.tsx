import { useEvent } from "../event.provider";
import { useOrganisation } from "@/modules/organisations";
import { EventCard } from "./event-card";
import { Zap } from 'lucide-react';
import { ModuleHeader } from '@/modules/admin/components/module-header';

export function EventList() {
  const { activeEventId } = useOrganisation()
  const { events, selectedEventId, setSelectedEventId } = useEvent()

  const activeEvents = events.filter((e) => e.status !== "completed")
  const completedEvents = events.filter((e) => e.status === "completed")

  return (
    <div className="flex flex-col gap-8">
      <ModuleHeader title="Événements" description="Gérez les événements de votre organisation.">
        <Zap className="size-5"/>
      </ModuleHeader>

      {/* Active / Upcoming events */}
      {activeEvents.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {"À venir"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isActive={event.id === activeEventId}
                isSelected={event.id === selectedEventId}
                onSelect={() => setSelectedEventId(event.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed events */}
      {completedEvents.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Terminés
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {completedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isActive={event.id === activeEventId}
                isSelected={event.id === selectedEventId}
                onSelect={() => setSelectedEventId(event.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}