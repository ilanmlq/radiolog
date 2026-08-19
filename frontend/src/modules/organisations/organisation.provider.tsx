import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { Organisation } from "./organisation.model"
import { getOrganisation } from "./organisation.service"
import { EventID } from "@/modules/events"
import { useApi } from "@/hooks/use-api"
import { useAuth } from "@/hooks/use-auth"

interface OrganisationContextValue {
  organisation: Organisation | null
  organisationName: string | null
  activeEventId: EventID | null
  refreshOrganisation: () => Promise<void>
}

const OrganisationContext = createContext<OrganisationContextValue | undefined>(undefined)

export function OrganisationProvider({
  initialOrganisation,
  children
}: {
  initialOrganisation?: Organisation
  children: ReactNode
}) {
  const [organisation, setOrganisation] = useState<Organisation | null>(initialOrganisation ?? null)

  const api = useApi()
  const { isAuthenticated, isLoading } = useAuth()

  const refreshOrganisation = useCallback(async () => {
    try {
      const org = await getOrganisation(api)
      setOrganisation(org)
    } catch (error) {
      console.error("Failed to load organisation:", error)
    }
  }, [])

  // Load organisation when authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      refreshOrganisation()
    }
  }, [isAuthenticated, isLoading, refreshOrganisation])

  return (
    <OrganisationContext.Provider
      value={{
        organisation,
        organisationName: organisation?.name ?? null,
        activeEventId: organisation?.activeEventId ?? null,
        refreshOrganisation,
      }}
    >
      {children}
    </OrganisationContext.Provider>
  )
}

export function useOrganisation() {
  const ctx = useContext(OrganisationContext)
  if (!ctx) throw new Error("useOrganisation must be used within OrganisationProvider")
  return ctx
}
