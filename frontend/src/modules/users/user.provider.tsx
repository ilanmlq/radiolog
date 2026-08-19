import { UserSummary } from './user.model';
import { listUsers } from './user.service';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast.ts';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination-contants';

const INITIAL_SORT_BY = 'name';

interface UserContextValue {
  users: UserSummary[]
  rowCount: number
  pagination: PaginationState
  sorting: SortingState
  globalFilter: string
  isLoading: boolean
  setPagination: (pagination: PaginationState) => void
  setSorting: (sorting: SortingState) => void
  setGlobalFilter: (filter: string) => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserSummary[]>([])
  const [rowCount, setRowCount] = useState<number>(0)
  const [pagination, setPagination] = useState<PaginationState>({ pageSize: DEFAULT_PAGE_SIZE, pageIndex: 0 })
  const [sorting, setSorting] = useState<SortingState>([{ id: INITIAL_SORT_BY, desc: false }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const api = useApi()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || authLoading) return;

    setIsLoading(true)
    try {
      const sortBy = sorting.length > 0 ? sorting[0].id : INITIAL_SORT_BY
      const sortOrder = sorting.length > 0 && sorting[0].desc ? 'desc' : 'asc'

      const result = await listUsers(api, {
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query: globalFilter,
        sortBy,
        sortOrder,
      })

      setUsers(result.items)
      setRowCount(result.total)
    } catch (err) {
      console.error("Failed to fetch users", err)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des utilisateurs.",
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

  // Load users when authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated, authLoading, fetchUsers])

  return (
    <UserContext.Provider
      value={{
        users,
        rowCount,
        pagination,
        sorting,
        globalFilter,
        isLoading,
        setPagination: handleSetPagination,
        setSorting: handleSetSorting,
        setGlobalFilter: handleSetGlobalFilter,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
