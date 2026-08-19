import { Event, EventID } from './event.model';
import { listEvents } from './event.service';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useApi } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast.ts';
import { useOrganisation } from '@/modules/organisations';
import { useAuth } from '@/hooks/use-auth';
import { PaginationState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination-contants.tsx';

interface FestivalContextValue {
  events: Event[]
  totalCount: number
  selectedEventId: EventID | undefined
  selectedEvent: Event | undefined
  sidebarOpen: boolean
  setSelectedEventId: (id: EventID) => void
  setSidebarOpen: (open: boolean) => void
}

const EventContext = createContext<FestivalContextValue | undefined>(undefined)

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [pagination] = useState<PaginationState>({ pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 })
  const [selectedEventId, setSelectedEventId] = useState<EventID | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { activeEventId } = useOrganisation()
  const { toast } = useToast()
  const api = useApi()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const selectedEvent = events.find((e) => e.id === selectedEventId)

  const fetchEvents = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;
    try {
      const result = await listEvents(api, {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize
      })
      setEvents(result.items)
      setRowCount(result.total)
      setSelectedEventId(activeEventId ?? findMostRecentEventId(result.items))
    } catch (err) {
      console.error("Failed to fetch events", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des événements.",
        variant: "destructive",
      })
    }
  }, [api, pagination, isAuthenticated, authLoading, toast, activeEventId])

  // Load events when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated, authLoading, fetchEvents])

  return (
    <EventContext.Provider
      value={{
        events,
        totalCount: rowCount,
        selectedEventId,
        selectedEvent,
        sidebarOpen,
        setSelectedEventId,
        setSidebarOpen,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvent() {
  const ctx = useContext(EventContext)
  if (!ctx) throw new Error("useEvent must be used within eventProvider")
  return ctx
}

function findMostRecentEventId(events: Event[]): EventID | undefined {
  if (events.length === 0) return undefined
  const sorted = [...events].sort((a, b) => b.startAt.getTime() - a.startAt.getTime())
  return sorted[0].id
}
