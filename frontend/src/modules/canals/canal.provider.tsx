import { CanalID, CanalSummary, CreateCanalDTO, UpdateCanalDTO } from './canal.model';
import { listCanals, deleteCanal, createCanal, updateCanal } from './canal.service';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination-contants';

const INITIAL_SORT_BY = 'number';

interface CanalContextValue {
  canals: CanalSummary[]
  rowCount: number
  pagination: PaginationState
  sorting: SortingState
  globalFilter: string
  isLoading: boolean
  setPagination: (pagination: PaginationState) => void
  setSorting: (sorting: SortingState) => void
  setGlobalFilter: (filter: string) => void
  addCanal: (data: CreateCanalDTO) => Promise<void>
  updateCanal: (id: CanalID, data: UpdateCanalDTO) => Promise<void>
  deleteCanal: (id: CanalID) => Promise<void>
}

const CanalContext = createContext<CanalContextValue | undefined>(undefined)

export function CanalProvider({ children }: { children: ReactNode }) {
  const [canals, setCanals] = useState<CanalSummary[]>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [pagination, setPagination] = useState<PaginationState>({ pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 })
  const [sorting, setSorting] = useState<SortingState>([{ id: INITIAL_SORT_BY, desc: false }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const api = useApi()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchCanals = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    setIsLoading(true)
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : INITIAL_SORT_BY
      const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

      const result = await listCanals(api, {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query: globalFilter,
        sortBy,
        sortOrder,
      })

      setCanals(result.items)
      setRowCount(result.total)
    } catch (error) {
      console.error("Failed to load canals:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des canaux.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [api, toast, isAuthenticated, authLoading, pagination, sorting, globalFilter])

  const handleSetPagination = useCallback((newPagination: PaginationState) => {
    setPagination(newPagination)
  }, [setPagination])

  const handleSetSorting = useCallback((newSorting: SortingState) => {
    setSorting(newSorting)
    setPagination({...pagination, pageIndex: 0 })
  }, [setSorting, pagination])

  const handleSetGlobalFilter = useCallback((filter: string) => {
    setGlobalFilter(filter)
    setPagination({...pagination, pageIndex: 0 })
  }, [setGlobalFilter, pagination])

  const handleAddCanal = useCallback(async (data: CreateCanalDTO) => {
    try {
      await createCanal(api, data)
      await fetchCanals()
      toast({
        title: "Canal créé",
        description: "Le canal a été créé avec succès.",
      })
    } catch (error) {
      console.error("Failed to create canal:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du canal.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchCanals, toast])

  const handleUpdateCanal = useCallback(async (id: CanalID, data: UpdateCanalDTO) => {
    try {
      await updateCanal(api, id, data)
      await fetchCanals()
      toast({
        title: "Canal modifié",
        description: "Le canal a été modifié avec succès.",
      })
    } catch (error) {
      console.error("Failed to update canal:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du canal.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchCanals, toast])

  const handleDeleteCanal = useCallback(async (id: CanalID) => {
    try {
      await deleteCanal(api, id)
      await fetchCanals()
      toast({
        title: "Canal supprimé",
        description: "Le canal a été supprimé avec succès.",
      })
    } catch (error) {
      console.error("Failed to delete canal:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du canal.",
        variant: "destructive",
      })
      throw error
    }
  }, [api, fetchCanals, toast])

  // Load canals when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCanals()
    }
  }, [isAuthenticated, authLoading, fetchCanals])

  return (
    <CanalContext.Provider
      value={{
        canals,
        rowCount,
        pagination,
        sorting,
        globalFilter,
        isLoading,
        setPagination: handleSetPagination,
        setSorting: handleSetSorting,
        setGlobalFilter: handleSetGlobalFilter,
        addCanal: handleAddCanal,
        updateCanal: handleUpdateCanal,
        deleteCanal: handleDeleteCanal,
      }}
    >
      {children}
    </CanalContext.Provider>
  )
}

export function useCanal() {
  const ctx = useContext(CanalContext)
  if (!ctx) throw new Error("useCanal must be used within CanalProvider")
  return ctx
}
